import React, {useState} from "react"
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native"
import {Row, Spacer, TempoButton} from "component"
import {useStore} from "Root.store"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"
import {observer} from "mobx-react"

let placeHolderStyle: any = {
  dynamic: {
    dark: global.colors.gray200,
    light: global.colors.gray500,
  },
}

export const IgnoreConfigContainer = observer(() => {
  let {nodeStore} = useStore()
  let [regex, setRegex] = useState(``)
  let [error, setError] = useState(false)

  function addRegex() {
    let inserted = nodeStore.addIgnoredRegex(regex)
    if (!inserted) {
      setError(true)
    } else {
      setRegex(``)
    }
  }
  return (
    <View style={styles.container}>
      {/* General config */}
      <Text
        style={{
          padding: global.metrics.pl,
        }}>
        IGNORED PATTERNS
      </Text>

      <FlatList
        data={nodeStore.regexesToIgnore}
        renderItem={(info) => (
          <View
            style={{
              backgroundColor: global.colors.gray050,
            }}>
            <Row
              style={{
                padding: global.metrics.pl,
              }}
              vertical="center">
              <Text>{info.item}</Text>
              <Spacer />
              <TouchableOpacity
                onPress={() => nodeStore.removeIgnoredRegex(info.item)}>
                <Icon name="delete" size={18} color="red" />
              </TouchableOpacity>
            </Row>
          </View>
        )}
        keyExtractor={(t) => t}
        ListEmptyComponent={
          <View style={{justifyContent: `center`, height: 200}}>
            <Text style={{alignSelf: `center`, color: global.colors.gray400}}>
              No ignored patterns
            </Text>
          </View>
        }
        contentContainerStyle={styles.listContainer}
        style={{flex: 1}}
      />

      <Text
        style={{
          padding: global.metrics.pl,
        }}>
        ADD NEW PATTERN
      </Text>
      <View style={styles.row}>
        <TextInput
          style={{padding: global.metrics.pm}}
          placeholder="Insert your regex here..."
          value={regex}
          onChangeText={setRegex}
          placeholderTextColor={placeHolderStyle}
        />
        {error && <Text style={{color: `red`}}>Not a valid regex</Text>}
      </View>

      <TempoButton title="Add Regex" onPress={addRegex} primary />
    </View>
  )
})

// @ts-ignore
IgnoreConfigContainer.navigationOptions = () => ({
  title: `Ignore`,
})

let styles = StyleSheet.create({
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
})
