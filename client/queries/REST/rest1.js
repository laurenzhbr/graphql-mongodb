

const axiosInstance = require('../../utils/interceptors');

const rest_use_case_1 = async (id) => {
    const actualHost = process.env.HOST || 'localhost:4000';
    let duration_of_all_calls = 0;
    let total_transaction_time = 0;
    const url = `http://${actualHost}/digitalIdentityManagement/digitalIdentity?status=active`
    const res = await axiosInstance.get(url);


    // parse performance tracing results
    const results = {res_data: res.data, 
        'duration_of_all_calls': res.response_time, 
        'total_transaction_time': total_transaction_time, 
        'api_call_count': 1,
        'cpu_used_by_server': JSON.parse(res.headers['x-cpu-usage']),
        'memory_used_by_server': JSON.parse(res.headers['x-memory-usage']),
    };
    return results;
};


module.exports = { rest_use_case_1 };
