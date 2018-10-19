import React from 'react';
import {withRouter} from 'react-router';
import {toast} from 'react-toastify';
import qs from 'stringquery';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {withCookies} from 'react-cookie';
import {getUserAuth, getInitialAccessToken, getUserName} from './../../../services/api';
import {updatePlaying} from './../../../actions/playing';

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
      this.player.addListener('player_state_changed', (SDKObj) => this.props.updateSDK(SDKObj));
      this.player.addListener('account_error',() => {toast.error('A Spotify Premium account is required to play songs.')});
      window.player = this.player;
      this.player.connect().then(this.props.onCreatePlayer);
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
      <div style={{position: 'absolute', borderTop: '1px solid gray', bottom: `${user ? 100 : 25}px`, alignSelf: 'center', fontSize: '18px', width: '80%', textAlign: 'center', paddingTop: '15px'}}>
        {user.image && <img src={user.image.url} alt={'user\'s avatar'} style={{width: '30px', height: '30px', display: 'inline-block'}} />}
        <span>{user.name}</span>
      </div>
      );

    return (
	<div style={{position: 'absolute', width: '150px', alignSelf: 'center', bottom: '25px'}}>
	  <button
        className='btn'
        onClick={() => getUserAuth().then(res => window.location = res.data.url)}
        style={{backgroundColor: 'hsla(0, 0%, 100%, 0.6)', fontSize: '16px', width: '100%'}}
      >
		Login
	  </button>
	</div>
    );
  }
}


const mapStateToProps = state => {
  return {
    player: state.player
  }
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({
    updateSDK: updatePlaying
  }, dispatch);
};

export const UserInfo = connect(mapStateToProps, mapDispatchToProps)(withRouter(withCookies(userInfo)));
