import React from 'react';
import SOCKET_CORE from '../../Helpers/managerNode';
import {Dimensions} from 'react-native';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
//Images assets
//1. Turn by turn ddirections
const arrowTurnLeft = require('../../../Media_assets/Images/turn-left.png');
const arrowTurnRight = require('../../../Media_assets/Images/turn-right.png');
const arrowStraight = require('../../../Media_assets/Images/right-arrow.png');
const arrowNavigationTracking = require('../../../Media_assets/Images/compass.png');

const STATE = {
  //PERSISTANT INTERVAL VARIABLES
  //Interval persister for updating requests data
  _TMP_TRIP_INTERVAL_PERSISTER: null, //The interval for updating rides related data
  _TMP_TRIP_INTERVAL_PERSISTER_TIME: 5000, //THe frequency of repetition - default:5s

  //ASSETS
  windowWidth: windowWidth,
  windowHeight: windowHeight,
  //Turn by turn directions
  arrowTurnLeft: arrowTurnLeft,
  arrowTurnRight: arrowTurnRight,
  arrowStraight: arrowStraight,
  arrowNavigationTracking: arrowNavigationTracking,

  socket: SOCKET_CORE, //MAIN SOCKET CONNECTOR
  user_fingerprint:
    '23c9d088e03653169b9c18193a0b8dd329ea1e43eb0626ef9f16b5b979694a429710561a3cb3ddae',
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

  //Error manager
  generalErrorModal_vars: {
    showErrorGeneralModal: false, //Whether to show or not the error modal - default: false
    generalErrorModalType: false, //The type of the error to handle, based on this the content of the modal will be very different - careful! - default: false
    network_type: false, //The type of the network currently connected.
  },

  //1.Home screen
  shownRides_types: 'Rides', //To govern which ride to show :Rides, Delivery or Scheduled - default: false
  //Responsible for defining the state of the interface at any time
  main_interfaceState_vars: {
    isApp_inNavigation_mode: false, //To know if the app is in navigation mode or not. - default: false
    isRideInProgress: false, //TO know whether a ride is in progress or not - default: false
    isDriver_online: true, //To know whether the driver is online or offline - default: false - SERVER DEPENDENT
    isComputing_route: false, //To know whether the app is computing the optimal route to destination - default: false
    isApp_inTrackingMode: false, //To know whether the driver pressed the closest tracking mode feature or not - default: false
  },
};

export default STATE;
