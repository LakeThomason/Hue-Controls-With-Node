// Type of response that is received from HUE API light state operation
export default interface ILightResponse {
  [status: string]: { [operation: string]: number | boolean };
}
