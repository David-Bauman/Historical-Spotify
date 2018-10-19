import {SDKStateChanged} from './../constants/playing.js';

export function updatePlaying(playObj) {
  return {
    type: SDKStateChanged,
    state: playObj
  }
}
