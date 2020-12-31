import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {
  Animated,
  MapView,
  Camera,
  UserLocation,
  ShapeSource,
  SymbolLayer,
  CircleLayer,
  PointAnnotation,
  MarkerView,
} from '@react-native-mapbox-gl/maps';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  PermissionsAndroid,
  Image,
} from 'react-native';
import GeolocationP from 'react-native-geolocation-service';
import {
  UpdateErrorModalLog,
  UpdateGrantedGRPS,
} from '../Redux/HomeActionsCreators';
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
    this.requestGPSPermission();
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

  componentDidUpdate() {
    this.getCurrentPositionCusto;
  }

  /**
   * @func getCurrentPositionCusto()
   * void
   * Get the current GPRS positions of the user
   */

  getCurrentPositionCusto = () => {
    let globalObject = this;
    GeolocationP.getCurrentPosition(
      (position) => {
        console.log(position);
        globalObject.props.App.latitude = position.coords.latitude;
        globalObject.props.App.longitude = position.coords.longitude;
        //---
        //Get user location
        /*globalObject.props.App.socket.emit('geocode-this-point', {
          latitude: globalObject.props.App.latitude,
          longitude: globalObject.props.App.longitude,
          user_fingerprint: globalObject.props.App.user_fingerprint,
        });*/
      },
      (error) => {
        //...
      },
      {
        timeout: 10,
        maximumAge: 1000,
        distanceFilter: 3,
        enableHighAccuracy: true,
      },
    );
  };

  /**
   * @func requestGPSPermission()
   * Responsible for getting the permission to the GPRS location for the user and
   * lock them from useing the app without the proper GPRS permissions.
   *
   */
  async requestGPSPermission(activateRest = true) {
    let globalObject = this;
    if (this.props.App.gprsGlobals.didAskForGprs === false) {
      this.props.App.gprsGlobals.didAskForGprs = true;
      //Ask only once at start
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message: 'TaxiConnect needs access to your location',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          if (activateRest) {
            globalObject.getCurrentPositionCusto();
            GeolocationP.getCurrentPosition(
              (position) => {
                globalObject.props.App.latitude = position.coords.latitude;
                globalObject.props.App.longitude = position.coords.longitude;
                //Update GPRS permission global var
                let newStateVars = {};
                newStateVars.hasGPRSPermissions = true;
                newStateVars.didAskForGprs = true;
                globalObject.props.UpdateGrantedGRPS(newStateVars);
                //Launch recalibration
                //globalObject.recalibrateMap();
              },
              (error) => {
                // See error code charts below.
                //Launch recalibration
                //globalObject.recalibrateMap();
              },
              {enableHighAccuracy: true, timeout: 10000, maximumAge: 3000},
            );
            globalObject.props.App.isMapPermitted = true;
            GeolocationP.getCurrentPosition(
              (position) => {
                globalObject.props.App.latitude = position.coords.latitude;
                globalObject.props.App.longitude = position.coords.longitude;
                //Update GPRS permission global var
                let newStateVars = {};
                newStateVars.hasGPRSPermissions = true;
                newStateVars.didAskForGprs = true;
                globalObject.props.UpdateGrantedGRPS(newStateVars);
                //Launch recalibration
                //globalObject.recalibrateMap();
              },
              (error) => {},
              {enableHighAccuracy: true, timeout: 10000, maximumAge: 3000},
            );
          }
        } else {
          console.log('GPS permission denied');
          //Permission denied, update gprs global vars and lock the platform
          let newStateVars = {};
          newStateVars.hasGPRSPermissions = false;
          newStateVars.didAskForGprs = true;
          globalObject.props.UpdateGrantedGRPS(newStateVars);
        }
      } catch (err) {
        //console.warn(err);
        //Permission denied, update gprs global vars and lock the platform
        let newStateVars = {};
        newStateVars.hasGPRSPermissions = false;
        newStateVars.didAskForGprs = true;
        globalObject.props.UpdateGrantedGRPS(newStateVars);
        //Close loading animation
        //globalObject.resetAnimationLoader();
      }
    } //Lock the interface
    else {
      //Check if the permission was given or not
      if (this.props.App.gprsGlobals.hasGPRSPermissions) {
        //Has the GPRS permissions
        let newStateVars = {};
        newStateVars.hasGPRSPermissions = true;
        newStateVars.didAskForGprs = true;
        globalObject.props.UpdateGrantedGRPS(newStateVars);
        //Launch recalibration
        //globalObject.recalibrateMap();
      } //No permissions
      else {
        //Permission denied, update gprs global vars and lock the platform
        let newStateVars = {};
        newStateVars.hasGPRSPermissions = false;
        newStateVars.didAskForGprs = true;
        globalObject.props.UpdateGrantedGRPS(newStateVars);
        //Close loading animation
        //globalObject.resetAnimationLoader();
      }
    }
  }

  /**
   * @function renderHeaderMainHome
   * Responsible for rendering the headder part of the home screen based on if the app is in normal or navigation
   * mode.
   */
  renderHeaderMainHome() {
    if (this.props.App.main_interfaceState_vars.isApp_inNavigation_mode) {
      //Navigation mode on
      if (this.props.App.main_interfaceState_vars.isRideInProgress) {
        //A ride is in progress actively in navigation mode
        return (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              padding: 20,
              paddingTop: 15,
              paddingBottom: 15,
              position: 'absolute',
              top: 0,
              zIndex: 900000000,
            }}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <TouchableOpacity
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
              </TouchableOpacity>
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
                    shadowOpacity: 0.43,
                    shadowRadius: 9.51,

                    elevation: 15,
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
                  width: 40,
                  height: 40,
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
      } //No ride in progress actively in navigation mode
      else {
        return (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              padding: 20,
              paddingTop: 15,
              paddingBottom: 15,
              position: 'absolute',
              top: 0,
              width: '100%',
              zIndex: 900000000,
              backgroundColor: '#01101F',
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 5,
              },
              shadowOpacity: 0.34,
              shadowRadius: 6.27,

              elevation: 10,
              height: 160,
            }}>
            {this.props.App.main_interfaceState_vars.isComputing_route ===
            false ? (
              <View style={{flex: 1}}>
                <View
                  style={{
                    flexDirection: 'row',
                    borderBottomWidth: 0.7,
                    borderBottomColor: '#a5a5a5',
                    paddingBottom: 10,
                  }}>
                  <View
                    style={{
                      width: 60,
                      height: 60,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <Image
                      source={this.props.App.arrowTurnLeft}
                      style={{
                        resizeMode: 'contain',
                        width: '100%',
                        height: '100%',
                      }}
                    />
                  </View>
                  <View
                    style={{
                      borderLeftWidth: 0.7,
                      borderLeftColor: '#a5a5a5',
                      paddingLeft: 10,
                      marginLeft: 5,
                      flex: 1,
                    }}>
                    <View style={{flex: 1}}>
                      <Text
                        style={[
                          systemWeights.bold,
                          {
                            fontFamily: 'Allrounder-Grotesk-Medium',
                            fontSize: 24,
                            color: '#fff',
                          },
                        ]}>
                        Turn left
                      </Text>
                    </View>
                    <View style={{flexDirection: 'row'}}>
                      <Text
                        style={{
                          fontFamily: 'Allrounder-Grotesk-Book',
                          fontSize: 16,
                          flex: 1,
                          color: '#fff',
                        }}>
                        400m
                      </Text>
                      <Text
                        style={{
                          fontFamily: 'Allrounder-Grotesk-Regular',
                          fontSize: 16,
                          flex: 1,
                          textAlign: 'right',
                          color: '#fff',
                        }}>
                        6min away
                      </Text>
                    </View>
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    marginTop: 10,
                    height: 48,
                  }}>
                  <View
                    style={{
                      width: 25,
                      height: 25,
                      marginRight: 5,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <IconMaterialIcons
                      name="location-on"
                      color="#fff"
                      size={20}
                    />
                  </View>
                  <View style={{flex: 1}}>
                    <Text
                      style={{
                        flex: 1,
                        fontFamily: 'Allrounder-Grotesk-Medium',
                        fontSize: 16,
                        color: '#fff',
                      }}>
                      Khomasdal
                    </Text>
                    <Text
                      style={{
                        flex: 1,
                        fontFamily: 'Allrounder-Grotesk-Book',
                        fontSize: 16,
                        color: '#fff',
                      }}>
                      Maerua Mall
                    </Text>
                  </View>
                </View>
              </View>
            ) : (
              <View style={{flex: 1}}>
                <GenericLoader
                  active={
                    this.props.App.main_interfaceState_vars.isComputing_route
                  }
                  backgroundColor={'#01101F'}
                  color={'#fff'}
                />

                <View
                  style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Text
                    style={{
                      fontFamily: 'Allrounder-Grotesk-Medium',
                      fontSize: 24,
                      color: '#fff',
                    }}>
                    Finding route...
                  </Text>
                </View>
              </View>
            )}
          </View>
        );
      }
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
    if (this.props.App.main_interfaceState_vars.isApp_inNavigation_mode) {
      //Navigation on - hide request list
      return (
        <MapView
          ref={(c) => (this._map = c)}
          style={styles.map}
          /*onDidFinishLoadingMap={() => this.recalibrateMap()}
        onUserLocationUpdate={() => this.recalibrateMap()}
        onDidFailLoadingMap={() => this.recalibrateMap()}
        onDidFinishRenderingMapFully={() => this.recalibrateMap()}*/
          attributionEnabled={false}
          compassEnabled={false}
          id={'mainMapViewElement'}
          styleURL={'mapbox://styles/dominiquektt/ckax4kse10a791iofjbx59jzm'}>
          <Camera
            ref={(c) => (this.camera = c)}
            zoomLevel={14}
            centerCoordinate={[
              this.props.App.longitude,
              this.props.App.latitude,
            ]}
          />
          <UserLocation
            animated={true}
            showsUserHeadingIndicator
            androidRenderMode="gps"
          />
        </MapView>
      );
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
    if (this.props.App.main_interfaceState_vars.isApp_inNavigation_mode) {
      //Navigation on - hide footer
      if (this.props.App.main_interfaceState_vars.isRideInProgress) {
        //A ride is in progress actively in navigation mode
        return null;
      } //No active ride in navigation mode
      else {
        return (
          <TouchableOpacity
            onPress={() =>
              this.props.App.main_interfaceState_vars.isDriver_online
                ? this.props.UpdateErrorModalLog(
                    true,
                    'show_select_ride_type_modal',
                    'any',
                  )
                : {}
            }
            style={{
              height: 90,
              justifyContent: 'center',
              backgroundColor: '#fff',
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 12,
              },
              shadowOpacity: 0.58,
              shadowRadius: 16.0,

              elevation: 24,
            }}>
            {this.props.App.main_interfaceState_vars.isDriver_online ? (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  padding: 20,
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    flex: 1,
                  }}>
                  <IconCommunity
                    name="square"
                    size={10}
                    style={{top: 1, marginRight: 5}}
                  />
                  <Text
                    style={{
                      fontFamily: 'Allrounder-Grotesk-Regular',
                      fontSize: 18,
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
            ) : (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  flex: 1,
                  backgroundColor: '#096ED4',
                }}>
                <View
                  style={{
                    flex: 1,
                    alignItems: 'center',
                  }}>
                  <Text
                    style={{
                      fontFamily: 'Allrounder-Grotesk-Medium',
                      fontSize: 20,
                      color: '#fff',
                    }}>
                    Go online
                  </Text>
                </View>
              </View>
            )}
          </TouchableOpacity>
        );
      }
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
                  fontSize: 18,
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
      <View
        style={[
          styles.mainInsideComponent,
          {
            backgroundColor: this.props.App.main_interfaceState_vars
              .isApp_inNavigation_mode
              ? 'transparent'
              : '#f0f0f0',
          },
        ]}>
        <ErrorModal
          active={this.props.App.generalErrorModal_vars.showErrorGeneralModal}
          error_status={
            this.props.App.generalErrorModal_vars.generalErrorModalType
          }
          parentNode={this}
        />
        {this.props.App.main_interfaceState_vars.isApp_inNavigation_mode ===
        false ? (
          <GenericLoader
            active={this.state.loaderState}
            backgroundColor={'#f0f0f0'}
          />
        ) : null}
        {this.renderHeaderMainHome()}

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
  map: {
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
      UpdateErrorModalLog,
      UpdateGrantedGRPS,
    },
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchToProps)(Home);
