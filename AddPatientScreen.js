import React, { useState, useEffect, useContext } from 'react';
import { Text, SafeAreaView, StyleSheet, ScrollView, Button, View, TouchableOpacity, Modal, Alert } from 'react-native';
import { TextInput, RadioButton } from 'react-native-paper';
import { saveData, loadSavedData, saveAppointment, overwriteData } from './Database';
import { ThemeContext } from './ThemeContext';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function AddPatientScreen({ navigation }) {
  const { isDarkMode } = useContext(ThemeContext);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    dob: '',
    phoneNumber: '',
    email: '',
    gender: 'Man',
  });
  const [savedData, setSavedData] = useState([]);
  const [showPicker, setShowPicker] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [errors, setErrors] = useState({
    name: '',
    phoneNumber: '',
    email: '',
  });

  useEffect(() => {
    loadSavedData().then(data => {
      console.log('Loaded Data in AddPatientScreen:', data); // Log loaded data for debugging
      setSavedData(data);

      // Format and set initial form data
      if (data.length > 0) {
        const initialData = data[0]; // Autofill the first entry for now
        setFormData({
          ...initialData,
          dob: formatDate(initialData.dob),
        });
      }
    });
  }, []);

  useEffect(() => {
    validateForm();
  }, [formData, errors]);

  const handleInputChange = (field, value) => {
    let error = '';
    if (field === 'name' && !/^[a-zA-Z\s]+$/.test(value)) {
      error = 'Name can only contain letters and spaces.';
    } else if (field === 'phoneNumber' && (!/^\d+$/.test(value) || value.length !== 11)) {
      error = 'Phone number must be exactly 11 digits.';
    } else if (field === 'email' && !/.+@.+\..+/.test(value)) {
      error = 'Please enter a valid email address.';
    }
    setErrors({ ...errors, [field]: error });
    setFormData({ ...formData, [field]: value });
  };

  const handleDateInputChange = (value) => {
    // Remove non-numeric characters and limit length
    let formattedValue = value.replace(/[^0-9]/g, '');

    // Split into day, month, year
    let day = formattedValue.slice(0, 2);
    let month = formattedValue.slice(2, 4);
    let year = formattedValue.slice(4, 8);

    // Reformat with slashes
    formattedValue = `${day}${day && month ? '/' : ''}${month}${month && year ? '/' : ''}${year}`;

    if (formattedValue.length <= 10) {
      setFormData({ ...formData, dob: formattedValue });
    }
  };

  const formatDate = (date) => {
    if (!date) return '';
    const [day, month, year] = date.split('/').map(Number);
    if (day && month && year) {
      return `${String(day).padStart(2, '0')}/${String(month).padStart(2, '0')}/${year}`;
    }
    return date;
  };

  const saveFormData = async () => {
    const { exists, index, error } = await saveData(formData);

    if (error) {
      Alert.alert('Error', 'An error occurred while saving the data.');
      return;
    }

    if (exists) {
      Alert.alert(
        'Duplicate Entry',
        'An entry with the same name and phone number already exists. Do you want to overwrite it?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Overwrite',
            onPress: async () => {
              await overwriteData(formData, index);
              setFormData({ name: '', address: '', dob: '', phoneNumber: '', email: '', gender: 'Man' });
              loadSavedData().then(data => {
                console.log('Reloaded Data After Overwrite:', data); // Log data after overwrite
                setSavedData(data);
              });
            },
          },
        ],
        { cancelable: false }
      );
    } else {
      setFormData({ name: '', address: '', dob: '', phoneNumber: '', email: '', gender: 'Man' });
      loadSavedData().then(data => {
        console.log('Reloaded Data After Save:', data); // Log data after save
        setSavedData(data);
      });
    }
  };

  const bookAndSaveFormData = async () => {
    const appointmentData = {
      name: formData.name,
      description: `Appointment for ${formData.name}`,
    };
    await saveAppointment(appointmentData);
    await saveFormData();
    navigation.navigate('Calendar'); // Navigate to Calendar screen
  };

  const autofillForm = (entry) => {
    setFormData({
      ...entry,
      dob: formatDate(entry.dob), // Ensure formatted date is set
    });
    setShowPicker(false);
  };

  const validateForm = () => {
    const { name, address, dob, phoneNumber, email, gender } = formData;
    if (name && address && dob && phoneNumber && email && gender && !errors.name && !errors.phoneNumber && !errors.email) {
      setIsFormValid(true);
    } else {
      setIsFormValid(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, isDarkMode && styles.darkContainer]}>
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        <View style={styles.row}>
          <View style={styles.inputContainer}>
            <TextInput
              label="Name"
              value={formData.name}
              onChangeText={(text) => handleInputChange('name', text)}
              style={[styles.input, isDarkMode && styles.darkInput]}
              theme={{ colors: { text: isDarkMode ? 'white' : 'black', placeholder: isDarkMode ? 'gray' : 'darkgray' } }}
              error={!!errors.name}
            />
            <Text style={[styles.errorText, isDarkMode && styles.darkErrorText]}>{errors.name}</Text>
          </View>
          <TouchableOpacity onPress={() => setShowPicker(true)} style={[styles.autofillButton, isDarkMode && styles.darkAutofillButton]}>
            <Text style={styles.autofillButtonText}>Autofill</Text>
          </TouchableOpacity>
        </View>
        <Modal visible={showPicker} transparent={true} animationType="slide">
          <View style={styles.modalContainer}>
            <View style={[styles.pickerModal, isDarkMode && styles.darkPickerModal]}>
              <ScrollView>
                {savedData.map((data, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[styles.pickerItem, isDarkMode && styles.darkPickerItem]}
                    onPress={() => autofillForm(data)}
                  >
                    <Text style={[styles.pickerItemText, isDarkMode && styles.darkPickerItemText]}>{data.name}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <Button title="Close" onPress={() => setShowPicker(false)} color={isDarkMode ? 'white' : 'black'} />
            </View>
          </View>
        </Modal>
        <TextInput
          label="Address"
          value={formData.address}
          onChangeText={(text) => handleInputChange('address', text)}
          style={[styles.input, isDarkMode && styles.darkInput]}
          theme={{ colors: { text: isDarkMode ? 'white' : 'black', placeholder: isDarkMode ? 'gray' : 'darkgray' } }}
        />
        <TextInput
          label="DOB"
          value={formData.dob}
          onChangeText={handleDateInputChange}
          style={[styles.input, isDarkMode && styles.darkInput]}
          theme={{ colors: { text: isDarkMode ? 'white' : 'black', placeholder: isDarkMode ? 'gray' : 'darkgray' } }}
          keyboardType="numeric"
        />
        <TextInput
          label="Phone Number"
          value={formData.phoneNumber}
          onChangeText={(text) => handleInputChange('phoneNumber', text)}
          style={[styles.input, isDarkMode && styles.darkInput]}
          keyboardType="numeric"
          maxLength={11}
          theme={{ colors: { text: isDarkMode ? 'white' : 'black', placeholder: isDarkMode ? 'gray' : 'darkgray' } }}
        />
        <Text style={[styles.errorText, isDarkMode && styles.darkErrorText]}>{errors.phoneNumber}</Text>
        <TextInput
          label="Email Address"
          value={formData.email}
          onChangeText={(text) => handleInputChange('email', text)}
          style={[styles.input, isDarkMode && styles.darkInput]}
          theme={{ colors: { text: isDarkMode ? 'white' : 'black', placeholder: isDarkMode ? 'gray' : 'darkgray' } }}
          error={!!errors.email}
        />
        <Text style={[styles.errorText, isDarkMode && styles.darkErrorText]}>{errors.email}</Text>
        <View style={styles.genderContainer}>
          <Text style={isDarkMode && styles.darkText}></Text>
          <RadioButton.Group
            onValueChange={(newValue) => handleInputChange('gender', newValue)}
            value={formData.gender}
          >
            <View style={styles.radioButtonContainer}>
              <RadioButton value="Man" color={isDarkMode ? '#0f3d47' : 'black'} />
              <Text style={isDarkMode && styles.darkText}>Man</Text>
            </View>
            <View style={styles.radioButtonContainer}>
              <RadioButton value="Woman" color={isDarkMode ? '#0f3d47' : 'black'} />
              <Text style={isDarkMode && styles.darkText}>Woman</Text>
            </View>
          </RadioButton.Group>
        </View>
        <View style={styles.buttonContainer}>
          <View style={styles.saveButton}>
            <Button
              title="Save"
              onPress={saveFormData}
              disabled={!isFormValid}
              color={isDarkMode ? (isFormValid ? '#0f3d47' : '#333') : undefined}
            />
          </View>
          <View style={styles.saveButton}>
           
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E3F8EC',
    padding: 8,
  },
  darkContainer: {
    backgroundColor: '#000911',
  },
  scrollViewContainer: {
    paddingTop: 6,
  },
  input: {
    margin: 12,
    backgroundColor: 'transparent',
    width: '80%', // Adjust width as needed
  },
  darkInput: {
    color: 'white',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  inputContainer: {
    flex: 1,
  },
  autofillButton: {
    padding: 10,
    backgroundColor: '#3498db',
    borderRadius: 5,
  },
  darkAutofillButton: {
    backgroundColor: '#0f3d47',
  },
  autofillButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  pickerModal: {
    width: '80%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
  darkPickerModal: {
    backgroundColor: '#333',
  },
  pickerItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  darkPickerItem: {
    borderBottomColor: '#555',
  },
  pickerItemText: {
    fontSize: 18,
  },
  darkPickerItemText: {
    color: 'white',
  },
  genderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 12,
  },
  radioButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  buttonContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 16,
  },
  saveButton: {
    width: '60%',
    marginVertical: 8,
  },
  errorText: {
    color: 'red',
    marginHorizontal: 12,
    marginBottom: 8,
  },
  darkErrorText: {
    color: '#ff6f61',
  },
  darkText: {
    color: 'white',
  },
});


