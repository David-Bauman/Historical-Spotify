import React from 'react';
import {NavBar} from './../../containers';
import {GradientBackground} from './../../components';
import {Playlists} from './playlists';

class Home extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			searchValue: '',
		};
		this.updateSearch = this.updateSearch.bind(this);
	}

	updateSearch(val) {
		this.setState({
			searchValue: val,
		});
	}

	render() {
		return (
			<div>
				<GradientBackground />
				<div className='main-container'>
					<NavBar onSearch={this.updateSearch} />
					<div className='information-container'>
						<div className='spaced'>
							<h1 className='header'>
								Most Viewed Playlists
							</h1>
							<div style={{padding: '0', marginRight: 'auto', marginLeft: 'auto'}}>
								<Playlists searchValue={this.state.searchValue} />
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default Home;
