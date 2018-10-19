import React from 'react';
import moment from 'moment';

export const loadingScreen = (height = 50, textAlign = 'center', style = {}) => (
	<div style={{height: `${height}px`}} className={`text-${textAlign}`}>
		<i className='fa fa-spin fa-spinner fa-2x' style={Object.assign({color: 'orangered'}, style)} />
	</div>
);

export function cleanDatesFromAPI(dates) {
	let possibles = [];
	for (let i = 0; i < dates.length; i++) {
		possibles[i] = moment(parseInt(dates[i], 10));
	}
	return possibles;
}
