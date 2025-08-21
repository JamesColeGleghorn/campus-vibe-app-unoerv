
import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../styles/commonStyles';
import Icon from './Icon';

interface RatingStarsProps {
  rating: number;
  onRatingChange?: (rating: number) => void;
  size?: number;
  interactive?: boolean;
}

export default function RatingStars({ 
  rating, 
  onRatingChange, 
  size = 24, 
  interactive = false 
}: RatingStarsProps) {
  const handleStarPress = (starRating: number) => {
    if (interactive && onRatingChange) {
      console.log('Rating changed to:', starRating);
      onRatingChange(starRating);
    }
  };

  const renderStar = (index: number) => {
    const starRating = index + 1;
    const isFilled = starRating <= rating;
    
    if (interactive) {
      return (
        <TouchableOpacity
          key={index}
          onPress={() => handleStarPress(starRating)}
          style={styles.starButton}
        >
          <Icon
            name={isFilled ? 'star' : 'star-outline'}
            size={size}
            color={isFilled ? colors.accent : colors.grey}
          />
        </TouchableOpacity>
      );
    }

    return (
      <Icon
        key={index}
        name={isFilled ? 'star' : 'star-outline'}
        size={size}
        color={isFilled ? colors.accent : colors.grey}
      />
    );
  };

  return (
    <View style={styles.container}>
      {[0, 1, 2, 3, 4].map(renderStar)}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starButton: {
    padding: 2,
  },
});
