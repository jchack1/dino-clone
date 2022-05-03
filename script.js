import {updateGround, setupGround} from "./ground.js";
import {updateDino, setupDino, getDinoRect, setDinoLose} from "./dino.js";
import {updateCactus, setupCactus, getCactusRects} from "./cactus.js";

/**
 * dealing with scaling
 *
 * speedScale  - as the game goes on, want the ground to move increasingly fast, making the game more difficult
 */

const WORLD_WIDTH = 100;
const WORLD_HEIGHT = 30;
const SPEED_SCALE_INCREASE = 0.00001;

const worldElem = document.querySelector("[data-world]");
const scoreElem = document.querySelector("[data-score]");
const startScreenElem = document.querySelector("[data-start-screen]");

let lastTime;
let speedScale;
let score;

const setPixelToWorldScale = () => {
  let worldToPixelScale;

  if (window.innerWidth / window.innerHeight < WORLD_WIDTH / WORLD_HEIGHT) {
    //limiting factor in this case is width
    worldToPixelScale = window.innerWidth / WORLD_WIDTH;
  } else {
    //limiting factor here is height
    worldToPixelScale = window.innerHeight / WORLD_HEIGHT;
  }

  worldElem.style.width = `${WORLD_WIDTH * worldToPixelScale}px`;
  worldElem.style.height = `${WORLD_HEIGHT * worldToPixelScale}px`;
};

const handleStart = () => {
  lastTime = null;
  speedScale = 1;
  setupGround();
  setupDino();
  setupCactus();
  startScreenElem.classList.add("hide");
  score = 0;
  window.requestAnimationFrame(update);
};

const handleLose = () => {
  setDinoLose();

  //need timeout so if you're still clicking to jump when you lose, don't restart the game right away
  setTimeout(() => {
    document.addEventListener("keydown", handleStart, {once: true});
    startScreenElem.classList.remove("hide");
  }, 500);
};

const updateSpeedScale = (delta) => {
  speedScale += delta * SPEED_SCALE_INCREASE;
};

const updateScore = (delta) => {
  score += delta * 0.01;
  scoreElem.textContent = Math.floor(score);
};

const checkLose = () => {
  const dinoRect = getDinoRect();
  return getCactusRects().some((rect) => isCollision(rect, dinoRect));
};

const isCollision = (rect1, rect2) => {
  return (
    rect1.left < rect2.right &&
    rect1.top < rect2.bottom &&
    rect1.right > rect2.left &&
    rect1.bottom > rect2.top
  );
};

//every time screen size (in pixels) changes, update "world" size
setPixelToWorldScale();
window.addEventListener("resize", setPixelToWorldScale);
document.addEventListener("keydown", handleStart, {once: true});
/**
 *
 * dealing with updating the position of items on screen
 */

setupGround();

const update = (time) => {
  //constantly calling update over and over

  //when we first start the game, last time will be null
  if (lastTime == null) {
    lastTime = time;
    window.requestAnimationFrame(update);
    return;
  }
  const delta = time - lastTime;

  //pass in delta and speedScale
  updateGround(delta, speedScale);
  updateDino(delta, speedScale);
  updateCactus(delta, speedScale);
  updateSpeedScale(delta);
  updateScore(delta);

  if (checkLose()) return handleLose();

  lastTime = time;
  window.requestAnimationFrame(update);
};

//will only call update function when something changes on the screen
//requestAnimationFrame tells the browser you'd like to perform an animation - browser performs a function before it repaints
//passes a timestamp into your callback function
// https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame
