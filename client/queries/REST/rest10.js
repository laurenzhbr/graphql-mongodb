const axiosInstance = require('../../utils/interceptors');


const rest_use_case_8 = async (status="supsended") => {
    const transaction_start = Date.now()
    let request_counter = 0; 
    const actualHost = process.env.HOST || 'localhost:4000';
    let total_duration = 0;

    const digiIdUrl = `http://${actualHost}//digitalIdentityManagement/digitalIdentity?status=${status}&limit=10`
    const supsendedDigiIds = await axiosInstance.get(digiIdUrl);
    total_duration += supsendedDigiIds.duration;
    request_counter++;
    
    for (entry in supsendedDigiIds) {
        const id_digiId = entry._id;
        const deletedDigiId = await axiosInstance.delete(`http://${actualHost}//digitalIdentityManagement/digitalIdentity/${id_digiId}`);
        total_duration += deletedDigiId.duration;
        request_counter++;
    }

    total_transaction_time = Date.now() - transaction_start;
    const measurements = {'request_times': total_duration, 'total_transaction_time': total_transaction_time, 'request_counter': request_counter}
    return measurements
};


module.exports = { rest_use_case_8 };
