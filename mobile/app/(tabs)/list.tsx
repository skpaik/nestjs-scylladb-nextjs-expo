import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ChevronLeft, ChevronRight, Filter } from 'lucide-react-native';
import { ApiService } from '@/services/api';
import { Product, ApiResponse } from '@/types/Product';
import { ProductCard } from '@/components/ProductCard';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { SearchBar } from '@/components/SearchBar';

export default function ListScreen() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const router = useRouter();

  const loadProducts = async (page: number = 1, query: string = '') => {
    try {
      setLoading(page === 1);
      let response: ApiResponse<Product[]>;
      
      if (query.trim()) {
        response = await ApiService.searchProducts(query, page, 100);
      } else {
        response = await ApiService.getProducts(page, 100);
      }
      
      setProducts(response.data);
      setTotalPages(Math.ceil(response.total / 100));
      setHasMore(response.hasMore);
      setCurrentPage(page);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
      setIsSearching(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadProducts(1, searchQuery);
    setRefreshing(false);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setIsSearching(true);
    loadProducts(1, query);
  };

  const clearSearch = () => {
    setSearchQuery('');
    loadProducts(1, '');
  };

  const navigateToProduct = (productId: string) => {
    router.push(`/details?id=${productId}`);
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      loadProducts(currentPage + 1, searchQuery);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      loadProducts(currentPage - 1, searchQuery);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const renderProduct = ({ item }: { item: Product }) => (
    <View style={styles.productContainer}>
      <ProductCard 
        product={item} 
        onPress={() => navigateToProduct(item.id)}
        size="large"
      />
    </View>
  );

  if (loading && currentPage === 1) {
    return <LoadingSpinner />;
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>All Products</Text>
        <TouchableOpacity style={styles.filterButton}>
          <Filter size={20} color="#3B82F6" />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <SearchBar 
        value={searchQuery}
        onChangeText={handleSearch}
        onClear={clearSearch}
      />

      {/* Results Info */}
      <View style={styles.resultsInfo}>
        <Text style={styles.resultsText}>
          {searchQuery ? `Search results for "${searchQuery}"` : 'All Products'}
        </Text>
        <Text style={styles.pageInfo}>
          Page {currentPage} of {totalPages}
        </Text>
      </View>

      {/* Products List */}
      <FlatList
        data={products}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id}
        style={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No products found</Text>
          </View>
        }
      />

      {/* Pagination */}
      {totalPages > 1 && (
        <View style={styles.pagination}>
          <TouchableOpacity
            style={[styles.paginationButton, currentPage === 1 && styles.paginationButtonDisabled]}
            onPress={goToPreviousPage}
            disabled={currentPage === 1}
          >
            <ChevronLeft size={20} color={currentPage === 1 ? '#9CA3AF' : '#3B82F6'} />
            <Text style={[styles.paginationText, currentPage === 1 && styles.paginationTextDisabled]}>
              Previous
            </Text>
          </TouchableOpacity>

          <View style={styles.pageNumbers}>
            <Text style={styles.pageNumbersText}>
              {currentPage} / {totalPages}
            </Text>
          </View>

          <TouchableOpacity
            style={[styles.paginationButton, currentPage === totalPages && styles.paginationButtonDisabled]}
            onPress={goToNextPage}
            disabled={currentPage === totalPages}
          >
            <Text style={[styles.paginationText, currentPage === totalPages && styles.paginationTextDisabled]}>
              Next
            </Text>
            <ChevronRight size={20} color={currentPage === totalPages ? '#9CA3AF' : '#3B82F6'} />
          </TouchableOpacity>
        </View>
      )}

      {/* Loading Overlay */}
      {isSearching && (
        <View style={styles.loadingOverlay}>
          <LoadingSpinner size="small" />
        </View>
      )}
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
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
  },
  filterButton: {
    padding: 8,
    backgroundColor: '#EBF4FF',
    borderRadius: 12,
  },
  resultsInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  resultsText: {
    fontSize: 14,
    color: '#6B7280',
  },
  pageInfo: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  list: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  productContainer: {
    paddingHorizontal: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  paginationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
  },
  paginationButtonDisabled: {
    opacity: 0.5,
  },
  paginationText: {
    fontSize: 14,
    color: '#3B82F6',
    fontWeight: '500',
    marginHorizontal: 4,
  },
  paginationTextDisabled: {
    color: '#9CA3AF',
  },
  pageNumbers: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#3B82F6',
    borderRadius: 8,
  },
  pageNumbersText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});