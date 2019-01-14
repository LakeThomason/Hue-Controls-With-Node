require("dotenv").config();
const axios = require("axios");
/*****************************************************************************/
// Change these values
/*****************************************************************************/
const ip = process.env.BRIDGE_IP;
const username = process.env.BRIDGE_USERNAME;
const lightsObj = {
  closetLight: "1",
  deskLight: "2",
  windowLight: "3",
  bedLight: "4"
};
/*****************************************************************************/

/*****************************************************************************/
const endPoint = "lights";
const maxBrightness = 254;
const minBrightness = 1;
const brightnessIncrement = 40;
const maxHue = 65535;

this.lightState = {};

// Get light state, then run the command
function main() {
  parseLightState(function(state) {
    this.lightState = state;
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
      case "lightsOff":
        lightsOn(false);
        break;
      case "lightsOn":
        lightsOn(true);
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
    axios
      .put(`http://${ip}/api/${username}/${endPoint}/${lightsObj[key]}/state`, {
        on: bool
      })
      .then(function(response) {
        console.log(response.data);
      })
      .catch(function(error) {
        console.log(error);
      });
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
