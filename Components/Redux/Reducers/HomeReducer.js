/* eslint-disable prettier/prettier */
import {combineReducers} from 'redux';
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
  let checkTempoData = null; //Used as tempo variable for various kind of testing

  switch (action.type) {
    case 'UPDATE_GRANTED_GPRS_VARS':
      //? Optmized
      //Update the previous state
      if (
        `${JSON.stringify(newState.gprsGlobals.hasGPRSPermissions)}` !==
          `${JSON.stringify(action.payload.hasGPRSPermissions)}` ||
        `${JSON.stringify(newState.gprsGlobals.didAskForGprs)}` !==
          `${JSON.stringify(action.payload.didAskForGprs)}`
      ) {
        //New data
        newState.gprsGlobals.hasGPRSPermissions =
          action.payload.hasGPRSPermissions;
        newState.gprsGlobals.didAskForGprs = action.payload.didAskForGprs;

        return {...state, ...newState};
      } //Same data
      else {
        return state;
      }

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
      newState.countriesDialDataState = null; //Data for all the considered countries - default: complete set, can be filtereed but not altered! - to be initialized in the constructor of the module
      newState.renderCountryCodeSeacher = false; //Whether to show or not the list of country code to select one
      newState.phoneNumberEntered = ''; //Phone number entered by the user
      newState.isFilterCountryShown = false; //Whether or not to show the country search filter on user action - default: false
      newState.typedCountrySearchQuery = ''; //Query typed to search a specific country
      newState.finalPhoneNumber = false; //Store the final generated phone number
      //Generic phone number input variable
      newState.isPhoneNumberValid = false; //TO know if the phone number is valid or not.

      //..
      return {...state, ...newState};

    case 'VALIDATE_GENERIC_PHONE_NUMBER':
      //Check the phone number validity
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

    case 'UPDATE_TYPE_RIDESHOWN_YOURRIDES_SCREEN_HISTORY':
      newState.shownRides_types_tab = action.payload;

      return {...state, ...newState};

    case 'UPDATE_TRACKING_MODE_STATE':
      newState.main_interfaceState_vars.isApp_inTrackingMode = action.payload;

      //...
      return {...state, ...newState};

    case 'UPDATE_CURRENT_LOCATION_METADATA':
      //Update the current location metadata
      if (
        `${JSON.stringify(newState.userCurrentLocationMetaData)}` !==
        `${JSON.stringify(action.payload)}`
      ) {
        //New data
        newState.userCurrentLocationMetaData = action.payload;
        //...
        return {...state, ...newState};
      } //Same data
      else {
        return state;
      }

    case 'UPDATED_FETCHED_REQUESTS_DATA_SERVER':
      //? Optimized
      checkTempoData = false; //No focused data by default
      //Auto reset if expected array is false
      if (
        `${JSON.stringify(
          newState.requests_data_main_vars.fetchedRequests_data_store,
        )}` !== `${JSON.stringify(action.payload)}`
      ) {
        //New data
        newState.requests_data_main_vars.fetchedRequests_data_store =
          action.payload;

        //Update the focused data for more details
        if (
          newState.requests_data_main_vars.moreDetailsFocused_request !==
            false &&
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
              //? Update the focused data controller
              checkTempoData = true;
            }
          });
        }
        //! Change focus data content to default: false (if no focused data is found, very useful on rider's cancellation before trip completion)
        if (checkTempoData === false) {
          newState.requests_data_main_vars.moreDetailsFocused_request = false;
        }
        //...
        return {...state, ...newState};
      } //SAME data
      else {
        return state;
      }

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
      //? Optimized
      if (
        `${JSON.stringify(
          newState.main_interfaceState_vars.navigationRouteData,
        )}` !== `${JSON.stringify(action.payload)}`
      ) {
        //New data
        newState.main_interfaceState_vars.navigationRouteData = action.payload;
        //Update is computing route to falsee
        newState.main_interfaceState_vars.isComputing_route = false; //Done computing route.

        //...
        return {...state, ...newState};
      } //Same dataa
      else {
        return state;
      }

    case 'UPDATE_DAILY_AMOUNT_MADESOFAR':
      //? Optimized
      //! Change default select shown ride type to Delivery if in 'Rides'
      if (
        /Delivery/i.test(action.payload.supported_requests_types) &&
        /Rides/i.test(newState.shownRides_types)
      ) {
        //Wrong type detected - change to Delivery as default selected
        newState.shownRides_types = action.payload.supported_requests_types;
        newState.requestType = action.payload.supported_requests_types;
      }
      //...
      if (
        `${JSON.stringify(
          newState.main_interfaceState_vars.dailyAmount_madeSoFar,
        )}` !== `${JSON.stringify(action.payload)}`
      ) {
        //New data
        newState.main_interfaceState_vars.dailyAmount_madeSoFar =
          action.payload;

        //...
        return {...state, ...newState};
      } //Same data
      else {
        return state;
      }

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

    case 'UPDATE_TYPE_RIDESHOWN_YOURRIDES_SCREENTAB':
      newState.shownRides_types_tab = action.payload;

      //...
      return {...state, ...newState};

    case 'UPDATERIDES_HISTORY_YOURRIDES_TAB':
      newState.rides_history_details_data.rides_history_data = action.payload;

      //...
      return {...state, ...newState};

    case 'UPDATE_TARGETED_REQUEST_YOURRIDES_HISTORY':
      newState.rides_history_details_data.targetedRequestSelected.request_fp =
        action.payload;

      //...
      return {...state, ...newState};

    case 'UPDATE_TOTAL_WALLET_AMOUNT':
      //Update the total wallet amount only when necessary
      let tmpSizeLocal =
        newState.wallet_state_vars.transactions_details !== undefined &&
        newState.wallet_state_vars.transactions_details !== null
          ? newState.wallet_state_vars.transactions_details.length
          : 0;
      let tmpSizeUpdate =
        action.payload.transactions_data !== undefined &&
        action.payload.transactions_data !== null
          ? action.payload.transactions_data.length
          : 0;

      if (
        newState.wallet_state_vars.totalWallet_amount !==
          action.payload.total ||
        tmpSizeLocal !== tmpSizeUpdate
      ) {
        //New values
        newState.wallet_state_vars.totalWallet_amount = action.payload.total;
        newState.wallet_state_vars.transactions_details =
          action.payload.transactions_data !== undefined &&
          action.payload.transactions_data !== null
            ? action.payload.transactions_data
            : [];
        //Sort
        if (
          newState.wallet_state_vars.transactions_details !== undefined &&
          newState.wallet_state_vars.transactions_details !== null
        ) {
          newState.wallet_state_vars.transactions_details = newState.wallet_state_vars.transactions_details.sort(
            (a, b) =>
              a.timestamp > b.timestamp
                ? -1
                : b.timestamp > a.timestamp
                ? 1
                : 0,
          );
        }
        return {...state, ...newState};
      } //Same values
      else {
        return state;
      }

    case 'UPDATE_DEEPWALLET_INSIGHTS':
      newState.wallet_state_vars.deepWalletInsights = action.payload;

      //...
      return {...state, ...newState};

    case 'UPDATE_FOCUSED_WEEK_DEEPWALLET_INSIGHTS':
      if (
        newState.wallet_state_vars.deepWalletInsights !== null &&
        newState.wallet_state_vars.deepWalletInsights !== undefined &&
        newState.wallet_state_vars.deepWalletInsights.weeks_view !== null &&
        newState.wallet_state_vars.deepWalletInsights.weeks_view !== undefined
      ) {
        //The payload should be the index number of the array element in the weeks_view
        newState.wallet_state_vars.focusedWeekWalletInsights =
          newState.wallet_state_vars.deepWalletInsights.weeks_view[
            action.payload
          ];
        //? Save the week index
        newState.wallet_state_vars.focusedWeek_arrayIndex = action.payload;
        //Generate the graph array
        newState.wallet_state_vars.focusedWeek_graphData = [
          newState.wallet_state_vars.focusedWeekWalletInsights.daily_earning
            .monday.earning,
          newState.wallet_state_vars.focusedWeekWalletInsights.daily_earning
            .tuesday.earning,
          newState.wallet_state_vars.focusedWeekWalletInsights.daily_earning
            .wednesday.earning,
          newState.wallet_state_vars.focusedWeekWalletInsights.daily_earning
            .thursday.earning,
          newState.wallet_state_vars.focusedWeekWalletInsights.daily_earning
            .friday.earning,
          newState.wallet_state_vars.focusedWeekWalletInsights.daily_earning
            .saturday.earning,
          newState.wallet_state_vars.focusedWeekWalletInsights.daily_earning
            .sunday.earning,
        ];

        //...
        return {...state, ...newState};
      } //No change
      else {
        return state;
      }

    case 'UPDATE_REQUESTS_GRAPHS':
      //Only update the requests graph ddata if different
      if (action.payload !== null && action.payload.rides !== undefined) {
        if (
          newState._Requests_graphInfos === null ||
          newState._Requests_graphInfos.rides !== action.payload.rides ||
          newState._Requests_graphInfos.deliveries !==
            action.payload.deliveries ||
          newState._Requests_graphInfos.scheduled !== action.payload.scheduled
        ) {
          //New data received - updated
          newState._Requests_graphInfos = action.payload;
          return {...state, ...newState};
        } //No new data received
        else {
          return state;
        }
      } //null payload received
      else {
        if (newState._Requests_graphInfos !== action.payload) {
          //Set to null and update state
          newState._Requests_graphInfos = action.payload;
          return {...state, ...newState};
        } //Same value
        else {
          return state;
        }
      }

    case 'UPDATE_SUSPENSION_INFOS':
      //Only update the data only if actually new
      if (
        action.payload !== undefined &&
        action.payload !== false &&
        `${action.payload}` !== `${newState.suspension_infos}`
      ) {
        //New data
        newState.suspension_infos = action.payload;
        return {...state, ...newState};
      } //Same data - leave
      else {
        return state;
      }

    case 'UPDATE_NAVIGATION_SYSTEM':
      //Update only update when new
      if (
        action.payload !== undefined &&
        action.payload !== null &&
        `${action.payload}` !== `${newState.default_navigation_system}`
      ) {
        //New data
        newState.default_navigation_system = action.payload;
        return {...state, ...newState};
      } //Same data - leave
      else {
        return state;
      }

    default:
      return state;
  }
};

export default combineReducers({
  App: HomeReducer,
});
