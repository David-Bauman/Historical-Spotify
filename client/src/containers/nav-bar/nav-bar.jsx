import React from 'react';
import PropTypes from 'prop-types';
import {UserInfo} from './..';
import './_nav-bar.css';

export class NavBar extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			searching: false,
			searchValue: '',
		};
		this.updateSearching = this.updateSearching.bind(this);
		this.handleSearch = this.handleSearch.bind(this);
	}

	updateSearching(truthiness) {
		this.setState({
			searching: truthiness,
		});
	}

	handleSearch(val) {
		this.setState({
			searchValue: val,
		});
		this.props.onSearch(val);
	}

  render() {
    const {searching, searchValue} = this.state;
		return (
			<div className='nav-bar'>
				<nav>
					<ul style={{listStyle: 'none', padding: '0'}}>
						<li>
							<div
								className='nav-item-container'
								onClick={() => window.location.href = '/'}
								style={{cursor: 'pointer'}}
							>
								<a className='nav-item'>
									<span>
										Home
									</span>
									<div className='nav-item-icon'>
										<i className='make-favicon fas fa-home' />
									</div>
								</a>
							</div>
						</li>
						<li>
							<div
								className='nav-item-container'
								onClick={() => window.location.href = '/addplaylist'}
								style={{cursor: 'pointer'}}
							>
								<a className='nav-item'>
									<span>
										Add a Playlist
									</span>
									<div className='nav-item-icon'>
										<i className='fas fa-plus' />
									</div>
								</a>
							</div>
						</li>
						<li>
							<div className='nav-item-container' onClick={() => this.updateSearching(true)}>
								<a className='nav-item'>
									{!searching &&
									<span style={{cursor: 'pointer'}}>
										Search
									</span>
									}
									{searching &&
									<input
										autoFocus
										className='form-control'
										onChange={e => this.handleSearch(e.target.value)}
										onBlur={() => {if (searchValue === '') this.updateSearching(false)}}
										style={{
											backgroundColor: 'rgba(0, 0, 0, .5)',
											borderColor: 'rgba(0, 0, 0, .5)',
											fontSize: '16px',
										}}
										type='text'
									/>
									}
									<div className='nav-item-icon' style={{cursor: 'pointer'}}>
										<i className='fas fa-search' />
									</div>
								</a>
							</div>
						</li>
					</ul>
					{this.props.children}
					<UserInfo />
				</nav>
			</div>

    );
  }
}

NavBar.propTypes = {
	onSearch: PropTypes.func.isRequired,
};