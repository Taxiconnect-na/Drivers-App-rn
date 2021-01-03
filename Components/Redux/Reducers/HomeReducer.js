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
      //DEBUG - auto fill for more details
      newState.requests_data_main_vars.moreDetailsFocused_request =
        action.payload[0]; //Just one request
      //...
      return {...state, ...newState};
    default:
      return state;
  }
};

export default combineReducers({
  App: HomeReducer,
});
