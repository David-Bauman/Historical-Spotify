import React from 'react';
import {withRouter} from 'react-router';
import qs from 'stringquery';
import {withCookies} from 'react-cookie';
import {getUserAuth, getInitialAccessToken} from './../../services/api';

class userInfo extends React.Component {
  constructor(props) {
    super(props);
    this.createPlayer = this.createPlayer.bind(this);
    this.state = {};
    const params = qs(this.props.location.search);
    if (params.code) {
      getInitialAccessToken(params.code).then(res => {
        props.cookies.set('HS-client-access', res.data.access_token);
        props.cookies.set('HS-client-refresh', res.data.refresh_token);
        this.setState({access: res.data.access_token, refresh: res.data.refresh_token});
        this.createPlayer();
      }); 
    } else {
      this.state = {
        access: props.cookies.get('HS-client-access'),
        refresh: props.cookies.get('HS-client-refresh')
      }
      if (props.cookies.get('HS-client-access')) this.createPlayer();
    }
  }

  createPlayer() {
    if (window.Spotify) {
      const access = this.state.access;
      const options = {
        getOAuthToken: cb => {cb(access)},
        name: 'Historical Spotify Playlists Player',
      };
      this.player = new window.Spotify.Player(options);
      window.player = this.player;
      this.player.connect();
    } else {
      setTimeout(this.createPlayer, 500);
    }
  }

  componentWillUnmount() {
    if (this.player) this.player.disconnect();
  }

  render() {
    return (
	<div style={{position: 'absolute', width: '150px', alignSelf: 'center', bottom: '25px'}}>
	  <a 
        className='btn'
        onClick={() => getUserAuth().then(res => window.location = res.data.url)}
        style={{backgroundColor: 'hsla(0, 0%, 100%, 0.6)', fontSize: '16px', width: '100%'}}
      >
		Login
	  </a>
	</div>
    );
  }
}

export const UserInfo = withRouter(withCookies(userInfo));
