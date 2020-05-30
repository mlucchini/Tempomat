import React from "react"
import * as mobx from "mobx"
import "Theme"
import {
  StatusBar,
  Platform,
  YellowBox,
  KeyboardAvoidingView,
  StyleSheet,
} from "react-native"
import {root, StoreProvider} from "Root.store"
import {Navigator} from "Route"
import {setCustomText, setCustomTextInput} from "react-native-global-props"
import "mobx-react-lite/batchingForReactNative"
import MaterialIcon from "react-native-vector-icons/MaterialCommunityIcons"

YellowBox.ignoreWarnings([
  `Warning: componentWillReceiveProps`,
  `Calling \`getNode`,
  `Module RNBackgroundFetch`,
])

let os = Platform.OS
global.os = os
global.isMacOS = os === `macos`

switch (os) {
  case `macos`: {
    let customTextProps = {
      style: {
        fontSize: 13,
        color: {
          dynamic: {
            light: `#3c3c3c`,
            dark: `white`,
          },
        },
      },
    }
    setCustomText(customTextProps)

    let customTextInputProps = {
      underlineColorAndroid: `rgba(0,0,0,0)`,
      style: {
        borderWidth: 1,
        borderColor: `gray`,
        paddingVertical: 5,
        paddingHorizontal: 10,
      },
    }
    setCustomTextInput(customTextInputProps)
    break
  }
  case `ios`:
    MaterialIcon.loadFont()
    break
}

mobx.configure({enforceActions: `observed`})

export function App() {
  return (
    <StoreProvider value={root}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={os === `ios` ? `padding` : `height`}
        keyboardVerticalOffset={20}>
        <StatusBar barStyle="dark-content" />
        <Navigator />
      </KeyboardAvoidingView>
    </StoreProvider>
  )
}

let styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})
