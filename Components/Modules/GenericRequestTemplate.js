import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {systemWeights} from 'react-native-typography';
import IconAnt from 'react-native-vector-icons/AntDesign';
import IconCommunity from 'react-native-vector-icons/MaterialCommunityIcons';
import IconMaterialIcons from 'react-native-vector-icons/MaterialIcons';
import IconFontAwesome from 'react-native-vector-icons/FontAwesome';
import IconFeather from 'react-native-vector-icons/Feather';

class GenericRequestTemplate extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View
        style={{
          borderRadius: 3,
          backgroundColor: '#fff',
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 5,
          },
          shadowOpacity: 0.36,
          shadowRadius: 6.68,
          elevation: 11,
        }}>
        <View
          style={{
            flexDirection: 'row',
            padding: 10,
            borderBottomWidth: 0.5,
            borderBottomColor: '#d0d0d0',
          }}>
          <Text
            style={{
              fontFamily: 'Allrounder-Grotesk-Medium',
              fontSize: 16.5,
              flex: 1,
            }}>
            5min away
          </Text>
          <Text
            style={{
              fontFamily: 'Allrounder-Grotesk-Regular',
              fontSize: 16.5,
            }}>
            400m
          </Text>
        </View>

        <View
          style={{
            flexDirection: 'row',
            padding: 10,
            paddingTop: 20,
            paddingBottom: 20,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <View style={{flex: 1, alignItems: 'center'}}>
            <Text style={{fontFamily: 'Allrounder-Grotesk-Book', fontSize: 16}}>
              ConnectUS
            </Text>
          </View>
          <View style={{padding: 5}}>
            <Text
              style={[
                {
                  fontFamily: 'Allrounder-Grotesk-Medium',
                  fontSize: 22,
                  color: 'green',
                },
              ]}>
              N$15
            </Text>
          </View>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <IconAnt name="user" size={15} />
            <Text
              style={{
                fontFamily: 'Allrounder-Grotesk-Medium',
                fontSize: 18,
                marginLeft: 3,
                bottom: 1,
              }}>
              4
            </Text>
          </View>
        </View>

        <View>
          <View
            style={{
              padding: 20,
              borderTopWidth: 0.7,
              borderTopColor: '#d0d0d0',
              borderBottomWidth: 0.7,
              borderBottomColor: '#d0d0d0',
            }}>
            <View
              style={{
                flexDirection: 'row',
                marginBottom: 25,
                alignItems: 'center',
              }}>
              <View>
                <View
                  style={{
                    height: 11,
                    width: 11,
                    borderRadius: 100,
                    backgroundColor: '#000',
                  }}
                />
                <View
                  style={{
                    position: 'absolute',
                    top: 3,
                    left: 5,
                    width: 1.5,
                    height: 50,
                    backgroundColor: '#000',
                  }}></View>
              </View>
              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  alignItems: 'center',
                  bottom: 1,
                }}>
                <Text
                  style={{
                    fontFamily: 'Allrounder-Grotesk-Book',
                    fontSize: 13,
                    marginLeft: 5,
                  }}>
                  From
                </Text>
                <Text
                  style={{
                    fontFamily: 'Allrounder-Grotesk-Medium',
                    fontSize: 15,
                    marginLeft: 5,
                  }}>
                  Katutura (Hospital)
                </Text>
              </View>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <View>
                <View
                  style={{
                    height: 11,
                    width: 11,
                    borderRadius: 0,
                    backgroundColor: '#096ED4',
                  }}
                />
              </View>
              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  alignItems: 'center',
                  bottom: 1,
                }}>
                <Text
                  style={{
                    fontFamily: 'Allrounder-Grotesk-Book',
                    fontSize: 13,
                    marginLeft: 5,
                  }}>
                  To
                </Text>
                <Text
                  style={{
                    fontFamily: 'Allrounder-Grotesk-Medium',
                    fontSize: 15,
                    marginLeft: 5,
                  }}>
                  Town (FNB)
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View
          style={{
            padding: 10,
            marginTop: 5,
            marginBottom: 10,
            flexDirection: 'row',
          }}>
          <View style={{flex: 1, justifyContent: 'flex-end'}}>
            <View style={{paddingLeft: 10}}>
              <Text
                style={{
                  fontFamily: 'Allrounder-Grotesk-Regular',
                  fontSize: 17,
                  color: '#b22222',
                }}>
                Decline
              </Text>
            </View>
          </View>
          <View style={{flex: 1}}>
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                backgroundColor: '#096ED4',
                padding: 18,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 4,
                shadowColor: '#000',
                shadowOffset: {
                  width: 0,
                  height: 2,
                },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,

                elevation: 5,
              }}>
              <Text
                style={{
                  fontFamily: 'Allrounder-Grotesk-Medium',
                  fontSize: 18,
                  color: '#fff',
                }}>
                Accept
              </Text>
              <IconFeather
                name="check"
                size={17}
                style={{top: 1, marginLeft: 3, color: '#fff'}}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}

export default GenericRequestTemplate;
