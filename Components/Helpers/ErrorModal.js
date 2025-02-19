import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Platform,
} from 'react-native';
import Modal from 'react-native-modal';
import IconCommunity from 'react-native-vector-icons/MaterialCommunityIcons';
import IconMaterialIcons from 'react-native-vector-icons/MaterialIcons';
import IconFontisto from 'react-native-vector-icons/Fontisto';
import IconEntypo from 'react-native-vector-icons/Entypo';
import GenericLoader from '../Modules/GenericLoader/GenericLoader';
import IconFeather from 'react-native-vector-icons/Feather';
import IconAnt from 'react-native-vector-icons/AntDesign';
import {
  ResetGenericPhoneNumberInput,
  UpdateType_rideShown_YourRides_screen,
  UpdateErrorModalLog,
  SwitchToNavigation_modeOrBack,
  UpdateFocusedWeekDeepWalletInsights,
  UpdateRequestType_focused,
  UpdateType_rideShown_YourRides_screen_HISTORY,
} from '../Redux/HomeActionsCreators';
import call from 'react-native-phone-call';
import {RFValue} from 'react-native-responsive-fontsize';
import {FlatList} from 'react-native-gesture-handler';
import IconIonic from 'react-native-vector-icons/Ionicons';
import SyncStorage from 'sync-storage';
import LaunchNavigator from 'react-native-launch-navigator';

class ErrorModal extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      //Drop off rating metadata
      rating_score: 4, //The rating for the driver selected by the user - default: 4
      compliment_array: {
        neatAndTidy: false,
        excellentService: false,
        greatMusic: false,
        greatConversation: false,
        expertNavigator: false,
      }, //The compliment for the driver selectedd by the user - array of compliment strings - default: [], strings: neatAndTidy, excellentService, greatMusic, greatConversation, expertNavigator
      custom_note: false, //The custom note entered by the user,
      isLoading_something: false, //Responsible for handling any kind of native loader (circle) within the context of this class
      isNestedModal_activeisNestedModal_active: false, //To know whether or not the nested modal is active - default: false
      nestedChildModal_content: false, //The string that help render the right content for the nested modal - default: false
    };
  }

  componentDidMount() {
    let globalObject = this;
    /**
     * SOCKET.IO RESPONSES
     */
    //1. Handle cancel request response
    this.props.App.socket.on(
      'cancel_request_driver_io-response',
      function (response) {
        setTimeout(function () {
          //Stop the loader and restore
          globalObject.setState({isLoading_something: false});
          if (
            response !== false &&
            response.response !== undefined &&
            response.response !== null
          ) {
            //Received a response
            if (/unable_to_cancel_request_error$/i.test(response.response)) {
              //Error
              globalObject.props.UpdateErrorModalLog(
                true,
                'error_cancelling',
                'any',
              ); //Close modal
            } else if (
              /unable_to_cancel_request_error_daily_cancellation_limit_exceeded$/i.test(
                response.response,
              )
            ) {
              //Has exceeded the daily amount of cancellations
              globalObject.props.App.abusive_behavior_infos = {};
              globalObject.props.App.abusive_behavior_infos[
                'message'
              ] = `You've exceeded your daily amount of cancelled requests, please try from now on to only accept the requests that you will complete to avoid any potential suspension.`;
              globalObject.props.UpdateErrorModalLog(
                true,
                'warning_due_to_abuse',
                'any',
              );
            }
            //Success
            else {
              globalObject.props.UpdateErrorModalLog(false, false, 'any'); //Close modal
            }
          } //error - close modal
          else {
            globalObject.props.UpdateErrorModalLog(
              true,
              'error_cancelling',
              'any',
            ); //Close modal
          }
        }, globalObject.props.App._TMP_TIMEOUT_AFTER_REQUEST_RESPONSE);
      },
    );

    //2. Handle confirm pickup request response
    this.props.App.socket.on(
      'confirm_pickup_request_driver_io-response',
      function (response) {
        setTimeout(function () {
          //Stop the loader and restore
          globalObject.setState({isLoading_something: false});
          if (
            response !== false &&
            response.response !== undefined &&
            response.response !== null
          ) {
            //Received a response
            if (/unable/i.test(response.response)) {
              //Error
              globalObject.props.UpdateErrorModalLog(
                true,
                'error_confirming_pickup',
                'any',
              ); //Close modal
            } //Success
            else {
              //Activate computing route variable
              globalObject.props.App.main_interfaceState_vars.isComputing_route = true;
              //...
              globalObject.props.UpdateErrorModalLog(
                true,
                'show_modalMore_tripDetails',
                'any',
                globalObject.props.App.requests_data_main_vars
                  .moreDetailsFocused_request,
              ); //Close modal
            }
          } //error - close modal
          else {
            globalObject.props.UpdateErrorModalLog(
              true,
              'error_confirming_pickup',
              'any',
            ); //Close modal
          }
        }, globalObject.props.App._TMP_TIMEOUT_AFTER_REQUEST_RESPONSE + 1500);
      },
    );

    //3. Handle confirm dropoff request response
    this.props.App.socket.on(
      'confirm_dropoff_request_driver_io-response',
      function (response) {
        setTimeout(function () {
          //Stop the loader and restore
          globalObject.setState({isLoading_something: false});
          if (
            response !== false &&
            response.response !== undefined &&
            response.response !== null
          ) {
            //Received a response
            if (/unable/i.test(response.response)) {
              //Error
              globalObject.props.UpdateErrorModalLog(
                true,
                'error_confirming_dropoff',
                'any',
              ); //Close modal
            } //Success
            else {
              globalObject.props.UpdateErrorModalLog(false, false, 'any'); //Close modal
            }
          } //error - close modal
          else {
            globalObject.props.UpdateErrorModalLog(
              true,
              'error_confirming_dropoff',
              'any',
            ); //Close modal
          }
        }, globalObject.props.App._TMP_TIMEOUT_AFTER_REQUEST_RESPONSE + 1500);
      },
    );
  }

  /**
   * @func updateYourRidesSHownOnes
   * @param type: Rides, Delivery or Scheduled
   * Responsible for updating the type of ride shown in the "Main" tab.
   */
  updateYourRidesSHownOnes(type, parentNode) {
    parentNode.setState({loaderState: true});
    this.props.UpdateErrorModalLog(false, false, 'any'); //Close modal
    this.props.UpdateType_rideShown_YourRides_screen(type);
    //Update the list of requests from the server
  }

  /**
   * @func updateYourRidesSHownOnesTAB
   * @param type: Rides, Delivery or Scheduled
   * Responsible for updating the type of ride shown in the "Your rides" tab.
   */
  updateYourRidesSHownOnesTab(type) {
    this.props.UpdateErrorModalLog(false, false, 'any'); //Close modal
    this.props.UpdateType_rideShown_YourRides_screen_HISTORY(type);
    //Update the list of requests from the server
    this.props.App.fetchRequestedRequests_history(type);
    //Update the list of requests from the server
  }

  /**
   * @func signOff_theApp
   * Responsible for signing the user off the app, clear all the storages and reset everything before.
   */
  signOff_theApp() {
    let globalObject = this;
    //...
    //2. Clear all the intervals
    if (globalObject.props.App._TMP_TRIP_INTERVAL_PERSISTER !== null) {
      clearInterval(globalObject.props.App._TMP_TRIP_INTERVAL_PERSISTER);
      globalObject.props.App._TMP_TRIP_INTERVAL_PERSISTER = null;
    }

    //3. Clear all the storages
    SyncStorage.remove('@user_fp');
    SyncStorage.remove('@userLocationPoint');
    SyncStorage.remove('@gender_user');
    SyncStorage.remove('@username');
    SyncStorage.remove('@surname_user');
    SyncStorage.remove('@user_email');
    SyncStorage.remove('@phone_user');
    SyncStorage.remove('@user_profile_pic');
    SyncStorage.remove('@accountCreation_state');

    //Reinitiate values
    globalObject.props.App.user_fingerprint = null;
    globalObject.props.App.gender_user = 'male';
    globalObject.props.App.username = false;
    globalObject.props.App.surname_user = false;
    globalObject.props.App.user_email = false;
    globalObject.props.App.user_profile_pic = null;
    globalObject.props.App.last_dataPersoUpdated = null;
    globalObject.props.App.userCurrentLocationMetaData = {};
    globalObject.props.App.accountCreation_state = null;
    //Log out
    globalObject.props.UpdateErrorModalLog(false, false, 'any');
    globalObject.props.parentNode.props.navigation.navigate('EntryScreen');
  }

  /**
   * @func cancelRequest_driver
   * Responsible for cancelling any current request as selected by the user
   */
  cancelRequest_driver() {
    this.setState({isLoading_something: true}); //Activate the loader
    //Bundle the cancel input
    let bundleData = {
      request_fp: this.props.App.requests_data_main_vars
        .moreDetailsFocused_request.request_fp,
      driver_fingerprint: this.props.App.user_fingerprint,
    };
    //...
    this.props.App.socket.emit('cancel_request_driver_io', bundleData);
  }

  /**
   * @func confirmPickupRequest_driver
   * Responsible for confirming pickup for any current request as selected by the user
   */
  confirmPickupRequest_driver() {
    this.setState({isLoading_something: true}); //Activate the loader
    //Bundle the input data
    let bundleData = {
      request_fp: this.props.App.requests_data_main_vars
        .moreDetailsFocused_request.request_fp,
      driver_fingerprint: this.props.App.user_fingerprint,
    };
    //...
    this.props.App.socket.emit('confirm_pickup_request_driver_io', bundleData);
  }

  /**
   * @func confirmDropoffRequest_driver
   * Responsible for confirming dropoff for any current request as selected by the user
   */
  confirmDropoffRequest_driver() {
    this.setState({isLoading_something: true}); //Activate the loader
    //Bundle the input data
    let bundleData = {
      request_fp: this.props.App.requests_data_main_vars
        .moreDetailsFocused_request.request_fp,
      driver_fingerprint: this.props.App.user_fingerprint,
    };
    //...
    this.props.App.socket.emit('confirm_dropoff_request_driver_io', bundleData);
  }

  /**
   * @func goBackFUnc
   * @param parentNode: parent of the host class, to do very useful actions like navigate through stack navigations
   * and many more permitted by 'this'.
   * Responsible for going back the phone number verification and
   * most importantly reset the validity of the phone number and it's value
   *
   */
  goBackFUnc(parentNode) {
    this.props.ResetGenericPhoneNumberInput();
    parentNode.setState({
      showSendAgain: false,
      otpValue: '',
      showErrorUnmatchedOTP: false,
    }); //Hide send again and show after 30 sec
    parentNode.props.navigation.navigate('PhoneDetailsScreen');
  }

  /**
   * @func launchTaxiConnectNavigator
   * Responsible for launching the Taxiconnect default Navigation system
   */
  launchTaxiConnectNavigator() {
    this.props.SwitchToNavigation_modeOrBack({
      isApp_inNavigation_mode: true,
      isRideInProgress: true,
      requestData: this.props.App.requests_data_main_vars
        .moreDetailsFocused_request,
    });
  }

  /**
   * @func lauch3rdPartyNavigator
   * Responsible for launching a 3rd party navigation system.
   */
  lauch3rdPartyNavigator() {
    let app = null;
    let globalObject = this;
    //Get the correct 3rd party map selected by the user.
    let thirdPartyMapIdentifyer = /google_maps/i.test(
      this.props.App.default_navigation_system,
    )
      ? LaunchNavigator.APP.GOOGLE_MAPS
      : /apple_maps/i.test(this.props.App.default_navigation_system)
      ? LaunchNavigator.APP.APPLE_MAPS
      : /waze/i.test(this.props.App.default_navigation_system)
      ? LaunchNavigator.APP.WAZE
      : Platform.OS === 'android'
      ? LaunchNavigator.APP.GOOGLE_MAPS
      : LaunchNavigator.APP.APPLE_MAPS;

    LaunchNavigator.isAppAvailable(thirdPartyMapIdentifyer).then(
      (is3rdPAvailable) => {
        if (is3rdPAvailable) {
          app = thirdPartyMapIdentifyer;
        } else {
          //"3rd party map not available - falling back to default navigation app"
          globalObject.launchTaxiConnectNavigator();
        }

        let pointTarget = globalObject.getPickupOrDestinationCoords();
        pointTarget = [pointTarget[1], pointTarget[0]];

        LaunchNavigator.navigate(pointTarget, {
          app: app,
        })
          .then(() => {})
          .catch((err) => globalObject.launchTaxiConnectNavigator());
      },
    );
  }

  /**
   * @func getPickupOrDestinationCoords
   * Responsible for getting the pickup or destination coord based on the state of the trip.
   */
  getPickupOrDestinationCoords() {
    let pickupCoords =
      this.props.App.requests_data_main_vars.moreDetailsFocused_request
        .origin_destination_infos !== undefined
        ? this.props.App.requests_data_main_vars.moreDetailsFocused_request
            .origin_destination_infos.pickup_infos.coordinates
        : null;
    pickupCoords =
      this.props.App.requests_data_main_vars.moreDetailsFocused_request
        .origin_destination_infos !== undefined
        ? [pickupCoords.longitude, pickupCoords.latitude].map(parseFloat)
        : [this.props.App.longitude, this.props.App.latitude]; //?Pack pickup point

    let destinationCoords =
      this.props.App.requests_data_main_vars.moreDetailsFocused_request
        .origin_destination_infos !== undefined
        ? this.props.App.requests_data_main_vars.moreDetailsFocused_request
            .origin_destination_infos.destination_infos[0].coordinates
        : null;
    //!--------------
    let pickLatitude1 =
      this.props.App.requests_data_main_vars.moreDetailsFocused_request
        .origin_destination_infos !== undefined
        ? parseFloat(destinationCoords.latitude)
        : this.props.App.latitude;
    let pickLongitude1 =
      this.props.App.requests_data_main_vars.moreDetailsFocused_request
        .origin_destination_infos !== undefined
        ? parseFloat(destinationCoords.longitude)
        : this.props.App.longitude;
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
        destinationCoords = {
          latitude: destinationCoords.longitude,
          longitude: destinationCoords.latitude,
        };
      }
    }
    //!-----------------
    destinationCoords =
      this.props.App.requests_data_main_vars.moreDetailsFocused_request
        .origin_destination_infos !== undefined
        ? [destinationCoords.longitude, destinationCoords.latitude].map(
            parseFloat,
          )
        : [this.props.App.longitude, this.props.App.latitude]; //? Pack first destination point

    ///DONE
    let finalPoint =
      this.props.App.requests_data_main_vars.moreDetailsFocused_request
        .ride_basic_infos.isAccepted &&
      this.props.App.requests_data_main_vars.moreDetailsFocused_request
        .ride_basic_infos.inRideToDestination
        ? destinationCoords //?To destination
        : pickupCoords; //?To pickup

    return finalPoint;
  }

  /**
   * @func renderModalContent()
   * @param error_status: the identify the error type
   * Render differents modals based on the situation: mainly integrated in the main map for
   * Entering receiver's infos and showing quick safety features.
   */
  renderModalContent(error_status) {
    if (/connection_no_network/i.test(error_status)) {
      //Show delivery input modal
      return (
        <View
          style={{
            backgroundColor: '#fff',
            padding: 20,
            height: 260,
          }}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <IconCommunity
              name="network-strength-1-alert"
              size={20}
              style={{marginRight: 5}}
            />
            <Text
              style={{
                fontFamily:
                  Platform.OS === 'android'
                    ? 'UberMoveTextMedium'
                    : 'Uber Move Text Medium',
                fontSize: RFValue(20),
              }}>
              No Internet connection
            </Text>
          </View>
          <View>
            <Text
              style={{
                fontFamily:
                  Platform.OS === 'android'
                    ? 'UberMoveTextLight'
                    : 'Uber Move Text',
                fontSize: RFValue(17),
                marginTop: 10,
                lineHeight: 23,
              }}>
              It looks like your Internet connection is unavailable, please try
              connecting to a Wi-fi or mobile data point.
            </Text>
          </View>
          <View style={{flex: 1, justifyContent: 'center'}}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <ActivityIndicator
                size="small"
                color="#0e8491"
                style={{marginRight: 5}}
              />
              <Text
                style={{
                  fontFamily:
                    Platform.OS === 'android'
                      ? 'UberMoveTextRegular'
                      : 'Uber Move Text',
                  fontSize: RFValue(17),
                }}>
                Waiting for Internet connection
              </Text>
            </View>
          </View>
        </View>
      );
    } else if (/service_unavailable/i.test(error_status)) {
      //Show delivery input modal
      return (
        <View
          style={{
            backgroundColor: '#fff',
            padding: 20,
            height: 260,
          }}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <IconCommunity
              name="network-strength-1-alert"
              size={20}
              style={{marginRight: 5}}
            />
            <Text
              style={{
                fontFamily:
                  Platform.OS === 'android'
                    ? 'UberMoveTextMedium'
                    : 'Uber Move Text Medium',
                fontSize: RFValue(20),
              }}>
              Oups, something's wrong
            </Text>
          </View>
          <View>
            <Text
              style={{
                fontFamily:
                  Platform.OS === 'android'
                    ? 'UberMoveTextLight'
                    : 'Uber Move Text',
                fontSize: RFValue(17),
                marginTop: 10,
                lineHeight: 23,
              }}>
              Sorry, we are unable to establish the connection to TaxiConnect,
              please try again later.
            </Text>
          </View>
          <View style={{flex: 1, justifyContent: 'center'}}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <ActivityIndicator
                size="small"
                color="#0e8491"
                style={{marginRight: 5}}
              />
              <Text
                style={{
                  fontFamily:
                    Platform.OS === 'android'
                      ? 'UberMoveTextRegular'
                      : 'Uber Move Text',
                  fontSize: RFValue(17),
                }}>
                Establishing connection.
              </Text>
            </View>
          </View>
        </View>
      );
    } else if (/show_select_ride_type_modal$/i.test(error_status)) {
      return (
        <View
          style={{
            backgroundColor: '#fff',
            height: 330,
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 20,
              paddingBottom: 5,
            }}>
            <Text
              style={{
                fontFamily:
                  Platform.OS === 'android'
                    ? 'UberMoveTextMedium'
                    : 'Uber Move Text Medium',
                fontSize: RFValue(20),
              }}>
              What do you want to see?
            </Text>
          </View>
          <View style={{flex: 1, justifyContent: 'center'}}>
            <TouchableOpacity
              onPress={() => this.updateYourRidesSHownOnesTab('Past')}
              style={[
                styles.bttnGenericTc,
                {
                  borderRadius: 2,
                  marginBottom: 15,
                  paddingBottom: 20,
                  justifyContent: 'flex-start',
                  borderBottomColor: '#d0d0d0',
                  borderBottomWidth: 1,
                  paddingLeft: 20,
                  paddingRight: 20,
                  backgroundColor: '#fff',
                  shadowColor: '#fff',
                  shadowOffset: {
                    width: 0,
                    height: 0,
                  },
                  shadowOpacity: 0,
                  shadowRadius: 0,
                  elevation: 0,
                },
              ]}>
              <Text
                style={{
                  fontFamily:
                    Platform.OS === 'android'
                      ? 'UberMoveTextRegular'
                      : 'Uber Move Text',
                  fontSize: RFValue(19),
                  color: '#000',
                  flex: 1,
                }}>
                Past requests
              </Text>
              {/past/i.test(this.props.App.shownRides_types_tab) ? (
                <IconFeather name="check" color="#0e8491" size={23} />
              ) : null}
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.updateYourRidesSHownOnesTab('Scheduled')}
              style={[
                styles.bttnGenericTc,
                {
                  borderRadius: 2,
                  marginBottom: 15,
                  paddingBottom: 20,
                  justifyContent: 'flex-start',
                  borderBottomColor: '#d0d0d0',
                  borderBottomWidth: 1,
                  paddingLeft: 20,
                  paddingRight: 20,
                  backgroundColor: '#fff',
                  shadowColor: '#fff',
                  shadowOffset: {
                    width: 0,
                    height: 0,
                  },
                  shadowOpacity: 0,
                  shadowRadius: 0,

                  elevation: 0,
                },
              ]}>
              <Text
                style={{
                  fontFamily:
                    Platform.OS === 'android'
                      ? 'UberMoveTextRegular'
                      : 'Uber Move Text',
                  fontSize: RFValue(19),
                  color: '#000',
                  flex: 1,
                }}>
                Scheduled requests
              </Text>
              {/scheduled/i.test(this.props.App.shownRides_types_tab) ? (
                <IconFeather name="check" color="#0e8491" size={23} />
              ) : null}
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.bttnGenericTc,
                {
                  borderRadius: 2,
                  marginBottom: 10,
                  justifyContent: 'flex-start',
                  borderBottomColor: '#d0d0d0',
                  paddingLeft: 20,
                  paddingRight: 20,
                  backgroundColor: '#fff',
                  shadowColor: '#fff',
                  shadowOffset: {
                    width: 0,
                    height: 0,
                  },
                  shadowOpacity: 0,
                  shadowRadius: 0,

                  elevation: 0,
                },
              ]}>
              <Text
                style={{
                  fontFamily:
                    Platform.OS === 'android'
                      ? 'UberMoveTextRegular'
                      : 'Uber Move Text',
                  fontSize: RFValue(19),
                  color: '#E2E2E2',
                  flex: 1,
                }}>
                Business requests
              </Text>
              {/business/i.test(this.props.App.shownRides_types_tab) ? (
                <IconFeather name="check" color="#0e8491" size={23} />
              ) : null}
            </TouchableOpacity>
          </View>
        </View>
      );
    } else if (/error_checking_user_status_login/i.test(error_status)) {
      //Show delivery input modal
      return (
        <View
          style={{
            backgroundColor: '#fff',
            padding: 20,
            height: 270,
          }}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <IconMaterialIcons
              name="error-outline"
              size={20}
              style={{marginRight: 5}}
            />
            <Text
              style={{
                fontFamily:
                  Platform.OS === 'android'
                    ? 'UberMoveTextMedium'
                    : 'Uber Move Text Medium',
                fontSize: RFValue(20),
              }}>
              Something's wrong
            </Text>
          </View>
          <View>
            <Text
              style={{
                fontFamily:
                  Platform.OS === 'android'
                    ? 'UberMoveTextLight'
                    : 'Uber Move Text',
                fontSize: RFValue(17),
                marginTop: 10,
                lineHeight: 23,
              }}>
              Sorry due to an unexpected error we were unable to move forward
              with the authentication of your phone number, please try again.
            </Text>
          </View>
          <View style={{flex: 1, justifyContent: 'center'}}>
            <TouchableOpacity
              onPress={() => this.goBackFUnc(this.props.parentNode)}
              style={styles.bttnGenericTc}>
              <Text
                style={{
                  fontFamily:
                    Platform.OS === 'android'
                      ? 'UberMoveTextMedium'
                      : 'Uber Move Text Medium',
                  fontSize: RFValue(21),
                  color: '#fff',
                }}>
                Try again
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    } else if (/error_checking_otp/i.test(error_status)) {
      return (
        <View
          style={{
            backgroundColor: '#fff',
            padding: 20,
            height: 270,
          }}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <IconMaterialIcons
              name="error-outline"
              size={20}
              style={{marginRight: 5}}
            />
            <Text
              style={{
                fontFamily:
                  Platform.OS === 'android'
                    ? 'UberMoveTextMedium'
                    : 'Uber Move Text Medium',
                fontSize: RFValue(20),
              }}>
              Couldn't check the OTP
            </Text>
          </View>
          <View>
            <Text
              style={{
                fontFamily:
                  Platform.OS === 'android'
                    ? 'UberMoveTextLight'
                    : 'Uber Move Text',
                fontSize: RFValue(17),
                marginTop: 10,
                lineHeight: 23,
              }}>
              Sorry due to an unexpected error we were unable to move forward
              with the authentication of your OTP, please try again.
            </Text>
          </View>
          <View style={{flex: 1, justifyContent: 'center'}}>
            <TouchableOpacity
              onPress={() => this.goBackFUnc(this.props.parentNode)}
              style={styles.bttnGenericTc}>
              <Text
                style={{
                  fontFamily:
                    Platform.OS === 'android'
                      ? 'UberMoveTextMedium'
                      : 'Uber Move Text Medium',
                  fontSize: RFValue(21),
                  color: '#fff',
                }}>
                Try again
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    } else if (
      /show_select_ride_type_modal_ChooseFocusRideForWork$/i.test(error_status)
    ) {
      return (
        <View
          style={{
            backgroundColor: '#fff',
            minHeight:
              /ride/i.test(
                this.props.App.main_interfaceState_vars.dailyAmount_madeSoFar
                  .supported_requests_types,
              ) &&
              /delivery/i.test(
                this.props.App.main_interfaceState_vars.dailyAmount_madeSoFar
                  .supported_requests_types,
              )
                ? 360
                : 340,
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 20,
              paddingBottom: 5,
            }}>
            <Text
              style={{
                fontFamily:
                  Platform.OS === 'android'
                    ? 'UberMoveTextMedium'
                    : 'Uber Move Text Medium',
                fontSize: RFValue(19),
              }}>
              What do you want to see?
            </Text>
          </View>
          <View style={{flex: 1, justifyContent: 'center'}}>
            {/ride/i.test(
              this.props.App.main_interfaceState_vars.dailyAmount_madeSoFar
                .supported_requests_types,
            ) ? (
              <TouchableOpacity
                onPress={() =>
                  this.updateYourRidesSHownOnes('Rides', this.props.parentNode)
                }
                style={[
                  styles.bttnGenericTc,
                  {
                    borderRadius: 2,
                    marginBottom: 10,
                    justifyContent: 'flex-start',
                    borderBottomColor: '#E2E2E2',
                    borderBottomWidth: 1,
                    paddingLeft: 20,
                    paddingRight: 20,
                    backgroundColor: '#fff',
                    shadowColor: '#fff',
                    shadowOffset: {
                      width: 0,
                      height: 0,
                    },
                    shadowOpacity: 0,
                    shadowRadius: 0,

                    elevation: 0,
                  },
                ]}>
                <Text
                  style={{
                    fontFamily:
                      Platform.OS === 'android'
                        ? 'UberMoveTextRegular'
                        : 'Uber Move Text',
                    fontSize: RFValue(20),
                    color: '#000',
                    flex: 1,
                  }}>
                  Rides
                </Text>
                {/**Requests graph */}
                {this.props.App._Requests_graphInfos !== null &&
                this.props.App._Requests_graphInfos !== undefined &&
                this.props.App._Requests_graphInfos.rides !== undefined &&
                parseInt(this.props.App._Requests_graphInfos.rides) > 0 ? (
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
                      {parseInt(this.props.App._Requests_graphInfos.rides)}
                    </Text>
                  </View>
                ) : null}
                {/Rides/i.test(this.props.App.shownRides_types) ? (
                  <IconFeather name="check" color="#0e8491" size={22} />
                ) : null}
              </TouchableOpacity>
            ) : null}
            {/**For deliveries */}
            {/delivery/i.test(
              this.props.App.main_interfaceState_vars.dailyAmount_madeSoFar
                .supported_requests_types,
            ) ? (
              <TouchableOpacity
                onPress={() =>
                  this.updateYourRidesSHownOnes(
                    'Delivery',
                    this.props.parentNode,
                  )
                }
                style={[
                  styles.bttnGenericTc,
                  {
                    borderRadius: 2,
                    marginBottom: 10,
                    justifyContent: 'flex-start',
                    borderBottomColor: '#E2E2E2',
                    borderBottomWidth: 1,
                    paddingLeft: 20,
                    paddingRight: 20,
                    backgroundColor: '#fff',
                    shadowColor: '#fff',
                    shadowOffset: {
                      width: 0,
                      height: 0,
                    },
                    shadowOpacity: 0,
                    shadowRadius: 0,

                    elevation: 0,
                  },
                ]}>
                <Text
                  style={{
                    fontFamily:
                      Platform.OS === 'android'
                        ? 'UberMoveTextRegular'
                        : 'Uber Move Text',
                    fontSize: RFValue(20),
                    color: '#000',
                    flex: 1,
                  }}>
                  Deliveries
                </Text>
                {/**Requests graph */}
                {this.props.App._Requests_graphInfos !== null &&
                this.props.App._Requests_graphInfos !== undefined &&
                this.props.App._Requests_graphInfos.deliveries !== undefined &&
                parseInt(this.props.App._Requests_graphInfos.deliveries) > 0 ? (
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
                      {parseInt(this.props.App._Requests_graphInfos.deliveries)}
                    </Text>
                  </View>
                ) : null}
                {/Delivery/i.test(this.props.App.shownRides_types) ? (
                  <IconFeather name="check" color="#0e8491" size={22} />
                ) : null}
              </TouchableOpacity>
            ) : null}
            {/**For scheduled rides/deliveries */}
            {/(ride|delivery)/i.test(
              this.props.App.main_interfaceState_vars.dailyAmount_madeSoFar
                .supported_requests_types,
            ) ? (
              <TouchableOpacity
                onPress={() =>
                  this.updateYourRidesSHownOnes(
                    'Scheduled',
                    this.props.parentNode,
                  )
                }
                style={[
                  styles.bttnGenericTc,
                  {
                    borderRadius: 2,
                    marginBottom: 10,
                    justifyContent: 'flex-start',
                    borderBottomColor: '#E2E2E2',
                    borderBottomWidth: 1,
                    paddingLeft: 20,
                    paddingRight: 20,
                    backgroundColor: '#fff',
                    shadowColor: '#fff',
                    shadowOffset: {
                      width: 0,
                      height: 0,
                    },
                    shadowOpacity: 0,
                    shadowRadius: 0,

                    elevation: 0,
                  },
                ]}>
                <Text
                  style={{
                    fontFamily:
                      Platform.OS === 'android'
                        ? 'UberMoveTextRegular'
                        : 'Uber Move Text',
                    fontSize: RFValue(20),
                    color: '#000',
                    flex: 1,
                  }}>
                  Scheduled
                </Text>
                {/**Requests graph */}
                {this.props.App._Requests_graphInfos !== null &&
                this.props.App._Requests_graphInfos !== undefined &&
                this.props.App._Requests_graphInfos.scheduled !== undefined &&
                parseInt(this.props.App._Requests_graphInfos.scheduled) > 0 ? (
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
                      {parseInt(this.props.App._Requests_graphInfos.scheduled)}
                    </Text>
                  </View>
                ) : null}
                {/Scheduled/i.test(this.props.App.shownRides_types) ? (
                  <IconFeather name="check" color="#0e8491" size={22} />
                ) : null}
              </TouchableOpacity>
            ) : null}
            {/**LOG OUT BUTTON */}
            <TouchableOpacity
              onPress={() => this.props.App.goOnlineOrOffline('offline')}
              style={[
                styles.bttnGenericTc,
                {
                  borderRadius: 2,
                  marginBottom: 10,
                  justifyContent: 'flex-start',
                  borderBottomColor: '#d0d0d0',
                  paddingLeft: 20,
                  paddingRight: 20,
                  backgroundColor: '#fff',
                  shadowColor: '#fff',
                  shadowOffset: {
                    width: 0,
                    height: 0,
                  },
                  shadowOpacity: 0,
                  shadowRadius: 0,

                  elevation: 0,
                },
              ]}>
              <Text
                style={{
                  fontFamily:
                    Platform.OS === 'android'
                      ? 'UberMoveTextMedium'
                      : 'Uber Move Text Medium',
                  fontSize: RFValue(20),
                  color: '#b22222',
                  flex: 1,
                }}>
                Go offline
              </Text>
              {/Go offline/i.test(this.props.App.shownRides_types) ? (
                <IconFeather name="check" color="#0e8491" size={20} />
              ) : null}
            </TouchableOpacity>
          </View>
        </View>
      );
    } else if (/show_guardian_toolkit/i.test(error_status)) {
      return (
        <View
          style={{
            backgroundColor: '#fff',
            height: Platform.OS === 'android' ? 250 : 260,
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 20,
              paddingBottom: 5,
            }}>
            <Text
              style={{
                fontFamily:
                  Platform.OS === 'android'
                    ? 'UberMoveTextMedium'
                    : 'Uber Move Text Medium',
                fontSize: RFValue(20),
              }}>
              Safety
            </Text>
          </View>
          <View style={{flex: 1, justifyContent: 'center'}}>
            <TouchableOpacity
              onPress={() =>
                call({
                  number: '061302302',
                  prompt: true,
                })
              }
              style={[
                styles.bttnGenericTc,
                {
                  borderRadius: 2,
                  marginBottom: 20,
                  justifyContent: 'flex-start',
                  paddingLeft: 20,
                  paddingRight: 20,
                  height: 100,
                  backgroundColor: '#fff',
                  shadowColor: '#fff',
                  shadowOffset: {
                    width: 0,
                    height: 0,
                  },
                  shadowOpacity: 0,
                  shadowRadius: 0,

                  elevation: 0,
                  flexDirection: 'row',
                },
              ]}>
              <View style={{height: '100%'}}>
                <IconMaterialIcons name="shield" color="#b22222" size={28} />
              </View>
              <View style={{flex: 1, marginLeft: 5}}>
                <Text
                  style={{
                    fontFamily:
                      Platform.OS === 'android'
                        ? 'UberMoveTextRegular'
                        : 'Uber Move Text',
                    fontSize: RFValue(20),
                    flex: 1,
                    color: '#b22222',
                  }}>
                  Emergency call
                </Text>
                <Text
                  style={{
                    fontFamily:
                      Platform.OS === 'android'
                        ? 'UberMoveTextLight'
                        : 'Uber Move Text Light',
                    fontSize: RFValue(14),
                    lineHeight: 19,
                    flex: 1,
                    bottom: 5,
                  }}>
                  Call immediatly the authorities if you feel a threaten.
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      );
    } else if (/show_modalMore_tripDetails/i.test(error_status)) {
      let globalObject = this;
      //Auto close when no focused data found
      if (
        this.props.App.requests_data_main_vars.moreDetailsFocused_request ===
          false ||
        this.props.App.requests_data_main_vars.fetchedRequests_data_store ===
          false ||
        this.props.App.requests_data_main_vars.moreDetailsFocused_request ===
          undefined
      ) {
        //Invalid setup - close modal
        this.props.UpdateErrorModalLog(false, false, 'any'); //Close modal - enable after
        return (
          <View
            style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <GenericLoader
              active={true}
              backgroundColor={'transparent'}
              color={'#fff'}
              thickness={4}
            />
          </View>
        );
      }
      let wished_pickup_time = this.props.App.requests_data_main_vars
        .moreDetailsFocused_request.ride_basic_infos.wished_pickup_time;
      return (
        <SafeAreaView
          style={{
            backgroundColor: '#fff',
            flex: 1,
          }}>
          <View style={styles.presentationWindow}>
            <View
              style={
                Platform.OS === 'android'
                  ? {
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
                        height: 1,
                      },
                      shadowOpacity: 0.22,
                      shadowRadius: 2.22,

                      elevation: 3,
                    }
                  : {
                      flexDirection: 'row',
                      alignItems: 'center',
                      padding: 20,
                      paddingTop: 15,
                      paddingBottom: 15,
                      borderBottomWidth: 0.7,
                      borderBottomColor: '#d0d0d0',
                      backgroundColor: '#fff',
                    }
              }>
              <TouchableOpacity
                onPress={() =>
                  this.props.UpdateErrorModalLog(false, false, 'any')
                }
                style={{flexDirection: 'row'}}>
                <View>
                  <IconAnt name="arrowleft" size={23} />
                </View>
                <Text
                  style={[
                    {
                      fontSize: RFValue(18),
                      fontFamily:
                        Platform.OS === 'android'
                          ? 'UberMoveTextMedium'
                          : 'Uber Move Text Medium',
                      marginLeft: 5,
                    },
                  ]}>
                  {/delivery/i.test(
                    this.props.App.requests_data_main_vars
                      .moreDetailsFocused_request.ride_basic_infos.ride_mode,
                  )
                    ? 'Delivery details'
                    : 'Trip details'}
                </Text>
              </TouchableOpacity>
              {/**Cancel */}
              <TouchableOpacity
                onPress={() =>
                  this.props.SwitchToNavigation_modeOrBack({
                    isApp_inNavigation_mode: false,
                  })
                }
                style={{flexDirection: 'row', position: 'absolute', right: 20}}>
                <View>
                  <IconCommunity
                    name="format-list-bulleted-square"
                    color="#b22222"
                    size={34}
                  />
                </View>
              </TouchableOpacity>
            </View>
            {/scheduled/i.test(
              this.props.App.requests_data_main_vars.moreDetailsFocused_request
                .ride_basic_infos.request_type,
            ) ? (
              <View
                style={{
                  borderWidth: 1,
                  padding: 10,
                  backgroundColor: '#01101F',
                  borderColor: '#01101F',
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <IconIonic
                  name="timer-outline"
                  size={20}
                  style={{color: '#fff', marginRight: 5}}
                />
                <Text
                  style={{
                    color: '#fff',
                    fontFamily:
                      Platform.OS === 'android'
                        ? 'MoveTextMedium'
                        : 'Uber Move Text Medium',
                    fontSize: RFValue(17),
                  }}>
                  {`${new Date(
                    new Date(wished_pickup_time).getTime() - 2 * 3600 * 1000,
                  ).getDay()}-${
                    String(
                      new Date(
                        new Date(wished_pickup_time).getTime() -
                          2 * 3600 * 1000,
                      ).getMinutes(),
                    ).length > 1
                      ? new Date(
                          new Date(wished_pickup_time).getTime() -
                            2 * 3600 * 1000,
                        ).getMonth() + 1
                      : '0' +
                        String(
                          new Date(
                            new Date(wished_pickup_time).getTime() -
                              2 * 3600 * 1000,
                          ).getMonth() + 1,
                        )
                  }-${new Date(
                    new Date(wished_pickup_time).getTime() - 2 * 3600 * 1000,
                  ).getFullYear()} at ${new Date(
                    new Date(wished_pickup_time).getTime() - 2 * 3600 * 1000,
                  ).getHours()}:${
                    String(
                      new Date(
                        new Date(wished_pickup_time).getTime() -
                          2 * 3600 * 1000,
                      ).getMinutes(),
                    ).length > 1
                      ? new Date(
                          new Date(wished_pickup_time).getTime() -
                            2 * 3600 * 1000,
                        ).getMinutes()
                      : '0' +
                        String(
                          new Date(
                            new Date(wished_pickup_time).getTime() -
                              2 * 3600 * 1000,
                          ).getMinutes(),
                        )
                  }`}
                </Text>
              </View>
            ) : null}
            <ScrollView style={{flex: 1}}>
              {/**Passengers details */}
              <View
                style={{
                  flexDirection: 'row',
                  padding: 20,
                  paddingTop: 18,
                  paddingBottom: 15,
                  alignItems: 'center',
                  backgroundColor: '#F6F6F6',
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    flex: 1,
                  }}>
                  <View
                    style={{
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderWidth: 1,
                      borderColor: '#d0d0d0',
                      backgroundColor: '#fff',
                      width: 65,
                      height: 65,
                      borderRadius: 150,
                      shadowColor: '#000',
                      shadowOffset: {
                        width: 0,
                        height: 2,
                      },
                      shadowOpacity: 0.25,
                      shadowRadius: 3.84,

                      elevation: 5,
                    }}>
                    <IconAnt name="user" size={25} />
                  </View>
                  <View
                    style={{
                      marginLeft: 7,
                      flex: 1,
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
                      {this.props.App.requests_data_main_vars
                        .moreDetailsFocused_request.passenger_infos.name !==
                      undefined
                        ? this.props.App.requests_data_main_vars
                            .moreDetailsFocused_request.passenger_infos.name
                        : 'Passenger'}
                    </Text>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginTop: 1,
                      }}>
                      <Text
                        style={{
                          fontFamily:
                            Platform.OS === 'android'
                              ? 'UberMoveTextMedium'
                              : 'Uber Move Text Medium',
                          fontSize: RFValue(17),
                          color: '#096ED4',
                        }}>
                        {parseInt(
                          this.props.App.requests_data_main_vars.moreDetailsFocused_request.eta_to_passenger_infos.eta.split(
                            ' ',
                          )[0],
                        ) <= 35 &&
                        parseInt(
                          this.props.App.requests_data_main_vars.moreDetailsFocused_request.eta_to_passenger_infos.eta.split(
                            ' ',
                          )[0],
                        ) > 10 &&
                        /sec/i.test(
                          this.props.App.requests_data_main_vars.moreDetailsFocused_request.eta_to_passenger_infos.eta.split(
                            ' ',
                          )[1],
                        )
                          ? 'Very close'
                          : parseInt(
                              this.props.App.requests_data_main_vars.moreDetailsFocused_request.eta_to_passenger_infos.eta.split(
                                ' ',
                              )[0],
                            ) <= 10 &&
                            /sec/i.test(
                              this.props.App.requests_data_main_vars.moreDetailsFocused_request.eta_to_passenger_infos.eta.split(
                                ' ',
                              )[1],
                            )
                          ? 'Arrived'
                          : this.props.App.requests_data_main_vars
                              .moreDetailsFocused_request.eta_to_passenger_infos
                              .eta}
                      </Text>
                    </View>
                  </View>
                </View>
                <TouchableOpacity
                  onPress={() =>
                    call({
                      number: this.props.App.requests_data_main_vars
                        .moreDetailsFocused_request.passenger_infos
                        .phone_number,
                      prompt: true,
                    })
                  }
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: 5,
                    flexDirection: 'row',
                    padding: 15,
                  }}>
                  <IconMaterialIcons name="phone" color="#096ED4" size={30} />
                </TouchableOpacity>
              </View>
              {/**Confirmation buttons: pickup/drop off */}
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  padding: 20,
                }}>
                <TouchableOpacity
                  onPress={() => {
                    switch (this.props.App.default_navigation_system) {
                      case 'taxiconnect_navigation':
                        this.launchTaxiConnectNavigator();
                        break;
                      case 'google_maps':
                        this.lauch3rdPartyNavigator();
                        break;
                      case 'apple_maps':
                        this.lauch3rdPartyNavigator();
                        break;
                      case 'waze':
                        this.lauch3rdPartyNavigator();
                        break;
                      default:
                        this.launchTaxiConnectNavigator();
                        break;
                    }
                  }}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 15,
                    height: 55,
                    backgroundColor: this.props.App.requests_data_main_vars
                      .moreDetailsFocused_request.ride_basic_infos
                      .inRideToDestination
                      ? '#000'
                      : '#096ED4',
                    borderRadius: 7,
                    borderTopRightRadius: 0,
                    borderBottomRightRadius: 0,
                    shadowColor: '#000',
                    shadowOffset: {
                      width: 0,
                      height: 2,
                    },
                    shadowOpacity: 0.23,
                    shadowRadius: 2.62,

                    elevation: 4,
                    flex: 1,
                  }}>
                  <IconCommunity name="navigation" color="#fff" size={20} />
                  <Text
                    adjustsFontSizeToFit={true}
                    style={{
                      fontFamily:
                        Platform.OS === 'android'
                          ? 'UberMoveTextRegular'
                          : 'Uber Move Text',
                      fontSize: RFValue(16),
                      color: '#fff',
                    }}>
                    {this.props.App.requests_data_main_vars
                      .moreDetailsFocused_request.ride_basic_infos.isAccepted &&
                    this.props.App.requests_data_main_vars
                      .moreDetailsFocused_request.ride_basic_infos
                      .inRideToDestination
                      ? 'Destination'
                      : 'Find client'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() =>
                    this.props.App.requests_data_main_vars
                      .moreDetailsFocused_request.ride_basic_infos.isAccepted &&
                    this.props.App.requests_data_main_vars
                      .moreDetailsFocused_request.ride_basic_infos
                      .inRideToDestination
                      ? this.props.UpdateErrorModalLog(
                          true,
                          'trip_dropoffConfirmation_confirmation',
                          'any',
                        )
                      : this.props.UpdateErrorModalLog(
                          true,
                          'trip_pickupConfirmation_confirmation',
                          'any',
                        )
                  }
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 15,
                    height: 55,
                    backgroundColor:
                      this.props.App.requests_data_main_vars
                        .moreDetailsFocused_request.ride_basic_infos
                        .isAccepted &&
                      this.props.App.requests_data_main_vars
                        .moreDetailsFocused_request.ride_basic_infos
                        .inRideToDestination
                        ? '#096ED4'
                        : '#000',
                    borderRadius: 7,
                    borderTopLeftRadius: 0,
                    borderBottomLeftRadius: 0,
                    marginLeft: 10,
                    shadowColor: '#000',
                    shadowOffset: {
                      width: 0,
                      height: 4,
                    },
                    shadowOpacity: 0.32,
                    shadowRadius: 5.46,

                    elevation: 9,
                  }}>
                  <Text
                    adjustsFontSizeToFit={true}
                    style={{
                      fontFamily:
                        Platform.OS === 'android'
                          ? 'UberMoveTextMedium'
                          : 'Uber Move Text Medium',
                      fontSize: RFValue(17),
                      color: '#fff',
                    }}>
                    {this.props.App.requests_data_main_vars
                      .moreDetailsFocused_request.ride_basic_infos.isAccepted &&
                    this.props.App.requests_data_main_vars
                      .moreDetailsFocused_request.ride_basic_infos
                      .inRideToDestination
                      ? 'CONFIRM DROPOFF'
                      : 'CONFIRM PICKUP'}
                  </Text>
                </TouchableOpacity>
              </View>
              {/**Trip/Delivery details */}
              <View style={{}}>
                <Text
                  style={{
                    fontSize: RFValue(17),
                    fontFamily:
                      Platform.OS === 'android'
                        ? 'UberMoveTextMedium'
                        : 'Uber Move Text Medium',
                    color: '#757575',
                    padding: 20,
                    paddingBottom: 0,
                  }}>
                  {/delivery/i.test(
                    this.props.App.requests_data_main_vars
                      .moreDetailsFocused_request.ride_basic_infos.ride_mode,
                  )
                    ? 'Delivery'
                    : 'Trip'}
                </Text>
                <View
                  style={{
                    padding: 20,
                  }}>
                  <View>
                    <View
                      style={{
                        flexDirection: 'row',
                      }}>
                      <View style={{width: 16, height: '87%', top: 6}}>
                        <View style={{position: 'absolute', top: 0}}>
                          <View
                            style={{
                              height: 11,
                              width: 11,
                              borderRadius: 100,
                              backgroundColor: '#000',
                            }}
                          />
                        </View>

                        <View
                          style={{
                            flex: 1,
                            left: 5,
                            width: 1.5,
                            height: 50,
                            backgroundColor: '#000',
                          }}></View>
                        <View style={{position: 'absolute', bottom: 0}}>
                          <View
                            style={{
                              height: 11,
                              width: 11,
                              borderRadius: 0,
                              backgroundColor: '#096ED4',
                            }}
                          />
                        </View>
                      </View>
                      <View style={{flex: 1}}>
                        <View
                          style={{
                            flexDirection: 'row',
                          }}>
                          <View style={{width: 45}}>
                            <Text
                              style={{
                                fontFamily:
                                  Platform.OS === 'android'
                                    ? 'UberMoveTextLight'
                                    : 'Uber Move Text Light',
                                fontSize: RFValue(14),
                                top: 2,
                              }}>
                              From
                            </Text>
                          </View>
                          <View
                            style={{
                              flex: 1,
                              alignItems: 'flex-start',
                            }}>
                            <View
                              style={{
                                flex: 1,
                                alignItems: 'flex-start',
                              }}>
                              <Text
                                style={{
                                  fontFamily:
                                    Platform.OS === 'android'
                                      ? 'UberMoveTextMedium'
                                      : 'Uber Move Text Medium',
                                  fontSize: RFValue(17),
                                  marginLeft: 5,
                                  flex: 1,
                                }}>
                                {this.props.App.requests_data_main_vars
                                  .moreDetailsFocused_request
                                  .origin_destination_infos.pickup_infos
                                  .suburb !== false &&
                                this.props.App.requests_data_main_vars
                                  .moreDetailsFocused_request
                                  .origin_destination_infos.pickup_infos
                                  .suburb !== 'false' &&
                                this.props.App.requests_data_main_vars
                                  .moreDetailsFocused_request
                                  .origin_destination_infos.pickup_infos
                                  .suburb !== undefined &&
                                this.props.App.requests_data_main_vars
                                  .moreDetailsFocused_request
                                  .origin_destination_infos.pickup_infos
                                  .suburb !== null
                                  ? this.props.App.requests_data_main_vars
                                      .moreDetailsFocused_request
                                      .origin_destination_infos.pickup_infos
                                      .suburb
                                  : this.props.App.requests_data_main_vars
                                      .moreDetailsFocused_request
                                      .origin_destination_infos.pickup_infos
                                      .location_name !== false &&
                                    this.props.App.requests_data_main_vars
                                      .moreDetailsFocused_request
                                      .origin_destination_infos.pickup_infos
                                      .location_name !== 'false' &&
                                    this.props.App.requests_data_main_vars
                                      .moreDetailsFocused_request
                                      .origin_destination_infos.pickup_infos
                                      .location_name !== undefined &&
                                    this.props.App.requests_data_main_vars
                                      .moreDetailsFocused_request
                                      .origin_destination_infos.pickup_infos
                                      .location_name !== null
                                  ? this.props.App.requests_data_main_vars
                                      .moreDetailsFocused_request
                                      .origin_destination_infos.pickup_infos
                                      .location_name
                                  : this.props.App.requests_data_main_vars
                                      .moreDetailsFocused_request
                                      .origin_destination_infos.pickup_infos
                                      .street_name}
                              </Text>
                              <Text
                                style={{
                                  fontFamily:
                                    Platform.OS === 'android'
                                      ? 'UberMoveTextRegular'
                                      : 'Uber Move Text',
                                  fontSize: RFValue(15),
                                  marginLeft: 5,
                                  marginTop: 3,
                                  flex: 1,
                                }}>
                                {this.props.App.requests_data_main_vars
                                  .moreDetailsFocused_request
                                  .origin_destination_infos.pickup_infos
                                  .location_name !== false &&
                                this.props.App.requests_data_main_vars
                                  .moreDetailsFocused_request
                                  .origin_destination_infos.pickup_infos
                                  .location_name !== 'false' &&
                                this.props.App.requests_data_main_vars
                                  .moreDetailsFocused_request
                                  .origin_destination_infos.pickup_infos
                                  .location_name !== null &&
                                this.props.App.requests_data_main_vars
                                  .moreDetailsFocused_request
                                  .origin_destination_infos.pickup_infos
                                  .location_name !== undefined
                                  ? this.props.App.requests_data_main_vars
                                      .moreDetailsFocused_request
                                      .origin_destination_infos.pickup_infos
                                      .location_name
                                  : null}
                                {this.props.App.requests_data_main_vars
                                  .moreDetailsFocused_request
                                  .origin_destination_infos.pickup_infos
                                  .street_name !== false &&
                                this.props.App.requests_data_main_vars
                                  .moreDetailsFocused_request
                                  .origin_destination_infos.pickup_infos
                                  .street_name !== 'false' &&
                                this.props.App.requests_data_main_vars
                                  .moreDetailsFocused_request
                                  .origin_destination_infos.pickup_infos
                                  .street_name !== undefined &&
                                this.props.App.requests_data_main_vars
                                  .moreDetailsFocused_request
                                  .origin_destination_infos.pickup_infos
                                  .street_name !== null
                                  ? `, ${this.props.App.requests_data_main_vars.moreDetailsFocused_request.origin_destination_infos.pickup_infos.street_name}`
                                  : null}
                              </Text>
                            </View>
                          </View>
                        </View>
                        {/**Destination */}
                        <View
                          style={{
                            flexDirection: 'row',
                            marginTop: 25,
                          }}>
                          <View style={{width: 45}}>
                            <Text
                              style={{
                                fontFamily:
                                  Platform.OS === 'android'
                                    ? 'UberMoveTextLight'
                                    : 'Uber Move Text Light',
                                fontSize: RFValue(14),
                                top: 2,
                              }}>
                              To
                            </Text>
                          </View>
                          <View
                            style={{
                              flex: 1,
                              alignItems: 'flex-start',
                            }}>
                            {this.props.App.requests_data_main_vars.moreDetailsFocused_request.origin_destination_infos.destination_infos.map(
                              (destination, index) => {
                                return (
                                  <View
                                    key={String(index + 1)}
                                    style={{
                                      flex: 1,
                                      alignItems: 'flex-start',
                                      marginTop: index > 0 ? 15 : 0,
                                    }}>
                                    <Text
                                      style={{
                                        fontFamily:
                                          Platform.OS === 'android'
                                            ? 'UberMoveTextMedium'
                                            : 'Uber Move Text Medium',
                                        fontSize: RFValue(18),
                                        marginLeft: 5,
                                        flex: 1,
                                      }}>
                                      {this.props.App.requests_data_main_vars
                                        .moreDetailsFocused_request
                                        .origin_destination_infos
                                        .destination_infos.length > 1 ? (
                                        <Text
                                          style={{
                                            fontFamily:
                                              Platform.OS === 'android'
                                                ? 'UberMoveTextMedium'
                                                : 'Uber Move Text Medium',
                                            fontSize: RFValue(17),
                                            marginLeft: 5,
                                            flex: 1,
                                            color: '#096ED4',
                                          }}>
                                          {index + 1 + '. '}
                                        </Text>
                                      ) : null}
                                      {destination.suburb !== false &&
                                      destination.suburb !== 'false' &&
                                      destination.suburb !== undefined &&
                                      destination.suburb !== null
                                        ? destination.suburb
                                        : destination.location_name !== false &&
                                          destination.location_name !==
                                            'false' &&
                                          destination.location_name !==
                                            undefined &&
                                          destination.location_name !== null
                                        ? destination.location_name
                                        : destination.street_name}
                                    </Text>
                                    {destination.location_name !== 'false' &&
                                    destination.location_name !== false ? (
                                      <Text
                                        style={{
                                          fontFamily:
                                            Platform.OS === 'android'
                                              ? 'UberMoveTextRegular'
                                              : 'Uber Move Text',
                                          fontSize: RFValue(15),
                                          marginLeft: 5,
                                          marginTop: 3,
                                          flex: 1,
                                        }}>
                                        {destination.location_name}
                                      </Text>
                                    ) : null}
                                    {destination.street_name !== 'false' &&
                                    destination.street_name !== false ? (
                                      <Text
                                        style={{
                                          fontFamily:
                                            Platform.OS === 'android'
                                              ? 'UberMoveTextRegular'
                                              : 'Uber Move Text',
                                          fontSize: RFValue(15),
                                          marginLeft: 5,
                                          marginTop: 3,
                                          flex: 1,
                                        }}>
                                        {', ' + destination.street_name}
                                      </Text>
                                    ) : null}
                                  </View>
                                );
                              },
                            )}
                          </View>
                        </View>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
              {/**Receiver's infos */}
              {/Delivery/i.test(
                this.props.App.requests_data_main_vars
                  .moreDetailsFocused_request.ride_basic_infos.ride_mode,
              ) ? (
                <View style={{marginBottom: 15}}>
                  <Text
                    style={{
                      fontSize: RFValue(17),
                      fontFamily:
                        Platform.OS === 'android'
                          ? 'UberMoveTextMedium'
                          : 'Uber Move Text Medium',
                      color: '#757575',
                      padding: 20,
                      paddingBottom: 10,
                    }}>
                    Receiver's information
                  </Text>
                  <View
                    style={{
                      padding: 20,
                      backgroundColor: '#F6F6F6',
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <View
                      style={{
                        flex: 1,
                      }}>
                      {this.props.App.requests_data_main_vars
                        .moreDetailsFocused_request.ride_basic_infos
                        .receiver_infos.receiverName_delivery !== undefined &&
                      this.props.App.requests_data_main_vars
                        .moreDetailsFocused_request.ride_basic_infos
                        .receiver_infos.receiverName_delivery !== null &&
                      this.props.App.requests_data_main_vars
                        .moreDetailsFocused_request.ride_basic_infos
                        .receiver_infos.receiverName_delivery !== false &&
                      this.props.App.requests_data_main_vars
                        .moreDetailsFocused_request.ride_basic_infos
                        .receiver_infos.receiverName_delivery !== 'false' ? (
                        <>
                          <Text
                            style={{
                              fontFamily:
                                Platform.OS === 'android'
                                  ? 'UberMoveTextRegular'
                                  : 'Uber Move Text',
                              fontSize: RFValue(17),
                              flex: 1,
                            }}>
                            {
                              this.props.App.requests_data_main_vars
                                .moreDetailsFocused_request.ride_basic_infos
                                .receiver_infos.receiverName_delivery
                            }
                          </Text>
                          <TouchableOpacity
                            onPress={() =>
                              call({
                                number: this.props.App.requests_data_main_vars
                                  .moreDetailsFocused_request.ride_basic_infos
                                  .receiver_infos.receiverPhone_delivery,
                                prompt: true,
                              })
                            }
                            style={{
                              alignItems: 'center',
                              justifyContent: 'center',
                              marginRight: 5,
                              flexDirection: 'row',
                            }}>
                            <IconMaterialIcons
                              name="phone"
                              color="#096ED4"
                              size={30}
                            />
                          </TouchableOpacity>
                        </>
                      ) : this.props.App.requests_data_main_vars
                          .moreDetailsFocused_request.origin_destination_infos
                          .destination_infos[0].receiver_infos.receiver_name !==
                        'false' ? (
                        this.props.App.requests_data_main_vars.moreDetailsFocused_request.origin_destination_infos.destination_infos.map(
                          (el, index) => {
                            let classicLength = this.props.App
                              .requests_data_main_vars
                              .moreDetailsFocused_request
                              .origin_destination_infos.destination_infos
                              .length;

                            return (
                              <View
                                style={{
                                  flex: 1,
                                  flexDirection: 'row',
                                  alignItems: 'center',
                                  marginBottom:
                                    index + 1 != classicLength ? 20 : 0,
                                  borderBottomWidth: 1,
                                  paddingBottom:
                                    index + 1 != classicLength ? 15 : 0,
                                  borderBottomColor:
                                    index + 1 !== classicLength
                                      ? '#d0d0d0'
                                      : '#F6F6F6',
                                }}>
                                {classicLength > 1 ? (
                                  <Text
                                    style={{
                                      fontFamily:
                                        Platform.OS === 'android'
                                          ? 'UberMoveTextRegular'
                                          : 'Uber Move Text',
                                      fontSize: RFValue(17),
                                      color: '#096ED4',
                                    }}>
                                    {index + 1}.{' '}
                                  </Text>
                                ) : null}
                                <Text
                                  style={{
                                    fontFamily:
                                      Platform.OS === 'android'
                                        ? 'UberMoveTextRegular'
                                        : 'Uber Move Text',
                                    fontSize: RFValue(17),
                                    flex: 1,
                                  }}>
                                  {el.receiver_infos.receiver_name}
                                </Text>
                                <TouchableOpacity
                                  onPress={() =>
                                    call({
                                      number: el.receiver_infos.receiver_phone,
                                      prompt: true,
                                    })
                                  }
                                  style={{
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginRight: 5,
                                    flexDirection: 'row',
                                  }}>
                                  <IconMaterialIcons
                                    name="phone"
                                    color="#096ED4"
                                    size={30}
                                  />
                                </TouchableOpacity>
                              </View>
                            );
                          },
                        )
                      ) : (
                        <Text
                          style={{
                            fontFamily:
                              Platform.OS === 'android'
                                ? 'UberMoveTextRegular'
                                : 'Uber Move Text',
                            fontSize: RFValue(17),
                            flex: 1,
                          }}>
                          No information provided
                        </Text>
                      )}
                    </View>
                    {/* {this.props.App.requests_data_main_vars
                      .moreDetailsFocused_request.ride_basic_infos
                      .receiver_infos.receiverName_delivery !== undefined &&
                    this.props.App.requests_data_main_vars
                      .moreDetailsFocused_request.ride_basic_infos
                      .receiver_infos.receiverName_delivery !== null &&
                    this.props.App.requests_data_main_vars
                      .moreDetailsFocused_request.ride_basic_infos
                      .receiver_infos.receiverName_delivery !== false &&
                    this.props.App.requests_data_main_vars
                      .moreDetailsFocused_request.ride_basic_infos
                      .receiver_infos.receiverName_delivery !== 'false' ? (
                      <TouchableOpacity
                        onPress={() =>
                          call({
                            number: this.props.App.requests_data_main_vars
                              .moreDetailsFocused_request.ride_basic_infos
                              .receiver_infos.receiverPhone_delivery,
                            prompt: true,
                          })
                        }
                        style={{
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginRight: 5,
                          flexDirection: 'row',
                        }}>
                        <IconMaterialIcons
                          name="phone"
                          color="#096ED4"
                          size={30}
                        />
                      </TouchableOpacity>
                    ) : null} */}
                  </View>
                </View>
              ) : null}
              {/**Add package type for deliveries only */}
              {/delivery/i.test(
                this.props.App.requests_data_main_vars
                  .moreDetailsFocused_request.ride_basic_infos.ride_mode,
              ) ? (
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    padding: 20,
                    paddingBottom: 30,
                  }}>
                  <View style={{flexDirection: 'row'}}>
                    <IconFeather name="package" color={'#000'} size={24} />
                    <View style={{marginLeft: 5}}>
                      <Text
                        style={{
                          fontFamily:
                            Platform.OS === 'android'
                              ? 'UberMoveTextMedium'
                              : 'Uber Move Text Medium',
                          fontSize: RFValue(17),
                        }}>
                        {/envelope/i.test(
                          this.props.App.requests_data_main_vars
                            .moreDetailsFocused_request.ride_basic_infos
                            .receiver_infos.packageSize,
                        )
                          ? 'Small'
                          : /small/i.test(
                              this.props.App.requests_data_main_vars
                                .moreDetailsFocused_request.ride_basic_infos
                                .receiver_infos.packageSize,
                            )
                          ? 'Medium'
                          : 'Large'}
                      </Text>
                      <Text
                        style={{
                          fontFamily:
                            Platform.OS === 'android'
                              ? 'UberMoveTextLight'
                              : 'Uber Move Text Light',
                          fontSize: RFValue(14),
                        }}>
                        Package type
                      </Text>
                    </View>
                  </View>
                </View>
              ) : null}
              {/**Pickup note if any */}
              {this.props.App.requests_data_main_vars.moreDetailsFocused_request
                .ride_basic_infos.pickup_note !== null &&
              this.props.App.requests_data_main_vars.moreDetailsFocused_request
                .ride_basic_infos.pickup_note !== undefined &&
              this.props.App.requests_data_main_vars.moreDetailsFocused_request
                .ride_basic_infos.pickup_note !== false ? (
                <View style={{marginBottom: 15}}>
                  <Text
                    style={{
                      fontSize: RFValue(17),
                      fontFamily:
                        Platform.OS === 'android'
                          ? 'UberMoveTextMedium'
                          : 'Uber Move Text Medium',
                      color: '#757575',
                      padding: 20,
                      paddingBottom: 0,
                    }}>
                    Note
                  </Text>
                  <View
                    style={{
                      padding: 20,
                      backgroundColor: '#F6F6F6',
                    }}>
                    <Text
                      style={{
                        fontFamily:
                          Platform.OS === 'android'
                            ? 'UberMoveTextRegular'
                            : 'Uber Move Text',
                        fontSize: RFValue(17),
                      }}>
                      {
                        this.props.App.requests_data_main_vars
                          .moreDetailsFocused_request.ride_basic_infos
                          .pickup_note
                      }
                    </Text>
                  </View>
                </View>
              ) : null}
              {/**Payment method, amount and passenger number */}
              <View
                style={{
                  padding: 20,
                  backgroundColor: '#F6F6F6',
                  height: 70,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    flex: 1,
                  }}>
                  {/cash/i.test(
                    String(
                      this.props.App.requests_data_main_vars
                        .moreDetailsFocused_request.ride_basic_infos
                        .payment_method,
                    ),
                  ) ? (
                    <IconCommunity name="cash-usd" color={'#000'} size={25} />
                  ) : (
                    <IconMaterialIcons name="credit-card" size={25} />
                  )}

                  <Text
                    style={{
                      fontFamily:
                        Platform.OS === 'android'
                          ? 'UberMoveTextMedium'
                          : 'Uber Move Text Medium',
                      fontSize: RFValue(18),
                      marginLeft: 4,
                    }}>
                    {String(
                      this.props.App.requests_data_main_vars
                        .moreDetailsFocused_request.ride_basic_infos
                        .payment_method,
                    )[0] +
                      String(
                        this.props.App.requests_data_main_vars
                          .moreDetailsFocused_request.ride_basic_infos
                          .payment_method,
                      )
                        .substring(
                          1,
                          String(
                            this.props.App.requests_data_main_vars
                              .moreDetailsFocused_request.ride_basic_infos
                              .payment_method,
                          ).length,
                        )
                        .toLowerCase()}
                  </Text>
                </View>
                <Text
                  style={{
                    fontFamily:
                      Platform.OS === 'android' ? 'MoveBold' : 'Uber Move Bold',
                    fontSize: 22,
                    color: '#09864A',
                    flex: 1,
                    textAlign: 'center',
                  }}>
                  {'N$ ' +
                    this.props.App.requests_data_main_vars
                      .moreDetailsFocused_request.ride_basic_infos.fare_amount}
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    flex: 1,
                  }}>
                  <IconAnt name="user" size={17} />
                  <Text
                    style={{
                      fontFamily:
                        Platform.OS === 'android'
                          ? 'UberMoveTextMedium'
                          : 'Uber Move Text Medium',
                      fontSize: RFValue(19),
                      marginLeft: 4,
                    }}>
                    {
                      this.props.App.requests_data_main_vars
                        .moreDetailsFocused_request.ride_basic_infos
                        .passengers_number
                    }
                  </Text>
                </View>
              </View>
              {/**CANCEL BUTTON */}
              {this.props.App.requests_data_main_vars.moreDetailsFocused_request
                .ride_basic_infos.isAccepted &&
              this.props.App.requests_data_main_vars.moreDetailsFocused_request
                .ride_basic_infos.inRideToDestination ? null : (
                <TouchableOpacity
                  onPress={() =>
                    this.state.isLoading_something === false
                      ? this.props.UpdateErrorModalLog(
                          true,
                          'trip_cancellation_confirmation',
                          'any',
                        )
                      : {}
                  }
                  style={{
                    padding: 20,
                    paddingBottom: 30,
                    paddingTop: 30,
                    borderBottomWidth: 1,
                    borderBottomColor: '#F6F6F6',
                  }}>
                  <View>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <IconMaterialIcons
                        name="block"
                        color="#b22222"
                        size={20}
                      />
                      <Text
                        style={{
                          fontFamily:
                            Platform.OS === 'android'
                              ? 'UberMoveTextRegular'
                              : 'Uber Move Text',
                          fontSize: RFValue(19),
                          color: '#b22222',
                          marginLeft: 5,
                        }}>
                        Cancel the trip
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              )}

              {/**Guardian */}
              <View
                style={{
                  padding: 20,
                  paddingBottom: 30,
                  marginBottom: 50,
                }}>
                <Text
                  style={{
                    fontSize: RFValue(16),
                    fontFamily:
                      Platform.OS === 'android'
                        ? 'UberMoveTextMedium'
                        : 'Uber Move Text Medium',
                    color: '#757575',
                    paddingBottom: 25,
                  }}>
                  Safety
                </Text>
                <TouchableOpacity
                  onPress={() =>
                    call({
                      number: '061302302',
                      prompt: true,
                    })
                  }>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <IconMaterialIcons
                      name="shield"
                      color="#b22222"
                      size={25}
                    />
                    <Text
                      style={{
                        fontFamily:
                          Platform.OS === 'android'
                            ? 'UberMoveTextMedium'
                            : 'Uber Move Text Medium',
                        fontSize: RFValue(19),
                        color: '#000',
                        marginLeft: 5,
                      }}>
                      Emergency call
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </SafeAreaView>
      );
    } else if (/error_declining/i.test(error_status)) {
      return (
        <View
          style={{
            backgroundColor: '#fff',
            padding: 20,
            height: 300,
          }}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <IconMaterialIcons
              name="error-outline"
              size={20}
              style={{marginRight: 5}}
            />
            <Text
              style={{
                fontFamily:
                  Platform.OS === 'android'
                    ? 'UberMoveTextMedium'
                    : 'Uber Move Text Medium',
                fontSize: RFValue(20),
              }}>
              Couldn't decline the request
            </Text>
          </View>
          <View>
            <Text
              style={{
                fontFamily:
                  Platform.OS === 'android'
                    ? 'UberMoveTextLight'
                    : 'Uber Move Text',
                fontSize: RFValue(17),
                marginTop: 10,
                lineHeight: 23,
              }}>
              Sorry due to an unexpected error we were unable to move forward
              with the declining of the request. Maybe try again later.
            </Text>
          </View>
          <View style={{flex: 1, justifyContent: 'center'}}>
            <TouchableOpacity
              onPress={() =>
                this.props.UpdateErrorModalLog(false, false, 'any')
              }
              style={styles.bttnGenericTc}>
              <Text
                style={{
                  fontFamily:
                    Platform.OS === 'android'
                      ? 'UberMoveTextMedium'
                      : 'Uber Move Text Medium',
                  fontSize: RFValue(21),
                  color: '#fff',
                }}>
                Try again
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    } else if (/error_confirming_pickup/i.test(error_status)) {
      return (
        <View
          style={{
            backgroundColor: '#fff',
            padding: 20,
            height: 300,
          }}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <IconMaterialIcons
              name="error-outline"
              size={20}
              style={{marginRight: 5}}
            />
            <Text
              style={{
                fontFamily:
                  Platform.OS === 'android'
                    ? 'UberMoveTextMedium'
                    : 'Uber Move Text Medium',
                fontSize: RFValue(20),
              }}>
              Couldn't cancel the request
            </Text>
          </View>
          <View>
            <Text
              style={{
                fontFamily:
                  Platform.OS === 'android'
                    ? 'UberMoveTextLight'
                    : 'Uber Move Text',
                fontSize: RFValue(17),
                marginTop: 10,
                lineHeight: 23,
              }}>
              Sorry due to an unexpected error we were unable to move forward
              with the cancelling of the request. Maybe try again later.
            </Text>
          </View>
          <View style={{flex: 1, justifyContent: 'center'}}>
            <TouchableOpacity
              onPress={() =>
                this.props.UpdateErrorModalLog(false, false, 'any')
              }
              style={styles.bttnGenericTc}>
              <Text
                style={{
                  fontFamily:
                    Platform.OS === 'android'
                      ? 'UberMoveTextMedium'
                      : 'Uber Move Text Medium',
                  fontSize: RFValue(21),
                  color: '#fff',
                }}>
                Try again
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    } else if (/error_confirming_dropoff/i.test(error_status)) {
      return (
        <View
          style={{
            backgroundColor: '#fff',
            padding: 20,
            height: 300,
          }}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <IconMaterialIcons
              name="error-outline"
              size={20}
              style={{marginRight: 5}}
            />
            <Text
              style={{
                fontFamily:
                  Platform.OS === 'android'
                    ? 'UberMoveTextMedium'
                    : 'Uber Move Text Medium',
                fontSize: RFValue(20),
              }}>
              Couldn't confirm drop off
            </Text>
          </View>
          <View>
            <Text
              style={{
                fontFamily:
                  Platform.OS === 'android'
                    ? 'UberMoveTextLight'
                    : 'Uber Move Text',
                fontSize: RFValue(17),
                marginTop: 10,
                lineHeight: 23,
              }}>
              Sorry due to an unexpected error we were unable to move forward
              with the drop off confirmation of the request. Maybe try again
              later.
            </Text>
          </View>
          <View style={{flex: 1, justifyContent: 'center'}}>
            <TouchableOpacity
              onPress={() =>
                this.props.UpdateErrorModalLog(false, false, 'any')
              }
              style={styles.bttnGenericTc}>
              <Text
                style={{
                  fontFamily:
                    Platform.OS === 'android'
                      ? 'UberMoveTextMedium'
                      : 'Uber Move Text Medium',
                  fontSize: RFValue(21),
                  color: '#fff',
                }}>
                Try again
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    } else if (/error_cancelling/i.test(error_status)) {
      return (
        <View
          style={{
            backgroundColor: '#fff',
            padding: 20,
            height: 300,
          }}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <IconMaterialIcons
              name="error-outline"
              size={20}
              style={{marginRight: 5}}
            />
            <Text
              style={{
                fontFamily:
                  Platform.OS === 'android'
                    ? 'UberMoveTextMedium'
                    : 'Uber Move Text Medium',
                fontSize: RFValue(20),
              }}>
              Couldn't cancel the request
            </Text>
          </View>
          <View>
            <Text
              style={{
                fontFamily:
                  Platform.OS === 'android'
                    ? 'UberMoveTextLight'
                    : 'Uber Move Text',
                fontSize: RFValue(17),
                marginTop: 10,
                lineHeight: 23,
              }}>
              Sorry due to an unexpected error we were unable to move forward
              with the cancellation of the request. Maybe try again later.
            </Text>
          </View>
          <View style={{flex: 1, justifyContent: 'center'}}>
            <TouchableOpacity
              onPress={() =>
                this.props.UpdateErrorModalLog(false, false, 'any')
              }
              style={styles.bttnGenericTc}>
              <Text
                style={{
                  fontFamily:
                    Platform.OS === 'android'
                      ? 'UberMoveTextMedium'
                      : 'Uber Move Text Medium',
                  fontSize: RFValue(21),
                  color: '#fff',
                }}>
                Try again
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    } else if (/error_accepting_request/i.test(error_status)) {
      return (
        <View
          style={{
            backgroundColor: '#fff',
            padding: 20,
            height: 300,
          }}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <IconMaterialIcons
              name="error-outline"
              size={20}
              style={{marginRight: 5}}
            />
            <Text
              style={{
                fontFamily:
                  Platform.OS === 'android'
                    ? 'UberMoveTextMedium'
                    : 'Uber Move Text Medium',
                fontSize: RFValue(20),
              }}>
              Couldn't accept
            </Text>
          </View>
          <View>
            <Text
              style={{
                fontFamily:
                  Platform.OS === 'android'
                    ? 'UberMoveTextLight'
                    : 'Uber Move Text',
                fontSize: RFValue(17),
                marginTop: 10,
                lineHeight: 23,
              }}>
              Sorry due to an unexpected error we were unable to move forward
              with accepting this request for you. Maybe try again later.
            </Text>
          </View>
          <View style={{flex: 1, justifyContent: 'center'}}>
            <TouchableOpacity
              onPress={() =>
                this.props.UpdateErrorModalLog(false, false, 'any')
              }
              style={styles.bttnGenericTc}>
              <Text
                style={{
                  fontFamily:
                    Platform.OS === 'android'
                      ? 'UberMoveTextMedium'
                      : 'Uber Move Text Medium',
                  fontSize: RFValue(21),
                  color: '#fff',
                }}>
                Try again
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    } else if (/trip_cancellation_confirmation/i.test(error_status)) {
      return (
        <View
          style={{
            backgroundColor: '#fff',
            padding: 20,
            height: 300,
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text
              style={{
                fontFamily:
                  Platform.OS === 'android'
                    ? 'UberMoveTextMedium'
                    : 'Uber Move Text Medium',
                fontSize: RFValue(20),
              }}>
              Cancel the trip?
            </Text>
          </View>
          <View style={{flex: 1, justifyContent: 'center'}}>
            <TouchableOpacity
              onPress={() =>
                this.state.isLoading_something === false
                  ? this.cancelRequest_driver()
                  : {}
              }
              style={[
                styles.bttnGenericTc,
                {borderRadius: 2, marginBottom: 25, backgroundColor: '#f0f0f0'},
              ]}>
              <Text
                style={{
                  fontFamily:
                    Platform.OS === 'android'
                      ? 'UberMoveTextMedium'
                      : 'Uber Move Text Medium',
                  fontSize: RFValue(21),
                  color: '#000',
                }}>
                {this.state.isLoading_something === false ? (
                  'Yes, cancel'
                ) : (
                  <ActivityIndicator size="large" color="#000" />
                )}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                this.state.isLoading_something === false
                  ? this.props.UpdateErrorModalLog(
                      true,
                      'show_modalMore_tripDetails',
                      'any',
                      this.props.App.requests_data_main_vars
                        .moreDetailsFocused_request,
                    )
                  : {}
              }
              style={[
                styles.bttnGenericTc,
                {borderRadius: 2, marginBottom: 10},
              ]}>
              <Text
                style={{
                  fontFamily:
                    Platform.OS === 'android'
                      ? 'UberMoveTextMedium'
                      : 'Uber Move Text Medium',
                  fontSize: RFValue(21),
                  color: '#fff',
                }}>
                Don't cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    } else if (
      /trip_pickupConfirmation_confirmation/i.test(error_status) &&
      this.props.App.requests_data_main_vars !== undefined &&
      this.props.App.requests_data_main_vars.moreDetailsFocused_request !==
        undefined &&
      this.props.App.requests_data_main_vars.moreDetailsFocused_request
        .ride_basic_infos !== undefined &&
      this.props.App.requests_data_main_vars.moreDetailsFocused_request
        .ride_basic_infos.ride_mode !== undefined
    ) {
      return (
        <View
          style={{
            backgroundColor: '#fff',
            padding: 20,
            height: 360,
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text
              style={{
                fontFamily:
                  Platform.OS === 'android'
                    ? 'UberMoveTextMedium'
                    : 'Uber Move Text Medium',
                fontSize: RFValue(20),
              }}>
              Confirm pickup?
            </Text>
          </View>
          <View>
            {/ride/i.test(
              this.props.App.requests_data_main_vars.moreDetailsFocused_request
                .ride_basic_infos.ride_mode,
            ) ? (
              <Text
                style={{
                  fontFamily:
                    Platform.OS === 'android'
                      ? 'UberMoveTextRegular'
                      : 'Uber Move Text',
                  fontSize: RFValue(17),
                  marginTop: 10,
                  lineHeight: 23,
                }}>
                By <Text style={{color: '#0e8491'}}>confirming the pickup</Text>{' '}
                you confirm that you've picked up the passenger and you're ready
                to head to the destination.
              </Text>
            ) : (
              <Text
                style={{
                  fontFamily:
                    Platform.OS === 'android'
                      ? 'UberMoveTextRegular'
                      : 'Uber Move Text',
                  fontSize: RFValue(17),
                  marginTop: 10,
                  lineHeight: 23,
                }}>
                By <Text style={{color: '#0e8491'}}>confirming the pickup</Text>{' '}
                you confirm that you've picked up the package and you're ready
                to head to the dropoff destination.
              </Text>
            )}
          </View>
          <View style={{flex: 1, justifyContent: 'center'}}>
            <TouchableOpacity
              onPress={() =>
                this.state.isLoading_something === false
                  ? this.confirmPickupRequest_driver()
                  : {}
              }
              style={[
                styles.bttnGenericTc,
                {borderRadius: 2, marginBottom: 20},
              ]}>
              <Text
                style={{
                  fontFamily:
                    Platform.OS === 'android'
                      ? 'UberMoveTextMedium'
                      : 'Uber Move Text Medium',
                  fontSize: RFValue(21),
                  color: '#fff',
                }}>
                {this.state.isLoading_something === false ? (
                  'Confirm pickup'
                ) : (
                  <ActivityIndicator size="large" color="#fff" />
                )}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                this.state.isLoading_something === false
                  ? this.props.UpdateErrorModalLog(
                      true,
                      'show_modalMore_tripDetails',
                      'any',
                      this.props.App.requests_data_main_vars
                        .moreDetailsFocused_request,
                    )
                  : {}
              }
              style={[
                styles.bttnGenericTc,
                {borderRadius: 2, marginBottom: 10, backgroundColor: '#f0f0f0'},
              ]}>
              <Text
                style={{
                  fontFamily:
                    Platform.OS === 'android'
                      ? 'UberMoveTextMedium'
                      : 'Uber Move Text Medium',
                  fontSize: RFValue(21),
                  color: '#000',
                }}>
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    } else if (
      /trip_dropoffConfirmation_confirmation/i.test(error_status) &&
      this.props.App.requests_data_main_vars !== undefined &&
      this.props.App.requests_data_main_vars.moreDetailsFocused_request !==
        undefined &&
      this.props.App.requests_data_main_vars.moreDetailsFocused_request
        .ride_basic_infos !== undefined &&
      this.props.App.requests_data_main_vars.moreDetailsFocused_request
        .ride_basic_infos.ride_mode !== undefined
    ) {
      //....
      return (
        <View
          style={{
            backgroundColor: '#fff',
            padding: 20,
            height: 360,
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text
              style={{
                fontFamily:
                  Platform.OS === 'android'
                    ? 'UberMoveTextMedium'
                    : 'Uber Move Text Medium',
                fontSize: RFValue(20),
              }}>
              Confirm drop off?
            </Text>
          </View>
          <View>
            {/ride/i.test(
              this.props.App.requests_data_main_vars.moreDetailsFocused_request
                .ride_basic_infos.ride_mode,
            ) ? (
              <Text
                style={{
                  fontFamily:
                    Platform.OS === 'android'
                      ? 'UberMoveTextRegular'
                      : 'Uber Move Text',
                  fontSize: RFValue(17),
                  marginTop: 10,
                  lineHeight: 23,
                }}>
                By confirming the drop off you confirm that you’ve taken the
                passenger up till the final destination.
              </Text>
            ) : (
              <Text
                style={{
                  fontFamily:
                    Platform.OS === 'android'
                      ? 'UberMoveTextRegular'
                      : 'Uber Move Text',
                  fontSize: RFValue(17),
                  marginTop: 10,
                  lineHeight: 23,
                }}>
                By confirming the drop off you confirm that you’ve taken the
                package up till the final destination.
              </Text>
            )}
          </View>
          <View style={{flex: 1, justifyContent: 'center'}}>
            <TouchableOpacity
              onPress={() =>
                this.state.isLoading_something === false
                  ? this.confirmDropoffRequest_driver()
                  : {}
              }
              style={[
                styles.bttnGenericTc,
                {borderRadius: 2, marginBottom: 20},
              ]}>
              <Text
                style={{
                  fontFamily:
                    Platform.OS === 'android'
                      ? 'UberMoveTextMedium'
                      : 'Uber Move Text Medium',
                  fontSize: RFValue(21),
                  color: '#fff',
                }}>
                {this.state.isLoading_something === false ? (
                  'Confirm drop off'
                ) : (
                  <ActivityIndicator size="large" color="#fff" />
                )}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                this.state.isLoading_something === false
                  ? this.props.UpdateErrorModalLog(
                      true,
                      'show_modalMore_tripDetails',
                      'any',
                      this.props.App.requests_data_main_vars
                        .moreDetailsFocused_request,
                    )
                  : {}
              }
              style={[
                styles.bttnGenericTc,
                {borderRadius: 2, marginBottom: 10, backgroundColor: '#f0f0f0'},
              ]}>
              <Text
                style={{
                  fontFamily:
                    Platform.OS === 'android'
                      ? 'UberMoveTextMedium'
                      : 'Uber Move Text Medium',
                  fontSize: RFValue(21),
                  color: '#000',
                }}>
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    } else if (/show_weeksEarningsAlternatives/i.test(error_status)) {
      //Avoid opening when there's no data
      if (
        this.props.App.wallet_state_vars.deepWalletInsights === undefined ||
        this.props.App.wallet_state_vars.deepWalletInsights === null ||
        this.props.App.wallet_state_vars.deepWalletInsights.weeks_view ===
          undefined ||
        this.props.App.wallet_state_vars.deepWalletInsights.weeks_view ===
          null ||
        this.props.App.wallet_state_vars.deepWalletInsights.weeks_view.length <=
          0
      ) {
        this.props.UpdateErrorModalLog(false, false, 'any'); //Close modal
      }
      //Show delivery input modal
      //? Generate the weeks data
      let weeksData = this.props.App.wallet_state_vars.deepWalletInsights.weeks_view
        .map((weekInfo, index) => {
          return {
            index: index,
            week_number: weekInfo.week_number,
            year_number: weekInfo.year_number,
          };
        })
        .reverse();
      return (
        <SafeAreaView
          style={{
            backgroundColor: '#fff',
            flex: 1,
          }}>
          <View
            style={
              Platform.OS === 'android'
                ? {
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
                      height: 1,
                    },
                    shadowOpacity: 0.22,
                    shadowRadius: 2.22,

                    elevation: 3,
                  }
                : {
                    flexDirection: 'row',
                    alignItems: 'center',
                    padding: 20,
                    paddingTop: 15,
                    paddingBottom: 15,
                    borderBottomWidth: 0.7,
                    borderBottomColor: '#d0d0d0',
                    backgroundColor: '#fff',
                  }
            }>
            <TouchableOpacity
              onPress={() =>
                this.props.UpdateErrorModalLog(false, false, 'any')
              }
              style={{flexDirection: 'row'}}>
              <View>
                <IconAnt name="arrowleft" size={23} />
              </View>
              <Text
                style={[
                  {
                    fontSize: RFValue(18),
                    fontFamily:
                      Platform.OS === 'android'
                        ? 'UberMoveTextMedium'
                        : 'Uber Move Text Medium',
                    marginLeft: 5,
                  },
                ]}>
                Choose the week
              </Text>
            </TouchableOpacity>
          </View>
          {/**Weeks list */}
          {this.props.App.wallet_state_vars.deepWalletInsights !== undefined &&
          this.props.App.wallet_state_vars.deepWalletInsights !== null &&
          this.props.App.wallet_state_vars.deepWalletInsights.weeks_view !==
            undefined &&
          this.props.App.wallet_state_vars.deepWalletInsights.weeks_view !==
            null ? (
            <FlatList
              data={weeksData}
              initialNumToRender={15}
              keyboardShouldPersistTaps={'always'}
              maxToRenderPerBatch={35}
              windowSize={61}
              updateCellsBatchingPeriod={10}
              keyExtractor={(_, index) => String(index)}
              renderItem={(item, index) => (
                <TouchableOpacity
                  onPress={() => {
                    this.props.UpdateFocusedWeekDeepWalletInsights(
                      item.item.index,
                    );
                    this.props.UpdateErrorModalLog(false, false, 'any'); //Close modal
                  }}
                  style={{
                    borderBottomWidth: 1,
                    borderColor: '#EEEEEE',
                    flexDirection: 'row',
                    alignItems: 'center',
                    padding: 20,
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
                    {item.item.index === weeksData.length - 1
                      ? 'This Week'
                      : item.item.year_number}
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
                    {`Week ${item.item.week_number}`}
                  </Text>
                  <IconMaterialIcons
                    name="keyboard-arrow-right"
                    size={20}
                    style={{marginLeft: 10, color: '#757575'}}
                  />
                </TouchableOpacity>
              )}
            />
          ) : (
            <View
              style={{
                flex: 1,
                alignItems: 'center',
                paddingTop: '25%',
                paddingLeft: 20,
                paddingRight: 20,
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
                  }}>
                  Looks like your wallet history is empty.
                </Text>
              </View>
            </View>
          )}
        </SafeAreaView>
      );
    } else if (/warning_due_to_abuse/i.test(error_status)) {
      return (
        <SafeAreaView
          style={{
            backgroundColor: '#fff',
            flex: 1,
          }}>
          <View style={{padding: 20, marginTop: '5%', flex: 1}}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <IconEntypo
                name="block"
                color={'#b22222'}
                size={20}
                style={{marginRight: 5}}
              />
              <Text
                style={{
                  fontFamily:
                    Platform.OS === 'android' ? 'MoveBold' : 'Uber Move Bold',
                  fontSize: RFValue(20),
                }}>
                Abusive behaviour detected
              </Text>
            </View>
            <View style={{marginTop: 20}}>
              <Text
                style={{
                  fontFamily:
                    Platform.OS === 'android'
                      ? 'MoveTextRegular'
                      : 'Uber Move Text',
                  fontSize: RFValue(17),
                  lineHeight: 25,
                }}>
                {this.props.App.abusive_behavior_infos !== false &&
                this.props.App.abusive_behavior_infos !== undefined &&
                this.props.App.abusive_behavior_infos.message !== undefined &&
                this.props.App.abusive_behavior_infos.message !== null
                  ? this.props.App.abusive_behavior_infos.message
                  : `We've detected a suspiscious behaviour linked to the usage of your TaxiConnect drivers account, please visit the "Support" tab for more.`}
              </Text>
            </View>
            <View
              style={{
                flex: 1,
                justifyContent: 'flex-end',
              }}>
              <TouchableOpacity
                onPress={() =>
                  this.props.UpdateErrorModalLog(false, false, 'any')
                }
                style={[
                  styles.bttnGenericTc,
                  {borderRadius: 2, marginBottom: 20},
                ]}>
                <Text
                  style={{
                    fontFamily:
                      Platform.OS === 'android'
                        ? 'UberMoveTextMedium'
                        : 'Uber Move Text Medium',
                    fontSize: RFValue(21),
                    color: '#fff',
                  }}>
                  Close
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      );
    } else if (/account_suspended_due_to_abuse/i.test(error_status)) {
      return (
        <SafeAreaView
          style={{
            backgroundColor: '#fff',
            flex: 1,
          }}>
          <View
            style={{
              flex: 1,
              padding: 20,
              paddingRight: 30,
            }}>
            <Text
              style={[
                {
                  fontSize: RFValue(23),
                  fontFamily:
                    Platform.OS === 'android'
                      ? 'UberMoveBold'
                      : 'Uber Move Bold',
                  marginTop: 15,
                  marginBottom: 35,
                  width: '100%',
                  textAlign: 'center',
                },
              ]}>
              Account suspended
            </Text>
            <View
              style={{
                width: '100%',
                alignItems: 'center',
              }}>
              <IconEntypo name="block" color={'#b22222'} size={50} />
            </View>
            <View style={{flex: 1}}>
              <Text
                style={[
                  {
                    fontFamily:
                      Platform.OS === 'android'
                        ? 'UberMoveTextRegular'
                        : 'Uber Move Text',
                    color: '#000',
                    fontSize: RFValue(17),
                    marginTop: '10%',
                    textAlign: 'left',
                    width: '100%',
                    lineHeight: 28,
                  },
                ]}>
                {this.props.App.suspension_infos.message !== undefined &&
                this.props.App.suspension_infos.message !== null
                  ? this.props.App.suspension_infos.message
                  : `Your account has been suspended to a malicious usage detected.`}
              </Text>
              <Text
                style={[
                  {
                    fontFamily:
                      Platform.OS === 'android'
                        ? 'UberMoveTextRegular'
                        : 'Uber Move Text',
                    color: '#000',
                    fontSize: RFValue(16),
                    marginTop: 10,
                    textAlign: 'left',
                    width: '100%',
                  },
                ]}>
                Contact Us for more information.
              </Text>
            </View>
            <View>
              <View
                style={{
                  width: '100%',
                  alignItems: 'center',
                  height: 100,
                }}>
                <TouchableOpacity
                  onPress={() => call({number: '+264814400089', prompt: true})}
                  style={{
                    borderWidth: 1,
                    borderColor: 'transparent',
                    width: '100%',
                  }}>
                  <View
                    style={[
                      styles.bttnGenericTc,
                      {borderRadius: 2, marginBottom: 20},
                    ]}>
                    <IconMaterialIcons name="phone" color="#fff" size={25} />
                    <Text
                      style={[
                        {
                          fontFamily:
                            Platform.OS === 'android'
                              ? 'UberMoveTextBold'
                              : 'Uber Move Text Bold',
                          fontSize: RFValue(19),
                          color: '#fff',
                          marginLeft: 10,
                        },
                      ]}>
                      Call TaxiConnect
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </SafeAreaView>
      );
    } else {
      this.props.UpdateErrorModalLog(false, false, 'any'); //Close modal
      return <></>;
    }
  }

  render() {
    return (
      <View>
        <Modal
          testID={'modal'}
          useNativeDriver={true}
          useNativeDriverForBackdrop={true}
          onBackButtonPress={() =>
            this.props.UpdateErrorModalLog(false, false, 'any')
          }
          onBackdropPress={() =>
            /(show_guardian_toolkit|show_select_ride_type_modal)/i.test(
              this.props.error_status,
            )
              ? this.props.UpdateErrorModalLog(false, false, 'any')
              : {}
          }
          isVisible={
            this.props.active !== undefined && this.props.active !== null
              ? this.props.error_status !== undefined &&
                this.props.error_status !== null
                ? this.props.active
                : false
              : false
          }
          animationInTiming={300}
          animationOutTiming={300}
          style={styles.modalBottom}>
          {this.renderModalContent(this.props.error_status)}
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  modalBottom: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  bttnGenericTc: {
    borderColor: '#000',
    padding: 12,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    backgroundColor: '#000',
    borderRadius: 200,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowOpacity: 0.25,
    shadowRadius: 5.84,

    elevation: 3,
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
      ResetGenericPhoneNumberInput,
      UpdateType_rideShown_YourRides_screen,
      UpdateErrorModalLog,
      SwitchToNavigation_modeOrBack,
      UpdateFocusedWeekDeepWalletInsights,
      UpdateRequestType_focused,
      UpdateType_rideShown_YourRides_screen_HISTORY,
    },
    dispatch,
  );

export default React.memo(
  connect(mapStateToProps, mapDispatchToProps)(ErrorModal),
);
