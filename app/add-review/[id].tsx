
import React, { useState, useMemo } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet, SafeAreaView, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { commonStyles, colors, buttonStyles } from '../../styles/commonStyles';
import { mockLocations } from '../../data/mockData';
import RatingStars from '../../components/RatingStars';
import Button from '../../components/Button';
import Icon from '../../components/Icon';

const vibeOptions = [
  { key: 'quiet', label: 'Quiet', icon: 'volume-mute' },
  { key: 'lively', label: 'Lively', icon: 'musical-notes' },
  { key: 'cozy', label: 'Cozy', icon: 'home' },
  { key: 'spacious', label: 'Spacious', icon: 'resize' },
  { key: 'friendly', label: 'Friendly', icon: 'happy' },
  { key: 'professional', label: 'Professional', icon: 'business' },
  { key: 'trendy', label: 'Trendy', icon: 'trending-up' },
  { key: 'relaxing', label: 'Relaxing', icon: 'leaf' },
  { key: 'energetic', label: 'Energetic', icon: 'flash' },
  { key: 'romantic', label: 'Romantic', icon: 'heart' },
  { key: 'family-friendly', label: 'Family Friendly', icon: 'people' },
  { key: 'clean', label: 'Clean', icon: 'checkmark-circle' },
];

export default function AddReviewScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [overallRating, setOverallRating] = useState(0);
  const [vibeRating, setVibeRating] = useState(0);
  const [comment, setComment] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const location = useMemo(() => {
    return mockLocations.find(loc => loc.id === id);
  }, [id]);

  if (!location) {
    return (
      <SafeAreaView style={commonStyles.wrapper}>
        <View style={[commonStyles.container, commonStyles.center]}>
          <Text style={commonStyles.title}>Location not found</Text>
          <Button
            text="Go Back"
            onPress={() => router.back()}
            style={buttonStyles.primary}
          />
        </View>
      </SafeAreaView>
    );
  }

  const handleTagToggle = (tag: string) => {
    console.log('Tag toggled:', tag);
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handleSubmit = () => {
    if (overallRating === 0 || vibeRating === 0) {
      Alert.alert('Missing Rating', 'Please provide both overall and vibe ratings.');
      return;
    }

    if (!comment.trim()) {
      Alert.alert('Missing Comment', 'Please share your thoughts about this place.');
      return;
    }

    console.log('Submitting review:', {
      locationId: id,
      overallRating,
      vibeRating,
      comment: comment.trim(),
      tags: selectedTags,
    });

    Alert.alert(
      'Review Added!',
      'Thank you for sharing your vibe! Your review helps others discover great places.',
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
          <Text style={styles.headerTitle}>Add Review</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            <View style={styles.locationInfo}>
              <Text style={styles.locationName}>{location.name}</Text>
              <Text style={styles.locationAddress}>{location.address}</Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Overall Rating</Text>
              <Text style={styles.sectionSubtitle}>How would you rate this place overall?</Text>
              <View style={styles.ratingContainer}>
                <RatingStars
                  rating={overallRating}
                  onRatingChange={setOverallRating}
                  interactive
                  size={32}
                />
                <Text style={styles.ratingText}>
                  {overallRating > 0 ? `${overallRating}/5` : 'Tap to rate'}
                </Text>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Vibe Rating</Text>
              <Text style={styles.sectionSubtitle}>How&apos;s the vibe and atmosphere?</Text>
              <View style={styles.ratingContainer}>
                <RatingStars
                  rating={vibeRating}
                  onRatingChange={setVibeRating}
                  interactive
                  size={32}
                />
                <Text style={styles.ratingText}>
                  {vibeRating > 0 ? `${vibeRating}/5` : 'Tap to rate'}
                </Text>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Describe the Vibe</Text>
              <Text style={styles.sectionSubtitle}>Select tags that describe this place</Text>
              <View style={styles.tagsGrid}>
                {vibeOptions.map((option) => (
                  <TouchableOpacity
                    key={option.key}
                    style={[
                      styles.tagButton,
                      selectedTags.includes(option.key) && styles.selectedTag
                    ]}
                    onPress={() => handleTagToggle(option.key)}
                  >
                    <Icon
                      name={option.icon as any}
                      size={16}
                      color={selectedTags.includes(option.key) ? colors.background : colors.text}
                    />
                    <Text
                      style={[
                        styles.tagText,
                        selectedTags.includes(option.key) && styles.selectedTagText
                      ]}
                    >
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Your Review</Text>
              <Text style={styles.sectionSubtitle}>Share your experience and thoughts</Text>
              <TextInput
                style={styles.textArea}
                value={comment}
                onChangeText={setComment}
                placeholder="Tell others about your experience at this place. What made it special? How was the atmosphere?"
                placeholderTextColor={colors.textSecondary}
                multiline
                numberOfLines={6}
                textAlignVertical="top"
              />
            </View>

            <View style={styles.buttonContainer}>
              <Button
                text="Submit Review"
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
  locationInfo: {
    backgroundColor: colors.backgroundAlt,
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  locationName: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  locationAddress: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 16,
  },
  ratingContainer: {
    alignItems: 'center',
    backgroundColor: colors.backgroundAlt,
    padding: 20,
    borderRadius: 12,
  },
  ratingText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginTop: 12,
  },
  tagsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tagButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundAlt,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 8,
  },
  selectedTag: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  tagText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
    marginLeft: 6,
  },
  selectedTagText: {
    color: colors.background,
  },
  textArea: {
    backgroundColor: colors.backgroundAlt,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.text,
    height: 120,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    marginTop: 20,
    marginBottom: 40,
  },
  submitButton: {
    paddingVertical: 16,
  },
});
