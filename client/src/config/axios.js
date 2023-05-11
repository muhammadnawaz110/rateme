import axios from "axios"

export const configureAxios = (Store) => {
    axios.defaults.baseURL = process.env.REACT_APP_BASE_URL
    axios.interceptors.request.use((config) => {
        const state = Store.getState();
        if(state.auth.token)
            config.headers.Authorization = 'Bearer ' + state.auth.token;
        return config;
    }, (err) => Promise.reject(err))
}