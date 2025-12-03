
import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet, SafeAreaView, TouchableOpacity, TextInput } from 'react-native';
import { router } from 'expo-router';
import { commonStyles, colors } from '../styles/commonStyles';
import { mockLocations } from '../data/mockData';
import LocationCard from '../components/LocationCard';
import Icon from '../components/Icon';

const popularSearches = [
  'Coffee shops',
  'Gyms near me',
  'Parks',
  'Study spots',
  'Late night food',
  'Quiet places',
];

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) {
      return [];
    }

    const query = searchQuery.toLowerCase();
    return mockLocations.filter(location =>
      location.name.toLowerCase().includes(query) ||
      location.address.toLowerCase().includes(query) ||
      location.description.toLowerCase().includes(query) ||
      location.category.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const handleSearch = (query: string) => {
    console.log('Searching for:', query);
    setSearchQuery(query);
    setIsSearching(true);
    
    // Add to search history
    if (query.trim() && !searchHistory.includes(query)) {
      setSearchHistory(prev => [query, ...prev.slice(0, 4)]);
    }
  };

  const handleClearSearch = () => {
    console.log('Clearing search');
    setSearchQuery('');
    setIsSearching(false);
  };

  const handlePopularSearch = (search: string) => {
    console.log('Popular search selected:', search);
    handleSearch(search);
  };

  return (
    <SafeAreaView style={commonStyles.wrapper}>
      <View style={commonStyles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Icon name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <View style={styles.searchInputContainer}>
            <Icon name="search" size={20} color={colors.textSecondary} style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search places, categories..."
              placeholderTextColor={colors.textSecondary}
              autoFocus
              returnKeyType="search"
              onSubmitEditing={() => handleSearch(searchQuery)}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={handleClearSearch} style={styles.clearButton}>
                <Icon name="close-circle" size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {!isSearching && searchQuery.length === 0 && (
            <View style={styles.content}>
              {searchHistory.length > 0 && (
                <View style={styles.section}>
                  <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Recent Searches</Text>
                    <TouchableOpacity onPress={() => setSearchHistory([])}>
                      <Text style={styles.clearText}>Clear</Text>
                    </TouchableOpacity>
                  </View>
                  {searchHistory.map((item, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.historyItem}
                      onPress={() => handleSearch(item)}
                    >
                      <Icon name="time" size={20} color={colors.textSecondary} />
                      <Text style={styles.historyText}>{item}</Text>
                      <Icon name="arrow-forward" size={20} color={colors.textSecondary} />
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Popular Searches</Text>
                <View style={styles.popularGrid}>
                  {popularSearches.map((search, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.popularChip}
                      onPress={() => handlePopularSearch(search)}
                    >
                      <Icon name="trending-up" size={16} color={colors.primary} />
                      <Text style={styles.popularText}>{search}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Search Tips</Text>
                <View style={styles.tipCard}>
                  <Icon name="bulb" size={24} color={colors.accent} />
                  <View style={styles.tipContent}>
                    <Text style={styles.tipTitle}>Find the perfect vibe</Text>
                    <Text style={styles.tipText}>
                      Search by place name, category, or even vibe tags like &quot;quiet&quot; or &quot;energetic&quot;
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          )}

          {searchQuery.length > 0 && (
            <View style={styles.resultsContainer}>
              <View style={styles.resultsHeader}>
                <Text style={styles.resultsText}>
                  {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} found
                </Text>
              </View>

              {searchResults.length > 0 ? (
                searchResults.map((location) => (
                  <LocationCard key={location.id} location={location} />
                ))
              ) : (
                <View style={styles.noResults}>
                  <Icon name="search" size={48} color={colors.grey} />
                  <Text style={styles.noResultsTitle}>No results found</Text>
                  <Text style={styles.noResultsText}>
                    Try searching with different keywords or browse popular searches above
                  </Text>
                </View>
              )}
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
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundAlt,
    borderRadius: 12,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    paddingVertical: 10,
  },
  clearButton: {
    padding: 4,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  clearText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.primary,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundAlt,
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  historyText: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    marginLeft: 12,
  },
  popularGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  popularChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundAlt,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  popularText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
    marginLeft: 6,
  },
  tipCard: {
    flexDirection: 'row',
    backgroundColor: colors.backgroundAlt,
    padding: 16,
    borderRadius: 12,
  },
  tipContent: {
    flex: 1,
    marginLeft: 12,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  tipText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  resultsContainer: {
    padding: 16,
  },
  resultsHeader: {
    marginBottom: 16,
  },
  resultsText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  noResults: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  noResultsTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  noResultsText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
});
