import axios from 'axios';
import { getAuthToken } from './AuthHelper';

axios.defaults.baseURL = 'http://localhost:8080';
axios.defaults.headers.post['Content-Type'] = 'application/json';

export const request = (method, url, data, params) => {
    let headers = {};
    if (getAuthToken !== null && getAuthToken() !== "null" && getAuthToken() !== undefined) {
        headers = {'Authorization': `Bearer ${getAuthToken()}`};
    }

    return axios({
        method: method,
        url: url,
        headers: headers,
        data: data,
        params: params});
};