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
  BackHandler,
  Platform,
  RefreshControl,
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
import WalletTransacRecords from './WalletTransacRecords';
import DismissKeyboard from '../Helpers/DismissKeyboard';
import {RFValue} from 'react-native-responsive-fontsize';
import GenericLoader from '../Modules/GenericLoader/GenericLoader';
import {FlatList, ScrollView} from 'react-native-gesture-handler';

class WalletEntry extends React.PureComponent {
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
    //...
    if (this.backHander !== null) {
      this.backHander.remove();
    }
    //...
    //Remove navigation event listener
    if (this._navigatorEvent !== false && this._navigatorEvent !== undefined) {
      this._navigatorEvent();
    }
  }

  componentDidMount() {
    let globalObject = this;
    this._isMounted = true;

    //? Add navigator listener - auto clean on focus
    globalObject.props.navigation.addListener('focus', () => {
      globalObject.refreshWalletValues();
    });

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
            loaderState: false,
            pullRefreshing: false,
          });
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
    this.setState({loaderState: true});
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
                    height: 200,
                    marginBottom: 15,
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      flex: 1,
                      alignItems: 'center',
                    }}>
                    <Text
                      style={{
                        flex: 1,
                        fontFamily:
                          Platform.OS === 'android'
                            ? 'UberMoveTextRegular'
                            : 'Uber Move Text',
                        fontSize: RFValue(17),
                        color: '#000',
                      }}>
                      Hey, {this.props.App.username}
                    </Text>
                  </View>
                  <View
                    style={{
                      flex: 1,
                      justifyContent: 'center',
                    }}>
                    <Text
                      style={[
                        {
                          fontFamily:
                            Platform.OS === 'android'
                              ? 'MoveBold'
                              : 'Uber Move Bold',
                          fontSize: RFValue(43),
                          color: '#000',
                        },
                      ]}>
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
                    <Text
                      style={{
                        fontFamily:
                          Platform.OS === 'android'
                            ? 'UberMoveTextLight'
                            : 'Uber Move Text Light',
                        color: '#000',
                        fontSize: RFValue(16),
                      }}>
                      Your balance
                    </Text>
                  </View>
                </View>
                <View
                  style={{
                    flex: 1,
                    borderTopLeftRadius: 30,
                    borderTopRightRadius: 30,
                    backgroundColor: '#fff',
                    borderWidth: 1,
                    borderColor: '#d0d0d0',
                    borderBottomColor: '#fff',
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      padding: 20,
                      paddingBottom: 20,
                      borderBottomWidth: 1,
                      borderBottomColor: '#E2E2E2',
                    }}>
                    {/**Payment notice */}
                    <View style={{flexDirection: 'row', flex: 1}}>
                      <IconMaterialIcons
                        name="info"
                        size={20}
                        style={{top: 2.5, marginRight: 5}}
                      />
                      <View>
                        <Text
                          style={{
                            fontFamily:
                              Platform.OS === 'android'
                                ? 'UberMoveTextRegular'
                                : 'Uber Move Text',
                            fontSize: RFValue(16),
                          }}>
                          Payment scheduled for the
                        </Text>
                        <Text
                          style={{
                            fontFamily:
                              Platform.OS === 'android'
                                ? 'UberMoveBold'
                                : 'Uber Move Bold',
                            fontSize: RFValue(16),
                            marginTop: 7,
                          }}>
                          {nextPaymentDate}
                        </Text>
                      </View>
                    </View>
                  </View>
                  <View
                    style={{
                      padding: 20,
                      flex: 1,
                      marginTop: 10,
                      paddingBottom: 40,
                    }}>
                    {/**Comission */}
                    <TouchableOpacity
                      onPress={() =>
                        this.props.navigation.navigate('SummaryWallet')
                      }
                      style={{
                        flexDirection: 'row',
                        marginBottom: 20,
                      }}>
                      <View style={{marginRight: 5}}>
                        <IconIonic name="square" size={24} />
                      </View>
                      <View style={{flex: 1}}>
                        <Text
                          style={{
                            fontFamily:
                              Platform.OS === 'android'
                                ? 'UberMoveTextMedium'
                                : 'Uber Move Text Medium',
                            fontSize: RFValue(18),
                            color: '#0e8491',
                          }}>
                          Summary
                        </Text>
                        <Text
                          style={{
                            fontFamily:
                              Platform.OS === 'android'
                                ? 'UberMoveTextLight'
                                : 'Uber Move Text Light',
                            fontSize: RFValue(15),
                          }}>
                          Quick overview of your wallet.
                        </Text>
                      </View>
                    </TouchableOpacity>
                    {/**Earnings */}
                    <TouchableOpacity
                      onPress={() =>
                        this.props.navigation.navigate('EarningsScreenEntry')
                      }
                      style={{
                        borderTopWidth: 1,
                        borderColor: '#EEEEEE',
                        borderBottomWidth: 1,
                        borderColor: '#EEEEEE',
                        flexDirection: 'row',
                        paddingTop: 15,
                        paddingBottom: 20,
                      }}>
                      <View style={{marginRight: 5}}>
                        <IconFoundation name="graph-bar" size={24} />
                      </View>
                      <View style={{flex: 1}}>
                        <Text
                          style={{
                            fontFamily:
                              Platform.OS === 'android'
                                ? 'UberMoveTextMedium'
                                : 'Uber Move Text Medium',
                            fontSize: RFValue(18),
                            color: '#0e8491',
                          }}>
                          Earnings
                        </Text>
                        <Text
                          style={{
                            fontFamily:
                              Platform.OS === 'android'
                                ? 'UberMoveTextLight'
                                : 'Uber Move Text Light',
                            fontSize: RFValue(15),
                          }}>
                          View more details about your weekly earnings.
                        </Text>
                      </View>
                    </TouchableOpacity>
                    {/** Payments history */}
                    <TouchableOpacity
                      onPress={() =>
                        this.props.navigation.navigate(
                          'ShowAllTransactionsEntry',
                        )
                      }
                      style={{
                        borderTopWidth: 1,
                        borderColor: '#EEEEEE',
                        borderBottomWidth: 1,
                        borderColor: '#EEEEEE',
                        flexDirection: 'row',
                        paddingTop: 15,
                        paddingBottom: '10%',
                      }}>
                      <View style={{marginRight: 5, top: 1}}>
                        <IconCommunity
                          name="clock-time-ten-outline"
                          size={23}
                        />
                      </View>
                      <View style={{flex: 1}}>
                        <Text
                          style={{
                            fontFamily:
                              Platform.OS === 'android'
                                ? 'UberMoveTextMedium'
                                : 'Uber Move Text Medium',
                            fontSize: RFValue(18),
                            color: '#0e8491',
                          }}>
                          Wallet payout
                        </Text>
                        <Text
                          style={{
                            fontFamily:
                              Platform.OS === 'android'
                                ? 'UberMoveTextLight'
                                : 'Uber Move Text Light',
                            fontSize: RFValue(15),
                          }}>
                          View all the individual transactions made to your
                          wallet.
                        </Text>
                      </View>
                    </TouchableOpacity>
                    {/** Automatic payment notice */}
                    <TouchableOpacity
                      style={{
                        flexDirection: 'row',
                        paddingTop: 20,
                      }}>
                      <View style={{marginRight: 5, top: 6}}>
                        <IconCommunity name="circle" size={10} />
                      </View>
                      <View style={{flex: 1}}>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                          }}>
                          <Text
                            style={{
                              fontFamily:
                                Platform.OS === 'android'
                                  ? 'UberMoveTextMedium'
                                  : 'Uber Move Text Medium',
                              fontSize: RFValue(15),
                              color: '#000',
                              flex: 1,
                            }}>
                            Automatic payments
                          </Text>
                          <IconCommunity
                            name="close"
                            size={20}
                            color={'#b22222'}
                          />
                        </View>
                        <Text
                          style={{
                            fontFamily:
                              Platform.OS === 'android'
                                ? 'UberMoveTextLight'
                                : 'Uber Move Text Light',
                            fontSize: RFValue(15),
                            color: '#0e8491',
                          }}>
                          Learn more.
                        </Text>
                      </View>
                    </TouchableOpacity>
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
  connect(mapStateToProps, mapDispatchToProps)(WalletEntry),
);
