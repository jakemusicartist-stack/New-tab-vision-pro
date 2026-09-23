import { Component } from "../assets/core.js";
import IDB from "../assets/idb.js";
import { minMax } from "../assets/lib.js";
import MessageClientManager from "../assets/message.js";

const ITEM_HEIGHT = 32;

export default class BookmarkList extends Component {
  sidebarWidth = 300;

  css = `
    .container {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    app-window {
      width: 92%;
    }
    .bookmark {
      width: 100%;
      display: grid;
      grid-template-columns: auto 1fr;
    }

    @media only screen and (min-height: 840px) {
      .bookmark {
        aspect-ratio: 960 / 840;
      }
    }
    @media only screen and (min-width: 1200px) {
      .bookmark {
        max-height: 840px;
      }
    }

    .sidebar {
      text-overflow: ellipsis;
      background: linear-gradient(rgba(0, 0, 0, 8%), rgba(0, 0, 0, 8%)), 
                  linear-gradient(rgba(0, 0, 0, 20%), rgba(0, 0, 0, 20%));
      display: flex;
      flex-direction: column;
      width: ${this.sidebarWidth}px;
      position: relative;
      user-select: none;
      border-right: solid var(--gray) 1px;
    }
    .sidebar .resizer {
      position: absolute;
      top: 0;
      right: 0;
      width: 50px;
      height: 100%;
      transform: translateX(50%);
    }
    .sidebar .resizer .cursor {
      position: absolute;
      top: 50%;
      right: 8px;
      transform: translateY(-50%);
      transition: var(--duration);
      width: clamp(4px, 0.5vw ,5px);
      border-radius: 999px;
      height: 8%;
      background-color: #fff;
      cursor: col-resize;
    }
    .sidebar .header {
      padding: 32px 28px 20px 32px;
      font-size: 28px;
      font-weight: bold;
      letter-spacing: 0.05em;
      display: grid;
      grid-template-rows: auto 1fr;
      border-bottom: solid var(--gray) 1px;
    }
    .sidebar .header h1 {
      display: flex;
      align-items: center;
      gap: 0.4em;
      margin: 0;
    }
    .sidebar .header img {
      width: 0.7em;
    }
    .search-box {
      margin-top: 16px;
    }
    .search-box input {
      width: 100%;
      height: 32px;
      border-radius: 8px;
      border: 1px solid rgba(255,255,255,0.2);
      background: rgba(255,255,255,0.1);
      color: #fff;
      padding: 0 12px;
      outline: none;
      font-size: 14px;
      box-sizing: border-box;
      font-family: inherit;
    }
    .search-box input::placeholder {
      color: rgba(255,255,255,0.5);
    }

    .tree-container {
      width: 100%;
      flex: 1;
      position: relative;
      font-weight: 300;
      padding: 10px 0 24px 0;
    }
    @media only screen and (max-width: 960px) {
      .tree-container {
        font-size: 14px;
      }
    }
    
    .queue {
      position: absolute;
      top: 0;
      left: 2px;
      right: 0px;
      display: flex;
      background: #43413e;
    }
    .queue > div {
      flex: 1;
    }

    #tree {
      width: 100%;
      height: 100%;
      aspect-ratio: 1/1;
      overflow-x: hidden;
      overflow-y: scroll;
      letter-spacing: 0.03em;
    }

    .folder,
    .bookmark-item
     {
      margin-left: 2px;
    }
    .children {
      transition: var(--duration);
      height: 0px;
      overflow: hidden;
    }

    .title {
      display: flex;
      align-items: center;
      width: 100%;
      padding: 0 0.2em;
      overflow: hidden;
      cursor: pointer;
    }
    .title span {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    .title img {
      width: 1em;
      margin-right: 0.5em;
      object-fit: contain;
    }

    .bookmark-item {
      display: flex;
      transition: var(--duration);
    }
    .bookmark-item:hover {
      background-color: rgba(255, 255, 255, 14%);
    }

    .content {
      padding: 28px;
      background: linear-gradient(rgba(0, 0, 0, 15%), rgba(0, 0, 0, 15%));
      display: flex;
      align-items: center;
      justify-content: center;
    }

    #add-bookmark-btn {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.15);
      color: #fff;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      font-weight: 300;
      transition: 0.2s;
      backdrop-filter: blur(10px);
    }
    #add-bookmark-btn:hover {
      background: rgba(255, 255, 255, 0.3);
    }
    #add-bookmark-btn:active {
      transform: scale(0.9);
    }

    #add-modal {
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
    #add-modal.off {
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
      margin: 0;
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
    .setting-row input, .setting-row select {
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
    .setting-row select option {
      background: #333;
      color: #fff;
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
    #btn-confirm-add {
      background: #fff;
      color: #000;
      font-weight: 600;
    }
    #btn-confirm-add:hover {
      background: #f0f0f0;
      transform: scale(1.02);
    }
  `;

  tree = [];
  favIconMapByUrl = {};
  folderTreeRef = {
    roots: []
  }
  childrenRefMap = {};
  queue = [];

  renderImg(url, favIconUrl) {
    Object.keys(this.favIconMapByUrl).forEach(bookmarkUrl => {
      if (url.includes(bookmarkUrl)) {
        this.favIconMapByUrl[bookmarkUrl].favIconUrl = favIconUrl;
        this.favIconMapByUrl[bookmarkUrl].refs.forEach(ref => {
          const img = ref.querySelector("img");
          if (img) img.src = favIconUrl;
        });
      }
    });
  }

  updateTreeHeight() {
    const dfs = (node) => {
      const img = node.ref.querySelector("img");
      img.src = "/app/assets/icons/" + (node.open ? "folder.png" : "folder.fill.png");

      if (!node.open) {
        node.childrenRef.style.height = '0px';
        return 0;
      }
      
      let totalHeight = node.defaultHeight;
      node.children.forEach(childId => {
        totalHeight += dfs(this.folderTreeRef[childId]);
      });

      node.childrenRef.style.height = `${totalHeight}px`;

      return totalHeight;
    }

    this.folderTreeRef['roots'].forEach((id) => {
      dfs(this.folderTreeRef[id]);
    });
  }

  sendEventToFinder(id) {
    let data;
    
    const updateData = () => {
      if (!id) return;

      const currentId = this.folderTreeRef[id].open ? id : this.folderTreeRef[id].parentId;
      
      if (!currentId) return;
      
      const children = this.childrenRefMap[currentId];

      data = {
        id: currentId,
        children: children.map(child => {
          const isChildFolder = 'children' in child;
          const title = child.title ? child.title : child.url;
          const favIconUrl = this.favIconMapByUrl[child.url]?.favIconUrl;

          return {
            type: isChildFolder ? 'folder' : 'bookmark',
            title,
            favIconUrl,
            id: child.id,
            url: child?.url
          }
        }),
        folderName: this.folderTreeRef[currentId].title,
        parentExist: Boolean(this.folderTreeRef[currentId].parentId)
      };
    }

    updateData();

    const finder = this.shadowRoot.querySelector("app-finder");
    finder.dispatchEvent(new CustomEvent("select", {
      detail: data
    }));
  }

  beforeMount() {
    chrome.bookmarks.getTree(tree => {
      this.tree = [...tree];
      this.reRender();
    })

    MessageClientManager.listen(this, async ({ type, data }) => {
      if (type === 'update-favicon') {
        this.renderImg(data.url, data.favIconUrl);
      }
    })

    this.addEventListener("folder-select", (e) => {
      const  { id, open } = e.detail;

      this.folderTreeRef[id].open = e.detail.open;
      
      this.updateTreeHeight();

      this.sendEventToFinder(id)
    });

    this.addEventListener("bookmark-moved", () => {
      chrome.bookmarks.getTree(tree => {
        this.tree = [...tree];
        this.reRender();
      });
    });
  }

  afterDetach() {
    MessageClientManager.disconnect(this);
  }

  renderTree() {
    const treeElem = document.createElement('div');
    treeElem.id = "tree";

    const queueElem = this.shadowRoot.querySelector(".queue");
    
    queueElem.addEventListener("click", () => {
      const elem = queueElem.querySelector(".folder");

      if (!elem) return;

      const id = elem.id;
      this.folderTreeRef[id].open = false;
      this.queue.pop();

      const lastIdx = this.queue[this.queue.length - 1];
      this.updateTreeHeight();
      renderQueue();
      this.sendEventToFinder(lastIdx);
      
      this.folderTreeRef[id].ref.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });

    const renderQueue = () => {
      queueElem.innerHTML = ``;
      if (this.queue.length === 0) return;

      const id = this.queue[this.queue.length - 1];
      const lastFolder = this.folderTreeRef[id];

      queueElem.append(lastFolder.ref.cloneNode(true));
    }

    const folderElemIo = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const id = entry.target.id;

        if (!entry.isIntersecting) {
          const d = entry.boundingClientRect.y - entry.rootBounds.y;
          if (d < 0 && this.folderTreeRef[id].open) {
            this.queue.push(entry.target.id);
          }
        } else {
          const idx = this.queue.findIndex(_id => _id === id);
          if (idx !== -1) this.queue.splice(idx, 1);
        }
      })

      renderQueue();
    }, {
      threshold: 1,
      root: treeElem
    });

    const recRender = (obj, parentId, parentChildrenElem, level) => {
      const itemDiv = document.createElement('div');
      const isFolder = 'children' in obj;
      const title = isFolder ? document.createElement('p') : document.createElement('a');

      itemDiv.id = obj.id;
      
      itemDiv.style.paddingLeft = '1em';
      title.style.height = `${ITEM_HEIGHT}px`;
      title.style.marginLeft = `${level * 1.5}em`;
      title.className = 'title';
      title.innerHTML = `
        <img src="/app/assets/icons/${isFolder ? "folder.fill.png" : "globe.png"}" draggable="false" />
        <span>${obj.title ? obj.title : obj.url}</span>
      `;
      if (!isFolder) {
        title.href = obj.url;
        title.target = "_blank";
        title.draggable = false;
      }

      itemDiv.appendChild(title);
      parentChildrenElem.appendChild(itemDiv);

      if (isFolder) {
        folderElemIo.observe(itemDiv);

        const children = document.createElement('div');
        
        itemDiv.classList.add("folder");
        children.classList.add("children");
        parentChildrenElem.appendChild(children);

        this.folderTreeRef[obj.id] = {
          id: obj.id,
          parentId,
          title: obj.title ? obj.title : obj.url,
          open: false,
          ref: itemDiv,
          childrenRef: children,
          children: [],
          defaultHeight: ITEM_HEIGHT * obj.children.length
        };
        
        this.childrenRefMap[obj.id] = obj.children;

        itemDiv.addEventListener("click", (e) => {
          e.stopPropagation();
          this.folderTreeRef[obj.id].open = !this.folderTreeRef[obj.id].open;
          
          this.updateTreeHeight();
          this.sendEventToFinder(obj.id);
        });

        // Drag and drop for sidebar tree folder
        let dragCounter = 0;
        itemDiv.addEventListener("dragenter", (e) => {
          e.preventDefault();
          dragCounter++;
          itemDiv.style.background = "rgba(255,255,255,0.2)";
        });
        itemDiv.addEventListener("dragover", (e) => {
          e.preventDefault();
          e.dataTransfer.dropEffect = "move";
        });
        itemDiv.addEventListener("dragleave", (e) => {
          dragCounter--;
          if (dragCounter === 0) {
            itemDiv.style.background = "";
          }
        });
        itemDiv.addEventListener("drop", (e) => {
          e.preventDefault();
          e.stopPropagation();
          dragCounter = 0;
          itemDiv.style.background = "";
          const draggedId = e.dataTransfer.getData("text/plain");
          if (draggedId && draggedId !== obj.id) {
            chrome.bookmarks.move(draggedId, { parentId: obj.id }, () => {
              chrome.bookmarks.getTree(tree => {
                this.tree = [...tree];
                this.reRender();
                // Select the folder they dropped into so finder updates
                this.folderTreeRef[obj.id].open = true;
                this.updateTreeHeight();
                this.sendEventToFinder(obj.id);
              });
            });
          }
        });

        obj.children.forEach((child) => {
          const childId = recRender(child, obj.id, children, level + 1);
          
          if (childId) {
            this.folderTreeRef[obj.id].children.push(childId);
          }
        });

        return obj.id;
      }
      
      IDB.get(obj.url).then((data) => {
        if (data && 'favIconUrl' in data && data.favIconUrl) {
          itemDiv.querySelector("img").src=data.favIconUrl;
        }
      })
      
      itemDiv.classList.add("bookmark-item");
      itemDiv.draggable = true;
      itemDiv.addEventListener("dragstart", (e) => {
        e.dataTransfer.setData("text/plain", obj.id);
        e.dataTransfer.effectAllowed = "move";
      });
      
      const link = itemDiv.querySelector("a");
      if (link) {
        link.draggable = false;
      }
      const img = itemDiv.querySelector("img");
      if (img) {
        img.draggable = false;
      }
      
      if (!this.favIconMapByUrl[obj.url]) {
        this.favIconMapByUrl[obj.url] = {
          refs: [],
          favIconUrl: undefined
        };
      }
      this.favIconMapByUrl[obj.url].refs.push(itemDiv);

      return undefined;
    }

    // 무조건 폴더가 최상위에 있다는 가정
    this.tree[0].children.forEach(item => {
      this.folderTreeRef['roots'].push(recRender(item, undefined, treeElem, 0));
    });

    this.shadowRoot.querySelector(".tree-container").append(treeElem);
    
    Object.keys(this.favIconMapByUrl).forEach(async bookmarkUrl => {
      const data = await IDB.get(bookmarkUrl);

      if (data && data?.favIconUrl) {
        this.renderImg(bookmarkUrl, data.favIconUrl);
      }
    });

    this.updateTreeHeight();
  }

  render() {
    this.shadowRoot.innerHTML = `
      <div class="container">
        <app-window>
          <div class="bookmark">
            <section class="sidebar">
              <div class="resizer">
                <div class="cursor"></div>
              </div>

              <div class="header">
                <div style="display: flex; justify-content: space-between; align-items: center; gap: 12px;">
                  <h1>
                    <img src="/app/assets/icons/book.closed.fill.png" />
                    Bookmarks
                  </h1>
                  <button id="add-bookmark-btn" title="Add Bookmark/Folder">&#43;</button>
                </div>
                <div class="search-box">
                  <input type="text" id="bookmark-search" placeholder="Search..." autocomplete="off" />
                </div>
              </div>

              <div class="tree-container">
                <div class="queue"></div>
              </div>
            </section>
            
            <section class="content">
              <app-finder></app-finder>
            </section>
          </div>
        </app-window>
        <div id="add-modal" class="off">
          <app-window radius="24">
            <div class="modal-content">
              <h3>Add New</h3>
              <div class="setting-row">
                <label>Type</label>
                <select id="add-type">
                  <option value="bookmark">Bookmark</option>
                  <option value="folder">Folder</option>
                </select>
              </div>
              <div class="setting-row">
                <label>Title</label>
                <input type="text" id="add-title" placeholder="Title..." />
              </div>
              <div class="setting-row" id="url-row">
                <label>URL</label>
                <input type="text" id="add-url" placeholder="https://..." />
              </div>
              <div class="actions">
                <button id="btn-cancel-add">Cancel</button>
                <button id="btn-confirm-add">Add</button>
              </div>
            </div>
          </app-window>
        </div>
      </div>
    `
  }

  updated() {
    if (this.tree.length > 0) this.renderTree();

    const bookmark = this.shadowRoot.querySelector(".bookmark");
    const sidebar = this.shadowRoot.querySelector(".sidebar");
    const resizer = this.shadowRoot.querySelector(".resizer");
    const cursor = this.shadowRoot.querySelector(".cursor");

    resizer.addEventListener("mouseenter", () => {
      cursor.style.zIndex = 1;
      cursor.style.opacity = 1;
    });
    resizer.addEventListener("mouseleave", () => {
      cursor.style.opacity = 0;
      cursor.style.zIndex= -1;
    });

    let cursorClicked = false;
    bookmark.addEventListener("wheel", (e) => {
      e.stopPropagation();
    }, {
      passive: true
    });

    const mousemoveHandler = (e) => {
      e.stopPropagation();
      this.sidebarWidth = minMax(this.sidebarWidth + e.movementX, 260, 500);
      sidebar.style.width = `${this.sidebarWidth}px`;
    };

    const mouseupHandler = () => {
      window.removeEventListener("mousemove", mousemoveHandler);
      window.removeEventListener("mouseup", mouseupHandler);
    };

    bookmark.addEventListener("mousedown", (e) => {
      if (e.target.className === "cursor") {
        window.addEventListener("mousemove", mousemoveHandler);
        window.addEventListener("mouseup", mouseupHandler);
      }
    });

    const searchInput = this.shadowRoot.getElementById("bookmark-search");
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        const q = e.target.value.toLowerCase();
        if (!q) {
          // Revert to normal selection
          const lastSelected = this.queue[this.queue.length - 1] || this.folderTreeRef['roots'][0];
          this.sendEventToFinder(lastSelected);
          return;
        }
        
        const results = [];
        const searchNode = (node) => {
          if (node.url) {
            if ((node.title && node.title.toLowerCase().includes(q)) || node.url.toLowerCase().includes(q)) {
              results.push({
                type: 'bookmark',
                title: node.title || node.url,
                favIconUrl: this.favIconMapByUrl[node.url]?.favIconUrl,
                id: node.id,
                url: node.url
              });
            }
          }
          if (node.children) node.children.forEach(searchNode);
        };
        
        this.tree.forEach(searchNode);
        
        // Limit results to prevent UI freezing
        const limitedResults = results.slice(0, 100);
        
        const finder = this.shadowRoot.querySelector("app-finder");
        finder.dispatchEvent(new CustomEvent("select", {
          detail: {
            id: 'search',
            children: limitedResults,
            folderName: `Search: "${q}"`,
            parentExist: false
          }
        }));
      });
    }

    // Modal Logic
    const addModal = this.shadowRoot.getElementById("add-modal");
    const addBtn = this.shadowRoot.getElementById("add-bookmark-btn");
    const cancelBtn = this.shadowRoot.getElementById("btn-cancel-add");
    const confirmBtn = this.shadowRoot.getElementById("btn-confirm-add");
    const typeSelect = this.shadowRoot.getElementById("add-type");
    const titleInput = this.shadowRoot.getElementById("add-title");
    const urlInput = this.shadowRoot.getElementById("add-url");
    const urlRow = this.shadowRoot.getElementById("url-row");

    if (addBtn) {
      addBtn.addEventListener("click", () => {
        titleInput.value = "";
        urlInput.value = "";
        addModal.classList.remove("off");
      });
    }

    if (typeSelect) {
      typeSelect.addEventListener("change", (e) => {
        if (e.target.value === "folder") {
          urlRow.style.display = "none";
        } else {
          urlRow.style.display = "flex";
        }
      });
    }

    const closeModal = () => {
      addModal.classList.add("off");
    };

    if (cancelBtn) cancelBtn.addEventListener("click", closeModal);

    if (confirmBtn) {
      confirmBtn.addEventListener("click", () => {
        const type = typeSelect.value;
        const title = titleInput.value.trim();
        const url = urlInput.value.trim();

        if (!title) return;

        // Determine parentId: Use currently selected folder in finder if it exists, else root
        const finder = this.shadowRoot.querySelector("app-finder");
        let parentId = "1"; // Default Bookmarks bar
        if (finder && finder.currentInfo && finder.currentInfo.id && finder.currentInfo.id !== "search") {
          parentId = finder.currentInfo.id;
        } else if (this.queue && this.queue.length > 0) {
          parentId = this.queue[this.queue.length - 1];
        }

        const createData = { parentId, title };
        if (type === "bookmark") {
          if (!url) return;
          createData.url = url;
        }

        chrome.bookmarks.create(createData, () => {
          closeModal();
          chrome.bookmarks.getTree(tree => {
            this.tree = [...tree];
            this.reRender();
          });
        });
      });
    }

    // Close modal when clicking outside
    if (addModal) {
      addModal.addEventListener("click", (e) => {
        if (e.target === addModal) closeModal();
      });
    }
  }
}