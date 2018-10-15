import React from 'react';
import {toast} from 'react-toastify';
import {addPlaylist, fetchPlaylistIds} from './../../services/api';
import {loadingScreen} from './../../constants/functions';
import picture from './../../constants/add_playlist.png';
import {GradientBackground} from './../../components';
import {ControlledSearchNavBar} from './../../containers';

const URIRegexValidation = /^spotify:user:.+:playlist:[a-zA-Z0-9]{22}$/;
const PlaylistLinkRegexValidation = /^https:\/\/open.spotify.com\/user\/.+\/playlist\/[a-zA-Z0-9]{22}\??.*$/;

class AddPlaylist extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			input: '',
			loading: false,
			newPlaylist: null,
			playlists: [],
		};
		fetchPlaylistIds().then(res =>
			this.setState({playlists: res.data.data.playlists})
		).catch(err => {
			console.log(err);
			toast.error('Something went wrong. We can\'t connect to the server. Try reloading the page.');
		});
		this.reset = this.reset.bind(this);
		this.setInput = this.setInput.bind(this);
		this.handleAdd = this.handleAdd.bind(this);
	}

	setInput(val) {
		this.setState({
			input: val
		});
	}

	handleAdd() {
		let {input, playlists} = this.state;
		const URI = URIRegexValidation.test(input);
		const playlist = PlaylistLinkRegexValidation.test(input);
		if (!URI === !playlist) {
			toast.error('That doesn\'t look like a Spotify URI or Playlist link. Please try again.');
			return;
		}
		let user, id;
		if (URI) {
			// uri like spotify:user:spotifycharts:playlist:37i9dQZEVXbMDoHDwVN2tF
			input = input.slice(13);
			user = input.slice(0, input.indexOf(':'));
			id = input.substr(input.length - 22);
		} else {
			// link like https://open.spotify.com/user/spotifycharts/playlist/37i9dQZEVXbMDoHDwVN2tF?si=6vzZhhP5TnuYs5SJAIgVcw
			input = input.slice(30);
			if (input.indexOf('?') > -1)
				input = input.slice(0, input.indexOf('?'));
			user = input.slice(0, input.indexOf('/'));
			id = input.substr(input.length - 22);
		}
		for (let i = 0; i < playlists.length; i++) {
			if (playlists[i].id === id) {
				toast.error(`We already have ${playlists[i].name}.`);
				return
			}
		}
		this.setState({loading: true});
		addPlaylist(`${user}/playlists/${id}`).then(res => {
			const info = res.data.data.addPlaylist;
			this.setState(prevState => {
				return {
					loading: false,
					newPlaylist: info,
					playlists: prevState.playlists.push({id: info.id, name: info.name}),
				}
			})
		});
	}

	reset() {
		this.setState({
			input: '',
			newPlaylist: null,
		});
	}

	render() {
		const {input, loading, newPlaylist} = this.state;
		return (
			<div>
				<GradientBackground />
				<div className='main-container'>
					<ControlledSearchNavBar />
					<div className='information-container'>
						<div className='spaced'>
							<h1 className='header'>
								Add A Playlist
							</h1>
							{loading && loadingScreen(50, 'center', {fontSize: '45px', marginTop: '40px'})}
							{(!loading && !newPlaylist) &&
							<div style={{padding: '0', marginRight: 'auto', marginLeft: 'auto'}}>
								<input
									autoFocus
									onChange={e => this.setInput(e.target.value)}
									placeholder='Enter a Spotify URI or playlist link'
									style={{
										background: 'rgba(0, 0, 0, .5)',
										border: 'rgba(0, 0, 0, .5)',
										color: 'white',
										fontSize: '20px',
										height: '40px',
										width: '100%',
									}}
									value={input}
								/>
								<button className='btn btn-success' onClick={this.handleAdd} style={{fontSize: '20px', marginTop: '10px'}}>
									Add the new Playlist!
								</button>
								<div style={{marginTop: '20px'}}>
									<h3 style={{color: 'white', textDecoration: 'underline'}}>
										Where to find the Spotify URI or playlist link
									</h3>
									<img
										alt={'Spotify Playlist with \'Copy Playlist Link\' and \'Copy Spotify URI\' highlighted'}
										src={picture}
										style={{marginBottom: '20px'}}
									/>
								</div>
							</div>
							}
							{(!loading && newPlaylist) &&
							<div>
								<h3 style={{color: 'white', marginBottom: '10px',textAlign: 'center'}}>
									<a href={`/playlist/${newPlaylist.id}`}>{newPlaylist.name}</a> successfully added!
								</h3>
								<img
									alt='playlist cover'
									className='cover-image'
									style={{display: 'block',height: 'inherit', margin: 'auto', width: 'inherit', position: 'relative'}}
									src={newPlaylist.imageURL}
								/>
								<div className='playlist-title-container' style={{color: 'white'}}>
									<a className='playlist-title' href={`/playlist/${newPlaylist.id}`}>
										{newPlaylist.name}
									</a>
									<p>
										{newPlaylist.description}
									</p>
									<a
										className='btn btn-success'
										style={{fontSize: '25px', marginTop: '30px'}}
										onClick={this.reset}
									>
										Add Another Playlist
									</a>
								</div>
							</div>
							}
						</div>
					</div>
				</div>
			</div>
		)
	}
}

export default AddPlaylist;
