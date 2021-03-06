import {SDKStateChanged} from './../constants/playing';

const INITAL_STATE = {
  id: '',
  name: '',
  artists: '',
  duration: 0,
  imageURL: '',
  paused: false,
  position: 0,
  volume: 1
};

export default function(state = INITAL_STATE, action) {
  switch(action.type) {
    case SDKStateChanged:
      const current = action.state.track_window.current_track;
      if (current.id === state.id)
        return {...state, position: action.state.position, paused: action.state.paused};
      return {
        id: current.id,
        name: current.name,
        artists: createArtists(current.artists),
        duration: action.state.duration,
        imageURL: getImageURL(current.album.images),
        paused: action.state.paused,
        position: 0,
      };
    default:
      return state;
  }
}

function createArtists(arr) {
  let artists = '';
  for (let i = 0; i < arr.length; i++) {
    if (i) artists += ', ';
    artists += arr[i].name;
  }
  return artists;
}

function getImageURL(arr) {
  let minPixels = 10000;
  let minIndex = 0;
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].height < minPixels) {
      minPixels = arr[i].height;
      minIndex = i;
    }
  }
  return arr[minIndex].url;
}

