const axiosInstance = require('../../utils/interceptors');

const query = () => `
	{
    organizations(organizationType: "Marketing- und Vertriebspartner", status: "validated", creditRating_gt: 750, sortBy: "desc") {
      name
      organizationType
      creditRating {
        ratingScore
        creditAgencyName
      }
    }
  }
`;

const gql_use_case_4 =  async () => {
    const res = await axiosInstance.post('http://localhost:4000/graphql', {
        query: query(),
    });

    return {'request_times': res.duration}
}

module.exports = {gql_use_case_4};
