'use client';

import React from 'react';
import Link from 'next/link';
import { ShoppingCart, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Product } from '@/types/product';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const getImageUrl = (imageName: string) => {
    return `https://images.pexels.com/photos/298863/pexels-photo-298863.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=1`;
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

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 group">
      <div className="relative overflow-hidden rounded-t-lg">
        <img
          src={getImageUrl(product.Image)}
          alt={product.Name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.currentTarget.src = 'https://images.pexels.com/photos/298863/pexels-photo-298863.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=1';
          }}
        />
        <div className="absolute top-2 left-2">
          {getAvailabilityBadge(product.Availability)}
        </div>
        <div className="absolute top-2 right-2">
          <Badge variant="outline" className="bg-white/90">
            {product.Category}
          </Badge>
        </div>
      </div>

      <div className="p-4">
        <Link href={`/products/${product['Internal ID']}`}>
          <h3 className="font-semibold text-lg text-gray-900 hover:text-blue-600 transition-colors mb-2 line-clamp-2">
            {product.Name}
          </h3>
        </Link>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {product.ShortDescription}
        </p>

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-1">
            <span className="text-sm text-gray-500">Brand:</span>
            <span className="text-sm font-medium">{product.Brand}</span>
          </div>
          <div className="flex items-center space-x-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
              />
            ))}
            <span className="text-sm text-gray-500">(4.0)</span>
          </div>
        </div>

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">Color:</span>
            <div
              className="w-4 h-4 rounded-full border border-gray-300"
              style={{ backgroundColor: product.Color.toLowerCase() }}
            />
            <span className="text-sm">{product.Color}</span>
          </div>
          <span className="text-sm text-gray-500">Size: {product.Size}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-gray-900">
              {formatPrice(product.Price, product.Currency)}
            </span>
            <span className="text-sm text-gray-500">
              {product.Stock} in stock
            </span>
          </div>
          <Button
            size="sm"
            className="bg-blue-600 hover:bg-blue-700 text-white"
            disabled={product.Availability === 'out of stock'}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;