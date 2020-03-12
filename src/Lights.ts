import axios from "axios";
import ILightResponse from "./interfaces/ILightResponse";
import ILightState from "./interfaces/ILightState";

// Phillips hue request properties
const BRIDGE_ADDRESS_FINDER_ADDRESS = "https://discovery.meethue.com/";
const MAX_UINT8 = 254;
const MIN_UINT8 = 0;
const MAX_HUE = 65535;
const MIN_HUE = 0;
const BRIGHNESS_INCREMENT = 40;
const SATURATION_INCREMENT = 40;
let LIGHTS_ENDPOINT = "";

// Class that controls a group of lights
export default class Lights {
  public lights: ILightState[] = [];

  /**
   *  Reaches out to all the lights connected to the bridge and parses their state
   */
  public setup(): Promise<boolean> {
    // Get bridge IP because you didn't give your bridge a static IP or something
    return axios.get(BRIDGE_ADDRESS_FINDER_ADDRESS).then((response) => {
      LIGHTS_ENDPOINT = `http://${response.data[0].internalipaddress}/api/${process.env.BRIDGE_USERNAME}/lights`;
      return axios
        .get(LIGHTS_ENDPOINT)
        .then((response) => {
          // Add all lights to the array
          for (const lightID in response.data) {
            if (response.data[lightID].hasOwnProperty("name", "state")) {
              this.lights.push(
                Object.assign({ name: response.data[lightID].name }, response.data[lightID].state) as ILightState
              );
            }
          }
          return true;
        })
        .catch((error) => {
          console.error(error);
          return false;
        });
    });
  }

  /**
   * Turns lights on
   */
  public on(): Array<Promise<ILightResponse>> {
    return this.setLightState(Array(this.lights.length).fill({ on: true }));
  }

  /**
   * Turns lights off
   */
  public off(): Array<Promise<ILightResponse>> {
    return this.setLightState(Array(this.lights.length).fill({ on: false }));
  }

  /**
   * Sets hue for each light in array
   * @param hue Array of {hue: 'number'}
   */
  public setLightHue(hues: Array<Partial<ILightState>>): Array<Promise<ILightResponse>> {
    return this.setLightState(hues);
  }

  /**
   * Increments brightness by const amount
   */
  public incrementLightBrightness(): Array<Promise<ILightResponse>> {
    return this.setLightState(
      this.lights.map((light) => {
        return { bri: this.incrementUint8(light.bri, BRIGHNESS_INCREMENT) } as Partial<ILightState>;
      })
    );
  }

  /**
   * Decrement brightness by const amount
   */
  public decrementLightBrightness(): Array<Promise<ILightResponse>> {
    return this.setLightState(
      this.lights.map((light) => {
        return { bri: this.incrementUint8(light.bri, BRIGHNESS_INCREMENT * -1) } as Partial<ILightState>;
      })
    );
  }

  /**
   * Decrement brightness by const amount
   */
  public incrementLightSaturation(): Array<Promise<ILightResponse>> {
    return this.setLightState(
      this.lights.map((light) => {
        return { sat: this.incrementUint8(light.sat, SATURATION_INCREMENT) } as Partial<ILightState>;
      })
    );
  }

  /**
   * Decrement brightness by const amount
   */
  public decrementLightSaturation(): Array<Promise<ILightResponse>> {
    return this.setLightState(
      this.lights.map((light) => {
        return { sat: this.incrementUint8(light.sat, SATURATION_INCREMENT * -1) } as Partial<ILightState>;
      })
    );
  }

  /**
   * Sets the lights to random colors
   */
  public setRandomColors(): Array<Promise<ILightResponse>> {
    return this.setLightState(
      this.lights.map(() => {
        return { hue: Math.floor(Math.random() * Math.floor(MAX_HUE + 1)) };
      })
    );
  }

  /**
   * Helper function for setting the light state in a uniform way
   * @returns  Promise array of HUE API responses e.g. {"success":{"/lights/1/state/bri":200}}
   */
  private setLightState(lightState: Array<Partial<ILightState>>): Array<Promise<ILightResponse>> {
    return lightState.map((state, index) => {
      const lightID: number = index + 1;
      return axios.put(`${LIGHTS_ENDPOINT}/${lightID}/state`, state).then((res) => {
        return res.data;
      });
    });
  }

  // Helper function for incrementing uint8 numbers without going out of range
  private incrementUint8(start: number, increment: number): number {
    const proposedNumber = start + increment;
    if (proposedNumber < MIN_UINT8) {
      return MIN_UINT8;
    } else if (proposedNumber > MAX_UINT8) {
      return MAX_UINT8;
    } else {
      return proposedNumber;
    }
  }
}
