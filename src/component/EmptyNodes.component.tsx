import React from "react"
import {View, Text, StyleSheet, Image} from "react-native"
import {TempoButton} from "./TempoButton.component"
import {Images} from "Assets"

interface IProps {
  onAddToken: () => void
}

export const EmptyNodesComponent = ({onAddToken}: IProps) => {
  return (
    <View style={styles.container}>
      <Image source={Images.tempomat} />
      <Text style={{fontWeight: `bold`, paddingVertical: 10}}>
        Welcome to Tempomat
      </Text>
      <Text>Start by adding a API token</Text>
      <TempoButton title="Add Token" onPress={onAddToken} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    height: 600,
    alignItems: `center`,
    justifyContent: `center`,
  },
})
