import React from 'react';
import {withRouter} from 'react-router';
import {toast} from 'react-toastify';
import {connect} from 'react-redux';
import {withCookies} from 'react-cookie';
import {bindActionCreators} from 'redux';
import qs from 'stringquery';
import {
  getUserAuth, 
  getInitialAccessToken, 
  refreshAccessToken, 
  getUserName,
  logUser,
} from './../../../services/api';
import {updatePlaying} from './../../../actions/playing';

class userInfo extends React.Component {
  constructor(props) {
    super(props);
    this.createPlayer = this.createPlayer.bind(this);
    this.createUser = this.createUser.bind(this);
    this.state = {};

    const params = qs(this.props.location.search);
    if (params.code) {
      this.state = {code: params.code};
      window.history.replaceState({code: params.code}, '', '/HistoricalPlaylists');
    }
    if (params.code || props.cookies.get('HS-client-access') || props.cookies.get('HS-client-refresh')) {
      this.createPlayer();
    } 
  }

  createUser() {
    if (!this.state.user) {
      const access = this.props.cookies.get('HS-client-access');
      getUserName(access).then(res => {
        logUser(res.data.display_name);
        this.setState({user: {name: res.data.display_name, image: res.data.images[0]}})
      });
    }
  }

  createPlayer() {
    if (window.Spotify) {
      const code = this.state.code;
      const options = {
        getOAuthToken: cb => {
          const access = this.props.cookies.get('HS-client-access');
          const refresh = this.props.cookies.get('HS-client-refresh');
          if (access) {
            console.log('Got access token from cookies');
            this.createUser();
            return cb(access);
          } else if (refresh) {
            refreshAccessToken(refresh).then(res => {
              this.props.cookies.set('HS-client-access', res.data.data.refreshToken.access_token, {maxAge: 3600});
              console.log('Got access token from the cookie\'d refresh token');
              this.createUser();
              return cb(res.data.data.refreshToken.access_token);
            });
          } else if (code) {
            getInitialAccessToken(code).then(res => {
              this.props.cookies.set('HS-client-access', res.data.data.codeToToken.access_token, {maxAge: 3600});
              this.props.cookies.set('HS-client-refresh', res.data.data.codeToToken.refresh_token);
              console.log('Got access and refresh tokens from the query code');
              this.createUser();
              return cb(res.data.data.codeToToken.access_token);
            });
            this.setState({code: null}, () => console.log("Removed code from state"));
          } else {
            console.error('problem in createPlayer', access, refresh, code);
            toast.error('Something went wrong with Spotify\'s authorization.');
            return cb('');
          }
        },
        name: 'Historical Spotify Playlists Player'
      };
      this.player = new window.Spotify.Player(options);
      this.player.on('player_state_changed', (SDKObj) => this.props.updateSDK(SDKObj));
      this.player.on('authentication_error', ({message}) => {
        console.error('Failed to authenticate', message);
      });
      this.player.on('account_error',() => {toast.error('A Spotify Premium account is required to play songs.')});

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
    const user = this.state.user;
    if (user) {
      return (
        <div style={{position: 'absolute', borderTop: '1px solid gray', bottom: `${this.props.current === '' ? 25 : 100}px`, alignSelf: 'center', fontSize: '18px', width: '80%', textAlign: 'center', paddingTop: '15px'}}>
          {user.image && <img src={user.image.url} alt={'user\'s avatar'} style={{width: '30px', height: '30px', display: 'inline-block'}} />}
          <span>{user.name}</span>
        </div>
      );
    }

    return (
      <div style={{position: 'absolute', width: '150px', alignSelf: 'center', bottom: '25px'}}>
        <button
          className='btn'
          onClick={() => getUserAuth().then(res => window.location = res.data.data.userAuth.url)}
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
    current: state.playing.id
  }
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({
    updateSDK: updatePlaying
  }, dispatch);
};

export const UserInfo = connect(mapStateToProps, mapDispatchToProps)(withRouter(withCookies(userInfo)));
