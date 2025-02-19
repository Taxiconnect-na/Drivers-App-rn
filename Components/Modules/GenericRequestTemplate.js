import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {UpdateErrorModalLog} from '../Redux/HomeActionsCreators';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  InteractionManager,
  Platform,
} from 'react-native';
import IconAnt from 'react-native-vector-icons/AntDesign';
import IconFeather from 'react-native-vector-icons/Feather';
import IconIonic from 'react-native-vector-icons/Ionicons';
import {RFValue} from 'react-native-responsive-fontsize';

class GenericRequestTemplate extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      isAcceptingRequest: false, //To know whether the request is accepting for loader -default: false
      isDeclinignRequest: false, //TO know whether the request is declining for loader -default: false
    };
  }

  componentDidMount() {
    let globalObject = this;
    /**
     * SOCKET.IO RESPONSES
     */
    //1. Handler for declining a request
    this.props.App.socket.on(
      'declineRequest_driver-response',
      function (response) {
        setTimeout(function () {
          globalObject.state.isDeclinignRequest = false;
          globalObject.state.isAcceptingRequest = false;
          if (
            response.response !== undefined &&
            /unable/i.test(response.response)
          ) {
            globalObject.props.UpdateErrorModalLog(
              true,
              'error_declining',
              'any',
            );
          }
        }, globalObject.props.App._TMP_TIMEOUT_AFTER_REQUEST_RESPONSE);
      },
    );

    //2. Handler for accepting a request
    this.props.App.socket.on('accept_request_io-response', function (response) {
      setTimeout(function () {
        globalObject.setState({
          isDeclinignRequest: false,
          isAcceptingRequest: false,
        });
        if (
          response.response !== undefined &&
          /unable/i.test(response.response)
        ) {
          globalObject.props.UpdateErrorModalLog(
            true,
            'error_accepting_request',
            'any',
          );
        }
      }, globalObject.props.App._TMP_TIMEOUT_AFTER_REQUEST_RESPONSE);
    });
  }

  /**
   * @func declineThisRequest
   * Responsible for declining any request from the driver side.
   * @param request_fp
   */
  declineThisRequest(request_fp) {
    //Activate the decline loader
    this.setState({isDeclinignRequest: true, isAcceptingRequest: false});
    //..
    this.props.App.socket.emit('declineRequest_driver', {
      request_fp: request_fp,
      driver_fingerprint: this.props.App.user_fingerprint,
    });
  }

  /**
   * @func acceptThisRequest
   * Responsible for accepting any request from the driver side.
   * @param request_fp
   */
  acceptThisRequest(request_fp) {
    //Activate the accept loader
    this.setState({isAcceptingRequest: true, isDeclinignRequest: false});
    //..
    this.props.App.socket.emit('accept_request_io', {
      request_fp: request_fp,
      driver_fingerprint: this.props.App.user_fingerprint,
    });
  }

  render() {
    let wished_pickup_time = this.props.requestLightData.ride_basic_infos
      .wished_pickup_time;
    //this.props.requestLightData.ride_basic_infos.ride_mode
    return (
      <View
        style={{
          borderRadius: 3,
          backgroundColor: '#fff',
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 5,
          },
          shadowOpacity: 0.36,
          shadowRadius: 6.68,
          elevation: 3,
          marginBottom: 15,
        }}>
        {/scheduled/i.test(
          this.props.requestLightData.ride_basic_infos.request_type,
        ) ? (
          <View
            style={{
              borderWidth: 1,
              padding: 10,
              backgroundColor: '#b22222',
              borderColor: '#b22222',
              borderTopRightRadius: 3,
              borderTopLeftRadius: 3,
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <IconIonic
              name="timer-outline"
              size={20}
              style={{color: '#fff', marginRight: 5}}
            />
            <Text
              style={{
                color: '#fff',
                fontFamily:
                  Platform.OS === 'android'
                    ? 'MoveTextMedium'
                    : 'Uber Move Text Medium',
                fontSize: RFValue(17),
              }}>
              {`${
                this.props.requestLightData.ride_basic_infos
                  .date_state_wishedPickup_time
              } at ${new Date(
                new Date(wished_pickup_time).getTime() - 2 * 3600 * 1000,
              ).getHours()}:${
                String(
                  new Date(
                    new Date(wished_pickup_time).getTime() - 2 * 3600 * 1000,
                  ).getMinutes(),
                ).length > 1
                  ? new Date(
                      new Date(wished_pickup_time).getTime() - 2 * 3600 * 1000,
                    ).getMinutes()
                  : '0' +
                    String(
                      new Date(
                        new Date(wished_pickup_time).getTime() -
                          2 * 3600 * 1000,
                      ).getMinutes(),
                    )
              }`}
            </Text>
          </View>
        ) : null}

        <View
          style={{
            flexDirection: 'row',
            padding: 10,
            borderBottomWidth: 0.5,
            borderBottomColor: '#d0d0d0',
          }}>
          {/**ETA - show only when not in ride */}
          {this.props.requestLightData.ride_basic_infos.inRideToDestination ? (
            <Text
              style={{
                fontFamily:
                  Platform.OS === 'android' ? 'MoveMedium' : 'Uber Move Medium',
                fontSize: RFValue(16),
                flex: 1,
              }}>
              Picked up
            </Text>
          ) : (
            <Text
              style={{
                fontFamily:
                  Platform.OS === 'android' ? 'MoveRegular' : 'Uber Move',
                fontSize: RFValue(16),
                flex: 1,
              }}>
              {parseInt(
                this.props.requestLightData.eta_to_passenger_infos.eta.split(
                  ' ',
                )[0],
              ) <= 35 &&
              parseInt(
                this.props.requestLightData.eta_to_passenger_infos.eta.split(
                  ' ',
                )[0],
              ) > 10 &&
              /sec/i.test(
                this.props.requestLightData.eta_to_passenger_infos.eta.split(
                  ' ',
                )[1],
              )
                ? 'Very close'
                : parseInt(
                    this.props.requestLightData.eta_to_passenger_infos.eta.split(
                      ' ',
                    )[0],
                  ) <= 10 &&
                  /sec/i.test(
                    this.props.requestLightData.eta_to_passenger_infos.eta.split(
                      ' ',
                    )[1],
                  )
                ? 'Arrived'
                : `• Sent ${new Date(
                    this.props.requestLightData.ride_basic_infos.wished_pickup_time,
                  ).getUTCHours()}:${new Date(
                    this.props.requestLightData.ride_basic_infos.wished_pickup_time,
                  ).getUTCMinutes()}`}
            </Text>
          )}

          {/**Distance - show only when not in ride */}
          {/*this.props.requestLightData.ride_basic_infos
            .inRideToDestination ? null : (
            <Text
              style={{
                fontFamily:
                  Platform.OS === 'android'
                    ? 'UberMoveTextRegular'
                    : 'Uber Move Text',
                fontSize: RFValue(18),
              }}>
              {Math.round(
                this.props.requestLightData.eta_to_passenger_infos.distance,
              ) > 1000
                ? Math.round(
                    this.props.requestLightData.eta_to_passenger_infos.distance,
                  ) /
                    1000 +
                  'km'
                : Math.round(
                    this.props.requestLightData.eta_to_passenger_infos.distance,
                  ) + 'meters'}
            </Text>
          )*/}
        </View>

        <View
          style={{
            flexDirection: 'row',
            padding: 10,
            paddingTop: 20,
            paddingBottom: 20,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          {/ride/i.test(
            this.props.requestLightData.ride_basic_infos.ride_mode,
          ) ? (
            <View style={{flex: 1, alignItems: 'center'}}>
              <Text
                style={{
                  fontFamily:
                    Platform.OS === 'android'
                      ? 'UberMoveTextMedium'
                      : 'Uber Move Text Medium',
                  fontSize: RFValue(17),
                }}>
                {/connectus/i.test(
                  this.props.requestLightData.ride_basic_infos.connect_type,
                )
                  ? 'ConnectUs'
                  : 'ConnectMe'}
              </Text>
            </View>
          ) : null}
          {/**Add package type for deliveries only */}
          {/delivery/i.test(
            this.props.requestLightData.ride_basic_infos.ride_mode,
          ) ? (
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
              }}>
              <View style={{flexDirection: 'row'}}>
                <IconFeather name="package" color={'#000'} size={24} />
                <View style={{marginLeft: 5}}>
                  <Text
                    style={{
                      fontFamily:
                        Platform.OS === 'android'
                          ? 'UberMoveTextMedium'
                          : 'Uber Move Text Medium',
                      fontSize: RFValue(17),
                    }}>
                    {/envelope/i.test(
                      this.props.requestLightData.ride_basic_infos
                        .receiver_infos.packageSize,
                    )
                      ? 'Small'
                      : /small/i.test(
                          this.props.requestLightData.ride_basic_infos
                            .receiver_infos.packageSize,
                        )
                      ? 'Medium'
                      : 'Large'}
                  </Text>
                  <Text
                    style={{
                      fontFamily:
                        Platform.OS === 'android'
                          ? 'UberMoveTextLight'
                          : 'Uber Move Text Light',
                      fontSize: RFValue(14),
                    }}>
                    Package type
                  </Text>
                </View>
              </View>
            </View>
          ) : null}
          <View
            style={{
              padding: 5,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text
              style={[
                {
                  fontFamily:
                    Platform.OS === 'android' ? 'MoveBold' : 'Uber Move Bold',
                  fontSize: RFValue(26),
                  color: '#09864A',
                },
              ]}>
              {'N$ ' + this.props.requestLightData.ride_basic_infos.fare_amount}
            </Text>
            <Text
              style={{
                fontFamily:
                  Platform.OS === 'android'
                    ? 'MoveTextRegular'
                    : 'Uber Move Text',
                fontSize: RFValue(14),
                color: '#09864A',
              }}>
              {this.props.requestLightData.ride_basic_infos.payment_method}
            </Text>
          </View>
          {/ride/i.test(
            this.props.requestLightData.ride_basic_infos.ride_mode,
          ) ? (
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <IconAnt name="user" size={15} />
              <Text
                style={{
                  fontFamily:
                    Platform.OS === 'android'
                      ? 'UberMoveTextMedium'
                      : 'Uber Move Text Medium',
                  fontSize: RFValue(19),
                  marginLeft: 3,
                  bottom: 1,
                }}>
                {this.props.requestLightData.ride_basic_infos.passengers_number}
              </Text>
            </View>
          ) : null}
        </View>

        <View>
          <View
            style={{
              padding: 20,
              borderTopWidth: 0.7,
              borderTopColor: '#d0d0d0',
              borderBottomWidth: 0.7,
              borderBottomColor: '#d0d0d0',
              flexDirection: 'row',
            }}>
            <View style={{width: 16, height: '87%', top: 6}}>
              <View style={{position: 'absolute', top: 0}}>
                <View
                  style={{
                    height: 11,
                    width: 11,
                    borderRadius: 100,
                    backgroundColor: '#000',
                  }}
                />
              </View>

              <View
                style={{
                  flex: 1,
                  left: 5,
                  width: 1.5,
                  height: 50,
                  backgroundColor: '#000',
                }}></View>
              <View style={{position: 'absolute', bottom: 0}}>
                <View
                  style={{
                    height: 11,
                    width: 11,
                    borderRadius: 0,
                    backgroundColor: '#096ED4',
                  }}
                />
              </View>
            </View>
            <View style={{flex: 1}}>
              <View
                style={{
                  flexDirection: 'row',
                }}>
                <View style={{width: 45}}>
                  <Text
                    style={{
                      fontFamily:
                        Platform.OS === 'android'
                          ? 'UberMoveTextLight'
                          : 'Uber Move Text Light',
                      fontSize: RFValue(14),
                      top: 2,
                    }}>
                    From
                  </Text>
                </View>
                <View
                  style={{
                    flex: 1,
                    alignItems: 'flex-start',
                  }}>
                  <View
                    style={{
                      flex: 1,
                      alignItems: 'flex-start',
                    }}>
                    <Text
                      style={{
                        fontFamily:
                          Platform.OS === 'android'
                            ? 'UberMoveTextMedium'
                            : 'Uber Move Text Medium',
                        fontSize: RFValue(18),
                        marginLeft: 5,
                        flex: 1,
                      }}>
                      {this.props.requestLightData.origin_destination_infos
                        .pickup_infos.suburb !== false &&
                      this.props.requestLightData.origin_destination_infos
                        .pickup_infos.suburb !== 'false' &&
                      this.props.requestLightData.origin_destination_infos
                        .pickup_infos.suburb !== undefined &&
                      this.props.requestLightData.origin_destination_infos
                        .pickup_infos.suburb !== null
                        ? this.props.requestLightData.origin_destination_infos
                            .pickup_infos.suburb
                        : this.props.requestLightData.origin_destination_infos
                            .pickup_infos.location_name !== false &&
                          this.props.requestLightData.origin_destination_infos
                            .pickup_infos.location_name !== 'false' &&
                          this.props.requestLightData.origin_destination_infos
                            .pickup_infos.location_name !== undefined &&
                          this.props.requestLightData.origin_destination_infos
                            .pickup_infos.location_name !== null
                        ? this.props.requestLightData.origin_destination_infos
                            .pickup_infos.location_name
                        : this.props.requestLightData.origin_destination_infos
                            .pickup_infos.street_name}
                    </Text>
                    <Text
                      style={{
                        fontFamily:
                          Platform.OS === 'android'
                            ? 'UberMoveTextRegular'
                            : 'Uber Move Text',
                        fontSize: RFValue(15),
                        marginLeft: 5,
                        flex: 1,
                        color: '#333333',
                      }}>
                      {this.props.requestLightData.origin_destination_infos
                        .pickup_infos.location_name !== false &&
                      this.props.requestLightData.origin_destination_infos
                        .pickup_infos.location_name !== 'false' &&
                      this.props.requestLightData.origin_destination_infos
                        .pickup_infos.location_name !== null &&
                      this.props.requestLightData.origin_destination_infos
                        .pickup_infos.location_name !== undefined
                        ? this.props.requestLightData.origin_destination_infos
                            .pickup_infos.location_name
                        : null}
                      {this.props.requestLightData.origin_destination_infos
                        .pickup_infos.street_name !== false &&
                      this.props.requestLightData.origin_destination_infos
                        .pickup_infos.street_name !== 'false' &&
                      this.props.requestLightData.origin_destination_infos
                        .pickup_infos.street_name !== undefined &&
                      this.props.requestLightData.origin_destination_infos
                        .pickup_infos.street_name !== null
                        ? `, ${this.props.requestLightData.origin_destination_infos.pickup_infos.street_name}`
                        : null}
                    </Text>
                  </View>
                </View>
              </View>
              {/**Destination */}
              <View
                style={{
                  flexDirection: 'row',
                  marginTop: 25,
                }}>
                <View style={{width: 45}}>
                  <Text
                    style={{
                      fontFamily:
                        Platform.OS === 'android'
                          ? 'UberMoveTextLight'
                          : 'Uber Move Text Light',
                      fontSize: RFValue(14),
                      top: 1,
                    }}>
                    To
                  </Text>
                </View>
                <View
                  style={{
                    flex: 1,
                    alignItems: 'flex-start',
                  }}>
                  <View
                    style={{
                      flex: 1,
                      alignItems: 'flex-start',
                    }}>
                    {this.props.requestLightData.origin_destination_infos.destination_infos.map(
                      (destination, index) => {
                        return (
                          <>
                            <Text
                              key={`${index}`}
                              style={{
                                fontFamily:
                                  Platform.OS === 'android'
                                    ? 'UberMoveTextMedium'
                                    : 'Uber Move Text Medium',
                                fontSize: RFValue(17),
                                marginLeft: 5,
                                flex: 1,
                              }}>
                              <Text
                                key={`${index + 1}`}
                                style={{
                                  fontFamily:
                                    Platform.OS === 'android'
                                      ? 'UberMoveTextRegular'
                                      : 'Uber Move Text',
                                }}>
                                {`${index + 1}. `}
                              </Text>
                              {destination.suburb !== false &&
                              destination.suburb !== 'false' &&
                              destination.suburb !== undefined &&
                              destination.suburb !== null
                                ? destination.suburb
                                : destination.location_name !== false &&
                                  destination.location_name !== 'false' &&
                                  destination.location_name !== undefined &&
                                  destination.location_name !== null
                                ? destination.location_name
                                : destination.street_name}
                            </Text>
                            <Text
                              key={`${index + 2}`}
                              style={{
                                fontFamily:
                                  Platform.OS === 'android'
                                    ? 'UberMoveTextRegular'
                                    : 'Uber Move Text',
                                fontSize: RFValue(15),
                                marginLeft: 5,
                                flex: 1,
                                color: '#333333',
                              }}>
                              {destination.location_name !== false &&
                              destination.location_name !== 'false' &&
                              destination.location_name !== null &&
                              destination.location_name !== undefined
                                ? destination.location_name
                                : null}
                              {destination.street_name !== false &&
                              destination.street_name !== 'false' &&
                              destination.street_name !== undefined &&
                              destination.street_name !== null
                                ? `, ${destination.street_name}`
                                : null}
                            </Text>
                          </>
                        );
                      },
                    )}
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>

        <View
          style={{
            padding: 10,
            marginTop: 5,
            marginBottom: 10,
            flexDirection: 'row',
          }}>
          <View style={{flex: 1, justifyContent: 'flex-end'}}>
            {this.state.isAcceptingRequest ? null : this.props.requestLightData
                .ride_basic_infos.isAccepted === false ? (
              <TouchableOpacity
                onPress={() =>
                  this.state.isAcceptingRequest === false &&
                  this.state.isDeclinignRequest === false
                    ? this.declineThisRequest(
                        this.props.requestLightData.request_fp,
                      )
                    : {}
                }
                style={{paddingLeft: 10, width: '70%'}}>
                <Text
                  style={{
                    fontFamily:
                      Platform.OS === 'android'
                        ? 'UberMoveTextRegular'
                        : 'Uber Move Text',
                    fontSize: RFValue(18),
                    color: '#b22222',
                  }}>
                  {this.state.isDeclinignRequest === false ? (
                    'Decline'
                  ) : (
                    <ActivityIndicator size="small" color="#b22222" />
                  )}
                </Text>
              </TouchableOpacity>
            ) : null}
          </View>
          <View style={{flex: 1}}>
            {this.state.isDeclinignRequest ? null : (
              <TouchableOpacity
                onPress={() =>
                  this.state.isAcceptingRequest === false &&
                  this.state.isDeclinignRequest === false
                    ? this.props.requestLightData.ride_basic_infos
                        .isAccepted === false
                      ? this.acceptThisRequest(
                          this.props.requestLightData.request_fp,
                        )
                      : Platform.OS === 'ios'
                      ? InteractionManager.runAfterInteractions(() => {
                          this.props.UpdateErrorModalLog(
                            true,
                            'show_modalMore_tripDetails',
                            'any',
                            this.props.requestLightData,
                          );
                        })
                      : this.props.UpdateErrorModalLog(
                          true,
                          'show_modalMore_tripDetails',
                          'any',
                          this.props.requestLightData,
                        )
                    : {}
                }
                style={{
                  flexDirection: 'row',
                  backgroundColor: '#096ED4',
                  padding: 18,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 4,
                  shadowColor: '#000',
                  shadowOffset: {
                    width: 0,
                    height: 2,
                  },
                  shadowOpacity: 0.25,
                  shadowRadius: 3.84,

                  elevation: 5,
                  height: 65,
                }}>
                {this.state.isAcceptingRequest === false ? (
                  this.props.requestLightData.ride_basic_infos.isAccepted ===
                  false ? (
                    <>
                      <Text
                        style={{
                          fontFamily:
                            Platform.OS === 'android'
                              ? 'MoveBold'
                              : 'Uber Move Bold',
                          fontSize: 23,
                          color: '#fff',
                        }}>
                        Accept
                      </Text>
                    </>
                  ) : (
                    <>
                      <Text
                        style={{
                          fontFamily:
                            Platform.OS === 'android'
                              ? 'UberMoveTextMedium'
                              : 'Uber Move Text Medium',
                          fontSize: 20,
                          color: '#fff',
                        }}>
                        View details
                      </Text>
                    </>
                  )
                ) : (
                  <ActivityIndicator size="large" color="#fff" />
                )}
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  const {App} = state;
  return {App};
};

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      UpdateErrorModalLog,
    },
    dispatch,
  );

export default React.memo(
  connect(mapStateToProps, mapDispatchToProps)(GenericRequestTemplate),
);
