const { fetchMetrics } = require('../../utils/prepare_metrics');

const query = (status, limit, sortBy) => `
  {
    digitalIdentities(status: "${status}", limit: ${limit}, sort: "${sortBy}" ){
      id
      nickname
      status
      creationDate
      lastUpdate
    } 
  }
`;

const gql_use_case_1 =  async () => {
  const transaction_start = null;
  const actualHost = process.env.HOST || 'localhost:4000';
  let accumulatedMetrics = {};

  const url = `http://${actualHost}/graphql`
  //build GQL-query string + send api call
  const data = { query: query("active", 10000, "-creationDate"),};
  accumulatedMetrics = await fetchMetrics(url, accumulatedMetrics, "post", data);

  const total_transaction_time = transaction_start != null ? (Date.now() - transaction_start) : 0;
  accumulatedMetrics.total_transaction_time = total_transaction_time;
  return accumulatedMetrics
}


module.exports = {gql_use_case_1};
