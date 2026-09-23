import { Component, renderMap } from "../assets/core.js";
import IDB from "../assets/idb.js";

export default class Finder extends Component {
  css = `
    section {
      width: 100%;
      height: 100%;
      max-width: 820px;
      max-height: 50vh;
      display: flex;
      overflow-y: auto;
      flex-direction: column;
      gap: 36px;
      user-select: none;
    }

    .container li * {
      pointer-events: none;
    }
    .container li a {
      pointer-events: auto;
    }
    .container li.drag-over .favicon {
      border: 2px dashed rgba(255,255,255,0.8);
      transform: scale(1.05);
      background: rgba(255,255,255,0.1);
    }
    .container h2.drag-over svg {
      transform: scale(1.2);
      fill: #fff;
    }
    .container h2 {
      display: flex;
      align-items: center;
      font-size: 22px;
      font-weight: bold;
      margin-bottom: 1em;
      gap: 0.5em;
    }
    .container h2 svg {
      transition: var(--duration);
      cursor: pointer;
      fill: #fff;
      width: 0.9em;
      height: 0.9em;
      pointer-events: auto;
    }
    .container h2 svg:hover {
      fill: rgba(255, 255, 255, 0.7);
    }

    .container ul {
      width: 100%;
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }
    .container li {
      width: 64px;
      font-size: 12px;
      letter-spacing: 0.05em;
      line-height: 1.2em;
      cursor: pointer;
      transition: var(--duration);
      user-select: none;
      -webkit-user-select: none;
    }
    .container li:active {
      filter: brightness(0.8);
    }
    .container .favicon {
      width: 64px;
      height: 64px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #9f9f9f;
      border-radius: 12px;
      margin-bottom: 0.6em;
      transition: var(--duration);
      box-sizing: border-box;
    }
    .container .favicon a {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .container .favicon img {
      width: 70%;
      height: 70%;
      object-fit: contain;
    }
    .container .favicon span {
      font-size: 32px;
      text-transform: uppercase;
    }
    .container li p {
      word-break: break-all;
      text-align: center;
      overflow: hidden;
      display: -webkit-box;
      -webkit-line-clamp: 2; /* Number of lines you want */
      -webkit-box-orient: vertical;
      text-overflow: ellipsis;
    }

    .line {
      width: 23%;
      margin: 36px auto 18px auto;
      height: 1px;
      background-color: var(--gray);
    }
  `;

  currentInfo = {
    name: '',
    id: '',
    parentExist: false,
    parentId: null
  };
  recentList = [];
  currentPositionItems = [];
  
  beforeMount() {
    chrome.bookmarks.getRecent(10, async (tree) => {
      this.recentList = [...tree];

      await Promise.all(this.recentList.map(async (item, idx) => {
        const data = await IDB.get(item.url);

        this.recentList[idx].favIconUrl = data ? data.favIconUrl : "";
      }));

      this.reRender();
    });

    this.addEventListener("select", (e) => {
      const isFinderOn = Boolean(e.detail);

      this.currentInfo.id = isFinderOn ? e.detail.id : '';
      this.currentInfo.name = isFinderOn ? e.detail.folderName : '';
      this.currentPositionItems = isFinderOn ? [...e.detail.children] : [];
      this.currentInfo.parentExist = isFinderOn ? e.detail.parentExist : false;
      this.currentInfo.parentId = isFinderOn ? e.detail.parentId : null; // We need parentId to move out

      this.reRender();
    });
  }

  render() {
    this.shadowRoot.innerHTML = `
      <section>
        <div class="container finder"></div>
 
        <div class="container recent">
          <h2>Recent Added</h2>

          <ul>
          ${renderMap(this.recentList, (item) => {
              let hostname = '';
              try { hostname = new URL(item.url).hostname; } catch(e) {}
              return `
              <li>
                <a href="${item.url}" target="_blank" draggable="false">
                  <div class="favicon">
                    ${item.favIconUrl ? `
                      <img src="${item.favIconUrl}" draggable="false" />
                    ` : `
                      <img src="https://www.google.com/s2/favicons?domain=${hostname}&sz=128" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';" draggable="false" />
                      <span style="display:none;">${item.title ? item.title.charAt(0) : item.url.charAt(0)}</span>
                    `}
                  </div>
                  <p>${item.title ? item.title : item.url}</p>
                </a>
              </li>
          `})}
          </ul>
        </div>
      </section>
    `
  }

  renderFinder() {
    const root = document.createElement('div');

    const backHTML = `
      <svg width="10" height="17" viewBox="0 0 10 17" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clip-path="url(#clip0_149_25)">
      <path d="M0 8.47656C0 8.60026 0.0227865 8.71582 0.0683594 8.82324C0.113932 8.93067 0.182292 9.02995 0.273438 9.12109L8.01758 16.6895C8.19336 16.8652 8.40495 16.9531 8.65234 16.9531C8.82161 16.9531 8.97298 16.914 9.10645 16.8359C9.23991 16.7578 9.34733 16.6521 9.42871 16.5186C9.51009 16.3851 9.55078 16.2338 9.55078 16.0645C9.55078 15.8236 9.46289 15.612 9.28711 15.4297L2.17773 8.47656L9.28711 1.52344C9.46289 1.34115 9.55078 1.12956 9.55078 0.888672C9.55078 0.719401 9.51009 0.568034 9.42871 0.43457C9.34733 0.301107 9.23991 0.195313 9.10645 0.117188C8.97298 0.0390627 8.82161 0 8.65234 0C8.40495 0 8.19336 0.0846353 8.01758 0.253906L0.273438 7.83203C0.182292 7.92318 0.113932 8.02246 0.0683594 8.12988C0.0227865 8.23731 0 8.35287 0 8.47656Z" fill-opacity="0.85"/>
      </g>
      <defs>
      <clipPath id="clip0_149_25">
      <rect width="9.55078" height="16.9629" />
      </clipPath>
      </defs>
      </svg>
    `;

    root.innerHTML = `
      <h2 id="back-nav">${this.currentInfo.parentExist ? backHTML : ''}${this.currentInfo.name}</h2>

      <ul>
      ${renderMap(this.currentPositionItems, (item, idx) => {
        let hostname = '';
        if (item.type !== 'folder') {
          try { hostname = new URL(item.url).hostname; } catch(e) {}
        }
        return `
        <li id="idx-${idx}" draggable="true" data-type="${item.type}" data-id="${item.id}">
          <div class="favicon">
          ${item.type === 'folder' ? `
            <img src="/app/assets/icons/folder.fill.png" />
          ` : `
            <a href="${item.url}" target="_blank" draggable="false">
            ${item.favIconUrl ? `
              <img src="${item.favIconUrl}" draggable="false" />            
            ` : `
              <img src="https://www.google.com/s2/favicons?domain=${hostname}&sz=128" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';" draggable="false" />
              <span style="display:none;">${item.title.charAt(0)}</span>
            `}
            </a>
          `}
          </div>
          <p>${item.title}</p>
        </li>  
      `})}
      </ul>

      <div class="line"></div>
    `;

    const syncId = (id, open) => {
      this.dispatchEvent(new CustomEvent("folder-select", {
        bubbles: true,
        composed: true,
        detail: { 
          id,
          open
        }
      }));
    }

    [...root.querySelectorAll("li")].forEach(elem => {
      elem.addEventListener("click", (e) => {
        const idx = Number(elem.id.split("idx-")[1]);
        const item = this.currentPositionItems[idx];

        if (item.type !== 'folder') return;

        e.preventDefault();
        syncId(item.id, true);
      });

      // Drag and drop implementation
      elem.addEventListener("dragstart", (e) => {
        e.dataTransfer.setData("text/plain", elem.getAttribute("data-id"));
        e.dataTransfer.effectAllowed = "move";
      });

      if (elem.getAttribute("data-type") === "folder") {
        let dragCounter = 0;
        elem.addEventListener("dragenter", (e) => {
          e.preventDefault();
          dragCounter++;
          elem.classList.add("drag-over");
        });
        elem.addEventListener("dragover", (e) => {
          e.preventDefault();
          e.dataTransfer.dropEffect = "move";
        });
        elem.addEventListener("dragleave", (e) => {
          dragCounter--;
          if (dragCounter === 0) {
            elem.classList.remove("drag-over");
          }
        });
        elem.addEventListener("drop", (e) => {
          e.preventDefault();
          dragCounter = 0;
          elem.classList.remove("drag-over");
          const draggedId = e.dataTransfer.getData("text/plain");
          const targetFolderId = elem.getAttribute("data-id");
          if (draggedId && targetFolderId && draggedId !== targetFolderId) {
            chrome.bookmarks.move(draggedId, { parentId: targetFolderId }, () => {
              // Trigger reload by re-selecting the current folder
              syncId(this.currentInfo.id, true);
              // We also need BookmarkList to re-render tree, but we can emit event
              this.dispatchEvent(new CustomEvent("bookmark-moved", { bubbles: true, composed: true }));
            });
          }
        });
      }
    });

    if (this.currentInfo.parentExist) {
      const backNav = root.querySelector("#back-nav");
      
      root.querySelector("svg").addEventListener("click", () => {
        syncId(this.currentInfo.id, false);
      });

      let backDragCounter = 0;
      backNav.addEventListener("dragenter", (e) => {
        e.preventDefault();
        backDragCounter++;
        backNav.classList.add("drag-over");
      });
      backNav.addEventListener("dragover", (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
      });
      backNav.addEventListener("dragleave", (e) => {
        backDragCounter--;
        if (backDragCounter === 0) {
          backNav.classList.remove("drag-over");
        }
      });
      backNav.addEventListener("drop", (e) => {
        e.preventDefault();
        backDragCounter = 0;
        backNav.classList.remove("drag-over");
        const draggedId = e.dataTransfer.getData("text/plain");
        if (draggedId && this.currentInfo.parentId) {
          chrome.bookmarks.move(draggedId, { parentId: this.currentInfo.parentId }, () => {
            syncId(this.currentInfo.id, true);
            this.dispatchEvent(new CustomEvent("bookmark-moved", { bubbles: true, composed: true }));
          });
        }
      });
    }

    this.shadowRoot.querySelector(".finder").append(root);
  }

  updated() {
    const finderEl = this.shadowRoot.querySelector(".finder");
    const recentEl = this.shadowRoot.querySelector(".recent");

    if (this.currentInfo.id || this.currentPositionItems.length > 0) {
      this.renderFinder();
      if (finderEl) finderEl.style.display = 'block';
      if (recentEl) recentEl.style.display = 'none';
    } else {
      if (finderEl) finderEl.style.display = 'none';
      if (recentEl) recentEl.style.display = 'block';
    }

    [...this.shadowRoot.querySelectorAll(".container")].forEach(a => {
      a.addEventListener("mousedown", (e) => {
        e.stopPropagation();
      })
    });
  }
}