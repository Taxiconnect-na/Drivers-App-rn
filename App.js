/**
 * Taxiconnect drivers app official
 *
 * @format
 * @flow strict-local
 */
import React from 'react';
import MapboxGL from '@react-native-mapbox-gl/maps';
import 'react-native-gesture-handler';
import {Provider} from 'react-redux';
import {createStore} from 'redux';
import HomeReducer from './Components/Redux/Reducers/HomeReducer';
import {NavigationContainer} from '@react-navigation/native';
import RootScreens from './Navigation/RootScreens';
import config from './Components/Helpers/config';

const store = createStore(HomeReducer);

MapboxGL.setAccessToken(config.get('accessToken'));
MapboxGL.removeCustomHeader('Authorization');

const App: () => React$Node = () => {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <RootScreens />
      </NavigationContainer>
    </Provider>
  );
};

export default App;
