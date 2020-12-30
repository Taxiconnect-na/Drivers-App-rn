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
) => ({
  type: 'UPDATE_GENERAL_ERROR_MODAL',
  payload: {
    activeStatus: activeStatus,
    errorMessage: errorMessage,
    network_typenetwork_type: network_type,
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
