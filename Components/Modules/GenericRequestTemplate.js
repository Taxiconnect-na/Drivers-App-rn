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
} from 'react-native';
import IconAnt from 'react-native-vector-icons/AntDesign';
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
                fontSize: RFValue(18),
                flex: 1,
              }}>
              Picked up
            </Text>
          ) : (
            <Text
              style={{
                fontFamily:
                  Platform.OS === 'android' ? 'MoveMedium' : 'Uber Move Medium',
                fontSize: RFValue(18),
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
                : this.props.requestLightData.eta_to_passenger_infos.eta}
            </Text>
          )}
          {/**Distance - show only when not in ride */}
          {this.props.requestLightData.ride_basic_infos
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
          )}
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
          <View style={{padding: 5}}>
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
          </View>
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
                      {
                        this.props.requestLightData.origin_destination_infos
                          .pickup_infos.suburb
                      }
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
                        .pickup_infos.location_name +
                        ', ' +
                        this.props.requestLightData.origin_destination_infos
                          .pickup_infos.street_name}
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
                    <Text
                      style={{
                        fontFamily:
                          Platform.OS === 'android'
                            ? 'UberMoveTextMedium'
                            : 'Uber Move Text Medium',
                        fontSize: 18,
                        marginLeft: 5,
                        flex: 1,
                      }}>
                      {
                        this.props.requestLightData.origin_destination_infos
                          .destination_infos[0].suburb
                      }
                    </Text>
                    <Text
                      style={{
                        fontFamily:
                          Platform.OS === 'android'
                            ? 'UberMoveTextRegular'
                            : 'Uber Move Text',
                        fontSize:
                          this.props.requestLightData.origin_destination_infos
                            .destination_infos.length > 1
                            ? 15
                            : 15,
                        marginLeft: 5,
                        flex: 1,
                        color:
                          this.props.requestLightData.origin_destination_infos
                            .destination_infos.length > 1
                            ? '#096ED4'
                            : '#333333',
                      }}>
                      {this.props.requestLightData.origin_destination_infos
                        .destination_infos.length > 1
                        ? '+' +
                          (this.props.requestLightData.origin_destination_infos
                            .destination_infos.length -
                            1) +
                          ' more destinations'
                        : this.props.requestLightData.origin_destination_infos
                            .destination_infos[0].location_name +
                          ', ' +
                          this.props.requestLightData.origin_destination_infos
                            .destination_infos[0].street_name}
                    </Text>
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
                      : InteractionManager.runAfterInteractions(() => {
                          this.props.UpdateErrorModalLog(
                            true,
                            'show_modalMore_tripDetails',
                            'any',
                            this.props.requestLightData,
                          );
                        })
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
