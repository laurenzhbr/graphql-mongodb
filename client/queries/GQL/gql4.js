const { fetchMetrics } = require('../../utils/prepare_metrics');

const query = (category, city, characteristics) => `
	{
    searchResourcesInCity(category: "${category}", city: "${city}") {
      name
      resourceCharacteristic{
        name
        value
      }
      relatedParties {
        id
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

const gql_use_case_4 =  async () => {
  const transaction_start = null;
  const actualHost = process.env.HOST || 'localhost:4000';
  let accumulatedMetrics = {};

  // send API Call + fetch metrics
  const url = `http://${actualHost}/graphql`
  const data = { query: query("Street Cabinet", "Leipzig", ["connected_lines", "maximum_capacity", "power_backup"])};

  accumulatedMetrics = await fetchMetrics(url, accumulatedMetrics, "post", data);

  const total_transaction_time = transaction_start != null ? (Date.now() - transaction_start) : 0;
  accumulatedMetrics.total_transaction_time = total_transaction_time;
  return accumulatedMetrics
}

module.exports = {gql_use_case_4};
