console.log('Content script loaded');



class ColorPicker {
  constructor() {
    this.shadowRoot = null;
    this.canvas = null;
    this.scrollTimeout = null;
    this.isActive = false;
    this.colorContainer = null;
    this.currentColorValues = {
      rgb: {
        r: "",
        g: "",
        b: "",
      },
      hex: "",
    };
  }

  processScreenshot(dataUrl) {
    if (!this.offscreenImage) {
      this.offscreenImage = new Image();
      this.offscreenImage.onload = () => {
        const ctx = this.canvas.getContext("2d", { willReadFrequently: true });
        ctx.drawImage(
          this.offscreenImage,
          0,
          0,
          this.offscreenImage.naturalWidth,
          this.offscreenImage.naturalHeight,
          0,
          0,
          this.canvas.width,
          this.canvas.height
        );
        this.canvas.style.opacity = "1";
        this.setVisibilityByClassName("color-picker-container", "visible");
        this.setVisibilityByClassName("clicked-div-color-data", "visible");
        this.colorDisplay.querySelector("#magnify-canvas").style.display = "block";
      };
    }
    this.offscreenImage.src = dataUrl;
  }

  activate() {
    if (!this.isActive) {
      this.setupShadowDOM();
      this.listenForScroll();
      this.listenForResize();
      this.listenForVisibilityChange();
      this.listenForEscapeKey();
      this.setupColorPicker();
      this.isActive = true;
    }
  }
  setVisibilityByClassName(className, visibility) {
    const elements = document.querySelectorAll(`.${className}`);
    elements.forEach((el) => (el.style.visibility = visibility));
  }

  deactivate() {
    if (this.isActive) {
      window.removeEventListener("scroll", this.scrollHandler);
      document.removeEventListener("visibilitychange", this.visibilityHandler);
      document.removeEventListener("keydown", this.escapeKeyHandler);
      // Clean up shadow DOM and canvas
      if (this.shadowRoot && this.shadowRoot.host) {
        this.shadowRoot.host.remove();
      }
      this.canvas = null;
      this.shadowRoot = null;
      this.isActive = false;
      document.querySelector(".color-picker-container").remove();
    }
  }

  listenForEscapeKey() {
    this.escapeKeyHandler = (e) => {
      if (e.key === "Escape") {
        this.deactivate();
      }
    };
    document.addEventListener("keydown", this.escapeKeyHandler);
  }

  listenForVisibilityChange() {
    this.visibilityHandler = () => {
      if (document.visibilityState === "visible") {
        this.updateScreenshot();
      }
    };
    document.addEventListener("visibilitychange", this.visibilityHandler);
  }

  // Throttle the scroll event to reduce jank
  listenForScroll() {
    this.scrollHandler = this.throttle(() => {
      this.canvas.style.opacity = "0";
      this.setVisibilityByClassName("color-picker-container", "hidden");

      clearTimeout(this.scrollTimeout);
      this.scrollTimeout = setTimeout(() => {
        this.canvas.style.opacity = "1";
        this.updateScreenshot();
      }, 150);
    }, 100);

    window.addEventListener("scroll", this.scrollHandler);
  }

  setupShadowDOM() {
    const container = document.createElement("div");
    document.body.appendChild(container);

    Object.assign(container.style, {
      position: "fixed",
      top: "0",
      left: "0",
      width: "100vw",
      height: "100vh",
      zIndex: "9999",
    });

    this.shadowRoot = container.attachShadow({ mode: "open" });

    this.canvas = document.createElement("canvas");
    Object.assign(this.canvas.style, {
      width: "100%",
      height: "100%",
    });

    this.shadowRoot.appendChild(this.canvas);
    this.updateCanvasSize();
    this.updateScreenshot();
  }

  updateCanvasSize() {
    const dpr = window.devicePixelRatio || 1;
    this.canvas.width = this.shadowRoot.host.clientWidth * dpr;
    this.canvas.height = this.shadowRoot.host.clientHeight * dpr;
  }

  updateScreenshot() {
    // Immediately set canvas and color picker to be hidden to prepare for new data
    this.canvas.style.opacity = "0";
    this.setVisibilityByClassName("color-picker-container", "hidden");
    this.setVisibilityByClassName("clicked-div-color-data", "hidden");
    try {
      chrome.runtime.sendMessage(
        { action: "colorPicker_captureTab" },
        (response) => {
          if (chrome.runtime.lastError) {
            console.error("Runtime error:", chrome.runtime.lastError);
            return;
          }
          if (response.error) {
            console.error(response.error);
            // Optionally, you can show this error to the user
          } else if (response && response.data) {
            const dataUrl = response.data;
            this.processScreenshot(dataUrl);
          } else {
            console.error("Failed to capture tab screenshot.");
          }
        }
      );
    } catch (error) {
      console.error("An unexpected error occurred:", error);
    }
  
    
  }

  // Throttle function to reduce rapid firing of events
  throttle(func, delay) {
    let lastFunc;
    let lastRan;
    return function (...args) {
      if (!lastRan) {
        func(...args);
        lastRan = Date.now();
      } else {
        clearTimeout(lastFunc);
        lastFunc = setTimeout(function () {
          if (Date.now() - lastRan >= delay) {
            func(...args);
            lastRan = Date.now();
          }
        }, delay - (Date.now() - lastRan));
      }
    };
  }

  getColorHtmlTemplate() {
    return `
    <div class="color-picker-hover">
      <div class="canvas-section">
        <div class="left-crosshair"></div>
        <div class="right-crosshair"></div>
        <canvas id="magnify-canvas"></canvas>
      </div>

      <div class="canvas-color-data">
        <div class="rgb">
         <div class="r rgb-item">
          <span>R</span><span>65</span>
         </div>
         <div class="g rgb-item">
          <span>R</span><span>65</span>
         </div>
         <div class="b rgb-item">
          <span>R</span><span>65</span>
         </div>
        </div>
        <div class="hex-data">
          <div class="color color-box">

          </div>
          <div class="hex">#ffffff</div>
        </div>
      </div>
    </div>
    `;
  }

  appendStyle() {
    // Create a style element within the shadow DOM
    const style = document.createElement("style");
    style.textContent = `
    @import url("https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600&display=swap");
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  -webkit-tap-highlight-color: transparent;
}

*, *:before, *:after {
  box-sizing: border-box;
}

:host, :root {
  --main-bg-color: #1d1d1d;
  --main-hovered-color: #2a2a2a;
  --text-dim-color:rgba(255, 255, 255, 0.81);
  --text-white:#ffffff;
}

.color-picker-hover * {
  font-family: "Inter", sans-serif;
}

.color-picker-hover {
  position: absolute;
  width: 190px;
  height: 260px;
  border-radius: 0.4375rem;
  background: #232322;
  -webkit-border-radius: 0.4375rem;
  -moz-border-radius: 0.4375rem;
  -ms-border-radius: 0.4375rem;
  -o-border-radius: 0.4375rem;
  z-index: 10000;
  padding-left: 6px;
  padding-right: 6px;
  padding-top: 6px;
}
.color-picker-hover .canvas-section {
  width: 178px;
  height: 166px;
  border-radius: 0.25rem;
  background: #d9d9d9;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: hidden;
}
.color-picker-hover .canvas-section .left-crosshair {
  width: 100%;
  height: 1.5px;
  background: #6927da;
  z-index: 100;
  position: absolute;
}
.color-picker-hover .canvas-section .right-crosshair {
  width: 100%;
  height: 1.5px;
  background: #6927da;
  z-index: 100;
  position: absolute;
  transform: rotate(90deg);
  -webkit-transform: rotate(90deg);
  -moz-transform: rotate(90deg);
  -ms-transform: rotate(90deg);
  -o-transform: rotate(90deg);
}
.color-picker-hover .canvas-section canvas {
  width: 100%;
  height: 100%;
}
.color-picker-hover .canvas-color-data {
  padding-left: 8px;
  padding-right: 8px;
  padding-top: 12px;
}
.color-picker-hover .canvas-color-data .rgb {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
.color-picker-hover .canvas-color-data .rgb .rgb-item {
  width: 50px;
  height: 28px;
  border-radius: 3px;
  background: #2d2d2d;
  -webkit-border-radius: 3px;
  -moz-border-radius: 3px;
  -ms-border-radius: 3px;
  -o-border-radius: 3px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 6px;
}
.color-picker-hover .canvas-color-data .rgb .rgb-item span {
  font-size: 12px;
  font-style: normal;
  font-weight: 500;
  line-height: 1.125rem;
}
.color-picker-hover .canvas-color-data .rgb .rgb-item span:nth-child(1) {
  color: #959595;
}
.color-picker-hover .canvas-color-data .rgb .rgb-item span:nth-child(2) {
  color: #e7e7e7;
}
.color-picker-hover .canvas-color-data .hex-data {
  margin-top: 6px;
  display: flex;
  flex-direction: row;
  gap: 6px;
  align-items: center;
}
.color-picker-hover .canvas-color-data .hex-data .color {
  width: 31px;
  height: 28px;
  background: #61deaa;
  border-radius: 3px;
  -webkit-border-radius: 3px;
  -moz-border-radius: 3px;
  -ms-border-radius: 3px;
  -o-border-radius: 3px;
}
.color-picker-hover .canvas-color-data .hex-data .hex {
  width: 125px;
  height: 31px;
  background: #2D2D2D;
  padding-left: 10px;
  padding-right: 6px;
  display: flex;
  flex-direction: row;
  align-items: center;
  border-radius: 3px;
  -webkit-border-radius: 3px;
  -moz-border-radius: 3px;
  -ms-border-radius: 3px;
  -o-border-radius: 3px;
  color: #E7E7E7;
  font-size: 12px;
  font-style: normal;
  font-weight: 500;
  line-height: 1.125rem;
}


`;

    // Append the style element to the shadow DOM
    this.colorDisplay.prepend(style);
  }
  rgbToHex(rgbString) {
    // Extract the numbers from the rgb string
    const matches = rgbString.match(/\d+/g);

    // Return null if the format doesn't match
    if (!matches || matches.length !== 3) {
      return null;
    }

    const [r, g, b] = matches.map(Number);

    // Convert each number to hex and pad with leading zeros if needed
    const hexR = r.toString(16).padStart(2, "0");
    const hexG = g.toString(16).padStart(2, "0");
    const hexB = b.toString(16).padStart(2, "0");

    return `#${hexR}${hexG}${hexB}`;
  }

  setupColorPicker(callback) {
    // Create the main container
    if (this.colorContainer) {
      // If a color container already exists, remove it.
      this.colorContainer.remove();
    }

    const colorContainer = document.createElement("div");
    colorContainer.className = "color-picker-container";
    document.body.appendChild(colorContainer);
    this.colorContainer = colorContainer;
    this.colorDisplay = colorContainer.attachShadow({ mode: "open" });

    this.colorDisplay.innerHTML = this.getColorHtmlTemplate();
    this.appendStyle();

    const mouseMoveElement = this.colorDisplay.querySelector(
      ".color-picker-hover"
    );

    const rgbDivBox = this.colorDisplay.querySelectorAll(".rgb-item");
    const hexDivBox = this.colorDisplay.querySelector(".hex");
    const colorBox = this.colorDisplay.querySelector(".color-box");
    const magnifyingCanvas = this.colorDisplay.querySelector("#magnify-canvas");
    // magnifyingCanvas.style.position = "fixed";
    magnifyingCanvas.style.pointerEvents = "none";
    const magnifyingCtx = magnifyingCanvas.getContext("2d", { willReadFrequently: true })

    // Define the magnification factor (2 means twice as zoomed-in)
    const magnificationFactor = 6;

    // Calculate the size of the region we'll capture from the main canvas
    const captureWidth = magnifyingCanvas.width / magnificationFactor;
    const captureHeight = magnifyingCanvas.height / magnificationFactor;

    this.canvas.addEventListener("mousemove", (e) => {
      const scaleX = this.canvas.width / this.canvas.clientWidth;
      const scaleY = this.canvas.height / this.canvas.clientHeight;

      const scaledX = e.clientX * scaleX;
      const scaledY = e.clientY * scaleY;

      // Fetch the pixel color directly from the main canvas
      const ctxMain = this.canvas.getContext("2d", { willReadFrequently: true });
      const mainPixel = ctxMain.getImageData(scaledX, scaledY, 1, 1).data;
      const mainRgb = `rgb(${mainPixel[0]},${mainPixel[1]},${mainPixel[2]})`;

      const hexFromRgb = this.rgbToHex(mainRgb);
      rgbDivBox[0].innerHTML = `<span>R</span><span>${mainPixel[0]}</span>`;
      rgbDivBox[1].innerHTML = `<span>G</span><span>${mainPixel[1]}</span>`;
      rgbDivBox[2].innerHTML = `<span>B</span><span>${mainPixel[2]}</span>`;

      hexDivBox.innerHTML = hexFromRgb;

      this.currentColorValues.rgb = {
        r: mainPixel[0],
        g: mainPixel[1],
        b: mainPixel[2],
      };
      this.currentColorValues.hex = hexFromRgb;

      // keeping the callback if you're using it elsewhere
      if (typeof callback === "function") {
        callback(this.currentColorValues);
      }

      // getting data and sending it while clicking on anything

      // Display this color in the color box to see if it's accurate
      colorBox.style.background = mainRgb;

      const scrollX = window.scrollX || window.pageXOffset;
      const scrollY = window.scrollY || window.pageYOffset;

      // Calculate the correct X and Y positions considering scroll
      const correctX = e.clientX + scrollX;
      const correctY = e.clientY + scrollY;

      // Adjust the magnifying canvas's position with the corrected positions
      magnifyingCanvas.style.left = `${
        correctX - magnifyingCanvas.width / 2
      }px`;
      magnifyingCanvas.style.top = `${
        correctY - magnifyingCanvas.height / 2
      }px`;

      // Capture a smaller area from the main canvas and stretch it onto the magnifying canvas
      magnifyingCtx.drawImage(
        this.canvas,
        scaledX - captureWidth / 2,
        scaledY - captureHeight / 2,
        captureWidth,
        captureHeight,
        0,
        0,
        magnifyingCanvas.width,
        magnifyingCanvas.height
      );

      mouseMoveElement.style.position = "absolute";
      mouseMoveElement.style.zIndex = "10000";
      mouseMoveElement.style.left = `${correctX + 30}px`;
      mouseMoveElement.style.top = `${correctY + 20}px`;
    });
  }

  listenForResize() {
    this.resizeHandler = () => {
      this.updateCanvasSize();
      this.updateScreenshot();
    };
    window.addEventListener("resize", this.resizeHandler);
  }
}

const picker = new ColorPicker();

class colorPickerClicked {
  constructor() {
    this.active = false; // Track if the feature is active
    this.overlays = []; // Store references to created div overlays for removal later
  }

  activate() {
    if (!this.active) {
      this.bindEvents();
      this.active = true;
    }
  }

  deactivate() {
    if (this.active) {
      this.unbindEvents();
      this.removeOverlays();
      if (this.colorPicker && this.colorPicker.colorContainer) {
        this.colorPicker.colorContainer.remove(); // Remove the color container
      }
      this.active = false;
    }
  }

  bindEvents() {
    this.mouseMoveListener = (e) => {
      // (optional) Your mouse move code here...
    };
    document.body.addEventListener("mousemove", this.mouseMoveListener);

    this.clickListener = (e) => {
      this.createOverlayWithShadowDOM(e.target, e.clientX, e.clientY);
    };
    document.body.addEventListener("click", this.clickListener);

    this.escKeyListener = (e) => {
      if (e.key === "Escape") {
        this.deactivate();
      }
    };
    document.addEventListener("keydown", this.escKeyListener);
  }

  unbindEvents() {
    document.body.removeEventListener("mousemove", this.mouseMoveListener);
    document.body.removeEventListener("click", this.clickListener);
    document.removeEventListener("keydown", this.escKeyListener);
  }

  removeOverlays() {
    this.overlays.forEach((overlay) => {
      document.body.removeChild(overlay);
    });
    this.overlays = [];
  }

  getTemplate() {
    return `
    <div class="color-picker-clicked">
    <header>
      <div class="color-bg"></div>
      <button class="close">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          fill="none"
          viewBox="0 0 18 18"
        >
          <path
            stroke="#DDD"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.714"
            d="m13.5 4.5-9 9m0-9 9 9"
          />
        </svg>
      </button>
    </header>

    <div class="rgb-section">
      <div class="rgb">
        <div class="r rgb-item"><span>R</span><span>65</span></div>
        <div class="g rgb-item"><span>R</span><span>65</span></div>
        <div class="b rgb-item"><span>R</span><span>65</span></div>
      </div>
      <button class="copy-color-btn">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="17"
          height="17"
          fill="none"
          viewBox="0 0 17 17"
        >
          <g clip-path="url(#a)">
            <path
              stroke="#DDD"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.714"
              d="M5.667 11.333v1.983c0 .794 0 1.19.154 1.494.136.266.353.483.62.619.302.154.699.154 1.492.154h5.384c.793 0 1.19 0 1.493-.154a1.42 1.42 0 0 0 .619-.62c.154-.302.154-.7.154-1.492V7.932c0-.793 0-1.19-.154-1.493a1.416 1.416 0 0 0-.62-.62c-.302-.154-.699-.154-1.492-.154h-1.984m-7.65 5.667h5.384c.793 0 1.19 0 1.493-.154a1.42 1.42 0 0 0 .619-.62c.154-.302.154-.7.154-1.492V3.682c0-.793 0-1.19-.154-1.493a1.416 1.416 0 0 0-.62-.62c-.302-.153-.699-.153-1.492-.153H3.683c-.793 0-1.19 0-1.493.154a1.417 1.417 0 0 0-.619.619c-.154.303-.154.7-.154 1.493v5.383c0 .794 0 1.19.154 1.494.136.266.353.483.62.619.302.154.699.154 1.492.154Z"
            />
          </g>
          <defs>
            <clipPath id="a">
              <path fill="#fff" d="M0 0h17v17H0z" />
            </clipPath>
          </defs>
        </svg>

        <span>Copy RGB</span>
      </button>
    </div>
    <div class="divider" style="margin-top: 18px; margin-bottom: 19px;"></div>
    <div class="hex-data">
      <div class="hex">#ffffff</div>
      <button class="copy-color-btn">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="17"
          height="17"
          fill="none"
          viewBox="0 0 17 17"
        >
          <g clip-path="url(#a)">
            <path
              stroke="#DDD"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.714"
              d="M5.667 11.333v1.983c0 .794 0 1.19.154 1.494.136.266.353.483.62.619.302.154.699.154 1.492.154h5.384c.793 0 1.19 0 1.493-.154a1.42 1.42 0 0 0 .619-.62c.154-.302.154-.7.154-1.492V7.932c0-.793 0-1.19-.154-1.493a1.416 1.416 0 0 0-.62-.62c-.302-.154-.699-.154-1.492-.154h-1.984m-7.65 5.667h5.384c.793 0 1.19 0 1.493-.154a1.42 1.42 0 0 0 .619-.62c.154-.302.154-.7.154-1.492V3.682c0-.793 0-1.19-.154-1.493a1.416 1.416 0 0 0-.62-.62c-.302-.153-.699-.153-1.492-.153H3.683c-.793 0-1.19 0-1.493.154a1.417 1.417 0 0 0-.619.619c-.154.303-.154.7-.154 1.493v5.383c0 .794 0 1.19.154 1.494.136.266.353.483.62.619.302.154.699.154 1.492.154Z"
            />
          </g>
          <defs>
            <clipPath id="a">
              <path fill="#fff" d="M0 0h17v17H0z" />
            </clipPath>
          </defs>
        </svg>

        <span>Copy HEX</span>
      </button>
    </div>
  </div>
    `;
  }

  appendStyles() {
    const style = document.createElement("style");
    style.textContent = `
    @import url("https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600&display=swap");
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  -webkit-tap-highlight-color: transparent;
}

*, *:before, *:after {
  box-sizing: border-box;
}

:host, :root {
  --main-bg-color: #1d1d1d;
  --main-hovered-color: #2a2a2a;
  --text-dim-color:rgba(255, 255, 255, 0.81);
  --text-white:#ffffff;
}



.color-picker-clicked * {
  font-family: "Inter", sans-serif;
}

.color-picker-clicked {
  position: absolute;
  width: 190px;
  height: 260px;
  border-radius: 0.4375rem;
  background: #232322;
  -webkit-border-radius: 0.4375rem;
  -moz-border-radius: 0.4375rem;
  -ms-border-radius: 0.4375rem;
  -o-border-radius: 0.4375rem;
  z-index: 10000;
  padding-left: 14px;
  padding-right: 15px;
  padding-top: 6px;
}
.color-picker-clicked header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-top: 12px;
}
.color-picker-clicked header .color-bg {
  width: 28px;
  height: 28px;
  border-radius: 0.1875rem;
  background: #61deaa;
  -webkit-border-radius: 0.1875rem;
  -moz-border-radius: 0.1875rem;
  -ms-border-radius: 0.1875rem;
  -o-border-radius: 0.1875rem;
}
.color-picker-clicked header button {
  border: none;
  background-color: transparent;
  cursor:pointer;
}
.color-picker-clicked .rgb-section {
  margin-top: 18px;
  display: flex;
  flex-direction: column;
  align-items: end;
  gap: 12px;
}
.color-picker-clicked .rgb-section .rgb {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
.color-picker-clicked .rgb-section .rgb .rgb-item {
  width: 50px;
  height: 28px;
  border-radius: 3px;
  background: #2d2d2d;
  -webkit-border-radius: 3px;
  -moz-border-radius: 3px;
  -ms-border-radius: 3px;
  -o-border-radius: 3px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 6px;
}
.color-picker-clicked .rgb-section .rgb .rgb-item span {
  font-size: 12px;
  font-style: normal;
  font-weight: 500;
  line-height: 1.125rem;
}
.color-picker-clicked .rgb-section .rgb .rgb-item span:nth-child(1) {
  color: #959595;
}
.color-picker-clicked .rgb-section .rgb .rgb-item span:nth-child(2) {
  color: #e7e7e7;
}
.color-picker-clicked .rgb-section button, .color-picker-clicked .hex-data button {
  cursor: pointer;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 103px;
  height: 28px;
  border-radius: 0.1875rem;
  background: rgba(105, 39, 218, 0.34);
  -webkit-border-radius: 0.1875rem;
  -moz-border-radius: 0.1875rem;
  -ms-border-radius: 0.1875rem;
  -o-border-radius: 0.1875rem;
  border: none;
  gap: 6px;
  transition: background, 0.3s ease-in-out;
  -webkit-transition: background, 0.3s ease-in-out;
  -moz-transition: background, 0.3s ease-in-out;
  -ms-transition: background, 0.3s ease-in-out;
  -o-transition: background, 0.3s ease-in-out;
}
.color-picker-clicked .rgb-section button span, .color-picker-clicked .hex-data button span {
  color: #e7e7e7;
  font-size: 12px;
  font-style: normal;
  font-weight: 500;
  line-height: 1.125rem;
}
.color-picker-clicked .rgb-section button svg path, .color-picker-clicked .hex-data button svg path {
  transition: stroke, 0.3s ease-in-out;
  -webkit-transition: stroke, 0.3s ease-in-out;
  -moz-transition: stroke, 0.3s ease-in-out;
  -ms-transition: stroke, 0.3s ease-in-out;
  -o-transition: stroke, 0.3s ease-in-out;
}
.color-picker-clicked .rgb-section button:hover, .color-picker-clicked .hex-data button:hover {
  background: rgba(105, 39, 218, 0.71);
}
.color-picker-clicked .hex-data {
  display: flex;
  flex-direction: column;
  align-items: end;
  gap: 12px;
}
.color-picker-clicked .hex-data .hex {
  width: 100%;
  height: 31px;
  background: #2d2d2d;
  padding-left: 10px;
  padding-right: 6px;
  display: flex;
  flex-direction: row;
  align-items: center;
  border-radius: 3px;
  -webkit-border-radius: 3px;
  -moz-border-radius: 3px;
  -ms-border-radius: 3px;
  -o-border-radius: 3px;
  color: #e7e7e7;
  font-size: 12px;
  font-style: normal;
  font-weight: 500;
  line-height: 1.125rem;
}

.divider {
  background: #484848;
  width: 100%;
  height: 0.0625rem;
}/*# sourceMappingURL=colorPicker.css.map */
    `;

    this.shadowRoot.prepend(style);
  }

  copyBtn(data) {
    const btn = this.shadowRoot.querySelectorAll(".copy-color-btn");

    btn.forEach((element, index) => {
      element.addEventListener("click", () => {
        let textToCopy;
        let notificationMessage;

        switch (index) {
          case 0:
            textToCopy = `rgb(${data.r}, ${data.g}, ${data.b})`; // RGB value
            notificationMessage = "RGB Copied";
            break;
          case 1:
            textToCopy = data.hex; // HEX value
            notificationMessage = "HEX Copied";
            break;
          default:
            console.error("No data found for index:", index);
            return; // Exit early if index doesn't match
        }

        // Copying to clipboard
        navigator.clipboard
          .writeText(textToCopy)
          .then(() => {
            console.log("Data copied to clipboard:", textToCopy);
            const notif = mdtoast(notificationMessage, {
              duration: 4000,
              init: false,
            });
            notif.show();
          })
          .catch((err) => {
            console.error("Failed to copy text:", err);
          });
      });
    });
  }

  createOverlayWithShadowDOM(targetElement, x, y) {
    const div = document.createElement("div");
    div.className = "clicked-div-color-data";
    div.style.position = "absolute";
    div.style.top = y + window.scrollY + "px";
    div.style.left = x + window.scrollX + "px";
    div.style.zIndex = "100000000000";

    div.addEventListener("click", (event) => {
      event.stopPropagation();
    });

    document.body.appendChild(div);
    this.overlays.push(div);

    this.shadowRoot = div.attachShadow({ mode: "open" });

    const contentDiv = document.createElement("div");

    contentDiv.style.border = "1px solid black";
    contentDiv.style.padding = "10px";
    contentDiv.style.background = "white";

    picker.setupColorPicker();
    contentDiv.textContent = picker.currentColorValues.rgb;

    this.shadowRoot.innerHTML = this.getTemplate();
    this.appendStyles();
    const closeButton = this.shadowRoot.querySelector(".close");
    const hexDiv = this.shadowRoot.querySelector(".hex");
    const colorBg = this.shadowRoot.querySelector(".color-bg");
    const rgbItem = this.shadowRoot.querySelectorAll(".rgb-item");
    const { r, g, b } = picker.currentColorValues.rgb;
    colorBg.style.background = picker.currentColorValues.hex;

    rgbItem[0].innerHTML = `<span>R</span><span>${r}</span>`;
    rgbItem[1].innerHTML = `<span>R</span><span>${g}</span>`;
    rgbItem[2].innerHTML = `<span>R</span><span>${b}</span>`;
    hexDiv.innerText = picker.currentColorValues.hex;
    closeButton.onclick = () => {
      document.body.removeChild(div);

      const index = this.overlays.indexOf(div);
      if (index > -1) {
        this.overlays.splice(index, 1);
      }
    };

    this.copyBtn({
      r,
      g,
      b,
      hex: picker.currentColorValues.hex,
    });
    // contentDiv.appendChild(closeButton);
  }
}

const point = new colorPickerClicked();

// Listen for messages from the popup
function messageHandler(message, sender, sendResponse) {
  if (message.action === "toggleColorPicker") {
    console.log("toggle color picker");
    toggleColorPicker();
    return true;
  }
}




function toggleColorPicker() {
  if (!picker.isActive) {
    console.log('Activating color picker');
    point.activate();
    picker.activate();
    const notif = mdtoast("Color Picker Activated", {
      duration: 4000,
      init: false,
    });
    notif.show();
  } else {
    console.log('Deactivating color picker');
    point.deactivate();
    picker.deactivate();
    const notif = mdtoast("Color Picker Deactivated", {
      duration: 4000,
      init: false,
    });
    notif.show();
  }
}





// function setupKeyboardListener() {
//   document.addEventListener('keydown', function(event) {

   
//     // Check if Ctrl, Alt, and C keys are pressed simultaneously
//     if (event.ctrlKey && event.altKey && event.key === 'c') {
//       event.preventDefault(); // Prevent default browser behavior
      
//       if (!picker.isActive) {
//         console.log('Activating color picker');
//         point.activate();
//         picker.activate();
//         const notif = mdtoast("Color Picker Activated", {
//           duration: 4000,
//           init: false,
//         });
//         notif.show();
//       } else {
//         console.log('Deactivating color picker');
//         point.deactivate();
//         picker.deactivate();

//         const notif = mdtoast("Color Picker Deactivated", {
//           duration: 4000,
//           init: false,
//         });
//         notif.show();
//       }
//     }
//   });
// }


// // Set up the keyboard listener
// setupKeyboardListener();

// Ensure the message listener is only added once
if (!chrome.runtime.onMessage.hasListener(messageHandler)) {
  chrome.runtime.onMessage.addListener(messageHandler);
}
