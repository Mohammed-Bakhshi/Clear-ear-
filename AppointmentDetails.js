import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function AppointmentDetails({ route }) {
  const { appointment } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Name:</Text>
      <Text style={styles.value}>{appointment.name}</Text>
      <Text style={styles.label}>Description:</Text>
      <Text style={styles.value}>{appointment.description}</Text>
      <Text style={styles.label}>Date:</Text>
      <Text style={styles.value}>{appointment.date}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#E3F8EC',
  },
  label: {
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 20,
  },
  value: {
    fontSize: 16,
    marginTop: 5,
  },
});
