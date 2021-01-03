import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {UpdateErrorModalLog} from '../Redux/HomeActionsCreators';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {systemWeights} from 'react-native-typography';
import IconAnt from 'react-native-vector-icons/AntDesign';
import IconCommunity from 'react-native-vector-icons/MaterialCommunityIcons';
import IconMaterialIcons from 'react-native-vector-icons/MaterialIcons';
import IconFontAwesome from 'react-native-vector-icons/FontAwesome';
import IconFeather from 'react-native-vector-icons/Feather';

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
    this.props.App.socket.on(
      'declineRequest_driver-response',
      function (response) {
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
      },
    );
  }

  /**
   * @func declineThisRequest
   * Responsible for declining any request from the driver side.
   * @param request_fp
   */
  declineThisRequest(request_fp) {
    //Activate the decline loader
    this.setState({isDeclinignRequest: true});
    //..
    this.props.App.socket.emit('declineRequest_driver', {
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
          elevation: 11,
        }}>
        <View
          style={{
            flexDirection: 'row',
            padding: 10,
            borderBottomWidth: 0.5,
            borderBottomColor: '#d0d0d0',
          }}>
          <Text
            style={{
              fontFamily: 'Allrounder-Grotesk-Medium',
              fontSize: 16.5,
              flex: 1,
            }}>
            {this.props.requestLightData.eta_to_passenger_infos.eta}
          </Text>
          <Text
            style={{
              fontFamily: 'Allrounder-Grotesk-Regular',
              fontSize: 16.5,
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
                ) + 'm'}
          </Text>
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
            <Text style={{fontFamily: 'Allrounder-Grotesk-Book', fontSize: 16}}>
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
                  fontFamily: 'Allrounder-Grotesk-Medium',
                  fontSize: 22,
                  color: 'green',
                },
              ]}>
              {'N$' + this.props.requestLightData.ride_basic_infos.fare_amount}
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
                fontFamily: 'Allrounder-Grotesk-Medium',
                fontSize: 18,
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
                <View style={{width: 35}}>
                  <Text
                    style={{
                      fontFamily: 'Allrounder-Grotesk-Book',
                      fontSize: 13,
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
                        fontFamily: 'Allrounder-Grotesk-Medium',
                        fontSize: 15,
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
                        fontFamily: 'Allrounder-Grotesk-Book',
                        fontSize: 13,
                        marginLeft: 5,
                        flex: 1,
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
                <View style={{width: 35}}>
                  <Text
                    style={{
                      fontFamily: 'Allrounder-Grotesk-Book',
                      fontSize: 13,
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
                        fontFamily: 'Allrounder-Grotesk-Medium',
                        fontSize: 15,
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
                        fontFamily: 'Allrounder-Grotesk-Book',
                        fontSize:
                          this.props.requestLightData.origin_destination_infos
                            .destination_infos.length > 1
                            ? 14
                            : 13,
                        marginLeft: 5,
                        flex: 1,
                        color:
                          this.props.requestLightData.origin_destination_infos
                            .destination_infos.length > 1
                            ? '#096ED4'
                            : '#000',
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
            {this.props.requestLightData.ride_basic_infos.isAccepted ===
            false ? (
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
                    fontFamily: 'Allrounder-Grotesk-Regular',
                    fontSize: 17,
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
            <TouchableOpacity
              onPress={() =>
                this.state.isAcceptingRequest === false &&
                this.state.isDeclinignRequest === false
                  ? this.props.requestLightData.ride_basic_infos.isAccepted ===
                    false
                    ? console.log('proceed to accept')
                    : console.log('proceed to details')
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
                        fontFamily: 'Allrounder-Grotesk-Medium',
                        fontSize: 18,
                        color: '#fff',
                      }}>
                      Accept
                    </Text>
                    <IconFeather
                      name="check"
                      size={17}
                      style={{top: 1, marginLeft: 3, color: '#fff'}}
                    />
                  </>
                ) : (
                  <>
                    <Text
                      style={{
                        fontFamily: 'Allrounder-Grotesk-Medium',
                        fontSize: 18,
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

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(GenericRequestTemplate);
