import React from 'react';
import {Animated} from 'react-native';
import SOCKET_CORE from '../../Helpers/managerNode';
import {Dimensions} from 'react-native';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
//Images assets
const supportMainImage = require('../../../Media_assets/Images/faq.jpg');
//1. Turn by turn ddirections
const arrowTurnLeft = require('../../../Media_assets/Images/turn-left.png');
const arrowTurnRight = require('../../../Media_assets/Images/turn-right.png');
const arrowStraight = require('../../../Media_assets/Images/right-arrow.png');
const arrowNavigationTracking = require('../../../Media_assets/Images/compass.png');

const STATE = {
  //? CRUCIAL FUNCTIONS
  fetchRequestedRequests_history: null, //From Your rides - responsible for updating the ride history list.
  goOnlineOrOffline: null, //Save the function to go online or offline.
  //? ---------------
  _TOP_STACK_NAVIGATION: false, //TOP STACK NAVIGATION of the all, save on the entry screen
  //PERSISTANT INTERVAL VARIABLES
  //Interval persister for updating requests data
  _TMP_TRIP_INTERVAL_PERSISTER: null, //The interval for updating rides related data
  _TMP_TRIP_INTERVAL_PERSISTER_TIME: 1200, //THe frequency of repetition - default:3s
  //Interval persister for updating the focused navigation data
  _TMP_NAVIATION_DATA_INTERVAL_PERSISTER: null, //The interval for updating the focused navigation data
  _TMP_NAVIATION_DATA_INTERVAL_PERSISTER_TIME: 1000, //THe frequency of repetition - default:3s

  _TMP_TIMEOUT_AFTER_REQUEST_RESPONSE: 2000, //The timeout after the response to show updated content - default: 4s

  _TMP_TIMEOUT_AFTER_GOING_ONLINE_OR_OFFLINE: 7000, //The delay in the loader after pressing online/offlline - default: 0.7sec

  _Requests_graphInfos: null, //Will contain the requests graph data that will show badges of the number of general total requests and also specific requests if needed. - default: null

  _MAX_NUMBER_OF_CALLBACKS_MAP: 5, //? The maximum number of function callbacks for the geolocation - default: 40 (Major performance improvement)

  //ASSETS
  windowWidth: windowWidth,
  windowHeight: windowHeight,
  //Turn by turn directions
  arrowTurnLeft: arrowTurnLeft,
  arrowTurnRight: arrowTurnRight,
  arrowStraight: arrowStraight,
  arrowNavigationTracking: arrowNavigationTracking,
  //...
  supportMainImage: supportMainImage,

  socket: SOCKET_CORE, //MAIN SOCKET CONNECTOR
  user_fingerprint: null,
  pushnotif_token: false, //Notification push notification (the full object) - default: false

  userCurrentLocationMetaData: {}, //Metadata of the user's current location - directly geocoded and shallowly processed
  requestType: 'ride', //THE TYPE OF REQUEST SELECTED BY THE DRIVER - ride, delivery or scheduled
  latitude: 0,
  longitude: 0,
  //GPRS RESOLUTION
  gprsGlobals: {
    didAskForGprs: false, //If the user was ask once to activate the gprs
    hasGPRSPermissions: true, //To know wheter we have the GPRS permissions or not (true/false) - Default to true
  },
  //PHONE NUMBER INPUT MODULE
  countriesDialDataState: null, //Data for all the considered countries - default: complete set, can be filtereed but not altered! - to be initialized in the constructor of the module
  renderCountryCodeSeacher: false, //Whether to show or not the list of country code to select one
  countryCodeSelected: 'NA', //Country code selected by the user - default: NA (Namibia)
  countryPhoneCode: '+264', //The selected country's phone code - default : +264 (Namibia)
  dynamicMaxLength: 10, //Max length of the phone number based on the country selected - default: 10 characters
  phoneNumberEntered: '', //Phone number entered by the user
  phoneNumberPlaceholder: '', //Placeholder with the correct format before entering the phone number, based on the selected country.
  isFilterCountryShown: false, //Whether or not to show the country search filter on user action - default: false
  typedCountrySearchQuery: '', //Query typed to search a specific country
  finalPhoneNumber: false, //Store the final generated phone number
  //Generic phone number input variable
  isPhoneNumberValid: false, //TO know if the phone number is valid or not.

  //ANIMATION OF SEARCH COUNTRY SCREEN
  searchCountryScreenOpacity: new Animated.Value(0), //Opacity of the seach country screen - default: 0
  searchCountryScreenPosition: new Animated.Value(200), //Top offset of the search country screen - default: 200

  //Error manager
  generalErrorModal_vars: {
    showErrorGeneralModal: false, //Whether to show or not the error modal - default: false
    generalErrorModalType: false, //The type of the error to handle, based on this the content of the modal will be very different - careful! - default: false
    network_type: false, //The type of the network currently connected.
  },

  //User generic variables
  gender_user: 'male', //The gender of the user - default: male (male, female, unknown)
  username: false, //The name of the user - default: false - name
  surname_user: false, //The name of the user - default: false - surname
  phone_user: false, //The user's phone number - default: false
  user_email: false, //The email of the user - default: false
  user_profile_pic: null, //The user's profile picture
  last_dataPersoUpdated: null, //The last data updated - default: null

  account_state: null, //! THE ACCOUNT STATE: true, false, suspended and so on. To determine the current state of the account.

  //1.Home screen
  shownRides_types: 'Rides', //To govern which ride to show :Rides, Delivery or Scheduled - default: Rides
  //Responsible for defining the state of the interface at any time
  main_interfaceState_vars: {
    isApp_inNavigation_mode: false, //To know if the app is in navigation mode or not. - default: false
    isRideInProgress: false, //TO know whether a ride is in progress or not - default: false
    isDriver_online: false, //To know whether the driver is online or offline - default: false - SERVER DEPENDENT
    isComputing_route: true, //To know whether the app is computing the optimal route to destination - default: true
    isApp_inTrackingMode: false, //To know whether the driver pressed the closest tracking mode feature or not - default: false
    //..
    navigationRouteData: false, //The data for the navigation mode during an active ride in progress - default: false
    dailyAmount_madeSoFar: false, //Contains the array with the details about the amount made today so far - ALSO HAS THE TYPE OF SUPPORTED REQUESTS FOR THE DRIVERS! - default: false
  },
  //2. Requests main vars
  //Hold all the requests related data storages
  requests_data_main_vars: {
    fetchedRequests_data_store: false, //To store all the fetched targeted requests list from the server - default: false
    moreDetailsFocused_request: false, //To hold the details about the interested request clicked by the driver for more details. - default: false
  },

  //RIDES tab
  //1.Your rides screen
  shownRides_types_tab: 'Past', //To govern which ride to show :past, scheduled or business - default: false
  //Will contain all the rides details history for "Past", "Scheduled" and "Business" rides/deliveries
  rides_history_details_data: {
    rides_history_data: [],
    targetedRequestSelected: {
      request_fp: false,
    }, //After the user select one already happened ride for more details - default: false
  },

  //WALLET VARS
  wallet_state_vars: {
    totalWallet_amount: 0, //Current wallet balance - default: 0
    transactions_data: null, //Contains the detailed wallet transactions made from trips or normal wallet transfers. - default: null
    selectedPayment_method: 'cash', //Default selected payment method - default: cash - auto select wallet after selecting a car type based on the fare amount. - default:cash
    transactions_details: null, //Will contain all the transactions made by the user using his wallet - or by cash. - default:null
    deepWalletInsights: null, //Will contain the detailed wallet transactions - default:null
    focusedWeekWalletInsights: null, //Will contain the details of the specific week selected by the driver for more insights. - default:null
    focusedWeek_graphData: null, //Will contain the graph ddata to be displayed. - default: null
    focusedWeek_arrayIndex: 0, //Will hold the index of the selected week - default: 0 (current week)
  },
};

export default STATE;
