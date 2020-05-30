import React from "react"
import {View, StyleSheet} from "react-native"

interface IProps {
  width?: number | string
  alignSelf?:
    | `auto`
    | `flex-start`
    | `flex-end`
    | `center`
    | `stretch`
    | `baseline`
    | undefined
}

export const Divider = ({width = `100%`, alignSelf}: IProps) => (
  <View style={[styles.divider, {width, alignSelf}]} />
)

const styles = StyleSheet.create({
  divider: {
    height: 1,
    backgroundColor: {
      dynamic: {
        light: global.colors.gray200,
        dark: global.colors.gray500,
      },
    },
  },
})
