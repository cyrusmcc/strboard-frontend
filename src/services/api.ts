import axios from "axios";

//@ts-ignore
let url = 'https://' + import.meta.env.VITE_HOST + '/api';

if (url.includes('localhost')) {
    url = 'http://localhost:8080/api';
}

const instance = axios.create({
    baseURL: url,
    headers: {
    },
});

export default instance;