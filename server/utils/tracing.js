const getMemoryUsage = () => {
    const memoryUsage = process.memoryUsage();
    
    return {
      heapUsed: (memoryUsage.heapUsed / 1024 / 1024).toFixed(2), // in MB
    };
  };
  
const getCpuUsage = () => {
    const cpuUsage = process.cpuUsage();

    return {
        user: (cpuUsage.user / 1000).toFixed(2), // in ms
    };
};

module.exports = {getMemoryUsage, getCpuUsage};