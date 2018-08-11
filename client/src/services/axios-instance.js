import axios from 'axios';

export const axiosInstance = axios.create({
	baseURL: 'http://localhost:4000/graphql',
	headers: {
		'Content-Type': 'application/json',
		'Accept': 'application/json',
	}
});