const { fetchMetrics } = require('../../utils/prepare_metrics');

const query1 = (status, limit) => `
	{
    digitalIdentities(status: "${status}", limit: ${limit}){
      id
    }
  }
`;

const query2 = (id) => `
	mutation {
    deleteDigitalIdentity(id: "${id}") {
      success
      message
    }
  }
`;

const gql_use_case_8 =  async (id) => {
    const transaction_start = Date.now();
    const actualHost = process.env.HOST || 'localhost:4000';
    let accumulatedMetrics = {};
  
    // send API Call + fetch metrics
    const url = `http://${actualHost}/graphql`
    const data = { query: query1("suspended", 10),};
  
    accumulatedMetrics = await fetchMetrics(url, accumulatedMetrics, "post", data);

    for (entry of accumulatedMetrics.data.data.digitalIdentities){
      const data = { query: query2(entry.id),};
  
      accumulatedMetrics = await fetchMetrics(url, accumulatedMetrics, "post", data);
    }
  
    const total_transaction_time = transaction_start != null ? (Date.now() - transaction_start) : 0;
    accumulatedMetrics.total_transaction_time = total_transaction_time;
    return accumulatedMetrics
}

module.exports = {gql_use_case_8};
