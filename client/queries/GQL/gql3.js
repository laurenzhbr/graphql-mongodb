const { fetchMetrics } = require('../../utils/prepare_metrics');
const query = (id) => `
  {
	digitalIdentity(id: "${id}") {
		nickname
		resource{
			id
			name
			category
			resourceRelationship(relationshipType: "isTargeted"){
				resource{
					name
					category
					resourceRelationship(relationshipType: "isTargeted"){
						resource{
							name
							category
							resourceRelationship(relationshipType: "isTargeted"){
								resource{
									name
									resourceStatus
								}
							}
						}
					}
				}
			}
		}
	}
	}
`;

const gql_use_case_3 =  async (id) => {
  const transaction_start = null;
  //const actualHost = process.env.HOST || 'localhost:4000';
  let accumulatedMetrics = {};

  // send API Call + fetch metrics
  const url = 'http://localhost:4000/graphql'
  const data = { query: query("66db7b5fbbe1351f628ed611")};

  accumulatedMetrics = await fetchMetrics(url, accumulatedMetrics, "post", data);

  const total_transaction_time = transaction_start != null ? (Date.now() - transaction_start) : 0;
  accumulatedMetrics.total_transaction_time = total_transaction_time;
  return accumulatedMetrics
	
}

module.exports = {gql_use_case_3};
