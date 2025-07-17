import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, ShoppingCart, Heart, Share2, Star } from 'lucide-react-native';
import RenderHtml from 'react-native-render-html';
import { Product } from '@/types/product';
import { productApi } from '@/services/api';
import { useCart } from '@/contexts/CartContext';

export default function ProductDetailPage() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { addItem } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);

  // Mock product data
  const mockProduct: Product = {
    Index: 1,
    Name: "Thermostat Drone Heater",
    Description: "<div><p><strong>Thermostat Drone Heater</strong> is a top product in our <em>Kitchen Appliances</em> category.</p><p>Price: <span style=\"color:green;\">$74</span> (USD)</p><p>Brand: Bradford-Yu</p><p>Available in color: <span style=\"color:orchid;\">Orchid</span>, size: Medium</p><p>Stock status: backorder, 139 units left.</p><p>EAN: 8619793560985</p><p>This innovative heater combines advanced thermostat technology with sleek design to provide efficient heating for your kitchen space. The product features multiple temperature settings and energy-saving capabilities.</p></div>",
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
  };

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      
      // Mock implementation
      setProduct(mockProduct);
      
      // Uncomment when backend is ready
      // const productData = await productApi.getProductById(id as string);
      // setProduct(productData);
    } catch (error) {
      console.error('Error loading product:', error);
      Alert.alert('Error', 'Failed to load product details.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      addItem(product);
      Alert.alert('Success', 'Product added to cart!');
    }
  };

  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const handleShare = () => {
    // Implement share functionality
    Alert.alert('Share', 'Share functionality would be implemented here');
  };

  const getAvailabilityColor = (availability: string) => {
    switch (availability.toLowerCase()) {
      case 'in stock':
        return '#059669';
      case 'backorder':
        return '#D97706';
      case 'out of stock':
        return '#DC2626';
      default:
        return '#6B7280';
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <ArrowLeft size={24} color="#374151" />
          </TouchableOpacity>
        </View>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading product details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!product) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <ArrowLeft size={24} color="#374151" />
          </TouchableOpacity>
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Product not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color="#374151" />
        </TouchableOpacity>
        <View style={styles.headerActions}>
          <TouchableOpacity onPress={handleToggleFavorite} style={styles.headerButton}>
            <Heart size={24} color={isFavorite ? '#DC2626' : '#374151'} fill={isFavorite ? '#DC2626' : 'none'} />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleShare} style={styles.headerButton}>
            <Share2 size={24} color="#374151" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.imageContainer}>
          <Image
            source={{ 
              uri: product.Image.startsWith('http') 
                ? product.Image 
                : `https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg`
            }}
            style={styles.productImage}
            resizeMode="cover"
          />
          <View style={styles.brandBadge}>
            <Text style={styles.brandText}>{product.Brand}</Text>
          </View>
        </View>

        <View style={styles.productInfo}>
          <Text style={styles.category}>{product.Category}</Text>
          <Text style={styles.productName}>{product.Name}</Text>
          
          <View style={styles.ratingContainer}>
            <View style={styles.stars}>
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} size={16} color="#FCD34D" fill="#FCD34D" />
              ))}
            </View>
            <Text style={styles.ratingText}>4.8 (128 reviews)</Text>
          </View>

          <View style={styles.priceContainer}>
            <Text style={styles.price}>
              ${product.Price} {product.Currency}
            </Text>
            <Text 
              style={[
                styles.availability,
                { color: getAvailabilityColor(product.Availability) }
              ]}
            >
              {product.Availability} ({product.Stock} units)
            </Text>
          </View>

          <View style={styles.productDetails}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Size:</Text>
              <Text style={styles.detailValue}>{product.Size}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Color:</Text>
              <Text style={styles.detailValue}>{product.Color}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>EAN:</Text>
              <Text style={styles.detailValue}>{product.EAN}</Text>
            </View>
          </View>

          <View style={styles.descriptionContainer}>
            <Text style={styles.descriptionTitle}>Description</Text>
            <RenderHtml
              contentWidth={300}
              source={{ html: product.Description }}
              systemFonts={['System']}
            />
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.addToCartButton} onPress={handleAddToCart}>
          <ShoppingCart size={20} color="#ffffff" />
          <Text style={styles.addToCartText}>Add to Cart</Text>
        </TouchableOpacity>
      </View>
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
  headerActions: {
    flexDirection: 'row',
  },
  headerButton: {
    marginLeft: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#DC2626',
  },
  scrollView: {
    flex: 1,
  },
  imageContainer: {
    position: 'relative',
    height: 300,
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  brandBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  brandText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  productInfo: {
    padding: 16,
    backgroundColor: '#ffffff',
  },
  category: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
    marginBottom: 8,
  },
  productName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 12,
    lineHeight: 32,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  stars: {
    flexDirection: 'row',
    marginRight: 8,
  },
  ratingText: {
    fontSize: 14,
    color: '#6B7280',
  },
  priceContainer: {
    marginBottom: 20,
  },
  price: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  availability: {
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  productDetails: {
    paddingVertical: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 16,
    color: '#111827',
    fontWeight: '600',
  },
  descriptionContainer: {
    marginBottom: 20,
  },
  descriptionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 12,
  },
  footer: {
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingBottom: 32,
  },
  addToCartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563EB',
    borderRadius: 12,
    paddingVertical: 16,
  },
  addToCartText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});