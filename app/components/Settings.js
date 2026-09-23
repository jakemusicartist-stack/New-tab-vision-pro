import { Component } from "../assets/core.js";
import IDB from "../assets/idb.js";

export default class Settings extends Component {
  css = `
    :host {
      font-family: 'SF-Pro', -apple-system, sans-serif;
    }
    .settings-btn {
      position: fixed;
      bottom: 24px;
      right: 24px;
      width: 48px;
      height: 48px;
      border-radius: 24px;
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(20px);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      z-index: 100;
      transition: all 0.2s ease;
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    }
    .settings-btn:hover {
      background: rgba(255, 255, 255, 0.2);
      transform: scale(1.05);
    }
    .settings-btn img {
      width: 24px;
      height: 24px;
      opacity: 0.8;
      filter: invert(1);
    }
    
    #settings-modal {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
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
    #settings-modal.off {
      opacity: 0;
      pointer-events: none;
    }
    .modal-content {
      padding: 28px;
      display: flex;
      flex-direction: column;
      gap: 24px;
      width: 320px;
      color: #fff;
    }
    .modal-content h3 {
      font-size: 22px;
      font-weight: 600;
      text-align: center;
      margin-bottom: 4px;
      letter-spacing: 0.5px;
    }
    
    .setting-row {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .setting-row label {
      font-size: 14px;
      opacity: 0.85;
      margin-left: 4px;
    }
    .setting-row select {
      width: 100%;
      height: 44px;
      background: rgba(255, 255, 255, 0.08);
      border-radius: 12px;
      color: #fff;
      border: 1px solid rgba(255,255,255,0.1);
      outline: none;
      padding: 0 14px;
      font-size: 14px;
      font-family: inherit;
      box-sizing: border-box;
      box-shadow: inset 0 1px 2px rgba(0,0,0,0.1);
    }
    .setting-row input[type="file"] {
      width: 100%;
      height: 44px;
      background: rgba(255, 255, 255, 0.08);
      border-radius: 12px;
      color: #fff;
      border: 1px solid rgba(255,255,255,0.1);
      outline: none;
      padding: 4px 6px;
      font-size: 14px;
      font-family: inherit;
      box-sizing: border-box;
      box-shadow: inset 0 1px 2px rgba(0,0,0,0.1);
      display: flex;
      align-items: center;
    }
    .setting-row select option {
      background: #333;
      color: #fff;
    }

    /* Style the file input button */
    input[type="file"]::file-selector-button {
      background: rgba(255, 255, 255, 0.15);
      border: none;
      border-radius: 8px;
      color: #fff;
      padding: 0 14px;
      height: 34px;
      margin: 0 12px 0 0;
      cursor: pointer;
      font-family: inherit;
      font-size: 13px;
      font-weight: 500;
      transition: 0.2s;
    }
    input[type="file"]::file-selector-button:hover {
      background: rgba(255, 255, 255, 0.25);
    }
    
    .toggle-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-direction: row;
      gap: 0;
    }
    .toggle-row label {
      font-size: 15px;
      opacity: 1;
      margin-left: 0;
    }

    /* Style checkbox as a toggle switch */
    input[type="checkbox"] {
      appearance: none;
      -webkit-appearance: none;
      width: 44px;
      height: 24px;
      background: rgba(255, 255, 255, 0.15);
      border-radius: 12px;
      position: relative;
      cursor: pointer;
      outline: none;
      transition: 0.3s ease;
      margin: 0;
      border: 1px solid rgba(255,255,255,0.1);
    }
    input[type="checkbox"]::after {
      content: '';
      position: absolute;
      top: 1px;
      left: 1px;
      width: 20px;
      height: 20px;
      background: #fff;
      border-radius: 50%;
      transition: 0.3s cubic-bezier(0.4, 0.0, 0.2, 1);
      box-shadow: 0 2px 5px rgba(0,0,0,0.3);
    }
    input[type="checkbox"]:checked {
      background: #34c759;
      border-color: transparent;
    }
    input[type="checkbox"]:checked::after {
      transform: translateX(20px);
      background: #fff;
    }
    
    .actions {
      display: flex;
      gap: 16px;
      margin-top: 16px;
    }
    .actions button {
      flex: 1;
      height: 40px;
      border-radius: 20px;
      cursor: pointer;
      background: rgba(255, 255, 255, 0.15);
      color: #fff;
      border: none;
      transition: 0.2s ease;
      font-size: 15px;
      font-weight: 500;
      font-family: inherit;
    }
    .actions button:hover {
      background: rgba(255, 255, 255, 0.25);
    }
    #btn-save {
      background: #fff;
      color: #000;
      font-weight: 600;
    }
    #btn-save:hover {
      background: #f0f0f0;
      transform: scale(1.02);
    }
    #btn-reset-wp {
      margin-top: -2px;
      background: rgba(255, 59, 48, 0.15);
      color: #ff453a;
      border: none;
      border-radius: 12px;
      padding: 10px;
      cursor: pointer;
      font-size: 13px;
      font-family: inherit;
      font-weight: 600;
      transition: 0.2s ease;
    }
    #btn-reset-wp:hover {
      background: rgba(255, 59, 48, 0.25);
    }
  `;

  searchEngine = "https://duckduckgo.com/";
  bootSound = true;
  wallpaperData = null;

  async beforeMount() {
    await IDB.open();
    
    // Load existing settings
    const storedEngine = await IDB.getSetting("searchEngine");
    if (storedEngine) this.searchEngine = storedEngine;
    
    const storedBoot = await IDB.getSetting("bootSound");
    if (storedBoot !== undefined) this.bootSound = storedBoot;
    
    this.reRender();
  }

  render() {
    this.shadowRoot.innerHTML = `
      <div class="settings-btn" id="settings-trigger">
        <img src="/app/assets/icons/setting.png" />
      </div>

      <div id="settings-modal" class="off">
        <app-window radius="24">
          <div class="modal-content">
            <h3>Settings</h3>
            
            <div class="setting-row toggle-row">
              <label>Startup Sound</label>
              <input type="checkbox" id="setting-boot" ${this.bootSound ? 'checked' : ''} />
            </div>

            <div class="setting-row">
              <label>Search Engine</label>
              <select id="setting-search">
                <option value="https://www.google.com/search" ${this.searchEngine === 'https://www.google.com/search' ? 'selected' : ''}>Google</option>
                <option value="https://duckduckgo.com/" ${this.searchEngine === 'https://duckduckgo.com/' ? 'selected' : ''}>DuckDuckGo</option>
                <option value="https://www.bing.com/search" ${this.searchEngine === 'https://www.bing.com/search' ? 'selected' : ''}>Bing</option>
              </select>
            </div>

            <div class="setting-row">
              <label>Custom Wallpaper</label>
              <input type="file" id="setting-wp" accept="image/png, image/jpeg, image/webp" />
              <button id="btn-reset-wp">Reset to Default</button>
            </div>

            <div class="actions">
              <button type="button" id="btn-cancel">Close</button>
              <button type="button" id="btn-save">Apply</button>
            </div>
          </div>
        </app-window>
      </div>
    `;
  }

  updated() {
    const trigger = this.shadowRoot.getElementById("settings-trigger");
    const modal = this.shadowRoot.getElementById("settings-modal");
    const btnCancel = this.shadowRoot.getElementById("btn-cancel");
    const btnSave = this.shadowRoot.getElementById("btn-save");
    const btnResetWp = this.shadowRoot.getElementById("btn-reset-wp");
    const wpInput = this.shadowRoot.getElementById("setting-wp");

    const closeModal = () => modal.classList.add("off");

    trigger.addEventListener("click", () => {
      modal.classList.remove("off");
    });

    btnCancel.addEventListener("click", closeModal);
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeModal();
    });

    wpInput.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        this.wallpaperData = event.target.result;
      };
      reader.readAsDataURL(file);
    });

    btnResetWp.addEventListener("click", async () => {
      await IDB.setSetting("wallpaper", null);
      this.wallpaperData = null;
      wpInput.value = "";
      alert("Wallpaper reset to default! Refresh page to see changes.");
    });

    btnSave.addEventListener("click", async () => {
      const bootVal = this.shadowRoot.getElementById("setting-boot").checked;
      const searchVal = this.shadowRoot.getElementById("setting-search").value;

      await IDB.setSetting("bootSound", bootVal);
      await IDB.setSetting("searchEngine", searchVal);
      if (this.wallpaperData) {
        await IDB.setSetting("wallpaper", this.wallpaperData);
      }

      closeModal();
      
      // Force reload to apply changes cleanly across all components
      window.location.reload();
    });
  }
}
