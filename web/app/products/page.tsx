'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Filter, Grid, List, SortAsc } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import ProductCard from '@/components/ui/ProductCard';
import Pagination from '@/components/ui/Pagination';
import { Product, PaginatedResponse } from '@/types/product';
import { productApi } from '@/lib/api';

const ProductsPage = () => {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('name');
  const [filterCategory, setFilterCategory] = useState('all');

  const itemsPerPage = 12;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        
        // Get search and filter parameters
        const searchQuery = searchParams.get('search') || '';
        const category = searchParams.get('category') || filterCategory;
        
        // Mock data for demonstration
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
          },
          {
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
          {
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
        ];

        // Apply filters
        let filteredProducts = mockProducts;
        
        if (category && category !== 'all') {
          filteredProducts = filteredProducts.filter(p => 
            p.Category.toLowerCase() === category.toLowerCase()
          );
        }

        if (searchQuery) {
          filteredProducts = filteredProducts.filter(p =>
            p.Name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.Brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.Category.toLowerCase().includes(searchQuery.toLowerCase())
          );
        }

        // Apply sorting
        filteredProducts.sort((a, b) => {
          switch (sortBy) {
            case 'price-low':
              return a.Price - b.Price;
            case 'price-high':
              return b.Price - a.Price;
            case 'name':
              return a.Name.localeCompare(b.Name);
            default:
              return 0;
          }
        });

        // Pagination
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

        setProducts(paginatedProducts);
        setTotalProducts(filteredProducts.length);
        setTotalPages(Math.ceil(filteredProducts.length / itemsPerPage));
        setError(null);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [currentPage, sortBy, filterCategory, searchParams]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'electronics', label: 'Electronics' },
    { value: 'kitchen appliances', label: 'Kitchen Appliances' },
    { value: 'furniture', label: 'Furniture' },
    { value: 'home', label: 'Home & Garden' },
  ];

  const sortOptions = [
    { value: 'name', label: 'Name (A-Z)' },
    { value: 'price-low', label: 'Price (Low to High)' },
    { value: 'price-high', label: 'Price (High to Low)' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Products</h1>
          <p className="text-gray-600">
            Discover our complete collection of quality products
          </p>
        </div>

        {/* Filters and Controls */}
        <Card className="mb-8">
          <CardContent className="p-4">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    {sortOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  {totalProducts} products found
                </span>
                <div className="flex items-center space-x-2 ml-4">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Products Grid/List */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(12)].map((_, index) => (
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
          <div className="text-center py-12">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">No products found matching your criteria.</p>
            <Button onClick={() => {
              setFilterCategory('all');
              setCurrentPage(1);
            }}>
              Clear Filters
            </Button>
          </div>
        ) : (
          <div className={`grid gap-6 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
              : 'grid-cols-1'
          }`}>
            {products.map((product) => (
              <ProductCard key={product['Internal ID']} product={product} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {!loading && !error && totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </div>
  );
};

export default ProductsPage;