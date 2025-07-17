import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ShoppingCart } from 'lucide-react-native';
import { Product } from '@/types/product';
import { useCart } from '@/contexts/CartContext';

interface ProductCardProps {
  product: Product;
  onPress?: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onPress }) => {
  const router = useRouter();
  const { addItem } = useCart();

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      router.push(`/product/${product['Internal ID']}`);
    }
  };

  const handleAddToCart = (event: any) => {
    event.stopPropagation();
    addItem(product);
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

  return (
    <TouchableOpacity style={styles.card} onPress={handlePress}>
      <View style={styles.imageContainer}>
        <Image
          source={{ 
            uri: product.Image.startsWith('http') 
              ? product.Image 
              : `https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg`
          }}
          style={styles.image}
          resizeMode="cover"
        />
        <View style={styles.brandBadge}>
          <Text style={styles.brandText}>{product.Brand}</Text>
        </View>
      </View>
      
      <View style={styles.content}>
        <Text style={styles.category}>{product.Category}</Text>
        <Text style={styles.name} numberOfLines={2}>
          {product.Name}
        </Text>
        <Text style={styles.description} numberOfLines={2}>
          {product.ShortDescription}
        </Text>
        
        <View style={styles.details}>
          <Text style={styles.size}>Size: {product.Size}</Text>
          <Text style={styles.color}>Color: {product.Color}</Text>
        </View>
        
        <View style={styles.footer}>
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
              {product.Availability}
            </Text>
          </View>
          
          <TouchableOpacity
            style={styles.addToCartButton}
            onPress={handleAddToCart}
          >
            <ShoppingCart size={18} color="#ffffff" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ProductCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  imageContainer: {
    position: 'relative',
    height: 200,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  brandBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  brandText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  content: {
    padding: 16,
  },
  category: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
    marginBottom: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
    lineHeight: 20,
  },
  description: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 18,
    marginBottom: 12,
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  size: {
    fontSize: 12,
    color: '#6B7280',
  },
  color: {
    fontSize: 12,
    color: '#6B7280',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceContainer: {
    flex: 1,
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  availability: {
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  addToCartButton: {
    backgroundColor: '#2563EB',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});