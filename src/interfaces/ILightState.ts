// Interface describing the light state JSON object from the HUE api
export default interface ILightState {
  name: string;
  on: true;
  bri: number;
  hue: number;
  sat: number;
  effect: string;
  xy: number[];
  ct: number;
  alert: string;
  colormode: string;
  mode: string;
  reachable: boolean;
}
