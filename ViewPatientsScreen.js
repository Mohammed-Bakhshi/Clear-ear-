import React, { useEffect, useState, useContext } from 'react';
import { Text, SafeAreaView, StyleSheet, View, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { loadSavedData } from './Database';
import { ThemeContext } from './ThemeContext';
import { Ionicons } from '@expo/vector-icons';

export default function ViewPatientsScreen() {
  const { isDarkMode } = useContext(ThemeContext);
  const [savedData, setSavedData] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchData = async () => {
      const data = await loadSavedData();
      setSavedData(data);
    };
    fetchData();
  }, []);

  const handleCall = (phoneNumber) => {
    if (phoneNumber) {
      Linking.openURL(`tel:${phoneNumber}`).catch(err => console.error('Error opening dialer:', err));
    }
  };

  const handleEmail = (emailAddress) => {
    if (emailAddress) {
      Linking.openURL(`mailto:${emailAddress}`).catch(err => console.error('Error opening email client:', err));
    }
  };

  const handleAddPatient = () => {
    navigation.navigate('AddPatient');
  };

  const handlePatientSelect = (patient) => {
    navigation.navigate('PatientInfo', { patient });
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map((word) => word[0])
      .join('')
      .toUpperCase();
  };

  const formatDateUK = (date) => {
    const d = new Date(date);
    if (isNaN(d.getTime())) {
      return 'Invalid Date'; // Handle invalid dates
    }
    const day = d.getDate().toString().padStart(2, '0');
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <SafeAreaView style={[styles.container, isDarkMode && styles.darkContainer]}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        {savedData.length === 0 ? (
          <Text style={[styles.noDataText, isDarkMode && styles.darkNoDataText]}>No patients found.</Text>
        ) : (
          savedData.map((data, index) => (
            <TouchableOpacity key={index} onPress={() => handlePatientSelect(data)} style={[styles.patientCard, isDarkMode && styles.darkPatientCard]}>
              <View style={styles.iconContainer}>
                <View style={[styles.initialCircle, { backgroundColor: '#'+Math.floor(Math.random()*16777215).toString(16) }]}>
                  <Text style={styles.initialText}>{getInitials(data.name)}</Text>
                </View>
                <View style={styles.infoContainer}>
                  <Text style={[styles.patientName, isDarkMode && styles.darkPatientName]}>{data.name}</Text>
                  <Text style={[styles.patientSince, isDarkMode && styles.darkPatientSince]}>
                    Since {formatDateUK(data.createdAt)} {/* Handle date formatting */}
                  </Text>
                </View>
                <View style={styles.actionIcons}>
                  <TouchableOpacity onPress={() => handleCall(data.phoneNumber)} style={styles.iconButton}>
                    <Ionicons name="call-outline" size={28} color={isDarkMode ? '#f0f0f0' : '#000'} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleEmail(data.email)} style={styles.iconButton}>
                    <Ionicons name="mail-outline" size={28} color={isDarkMode ? '#f0f0f0' : '#000'} />
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
      <TouchableOpacity 
        style={[styles.addButton, isDarkMode && styles.darkAddButton]} 
        onPress={handleAddPatient}
      >
        <Ionicons name="add" size={32} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E3F8EC',
    padding: 10,
  },
  darkContainer: {
    backgroundColor: '#000911',
  },
  scrollView: {
    paddingVertical: 20,
  },
  noDataText: {
    textAlign: 'center',
    fontSize: 22,
    color: 'gray',
    marginTop: 20,
  },
  darkNoDataText: {
    color: '#b0b0b0',
  },
  patientCard: {
    padding: 12,
    marginVertical: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 2,
  },
  darkPatientCard: {
    backgroundColor: '#0f3d47',
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  initialCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  initialText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  infoContainer: {
    flex: 1,
  },
  patientName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  darkPatientName: {
    color: '#f0f0f0',
  },
  patientSince: {
    fontSize: 16,
    color: 'gray',
  },
  darkPatientSince: {
    color: '#b0b0b0',
  },
  actionIcons: {
    flexDirection: 'row',
  },
  iconButton: {
    marginLeft: 14,
  },
  addButton: {
    backgroundColor: '#e91e63',
    padding: 12,
    borderRadius: 50,
    position: 'absolute',
    bottom: 30,
    right: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  darkAddButton: {
    backgroundColor: '#ff4081',
  },
});

