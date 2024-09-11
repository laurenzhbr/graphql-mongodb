const axios = require('axios');

// Erstelle eine Instanz von Axios, um Interceptors hinzuzufügen
const axiosInstance = axios.create({
    headers: {
    'Connection': 'keep-alive'  // Keep-Alive Header hinzufügen
  }
});

// Konverter für Byte-Einheiten
const convertBytes = (bytes) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return '0 Byte';
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)), 10);
    return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
  };

// Füge einen Request Interceptor hinzu
axiosInstance.interceptors.request.use(config => {
    // Füge einen Timestamp hinzu, wenn die Anfrage gesendet wird
    config.metadata = { startTime: Date.now() };

     // Berechne die Größe der gesendeten Daten (Request-Body)
    let requestDataSize = 0;
    if (config.data) {
        requestDataSize = JSON.stringify(config.data).length;
    }

    // Füge die Request-Datengröße in Bytes zur Metadaten hinzu
    config.metadata.requestDataSize = requestDataSize;
    console.log(`Request Data Size: ${convertBytes(requestDataSize)}`);

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

    // Berechne die Größe der empfangenen Daten
    let responseDataSize = 0;
    if (response.headers['content-length']) {
        // Falls der Server den Content-Length-Header bereitstellt
        responseDataSize = parseInt(response.headers['content-length'], 10);
    } else if (response.data) {
        // Falls kein Content-Length-Header vorhanden ist, berechne die Größe des Response-Bodys
        responseDataSize = JSON.stringify(response.data).length;
    }

    // console.log(`Response Data Size: ${convertBytes(responseDataSize)}`);

    // Gesamtgröße des Datentransfers
    const totalDataTransferred = response.config.metadata.requestDataSize + responseDataSize;
    // console.log(`Total Data Transferred: ${convertBytes(totalDataTransferred)}`);
    
    response.responseTime = duration;
    response.totalDataTransferred = totalDataTransferred;
  
    
    return response;
}, error => {
    return Promise.reject(error);
});

module.exports = axiosInstance;