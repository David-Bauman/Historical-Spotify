import React from 'react';
import {NavBar} from '.';
import {fetchSearchablePlaylists} from './../../services/api';
import {loadingScreen} from './../../constants/functions';

export class ControlledSearchNavBar extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: false,
			playlists: [],
			searchVal: ''
		};
		this.onSearch = this.onSearch.bind(this);
	}

	onSearch(val) {
		const {playlists, loading} = this.state;
		if (!playlists.length && !loading && val.length > 1) {
			this.setState({loading: true});
			fetchSearchablePlaylists().then(res =>
				this.setState({loading: false, playlists: res.data.data.playlists})
			).catch(err => {this.setState({loading: false}); console.log(err)});
		}
		this.setState({
			searchVal: val
		});
	}

	render() {
		let {loading, playlists, searchVal} = this.state;
		if (loading)
			return <NavBar onSearch={this.onSearch}>{loadingScreen()}</NavBar>;
		if (!playlists.length || searchVal.length < 2)
			return <NavBar onSearch={this.onSearch} />;

		playlists = playlists.filter(item => item.name.toLowerCase().search(searchVal.toLowerCase()) !== -1);
		return (
			<NavBar onSearch={this.onSearch}>
				<ul style={{listStyle: 'none', paddingLeft: '0'}}>
					{playlists.map(item =>
						<li key={item.name} className='searched-playlist-container'>
							<a href={`/playlist/${item.id}`} className='searched-playlist'>
								<img style={{width: '50%'}} src={item.imageURL}	alt='playlist cover' />
								<p style={{display: 'inline', marginLeft: '5px'}}>{item.name}</p>
							</a>
						</li>
					)}
				</ul>
			</NavBar>
		);
	}
}
