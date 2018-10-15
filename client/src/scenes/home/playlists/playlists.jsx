import React from 'react';
import {Link} from 'react-router-dom';
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
		this.getPlaylists = this.getPlaylists.bind(this);
		this.getPlaylists();
	}

	getPlaylists() {
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
					<h3 style={{color: '#FEFEFA'}}>
						Seems like we can't connect to the server. Try reloading the page.
					</h3>
				</div>
			);
		}
		if (loading) return loadingScreen();

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
									<Link className='cover-image-container' to={`/playlist/${playlist.id}`}>
										<div className='cover-image' style={{backgroundImage: `url(${playlist.imageURL})`}} />
									</Link>
								</div>
								<div className='playlist-title-container' style={{color: 'white'}}>
									<Link className='playlist-title' to={`/playlist/${playlist.id}`}>
										{playlist.name}
									</Link>
									<p style={{color: 'lightgray'}}>
										{playlist.description}
									</p>
									<p>
										{moment(parseInt(playlist.createDate, 10)).fromNow(true)} of data
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
