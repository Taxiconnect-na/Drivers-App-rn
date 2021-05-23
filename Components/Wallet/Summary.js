import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  RefreshControl,
  Platform,
} from 'react-native';
import {
  UpdateTotalWalletAmount,
  UpdateDeepWalletInsights,
  UpdateFocusedWeekDeepWalletInsights,
} from '../Redux/HomeActionsCreators';
import IconMaterialIcons from 'react-native-vector-icons/MaterialIcons';
import IconFoundation from 'react-native-vector-icons/Foundation';
import IconIonic from 'react-native-vector-icons/Ionicons';
import IconCommunity from 'react-native-vector-icons/MaterialCommunityIcons';
import DismissKeyboard from '../Helpers/DismissKeyboard';
import {RFValue} from 'react-native-responsive-fontsize';
import GenericLoader from '../Modules/GenericLoader/GenericLoader';
import {FlatList, ScrollView} from 'react-native-gesture-handler';

class Summary extends React.PureComponent {
  constructor(props) {
    super(props);

    this._isMounted = true; //! RESPONSIBLE TO LOCK PROCESSES IN THE MAIN SCREEN WHEN UNMOUNTED.

    //Handlers
    this.backHander = null;
    this._navigatorEvent = null;

    this.state = {
      loaderState: true,
      pullRefreshing: false, //To know whether the refresh control is active or not - default: falsee
    };
  }

  componentWillUnmount() {
    this._isMounted = false; //! MARK AS UNMOUNTED
  }

  componentDidMount() {
    let globalObject = this;
    this._isMounted = true;

    //? Add navigator listener - auto clean on focus
    globalObject.props.navigation.addListener('focus', () => {
      globalObject.refreshWalletValues();
    });

    //1. Handles the deep insights for the driver's wallet
    this.props.App.socket.on(
      'getDrivers_walletInfosDeep_io-response',
      function (response) {
        if (
          response !== undefined &&
          response !== null &&
          response.weeks_view !== undefined
        ) {
          globalObject.setState({loaderState: false, pullRefreshing: false});
          if (response.header !== undefined && response.header !== null) {
            if (
              response.header !== undefined &&
              response.header !== null &&
              response.header.scheduled_payment_date !== undefined &&
              response.header.scheduled_payment_date !== null
            ) {
              //Has some data
              //Update the global state vars
              //! Update  the global date and autofocus to the current week
              globalObject.props.UpdateDeepWalletInsights(response);
              //! Auto focus to this week - default: Choose the current week
              globalObject.props.UpdateFocusedWeekDeepWalletInsights(0);
            } //Reload
            else {
              globalObject.refreshWalletValues();
            }
          } //No data found
          else {
            //DO NOTHING
          }
          //? Update the global var
        } //Error
        else {
          globalObject.setState({
            loaderState: false,
          });
        }
      },
    );
  }

  /**
   * @func refreshWalletValues
   * Responsible for updating the wallet informations.
   */
  refreshWalletValues() {
    this.props.App.socket.emit('getDrivers_walletInfosDeep_io', {
      user_fingerprint: this.props.App.user_fingerprint,
    });
  }

  /**
   * @func doRefreshWalletValues
   * Responsible for updating the wallet informations.
   */
  doRefreshWalletValues() {
    this.setState({loaderState: true, pullRefreshing: true});
    this.props.App.socket.emit('getDrivers_walletInfosDeep_io', {
      user_fingerprint: this.props.App.user_fingerprint,
    });
  }

  render() {
    //? Format the payment date schedule
    let nextPaymentDate = '...';
    if (
      this.props.App.wallet_state_vars.deepWalletInsights !== null &&
      this.props.App.wallet_state_vars.deepWalletInsights !== undefined &&
      this.props.App.wallet_state_vars.deepWalletInsights.header !== null &&
      this.props.App.wallet_state_vars.deepWalletInsights.header !==
        undefined &&
      this.props.App.wallet_state_vars.deepWalletInsights.header
        .scheduled_payment_date !== undefined &&
      this.props.App.wallet_state_vars.deepWalletInsights.header
        .scheduled_payment_date !== null
    ) {
      let tmpDate = new Date(
        this.props.App.wallet_state_vars.deepWalletInsights.header.scheduled_payment_date,
      );
      //...
      nextPaymentDate = tmpDate.toDateString();
    }

    return (
      <>
        {this._isMounted ? (
          <DismissKeyboard>
            <ScrollView
              style={styles.mainWindow}
              refreshControl={
                <RefreshControl
                  onRefresh={() => this.doRefreshWalletValues()}
                  refreshing={this.state.pullRefreshing}
                />
              }>
              {Platform.OS === 'android' ? (
                <StatusBar backgroundColor="#000" barStyle={'light-content'} />
              ) : (
                <StatusBar barStyle={'dark-content'} />
              )}
              <View style={styles.presentationWindow}>
                <GenericLoader
                  active={this.state.loaderState}
                  thickness={4}
                  color={this.state.loaderState ? '#0e8491' : '#fff'}
                  backgroundColor={this.state.loaderState ? '#0e8491' : '#fff'}
                />
                <View
                  style={{
                    padding: 20,
                    paddingTop: 0,
                    backgroundColor: '#fff',
                    marginBottom: 15,
                  }}>
                  <Text
                    style={{
                      fontFamily:
                        Platform.OS === 'android'
                          ? 'UberMoveTextLight'
                          : 'Uber Move Text Light',
                      color: '#000',
                      fontSize: RFValue(15),
                      lineHeight: 25,
                    }}>
                    Here is a quick overview of your wallet and the TaxiConnect
                    commission.
                  </Text>
                  <View
                    style={{
                      marginTop: '5%',
                      borderBottomWidth: 1,
                      borderBottomColor: '#d0d0d0',
                      paddingBottom: 15,
                    }}>
                    <Text
                      style={{
                        fontFamily:
                          Platform.OS === 'android'
                            ? 'UberMoveTextMedium'
                            : 'Uber Move Text Medium',
                        color: '#000',
                        fontSize: RFValue(16),
                        lineHeight: 25,
                      }}>
                      Due to you
                    </Text>
                    <Text
                      style={{
                        fontFamily:
                          Platform.OS === 'android'
                            ? 'UberMoveBold'
                            : 'Uber Move Bold',
                        color: '#000',
                        fontSize: RFValue(30),
                        marginTop: 10,
                      }}>
                      {`N$${
                        this.props.App.wallet_state_vars.deepWalletInsights !==
                          null &&
                        this.props.App.wallet_state_vars.deepWalletInsights !==
                          undefined &&
                        this.props.App.wallet_state_vars.deepWalletInsights
                          .header !== null &&
                        this.props.App.wallet_state_vars.deepWalletInsights
                          .header !== undefined &&
                        this.props.App.wallet_state_vars.deepWalletInsights
                          .header.remaining_due_to_driver !== undefined &&
                        this.props.App.wallet_state_vars.deepWalletInsights
                          .header.remaining_due_to_driver !== null
                          ? Math.floor(
                              this.props.App.wallet_state_vars
                                .deepWalletInsights.header
                                .remaining_due_to_driver,
                            )
                          : 0
                      }`}
                    </Text>
                  </View>
                  {/**Commission */}
                  <View
                    style={{
                      marginTop: '5%',
                    }}>
                    <Text
                      style={{
                        fontFamily:
                          Platform.OS === 'android'
                            ? 'UberMoveTextMedium'
                            : 'Uber Move Text Medium',
                        color: '#000',
                        fontSize: RFValue(16),
                        lineHeight: 25,
                      }}>
                      TaxiConnect commission
                    </Text>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginTop: 10,
                      }}>
                      <Text
                        style={{
                          fontFamily:
                            Platform.OS === 'android'
                              ? 'UberMoveBold'
                              : 'Uber Move Bold',
                          color: '#000',
                          fontSize: RFValue(25),
                          color: '#0e8491',
                          flex: 1,
                        }}>
                        {`N$${
                          this.props.App.wallet_state_vars
                            .deepWalletInsights !== null &&
                          this.props.App.wallet_state_vars
                            .deepWalletInsights !== undefined &&
                          this.props.App.wallet_state_vars.deepWalletInsights
                            .header !== null &&
                          this.props.App.wallet_state_vars.deepWalletInsights
                            .header !== undefined &&
                          this.props.App.wallet_state_vars.deepWalletInsights
                            .header.remaining_commission !== undefined &&
                          this.props.App.wallet_state_vars.deepWalletInsights
                            .header.remaining_commission !== null
                            ? Math.ceil(
                                this.props.App.wallet_state_vars
                                  .deepWalletInsights.header
                                  .remaining_commission,
                              )
                            : 0
                        }`}
                      </Text>
                      {/**Pending sign */}
                      {this.props.App.wallet_state_vars.deepWalletInsights !==
                        null &&
                      this.props.App.wallet_state_vars.deepWalletInsights !==
                        undefined &&
                      this.props.App.wallet_state_vars.deepWalletInsights
                        .header !== null &&
                      this.props.App.wallet_state_vars.deepWalletInsights
                        .header !== undefined &&
                      this.props.App.wallet_state_vars.deepWalletInsights.header
                        .remaining_commission !== undefined &&
                      this.props.App.wallet_state_vars.deepWalletInsights.header
                        .remaining_commission !== null ? (
                        parseFloat(
                          this.props.App.wallet_state_vars.deepWalletInsights
                            .header.remaining_commission,
                        ) > 0 ? (
                          <View
                            style={{
                              backgroundColor: '#E24837',
                              width: 100,
                              alignItems: 'center',
                              justifyContent: 'center',
                              textAlign: 'center',
                              borderRadius: 50,
                              height: 30,
                            }}>
                            <Text
                              style={{
                                fontFamily:
                                  Platform.OS === 'android'
                                    ? 'UberMoveTextRegular'
                                    : 'Uber Move Text',
                                color: '#000',
                                fontSize: RFValue(15),
                                lineHeight: 25,
                                color: '#fff',
                              }}>
                              Pending
                            </Text>
                          </View>
                        ) : null
                      ) : null}
                    </View>
                  </View>
                  {/**Next payment date */}
                  <View
                    style={{
                      marginTop: '8%',
                    }}>
                    <Text
                      style={{
                        fontFamily:
                          Platform.OS === 'android'
                            ? 'UberMoveTextMedium'
                            : 'Uber Move Text Medium',
                        color: '#000',
                        fontSize: RFValue(16),
                        lineHeight: 25,
                        color: '#858585',
                      }}>
                      Payment date
                    </Text>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginTop: 10,
                      }}>
                      <Text
                        style={{
                          fontFamily:
                            Platform.OS === 'android'
                              ? 'UberMoveBold'
                              : 'Uber Move Bold',
                          color: '#000',
                          fontSize: RFValue(17),
                          color: '#000',
                          flex: 1,
                        }}>
                        {nextPaymentDate}
                      </Text>
                    </View>
                    {/**Notice */}
                    <View style={{marginTop: '8%'}}>
                      <Text
                        style={{
                          fontFamily:
                            Platform.OS === 'android'
                              ? 'UberMoveTextRegular'
                              : 'Uber Move Text',
                          color: '#858585',
                          fontSize: RFValue(13.5),
                        }}>
                        It is important to note that failure to pay the
                        commission at the payment date or 2 days after the
                        payment date will result in your account being
                        temporarily suspended.
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </ScrollView>
          </DismissKeyboard>
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
  selectMenu3: {
    borderWidth: 1,
    width: 70,
    height: 70,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 300,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,
    elevation: 9,
  },
  textSelectMenu3: {
    fontFamily:
      Platform.OS === 'android'
        ? 'UberMoveTextMedium'
        : 'Uber Move Text Medium',
    fontSize: RFValue(17),
    marginTop: 15,
  },
});

const mapStateToProps = (state) => {
  const {App} = state;
  return {App};
};

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      UpdateTotalWalletAmount,
      UpdateDeepWalletInsights,
      UpdateFocusedWeekDeepWalletInsights,
    },
    dispatch,
  );

export default React.memo(
  connect(mapStateToProps, mapDispatchToProps)(Summary),
);
