import React from 'react';
import {Link} from 'react-router-dom';
import PropTypes from 'prop-types';
import {UserInfo} from './../user-info';
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
                style={{cursor: 'pointer'}}
              >
                <Link className='nav-item' to='/'>
                  Home
                  <div className='nav-item-icon'>
                    <i className='fas fa-home' />
                  </div>
                </Link>
              </div>
            </li>
            <li>
              <div
                className='nav-item-container'
                style={{cursor: 'pointer'}}
              >
                <Link className='nav-item' to='/addplaylist'>
                  Add a Playlist
                  <div className='nav-item-icon'>
                    <i className='fas fa-plus' />
                  </div>
                </Link>
              </div>
            </li>
            <li>
              <div className='nav-item-container' onClick={() => this.updateSearching(true)}>
                <span className='nav-item'>
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
                </span>
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
