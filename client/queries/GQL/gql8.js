const { fetchMetrics } = require('../../utils/prepare_metrics');
const {faker} = require('@faker-js/faker/locale/de');

const query = (digi_id, resource_name) => `
	mutation {
    updateDigitalIdentity(id: "${digi_id}", data: {
      resourceIdentified: {
        id: "${faker.database.mongodbObjectId()}",
        name: "${resource_name} ${faker.number.int({ min: 0, max: 20 })} ${faker.number.int({ min: 0, max: 20 })}"
      }
    }) {
      nickname
      status
      resource {
        id
        name
      }
    }
  }
`;

const gql_use_case_8 =  async () => {

  const transaction_start = null;
  //const actualHost = process.env.HOST || 'localhost:4000';
  let accumulatedMetrics = {};

  // send API Call + fetch metrics
  const url = 'http://localhost:4000/graphql'
  const data = { query: query("66db7b5fbbe1351f628ed615", "Router for Modem Neuental")};

  accumulatedMetrics = await fetchMetrics(url, accumulatedMetrics, "post", data);

  const total_transaction_time = transaction_start != null ? (Date.now() - transaction_start) : 0;
  accumulatedMetrics.total_transaction_time = total_transaction_time;
  return accumulatedMetrics
}

module.exports = {gql_use_case_8};
