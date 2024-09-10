const axiosInstance = require('../../utils/interceptors');

const query = (id) => `
	{
    {
      digitalIdentity(id: ${id}) {
        creationDate
        nickname
        status
        resource{
          id
          category
        place{
          country
          city
          postcode
          streetNr
        }
        relatedParties{
          name
          organizationType
        }
      }
    }
  }
`;

const gql_use_case_6 =  async (id) => {
    const res = await axiosInstance.post('http://localhost:4000/graphql', {
        query: query("66db76c734ed489b211cd3fd"),
    });

    return {'request_times': res.duration}
}

module.exports = {gql_use_case_6};
