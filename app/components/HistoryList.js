import { Component, renderMap } from "../assets/core.js";
import IDB from "../assets/idb.js";
import { getRecentHistory } from "../assets/lib.js";
import MessageClientManager from "../assets/message.js";

export default class HistoryList extends Component {
  css = `
    .container {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      user-select: none;
    }

    .container > app-window {
      width: 92%;
      height: 60%;
    }
    .list-container {
      height: 100%;
      display: flex;
      flex-direction: column;
      margin: auto;
    }

    .list-container .header {
      font-size: 28px;  
      padding: 32px 32px 16px 32px;
      font-weight: bold;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .list-container .header h2 {
      margin: 0;
      font-size: inherit;
    }

    .clear-history-btn {
      font-size: 14px;
      font-weight: 600;
      padding: 8px 16px;
      border-radius: 16px;
      background: rgba(255, 59, 48, 0.15);
      color: #ff453a;
      border: none;
      cursor: pointer;
      transition: var(--duration);
      font-family: inherit;
      backdrop-filter: blur(10px);
    }

    .clear-history-btn:hover {
      background: rgba(255, 59, 48, 0.3);
      transform: scale(1.02);
    }
    .clear-history-btn:active {
      transform: scale(0.95);
    }
    
    section {
      flex: 1;
      overflow: hidden;
      padding: 0 22px 32px 22px;
    }

    ul {
      height: 100%;
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      overflow-y: auto;
      justify-content: center;
    }
    ul li {
      width: 100%;
      max-width: 300px;
      transition: var(--duration);
    }
    ul li:active {
      transform: scale(0.95);
    }
    ul li p {
      font-size: 14px;
      padding-top: 1em;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    ul li p img {
      width: 1em;
      margin-right: 0.5em;
    }
    ul li p span {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      width: fit-content;
    }
    ul li app-window {
      aspect-ratio: 1920 / 1080;
      width: 100%;
    }
    ul li app-window img {
      width: 100%;
    }
    ul li app-window .blank {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.02));
    }
    ul li app-window .blank img {
      aspect-ratio: 1/1;
      width: 64px;
      object-fit: contain;
    }
    ul li {
      position: relative;
    }
    .delete-btn {
      position: absolute;
      top: -10px;
      right: -10px;
      width: 28px;
      height: 28px;
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
      color: #fff;
    }
    ul li:hover .delete-btn {
      opacity: 1;
    }
    .delete-btn:hover {
      background: rgba(255, 255, 255, 0.4);
    }
  `;

  LIMIT = 12;
  list = [];

  compareItem(prevItem, currItem) {
    if (!prevItem) return true;

    for (const key in currItem) {
      if (prevItem[key] !== currItem[key]) return true;
    }

    return false;
  }

  renderRecents() {
    getRecentHistory(this.LIMIT).then(async historyList => {
      this.list = await Promise.all(
        historyList.map(async item => {
          const { url, title, lastVisitTime } = item;
          const data = await IDB.get(url);

          const historyItem = { url, title, lastVisitTime };

          if (data) return { ...data, ...historyItem };

          return historyItem;
        })
      );

      this.reRender();
    });
  }

  beforeMount() {
    MessageClientManager.listen(this, async ({ type, data }) => {
      if (type === 'update' && data.imgUrl) {
        this.list.forEach(async (item, idx) => {
          if (item.url === data.url) {
            this.list[idx].imgUrl = data.imgUrl;
          }
        });
      } else if (type === 'update-favicon' && data.favIconUrl) {
        this.list.forEach(async (item, idx) => {
          if (item.url === data.url) {
            this.list[idx].favIconUrl = data.favIconUrl;
          }
        });
      }
    });

    this.renderRecents();

    this.onVisitedListener = () => {
      this.renderRecents();
    };
    chrome.history.onVisited.addListener(this.onVisitedListener);
  }

  afterDetach() {
    if (this.onVisitedListener) {
      chrome.history.onVisited.removeListener(this.onVisitedListener);
    }
    MessageClientManager.disconnect(this);
  }

  render() {
    this.shadowRoot.innerHTML = `
      <div class="container">
        <app-window>
          <div class="list-container">
            <div class="header">
              <h2>History</h2>
              <button class="clear-history-btn">Clear History</button>
            </div>

            <section>
              <ul>
              ${renderMap(this.list, ({ title, url, imgUrl, favIconUrl }) => {
                let hostname = '';
                try { hostname = new URL(url).hostname; } catch(e) {}
                return `
                <li>
                  <div class="delete-btn" data-url="${url}">&#10005;</div>
                  <a href="${url}" target="_blank">
                    <app-window radius="16">
                    ${imgUrl ? `
                      <img src="${imgUrl}" />
                    ` : `
                      <div class="blank">
                        <img src="https://www.google.com/s2/favicons?domain=${hostname}&sz=128" onerror="this.src='/app/assets/icons/globe.png'" />
                      </div>
                    `}
                    </app-window>

                    <p>
                    <img src="${favIconUrl ? favIconUrl : `https://www.google.com/s2/favicons?domain=${hostname}&sz=32`}"/>
                    <span>${title}</span>
                    </p>
                  </a>
                </li>
              `})}
              </ul>
            </section>
          </div>
        </app-window>
      </div>
    `;
  }

  updated() {
    const ul = this.shadowRoot.querySelector("ul");

    ul.addEventListener("wheel", (e) => {
      e.stopPropagation();
    }, {
      passive: true
    });

    [...ul.querySelectorAll("a")].forEach(a => {
      a.addEventListener("mousedown", (e) => {
        e.stopPropagation();
      })
    });

    [...this.shadowRoot.querySelectorAll(".delete-btn")].forEach(btn => {
      btn.addEventListener("click", async (e) => {
        e.stopPropagation();
        e.preventDefault();
        const url = btn.getAttribute("data-url");
        await chrome.history.deleteUrl({ url });
        await IDB.removeData(url);
        this.renderRecents();
      });
    });

    const clearBtn = this.shadowRoot.querySelector(".clear-history-btn");
    if (clearBtn) {
      clearBtn.addEventListener("click", async (e) => {
        e.stopPropagation();
        await chrome.history.deleteAll();
        await IDB.clearAllHistory();
        this.renderRecents();
      });
    }
  }
}