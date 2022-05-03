import {
  setCustomProperty,
  incrementCustomProperty,
  getCustomProperty,
} from "./updateCustomProperty.js";

const SPEED = 0.05;

//spawn cacti randomly between these two values
const CACTUS_INTERVAL_MIN = 500;
const CACTUS_INTERVAL_MAX = 2000;

let nextCactusTime;

export const setupCactus = () => {
  nextCactusTime = CACTUS_INTERVAL_MIN;

  document.querySelectorAll("[data-cactus]").forEach((cactus) => {
    cactus.remove();
  });
};

export const updateCactus = (delta, speedScale) => {
  //get all cacti and update each one so it moves
  document.querySelectorAll("[data-cactus]").forEach((cactus) => {
    incrementCustomProperty(cactus, "--left", delta * speedScale * SPEED * -1);

    //if off the screen, remove
    if (getCustomProperty(cactus, "--left") <= -100) {
      cactus.remove();
    }
  });

  //get new cactus
  if (nextCactusTime <= 0) {
    createCactus();
    nextCactusTime =
      randomNumberBetween(CACTUS_INTERVAL_MIN, CACTUS_INTERVAL_MAX) /
      speedScale;
  }
  //gets smaller and smaller, once at zero, make new cactus
  nextCactusTime -= delta;
  //   console.log("cactus nextCactusTime: " + JSON.stringify(nextCactusTime));
};

export const createCactus = () => {
  console.log("create cactus fxn");
  //need world element so we can add cacti to screen
  const worldElem = document.querySelector("[data-world]");

  const cactus = document.createElement("img");
  cactus.dataset.cactus = true;
  cactus.src = "imgs/cactus.png";
  cactus.classList.add("cactus");
  setCustomProperty(cactus, "--left", 100);
  worldElem.append(cactus);
};

export const randomNumberBetween = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

//get all rectangles for cacti on screen so dino can interact with cacti
export const getCactusRects = () => {
  return [...document.querySelectorAll("[data-cactus]")].map((cactus) => {
    return cactus.getBoundingClientRect();
  });
};
