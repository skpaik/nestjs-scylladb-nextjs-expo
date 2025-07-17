import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, Filter } from 'lucide-react-native';
import ProductCard from '@/components/ProductCard';
import { Product } from '@/types/product';
import { productApi } from '@/services/api';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [refreshing, setRefreshing] = useState(false);

  // Mock products data
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
    {
      Index: 4,
      Name: "Wireless Gaming Mouse",
      Description: "<div><p><strong>Wireless Gaming Mouse</strong> with precision tracking and RGB lighting.</p><p>Price: <span style=\"color:green;\">$59</span> (USD)</p><p>Brand: GameTech</p><p>Available in color: <span style=\"color:red;\">Red</span>, size: Small</p><p>Stock status: in stock, 75 units left.</p></div>",
      Brand: "GameTech",
      Category: "Electronics",
      Price: 59,
      Currency: "USD",
      Stock: 75,
      EAN: 5555666677778,
      Color: "Red",
      Size: "Small",
      Availability: "in stock",
      ShortDescription: "Perfect for gaming enthusiasts.",
      Image: "https://images.pexels.com/photos/442579/pexels-photo-442579.jpeg",
      "Internal ID": "4ce4b628-2bcc-4829-8c64-b3a71bf09a63"
    },
    {
      Index: 5,
      Name: "Stainless Steel Water Bottle",
      Description: "<div><p><strong>Stainless Steel Water Bottle</strong> keeps drinks cold for 24 hours.</p><p>Price: <span style=\"color:green;\">$25</span> (USD)</p><p>Brand: HydroLife</p><p>Available in color: <span style=\"color:blue;\">Blue</span>, size: Large</p><p>Stock status: in stock, 200 units left.</p></div>",
      Brand: "HydroLife",
      Category: "Sports & Outdoors",
      Price: 25,
      Currency: "USD",
      Stock: 200,
      EAN: 1111222233334,
      Color: "Blue",
      Size: "Large",
      Availability: "in stock",
      ShortDescription: "Stay hydrated in style.",
      Image: "https://images.pexels.com/photos/1000084/pexels-photo-1000084.jpeg",
      "Internal ID": "5ce4b628-2bcc-4829-8c64-b3a71bf09a64"
    },
  ];

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async (page: number = 1, search?: string) => {
    try {
      setLoading(true);
      
      // Mock implementation
      let filteredProducts = mockProducts;
      if (search) {
        filteredProducts = mockProducts.filter(product => 
          product.Name.toLowerCase().includes(search.toLowerCase()) ||
          product.Category.toLowerCase().includes(search.toLowerCase()) ||
          product.Brand.toLowerCase().includes(search.toLowerCase())
        );
      }
      
      setProducts(filteredProducts);
      setTotalPages(1);
      
      // Uncomment when backend is ready
      // const response = await productApi.getProducts(page, 20, search);
      // setProducts(response.products);
      // setTotalPages(response.totalPages);
    } catch (error) {
      console.error('Error loading products:', error);
      Alert.alert('Error', 'Failed to load products. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
    loadProducts(1, query);
  };

  const handleLoadMore = () => {
    if (currentPage < totalPages && !loading) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      loadProducts(nextPage, searchQuery);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    setCurrentPage(1);
    loadProducts(1, searchQuery).finally(() => setRefreshing(false));
  };

  const renderProductItem = ({ item }: { item: Product }) => (
    <ProductCard product={item} />
  );

  const renderFooter = () => {
    if (!loading || currentPage === 1) return null;
    return (
      <View style={styles.loadingFooter}>
        <Text style={styles.loadingText}>Loading more products...</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Products</Text>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search size={20} color="#6B7280" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search products..."
            value={searchQuery}
            onChangeText={handleSearch}
          />
        </View>
        <TouchableOpacity style={styles.filterButton}>
          <Filter size={20} color="#6B7280" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={products}
        renderItem={renderProductItem}
        keyExtractor={(item) => item['Internal ID']}
        contentContainerStyle={styles.productsList}
        showsVerticalScrollIndicator={false}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.1}
        ListFooterComponent={renderFooter}
        refreshing={refreshing}
        onRefresh={onRefresh}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No products found</Text>
          </View>
        }
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: '#111827',
  },
  filterButton: {
    padding: 8,
  },
  productsList: {
    padding: 16,
  },
  loadingFooter: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
  },
  emptyText: {
    fontSize: 16,
    color: '#6B7280',
  },
});