// imports
require("dotenv").config();
const axios = require("axios");

// dotenv data
const ip = process.env.BRIDGE_IP;
const username = process.env.BRIDGE_USERNAME;

// Phillips hue request properties
const endPoint = "lights";
const maxBrightness = 254;
const maxSaturation = 254;
const minBrightness = 1;
const minSaturation = 1;
const brightnessIncrement = 40;
const saturationIncrement = 40;
const maxHue = 65535;

// Full light state
this.lightState;
// Simple lights object with light IDs
this.lightsObj;

// Get light state, then run the command
function main() {
  parseLightState(function(state) {
    this.lightState = state;
    this.lightsObj = {};
    // Make this.lightsObj
    for (let key in this.lightState) {
      let light = {};
      light[this.lightState[key].name] = key;
      Object.assign(this.lightsObj, light);
    }
    parseCommand();
  });
}

function parseLightState(onComplete) {
  axios
    .get(`http://${ip}/api/${username}/${endPoint} `)
    .then(function(response) {
      onComplete(response.data);
    })
    .catch(function(error) {
      console.log(error);
    });
}

function parseCommand() {
  // Single command usage
  if (process.argv.length === 3) {
    switch (process.argv[2]) {
      case "debug":
        console.log(this.lightState);
        break;
      case "lightsOff":
        lightsOn(false);
        break;
      case "lightsOn":
        lightsOn(true);
        break;
      case "increaseSaturation":
        changeLightSaturation(lightsObj, saturationIncrement);
        break;
      case "decreaseSaturation":
        changeLightSaturation(lightsObj, saturationIncrement * -1);
        break;
      case "increaseBrightness":
        changeLightBrightness(lightsObj, brightnessIncrement);
        break;
      case "decreaseBrightness":
        changeLightBrightness(lightsObj, brightnessIncrement * -1);
        break;
      case "randomizeColors":
        randomizeLightColor(lightsObj);
        break;
    }
  }
}

function lightsOn(bool) {
  for (let key in lightsObj) {
    setLightState(lightsObj[key], { on: bool });
  }
}

function changeLightColor(lights, colors, transition = 0) {
  for (let key in lights) {
    setLightState(lights[key], { hue: colors[key] });
  }
}

function changeLightBrightness(lights, increment, transition = 0) {
  for (let key in lights) {
    let newBrightness,
      currentBrightness = parseInt(this.lightState[lights[key]].state.bri);
    // Check if increment is too close to bri minimum
    if (increment < 0 && currentBrightness <= minBrightness - increment) {
      newBrightness = minBrightness;
    }
    // Check if increment is too close to bri maximum
    else if (increment > 0 && currentBrightness >= maxBrightness - increment) {
      newBrightness = maxBrightness;
    } else {
      newBrightness = currentBrightness + increment;
    }
    setLightState(lights[key], { bri: newBrightness });
  }
}

function changeLightSaturation(lights, increment, transition = 0) {
  for (key in lights) {
    let newSaturation,
      currentSaturation = parseInt(this.lightState[lights[key]].state.sat);
    // Check if increment is too close to sat minimum
    if (increment < 0 && currentSaturation <= minSaturation - increment) {
      newSaturation = minSaturation;
    }
    // Check if increment is too close to sat maximum
    else if (increment > 0 && currentSaturation >= maxSaturation - increment) {
      newSaturation = maxSaturation;
    } else {
      newSaturation = currentSaturation + increment;
    }
    setLightState(lights[key], { sat: newSaturation });
  }
}

function setLightState(light, obj) {
  axios
    .put(`http://${ip}/api/${username}/${endPoint}/${light}/state`, obj)
    .then(function(response) {
      console.log(response.data);
    })
    .catch(function(error) {
      console.log(error);
    });
}

function randomizeLightColor(lights) {
  let colors = {};
  Object.keys(lights).forEach(function(id) {
    let randomColor = Math.floor(Math.random() * Math.floor(maxHue + 1));
    let colorObj = [];
    colorObj[id] = randomColor;
    Object.assign(colors, colorObj);
  });
  changeLightColor(lights, colors);
}

main();
