const { fetchMetrics } = require('../../utils/prepare_metrics');
const {faker} = require('@faker-js/faker/locale/de');

const query = (digi_id, resource_name) => `
	mutation {
    updateDigitalIdentity(id: "${digi_id}", data: {
      resourceIdentified: {
        id: "${faker.database.mongodbObjectId()}",
        name: "Router ${faker.number.int({ min: 0, max: 20 })} ${resource_name} ${faker.number.int({ min: 0, max: 20 })}"
      }
    }) {
      nickname
      status
      resourceIdentified {
        id
        name
      }
    }
  }
`;

const gql_use_case_7 =  async () => {

  const transaction_start = null;
  const actualHost = process.env.HOST || 'localhost:4000';
  let accumulatedMetrics = {};

  // send API Call + fetch metrics
  const url = `http://${actualHost}/graphql`
  const data = { query: query("66f7e21acfa2a96703f22d24", "Router for Modem Neuental")};

  accumulatedMetrics = await fetchMetrics(url, accumulatedMetrics, "post", data);

  const total_transaction_time = transaction_start != null ? (Date.now() - transaction_start) : 0;
  accumulatedMetrics.total_transaction_time = total_transaction_time;
  return accumulatedMetrics
}

module.exports = {gql_use_case_7};
