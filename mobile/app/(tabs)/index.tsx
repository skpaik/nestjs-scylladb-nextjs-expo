import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Menu, Bell } from 'lucide-react-native';
import BurgerMenu from '@/components/BurgerMenu';
import ImageSlider from '@/components/ImageSlider';
import ProductCard from '@/components/ProductCard';
import { Product } from '@/types/product';
import { productApi } from '@/services/api';

export default function HomePage() {
  const [menuVisible, setMenuVisible] = useState(false);
  const [latestProducts, setLatestProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Mock featured images for slider
  const featuredImages = [
    'https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg',
    'https://images.pexels.com/photos/267350/pexels-photo-267350.jpeg',
    'https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg',
  ];

  useEffect(() => {
    loadLatestProducts();
  }, []);

  const loadLatestProducts = async () => {
    try {
      setLoading(true);
      // Mock data since backend is separate
      const mockProducts: Product[] = [
        {
          Index: 1,
          Name: "Thermostat Drone Heater",
          Description: "<div><p><strong>Thermostat Drone Heater</strong> is a top product in our <em>Kitchen Appliances</em> category.</p><p>Price: <span style=\"color:green;\">$74</span> (USD)</p><p>Brand: Bradford-Yu</p><p>Available in color: <span style=\"color:orchid;\">Orchid</span>, size: Medium</p><p>Stock status: backorder, 139 units left.</p><p>EAN: 8619793560985</p></div>",
          Brand: "Bradford-Yu",
          Category: "Kitchen Appliances",
          Price: 74,
          Currency: "USD",
          Stock: 139,
          EAN: 8619793560985,
          Color: "Orchid",
          Size: "Medium",
          Availability: "backorder",
          ShortDescription: "Consumer approach woman us those star.",
          Image: "https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg",
          "Internal ID": "6ce4b628-2bcc-4829-8c64-b3a71bf09a60"
        },
        {
          Index: 2,
          Name: "Smart Bluetooth Speaker",
          Description: "<div><p><strong>Smart Bluetooth Speaker</strong> with premium sound quality and voice control.</p><p>Price: <span style=\"color:green;\">$89</span> (USD)</p><p>Brand: AudioTech</p><p>Available in color: <span style=\"color:black;\">Black</span>, size: Large</p><p>Stock status: in stock, 45 units left.</p></div>",
          Brand: "AudioTech",
          Category: "Electronics",
          Price: 89,
          Currency: "USD",
          Stock: 45,
          EAN: 1234567890123,
          Color: "Black",
          Size: "Large",
          Availability: "in stock",
          ShortDescription: "High-quality sound with smart features.",
          Image: "https://images.pexels.com/photos/267350/pexels-photo-267350.jpeg",
          "Internal ID": "2ce4b628-2bcc-4829-8c64-b3a71bf09a61"
        },
        {
          Index: 3,
          Name: "Ergonomic Office Chair",
          Description: "<div><p><strong>Ergonomic Office Chair</strong> designed for comfort and productivity.</p><p>Price: <span style=\"color:green;\">$299</span> (USD)</p><p>Brand: ComfortSeating</p><p>Available in color: <span style=\"color:gray;\">Gray</span>, size: Medium</p><p>Stock status: in stock, 20 units left.</p></div>",
          Brand: "ComfortSeating",
          Category: "Furniture",
          Price: 299,
          Currency: "USD",
          Stock: 20,
          EAN: 9876543210987,
          Color: "Gray",
          Size: "Medium",
          Availability: "in stock",
          ShortDescription: "Perfect for long working hours.",
          Image: "https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg",
          "Internal ID": "3ce4b628-2bcc-4829-8c64-b3a71bf09a62"
        },
      ];
      
      setLatestProducts(mockProducts);
      
      // Uncomment when backend is ready
      // const products = await productApi.getLatestProducts(10);
      // setLatestProducts(products);
    } catch (error) {
      console.error('Error loading products:', error);
      Alert.alert('Error', 'Failed to load products. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    loadLatestProducts().finally(() => setRefreshing(false));
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => setMenuVisible(true)}
        >
          <Menu size={24} color="#374151" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>ShopApp</Text>
        <TouchableOpacity style={styles.notificationButton}>
          <Bell size={24} color="#374151" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <ImageSlider images={featuredImages} height={250} />
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Latest Products</Text>
          {loading ? (
            <Text style={styles.loadingText}>Loading products...</Text>
          ) : (
            <View style={styles.productsContainer}>
              {latestProducts.map((product) => (
                <ProductCard key={product['Internal ID']} product={product} />
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      <BurgerMenu
        visible={menuVisible}
        onClose={() => setMenuVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  menuButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  notificationButton: {
    padding: 8,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
  },
  productsContainer: {
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 20,
  },
});