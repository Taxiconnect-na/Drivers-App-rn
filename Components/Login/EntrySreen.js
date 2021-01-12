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
} from 'react-native';
import {systemWeights} from 'react-native-typography';
import IconMaterialIcons from 'react-native-vector-icons/MaterialIcons';
import SyncStorage from 'sync-storage';

class EntryScreen extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  async componentDidMount() {
    //Check for the user_fp
    /*await SyncStorage.init();
    let user_fp = SyncStorage.get('@ufp');
    console.log(user_fp);
    if (
      user_fp !== undefined &&
      user_fp !== null &&
      user_fp !== false &&
      user_fp.length > 50
    ) {
      //Valid - move to home
      this.props.App.user_fingerprint = user_fp;
      this.props.navigation.navigate('Home');
    }*/
  }

  render() {
    return (
      <SafeAreaView style={styles.mainWindow}>
        <StatusBar backgroundColor="#000" />
        <TouchableOpacity
          style={{flex: 1}}
          onPressIn={() =>
            this.props.navigation.navigate('PhoneDetailsScreen')
          }>
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
                style={{width: 28, height: 28}}
              />
              <Text
                style={[
                  systemWeights.bold,
                  {
                    marginLeft: 4,
                    fontSize: 24,
                    fontFamily: 'Allrounder-Grotesk-Medium',
                    color: '#fff',
                  },
                ]}>
                Connecting the City!
              </Text>
            </View>
          </View>
          <View
            style={{
              height: 170,
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'row',
              paddingLeft: '8%',
              paddingRight: '8%',
            }}>
            <View style={{flexDirection: 'row', flex: 1}}>
              <IconMaterialIcons
                name="phone"
                size={27}
                style={{marginRight: 5}}
                color="#000"
              />
              <Text
                style={[
                  systemWeights.regular,
                  {fontFamily: 'Allrounder-Grotesk-Book', fontSize: 18.5},
                ]}>
                What's your phone number?
              </Text>
            </View>
            <IconMaterialIcons
              name="arrow-forward-ios"
              size={25}
              color="#0e8491"
            />
          </View>
        </TouchableOpacity>
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
    backgroundColor: '#000',
    alignItems: 'center',
  },
});

const mapStateToProps = (state) => {
  const {App} = state;
  return {App};
};

export default connect(mapStateToProps)(EntryScreen);
