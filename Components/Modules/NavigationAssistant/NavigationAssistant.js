import * as React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Platform, StyleSheet, View} from 'react-native';
import MapboxNavigation from '@homee/react-native-mapbox-navigation';
import {
  UpdateErrorModalLog,
  UpdateGrantedGRPS,
  UpdateTrackingModeState,
  UpdateCurrentLocationMetadat,
  UpdateFetchedRequests_dataServer,
  SwitchToNavigation_modeOrBack,
  UpdateRealtimeNavigationData,
  UpdateDailyAmount_madeSoFar,
  UpdateDriverOperational_status,
  UpdateRequestsGraphs,
} from '../Redux/HomeActionsCreators';

class NavigationAssistant extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    let pickupCoords =
      this.props.App.requests_data_main_vars.moreDetailsFocused_request
        .origin_destination_infos !== undefined
        ? this.props.App.requests_data_main_vars.moreDetailsFocused_request
            .origin_destination_infos.pickup_infos.coordinates
        : null;
    pickupCoords =
      this.props.App.requests_data_main_vars.moreDetailsFocused_request
        .origin_destination_infos !== undefined
        ? [pickupCoords.longitude, pickupCoords.latitude].map(parseFloat)
        : [this.props.App.longitude, this.props.App.latitude]; //?Pack pickup point

    let destinationCoords =
      this.props.App.requests_data_main_vars.moreDetailsFocused_request
        .origin_destination_infos !== undefined
        ? this.props.App.requests_data_main_vars.moreDetailsFocused_request
            .origin_destination_infos.destination_infos[0].coordinates
        : null;
    //!--------------
    let pickLatitude1 =
      this.props.App.requests_data_main_vars.moreDetailsFocused_request
        .origin_destination_infos !== undefined
        ? parseFloat(destinationCoords.latitude)
        : this.props.App.latitude;
    let pickLongitude1 =
      this.props.App.requests_data_main_vars.moreDetailsFocused_request
        .origin_destination_infos !== undefined
        ? parseFloat(destinationCoords.longitude)
        : this.props.App.longitude;
    //! Coordinates order fix - major bug fix for ocean bug
    if (
      pickLatitude1 !== undefined &&
      pickLatitude1 !== null &&
      pickLatitude1 !== 0 &&
      pickLongitude1 !== undefined &&
      pickLongitude1 !== null &&
      pickLongitude1 !== 0
    ) {
      //? Switch latitude and longitude - check the negative sign
      if (parseFloat(pickLongitude1) < 0) {
        //Negative - switch
        destinationCoords = {
          latitude: destinationCoords.longitude,
          longitude: destinationCoords.latitude,
        };
      }
    }
    //!-----------------
    destinationCoords =
      this.props.App.requests_data_main_vars.moreDetailsFocused_request
        .origin_destination_infos !== undefined
        ? [destinationCoords.longitude, destinationCoords.latitude].map(
            parseFloat,
          )
        : [this.props.App.longitude, this.props.App.latitude]; //? Pack first destination point

    let inRideToDestination =
      this.props.App.requests_data_main_vars.moreDetailsFocused_request
        .ride_basic_infos !== undefined
        ? this.props.App.requests_data_main_vars.moreDetailsFocused_request
            .ride_basic_infos.inRideToDestination
        : null; //in route to pickup or destination?

    return (
      <View style={styles.container}>
        {/(show_modalMore_tripDetails|trip_pickupConfirmation_confirmation)/i.test(
          this.props.App.generalErrorModal_vars.generalErrorModalType,
        ) &&
        this.props.App.generalErrorModal_vars
          .showErrorGeneralModal ? null : this.props.App
            .main_interfaceState_vars.isApp_inNavigation_mode ? (
          <MapboxNavigation
            origin={[this.props.App.longitude, this.props.App.latitude]}
            destination={
              inRideToDestination === false ? pickupCoords : destinationCoords
            }
            shouldSimulateRoute={false}
            showsEndOfRouteFeedback={false}
            onLocationChange={(event) => {
              const {latitude, longitude} = event.nativeEvent;
            }}
            onRouteProgressChange={(event) => {
              const {
                distanceTraveled,
                durationRemaining,
                fractionTraveled,
                distanceRemaining,
              } = event.nativeEvent;
            }}
            onError={(event) => {
              //const {message} = event.nativeEvent;
            }}
            onCancelNavigation={() => {
              // User tapped the "X" cancel button in the nav UI
              // or canceled via the OS system tray on android.
              // Do whatever you need to here.
              this.props.SwitchToNavigation_modeOrBack({
                isApp_inNavigation_mode: false,
              });
            }}
            onArrive={() => {
              // Called when you arrive at the destination.
            }}
          />
        ) : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

const mapStateToProps = (state) => {
  const {App} = state;
  return {App};
};

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      UpdateErrorModalLog,
      UpdateGrantedGRPS,
      UpdateTrackingModeState,
      UpdateCurrentLocationMetadat,
      UpdateFetchedRequests_dataServer,
      SwitchToNavigation_modeOrBack,
      UpdateRealtimeNavigationData,
      UpdateDailyAmount_madeSoFar,
      UpdateDriverOperational_status,
      UpdateRequestsGraphs,
    },
    dispatch,
  );

export default React.memo(
  connect(mapStateToProps, mapDispatchToProps)(NavigationAssistant),
);
