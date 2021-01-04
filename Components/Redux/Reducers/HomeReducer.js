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
  switch (action.type) {
    case 'UPDATE_GRANTED_GPRS_VARS':
      //Update the previous state
      newState.gprsGlobals.hasGPRSPermissions =
        action.payload.hasGPRSPermissions;
      newState.gprsGlobals.didAskForGprs = action.payload.didAskForGprs;

      return {...state, ...newState};
    case 'RESET_GENERIC_PHONE_NUMBER_INPUT':
      //Generic phone number input variable
      newState.isPhoneNumberValid = false; //TO know if the phone number is valid or not.

      //..
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
      ///Clear key variables when the modal is closed
      if (action.payload.errorMessage === false) {
        //a. Clear the focused trip details
        //newState.requests_data_main_vars.moreDetailsFocused_request = false; --RESTORE LATER
      }
      //...
      return {...state, ...newState};

    case 'UPDATE_TYPE_RIDESHOWN_YOURRIDES_SCREEN':
      newState.shownRides_types = action.payload;

      //...
      return {...state, ...newState};

    case 'UPDATE_TRACKING_MODE_STATE':
      console.log(action.payload);
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
          action.payload.isRideInProgressue; //Computing route
        newState.main_interfaceState_vars.isApp_inNavigation_mode =
          action.payload.isApp_inNavigation_mode;
        //Reset the tracking mode to false
        newState.main_interfaceState_vars.isApp_inTrackingMode = false;
      } //Switch to normal mode
      else {
        //Reset all the main variables
        //Reset the navigation route data
        newState.main_interfaceState_vars.navigationRouteData = false;
        //..
        newState.main_interfaceState_vars.isRideInProgress = false;
        newState.main_interfaceState_vars.isComputing_route = false;
        newState.main_interfaceState_vars.isApp_inNavigation_mode = false;
        //Reset the tracking mode to false
        newState.main_interfaceState_vars.isApp_inTrackingMode = false;
        //Reset focused data
        newState.requests_data_main_vars.moreDetailsFocused_request = false;
      }
      //...
      return {...state, ...newState};

    case 'UPDATE_REALTIME_NAVIGATION_DATA':
      newState.main_interfaceState_vars.navigationRouteData = action.payload;
      //Update is computing route to falsee
      newState.main_interfaceState_vars.isComputing_route = false; //Done computing route.

      //...
      return {...state, ...newState};
    default:
      return state;
  }
};

export default combineReducers({
  App: HomeReducer,
});
