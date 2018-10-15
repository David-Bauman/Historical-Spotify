import React from 'react';
import {withRouter} from 'react-router';
import qs from 'stringquery';
import {withCookies} from 'react-cookie';
import {getUserAuth, getInitialAccessToken, getUserName} from './../../services/api';

class userInfo extends React.Component {
  constructor(props) {
    super(props);
    this.createPlayer = this.createPlayer.bind(this);
    this.state = {};
    const params = qs(this.props.location.search);
    if (params.code) {
      getInitialAccessToken(params.code).then(res => {
        props.cookies.set('HS-client-access', res.data.access_token, {maxAge: 3600});
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
      getUserName(access).then(res => this.setState({user: {name: res.data.display_name, image: res.data.images[0]}}));
    } else {
      setTimeout(this.createPlayer, 500);
    }
  }

  componentWillUnmount() {
    if (this.player) this.player.disconnect();
  }

  render() {
    const user = this.state.user;
    if (user) 
      return (
      <div style={{position: 'absolute', borderTop: '1px solid gray', bottom: '25px', alignSelf: 'center', fontSize: '18px', width: '80%', textAlign: 'center', paddingTop: '15px'}}>
        {user.image && <img src={user.image.url} alt={'user\'s avatar'} style={{width: '30px', height: '30px', display: 'inline-block'}} />}
        <span>{user.name}</span>
      </div>
      );

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
