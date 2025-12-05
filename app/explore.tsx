
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, SafeAreaView, TouchableOpacity, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { commonStyles, colors } from '../styles/commonStyles';
import { mockLocations } from '../data/mockData';
import Icon from '../components/Icon';

const { width, height } = Dimensions.get('window');

export default function ExploreScreen() {
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState({ latitude: 37.7749, longitude: -122.4194 });

  // Simulate geofence detection
  const [nearbyLocations, setNearbyLocations] = useState<string[]>([]);

  useEffect(() => {
    console.log('Checking geofences...');
    // Simulate checking if user is within geofence
    const nearby = mockLocations.filter(loc => {
      if (!loc.coordinates) return false;
      const distance = calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        loc.coordinates.latitude,
        loc.coordinates.longitude
      );
      return distance < (loc.geofenceRadius || 100);
    });
    setNearbyLocations(nearby.map(l => l.id));
  }, [userLocation]);

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    // Simplified distance calculation (in meters)
    const R = 6371e3; // Earth radius in meters
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  };

  const getVibeColor = (rating: number) => {
    if (rating >= 4.5) return colors.success;
    if (rating >= 3.5) return colors.accent;
    if (rating >= 2.5) return colors.warning;
    return colors.danger;
  };

  const handleLocationPress = (locationId: string) => {
    console.log('Location pressed:', locationId);
    setSelectedLocation(locationId);
    router.push(`/location/${locationId}`);
  };

  return (
    <SafeAreaView style={commonStyles.wrapper}>
      <View style={commonStyles.container}>
        <View style={styles.header}>
          <Text style={commonStyles.title}>Explore Vibes</Text>
          <Text style={commonStyles.textSecondary}>
            Discover places around you
          </Text>
        </View>

        <View style={styles.mapContainer}>
          <View style={styles.mapPlaceholder}>
            <Text style={styles.mapNote}>
              📍 Interactive Map View
            </Text>
            <Text style={styles.mapSubnote}>
              (react-native-maps not supported in Natively)
            </Text>
            
            {/* Custom iOS-style map visualization */}
            <View style={styles.customMap}>
              {/* User location marker */}
              <View style={[styles.userMarker, { 
                left: width / 2 - 20, 
                top: height * 0.25 
              }]}>
                <View style={styles.userDot} />
                <View style={styles.userPulse} />
              </View>

              {/* Location markers with geofence circles */}
              {mockLocations.map((location, index) => {
                const isNearby = nearbyLocations.includes(location.id);
                const angle = (index * 60) * Math.PI / 180;
                const radius = 80 + (index % 3) * 30;
                const x = width / 2 + radius * Math.cos(angle) - 20;
                const y = height * 0.25 + radius * Math.sin(angle) - 20;

                return (
                  <React.Fragment key={location.id}>
                    {/* Geofence circle */}
                    <View style={[
                      styles.geofenceCircle,
                      {
                        left: x - 20,
                        top: y - 20,
                        width: 80,
                        height: 80,
                        borderRadius: 40,
                        borderColor: getVibeColor(location.averageRating),
                        opacity: isNearby ? 0.3 : 0.1,
                      }
                    ]} />
                    
                    {/* Location marker */}
                    <TouchableOpacity
                      style={[styles.locationMarker, { left: x, top: y }]}
                      onPress={() => handleLocationPress(location.id)}
                    >
                      <View style={[
                        styles.markerDot,
                        { backgroundColor: getVibeColor(location.averageRating) }
                      ]}>
                        <Icon 
                          name={
                            location.category === 'cafe' ? 'cafe' :
                            location.category === 'gym' ? 'fitness' :
                            location.category === 'park' ? 'leaf' :
                            location.category === 'restaurant' ? 'restaurant' :
                            location.category === 'library' ? 'book' :
                            'location'
                          }
                          size={16}
                          color={colors.background}
                        />
                      </View>
                      {isNearby && (
                        <View style={styles.nearbyBadge}>
                          <Text style={styles.nearbyText}>Near</Text>
                        </View>
                      )}
                    </TouchableOpacity>
                  </React.Fragment>
                );
              })}
            </View>
          </View>
        </View>

        <View style={styles.legendContainer}>
          <Text style={styles.legendTitle}>Vibe Legend</Text>
          <View style={styles.legendRow}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: colors.success }]} />
              <Text style={styles.legendText}>Amazing (4.5+)</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: colors.accent }]} />
              <Text style={styles.legendText}>Good (3.5+)</Text>
            </View>
          </View>
          <View style={styles.legendRow}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: colors.warning }]} />
              <Text style={styles.legendText}>Okay (2.5+)</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: colors.danger }]} />
              <Text style={styles.legendText}>Needs Work</Text>
            </View>
          </View>
        </View>

        <ScrollView style={styles.locationsList} showsVerticalScrollIndicator={false}>
          <Text style={styles.listTitle}>Nearby Places</Text>
          {mockLocations.map((location) => {
            const isNearby = nearbyLocations.includes(location.id);
            return (
              <TouchableOpacity
                key={location.id}
                style={[styles.locationCard, isNearby && styles.locationCardNearby]}
                onPress={() => handleLocationPress(location.id)}
              >
                <View style={[
                  styles.locationIcon,
                  { backgroundColor: getVibeColor(location.averageRating) }
                ]}>
                  <Icon 
                    name={
                      location.category === 'cafe' ? 'cafe' :
                      location.category === 'gym' ? 'fitness' :
                      location.category === 'park' ? 'leaf' :
                      location.category === 'restaurant' ? 'restaurant' :
                      location.category === 'library' ? 'book' :
                      'location'
                    }
                    size={20}
                    color={colors.background}
                  />
                </View>
                <View style={styles.locationInfo}>
                  <View style={styles.locationHeader}>
                    <Text style={styles.locationName}>{location.name}</Text>
                    {isNearby && (
                      <View style={styles.nearbyPill}>
                        <Text style={styles.nearbyPillText}>Nearby</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.locationAddress}>{location.address}</Text>
                  <View style={styles.locationStats}>
                    <Icon name="star" size={14} color={colors.warning} />
                    <Text style={styles.locationRating}>{location.averageRating.toFixed(1)}</Text>
                    <Text style={styles.locationDistance}>• {location.distance} mi</Text>
                  </View>
                </View>
                <Icon name="chevron-forward" size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
  },
  mapContainer: {
    height: height * 0.4,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  mapPlaceholder: {
    flex: 1,
    backgroundColor: colors.backgroundAlt,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  mapNote: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  mapSubnote: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 20,
  },
  customMap: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  userMarker: {
    position: 'absolute',
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.primary,
    borderWidth: 3,
    borderColor: colors.background,
    zIndex: 2,
  },
  userPulse: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    opacity: 0.2,
  },
  geofenceCircle: {
    position: 'absolute',
    borderWidth: 2,
    borderStyle: 'dashed',
  },
  locationMarker: {
    position: 'absolute',
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  markerDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.background,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.2)',
    elevation: 4,
  },
  nearbyBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: colors.accent,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  nearbyText: {
    fontSize: 8,
    fontWeight: '700',
    color: colors.background,
  },
  legendContainer: {
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 12,
    backgroundColor: colors.backgroundAlt,
    borderRadius: 12,
  },
  legendTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
  },
  legendText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  locationsList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  locationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  locationCardNearby: {
    borderColor: colors.accent,
    borderWidth: 2,
  },
  locationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  locationInfo: {
    flex: 1,
  },
  locationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  locationName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginRight: 8,
  },
  nearbyPill: {
    backgroundColor: colors.accent,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  nearbyPillText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.background,
  },
  locationAddress: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  locationStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationRating: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text,
    marginLeft: 4,
  },
  locationDistance: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 4,
  },
});
