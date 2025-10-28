# 🌳 JSON Tree Visualizer

A modern, interactive web application for visualizing JSON data as beautiful tree structures with advanced search, animations, and export capabilities.

![JSON Tree Visualizer](https://img.shields.io/badge/React-18-blue) ![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.3-38B2AC) ![Framer Motion](https://img.shields.io/badge/Framer%20Motion-10-FF0055) ![React Flow](https://img.shields.io/badge/React%20Flow-11-FF6B6B)

## ✨ Features

### 🎨 Modern UI/UX
- **Glassmorphism Design**: Beautiful glass-like cards with backdrop blur effects
- **Dark/Light Mode**: Seamless theme switching with system preference detection
- **Smooth Animations**: Powered by Framer Motion for delightful interactions
- **Responsive Layout**: Optimized for desktop, tablet, and mobile devices
- **Gradient Backgrounds**: Animated mesh gradients and floating elements

### 🌳 Interactive Tree Visualization
- **React Flow Integration**: Smooth pan, zoom, and navigation
- **Color-Coded Nodes**: Different colors for objects, arrays, and primitives
- **Node Animations**: Hover effects, selection states, and highlight animations
- **Copy JSON Paths**: Click any node to copy its path to clipboard
- **Smart Layout**: Automatic tree positioning with optimal spacing

### 🔍 Advanced Search
- **Real-time Search**: Find nodes by key names, values, or JSON paths
- **Keyboard Shortcuts**: ⌘F/Ctrl+F to focus search instantly
- **Search Highlighting**: Visual indicators for matching nodes
- **Auto-centering**: Automatically centers view on search results
- **Search Statistics**: Shows match count and navigation hints

### 📱 Enhanced Usability
- **Template Library**: Quick-start with pre-built JSON templates
- **Loading States**: Smooth loading animations and feedback
- **Error Handling**: User-friendly error messages with suggestions
- **Keyboard Navigation**: Full keyboard accessibility support
- **Toast Notifications**: Contextual feedback for user actions

### 🛠️ Developer Features
- **JSON Validation**: Real-time syntax checking and error reporting
- **Export Options**: Download tree visualizations as PNG images
- **Performance Optimized**: Efficient rendering for large JSON files
- **TypeScript Ready**: Full type safety and IntelliSense support
- **Modern Build**: Vite for fast development and optimized builds

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd json-tree-visualizer
```

2. **Install dependencies**
```bash
npm install
```

3. **Start development server**
```bash
npm run dev
```

4. **Open in browser**
Navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

## 🎯 Usage Guide

### Basic Usage
1. **Input JSON**: Paste your JSON data in the left panel
2. **Generate Tree**: Click "Generate Tree" or use sample templates
3. **Explore**: Pan, zoom, and click nodes to explore the structure
4. **Search**: Use the search bar to find specific nodes
5. **Export**: Download your visualization as an image

### Keyboard Shortcuts
| Shortcut | Action |
|----------|--------|
| `⌘/Ctrl + F` | Focus search input |
| `+` | Zoom in |
| `-` | Zoom out |
| `0` | Fit view |
| `R` | Reset view |
| `⌘/Ctrl + /` | Show keyboard shortcuts |
| `Esc` | Close dialogs |

### Advanced Features
- **Templates**: Use pre-built templates for common JSON structures
- **Search Patterns**: Search by JSON path (e.g., `$.user.address.city`)
- **Node Details**: Hover over nodes to see type information
- **Responsive Controls**: Touch-friendly controls on mobile devices

## 🏗️ Project Structure

```
src/
├── components/
│   ├── CustomNode.jsx          # Enhanced tree node component
│   ├── JSONInput.jsx           # JSON input with templates
│   ├── SearchBar.jsx           # Advanced search functionality
│   ├── TreeVisualization.jsx   # Main tree display component
│   ├── EmptyState.jsx          # Welcome screen with features
│   └── KeyboardShortcuts.jsx   # Accessibility shortcuts
├── utils/
│   └── jsonParser.js           # JSON parsing and tree generation
├── styles/
│   └── index.css              # Global styles and animations
├── App.jsx                    # Main application component
└── main.jsx                   # Application entry point
```

## 🎨 Design System

### Color Palette
- **Primary**: Blue gradient (`#3b82f6` to `#6366f1`)
- **Secondary**: Purple gradient (`#8b5cf6` to `#a855f7`)
- **Success**: Emerald (`#10b981`)
- **Warning**: Amber (`#f59e0b`)
- **Error**: Red (`#ef4444`)

### Typography
- **Primary**: Inter (system font)
- **Monospace**: Fira Code
- **Display**: DM Sans

### Animations
- **Duration**: 200-800ms for interactions
- **Easing**: Cubic bezier curves for natural motion
- **Spring Physics**: Framer Motion spring animations
- **Reduced Motion**: Respects user preferences

## 🔧 Configuration

### Tailwind CSS
The project uses Tailwind CSS with custom configurations:
- Extended color palette
- Custom animations and keyframes
- Glassmorphism utilities
- Responsive breakpoints

### React Flow
Customized React Flow setup:
- Custom node types
- Smooth edge animations
- Minimap integration
- Background patterns

## 📦 Dependencies

### Core
- **React 18**: Modern React with hooks and concurrent features
- **React Flow 11**: Interactive node-based graphs
- **Framer Motion 10**: Production-ready motion library
- **Tailwind CSS 3**: Utility-first CSS framework

### UI Components
- **Lucide React**: Beautiful icon library
- **React Hot Toast**: Elegant notifications
- **Headless UI**: Unstyled, accessible components

### Utilities
- **html2canvas**: Client-side screenshot generation
- **clsx**: Conditional className utility

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Deploy automatically on push to main branch
3. Environment variables are handled automatically

### Manual Build
```bash
npm run build
npm run preview  # Test production build locally
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [React Flow](https://reactflow.dev/) for the excellent graph library
- [Framer Motion](https://www.framer.com/motion/) for smooth animations
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first approach
- [Lucide](https://lucide.dev/) for the beautiful icons

---

<div align="center">
  <p>Built with React and Tailwind CSS</p>
  <p>
    <a href="#-features">Features</a> •
    <a href="#-quick-start">Quick Start</a> •
    <a href="#-usage-guide">Usage</a> •
    <a href="#-project-structure">Structure</a>
  </p>
</div>