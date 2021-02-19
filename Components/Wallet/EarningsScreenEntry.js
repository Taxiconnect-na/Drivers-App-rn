import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  StatusBar,
  BackHandler,
  Platform,
  ScrollView,
  RefreshControl,
} from 'react-native';
import {
  UpdateDeepWalletInsights,
  UpdateFocusedWeekDeepWalletInsights,
  UpdateErrorModalLog,
} from '../Redux/HomeActionsCreators';
import DismissKeyboard from '../Helpers/DismissKeyboard';
import IconMaterialIcons from 'react-native-vector-icons/MaterialIcons';
import IconAnt from 'react-native-vector-icons/AntDesign';
import IconEntypo from 'react-native-vector-icons/Entypo';
import IconCommunity from 'react-native-vector-icons/MaterialCommunityIcons';
import {BarChart, Grid, XAxis} from 'react-native-svg-charts';
import {RFValue} from 'react-native-responsive-fontsize';
import ErrorModal from '../Helpers/ErrorModal';
import GenericLoader from '../Modules/GenericLoader/GenericLoader';
import {TouchableOpacity} from 'react-native-gesture-handler';

const fill = '#096ED4';
const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

class EarningsScreenEntry extends React.PureComponent {
  constructor(props) {
    super(props);

    //Handlers
    this.backHander = null;
    this._navigatorEvent = null;

    this.state = {
      pullRefreshing: false, //To know whether the refresh control is active or not - default: falsee
      loaderState: true,
      foundError: false, //To know whether the loading found an error or not and responsible for showing it - default: false
    };
  }

  componentWillUnmount() {
    this._isMounted = false; //! MARK AS UNMOUNTED
    //...
    if (this.backHander !== null) {
      this.backHander.remove();
    }
    //...
    if (this._navigatorEvent !== null) {
      this._navigatorEvent();
      this._navigatorEvent = null;
    }
  }

  componentDidMount() {
    let globalObject = this;
    this._isMounted = true;

    //? Add navigator listener - auto clean on focus
    this._navigatorEvent = globalObject.props.navigation.addListener(
      'focus',
      () => {
        globalObject.refreshWalletDeepValues();
      },
    );
    this.backHander = BackHandler.addEventListener(
      'hardwareBackPress',
      function () {
        globalObject.props.navigation.goBack();
        return true;
      },
    );

    /**
     * SOCKET IO HANDLERS
     */
    //1. Handles the deep insights for the driver's wallet
    this.props.App.socket.on(
      'getDrivers_walletInfosDeep_io-response',
      function (response) {
        if (
          response !== undefined &&
          response !== null &&
          response.weeks_view !== undefined
        ) {
          globalObject.setState({
            pullRefreshing: false,
            loaderState: false,
            foundError: false,
          });
          if (
            response.weeks_view !== null &&
            response.weeks_view !== undefined &&
            response.weeks_view.length > 0
          ) {
            //Has some data
            //Update the global state vars
            //! Update  the global date and autofocus to the current week
            globalObject.props.UpdateDeepWalletInsights(response);
            //! Auto focus to this week - default: Choose the current week
            globalObject.props.UpdateFocusedWeekDeepWalletInsights(0);
          } //No data found
          else {
            //DO NOTHING
          }
          //? Update the global var
        } //Error
        else {
          globalObject.setState({
            pullRefreshing: false,
            loaderState: false,
            foundError: true,
          });
        }
      },
    );
  }

  /**
   * @func refreshWalletDeepValues
   * Responsible for updating the wallet's deep informations about the earnings.
   */
  refreshWalletDeepValues() {
    this.setState({pullRefreshing: true, loaderState: true, foundError: false});
    //this.props.App.wallet_state_vars.deepWalletInsights = null; //!Clean the global insight var
    //2. Request for the total wallet balance
    this.props.App.socket.emit('getDrivers_walletInfosDeep_io', {
      user_fingerprint: this.props.App.user_fingerprint,
    });
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

  render() {
    //this.props.App.generalErrorModal_vars.showErrorGeneralModal = true; //DEBUG
    return (
      <DismissKeyboard>
        {this.state.loaderState === false && this.state.foundError === false ? (
          this.props.App.wallet_state_vars.deepWalletInsights !== null &&
          this.props.App.wallet_state_vars.deepWalletInsights.weeks_view !==
            null &&
          this.props.App.wallet_state_vars.deepWalletInsights.weeks_view !==
            undefined ? (
            this.props.App.wallet_state_vars.focusedWeekWalletInsights !==
              null &&
            this.props.App.wallet_state_vars.focusedWeekWalletInsights !==
              undefined ? (
              <>
                {this.props.App.generalErrorModal_vars.showErrorGeneralModal
                  ? this.renderError_modalView()
                  : null}
                <ScrollView
                  refreshControl={
                    <RefreshControl
                      onRefresh={() => this.refreshWalletDeepValues()}
                      refreshing={this.state.pullRefreshing}
                    />
                  }
                  style={styles.mainWindow}>
                  {/**Header */}
                  <View style={{paddingBottom: 20}}>
                    <TouchableOpacity
                      onPress={() =>
                        this.props.UpdateErrorModalLog(
                          true,
                          'show_weeksEarningsAlternatives',
                          'any',
                        )
                      }
                      style={{
                        borderBottomWidth: 1,
                        borderColor: '#E2E2E2',
                        flexDirection: 'row',
                        alignItems: 'center',
                        backgroundColor: '#fff',
                        padding: 10,
                        paddingBottom: 15,
                        paddingLeft: 20,
                        paddingRight: 20,
                      }}>
                      <Text
                        style={{
                          fontFamily:
                            Platform.OS === 'android'
                              ? 'MoveMedium'
                              : 'Uber Move Medium',
                          fontSize: RFValue(17),
                          flex: 1,
                        }}>
                        {this.props.App.wallet_state_vars
                          .focusedWeek_arrayIndex === 0
                          ? 'This week'
                          : `${this.props.App.wallet_state_vars.focusedWeekWalletInsights.year_number} - Week ${this.props.App.wallet_state_vars.focusedWeekWalletInsights.week_number}`}
                      </Text>
                      <View style={{}}>
                        <IconMaterialIcons
                          name="keyboard-arrow-down"
                          color={'#000'}
                          size={24}
                        />
                      </View>
                    </TouchableOpacity>
                    {/**Graph data */}
                    <View style={{padding: 10, paddingTop: 0}}>
                      {/**Check if there's any data to show */}
                      {this.props.App.wallet_state_vars.focusedWeek_graphData.reduce(
                        (a, b) => a + b,
                        0,
                      ) > 0 ? (
                        <>
                          <XAxis
                            style={{
                              borderWidth: 1,
                              borderColor: '#F6F6F6',
                              backgroundColor: '#F6F6F6',
                              paddingRight: 10,
                              paddingTop: 6,
                              borderRadius: 3,
                            }}
                            data={
                              this.props.App.wallet_state_vars
                                .focusedWeek_graphData
                            }
                            formatLabel={(_, index) =>
                              `${this.props.App.wallet_state_vars.focusedWeek_graphData[index]}`
                            }
                            contentInset={{left: 30, right: 20}}
                            svg={{
                              fill: '#000',
                              fontFamily:
                                Platform.OS === 'android'
                                  ? 'UberMoveTextLight'
                                  : 'Uber Move Text Light',
                              fontSize: RFValue(11),
                            }}
                          />
                          <BarChart
                            style={{height: 200}}
                            data={
                              this.props.App.wallet_state_vars
                                .focusedWeek_graphData
                            }
                            svg={{fill}}
                            contentInset={{top: 30, bottom: 3}}>
                            <Grid
                              svg={{
                                strokeWidth: 0.5,
                                stroke: '#F6F6F6',
                              }}
                            />
                          </BarChart>
                          <XAxis
                            style={{
                              borderWidth: 1,
                              borderColor: '#F6F6F6',
                              backgroundColor: '#F6F6F6',
                              paddingRight: 10,
                              paddingTop: 6,
                              borderRadius: 5,
                            }}
                            data={
                              this.props.App.wallet_state_vars
                                .focusedWeek_graphData
                            }
                            formatLabel={(_, index) => daysOfWeek[index]}
                            contentInset={{left: 30, right: 20}}
                            svg={{
                              fill: '#000',
                              fontFamily:
                                Platform.OS === 'android'
                                  ? 'UberMoveTextLight'
                                  : 'Uber Move Text Light',
                              fontSize: RFValue(13),
                            }}
                          />
                        </>
                      ) : (
                        <View
                          style={{
                            height: 200,
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: '#F6F6F6',
                            borderRadius: 5,
                            marginTop: 10,
                          }}>
                          <Text
                            style={{
                              fontFamily:
                                Platform.OS === 'android'
                                  ? 'UberMoveTextRegular'
                                  : 'Uber Move Text',
                              fontSize: RFValue(15),
                              color: '#757575',
                            }}>
                            You're history is still empty.
                          </Text>
                        </View>
                      )}
                    </View>
                    <View style={{padding: 20}}>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          paddingBottom: 15,
                        }}>
                        <Text
                          style={{
                            fontFamily:
                              Platform.OS === 'android'
                                ? 'UberMoveTextMedium'
                                : 'Uber Move Text Medium',
                            fontSize: RFValue(14),
                            color: '#AFAFAF',
                            flex: 1,
                          }}>
                          Details
                        </Text>
                      </View>
                      <View
                        style={{
                          borderBottomWidth: 1,
                          borderColor: '#EEEEEE',
                          flexDirection: 'row',
                          alignItems: 'center',
                          paddingBottom: 15,
                        }}>
                        <Text
                          style={{
                            fontFamily:
                              Platform.OS === 'android'
                                ? 'UberMoveTextRegular'
                                : 'Uber Move Text',
                            fontSize: RFValue(16.5),
                            flex: 1,
                          }}>
                          Rides
                        </Text>
                        <Text
                          style={{
                            fontFamily:
                              Platform.OS === 'android'
                                ? 'UberMoveTextRegular'
                                : 'Uber Move Text',
                            fontSize: RFValue(16.5),
                            color: '#096ED4',
                          }}>
                          {
                            this.props.App.wallet_state_vars
                              .focusedWeekWalletInsights.total_rides
                          }
                        </Text>
                      </View>
                      <View
                        style={{
                          borderBottomWidth: 1,
                          borderColor: '#EEEEEE',
                          flexDirection: 'row',
                          alignItems: 'center',
                          paddingTop: 15,
                          paddingBottom: 15,
                        }}>
                        <Text
                          style={{
                            fontFamily:
                              Platform.OS === 'android'
                                ? 'UberMoveTextRegular'
                                : 'Uber Move Text',
                            fontSize: RFValue(16.5),
                            flex: 1,
                          }}>
                          Deliveries
                        </Text>
                        <Text
                          style={{
                            fontFamily:
                              Platform.OS === 'android'
                                ? 'UberMoveTextRegular'
                                : 'Uber Move Text',
                            fontSize: RFValue(16.5),
                            color: '#096ED4',
                          }}>
                          {
                            this.props.App.wallet_state_vars
                              .focusedWeekWalletInsights.total_deliveries
                          }
                        </Text>
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          paddingTop: 15,
                          paddingBottom: 5,
                        }}>
                        <Text
                          style={{
                            fontFamily:
                              Platform.OS === 'android'
                                ? 'UberMoveTextRegular'
                                : 'Uber Move Text',
                            fontSize: RFValue(16.5),
                            flex: 1,
                          }}>
                          Total earning
                        </Text>
                        <Text
                          style={{
                            fontFamily:
                              Platform.OS === 'android'
                                ? 'UberMoveTextMedium'
                                : 'Uber Move Text Medium',
                            fontSize: RFValue(16.5),
                            color: '#096ED4',
                          }}>
                          {`N$ ${this.props.App.wallet_state_vars.focusedWeekWalletInsights.total_earning}`}
                        </Text>
                      </View>
                      {/**---End */}
                    </View>
                    <View
                      style={{
                        backgroundColor: '#102C60',
                        flexDirection: 'row',
                        padding: 20,
                      }}>
                      <View style={{flex: 1}}>
                        <Text
                          style={{
                            fontFamily:
                              Platform.OS === 'android'
                                ? 'UberMoveTextMedium'
                                : 'Uber Move Text Medium',
                            fontSize: RFValue(14),
                            color: '#fff',
                          }}>
                          TaxiConnect commission
                        </Text>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                          }}>
                          <Text
                            style={{
                              fontFamily:
                                Platform.OS === 'android'
                                  ? 'UberMoveTextLight'
                                  : 'Uber Move Text Light',
                              fontSize: RFValue(14),
                              marginRight: 5,
                              color: '#fff',
                            }}>
                            Learn more
                          </Text>
                          <IconAnt
                            name="arrowright"
                            size={16}
                            style={{top: 1, color: '#fff'}}
                          />
                        </View>
                      </View>
                      <View style={{}}>
                        <Text
                          style={{
                            fontFamily:
                              Platform.OS === 'android'
                                ? 'UberMoveTextMedium'
                                : 'Uber Move Text Medium',
                            fontSize: RFValue(17),
                            color: '#fff',
                          }}>
                          {`N$${
                            this.props.App.wallet_state_vars
                              .focusedWeekWalletInsights.total_earning +
                            this.props.App.wallet_state_vars
                              .focusedWeekWalletInsights.total_earning_wallet -
                            this.props.App.wallet_state_vars
                              .focusedWeekWalletInsights
                              .total_earning_due_to_driver -
                            this.props.App.wallet_state_vars
                              .focusedWeekWalletInsights
                              .total_earning_due_to_driver_cash
                          }`}
                        </Text>
                      </View>
                    </View>
                    {/**Due to you final */}
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        paddingTop: 25,
                        paddingBottom: 15,
                        paddingLeft: 20,
                        paddingRight: 20,
                      }}>
                      <Text
                        style={{
                          fontFamily:
                            Platform.OS === 'android'
                              ? 'UberMoveTextMedium'
                              : 'Uber Move Text Medium',
                          fontSize: RFValue(16.5),
                          flex: 1,
                        }}>
                        Due to you
                      </Text>
                      <Text
                        style={{
                          fontFamily:
                            Platform.OS === 'android'
                              ? 'UberMoveTextMedium'
                              : 'Uber Move Text Medium',
                          fontSize: RFValue(17.5),
                          color: '#096ED4',
                        }}>
                        {`N$ ${this.props.App.wallet_state_vars.focusedWeekWalletInsights.total_earning_due_to_driver}`}
                      </Text>
                    </View>
                  </View>
                </ScrollView>
              </>
            ) : (
              <View style={{flex: 1}}>
                <GenericLoader active={true} thickness={4} />
              </View>
            )
          ) : (
            <ScrollView
              refreshControl={
                <RefreshControl
                  onRefresh={() => this.refreshWalletDeepValues()}
                  refreshing={this.state.pullRefreshing}
                />
              }
              style={{
                flex: 1,
                padding: 20,
                paddingTop: '25%',
              }}>
              <View style={{alignItems: 'center', justifyContent: 'center'}}>
                <IconEntypo name="box" color={'#757575'} size={40} />
                <Text
                  style={{
                    fontFamily:
                      Platform.OS === 'android'
                        ? 'UberMoveTextRegular'
                        : 'Uber Move Text',
                    fontSize: RFValue(15),
                    color: '#757575',
                    color: '#757575',
                    flex: 1,
                    textAlign: 'center',
                    marginTop: 20,
                  }}>
                  Looks like your wallet history is empty.
                </Text>
              </View>
            </ScrollView>
          )
        ) : this.state.loaderState && this.state.foundError === false ? (
          <View style={{flex: 1}}>
            <GenericLoader active={this.state.loaderState} thickness={4} />
          </View>
        ) : (
          <ScrollView
            refreshControl={
              <RefreshControl
                onRefresh={() => this.refreshWalletDeepValues()}
                refreshing={this.state.pullRefreshing}
              />
            }
            style={{
              flex: 1,
              padding: 20,
              paddingTop: '25%',
            }}>
            <View style={{alignItems: 'center', justifyContent: 'center'}}>
              <IconCommunity
                name="network-strength-1-alert"
                size={40}
                color={'#757575'}
              />
              <Text
                style={{
                  fontFamily:
                    Platform.OS === 'android'
                      ? 'UberMoveTextRegular'
                      : 'Uber Move Text',
                  fontSize: RFValue(15),
                  color: '#757575',
                  flex: 1,
                  textAlign: 'center',
                }}>
                Oups, we couldn't retrieve your wallet insights, please try
                again. later.
              </Text>
            </View>
          </ScrollView>
        )}
      </DismissKeyboard>
    );
  }
}

const styles = StyleSheet.create({
  mainWindow: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 5,
    paddingBottom: 50,
  },
  presentationWindow: {
    flex: 1,
  },
});

const mapStateToProps = (state) => {
  const {App} = state;
  return {App};
};

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      UpdateDeepWalletInsights,
      UpdateFocusedWeekDeepWalletInsights,
      UpdateErrorModalLog,
    },
    dispatch,
  );

export default React.memo(
  connect(mapStateToProps, mapDispatchToProps)(EarningsScreenEntry),
);
