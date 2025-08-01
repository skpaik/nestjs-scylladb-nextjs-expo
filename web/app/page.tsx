'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, TrendingUp, Shield, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import ImageSlider from '@/components/ui/ImageSlider';
import ProductCard from '@/components/ui/ProductCard';
import { Product } from '@/types/product';
import { productApi } from '@/lib/api';

const HomePage = () => {
  const [latestProducts, setLatestProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLatestProducts = async () => {
      try {
        setLoading(true);
        // For demo purposes, we'll use mock data since backend isn't available
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
            Image: "1.jpg",
            "Internal ID": "6ce4b628-2bcc-4829-8c64-b3a71bf09a60"
          },
          {
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
          {
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
          {
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
          }
        ];

        setLatestProducts(mockProducts);
        setError(null);
      } catch (err) {
        console.error('Error fetching latest products:', err);
        setError('Failed to load products. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchLatestProducts();
  }, []);

  const features = [
    {
      icon: <Shield className="h-6 w-6 text-blue-600" />,
      title: "Secure Shopping",
      description: "Your data is protected with enterprise-grade security"
    },
    {
      icon: <Truck className="h-6 w-6 text-green-600" />,
      title: "Fast Delivery",
      description: "Free shipping on orders over $50 with 2-day delivery"
    },
    {
      icon: <TrendingUp className="h-6 w-6 text-purple-600" />,
      title: "Quality Products",
      description: "Curated selection of premium products from trusted brands"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Image Slider */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <ImageSlider />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className="flex justify-center mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Products Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Latest Products</h2>
              <p className="text-gray-600 mt-2">Discover our newest arrivals and trending items</p>
            </div>
            <Link href="/products">
              <Button variant="outline" className="flex items-center space-x-2">
                <span>View All Products</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md animate-pulse">
                  <div className="w-full h-48 bg-gray-300 rounded-t-lg"></div>
                  <div className="p-4">
                    <div className="h-4 bg-gray-300 rounded mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-600 mb-4">{error}</p>
              <Button onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {latestProducts.map((product) => (
                <ProductCard key={product['Internal ID']} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Start Shopping?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of satisfied customers and discover amazing products today
          </p>
          <Link href="/products">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              Browse Products
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;