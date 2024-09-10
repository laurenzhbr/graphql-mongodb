const axiosInstance = require('../../utils/interceptors');

const query = () => `
	mutation {
    updateDigitalIdentity(id: "66db7b5fbbe1351f628ed5e7", data: {
      nickname: "NewNickname",
      status: "active",
      resourceIdentified: {
        id: "66cae3e2d6434ed77a229b79",
        name: "iPhone handy",
      }
    }) {
      nickname
      status
      resource {
        id
        name
      }
    }
  }
`;

const gql_use_case_8 =  async (id) => {
    const res = await axiosInstance.post('http://localhost:4000/graphql', {
        query: query(),
    });

    return {'request_times': res.duration}
}

module.exports = {gql_use_case_8};
