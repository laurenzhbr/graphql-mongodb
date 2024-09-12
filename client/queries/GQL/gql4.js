const { fetchMetrics } = require('../../utils/prepare_metrics');

const query = (category, city, characteristics) => `
	{
    resourcesByCategoryAndCity(category: "${category}", city: "${city}") {
      name
      category
      resourceCharacteristic(names: ["${characteristics.join('", "')}"]){
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

const gql_use_case_4 =  async () => {
  const transaction_start = null;
  //const actualHost = process.env.HOST || 'localhost:4000';
  let accumulatedMetrics = {};

  // send API Call + fetch metrics
  const url = 'http://localhost:4000/graphql'
  const data = { query: query("Steet Cabinet", "Berlin", ["connected_lines", "maximum_capacity", "power_backup"])};

  accumulatedMetrics = await fetchMetrics(url, accumulatedMetrics, "post", data);

  const total_transaction_time = transaction_start != null ? (Date.now() - transaction_start) : 0;
  accumulatedMetrics.total_transaction_time = total_transaction_time;
  return accumulatedMetrics
}

module.exports = {gql_use_case_4};
