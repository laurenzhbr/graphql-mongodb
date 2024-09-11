const { fetchMetrics } = require('../../utils/prepare_metrics');

const rest_use_case_2 = async () => {
    const transaction_start = null;
    const actualHost = process.env.HOST || 'localhost:4000';
    let accumulatedMetrics = {};

    const url = `http://${actualHost}/resourceInventoryManagement/resource?category=Street%20Cabinet&current_capacity_usage=95`
    accumulatedMetrics = await fetchMetrics(url, accumulatedMetrics);

    const total_transaction_time = transaction_start != null ? (Date.now() - transaction_start) : 0;
    accumulatedMetrics.total_transaction_time = total_transaction_time;
    // parse performance tracing results
    return accumulatedMetrics;
};

module.exports = { rest_use_case_2 };