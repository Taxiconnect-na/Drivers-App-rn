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
  Image,
  TextInput,
} from 'react-native';
import Modal from 'react-native-modal';
import IconCommunity from 'react-native-vector-icons/MaterialCommunityIcons';
import IconMaterialIcons from 'react-native-vector-icons/MaterialIcons';
import IconFontisto from 'react-native-vector-icons/Fontisto';
import IconEntypo from 'react-native-vector-icons/Entypo';
import GenericLoader from '../Modules/GenericLoader/GenericLoader';
import IconFeather from 'react-native-vector-icons/Feather';
import IconAnt from 'react-native-vector-icons/AntDesign';
import {systemWeights} from 'react-native-typography';
import {
  ResetGenericPhoneNumberInput,
  UpdateType_rideShown_YourRides_screen,
  UpdateErrorModalLog,
} from '../Redux/HomeActionsCreators';
import call from 'react-native-phone-call';

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
            if (/unable/i.test(response.response)) {
              //Error
              globalObject.props.UpdateErrorModalLog(
                true,
                'error_cancelling',
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
        }, globalObject.props.App._TMP_TIMEOUT_AFTER_REQUEST_RESPONSE);
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
        }, globalObject.props.App._TMP_TIMEOUT_AFTER_REQUEST_RESPONSE);
      },
    );
  }

  /**
   * @func updateYourRidesSHownOnes
   * @param type: Rides, Delivery or Scheduled
   * Responsible for updating the type of ride shown in the "Main" tab.
   */
  updateYourRidesSHownOnes(type, parentNode) {
    this.props.UpdateErrorModalLog(false, false, 'any'); //Close modal
    this.props.UpdateType_rideShown_YourRides_screen(type);
    //Update the list of requests from the server
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
              size={22}
              style={{marginRight: 5}}
            />
            <Text
              style={{fontFamily: 'Allrounder-Grotesk-Medium', fontSize: 22}}>
              No Internet connection
            </Text>
          </View>
          <View>
            <Text
              style={{
                fontFamily: 'Allrounder-Grotesk-Book',
                fontSize: 17,
                marginTop: 10,
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
                  fontFamily: 'Allrounder-Grotesk-Regular',
                  fontSize: 17,
                }}>
                Waiting for Internet connection
              </Text>
            </View>
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
            height: 300,
          }}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <IconMaterialIcons
              name="error-outline"
              size={22}
              style={{marginRight: 5}}
            />
            <Text
              style={{fontFamily: 'Allrounder-Grotesk-Medium', fontSize: 22}}>
              Something's wrong
            </Text>
          </View>
          <View>
            <Text
              style={{
                fontFamily: 'Allrounder-Grotesk-Book',
                fontSize: 17,
                marginTop: 10,
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
                  fontFamily: 'Allrounder-Grotesk-Medium',
                  fontSize: 19,
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
            height: 300,
          }}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <IconMaterialIcons
              name="error-outline"
              size={22}
              style={{marginRight: 5}}
            />
            <Text
              style={{fontFamily: 'Allrounder-Grotesk-Medium', fontSize: 22}}>
              Couldn't check the OTP
            </Text>
          </View>
          <View>
            <Text
              style={{
                fontFamily: 'Allrounder-Grotesk-Book',
                fontSize: 17,
                marginTop: 10,
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
                  fontFamily: 'Allrounder-Grotesk-Medium',
                  fontSize: 19,
                  color: '#fff',
                }}>
                Try again
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    } else if (/show_select_ride_type_modal/i.test(error_status)) {
      return (
        <View
          style={{
            backgroundColor: '#fff',
            //padding: 20,
            height: 360,
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
              style={{fontFamily: 'Allrounder-Grotesk-Regular', fontSize: 20}}>
              What do you want to see?
            </Text>
          </View>
          <View style={{flex: 1, justifyContent: 'center'}}>
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
                  fontFamily: 'Allrounder-Grotesk-Book',
                  fontSize: 19,
                  color: '#000',
                  marginLeft: 5,
                  flex: 1,
                }}>
                Rides
              </Text>
              {/Rides/i.test(this.props.App.shownRides_types) ? (
                <IconFeather name="check" color="#0e8491" size={20} />
              ) : null}
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                this.updateYourRidesSHownOnes('Delivery', this.props.parentNode)
              }
              style={[
                styles.bttnGenericTc,
                {
                  borderRadius: 2,
                  marginBottom: 10,
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
                  fontFamily: 'Allrounder-Grotesk-Book',
                  fontSize: 19,
                  color: '#000',
                  marginLeft: 5,
                  flex: 1,
                }}>
                Deliveries
              </Text>
              {/Delivery/i.test(this.props.App.shownRides_types) ? (
                <IconFeather name="check" color="#0e8491" size={20} />
              ) : null}
            </TouchableOpacity>
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
                  fontFamily: 'Allrounder-Grotesk-Book',
                  fontSize: 19,
                  color: '#000',
                  marginLeft: 5,
                  flex: 1,
                }}>
                Scheduled
              </Text>
              {/Scheduled/i.test(this.props.App.shownRides_types) ? (
                <IconFeather name="check" color="#0e8491" size={20} />
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
                  fontFamily: 'Allrounder-Grotesk-Book',
                  fontSize: 19,
                  color: '#b22222',
                  marginLeft: 5,
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
            //padding: 20,
            height: 300,
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
              style={{fontFamily: 'Allrounder-Grotesk-Regular', fontSize: 20}}>
              Safety
            </Text>
          </View>
          <View style={{flex: 1, justifyContent: 'center'}}>
            <TouchableOpacity
              onPress={() => {}}
              style={[
                styles.bttnGenericTc,
                {
                  borderRadius: 2,
                  marginBottom: 10,
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
                  flexDirection: 'row',
                },
              ]}>
              <IconMaterialIcons name="shield" color="#b22222" size={28} />
              <Text
                style={{
                  fontFamily: 'Allrounder-Grotesk-Book',
                  fontSize: 19,
                  marginLeft: 5,
                  flex: 1,
                  color: '#b22222',
                }}>
                Emergency call
              </Text>
            </TouchableOpacity>
            <View
              style={[
                styles.bttnGenericTc,
                {
                  borderRadius: 2,
                  marginBottom: 10,
                  justifyContent: 'flex-start',
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
                  fontFamily: 'Allrounder-Grotesk-Book',
                  fontSize: 14,
                  color: '#a5a5a5',
                  marginLeft: 5,
                  flex: 1,
                  lineHeight: 17,
                }}>
                Use the Emergency call button only in the case of an extreme
                emergency. Otherwise some additional charges may apply.
              </Text>
            </View>
          </View>
        </View>
      );
    } else if (/show_modalMore_tripDetails/i.test(error_status)) {
      //Auto close when no focused data found
      if (
        this.props.App.requests_data_main_vars.moreDetailsFocused_request ===
          false ||
        this.props.App.requests_data_main_vars.fetchedRequests_data_store ===
          false
      ) {
        //Invalid setup - close modal
        //this.props.UpdateErrorModalLog(false, false, 'any'); //Close modal - enable after
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
      return (
        <SafeAreaView
          style={{
            backgroundColor: '#fff',
            //padding: 20,
            flex: 1,
          }}>
          <View style={styles.presentationWindow}>
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
                  height: 1,
                },
                shadowOpacity: 0.22,
                shadowRadius: 2.22,

                elevation: 3,
              }}>
              <TouchableOpacity
                onPress={() =>
                  this.props.UpdateErrorModalLog(false, false, 'any')
                }
                style={{flexDirection: 'row'}}>
                <View style={{top: 1.5}}>
                  <IconAnt name="arrowleft" size={23} />
                </View>
                <Text
                  style={[
                    systemWeights.semibold,
                    {
                      fontSize: 17.5,
                      fontFamily: 'Allrounder-Grotesk-Regular',
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
            </View>
            <ScrollView style={{flex: 1}}>
              {/**Passengers details */}
              <View
                style={{
                  flexDirection: 'row',
                  padding: 20,
                  paddingTop: 18,
                  paddingBottom: 15,
                  alignItems: 'center',
                  borderBottomWidth: 0.7,
                  borderBottomColor: '#d0d0d0',
                  backgroundColor: '#f9f9f9',
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
                        fontFamily: 'Allrounder-Grotesk-Regular',
                        fontSize: 17,
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
                          fontFamily: 'Allrounder-Grotesk-Regular',
                          fontSize: 15,
                          color: '#096ED4',
                        }}>
                        {
                          this.props.App.requests_data_main_vars
                            .moreDetailsFocused_request.eta_to_passenger_infos
                            .eta
                        }
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
                  <IconMaterialIcons name="phone" color="#096ED4" size={21} />
                  <Text
                    style={{
                      fontFamily: 'Allrounder-Grotesk-Regular',
                      color: '#096ED4',
                      fontSize: 16.5,
                    }}>
                    Call
                  </Text>
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
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 15,
                    backgroundColor: '#fff',
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
                  }}>
                  <IconCommunity name="navigation" size={22} />
                  <Text
                    style={{
                      fontFamily: 'Allrounder-Grotesk-Regular',
                      fontSize: 16,
                      color: '#000',
                    }}>
                    Find client
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
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 15,
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
                    style={{
                      fontFamily: 'Allrounder-Grotesk-Medium',
                      fontSize: 15,
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
                    fontSize: 16,
                    fontFamily: 'Allrounder-Grotesk-Book',
                    color: '#a5a5a5',
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
                    borderBottomWidth: 0.7,
                    borderBottomColor: '#d0d0d0',
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
                          <View style={{width: 35}}>
                            <Text
                              style={{
                                fontFamily: 'Allrounder-Grotesk-Book',
                                fontSize: 13,
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
                                  fontFamily: 'Allrounder-Grotesk-Medium',
                                  fontSize: 15,
                                  marginLeft: 5,
                                  flex: 1,
                                }}>
                                {
                                  this.props.App.requests_data_main_vars
                                    .moreDetailsFocused_request
                                    .origin_destination_infos.pickup_infos
                                    .suburb
                                }
                              </Text>
                              <Text
                                style={{
                                  fontFamily: 'Allrounder-Grotesk-Book',
                                  fontSize: 14,
                                  marginLeft: 5,
                                  marginTop: 3,
                                  flex: 1,
                                }}>
                                {this.props.App.requests_data_main_vars
                                  .moreDetailsFocused_request
                                  .origin_destination_infos.pickup_infos
                                  .location_name +
                                  ', ' +
                                  this.props.App.requests_data_main_vars
                                    .moreDetailsFocused_request
                                    .origin_destination_infos.pickup_infos
                                    .street_name}
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
                          <View style={{width: 35}}>
                            <Text
                              style={{
                                fontFamily: 'Allrounder-Grotesk-Book',
                                fontSize: 13,
                                top: 1,
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
                                      marginTop: index > 0 ? 5 : 0,
                                    }}>
                                    <Text
                                      style={{
                                        fontFamily: 'Allrounder-Grotesk-Medium',
                                        fontSize: 15,
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
                                              'Allrounder-Grotesk-Regular',
                                            fontSize: 13,
                                            marginLeft: 5,
                                            flex: 1,
                                            color: '#096ED4',
                                          }}>
                                          {index + 1 + '. '}
                                        </Text>
                                      ) : null}
                                      {destination.suburb}
                                    </Text>
                                    <Text
                                      style={{
                                        fontFamily: 'Allrounder-Grotesk-Book',
                                        fontSize: 14,
                                        marginLeft: 5,
                                        marginTop: 3,
                                        flex: 1,
                                      }}>
                                      {destination.location_name}
                                    </Text>
                                    {destination.street_name !== 'false' &&
                                    destination.street_name !== false ? (
                                      <Text
                                        style={{
                                          fontFamily: 'Allrounder-Grotesk-Book',
                                          fontSize: 14,
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
              {/**Payment method, amount and passenger number */}
              <View
                style={{
                  padding: 20,
                  borderBottomWidth: 0.7,
                  borderBottomColor: '#d0d0d0',
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
                      fontFamily: 'Allrounder-Grotesk-Regular',
                      fontSize: 17,
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
                    fontFamily: 'Allrounder-Grotesk-Medium',
                    fontSize: 18,
                    color: 'green',
                    flex: 1,
                    textAlign: 'center',
                  }}>
                  {'N$' +
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
                      fontFamily: 'Allrounder-Grotesk-Medium',
                      fontSize: 17.5,
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
                    borderBottomWidth: 0.7,
                    borderBottomColor: '#d0d0d0',
                  }}>
                  <View>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <IconMaterialIcons
                        name="block"
                        color="#b22222"
                        size={25}
                      />
                      <Text
                        style={{
                          fontFamily: 'Allrounder-Grotesk-Regular',
                          fontSize: 16,
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
                    fontSize: 16,
                    fontFamily: 'Allrounder-Grotesk-Book',
                    color: '#a5a5a5',
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
                        fontFamily: 'Allrounder-Grotesk-Book',
                        fontSize: 17,
                        color: '#b22222',
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
    } else if (/show_guardian_toolkit/i.test(error_status)) {
      return (
        <View
          style={{
            backgroundColor: '#fff',
            //padding: 20,
            height: 300,
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
              style={{fontFamily: 'Allrounder-Grotesk-Regular', fontSize: 20}}>
              Safety
            </Text>
          </View>
          <View style={{flex: 1, justifyContent: 'center'}}>
            <TouchableOpacity
              onPress={() => {}}
              style={[
                styles.bttnGenericTc,
                {
                  borderRadius: 2,
                  marginBottom: 10,
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
                  flexDirection: 'row',
                },
              ]}>
              <IconMaterialIcons name="shield" color="#b22222" size={28} />
              <Text
                style={{
                  fontFamily: 'Allrounder-Grotesk-Book',
                  fontSize: 19,
                  marginLeft: 5,
                  flex: 1,
                  color: '#b22222',
                }}>
                Emergency call
              </Text>
            </TouchableOpacity>
            <View
              style={[
                styles.bttnGenericTc,
                {
                  borderRadius: 2,
                  marginBottom: 10,
                  justifyContent: 'flex-start',
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
                  fontFamily: 'Allrounder-Grotesk-Book',
                  fontSize: 14,
                  color: '#a5a5a5',
                  marginLeft: 5,
                  flex: 1,
                  lineHeight: 17,
                }}>
                Use the Emergency call button only in the case of an extreme
                emergency. Otherwise some additional charges may apply.
              </Text>
            </View>
          </View>
        </View>
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
              size={22}
              style={{marginRight: 5}}
            />
            <Text
              style={{fontFamily: 'Allrounder-Grotesk-Medium', fontSize: 22}}>
              Couldn't decline the request
            </Text>
          </View>
          <View>
            <Text
              style={{
                fontFamily: 'Allrounder-Grotesk-Book',
                fontSize: 17,
                marginTop: 10,
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
                  fontFamily: 'Allrounder-Grotesk-Medium',
                  fontSize: 19,
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
              size={22}
              style={{marginRight: 5}}
            />
            <Text
              style={{fontFamily: 'Allrounder-Grotesk-Medium', fontSize: 22}}>
              Couldn't cancel the request
            </Text>
          </View>
          <View>
            <Text
              style={{
                fontFamily: 'Allrounder-Grotesk-Book',
                fontSize: 17,
                marginTop: 10,
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
                  fontFamily: 'Allrounder-Grotesk-Medium',
                  fontSize: 19,
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
              size={22}
              style={{marginRight: 5}}
            />
            <Text
              style={{fontFamily: 'Allrounder-Grotesk-Medium', fontSize: 22}}>
              Couldn't confirm drop off
            </Text>
          </View>
          <View>
            <Text
              style={{
                fontFamily: 'Allrounder-Grotesk-Book',
                fontSize: 17,
                marginTop: 10,
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
                  fontFamily: 'Allrounder-Grotesk-Medium',
                  fontSize: 19,
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
              size={22}
              style={{marginRight: 5}}
            />
            <Text
              style={{fontFamily: 'Allrounder-Grotesk-Medium', fontSize: 22}}>
              Couldn't confirm pickup
            </Text>
          </View>
          <View>
            <Text
              style={{
                fontFamily: 'Allrounder-Grotesk-Book',
                fontSize: 17,
                marginTop: 10,
              }}>
              Sorry due to an unexpected error we were unable to move forward
              with the pickup confirmation of the request. Maybe try again
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
                  fontFamily: 'Allrounder-Grotesk-Medium',
                  fontSize: 19,
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
              size={22}
              style={{marginRight: 5}}
            />
            <Text
              style={{fontFamily: 'Allrounder-Grotesk-Medium', fontSize: 22}}>
              Couldn't accept
            </Text>
          </View>
          <View>
            <Text
              style={{
                fontFamily: 'Allrounder-Grotesk-Book',
                fontSize: 17,
                marginTop: 10,
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
                  fontFamily: 'Allrounder-Grotesk-Medium',
                  fontSize: 19,
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
              style={{fontFamily: 'Allrounder-Grotesk-Medium', fontSize: 22}}>
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
                  fontFamily: 'Allrounder-Grotesk-Medium',
                  fontSize: 19,
                  color: '#000',
                  marginLeft: 5,
                }}>
                {this.state.isLoading_something === false ? (
                  'Yes, cancel'
                ) : (
                  <ActivityIndicator size="small" color="#000" />
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
                  fontFamily: 'Allrounder-Grotesk-Medium',
                  fontSize: 19,
                  color: '#fff',
                  marginLeft: 5,
                }}>
                Don't cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    } else if (/trip_pickupConfirmation_confirmation/i.test(error_status)) {
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
              style={{fontFamily: 'Allrounder-Grotesk-Medium', fontSize: 22}}>
              Confirm pickup?
            </Text>
          </View>
          <View>
            <Text
              style={{
                fontFamily: 'Allrounder-Grotesk-Book',
                fontSize: 17,
                marginTop: 10,
              }}>
              By confirming the pickup you confirm that you've picked up the
              passenger and you're ready to head to the destination.
            </Text>
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
                  fontFamily: 'Allrounder-Grotesk-Medium',
                  fontSize: 19,
                  color: '#fff',
                  marginLeft: 5,
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
                  fontFamily: 'Allrounder-Grotesk-Medium',
                  fontSize: 19,
                  color: '#000',
                  marginLeft: 5,
                }}>
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    } else if (/trip_dropoffConfirmation_confirmation/i.test(error_status)) {
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
              style={{fontFamily: 'Allrounder-Grotesk-Medium', fontSize: 22}}>
              Confirm drop off?
            </Text>
          </View>
          <View>
            <Text
              style={{
                fontFamily: 'Allrounder-Grotesk-Book',
                fontSize: 17,
                marginTop: 10,
              }}>
              By confirming the drop off you confirm that you've taken the
              passenger up to final destination.
            </Text>
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
                  fontFamily: 'Allrounder-Grotesk-Medium',
                  fontSize: 19,
                  color: '#fff',
                  marginLeft: 5,
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
                  fontFamily: 'Allrounder-Grotesk-Medium',
                  fontSize: 19,
                  color: '#000',
                  marginLeft: 5,
                }}>
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    } else {
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
    },
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchToProps)(ErrorModal);
