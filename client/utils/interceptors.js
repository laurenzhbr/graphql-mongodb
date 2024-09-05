const axios = require('axios');

// Erstelle eine Instanz von Axios, um Interceptors hinzuzufügen
const axiosInstance = axios.create();

// Füge einen Request Interceptor hinzu
axiosInstance.interceptors.request.use(config => {
    // Füge einen Timestamp hinzu, wenn die Anfrage gesendet wird
    config.metadata = { startTime: Date.now() };
    return config;
}, error => {
    return Promise.reject(error);
});

// Füge einen Response Interceptor hinzu
axiosInstance.interceptors.response.use(response => {
    // Berechne die Zeit, die für die Anfrage benötigt wurde
    const endTime = Date.now();
    const startTime = response.config.metadata.startTime;
    response.config.metadata.endTime = endTime;
    response.config.metadata.duration = endTime - startTime;

    console.log(`Response time: ${response.config.metadata.duration} ms`);
    response.duration = response.config.metadata.duration;
    
    return response;
}, error => {
    return Promise.reject(error);
});

module.exports = axiosInstance;