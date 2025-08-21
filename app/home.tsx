
import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet, SafeAreaView } from 'react-native';
import { router } from 'expo-router';
import { commonStyles, colors, buttonStyles } from '../styles/commonStyles';
import { mockLocations } from '../data/mockData';
import LocationCard from '../components/LocationCard';
import SearchBar from '../components/SearchBar';
import CategoryFilter from '../components/CategoryFilter';
import Button from '../components/Button';
import Icon from '../components/Icon';

export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

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
  }, [searchQuery, selectedCategory]);

  const handleAddLocation = () => {
    console.log('Add new location pressed');
    router.push('/add-location');
  };

  return (
    <SafeAreaView style={commonStyles.wrapper}>
      <View style={commonStyles.container}>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text style={commonStyles.title}>Vibe Check</Text>
            <Text style={commonStyles.textSecondary}>
              Discover and rate the vibe of places around you
            </Text>
          </View>
          <Button
            text="Add Place"
            onPress={handleAddLocation}
            style={styles.addButton}
            textStyle={styles.addButtonText}
          />
        </View>

        <View style={styles.searchContainer}>
          <SearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search for places..."
          />
        </View>

        <CategoryFilter
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />

        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.resultsHeader}>
            <Text style={styles.resultsText}>
              {filteredLocations.length} place{filteredLocations.length !== 1 ? 's' : ''} found
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
  addButton: {
    backgroundColor: colors.accent,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginLeft: 16,
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  searchContainer: {
    paddingHorizontal: 16,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  resultsHeader: {
    marginBottom: 16,
  },
  resultsText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
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
