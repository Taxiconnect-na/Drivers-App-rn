import React from 'react';
import {Bubble} from 'react-native-gifted-chat';
import {Platform, Text, View, StyleSheet} from 'react-native';
import IconAnt from 'react-native-vector-icons/AntDesign';
import IconCommunity from 'react-native-vector-icons/MaterialCommunityIcons';
import IconMaterialIcons from 'react-native-vector-icons/MaterialIcons';
import IconFontAwesome from 'react-native-vector-icons/FontAwesome';
import IconSimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';

class NotifFamilies extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  getBasicHeader(title = 'Update', isWelcomeMessage = false, color = '#fff') {
    return (
      <View style={styles.headerNotifBasic}>
        {isWelcomeMessage ? (
          <Text>🎉 </Text>
        ) : /abuse/i.test(title) ? (
          <IconMaterialIcons
            name="warning"
            style={{color: color, marginRight: 3}}
            size={15}
          />
        ) : /^update/i.test(title) ? (
          <IconMaterialIcons
            name="cloud-download"
            style={{color: color, marginRight: 3}}
            size={15}
          />
        ) : /^fare/i.test(title) ? (
          <IconMaterialIcons
            name="credit-card"
            style={{color: color, marginRight: 3}}
            size={15}
          />
        ) : (
          <IconMaterialIcons
            name="info"
            style={{color: color, marginRight: 3}}
            size={15}
          />
        )}
        <Text
          style={{
            fontFamily:
              Platform.OS === 'android'
                ? 'UberMoveTextBold'
                : 'Uber Move Text Bold',
            color: color,
            fontSize: 16,
          }}>
          {title}
        </Text>
      </View>
    );
  }

  /**
   * Render the correct message bubble based on the notification family
   * normal, update, abuse, invitation, fare, policy
   * @param {*} messageProps
   * @param {*} messageFamily
   * @returns
   */
  getRightBubblePriority(messageProps, messageFamily = 'normal') {
    if (/normal/i.test(messageFamily)) {
      return (
        <Bubble
          {...messageProps}
          wrapperStyle={{
            right: {borderTopRightRadius: 15},
            left: {
              backgroundColor: '#f0f0f0',
              borderBottomRightRadius: 10,
              borderBottomLeftRadius: 0,
              borderTopRightRadius: 7,
              borderTopLeftRadius: 10,
            },
          }}
          containerStyle={{
            left: {backgroundColor: '#fff', marginTop: 20},
            // right: {backgroundColor: 'yellow'},
          }}
          bottomContainerStyle={
            {
              // right: {backgroundColor: 'red'},
            }
          }
          textStyle={{
            right: {
              color: '#000',
            },
            left: {
              color: '#000',
              fontFamily:
                Platform.OS === 'android'
                  ? 'UberMoveTextRegular'
                  : 'Uber Move Text',
            },
          }}
          renderCustomView={() =>
            this.getBasicHeader(
              messageProps.currentMessage.isWelcome_message
                ? 'WELCOME!'
                : 'Notice',
              messageProps.currentMessage.isWelcome_message,
              '#000',
            )
          }
        />
      );
    } else if (/update/i.test(messageFamily)) {
      return (
        <Bubble
          {...messageProps}
          wrapperStyle={{
            right: {borderTopRightRadius: 15},
            left: {
              backgroundColor: '#096ED4',
              borderBottomRightRadius: 10,
              borderBottomLeftRadius: 0,
              borderTopRightRadius: 7,
              borderTopLeftRadius: 10,
            },
          }}
          containerStyle={{
            left: {backgroundColor: '#fff', marginTop: 20},
            right: {borderBottomLeftRadius: 1},
          }}
          bottomContainerStyle={
            {
              // right: {backgroundColor: 'red'},
            }
          }
          textStyle={{
            right: {
              color: '#fff',
            },
            left: {
              color: '#fff',
              fontFamily:
                Platform.OS === 'android'
                  ? 'UberMoveTextRegular'
                  : 'Uber Move Text',
            },
          }}
          renderCustomView={() => this.getBasicHeader('Update')}
        />
      );
    } else if (/abuse/i.test(messageFamily)) {
      return (
        <Bubble
          {...messageProps}
          wrapperStyle={{
            right: {borderTopRightRadius: 15},
            left: {
              backgroundColor: '#D3096E',
              borderBottomRightRadius: 10,
              borderBottomLeftRadius: 0,
              borderTopRightRadius: 7,
              borderTopLeftRadius: 10,
            },
          }}
          containerStyle={{
            left: {backgroundColor: '#fff', marginTop: 20},
            right: {borderBottomLeftRadius: 1},
          }}
          bottomContainerStyle={
            {
              // right: {backgroundColor: 'red'},
            }
          }
          textStyle={{
            right: {
              color: '#fff',
            },
            left: {
              color: '#fff',
              fontFamily:
                Platform.OS === 'android'
                  ? 'UberMoveTextRegular'
                  : 'Uber Move Text',
            },
          }}
          renderCustomView={() => this.getBasicHeader('Abuse alert')}
        />
      );
    } else if (/invitation/i.test(messageFamily)) {
      return (
        <Bubble
          {...messageProps}
          wrapperStyle={{
            right: {borderTopRightRadius: 15},
            left: {
              backgroundColor: '#5B5B5B',
              borderBottomRightRadius: 10,
              borderBottomLeftRadius: 0,
              borderTopRightRadius: 7,
              borderTopLeftRadius: 10,
            },
          }}
          containerStyle={{
            left: {backgroundColor: '#fff', marginTop: 20},
            right: {borderBottomLeftRadius: 1},
          }}
          bottomContainerStyle={
            {
              // right: {backgroundColor: 'red'},
            }
          }
          textStyle={{
            right: {
              color: '#fff',
            },
            left: {
              color: '#fff',
              fontFamily:
                Platform.OS === 'android'
                  ? 'UberMoveTextRegular'
                  : 'Uber Move Text',
            },
          }}
          renderCustomView={() => this.getBasicHeader('Invitation')}
        />
      );
    } else if (/fare/i.test(messageFamily)) {
      return (
        <Bubble
          {...messageProps}
          wrapperStyle={{
            right: {borderTopRightRadius: 15},
            left: {
              backgroundColor: '#0e8491',
              borderBottomRightRadius: 10,
              borderBottomLeftRadius: 0,
              borderTopRightRadius: 7,
              borderTopLeftRadius: 10,
            },
          }}
          containerStyle={{
            left: {backgroundColor: '#fff', marginTop: 20},
            right: {borderBottomLeftRadius: 1},
          }}
          bottomContainerStyle={
            {
              // right: {backgroundColor: 'red'},
            }
          }
          textStyle={{
            right: {
              color: '#fff',
            },
            left: {
              color: '#fff',
              fontFamily:
                Platform.OS === 'android'
                  ? 'UberMoveTextRegular'
                  : 'Uber Move Text',
            },
          }}
          renderCustomView={() => this.getBasicHeader('Fares update')}
        />
      );
    } else if (/policy/i.test(messageFamily)) {
      return (
        <Bubble
          {...messageProps}
          wrapperStyle={{
            right: {borderTopRightRadius: 15},
            left: {
              backgroundColor: '#0e8491',
              borderBottomRightRadius: 10,
              borderBottomLeftRadius: 0,
              borderTopRightRadius: 7,
              borderTopLeftRadius: 10,
            },
          }}
          containerStyle={{
            left: {backgroundColor: '#fff'},
            right: {borderBottomLeftRadius: 1},
          }}
          bottomContainerStyle={
            {
              // right: {backgroundColor: 'red'},
            }
          }
          textStyle={{
            right: {
              color: '#fff',
            },
            left: {
              color: '#fff',
              fontFamily:
                Platform.OS === 'android'
                  ? 'UberMoveTextRegular'
                  : 'Uber Move Text',
            },
          }}
          renderCustomView={() => this.getBasicHeader('Policy update')}
        />
      );
    } else {
      <></>;
    }
  }

  render() {
    let messageProps = this.props.messageProps;
    let messageFamily = this.props.messageProps.currentMessage
      .notification_family;

    return <>{this.getRightBubblePriority(messageProps, messageFamily)}</>;
  }
}

const styles = StyleSheet.create({
  headerNotifBasic: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 10,
    paddingTop: 10,
  },
});

export default NotifFamilies;
