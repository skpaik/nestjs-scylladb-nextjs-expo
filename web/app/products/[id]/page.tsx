'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, ShoppingCart, Heart, Share2, Star, Shield, Truck, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Product } from '@/types/product';
import { productApi } from '@/lib/api';

// Generate static params for static export
export async function generateStaticParams() {
  // For static export, we need to pre-generate paths
  // Since we don't have access to the backend during build,
  // we'll return a few sample IDs that match our mock data
  return [
    { id: '6ce4b628-2bcc-4829-8c64-b3a71bf09a60' },
    { id: 'abc123-def456-ghi789' },
    { id: 'xyz789-uvw456-rst123' },
    { id: 'cook123-ware456-set789' },
    { id: 'game123-key456-board789' },
    { id: 'coffee123-maker456-deluxe789' },
  ];
}

const ProductDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const productId = params.id as string;
        
        // Mock product data for demonstration - match by ID
        const mockProducts: Record<string, Product> = {
          '6ce4b628-2bcc-4829-8c64-b3a71bf09a60': {
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
            Image: "1.jpg",
            "Internal ID": "6ce4b628-2bcc-4829-8c64-b3a71bf09a60"
          },
          'abc123-def456-ghi789': {
            Index: 2,
            Name: "Smart Wireless Earbuds",
            Description: "<div><p><strong>Smart Wireless Earbuds</strong> with noise cancellation</p></div>",
            Brand: "TechSound",
            Category: "Electronics",
            Price: 149,
            Currency: "USD",
            Stock: 85,
            EAN: 1234567890123,
            Color: "Black",
            Size: "One Size",
            Availability: "in stock",
            ShortDescription: "Premium wireless earbuds with crystal clear sound",
            Image: "2.jpg",
            "Internal ID": "abc123-def456-ghi789"
          },
          'xyz789-uvw456-rst123': {
            Index: 3,
            Name: "Ergonomic Office Chair",
            Description: "<div><p><strong>Ergonomic Office Chair</strong> for all-day comfort</p></div>",
            Brand: "ComfortMax",
            Category: "Furniture",
            Price: 299,
            Currency: "USD",
            Stock: 45,
            EAN: 9876543210987,
            Color: "Gray",
            Size: "Standard",
            Availability: "in stock",
            ShortDescription: "Professional office chair with lumbar support",
            Image: "3.jpg",
            "Internal ID": "xyz789-uvw456-rst123"
          },
          'cook123-ware456-set789': {
            Index: 4,
            Name: "Stainless Steel Cookware Set",
            Description: "<div><p><strong>Stainless Steel Cookware Set</strong> - 12 pieces</p></div>",
            Brand: "ChefPro",
            Category: "Kitchen Appliances",
            Price: 199,
            Currency: "USD",
            Stock: 28,
            EAN: 5555666677778,
            Color: "Silver",
            Size: "12-piece",
            Availability: "in stock",
            ShortDescription: "Professional-grade cookware for your kitchen",
            Image: "4.jpg",
            "Internal ID": "cook123-ware456-set789"
          },
          'game123-key456-board789': {
            Index: 5,
            Name: "Gaming Mechanical Keyboard",
            Description: "<div><p><strong>Gaming Mechanical Keyboard</strong> with RGB lighting</p></div>",
            Brand: "GamerPro",
            Category: "Electronics",
            Price: 159,
            Currency: "USD",
            Stock: 67,
            EAN: 1111222233334,
            Color: "Black",
            Size: "Full Size",
            Availability: "in stock",
            ShortDescription: "High-performance gaming keyboard with tactile switches",
            Image: "5.jpg",
            "Internal ID": "game123-key456-board789"
          },
          'coffee123-maker456-deluxe789': {
            Index: 6,
            Name: "Coffee Maker Deluxe",
            Description: "<div><p><strong>Coffee Maker Deluxe</strong> with programmable settings</p></div>",
            Brand: "BrewMaster",
            Category: "Kitchen Appliances",
            Price: 89,
            Currency: "USD",
            Stock: 34,
            EAN: 4444555566667,
            Color: "Black",
            Size: "Standard",
            Availability: "in stock",
            ShortDescription: "Programmable coffee maker with thermal carafe",
            Image: "6.jpg",
            "Internal ID": "coffee123-maker456-deluxe789"
          }
        };

        const mockProduct = mockProducts[productId];
        if (!mockProduct) {
          throw new Error('Product not found');
        }
        
        setProduct(mockProduct);
        setError(null);
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Failed to load product. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [params.id]);

  const getImageUrl = (imageName: string) => {
    return `https://images.pexels.com/photos/298863/pexels-photo-298863.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1`;
  };

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(price);
  };

  const getAvailabilityBadge = (availability: string) => {
    switch (availability.toLowerCase()) {
      case 'in stock':
        return <Badge variant="default" className="bg-green-100 text-green-800">In Stock</Badge>;
      case 'backorder':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Backorder</Badge>;
      case 'out of stock':
        return <Badge variant="destructive">Out of Stock</Badge>;
      default:
        return <Badge variant="outline">{availability}</Badge>;
    }
  };

  const handleAddToCart = () => {
    // Add to cart logic here
    console.log(`Added ${quantity} of ${product?.Name} to cart`);
  };

  const handleBuyNow = () => {
    // Buy now logic here
    console.log(`Buying ${quantity} of ${product?.Name}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-64 mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="w-full h-96 bg-gray-300 rounded-lg"></div>
                <div className="grid grid-cols-4 gap-2">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="w-full h-20 bg-gray-300 rounded"></div>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <div className="h-8 bg-gray-300 rounded w-3/4"></div>
                <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                <div className="h-6 bg-gray-300 rounded w-1/4"></div>
                <div className="h-32 bg-gray-300 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
          <p className="text-gray-600 mb-4">{error || 'The product you\'re looking for doesn\'t exist.'}</p>
          <Button onClick={() => router.push('/products')}>
            Back to Products
          </Button>
        </div>
      </div>
    );
  }

  // Mock images for demonstration
  const productImages = [
    getImageUrl(product.Image),
    'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1',
    'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1',
    'https://images.pexels.com/photos/298863/pexels-photo-298863.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1',
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back</span>
          </Button>
          <span className="text-gray-400">/</span>
          <span className="text-sm text-gray-600">Products</span>
          <span className="text-gray-400">/</span>
          <span className="text-sm text-gray-600">{product.Category}</span>
          <span className="text-gray-400">/</span>
          <span className="text-sm font-medium">{product.Name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="relative">
              <img
                src={productImages[selectedImage]}
                alt={product.Name}
                className="w-full h-96 object-cover rounded-lg shadow-lg"
              />
              <div className="absolute top-4 right-4 space-y-2">
                <Button size="sm" variant="outline" className="bg-white/80 hover:bg-white">
                  <Heart className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="outline" className="bg-white/80 hover:bg-white">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {productImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`w-full h-20 rounded-lg overflow-hidden border-2 transition-all ${
                    index === selectedImage ? 'border-blue-500' : 'border-gray-200'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.Name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.Name}</h1>
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                    />
                  ))}
                  <span className="text-sm text-gray-500 ml-2">(4.0) • 127 reviews</span>
                </div>
                <span className="text-sm text-gray-500">SKU: {product.EAN}</span>
              </div>
              <p className="text-gray-600 mb-4">{product.ShortDescription}</p>
              <div className="flex items-center space-x-4 mb-4">
                <Badge variant="outline">{product.Category}</Badge>
                <Badge variant="outline">{product.Brand}</Badge>
                {getAvailabilityBadge(product.Availability)}
              </div>
            </div>

            {/* Price and Actions */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-3xl font-bold text-gray-900">
                      {formatPrice(product.Price, product.Currency)}
                    </span>
                    <span className="text-sm text-gray-500 ml-2">
                      {product.Stock} in stock
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Color
                    </label>
                    <div className="flex items-center space-x-2">
                      <div
                        className="w-6 h-6 rounded-full border border-gray-300"
                        style={{ backgroundColor: product.Color.toLowerCase() }}
                      />
                      <span className="text-sm">{product.Color}</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Size
                    </label>
                    <span className="text-sm">{product.Size}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-4 mb-6">
                  <label className="block text-sm font-medium text-gray-700">
                    Quantity
                  </label>
                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    >
                      -
                    </Button>
                    <span className="px-4 py-2 border border-gray-300 rounded text-center min-w-16">
                      {quantity}
                    </span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setQuantity(Math.min(product.Stock, quantity + 1))}
                    >
                      +
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Button
                    onClick={handleAddToCart}
                    variant="outline"
                    className="w-full"
                    disabled={product.Availability === 'out of stock'}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add to Cart
                  </Button>
                  <Button
                    onClick={handleBuyNow}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    disabled={product.Availability === 'out of stock'}
                  >
                    Buy Now
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                <Shield className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Secure Payment</p>
              </div>
              <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                <Truck className="h-6 w-6 text-green-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Free Shipping</p>
              </div>
              <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                <RotateCcw className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">30-Day Returns</p>
              </div>
            </div>
          </div>
        </div>

        {/* Product Information Tabs */}
        <div className="mt-12">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="specifications">Specifications</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>
            
            <TabsContent value="description" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <div
                    className="prose max-w-none"
                    dangerouslySetInnerHTML={{ __html: product.Description }}
                  />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="specifications" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="font-medium">Brand:</span>
                        <span>{product.Brand}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Category:</span>
                        <span>{product.Category}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Color:</span>
                        <span>{product.Color}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Size:</span>
                        <span>{product.Size}</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="font-medium">EAN:</span>
                        <span>{product.EAN}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Stock:</span>
                        <span>{product.Stock} units</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Availability:</span>
                        <span>{product.Availability}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Internal ID:</span>
                        <span className="text-xs font-mono">{product['Internal ID']}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="reviews" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <div className="text-center py-8">
                    <p className="text-gray-600 mb-4">No reviews yet</p>
                    <Button variant="outline">Write a Review</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;