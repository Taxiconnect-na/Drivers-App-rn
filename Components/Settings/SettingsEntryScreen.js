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
  Platform,
  StatusBar,
} from 'react-native';
import {UpdateErrorModalLog} from '../Redux/HomeActionsCreators';
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
  }

  componentDidMount() {
    let globalObject = this;
    this._isMounted = true;

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
  }

  componentWillUnmount() {
    this._isMounted = false; //! MARK AS UNMOUNTED
    //...
    /*if (this.backHander !== null) {
      this.backHander.remove();
    }
    //...
    if (this.backListener !== null) {
      this.backListener = null;
    }*/
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

  render() {
    return (
      <>
        {this._isMounted ? (
          <SafeAreaView style={styles.mainWindow}>
            {this.props.App.generalErrorModal_vars.showErrorGeneralModal
              ? this.renderError_modalView()
              : null}
            <StatusBar backgroundColor="#000" barStyle={'light-content'} />
            <ScrollView style={styles.presentationWindow}>
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
                          ? 'MoveMedium'
                          : 'Uber Move Medium',
                      fontSize: RFValue(19),
                    }}>
                    {`${this.props.App.username} ${
                      this.props.App.surname !== undefined &&
                      this.props.App.surname !== null
                        ? this.props.surname
                        : ''
                    }`}
                  </Text>
                </View>
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
    },
    dispatch,
  );

export default React.memo(
  connect(mapStateToProps, mapDispatchToProps)(SettingsEntryScreen),
);
