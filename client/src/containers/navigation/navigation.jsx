import React, {Fragment} from 'react';
import {Link} from 'react-router-dom';
import {fetchSearchablePlaylists} from './../../services/api';
import {loadingScreen} from './../../constants/functions';
import {NavBar} from './nav-bar';
import {PlayingBar} from './playing-bar';

export class Navigation extends React.Component {
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
    const {loading, playlists, searchVal} = this.state;
    return (
      <Fragment>
      <NavBar onSearch={this.onSearch}>
        {loading && loadingScreen()}
        {(!loading && (playlists.length && searchVal.length > 1)) ?
        <ul style={{listStyle: 'none', paddingLeft: '0'}}>
          {playlists.filter(item => item.name.toLowerCase().search(searchVal.toLowerCase()) !== -1).map((item, index) =>
            <li key={item.name + index} className='searched-playlist-container'>
              <Link to={`/playlist/${item.id}`} className='searched-playlist'>
                <img style={{width: '50%'}} src={item.imageURL} alt='playlist cover' />
                <p style={{display: 'inline', marginLeft: '5px'}}>{item.name}</p>
              </Link>
            </li>
          )}
        </ul>
        : null
        }
      </NavBar>
      <PlayingBar />
      </Fragment>
    );
  }
}
