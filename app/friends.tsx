
import React, { useState } from 'react';
import { View, Text, ScrollView, Image, StyleSheet, SafeAreaView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { router } from 'expo-router';
import { commonStyles, colors, buttonStyles } from '../styles/commonStyles';
import { mockFriends, mockFriendRequests } from '../data/mockData';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/Button';
import Icon from '../components/Icon';

export default function FriendsScreen() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'friends' | 'requests' | 'find'>('friends');
  const [searchQuery, setSearchQuery] = useState('');
  const [friends, setFriends] = useState(mockFriends);
  const [friendRequests, setFriendRequests] = useState(mockFriendRequests);

  const handleAcceptRequest = (requestId: string) => {
    console.log('Accepting friend request:', requestId);
    setFriendRequests(prev => prev.filter(req => req.id !== requestId));
    Alert.alert('Success', 'Friend request accepted!');
  };

  const handleRejectRequest = (requestId: string) => {
    console.log('Rejecting friend request:', requestId);
    setFriendRequests(prev => prev.filter(req => req.id !== requestId));
    Alert.alert('Rejected', 'Friend request rejected');
  };

  const handleSendRequest = (userName: string) => {
    console.log('Sending friend request to:', userName);
    Alert.alert('Sent!', `Friend request sent to ${userName}`);
  };

  const calculateVibeMatch = (friendPreferences: string[] = []) => {
    if (!user?.vibePreferences || friendPreferences.length === 0) return 0;
    const matches = friendPreferences.filter(pref => 
      user.vibePreferences?.includes(pref)
    ).length;
    return Math.round((matches / Math.max(friendPreferences.length, user.vibePreferences.length)) * 100);
  };

  const renderFriendsList = () => (
    <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.statsCard}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{friends.length}</Text>
          <Text style={styles.statLabel}>Friends</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{friendRequests.length}</Text>
          <Text style={styles.statLabel}>Requests</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Your Friends</Text>
      {friends.map((friend) => {
        const vibeMatch = calculateVibeMatch(friend.vibePreferences);
        return (
          <TouchableOpacity
            key={friend.id}
            style={styles.friendCard}
            onPress={() => console.log('View friend profile:', friend.id)}
          >
            <View style={styles.friendAvatar}>
              {friend.avatar ? (
                <Image source={{ uri: friend.avatar }} style={styles.avatarImage} />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <Icon name="person" size={24} color={colors.grey} />
                </View>
              )}
            </View>
            <View style={styles.friendInfo}>
              <View style={styles.friendHeader}>
                <Text style={styles.friendName}>{friend.name}</Text>
                {vibeMatch > 60 && (
                  <View style={styles.matchBadge}>
                    <Icon name="heart" size={12} color={colors.danger} />
                    <Text style={styles.matchText}>{vibeMatch}%</Text>
                  </View>
                )}
              </View>
              <Text style={styles.friendVibe} numberOfLines={1}>
                {friend.personalVibe || 'No vibe set'}
              </Text>
              {friend.recentActivity && friend.recentActivity.length > 0 && (
                <View style={styles.activityRow}>
                  <Icon name="location" size={12} color={colors.primary} />
                  <Text style={styles.activityText}>
                    Checked {friend.recentActivity[0].locationName}
                  </Text>
                  <View style={styles.vibeRating}>
                    <Icon name="star" size={10} color={colors.warning} />
                    <Text style={styles.vibeRatingText}>
                      {friend.recentActivity[0].vibeRating}
                    </Text>
                  </View>
                </View>
              )}
              {friend.vibePreferences && friend.vibePreferences.length > 0 && (
                <View style={styles.tagsRow}>
                  {friend.vibePreferences.slice(0, 3).map((tag, index) => (
                    <View key={index} style={styles.tag}>
                      <Text style={styles.tagText}>{tag}</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
            <Icon name="chevron-forward" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );

  const renderRequestsList = () => (
    <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
      <Text style={styles.sectionTitle}>Friend Requests</Text>
      {friendRequests.length === 0 ? (
        <View style={styles.emptyState}>
          <Icon name="people" size={48} color={colors.grey} />
          <Text style={styles.emptyTitle}>No pending requests</Text>
          <Text style={styles.emptyText}>
            When someone sends you a friend request, it will appear here
          </Text>
        </View>
      ) : (
        friendRequests.map((request) => (
          <View key={request.id} style={styles.requestCard}>
            <View style={styles.friendAvatar}>
              {request.fromUserAvatar ? (
                <Image source={{ uri: request.fromUserAvatar }} style={styles.avatarImage} />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <Icon name="person" size={24} color={colors.grey} />
                </View>
              )}
            </View>
            <View style={styles.requestInfo}>
              <Text style={styles.friendName}>{request.fromUserName}</Text>
              <Text style={styles.requestDate}>
                {request.createdAt.toLocaleDateString()}
              </Text>
            </View>
            <View style={styles.requestActions}>
              <TouchableOpacity
                style={styles.acceptButton}
                onPress={() => handleAcceptRequest(request.id)}
              >
                <Icon name="checkmark" size={20} color={colors.background} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.rejectButton}
                onPress={() => handleRejectRequest(request.id)}
              >
                <Icon name="close" size={20} color={colors.background} />
              </TouchableOpacity>
            </View>
          </View>
        ))
      )}
    </ScrollView>
  );

  const renderFindFriends = () => (
    <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.searchContainer}>
        <Icon name="search" size={20} color={colors.textSecondary} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name or email..."
          placeholderTextColor={colors.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <Text style={styles.sectionTitle}>Suggested Friends</Text>
      <Text style={styles.sectionSubtitle}>Based on similar vibes</Text>

      {['Emma Wilson', 'James Lee', 'Lisa Park'].map((name, index) => (
        <View key={index} style={styles.suggestedCard}>
          <View style={styles.friendAvatar}>
            <View style={styles.avatarPlaceholder}>
              <Icon name="person" size={24} color={colors.grey} />
            </View>
          </View>
          <View style={styles.suggestedInfo}>
            <Text style={styles.friendName}>{name}</Text>
            <View style={styles.matchBadge}>
              <Icon name="heart" size={12} color={colors.danger} />
              <Text style={styles.matchText}>{85 - index * 10}% match</Text>
            </View>
            <View style={styles.tagsRow}>
              {['cozy', 'quiet', 'friendly'].map((tag, tagIndex) => (
                <View key={tagIndex} style={styles.tag}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>
          </View>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => handleSendRequest(name)}
          >
            <Icon name="person-add" size={20} color={colors.background} />
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );

  return (
    <SafeAreaView style={commonStyles.wrapper}>
      <View style={commonStyles.container}>
        <View style={styles.header}>
          <Text style={commonStyles.title}>Friends</Text>
          <Text style={commonStyles.textSecondary}>
            Connect with people who share your vibe
          </Text>
        </View>

        <View style={styles.tabBar}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'friends' && styles.tabActive]}
            onPress={() => setActiveTab('friends')}
          >
            <Text style={[styles.tabText, activeTab === 'friends' && styles.tabTextActive]}>
              Friends
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'requests' && styles.tabActive]}
            onPress={() => setActiveTab('requests')}
          >
            <Text style={[styles.tabText, activeTab === 'requests' && styles.tabTextActive]}>
              Requests
            </Text>
            {friendRequests.length > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{friendRequests.length}</Text>
              </View>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'find' && styles.tabActive]}
            onPress={() => setActiveTab('find')}
          >
            <Text style={[styles.tabText, activeTab === 'find' && styles.tabTextActive]}>
              Find
            </Text>
          </TouchableOpacity>
        </View>

        {activeTab === 'friends' && renderFriendsList()}
        {activeTab === 'requests' && renderRequestsList()}
        {activeTab === 'find' && renderFindFriends()}
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
  tabBar: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    position: 'relative',
  },
  tabActive: {
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
  },
  tabText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  tabTextActive: {
    color: colors.primary,
    fontWeight: '600',
  },
  badge: {
    position: 'absolute',
    top: 8,
    right: '30%',
    backgroundColor: colors.danger,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  statsCard: {
    flexDirection: 'row',
    backgroundColor: colors.backgroundAlt,
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: colors.border,
    marginHorizontal: 20,
  },
  statNumber: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: colors.textSecondary,
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
    marginBottom: 12,
  },
  friendCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  friendAvatar: {
    marginRight: 12,
  },
  avatarImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  avatarPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.backgroundAlt,
    justifyContent: 'center',
    alignItems: 'center',
  },
  friendInfo: {
    flex: 1,
  },
  friendHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  friendName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginRight: 8,
  },
  matchBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundAlt,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  matchText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.danger,
    marginLeft: 4,
  },
  friendVibe: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  activityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  activityText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 4,
    flex: 1,
  },
  vibeRating: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundAlt,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  vibeRatingText: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.text,
    marginLeft: 2,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4,
  },
  tag: {
    backgroundColor: colors.backgroundAlt,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginRight: 4,
    marginBottom: 4,
  },
  tagText: {
    fontSize: 11,
    color: colors.primary,
    fontWeight: '500',
  },
  requestCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  requestInfo: {
    flex: 1,
  },
  requestDate: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  requestActions: {
    flexDirection: 'row',
  },
  acceptButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.success,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  rejectButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.danger,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
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
    lineHeight: 24,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundAlt,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    marginLeft: 12,
  },
  suggestedCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  suggestedInfo: {
    flex: 1,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
