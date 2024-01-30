import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView, Button, Alert, TouchableHighlight } from 'react-native';
import React, {useState, useEffect} from 'react';
import * as LocalAuthentication from 'expo-local-authentication';

export default function App(){

  const [isBiometricSupported, setIsBiometricSupported] = useState(false);

  useEffect(() => {
    (async() => {
      const complatible = await LocalAuthentication.hasHardwareAsync();
      setIsBiometricSupported(complatible);
    })();
  });

  const fallBackToDefaultAuht = () => {
    console.log('fall Back to password authentication');
  };

  const alertComponent = (title, mess, btnTxt, btnFunc) => {
    return Alert.alert(title, mess, [
      {
        text: btnTxt,
        onPress: btnFunc,
      }
    ]);
  }

  const TwoButtonAlert = () =>
    Alert.alert('Welcome To App','subscribe Now', [
      {
        text: 'Back',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel'
      },
      {
        text: 'OK', onPress: () => console.log('Ok Pressed')
      },
    ]);

  const handleBiometriAuth = async () => {
    const isBiometricAvailable = await LocalAuthentication.hasHardwareAsync();
    if (!isBiometricAvailable)
      return alertComponent(
        'Please Enter your Password',
        'Biometric Auth not supported',
        'OK',
        () => fallBackToDefaultAuht()
      );
    
    let supportedBiometrics;
    if (isBiometricAvailable)
      supportedBiometrics = await LocalAuthentication.supportedAuthenticationTypesAsync();
      
    const savedBiometrics = await LocalAuthentication.isEnrolledAsync();
    if (!savedBiometrics)
      return alertComponent(
        'Please Enter your Password',
        'Biometric',
        'OK',
        () => fallBackToDefaultAuht()
      );
    
    const biometricAuth = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Login With Biometrics',
      cancelLabel: 'cancle',
      disableDeviceFallback: true,
    });

    if (biometricAuth){TwoButtonAlert()};
    console.log({isBiometricAvailable});
    console.log({supportedBiometrics});
    console.log({savedBiometrics});
    console.log({biometricAuth});
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.innerContainer}>
        <Text style={styles.statusText}>
          {isBiometricSupported ? 'Your Device Is Compatible With Biometrics' : 'Face or Fingerprint scanner is available on this device'}
        </Text>
        <TouchableHighlight
          style={styles.buttonContainer}
          underlayColor="darkgray"
          onPress={handleBiometriAuth}
        >
          <Text style={styles.buttonText}>Login With Biometrics</Text>
        </TouchableHighlight>
        <StatusBar style='auto' />
      </View>
    </SafeAreaView>
  );

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusText: {
    marginBottom: 20,
    textAlign: 'center',
  },
  buttonContainer: {
    height: 60,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    width: 270
  },
  buttonText: {
    color: 'white',
  },
});