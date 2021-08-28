import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Linking,
  BackHandler,
  RefreshControl,
  Platform,
  StatusBar,
} from 'react-native';
import {
  UpdateErrorModalLog,
  UpdateAccountBigNumbers,
} from '../Redux/HomeActionsCreators';
import IconCommunity from 'react-native-vector-icons/MaterialCommunityIcons';
import IconMaterialIcons from 'react-native-vector-icons/MaterialIcons';
import IconEntypo from 'react-native-vector-icons/Entypo';
import SyncStorage from 'sync-storage';
import ErrorModal from '../Helpers/ErrorModal';
import FastImage from 'react-native-fast-image';
import {RFValue} from 'react-native-responsive-fontsize';

class SettingsEntryScreen extends React.Component {
  constructor(props) {
    super(props);

    this._isMounted = true; //! RESPONSIBLE TO LOCK PROCESSES IN THE MAIN SCREEN WHEN UNMOUNTED.
    this._shouldShow_errorModal = true; //! ERROR MODAL AUTO-LOCKER - PERFORMANCE IMPROVER.
    this.backListener = null; //Responsible to hold the listener for the go back overwritter.

    //Handlers
    this.backHander = null;

    this.state = {
      pullRefreshing: false,
    };
  }

  componentDidMount() {
    let globalObject = this;
    this._isMounted = true;
    //? Add navigator listener - auto clean on focus
    globalObject.props.navigation.addListener('focus', () => {
      globalObject.getRemoteData();
    });

    //Add home going back handler-----------------------------
    this.backListener = this.props.navigation.addListener(
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

    //Handle socket responses
    this.props.App.socket.on(
      'driversOverallNumbers-response',
      function (response) {
        globalObject.setState({pullRefreshing: false});
        if (
          response !== false &&
          response !== undefined &&
          response !== null &&
          /(error|invalid)/i.test(response) === false
        ) {
          //Has some values
          globalObject.props.UpdateAccountBigNumbers(response);
        }
      },
    );
  }

  componentWillUnmount() {
    this._isMounted = false; //! MARK AS UNMOUNTED
    //...
    //Remove navigation event listener
    if (this._navigatorEvent !== false && this._navigatorEvent !== undefined) {
      this._navigatorEvent();
    }
  }

  /**
   * @func renderError_modalView
   * Responsible for rendering the modal view only once.
   */
  renderError_modalView() {
    return (
      <ErrorModal
        active={this.props.App.generalErrorModal_vars.showErrorGeneralModal}
        error_status={
          this.props.App.generalErrorModal_vars.generalErrorModalType
        }
        parentNode={this}
      />
    );
  }

  /**
   * For getting any remote values
   */
  getRemoteData() {
    this.props.App.socket.emit('driversOverallNumbers', {
      user_fingerprint: this.props.App.user_fingerprint,
    });
  }

  /**
   * For refreshing the values
   */
  doRefreshValues() {
    this.getRemoteData();
    this.setState({pullRefreshing: true});
  }

  render() {
    return (
      <>
        {this._isMounted ? (
          <SafeAreaView style={styles.mainWindow}>
            {this.props.App.generalErrorModal_vars.showErrorGeneralModal
              ? this.renderError_modalView()
              : null}
            <StatusBar backgroundColor="#000" barStyle={'light-content'} />
            <ScrollView
              style={styles.presentationWindow}
              refreshControl={
                <RefreshControl
                  onRefresh={() => this.doRefreshValues()}
                  refreshing={this.state.pullRefreshing}
                />
              }>
              {/**Picture section/edit */}
              <View
                style={{
                  borderBottomWidth: 0.7,
                  borderBottomColor: '#d0d0d0',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 20,
                }}>
                <View
                  style={{
                    borderWidth: 1,
                    borderColor: '#f0f0f0',
                    height: 80,
                    width: 80,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 150,
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
                  {this.props.App.user_profile_pic !== undefined &&
                  this.props.App.user_profile_pic !== null &&
                  !/user\.png/i.test(this.props.App.user_profile_pic) ? (
                    <FastImage
                      source={{
                        uri: this.props.App.user_profile_pic,
                        priority: FastImage.priority.normal,
                      }}
                      resizeMode={FastImage.resizeMode.cover}
                      style={{
                        width: '100%',
                        height: '100%',
                        borderRadius: 150,
                      }}
                    />
                  ) : (
                    <Image
                      source={require('../../Media_assets/Images/user.png')}
                      style={{
                        resizeMode: 'contain',
                        width: '60%',
                        height: '80%',
                        borderRadius: 0,
                      }}
                    />
                  )}
                </View>
                <View style={{marginTop: 20}}>
                  <Text
                    style={{
                      fontFamily:
                        Platform.OS === 'android'
                          ? 'MoveBold'
                          : 'Uber Move Bold',
                      fontSize: RFValue(17),
                    }}>
                    {`${this.props.App.username} ${
                      this.props.App.surname_user !== undefined &&
                      this.props.App.surname_user !== null &&
                      this.props.App.surname_user
                        ? this.props.App.surname_user
                        : ''
                    }`}
                  </Text>
                </View>
                <View
                  style={{
                    width: '100%',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginTop: 35,
                  }}>
                  {/* Number of rides */}
                  <View>
                    <Text
                      style={{
                        height: 25,
                        alignItems: 'center',
                        justifyContent: 'center',
                        textAlign: 'center',
                      }}>
                      {this.props.App.generalOverviewNumbers !== null &&
                      this.props.App.generalOverviewNumbers !== undefined ? (
                        <Text
                          style={{
                            fontSize: RFValue(17),
                            fontFamily:
                              Platform.OS === 'android'
                                ? 'UberMoveTextMedium'
                                : 'Uber Move Text Medium',
                          }}>
                          {this.props.App.generalOverviewNumbers.trips}
                        </Text>
                      ) : (
                        <IconCommunity name="circle-medium" />
                      )}
                    </Text>
                    <Text
                      style={{
                        fontFamily:
                          Platform.OS === 'android'
                            ? 'UberMoveTextRegular'
                            : 'Uber Move Text',
                        fontSize: RFValue(12),
                        textAlign: 'center',
                        paddingTop: 3,
                      }}>
                      Trips
                    </Text>
                  </View>
                  {/* Rating */}
                  <View>
                    <Text
                      style={{
                        height: 25,
                        alignItems: 'center',
                        justifyContent: 'center',
                        textAlign: 'center',
                      }}>
                      {this.props.App.generalOverviewNumbers !== null &&
                      this.props.App.generalOverviewNumbers !== undefined ? (
                        <Text
                          style={{
                            fontSize: RFValue(17),
                            fontFamily:
                              Platform.OS === 'android'
                                ? 'UberMoveTextMedium'
                                : 'Uber Move Text Medium',
                          }}>
                          {this.props.App.generalOverviewNumbers.rating}
                        </Text>
                      ) : (
                        <IconCommunity name="circle-medium" />
                      )}
                    </Text>
                    <Text style={{textAlign: 'center', paddingTop: 3}}>
                      <IconCommunity name="star" size={18} color="#ffbf00" />
                    </Text>
                  </View>
                  {/* Revenue */}
                  <View>
                    <Text
                      style={{
                        height: 25,
                        alignItems: 'center',
                        justifyContent: 'center',
                        textAlign: 'center',
                      }}>
                      {this.props.App.generalOverviewNumbers !== null &&
                      this.props.App.generalOverviewNumbers !== undefined ? (
                        <Text
                          style={{
                            fontSize: RFValue(17),
                            fontFamily:
                              Platform.OS === 'android'
                                ? 'UberMoveTextMedium'
                                : 'Uber Move Text Medium',
                          }}>
                          {this.props.App.generalOverviewNumbers.revenue}
                        </Text>
                      ) : (
                        <IconCommunity name="circle-medium" />
                      )}
                    </Text>
                    <Text
                      style={{
                        fontFamily:
                          Platform.OS === 'android'
                            ? 'UberMoveTextRegular'
                            : 'Uber Move Text',
                        fontSize: RFValue(12),
                        textAlign: 'center',
                        paddingTop: 3,
                      }}>
                      N$
                    </Text>
                  </View>
                </View>
              </View>

              {/**Navigation infos */}
              <View
                style={{
                  padding: 20,
                }}>
                <View style={{marginBottom: 10}}>
                  <Text
                    style={{
                      fontSize: RFValue(16),
                      fontFamily:
                        Platform.OS === 'android'
                          ? 'UberMoveTextMedium'
                          : 'Uber Move Text Medium',
                      color: '#AFAFAF',
                    }}>
                    Navigation
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() =>
                    this.props.navigation.navigate('NavigationSettings')
                  }
                  style={{
                    flexDirection: 'row',
                    paddingTop: 5,
                    paddingBottom: 10,
                    alignItems: 'center',
                  }}>
                  <Text
                    style={{
                      fontFamily:
                        Platform.OS === 'android'
                          ? 'UberMoveTextRegular'
                          : 'Uber Move Text',
                      fontSize: RFValue(17),
                      flex: 1,
                    }}>
                    Navigation settings
                  </Text>
                  <IconMaterialIcons
                    name="keyboard-arrow-right"
                    color="#AFAFAF"
                    size={25}
                  />
                </TouchableOpacity>
              </View>

              {/**Privacy infos */}
              <View
                style={{
                  padding: 20,
                }}>
                <View style={{marginBottom: 10}}>
                  <Text
                    style={{
                      fontSize: RFValue(16),
                      fontFamily:
                        Platform.OS === 'android'
                          ? 'UberMoveTextMedium'
                          : 'Uber Move Text Medium',
                      color: '#AFAFAF',
                    }}>
                    Privacy
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() =>
                    Linking.openURL(
                      'https://www.taxiconnectna.com/privacy.html',
                    )
                  }
                  style={{
                    flexDirection: 'row',
                    paddingTop: 5,
                    paddingBottom: 10,
                    alignItems: 'center',
                  }}>
                  <Text
                    style={{
                      fontFamily:
                        Platform.OS === 'android'
                          ? 'UberMoveTextRegular'
                          : 'Uber Move Text',
                      fontSize: RFValue(17),
                      flex: 1,
                    }}>
                    Terms & Conditions
                  </Text>
                  <IconMaterialIcons
                    name="keyboard-arrow-right"
                    color="#AFAFAF"
                    size={25}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() =>
                    Linking.openURL(
                      'https://www.taxiconnectna.com/privacy.html',
                    )
                  }
                  style={{
                    flexDirection: 'row',
                    paddingTop: 10,
                    paddingBottom: 10,
                    alignItems: 'center',
                  }}>
                  <Text
                    style={{
                      fontFamily:
                        Platform.OS === 'android'
                          ? 'UberMoveTextRegular'
                          : 'Uber Move Text',
                      fontSize: RFValue(17),
                      flex: 1,
                    }}>
                    Privacy statements
                  </Text>
                  <IconMaterialIcons
                    name="keyboard-arrow-right"
                    color="#AFAFAF"
                    size={25}
                  />
                </TouchableOpacity>
              </View>
              {/**Log out */}
              <TouchableOpacity
                onPress={() =>
                  this.props.UpdateErrorModalLog(
                    true,
                    'show_signOff_modal',
                    'any',
                  )
                }
                style={{
                  flexDirection: 'row',
                  marginTop: 25,
                  padding: 20,
                  paddingTop: 30,
                  marginBottom: 40,
                  alignItems: 'center',
                  borderTopWidth: 1,
                  borderTopColor: '#d0d0d0',
                }}>
                <Text
                  style={{
                    fontFamily:
                      Platform.OS === 'android'
                        ? 'UberMoveTextBold'
                        : 'Uber Move Text Bold',
                    fontSize: RFValue(17),
                    flex: 1,
                    color: '#b22222',
                  }}>
                  Sign Out
                </Text>
                <IconMaterialIcons
                  name="keyboard-arrow-right"
                  color="#b22222"
                  size={25}
                />
              </TouchableOpacity>
            </ScrollView>
          </SafeAreaView>
        ) : null}
      </>
    );
  }
}

const styles = StyleSheet.create({
  mainWindow: {
    flex: 1,
    backgroundColor: '#fff',
  },
  presentationWindow: {
    flex: 1,
  },
  detailsSearchRes: {
    color: '#707070',
    fontSize: 15,
  },
  locationRender: {
    paddingTop: 10,
    paddingBottom: 15,
    flexDirection: 'row',
    borderBottomWidth: 0,
    borderBottomColor: '#d0d0d0',
    marginBottom: 5,
  },
});

const mapStateToProps = (state) => {
  const {App} = state;
  return {App};
};
const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      UpdateErrorModalLog,
      UpdateAccountBigNumbers,
    },
    dispatch,
  );

export default React.memo(
  connect(mapStateToProps, mapDispatchToProps)(SettingsEntryScreen),
);
