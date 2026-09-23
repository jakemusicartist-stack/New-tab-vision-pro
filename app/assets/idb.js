export default class IDB {
  static VERSION = 2;
  static db;

  static open = async () => new Promise((res, rej) => {
    const request = indexedDB.open("db", this.VERSION);

    request.onupgradeneeded = (e) => {
      this.db = e.target.result;
      if (!this.db.objectStoreNames.contains('history')) {
        this.db.createObjectStore("history", { keyPath: "url" });
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

  static async setSetting(key, val) {
    if (!this.db) await this.open();
    return new Promise((resolve) => {
      let req = this.db.transaction("settings", "readwrite")
        .objectStore("settings")
        .put({ key, val });
      req.onsuccess = () => resolve(true);
      req.onerror = () => resolve(false);
    });
  }

  static async getSetting(key) {
    if (!this.db) await this.open();
    return new Promise((resolve) => {
      let req = this.db.transaction("settings")
        .objectStore("settings")
        .get(key);
      req.onsuccess = () => resolve(req.result ? req.result.val : null);
      req.onerror = () => resolve(null);
    });
  }

  static async get(url) {
    if (!this.db) {
      console.error("Database has not been initialized.");
      return;
    }

    return new Promise(res => {
      const transaction = this.db.transaction("history", "readwrite")
      const store = transaction.objectStore("history");
  
      store.get(url).onsuccess = (e) => res(e.target.result);
      store.get(url).onerror = () => res(undefined);
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

  static async clearAllHistory() {
    if (!this.db) await this.open();
    return new Promise(res => {
      const transaction = this.db.transaction("history", "readwrite");
      const store = transaction.objectStore("history");
      const request = store.clear();
      request.onsuccess = () => res();
      request.onerror = () => res();
    });
  }

  static async put(data) {
    if (!this.db) {
      console.error("Database has not been initialized.");
      return;
    }

    return new Promise(res => {
      const transaction = this.db.transaction("history", "readwrite")
      const store = transaction.objectStore("history");

      const request = store.put(data);

      request.onsuccess = () => res();

      request.onerror = () => {
        console.log("Error", request.error);
        res();
      };
    })
  }
}
