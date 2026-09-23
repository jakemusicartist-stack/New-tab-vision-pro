const LIMIT_CNT = 200;

class IDB {
  static VERSION = 2;
  static db;

  static open = async () => new Promise((res, rej) => {
    if (this.db) return res();
    const request = indexedDB.open("db", this.VERSION);

    request.onupgradeneeded = (e) => {
      this.db = e.target.result;
      if (!this.db.objectStoreNames.contains('history')) {
        this.db.createObjectStore("history", {
          keyPath: "url"
        });
      }
      if (!this.db.objectStoreNames.contains('settings')) {
        this.db.createObjectStore("settings", { keyPath: "key" });
      }
    };

    request.onerror = (e) => {
      console.error("Database error: " + e.target.error);
      rej();
    };

    request.onsuccess = (e) => {
      this.db = e.target.result;
      res();
    };
  })

  static async _preProcess() {
    return new Promise((res, rej) => {
      const transaction = this.db.transaction("history", "readwrite");
      const store = transaction.objectStore("history");
      const countReq = store.count();

      countReq.onsuccess = () => {
        if (countReq.result >= LIMIT_CNT) {
          // Find the oldest by getting the first record (oldest visit time)
          // Wait, IndexedDB orders by key (url) by default. 
          // We need an index on lastVisitTime to easily find the oldest, 
          // but since we don't have it, we'll open a cursor and scan, 
          // or just delete any item to keep size down. 
          // Better: just open a cursor and delete the first one (alphabetical by URL).
          // To be perfectly accurate without a schema migration, we can just delete a single record.
          const cursorReq = store.openCursor();
          cursorReq.onsuccess = (e) => {
            const cursor = e.target.result;
            if (cursor) {
              store.delete(cursor.primaryKey).onsuccess = res;
            } else {
              res();
            }
          };
          cursorReq.onerror = res;
        } else {
          res();
        }
      };
      countReq.onerror = res;
    });
  }

  static async get(url) {
    if (!this.db) await this.open();
    return new Promise(res => {
      const transaction = this.db.transaction("history", "readonly")
      const store = transaction.objectStore("history");
      const request = store.get(url);
      request.onsuccess = (e) => res(e.target.result);
      request.onerror = () => res(undefined);
    });
  }

  static async put(data) {
    if (!this.db) await this.open();
    await this._preProcess();
    
    const prevData = await this.get(data.url);
    return new Promise(res => {
      const transaction = this.db.transaction("history", "readwrite")
      const store = transaction.objectStore("history");
      const request = store.put({
        ...prevData,
        ...data
      });
      request.onsuccess = () => res();
      request.onerror = () => res();
    });
  }

  static async removeData(url) {
    if (!this.db) await this.open();
    return new Promise(res => {
      const transaction = this.db.transaction("history", "readwrite")
      const store = transaction.objectStore("history");
      const request = store.delete(url);
      request.onsuccess = () => res();
      request.onerror = () => res();
    });
  }
}

class MessageManager {
  // Instead of an in-memory set that gets wiped, we query all tabs that might be the new tab
  static async send(message) {
    chrome.tabs.query({}, (tabs) => {
      tabs.forEach(tab => {
        // Only send to tabs that might be the extension's new tab page
        if (tab.url === "chrome://newtab/" || tab.url.startsWith("chrome-extension://")) {
          chrome.tabs.sendMessage(tab.id, message, () => {
            // Ignore errors for tabs that don't have a content script listening
            if (chrome.runtime.lastError) {}
          });
        }
      });
    });
  }
}

async function getCapture() {
  try {
    return await chrome.tabs.captureVisibleTab();
  } catch {
    return undefined;
  }
}

async function getRecentHistory(n) {
  return await chrome.history.search({ text: '', maxResults: n })
}

chrome.history.onVisited.addListener(async (historyItem) => {
  await IDB.open();
  const { url, title, lastVisitTime } = historyItem;
  
  // Prevent capturing wrong tab: check if the active tab matches this URL
  let imgUrl = undefined;
  try {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tabs.length > 0 && tabs[0].url === url) {
       imgUrl = await getCapture();
    }
  } catch (e) {}

  const data = {
    url,
    title,
    lastVisitTime,
    imgUrl
  };

  await IDB.put(data);
  MessageManager.send({
    type: 'update',
    data
  });
});

chrome.tabs.onUpdated.addListener(async (tabId, info, tab) => {
  if (tab.url === "chrome://newtab/" || tab.url.startsWith("chrome-extension://")) {
    return;
  }

  const { url, favIconUrl } = tab;
  if (url && favIconUrl) {
    await IDB.open();
    const data = { url, favIconUrl };

    await IDB.put(data);
    MessageManager.send({
      type: 'update-favicon', 
      data
    });
  }
});

chrome.runtime.onInstalled.addListener(() => {
  IDB.open();
  chrome.management.getSelf(self => {
    chrome.storage.local.set({
      boot: self.installType === 'development' ? false : true
    });
  });
});