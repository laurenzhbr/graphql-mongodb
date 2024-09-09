const axiosInstance = require('../../utils/interceptors');

const query = (status) => `
  {
    digitalIdentitiesByStatus(status: "active"){
      nickname
      creationDate
    }
  }
`;

const gql_use_case_1 =  async (id) => {
    const res = await axiosInstance.post('http://localhost:4000/graphql', {
        query: query("active"),
    });

    return res.duration
}

module.exports = {gql_use_case_1};
