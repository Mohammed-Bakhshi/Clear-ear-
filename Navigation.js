// Navigation.js
import React, { useState, useEffect, useContext } from 'react';
import { NavigationContainer, useIsFocused } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { TouchableOpacity, Image, StyleSheet, View, Text } from 'react-native';
import { ThemeContext } from './ThemeContext';

import AddPatientScreen from './AddPatientScreen';
import ViewPatientsScreen from './ViewPatientsScreen';
import CalendarScreen from './Calendar';
import AppointmentDetails from './AppointmentDetails';
import BookAppointmentScreen from './bookappointment';
import SettingScreen from './SettingScreen';
import PatientInfo from './PatientInfo';

import settinglogo from './assets/settinglogo.png';
import headerImage from './assets/AddPatient.png';
import calendarImage from './assets/Calendar.png';
import appointmentImage from './assets/Appointment.png';
import viewPatientImage from './assets/ViewPatient.png';

const Stack = createStackNavigator();

const SCREENS = {
  CALENDAR: 'Calendar',
  ADD_PATIENT: 'AddPatient',
  VIEW_PATIENTS: 'ViewPatients',
  APPOINTMENT_DETAILS: 'AppointmentDetails',
  BOOK_APPOINTMENT: 'BookAppointment',
  SETTINGS: 'Settings',
  PATIENT_INFO: 'PatientInfo',
};

const colors = {
  active: '#5FCDD9',
  inactive: {
    dark: 'gray',
    light: '#6D6D6D'
  },
  selected: {
    dark: '#5FCDD9',
    light: '#35c1a1'
  },
  darkBackground: '#172026',
  lightBackground: '#eeeeee',
};

const Footer = ({ navigation, activeScreen, setActiveScreen }) => {
  const isFocused = useIsFocused();
  const { isDarkMode } = useContext(ThemeContext);

  useEffect(() => {
    const currentScreen = navigation.getState().routes[navigation.getState().index].name;
    setActiveScreen(currentScreen);
  }, [isFocused, navigation, setActiveScreen]);

  const handlePress = (screen) => {
    setActiveScreen(screen);
    navigation.navigate(screen);
  };

  const getImageStyle = (screen) => {
    const isActive = screen === activeScreen;
    return [
      styles.footerImage,
      { tintColor: isActive ? colors.selected[isDarkMode ? 'dark' : 'light'] : (isDarkMode ? colors.inactive.dark : colors.inactive.light) },
    ];
  };

  const getTextStyle = (screen) => {
    const isActive = screen === activeScreen;
    return [
      styles.footerLabel,
      { color: isActive ? colors.selected[isDarkMode ? 'dark' : 'light'] : (isDarkMode ? '#FFFFFF' : colors.inactive.light) },
    ];
  };

  return (
    <View style={[styles.footerContainer, isDarkMode && styles.darkFooterContainer]}>
      <View style={styles.footerItem}>
        <TouchableOpacity onPress={() => handlePress(SCREENS.ADD_PATIENT)}>
          <Image source={headerImage} style={getImageStyle(SCREENS.ADD_PATIENT)} />
        </TouchableOpacity>
        <Text style={getTextStyle(SCREENS.ADD_PATIENT)}>
          Add Patient
        </Text>
      </View>
      <View style={styles.footerItem}>
        <TouchableOpacity onPress={() => handlePress(SCREENS.CALENDAR)}>
          <Image source={calendarImage} style={getImageStyle(SCREENS.CALENDAR)} />
        </TouchableOpacity>
        <Text style={getTextStyle(SCREENS.CALENDAR)}>
          Calendar
        </Text>
      </View>
      <View style={styles.footerItem}>
        <TouchableOpacity onPress={() => handlePress(SCREENS.BOOK_APPOINTMENT)}>
          <Image source={appointmentImage} style={getImageStyle(SCREENS.BOOK_APPOINTMENT)} />
        </TouchableOpacity>
        <Text style={getTextStyle(SCREENS.BOOK_APPOINTMENT)}>
          Appointment
        </Text>
      </View>
    </View>
  );
};

const ScreenWithFooter = ({ Component, navigation, activeScreen, setActiveScreen, ...rest }) => {
  const { isDarkMode } = useContext(ThemeContext);

  return (
    <View style={[styles.screenContainer, isDarkMode && styles.darkScreenContainer]}>
      <Component {...rest} navigation={navigation} />
      <Footer navigation={navigation} activeScreen={activeScreen} setActiveScreen={setActiveScreen} />
    </View>
  );
};

const Navigation = () => {
  const { isDarkMode } = useContext(ThemeContext);
  const [activeScreen, setActiveScreen] = useState(null);

  const headerImageStyle = (screen) => [
    styles.headerImage,
    { tintColor: activeScreen === screen ? colors.selected[isDarkMode ? 'dark' : 'light'] : (isDarkMode ? colors.inactive.dark : colors.inactive.light) }
  ];

  const headerLeft = (navigation) => (
    <TouchableOpacity onPress={() => {
      setActiveScreen(SCREENS.VIEW_PATIENTS);
      navigation.navigate(SCREENS.VIEW_PATIENTS);
    }}>
      <Image source={viewPatientImage} style={headerImageStyle(SCREENS.VIEW_PATIENTS)} />
    </TouchableOpacity>
  );

  const headerRight = (navigation) => (
    <TouchableOpacity onPress={() => {
      setActiveScreen(SCREENS.SETTINGS);
      navigation.navigate(SCREENS.SETTINGS);
    }}>
      <Image source={settinglogo} style={headerImageStyle(SCREENS.SETTINGS)} />
    </TouchableOpacity>
  );

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={({ navigation }) => ({
          headerStyle: {
            backgroundColor: isDarkMode ? colors.darkBackground : colors.lightBackground,
          },
          headerTintColor: isDarkMode ? '#FFFFFF' : '#000000',
          headerLeft: () => headerLeft(navigation),
          headerRight: () => headerRight(navigation),
        })}
      >
        <Stack.Screen
          name={SCREENS.CALENDAR}
          component={(props) => (
            <ScreenWithFooter {...props} activeScreen={activeScreen} setActiveScreen={setActiveScreen} Component={CalendarScreen} />
          )}
          options={{
            title: 'Calendar',
          }}
        />
        <Stack.Screen
          name={SCREENS.ADD_PATIENT}
          component={(props) => (
            <ScreenWithFooter {...props} activeScreen={activeScreen} setActiveScreen={setActiveScreen} Component={AddPatientScreen} />
          )}
          options={{
            title: 'Add Patient',
          }}
        />
        <Stack.Screen
          name={SCREENS.VIEW_PATIENTS}
          component={(props) => (
            <ScreenWithFooter {...props} activeScreen={activeScreen} setActiveScreen={setActiveScreen} Component={ViewPatientsScreen} />
          )}
          options={{
            title: 'View Patients',
          }}
        />
        <Stack.Screen
          name={SCREENS.APPOINTMENT_DETAILS}
          component={(props) => (
            <ScreenWithFooter {...props} activeScreen={activeScreen} setActiveScreen={setActiveScreen} Component={AppointmentDetails} />
          )}
          options={{
            title: 'Appointment Details',
          }}
        />
        <Stack.Screen
          name={SCREENS.BOOK_APPOINTMENT}
          component={(props) => (
            <ScreenWithFooter {...props} activeScreen={activeScreen} setActiveScreen={setActiveScreen} Component={BookAppointmentScreen} />
          )}
          options={{
            title: 'Book Appointment',
          }}
        />
        <Stack.Screen
          name={SCREENS.SETTINGS}
          component={(props) => (
            <ScreenWithFooter {...props} activeScreen={activeScreen} setActiveScreen={setActiveScreen} Component={SettingScreen} />
          )}
          options={({ navigation }) => ({
            title: 'Settings',
            headerLeft: () => headerLeft(navigation),
            headerRight: () => headerRight(navigation),
          })}
        />
        <Stack.Screen
          name={SCREENS.PATIENT_INFO}
          component={(props) => (
            <ScreenWithFooter {...props} activeScreen={activeScreen} setActiveScreen={setActiveScreen} Component={PatientInfo} />
          )}
          options={{
            title: 'Patient Information',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
    backgroundColor: colors.lightBackground,
  },
  darkFooterContainer: {
    backgroundColor: colors.darkBackground,
  },
  footerItem: {
    alignItems: 'center',
  },
  footerLabel: {
    marginTop: 5,
    fontSize: 12,
  },
  footerImage: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
  },
  headerImage: {
    width: 25,
    height: 25,
    marginLeft: 10,
  },
  darkScreenContainer: {
    backgroundColor: '#000',
  },
  screenContainer: {
    flex: 1,
  },
});

export default Navigation;


