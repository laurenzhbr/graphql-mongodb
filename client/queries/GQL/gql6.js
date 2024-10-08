const { fetchMetrics } = require('../../utils/prepare_metrics');

const query = (id) => `
{
	digitalIdentity(id: "${id}") {
		resourceIdentified{
			name
			resourceStatus
			endOperatingDate
			relatedParties {
				id
				name
				organizationType
				status
			}
			place{
				id
				country
				stateOrProvince
				postcode
				streetName
				streetNr
			}
		}
  }
}
`;

const gql_use_case_6 =  async () => {
  const transaction_start = null;
  const actualHost = process.env.HOST || 'localhost:4000';
  let accumulatedMetrics = {};

  // send API Call + fetch metrics
  const url = `http://${actualHost}/graphql`
  const data = { query: query("66f7e21acfa2a96703f22d60"),};

  accumulatedMetrics = await fetchMetrics(url, accumulatedMetrics, "post", data);

  const total_transaction_time = transaction_start != null ? (Date.now() - transaction_start) : 0;
  accumulatedMetrics.total_transaction_time = total_transaction_time;
  return accumulatedMetrics
}

module.exports = {gql_use_case_6};
