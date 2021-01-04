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
  _TMP_TRIP_INTERVAL_PERSISTER_TIME: 3000, //THe frequency of repetition - default:3s
  //Interval persister for updating the focused navigation data
  _TMP_NAVIATION_DATA_INTERVAL_PERSISTER: null, //The interval for updating the focused navigation data
  _TMP_NAVIATION_DATA_INTERVAL_PERSISTER_TIME: 3000, //THe frequency of repetition - default:3s

  _TMP_TIMEOUT_AFTER_REQUEST_RESPONSE: 4000, //The timeout after the response to show updated content - default: 4s

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
    isApp_inNavigation_mode: true, //To know if the app is in navigation mode or not. - default: false
    isRideInProgress: true, //TO know whether a ride is in progress or not - default: false
    isDriver_online: true, //To know whether the driver is online or offline - default: false - SERVER DEPENDENT
    isComputing_route: true, //To know whether the app is computing the optimal route to destination - default: true
    isApp_inTrackingMode: false, //To know whether the driver pressed the closest tracking mode feature or not - default: false
    //..
    navigationRouteData: false, //The data for the navigation mode during an active ride in progress - default: false
  },
  //2. Requests main vars
  //Hold all the requests related data storages
  requests_data_main_vars: {
    fetchedRequests_data_store: false, //To store all the fetched targeted requests list from the server - default: false
    moreDetailsFocused_request: {
      request_fp:
        '999999f5c51c380ef9dee9680872a6538cc9708ef079a8e42de4d762bfa7d49efdcde41c6009cbdd9cdf6f0ae0544f74cb52caa84439cbcda40ce264f90825e8',
      passenger_infos: {
        name: 'Dominique',
        phone_number: '+264856997167',
      },
      eta_to_passenger_infos: {
        eta: '1 min away',
        distance: 1061.153,
      },
      ride_basic_infos: {
        payment_method: 'CASH',
        fare_amount: 45,
        passengers_number: 2,
        connect_type: 'ConnectUs',
        isAccepted: true,
        inRideToDestination: false,
        isRideCompleted_driverSide: false,
        ride_mode: 'RIDE',
        request_type: 'now',
        delivery_infos: null,
        rider_infos: {
          actualRider: 'me',
          actualRiderPhone_number: 'false',
        },
      },
      origin_destination_infos: {
        pickup_infos: {
          location_name: 'NUST MAIN CAMPUS',
          street_name: 'Mozart Street',
          suburb: 'Windhoek West',
          coordinates: {
            latitude: '-22.57015',
            longitude: '17.0811883',
          },
        },
        eta_to_destination_infos: {
          eta: '3 min away',
          distance: 2486.172,
        },
        destination_infos: [
          {
            passenger_number_id: '1',
            dropoff_type: 'PrivateLocation',
            coordinates: {
              latitude: '17.094469349299942',
              longitude: '-22.58091645',
            },
            location_name: 'Maerua Heights',
            street_name: 'false',
            suburb: 'Luxury Hill',
            state: 'Khomas Region',
            city: 'Windhoek',
          },
          {
            passenger_number_id: '2',
            dropoff_type: 'PrivateLocation',
            coordinates: {
              latitude: '17.094469349299942',
              longitude: '-22.58091645',
            },
            location_name: 'Maerua Heights',
            street_name: 'false',
            suburb: 'Luxury Hill',
            state: 'Khomas Region',
            city: 'Windhoek',
          },
        ],
      },
    }, //To hold the details about the interested request clicked by the driver for more details. - default: false
  },
};

export default STATE;
