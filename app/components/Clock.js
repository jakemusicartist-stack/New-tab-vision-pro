import { Component } from "../assets/core.js";

export default class Clock extends Component {
  css = `
    .clock-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: #fff;
      text-shadow: 0 4px 24px rgba(0,0,0,0.4);
      user-select: none;
      margin-bottom: -10px;
    }
    .time {
      font-size: clamp(48px, 6vw, 84px);
      font-weight: 200;
      letter-spacing: -0.02em;
      line-height: 1;
    }
    .date {
      font-size: clamp(14px, 1.5vw, 20px);
      font-weight: 400;
      opacity: 0.8;
      letter-spacing: 0.05em;
      margin-top: 8px;
    }
  `;

  render() {
    this.shadowRoot.innerHTML = `
      <div class="clock-container">
        <div class="time" id="time">--:--</div>
        <div class="date" id="date">---</div>
      </div>
    `;
  }

  updateTime() {
    const timeElem = this.shadowRoot.getElementById('time');
    const dateElem = this.shadowRoot.getElementById('date');
    if (!timeElem || !dateElem) return;

    const now = new Date();
    
    let hours = now.getHours();
    let minutes = now.getMinutes();
    
    // Format time: HH:MM
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    
    timeElem.innerText = `${hours}:${minutes}`;

    // Format date: Day, Month Date
    const options = { weekday: 'long', month: 'long', day: 'numeric' };
    dateElem.innerText = now.toLocaleDateString(undefined, options);
  }

  firstUpdated() {
    this.updateTime();
    this.timer = setInterval(() => this.updateTime(), 1000);
  }

  afterDetach() {
    if (this.timer) clearInterval(this.timer);
  }
}
