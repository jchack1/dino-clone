import {
  getCustomProperty,
  incrementCustomProperty,
  setCustomProperty,
} from "./updateCustomProperty.js";

const dinoElem = document.querySelector("[data-dino]");

const JUMP_SPEED = 0.45;
const GRAVITY = 0.0015;
const DINO_FRAME_COUNT = 2; //because we change between two different dino images
const FRAME_TIME = 100; //each frame lasts 100ms

let isJumping;
let currentFrameTime;
let dinoFrame;
let yVelocity;

export const setupDino = () => {
  isJumping = false;
  dinoFrame = 0;
  currentFrameTime = 0;
  yVelocity = 0;
  setCustomProperty(dinoElem, "--bottom", 0);
  //remove event listen in case we already have one from previous game, then add it back
  document.removeEventListener("keydown", onJump);
  document.addEventListener("keydown", onJump);
};

export const updateDino = (delta, speedScale) => {
  handleRun(delta, speedScale);
  handleJump(delta);
};

export const handleRun = (delta, speedScale) => {
  //move through dino animations

  if (isJumping) {
    dinoElem.src = `imgs/dino-stationary.png`;
    return;
  }
  if (currentFrameTime >= FRAME_TIME) {
    //makes sure we loop back to the correct dino animation
    //updates our dino frame to the next frame
    dinoFrame = (dinoFrame + 1) % DINO_FRAME_COUNT;
    dinoElem.src = `imgs/dino-run-${dinoFrame}.png`;
    currentFrameTime -= FRAME_TIME;
  }

  //gets faster as the game progresses/gets faster
  currentFrameTime += delta * speedScale;
};

export const handleJump = (delta) => {
  if (!isJumping) return;

  //start jump, set velocity to upward value
  //as dino goes higher, gravity is subtracted from velocity, goes slower
  //velocity hits zero, then goes negative, "gravity" pulls dino downwards
  incrementCustomProperty(dinoElem, "--bottom", yVelocity * delta);

  if (getCustomProperty(dinoElem, "--bottom") <= 0) {
    //dont want to move down anymore if 0
    //can't go below the ground
    setCustomProperty(dinoElem, "--bottom", 0);
    isJumping = false; // no longer jumping when hit the ground
  }
  yVelocity -= GRAVITY * delta;
};

const onJump = (e) => {
  if (e.code !== "Space" || isJumping) return;

  yVelocity = JUMP_SPEED;
  isJumping = true;
};

//get rectangle for dino so it can interact with cacti
export const getDinoRect = () => {
  return dinoElem.getBoundingClientRect();
};

export const setDinoLose = () => {
  dinoElem.src = "imgs/dino-lose.png";
};
