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
  BackHandler,
  Linking,
  Platform,
  StatusBar,
} from 'react-native';
import {
  UpdateErrorModalLog,
  UpdateNavigationSystem,
} from '../Redux/HomeActionsCreators';
import IconCommunity from 'react-native-vector-icons/MaterialCommunityIcons';
import IconMaterialIcons from 'react-native-vector-icons/MaterialIcons';
import IconEntypo from 'react-native-vector-icons/Entypo';
import SyncStorage from 'sync-storage';
import ErrorModal from '../Helpers/ErrorModal';
import FastImage from 'react-native-fast-image';
import {RFValue} from 'react-native-responsive-fontsize';
import LaunchNavigator from 'react-native-launch-navigator';

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
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false; //! MARK AS UNMOUNTED
    //...
  }

  /**
   * @func update3rdPartyNavigator
   * Responsible for updating any 3rd party navigation system.
   * But also can assist the user in installing them if they are not yet present.
   * @param mapChoosed: the id string of the wanted map
   */
  async update3rdPartyNavigator(mapChoosed) {
    let globalObject = this;
    //Get the correct 3rd party map selected by the user.
    let thirdPartyMapIdentifyer = /google_maps/i.test(mapChoosed)
      ? LaunchNavigator.APP.GOOGLE_MAPS
      : /apple_maps/i.test(mapChoosed)
      ? LaunchNavigator.APP.APPLE_MAPS
      : /waze/i.test(mapChoosed)
      ? LaunchNavigator.APP.WAZE
      : Platform.OS === 'android'
      ? LaunchNavigator.APP.GOOGLE_MAPS
      : LaunchNavigator.APP.APPLE_MAPS;

    LaunchNavigator.isAppAvailable(thirdPartyMapIdentifyer).then(
      (is3rdPAvailable) => {
        if (is3rdPAvailable) {
          globalObject.props.UpdateNavigationSystem(mapChoosed);
          SyncStorage.set('@defaultNavigationSystem', mapChoosed); //Save permanently
        } else {
          //"3rd party map not available - falling back to default navigation app" - auto select Taxiconnect navigations but open the store to download the wanted map
          globalObject.props.UpdateNavigationSystem('taxiconnect_navigation');
          //? Open the store to download the map
          if (Platform.OS === 'android') {
            let mapToDownload = /google_maps/i.test(mapChoosed)
              ? 'com.google.android.apps.maps'
              : /waze/i.test(mapChoosed)
              ? 'com.waze'
              : 'com.waze'; //?Defaults to Waze
            //Playstore
            Linking.openURL(
              `https://play.google.com/store/apps/details?id=${mapToDownload}`,
            );
          } else {
            let mapToDownload = /google_maps/i.test(mapChoosed)
              ? 'id585027354'
              : /waze/i.test(mapChoosed)
              ? 'id323229106'
              : /apple_maps/i.test(mapChoosed)
              ? 'id915056765'
              : 'id323229106'; //?Defaults to Waze
            //App store
            Linking.openURL(`https://apps.apple.com/us/app/${mapToDownload}`);
          }
        }
      },
    );
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
              <View
                style={{
                  padding: 15,
                }}>
                <Text
                  style={{
                    fontFamily:
                      Platform.OS === 'android'
                        ? 'UberMoveTextLight'
                        : 'Uber Move Text Light',
                    fontSize: RFValue(15),
                  }}>
                  You can choose the settings that will help you achieve maximum
                  productivity
                </Text>
              </View>
              {/* Choose the navigation system */}
              <View
                style={{
                  paddingTop: 5,
                }}>
                <View style={{marginBottom: 10, padding: 15}}>
                  <Text
                    style={{
                      fontSize: RFValue(16),
                      fontFamily:
                        Platform.OS === 'android'
                          ? 'UberMoveTextMedium'
                          : 'Uber Move Text Medium',
                      color: '#AFAFAF',
                    }}>
                    Navigation system
                  </Text>
                </View>

                {/* TaxiConnect Navigations */}
                <TouchableOpacity
                  onPress={() =>
                    this.update3rdPartyNavigator('taxiconnect_navigation')
                  }
                  style={{
                    flexDirection: 'row',
                    paddingLeft: 15,
                    paddingRight: 15,
                    paddingTop: 5,
                    paddingBottom: 10,
                    alignItems: 'center',
                  }}>
                  <View style={{flex: 1}}>
                    <Text
                      style={{
                        fontFamily:
                          Platform.OS === 'android'
                            ? 'UberMoveTextMedium'
                            : 'Uber Move Text Medium',
                        fontSize: RFValue(17),
                        flex: 1,
                      }}>
                      TaxiConnect Navigation
                    </Text>
                    <Text
                      style={{
                        fontFamily:
                          Platform.OS === 'android'
                            ? 'UberMoveTextLight'
                            : 'Uber Move Text Light',
                        fontSize: RFValue(13),
                        flex: 1,
                        paddingTop: 5,
                      }}>
                      Default
                    </Text>
                  </View>
                  {/taxiconnect_navigation/i.test(
                    this.props.App.default_navigation_system,
                  ) ? (
                    <IconMaterialIcons name="check" color="#096ED4" size={25} />
                  ) : null}
                </TouchableOpacity>
                {/* Google Maps */}
                <TouchableOpacity
                  onPress={() => this.update3rdPartyNavigator('google_maps')}
                  style={{
                    borderTopWidth: 1,
                    borderColor: '#d0d0d0',
                    flexDirection: 'row',
                    paddingLeft: 15,
                    paddingRight: 15,
                    marginTop: 15,
                    paddingTop: 25,
                    paddingBottom: 10,
                    alignItems: 'center',
                  }}>
                  <View
                    style={{
                      flex: 1,
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <View style={{width: 30}}>
                      <IconCommunity name="google-maps" size={25} />
                    </View>
                    <Text
                      style={{
                        fontFamily:
                          Platform.OS === 'android'
                            ? 'UberMoveTextMedium'
                            : 'Uber Move Text Medium',
                        fontSize: RFValue(17),
                        flex: 1,
                      }}>
                      Google Maps
                    </Text>
                  </View>
                  {/google_maps/i.test(
                    this.props.App.default_navigation_system,
                  ) ? (
                    <IconMaterialIcons name="check" color="#096ED4" size={25} />
                  ) : null}
                </TouchableOpacity>

                {/* Apple Maps */}
                {/* {Platform.OS === 'ios' ? (
                  <TouchableOpacity
                    onPress={() => this.update3rdPartyNavigator('apple_maps')}
                    style={{
                      borderTopWidth: 1,
                      borderColor: '#d0d0d0',
                      flexDirection: 'row',
                      paddingLeft: 15,
                      paddingRight: 15,
                      marginTop: 20,
                      paddingTop: 25,
                      paddingBottom: 10,
                      alignItems: 'center',
                    }}>
                    <View
                      style={{
                        flex: 1,
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}>
                      <View style={{width: 30}}>
                        <IconCommunity name="apple" size={25} />
                      </View>
                      <Text
                        style={{
                          fontFamily:
                            Platform.OS === 'android'
                              ? 'UberMoveTextMedium'
                              : 'Uber Move Text Medium',
                          fontSize: RFValue(17),
                          flex: 1,
                        }}>
                        Apple Maps
                      </Text>
                    </View>
                    {/apple_maps/i.test(
                      this.props.App.default_navigation_system,
                    ) ? (
                      <IconMaterialIcons
                        name="check"
                        color="#096ED4"
                        size={25}
                      />
                    ) : null}
                  </TouchableOpacity>
                ) : null} */}

                {/* Waze */}
                <TouchableOpacity
                  onPress={() => this.update3rdPartyNavigator('waze')}
                  style={{
                    borderTopWidth: 1,
                    borderColor: '#d0d0d0',
                    flexDirection: 'row',
                    paddingLeft: 15,
                    paddingRight: 15,
                    marginTop: 20,
                    paddingTop: 25,
                    paddingBottom: 10,
                    alignItems: 'center',
                  }}>
                  <View
                    style={{
                      flex: 1,
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <View style={{width: 30}}>
                      <IconCommunity name="waze" size={25} />
                    </View>
                    <Text
                      style={{
                        fontFamily:
                          Platform.OS === 'android'
                            ? 'UberMoveTextMedium'
                            : 'Uber Move Text Medium',
                        fontSize: RFValue(17),
                        flex: 1,
                      }}>
                      Waze
                    </Text>
                  </View>
                  {/waze/i.test(this.props.App.default_navigation_system) ? (
                    <IconMaterialIcons name="check" color="#096ED4" size={25} />
                  ) : null}
                </TouchableOpacity>
              </View>
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
      UpdateNavigationSystem,
    },
    dispatch,
  );

export default React.memo(
  connect(mapStateToProps, mapDispatchToProps)(SettingsEntryScreen),
);
