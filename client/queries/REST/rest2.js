

const axiosInstance = require('../../utils/interceptors');

const rest_use_case_2 = async (id) => {
    const actualHost = process.env.HOST || 'localhost:4000';
    const url = `http://${actualHost}/resourceInventoryManagement/resource?category=Street%20Cabinet&current_capacity_usage=95`
    const res = await axiosInstance.get(url);

    return res.duration
};



module.exports = { rest_use_case_2 };