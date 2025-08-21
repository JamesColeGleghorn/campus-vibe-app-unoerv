
import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { colors } from '../styles/commonStyles';

interface CategoryFilterProps {
  selectedCategory: string | null;
  onCategoryChange: (category: string | null) => void;
}

const categories = [
  { key: null, label: 'All' },
  { key: 'restaurant', label: 'Restaurants' },
  { key: 'cafe', label: 'Cafes' },
  { key: 'gym', label: 'Gyms' },
  { key: 'park', label: 'Parks' },
  { key: 'library', label: 'Libraries' },
  { key: 'other', label: 'Other' },
];

export default function CategoryFilter({ selectedCategory, onCategoryChange }: CategoryFilterProps) {
  return (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      {categories.map((category) => (
        <TouchableOpacity
          key={category.key || 'all'}
          style={[
            styles.categoryButton,
            selectedCategory === category.key && styles.selectedCategory
          ]}
          onPress={() => {
            console.log('Category selected:', category.key);
            onCategoryChange(category.key);
          }}
        >
          <Text
            style={[
              styles.categoryText,
              selectedCategory === category.key && styles.selectedCategoryText
            ]}
          >
            {category.label}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  content: {
    paddingHorizontal: 16,
  },
  categoryButton: {
    backgroundColor: colors.backgroundAlt,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  selectedCategory: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  selectedCategoryText: {
    color: colors.background,
  },
});
