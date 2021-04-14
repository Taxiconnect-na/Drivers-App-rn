import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {
  Animated,
  MapView,
  Camera,
  UserLocation,
  SymbolLayer,
  ShapeSource,
} from '@react-native-mapbox-gl/maps';
import {
  View,
  Text,
  Animated as AnimatedNative,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Easing,
  PermissionsAndroid,
  Image,
  FlatList,
  ActivityIndicator,
  InteractionManager,
  BackHandler,
  StatusBar,
  Button,
} from 'react-native';
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
  UpdateRequestsGraphs,
} from '../Redux/HomeActionsCreators';
import PulseCircleLayer from '../Modules/PulseCircleLayer';
import IconAnt from 'react-native-vector-icons/AntDesign';
import IconCommunity from 'react-native-vector-icons/MaterialCommunityIcons';
import IconMaterialIcons from 'react-native-vector-icons/MaterialIcons';
import IconFontAwesome from 'react-native-vector-icons/FontAwesome';
import IconSimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import GenericRequestTemplate from '../Modules/GenericRequestTemplate';
import GenericLoader from '../Modules/GenericLoader/GenericLoader';
import NetInfo from '@react-native-community/netinfo';
import ErrorModal from '../Helpers/ErrorModal';
import {check, PERMISSIONS, RESULTS} from 'react-native-permissions';
import {RFValue} from 'react-native-responsive-fontsize';
import SyncStorage from 'sync-storage';
import {_MAIN_URL_ENDPOINT} from '@env';
const io = require('socket.io-client');

class Home extends React.PureComponent {
  constructor(props) {
    super(props);

    this._shouldShow_errorModal = true; //! ERROR MODAL AUTO-LOCKER - PERFORMANCE IMPROVER.

    this.state = {
      locationWatcher: null, //Responsible for holding the watcher for the location changes.
      loaderState: false,
      networkStateChecker: false,
      isGoingOnline: false, //TO know whether it is loading to go online - default: false
      offlineOnlineText: 'Hold on...', //The text to show when the driver is offline/online in animation - default: Hold on
      offlineOnlinePositionOffset: new AnimatedNative.Value(15), //The vertical offset position of the text - default: 10
      offlineOnlineOpacity: new AnimatedNative.Value(0), //The opacity of the text 0 - default: 0
      wasAnimatedOfflineStateCalled: false, //TO know whether the animated state function was called to avoid calling it more than once - default: false
    };
    //...
    this.goOnlineOrOffline = this.goOnlineOrOffline.bind(this);
  }

  async componentDidMount() {
    let globalObject = this;
    //? Save the online/offline function to the global state
    this.props.App.goOnlineOrOffline = this.goOnlineOrOffline;
    //Get initial rides - set default: past (always)
    //Add home going back handler-----------------------------
    this.props.navigation.addListener('beforeRemove', (e) => {
      // Prevent default behavior of leaving the screen
      e.preventDefault();
      return;
    });
    //--------------------------------------------------------
    //? Go back based on the state of the screen.
    this.backHander = BackHandler.addEventListener(
      'hardwareBackPress',
      function () {
        return true;
      },
    );

    //! SET AUTHORIZATION LEVEL FOR iOS LOCATION
    if (Platform.OS === 'ios') {
      GeolocationP.requestAuthorization('whenInUse');
    } else if (Platform.OS === 'android') {
      //Initiate component by asking for the necessary permissions.
      await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Enable location',
          message:
            'TaxiConnect requires access to your location to provide an optimal experience.',
          buttonPositive: 'Allow',
          buttonNegative: 'Cancel',
        },
      );
    }

    //...
    globalObject.GPRS_resolver();
    //...

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
      const socket = io(String(_MAIN_URL_ENDPOINT), {
        transports: ['websocket', 'polling'],
        withCredentials: true,
        reconnection: true,
        reconnectionAttempts: Infinity,
        reconnectionDelay: 100,
        reconnectionDelayMax: 200,
      });
    });
    this.props.App.socket.on('connect_error', () => {
      console.log('connect_error');
      globalObject.props.App.socket.connect();
    });
    this.props.App.socket.on('connect_timeout', () => {
      console.log('connect_timeout');
      const socket = io(String(_MAIN_URL_ENDPOINT), {
        transports: ['websocket', 'polling'],
        withCredentials: true,
        reconnection: true,
        reconnectionAttempts: Infinity,
        reconnectionDelay: 100,
        reconnectionDelayMax: 200,
      });
    });
    this.props.App.socket.on('reconnect', () => {
      ////console.log('something');
    });
    this.props.App.socket.on('reconnect_error', () => {
      console.log('reconnect_error');
      const socket = io(String(_MAIN_URL_ENDPOINT), {
        transports: ['websocket', 'polling'],
        withCredentials: true,
        reconnection: true,
        reconnectionAttempts: Infinity,
        reconnectionDelay: 100,
        reconnectionDelayMax: 200,
      });
    });
    this.props.App.socket.on('reconnect_failed', () => {
      console.log('reconnect_failed');
      const socket = io(String(_MAIN_URL_ENDPOINT), {
        transports: ['websocket', 'polling'],
        withCredentials: true,
        reconnection: true,
        reconnectionAttempts: Infinity,
        reconnectionDelay: 100,
        reconnectionDelayMax: 200,
      });
    });

    //Create interval updater persister
    this.props.App._TMP_TRIP_INTERVAL_PERSISTER = setInterval(function () {
      //Geocode the location
      globalObject.GPRS_resolver();
      //globalObject.getCurrentPositionCusto();
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
      //Get the requests graph
      globalObject.props.App.socket.emit('update_requestsGraph', {
        driver_fingerprint: globalObject.props.App.user_fingerprint,
      });
    }, this.props.App._TMP_TRIP_INTERVAL_PERSISTER_TIME);

    /**
     * SOCKET.IO RESPONSES
     */

    /**
     * ? Get the requests graphs
     * Responsible for getting and updating the requests graphs to show the numbers of available requests
     * to make the finding of requests easier.
     */
    this.props.App.socket.on(
      'update_requestsGraph-response',
      function (response) {
        if (response !== undefined && response.rides !== undefined) {
          //Received some graph data
          globalObject.props.UpdateRequestsGraphs(response);
        } //No graph data received
        else {
          //? Update the graph global to clear it
          globalObject.props.UpdateRequestsGraphs(null);
        }
      },
    );

    /**
     * ? GET/SET THE OPERATIONAL STATUS OF THE DRIVER
     * event: goOnline_offlineDrivers_io
     * Get the status of the driver : online/offline, can also handle the "Go online/offline" actions
     */
    this.props.App.socket.on(
      'goOnline_offlineDrivers_io-response',
      function (response) {
        //! CLOSEE ONLY FOR CONNECTION RELATED ERROS
        if (
          /(connection_no_network|service_unavailable)/i.test(
            globalObject.props.App.generalErrorModal_vars.generalErrorModalType,
          )
        ) {
          //Do not interrupt the select gender process
          globalObject.props.UpdateErrorModalLog(false, false, 'any'); //Auto close connection unavailable
        }
        //....

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
            if (globalObject.state.isGoingOnline) {
              globalObject.setState({isGoingOnline: false, loaderState: false}); //close the loader
            }
          } else if (/done/i.test(response.response)) {
            if (globalObject.state.isGoingOnline) {
              globalObject.setState({
                isGoingOnline: false,
                loaderState: false,
              }); //close the loader
            }
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
        response[0] !== undefined &&
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
          //Fit bounds
          if (
            globalObject.camera !== undefined &&
            globalObject.camera != null &&
            globalObject.props.App.main_interfaceState_vars
              .isApp_inTrackingMode === false &&
            globalObject.props.App.main_interfaceState_vars.navigationRouteData
              .destinationPoint !== undefined &&
            globalObject.props.App.main_interfaceState_vars.navigationRouteData
              .destinationPoint !== null
          ) {
            //? 1. POINT 1 -Get temporary vars
            let point1 = [
              globalObject.props.App.longitude,
              globalObject.props.App.latitude,
            ];
            let pickLatitude1 = point1[1];
            let pickLongitude1 = point1[0];
            //! Coordinates order fix - major bug fix for ocean bug
            if (
              pickLatitude1 !== undefined &&
              pickLatitude1 !== null &&
              pickLatitude1 !== 0 &&
              pickLongitude1 !== undefined &&
              pickLongitude1 !== null &&
              pickLongitude1 !== 0
            ) {
              //? Switch latitude and longitude - check the negative sign
              if (parseFloat(pickLongitude1) < 0) {
                //Negative - switch
                point1 = [point1[1], point1[0]];
              }
            }
            //!--------- Ocean bug fix - POINT 1
            //? 2. POINT 2 -Get temporary vars
            let point2 = globalObject.props.App.main_interfaceState_vars.navigationRouteData.destinationPoint.map(
              parseFloat,
            );
            let pickLatitude2 = point2[1];
            let pickLongitude2 = point2[0];
            //! Coordinates order fix - major bug fix for ocean bug
            if (
              pickLatitude2 !== undefined &&
              pickLatitude2 !== null &&
              pickLatitude2 !== 0 &&
              pickLongitude2 !== undefined &&
              pickLongitude2 !== null &&
              pickLongitude2 !== 0
            ) {
              //? Switch latitude and longitude - check the negative sign
              if (parseFloat(pickLongitude2) < 0) {
                //Negative - switch
                point2 = [point2[1], point2[0]];
              }
            }
            //!--------- Ocean bug fix - POINT 1
            globalObject.camera.fitBounds(point1, point2, 80, 800);
          }
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
    let globalObject = this;
    //Save the coordinates in storage
    let promiseSync = new Promise((res) => {
      SyncStorage.set(
        '@userLocationPoint',
        JSON.stringify({
          latitude: globalObject.props.App.latitude,
          longitude: globalObject.props.App.longitude,
        }),
      ).then(
        () => {
          res(true);
        },
        () => {
          res(false);
        },
      );
    }).then(
      () => {},
      () => {},
    );

    let bundle = {
      latitude: this.props.App.latitude,
      longitude: this.props.App.longitude,
      user_fingerprint: this.props.App.user_fingerprint,
      pushnotif_token: this.props.App.pushnotif_token,
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
   * @func GPRS_resolver()
   * Responsible for getting the permission to the GPRS location for the user and
   * lock them from useing the app without the proper GPRS permissions.
   *
   */
  async GPRS_resolver(promptActivation = false) {
    let globalObject = this;
    //Check if the app already has the GPRS permissions
    if (Platform.OS === 'android') {
      try {
        const checkGPRS = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );
        if (checkGPRS) {
          //Permission already granted
          //Unlock the platform if was locked

          if (true) {
            const requestLocationPermission = await PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
              {
                title: 'Enable location',
                message:
                  'TaxiConnect requires access to your location to provide an optimal experience.',
                buttonPositive: 'Allow',
                buttonNegative: 'Cancel',
              },
            );
            //...
            if (
              requestLocationPermission === PermissionsAndroid.RESULTS.GRANTED
            ) {
              if (
                this.props.App.gprsGlobals.hasGPRSPermissions === false ||
                this.props.App.gprsGlobals.didAskForGprs === false ||
                this.props.App.latitude === 0 ||
                this.props.App.longitude === 0
              ) {
                //Permission granted
                this.getCurrentPositionCusto();
                GeolocationP.getCurrentPosition(
                  (position) => {
                    globalObject.props.App.latitude = position.coords.latitude;
                    globalObject.props.App.longitude =
                      position.coords.longitude;
                    //Update GPRS permission global var
                    let newStateVars = {};
                    newStateVars.hasGPRSPermissions = true;
                    newStateVars.didAskForGprs = true;
                    globalObject.props.UpdateGrantedGRPS(newStateVars);
                    //Launch recalibration
                    InteractionManager.runAfterInteractions(() => {
                      //globalObject.recalibrateMap();
                    });
                  },
                  () => {
                    // See error code charts below.
                    //Launch recalibration
                    InteractionManager.runAfterInteractions(() => {
                      //globalObject.recalibrateMap();
                    });
                  },
                  {
                    enableHighAccuracy: true,
                    timeout: 200000,
                    maximumAge: 1000,
                    distanceFilter: 3,
                  },
                );
                this.props.App.isMapPermitted = true;
              } else {
                if (this.state.locationWatcher === null) {
                  //Initializedd the location watcher
                  this.state.locationWatcher = GeolocationP.watchPosition();
                }

                if (globalObject.props.App._MAX_NUMBER_OF_CALLBACKS_MAP > 0) {
                  //! Decrement promise controller
                  globalObject.props.App._MAX_NUMBER_OF_CALLBACKS_MAP -= 1;
                  GeolocationP.getCurrentPosition(
                    (position) => {
                      globalObject.props.App._MAX_NUMBER_OF_CALLBACKS_MAP += 1;
                      globalObject.props.App.latitude =
                        position.coords.latitude;
                      globalObject.props.App.longitude =
                        position.coords.longitude;
                      //Get user location
                      globalObject.props.App.socket.emit('geocode-this-point', {
                        latitude: globalObject.props.App.latitude,
                        longitude: globalObject.props.App.longitude,
                        user_fingerprint:
                          globalObject.props.App.user_fingerprint,
                      });
                      //Update GPRS permission global var
                      let newStateVars = {};
                      newStateVars.hasGPRSPermissions = true;
                      newStateVars.didAskForGprs = true;
                      globalObject.props.UpdateGrantedGRPS(newStateVars);
                    },
                    () => {
                      globalObject.props.App._MAX_NUMBER_OF_CALLBACKS_MAP += 1;
                      // See error code charts below.
                      //Launch recalibration
                      InteractionManager.runAfterInteractions(() => {
                        //globalObject.recalibrateMap();
                      });
                    },
                    {
                      enableHighAccuracy: true,
                      timeout: 200000,
                      maximumAge: 10000,
                      distanceFilter: 3,
                    },
                  );
                }
                //Check the zoom level
                if (this._map !== undefined && this._map != null) {
                  if (
                    this._map !== undefined &&
                    this._map != null &&
                    this.props.App.isRideInProgress === false
                  ) {
                    const mapZoom = await this._map.getZoom();
                    if (mapZoom > 18) {
                      InteractionManager.runAfterInteractions(() => {
                        //globalObject.recalibrateMap();
                      });
                    }
                  }
                }
              }
            } //Permission denied
            else {
              //Permission denied, update gprs global vars and lock the platform
              let newStateVars = {};
              newStateVars.hasGPRSPermissions = false;
              newStateVars.didAskForGprs = true;
              this.props.UpdateGrantedGRPS(newStateVars);
              //Close loading animation
              this.resetAnimationLoader();
            }
          }
        } //Permission denied
        else {
          if (promptActivation === false) {
            //Permission denied, update gprs global vars and lock the platform
            let newStateVars = {};
            newStateVars.hasGPRSPermissions = false;
            newStateVars.didAskForGprs = true;
            this.props.UpdateGrantedGRPS(newStateVars);
            //Close loading animation
            this.resetAnimationLoader();
          } //Prompt the activation
          else {
            const requestLocationPermission = await PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
              {
                title: 'Enable location',
                message:
                  'TaxiConnect requires access to your location to provide an optimal experience.',
                buttonPositive: 'Allow',
                buttonNegative: 'Cancel',
              },
            );
            //...
            if (
              requestLocationPermission === PermissionsAndroid.RESULTS.GRANTED
            ) {
              //Permission granted
              this.getCurrentPositionCusto();
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
                  InteractionManager.runAfterInteractions(() => {
                    //globalObject.recalibrateMap();
                  });
                },
                () => {
                  // See error code charts below.
                  //Launch recalibration
                  InteractionManager.runAfterInteractions(() => {
                    //globalObject.recalibrateMap();
                  });
                },
                {
                  enableHighAccuracy: true,
                  timeout: 2000,
                  maximumAge: 1000,
                  distanceFilter: 3,
                },
              );
              this.props.App.isMapPermitted = true;
            } //Permission denied
            else {
              //Permission denied, update gprs global vars and lock the platform
              let newStateVars = {};
              newStateVars.hasGPRSPermissions = false;
              newStateVars.didAskForGprs = true;
              this.props.UpdateGrantedGRPS(newStateVars);
              //Close loading animation
              this.resetAnimationLoader();
            }
          }
        }
      } catch (error) {
        //Permission denied, update gprs global vars and lock the platform
        let newStateVars = {};
        newStateVars.hasGPRSPermissions = false;
        newStateVars.didAskForGprs = true;
        this.props.UpdateGrantedGRPS(newStateVars);
        //Close loading animation
        this.resetAnimationLoader();
      }
    } else if (Platform.OS === 'ios') {
      //! SWITCH LATITUDE->LONGITUDEE AND LONGITUDE->LATITUDE - Only for iOS
      if (promptActivation === false) {
        let newStateVars = {};
        const mapZoom =
          this._map !== undefined && this._map !== null
            ? await this._map.getZoom()
            : this.props._NORMAL_MAP_ZOOM_LEVEL;
        //Normal check
        //Check the GPRS permission
        check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE)
          .then((result) => {
            switch (result) {
              case RESULTS.UNAVAILABLE:
                //Permission denied, update gprs global vars and lock the platform
                newStateVars.hasGPRSPermissions = false;
                newStateVars.didAskForGprs = true;
                this.props.UpdateGrantedGRPS(newStateVars);
                //Close loading animation
                this.resetAnimationLoader();
                break;
              case RESULTS.DENIED:
                //Permission denied, update gprs global vars and lock the platform
                newStateVars.hasGPRSPermissions = false;
                newStateVars.didAskForGprs = true;
                this.props.UpdateGrantedGRPS(newStateVars);
                //Close loading animation
                this.resetAnimationLoader();
                break;
              case RESULTS.LIMITED:
                if (
                  this.props.App.gprsGlobals.hasGPRSPermissions === false ||
                  this.props.App.gprsGlobals.didAskForGprs === false ||
                  this.props.App.latitude === 0 ||
                  this.props.App.longitude === 0
                ) {
                  //Permission granted
                  this.getCurrentPositionCusto();
                  GeolocationP.getCurrentPosition(
                    (position) => {
                      globalObject.props.App.latitude =
                        position.coords.latitude;
                      globalObject.props.App.longitude =
                        position.coords.longitude;
                      //Update GPRS permission global var
                      let newStateVars = {};
                      newStateVars.hasGPRSPermissions = true;
                      newStateVars.didAskForGprs = true;
                      globalObject.props.UpdateGrantedGRPS(newStateVars);
                      //Launch recalibration
                      InteractionManager.runAfterInteractions(() => {
                        //globalObject.recalibrateMap();
                      });
                    },
                    () => {
                      // See error code charts below.
                      //Launch recalibration
                      InteractionManager.runAfterInteractions(() => {
                        //globalObject.recalibrateMap();
                      });
                    },
                    {
                      enableHighAccuracy: true,
                      timeout: 200000,
                      maximumAge: 1000,
                      distanceFilter: 3,
                    },
                  );
                  this.props.App.isMapPermitted = true;
                } else {
                  if (globalObject.props.App._MAX_NUMBER_OF_CALLBACKS_MAP > 0) {
                    //! Decrement promise controller
                    globalObject.props.App._MAX_NUMBER_OF_CALLBACKS_MAP -= 1;
                    GeolocationP.getCurrentPosition(
                      (position) => {
                        globalObject.props.App._MAX_NUMBER_OF_CALLBACKS_MAP += 1;
                        globalObject.props.App.latitude =
                          position.coords.latitude;
                        globalObject.props.App.longitude =
                          position.coords.longitude;
                        //Get user location
                        globalObject.props.App.socket.emit(
                          'geocode-this-point',
                          {
                            latitude: globalObject.props.App.latitude,
                            longitude: globalObject.props.App.longitude,
                            user_fingerprint:
                              globalObject.props.App.user_fingerprint,
                          },
                        );
                        //Update GPRS permission global var
                        let newStateVars = {};
                        newStateVars.hasGPRSPermissions = true;
                        newStateVars.didAskForGprs = true;
                        globalObject.props.UpdateGrantedGRPS(newStateVars);
                      },
                      () => {
                        globalObject.props.App._MAX_NUMBER_OF_CALLBACKS_MAP += 1;
                        // See error code charts below.
                        //Launch recalibration
                        InteractionManager.runAfterInteractions(() => {
                          //globalObject.recalibrateMap();
                        });
                      },
                      {
                        enableHighAccuracy: true,
                        timeout: 200000,
                        maximumAge: 10000,
                        distanceFilter: 3,
                      },
                    );
                  }
                  //Check the zoom level
                  if (this._map !== undefined && this._map != null) {
                    if (
                      this._map !== undefined &&
                      this._map != null &&
                      this.props.App.isRideInProgress === false
                    ) {
                      if (mapZoom > 18) {
                        InteractionManager.runAfterInteractions(() => {
                          //globalObject.recalibrateMap();
                        });
                      }
                    }
                  }
                }
                break;
              case RESULTS.GRANTED:
                /*alert(
                  `at ZERO with -> lat: ${globalObject.props.App.latitude}, lng: ${globalObject.props.App.longitude}`,
                );*/
                //! Coordinates order fix - major bug fix for ocean bug
                if (
                  this.props.App.latitude !== undefined &&
                  this.props.App.latitude !== null &&
                  this.props.App.latitude !== 0 &&
                  this.props.App.longitude !== undefined &&
                  this.props.App.longitude !== null &&
                  this.props.App.longitude !== 0
                ) {
                  //? Switch latitude and longitude - check the negative sign
                  if (parseFloat(this.props.App.longitude) < 0) {
                    //Negative - switch
                    let latitudeTmp = this.props.App.latitude;
                    this.props.App.latitude = this.props.App.longitude;
                    this.props.App.longitude = latitudeTmp;
                  }
                }
                //!--------- Ocean bug fix
                if (
                  this.props.App.gprsGlobals.hasGPRSPermissions === false ||
                  this.props.App.gprsGlobals.didAskForGprs === false ||
                  this.props.App.latitude === 0 ||
                  this.props.App.longitude === 0
                ) {
                  console.log(
                    `at ZERO with -> lat: ${globalObject.props.App.latitude}, lng: ${globalObject.props.App.longitude}`,
                  );
                  //Permission granted
                  this.getCurrentPositionCusto();
                  GeolocationP.getCurrentPosition(
                    (position) => {
                      globalObject.props.App.latitude =
                        position.coords.longitude;
                      globalObject.props.App.longitude =
                        position.coords.latitude;
                      //Update GPRS permission global var
                      let newStateVars = {};
                      newStateVars.hasGPRSPermissions = true;
                      newStateVars.didAskForGprs = true;
                      globalObject.props.UpdateGrantedGRPS(newStateVars);
                      //Launch recalibration
                      InteractionManager.runAfterInteractions(() => {
                        //globalObject.recalibrateMap();
                      });
                    },
                    () => {
                      // See error code charts below.
                      //Launch recalibration
                      InteractionManager.runAfterInteractions(() => {
                        //globalObject.recalibrateMap();
                      });
                    },
                    {
                      enableHighAccuracy: true,
                      timeout: 200000,
                      maximumAge: 1000,
                      distanceFilter: 3,
                    },
                  );
                  this.props.App.isMapPermitted = true;
                } else {
                  if (globalObject.props.App._MAX_NUMBER_OF_CALLBACKS_MAP > 0) {
                    //! Decrement promise controller
                    globalObject.props.App._MAX_NUMBER_OF_CALLBACKS_MAP -= 1;
                    GeolocationP.getCurrentPosition(
                      (position) => {
                        globalObject.props.App._MAX_NUMBER_OF_CALLBACKS_MAP += 1;
                        globalObject.props.App.latitude =
                          position.coords.longitude;
                        globalObject.props.App.longitude =
                          position.coords.latitude;
                        //Get user location
                        globalObject.props.App.socket.emit(
                          'geocode-this-point',
                          {
                            latitude: globalObject.props.App.latitude,
                            longitude: globalObject.props.App.longitude,
                            user_fingerprint:
                              globalObject.props.App.user_fingerprint,
                          },
                        );
                        //Update GPRS permission global var
                        let newStateVars = {};
                        newStateVars.hasGPRSPermissions = true;
                        newStateVars.didAskForGprs = true;
                        globalObject.props.UpdateGrantedGRPS(newStateVars);
                      },
                      () => {
                        globalObject.props.App._MAX_NUMBER_OF_CALLBACKS_MAP += 1;
                        // See error code charts below.
                        //Launch recalibration
                        InteractionManager.runAfterInteractions(() => {
                          //globalObject.recalibrateMap();
                        });
                      },
                      {
                        enableHighAccuracy: true,
                        timeout: 200000,
                        maximumAge: 10000,
                        distanceFilter: 3,
                      },
                    );
                  }
                  //Check the zoom level
                  if (this._map !== undefined && this._map != null) {
                    if (
                      this._map !== undefined &&
                      this._map != null &&
                      this.props.App.isRideInProgress === false
                    ) {
                      if (mapZoom > 18) {
                        InteractionManager.runAfterInteractions(() => {
                          console.log(
                            `Recalibrate with -> lat: ${globalObject.props.App.latitude}, lng: ${globalObject.props.App.longitude}`,
                          );
                          //globalObject.recalibrateMap();
                        });
                      }
                    }
                  }
                }
                break;
              case RESULTS.BLOCKED:
                //Permission denied, update gprs global vars and lock the platform
                newStateVars.hasGPRSPermissions = false;
                newStateVars.didAskForGprs = true;
                this.props.UpdateGrantedGRPS(newStateVars);
                //Close loading animation
                this.resetAnimationLoader();
                break;
            }
          })
          .catch((error) => {
            // …
          });
      } //Location permission explicitly requested
      else {
        console.log('requested permission by click');
        GeolocationP.requestAuthorization('whenInUse');
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
            <StatusBar barStyle={'dark-content'} />
            <SafeAreaView style={{flexDirection: 'row', alignItems: 'center'}}>
              <TouchableOpacity
                onPress={() =>
                  InteractionManager.runAfterInteractions(() => {
                    this.props.navigation.openDrawer();
                  })
                }
                style={{
                  top: 1.5,
                  backgroundColor: '#fff',
                  width: 50,
                  height: 50,
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
                <IconMaterialIcons name="menu" size={35} />
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
                          fontSize: RFValue(19),
                          fontFamily:
                            Platform.OS === 'android'
                              ? 'UberMoveTextBold'
                              : 'Uber Move Text Bold',
                          color: '#fff',
                        },
                      ]}>
                      {this.props.App.main_interfaceState_vars
                        .dailyAmount_madeSoFar.currency_symbol +
                        ' ' +
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
                  width: 45,
                  height: 45,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 150,
                  backgroundColor: '#096ED4',
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
                <IconCommunity name="bell" color="#fff" size={29} />
              </TouchableOpacity>
            </SafeAreaView>
          </View>
        );
      } //A ride is in progress actively in navigation mode
      else {
        if (
          this.props.App.requests_data_main_vars.moreDetailsFocused_request ===
            false ||
          this.props.App.requests_data_main_vars.fetchedRequests_data_store ===
            false ||
          this.props.App.requests_data_main_vars.moreDetailsFocused_request ===
            undefined
        ) {
          //Invalid setup - close modal
          this.props.App.main_interfaceState_vars.isApp_inNavigation_mode = false;
          this.props.UpdateErrorModalLog(false, true, 'anyo'); //Update the global state
          return null;
        }
        return (
          <SafeAreaView
            style={{
              flexDirection: 'row',
              alignItems: 'center',
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
              height: Platform.OS === 'android' ? 160 : 200,
            }}>
            <View
              style={{
                flex: 1,
                padding: 20,
                paddingTop: 15,
                paddingBottom: 15,
              }}>
              {this.props.App.main_interfaceState_vars.isComputing_route ===
              false ? (
                <View style={{flex: 1}}>
                  <StatusBar barStyle={'light-content'} />
                  <View
                    style={{
                      flexDirection: 'row',
                      borderBottomWidth: 1,
                      borderBottomColor: '#a5a5a5',
                      paddingBottom: Platform.OS === 'android' ? 10 : 15,
                    }}>
                    <View
                      style={{
                        width: 50,
                        height: 50,
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
                        paddingLeft: 10,
                        marginLeft: 5,
                        flex: 1,
                      }}>
                      <View
                        style={{
                          flex: 1,
                          minHeight: 30,
                        }}>
                        <Text
                          style={[
                            {
                              fontFamily:
                                Platform.OS === 'android'
                                  ? 'MoveBold'
                                  : 'Uber Move Bold',
                              fontSize: RFValue(22),
                              color: '#fff',
                            },
                          ]}>
                          {this.props.App.main_interfaceState_vars
                            .navigationRouteData.instructions[0].text.length >
                          22
                            ? this.props.App.main_interfaceState_vars.navigationRouteData.instructions[0].text.substring(
                                0,
                                18,
                              ) + '...'
                            : this.props.App.main_interfaceState_vars
                                .navigationRouteData.instructions[0].text}
                        </Text>
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                          paddingTop: 5,
                        }}>
                        <Text
                          style={{
                            fontFamily:
                              Platform.OS === 'android'
                                ? 'UberMoveTextMedium'
                                : 'Uber Move Text Medium',
                            fontSize: RFValue(18),
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
                            fontFamily:
                              Platform.OS === 'android'
                                ? 'UberMoveTextMedium'
                                : 'Uber Move Text Medium',
                            fontSize: RFValue(18),
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
                      minHeight: 48,
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
                    <View
                      style={{
                        flex: 1,
                      }}>
                      <Text
                        style={{
                          flex: 1,
                          fontFamily:
                            Platform.OS === 'android'
                              ? 'UberMoveTextBold'
                              : 'Uber Move Text Bold',
                          fontSize: RFValue(17.5),
                          color: '#fff',
                        }}>
                        {/**Check if the client was already picked up, if yes show the 1st destination location, if not show the pickup location */}
                        {this.props.App.requests_data_main_vars
                          .moreDetailsFocused_request.ride_basic_infos
                          .inRideToDestination
                          ? this.props.App.requests_data_main_vars
                              .moreDetailsFocused_request
                              .origin_destination_infos.destination_infos[0]
                              .suburb
                          : this.props.App.requests_data_main_vars
                              .moreDetailsFocused_request
                              .origin_destination_infos.pickup_infos.suburb}
                      </Text>
                      <Text
                        style={{
                          flex: 1,
                          fontFamily:
                            Platform.OS === 'android'
                              ? 'UberMoveTextRegular'
                              : 'Uber Move Text',
                          fontSize: RFValue(16.5),
                          color: '#fff',
                        }}>
                        {this.props.App.requests_data_main_vars
                          .moreDetailsFocused_request.ride_basic_infos
                          .inRideToDestination
                          ? this.props.App.requests_data_main_vars
                              .moreDetailsFocused_request
                              .origin_destination_infos.destination_infos[0]
                              .location_name
                          : this.props.App.requests_data_main_vars
                              .moreDetailsFocused_request
                              .origin_destination_infos.pickup_infos
                              .location_name}

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
                                fontFamily:
                                  Platform.OS === 'android'
                                    ? 'UberMoveTextRegular'
                                    : 'Uber Move Text',
                                fontSize: RFValue(16.5),
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
                              fontFamily:
                                Platform.OS === 'android'
                                  ? 'UberMoveTextRegular'
                                  : 'Uber Move Text',
                              fontSize: RFValue(16.5),
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
                        fontFamily:
                          Platform.OS === 'android'
                            ? 'UberMoveTextMedium'
                            : 'Uber Move Text Medium',
                        fontSize: RFValue(23),
                        color: '#fff',
                      }}>
                      Finding route...
                    </Text>
                  </View>
                </View>
              )}
            </View>
          </SafeAreaView>
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
          <StatusBar backgroundColor="#fff" barStyle={'dark-content'} />
          <SafeAreaView style={{flexDirection: 'row', alignItems: 'center'}}>
            <TouchableOpacity
              onPress={() =>
                InteractionManager.runAfterInteractions(() => {
                  this.props.navigation.openDrawer();
                })
              }
              style={{top: 1.5}}>
              <IconMaterialIcons name="menu" size={35} />
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
                        fontSize: RFValue(19),
                        fontFamily:
                          Platform.OS === 'android'
                            ? 'UberMoveTextBold'
                            : 'Uber Move Text Bold',
                        color: '#fff',
                      },
                    ]}>
                    {this.props.App.main_interfaceState_vars
                      .dailyAmount_madeSoFar.currency_symbol +
                      ' ' +
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
                backgroundColor: '#096ED4',
              }}>
              <IconFontAwesome name="location-arrow" color="#fff" size={22} />
            </TouchableOpacity>
          </SafeAreaView>
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
      /*if (this.camera !== undefined && this.camera != null) {
        this.camera.fitBounds(
          [this.props.App.longitude, this.props.App.latitude],
          this.props.App.main_interfaceState_vars.navigationRouteData.destinationPoint.map(
            parseFloat,
          ),
          80,
          2000,
        );
      }*/
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
   * @func generateBasic_ridesDeliveriesList
   * Responsible for organizing and creating the list of rides received from the server.
   */
  generateBasic_ridesDeliveriesList() {
    return (
      <FlatList
        style={{
          flex: 1,
          backgroundColor: '#f0f0f0',
          padding: 10,
          paddingBottom: 50,
        }}
        data={
          this.props.App.requests_data_main_vars.fetchedRequests_data_store !==
            undefined &&
          this.props.App.requests_data_main_vars.fetchedRequests_data_store !==
            null &&
          this.props.App.requests_data_main_vars.fetchedRequests_data_store !==
            false
            ? this.props.App.requests_data_main_vars.fetchedRequests_data_store
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
    );
  }

  /**
   * @function renderCenterMainHome
   * Responsible for rendering the center part of the home screen based on if the app is in normal or navigation
   * mode.
   */
  renderCenterMainHome() {
    //! Coordinates order fix - major bug fix for ocean bug
    if (
      this.props.App.latitude !== undefined &&
      this.props.App.latitude !== null &&
      this.props.App.latitude !== 0 &&
      this.props.App.longitude !== undefined &&
      this.props.App.longitude !== null &&
      this.props.App.longitude !== 0
    ) {
      //? Switch latitude and longitude - check the negative sign
      if (parseFloat(this.props.App.longitude) < 0) {
        //Negative - switch
        let latitudeTmp = this.props.App.latitude;
        this.props.App.latitude = this.props.App.longitude;
        this.props.App.longitude = latitudeTmp;
      }
    }
    //!--------- Ocean bug fix
    if (this.props.App.main_interfaceState_vars.isApp_inNavigation_mode) {
      //alert([this.props.App.longitude, this.props.App.latitude]);
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
                ? Platform.OS === 'android'
                  ? 15
                  : 17.8
                : 14
            }
            pitch={
              this.props.App.main_interfaceState_vars.isApp_inTrackingMode
                ? 50
                : 0
            }
            //followUserLocation={true}
            followUserMode={'compass'}
            //followUserMode={'normal'}
            centerCoordinate={[
              this.props.App.longitude,
              this.props.App.latitude,
            ]}
          />
          <ShapeSource
            id="symbolCarIcon"
            shape={{
              type: 'Point',
              coordinates: [this.props.App.longitude, this.props.App.latitude],
            }}>
            <SymbolLayer
              id="symbolCarLayer"
              minZoomLevel={1}
              style={{
                iconAllowOverlap: true,
                iconRotationAlignment: 'map',
                iconImage: this.props.App.arrowNavigationTracking,
                iconSize: 0.18,
              }}
            />
          </ShapeSource>
          {this.renderRouteElements()}
        </MapView>
      );
    } //Navigation off - show requests list
    else {
      return (
        <View style={{flex: 1}}>
          <GenericLoader
            active={this.state.loaderState}
            opacity={this.state.loaderState ? 1 : 0}
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
            this.generateBasic_ridesDeliveriesList()
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
                    fontFamily:
                      Platform.OS === 'android'
                        ? 'UberMoveTextMedium'
                        : 'Uber Move Text Medium',
                    fontSize: RFValue(18),
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
                    fontFamily:
                      Platform.OS === 'android'
                        ? 'UberMoveTextRegular'
                        : 'Uber Move Text',
                    fontSize: RFValue(16),
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
            console.log('Interval navigation started');
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
            <SafeAreaView
              style={{
                shadowColor: '#000',
                shadowOffset: {
                  width: 0,
                  height: 12,
                },
                shadowOpacity: 0.58,
                shadowRadius: 16.0,

                elevation: 24,
                backgroundColor: '#fff',
              }}>
              <View
                style={{
                  position: 'absolute',
                  top: -160,
                  right: 15,
                  zIndex: 900000000000,
                  alignItems: 'center',
                }}>
                <TouchableOpacity
                  onPress={() =>
                    InteractionManager.runAfterInteractions(() => {
                      this.props.UpdateErrorModalLog(
                        true,
                        'show_guardian_toolkit',
                        'any',
                      );
                    })
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
                  <IconCommunity
                    name="map-marker-path"
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
                      InteractionManager.runAfterInteractions(() => {
                        this.props.UpdateErrorModalLog(
                          true,
                          'show_modalMore_tripDetails',
                          'any',
                          this.props.App.requests_data_main_vars
                            .moreDetailsFocused_request,
                        );
                      })
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
                          fontFamily:
                            Platform.OS === 'android'
                              ? 'UberMoveTextMedium'
                              : 'Uber Move Text Medium',
                          fontSize: RFValue(19),
                        }}>
                        {
                          this.props.App.requests_data_main_vars
                            .moreDetailsFocused_request.passenger_infos.name
                        }
                      </Text>
                      <Text
                        style={{
                          fontFamily:
                            Platform.OS === 'android'
                              ? 'UberMoveTextRegular'
                              : 'Uber Move Text',
                          fontSize: RFValue(17),
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
                      InteractionManager.runAfterInteractions(() => {
                        this.props.SwitchToNavigation_modeOrBack({
                          isApp_inNavigation_mode: false,
                        });
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
            </SafeAreaView>
          );
        } //No active ride in navigation mode
        else {
          return (
            <View>
              <SafeAreaView
                style={{
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
                <TouchableOpacity
                  onPress={() =>
                    this.props.App.main_interfaceState_vars.isDriver_online
                      ? InteractionManager.runAfterInteractions(() => {
                          this.props.UpdateErrorModalLog(
                            true,
                            'show_select_ride_type_modal_ChooseFocusRideForWork',
                            'any',
                          );
                        })
                      : {}
                  }
                  style={{
                    height: 90,
                    justifyContent: 'center',
                    backgroundColor: '#fff',
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
                            fontFamily:
                              Platform.OS === 'android'
                                ? 'UberMoveTextMedium'
                                : 'Uber Move Text Medium',
                            fontSize: RFValue(20),
                            flex: 1,
                          }}>
                          {this.props.App.shownRides_types}
                        </Text>
                        {/**Requests graph */}
                        {this.props.App._Requests_graphInfos !== null &&
                        this.props.App._Requests_graphInfos !== undefined &&
                        this.props.App._Requests_graphInfos.rides !==
                          undefined &&
                        parseInt(this.props.App._Requests_graphInfos.rides) +
                          parseInt(
                            this.props.App._Requests_graphInfos.deliveries,
                          ) +
                          parseInt(
                            this.props.App._Requests_graphInfos.scheduled,
                          ) >
                          0 ? (
                          <View
                            style={{
                              borderWidth: 1,
                              borderColor: '#E11900',
                              backgroundColor: '#E11900',
                              width: 37,
                              height: 37,
                              alignItems: 'center',
                              justifyContent: 'center',
                              borderRadius: 200,
                              marginRight: '5%',
                            }}>
                            <Text
                              style={{
                                color: '#fff',
                                fontFamily:
                                  Platform.OS === 'android'
                                    ? 'UberMoveTextMedium'
                                    : 'Uber Move Text Medium',
                                fontSize: RFValue(18),
                              }}>
                              {parseInt(
                                this.props.App._Requests_graphInfos.rides,
                              ) +
                                parseInt(
                                  this.props.App._Requests_graphInfos
                                    .deliveries,
                                ) +
                                parseInt(
                                  this.props.App._Requests_graphInfos.scheduled,
                                )}
                            </Text>
                          </View>
                        ) : null}
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
                            fontFamily:
                              Platform.OS === 'android'
                                ? 'MoveMedium'
                                : 'Uber Move Medium',
                            fontSize: 20,
                            color: '#fff',
                          }}>
                          Go online
                        </Text>
                      </View>
                    </View>
                  )}
                </TouchableOpacity>
              </SafeAreaView>
            </View>
          );
        }
      } //Navigation off - show footer
      else {
        return (
          <SafeAreaView style={{backgroundColor: '#fff'}}>
            <TouchableOpacity
              onPress={() =>
                InteractionManager.runAfterInteractions(() => {
                  this.props.UpdateErrorModalLog(
                    true,
                    'show_select_ride_type_modal_ChooseFocusRideForWork',
                    'any',
                  );
                })
              }
              style={{
                height: 80,
                justifyContent: 'center',
                backgroundColor: '#fff',
                borderTopWidth: 2,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  padding: 20,
                }}>
                <View
                  style={{flexDirection: 'row', alignItems: 'center', flex: 1}}>
                  <IconCommunity
                    name="square"
                    size={10}
                    style={{top: 1, marginRight: 5}}
                  />
                  <Text
                    style={{
                      fontFamily:
                        Platform.OS === 'android'
                          ? 'UberMoveTextMedium'
                          : 'Uber Move Text Medium',
                      fontSize: RFValue(20),
                      flex: 1,
                    }}>
                    {this.props.App.shownRides_types}
                  </Text>

                  {/**Requests graph */}
                  {this.props.App._Requests_graphInfos !== null &&
                  this.props.App._Requests_graphInfos !== undefined &&
                  this.props.App._Requests_graphInfos.rides !== undefined &&
                  parseInt(this.props.App._Requests_graphInfos.rides) +
                    parseInt(this.props.App._Requests_graphInfos.deliveries) +
                    parseInt(this.props.App._Requests_graphInfos.scheduled) >
                    0 ? (
                    <View
                      style={{
                        borderWidth: 1,
                        borderColor: '#E11900',
                        backgroundColor: '#E11900',
                        width: 37,
                        height: 37,
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: 200,
                        marginRight: '5%',
                      }}>
                      <Text
                        style={{
                          color: '#fff',
                          fontFamily:
                            Platform.OS === 'android'
                              ? 'UberMoveTextMedium'
                              : 'Uber Move Text Medium',
                          fontSize: RFValue(18),
                        }}>
                        {parseInt(this.props.App._Requests_graphInfos.rides) +
                          parseInt(
                            this.props.App._Requests_graphInfos.deliveries,
                          ) +
                          parseInt(
                            this.props.App._Requests_graphInfos.scheduled,
                          )}
                      </Text>
                    </View>
                  ) : null}
                </View>
                <IconMaterialIcons
                  name="keyboard-arrow-down"
                  color={'#000'}
                  size={22}
                />
              </View>
            </TouchableOpacity>
          </SafeAreaView>
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
        <SafeAreaView style={{backgroundColor: '#fff'}}>
          <TouchableOpacity
            onPress={() =>
              this.props.App.main_interfaceState_vars.dailyAmount_madeSoFar !==
              false
                ? this.props.App.main_interfaceState_vars.isDriver_online
                  ? InteractionManager.runAfterInteractions(() => {
                      this.props.UpdateErrorModalLog(
                        true,
                        'show_select_ride_type_modal',
                        'any',
                      );
                    })
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
                      fontFamily:
                        Platform.OS === 'android'
                          ? 'MoveMedium'
                          : 'Uber Move Medium',
                      fontSize: this.props.App.main_interfaceState_vars
                        .isDriver_online
                        ? 20
                        : 22,
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
                        fontFamily:
                          Platform.OS === 'android'
                            ? 'MoveMedium'
                            : 'Uber Move Medium',
                        fontSize: 20,
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
        </SafeAreaView>
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
            ? 7000
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
      <View style={styles.mainView}>
        <StatusBar backgroundColor="#fff" barStyle={'dark-content'} />
        {this.props.App.generalErrorModal_vars.showErrorGeneralModal
          ? this.renderError_modalView()
          : null}
        {this.renderMainComponent()}
      </View>
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
      UpdateRequestsGraphs,
    },
    dispatch,
  );

export default React.memo(connect(mapStateToProps, mapDispatchToProps)(Home));
