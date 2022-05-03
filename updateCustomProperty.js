/**
 *
 * some helper functions for getting and setting css properties for elements
 */

export const getCustomProperty = (elem, prop) => {
  //need element we get it from , and the property itself

  //this below allows us to get css variables, value returned as a string
  //window.getComputedStyle gets us the css properties for an element, normally returned as an object \
  // https://developer.mozilla.org/en-US/docs/Web/API/Window/getComputedStyle
  //we convert to number so we can work with it

  return parseFloat(getComputedStyle(elem).getPropertyValue(prop)) || 0;
};

export const setCustomProperty = (elem, prop, value) => {
  //pass in the element, property, and its value
  // CSSStyleDeclaration.setProperty() sets a new value for a css property
  // https://developer.mozilla.org/en-US/docs/Web/API/CSSStyleDeclaration/setProperty

  elem.style.setProperty(prop, value);
};

export const incrementCustomProperty = (elem, prop, inc) => {
  //combines first two functions in this file
  setCustomProperty(elem, prop, getCustomProperty(elem, prop) + inc);
};
