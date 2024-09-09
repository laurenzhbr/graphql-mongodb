

const axiosInstance = require('../../utils/interceptors');

const rest_use_case_1 = async (id) => {
    const actualHost = process.env.HOST || 'localhost:4000';
    const url = `http://${actualHost}/digitalIdentityManagement/digitalIdentity?status=active`
    const res = await axiosInstance.get(url);

    return {'request_times': res.duration}
};


module.exports = { rest_use_case_1 };
