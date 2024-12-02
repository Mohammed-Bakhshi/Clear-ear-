import React, { useContext } from 'react';
import { Text, SafeAreaView, StyleSheet, View, ScrollView, TouchableOpacity } from 'react-native';
import { ThemeContext } from './ThemeContext';

// Utility function to format date as dd/mm/yyyy
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

export default function PatientInfo({ route, navigation }) {
  const { patient, index } = route.params;
  const { isDarkMode } = useContext(ThemeContext);

  if (!patient) {
    return <Text>Patient data is not available</Text>;
  }

  return (
    <SafeAreaView style={[styles.container, isDarkMode && styles.darkContainer]}>
      {/* Static Tabs */}
      <View style={[styles.tabsContainer, isDarkMode && styles.darkTabsContainer]}>
        <TouchableOpacity style={styles.tab}>
          <Text style={[styles.tabText, styles.activeTabText]}>BASIC INFO</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tab}>
          <Text style={styles.tabText}>OTHER DETAILS</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tab}>
          <Text style={styles.tabText}>VISITS</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tab}>
          <Text style={styles.tabText}>NOTES</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.header}>
          <Text style={[styles.headerText, isDarkMode && styles.darkHeaderText]}>Basic Info</Text>
        </View>
        <View style={[styles.card, isDarkMode && styles.darkCard]}>
          <Text style={[styles.patientName, isDarkMode && styles.darkText]}>
            {patient.name}
          </Text>
          <Text style={[styles.infoText, isDarkMode && styles.darkText]}>
            Gender: {patient.gender}
          </Text>
          <Text style={[styles.infoText, isDarkMode && styles.darkText]}>
            Phone: {patient.phoneNumber}
          </Text>
        </View>
        <View style={styles.header}>
          <Text style={[styles.headerText, isDarkMode && styles.darkHeaderText]}>System</Text>
        </View>
        <View style={[styles.card, isDarkMode && styles.darkCard]}>
          <Text style={[styles.infoText, isDarkMode && styles.darkText]}>
            ID: {patient.id} [{typeof index === 'number' && index >= 0 ? index + 1 : 'Invalid Index'}]
          </Text>
          <Text style={[styles.infoText, isDarkMode && styles.darkText]}>
            Updated: {formatDate(patient.updatedAt)}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F4F4',
  },
  darkContainer: {
    backgroundColor: '#1A1A1A',
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderColor: '#E5E5E5',
  },
  darkTabsContainer: {
    backgroundColor: '#333333',
    borderColor: '#555555',
  },
  tab: {
    flex: 1,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabText: {
    fontSize: 16,
    color: '#000',
  },
  activeTabText: {
    color: '#E91E63', // Red color for the active tab
    fontWeight: 'bold',
  },
  scrollView: {
    padding: 20,
  },
  header: {
    marginVertical: 10,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  darkHeaderText: {
    color: '#FFF',
  },
  card: {
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  darkCard: {
    backgroundColor: '#333333',
  },
  patientName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#000',
  },
  darkText: {
    color: '#FFF',
  },
  infoText: {
    fontSize: 16,
    color: '#555555',
  },
});

