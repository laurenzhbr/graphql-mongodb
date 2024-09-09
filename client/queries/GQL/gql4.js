const axiosInstance = require('../../utils/interceptors');

const query = (status) => `
	{
    resourcesByCategoryAndCity(category: "Street Cabinet", city: "Berlin") {
      name
      category
      resourceCharacteristic(names: ["connected_lines", "maximum_capacity", "power_backup"]){
        name
        value
      }
      relatedParties {
        organizationType
        name
      }
      place {
        id
        city
        country
      }
    }
  }
`;

const gql_use_case_4 =  async (id) => {
    const res = await axiosInstance.post('http://localhost:4000/graphql', {
        query: query("active"),
    });

    return {'request_times': res.duration}
}

module.exports = {gql_use_case_4};
