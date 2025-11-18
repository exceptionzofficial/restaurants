import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Dimensions,
  Modal,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');
const ITEM_WIDTH = (width - 48) / 2;

// Sample Restaurants Data
const RESTAURANTS = [
  { id: '1', name: 'Italian Bistro', type: 'Italian', rating: 4.5, location: 'Connaught Place, Delhi' },
  { id: '2', name: 'Spice Garden', type: 'Indian', rating: 4.7, location: 'Banjara Hills, Hyderabad' },
  { id: '3', name: 'Sushi Palace', type: 'Japanese', rating: 4.8, location: 'Indiranagar, Bangalore' },
  { id: '4', name: 'Burger House', type: 'American', rating: 4.3, location: 'Koramangala, Bangalore' },
  { id: '5', name: 'Thai Express', type: 'Thai', rating: 4.6, location: 'Powai, Mumbai' },
];

// Sample Menu Items Data (20 items with INR prices)
const MENU_ITEMS = [
  {
    id: '1',
    name: 'Margherita Pizza',
    restaurant: 'Italian Bistro',
    restaurantId: '1',
    price: 349,
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400',
    category: 'Main Course',
    isVeg: true,
  },
  {
    id: '2',
    name: 'Chicken Tikka Masala',
    restaurant: 'Spice Garden',
    restaurantId: '2',
    price: 425,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400',
    category: 'Main Course',
    isVeg: false,
  },
  {
    id: '3',
    name: 'Salmon Sushi Roll',
    restaurant: 'Sushi Palace',
    restaurantId: '3',
    price: 599,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400',
    category: 'Appetizer',
    isVeg: false,
  },
  {
    id: '4',
    name: 'Classic Cheeseburger',
    restaurant: 'Burger House',
    restaurantId: '4',
    price: 299,
    rating: 4.4,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400',
    category: 'Main Course',
    isVeg: false,
  },
  {
    id: '5',
    name: 'Pad Thai Noodles',
    restaurant: 'Thai Express',
    restaurantId: '5',
    price: 375,
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1559314809-0d155014e29e?w=400',
    category: 'Main Course',
    isVeg: true,
  },
  {
    id: '6',
    name: 'Caesar Salad',
    restaurant: 'Italian Bistro',
    restaurantId: '1',
    price: 249,
    rating: 4.3,
    image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400',
    category: 'Salad',
    isVeg: true,
  },
  {
    id: '7',
    name: 'Paneer Butter Masala',
    restaurant: 'Spice Garden',
    restaurantId: '2',
    price: 399,
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400',
    category: 'Main Course',
    isVeg: true,
  },
  {
    id: '8',
    name: 'Dragon Roll',
    restaurant: 'Sushi Palace',
    restaurantId: '3',
    price: 649,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=400',
    category: 'Appetizer',
    isVeg: false,
  },
  {
    id: '9',
    name: 'BBQ Bacon Burger',
    restaurant: 'Burger House',
    restaurantId: '4',
    price: 349,
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=400',
    category: 'Main Course',
    isVeg: false,
  },
  {
    id: '10',
    name: 'Green Curry',
    restaurant: 'Thai Express',
    restaurantId: '5',
    price: 425,
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=400',
    category: 'Main Course',
    isVeg: true,
  },
  {
    id: '11',
    name: 'Pasta Carbonara',
    restaurant: 'Italian Bistro',
    restaurantId: '1',
    price: 399,
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=400',
    category: 'Main Course',
    isVeg: false,
  },
  {
    id: '12',
    name: 'Samosa Platter',
    restaurant: 'Spice Garden',
    restaurantId: '2',
    price: 149,
    rating: 4.4,
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400',
    category: 'Appetizer',
    isVeg: true,
  },
  {
    id: '13',
    name: 'Tempura Platter',
    restaurant: 'Sushi Palace',
    restaurantId: '3',
    price: 499,
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1583196390530-680b427a7e2e?w=400',
    category: 'Appetizer',
    isVeg: false,
  },
  {
    id: '14',
    name: 'Chicken Wings',
    restaurant: 'Burger House',
    restaurantId: '4',
    price: 275,
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1608039829572-78524f79c4c7?w=400',
    category: 'Appetizer',
    isVeg: false,
  },
  {
    id: '15',
    name: 'Tom Yum Soup',
    restaurant: 'Thai Express',
    restaurantId: '5',
    price: 249,
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400',
    category: 'Soup',
    isVeg: false,
  },
  {
    id: '16',
    name: 'Tiramisu',
    restaurant: 'Italian Bistro',
    restaurantId: '1',
    price: 199,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400',
    category: 'Dessert',
    isVeg: true,
  },
  {
    id: '17',
    name: 'Gulab Jamun',
    restaurant: 'Spice Garden',
    restaurantId: '2',
    price: 129,
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=400',
    category: 'Dessert',
    isVeg: true,
  },
  {
    id: '18',
    name: 'Mochi Ice Cream',
    restaurant: 'Sushi Palace',
    restaurantId: '3',
    price: 179,
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400',
    category: 'Dessert',
    isVeg: true,
  },
  {
    id: '19',
    name: 'Chocolate Shake',
    restaurant: 'Burger House',
    restaurantId: '4',
    price: 149,
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400',
    category: 'Beverage',
    isVeg: true,
  },
  {
    id: '20',
    name: 'Thai Iced Tea',
    restaurant: 'Thai Express',
    restaurantId: '5',
    price: 99,
    rating: 4.4,
    image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400',
    category: 'Beverage',
    isVeg: true,
  },
];

const CART_STORAGE_KEY = '@restaurant_cart';

const HomeScreen = ({ navigation }) => {
  const [selectedRestaurant, setSelectedRestaurant] = useState(RESTAURANTS[0]);
  const [showRestaurantModal, setShowRestaurantModal] = useState(false);
  const [showDrawer, setShowDrawer] = useState(false);
  const [cartItems, setCartItems] = useState([]);

  // Load cart from AsyncStorage on mount
  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      const cartData = await AsyncStorage.getItem(CART_STORAGE_KEY);
      if (cartData !== null) {
        setCartItems(JSON.parse(cartData));
      }
    } catch (error) {
      console.error('Error loading cart:', error);
    }
  };

  const saveCart = async (cart) => {
    try {
      await AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (error) {
      console.error('Error saving cart:', error);
    }
  };

  // Filter menu items based on selected restaurant
  const filteredMenuItems = selectedRestaurant.id === '1'
    ? MENU_ITEMS
    : MENU_ITEMS.filter(item => item.restaurantId === selectedRestaurant.id);

  const handleAddToCart = (item) => {
    const existingItemIndex = cartItems.findIndex(cartItem => cartItem.id === item.id);
    
    let updatedCart;
    if (existingItemIndex !== -1) {
      updatedCart = [...cartItems];
      updatedCart[existingItemIndex].quantity += 1;
    } else {
      updatedCart = [...cartItems, { ...item, quantity: 1 }];
    }
    
    setCartItems(updatedCart);
    saveCart(updatedCart);
    
    Alert.alert('Added to Cart', `${item.name} added to cart!`, [{ text: 'OK' }]);
  };

  const handleRestaurantSelect = (restaurant) => {
    setSelectedRestaurant(restaurant);
    setShowRestaurantModal(false);
  };

  const handleSearchPress = () => {
    console.log('Navigate to search');
  };

  const handleCartPress = () => {
    navigation.navigate('Cart');
  };

  const renderMenuItem = ({ item }) => (
    <TouchableOpacity
      style={styles.menuCard}
      activeOpacity={0.8}
      onPress={() => {
        console.log('Navigate to:', item.name);
      }}
    >
      <Image source={{ uri: item.image }} style={styles.menuImage} />
      
      <View style={[styles.vegIndicator, { backgroundColor: item.isVeg ? '#4CAF50' : '#F44336' }]}>
        <View style={[styles.vegDot, { borderColor: item.isVeg ? '#4CAF50' : '#F44336' }]} />
      </View>

      <View style={styles.ratingBadge}>
        <Icon name="star" size={12} color="#FFD700" />
        <Text style={styles.ratingText}>{item.rating}</Text>
      </View>

      <View style={styles.menuInfo}>
        <Text style={styles.menuName} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.restaurantName} numberOfLines={1}>{item.restaurant}</Text>
        <Text style={styles.categoryText}>{item.category}</Text>
        
        <View style={styles.priceRow}>
          <Text style={styles.price}>₹{item.price}</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => handleAddToCart(item)}
          >
            <Icon name="add" size={18} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderRestaurantItem = (restaurant) => (
    <TouchableOpacity
      key={restaurant.id}
      style={[
        styles.restaurantOption,
        selectedRestaurant.id === restaurant.id && styles.restaurantOptionSelected,
      ]}
      onPress={() => handleRestaurantSelect(restaurant)}
    >
      <View style={styles.restaurantIconWrapper}>
        <Icon
          name="restaurant"
          size={24}
          color={selectedRestaurant.id === restaurant.id ? '#FF6347' : '#666'}
        />
      </View>
      <View style={styles.restaurantInfo}>
        <Text
          style={[
            styles.restaurantOptionName,
            selectedRestaurant.id === restaurant.id && styles.restaurantOptionNameSelected,
          ]}
        >
          {restaurant.name}
        </Text>
        <Text style={styles.restaurantLocation}>{restaurant.location}</Text>
        <View style={styles.restaurantRating}>
          <Icon name="star" size={14} color="#FFD700" />
          <Text style={styles.restaurantRatingText}>{restaurant.rating}</Text>
          <Text style={styles.restaurantType}> • {restaurant.type}</Text>
        </View>
      </View>
      {selectedRestaurant.id === restaurant.id && (
        <Icon name="checkmark-circle" size={24} color="#FF6347" />
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#FF6347" />

      {/* Professional Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          {/* Drawer Menu Button */}
          <TouchableOpacity 
            style={styles.drawerButton} 
            onPress={() => setShowDrawer(true)}
          >
            <View style={styles.drawerLine} />
            <View style={styles.drawerLine} />
            <View style={styles.drawerLine} />
          </TouchableOpacity>

          {/* Restaurant Info Section */}
          <TouchableOpacity
            style={styles.restaurantHeader}
            onPress={() => setShowRestaurantModal(true)}
          >
            <View style={styles.restaurantHeaderInfo}>
              <Text style={styles.restaurantHeaderName} numberOfLines={1}>
                {selectedRestaurant.name}
              </Text>
              <View style={styles.restaurantHeaderLocation}>
                <Icon name="location-sharp" size={12} color="#FFE5E0" />
                <Text style={styles.restaurantHeaderLocationText} numberOfLines={1}>
                  {selectedRestaurant.location}
                </Text>
              </View>
            </View>
            <Icon name="chevron-down" size={20} color="#FFFFFF" />
          </TouchableOpacity>

          {/* Action Buttons */}
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.headerActionButton} onPress={handleSearchPress}>
              <Icon name="search" size={22} color="#FFFFFF" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerActionButton} onPress={handleCartPress}>
              <Icon name="cart" size={22} color="#FFFFFF" />
              {cartItems.length > 0 && (
                <View style={styles.cartBadge}>
                  <Text style={styles.cartBadgeText}>{cartItems.length}</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Icon name="time-outline" size={16} color="#FFFFFF" />
            <Text style={styles.statText}>30-40 min</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Icon name="star" size={16} color="#FFD700" />
            <Text style={styles.statText}>{selectedRestaurant.rating} Rating</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Icon name="bicycle-outline" size={16} color="#FFFFFF" />
            <Text style={styles.statText}>Free Delivery</Text>
          </View>
        </View>
      </View>

      {/* Quick Access Cards */}
      <View style={styles.quickAccessWrapper}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.quickAccessContainer}
        >
          <TouchableOpacity 
            style={styles.quickAccessCard}
            onPress={() => navigation.navigate('TableReservation')}
          >
            <View style={[styles.quickAccessIcon, { backgroundColor: '#FF6347' }]}>
              <Icon name="calendar" size={24} color="#FFFFFF" />
            </View>
            <Text style={styles.quickAccessText}>Reserve</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.quickAccessCard}
            onPress={() => console.log('Navigate to Offers')}
          >
            <View style={[styles.quickAccessIcon, { backgroundColor: '#4CAF50' }]}>
              <Icon name="pricetag" size={24} color="#FFFFFF" />
            </View>
            <Text style={styles.quickAccessText}>Offers</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.quickAccessCard}
            onPress={() => console.log('Navigate to Favorites')}
          >
            <View style={[styles.quickAccessIcon, { backgroundColor: '#E91E63' }]}>
              <Icon name="heart" size={24} color="#FFFFFF" />
            </View>
            <Text style={styles.quickAccessText}>Favorites</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.quickAccessCard}
            onPress={() => navigation.navigate('OrdersTab')}
          >
            <View style={[styles.quickAccessIcon, { backgroundColor: '#2196F3' }]}>
              <Icon name="receipt" size={24} color="#FFFFFF" />
            </View>
            <Text style={styles.quickAccessText}>Orders</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.quickAccessCard}
            onPress={() => console.log('Navigate to Help')}
          >
            <View style={[styles.quickAccessIcon, { backgroundColor: '#9C27B0' }]}>
              <Icon name="help-circle" size={24} color="#FFFFFF" />
            </View>
            <Text style={styles.quickAccessText}>Help</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Menu Section Header */}
      <View style={styles.menuSectionHeader}>
        <Text style={styles.menuSectionTitle}>Popular Dishes</Text>
        <Text style={styles.menuCount}>{filteredMenuItems.length} items</Text>
      </View>

      {/* Menu Items Grid */}
      <FlatList
        data={filteredMenuItems}
        renderItem={renderMenuItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.menuList}
        columnWrapperStyle={styles.columnWrapper}
      />

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
              {RESTAURANTS.map((restaurant) => renderRestaurantItem(restaurant))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Drawer Menu Modal - FIXED FOR LEFT SIDE */}
      <Modal
        visible={showDrawer}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setShowDrawer(false)}
      >
        <View style={styles.drawerOverlay}>
          {/* Drawer Content - FIRST (LEFT SIDE) */}
          <View style={styles.drawerContent}>
            {/* Drawer Header */}
            <View style={styles.drawerHeader}>
              <View style={styles.userAvatar}>
                <Icon name="person" size={32} color="#FF6347" />
              </View>
              <Text style={styles.userName}>Food Lover</Text>
              <Text style={styles.userEmail}>user@example.com</Text>
            </View>

            {/* Drawer Menu Items */}
            <ScrollView showsVerticalScrollIndicator={false} style={styles.drawerMenu}>
              <TouchableOpacity style={styles.drawerMenuItem} onPress={() => {
                setShowDrawer(false);
                navigation.navigate('HomeTab');
              }}>
                <Icon name="home" size={24} color="#666" />
                <Text style={styles.drawerMenuText}>Home</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.drawerMenuItem} onPress={() => {
                setShowDrawer(false);
                navigation.navigate('TableReservation');
              }}>
                <Icon name="calendar" size={24} color="#666" />
                <Text style={styles.drawerMenuText}>Table Reservation</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.drawerMenuItem} onPress={() => {
                setShowDrawer(false);
                navigation.navigate('OrdersTab');
              }}>
                <Icon name="receipt" size={24} color="#666" />
                <Text style={styles.drawerMenuText}>My Orders</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.drawerMenuItem} onPress={() => {
                setShowDrawer(false);
              }}>
                <Icon name="heart" size={24} color="#666" />
                <Text style={styles.drawerMenuText}>Favorites</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.drawerMenuItem} onPress={() => {
                setShowDrawer(false);
              }}>
                <Icon name="wallet" size={24} color="#666" />
                <Text style={styles.drawerMenuText}>Payment Methods</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.drawerMenuItem} onPress={() => {
                setShowDrawer(false);
              }}>
                <Icon name="location" size={24} color="#666" />
                <Text style={styles.drawerMenuText}>Saved Addresses</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.drawerMenuItem} onPress={() => {
                setShowDrawer(false);
              }}>
                <Icon name="pricetag" size={24} color="#666" />
                <Text style={styles.drawerMenuText}>Offers & Deals</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.drawerMenuItem} onPress={() => {
                setShowDrawer(false);
                navigation.navigate('ProfileTab');
              }}>
                <Icon name="person" size={24} color="#666" />
                <Text style={styles.drawerMenuText}>Profile</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.drawerMenuItem} onPress={() => {
                setShowDrawer(false);
              }}>
                <Icon name="settings" size={24} color="#666" />
                <Text style={styles.drawerMenuText}>Settings</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.drawerMenuItem} onPress={() => {
                setShowDrawer(false);
              }}>
                <Icon name="help-circle" size={24} color="#666" />
                <Text style={styles.drawerMenuText}>Help & Support</Text>
              </TouchableOpacity>

              <View style={styles.drawerDivider} />

              <TouchableOpacity style={styles.drawerMenuItem} onPress={() => {
                setShowDrawer(false);
                Alert.alert('Logout', 'Are you sure you want to logout?', [
                  { text: 'Cancel', style: 'cancel' },
                  { text: 'Logout', onPress: () => navigation.replace('AuthStack') },
                ]);
              }}>
                <Icon name="log-out" size={24} color="#F44336" />
                <Text style={[styles.drawerMenuText, { color: '#F44336' }]}>Logout</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
          
          {/* Backdrop - SECOND (RIGHT SIDE - Takes remaining space) */}
          <TouchableOpacity 
            style={styles.drawerBackdrop} 
            activeOpacity={1}
            onPress={() => setShowDrawer(false)}
          />
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
    backgroundColor: '#FF6347',
    paddingTop: 45,
    paddingBottom: 12,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  drawerButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  drawerLine: {
    width: 24,
    height: 3,
    backgroundColor: '#FFFFFF',
    borderRadius: 2,
    marginVertical: 2.5,
  },
  restaurantHeader: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
  },
  restaurantHeaderInfo: {
    flex: 1,
  },
  restaurantHeaderName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  restaurantHeaderLocation: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  restaurantHeaderLocationText: {
    fontSize: 12,
    color: '#FFE5E0',
    marginLeft: 4,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  headerActionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  cartBadge: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: '#FFD700',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  cartBadgeText: {
    color: '#333',
    fontSize: 10,
    fontWeight: 'bold',
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statText: {
    fontSize: 11,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  statDivider: {
    width: 1,
    height: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  quickAccessWrapper: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  quickAccessContainer: {
    paddingHorizontal: 16,
    gap: 16,
  },
  quickAccessCard: {
    alignItems: 'center',
    width: 70,
  },
  quickAccessIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  quickAccessText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  menuSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#F8F8F8',
  },
  menuSectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  menuCount: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666',
  },
  menuList: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  menuCard: {
    width: ITEM_WIDTH,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    overflow: 'hidden',
  },
  menuImage: {
    width: '100%',
    height: 140,
    backgroundColor: '#F0F0F0',
  },
  vegIndicator: {
    position: 'absolute',
    top: 10,
    left: 10,
    width: 20,
    height: 20,
    borderRadius: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  vegDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 2,
    backgroundColor: '#FFFFFF',
  },
  ratingBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  ratingText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  menuInfo: {
    padding: 12,
  },
  menuName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  restaurantName: {
    fontSize: 12,
    color: '#999',
    marginBottom: 2,
  },
  categoryText: {
    fontSize: 11,
    color: '#FF6347',
    fontWeight: '600',
    marginBottom: 8,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  addButton: {
    backgroundColor: '#FF6347',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#FF6347',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 3,
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
  restaurantOptionSelected: {
    backgroundColor: '#FFF5F3',
  },
  restaurantIconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFF5F3',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  restaurantInfo: {
    flex: 1,
  },
  restaurantOptionName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  restaurantOptionNameSelected: {
    color: '#FF6347',
  },
  restaurantLocation: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  restaurantRating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  restaurantRatingText: {
    fontSize: 13,
    color: '#666',
    marginLeft: 4,
    fontWeight: '600',
  },
  restaurantType: {
    fontSize: 12,
    color: '#999',
  },
  // CORRECTED DRAWER STYLES - LEFT SIDE
  drawerOverlay: {
    flex: 1,
    flexDirection: 'row',  // KEY: Row layout for left-to-right positioning
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  drawerContent: {
    width: '80%',
    maxWidth: 320,
    backgroundColor: '#FFFFFF',
    elevation: 16,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
  },
  drawerBackdrop: {
    flex: 1,  // Takes remaining space on the right
  },
  drawerHeader: {
    backgroundColor: '#FF6347',
    paddingTop: 60,
    paddingBottom: 24,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  userAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 13,
    color: '#FFE5E0',
  },
  drawerMenu: {
    flex: 1,
    paddingVertical: 8,
  },
  drawerMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  drawerMenuText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 20,
    fontWeight: '500',
  },
  drawerDivider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginVertical: 8,
  },
});

export default HomeScreen;
