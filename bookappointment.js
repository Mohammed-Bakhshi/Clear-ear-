import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, Button } from 'react-native';
import { TextInput } from 'react-native-paper';
import { Calendar } from 'react-native-calendars';
import { saveData, saveAppointment, loadSavedData } from './Database';
import { ThemeContext } from './ThemeContext';

export default function BookAppointmentScreen({ navigation }) {
  const { isDarkMode } = useContext(ThemeContext);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    phoneNumber: '',
    email: '',
    selectedDate: '',
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
    loadSavedData().then(setSavedData);
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
    setErrors(prevErrors => ({ ...prevErrors, [field]: error }));
    setFormData(prevData => ({ ...prevData, [field]: value }));
  };

  const onDayPress = (day) => {
    setFormData(prevData => ({ ...prevData, selectedDate: day.dateString }));
  };

  const handleSubmit = async () => {
    if (isFormValid) {
      try {
        await saveData(formData);
        const appointmentData = {
          name: formData.name,
          description: formData.description,
          date: formData.selectedDate,
        };
        await saveAppointment(appointmentData);
        navigation.navigate('Calendar', { newAppointment: appointmentData });
      } catch (error) {
        console.error(error);
      }
    }
  };

  const autofillForm = (entryName) => {
    const entry = savedData.find(data => data.name === entryName);
    if (entry) {
      setFormData(entry);
      setShowPicker(false);
    }
  };

  const validateForm = () => {
    const { name, phoneNumber, selectedDate } = formData;
    setIsFormValid(
      name && phoneNumber && selectedDate &&
      !errors.name && !errors.phoneNumber && !errors.email
    );
  };

  return (
    <ScrollView contentContainerStyle={[styles.container, isDarkMode && styles.darkContainer]}>
      <Text style={[styles.title, isDarkMode && styles.darkTitle]}></Text>

      <View style={[styles.row, isDarkMode && styles.darkRow]}>
        <View style={styles.nameContainer}>
          <TextInput
            label="Name"
            value={formData.name}
            onChangeText={(text) => handleInputChange('name', text)}
            style={[styles.input, isDarkMode && styles.darkInput]}
            error={!!errors.name}
            theme={{ colors: { text: isDarkMode ? 'white' : 'black', placeholder: isDarkMode ? 'gray' : 'darkgray' } }}
          />
          <Text style={[styles.errorText, isDarkMode && styles.darkErrorText]}>{errors.name}</Text>
        </View>
        <TouchableOpacity onPress={() => setShowPicker(true)} style={[styles.autofillButton, isDarkMode && styles.darkAutofillButton]}>
          <Text style={styles.autofillButtonText}>Autofill</Text>
        </TouchableOpacity>
      </View>

      <Modal visible={showPicker} transparent={true} animationType="slide">
        <View style={[styles.modalContainer, isDarkMode && styles.darkModalContainer]}>
          <View style={[styles.pickerModal, isDarkMode && styles.darkPickerModal]}>
            <ScrollView>
              {savedData.map((data, index) => (
                <TouchableOpacity
                  key={index}
                  style={[styles.pickerItem, isDarkMode && styles.darkPickerItem]}
                  onPress={() => autofillForm(data.name)}
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
        label="Description"
        value={formData.description}
        onChangeText={(text) => handleInputChange('description', text)}
        style={[styles.input, isDarkMode && styles.darkInput]}
        theme={{ colors: { text: isDarkMode ? 'white' : 'black', placeholder: isDarkMode ? 'gray' : 'darkgray' } }}
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

      <Text style={[styles.dateLabel, isDarkMode && styles.darkDateLabel]}></Text>
      <View style={styles.calendarWrapper}>
        <Calendar
          style={[styles.calendar, isDarkMode && styles.darkCalendar]}
          onDayPress={onDayPress}
          markedDates={{ [formData.selectedDate]: { selected: true, selectedColor: isDarkMode ? '#2980b9' : '#3498db' } }}
          theme={{
            backgroundColor: 'transparent',
            calendarBackground: 'transparent',
            textSectionTitleColor: isDarkMode ? '#AAAAAA' : '#000000',
            dayTextColor: isDarkMode ? '#AAAAAA' : '#000000',
            todayTextColor: isDarkMode ? '#3498db' : '#3498db',
            selectedDayBackgroundColor: isDarkMode ? '#2980b9' : '#3498db',
            selectedDayTextColor: '#ffffff',
            arrowColor: isDarkMode ? '#3498db' : '#3498db',
            monthTextColor: isDarkMode ? '#AAAAAA' : '#000000',
            textDisabledColor: isDarkMode ? '#3D3D3D' : '#d9e1e8',
          }}
        />
      </View>

      {formData.selectedDate ? (
        <Text style={[styles.selectedDateText, isDarkMode && styles.darkSelectedDateText]}>Selected Date: {formData.selectedDate}</Text>
      ) : (
        <Text style={[styles.noDateText, isDarkMode && styles.darkNoDateText]}>No date selected</Text>
      )}

      <TouchableOpacity
        style={[styles.button, { backgroundColor: isFormValid ? (isDarkMode ? '#006a82' : '#3498db') : '#d3d3d3', opacity: isFormValid ? 1 : 0.5 }]}
        onPress={handleSubmit}
        disabled={!isFormValid}
      >
        <Text style={[styles.buttonText, !isFormValid && styles.disabledButtonText]}>Submit</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: 'white',
  },
  darkContainer: {
    backgroundColor: '#000911',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  darkTitle: {
    color: 'white',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  nameContainer: {
    flex: 1,
    marginRight: 10,
  },
  input: {
    marginBottom: 15,
    backgroundColor: 'white',
  },
  darkInput: {
    backgroundColor: 'transparent',
    color: 'white',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
  darkErrorText: {
    color: '#ff5c5c',
  },
  autofillButton: {
    padding: 10,
    backgroundColor: '#3498db',
    borderRadius: 5,
  },
  darkAutofillButton: {
    backgroundColor: '#006a82',
  },
  autofillButtonText: {
    color: 'white',
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  darkModalContainer: {
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
  pickerModal: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
  },
  darkPickerModal: {
    backgroundColor: '#1f1f1f',
  },
  pickerItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  darkPickerItem: {
    borderBottomColor: '#444',
  },
  pickerItemText: {
    fontSize: 18,
  },
  darkPickerItemText: {
    color: 'white',
  },
  dateLabel: {
    marginVertical: 20,
    fontSize: 16,
    fontWeight: 'bold',
  },
  darkDateLabel: {
    color: 'white',
  },
  calendarWrapper: {
    marginBottom: 20,
  },
  calendar: {
    borderWidth: 0,
  },
  darkCalendar: {},
  selectedDateText: {
    fontSize: 16,
    marginVertical: 10,
  },
  darkSelectedDateText: {
    color: 'white',
  },
  noDateText: {
    fontSize: 16,
    color: 'gray',
  },
  darkNoDateText: {
    color: 'gray',
  },
  button: {
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  disabledButtonText: {
    color: 'black',
  },
});

