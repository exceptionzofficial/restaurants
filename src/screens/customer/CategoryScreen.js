import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');
const SIDEBAR_WIDTH = 100;
const CONTENT_WIDTH = width - SIDEBAR_WIDTH;

// Categories List
const CATEGORIES = [
  { id: 'all', name: 'All Items', icon: 'grid', color: '#FF6347' },
  { id: 'starters', name: 'Starters', icon: 'flame', color: '#FF9800' },
  { id: 'main', name: 'Main Course', icon: 'pizza', color: '#F44336' },
  { id: 'beverages', name: 'Beverages', icon: 'cafe', color: '#2196F3' },
  { id: 'desserts', name: 'Desserts', icon: 'ice-cream', color: '#E91E63' },
  { id: 'salads', name: 'Salads', icon: 'leaf', color: '#4CAF50' },
  { id: 'soups', name: 'Soups', icon: 'bowl', color: '#FF5722' },
  { id: 'appetizers', name: 'Appetizers', icon: 'fast-food', color: '#9C27B0' },
];

// Menu Items with Categories (INR Prices)
const MENU_ITEMS = [
  {
    id: '1',
    name: 'Margherita Pizza',
    category: 'main',
    price: 349,
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400',
    isVeg: true,
    description: 'Classic Italian pizza with fresh mozzarella and basil',
  },
  {
    id: '2',
    name: 'Chicken Tikka',
    category: 'starters',
    price: 425,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400',
    isVeg: false,
    description: 'Spicy grilled chicken marinated with Indian spices',
  },
  {
    id: '3',
    name: 'Caesar Salad',
    category: 'salads',
    price: 249,
    rating: 4.3,
    image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400',
    isVeg: true,
    description: 'Fresh romaine lettuce with Caesar dressing and croutons',
  },
  {
    id: '4',
    name: 'Chocolate Shake',
    category: 'beverages',
    price: 149,
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400',
    isVeg: true,
    description: 'Rich chocolate milkshake topped with whipped cream',
  },
  {
    id: '5',
    name: 'Tiramisu',
    category: 'desserts',
    price: 199,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400',
    isVeg: true,
    description: 'Classic Italian coffee-flavored layered dessert',
  },
  {
    id: '6',
    name: 'Tom Yum Soup',
    category: 'soups',
    price: 249,
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400',
    isVeg: false,
    description: 'Authentic Thai hot and sour soup with shrimp',
  },
  {
    id: '7',
    name: 'Samosa Platter',
    category: 'appetizers',
    price: 149,
    rating: 4.4,
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400',
    isVeg: true,
    description: 'Crispy golden pastries filled with spiced potatoes',
  },
  {
    id: '8',
    name: 'Pasta Carbonara',
    category: 'main',
    price: 399,
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=400',
    isVeg: false,
    description: 'Creamy Italian pasta with bacon and parmesan',
  },
  {
    id: '9',
    name: 'Spring Rolls',
    category: 'starters',
    price: 199,
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=400',
    isVeg: true,
    description: 'Crispy vegetable spring rolls with sweet chili sauce',
  },
  {
    id: '10',
    name: 'Greek Salad',
    category: 'salads',
    price: 279,
    rating: 4.4,
    image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400',
    isVeg: true,
    description: 'Fresh Mediterranean salad with feta and olives',
  },
  {
    id: '11',
    name: 'Mango Smoothie',
    category: 'beverages',
    price: 179,
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1505252585461-04db1eb84625?w=400',
    isVeg: true,
    description: 'Refreshing tropical mango smoothie with yogurt',
  },
  {
    id: '12',
    name: 'Cheesecake',
    category: 'desserts',
    price: 229,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=400',
    isVeg: true,
    description: 'Creamy New York style cheesecake with berry sauce',
  },
  {
    id: '13',
    name: 'French Onion Soup',
    category: 'soups',
    price: 219,
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400',
    isVeg: true,
    description: 'Rich caramelized onion soup with melted cheese',
  },
  {
    id: '14',
    name: 'Bruschetta',
    category: 'appetizers',
    price: 189,
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?w=400',
    isVeg: true,
    description: 'Toasted Italian bread with fresh tomato and basil',
  },
  {
    id: '15',
    name: 'Grilled Salmon',
    category: 'main',
    price: 649,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400',
    isVeg: false,
    description: 'Fresh Atlantic salmon grilled with lemon and herbs',
  },
];

const CART_STORAGE_KEY = '@restaurant_cart';

const CategoryScreen = ({ navigation }) => {
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0]);
  const [cartItems, setCartItems] = useState([]);

  // Load cart on mount
  React.useEffect(() => {
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

  // Filter items based on selected category
  const filteredItems = selectedCategory.id === 'all'
    ? MENU_ITEMS
    : MENU_ITEMS.filter(item => item.category === selectedCategory.id);

  const renderCategoryItem = ({ item }) => {
    const isActive = selectedCategory.id === item.id;
    return (
      <TouchableOpacity
        style={[
          styles.categoryItem,
          isActive && styles.categoryItemActive,
        ]}
        onPress={() => setSelectedCategory(item)}
        activeOpacity={0.7}
      >
        <View style={[
          styles.categoryIconWrapper,
          isActive && { backgroundColor: item.color }
        ]}>
          <Icon
            name={item.icon}
            size={26}
            color={isActive ? '#FFFFFF' : item.color}
          />
        </View>
        <Text
          style={[
            styles.categoryText,
            isActive && styles.categoryTextActive,
          ]}
          numberOfLines={2}
        >
          {item.name}
        </Text>
        {isActive && <View style={[styles.activeIndicator, { backgroundColor: item.color }]} />}
      </TouchableOpacity>
    );
  };

  const renderMenuItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.menuItem} 
      activeOpacity={0.8}
      onPress={() => console.log('Navigate to dish detail:', item.name)}
    >
      <View style={styles.menuItemImageContainer}>
        <Image source={{ uri: item.image }} style={styles.menuItemImage} />
        
        {/* Veg/Non-Veg Badge */}
        <View style={[styles.vegBadge, { backgroundColor: item.isVeg ? '#4CAF50' : '#F44336' }]}>
          <View style={[styles.vegDot, { borderColor: item.isVeg ? '#4CAF50' : '#F44336' }]} />
        </View>

        {/* Rating Badge */}
        <View style={styles.ratingBadge}>
          <Icon name="star" size={12} color="#FFD700" />
          <Text style={styles.ratingBadgeText}>{item.rating}</Text>
        </View>
      </View>

      <View style={styles.menuItemInfo}>
        <Text style={styles.menuItemName} numberOfLines={1}>
          {item.name}
        </Text>
        
        <Text style={styles.menuItemDescription} numberOfLines={2}>
          {item.description}
        </Text>
        
        <View style={styles.menuItemFooter}>
          <Text style={styles.menuItemPrice}>₹{item.price}</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => handleAddToCart(item)}
          >
            <Icon name="add" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#FF6347" />

      {/* Professional Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Icon name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>Browse Menu</Text>
            <Text style={styles.headerSubtitle}>Choose from categories</Text>
          </View>
          <TouchableOpacity 
            style={styles.cartButton}
            onPress={() => navigation.navigate('Cart')}
          >
            <Icon name="cart" size={26} color="#FFFFFF" />
            {cartItems.length > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>{cartItems.length}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.content}>
        {/* Left Sidebar - Categories */}
        <View style={styles.sidebar}>
          <FlatList
            data={CATEGORIES}
            renderItem={renderCategoryItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.sidebarContent}
          />
        </View>

        {/* Right Content - Menu Items */}
        <View style={styles.menuContent}>
          <View style={styles.menuHeader}>
            <Text style={styles.categoryTitle}>{selectedCategory.name}</Text>
            <View style={styles.itemCountBadge}>
              <Text style={styles.itemCount}>{filteredItems.length}</Text>
            </View>
          </View>
          
          <FlatList
            data={filteredItems}
            renderItem={renderMenuItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.menuList}
          />
        </View>
      </View>
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
    paddingBottom: 16,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#FFE5E0',
  },
  cartButton: {
    position: 'relative',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
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
  content: {
    flex: 1,
    flexDirection: 'row',
  },
  sidebar: {
    width: SIDEBAR_WIDTH,
    backgroundColor: '#FFFFFF',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  sidebarContent: {
    paddingVertical: 8,
  },
  categoryItem: {
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 8,
    position: 'relative',
  },
  categoryItemActive: {
    backgroundColor: '#FFF5F3',
  },
  categoryIconWrapper: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  categoryText: {
    fontSize: 10,
    color: '#666',
    textAlign: 'center',
    fontWeight: '500',
    lineHeight: 13,
  },
  categoryTextActive: {
    color: '#FF6347',
    fontWeight: '700',
  },
  activeIndicator: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    backgroundColor: '#FF6347',
    borderTopRightRadius: 2,
    borderBottomRightRadius: 2,
  },
  menuContent: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  menuHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  itemCountBadge: {
    backgroundColor: '#FF6347',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  itemCount: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  menuList: {
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 20,
  },
  menuItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 12,
    marginHorizontal: 4,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    overflow: 'hidden',
  },
  menuItemImageContainer: {
    position: 'relative',
  },
  menuItemImage: {
    width: '100%',
    height: 180,
    backgroundColor: '#F0F0F0',
  },
  vegBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    width: 22,
    height: 22,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
  },
  vegDot: {
    width: 9,
    height: 9,
    borderRadius: 4.5,
    borderWidth: 2,
    backgroundColor: '#FFFFFF',
  },
  ratingBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 14,
    elevation: 2,
  },
  ratingBadgeText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  menuItemInfo: {
    padding: 14,
  },
  menuItemName: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 6,
  },
  menuItemDescription: {
    fontSize: 13,
    color: '#666',
    lineHeight: 19,
    marginBottom: 12,
  },
  menuItemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  menuItemPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  addButton: {
    backgroundColor: '#FF6347',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#FF6347',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 3,
  },
});

export default CategoryScreen;
