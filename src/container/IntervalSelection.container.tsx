import React, {useState} from "react"
import {View, Picker, StyleSheet, Platform} from "react-native"
import {NavigationScreenProps} from "react-navigation"
import {observer} from "mobx-react"
import {useStore} from "Root.store"
import {TempoButton} from "component"

interface IProps extends NavigationScreenProps {}

export const IntervalSelectionContainer = observer(({navigation}: IProps) => {
  let {nodeStore} = useStore()
  let [interval, setInterval] = useState(1)
  return (
    <View style={styles.container}>
      <Picker onValueChange={(v) => setInterval(v)} selectedValue={interval}>
        {Platform.OS === `macos` && <Picker.Item label="1 Minute" value={1} />}
        {Platform.OS === `macos` && <Picker.Item label="3 Minutes" value={3} />}
        {Platform.OS === `macos` && <Picker.Item label="5 Minutes" value={5} />}
        <Picker.Item label="15 Minutes" value={15} />
      </Picker>
      <TempoButton
        title="Done"
        onPress={() => {
          nodeStore.setFetchInterval(interval)
          navigation.goBack()
        }}
        primary
      />
    </View>
  )
})

//@ts-ignore
IntervalSelectionContainer.navigationOptions = {
  title: `Polling interval`,
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
})
