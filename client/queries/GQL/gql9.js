const { fetchMetrics } = require('../../utils/prepare_metrics');

const query = () => `
	mutation {
    createResource(input: {
      description: "Create Test Router for GQL",
      category: "Router",
      endOperatingDate: "2030-12-31T23:59:59Z",
      name: "Router Update GQL X1000",
      administrativeState: unlocked,
      operationalState: enable,
      resourceStatus: available,
      usageState: active,
      startOperatingDate: "2022-01-01T00:00:00Z",
      version: "1.0",
      resourceCharacteristic: [
        { name: "connection_type", value: "Ethernet", valueType: "String" },
        { name: "router_type", value: "Virtual Router", valueType: "String" }
      ],
      note: [
        { author: "Admin", date: "2024-09-10T12:34:56Z", text: "Initial configuration" }
      ],
      place: {
        id: "66f7de4878e947f6ef1bff76",
      },
      resourceRelationship: [
        { 
          relationshipType: "isTargeted", 
          resource: {
            id: "66f7de62b43b5a54073fef35",
            name: "Modem Langenau 14"
          }
        }
      ],
      relatedParties: [
            {
              id: "66f7de5a9c9c5bcf84326a1e",
              name: "Bohge Gruppe Manufacturing",
              role: "Gerätehersteller",
            }
        ],
    }) {
      id
      name
      category
      description
      resourceCharacteristic {
        name
        value
      }
      resourceRelationship {
        relationshipType
        resource {
          id
          name
        }
      }
      note {
        author
        text
        date
      }
      place {
        id
        country
      }
    }
  }

`;

const gql_use_case_9 =  async () => {
  const transaction_start = null;
  const actualHost = process.env.HOST || 'localhost:4000';
  let accumulatedMetrics = {};

  // send API Call + fetch metrics
  const url = `http://${actualHost}/graphql`
  const data = { query: query()};

  accumulatedMetrics = await fetchMetrics(url, accumulatedMetrics, "post", data);

  const total_transaction_time = transaction_start != null ? (Date.now() - transaction_start) : 0;
  accumulatedMetrics.total_transaction_time = total_transaction_time;
  return accumulatedMetrics
}

module.exports = {gql_use_case_9};
