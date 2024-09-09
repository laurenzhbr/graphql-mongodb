const axios = require('axios');

// Erstelle eine Instanz von Axios, um Interceptors hinzuzufügen
const axiosInstance = axios.create({
    headers: {
    'Connection': 'keep-alive'  // Keep-Alive Header hinzufügen
  }
});

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
    const duration = Date.now() - response.config.metadata.startTime;
    const url = `${response.config.method} ${response.config.url}`;
    console.log(`Response time: ${duration} ms for ${url}`);
    response.duration = duration;
    
    return response;
}, error => {
    return Promise.reject(error);
});

module.exports = axiosInstance;