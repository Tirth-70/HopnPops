const KERNEL_NARROW_SIZE_PX = 42;
const KERNEL_WIDE_SIZE_PX = 56;
const WINDOW_BREAKPOINT_WIDTH_PX = 860;

const GRAVITATIONAL_ACCELERATION = 1;
const KERNEL_TERMINAL_VELOCITY = 40;
const KERNEL_STEP_ANIMATION_INTERVAL = 16;

const DESKTOP_NAVIGATION_BAR_HEIGHT_PX = 135;
const MOBILE_NAVIGATION_BAR_HEIGHT_PX = 98;
const WINDOW_NARROW_WIDTH_PX = 375;
const FOOTER_TOP_MARGIN_PX = 56;

const ColonelHead = "images/fly-corn.svg";

const pageHeight = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight)

let MAX_KERNELS_PER_CLICK = 5;
let MIN_KERNELS_PER_CLICK = 1;

function increaseKernelCount() {
  MAX_KERNELS_PER_CLICK++;
  MIN_KERNELS_PER_CLICK++;
}

let clickPopIndex = 0;

function getRandomBoolean() {
  return Math.random() < 0.5;
}

function getRandomInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function step(element, intervalId) {
  if (!element) {
    return;
  }

  const xVelocity = parseInt(element.getAttribute("data-x-velocity"));
  const yVelocity = parseInt(element.getAttribute("data-y-velocity"));

  const velocityMultiplier = element.offsetHeight / DEFAULT_KERNEL_HEIGHT;
  const left = parseInt(element.style.left) + xVelocity * velocityMultiplier;
  const top = parseInt(element.style.top) + yVelocity * velocityMultiplier;
  element.style.left = `${left}px`;
  element.style.top = `${top}px`;

  if (yVelocity < KERNEL_TERMINAL_VELOCITY) {
    element.setAttribute(
      "data-y-velocity",
      `${yVelocity + GRAVITATIONAL_ACCELERATION}`
    );
  }

  if (
    // top > Math.max(document.documentElement.clientHeight, document.body.clientHeight)
    top > pageHeight
  ) {
    clearInterval(intervalId);
    if (!element || !element.parentNode) {
      return;
    }
    element.parentNode.removeChild(element);
  }
}

function animateKernel(id) {
  const element = document.querySelector(`#${id}`);
  if (!element) {
    return;
  }

  element.style.top = `${parseInt(element.style.top)}px`;
  element.style.left = `${parseInt(element.style.left)}px`;

  element.style.display = "block";

  const intervalId = setInterval(() => {
    step(element, intervalId);
  }, KERNEL_STEP_ANIMATION_INTERVAL);
}

const DEFAULT_KERNEL_HEIGHT = 36;

function initializeClickPop(documentElement) {
  documentElement.addEventListener("click", function (event) {
    const pageX = event.pageX;
    const pageY = event.pageY;
    const windowInnerWidth = window.innerWidth || 0;
    const isWideScreen = windowInnerWidth > WINDOW_BREAKPOINT_WIDTH_PX;
    
    // Calculate the left position based on the document's width
    const documentWidth = document.documentElement.clientWidth;
    // const kernelWidth = isWideScreen ? KERNEL_WIDE_SIZE_PX : KERNEL_NARROW_SIZE_PX;
    const kernelWidth = 30;
    const xPosition = (pageX - kernelWidth / 2) - (documentWidth - windowInnerWidth) / 2;
    
    const yPosition = pageY - kernelWidth / 2;
    const numKernels = getRandomInteger(MIN_KERNELS_PER_CLICK, MAX_KERNELS_PER_CLICK);
    for (let i = 0; i < numKernels; ++i) {
      popNewKernel(documentElement, xPosition, yPosition);
    }
  });
}




function getRandomInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getKernelElement(
  documentElement,
  { id, left, top, isRotatingClockwise }
) {
  const kernelElement = documentElement.createElement("img");

  kernelElement.alt = "Popcorn kernel";
  kernelElement.className = isRotatingClockwise
    ? "popcorn-kernel"
    : "popcorn-kernel popcorn-kernel--reverse";
  kernelElement.id = id;
  kernelElement.src = ColonelHead;
  kernelElement.setAttribute(
    "style",
    `display: none; position: absolute; left: ${left}px; top: ${top}px;;`
  );
  kernelElement.setAttribute("aria-hidden", "true");
  kernelElement.setAttribute("data-x-velocity", `${getRandomInteger(-7, 7)}`);
  kernelElement.setAttribute(
    "data-y-velocity",
    `${getRandomInteger(-25, -10)}`
  );
  kernelElement.setAttribute('width', '32');
  kernelElement.setAttribute('height', '32');

  return kernelElement;
}

function popNewKernel(documentElement, xPosition, yPosition) {
  const id = `click-pop-${clickPopIndex++}`;
  const kernelElement = getKernelElement(documentElement, {
    id,
    isRotatingClockwise: getRandomBoolean(),
    left: xPosition,
    top: yPosition,
  });

  documentElement.body.appendChild(kernelElement);

  setTimeout(() => animateKernel(id), 0);
}

initializeClickPop(document);