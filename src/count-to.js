class CountTo extends HTMLElement {
  static get observedAttributes() {
    return ['to', 'use-locale-format', 'max', 'precision'];
  }

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'open' });
    this.currentNumber = 0; // 초기 현재 숫자는 0
  }

  connectedCallback() {
    this.updateCount();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return;

    if (name === 'to') {
      this.updateCount();
    } else if (name === 'use-locale-format' || name === 'max' || name === 'precision') {
      this.updateDisplay();
    }
  }

  updateCount() {
    const to = Number(this.getAttribute('to')) || 0;
    const max = Number(this.getAttribute('max'));
    const finalTarget = !isNaN(max) ? Math.min(to, max) : to;
    const duration = Number(this.getAttribute('duration')) || 3000;
    const interval = Number(this.getAttribute('interval')) || 100;
    const from = this.currentNumber;
    const range = finalTarget - from;
    const steps = Math.ceil(duration / interval);
    const increment = range / steps;

    clearInterval(this.counter);
    const counter = setInterval(() => {
      this.currentNumber += increment;
      if (increment === 0 || (increment > 0 && this.currentNumber >= finalTarget) || (increment < 0 && this.currentNumber <= finalTarget)) {
        this.currentNumber = finalTarget;
        clearInterval(counter);
      }
      this.updateDisplay();
    }, interval);
    this.counter = counter;
  }

  updateDisplay() {
    const precision = parseInt(this.getAttribute('precision'), 10) || 0;
    const useLocaleFormat = this.getAttribute('use-locale-format') === 'true';
    let number = this.currentNumber.toFixed(precision);
    const formattedNumber = useLocaleFormat ? parseFloat(number).toLocaleString(undefined, {minimumFractionDigits: precision, maximumFractionDigits: precision}) : number;
    this.shadow.innerHTML = `${formattedNumber}`;
  }
}

customElements.define('count-to', CountTo);
