import {observable, action, runInAction, computed, autorun} from "mobx"
import {RootStore} from "Root.store"
import {Node, Token, Source, Status} from "model"
import {NativeModules, Platform, Alert, Linking} from "react-native"

export enum SortingKey {
  date = `Date`,
  status = `Status`,
  name = `Name`,
}

export class NodeStore {
  private root: RootStore
  @observable public nodes: Node[] = []
  @observable public tokens: Token[] = []
  @observable public sortingKey: SortingKey = SortingKey.status
  @observable public fetching = false
  @observable public regexesToIgnore: string[] = []

  @observable public githubRepos: string[] = [``]
  @observable
  public githubKey: string = ``

  @observable public notificationsEnabled = false

  @observable public startAtLogin = false
  @observable public fetchInterval = global.isMacOS ? 1 : 15

  private intervalHandle: any

  constructor(root: RootStore) {
    this.root = root

    this.hydrate().then(() => {
      autorun(this.persist)

      if (global.isMacOS) {
        autorun(this.applyAutoLauncher)
        autorun(this.startTimer)
      } else {
        // this.startBackgroundTask()
      }

      this.fetchNodes()
    })
  }

  private startTimer = () => {
    if (this.intervalHandle) {
      clearInterval(this.intervalHandle)
    }

    this.intervalHandle = setInterval(() => {
      this.fetchNodes()
    }, this.fetchInterval * 60000)
  }

  private persist = async () => {
    await NativeModules.TempomatNative?.securelyStore(
      `tempomatState`,
      JSON.stringify({
        tokens: this.tokens,
        githubRepos: this.githubRepos,
        regexesToIgnore: this.regexesToIgnore,
        sortingKey: this.sortingKey,
        githubKey: this.githubKey,
        notificationsEnabled: this.notificationsEnabled,
        startAtLogin: this.startAtLogin,
        interval: this.fetchInterval,
      }),
    )
  }

  private hydrate = async () => {
    // Fetches the app state from the native keychain, is stored encrypted
    // but once in memory you can just access it normally
    let retrievedJSON = await NativeModules.TempomatNative?.securelyRetrieve(
      `tempomatState`,
    )

    if (retrievedJSON) {
      let store = JSON.parse(retrievedJSON)
      runInAction(() => {
        this.tokens = store.tokens
        this.sortingKey = store.sortingKey
        this.regexesToIgnore = store.regexesToIgnore
        this.githubRepos = store.githubRepos
        this.githubKey = store.githubKey
        this.notificationsEnabled = store.notificationsEnabled
        this.startAtLogin = store.startAtLogin
        this.fetchInterval = store.fetchInterval || 1
      })
    }
  }

  private applyAutoLauncher = () => {
    NativeModules.TempomatNative.applyAutoLauncher(this.startAtLogin)
  }

  @computed get sortedFilteredNodes() {
    let regexes = this.regexesToIgnore.map((str) => RegExp(str))
    return this.nodes
      .slice()
      .sort((n1, n2) => {
        switch (this.sortingKey) {
          case SortingKey.date:
            if (!n1.date) {
              return 1
            }

            if (!n2.date) {
              return -1
            }

            return n1.date < n2.date ? 1 : -1

          case SortingKey.name:
            return n1.label < n2.label ? -1 : 1

          case SortingKey.status:
            if (n1.status === Status.running) {
              return -1
            }
            if (n2.status === Status.running) {
              return 1
            }

            if (n1.status === Status.failed) {
              return -1
            }
            if (n2.status === Status.failed) {
              return 1
            }

            if (n1.status === Status.passed) {
              return -1
            }

            if (n2.status === Status.passed) {
              return 1
            }

            return 1

          default:
            return 1
        }
      })
      .filter((n) => {
        return !regexes.some((regex) => regex.test(n.label))
      })
  }

  @action
  public fetchNodes = async () => {
    let promises = this.tokens.map((t) => {
      switch (t.source) {
        case Source.circleci:
          return this.root.api.fetchCircleciNodes(t.key)

        case Source.appcenter:
          return this.root.api.fetchAppcenterNodes(t.key)

        case Source.travisci:
          return this.root.api.fetchTravisciNodes(t.key)

        case Source.bitrise:
          return this.root.api.fetchBitriseNodes(t.key)

        default:
          break
      }
    })

    if (this.githubKey !== ``) {
      promises = promises.concat(
        this.githubRepos
          .filter((v) => v !== ``)
          .map((slug) =>
            this.root.api.fetchGithubActionNodes(this.githubKey, slug),
          ),
      )
    }

    this.fetching = true
    let responses = await Promise.all(promises)

    let previousNodes = this.nodes.reduce((acc, node) => {
      acc[node.id] = node
      return acc
    }, {} as any)

    runInAction(() => {
      this.nodes = responses.filter((n) => n).flat()

      if (this.notificationsEnabled) {
        this.nodes.forEach((node) => {
          if (
            node.status === Status.failed &&
            (!previousNodes[node.id] ||
              previousNodes[node.id].status !== Status.failed)
          ) {
            this.sendNativeNotification(`${node.label} is broken`)
          }
        })
      }

      if (Platform.OS === `macos` && NativeModules.TempomatNative) {
        let failed = 0
        let running = 0
        let passed = 0
        for (let i = 0; i < this.nodes.length; i++) {
          let status = this.nodes[i].status
          switch (status) {
            case Status.passed:
              passed++
              break
            case Status.failed:
              failed++
              break
            case Status.running:
              running++
              break
            default:
              break
          }
        }
        NativeModules.TempomatNative.setStatusButtonText(
          failed,
          running,
          passed,
        )
      }

      this.fetching = false
    })
  }

  @action
  public addToken(source: Source, name: string, key: string) {
    let token = new Token()
    token.source = source
    token.name = name
    token.key = key

    this.tokens.push(token)
    this.fetchNodes()
  }

  @action
  public toggleSorting = () => {
    switch (this.sortingKey) {
      case SortingKey.date:
        this.sortingKey = SortingKey.status
        break
      case SortingKey.status:
        this.sortingKey = SortingKey.name
        break
      case SortingKey.name:
        this.sortingKey = SortingKey.date
        break
      default:
        throw new Error(`Invalid Sorting Key was inserted`)
    }
  }

  @action
  public removeTokenByName = (name: string) => {
    let idx = this.tokens.findIndex((t) => t.name === name)

    if (idx >= 0) {
      this.tokens.splice(idx, 1)
      this.fetchNodes()
    }
  }

  @action
  public addIgnoredRegex = (pattern: string) => {
    let isValid = true
    let exists = this.regexesToIgnore.find((t) => t === pattern)

    if (exists) {
      return false
    }
    try {
      // eslint-disable-next-line no-new
      new RegExp(pattern)
    } catch (e) {
      isValid = false
    }

    if (!isValid) {
      return false
    }

    this.regexesToIgnore.push(pattern)
    return true
  }

  @action
  public removeIgnoredRegex = (pattern: string) => {
    let idx = this.regexesToIgnore.findIndex((t) => t === pattern)

    if (idx >= 0) {
      let newRegexes = this.regexesToIgnore.slice()
      newRegexes.splice(idx, 1)
      this.regexesToIgnore = newRegexes
    }
  }

  @action
  public addEmptyGithubRepo = () => {
    this.githubRepos.push(``)
  }

  @action
  public deleteGithubRepo = (ii: number) => {
    let newRepos = this.githubRepos.slice()
    newRepos.splice(ii, 1)
    this.githubRepos = newRepos
  }

  @action
  public setGithubKey = (str: string) => {
    this.githubKey = str
  }

  public sendNativeNotification = (str: string) => {
    NativeModules.TempomatNative.sendNotification(str)
  }

  @action
  public setNotificationsEnabled = (notificationsEnabled: boolean) => {
    if (global.isMacOS) {
      this.notificationsEnabled = notificationsEnabled
    } else {
      Alert.alert(
        `Hold on!`,
        `Push notifications will be available on mobile devices in the near future, if you want to be notified when the feature is available, just send us an E-Mail`,
        [
          {
            text: `Close`,
            onPress: () => null,
          },
          {
            text: `I want notifications!`,
            onPress: () =>
              Linking.openURL(
                `mailto:ospfranco@protonmail.com?subject=Tempomat%Push%20Notifications%20Request`,
              ),
          },
        ],
      )
    }
  }

  @action
  public setStartAtLogin = (startAtLogin: boolean) => {
    this.startAtLogin = startAtLogin
  }

  public closeApp = () => {
    NativeModules.TempomatNative?.closeApp()
  }

  @action
  public setFetchInterval = (interval: number) => {
    if (interval < 1) {
      return
    }

    this.fetchInterval = interval
  }

  @action setGithubRepoAtIndex = (t: string, ii: number) => {
    this.githubRepos[ii] = t
  }
}
