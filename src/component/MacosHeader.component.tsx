import React from "react"
import {View, Text, StyleSheet, TouchableOpacity} from "react-native"
import {NavigationScreenProps} from "react-navigation"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"

interface IProps extends NavigationScreenProps {}

export const MacosHeaderComponent = ({navigation}: IProps) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Icon name="close" size={22} />
      </TouchableOpacity>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>
          {navigation.state.routeName.toUpperCase()}
        </Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    //@ts-ignore
    backgroundColor: {
      dynamic: {
        light: global.colors.gray010,
        dark: global.colors.gray800,
      },
    },
    justifyContent: `space-between`,
    flexDirection: `row`,
    padding: global.metrics.pl,
  },
  title: {
    fontSize: global.metrics.tl,
    alignSelf: `center`,
  },
  titleContainer: {
    flex: 1,
  },
})
