import {
  getCustomProperty,
  incrementCustomProperty,
  setCustomProperty,
} from "./updateCustomProperty.js";

const SPEED = 0.05;
const groundElems = document.querySelectorAll("[data-ground]");

//make the ground move left
export const updateGround = (delta, speedScale) => {
  groundElems.forEach((ground) => {
    //take position and update
    //this will incremement the "--left" css property on the ground element, by an amount
    //depends on our value for delta, speed, and since it goes backwards multiply by -1
    incrementCustomProperty(ground, "--left", delta * speedScale * SPEED * -1);

    if (getCustomProperty(ground, "--left") <= -300) {
      incrementCustomProperty(ground, "--left", 600);
    }
  });
};

export const setupGround = () => {
  setCustomProperty(groundElems[0], "--left", 0);
  setCustomProperty(groundElems[1], "--left", 300);
};
