/* eslint-disable prettier/prettier */
import {combineReducers} from 'redux';
import {Animated as AnimatedMapbox} from '@react-native-mapbox-gl/maps';
import parsePhoneNumber from 'libphonenumber-js';
import {Animated, Easing} from 'react-native';
import STATE from '../Constants/State';
/**
 * Reducer responsible for all the home actions (trip booking, tracking, etc)
 * Centralized file.
 */

const INIT_STATE = STATE;

const HomeReducer = (state = INIT_STATE, action) => {
  //Predefined variables
  let newState = state;
  let phoneNumberModuleTmp = null; //Multipurpose phone number input variable

  switch (action.type) {
    case 'UPDATE_GRANTED_GPRS_VARS':
      //Update the previous state
      newState.gprsGlobals.hasGPRSPermissions =
        action.payload.hasGPRSPermissions;
      newState.gprsGlobals.didAskForGprs = action.payload.didAskForGprs;

      return {...state, ...newState};

    case 'SHOW_COUNTRY_FILTER_HEADER':
      //receive header state : true (show) or false (hide)
      newState.isFilterCountryShown = action.payload;

      //..
      return {...state, ...newState};

    case 'RENDER_COUNTRY_PHONE_CODE_SEARCHER':
      //receive render state : true (show) or false (hide)
      newState.renderCountryCodeSeacher = action.payload;

      //...
      return {...state, ...newState};

    case 'UPDATE_COUNTRY_CODE_FORMAT_AFTER_SELECT':
      //Update phone placeholder, country code and basic number length
      newState.phoneNumberPlaceholder = action.payload.phoneNumberPlaceholder;
      newState.countryPhoneCode = action.payload.countryPhoneCode;
      newState.dynamicMaxLength = action.payload.dynamicMaxLength;

      //...
      return {...state, ...newState};

    case 'UPDATE_DIAL_DATA_OR_QUERY_TYPED':
      if (action.payload.action === 'updateQueryTyped') {
        //Update query typed
        newState.typedCountrySearchQuery =
          action.payload.typedCountrySearchQuery;
      } else if (action.payload.action === 'updateDialData') {
        //Update dial data filtered
        newState.countriesDialDataState = action.payload.countriesDialDataState;
      } else if (action.payload.action === 'resetAll') {
        //Reset dialdata and query typed
        newState.countriesDialDataState =
          action.payload.countriesDialDataStateInvariant;
        newState.typedCountrySearchQuery = '';
      } else if (action.payload.action === 'updateTypedNumber') {
        newState.errorReceiverPhoneNumberShow = false; //Hide corresponding error text
        newState.phoneNumberEntered = action.payload.phoneNumberEntered;
      }

      //..
      return {...state, ...newState};

    case 'UPDATE_ERROR_MESSAGES_STATE_INPUT_REC_DELIVERY':
      if (action.payload.kidName === 'name') {
        //Name error text
        newState.errorReceiverNameShow = action.payload.state;
      } else if (action.payload.kidName === 'number') {
        //Number error text
        newState.errorReceiverPhoneNumberShow = action.payload.state;
      }

      //...
      return {...state, ...newState};

    case 'RESET_GENERIC_PHONE_NUMBER_INPUT':
      //Generic phone number input variable
      newState.isPhoneNumberValid = false; //TO know if the phone number is valid or not.

      //..
      return {...state, ...newState};

    case 'VALIDATE_GENERIC_PHONE_NUMBER':
      //Check the phone number validity
      console.log(
        newState.countryPhoneCode +
          newState.phoneNumberEntered.replace(/ /g, '').replace(/^0/, ''),
      );
      phoneNumberModuleTmp = parsePhoneNumber(
        newState.countryPhoneCode +
          newState.phoneNumberEntered.replace(/ /g, '').replace(/^0/, ''),
        newState.countryCodeSelected.toUpperCase(),
      );
      if (phoneNumberModuleTmp && phoneNumberModuleTmp.isValid()) {
        if (
          /^0/.test(newState.phoneNumberEntered.replace(/ /g, '')) &&
          newState.phoneNumberEntered.replace(/ /g, '').trim().length === 10
        ) {
          //Most african countries
          //Valid
          newState.errorReceiverPhoneNumberShow = false; //Hide corresponding error text
          console.log('VALID DETAILS');
          newState.isPhoneNumberValid = true; //MARK phone number as valid - try to reset it later
          newState.finalPhoneNumber =
            newState.countryPhoneCode +
            newState.phoneNumberEntered.replace(/ /g, '').replace(/^0/, ''); //Save the final phone number
        } else if (
          /^0/.test(newState.phoneNumberEntered.replace(/ /g, '')) === false &&
          newState.phoneNumberEntered.replace(/ /g, '').trim().length === 9
        ) {
          //Valid
          newState.errorReceiverPhoneNumberShow = false; //Hide corresponding error text
          console.log('VALID DETAILS');
          newState.isPhoneNumberValid = true; //MARK phone number as valid - try to reset it later
          newState.finalPhoneNumber =
            newState.countryPhoneCode +
            newState.phoneNumberEntered.replace(/ /g, '').replace(/^0/, ''); //Save the final phone number
        } //Invalid
        else {
          newState.errorReceiverPhoneNumberShow = true;
          newState.errorReceiverPhoneNumberText = 'The number looks wrong';
        }
      } //Invalid phone
      else {
        newState.errorReceiverPhoneNumberShow = true;
        if (newState.phoneNumberEntered.trim().length === 0) {
          //Empty
          newState.errorReceiverPhoneNumberText = "Shouldn't be empty";
        } //Just wrong
        else {
          newState.errorReceiverPhoneNumberText = 'The number looks wrong';
        }
      }

      //...
      return {...state, ...newState};

    case 'UPDATE_GENERAL_ERROR_MODAL':
      newState.generalErrorModal_vars.showErrorGeneralModal =
        action.payload.activeStatus;
      newState.generalErrorModal_vars.generalErrorModalType =
        action.payload.errorMessage;
      newState.generalErrorModal_vars.network_type = /any/i.test(
        action.payload.network_type,
      )
        ? newState.generalErrorModal_vars.network_type
        : action.payload.network_type; //Only update the network type of not 'any' value provided (dummy value)

      //Update global vars for some processes
      //1. Update the focused trip details data - additional data in action.additionalData
      if (/show_modalMore_tripDetails/i.test(action.payload.errorMessage)) {
        console.log('Updated focused data');
        newState.requests_data_main_vars.moreDetailsFocused_request =
          action.payload.additionalData;
      }

      //...
      return {...state, ...newState};

    case 'UPDATE_TYPE_RIDESHOWN_YOURRIDES_SCREEN':
      newState.shownRides_types = action.payload;

      //Update the requestType
      if (/ride/i.test(action.payload)) {
        //ride
        newState.requestType = 'ride';
      } else if (/delivery/i.test(action.payload)) {
        //delivery
        newState.requestType = 'delivery';
      } //Scheduled
      else {
        newState.requestType = 'scheduled';
      }
      //Reset the previously stored array and focused array, navigation data
      newState.main_interfaceState_vars.navigationRouteData = false;
      newState.requests_data_main_vars.fetchedRequests_data_store = false;
      newState.requests_data_main_vars.moreDetailsFocused_request = false;

      //...
      return {...state, ...newState};

    case 'UPDATE_TRACKING_MODE_STATE':
      newState.main_interfaceState_vars.isApp_inTrackingMode = action.payload;

      //...
      return {...state, ...newState};

    case 'UPDATE_CURRENT_LOCATION_METADATA':
      //Update the current location metadata
      newState.userCurrentLocationMetaData = action.payload;
      //...
      return {...state, ...newState};

    case 'UPDATED_FETCHED_REQUESTS_DATA_SERVER':
      //Auto reset if expected array is false
      newState.requests_data_main_vars.fetchedRequests_data_store =
        action.payload;

      //Update the focused data for more details
      if (
        newState.requests_data_main_vars.moreDetailsFocused_request !== false &&
        action.payload !== false
      ) {
        action.payload.map((request) => {
          if (
            request.request_fp ===
            newState.requests_data_main_vars.moreDetailsFocused_request
              .request_fp
          ) {
            //Found - update
            newState.requests_data_main_vars.moreDetailsFocused_request = request;
          }
        });
      }
      //...
      return {...state, ...newState};

    case 'SWITCH_TO_NAVIGATION_MODEORBACK':
      //Check the wanted navigation state
      if (action.payload.isApp_inNavigation_mode) {
        //Switch to navigation mode
        //Reset the navigation route data
        newState.main_interfaceState_vars.navigationRouteData = false;
        //..
        newState.main_interfaceState_vars.isRideInProgress =
          action.payload.isRideInProgress;
        newState.main_interfaceState_vars.isComputing_route =
          action.payload.isRideInProgress; //Computing route
        newState.main_interfaceState_vars.isApp_inNavigation_mode =
          action.payload.isApp_inNavigation_mode;
        //Reset the tracking mode to false
        newState.main_interfaceState_vars.isApp_inTrackingMode = false;
        //Persist focused data if "Find client was pressed"
        newState.requests_data_main_vars.moreDetailsFocused_request =
          action.payload.requestData;
      } //Switch to normal mode
      else {
        //Reset all the main variables
        //Reset the navigation route data
        newState.main_interfaceState_vars.navigationRouteData = false;
        //..
        newState.main_interfaceState_vars.isRideInProgress = false;
        newState.main_interfaceState_vars.isComputing_route = true;
        newState.main_interfaceState_vars.isApp_inNavigation_mode = false;
        //Reset the tracking mode to false
        newState.main_interfaceState_vars.isApp_inTrackingMode = false;
        //Reset focused data
        newState.requests_data_main_vars.moreDetailsFocused_request = false;
      }
      //...Auto close the error modal
      newState.generalErrorModal_vars.showErrorGeneralModal = false;
      newState.generalErrorModal_vars.generalErrorModalType = false;
      //...
      return {...state, ...newState};

    case 'UPDATE_REALTIME_NAVIGATION_DATA':
      newState.main_interfaceState_vars.navigationRouteData = action.payload;
      //Update is computing route to falsee
      newState.main_interfaceState_vars.isComputing_route = false; //Done computing route.

      //...
      return {...state, ...newState};

    case 'UPDATE_DAILY_AMOUNT_MADESOFAR':
      newState.main_interfaceState_vars.dailyAmount_madeSoFar = action.payload;

      //...
      return {...state, ...newState};

    case 'UPDATE_DDRIVER_OPERATIONAL_STATUS':
      //Check status
      //If online: just update
      //If offline: clear temporary data storages
      if (/online/i.test(action.payload)) {
        //Online
        newState.main_interfaceState_vars.isDriver_online = true;
      } else if (/offline/i.test(action.payload)) {
        //Offline
        //Clear tmp storages
        //Reset all the main variables
        //Reset the navigation route data
        newState.main_interfaceState_vars.navigationRouteData = false;
        //..
        newState.main_interfaceState_vars.isRideInProgress = false;
        newState.main_interfaceState_vars.isComputing_route = true;
        newState.main_interfaceState_vars.isApp_inNavigation_mode = false;
        //Reset the tracking mode to false
        newState.main_interfaceState_vars.isApp_inTrackingMode = false;
        //Reset focused data
        newState.requests_data_main_vars.moreDetailsFocused_request = false;
        newState.requests_data_main_vars.fetchedRequests_data_store = false;

        //Update the status
        newState.main_interfaceState_vars.isDriver_online = false;
      }

      //...
      return {...state, ...newState};
    default:
      return state;
  }
};

export default combineReducers({
  App: HomeReducer,
});
