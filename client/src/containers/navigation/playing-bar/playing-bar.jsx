import React from 'react';
import './_playing-bar.css';

export class PlayingBar extends React.Component {
  render() {
    if (!this.props.player) return null; 
    return (
      <div id='playing-bar-container'>
        <div id='playing-bar'>
          <div id='currently-playing'>
            <img alt='album art' style={{marginRight: '10px', width: '60px', height: '60px'}} src='https://i.scdn.co/image/3b9172732af2868c5736dc206ac2043e1eb44fb7' />
            <div style={{flexDirection: 'column'}}>
              <p style={{color: 'white'}}>Fake News</p>
              <p style={{color: 'lightgray'}}>Trump</p>
            </div>
          </div>
          <div id='track-controls'>
          </div>
          <div id='volume-control'>
          </div>
        </div>
      </div>
    );
  }
}

