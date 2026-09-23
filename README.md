# 🕶️ Tab Vision Pro

Transform your Chrome New Tab page into a breathtaking, Apple Vision OS-inspired desktop environment. 

Tab Vision Pro replaces the default new tab experience with a stunning glassmorphism interface, offering native integration with your Chrome History and Bookmarks, an interactive clock widget, and deeply satisfying drag-and-drop mechanics.

## ✨ Features

- **Glassmorphism UI:** Built with advanced CSS masking and backdrop-filters to perfectly mimic the translucency, reflections, and dynamic lighting of Vision OS windows.
- **Native Bookmarks Manager:** 
  - Drag and drop functionality to effortlessly organize and re-arrange your bookmarks and folders.
  - Sidebar tree hierarchy viewer.
  - Fully synced with Chrome's native bookmark engine.
- **History Viewer:**
  - Track and delete your browsing history natively from the New Tab page.
  - Integrated "Clear History" capability.
- **Custom Built Web Components:**
  - Zero-dependency framework utilizing the Shadow DOM and native Custom Elements (`<app-window>`, `<app-finder>`).
- **IndexedDB Caching:** 
  - Lightning-fast icon fetching and caching utilizing the IndexedDB API (`idb.js`) to prevent network stuttering on load.

## 🚀 Installation (Developer Mode)

Since this is a native Chrome Extension, you can load it directly into your browser:

1. Download or clone this repository.
2. Open Chrome and navigate to `chrome://extensions/`.
3. Enable **Developer mode** in the top right corner.
4. Click **Load unpacked** and select this directory.
5. Open a New Tab and enjoy the view!

## 🛠️ Architecture

- **Manifest V3:** Adheres to the latest Chrome Extension security standards.
- **No Build Step:** Written in pure, vanilla ES6 modules with no Webpack or bundlers required.
- **CSP Compliant:** Fully compliant with strict Content Security Policies; zero inline event handlers.

## 🎨 Design Notes

The core of the "Apple Glass" effect is achieved through a combination of heavy `backdrop-filter: blur(60px)` on translucent surfaces, layered with a mathematically generated CSS `linear-gradient` border mask using `-webkit-mask-composite` to simulate real-world glass edge thickness and volumetric lighting. 

## 📝 License

MIT License - feel free to fork, customize, and build upon this project!