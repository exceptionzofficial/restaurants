import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  TextInput,
  Alert,
  Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const RESTAURANTS = [
  { id: '1', name: 'Italian Bistro', type: 'Italian' },
  { id: '2', name: 'Spice Garden', type: 'Indian' },
  { id: '3', name: 'Sushi Palace', type: 'Japanese' },
  { id: '4', name: 'Burger House', type: 'American' },
  { id: '5', name: 'Thai Express', type: 'Thai' },
];

const TIME_SLOTS = [
  '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM',
  '01:00 PM', '01:30 PM', '02:00 PM', '02:30 PM',
  '06:00 PM', '06:30 PM', '07:00 PM', '07:30 PM',
  '08:00 PM', '08:30 PM', '09:00 PM', '09:30 PM',
];

const PARTY_SIZES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const RESERVATIONS_KEY = '@table_reservations';

const TableReservationScreen = ({ navigation, route }) => {
  const preSelectedRestaurant = route?.params?.restaurant;
  
  const [step, setStep] = useState(1);
  const [selectedRestaurant, setSelectedRestaurant] = useState(preSelectedRestaurant || null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(null);
  const [partySize, setPartySize] = useState(2);
  const [specialRequest, setSpecialRequest] = useState('');
  const [showRestaurantModal, setShowRestaurantModal] = useState(false);
  const [showTimeModal, setShowTimeModal] = useState(false);
  const [showPartySizeModal, setShowPartySizeModal] = useState(false);

  // Generate next 14 days for date selection
  const generateDates = () => {
    const dates = [];
    for (let i = 0; i < 14; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const dates = generateDates();

  const formatDate = (date) => {
    const options = { weekday: 'short', day: 'numeric', month: 'short' };
    return date.toLocaleDateString('en-US', options);
  };

  const formatDateFull = (date) => {
    const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  const saveReservation = async () => {
    try {
      const reservation = {
        id: Date.now().toString(),
        restaurant: selectedRestaurant,
        date: selectedDate.toISOString(),
        time: selectedTime,
        partySize,
        specialRequest,
        status: 'confirmed',
        createdAt: new Date().toISOString(),
      };

      const existingReservations = await AsyncStorage.getItem(RESERVATIONS_KEY);
      const reservations = existingReservations ? JSON.parse(existingReservations) : [];
      reservations.push(reservation);
      
      await AsyncStorage.setItem(RESERVATIONS_KEY, JSON.stringify(reservations));
      return true;
    } catch (error) {
      console.error('Error saving reservation:', error);
      return false;
    }
  };

  const handleConfirmReservation = async () => {
    const saved = await saveReservation();
    
    if (saved) {
      Alert.alert(
        '🎉 Reservation Confirmed!',
        `Your table at ${selectedRestaurant.name} has been reserved for ${partySize} people on ${formatDateFull(selectedDate)} at ${selectedTime}.`,
        [
          {
            text: 'View My Bookings',
            onPress: () => navigation.navigate('OrdersTab'),
          },
          {
            text: 'Done',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } else {
      Alert.alert('Error', 'Failed to save reservation. Please try again.');
    }
  };

  const renderStep1 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Select Restaurant</Text>
      <Text style={styles.stepSubtitle}>Choose where you'd like to dine</Text>

      {selectedRestaurant ? (
        <TouchableOpacity
          style={styles.selectedCard}
          onPress={() => setShowRestaurantModal(true)}
        >
          <Icon name="restaurant" size={40} color="#FF6347" />
          <View style={styles.selectedCardInfo}>
            <Text style={styles.selectedCardTitle}>{selectedRestaurant.name}</Text>
            <Text style={styles.selectedCardSubtitle}>{selectedRestaurant.type} Cuisine</Text>
          </View>
          <Icon name="chevron-forward" size={24} color="#666" />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={styles.selectButton}
          onPress={() => setShowRestaurantModal(true)}
        >
          <Icon name="add-circle-outline" size={24} color="#FF6347" />
          <Text style={styles.selectButtonText}>Select Restaurant</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        style={[styles.continueButton, !selectedRestaurant && styles.continueButtonDisabled]}
        onPress={() => setStep(2)}
        disabled={!selectedRestaurant}
      >
        <Text style={styles.continueButtonText}>Continue</Text>
        <Icon name="arrow-forward" size={20} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );

  const renderStep2 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Select Date & Time</Text>
      <Text style={styles.stepSubtitle}>Pick your preferred date and time</Text>

      {/* Date Selection */}
      <Text style={styles.sectionLabel}>Select Date</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.dateScroll}>
        {dates.map((date, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.dateCard,
              selectedDate.toDateString() === date.toDateString() && styles.dateCardSelected,
            ]}
            onPress={() => setSelectedDate(date)}
          >
            <Text style={[
              styles.dateDay,
              selectedDate.toDateString() === date.toDateString() && styles.dateTextSelected,
            ]}>
              {date.toLocaleDateString('en-US', { weekday: 'short' })}
            </Text>
            <Text style={[
              styles.dateNumber,
              selectedDate.toDateString() === date.toDateString() && styles.dateTextSelected,
            ]}>
              {date.getDate()}
            </Text>
            <Text style={[
              styles.dateMonth,
              selectedDate.toDateString() === date.toDateString() && styles.dateTextSelected,
            ]}>
              {date.toLocaleDateString('en-US', { month: 'short' })}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Time Selection */}
      <Text style={styles.sectionLabel}>Select Time</Text>
      {selectedTime ? (
        <TouchableOpacity
          style={styles.selectedTimeCard}
          onPress={() => setShowTimeModal(true)}
        >
          <Icon name="time-outline" size={24} color="#FF6347" />
          <Text style={styles.selectedTimeText}>{selectedTime}</Text>
          <Icon name="chevron-forward" size={20} color="#666" />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={styles.selectButton}
          onPress={() => setShowTimeModal(true)}
        >
          <Icon name="time-outline" size={24} color="#FF6347" />
          <Text style={styles.selectButtonText}>Select Time</Text>
        </TouchableOpacity>
      )}

      {/* Party Size */}
      <Text style={styles.sectionLabel}>Party Size</Text>
      <TouchableOpacity
        style={styles.partySizeCard}
        onPress={() => setShowPartySizeModal(true)}
      >
        <Icon name="people-outline" size={24} color="#FF6347" />
        <Text style={styles.partySizeText}>{partySize} {partySize === 1 ? 'Guest' : 'Guests'}</Text>
        <Icon name="chevron-forward" size={20} color="#666" />
      </TouchableOpacity>

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.backButton} onPress={() => setStep(1)}>
          <Icon name="arrow-back" size={20} color="#FF6347" />
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.continueButton, styles.continueButtonFlex, !selectedTime && styles.continueButtonDisabled]}
          onPress={() => setStep(3)}
          disabled={!selectedTime}
        >
          <Text style={styles.continueButtonText}>Continue</Text>
          <Icon name="arrow-forward" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderStep3 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Review & Confirm</Text>
      <Text style={styles.stepSubtitle}>Please review your reservation details</Text>

      {/* Reservation Summary */}
      <View style={styles.summaryCard}>
        <View style={styles.summaryRow}>
          <Icon name="restaurant" size={20} color="#FF6347" />
          <View style={styles.summaryInfo}>
            <Text style={styles.summaryLabel}>Restaurant</Text>
            <Text style={styles.summaryValue}>{selectedRestaurant.name}</Text>
          </View>
        </View>

        <View style={styles.summaryDivider} />

        <View style={styles.summaryRow}>
          <Icon name="calendar" size={20} color="#FF6347" />
          <View style={styles.summaryInfo}>
            <Text style={styles.summaryLabel}>Date</Text>
            <Text style={styles.summaryValue}>{formatDateFull(selectedDate)}</Text>
          </View>
        </View>

        <View style={styles.summaryDivider} />

        <View style={styles.summaryRow}>
          <Icon name="time" size={20} color="#FF6347" />
          <View style={styles.summaryInfo}>
            <Text style={styles.summaryLabel}>Time</Text>
            <Text style={styles.summaryValue}>{selectedTime}</Text>
          </View>
        </View>

        <View style={styles.summaryDivider} />

        <View style={styles.summaryRow}>
          <Icon name="people" size={20} color="#FF6347" />
          <View style={styles.summaryInfo}>
            <Text style={styles.summaryLabel}>Party Size</Text>
            <Text style={styles.summaryValue}>{partySize} {partySize === 1 ? 'Guest' : 'Guests'}</Text>
          </View>
        </View>
      </View>

      {/* Special Request */}
      <Text style={styles.sectionLabel}>Special Request (Optional)</Text>
      <TextInput
        style={styles.textArea}
        placeholder="Any special requirements? (e.g., Window seat, Birthday celebration)"
        placeholderTextColor="#999"
        value={specialRequest}
        onChangeText={setSpecialRequest}
        multiline
        numberOfLines={4}
        textAlignVertical="top"
      />

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.backButton} onPress={() => setStep(2)}>
          <Icon name="arrow-back" size={20} color="#FF6347" />
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.confirmButton, styles.continueButtonFlex]}
          onPress={handleConfirmReservation}
        >
          <Icon name="checkmark-circle" size={20} color="#FFFFFF" />
          <Text style={styles.confirmButtonText}>Confirm Reservation</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerBackButton}>
          <Icon name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Reserve Table</Text>
        <View style={styles.headerPlaceholder} />
      </View>

      {/* Progress Indicator */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${(step / 3) * 100}%` }]} />
        </View>
        <Text style={styles.progressText}>Step {step} of 3</Text>
      </View>

      {/* Content */}
      <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
      </ScrollView>

      {/* Restaurant Selection Modal */}
      <Modal
        visible={showRestaurantModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowRestaurantModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Restaurant</Text>
              <TouchableOpacity onPress={() => setShowRestaurantModal(false)}>
                <Icon name="close" size={28} color="#333" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {RESTAURANTS.map((restaurant) => (
                <TouchableOpacity
                  key={restaurant.id}
                  style={styles.restaurantOption}
                  onPress={() => {
                    setSelectedRestaurant(restaurant);
                    setShowRestaurantModal(false);
                  }}
                >
                  <Icon name="restaurant" size={24} color="#FF6347" />
                  <View style={styles.restaurantOptionInfo}>
                    <Text style={styles.restaurantOptionName}>{restaurant.name}</Text>
                    <Text style={styles.restaurantOptionType}>{restaurant.type} Cuisine</Text>
                  </View>
                  {selectedRestaurant?.id === restaurant.id && (
                    <Icon name="checkmark-circle" size={24} color="#4CAF50" />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Time Selection Modal */}
      <Modal
        visible={showTimeModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowTimeModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Time</Text>
              <TouchableOpacity onPress={() => setShowTimeModal(false)}>
                <Icon name="close" size={28} color="#333" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.timeGrid}>
                {TIME_SLOTS.map((time, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.timeSlot,
                      selectedTime === time && styles.timeSlotSelected,
                    ]}
                    onPress={() => {
                      setSelectedTime(time);
                      setShowTimeModal(false);
                    }}
                  >
                    <Text style={[
                      styles.timeSlotText,
                      selectedTime === time && styles.timeSlotTextSelected,
                    ]}>
                      {time}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Party Size Modal */}
      <Modal
        visible={showPartySizeModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowPartySizeModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Party Size</Text>
              <TouchableOpacity onPress={() => setShowPartySizeModal(false)}>
                <Icon name="close" size={28} color="#333" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.partySizeGrid}>
                {PARTY_SIZES.map((size) => (
                  <TouchableOpacity
                    key={size}
                    style={[
                      styles.partySizeOption,
                      partySize === size && styles.partySizeOptionSelected,
                    ]}
                    onPress={() => {
                      setPartySize(size);
                      setShowPartySizeModal(false);
                    }}
                  >
                    <Icon
                      name="people"
                      size={24}
                      color={partySize === size ? '#FFFFFF' : '#FF6347'}
                    />
                    <Text style={[
                      styles.partySizeOptionText,
                      partySize === size && styles.partySizeOptionTextSelected,
                    ]}>
                      {size}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  headerBackButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  headerPlaceholder: {
    width: 34,
  },
  progressContainer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  progressBar: {
    height: 6,
    backgroundColor: '#F0F0F0',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FF6347',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  stepContainer: {
    padding: 20,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  stepSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 24,
  },
  selectedCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  selectedCardInfo: {
    flex: 1,
    marginLeft: 16,
  },
  selectedCardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  selectedCardSubtitle: {
    fontSize: 13,
    color: '#666',
  },
  selectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#FF6347',
    marginBottom: 24,
  },
  selectButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF6347',
    marginLeft: 8,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
    marginTop: 8,
  },
  dateScroll: {
    marginBottom: 24,
  },
  dateCard: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginRight: 12,
    minWidth: 80,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  dateCardSelected: {
    backgroundColor: '#FF6347',
  },
  dateDay: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
  },
  dateNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginVertical: 4,
  },
  dateMonth: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
  },
  dateTextSelected: {
    color: '#FFFFFF',
  },
  selectedTimeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  selectedTimeText: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 12,
  },
  partySizeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  partySizeText: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 12,
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    marginBottom: 24,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryInfo: {
    flex: 1,
    marginLeft: 16,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
  },
  summaryDivider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginVertical: 16,
  },
  textArea: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    fontSize: 14,
    color: '#333',
    height: 100,
    marginBottom: 24,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#FF6347',
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF6347',
    marginLeft: 8,
  },
  continueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF6347',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#FF6347',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
  },
  continueButtonFlex: {
    flex: 1,
  },
  continueButtonDisabled: {
    backgroundColor: '#CCC',
    elevation: 0,
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginRight: 8,
  },
  confirmButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4CAF50',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingTop: 20,
    paddingBottom: 30,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  restaurantOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  restaurantOptionInfo: {
    flex: 1,
    marginLeft: 16,
  },
  restaurantOptionName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  restaurantOptionType: {
    fontSize: 13,
    color: '#666',
  },
  timeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    gap: 10,
  },
  timeSlot: {
    width: '30%',
    paddingVertical: 14,
    borderRadius: 10,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
  },
  timeSlotSelected: {
    backgroundColor: '#FF6347',
  },
  timeSlotText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  timeSlotTextSelected: {
    color: '#FFFFFF',
  },
  partySizeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    gap: 12,
  },
  partySizeOption: {
    width: '30%',
    paddingVertical: 16,
    borderRadius: 10,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
  },
  partySizeOptionSelected: {
    backgroundColor: '#FF6347',
  },
  partySizeOptionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginTop: 4,
  },
  partySizeOptionTextSelected: {
    color: '#FFFFFF',
  },
});

export default TableReservationScreen;
