import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  BackHandler,
  Platform,
} from 'react-native';
import IconAnt from 'react-native-vector-icons/AntDesign';
import IconEntypo from 'react-native-vector-icons/Entypo';
import {
  ResetGenericPhoneNumberInput,
  UpdateErrorModalLog,
} from '../Redux/HomeActionsCreators';
import GenericLoader from '../Modules/GenericLoader/GenericLoader';
import call from 'react-native-phone-call';
import IconMaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {RFValue} from 'react-native-responsive-fontsize';

class AccountProblemDetected extends React.PureComponent {
  constructor(props) {
    super(props);

    //Handlers
    this.backHander = null;

    this._shouldShow_errorModal = true; //! ERROR MODAL AUTO-LOCKER - PERFORMANCE IMPROVER.

    this.state = {
      loaderState: false,
      creatingAccount: false, //To know whether the Taxiconnect account is being created or not.
    };
  }

  componentWillUnmount() {
    //Reset phone number
    this.props.ResetGenericPhoneNumberInput();

    if (this.backHander !== null) {
      this.backHander.remove();
    }
  }

  componentDidMount() {
    let globalObject = this;
    this.backHander = BackHandler.addEventListener(
      'hardwareBackPress',
      function () {
        if (globalObject.state.creatingAccount === false) {
          globalObject.props.navigation.navigate('PhoneDetailsScreen');
        }
        return true;
      },
    );
  }

  /**
   * @func goBackFUncPhoneInput
   * Responsible for going back the phone number verification and
   * most importantly reset the validity of the phone number and it's value
   *
   */
  goBackFUncPhoneInput() {
    this.props.ResetGenericPhoneNumberInput();
    this.props.navigation.navigate('PhoneDetailsScreen');
  }

  /**
   * @func gobackFromAdditionalDetails
   * Reponsible for going back to entry screen and auto erase the user fp
   */
  gobackFromAdditionalDetails() {
    this.props.App.user_fingerprint = null; //Nullify user fingerprint
    this.props.ResetGenericPhoneNumberInput();
    this.props.navigation.navigate('PhoneDetailsScreen');
  }

  render() {
    return (
      <SafeAreaView style={styles.mainWindow}>
        <GenericLoader active={this.state.loaderState} thickness={4} />
        <View style={styles.presentationWindow}>
          <Text
            style={[
              {
                fontSize: RFValue(23),
                fontFamily:
                  Platform.OS === 'android' ? 'UberMoveBold' : 'Uber Move Bold',
                marginTop: 15,
                marginBottom: 35,
                width: '100%',
                textAlign: 'center',
              },
            ]}>
            Account suspended
          </Text>
          <View
            style={{
              width: '100%',
              alignItems: 'center',
            }}>
            <IconEntypo name="block" color={'#b22222'} size={50} />
          </View>
          <View style={{flex: 1}}>
            <Text
              style={[
                {
                  fontFamily:
                    Platform.OS === 'android'
                      ? 'UberMoveTextRegular'
                      : 'Uber Move Text',
                  color: '#000',
                  fontSize: RFValue(16),
                  marginTop: '10%',
                  textAlign: 'left',
                  width: '100%',
                  lineHeight: 28,
                },
              ]}>
              {alert(JSON.stringify(this.props.App.suspension_infos))}
              {this.props.App.suspension_infos.message !== undefined &&
              this.props.App.suspension_infos.message !== null
                ? this.props.App.suspension_infos.message
                : `Your account has been suspended to a malicious usage detected.`}
            </Text>
            <Text
              style={[
                {
                  fontFamily:
                    Platform.OS === 'android'
                      ? 'UberMoveTextRegular'
                      : 'Uber Move Text',
                  color: '#000',
                  fontSize: RFValue(16),
                  marginTop: 10,
                  textAlign: 'left',
                  width: '100%',
                },
              ]}>
              Contact Us for more information.
            </Text>
          </View>
          {this.state.creatingAccount === false ? (
            <View>
              <View
                style={{
                  width: '100%',
                  alignItems: 'center',
                  height: 100,
                }}>
                <TouchableOpacity
                  onPress={() => call({number: '+264814400089', prompt: true})}
                  style={{
                    borderWidth: 1,
                    borderColor: 'transparent',
                    width: '100%',
                  }}>
                  <View style={[styles.bttnGenericTc]}>
                    <IconMaterialIcons name="phone" color="#fff" size={25} />
                    <Text
                      style={[
                        {
                          fontFamily:
                            Platform.OS === 'android'
                              ? 'UberMoveTextBold'
                              : 'Uber Move Text Bold',
                          fontSize: RFValue(19),
                          color: '#fff',
                          marginLeft: 10,
                        },
                      ]}>
                      Call TaxiConnect
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          ) : null}
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  mainWindow: {
    flex: 1,
    backgroundColor: '#fff',
  },
  presentationWindow: {
    flex: 1,
    padding: 20,
    paddingRight: 30,
  },
  arrowCircledForwardBasic: {
    backgroundColor: '#0e8491',
    width: 60,
    height: 60,
    borderRadius: 10000,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shadowButtonArrowCircledForward: {
    shadowColor: '#d0d0d0',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.6,

    elevation: 6,
  },
  root: {flex: 1, padding: 20},
  title: {textAlign: 'center', fontSize: 30},
  codeFieldRoot: {marginTop: 20},
  cell: {
    flex: 1,
    height: 40,
    lineHeight: 38,
    marginRight: 20,
    fontSize: 25,
    borderBottomWidth: 2,
    borderColor: '#00000030',
    textAlign: 'center',
  },
  focusCell: {
    borderColor: '#000',
  },
  bttnGenericTc: {
    borderColor: '#000',
    padding: 12,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    backgroundColor: '#000',
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowOpacity: 0.25,
    shadowRadius: 5.84,

    elevation: 3,
  },
});

const mapStateToProps = (state) => {
  const {App} = state;
  return {App};
};

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      ResetGenericPhoneNumberInput,
      UpdateErrorModalLog,
    },
    dispatch,
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AccountProblemDetected);
