import React from 'react';
import {View, Platform, BackHandler, Text} from 'react-native';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {
  UpdateErrorModalLog,
  UpdateType_rideShown_YourRides_screenTab,
  UpdateRides_history_YourRides_tab,
  UpdateTargetedRequest_yourRides_history,
} from '../Redux/HomeActionsCreators';
import {GiftedChat, Avatar, Day, Time} from 'react-native-gifted-chat';
import IconMaterialIcons from 'react-native-vector-icons/MaterialIcons';
import NotifFamilies from './NotifFamilies';
import {RFValue} from 'react-native-responsive-fontsize';

class Notifications extends React.PureComponent {
  constructor(props) {
    super(props);

    this;
  }

  componentDidMount() {
    let globalObject = this;
    //Add home going back handler-----------------------------
    this._navigatorEvent = this.props.navigation.addListener(
      'beforeRemove',
      (e) => {
        // Prevent default behavior of leaving the screen
        e.preventDefault();
        if (/POP/i.test(e.data.action.type)) {
          globalObject.props.navigation.navigate('Home_drawer');
        }
        return;
      },
    );
    //--------------------------------------------------------
    this.backHander = BackHandler.addEventListener(
      'hardwareBackPress',
      function () {
        globalObject.props.navigation.navigate('Home_drawer');
        return true;
      },
    );
  }

  componentWillUnmount() {
    //Remove navigation event listener
    if (this._navigatorEvent !== false && this._navigatorEvent !== undefined) {
      this._navigatorEvent();
    }
  }

  render() {
    return (
      <View
        style={{
          borderWidth: 1,
          flex: 1,
          backgroundColor: '#fff',
        }}>
        {this.props.App.notifications_comm_data.data !== undefined &&
        this.props.App.notifications_comm_data.data !== null &&
        Object.keys(this.props.App.notifications_comm_data.data).length > 0 ? (
          <GiftedChat
            messages={this.props.App.notifications_comm_data.data}
            onSend={(messages) => {}}
            renderAvatar={(props) => {
              return (
                <Avatar
                  {...props}
                  containerStyle={{
                    left: {
                      backgroundColor: '#d0d0d0',
                      borderRadius: 50,
                      borderWidth: 2,
                      opacity: props.currentMessage._id !== 1 ? 0.2 : 1,
                    },
                  }}
                />
              );
            }}
            renderInputToolbar={() => null}
            renderDay={(props) => (
              <Day
                {...props}
                textStyle={{
                  fontFamily:
                    Platform.OS === 'android'
                      ? 'UberMoveTextRegular'
                      : 'Uber Move Text',
                  fontSize: 14,
                }}
              />
            )}
            renderTime={(props) => (
              <Time
                {...props}
                timeTextStyle={{
                  left: {
                    color: /normal/i.test(
                      props.currentMessage.notification_family,
                    )
                      ? '#000'
                      : '#fff',
                    fontFamily:
                      Platform.OS === 'android'
                        ? 'UberMoveTextMedium'
                        : 'Uber Move Text Medium',
                    fontSize: 12,
                  },
                }}
              />
            )}
            inverted={false}
            renderActions={() => null}
            renderBubble={(props) => <NotifFamilies messageProps={props} />}
          />
        ) : (
          <View
            style={{
              flex: 1,
              backgroundColor: '#f0f0f0',
              padding: 10,
              paddingBottom: 50,
            }}>
            <View
              style={{
                flex: 1,
                alignItems: 'center',
                paddingTop: '35%',
              }}>
              <IconMaterialIcons
                name="circle-notifications"
                size={45}
                color="#7d7d7d"
              />
              <Text
                style={{
                  fontFamily:
                    Platform.OS === 'android'
                      ? 'UberMoveTextMedium'
                      : 'Uber Move Text Medium',
                  fontSize: RFValue(18),
                  marginTop: 20,
                  color: '#7d7d7d',
                }}>
                No notifications yet
              </Text>
              <Text
                style={{
                  fontFamily:
                    Platform.OS === 'android'
                      ? 'UberMoveTextRegular'
                      : 'Uber Move Text',
                  fontSize: RFValue(16),
                  marginTop: 10,
                  color: '#7d7d7d',
                }}>
                We'll notify you when new ones come.
              </Text>
            </View>
          </View>
        )}
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  const {App} = state;
  return {App};
};

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      UpdateErrorModalLog,
      UpdateType_rideShown_YourRides_screenTab,
      UpdateRides_history_YourRides_tab,
      UpdateTargetedRequest_yourRides_history,
    },
    dispatch,
  );

export default React.memo(
  connect(mapStateToProps, mapDispatchToProps)(Notifications),
);
