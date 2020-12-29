import React from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {systemWeights} from 'react-native-typography';
import IconAnt from 'react-native-vector-icons/AntDesign';
import IconCommunity from 'react-native-vector-icons/MaterialCommunityIcons';
import IconMaterialIcons from 'react-native-vector-icons/MaterialIcons';
import IconFontAwesome from 'react-native-vector-icons/FontAwesome';
import IconFeather from 'react-native-vector-icons/Feather';
import GenericRequestTemplate from '../Modules/GenericRequestTemplate';

class Home extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  /**
   * @func renderMainComponent
   * Responsible for rendering the main view of the driver app
   */
  renderMainComponent() {
    return (
      <View style={styles.mainInsideComponent}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            padding: 20,
            paddingTop: 15,
            paddingBottom: 15,
            borderBottomWidth: 0.7,
            borderBottomColor: '#d0d0d0',
            backgroundColor: '#fff',
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 5,
            },
            shadowOpacity: 0.34,
            shadowRadius: 6.27,

            elevation: 10,
          }}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <View style={{top: 1.5}}>
              <IconMaterialIcons name="menu" size={29} />
            </View>
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <View
                style={{
                  padding: 6,
                  width: 90,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 50,
                  backgroundColor: '#000',
                  shadowColor: '#000',
                  shadowOffset: {
                    width: 0,
                    height: 7,
                  },
                  shadowOpacity: 0.41,
                  shadowRadius: 9.11,

                  elevation: 14,
                }}>
                <Text
                  style={[
                    {
                      fontSize: 16,
                      fontFamily: 'Allrounder-Grotesk-Medium',
                      color: '#fff',
                    },
                  ]}>
                  N$40
                </Text>
              </View>
            </View>
            <View
              style={{
                borderWidth: 1,
                borderColor: '#096ED4',
                width: 35,
                height: 35,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 150,
                backgroundColor: '#fff',
              }}>
              <IconFontAwesome
                name="location-arrow"
                color="#096ED4"
                size={22}
              />
            </View>
          </View>
        </View>
        <ScrollView
          style={{
            flex: 1,
            backgroundColor: '#f0f0f0',
            padding: 10,
            paddingBottom: 50,
          }}>
          {/*Request template*/}
          <GenericRequestTemplate />
        </ScrollView>
        <TouchableOpacity
          style={{
            height: 80,
            justifyContent: 'center',
            backgroundColor: '#fff',
            borderTopWidth: 2,
          }}>
          <View
            style={{flexDirection: 'row', alignItems: 'center', padding: 20}}>
            <View style={{flexDirection: 'row', alignItems: 'center', flex: 1}}>
              <IconCommunity
                name="square"
                size={12}
                style={{top: 1, marginRight: 5}}
              />
              <Text
                style={{
                  fontFamily: 'Allrounder-Grotesk-Regular',
                  fontSize: 17,
                }}>
                Rides
              </Text>
            </View>
            <IconMaterialIcons
              name="keyboard-arrow-down"
              color={'#000'}
              size={22}
            />
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  render() {
    return (
      <SafeAreaView style={styles.mainView}>
        {this.renderMainComponent()}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
  },
  mainInsideComponent: {
    flex: 1,
  },
});

export default Home;
