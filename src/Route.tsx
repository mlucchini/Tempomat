import React from "react"
import {createStackNavigator, createBottomTabNavigator} from "react-navigation"
import {
  NodeListContainer,
  AddTokenContainer,
  IgnoreConfigContainer,
  GithubActionsConfigContainer,
  GeneralConfigContainer,
  IntervalSelectionContainer,
} from "container"
import {Image} from "react-native"
import {Images} from "Assets"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"
import {MacosHeaderComponent} from "component"

const ConfigurationStack = createBottomTabNavigator(
  {
    GeneralConfig: GeneralConfigContainer,
    IgnoreConfig: IgnoreConfigContainer,
    GithubActions: GithubActionsConfigContainer,
  },
  {
    navigationOptions: ({navigation}) => ({
      tabBarIcon: ({tintColor}) => {
        let {routeName} = navigation.state

        switch (routeName) {
          case `GeneralConfig`:
            return (
              <Image
                source={Images.tempomat}
                style={{
                  height: global.metrics.imgMedium,
                  width: global.metrics.imgMedium,
                  resizeMode: `contain`,
                }}
              />
            )
          case `IgnoreConfig`:
            return <Icon name="eye" size={25} color={tintColor!} />
          case `GithubActions`:
            return (
              <Image
                source={Images.github_bar}
                style={{
                  tintColor: tintColor!,
                  height: global.metrics.imgSmallMedium,
                  width: global.metrics.imgSmallMedium,
                }}
              />
            )
          default:
            return <Icon name="settings" size={25} color={tintColor!} />
        }
      },
    }),
    tabBarOptions: {
      //@ts-ignore
      style: {
        backgroundColor: {
          dynamic: {
            dark: global.colors.gray800,
            light: `white`,
          },
        },
      },
    },
  },
)

export const Navigator = createStackNavigator(
  {
    Home: NodeListContainer,
    Configuration: {
      screen: ConfigurationStack,
      navigationOptions: ({navigation}: any) => ({
        header: global.isMacOS ? (
          <MacosHeaderComponent navigation={navigation} />
        ) : undefined,
        title: `Configuration`,
      }),
    },
    AddToken: AddTokenContainer,
    PollingIntervalConfig: IntervalSelectionContainer,
  },
  {
    navigationOptions: ({navigation}) => ({
      header: global.isMacOS ? (
        <MacosHeaderComponent navigation={navigation} />
      ) : undefined,
    }),
  },
)
