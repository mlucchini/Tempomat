import React from "react"
import {
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  View,
  Linking,
} from "react-native"
import {observer} from "mobx-react"
import {useStore} from "Root.store"
import {Row, TempoButton} from "component"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"

let placeHolderStyle: any = {
  dynamic: {
    dark: global.colors.gray200,
    light: global.colors.gray500,
  },
}

function openGithubGuide() {
  Linking.openURL(`
  https://tempomat.dev/githubTokenGuide/`)
}

export const GithubActionsConfigContainer = observer(() => {
  let {nodeStore} = useStore()
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}>
      <Text
        style={{
          padding: global.metrics.pl,
        }}>
        GITHUB PERSONAL KEY
      </Text>
      <View style={styles.row}>
        <TextInput
          placeholder="Your Github Personal Key goes here"
          style={styles.repositoryField}
          value={nodeStore.githubKey}
          onChangeText={nodeStore.setGithubKey}
          placeholderTextColor={placeHolderStyle}
        />
      </View>

      <Text
        style={{
          padding: global.metrics.pl,
        }}>
        SUBSCRIBED REPOSITORIES
      </Text>

      {nodeStore.githubRepos.map((r, ii) => {
        return (
          <Row key={`github-repo-${ii}`} style={styles.row}>
            <TextInput
              placeholder={`Enter repository slug ${ii + 1}...`}
              style={styles.repositoryField}
              placeholderTextColor={placeHolderStyle}
              value={r}
              onChangeText={(t) => nodeStore.setGithubRepoAtIndex(t, ii)}
            />
            {ii !== 0 && (
              <TouchableOpacity onPress={() => nodeStore.deleteGithubRepo(ii)}>
                <Icon name="delete" color={`red`} size={20} />
              </TouchableOpacity>
            )}
          </Row>
        )
      })}

      <TempoButton
        primary
        title="Add Repository"
        onPress={nodeStore.addEmptyGithubRepo}
      />
      <Text
        style={{
          padding: global.metrics.pl,
        }}>
        Due to API limitations you have to specify github repositories
        individually, enter each line with the format: [username]/[repo_name]
      </Text>
      <View style={{alignItems: `center`}}>
        <TempoButton
          title="How do I create a Github Personal Token"
          onPress={openGithubGuide}
        />
      </View>
    </ScrollView>
  )
})

// @ts-ignore
GithubActionsConfigContainer.navigationOptions = () => ({
  title: `Github Actions`,
})

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // @ts-ignore
    backgroundColor: {
      dynamic: {
        light: global.colors.gray010,
        dark: global.colors.gray800,
      },
    },
  },
  contentContainer: {},
  listContainer: {
    flex: 1,
    // @ts-ignore
    backgroundColor: {
      dynamic: {
        light: global.colors.gray010,
        dark: global.colors.gray900,
      },
    },
  },
  row: {
    padding: global.metrics.pl,
    //@ts-ignore
    backgroundColor: {
      dynamic: {
        light: `white`,
        dark: `#1E1E1E`,
      },
    },
  },
  repositoryField: {
    width: `90%`,
    height: 20,
    borderWidth: 0,
    padding: 0,
    // @ts-ignore
    color: {
      dynamic: {
        light: `black`,
        dark: `white`,
      },
    },
  },
})
