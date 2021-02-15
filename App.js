/**
 * Taxiconnect drivers app official
 *
 * @format
 * @flow strict-local
 */
import React from 'react';
import MapboxGL from '@react-native-mapbox-gl/maps';
import 'react-native-gesture-handler';
import {Platform} from 'react-native';
import {Provider} from 'react-redux';
import {createStore} from 'redux';
import HomeReducer from './Components/Redux/Reducers/HomeReducer';
import {NavigationContainer} from '@react-navigation/native';
import StorageManager from './Components/Helpers/StorageManager';
import RootScreens from './Navigation/RootScreens';
import config from './Components/Helpers/config';
import OneSignal from 'react-native-onesignal';
import SyncStorage from 'sync-storage';

//Initiate the storage
StorageManager('init');

MapboxGL.setAccessToken(config.get('accessToken'));
MapboxGL.removeCustomHeader('Authorization');

const store = createStore(HomeReducer);

class App extends React.PureComponent {
  constructor(props) {
    super(props);

    OneSignal.setAppId('a7e445ea-0852-4bdc-afd0-345c9cd30095');
    OneSignal.setRequiresUserPrivacyConsent(false);
    if (Platform.OS === 'ios') {
      OneSignal.promptForPushNotificationsWithUserResponse((response) => {});
    }
  }

  async componentDidMount() {
    await SyncStorage.init();

    OneSignal.setNotificationWillShowInForegroundHandler(
      (notifReceivedEvent) => {},
    );
    OneSignal.setNotificationOpenedHandler((notification) => {});
    OneSignal.addSubscriptionObserver((event) => {});
    OneSignal.addPermissionObserver((event) => {});
    const deviceState = await OneSignal.getDeviceState();
    //Save the push notif object
    try {
      if (deviceState.userId !== undefined && deviceState.userId !== null) {
        SyncStorage.set('@pushnotif_token_global_obj', deviceState);
      }
    } catch (error) {
      console.log(error);
    }
  }

  render() {
    return (
      <>
        <Provider store={store}>
          <NavigationContainer>
            <RootScreens />
          </NavigationContainer>
        </Provider>
      </>
    );
  }
}

export default App;
