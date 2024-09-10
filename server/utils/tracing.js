const getMemoryUsage = () => {
    const memoryUsage = process.memoryUsage();
    
    return {
      rss: (memoryUsage.rss / 1024 / 1024).toFixed(2) + ' MB',
      heapTotal: (memoryUsage.heapTotal / 1024 / 1024).toFixed(2) + ' MB',
      heapUsed: (memoryUsage.heapUsed / 1024 / 1024).toFixed(2) + ' MB',
      external: (memoryUsage.external / 1024 / 1024).toFixed(2) + ' MB',
    };
  };
  
const getCpuUsage = () => {
    const cpuUsage = process.cpuUsage();

    return {
        user: (cpuUsage.user / 1000).toFixed(2) + ' ms',
        system: (cpuUsage.system / 1000).toFixed(2) + ' ms'
    };
};

module.exports = {getMemoryUsage, getCpuUsage};