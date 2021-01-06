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
  Animated as AnimatedNative,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Easing,
  PermissionsAndroid,
  Image,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import {TouchableOpacity as TouchableOpacityGesture} from 'react-native-gesture-handler';
import GeolocationP from 'react-native-geolocation-service';
import {
  UpdateErrorModalLog,
  UpdateGrantedGRPS,
  UpdateTrackingModeState,
  UpdateCurrentLocationMetadat,
  UpdateFetchedRequests_dataServer,
  SwitchToNavigation_modeOrBack,
  UpdateRealtimeNavigationData,
  UpdateDailyAmount_madeSoFar,
  UpdateDriverOperational_status,
} from '../Redux/HomeActionsCreators';
import {systemWeights} from 'react-native-typography';
import PulseCircleLayer from '../Modules/PulseCircleLayer';
import IconAnt from 'react-native-vector-icons/AntDesign';
import IconCommunity from 'react-native-vector-icons/MaterialCommunityIcons';
import IconMaterialIcons from 'react-native-vector-icons/MaterialIcons';
import IconFontAwesome from 'react-native-vector-icons/FontAwesome';
import IconFeather from 'react-native-vector-icons/Feather';
import IconSimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
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
      isGoingOnline: false, //TO know whether it is loading to go online - default: false
      offlineOnlineText: 'Hold on...', //The text to show when the driver is offline/online in animation - default: Hold on
      offlineOnlinePositionOffset: new AnimatedNative.Value(15), //The vertical offset position of the text - default: 10
      offlineOnlineOpacity: new AnimatedNative.Value(0), //The opacity of the text 0 - default: 0
      wasAnimatedOfflineStateCalled: false, //TO know whether the animated state function was called to avoid calling it more than once - default: false
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

    //Create interval updater persister
    this.props.App._TMP_TRIP_INTERVAL_PERSISTER = setInterval(function () {
      console.log('Interval persister called');
      //Geocode the location
      globalObject.getCurrentPositionCusto();
      //Get requests
      if (globalObject.props.App.main_interfaceState_vars.isDriver_online) {
        //Only if driver online
        globalObject.updateRemoteLocationsData();
      }
      //Get the daily amount made so far
      globalObject.computeDaily_amountriver();
      //Get the operational status
      globalObject.props.App.socket.emit('goOnline_offlineDrivers_io', {
        driver_fingerprint: globalObject.props.App.user_fingerprint,
        action: 'get',
      });
    }, this.props.App._TMP_TRIP_INTERVAL_PERSISTER_TIME);

    /**
     * SOCKET.IO RESPONSES
     */
    /**
     * GET/SET THE OPERATIONAL STATUS OF THE DRIVER
     * event: goOnline_offlineDrivers_io
     * Get the status of the driver : online/offline, can also handle the "Go online/offline" actions
     */
    this.props.App.socket.on(
      'goOnline_offlineDrivers_io-response',
      function (response) {
        if (globalObject.state.isGoingOnline) {
          globalObject.setState({isGoingOnline: false, loaderState: false}); //close the loader
        }
        if (
          response !== undefined &&
          response !== null &&
          response.response !== undefined &&
          response.response !== null &&
          response.flag !== undefined &&
          response.flag !== null
        ) {
          //Responded
          //Check if it was a get or make
          if (/got/i.test(response.response)) {
            //Get
            let boolDriverStatus = /online/i.test(response.flag);
            //Update the driver status - only if the state changed
            if (
              globalObject.props.App.main_interfaceState_vars
                .isDriver_online !== boolDriverStatus
            ) {
              //New state
              globalObject.props.UpdateDriverOperational_status(response.flag);
            }
          } else if (/done/i.test(response.response)) {
            //Make
            globalObject.state.wasAnimatedOfflineStateCalled = false;
            //Update driver status anyways
            globalObject.props.UpdateDriverOperational_status(response.flag);
          }
        }
      },
    );

    /**
     * GET GEOCODED USER LOCATION
     * event: geocode-this-point
     * Get the location of the user, parameter of interest: street name
     */
    this.props.App.socket.on(
      'geocode-this-point-response',
      function (response) {
        if (response !== undefined && response !== false) {
          let localData = globalObject.props.App.userCurrentLocationMetaData;
          //Only update if new metadata
          if (localData.city !== undefined) {
            let checkDataSim =
              response.city === localData.city &&
              response.street === localData.street &&
              response.state === localData.state;

            if (checkDataSim === false) {
              globalObject.props.UpdateCurrentLocationMetadat(response);
            }
          } //Empty local data
          else {
            globalObject.props.UpdateCurrentLocationMetadat(response);
          }
        }
      },
    );

    /**
     * @socket 'trackdriverroute-response
     * Get route tracker response
     * Responsible for redirecting updates to map graphics data based on if the status of the request is: pending, in route to pickup, in route to drop off or completed
     */
    this.props.App.socket.on('trackdriverroute-response', function (response) {
      //Deactivate the loader
      if (globalObject.state.loaderState) {
        //only if active
        globalObject.setState({loaderState: false});
      }
      //...
      if (
        response !== null &&
        response !== undefined &&
        response !== false &&
        /no_rides/i.test(response.request_status) === false &&
        /no_requests/i.test(response.response) === false &&
        response[0].request_type !== undefined
      ) {
        //Check that the request type is respected by the new incomming data
        let regChecker = new RegExp(globalObject.props.App.requestType, 'i');
        if (regChecker.test(response[0].request_type)) {
          //Consistent with the choosed in app request type
          globalObject.props.UpdateFetchedRequests_dataServer(response);
        }
      } //No rides
      else {
        //Reset only if not already empty
        if (
          globalObject.props.App.requests_data_main_vars
            .fetchedRequests_data_store !== false
        ) {
          globalObject.props.UpdateFetchedRequests_dataServer(false);
        }
      }
    });

    //4. Handler for realtime navigation data stream.
    this.props.App.socket.on(
      'getRealtimeTrackingRoute_forTHIS_io-response',
      function (response) {
        if (
          response !== false &&
          response !== undefined &&
          response !== null &&
          response.routePoints !== undefined &&
          response.routePoints !== null
        ) {
          //Received data
          globalObject.props.UpdateRealtimeNavigationData(response);
        }
      },
    );

    //5. Handler for daily amount response
    this.props.App.socket.on(
      'computeDaily_amountMadeSoFar_io-response',
      function (response) {
        if (
          response !== false &&
          response !== undefined &&
          response.response !== undefined
        ) {
          globalObject.props.UpdateDailyAmount_madeSoFar(response);
        }
      },
    );
  }

  componentWillUnmount() {
    //Clear the main interval updater
    if (this.props.App._TMP_TRIP_INTERVAL_PERSISTER !== null) {
      clearInterval(this.props.App._TMP_TRIP_INTERVAL_PERSISTER);
      this.props.App._TMP_TRIP_INTERVAL_PERSISTER = null;
    }
  }

  componentDidUpdate() {
    //this.getCurrentPositionCusto();
  }

  /**
   * @func computeDaily_amountriver
   * Responsible for making the request to compute the daily driver profit so far.
   */
  computeDaily_amountriver() {
    let bundleData = {
      driver_fingerprint: this.props.App.user_fingerprint,
    };
    this.props.App.socket.emit('computeDaily_amountMadeSoFar_io', bundleData);
  }

  /**
   * @func updateRemoteLocationsData()
   * Sent update locations informations to the server
   */
  updateRemoteLocationsData(origin = 'other') {
    let bundle = {
      latitude: this.props.App.latitude,
      longitude: this.props.App.longitude,
      user_fingerprint: this.props.App.user_fingerprint,
      user_nature: 'driver',
      requestType: this.props.App.requestType,
    };
    this.props.App.socket.emit('update-passenger-location', bundle);
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
        globalObject.props.App.latitude = position.coords.latitude;
        globalObject.props.App.longitude = position.coords.longitude;
        //---
        //Get user location
        globalObject.props.App.socket.emit('geocode-this-point', {
          latitude: globalObject.props.App.latitude,
          longitude: globalObject.props.App.longitude,
          user_fingerprint: globalObject.props.App.user_fingerprint,
        });
      },
      (error) => {
        //...
        console.log(error);
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
      if (this.props.App.main_interfaceState_vars.isRideInProgress === false) {
        //No ride in progress actively in navigation mode
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
                onPress={() => console.log('ok')}
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
                    padding: 10,
                    width: 100,
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
                  {this.props.App.main_interfaceState_vars
                    .dailyAmount_madeSoFar === false ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <Text
                      style={[
                        {
                          fontSize: 16.5,
                          fontFamily: 'Allrounder-Grotesk-Medium',
                          color: '#fff',
                        },
                      ]}>
                      {this.props.App.main_interfaceState_vars
                        .dailyAmount_madeSoFar.currency_symbol +
                        '' +
                        this.props.App.main_interfaceState_vars
                          .dailyAmount_madeSoFar.amount}
                    </Text>
                  )}
                </View>
              </View>
              <TouchableOpacity
                onPress={() => {
                  this.props.SwitchToNavigation_modeOrBack({
                    isApp_inNavigation_mode: false,
                  });
                }}
                style={{
                  borderWidth: 1,
                  borderColor: '#096ED4',
                  width: 43,
                  height: 43,
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
                  zIndex: 9000000000,
                }}>
                <IconCommunity name="bell" color="#096ED4" size={22} />
              </TouchableOpacity>
            </View>
          </View>
        );
      } //A ride is in progress actively in navigation mode
      else {
        return (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              padding: 20,
              paddingTop: 15,
              paddingBottom: 15,
              position: 'relative', //Critical fix - relative
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
                      source={
                        /Continue/.test(
                          this.props.App.main_interfaceState_vars
                            .navigationRouteData.instructions[0].text,
                        )
                          ? this.props.App.arrowStraight
                          : /Turn left/i.test(
                              this.props.App.main_interfaceState_vars
                                .navigationRouteData.instructions[0].text,
                            )
                          ? this.props.App.arrowTurnLeft
                          : /Turn right/i.test(
                              this.props.App.main_interfaceState_vars
                                .navigationRouteData.instructions[0].text,
                            )
                          ? this.props.App.arrowTurnRight
                          : this.props.App.arrowStraight
                      }
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
                            fontSize: 20,
                            color: '#fff',
                          },
                        ]}>
                        {this.props.App.main_interfaceState_vars
                          .navigationRouteData.instructions[0].text.length > 22
                          ? this.props.App.main_interfaceState_vars.navigationRouteData.instructions[0].text.substring(
                              0,
                              18,
                            ) + '...'
                          : this.props.App.main_interfaceState_vars
                              .navigationRouteData.instructions[0].text}
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
                        {this.props.App.requests_data_main_vars
                          .moreDetailsFocused_request.ride_basic_infos
                          .inRideToDestination
                          ? 'Picked up'
                          : Math.round(
                              this.props.App.main_interfaceState_vars
                                .navigationRouteData.distance,
                            ) > 1000
                          ? Math.round(
                              this.props.App.main_interfaceState_vars
                                .navigationRouteData.distance,
                            ) /
                              1000 +
                            'km'
                          : Math.round(
                              this.props.App.main_interfaceState_vars
                                .navigationRouteData.distance,
                            ) + 'm'}
                      </Text>
                      <Text
                        style={{
                          fontFamily: 'Allrounder-Grotesk-Regular',
                          fontSize: 16,
                          flex: 1,
                          textAlign: 'right',
                          color: '#fff',
                        }}>
                        {parseInt(
                          this.props.App.main_interfaceState_vars.navigationRouteData.eta.split(
                            ' ',
                          )[0],
                        ) <= 35 &&
                        parseInt(
                          this.props.App.main_interfaceState_vars.navigationRouteData.eta.split(
                            ' ',
                          )[0],
                        ) > 10 &&
                        /sec/i.test(
                          this.props.App.main_interfaceState_vars.navigationRouteData.eta.split(
                            ' ',
                          )[1],
                        )
                          ? 'Very close'
                          : parseInt(
                              this.props.App.main_interfaceState_vars.navigationRouteData.eta.split(
                                ' ',
                              )[0],
                            ) <= 10 &&
                            /sec/i.test(
                              this.props.App.main_interfaceState_vars.navigationRouteData.eta.split(
                                ' ',
                              )[1],
                            )
                          ? 'Arrived'
                          : this.props.App.main_interfaceState_vars
                              .navigationRouteData.eta}
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
                      {/**Check if the client was already picked up, if yes show the 1st destination location, if not show the pickup location */}
                      {this.props.App.requests_data_main_vars
                        .moreDetailsFocused_request.ride_basic_infos
                        .inRideToDestination
                        ? this.props.App.requests_data_main_vars
                            .moreDetailsFocused_request.origin_destination_infos
                            .destination_infos[0].suburb
                        : this.props.App.requests_data_main_vars
                            .moreDetailsFocused_request.origin_destination_infos
                            .pickup_infos.suburb}
                    </Text>
                    <Text
                      style={{
                        flex: 1,
                        fontFamily: 'Allrounder-Grotesk-Book',
                        fontSize: 15,
                        color: '#fff',
                      }}>
                      {this.props.App.requests_data_main_vars
                        .moreDetailsFocused_request.ride_basic_infos
                        .inRideToDestination
                        ? this.props.App.requests_data_main_vars
                            .moreDetailsFocused_request.origin_destination_infos
                            .destination_infos[0].location_name
                        : this.props.App.requests_data_main_vars
                            .moreDetailsFocused_request.origin_destination_infos
                            .pickup_infos.location_name}

                      {this.props.App.requests_data_main_vars
                        .moreDetailsFocused_request.ride_basic_infos
                        .inRideToDestination ? (
                        this.props.App.requests_data_main_vars
                          .moreDetailsFocused_request.origin_destination_infos
                          .destination_infos[0].street_name !== 'false' &&
                        this.props.App.requests_data_main_vars
                          .moreDetailsFocused_request.origin_destination_infos
                          .destination_infos[0].street_name !== false ? (
                          <Text
                            style={{
                              fontFamily: 'Allrounder-Grotesk-Book',
                              fontSize: 14,
                              marginLeft: 5,
                              marginTop: 3,
                              flex: 1,
                            }}>
                            {', ' +
                              this.props.App.requests_data_main_vars
                                .moreDetailsFocused_request
                                .origin_destination_infos.destination_infos[0]
                                .street_name}
                          </Text>
                        ) : null
                      ) : this.props.App.requests_data_main_vars
                          .moreDetailsFocused_request.origin_destination_infos
                          .pickup_infos.street_name !== 'false' &&
                        this.props.App.requests_data_main_vars
                          .moreDetailsFocused_request.origin_destination_infos
                          .pickup_infos.street_name !== false ? (
                        <Text
                          style={{
                            fontFamily: 'Allrounder-Grotesk-Book',
                            fontSize: 14,
                            marginLeft: 5,
                            marginTop: 3,
                            flex: 1,
                          }}>
                          {', ' +
                            this.props.App.requests_data_main_vars
                              .moreDetailsFocused_request
                              .origin_destination_infos.pickup_infos
                              .street_name}
                        </Text>
                      ) : null}
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
                  thickness={4}
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
              <IconMaterialIcons name="menu" size={30} />
            </View>
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <View
                style={{
                  padding: 10,
                  width: 100,
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
                {this.props.App.main_interfaceState_vars
                  .dailyAmount_madeSoFar === false ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text
                    style={[
                      {
                        fontSize: 16.5,
                        fontFamily: 'Allrounder-Grotesk-Medium',
                        color: '#fff',
                      },
                    ]}>
                    {this.props.App.main_interfaceState_vars
                      .dailyAmount_madeSoFar.currency_symbol +
                      '' +
                      this.props.App.main_interfaceState_vars
                        .dailyAmount_madeSoFar.amount}
                  </Text>
                )}
              </View>
            </View>
            <TouchableOpacity
              onPress={() =>
                this.props.SwitchToNavigation_modeOrBack({
                  isApp_inNavigation_mode: true,
                  isRideInProgress: false,
                  requestData: false,
                })
              }
              style={{
                borderWidth: 1,
                borderColor: '#096ED4',
                width: 43,
                height: 43,
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
            </TouchableOpacity>
          </View>
        </View>
      );
    }
  }

  /**
   * @func renderRouteElements
   * Responsible for rendering any kind of polyline and navigation elements in the map component.
   * Scenarios:
   * 1. If there's a ride in progress.
   */
  renderRouteElements() {
    if (
      this.props.App.main_interfaceState_vars.isApp_inNavigation_mode &&
      this.props.App.main_interfaceState_vars.isRideInProgress &&
      this.props.App.main_interfaceState_vars.navigationRouteData !== false &&
      this.props.App.main_interfaceState_vars.navigationRouteData
        .routePoints !== undefined
    ) {
      //Fit bounds
      if (this.camera !== undefined && this.camera != null) {
        this.camera.fitBounds(
          [this.props.App.longitude, this.props.App.latitude],
          this.props.App.main_interfaceState_vars.navigationRouteData.destinationPoint.map(
            parseFloat,
          ),
          80,
          2000,
        );
      }
      //Render polyline to destination/passenger
      return (
        <>
          <Animated.ShapeSource
            id={'shape'}
            aboveLayerID={'driver-location'}
            shape={
              new Animated.Shape({
                type: 'LineString',
                coordinates: this.props.App.main_interfaceState_vars
                  .navigationRouteData.routePoints,
              })
            }>
            <Animated.LineLayer
              id={'lineRoutePickup'}
              aboveLayerID={'driver-location'}
              style={{
                lineCap: 'round',
                lineWidth: this.props.App.main_interfaceState_vars
                  .isApp_inTrackingMode
                  ? 10
                  : 6,
                lineOpacity: 1,
                lineColor: '#096ED4',
              }}
            />
          </Animated.ShapeSource>
          {/**Destination / passenger's location */}
          <Animated.ShapeSource
            id={'shape'}
            aboveLayerID={'lineRoutePickup'}
            shape={
              new Animated.Shape({
                type: 'LineString',
                coordinates: [
                  [0, 0],
                  [1, 1],
                ],
              })
            }>
            <Animated.LineLayer id={'lineRoutePickup'} />
          </Animated.ShapeSource>
          <PulseCircleLayer
            radius={10}
            aboveLayerID={'lineRoutePickup'}
            pulseRadius={25}
            innerCircleStyle={{
              circleColor: '#fff',
              circleStrokeColor: this.props.App.requests_data_main_vars
                .moreDetailsFocused_request.ride_basic_infos.inRideToDestination
                ? '#b22222'
                : '#007fff',
              circleStrokeWidth: 0.5,
            }}
            outerCircleStyle={{
              circleOpacity: 0.4,
              circleColor: this.props.App.requests_data_main_vars
                .moreDetailsFocused_request.ride_basic_infos.inRideToDestination
                ? '#b22222'
                : '#007fff',
            }}
            shape={{
              type: 'Point',
              coordinates: this.props.App.main_interfaceState_vars.navigationRouteData.destinationPoint.map(
                parseFloat,
              ),
            }}
          />
        </>
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
            zoomLevel={
              this.props.App.main_interfaceState_vars.isApp_inTrackingMode
                ? 15
                : 14
            }
            pitch={
              this.props.App.main_interfaceState_vars.isApp_inTrackingMode
                ? 50
                : 0
            }
            followUserMode="compass"
            centerCoordinate={[
              this.props.App.longitude,
              this.props.App.latitude,
            ]}
          />
          <UserLocation
            animated={true}
            showsUserHeadingIndicator
            androidRenderMode="gps">
            <SymbolLayer
              id={'driver-location'}
              style={{
                iconImage: this.props.App.arrowNavigationTracking,
                iconSize: 0.18,
                //iconRotate: this.state.phoneOrientation,
                iconRotationAlignment: 'map',
                iconAllowOverlap: true,
              }}
            />
          </UserLocation>
          {this.renderRouteElements()}
        </MapView>
      );
    } //Navigation off - show requests list
    else {
      return (
        <View style={{flex: 1}}>
          <GenericLoader
            active={this.state.loaderState}
            backgroundColor={'#f0f0f0'}
            thickness={4}
          />
          {/*Request template*/}
          {this.props.App.requests_data_main_vars.fetchedRequests_data_store !==
            undefined &&
          this.props.App.requests_data_main_vars.fetchedRequests_data_store !==
            null &&
          this.props.App.requests_data_main_vars.fetchedRequests_data_store !==
            false ? (
            <FlatList
              style={{
                flex: 1,
                backgroundColor: '#f0f0f0',
                padding: 10,
                paddingBottom: 50,
              }}
              data={
                this.props.App.requests_data_main_vars
                  .fetchedRequests_data_store !== undefined &&
                this.props.App.requests_data_main_vars
                  .fetchedRequests_data_store !== null &&
                this.props.App.requests_data_main_vars
                  .fetchedRequests_data_store !== false
                  ? this.props.App.requests_data_main_vars
                      .fetchedRequests_data_store
                  : []
              }
              initialNumToRender={15}
              keyboardShouldPersistTaps={'always'}
              maxToRenderPerBatch={35}
              windowSize={61}
              updateCellsBatchingPeriod={10}
              keyExtractor={(item, index) => String(index)}
              renderItem={(item) => (
                <GenericRequestTemplate
                  requestLightData={item.item}
                  parentNode={this}
                />
              )}
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
                {this.props.App.main_interfaceState_vars.isDriver_online ? (
                  <IconSimpleLineIcons
                    name="refresh"
                    size={40}
                    color="#7d7d7d"
                  />
                ) : (
                  <IconAnt name="poweroff" size={40} color="#7d7d7d" />
                )}
                <Text
                  style={{
                    fontFamily: 'Allrounder-Grotesk-Book',
                    fontSize: 16,
                    marginTop: 20,
                    color: '#7d7d7d',
                  }}>
                  {this.props.App.main_interfaceState_vars.isDriver_online
                    ? /ride/i.test(this.props.App.requestType)
                      ? 'No rides so far.'
                      : /delivery/i.test(this.props.App.requestType)
                      ? 'No deliveries so far.'
                      : 'No scheduled requests so far.'
                    : "You're offline"}
                </Text>
                <Text
                  style={{
                    fontFamily: 'Allrounder-Grotesk-Book',
                    fontSize: 16,
                    marginTop: 10,
                    color: '#7d7d7d',
                  }}>
                  {this.props.App.main_interfaceState_vars.isDriver_online
                    ? /ride/i.test(this.props.App.requestType)
                      ? "We'll notify you when new rides come."
                      : /delivery/i.test(this.props.App.requestType)
                      ? "We'll notify you when new deliveries come."
                      : "We'll notify you when new requests come."
                    : 'Go online to receive requests.'}
                </Text>
              </View>
            </View>
          )}
        </View>
      );
    }
  }

  /**
   * @func updateMapTrackingState
   * Responsible for udpdating the tracking state of the mapview, and also perform small operations before
   * that.
   */
  updateMapTrackingState() {
    //1. Recenter the map

    //2. Update the tracking state
    this.props.UpdateTrackingModeState(
      !this.props.App.main_interfaceState_vars.isApp_inTrackingMode,
    );
  }

  /**
   * @func goOnlineOrOffline
   * Responsible for going online or offline
   * ? Super function.
   * @param state: online/offline
   */
  goOnlineOrOffline(state) {
    if (/online/i.test(state)) {
      this.props.UpdateErrorModalLog(false, false, 'any'); //Close modal
      this.setState({isGoingOnline: true, loaderState: true}); //Activate the loader
      //Go online
      this.props.App.socket.emit('goOnline_offlineDrivers_io', {
        driver_fingerprint: this.props.App.user_fingerprint,
        state: 'online',
        action: 'make',
      });
    } else if (/offline/i.test(state)) {
      this.props.UpdateErrorModalLog(false, false, 'any'); //Close modal
      this.setState({isGoingOnline: true, loaderState: true}); //Activate the loader
      //Go offline
      this.props.App.socket.emit('goOnline_offlineDrivers_io', {
        driver_fingerprint: this.props.App.user_fingerprint,
        state: 'offline',
        action: 'make',
      });
    }
  }

  /**
   * @function renderFooterMainHome
   * Responsible for rendering the footer part of the home screen based on if the app is in normal or navigation
   * mode.
   */
  renderFooterMainHome() {
    //Check if ONLINE OR OFFLINE
    if (this.props.App.main_interfaceState_vars.isDriver_online) {
      //Driver online
      if (this.props.App.main_interfaceState_vars.isApp_inNavigation_mode) {
        //Navigation on - hide footer
        if (this.props.App.main_interfaceState_vars.isRideInProgress) {
          let globalObject = this;
          //START THE INTERVAL PERSISTER FOR THE NAVIGATION DATA
          if (this.props.App._TMP_NAVIATION_DATA_INTERVAL_PERSISTER === null) {
            console.log('INterval navigation started');
            //Initialize
            this.props.App._TMP_NAVIATION_DATA_INTERVAL_PERSISTER = setInterval(
              function () {
                if (
                  globalObject.props.App.main_interfaceState_vars
                    .isRideInProgress &&
                  globalObject.props.App.main_interfaceState_vars
                    .isApp_inNavigation_mode
                ) {
                  //Get data
                  //Check the driver's latitude and longitude (!= false or null or 0)
                  if (
                    globalObject.props.App.latitude !== false &&
                    globalObject.props.App.latitude !== null &&
                    globalObject.props.App.latitude !== undefined &&
                    globalObject.props.App.latitude !== 0 &&
                    globalObject.props.App.longitude !== false &&
                    globalObject.props.App.longitude !== null &&
                    globalObject.props.App.longitude !== undefined &&
                    globalObject.props.App.longitude !== 0
                  ) {
                    let bundleData = {
                      user_fingerprint: globalObject.props.App.user_fingerprint,
                      request_fp:
                        globalObject.props.App.requests_data_main_vars
                          .moreDetailsFocused_request.request_fp,
                      org_latitude: globalObject.props.App.latitude,
                      org_longitude: globalObject.props.App.longitude,

                      dest_latitude: globalObject.props.App
                        .requests_data_main_vars.moreDetailsFocused_request
                        .ride_basic_infos.inRideToDestination
                        ? globalObject.props.App.requests_data_main_vars
                            .moreDetailsFocused_request.origin_destination_infos
                            .destination_infos[0].coordinates.longitude
                        : globalObject.props.App.requests_data_main_vars
                            .moreDetailsFocused_request.origin_destination_infos
                            .pickup_infos.coordinates.latitude,

                      dest_longitude: globalObject.props.App
                        .requests_data_main_vars.moreDetailsFocused_request
                        .ride_basic_infos.inRideToDestination
                        ? globalObject.props.App.requests_data_main_vars
                            .moreDetailsFocused_request.origin_destination_infos
                            .destination_infos[0].coordinates.latitude
                        : globalObject.props.App.requests_data_main_vars
                            .moreDetailsFocused_request.origin_destination_infos
                            .pickup_infos.coordinates.longitude,
                    };
                    //...
                    globalObject.props.App.socket.emit(
                      'getRealtimeTrackingRoute_forTHIS_io',
                      bundleData,
                    );
                  }
                } //No rides in progress - kill the interval updater
                else {
                  console.log('Cleared navigation data persister');
                  clearInterval(
                    globalObject.props.App
                      ._TMP_NAVIATION_DATA_INTERVAL_PERSISTER,
                  );
                  globalObject.props.App._TMP_NAVIATION_DATA_INTERVAL_PERSISTER = null;
                }
              },
              globalObject.props.App
                ._TMP_NAVIATION_DATA_INTERVAL_PERSISTER_TIME,
            );
          }

          //A ride is in progress actively in navigation mode
          return (
            <View>
              <View
                style={{
                  position: 'absolute',
                  top: -160,
                  right: 15,
                  zIndex: 9000000,
                  alignItems: 'center',
                }}>
                <TouchableOpacity
                  onPress={() =>
                    this.props.UpdateErrorModalLog(
                      true,
                      'show_guardian_toolkit',
                      'any',
                    )
                  }
                  style={{
                    width: 57,
                    height: 57,
                    borderRadius: 160,
                    backgroundColor: '#fff',
                    shadowColor: '#000',
                    shadowOffset: {
                      width: 0,
                      height: 5,
                    },
                    shadowOpacity: 0.36,
                    shadowRadius: 6.68,
                    elevation: 11,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 20,
                    zIndex: 900000000,
                  }}>
                  <IconMaterialIcons name="shield" color={'#000'} size={32} />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => this.updateMapTrackingState()}
                  style={{
                    width: 57,
                    height: 57,
                    borderRadius: 160,
                    backgroundColor: '#fff',
                    shadowColor: '#000',
                    shadowOffset: {
                      width: 0,
                      height: 5,
                    },
                    shadowOpacity: 0.36,
                    shadowRadius: 6.68,

                    elevation: 11,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <IconMaterialIcons
                    name="navigation"
                    color={'#096ED4'}
                    size={32}
                  />
                </TouchableOpacity>
              </View>
              <View
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
                <View
                  style={{
                    padding: 20,
                    flexDirection: 'row',
                    flex: 1,
                    alignItems: 'center',
                  }}>
                  <TouchableOpacity
                    onPress={() =>
                      this.props.UpdateErrorModalLog(
                        true,
                        'show_modalMore_tripDetails',
                        'any',
                        this.props.App.requests_data_main_vars
                          .moreDetailsFocused_request,
                      )
                    }
                    style={{
                      flex: 1,
                      flexDirection: 'row',
                      alignItems: 'center',
                      borderRightWidth: 0.7,
                      borderRightColor: '#d0d0d0',
                    }}>
                    <View style={{padding: 10, marginRight: 10}}>
                      <IconMaterialIcons
                        name="keyboard-arrow-down"
                        color={'#000'}
                        size={22}
                      />
                    </View>
                    <View
                      style={{
                        flex: 1,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <Text
                        style={{
                          fontFamily: 'Allrounder-Grotesk-Medium',
                          fontSize: 17.5,
                        }}>
                        {
                          this.props.App.requests_data_main_vars
                            .moreDetailsFocused_request.passenger_infos.name
                        }
                      </Text>
                      <Text
                        style={{
                          fontFamily: 'Allrounder-Grotesk-Book',
                          fontSize: 15,
                          color: '#096ED4',
                        }}>
                        {
                          this.props.App.requests_data_main_vars
                            .moreDetailsFocused_request.ride_basic_infos
                            .connect_type
                        }
                      </Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      this.props.SwitchToNavigation_modeOrBack({
                        isApp_inNavigation_mode: false,
                      });
                    }}
                    style={{padding: 10, marginLeft: 10}}>
                    <IconCommunity
                      name="format-list-bulleted-square"
                      color="#000"
                      size={28}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          );
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
              <View
                style={{flexDirection: 'row', alignItems: 'center', flex: 1}}>
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
    } //Driver offline
    else {
      //Call the animated offline state once
      if (this.state.wasAnimatedOfflineStateCalled === false) {
        this.setState({wasAnimatedOfflineStateCalled: true}); //Lock the calling of the animated offline state.
        this.animatedOfflineState();
      }

      return (
        <TouchableOpacity
          onPress={() =>
            this.props.App.main_interfaceState_vars.dailyAmount_madeSoFar !==
            false
              ? this.props.App.main_interfaceState_vars.isDriver_online
                ? this.props.UpdateErrorModalLog(
                    true,
                    'show_select_ride_type_modal',
                    'any',
                  )
                : this.goOnlineOrOffline('online')
              : {}
          }
          style={{
            height: 80,
            justifyContent: 'center',
            backgroundColor:
              this.state.isGoingOnline === false ? '#fff' : '#096ED4',
            borderTopWidth: 2,
          }}>
          <View
            style={{flexDirection: 'row', alignItems: 'center', padding: 20}}>
            <AnimatedNative.View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                flex: 1,
                opacity: this.state.offlineOnlineOpacity,
                transform: [
                  {translateY: this.state.offlineOnlinePositionOffset},
                ],
              }}>
              {this.state.isGoingOnline === false ? (
                <Text
                  style={{
                    fontFamily: 'Allrounder-Grotesk-Medium',
                    fontSize: this.props.App.main_interfaceState_vars
                      .isDriver_online
                      ? 18
                      : 19,
                    color: /Hold on/i.test(this.state.offlineOnlineText)
                      ? '#000'
                      : /Offline/i.test(this.state.offlineOnlineText)
                      ? '#b22222'
                      : '#096ED4',
                  }}>
                  {this.state.offlineOnlineText}
                </Text>
              ) : (
                <>
                  <ActivityIndicator size="small" color="#fff" />
                  <Text
                    style={{
                      fontFamily: 'Allrounder-Grotesk-Regular',
                      fontSize: 18.5,
                      marginLeft: 5,
                      color: '#fff',
                    }}>
                    Going online
                  </Text>
                </>
              )}
            </AnimatedNative.View>
          </View>
        </TouchableOpacity>
      );
    }
  }

  /**
   * @func animatedOfflineState
   * Responsible for animating the Offline text and the proposition to Go Online text.
   * Only with UseNativeDriver.
   * Only if the driver's offline.
   * isGoingOnline: false, //TO know whether it is loading to go online - default: false
      offlineOnlineText: 'Hold on', //The text to show when the driver is offline/online in animation - default: Hold on
      offlineOnlinePositionOffset: 15, //The vertical offset position of the text - default: 10
      offlineOnlineOpacity: 0, //The opacity of the text 0 - default: 0
   */
  animatedOfflineState() {
    if (
      this.props.App.main_interfaceState_vars.isDriver_online === false &&
      this.state.isGoingOnline === false
    ) {
      let globalObject = this;
      //Offline state
      //Go up
      AnimatedNative.parallel([
        AnimatedNative.timing(this.state.offlineOnlineOpacity, {
          toValue: 1,
          duration: 250,
          easing: Easing.bezier(0.5, 0.0, 0.0, 0.8),
          useNativeDriver: true,
        }),
        AnimatedNative.timing(this.state.offlineOnlinePositionOffset, {
          toValue: 0,
          duration: 200,
          easing: Easing.bezier(0.5, 0.0, 0.0, 0.8),
          useNativeDriver: true,
        }),
      ]).start(() => {
        //Go down after 3 sec
        setTimeout(
          function () {
            AnimatedNative.parallel([
              AnimatedNative.timing(globalObject.state.offlineOnlineOpacity, {
                toValue: 0,
                duration: 250,
                easing: Easing.bezier(0.5, 0.0, 0.0, 0.8),
                useNativeDriver: true,
              }),
              AnimatedNative.timing(
                globalObject.state.offlineOnlinePositionOffset,
                {
                  toValue: 10,
                  duration: 300,
                  easing: Easing.bezier(0.5, 0.0, 0.0, 0.8),
                  useNativeDriver: true,
                },
              ),
            ]).start(() => {
              //Update label text
              let labelText = /Hold on/i.test(
                globalObject.state.offlineOnlineText,
              )
                ? "You're offline"
                : /Offline/i.test(globalObject.state.offlineOnlineText)
                ? 'Go online'
                : "You're offline";
              globalObject.setState({offlineOnlineText: labelText});
              //...
              //Recall the function
              setTimeout(function () {
                globalObject.animatedOfflineState();
              }, 200);
            });
          },
          /Hold on/i.test(globalObject.state.offlineOnlineText)
            ? 3000
            : /Go online/i.test(globalObject.state.offlineOnlineText)
            ? 10000
            : 4000,
        );
      });
    } //Put everything back ON
    else {
      AnimatedNative.parallel([
        AnimatedNative.timing(this.state.offlineOnlineOpacity, {
          toValue: 1,
          duration: 250,
          easing: Easing.bezier(0.5, 0.0, 0.0, 0.8),
          useNativeDriver: true,
        }),
        AnimatedNative.timing(this.state.offlineOnlinePositionOffset, {
          toValue: 0,
          duration: 200,
          easing: Easing.bezier(0.5, 0.0, 0.0, 0.8),
          useNativeDriver: true,
        }),
      ]).start();
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
        <ErrorModal
          active={this.props.App.generalErrorModal_vars.showErrorGeneralModal}
          error_status={
            this.props.App.generalErrorModal_vars.generalErrorModalType
          }
          parentNode={this}
        />
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
      UpdateTrackingModeState,
      UpdateCurrentLocationMetadat,
      UpdateFetchedRequests_dataServer,
      SwitchToNavigation_modeOrBack,
      UpdateRealtimeNavigationData,
      UpdateDailyAmount_madeSoFar,
      UpdateDriverOperational_status,
    },
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchToProps)(Home);
