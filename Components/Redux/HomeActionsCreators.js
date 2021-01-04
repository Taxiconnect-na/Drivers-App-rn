/* eslint-disable prettier/prettier */
/**
 * ACTIONS CREATORS FOR MAINLY HOME GLOBAL STATE
 * This file maps all the actions mainly targeting the home screen, but can also
 * include other screens actions.
 * For actions without a specific payload, defaults the payload to - true.
 */

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
