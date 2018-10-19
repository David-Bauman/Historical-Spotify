import React from 'react';
import {connect} from 'react-redux';
import {msToMinuteSeconds} from './../../../constants/functions';
import './_playing-bar.css';

const playButton = <i className='fas fa-play-circle' onClick={() => window.player.togglePlay()} />
const pauseButton = <i className='fas fa-pause-circle' onClick={() => window.player.togglePlay()} />

class playingBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      seconds: 0,
      id: '',
      volume: 1,
      oldPos: 0,
      paused: true
    };
    this.changeSong = this.changeSong.bind(this);
    this.updatePause = this.updatePause.bind(this);
    this.updateVolume = this.updateVolume.bind(this);
    this.seekTrack = this.seekTrack.bind(this);
    this.updatePos = this.updatePos.bind(this);
    this.seekRef = React.createRef();
    this.volumeRef = React.createRef();
  }

  changeSong(id, pos) {
    this.setState({
      id: id,
      oldPos: pos,
      seconds: Math.round(pos/1000)
    });
  }

  updatePause(truthiness, pos) {
    this.setState({
      paused: truthiness
    });
    if (truthiness) {
      clearInterval(this.timeout);
    } else {
      this.setState({seconds: Math.round(pos / 1000)});
      this.timeout = setInterval(() => {
        const seconds = this.state.seconds;
        this.setState({seconds: seconds + 1})
      }, 1000);
    }
  }

  updateVolume(e) {
    const box = this.volumeRef.current.getBoundingClientRect();
    const percent = (e.clientX - box.left) / box.width;
    window.player.setVolume(percent);
    this.setState({volume: percent});
  }

  seekTrack(e) {
    const box = this.seekRef.current.getBoundingClientRect();
    const percent = (e.clientX - box.left) / box.width;
    window.player.seek(this.props.playing.duration * percent);
  }

  updatePos(pos) {
    this.setState({
      oldPos: pos,
      seconds: Math.round(pos/1000)
    });
  }

  componentWillUnmount() {
    if (this.timeout)
      clearInterval(this.timeout);
  }

  render() {
    const playing = this.props.playing;
    if (playing.id === '') return null;
    const {seconds, id, paused, volume, oldPos} = this.state;
    if (playing.id !== id) this.changeSong(playing.id, playing.position);
    if (playing.paused !== paused) this.updatePause(playing.paused, playing.position);
    if (playing.position !== oldPos) this.updatePos(playing.position);
    const currentSeconds = Math.floor(seconds % 60);
    const currentTime = `${Math.floor(seconds / 60)}:${currentSeconds < 10 ? '0' + currentSeconds : currentSeconds}`;
    return (
      <div id='playing-bar-container'>
        <div id='playing-bar'>
          <div id='currently-playing'>
            <img alt='album art' style={{marginRight: '10px', width: '64px', height: '64px'}} src={playing.imageURL} />
            <div style={{flexDirection: 'column'}}>
              <p style={{color: 'white', marginTop: '10px', marginBottom: 0}}>{playing.name}</p>
              <p style={{color: 'lightgray'}}>{playing.artists}</p>
            </div>
          </div>
          <div id='track-controls'>
            <div id='track-controls-buttons'>
              {playing.paused ? playButton : pauseButton}
            </div>
            <div id='seek-bar'>
              <div className='seek-bar-time'>{currentTime}</div>
              <div className='progress-bar-container' ref={this.seekRef} onClick={e => this.seekTrack(e)}>
                <div className='progress-bar-back'>
                  <div className='progress-bar-front' style={{width: `${seconds * 100000 / playing.duration}%`}} />
                </div>
              </div>
              <div className='seek-bar-time'>{msToMinuteSeconds(playing.duration)}</div>
            </div>
          </div>
          <div id='volume-control'>
            <i className='fas fa-volume-down' style={{marginRight: '10px'}} />
            <div className='progress-bar-container' style={{width: '50%'}} ref={this.volumeRef} onClick={e => this.updateVolume(e)}>
              <div className='progress-bar-back'>
                <div className='progress-bar-front' style={{width: `${volume * 100}%`}} />
              </div>
            </div>
            <i className='fas fa-volume-up' style={{marginLeft: '10px'}} />
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    playing: state.playing,
  }
};

export const PlayingBar = connect(mapStateToProps)(playingBar);
