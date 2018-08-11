import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import {loadingScreen} from './../../../constants/functions';
import {fetchPlaylists} from './../../../services/api';
import './_playlists.css';

export class Playlists extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			error: false,
			loading: true,
			playlists: [],
		};
		this.fetchPlaylists = this.fetchPlaylists.bind(this);
		this.fetchPlaylists();
	}

	fetchPlaylists() {
		fetchPlaylists().then(response => {
			this.setState({
				loading: false,
				playlists: response.data.data.playlists,
			});
		}).catch(() => {
			this.setState({
				error: true,
				loading: false,
			});
		});
	}

	render() {
		let {error, loading, playlists} = this.state;
		if (error) {
			return (
				<div className='alert text-center' style={{marginTop: '50px'}}>
					<h3>
						Seems like we can't connect to the server. Try reloading the page.
					</h3>
				</div>
			);
		}

		if (loading)
			return loadingScreen();

		const {searchValue} = this.props;

		if (searchValue) {
			const searchvalue = searchValue.toLowerCase().replace(/\\/g, '\\\\');

			playlists = playlists.filter(item => {
				if (item.name.toLowerCase().search(searchvalue) !== -1)
					return true;
				return item.description.toLowerCase().search(searchvalue) !== -1;
			});
			if (!playlists.length) {
				return (
					<div className='alert text-center' style={{marginTop: '50px', color: 'white'}}>
						<h3>
							Seems like we don't have a playlist that matches '{searchValue}'.
							Add the playlist you're looking for and we'll start collecting data immediately.
						</h3>
						<a
							className='btn btn-success'
							style={{fontSize: '30px', marginTop: '30px', color: 'white'}}
							href={'/addplaylist'}
						>
							Add A Playlist
						</a>
					</div>
				);
			}
		}

		return (
			<div
				className='row'
				style={{
					display: 'flex',
					flexFlow: 'row wrap',
					justifyContent: 'flex-start',
					marginLeft: '-10px',
					marginRight: '-10px'
				}}
			>
				{playlists.map(playlist =>
					<div className='col-xs-6 col-sm-4 col-md-3 col-lg-2 col-xl-2' key={playlist.id}>
						<div style={{position: 'relative', paddingBottom: '2em', maxWidth: '400px'}}>
							<div>
								<div style={{display: 'inline'}}>
									<a className='cover-image-container' href={`/playlist/${playlist.id}`}>
										<div className='cover-image' style={{backgroundImage: `url(${playlist.imageURL})`}} />
									</a>
								</div>
								<div className='playlist-title-container' style={{color: 'white'}}>
									<a className='playlist-title' href={`/playlist/${playlist.id}`}>
										{playlist.name}
									</a>
									<p>
										{playlist.description}
									</p>
									<p>
										{moment(new Date(playlist.createDate).toISOString()).fromNow(true)} of data
									</p>
								</div>
							</div>
						</div>
					</div>
				)}
			</div>
		);
	}
}

Playlists.propTypes = {
	searchValue: PropTypes.string,
};