import React, { useState, useEffect, useCallback, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, FlatList } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { loadAppointments, deleteAppointment } from './Database';
import { Swipeable, GestureHandlerRootView, PanGestureHandler, State } from 'react-native-gesture-handler';
import moment from 'moment';
import { ThemeContext } from './ThemeContext';

export default function CalendarScreen({ navigation, route }) {
  const { isDarkMode } = useContext(ThemeContext);
  const [appointments, setAppointments] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(moment().format('YYYY-MM'));

  const fetchAppointments = useCallback(async () => {
    const data = await loadAppointments();
    setAppointments(data);
  }, []);

  useEffect(() => {
    fetchAppointments();
  }, [route.params?.newAppointment, fetchAppointments]);

  useEffect(() => {
    const appointment = appointments.find(app => app.date === selectedDate);
    setSelectedAppointment(appointment);
  }, [selectedDate, appointments]);

  const onDayPress = useCallback((day) => {
    const date = day.dateString;
    setSelectedDate(date);
  }, []);

  const getMarkedDates = (appointments, selectedDate) => {
    const today = moment().format('YYYY-MM-DD');
    const marked = appointments.reduce((acc, appointment) => {
      if (appointment.date < today) {
        acc[appointment.date] = { marked: true, dotColor: '#000000' };
      } else {
        acc[appointment.date] = { marked: true, dotColor: appointment.status === 'done' ? '#2ecc71' : '#e74c3c' };
      }
      return acc;
    }, {});

    if (selectedDate) {
      marked[selectedDate] = {
        ...marked[selectedDate],
        selected: true,
        selectedColor: isDarkMode ? '#2980b9' : '#3498db',
      };
    }

    return marked;
  };

  const handleDelete = async (date) => {
    Alert.alert(
      'Delete Appointment',
      'Are you sure you want to delete this appointment?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: async () => {
            try {
              await deleteAppointment(date);
              fetchAppointments();
              if (selectedDate === date) {
                setSelectedAppointment(null);
                setSelectedDate('');
              }
            } catch (error) {
              console.error('Error deleting appointment:', error);
            }
          },
        },
      ],
    );
  };

  const renderItem = ({ item }) => {
    const isSelected = selectedAppointment && selectedAppointment.date === item.date;

    return (
      <Swipeable
        renderRightActions={(progress, dragX) => (
          <View style={styles.rightAction}>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => handleDelete(item.date)}
            >
              <Text style={styles.deleteButtonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      >
        <TouchableOpacity
          style={[styles.appointmentCard, isDarkMode && styles.darkAppointmentCard]}
          onPress={() => {
            setSelectedAppointment(item);
            navigation.navigate('AppointmentDetails', { appointment: item });
          }}
        >
          <Text style={[styles.cardTitle, isDarkMode && styles.darkCardTitle]}>Appointment Details</Text>
          <Text style={[styles.cardText, isDarkMode && styles.darkCardText]}>Name: {item.name}</Text>
          <Text style={[styles.cardText, isDarkMode && styles.darkCardText]}>Description: {item.description}</Text>
          {isSelected && <Text style={[styles.cardText, isDarkMode && styles.darkCardText]}>Date: {item.date}</Text>}
        </TouchableOpacity>
      </Swipeable>
    );
  };

  const markedDates = getMarkedDates(appointments, selectedDate);

  const handleSwipeMonth = (direction) => {
    const [year, month] = currentMonth.split('-').map(Number);
    if (direction === 'next') {
      setCurrentMonth(moment(`${year}-${month + 1}`, 'YYYY-MM').format('YYYY-MM'));
    } else if (direction === 'prev') {
      setCurrentMonth(moment(`${year}-${month - 1}`, 'YYYY-MM').format('YYYY-MM'));
    }
  };

  const onGestureEvent = (event) => {
    if (event.nativeEvent.state === State.END) {
      const { translationX } = event.nativeEvent;
      if (translationX < -50) {
        handleSwipeMonth('next');
      } else if (translationX > 50) {
        handleSwipeMonth('prev');
      }
    }
  };

  return (
    <GestureHandlerRootView style={[styles.container, isDarkMode && styles.darkContainer]}>
      <PanGestureHandler onGestureEvent={onGestureEvent}>
        <View style={styles.calendarWrapper}>
          <Calendar
            style={[styles.calendar, isDarkMode && styles.darkCalendar]}
            current={currentMonth + '-01'}
            onDayPress={onDayPress}
            markedDates={markedDates}
            theme={{
              backgroundColor: 'transparent',
              calendarBackground: 'transparent',
              todayTextColor: isDarkMode ? '#3498db' : '#3498db',
              selectedDayBackgroundColor: isDarkMode ? '#2980b9' : '#3498db',
              selectedDayTextColor: '#ffffff',
              arrowColor: isDarkMode ? '#3498db' : '#3498db',
              monthTextColor: isDarkMode ? '#AAAAAA' : '#000000',
              textSectionTitleColor: isDarkMode ? '#AAAAAA' : '#000000',
              dayTextColor: isDarkMode ? '#AAAAAA' : '#000000',
              textDisabledColor: isDarkMode ? '#3D3D3D' : '#d9e1e8',
            }}
          />
        </View>
      </PanGestureHandler>

      {selectedDate && (
        <FlatList
          key={selectedDate}
          data={appointments.filter(app => app.date === selectedDate)}
          keyExtractor={(item) => item.date}
          renderItem={renderItem}
          ListEmptyComponent={<Text style={[styles.noAppointmentText, isDarkMode && styles.darkNoAppointmentText]}>No appointments for {selectedDate}</Text>}
          contentContainerStyle={styles.appointmentList}
        />
      )}
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E3F8EC',
    padding: 20,
  },
  darkContainer: {
    backgroundColor: '#000911',
  },
  calendarWrapper: {
    width: '100%',
    marginBottom: 20,
  },
  calendar: {
    borderRadius: 10,
  },
  darkCalendar: {
    borderColor: '#ffffff',
  },
  appointmentCard: {
    width: '100%',
    padding: 15,
    backgroundColor: '#027373',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    marginVertical: 10,
  },
  darkAppointmentCard: {
    backgroundColor: '#394e4e',
    borderColor: '#ffffff',
  },
  cardTitle: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  darkCardTitle: {
    color: '#ffffff',
  },
  cardText: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 5,
  },
  darkCardText: {
    color: '#ffffff',
  },
  noAppointmentText: {
    fontSize: 16,
    color: '#000',
    marginVertical: 10,
  },
  darkNoAppointmentText: {
    color: '#ffffff',
  },
  rightAction: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  deleteButton: {
    backgroundColor: '#e74c3c',
    justifyContent: 'center',
    alignItems: 'center',
    width: 75,
    height: '85%',
    borderRadius: 10,
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  appointmentList: {
    flexGrow: 1,
  },
});

