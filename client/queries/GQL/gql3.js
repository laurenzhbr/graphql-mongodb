const { fetchMetrics } = require('../../utils/prepare_metrics');

const query = (organizationType, status, creditRating_gt, sort, limit) => `
	{
    organizations(organizationType: "${organizationType}", status: "${status}", creditRating_gt: ${creditRating_gt}, sort: "${sort}", limit: ${limit}) {
      name
      organizationType
      creditRating {
        ratingScore
      }
    }
  }
`;

const gql_use_case_3 =  async () => {
  const transaction_start = null;
  const actualHost = process.env.HOST || 'localhost:4000';
  let accumulatedMetrics = {};

  // send API Call + fetch metrics
  const url = `http://${actualHost}/graphql`
  const data = { query: query("Marketing- und Vertriebspartner", "validated", 750, "-creditRating.ratingScore", 10)};

  accumulatedMetrics = await fetchMetrics(url, accumulatedMetrics, "post", data);

  const total_transaction_time = transaction_start != null ? (Date.now() - transaction_start) : 0;
  accumulatedMetrics.total_transaction_time = total_transaction_time;
  return accumulatedMetrics

}

module.exports = {gql_use_case_3};
