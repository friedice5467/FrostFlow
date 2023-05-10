import axios from 'axios';

const api = axios.create({
    baseURL: 'https://localhost:7272',
});

export default api;