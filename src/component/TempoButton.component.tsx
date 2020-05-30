import React from "react"
import {TouchableOpacity, Text, StyleSheet} from "react-native"

interface IProps {
  onPress: () => void
  title: string
  primary?: boolean
}

export const TempoButton = ({onPress, title, primary}: IProps) => {
  if (primary) {
    return (
      <TouchableOpacity onPress={onPress} style={styles.primaryButton}>
        <Text style={{color: `white`}}>{title}</Text>
      </TouchableOpacity>
    )
  }

  return (
    <TouchableOpacity onPress={onPress} style={{padding: global.metrics.pl}}>
      <Text style={styles.flatButton}>{title}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  flatButton: {color: global.colors.blue500, fontSize: 14},
  primaryButton: {
    margin: global.metrics.pl,
    padding: global.metrics.pl,
    backgroundColor: global.colors.blue500,
    alignItems: `center`,
  },
})
