import {NodeRow, Row, Spacer, EmptyNodesComponent} from "component"
import {observer} from "mobx-react"
import {Node} from "model"
import React from "react"
import {
  ActivityIndicator,
  FlatList,
  ListRenderItemInfo,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  SafeAreaView,
} from "react-native"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"
import {NavigationScreenProps} from "react-navigation"
import {useStore} from "Root.store"

let ICON_SIZE = global.isMacOS ? 16 : 24

interface IProps extends NavigationScreenProps {}

export const NodeListContainer = observer(({navigation}: IProps) => {
  let root = useStore()

  function renderNodeItem(info: ListRenderItemInfo<Node>) {
    return <NodeRow node={info.item} />
  }

  function goToAddTokenScreen() {
    navigation.navigate(`AddToken`)
  }

  return (
    <>
      <SafeAreaView style={{flex: 0, backgroundColor: global.colors.gray010}} />
      <SafeAreaView style={{flex: 1, backgroundColor: `white`}}>
        <FlatList
          data={root.nodeStore.sortedFilteredNodes}
          renderItem={renderNodeItem}
          keyExtractor={(i) => i.label}
          style={styles.list}
          ListEmptyComponent={() => (
            <EmptyNodesComponent onAddToken={goToAddTokenScreen} />
          )}
        />
        <Row style={styles.actionBar} vertical="center">
          <TouchableOpacity
            onPress={() => navigation.navigate(`GeneralConfig`)}>
            <Icon name="settings" style={styles.iconStyle} size={ICON_SIZE} />
          </TouchableOpacity>
          <Spacer />
          <TouchableOpacity
            onPress={root.nodeStore.toggleSorting}
            style={{paddingRight: global.metrics.pl}}>
            <Row vertical="center">
              <Icon name="sort" size={ICON_SIZE} style={styles.iconStyle} />
              <Text style={styles.sortText}>{root.nodeStore.sortingKey}</Text>
            </Row>
          </TouchableOpacity>
          <TouchableOpacity onPress={root.nodeStore.fetchNodes}>
            {root.nodeStore.fetching ? (
              <ActivityIndicator style={{backgroundColor: `transparent`}} />
            ) : (
              <Icon name="refresh" style={styles.iconStyle} size={ICON_SIZE} />
            )}
          </TouchableOpacity>
        </Row>
      </SafeAreaView>
    </>
  )
})

//@ts-ignore
NodeListContainer.navigationOptions = () => ({
  header: <View style={styles.header} />,
})

const styles = StyleSheet.create({
  list: {
    flex: 1,
    //@ts-ignore
    backgroundColor: {
      dynamic: {light: global.colors.gray010, dark: global.colors.gray800},
    },
  },
  rowIcon: {
    height: global.metrics.imgSmall,
    width: global.metrics.imgSmall,
    resizeMode: `contain`,
    margin: global.metrics.ps,
  },
  actionBar: {
    //@ts-ignore
    backgroundColor: {
      dynamic: {
        light: `white`,
        dark: global.colors.gray900,
      },
    },
    padding: global.metrics.pl,
  },
  header: {
    height: 0,
  },
  sortText: {
    paddingHorizontal: global.metrics.pm,
    fontSize: global.metrics.tm,
    //@ts-ignore
    color: {
      dynamic: {
        light: global.colors.gray800,
        dark: global.colors.gray010,
      },
    },
  },
  iconStyle: {
    // @ts-ignore
    color: {
      dynamic: {
        light: global.colors.gray900,
        dark: `white`,
      },
    },
  },
})
