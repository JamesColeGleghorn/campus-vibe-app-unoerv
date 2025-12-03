
import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, SafeAreaView, TouchableOpacity, RefreshControl } from 'react-native';
import { router } from 'expo-router';
import { commonStyles, colors, buttonStyles } from '../styles/commonStyles';
import { mockLocations } from '../data/mockData';
import { useAuth } from '../contexts/AuthContext';
import LocationCard from '../components/LocationCard';
import SearchBar from '../components/SearchBar';
import CategoryFilter from '../components/CategoryFilter';
import Button from '../components/Button';
import Icon from '../components/Icon';

export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const { user } = useAuth();

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      console.log('Simulating real-time vibe update...');
      setLastUpdate(new Date());
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const filteredLocations = useMemo(() => {
    let filtered = mockLocations;

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(location =>
        location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        location.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        location.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter(location => location.category === selectedCategory);
    }

    // Sort by rating and distance
    return filtered.sort((a, b) => {
      const ratingDiff = b.averageRating - a.averageRating;
      if (Math.abs(ratingDiff) > 0.1) return ratingDiff;
      return (a.distance || 0) - (b.distance || 0);
    });
  }, [searchQuery, selectedCategory, lastUpdate]);

  const handleRefresh = async () => {
    console.log('Refreshing vibe data...');
    setRefreshing(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setLastUpdate(new Date());
    setRefreshing(false);
  };

  const handleAddLocation = () => {
    console.log('Add new location pressed');
    router.push('/add-location');
  };

  const handleProfile = () => {
    console.log('Navigate to profile');
    router.push('/profile');
  };

  const handleSearch = () => {
    console.log('Navigate to search');
    router.push('/search');
  };

  return (
    <SafeAreaView style={commonStyles.wrapper}>
      <View style={commonStyles.container}>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text style={commonStyles.title}>Vibe Check</Text>
            <Text style={commonStyles.textSecondary}>
              Hey {user?.name?.split(' ')[0] || 'there'}! Discover places around you
            </Text>
          </View>
          <TouchableOpacity onPress={handleProfile} style={styles.profileButton}>
            <Icon name="person-circle" size={32} color={colors.primary} />
          </TouchableOpacity>
        </View>

        <View style={styles.searchContainer}>
          <TouchableOpacity onPress={handleSearch} style={styles.searchTouchable}>
            <SearchBar
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search for places..."
            />
          </TouchableOpacity>
        </View>

        <CategoryFilter
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />

        <View style={styles.actionsBar}>
          <Button
            text="Add Place"
            onPress={handleAddLocation}
            style={styles.addButton}
            textStyle={styles.addButtonText}
          />
          <View style={styles.liveIndicator}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>Live Updates</Text>
          </View>
        </View>

        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={colors.primary}
            />
          }
        >
          <View style={styles.resultsHeader}>
            <Text style={styles.resultsText}>
              {filteredLocations.length} place{filteredLocations.length !== 1 ? 's' : ''} found
            </Text>
            <Text style={styles.updateText}>
              Updated {Math.floor((Date.now() - lastUpdate.getTime()) / 1000)}s ago
            </Text>
          </View>

          {filteredLocations.map((location) => (
            <LocationCard key={location.id} location={location} />
          ))}

          {filteredLocations.length === 0 && (
            <View style={styles.emptyState}>
              <Icon name="search" size={48} color={colors.grey} />
              <Text style={styles.emptyTitle}>No places found</Text>
              <Text style={styles.emptyText}>
                Try adjusting your search or add a new place to get started
              </Text>
              <Button
                text="Add First Place"
                onPress={handleAddLocation}
                style={[buttonStyles.primary, styles.emptyButton]}
              />
            </View>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  titleContainer: {
    flex: 1,
  },
  profileButton: {
    padding: 4,
    marginLeft: 16,
  },
  searchContainer: {
    paddingHorizontal: 16,
  },
  searchTouchable: {
    width: '100%',
  },
  actionsBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  addButton: {
    backgroundColor: colors.accent,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundAlt,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.success,
    marginRight: 6,
  },
  liveText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.text,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  resultsText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  updateText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  emptyButton: {
    paddingHorizontal: 32,
  },
});
