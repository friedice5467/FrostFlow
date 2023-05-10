import axios from 'axios';

const api = axios.create({
    baseURL: 'https://localhost:7272', // Use the appropriate backend URL from your launchsettings.json
});

export default api;