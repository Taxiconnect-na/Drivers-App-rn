/* eslint-disable prettier/prettier */
/**
 * ACTIONS CREATORS FOR MAINLY HOME GLOBAL STATE
 * This file maps all the actions mainly targeting the home screen, but can also
 * include other screens actions.
 * For actions without a specific payload, defaults the payload to - true.
 */

//PHONE NUMBER INPUT MODULE
//26. SHow filter header
//Responsible.for showing the country filter in the phone number input module on user select
//@param state: true (show) or false (hide)
export const ShowCountryFilterHeader = (state) => ({
  type: 'SHOW_COUNTRY_FILTER_HEADER',
  payload: state,
});

//27. Render country phone code searcher
//Responsible for rendering or not the main window of the phone searcher
//@param state: true(render) or false(hide)
export const RenderCountryPhoneCodeSearcher = (state) => ({
  type: 'RENDER_COUNTRY_PHONE_CODE_SEARCHER',
  payload: state,
});

//28. Update country code format after select
//Responsible for updating the country code format after a country is selected (format include code and placeholder)
//@param formatObj: which contains the placeholder of the country's number, the country phone code and the typical length of the phone number
export const UpdateCountryCodeFormatAfterSelect = (formatObj) => ({
  type: 'UPDATE_COUNTRY_CODE_FORMAT_AFTER_SELECT',
  payload: formatObj,
});

//29. Update dialData or query type
//Responsible for updating the dial data while filtering, the query typed, the typed phone number (on change) and also to reset
//@param updateStringObj: contains the actions (updateQueryTyped, updateDialData, updateTypedNumber, resetAll) and corresponding variables (same name as the varaibles)
export const UpdateDialDataORQueryTyped = (updateStringObj) => ({
  type: 'UPDATE_DIAL_DATA_OR_QUERY_TYPED',
  payload: updateStringObj,
});

//31. Update error messages state - input receiver's details
//Responsible for updating the state of the error messages during the input of the receiver's details - delivery
//@param stateObj: contains the message to update (name or number) and the state (state, true-show or false-hide)
export const UpdateErrorMessagesStateInputRecDelivery = (stateObj) => ({
  type: 'UPDATE_ERROR_MESSAGES_STATE_INPUT_REC_DELIVERY',
  payload: stateObj,
});

/**
 * 1. Reset generic phone number variables
 * Responsible for resetting the phone number variables to the default ones
 */
export const ResetGenericPhoneNumberInput = () => ({
  type: 'RESET_GENERIC_PHONE_NUMBER_INPUT',
  payload: false,
});

/**
 * 2. Update the error modal log
 * Responsible for updating the state of the error log and the correspoding error message
 */
export const UpdateErrorModalLog = (
  activeStatus,
  errorMessage,
  network_type,
  additionalData = false,
) => ({
  type: 'UPDATE_GENERAL_ERROR_MODAL',
  payload: {
    activeStatus: activeStatus,
    errorMessage: errorMessage,
    network_typenetwork_type: network_type,
    additionalData: additionalData,
  },
});

/**
 * 3. UPdate the type of ride shown in the "Your rides" screen
 * Responsible for updating the state variable of the type of ride shown in the "Your rides" screen
 * @param type: Past, Scheduled or Business (coming soon)
 */
export const UpdateType_rideShown_YourRides_screen = (type) => ({
  type: 'UPDATE_TYPE_RIDESHOWN_YOURRIDES_SCREEN',
  payload: type,
});

/**
 * 4. Update GPRS GLOBALS for granted permissions
 * @params gprsVars a litteral object have the permission state or not and if did ask for gprs once
 */
export const UpdateGrantedGRPS = (gprsVars) => ({
  type: 'UPDATE_GRANTED_GPRS_VARS',
  payload: gprsVars,
});

/**
 * 5. Update navigation to tracking more or back
 * Responsible for changing the mapview to tracking more or back.
 * @param state: true (tracking mode enabled) or false (tracking mode disabled).
 */
export const UpdateTrackingModeState = (state) => ({
  type: 'UPDATE_TRACKING_MODE_STATE',
  payload: state,
});

/**
 * 6. Update current location metadata
 * Responsible for updating the current location metadata of the user
 * @param currentLocationMtd: metadata of the current user location.
 */
export const UpdateCurrentLocationMetadat = (currentLocationMtd) => ({
  type: 'UPDATE_CURRENT_LOCATION_METADATA',
  payload: currentLocationMtd,
});

/**
 * 7. Update the fetched requests data store from the server's data
 * Responsible for updating the requests fetched from the server to the global requests data store.
 * @param requestsArray: requests array straight from the server.
 */
export const UpdateFetchedRequests_dataServer = (requestsArray) => ({
  type: 'UPDATED_FETCHED_REQUESTS_DATA_SERVER',
  payload: requestsArray,
});

/**
 * 8. Switch from normal view to map view
 * Responsible for switching view from normal view to navigation mode.
 * Can also start an interval perister if in tracking mode for a trip in progress.
 * @param bundleInfos: contains infos about the navigation window state, isRideInProgress and can take some additional data.
 */
export const SwitchToNavigation_modeOrBack = (bundleInfos) => ({
  type: 'SWITCH_TO_NAVIGATION_MODEORBACK',
  payload: bundleInfos,
});

/**
 * 9. Update realtime navigation data
 * Responsible for updating the realtime navigation during an active ride from the server data.
 * @param navigationData: the route and rest of the navigation data straight from the server.
 */
export const UpdateRealtimeNavigationData = (navigationData) => ({
  type: 'UPDATE_REALTIME_NAVIGATION_DATA',
  payload: navigationData,
});

/**
 * 10. Update daily amount made so far
 * Responsible for updating the daily amount made in the global variables.
 * @param amountBundle: contains all the information about the daily amount made.
 */
export const UpdateDailyAmount_madeSoFar = (amountBundle) => ({
  type: 'UPDATE_DAILY_AMOUNT_MADESOFAR',
  payload: amountBundle,
});

/**
 * 11. Update driver's operational status
 * Responsible for updating from the server the driver's operational status : online/offline.
 * @param status: online or offline.
 */
export const UpdateDriverOperational_status = (status) => ({
  type: 'UPDATE_DDRIVER_OPERATIONAL_STATUS',
  payload: status,
});

//12. Validate generic phone number
//Responsible for validiting globally any phone number inputed in the phone number input module
export const ValidateGenericPhoneNumber = () => ({
  type: 'VALIDATE_GENERIC_PHONE_NUMBER',
  payload: false,
});

//38. UPdate the type of ride shown in the "Your rides" screen
//Responsible for updating the state variable of the type of ride shown in the "Your rides" screen
//@param type: Past, Scheduled or Business (coming soon)
export const UpdateType_rideShown_YourRides_screenTab = (type) => ({
  type: 'UPDATE_TYPE_RIDESHOWN_YOURRIDES_SCREENTAB',
  payload: type,
});

//39. UPdate the ride history after fetch from the server for the "Your rides" tab
//Responsible for getting the relevant rides as selected by the user (past, scheduled, business)
//@param ridesHistory: the data fetched
export const UpdateRides_history_YourRides_tab = (ridesHistory) => ({
  type: 'UPDATERIDES_HISTORY_YOURRIDES_TAB',
  payload: ridesHistory,
});

//40. Update the targeted request when selected on the "Your rides" tab
//Responsible for updating the global variables for the targeted history ride
//@param request_fp
export const UpdateTargetedRequest_yourRides_history = (request_fp) => ({
  type: 'UPDATE_TARGETED_REQUEST_YOURRIDES_HISTORY',
  payload: request_fp,
});

/**
 * 44. Update the total wallet amount for the rider
 * Responsible for upddating the state vars for the total amount in the wallet.
 * @param totalWalletAmount: the current total wallet amount.
 */
export const UpdateTotalWalletAmount = (totalWalletAmount) => ({
  type: 'UPDATE_TOTAL_WALLET_AMOUNT',
  payload: totalWalletAmount,
});
