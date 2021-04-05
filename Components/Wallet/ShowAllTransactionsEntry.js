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
  RefreshControl,
  ScrollView,
} from 'react-native';
import {UpdateTotalWalletAmount} from '../Redux/HomeActionsCreators';
import WalletTransacRecords from './WalletTransacRecords';
import DismissKeyboard from '../Helpers/DismissKeyboard';
import IconEntypo from 'react-native-vector-icons/Entypo';
import {FlatList} from 'react-native-gesture-handler';
import GenericLoader from '../Modules/GenericLoader/GenericLoader';
import {RFValue} from 'react-native-responsive-fontsize';

class ShowAllTransactionsEntry extends React.PureComponent {
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
        console.log('focused');
        globalObject.refreshWalletValues();
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
     * @socket getRiders_walletInfos_io-response
     * Get total wallet balance
     * Responsible for only getting the total current balance of the rider and update the global state if different.
     */
    this.props.App.socket.on(
      'getRiders_walletInfos_io-response',
      function (response) {
        if (
          response !== null &&
          response !== undefined &&
          response.total !== undefined
        ) {
          //...
          globalObject.setState({loaderState: false, pullRefreshing: false});
          globalObject.props.UpdateTotalWalletAmount(response);
        }
      },
    );
  }

  /**
   * @func refreshWalletValues
   * Responsible for updating the wallet informations.
   */
  refreshWalletValues() {
    this.setState({loaderState: true, pullRefreshing: true});
    //2. Request for the total wallet balance
    this.props.App.socket.emit('getRiders_walletInfos_io', {
      user_fingerprint: this.props.App.user_fingerprint,
      mode: 'detailed',
      userType: 'driver',
    });
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <DismissKeyboard>
          {this.state.loaderState === false ? (
            this.props.App.wallet_state_vars.transactions_details !== null &&
            this.props.App.wallet_state_vars.transactions_details !==
              undefined ? (
              <SafeAreaView style={styles.mainWindow}>
                <StatusBar backgroundColor="#000" />
                <View style={styles.presentationWindow}>
                  <FlatList
                    refreshControl={
                      <RefreshControl
                        onRefresh={() => this.refreshWalletValues()}
                        refreshing={this.state.pullRefreshing}
                      />
                    }
                    data={this.props.App.wallet_state_vars.transactions_details}
                    initialNumToRender={15}
                    keyboardShouldPersistTaps={'always'}
                    maxToRenderPerBatch={35}
                    windowSize={61}
                    updateCellsBatchingPeriod={10}
                    keyExtractor={(item, index) => String(index)}
                    renderItem={({item}) => (
                      <WalletTransacRecords transactionDetails={item} />
                    )}
                  />
                </View>
              </SafeAreaView>
            ) : (
              <ScrollView
                refreshControl={
                  <RefreshControl
                    onRefresh={() => this.refreshWalletValues()}
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
                    Looks like your wallet payout is empty.
                  </Text>
                </View>
              </ScrollView>
            )
          ) : (
            <View style={{flex: 1}}>
              <GenericLoader active={this.state.loaderState} thickness={4} />
            </View>
          )}
        </DismissKeyboard>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainWindow: {
    flex: 1,
    backgroundColor: '#EEEEEE',
    padding: 5,
    paddingTop: 10,
  },
  presentationWindow: {
    flex: 1,
    padding: 10,
    paddingLeft: 5,
    paddingRight: 5,
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
    },
    dispatch,
  );

export default React.memo(
  connect(mapStateToProps, mapDispatchToProps)(ShowAllTransactionsEntry),
);
