const axiosInstance = require('../../utils/interceptors');

const query = (category, capacity_usage) => `
  {
    searchResourcesByCategoryAnCapacityUsage(category: ${category}, capacity: ${capacity_usage}){
      name
      category
      note{
        author
        text
      }
    }
  }
`;

const gql_use_case_2 =  async (id) => {
    const res = await axiosInstance.post('http://localhost:4000/graphql', {
        query: query("Street Cabinet", 95),
    });

    return res.duration
}

module.exports = {gql_use_case_2};
