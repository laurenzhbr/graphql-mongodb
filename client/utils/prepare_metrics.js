
/* const prepareMetrics = (response_data, sum_response_time, total_transaction_time=0, api_call_count=1, cpu, memory) => {
    
    const finalMetrics = {
        'res_data': response_data, // response data
        'sum_response_time': sum_response_time, // accumulated all response times of all api calls
        'total_transaction_time': total_transaction_time, // total time needed for executing whole use case
        'api_call_count': api_call_count, // amount of API calls made
        'cpu_used_by_server': cpu, // cpu usage of server
        'memory_used_by_server': memory // memory usage of server (heap Used)
    }

    return finalMetrics;
}

module.exports = {prepareMetrics}; */

// utils/metrics.js
const axiosInstance = require('./interceptors');

// Funktion zum Abrufen der Metriken und zum Hinzufügen zu den bestehenden Metriken
const fetchMetrics = async (url, previousMetrics = {}, method="get", data=null,) => {
    try {
        let res;
        // Wähle die entsprechende HTTP-Methode basierend auf dem Parameter
        if (method.toLowerCase() === 'get') {
            res = await axiosInstance.get(url);
        } else if (method.toLowerCase() === 'post') {
            res = await axiosInstance.post(url, data);
        } else if (method.toLowerCase() === 'patch') {
            res = await axiosInstance.patch(url, data);
        } else if (method.toLowerCase() === 'delete') {
            res = await axiosInstance.delete(url);
        } else {
            throw new Error(`Unsupported HTTP method: ${method}`);
        }

        // Tracing und Performance-Metriken
        const cpuUsage = parseFloat(JSON.parse(res.headers['x-cpu-usage']));
        const memoryUsage = parseFloat(JSON.parse(res.headers['x-memory-usage']));
        const responseTime = res.responseTime;
        const total_data_transferred = res.totalDataTransferred;

        // Falls vorherige Metriken existieren, summiere die neuen Metriken hinzu
        const accumulatedMetrics = {
            data: res.data,
            duration_of_all_calls: (previousMetrics.duration_of_all_calls || 0) + responseTime,
            total_data_transferred: (previousMetrics.total_data_transferred || 0) + total_data_transferred,
            api_call_count: (previousMetrics.api_call_count || 0) + 1,
            cpu_used_by_server: (previousMetrics.cpu_used_by_server?.user || 0) + cpuUsage,
            memory_used_by_server: (previousMetrics.memory_used_by_server?.heapUsed || 0) + memoryUsage
        };

        return accumulatedMetrics;
    } catch (error) {
        console.error('Error fetching metrics:', error);
        throw error;
    }
};

module.exports = { fetchMetrics };
