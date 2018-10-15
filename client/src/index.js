import React, {Fragment} from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter} from 'react-router-dom';
import {ToastContainer} from 'react-toastify';
import {GradientBackground} from './components';
import {ControlledSearchNavBar} from './containers';
import Routes from './scenes';
import 'react-toastify/dist/ReactToastify.min.css';
import './bootstrap-custom/css/bootstrap.css';
import './_index.css';

ReactDOM.render(
	<BrowserRouter basename='/HistoricalPlaylists'>
		<Fragment>
			<GradientBackground />
			<div className='main-container'>
				<ControlledSearchNavBar />
			    <Routes />
            </div>
			<ToastContainer
				autoClose={3500}
				closeOnClick
				draggable={false}
				draggablePercent={0}
				hideProgressBar
				position='top-right'
				newestOnTop={false}
				pauseOnHover
				pauseOnVisibilityChange={false}
				rtl={false}
			/>
		</Fragment>
	</BrowserRouter>,
	document.getElementById('root')
);
