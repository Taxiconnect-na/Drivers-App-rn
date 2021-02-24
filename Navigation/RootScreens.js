import React from 'react';
import {View, Text, StyleSheet, Platform} from 'react-native';
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';
import {createDrawerNavigator, DrawerContent} from '@react-navigation/drawer';
import EntryScreen from '../Components/Login/EntrySreen';
import PhoneDetailsScreen from '../Components/Login/PhoneDetailsScreen';
import OTPVerificationEntry from '../Components/Login/OTPVerificationEntry';
import NewDriverDetected from '../Components/Login/NewDriverDetected';
import AccountProblemDetected from '../Components/Login/AccountProblemDetected';
import WalletEntry from '../Components/Wallet/WalletEntry';
import ShowAllTransactionsEntry from '../Components/Wallet/ShowAllTransactionsEntry';
import EarningsScreenEntry from '../Components/Wallet/EarningsScreenEntry';
import Home from '../Components/Home/Home';
import YourRidesEntry from '../Components/Rides/YourRidesEntry';
import HeaderRideTypesSelector from '../Components/Rides/HeaderRideTypesSelector';
import DetailsRidesGenericScreen from '../Components/Rides/DetailsRidesGenericScreen';
import SupportEntry from '../Components/Support/SupportEntry';
import SettingsEntryScreen from '../Components/Settings/SettingsEntryScreen';
import {MainDrawerContent} from './MainDrawerContent';
import IconAnt from 'react-native-vector-icons/AntDesign';
import Splash from '../Components/Login/Splash';
import {RFValue} from 'react-native-responsive-fontsize';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const styles = StyleSheet.create({
  genericHeader: {
    fontFamily:
      Platform.OS === 'android' ? 'UberMoveTextRegular' : 'Uber Move Text',
    fontSize: RFValue(20),
    right: Platform.OS === 'android' ? 20 : 0,
    color: '#fff',
  },
});

//a. Your rides screens
function YourRidesEntry_drawer() {
  return (
    <Stack.Navigator
      initialRouteName="YourRidesEntry"
      screenOptions={{...TransitionPresets.ScaleFromCenterAndroid}}>
      <Stack.Screen
        name="YourRidesEntry"
        component={YourRidesEntry}
        options={{
          headerShown: true,
          headerBackTitle: 'Back',
          headerStyle: {backgroundColor: '#000'},
          headerTintColor: '#fff',
          headerTitle: (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingRight: Platform.OS === 'android' ? 10 : 0,
              }}>
              <Text style={styles.genericHeader}>Your requests</Text>
            </View>
          ),
          headerRight: () => <HeaderRideTypesSelector />,
        }}
      />
      <Stack.Screen
        name="DetailsRidesGenericScreen"
        component={DetailsRidesGenericScreen}
        options={{
          headerShown: true,
          headerStyle: {backgroundColor: '#000'},
          headerTintColor: '#fff',
          headerBackTitle: 'Back',
          headerTitle: (
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={styles.genericHeader}>Details</Text>
            </View>
          ),
        }}
      />
    </Stack.Navigator>
  );
}

//b. Wallet screens
function Wallet_drawer() {
  return (
    <Stack.Navigator
      initialRouteName="WalletEntry"
      screenOptions={{...TransitionPresets.ScaleFromCenterAndroid}}>
      <Stack.Screen
        name="WalletEntry"
        component={WalletEntry}
        options={{
          headerShown: true,
          headerStyle: {
            backgroundColor: '#fff',
            elevation: 0,
          },
          headerTintColor: '#000',
          headerBackTitle: 'Back',
          headerTitle: (
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text
                style={[
                  styles.genericHeader,
                  {
                    color: '#000',
                    fontFamily:
                      Platform.OS === 'android'
                        ? 'UberMoveTextMedium'
                        : 'Uber Move Text Medium',
                    fontSize: RFValue(21),
                  },
                ]}>
                Connect Wallet
              </Text>
            </View>
          ),
        }}
      />
      <Stack.Screen
        name="ShowAllTransactionsEntry"
        component={ShowAllTransactionsEntry}
        options={{
          headerShown: true,
          headerStyle: {backgroundColor: '#000'},
          headerTintColor: '#fff',
          headerBackTitle: 'Back',
          headerTitle: (
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={styles.genericHeader}>Wallet payout</Text>
            </View>
          ),
        }}
      />
      <Stack.Screen
        name="EarningsScreenEntry"
        component={EarningsScreenEntry}
        options={{
          headerShown: true,
          headerStyle: {backgroundColor: '#000'},
          headerTintColor: '#fff',
          headerBackTitle: 'Back',
          headerTitle: (
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={styles.genericHeader}>Earnings</Text>
            </View>
          ),
        }}
      />
    </Stack.Navigator>
  );
}

//c. Support
function Support_drawer() {
  return (
    <Stack.Navigator
      initialRouteName="SupportEntry"
      screenOptions={{...TransitionPresets.ScaleFromCenterAndroid}}>
      <Stack.Screen
        name="SupportEntry"
        component={SupportEntry}
        options={{
          headerShown: true,
          headerStyle: {backgroundColor: '#000'},
          headerTintColor: '#fff',
          headerBackTitle: 'Back',
          headerTitle: (
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={styles.genericHeader}>Support</Text>
            </View>
          ),
        }}
      />
    </Stack.Navigator>
  );
}

//d. Settings
function SettingsDrawer_navigator() {
  return (
    <Stack.Navigator
      initialRouteName="SettingsEntryScreen"
      screenOptions={{...TransitionPresets.ScaleFromCenterAndroid}}>
      <Stack.Screen
        name="SettingsEntryScreen"
        component={SettingsEntryScreen}
        options={{
          headerShown: true,
          headerStyle: {backgroundColor: '#000'},
          headerTintColor: '#fff',
          headerBackTitle: 'Back',
          headerTitle: (
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={styles.genericHeader}>Settings</Text>
            </View>
          ),
        }}
      />
    </Stack.Navigator>
  );
}

//1. MAIN SCREEN DRAWER NAVIGATOR
function MainDrawer_navigator() {
  return (
    <Drawer.Navigator
      initialRouteName="Home_drawer"
      drawerContent={(props) => <MainDrawerContent {...props} />}>
      <Drawer.Screen name="Home_drawer" component={Home} />
      <Drawer.Screen
        name="YourRidesEntry_drawer"
        component={YourRidesEntry_drawer}
        options={{headerShown: false, headerMode: 'none'}}
      />
      <Drawer.Screen name="Wallet_drawer" component={Wallet_drawer} />
      <Drawer.Screen
        name="SettingsEntryScreen"
        component={SettingsDrawer_navigator}
      />
      <Drawer.Screen name="Support_drawer" component={Support_drawer} />
    </Drawer.Navigator>
  );
}

function RootScreens() {
  {
    /*<Stack.Screen
        name="CreateAccountEntry"
        component={CreateAccountEntry}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="NewAccountAdditionalDetails"
        component={NewAccountAdditionalDetails}
        options={{headerShown: false}}
      />*/
  }
  return (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{...TransitionPresets.ScaleFromCenterAndroid}}>
      <Stack.Screen
        name="Splash"
        component={Splash}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="EntryScreen"
        component={EntryScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="PhoneDetailsScreen"
        component={PhoneDetailsScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="OTPVerificationEntry"
        component={OTPVerificationEntry}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="NewDriverDetected"
        component={NewDriverDetected}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="AccountProblemDetected"
        component={AccountProblemDetected}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Home"
        component={MainDrawer_navigator}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
}

export default RootScreens;
