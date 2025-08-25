# Document Scanner App

A professional document scanner app built with React Native and Expo, featuring camera capture, image editing, and PDF export capabilities.

## Features

### Core Functionality
- **Multi-page Document Scanning**: Capture multiple pages in a single document
- **Real-time Camera Preview**: Live camera view with overlay guides for optimal document positioning
- **Image Import**: Import existing images from photo library
- **Crop & Edit**: Manual cropping with drag handles and filter options (Auto, B&W, Color)
- **PDF Export**: Convert scanned documents to high-quality PDFs
- **Share Documents**: Easy sharing via system share sheet

### User Interface
- **Clean, Professional Design**: Dribbble-grade UI with thoughtful spacing and typography
- **Dashboard**: Statistics overview and recent documents
- **Document Management**: Browse, rename, and organize all documents
- **Intuitive Navigation**: Tab-based navigation with clear visual hierarchy

### Technical Features
- **TypeScript**: Full type safety throughout the application
- **Expo Router**: File-based routing system
- **AsyncStorage**: Local data persistence
- **Haptic Feedback**: Tactile feedback for better user experience
- **Permission Handling**: Proper camera and media library permissions

## Project Structure

```
app/
├── (tabs)/
│   ├── index.tsx           # Dashboard with stats and recent docs
│   ├── documents.tsx       # All documents list
│   └── _layout.tsx         # Tab navigation layout
├── scan.tsx                # Camera scanner screen
├── edit/[pageId].tsx       # Page editor (crop/filter)
└── doc/[id].tsx           # Document detail view

components/
├── Card.tsx               # Reusable card component
├── EmptyState.tsx         # Empty state component
├── ListItem.tsx           # List item component
├── PrimaryButton.tsx      # Primary button component
└── StatsCard.tsx          # Statistics card component

hooks/
└── useDocs.ts             # Main document management hook

services/
└── docs-db.ts             # AsyncStorage persistence layer

types/
└── docs.ts                # TypeScript type definitions

styles/
└── colors.ts              # Design system (colors, spacing, typography)
```

## Key Components

### Document Management (`useDocs` Hook)
- Create, read, update, delete documents
- Add/edit pages within documents
- Export to PDF with custom HTML layout
- Share functionality with system share sheet

### Scanner (`/scan`)
- Camera permissions handling
- Multi-page capture workflow
- Photo library import
- Flash control and camera settings

### Page Editor (`/edit/[pageId]`)
- Interactive crop tool with drag handles
- Filter options (Auto, B&W, Color)
- Real-time preview
- Save changes with haptic feedback

### Document Detail (`/doc/[id]`)
- Rename documents
- View all pages in document
- Export as PDF
- Delete document functionality

## Design System

The app uses a consistent design system with:
- **Colors**: Primary blue (#007AFF), neutral grays, semantic colors
- **Typography**: System fonts with multiple weights and sizes
- **Spacing**: 8px grid system (xs:4, sm:8, md:12, lg:16, xl:24, xxl:32)
- **Border Radius**: Consistent radius values (sm:4, md:8, lg:12, xl:16)
- **Shadows**: Subtle elevation system for depth

## Installation & Setup

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Use Expo Go app to scan the QR code, or run on simulator:
```bash
npm run ios      # iOS simulator
npm run android  # Android emulator
```

## Future Enhancements

The app is structured to easily support:
- **Auto Edge Detection**: Replace manual cropping with ML-based edge detection
- **Perspective Correction**: Automatic perspective correction using computer vision
- **OCR Integration**: Text extraction from scanned documents
- **Cloud Sync**: Backup and sync documents across devices
- **Advanced Filters**: Additional image enhancement options
- **Page Reordering**: Drag-and-drop page organization
- **Batch Operations**: Export multiple documents at once

## Libraries Used

- **expo-camera**: Camera functionality
- **expo-image-manipulator**: Image processing and cropping
- **expo-file-system**: File management
- **expo-print**: PDF generation
- **expo-sharing**: System share functionality
- **expo-media-library**: Photo library access
- **expo-haptics**: Tactile feedback
- **expo-image-picker**: Photo selection
- **@react-native-async-storage/async-storage**: Local storage

## License

MIT License - feel free to use this project as a starting point for your own document scanner app.
