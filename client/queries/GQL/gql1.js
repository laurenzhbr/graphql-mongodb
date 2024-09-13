const { fetchMetrics } = require('../../utils/prepare_metrics');

const query = (status, limit, sortBy) => `
  {
    digitalIdentitiesByStatus(status: "${status}", limit: ${limit}, sortBy: "${sortBy}" ){
      id
      nickname
      status
      resourceIdentified{
        id
        name
      }
      creationDate
      lastUpdate
    } 
  }
`;

const gql_use_case_1 =  async () => {
  const transaction_start = null;
  //const actualHost = process.env.HOST || 'localhost:4000';
  let accumulatedMetrics = {};

  // send API Call + fetch metrics
  const url = 'http://localhost:4000/graphql'
  const data = { query: query("active", 40, "desc"),};

  accumulatedMetrics = await fetchMetrics(url, accumulatedMetrics, "post", data);

  const total_transaction_time = transaction_start != null ? (Date.now() - transaction_start) : 0;
  accumulatedMetrics.total_transaction_time = total_transaction_time;
  return accumulatedMetrics

}

module.exports = {gql_use_case_1};
