const axiosInstance = require('../../utils/interceptors');

const query = (id) => `
  {
    digitalIdentity(id: "${id}") {
      id
      creationDate
      nickname
      status
      resource {
        id
        category
        place {
          country
          city
          postcode
          streetNr
        }
        relatedParties {
          id
          name
          organizationType
        }
        resourceSpecification {
          name
          version
        }
      }
    }
  }
`;

const gql_use_case_1 =  async (id) => {
    const res = await axiosInstance.post(`http://${actualHost}/graphql`, {
        query: query(id),
    });

    return res.duration
}

module.exports = {gql_use_case_1};
