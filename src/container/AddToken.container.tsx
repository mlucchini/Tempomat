import React, {useState, useRef} from "react"
import {
  View,
  Text,
  Switch,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native"
import {NavigationScreenProps} from "react-navigation"
import {Row, Spacer, Divider, TempoButton} from "component"
import {Source} from "model"
import {observer} from "mobx-react"
import {useStore} from "Root.store"

interface IProps extends NavigationScreenProps {}

let placeHolderStyle: any = {
  dynamic: {
    dark: global.colors.gray200,
    light: global.colors.gray500,
  },
}

export const AddTokenContainer = observer(({navigation}: IProps) => {
  let {nodeStore} = useStore()
  let [source, setSource] = useState(Source.circleci)
  let [name, setName] = useState(``)
  let [key, setKey] = useState(``)
  let secondField = useRef<TextInput>()

  function addToken() {
    nodeStore.addToken(source, name, key)
    navigation.goBack()
  }

  let sources = Object.entries(Source)

  return (
    <ScrollView style={styles.container}>
      <Text
        style={{
          padding: global.metrics.pl,
        }}>
        SOURCE
      </Text>

      {sources
        .filter(([_, l]) => l !== Source.github)
        .map(([value, label], ii) => {
          return (
            <TouchableOpacity key={value} onPress={() => setSource(label)}>
              <View style={styles.row}>
                <Row
                  style={{
                    padding: global.metrics.pl,
                  }}
                  vertical="center">
                  <Text>{label}</Text>
                  <Spacer />
                  <Switch
                    value={label === source}
                    onValueChange={() => setSource(label)}
                  />
                </Row>
                {ii !== sources.length - 2 && (
                  <Divider width="90%" alignSelf="flex-end" />
                )}
              </View>
            </TouchableOpacity>
          )
        })}

      <Text
        style={{
          padding: global.metrics.pl,
        }}>
        NAME
      </Text>
      <View style={styles.row}>
        <TextInput
          style={styles.inputField}
          placeholder="Token name goes here..."
          //@ts-ignore
          placeholderTextColor={{
            dynamic: {
              dark: global.colors.gray200,
              light: global.colors.gray500,
            },
          }}
          value={name}
          onChangeText={setName}
          returnKeyType="next"
          onSubmitEditing={() => secondField.current?.focus()}
          blurOnSubmit={false}
        />
      </View>

      <Text
        style={{
          padding: global.metrics.pl,
        }}>
        API KEY
      </Text>

      <View style={styles.row}>
        <TextInput
          placeholderTextColor={placeHolderStyle}
          style={styles.inputField}
          placeholder="Api key goes here..."
          value={key}
          onChangeText={setKey}
          // @ts-ignore
          ref={secondField}
          returnKeyType="done"
          onSubmitEditing={addToken}
        />
      </View>

      <TempoButton title="Done" onPress={addToken} primary />
    </ScrollView>
  )
})

// @ts-ignore
AddTokenContainer.navigationOptions = {
  title: `Add Token`,
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //@ts-ignore
    backgroundColor: {
      dynamic: {
        light: global.colors.gray010,
        dark: global.colors.gray800,
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
  inputField: {
    // @ts-ignore
    color: {
      dynamic: {
        dark: global.colors.gray200,
        light: global.colors.gray500,
      },
    },
    padding: global.metrics.pm,
  },
})
