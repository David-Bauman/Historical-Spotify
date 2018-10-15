import React from 'react';
import {Switch, Route} from 'react-router-dom';
import Home from './home';
import Playlist from './playlist';
import AddPlaylist from './add-playlist';
import './_index.css';

const Routes = () => (
	<Switch>
		<Route exact path='/' component={Home} />
		<Route exact path='/addplaylist' component={AddPlaylist} />
		<Route exact path='/playlist/:id' component={Playlist} />
	</Switch>
);

export default Routes;
