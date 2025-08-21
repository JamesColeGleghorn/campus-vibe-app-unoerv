
import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Location } from '../types/Location';
import { colors, commonStyles } from '../styles/commonStyles';
import Icon from './Icon';

interface LocationCardProps {
  location: Location;
}

export default function LocationCard({ location }: LocationCardProps) {
  const handlePress = () => {
    console.log('Navigating to location:', location.id);
    router.push(`/location/${location.id}`);
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

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Icon
          key={i}
          name={i <= rating ? 'star' : 'star-outline'}
          size={16}
          color={i <= rating ? colors.accent : colors.grey}
        />
      );
    }
    return stars;
  };

  return (
    <TouchableOpacity style={styles.card} onPress={handlePress}>
      <View style={styles.imageContainer}>
        {location.imageUrl ? (
          <Image source={{ uri: location.imageUrl }} style={styles.image} />
        ) : (
          <View style={styles.placeholderImage}>
            <Icon name={getCategoryIcon(location.category)} size={32} color={colors.grey} />
          </View>
        )}
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{location.category}</Text>
        </View>
      </View>
      
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.name} numberOfLines={1}>{location.name}</Text>
          {location.distance && (
            <Text style={styles.distance}>{location.distance}mi</Text>
          )}
        </View>
        
        <Text style={styles.address} numberOfLines={1}>{location.address}</Text>
        
        <View style={styles.ratingContainer}>
          <View style={styles.stars}>
            {renderStars(Math.round(location.averageRating))}
          </View>
          <Text style={styles.ratingText}>
            {location.averageRating.toFixed(1)} ({location.totalRatings})
          </Text>
        </View>
        
        <Text style={styles.description} numberOfLines={2}>
          {location.description}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    marginBottom: 16,
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
    elevation: 4,
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'relative',
    height: 160,
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
    top: 12,
    right: 12,
    backgroundColor: colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    color: colors.background,
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    flex: 1,
  },
  distance: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  address: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  stars: {
    flexDirection: 'row',
    marginRight: 8,
  },
  ratingText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  description: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
});
