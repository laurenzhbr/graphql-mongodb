const { fetchMetrics } = require('../../utils/prepare_metrics');

const query = (category, resourceStatus, administrativeState, operationalState) => `
	{
  resourcesByCategoryAndStates(category: "${category}", resourceStatus: "${resourceStatus}", administrativeState: "${administrativeState}", operationalState: "${operationalState}") {
    id
    name
    resourceStatus
    administrativeState
    operationalState
  }
}
`;

const gql_use_case_7 =  async (id) => {
  const transaction_start = null;
  //const actualHost = process.env.HOST || 'localhost:4000';
  let accumulatedMetrics = {};

  // send API Call + fetch metrics
  const url = 'http://localhost:4000/graphql'
  const data = { query: query("Modem", "available", "unlocked", "enable")};

  accumulatedMetrics = await fetchMetrics(url, accumulatedMetrics, "post", data);

  const total_transaction_time = transaction_start != null ? (Date.now() - transaction_start) : 0;
  accumulatedMetrics.total_transaction_time = total_transaction_time;
  return accumulatedMetrics
}

module.exports = {gql_use_case_7};
