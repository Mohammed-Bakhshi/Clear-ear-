import AsyncStorage from '@react-native-async-storage/async-storage';

// Save form data
export const saveData = async (formData) => {
  try {
    const currentData = await AsyncStorage.getItem('formData');
    const savedData = currentData ? JSON.parse(currentData) : [];
    
    // Log saved data for debugging
    console.log('Current Saved Data:', savedData);

    const existingIndex = savedData.findIndex(
      data => data.name === formData.name && data.phoneNumber === formData.phoneNumber
    );

    if (existingIndex !== -1) {
      return { exists: true, index: existingIndex };
    } else {
      const newPatientData = {
        ...formData,
        createdAt: new Date().toISOString(), // Store creation date
        updatedAt: new Date().toISOString(), // Store last update date
        visits: [] // Store visits
      };
      const updatedData = savedData.concat(newPatientData);
      await AsyncStorage.setItem('formData', JSON.stringify(updatedData));
      return { exists: false };
    }
  } catch (error) {
    console.error('Error saving data:', error);
    return { error: true };
  }
};

// Overwrite existing entry
export const overwriteData = async (formData, index) => {
  try {
    const currentData = await AsyncStorage.getItem('formData');
    const savedData = currentData ? JSON.parse(currentData) : [];
    
    savedData[index] = {
      ...formData,
      updatedAt: new Date().toISOString(), // Update the last update date
    };
    await AsyncStorage.setItem('formData', JSON.stringify(savedData));
  } catch (error) {
    console.error('Error overwriting data:', error);
  }
};

// Load saved form data
export const loadSavedData = async () => {
  try {
    const data = await AsyncStorage.getItem('formData');
    const parsedData = data !== null ? JSON.parse(data) : [];
    console.log('Loaded Saved Data:', parsedData); // Log loaded data for debugging
    return parsedData;
  } catch (error) {
    console.error('Error loading saved data:', error);
    return [];
  }
};

// Save appointment data
export const saveAppointment = async (appointmentData) => {
  try {
    const currentData = await AsyncStorage.getItem('appointments');
    const updatedData = currentData ? JSON.parse(currentData).concat(appointmentData) : [appointmentData];
    await AsyncStorage.setItem('appointments', JSON.stringify(updatedData));
  } catch (error) {
    console.error('Error saving appointment:', error);
  }
};

// Load appointments
export const loadAppointments = async () => {
  try {
    const data = await AsyncStorage.getItem('appointments');
    return data !== null ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error loading appointments:', error);
    return [];
  }
};

// Delete an appointment
export const deleteAppointment = async (date) => {
  try {
    const data = await AsyncStorage.getItem('appointments');
    const appointments = data !== null ? JSON.parse(data) : [];
    const updatedAppointments = appointments.filter(appointment => appointment.date !== date);
    await AsyncStorage.setItem('appointments', JSON.stringify(updatedAppointments));
  } catch (error) {
    console.error('Error deleting appointment:', error);
  }
};

// Update appointment status
export const updateAppointmentStatus = async (date, status) => {
  try {
    const data = await AsyncStorage.getItem('appointments');
    const appointments = data !== null ? JSON.parse(data) : [];
    const updatedAppointments = appointments.map(appointment =>
      appointment.date === date ? { ...appointment, status } : appointment
    );
    await AsyncStorage.setItem('appointments', JSON.stringify(updatedAppointments));
  } catch (error) {
    console.error('Error updating appointment status:', error);
  }
};

// Delete an entry
export const deleteEntry = async (entryName) => {
  try {
    const data = await AsyncStorage.getItem('formData');
    const savedData = data !== null ? JSON.parse(data) : [];
    const updatedData = savedData.filter(data => data.name !== entryName);
    await AsyncStorage.setItem('formData', JSON.stringify(updatedData));
  } catch (error) {
    console.error('Error deleting entry:', error);
  }
};

// Save dark mode preference
export const saveDarkModePreference = async (isDarkMode) => {
  try {
    await AsyncStorage.setItem('darkMode', JSON.stringify(isDarkMode));
  } catch (error) {
    console.error('Error saving dark mode preference:', error);
  }
};

// Load dark mode preference
export const loadDarkModePreference = async () => {
  try {
    const data = await AsyncStorage.getItem('darkMode');
    return data !== null ? JSON.parse(data) : false; // Default to false (light mode) if not set
  } catch (error) {
    console.error('Error loading dark mode preference:', error);
    return false;
  }
};