import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {UpdateErrorModalLog} from '../Redux/HomeActionsCreators';
import {systemWeights} from 'react-native-typography';
import IconAnt from 'react-native-vector-icons/AntDesign';
import IconCommunity from 'react-native-vector-icons/MaterialCommunityIcons';
import IconMaterialIcons from 'react-native-vector-icons/MaterialIcons';
import IconFontAwesome from 'react-native-vector-icons/FontAwesome';
import IconFeather from 'react-native-vector-icons/Feather';
import GenericRequestTemplate from '../Modules/GenericRequestTemplate';
import GenericLoader from '../Modules/GenericLoader/GenericLoader';
import NetInfo from '@react-native-community/netinfo';
import ErrorModal from '../Helpers/ErrorModal';

class Home extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      loaderState: false,
      networkStateChecker: false,
    };
  }

  async componentDidMount() {
    let globalObject = this;
    //Get initial rides - set default: past (always)

    //Network state checker
    this.state.networkStateChecker = NetInfo.addEventListener((state) => {
      if (state.isConnected === false) {
        globalObject.props.UpdateErrorModalLog(
          state.isConnected,
          'connection_no_network',
          state.type,
        );
        globalObject.setState({loaderState: false});
      } //connected
      else {
        globalObject.props.UpdateErrorModalLog(false, false, state.type);
      }

      console.log('Connection type', state.type);
      console.log('Is connected?', state.isConnected);
    });

    //connection
    this.props.App.socket.on('connect', () => {
      globalObject.props.UpdateErrorModalLog(false, false, 'any');
    });
    //Socket error handling
    this.props.App.socket.on('error', (error) => {
      //console.log('something');
    });
    this.props.App.socket.on('disconnect', () => {
      //console.log('something');
      globalObject.props.App.socket.connect();
    });
    this.props.App.socket.on('connect_error', () => {
      console.log('connect_error');
      //Ask for the OTP again
      globalObject.props.UpdateErrorModalLog(
        true,
        'connection_no_network',
        'any',
      );
      globalObject.props.App.socket.connect();
    });
    this.props.App.socket.on('connect_timeout', () => {
      console.log('connect_timeout');
      globalObject.props.App.socket.connect();
    });
    this.props.App.socket.on('reconnect', () => {
      ////console.log('something');
    });
    this.props.App.socket.on('reconnect_error', () => {
      console.log('reconnect_error');
      globalObject.props.App.socket.connect();
    });
    this.props.App.socket.on('reconnect_failed', () => {
      console.log('reconnect_failed');
      globalObject.props.App.socket.connect();
    });

    /**
     * SOCKET.IO RESPONSES
     */
  }

  /**
   * @function renderHeaderMainHome
   * Responsible for rendering the headder part of the home screen based on if the app is in normal or navigation
   * mode.
   */
  renderHeaderMainHome() {
    //DDEBUG
    this.props.App.isApp_inNavigation_mode = true;
    //DEBUG---

    if (this.props.App.isApp_inNavigation_mode) {
      //Navigation mode on
      return (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            padding: 20,
            paddingTop: 15,
            paddingBottom: 15,
            backgroundColor: 'transparent',
          }}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <View
              style={{
                top: 1.5,
                backgroundColor: '#fff',
                width: 45,
                height: 45,
                borderRadius: 150,
                alignItems: 'center',
                justifyContent: 'center',
                shadowColor: '#000',
                shadowOffset: {
                  width: 0,
                  height: 4,
                },
                shadowOpacity: 0.32,
                shadowRadius: 5.46,

                elevation: 9,
              }}>
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
                shadowColor: '#000',
                shadowOffset: {
                  width: 0,
                  height: 4,
                },
                shadowOpacity: 0.32,
                shadowRadius: 5.46,

                elevation: 9,
              }}>
              <IconFontAwesome
                name="location-arrow"
                color="#096ED4"
                size={22}
              />
            </View>
          </View>
        </View>
      );
    } //In normal mode
    else {
      return (
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
      );
    }
  }

  /**
   * @function renderCenterMainHome
   * Responsible for rendering the center part of the home screen based on if the app is in normal or navigation
   * mode.
   */
  renderCenterMainHome() {
    //DDEBUG
    this.props.App.isApp_inNavigation_mode = true;
    //DEBUG---

    if (this.props.App.isApp_inNavigation_mode) {
      //Navigation on - hide request list
      return null;
    } //Navigation off - show requests list
    else {
      return (
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
      );
    }
  }

  /**
   * @function renderFooterMainHome
   * Responsible for rendering the footer part of the home screen based on if the app is in normal or navigation
   * mode.
   */
  renderFooterMainHome() {
    //DDEBUG
    this.props.App.isApp_inNavigation_mode = true;
    //DEBUG---

    if (this.props.App.isApp_inNavigation_mode) {
      //Navigation on - hide footer
      return null;
    } //Navigation off - show footer
    else {
      return (
        <TouchableOpacity
          onPress={() =>
            this.props.UpdateErrorModalLog(
              true,
              'show_select_ride_type_modal',
              'any',
            )
          }
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
                size={10}
                style={{top: 1, marginRight: 5}}
              />
              <Text
                style={{
                  fontFamily: 'Allrounder-Grotesk-Regular',
                  fontSize: 17,
                }}>
                {this.props.App.shownRides_types}
              </Text>
            </View>
            <IconMaterialIcons
              name="keyboard-arrow-down"
              color={'#000'}
              size={22}
            />
          </View>
        </TouchableOpacity>
      );
    }
  }

  /**
   * @func renderMainComponent
   * Responsible for rendering the main view of the driver app
   */
  renderMainComponent() {
    return (
      <View style={styles.mainInsideComponent}>
        <ErrorModal
          active={this.props.App.generalErrorModal_vars.showErrorGeneralModal}
          error_status={
            this.props.App.generalErrorModal_vars.generalErrorModalType
          }
          parentNode={this}
        />
        {this.renderHeaderMainHome()}
        <GenericLoader
          active={this.state.loaderState}
          backgroundColor={'#f0f0f0'}
        />
        {/**Show the request list ONLY in NORMAL MODDE */}
        {this.renderCenterMainHome()}

        {/**Footer part */}
        {this.renderFooterMainHome()}
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
    backgroundColor: '#f0f0f0',
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
    },
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchToProps)(Home);
