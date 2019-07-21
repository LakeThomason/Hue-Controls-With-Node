import dotenv from "dotenv";
dotenv.config();
import ILightResponse from "./interfaces/ILightResponse";
import ILightState from "./interfaces/ILightState";
import Lights from "./Lights";

const lights = new Lights();
lights
  .setup()
  .then(() => {
    return Promise.all(parseCommand());
  })
  .then((res) => {
    res.forEach((op) => {
      console.log(op);
    });
  });

function parseCommand(): Array<Promise<ILightResponse>> {
  // Single command usage
  switch (process.argv[2]) {
    case "lightsOff":
      return lights.off();
    case "lightsOn":
      return lights.on();
    case "increaseSaturation":
      return lights.incrementLightSaturation();
    case "decreaseSaturation":
      return lights.decrementLightSaturation();
    case "increaseBrightness":
      return lights.incrementLightBrightness();
    case "decreaseBrightness":
      return lights.decrementLightBrightness();
    case "randomizeColors":
      return lights.setRandomColors();
    case "nightLight":
      return lights.setLightHue(scenes.nightLight as ILightState[]);
    case "energize":
      return lights.setLightHue(scenes.energize as ILightState[]);
    case "springBlossom":
      return lights.setLightHue(scenes.springBlossom as ILightState[]);
    case "arcticAurora":
      return lights.setLightHue(scenes.arcticAurora as ILightState[]);
    case "casual":
      return lights.setLightHue(scenes.casual as ILightState[]);
    case "flux":
      return lights.setLightHue(scenes.flux as ILightState[]);
    case "fireAndIce":
      return lights.setLightHue(scenes.fireAndIce as ILightState[]);
    case "boink":
      return lights.setLightHue(scenes.boink as ILightState[]);
    default:
      console.log(lights.lights);
  }
}

const scenes = {
  nightLight: [
    {
      bri: 1,
      hue: 6291,
      sat: 251
    },
    {
      bri: 1,
      hue: 6291,
      sat: 251
    },
    {
      bri: 1,
      hue: 6291,
      sat: 251
    },
    {
      bri: 1,
      hue: 6291,
      sat: 251
    }
  ],
  energize: [
    {
      bri: 254,
      hue: 41442,
      sat: 75
    },
    {
      bri: 254,
      hue: 41442,
      sat: 75
    },
    {
      bri: 254,
      hue: 41442,
      sat: 75
    },
    {
      bri: 254,
      hue: 41442,
      sat: 75
    }
  ],
  springBlossom: [
    {
      bri: 214,
      hue: 56063,
      sat: 100
    },
    {
      bri: 214,
      hue: 56063,
      sat: 100
    },
    {
      bri: 214,
      hue: 45773,
      sat: 52
    },
    {
      bri: 214,
      hue: 56063,
      sat: 100
    }
  ],
  arcticAurora: [
    {
      bri: 137,
      hue: 36334,
      sat: 203
    },
    {
      bri: 137,
      hue: 41502,
      sat: 254
    },
    {
      bri: 137,
      hue: 37083,
      sat: 242
    },
    {
      bri: 137,
      hue: 46014,
      sat: 254
    }
  ],
  casual: [
    {
      bri: 156,
      hue: 46826,
      sat: 221
    },
    {
      bri: 156,
      hue: 39832,
      sat: 217
    },
    {
      bri: 156,
      hue: 49890,
      sat: 194
    },
    {
      bri: 156,
      hue: 54159,
      sat: 157
    }
  ],
  flux: [
    {
      bri: 147,
      hue: 45816,
      sat: 254
    },
    {
      bri: 147,
      hue: 5759,
      sat: 254
    },
    {
      bri: 147,
      hue: 3345,
      sat: 254
    },
    {
      bri: 147,
      hue: 9781,
      sat: 254
    }
  ],
  fireAndIce: [
    {
      bri: 147,
      hue: 64924,
      sat: 254
    },
    {
      bri: 147,
      hue: 39033,
      sat: 248
    },
    {
      bri: 147,
      hue: 46014,
      sat: 254
    },
    {
      bri: 147,
      hue: 1368,
      sat: 254
    }
  ],
  boink: [
    {
      bri: 126,
      hue: 46014,
      sat: 254
    },
    {
      bri: 126,
      hue: 58818,
      sat: 250
    },
    {
      bri: 126,
      hue: 61707,
      sat: 248
    },
    {
      bri: 126,
      hue: 57211,
      sat: 200
    }
  ]
};
