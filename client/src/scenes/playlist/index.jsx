import React from 'react';
import moment from 'moment';
import {toast} from 'react-toastify';
import {fetchMostRecentPlaylist, fetchHistoricalPlaylist} from'./../../services/api';
import {cleanDatesFromAPI, loadingScreen} from './../../constants/functions';
import {GradientBackground, SingleDatePicker} from './../../components';
import {ControlledSearchNavBar} from './../../containers';
import {Song} from './songs';
import './_index.css'

function createOptions(arr, momentObj) {
	if (momentObj) {
		const possibilities = arr.filter(item => momentObj.isSame(item, 'day'));
		let returnVal = [], time;
		for (let i = 0; i < possibilities.length; i++) {
			time = possibilities[i].format('HH:mm:ss');
			returnVal.push(<option key={i} value={arr.indexOf(possibilities[i])}>{time}</option>);
		}
		return returnVal;
	}
	return null;
}

const showTimePicker = (arr, momentObj) => arr.filter(item => momentObj.isSame(item, 'day')).length > 1;

class Playlist extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			currentDate: null,
			datePickerOpen: false,
			loading: true,
			overview: {},
			possibleDates: [],
			showTime: false,
			songs: [],
		};
		fetchMostRecentPlaylist(props.match.params.id).then(res => {
			const data = res.data.data.mostRecentPlaylist;
			const cleanDates = cleanDatesFromAPI(data.possibleDates);
			const maxDate = moment.max(cleanDates);
			this.setState({
				currentDate: maxDate,
				loading: false,
				overview: data.overview,
				possibleDates: cleanDates,
				showTime: showTimePicker(cleanDates, maxDate),
				songs: data.songs,
			});
		}).catch(err => {
			console.log(err);
			toast.error('Something went wrong and we couldn\'t fetch that playlist. Try reloading the page.');
		});
		this.getPlaylist = this.getPlaylist.bind(this);
		this.datePicked = this.datePicked.bind(this);
		this.onFocus = this.onFocus.bind(this);
	}

	getPlaylist(dateIndex) {
		this.setState({loading: true});
		fetchHistoricalPlaylist(
			this.props.match.params.id,
			moment(this.state.possibleDates[dateIndex], 'ddd MMM DD YYYY HH:mm:ss Z').format('YYYY-MM-DD HH:mm:ss')
		).then(res => {
			const {overview, songs} = res.data.data.historicalPlaylist;
			this.setState(prevState => {
				return {
					loading: false,
					overview: Object.assign(prevState.overview, overview),
					songs: songs
				}
			});
		}).catch(err => {
			console.log(err);
			this.setState({loading: false});
			toast.error('Something went wrong and we couldn\'t fetch that playlist. Try reloading the page.');
		});
	}

	onFocus(truthiness) {
		this.setState({
			datePickerOpen: truthiness
		});
	}

	datePicked(momentObj) {
		const dates = this.state.possibleDates;
		const show = showTimePicker(dates, momentObj);
		this.setState({
			currentDate: momentObj,
			showTime: show,
		});
		if (!show) {
			for (let i = dates.length - 1; i > -1; i--) {
				if (momentObj.isSame(dates[i], 'day')) {
					this.getPlaylist(i);
					break;
				}
			}
		}
	}

	render() {
		const {overview, songs, possibleDates, currentDate, loading, datePickerOpen, showTime} = this.state;
		return (
			<div>
				<GradientBackground />
				<div className='main-container'>
					<ControlledSearchNavBar />
					{!currentDate && loadingScreen(50, 'center', {marginTop: '300px', fontSize: '30px'})}
					{currentDate &&
					<div className='information-container'>
						<div className='spaced' style={{paddingTop: '1.5em'}}>
							<div className='row'>
								<div className='col-xs-12 col-lg-3 col-xl-4'>
									<div className='playlist-header'>
										<div className='cover-image-selectable'>
											<div style={{display: 'inline'}}>
												<a className='cover-image-container'>
													<div className='cover-image' style={{backgroundImage: `url(${overview.imageURL})`}} />
												</a>
											</div>
										</div>
										<div className='playlist-info'>
											<div style={{paddingBottom: '8px'}}>
												<h2 style={{fontSize: '26px', fontWeight: '700', lineHeight: '36px'}}>
													{overview.name}
												</h2>
												<div>
													<span style={{color: 'hsla(0, 0%, 100%, .6)'}}>By </span>
													{overview.user}
												</div>
											</div>
											<p style={{color: 'hsla(0, 0%, 100%, .6)'}} className='playlist-description'>
												{overview.description.replace(/\\'/g, "'")}
											</p>
											<p style={{color: 'hsla(0, 0%, 100%, .6)'}}>
												{songs.length} songs
											</p>
											<SingleDatePicker
												date={currentDate}
												onDateChange={this.datePicked}
												onFocus={this.onFocus}
												possibleDates={possibleDates}
											/>
											{showTime &&
											<select
												className='time-picker'
												defaultValue={-1}
												onChange={e => this.getPlaylist(e.target.value)}
												style={{color: 'black'}}
											>
												<option disabled value={-1}> -- pick a time -- </option>
												{createOptions(possibleDates, currentDate)}
											</select>
											}
										</div>
									</div>
								</div>
								<div className='col-xs-12 col-lg-9 col-xl-8'>
									{loading && loadingScreen()}
									{!loading &&
									<ul style={{listStyle: 'none', marginBottom: '2em', paddingLeft: '0'}}>
										{songs.map((song, i) =>
											<Song song={song} id={i + 1} key={i + 1} datePickerOpen={datePickerOpen} />
										)}
									</ul>
									}
								</div>
							</div>
						</div>
					</div>
					}
				</div>
			</div>
		);
	}
}

export default Playlist