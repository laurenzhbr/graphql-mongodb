const axiosInstance = require('../../utils/interceptors');

const query = () => `
	mutation {
    deleteInactiveResources(status: "inactive", limit: 10)
  }
`;

const gql_use_case_9 =  async (id) => {
    const res = await axiosInstance.post('http://localhost:4000/graphql', {
        query: query(),
    });

    return {'request_times': res.duration}
}

module.exports = {gql_use_case_9};
