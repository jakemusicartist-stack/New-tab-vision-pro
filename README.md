<div align="center">

  <h1>Tab Vision Pro</h1>
  
  <p>
    <strong>Transform your Chrome New Tab page into a breathtaking, Apple Vision OS-inspired desktop environment.</strong>
  </p>

  <p>
    <img src="https://img.shields.io/badge/Google%20Chrome-4285F4?style=for-the-badge&logo=GoogleChrome&logoColor=white" alt="Chrome Extension" />
    <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript" />
    <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" alt="CSS3" />
    <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" alt="HTML5" />
  </p>

</div>

<br />

> **Note:** Tab Vision Pro replaces the default new tab experience with a stunning glassmorphism interface, offering native integration with your Chrome History and Bookmarks, an interactive clock widget, and deeply satisfying drag-and-drop mechanics.

<br />

## Features

### Glassmorphism UI
Built with advanced CSS masking and backdrop-filters to perfectly mimic the translucency, reflections, and dynamic lighting of Vision OS windows.

### Native Bookmarks Manager
- **Drag & Drop:** Effortlessly organize and re-arrange your bookmarks and folders.
- **Hierarchy Viewer:** Seamlessly navigate through a sidebar tree viewer.
- **Deep Sync:** Fully synchronized with Chrome's native bookmark engine.

### History Viewer
- Track and delete your browsing history natively from the New Tab page.
- Integrated "Clear History" capability to manage your digital footprint.

### Zero-Dependency Architecture
- **Web Components:** Built utilizing the Shadow DOM and native Custom Elements (`<app-window>`, `<app-finder>`).
- **IndexedDB Caching:** Lightning-fast icon fetching and caching utilizing the IndexedDB API (`idb.js`) to prevent network stuttering on load.

<br />

## Installation (Developer Mode)

Since this is a native Chrome Extension, you can load it directly into your browser:

1. Download or clone this repository.
2. Open Chrome and navigate to `chrome://extensions/`.
3. Enable **Developer mode** in the top right corner.
4. Click **Load unpacked** and select this directory.
5. Open a New Tab and enjoy the view!

<br />

## Technical Specifications

| Technology | Implementation |
| --- | --- |
| **Extension Standard** | Manifest V3 (Adheres to latest security standards) |
| **Bundling** | No Build Step (Pure Vanilla ES6 Modules) |
| **Security** | Strict CSP Compliant (Zero inline event handlers) |
| **Storage** | Native Chrome Storage API & IndexedDB |

<br />

## Design Notes

The core of the "Apple Glass" effect is achieved through a combination of heavy `backdrop-filter: blur(60px)` on translucent surfaces, layered with a mathematically generated CSS `linear-gradient` border mask using `-webkit-mask-composite` to simulate real-world glass edge thickness and volumetric lighting. 

<br />

<div align="center">
  <p><i>Released under the MIT License - feel free to fork, customize, and build upon this project!</i></p>
</div>