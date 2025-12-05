
import React, { useState } from 'react';
import { View, Text, ScrollView, Image, StyleSheet, SafeAreaView, TouchableOpacity, Alert, TextInput } from 'react-native';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { commonStyles, colors, buttonStyles } from '../../styles/commonStyles';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/Button';
import Icon from '../../components/Icon';

const VIBE_TAGS = [
  'quiet', 'cozy', 'friendly', 'energetic', 'clean', 'modern',
  'outdoor', 'peaceful', 'lively', 'social', 'studious', 'chill',
  'creative', 'professional', 'casual', 'trendy', 'classic', 'vibrant'
];

export default function ProfileScreen() {
  const { user, logout, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [personalVibe, setPersonalVibe] = useState(user?.personalVibe || '');
  const [selectedVibeTags, setSelectedVibeTags] = useState<string[]>(user?.vibePreferences || []);

  if (!user) {
    return (
      <SafeAreaView style={commonStyles.wrapper}>
        <View style={[commonStyles.container, commonStyles.center]}>
          <Text style={commonStyles.title}>Not logged in</Text>
          <Button
            text="Go to Login"
            onPress={() => router.replace('/auth/login')}
            style={buttonStyles.primary}
          />
        </View>
      </SafeAreaView>
    );
  }

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            console.log('Logging out...');
            await logout();
            router.replace('/auth/login');
          },
        },
      ]
    );
  };

  const handleEditProfile = () => {
    if (isEditing) {
      // Save changes
      console.log('Saving profile changes');
      updateProfile({ 
        name, 
        bio, 
        personalVibe,
        vibePreferences: selectedVibeTags 
      });
      Alert.alert('Success', 'Profile updated successfully!');
    }
    setIsEditing(!isEditing);
  };

  const handleChangeAvatar = async () => {
    console.log('Requesting image picker permission...');
    
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert('Permission Required', 'Permission to access camera roll is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      console.log('Image selected:', result.assets[0].uri);
      await updateProfile({ avatar: result.assets[0].uri });
      Alert.alert('Success', 'Profile picture updated!');
    }
  };

  const toggleVibeTag = (tag: string) => {
    if (selectedVibeTags.includes(tag)) {
      setSelectedVibeTags(prev => prev.filter(t => t !== tag));
    } else {
      if (selectedVibeTags.length < 6) {
        setSelectedVibeTags(prev => [...prev, tag]);
      } else {
        Alert.alert('Limit Reached', 'You can select up to 6 vibe tags');
      }
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
    });
  };

  return (
    <SafeAreaView style={commonStyles.wrapper}>
      <View style={commonStyles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>
          <TouchableOpacity onPress={handleEditProfile} style={styles.editButton}>
            <Icon name={isEditing ? "checkmark" : "create"} size={24} color={colors.primary} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            <View style={styles.avatarSection}>
              <TouchableOpacity onPress={handleChangeAvatar} style={styles.avatarContainer}>
                {user.avatar ? (
                  <Image source={{ uri: user.avatar }} style={styles.avatar} />
                ) : (
                  <View style={styles.avatarPlaceholder}>
                    <Icon name="person" size={48} color={colors.grey} />
                  </View>
                )}
                <View style={styles.avatarBadge}>
                  <Icon name="camera" size={16} color={colors.background} />
                </View>
              </TouchableOpacity>

              {isEditing ? (
                <TextInput
                  style={styles.nameInput}
                  value={name}
                  onChangeText={setName}
                  placeholder="Your name"
                  placeholderTextColor={colors.textSecondary}
                />
              ) : (
                <Text style={styles.name}>{user.name}</Text>
              )}
              
              <Text style={styles.email}>{user.email}</Text>
              <Text style={styles.joinDate}>Member since {formatDate(user.joinedDate)}</Text>
            </View>

            <View style={styles.statsSection}>
              <View style={styles.statCard}>
                <Icon name="chatbubble" size={24} color={colors.primary} />
                <Text style={styles.statNumber}>{user.totalReviews}</Text>
                <Text style={styles.statLabel}>Reviews</Text>
              </View>
              <View style={styles.statCard}>
                <Icon name="location" size={24} color={colors.accent} />
                <Text style={styles.statNumber}>{user.totalLocationsAdded}</Text>
                <Text style={styles.statLabel}>Places Added</Text>
              </View>
            </View>

            <View style={styles.vibeSection}>
              <View style={styles.vibeSectionHeader}>
                <Icon name="sparkles" size={20} color={colors.accent} />
                <Text style={styles.sectionTitle}>My Vibe</Text>
              </View>
              <Text style={styles.sectionDescription}>
                Share your vibe to help friends find places you&apos;d love
              </Text>
              {isEditing ? (
                <TextInput
                  style={styles.vibeInput}
                  value={personalVibe}
                  onChangeText={setPersonalVibe}
                  placeholder="Describe your vibe... (e.g., Coffee enthusiast and study buddy)"
                  placeholderTextColor={colors.textSecondary}
                  multiline
                  numberOfLines={2}
                  textAlignVertical="top"
                />
              ) : (
                <View style={styles.vibeDisplay}>
                  <Text style={styles.vibeText}>
                    {user.personalVibe || 'No vibe set yet. Tap edit to add your vibe!'}
                  </Text>
                </View>
              )}

              <Text style={styles.vibeTagsTitle}>Vibe Preferences</Text>
              <Text style={styles.vibeTagsSubtitle}>
                Select up to 6 tags that describe your ideal vibe
              </Text>
              <View style={styles.vibeTagsContainer}>
                {VIBE_TAGS.map((tag) => {
                  const isSelected = selectedVibeTags.includes(tag);
                  return (
                    <TouchableOpacity
                      key={tag}
                      style={[
                        styles.vibeTag,
                        isSelected && styles.vibeTagSelected,
                        !isEditing && styles.vibeTagDisabled
                      ]}
                      onPress={() => isEditing && toggleVibeTag(tag)}
                      disabled={!isEditing}
                    >
                      <Text style={[
                        styles.vibeTagText,
                        isSelected && styles.vibeTagTextSelected
                      ]}>
                        {tag}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            <View style={styles.bioSection}>
              <Text style={styles.sectionTitle}>Bio</Text>
              {isEditing ? (
                <TextInput
                  style={styles.bioInput}
                  value={bio}
                  onChangeText={setBio}
                  placeholder="Tell us about yourself..."
                  placeholderTextColor={colors.textSecondary}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
              ) : (
                <Text style={styles.bioText}>
                  {user.bio || 'No bio yet. Tap edit to add one!'}
                </Text>
              )}
            </View>

            <View style={styles.actionsSection}>
              <TouchableOpacity style={styles.actionButton}>
                <Icon name="settings" size={20} color={colors.text} />
                <Text style={styles.actionText}>Settings</Text>
                <Icon name="chevron-forward" size={20} color={colors.textSecondary} />
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionButton}>
                <Icon name="help-circle" size={20} color={colors.text} />
                <Text style={styles.actionText}>Help & Support</Text>
                <Icon name="chevron-forward" size={20} color={colors.textSecondary} />
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionButton}>
                <Icon name="information-circle" size={20} color={colors.text} />
                <Text style={styles.actionText}>About</Text>
                <Icon name="chevron-forward" size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <View style={styles.logoutSection}>
              <Button
                text="Logout"
                onPress={handleLogout}
                style={[buttonStyles.secondary, styles.logoutButton]}
                textStyle={styles.logoutText}
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
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  editButton: {
    padding: 8,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.backgroundAlt,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: colors.background,
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  nameInput: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
    textAlign: 'center',
    backgroundColor: colors.backgroundAlt,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    minWidth: 200,
  },
  email: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  joinDate: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  statsSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 32,
  },
  statCard: {
    backgroundColor: colors.backgroundAlt,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 8,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    marginTop: 8,
  },
  statLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },
  vibeSection: {
    marginBottom: 32,
    backgroundColor: colors.backgroundAlt,
    borderRadius: 16,
    padding: 16,
    borderWidth: 2,
    borderColor: colors.accent,
  },
  vibeSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginLeft: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  vibeDisplay: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  vibeText: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 24,
  },
  vibeInput: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.text,
    height: 80,
    textAlignVertical: 'top',
    marginBottom: 16,
  },
  vibeTagsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  vibeTagsSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  vibeTagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  vibeTag: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  vibeTagSelected: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  vibeTagDisabled: {
    opacity: 0.7,
  },
  vibeTagText: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
  },
  vibeTagTextSelected: {
    color: colors.background,
    fontWeight: '600',
  },
  bioSection: {
    marginBottom: 32,
  },
  bioText: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 24,
  },
  bioInput: {
    backgroundColor: colors.backgroundAlt,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.text,
    height: 100,
    textAlignVertical: 'top',
  },
  actionsSection: {
    marginBottom: 32,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundAlt,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  actionText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginLeft: 12,
  },
  logoutSection: {
    marginBottom: 40,
  },
  logoutButton: {
    borderColor: colors.danger,
  },
  logoutText: {
    color: colors.danger,
    fontWeight: '600',
  },
});
