import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {
  SafeAreaView,
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  StyleSheet,
  Image,
  Platform,
} from 'react-native';
import IconMaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {
  ValidateGenericPhoneNumber,
  UpdateErrorModalLog,
} from '../Redux/HomeActionsCreators';
import SyncStorage from 'sync-storage';
import {RFValue} from 'react-native-responsive-fontsize';

class PhoneDetailsScreen extends React.PureComponent {
  constructor(props) {
    super(props);

    this._shouldShow_errorModal = true; //! ERROR MODAL AUTO-LOCKER - PERFORMANCE IMPROVER.

    this.state = {
      networkStateChecker: false,
    };
  }

  async componentDidMount() {
    //Add home going back handler-----------------------------
    this.props.navigation.addListener('beforeRemove', (e) => {
      // Prevent default behavior of leaving the screen
      e.preventDefault();
      return;
    });
    //--------------------------------------------------------
    //Check for the user_fp
    //Get persisted data and update the general state
    //user_fp, pushnotif_token, userCurrentLocationMetaData, latitude, longitude
    await SyncStorage.init();
    let user_fp = SyncStorage.get('@user_fp');
    let pushnotif_token = SyncStorage.get('@pushnotif_token');
    let userCurrentLocationMetaData = SyncStorage.get(
      '@userCurrentLocationMetaData',
    );
    let userLocationPoint = SyncStorage.get('@userLocationPoint');
    let gender_user = SyncStorage.get('@gender_user');
    let username = SyncStorage.get('@username');
    let surname = SyncStorage.get('@surname_user');
    let user_email = SyncStorage.get('@user_email');
    let phone = SyncStorage.get('@phone_user');
    let user_profile_pic = SyncStorage.get('@user_profile_pic');

    //Update globals
    this.props.App.gender_user =
      gender_user !== undefined && gender_user !== null
        ? gender_user
        : 'unknown';
    this.props.App.username =
      username !== undefined && username !== null ? username : 'User';
    this.props.App.surname_user =
      surname !== undefined && surname !== null ? surname : '';
    this.props.App.user_email =
      user_email !== undefined && user_email !== null ? user_email : '';
    this.props.App.phone_user =
      phone !== undefined && phone !== null ? phone : '';
    this.props.App.user_profile_pic =
      user_profile_pic !== undefined && user_profile_pic !== null
        ? user_profile_pic
        : null;
    this.props.App.user_fingerprint = user_fp;
    this.props.App.pushnotif_token = pushnotif_token;

    try {
      userCurrentLocationMetaData = JSON.parse(userCurrentLocationMetaData);
      this.props.App.userCurrentLocationMetaData = userCurrentLocationMetaData;
    } catch (error) {
      this.props.App.userCurrentLocationMetaData = {};
    }
    //..
    try {
      userLocationPoint = JSON.parse(userLocationPoint);
      this.props.App.latitude = userLocationPoint.latitude;
      this.props.App.longitude = userLocationPoint.longitude;
    } catch (error) {
      this.props.App.latitude = 0;
      this.props.App.longitude = 0;
    }
    //...
    if (
      this.props.App.user_fingerprint !== undefined &&
      this.props.App.user_fingerprint !== null &&
      this.props.App.user_fingerprint !== false &&
      this.props.App.user_fingerprint.length > 40
    ) {
      this.props.navigation.navigate('Home');
    }
  }

  render() {
    return (
      <View style={styles.mainWindow}>
        <StatusBar backgroundColor="#000" barStyle={'light-content'} />
        <TouchableOpacity
          style={{flex: 1}}
          onPressIn={() =>
            this.props.navigation.navigate('PhoneDetailsScreen')
          }>
          <SafeAreaView style={{flex: 1, backgroundColor: '#000'}}>
            <View style={styles.presentationWindow}>
              <View
                style={{
                  backgroundColor: '#fff',
                  width: 60,
                  height: 60,
                  borderRadius: 100,
                  marginTop: '5%',
                }}>
                <Image
                  source={require('../../Media_assets/Images/logo.png')}
                  style={{
                    resizeMode: 'contain',
                    width: '100%',
                    height: '100%',
                    borderRadius: 300,
                  }}
                />
              </View>
              <View style={{flex: 1, width: '100%'}}>
                <Image
                  source={require('../../Media_assets/Images/driver_entry_image.png')}
                  style={{
                    resizeMode: 'contain',
                    width: '120%',
                    height: '120%',
                    right: '2%',
                    bottom: '5%',
                  }}
                />
              </View>
              <View style={{height: 70, flexDirection: 'row'}}>
                <Image
                  source={require('../../Media_assets/Images/Namibia_rect.png')}
                  style={{width: 28, height: 28, top: 1}}
                />
                <Text
                  style={[
                    {
                      marginLeft: 4,
                      fontSize: RFValue(24),
                      fontFamily:
                        Platform.OS === 'android'
                          ? 'MoveBold'
                          : 'Uber Move Bold',
                      color: '#fff',
                    },
                  ]}>
                  Connecting the City!
                </Text>
              </View>
            </View>
          </SafeAreaView>
          <View
            style={{
              height: 170,
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'row',
              paddingLeft: '8%',
              paddingRight: '8%',
            }}>
            <View style={{flexDirection: 'row', flex: 1, alignItems: 'center'}}>
              <IconMaterialIcons
                name="phone"
                size={23}
                style={{marginRight: 5}}
                color="#000"
              />
              <Text
                style={[
                  {
                    fontFamily:
                      Platform.OS === 'android'
                        ? 'UberMoveTextRegular'
                        : 'Uber Move Text',
                    fontSize: RFValue(19),
                    flex: 1,
                  },
                ]}>
                What's your phone number?
              </Text>
            </View>
            <IconMaterialIcons
              name="arrow-forward-ios"
              size={17}
              color="#0e8491"
            />
          </View>
        </TouchableOpacity>
      </View>
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
    backgroundColor: '#000',
    alignItems: 'center',
  },
});

const mapStateToProps = (state) => {
  const {App} = state;
  return {App};
};

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      ValidateGenericPhoneNumber,
      UpdateErrorModalLog,
    },
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchToProps)(PhoneDetailsScreen);
