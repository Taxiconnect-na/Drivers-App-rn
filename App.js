/**
 * Taxiconnect drivers app official
 *
 * @format
 * @flow strict-local
 */
import React from 'react';
import 'react-native-gesture-handler';
import {Provider} from 'react-redux';
import {createStore} from 'redux';
import HomeReducer from './Components/Redux/Reducers/HomeReducer';
import Home from './Components/Home/Home';

const store = createStore(HomeReducer);

const App: () => React$Node = () => {
  return (
    <Provider store={store}>
      <Home />
    </Provider>
  );
};

export default App;
