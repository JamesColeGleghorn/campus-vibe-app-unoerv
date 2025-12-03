
# VibeRater 🌟

A modern, social location rating app that lets you rate and discover the vibe of places around you - restaurants, gyms, parks, and more!

## About VibeRater

VibeRater is the next generation of location rating apps, designed to replace traditional platforms like Yelp with a more modern, vibe-focused approach. Share your experiences and discover the best spots in your area based on real-time community ratings.

### Key Features

- **Rate Any Location**: Rate restaurants, gyms, parks, cafes, and any place you visit
- **Real-time Vibe Updates**: See live ratings and reviews from your community
- **Location Discovery**: Browse and search for places near you
- **User Profiles**: Create your profile and track your rating history
- **Image Uploads**: Share photos of your favorite spots
- **Category Filtering**: Filter locations by type (restaurants, gyms, parks, etc.)
- **Review System**: Write detailed reviews and read what others think
- **Modern UI**: Clean, minimalistic design with smooth animations
- **Dark Mode Support**: Seamless experience in both light and dark themes

## Tech Stack

- **React Native** with **Expo 53**
- **TypeScript** for type safety
- **Expo Router** for file-based navigation
- **React Context** for state management
- **Expo Image Picker** for photo uploads
- **AsyncStorage** for local data persistence

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (for Mac) or Android Emulator

### Installation

1. Clone the repository:
```bash
git clone https://github.com/YOUR_USERNAME/viberater.git
cd viberater
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Run on your preferred platform:
```bash
npm run ios      # Run on iOS simulator
npm run android  # Run on Android emulator
npm run web      # Run in web browser
```

## Project Structure

```
viberater/
├── app/                    # App screens (Expo Router)
│   ├── _layout.tsx        # Root layout
│   ├── index.tsx          # Entry point
│   ├── home.tsx           # Home screen with location list
│   ├── search.tsx         # Search screen
│   ├── profile.tsx        # User profile
│   ├── add-location.tsx   # Add new location
│   ├── location/[id].tsx  # Location details
│   ├── add-review/[id].tsx # Add review
│   └── auth/              # Authentication screens
│       ├── login.tsx
│       └── signup.tsx
├── components/            # Reusable components
│   ├── Button.tsx
│   ├── CategoryFilter.tsx
│   ├── Icon.tsx
│   ├── LocationCard.tsx
│   ├── RatingStars.tsx
│   └── SearchBar.tsx
├── contexts/              # React Context providers
│   └── AuthContext.tsx
├── data/                  # Mock data
│   └── mockData.ts
├── types/                 # TypeScript types
│   ├── Location.ts
│   └── User.ts
├── styles/                # Shared styles
│   └── commonStyles.ts
└── utils/                 # Utility functions
    └── errorLogger.ts
```

## Available Scripts

- `npm run dev` - Start development server with tunnel
- `npm run ios` - Run on iOS simulator
- `npm run android` - Run on Android emulator
- `npm run web` - Run in web browser
- `npm run build:web` - Build for web production
- `npm run build:android` - Prebuild for Android
- `npm run lint` - Run ESLint

## Features in Detail

### Authentication
- User login and signup
- Persistent sessions with AsyncStorage
- Protected routes

### Location Management
- Browse locations with ratings
- View detailed location information
- Add new locations with images
- Category-based filtering

### Rating & Reviews
- 5-star rating system
- Written reviews with timestamps
- User attribution for reviews

### Search
- Real-time search results
- Search history tracking
- Popular search suggestions
- Category-based filtering

### User Profile
- Profile picture upload
- User statistics (reviews, ratings)
- Edit profile information
- View rating history

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Future Enhancements

- Backend integration with Supabase
- Real-time notifications
- Social features (follow users, like reviews)
- Map view of locations
- Advanced filtering and sorting
- Location recommendations based on preferences
- Share locations to social media

## License

This project is licensed under the MIT License.

## Acknowledgments

Built with [Natively.dev](https://natively.dev) - a platform for creating mobile apps.

Made with 💙 for creativity.

---

**Note**: This app currently uses mock data. For production use, integrate with a backend service like Supabase for real data persistence and user management.
