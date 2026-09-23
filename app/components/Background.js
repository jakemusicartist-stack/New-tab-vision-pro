import { Component } from "../assets/core.js";
import IDB from "../assets/idb.js";

export default class Background extends Component {
  css = `
    #background {
      position: fixed;
      top: 0;
      left: 0;
      z-index: -1;
      width: 100vw;
      height: 100vh;
    }

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    img.night {
      transition: ease 500ms;
      position: absolute;
      top: 0;
      left: 0;
      opacity: 0;
    }
  `;

  ratio = 0;
  period = 60 * 1000;
  customWallpaper = null;

  async beforeMount() {
    await IDB.open();
    this.customWallpaper = await IDB.getSetting("wallpaper");
    this.reRender();
  }

  render() {
    if (this.customWallpaper) {
      this.shadowRoot.innerHTML = `
        <div id="background">
          <img src="${this.customWallpaper}" />
        </div>
      `;
    } else {
      this.shadowRoot.innerHTML = `
        <div id="background">
          <img class="day" src="/app/assets/bg-day.webp" />
          <img class="night" src="/app/assets/bg-night.webp" />
        </div>
      `;
    }
  }

  updated() {
    if (this.customWallpaper) return;
    
    const imgNight = this.shadowRoot.querySelector("img.night");
    if (!imgNight) return;

    const animate = () => {
      const hour = new Date().getHours();

      if (hour < 3) {
        this.ratio = 1;
      } else if (3 <= hour && hour < 7) {
        this.ratio = (7 - hour) / 4;
      } else if (7 <= hour && hour < 15) {
        this.ratio = 0;
      } else if (15 <= hour && hour < 19) {
        this.ratio = 1 - (19 - hour) / 4;
      } else {
        this.ratio = 1;
      }

      imgNight.style.opacity = this.ratio;
    }

    animate();
    setInterval(() => {
      animate();
    }, this.period);
  }
}