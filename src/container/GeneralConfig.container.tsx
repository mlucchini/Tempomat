import React from "react"
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  Switch,
  StyleSheet,
  Linking,
} from "react-native"
import {observer} from "mobx-react"
import {useStore} from "Root.store"
import {Row, Spacer, Divider, TempoButton} from "component"
import {Images} from "Assets"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"
import FoIcon from "react-native-vector-icons/FontAwesome"
import {NavigationScreenProps} from "react-navigation"

interface IProps extends NavigationScreenProps {}

export const GeneralConfigContainer = observer(({navigation}: IProps) => {
  let {nodeStore} = useStore()
  let {tokens} = nodeStore

  function openAppStore() {
    switch (global.os) {
      case `macos`:
        Linking.openURL(
          `https://apps.apple.com/de/app/tempomat-ci-status-monitor/id1509296762?l=en&mt=12`,
        )
        break
      case `ios`:
        Linking.openURL(``)
        break
      case `android`:
        Linking.openURL(``)
        break
      default:
        break
    }
  }

  function openMail() {
    Linking.openURL(
      `mailto:ospfranco@protonmail.com?subject=Tempomat%20Support%20Request`,
    )
  }

  function openGithub() {
    Linking.openURL(`https://github.com/ospfranco/tempomat`)
  }

  return (
    <ScrollView style={styles.container}>
      <Row vertical="center">
        <Text
          style={{
            padding: global.metrics.pl,
          }}>
          TOKENS
        </Text>
        <Spacer />
        <TempoButton
          onPress={() => navigation.navigate(`AddToken`)}
          title="Add token"
        />
      </Row>

      {!tokens.length && (
        <View style={styles.noTokensView}>
          <Text style={{color: global.colors.gray400}}>
            No tokens have been saved
          </Text>
        </View>
      )}

      <View style={styles.row}>
        {tokens.map((t, idx) => {
          return (
            <View key={`token-${idx}`}>
              <Row style={{padding: global.metrics.pl}}>
                <Image
                  source={Images[`${t.source.toLowerCase()}_pending`]}
                  style={{
                    height: global.metrics.imgSmall,
                    width: global.metrics.imgSmall,
                    resizeMode: `contain`,
                    marginRight: global.metrics.pm,
                  }}
                />
                <Text>{t.name}</Text>
                <Spacer />
                <TouchableOpacity
                  onPress={() => nodeStore.removeTokenByName(t.name)}>
                  <Icon name="delete" color={`red`} size={20} />
                </TouchableOpacity>
              </Row>
              {idx !== tokens.length - 1 && (
                <Divider width="95%" alignSelf="flex-end" />
              )}
            </View>
          )
        })}
      </View>
      {/* General config */}
      <Text
        style={{
          padding: global.metrics.pl,
          marginTop: global.metrics.pl,
        }}>
        GENERAL
      </Text>

      {global.isMacOS && (
        <TouchableOpacity
          onPress={() => navigation.navigate(`PollingIntervalConfig`)}>
          <View style={styles.row}>
            <Row
              style={{
                padding: global.metrics.pl,
              }}
              vertical="center">
              <Text>Polling Interval (minutes)</Text>
              <Spacer />
              <Text style={{paddingRight: global.metrics.pl}}>
                {nodeStore.fetchInterval}
              </Text>
              <FoIcon
                name="chevron-right"
                size={14}
                color={global.colors.gray200}
              />
            </Row>
            <Divider width="95%" alignSelf="flex-end" />
          </View>
        </TouchableOpacity>
      )}

      <View style={styles.row}>
        <Row
          style={{
            padding: global.metrics.pl,
          }}
          vertical="center">
          <Text>Notifications on broken builds</Text>
          <Spacer />
          <Switch
            value={nodeStore.notificationsEnabled}
            onValueChange={nodeStore.setNotificationsEnabled}
          />
        </Row>
        {global.isMacOS && <Divider width="95%" alignSelf="flex-end" />}
      </View>

      {global.isMacOS && (
        <View style={styles.row}>
          <Row
            style={{
              padding: global.metrics.pl,
            }}
            vertical="center">
            <Text>Launch on login</Text>
            <Spacer />
            <Switch
              value={nodeStore.startAtLogin}
              onValueChange={nodeStore.setStartAtLogin}
            />
          </Row>
        </View>
      )}

      <View style={styles.buttonContainer}>
        {/* <Image source={Images.tempomat} /> */}

        {global.isMacOS && (
          <TempoButton title="Review on App Store" onPress={openAppStore} />
        )}
        <TempoButton title="Support" onPress={openMail} />
        <TempoButton title="Source Code" onPress={openGithub} />
        {global.isMacOS && (
          <TempoButton title="Quit" onPress={nodeStore.closeApp} />
        )}

        <Text style={{fontSize: global.metrics.tl}}>Tempomat</Text>
        <Text>Oscar Franco, 2020</Text>
        {/* <TempoButton
          title="Test notification"
          onPress={() => nodeStore.sendNativeNotification(`Test notification`)}
        /> */}
      </View>
    </ScrollView>
  )
})

// @ts-ignore
GeneralConfigContainer.navigationOptions = () => ({
  title: `General`,
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
  row: {
    // @ts-ignore
    backgroundColor: {
      dynamic: {
        light: `white`,
        dark: global.colors.gray900,
      },
    },
  },
  noTokensView: {
    backgroundColor: `white`,
    padding: global.metrics.pl,
    alignItems: `center`,
  },
  buttonContainer: {alignItems: `center`, paddingVertical: 40},
})
