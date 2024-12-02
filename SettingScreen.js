import React, { useContext } from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';
import { ThemeContext } from './ThemeContext';

const SettingScreen = () => {
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);

  return (
    <View style={[styles.container, isDarkMode && styles.darkContainer]}>
      <View style={styles.settingsContainer}>
        <Text style={[styles.text, isDarkMode && styles.darkText]}>
          Enable Dark Mode
        </Text>
        <Switch
          value={isDarkMode}
          onValueChange={toggleTheme}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20, // Adds padding around the container
    backgroundColor: '#fff',
  },
  darkContainer: {
    backgroundColor: '#000911',
  },
  settingsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    color: '#000',
    marginRight: 10, // Adds space between text and switch
  },
  darkText: {
    color: '#fff',
  },
});

export default SettingScreen;
