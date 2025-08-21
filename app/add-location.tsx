
import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet, SafeAreaView, TouchableOpacity, Alert } from 'react-native';
import { router } from 'expo-router';
import { commonStyles, colors, buttonStyles } from '../styles/commonStyles';
import Button from '../components/Button';
import Icon from '../components/Icon';

const categories = [
  { key: 'restaurant', label: 'Restaurant', icon: 'restaurant' },
  { key: 'cafe', label: 'Cafe', icon: 'cafe' },
  { key: 'gym', label: 'Gym', icon: 'fitness' },
  { key: 'park', label: 'Park', icon: 'leaf' },
  { key: 'library', label: 'Library', icon: 'library' },
  { key: 'other', label: 'Other', icon: 'location' },
];

export default function AddLocationScreen() {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  const handleSubmit = () => {
    if (!name.trim() || !address.trim() || !selectedCategory) {
      Alert.alert('Missing Information', 'Please fill in all required fields.');
      return;
    }

    console.log('Adding new location:', {
      name: name.trim(),
      address: address.trim(),
      description: description.trim(),
      category: selectedCategory,
    });

    Alert.alert(
      'Location Added!',
      'Your location has been added successfully. You can now rate its vibe!',
      [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]
    );
  };

  return (
    <SafeAreaView style={commonStyles.wrapper}>
      <View style={commonStyles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Icon name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Add New Place</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            <Text style={styles.subtitle}>
              Share a new place with the community and be the first to rate its vibe!
            </Text>

            <View style={styles.section}>
              <Text style={styles.label}>Place Name *</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Enter the name of the place"
                placeholderTextColor={colors.textSecondary}
              />
            </View>

            <View style={styles.section}>
              <Text style={styles.label}>Address *</Text>
              <TextInput
                style={styles.input}
                value={address}
                onChangeText={setAddress}
                placeholder="Enter the address"
                placeholderTextColor={colors.textSecondary}
              />
            </View>

            <View style={styles.section}>
              <Text style={styles.label}>Category *</Text>
              <View style={styles.categoryGrid}>
                {categories.map((category) => (
                  <TouchableOpacity
                    key={category.key}
                    style={[
                      styles.categoryButton,
                      selectedCategory === category.key && styles.selectedCategory
                    ]}
                    onPress={() => {
                      console.log('Category selected:', category.key);
                      setSelectedCategory(category.key);
                    }}
                  >
                    <Icon
                      name={category.icon as any}
                      size={24}
                      color={selectedCategory === category.key ? colors.background : colors.text}
                    />
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
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.label}>Description</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={description}
                onChangeText={setDescription}
                placeholder="Tell others what makes this place special..."
                placeholderTextColor={colors.textSecondary}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            <View style={styles.buttonContainer}>
              <Button
                text="Add Place"
                onPress={handleSubmit}
                style={[buttonStyles.primary, styles.submitButton]}
              />
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    lineHeight: 24,
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.backgroundAlt,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.text,
  },
  textArea: {
    height: 100,
    paddingTop: 12,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  categoryButton: {
    backgroundColor: colors.backgroundAlt,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    minWidth: '30%',
    flex: 1,
  },
  selectedCategory: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
    marginTop: 8,
  },
  selectedCategoryText: {
    color: colors.background,
  },
  buttonContainer: {
    marginTop: 20,
    marginBottom: 40,
  },
  submitButton: {
    paddingVertical: 16,
  },
});
