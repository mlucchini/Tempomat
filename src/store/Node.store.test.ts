import {NodeStore, SortingKey} from "./Node.store"
import {Source, Status, Node} from "model"

let ROOT_MOCK = {
  api: {
    fetchCircleciNodes: jest.fn(),
  },
}

describe(`NodeStore`, () => {
  let nodeStore: NodeStore
  beforeEach(() => {
    nodeStore = new NodeStore(ROOT_MOCK as any)
  })
  it(`can be instantiated`, () => {
    expect(nodeStore).not.toBeNull()
  })

  it(`can add token`, () => {
    // let persistCb = jest.fn()
    // set up spies?
    // @ts-ignore, property is set as private, for the sake of tests
    // we will just access it
    // nodeStore.persist = persistCb

    nodeStore.fetchNodes = jest.fn()

    let name = `CircleCISampleKey`
    let token = `123456789`
    nodeStore.addToken(Source.circleci, name, token)

    expect(nodeStore.tokens.length).toBe(1)
    expect(nodeStore.tokens[0].source).toEqual(Source.circleci)
    expect(nodeStore.tokens[0].name).toEqual(name)
    expect(nodeStore.tokens[0].key).toEqual(token)

    // After token has been added fetch nodes is called
    expect(nodeStore.fetchNodes).toHaveBeenCalled()
    // jest.runAllTimers()

    // expect(persistCb).toBeCalled()
  })

  it(`toggles sorting in the correct order`, () => {
    expect(nodeStore.sortingKey).toEqual(SortingKey.status)

    nodeStore.toggleSorting()

    expect(nodeStore.sortingKey).toEqual(SortingKey.name)

    nodeStore.toggleSorting()

    expect(nodeStore.sortingKey).toEqual(SortingKey.date)

    nodeStore.toggleSorting()

    expect(nodeStore.sortingKey).toEqual(SortingKey.status)
  })

  it(`can remove token by name`, () => {
    let name = `CircleCISampleKey`
    let token = `123456789`
    nodeStore.addToken(Source.circleci, name, token)

    expect(nodeStore.tokens.length).toBe(1)
    expect(nodeStore.tokens[0].source).toEqual(Source.circleci)
    expect(nodeStore.tokens[0].name).toEqual(name)
    expect(nodeStore.tokens[0].key).toEqual(token)

    nodeStore.removeTokenByName(name)

    expect(nodeStore.tokens.length).toBe(0)
  })

  it(`can add a ignore regex`, () => {
    // should pretty much ignore everything under the sun
    let testRegex = `.*[A-Za-z]`
    let regexAdded = nodeStore.addIgnoredRegex(testRegex)
    expect(regexAdded).toBeTruthy()
    expect(nodeStore.regexesToIgnore.length).toEqual(1)
    expect(nodeStore.regexesToIgnore[0]).toEqual(testRegex)
  })

  // TODO: add a test to actually see if nodes are being ignored
  // based on the added regex

  it(`can remove regex pattern`, () => {
    let testRegex = `.*[A-Za-z]`
    let regexAdded = nodeStore.addIgnoredRegex(testRegex)

    expect(regexAdded).toBeTruthy()
    expect(nodeStore.regexesToIgnore.length).toEqual(1)
    expect(nodeStore.regexesToIgnore[0]).toEqual(testRegex)

    nodeStore.removeIgnoredRegex(testRegex)

    expect(nodeStore.regexesToIgnore.length).toEqual(0)
  })

  it(`does not add a INVALID regex`, () => {
    let invalidRegex = `*`
    let regexAdded = nodeStore.addIgnoredRegex(invalidRegex)
    expect(regexAdded).toBeFalsy()
  })

  // it(`fetches nodes`, async () => {
  //   // single node instance to be returned by the api mock
  //   let node = new Node()
  //   node.id = `id_mock`
  //   node.url = `some_url`
  //   node.date = new Date().toISOString()
  //   node.source = Source.circleci
  //   node.label = `Some label`
  //   node.status = Status.passed
  //   node.key = `123`
  //   node.buildUrl = `https://something.com`

  //   // mocked response from api
  //   let nodes = [node]

  //   // // @ts-ignore
  //   // nodeStore.root.api.fetchCircleciNodes
  //   //   // @ts-ignore
  //   //   .mockReturnValueOnce(Promise.resolve(nodes))
  //   //   .mockReturnValueOnce(Promise.resolve(nodes))
  //   //   .mockReturnValueOnce(Promise.resolve(nodes))
  //   nodeStore.root.api.fetchCircleciNodes = jest.fn(() => {
  //     return Promise.resolve(nodes)
  //   })

  //   // first a token so it calls the api
  //   nodeStore.addToken(Source.circleci, `testToken`, `123`)
  //   jest.runAllTimers()

  //   //@ts-ignore
  //   expect(nodeStore.root.api.fetchCircleciNodes).toHaveBeenCalledWith(`123`)

  //   expect(nodeStore.nodes).toHaveLength(1)
  // })

  // it(`can fetch nodes`, async () => {
  //   let nodeStore = new NodeStore({} as any)
  //   let nodes = await nodeStore.fetchNodes()
  //   expect(nodes.length).toBe(-1)
  //   expect(1).toBe(2)
  // })
})
