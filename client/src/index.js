import React, {Fragment} from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {BrowserRouter} from 'react-router-dom';
import {ToastContainer} from 'react-toastify';
import {createStore} from 'redux';
import {GradientBackground} from './components';
import {Navigation} from './containers';
import Routes from './scenes';
import rootReducer from './reducers';
import 'react-toastify/dist/ReactToastify.min.css';
import './bootstrap-custom/css/bootstrap.css';
import './_index.css';

const store = createStore(rootReducer);

ReactDOM.render(
	<BrowserRouter basename='/HistoricalPlaylists'>
    <Provider store={store}>
		<Fragment>
			<GradientBackground />
			<div className='main-container'>
                <Navigation />
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
    </Provider>
	</BrowserRouter>,
	document.getElementById('root')
);
