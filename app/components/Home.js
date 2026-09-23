import { Component, renderMap } from "../assets/core.js";
import IDB from "../assets/idb.js";

export default class Home extends Component {
  css = `
    :host {
      display: block;
      width: 100%;
      height: 100%;
      position: relative;
    }

    .home-container {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: clamp(10px, 4vh, 40px);
      overflow-y: auto;
      padding: 40px 0;
      box-sizing: border-box;
    }

    .search-bar {
      width: 100%;
      max-width: 600px;
      padding: 0 20px;
      box-sizing: border-box;
      flex-shrink: 0;
    }
    .search-bar app-window {
      width: 100%;
      height: 48px;
    }
    .search-bar input {
      width: 100%;
      height: 100%;
      background: transparent;
      outline: none;
      color: #fff;
      font-size: 16px;
      padding: 0 24px;
      box-sizing: border-box;
      font-family: inherit;
    }
    .search-bar input::placeholder {
      color: rgba(255, 255, 255, 0.5);
    }

    ul {
      width: 100%;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
      gap: clamp(16px, 3vw, 40px);
      justify-content: center;
      max-width: 900px;
      padding: 0 20px;
      box-sizing: border-box;
    }

    @media only screen and (min-width: 960px) {
      ul {
        grid-template-columns: repeat(5, 1fr);
      }
      ul li {
        display: flex;
        justify-content: center;
      }
    }

    ul li .wrapper {
      position: relative;
      display: flex;
      flex-direction: column;
      gap: 10px;
      align-items: center;
      justify-content: center;
      transition: var(--duration);
    }
    ul li .wrapper:hover {
      transform: scale(1.1);
    }
    ul li .wrapper:active {
      transform: scale(1.05);
    }

    .delete-btn {
      position: absolute;
      top: -6px;
      right: -6px;
      width: 24px;
      height: 24px;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      opacity: 0;
      transition: var(--duration);
      z-index: 10;
      backdrop-filter: blur(10px);
      font-size: 14px;
      font-weight: bold;
    }
    .wrapper:hover .delete-btn {
      opacity: 1;
    }
    .delete-btn:hover {
      background: rgba(255, 255, 255, 0.4);
    }

    app-window {
      border-radius: 999px;
      box-shadow: var(--shadow);
    }
    a {
      width: clamp(64px, 7vw, 96px);
      height: clamp(64px, 7vw, 96px);
      border-radius: 999px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    }
    img {
      display: inline-block;
      width: 55%;
      height: 55%;
      object-fit: contain;
      border-radius: 20%;
    }
    p {
      font-size: clamp(12px, 1vw, 14px);
      color: rgba(255, 255, 255, 0.8);
      text-align: center;
      width: 100%;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }

    .add-btn {
      width: clamp(64px, 7vw, 96px);
      height: clamp(64px, 7vw, 96px);
      border-radius: 999px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      background: rgba(255, 255, 255, 0.1);
      font-size: 32px;
      color: rgba(255, 255, 255, 0.6);
      transition: var(--duration);
      backdrop-filter: blur(20px);
    }
    .wrapper:hover .add-btn {
      background: rgba(255, 255, 255, 0.2);
      color: #fff;
    }

    #add-modal {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 999;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(0, 0, 0, 0.4);
      backdrop-filter: blur(24px);
      -webkit-backdrop-filter: blur(24px);
      opacity: 1;
      transition: 300ms ease opacity;
    }
    #add-modal.off {
      opacity: 0;
      pointer-events: none;
    }
    .modal-content {
      padding: 32px;
      display: flex;
      flex-direction: column;
      gap: 16px;
      width: 300px;
    }
    .modal-content h3 {
      font-size: 20px;
      font-weight: bold;
      text-align: center;
      margin-bottom: 8px;
    }
    .modal-content input {
      width: 100%;
      height: 40px;
      background: rgba(0, 0, 0, 0.2);
      border-radius: 8px;
      padding: 0 12px;
      color: #fff;
      outline: none;
      box-sizing: border-box;
      font-size: 14px;
      font-family: inherit;
    }
    .modal-content input::placeholder {
      color: rgba(255, 255, 255, 0.5);
    }
    .modal-content .actions {
      display: flex;
      gap: 12px;
      margin-top: 8px;
    }
    .modal-content button {
      flex: 1;
      height: 36px;
      border-radius: 18px;
      cursor: pointer;
      background: rgba(255, 255, 255, 0.1);
      color: #fff;
      transition: var(--duration);
      font-size: 14px;
      border: none;
      font-family: inherit;
    }
    .modal-content button:hover {
      background: rgba(255, 255, 255, 0.2);
    }
    .modal-content button#btn-add {
      background: rgba(255, 255, 255, 0.8);
      color: #000;
      font-weight: bold;
    }
    .modal-content button#btn-add:hover {
      background: #fff;
    }
    .draggable-item {
      transition: all 0.2s ease;
    }
    .draggable-item.dragging {
      opacity: 0.4;
      transform: scale(0.9);
    }
    .draggable-item.drag-over {
      transform: scale(1.05);
      filter: brightness(1.5);
    }
  `;

  defaultIconList = [
    { src:"https://www.google.com/s2/favicons?domain=google.com&sz=128", title: "google", href: "https://www.google.com" },
    { src:"/app/assets/icons/youtube.png", title: "youtube", href: "https://www.youtube.com/" },
    { src:"https://www.google.com/s2/favicons?domain=duck.ai&sz=128", title: "duck.ai", href: "https://duck.ai/" },
    { src:"/app/assets/icons/setting.png", title: "setting", action: "chrome://settings/" },
    { src:"/app/assets/icons/notes.png", title: "notes", href: "https://keep.google.com/" },
    { src:"/app/assets/icons/safari.png", title: "safari", action: "chrome://newtab" },
    { src:"https://www.google.com/s2/favicons?domain=meta.ai&sz=128", title: "meta.ai", href: "https://www.meta.ai/" },
    { src:"https://www.google.com/s2/favicons?domain=instagram.com&sz=128", title: "instagram", href: "https://www.instagram.com/" },
    { src:"/app/assets/icons/market.png", title: "market", href: "https://chrome.google.com/webstore/category/extensions" },
    { src:"/app/assets/icons/gmail.png", title: "mail", href: "https://gmail.com/" },
    { src:"https://www.google.com/s2/favicons?domain=gemini.google.com&sz=128", title: "gemini", href: "https://gemini.google.com/" },
    { src:"https://www.google.com/s2/favicons?domain=github.com&sz=128", title: "github", href: "https://github.com/" },
    { src:"/app/assets/icons/chrome.png", title: "•••", action: "chrome://dino/" }
  ];

  iconList = [];
  searchEngine = "https://duckduckgo.com/";

  async beforeMount() {
    await IDB.open();
    const storedEngine = await IDB.getSetting("searchEngine");
    if (storedEngine) this.searchEngine = storedEngine;

    chrome.storage.local.get(["customShortcuts"], (result) => {
      if (result.customShortcuts && Array.isArray(result.customShortcuts)) {
        this.iconList = result.customShortcuts;
      } else {
        this.iconList = [...this.defaultIconList];
        chrome.storage.local.set({ customShortcuts: this.iconList });
      }
      this.reRender();
    });
  }

  saveShortcuts() {
    chrome.storage.local.set({ customShortcuts: this.iconList }, () => {
      this.reRender();
    });
  }

  render() {
    this.shadowRoot.innerHTML = `
      <section class="home-container">
        <app-clock></app-clock>
        <form class="search-bar" id="search-form" action="${this.searchEngine}" method="GET">
          <app-window radius="24">
            <input type="text" name="q" placeholder="Search the web..." autocomplete="off" />
          </app-window>
        </form>

        <ul>
        ${renderMap(this.iconList, (item, idx) => `
          <li draggable="true" data-idx="${idx}" class="draggable-item">
            <div class="wrapper">
              <div class="delete-btn" data-idx="${idx}">&#10005;</div>
              <app-window radius="999">
                <a
                  ${item.href ? `href="${item.href}" target="_blank"` : ""} 
                  class="${item.action ? `action idx-${idx}` : ""}"
                >
                  <img src="${item.src}" alt="icon" onerror="this.src='/app/assets/icons/globe.png'" />
                </a>
              </app-window>
              <p>${item.title}</p>
            </div>
          </li>
        `)}
          <li>
            <div class="wrapper">
              <div class="add-btn">+</div>
              <p>Add</p>
            </div>
          </li>
        </ul>
      </section>

      <div id="add-modal" class="off">
        <app-window radius="24">
          <div class="modal-content">
            <h3>Add Shortcut</h3>
            <input type="text" id="shortcut-title" placeholder="Title (e.g. Netflix)" autocomplete="off" />
            <input type="url" id="shortcut-url" placeholder="URL (e.g. https://netflix.com)" autocomplete="off" />
            <div class="actions">
              <button type="button" id="btn-cancel">Cancel</button>
              <button type="button" id="btn-add">Add</button>
            </div>
          </div>
        </app-window>
      </div>
    `;
  }

  updated() {
    // Actions (chrome:// urls)
    [...this.shadowRoot.querySelectorAll("a.action")].forEach(a => {
      a.addEventListener("click", () => {
        const idx = a.className.split("idx-")[1];
        chrome.tabs.create({ active: true, url: this.iconList[idx].action });
      });
    });
    
    // Prevent default drag behavior on images so parent li can be dragged
    [...this.shadowRoot.querySelectorAll("a, img")].forEach(el => {
      el.addEventListener("dragstart", (e) => e.preventDefault());
    });

    // Drag and Drop logic
    let draggedIdx = null;
    [...this.shadowRoot.querySelectorAll(".draggable-item")].forEach(item => {
      item.addEventListener("dragstart", (e) => {
        draggedIdx = parseInt(item.getAttribute("data-idx"));
        item.classList.add("dragging");
        // Needed for Firefox
        e.dataTransfer.setData("text/plain", draggedIdx);
        e.dataTransfer.effectAllowed = "move";
      });

      item.addEventListener("dragend", () => {
        item.classList.remove("dragging");
        draggedIdx = null;
      });

      item.addEventListener("dragover", (e) => {
        e.preventDefault(); // allow drop
        if (parseInt(item.getAttribute("data-idx")) !== draggedIdx) {
          item.classList.add("drag-over");
        }
      });

      item.addEventListener("dragleave", () => {
        item.classList.remove("drag-over");
      });

      item.addEventListener("drop", (e) => {
        e.preventDefault();
        item.classList.remove("drag-over");
        const targetIdx = parseInt(item.getAttribute("data-idx"));
        
        if (draggedIdx !== null && draggedIdx !== targetIdx) {
          // Swap logic
          const draggedItem = this.iconList[draggedIdx];
          this.iconList.splice(draggedIdx, 1);
          this.iconList.splice(targetIdx, 0, draggedItem);
          this.saveShortcuts();
        }
      });
    });

    // Delete buttons
    [...this.shadowRoot.querySelectorAll(".delete-btn")].forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const idx = parseInt(btn.getAttribute("data-idx"));
        this.iconList.splice(idx, 1);
        this.saveShortcuts();
      });
    });

    // Modal UI logic
    const modal = this.shadowRoot.getElementById("add-modal");
    const titleInput = this.shadowRoot.getElementById("shortcut-title");
    const urlInput = this.shadowRoot.getElementById("shortcut-url");
    const btnCancel = this.shadowRoot.getElementById("btn-cancel");
    const btnAdd = this.shadowRoot.getElementById("btn-add");
    const addShortcutBtn = this.shadowRoot.querySelector(".add-btn");

    if (addShortcutBtn) {
      addShortcutBtn.addEventListener("click", () => {
        titleInput.value = "";
        urlInput.value = "";
        modal.classList.remove("off");
        titleInput.focus();
      });
    }

    const closeModal = () => {
      modal.classList.add("off");
    };

    btnCancel.addEventListener("click", closeModal);
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeModal();
    });

    btnAdd.addEventListener("click", () => {
      const title = titleInput.value.trim();
      let url = urlInput.value.trim();
      if (!title || !url) return;

      if (!url.startsWith("http://") && !url.startsWith("https://")) {
        url = "https://" + url;
      }

      let hostname = '';
      try { hostname = new URL(url).hostname; } catch(e) {}

      this.iconList.push({
        title,
        href: url,
        src: `https://www.google.com/s2/favicons?domain=${hostname}&sz=128`
      });
      this.saveShortcuts();
      closeModal();
    });

    // Enter key submits add form
    [titleInput, urlInput].forEach(input => {
      input.addEventListener("keyup", (e) => {
        if (e.key === "Enter") btnAdd.click();
      });
    });
  }
}
