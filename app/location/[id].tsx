
import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, Image, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { commonStyles, colors, buttonStyles } from '../../styles/commonStyles';
import { mockLocations, mockRatings } from '../../data/mockData';
import RatingStars from '../../components/RatingStars';
import Button from '../../components/Button';
import Icon from '../../components/Icon';

export default function LocationDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [showAddReview, setShowAddReview] = useState(false);

  const location = useMemo(() => {
    return mockLocations.find(loc => loc.id === id);
  }, [id]);

  const locationRatings = useMemo(() => {
    return mockRatings.filter(rating => rating.locationId === id);
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

  const handleAddReview = () => {
    console.log('Add review for location:', location.id);
    router.push(`/add-review/${location.id}`);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'restaurant': return 'restaurant';
      case 'cafe': return 'cafe';
      case 'gym': return 'fitness';
      case 'park': return 'leaf';
      case 'library': return 'library';
      default: return 'location';
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <SafeAreaView style={commonStyles.wrapper}>
      <View style={commonStyles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Icon name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Location Details</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.imageContainer}>
            {location.imageUrl ? (
              <Image source={{ uri: location.imageUrl }} style={styles.image} />
            ) : (
              <View style={styles.placeholderImage}>
                <Icon name={getCategoryIcon(location.category)} size={48} color={colors.grey} />
              </View>
            )}
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{location.category}</Text>
            </View>
          </View>

          <View style={styles.content}>
            <View style={styles.titleSection}>
              <Text style={styles.locationName}>{location.name}</Text>
              <Text style={styles.address}>{location.address}</Text>
              {location.distance && (
                <Text style={styles.distance}>{location.distance} miles away</Text>
              )}
            </View>

            <View style={styles.ratingSection}>
              <View style={styles.overallRating}>
                <Text style={styles.ratingNumber}>{location.averageRating.toFixed(1)}</Text>
                <View style={styles.ratingDetails}>
                  <RatingStars rating={Math.round(location.averageRating)} size={20} />
                  <Text style={styles.ratingCount}>
                    {location.totalRatings} review{location.totalRatings !== 1 ? 's' : ''}
                  </Text>
                </View>
              </View>
              <Button
                text="Add Review"
                onPress={handleAddReview}
                style={styles.addReviewButton}
                textStyle={styles.addReviewText}
              />
            </View>

            <View style={styles.descriptionSection}>
              <Text style={styles.description}>{location.description}</Text>
            </View>

            <View style={styles.reviewsSection}>
              <Text style={styles.sectionTitle}>Recent Reviews</Text>
              
              {locationRatings.length === 0 ? (
                <View style={styles.noReviews}>
                  <Icon name="chatbubble-outline" size={32} color={colors.grey} />
                  <Text style={styles.noReviewsText}>No reviews yet</Text>
                  <Text style={styles.noReviewsSubtext}>
                    Be the first to share your vibe about this place!
                  </Text>
                </View>
              ) : (
                locationRatings.map((rating) => (
                  <View key={rating.id} style={styles.reviewCard}>
                    <View style={styles.reviewHeader}>
                      <View style={styles.reviewerInfo}>
                        <Text style={styles.reviewerName}>{rating.userName}</Text>
                        <Text style={styles.reviewDate}>{formatDate(rating.createdAt)}</Text>
                      </View>
                      <View style={styles.reviewRating}>
                        <RatingStars rating={rating.rating} size={16} />
                        <Text style={styles.vibeRating}>Vibe: {rating.vibeRating}/5</Text>
                      </View>
                    </View>
                    
                    <Text style={styles.reviewComment}>{rating.comment}</Text>
                    
                    {rating.tags.length > 0 && (
                      <View style={styles.tagsContainer}>
                        {rating.tags.map((tag, index) => (
                          <View key={index} style={styles.tag}>
                            <Text style={styles.tagText}>{tag}</Text>
                          </View>
                        ))}
                      </View>
                    )}
                  </View>
                ))
              )}
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
  imageContainer: {
    position: 'relative',
    height: 250,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.backgroundAlt,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  categoryText: {
    color: colors.background,
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  content: {
    padding: 16,
  },
  titleSection: {
    marginBottom: 20,
  },
  locationName: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  address: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  distance: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  ratingSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.backgroundAlt,
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  overallRating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingNumber: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.accent,
    marginRight: 16,
  },
  ratingDetails: {
    alignItems: 'flex-start',
  },
  ratingCount: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },
  addReviewButton: {
    backgroundColor: colors.accent,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  addReviewText: {
    fontSize: 14,
    fontWeight: '600',
  },
  descriptionSection: {
    marginBottom: 24,
  },
  description: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 24,
  },
  reviewsSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  noReviews: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  noReviewsText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginTop: 12,
    marginBottom: 8,
  },
  noReviewsSubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  reviewCard: {
    backgroundColor: colors.card,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  reviewerInfo: {
    flex: 1,
  },
  reviewerName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  reviewDate: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  reviewRating: {
    alignItems: 'flex-end',
  },
  vibeRating: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
  },
  reviewComment: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
    marginBottom: 12,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: colors.backgroundAlt,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 4,
  },
  tagText: {
    fontSize: 12,
    color: colors.text,
    fontWeight: '500',
  },
});
