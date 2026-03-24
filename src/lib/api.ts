import axios from 'axios';

axios.defaults.withCredentials = true;
axios.defaults.withXSRFToken = true; 

export const api = axios.create({
    baseURL: 'http://localhost:8000',
    withCredentials: true,
    withXSRFToken: true,
    xsrfCookieName: 'XSRF-TOKEN', 
    xsrfHeaderName: 'X-XSRF-TOKEN',
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Accept': 'application/json',
    }
});

// Interceptor de respuesta
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (!error.response) {
            console.error("Error de Red: El servidor API no responde.");
            //error.message = "No se pudo establecer conexión con el servidor.";
        }

        if (error.response && error.response.status === 401) {
            console.warn("Sesión expirada o no autorizado.");
            // Aquí podrías redirigir al login si fuera necesario
        }

        return Promise.reject(error);
    }
);