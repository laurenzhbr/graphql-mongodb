const { fetchMetrics } = require('../../utils/prepare_metrics');

const query = () => `
	mutation {
    createResource(input: {
      description: "Neue Resource Beschreibung",
      category: "Router",
      value: "1234",
      endOperatingDate: "2030-12-31T23:59:59Z",
      name: "Router X1000",
      administrativeState: unlocked,
      operationalState: enable,
      resourceStatus: available,
      usageState: active,
      startOperatingDate: "2022-01-01T00:00:00Z",
      version: "1.0",
      resourceCharacteristic: [
        { name: "max_download_speed", value: "1 Gbps", valueType: "String" },
        { name: "max_upload_speed", value: "100 Mbps", valueType: "String" }
      ],
      note: [
        { author: "Admin", date: "2024-09-10T12:34:56Z", text: "Initial configuration" }
      ],
      place: {
        id: "66e2c81f65afefb37d2bed73",
        name: "Berlin"
      },
      resourceRelationship: [
        { 
          relationshipType: "targets", 
          resource: {
            id: "66e301dfd4e340e8e8f51322",
            name: "Router for Modem Burladingen 0 0"
          }
        }
      ],
      relatedParties: [
            {
                id: "66e2c8efa4a4ceda4e6d9087",
                name: "Schütze, Hamann und Riester Technik & Innovation GmbH",
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
  //const actualHost = process.env.HOST || 'localhost:4000';
  let accumulatedMetrics = {};

  // send API Call + fetch metrics
  const url = 'http://localhost:4000/graphql'
  const data = { query: query()};

  accumulatedMetrics = await fetchMetrics(url, accumulatedMetrics, "post", data);

  const total_transaction_time = transaction_start != null ? (Date.now() - transaction_start) : 0;
  accumulatedMetrics.total_transaction_time = total_transaction_time;
  return accumulatedMetrics
}

module.exports = {gql_use_case_9};
