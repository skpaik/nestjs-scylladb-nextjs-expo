import { Product, ApiResponse } from '@/types/Product';

// Mock product data
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Wireless Bluetooth Headphones',
    price: 129.99,
    originalPrice: 179.99,
    image: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=500',
    description: 'Premium wireless headphones with active noise cancellation and 30-hour battery life.',
    category: 'Electronics',
    rating: 4.5,
    reviews: 1234,
    inStock: true,
    discount: 28,
    features: ['Active Noise Cancellation', '30-hour Battery', 'Quick Charge', 'Wireless'],
    brand: 'AudioTech',
    tags: ['wireless', 'music', 'bluetooth']
  },
  {
    id: '2',
    name: 'Smart Fitness Watch',
    price: 249.99,
    originalPrice: 299.99,
    image: 'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=500',
    description: 'Advanced fitness tracking with heart rate monitoring and GPS.',
    category: 'Wearables',
    rating: 4.7,
    reviews: 892,
    inStock: true,
    discount: 17,
    features: ['Heart Rate Monitor', 'GPS Tracking', 'Water Resistant', 'Sleep Tracking'],
    brand: 'FitPro',
    tags: ['fitness', 'health', 'smartwatch']
  },
  {
    id: '3',
    name: 'Ergonomic Office Chair',
    price: 399.99,
    image: 'https://images.pexels.com/photos/4099469/pexels-photo-4099469.jpeg?auto=compress&cs=tinysrgb&w=500',
    description: 'Comfortable ergonomic chair designed for long work sessions.',
    category: 'Furniture',
    rating: 4.3,
    reviews: 567,
    inStock: true,
    features: ['Lumbar Support', 'Adjustable Height', 'Breathable Mesh', 'Swivel Base'],
    brand: 'ErgoComfort',
    tags: ['office', 'chair', 'ergonomic']
  },
  {
    id: '4',
    name: 'Portable Coffee Maker',
    price: 89.99,
    originalPrice: 119.99,
    image: 'https://images.pexels.com/photos/324028/pexels-photo-324028.jpeg?auto=compress&cs=tinysrgb&w=500',
    description: 'Compact and portable coffee maker perfect for travel.',
    category: 'Kitchen',
    rating: 4.2,
    reviews: 345,
    inStock: true,
    discount: 25,
    features: ['Portable Design', 'Quick Brew', 'Easy Clean', 'Travel Size'],
    brand: 'BrewMaster',
    tags: ['coffee', 'portable', 'travel']
  },
  {
    id: '5',
    name: 'Gaming Mechanical Keyboard',
    price: 159.99,
    image: 'https://images.pexels.com/photos/2115256/pexels-photo-2115256.jpeg?auto=compress&cs=tinysrgb&w=500',
    description: 'High-performance mechanical keyboard with RGB lighting.',
    category: 'Gaming',
    rating: 4.6,
    reviews: 789,
    inStock: true,
    features: ['Mechanical Switches', 'RGB Lighting', 'Programmable Keys', 'Gaming Mode'],
    brand: 'GameTech',
    tags: ['gaming', 'keyboard', 'mechanical']
  },
  {
    id: '6',
    name: 'Wireless Charging Pad',
    price: 49.99,
    originalPrice: 69.99,
    image: 'https://images.pexels.com/photos/4526419/pexels-photo-4526419.jpeg?auto=compress&cs=tinysrgb&w=500',
    description: 'Fast wireless charging pad compatible with all Qi-enabled devices.',
    category: 'Electronics',
    rating: 4.4,
    reviews: 456,
    inStock: true,
    discount: 29,
    features: ['Fast Charging', 'Qi Compatible', 'LED Indicator', 'Non-Slip Base'],
    brand: 'ChargePro',
    tags: ['wireless', 'charging', 'phone']
  },
  {
    id: '7',
    name: 'Smart Home Security Camera',
    price: 199.99,
    image: 'https://images.pexels.com/photos/430208/pexels-photo-430208.jpeg?auto=compress&cs=tinysrgb&w=500',
    description: '1080p HD security camera with night vision and motion detection.',
    category: 'Smart Home',
    rating: 4.5,
    reviews: 612,
    inStock: true,
    features: ['1080p HD', 'Night Vision', 'Motion Detection', 'Two-Way Audio'],
    brand: 'SecureTech',
    tags: ['security', 'camera', 'smart home']
  },
  {
    id: '8',
    name: 'Bluetooth Speaker',
    price: 79.99,
    originalPrice: 99.99,
    image: 'https://images.pexels.com/photos/3394664/pexels-photo-3394664.jpeg?auto=compress&cs=tinysrgb&w=500',
    description: 'Portable Bluetooth speaker with 360-degree sound.',
    category: 'Electronics',
    rating: 4.3,
    reviews: 723,
    inStock: true,
    discount: 20,
    features: ['360° Sound', 'Waterproof', '12-hour Battery', 'Portable'],
    brand: 'SoundWave',
    tags: ['speaker', 'bluetooth', 'portable']
  },
  {
    id: '9',
    name: 'Laptop Stand',
    price: 59.99,
    image: 'https://images.pexels.com/photos/4158/apple-iphone-smartphone-desk.jpg?auto=compress&cs=tinysrgb&w=500',
    description: 'Adjustable aluminum laptop stand for better ergonomics.',
    category: 'Accessories',
    rating: 4.4,
    reviews: 389,
    inStock: true,
    features: ['Adjustable Height', 'Aluminum Build', 'Cooling Design', 'Portable'],
    brand: 'StandPro',
    tags: ['laptop', 'stand', 'ergonomic']
  },
  {
    id: '10',
    name: 'LED Desk Lamp',
    price: 69.99,
    originalPrice: 89.99,
    image: 'https://images.pexels.com/photos/209315/pexels-photo-209315.jpeg?auto=compress&cs=tinysrgb&w=500',
    description: 'Smart LED desk lamp with adjustable brightness and color temperature.',
    category: 'Lighting',
    rating: 4.6,
    reviews: 445,
    inStock: true,
    discount: 22,
    features: ['LED Light', 'Adjustable Brightness', 'Color Temperature', 'Touch Control'],
    brand: 'LightTech',
    tags: ['lamp', 'led', 'desk']
  },
  {
    id: '11',
    name: 'Wireless Mouse',
    price: 39.99,
    originalPrice: 49.99,
    image: 'https://images.pexels.com/photos/2115217/pexels-photo-2115217.jpeg?auto=compress&cs=tinysrgb&w=500',
    description: 'Ergonomic wireless mouse with precision tracking.',
    category: 'Computer',
    rating: 4.2,
    reviews: 567,
    inStock: true,
    discount: 20,
    features: ['Wireless', 'Ergonomic Design', 'Precision Tracking', 'Long Battery'],
    brand: 'MouseTech',
    tags: ['mouse', 'wireless', 'computer']
  },
  {
    id: '12',
    name: 'Phone Case',
    price: 24.99,
    originalPrice: 34.99,
    image: 'https://images.pexels.com/photos/1294943/pexels-photo-1294943.jpeg?auto=compress&cs=tinysrgb&w=500',
    description: 'Protective phone case with shock absorption and wireless charging support.',
    category: 'Accessories',
    rating: 4.3,
    reviews: 892,
    inStock: true,
    discount: 29,
    features: ['Shock Absorption', 'Wireless Charging', 'Slim Design', 'Screen Protection'],
    brand: 'CasePro',
    tags: ['phone', 'case', 'protection']
  },
  {
    id: '13',
    name: 'Tablet Stand',
    price: 29.99,
    image: 'https://images.pexels.com/photos/1334591/pexels-photo-1334591.jpeg?auto=compress&cs=tinysrgb&w=500',
    description: 'Adjustable tablet stand for comfortable viewing angles.',
    category: 'Accessories',
    rating: 4.1,
    reviews: 234,
    inStock: true,
    features: ['Adjustable Angle', 'Stable Base', 'Compact Design', 'Universal Fit'],
    brand: 'TabletPro',
    tags: ['tablet', 'stand', 'adjustable']
  },
  {
    id: '14',
    name: 'USB-C Hub',
    price: 79.99,
    originalPrice: 99.99,
    image: 'https://images.pexels.com/photos/2115216/pexels-photo-2115216.jpeg?auto=compress&cs=tinysrgb&w=500',
    description: 'Multi-port USB-C hub with 4K HDMI and fast charging.',
    category: 'Electronics',
    rating: 4.5,
    reviews: 678,
    inStock: true,
    discount: 20,
    features: ['4K HDMI', 'Fast Charging', 'Multi-Port', 'Compact Design'],
    brand: 'HubTech',
    tags: ['usb-c', 'hub', 'connectivity']
  },
  {
    id: '15',
    name: 'Water Bottle',
    price: 19.99,
    originalPrice: 29.99,
    image: 'https://images.pexels.com/photos/1000084/pexels-photo-1000084.jpeg?auto=compress&cs=tinysrgb&w=500',
    description: 'Insulated stainless steel water bottle keeps drinks cold for 24 hours.',
    category: 'Lifestyle',
    rating: 4.4,
    reviews: 456,
    inStock: true,
    discount: 33,
    features: ['Insulated', 'Stainless Steel', '24-hour Cold', 'Leak Proof'],
    brand: 'HydroTech',
    tags: ['water', 'bottle', 'insulated']
  },
  {
    id: '16',
    name: 'Notebook Set',
    price: 14.99,
    originalPrice: 19.99,
    image: 'https://images.pexels.com/photos/273222/pexels-photo-273222.jpeg?auto=compress&cs=tinysrgb&w=500',
    description: 'Premium notebook set with ruled pages and hardcover.',
    category: 'Stationery',
    rating: 4.2,
    reviews: 123,
    inStock: true,
    discount: 25,
    features: ['Hardcover', 'Ruled Pages', 'Premium Paper', 'Set of 3'],
    brand: 'PaperPro',
    tags: ['notebook', 'stationery', 'writing']
  }
];

// Generate additional products for pagination
const generateProducts = (count: number, startId: number = 17): Product[] => {
  const categories = ['Electronics', 'Wearables', 'Furniture', 'Kitchen', 'Gaming', 'Smart Home', 'Accessories', 'Lighting'];
  const brands = ['TechPro', 'ModernTech', 'SmartGear', 'ProLine', 'EliteTech', 'NextGen', 'Premium', 'Advanced'];
  
  return Array.from({ length: count }, (_, index) => ({
    id: (startId + index).toString(),
    name: `Product ${startId + index}`,
    price: Math.floor(Math.random() * 500) + 20,
    originalPrice: Math.floor(Math.random() * 600) + 100,
    image: `https://images.pexels.com/photos/${Math.floor(Math.random() * 1000000) + 1000}/pexels-photo-${Math.floor(Math.random() * 1000000) + 1000}.jpeg?auto=compress&cs=tinysrgb&w=500`,
    description: `High-quality product ${startId + index} with excellent features and performance.`,
    category: categories[Math.floor(Math.random() * categories.length)],
    rating: Math.floor(Math.random() * 2) + 4,
    reviews: Math.floor(Math.random() * 1000) + 100,
    inStock: Math.random() > 0.1,
    discount: Math.floor(Math.random() * 30) + 10,
    features: ['Feature 1', 'Feature 2', 'Feature 3', 'Feature 4'],
    brand: brands[Math.floor(Math.random() * brands.length)],
    tags: ['tag1', 'tag2', 'tag3']
  }));
};

const allProducts = [...mockProducts, ...generateProducts(500)];

export class ApiService {
  static async getHomeProducts(): Promise<Product[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    return mockProducts;
  }

  static async getProducts(page: number = 1, limit: number = 100): Promise<ApiResponse<Product[]>> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const products = allProducts.slice(startIndex, endIndex);
    
    return {
      data: products,
      total: allProducts.length,
      page,
      limit,
      hasMore: endIndex < allProducts.length
    };
  }

  static async getProductById(id: string): Promise<Product | null> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return allProducts.find(product => product.id === id) || null;
  }

  static async searchProducts(query: string, page: number = 1, limit: number = 100): Promise<ApiResponse<Product[]>> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const filteredProducts = allProducts.filter(product =>
      product.name.toLowerCase().includes(query.toLowerCase()) ||
      product.category.toLowerCase().includes(query.toLowerCase()) ||
      product.brand.toLowerCase().includes(query.toLowerCase())
    );
    
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const products = filteredProducts.slice(startIndex, endIndex);
    
    return {
      data: products,
      total: filteredProducts.length,
      page,
      limit,
      hasMore: endIndex < filteredProducts.length
    };
  }
}