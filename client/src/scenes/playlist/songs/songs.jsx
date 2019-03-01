import React from 'react';
import PropTypes from 'prop-types';
import {toast} from 'react-toastify';
import {playSong} from './../../../services/api';
import {msToMinuteSeconds} from './../../../constants/functions';
import './_songs.css';

export class Song extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			hover: false
		};
		this.changeHover = this.changeHover.bind(this);
        this.play = this.play.bind(this);
	}

	changeHover(truthiness) {
		this.setState({
			hover: truthiness
		});
	}

    play() {
        if (window.player)
            playSong(`spotify:track:${this.props.song.songId}`, window.player).catch(err => {
                if (err.message && err.message.includes('403')) toast.error('You must be a Spotify Premium user to play songs.');
            });
        else
            toast.error('You need to be logged in to a Spotify Premium account to play songs.');
    }

	render() {
		const {song, id, datePickerOpen} = this.props;
		const hover = this.state.hover;
		return (
			<li
				className='song-container'
				onMouseEnter={() => this.changeHover(true)}
				onMouseLeave={() => this.changeHover(false)}
				style={{background: hover && !datePickerOpen ? 'rgba(0, 0, 0, .6)' : 'inherit'}}
			>
				<div style={{width: '3.5em', paddingRight: '1em', textAlign: 'right'}}>
					<div style={{marginTop: '0.75em', color: 'white'}}>
						{(!hover || datePickerOpen) && id}
						{(hover && !datePickerOpen) && <i className='fas fa-play-circle' onClick={this.play} style={{fontSize: '24px'}} />}
					</div>
				</div>
				<div style={{flex: '1', textAlign: 'left', overflow: 'hidden', display: 'block'}}>
					<div style={{marginTop: '0.8em'}}>
						<span style={{
							color: 'white',
							display: 'block',
							fontSize: '16px',
							overflow: 'hidden',
							textOverflow: 'ellipsis',
							whiteSpace: 'nowrap'}}
						>
							{song.name}
						</span>
						<span style={{
							color: 'hsla(0, 0%, 100%, .6)',
							display: 'block',
							overflow: 'hidden',
							textOverflow: 'ellipsis',
							whiteSpace: 'nowrap'
							}}
						>
							<span>
								{song.artists}
							</span>
							<span style={{padding: '0 5px'}}>
								•
							</span>
							<span>
								{song.album}
							</span>
						</span>
					</div>
				</div>
				<div className='for-ellipsis?'>
				</div>
				<div style={{display: 'inline'}}>
					<div style={{marginTop: '0.5em', paddingRight: '1em', color: 'hsla(0, 0%, 100%, .6)'}}>
						<span>
							{msToMinuteSeconds(song.duration)}
						</span>
					</div>
				</div>
			</li>
		);
	}
}

Song.propTypes = {
	datePickerOpen: PropTypes.bool,
	id: PropTypes.number,
	song: PropTypes.object
};
