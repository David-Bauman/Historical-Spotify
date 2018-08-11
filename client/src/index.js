import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter} from 'react-router-dom';
import {ToastContainer} from 'react-toastify';
import Routes from './scenes';
import registerServiceWorker from './registerServiceWorker';
import 'react-toastify/dist/ReactToastify.min.css';
import './bootstrap-custom/css/bootstrap.css';
import './_index.css';

ReactDOM.render(
	<BrowserRouter>
		<div>
			<Routes />
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
		</div>
	</BrowserRouter>,
	document.getElementById('root')
);
registerServiceWorker();
