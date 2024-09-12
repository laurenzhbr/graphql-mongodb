const { fetchMetrics } = require('../../utils/prepare_metrics');

const query = (id) => `
	{
    resource(id: "${id}") {
      name
      relatedParties {
        name
        organizationType
        status
      }
      place{
        country
        stateOrProvince
        postcode
        streetName
        streetNr
      }
    }
  }
`;

const gql_use_case_6 =  async () => {
  const transaction_start = null;
  //const actualHost = process.env.HOST || 'localhost:4000';
  let accumulatedMetrics = {};

  // send API Call + fetch metrics
  const url = 'http://localhost:4000/graphql'
  const data = { query: query("66e301dfd4e340e8e8f51322"),};

  accumulatedMetrics = await fetchMetrics(url, accumulatedMetrics, "post", data);

  const total_transaction_time = transaction_start != null ? (Date.now() - transaction_start) : 0;
  accumulatedMetrics.total_transaction_time = total_transaction_time;
  return accumulatedMetrics
}

module.exports = {gql_use_case_6};
