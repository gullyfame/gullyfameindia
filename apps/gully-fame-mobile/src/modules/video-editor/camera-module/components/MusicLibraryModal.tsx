// PATH: apps/gully-fame-mobile/src/modules/video-editor/camera-module/components/MusicLibraryModal.tsx

import React, { useCallback, useState } from "react";
import {
  Dimensions,
  FlatList,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Svg, { Path } from "react-native-svg";
import type { Music, MusicPickerModalProps } from "../types/music.types";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

// Mock Data exact match to the provided screenshot style
const CATEGORIES = ["For you", "Trending", "Saved", "Original audio", "Pop", "Hip-Hop"];

const INSTAGRAM_STYLE_TRACKS: (Music & { stats: string; color: string })[] = [
  { id: "1", title: "King of the Jungle (Instrumental)", artist: "Dudja", stats: "11T reels • 3:03", color: "#B8860B", duration: 183, genre: "Pop", mood: "Happy", audioUrl: "", isLicensed: true, category: "Trending" },
  { id: "2", title: "Tu Mileya", artist: "Akhil Sachdeva, Showkidd", stats: "9.1T reels • 2:45", color: "#8B0000", duration: 165, genre: "Pop", mood: "Happy", audioUrl: "", isLicensed: true, category: "Trending" },
  { id: "3", title: "Sukoon", artist: "Othoms", stats: "3.9L reels • 5:05", color: "#5F9EA0", duration: 305, genre: "Pop", mood: "Happy", audioUrl: "", isLicensed: true, category: "For you" },
  { id: "4", title: "Musicaltunnel", artist: "musicaltunnel", stats: "27L reels • 0:24", color: "#000000", duration: 24, genre: "Pop", mood: "Happy", audioUrl: "", isLicensed: true, category: "For you" },
  { id: "5", title: "Long Way From Home", artist: "Wicked Sunny, MC SQUARE", stats: "1.2M reels • 2:10", color: "#D2B48C", duration: 130, genre: "Pop", mood: "Happy", audioUrl: "", isLicensed: true, category: "Trending" },
  { id: "6", title: "Levels", artist: "Sidhu Moose Wala, Sunny Malton", stats: "1.7L reels • 3:15", color: "#2F4F4F", duration: 195, genre: "Pop", mood: "Happy", audioUrl: "", isLicensed: true, category: "Trending" },
  { id: "7", title: "Ganga Ke Kinare", artist: "Bunny, Sagar", stats: "5.8L reels • 3:47", color: "#191970", duration: 227, genre: "Pop", mood: "Happy", audioUrl: "", isLicensed: true, category: "For you" },
  { id: "8", title: "Original audio", artist: "saxophonetapas", stats: "11L reels • 1:21", color: "#FF8C00", duration: 81, genre: "Pop", mood: "Happy", audioUrl: "", isLicensed: true, category: "Original audio" },
];

const MusicLibraryModal: React.FC<MusicPickerModalProps> = ({
  visible,
  onSelect,
  onCancel,
  selectedMusic,
}) => {
  const [activeCategory, setActiveCategory] = useState("For you");
  const [searchQuery, setSearchQuery] = useState("");

  const handleSelectMusic = useCallback((music: Music) => {
    onSelect(music);
  }, [onSelect]);

  const renderTrack = ({ item }: { item: typeof INSTAGRAM_STYLE_TRACKS[0] }) => (
    <TouchableOpacity 
      style={styles.trackItem} 
      activeOpacity={0.7}
      onPress={() => handleSelectMusic(item)}
    >
      <View style={[styles.albumCover, { backgroundColor: item.color }]}>
        <Text style={styles.albumIcon}>🎵</Text>
      </View>
      
      <View style={styles.trackInfo}>
        <Text style={styles.trackTitle} numberOfLines={1}>{item.title}</Text>
        <Text style={styles.trackArtist} numberOfLines={1}>↗ {item.artist} • {item.stats}</Text>
      </View>
      
      <TouchableOpacity style={styles.saveButton} onPress={(e) => {
        // Prevent triggering row press when saving
        e.stopPropagation();
      }}>
        {/* Bookmark Icon */}
        <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <Path d="M19 21L12 16L5 21V5C5 4.46957 5.21071 3.96086 5.58579 3.58579C5.96086 3.21071 6.46957 3 7 3H17C17.5304 3 18.0391 3.21071 18.4142 3.58579C18.7893 3.96086 19 4.46957 19 5V21Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </Svg>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onCancel}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.sheetContainer}>
          {/* Drag Handle & Close area */}
          <TouchableOpacity style={styles.dragHandleContainer} onPress={onCancel} activeOpacity={1}>
            <View style={styles.dragHandle} />
          </TouchableOpacity>

          {/* Search Bar Row */}
          <View style={styles.headerRow}>
            <View style={styles.searchContainer}>
              <Svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={styles.searchIcon}>
                <Path d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <Path d="M21 21L16.65 16.65" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </Svg>
              <TextInput
                style={styles.searchInput}
                placeholder="Search..."
                placeholderTextColor="#888"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
            <TouchableOpacity style={styles.importButton}>
              <Text style={styles.importText}>🎵 Import</Text>
            </TouchableOpacity>
          </View>

          {/* Categories Horizontal Scroll */}
          <View style={styles.categoriesContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesScroll}>
              {CATEGORIES.map((cat) => (
                <TouchableOpacity 
                  key={cat} 
                  style={[styles.categoryPill, activeCategory === cat && styles.categoryPillActive]}
                  onPress={() => setActiveCategory(cat)}
                >
                  <Text style={[styles.categoryText, activeCategory === cat && styles.categoryTextActive]}>
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Track List */}
          <FlatList
            data={INSTAGRAM_STYLE_TRACKS}
            keyExtractor={(item) => item.id}
            renderItem={renderTrack}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={() => (
              // Featured Banner (Only shown if 'For you' or 'Trending' is selected, optional logic)
              <View style={styles.featuredBanner}>
                <View style={styles.featuredContent}>
                  <View style={[styles.albumCover, { backgroundColor: '#8FBC8F' }]}>
                    <Text style={styles.albumIcon}>🎵</Text>
                  </View>
                  <View style={styles.featuredTextContainer}>
                    <Text style={styles.featuredTitle}>Koi Baat Hai</Text>
                    <Text style={styles.featuredSubtitle}>Arjun Tanwar, Kalki, Devendra Dangi</Text>
                  </View>
                </View>
                {/* Pagination Dots */}
                <View style={styles.dotsContainer}>
                  <View style={[styles.dot, styles.dotActive]} />
                  <View style={styles.dot} />
                  <View style={styles.dot} />
                  <View style={styles.dot} />
                  <View style={[styles.dot, { width: 4, height: 4 }]} />
                </View>
              </View>
            )}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  sheetContainer: {
    height: SCREEN_HEIGHT * 0.92,
    backgroundColor: '#121212', 
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 10,
  },
  dragHandleContainer: {
    alignItems: 'center',
    marginBottom: 15,
    paddingVertical: 10, // Easier to grab/tap
  },
  dragHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#444',
    borderRadius: 2,
  },
  headerRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 16,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#262626',
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 40,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: '#FFF',
    fontSize: 16,
    ...Platform.select({
      android: { padding: 0 },
    }),
  },
  importButton: {
    backgroundColor: '#262626',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderRadius: 10,
    height: 40,
  },
  importText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
  categoriesContainer: {
    marginBottom: 16,
  },
  categoriesScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  categoryPill: {
    backgroundColor: '#262626',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  categoryPillActive: {
    backgroundColor: '#FFFFFF',
  },
  categoryText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
  categoryTextActive: {
    color: '#000',
  },
  listContainer: {
    paddingBottom: 40,
  },
  featuredBanner: {
    marginHorizontal: 16,
    marginBottom: 20,
    height: 100,
    backgroundColor: '#2A3427', 
    borderRadius: 12,
    padding: 16,
    justifyContent: 'space-between',
  },
  featuredContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featuredTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  featuredTitle: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  featuredSubtitle: {
    color: '#DDD',
    fontSize: 13,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  dotActive: {
    backgroundColor: '#5C6BC0',
  },
  trackItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  albumCover: {
    width: 50,
    height: 50,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  albumIcon: {
    fontSize: 24,
  },
  trackInfo: {
    flex: 1,
    marginLeft: 12,
    marginRight: 12,
  },
  trackTitle: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  trackArtist: {
    color: '#AAA',
    fontSize: 13,
  },
  saveButton: {
    padding: 8,
  },
});

export default MusicLibraryModal;