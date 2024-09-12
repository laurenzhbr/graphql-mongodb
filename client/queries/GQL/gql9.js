const { fetchMetrics } = require('../../utils/prepare_metrics');

const query = () => `
	mutation {
    createResource(input: {
      category: "Router",
      endOperatingDate: "2025-08-12T10:44:10.863Z",
      name: "Router for Modem Hüfingen 0 0",
      resourceCharacteristic: [
        {
          name: "router_type",
          valueType: "String",
          value: "Edge Router"
        },
        {
          name: "max_download_speed",
          valueType: "String",
          value: "1.4073629742488265Gbps"
        },
        {
          name: "max_upload_speed",
          valueType: "String",
          value: "265Mbps"
        },
        {
          name: "connection_type",
          valueType: "String",
          value: "Satellite"
        },
        {
          name: "ethernet_ports",
          valueType: "Number",
          value: "4"
        },
        {
          name: "usb_ports",
          valueType: "Number",
          value: "1"
        },
        {
          name: "coaxial_input",
          valueType: "Boolean",
          value: "true"
        },
        {
          name: "wifi_capability",
          valueType: "String",
          value: "Wi-Fi 6 (802.11ax)"
        },
        {
          name: "power_consumption",
          valueType: "String",
          value: "12W"
        },
        {
          name: "security_features",
          valueType: "String",
          value: "WPA3, AES Encryption, DNS Filtering"
        },
        {
          name: "last_maintenance",
          valueType: "Date-Time",
          value: "2022-04-09T07:02:38.086Z"
        },
        {
          name: "processor",
          valueType: "String",
          value: "Intel Atom C3338, 1.5 GHz"
        },
        {
          name: "memory",
          valueType: "String",
          value: "4GB LPDDR4"
        },
        {
          name: "storage",
          valueType: "String",
          value: "1GB SSD"
        }
      ],
      administrativeState: unlocked,
      operationalState: disable,
      relatedParties: [
        {
          id: "66db3aa516d68c5f3c138b53",
          name: "Walsh LLC Manufacturing",
          role: "Gerätehersteller",
        }
      ],
      note: [
        {
          author: "Marisa Knoll",
          date: "2023-11-18T06:54:47.785Z",
          text: "Firmware update applied successfully; system stability improved."
        }
      ],
      place: {
        id: "66db17e94e5b0dd1a4758935",
      },
      resourceRelationship: [
        {
          relationshipType: "isTargeted",
          resource: {
            id: "66db6d63658d40350e57e43f",
            name: "Modem Hüfingen 0"
          }
        }
      ],
      resourceStatus: available,
      usageState: idle,
      startOperatingDate: "2008-01-29T22:25:19.167Z",
      version: "4",
    }) {
      id
      category
      endOperatingDate
      name
      resourceCharacteristic {
        name
        valueType
        value
      }
      administrativeState
      operationalState
      relatedParties {
        id
        name
        organizationType
      }
      note {
        author
        date
        text
      }
      place {
        id
      }
      resourceRelationship {
        relationshipType
        resource {
          id
          name
        }
      }
      resourceStatus
      usageState
      startOperatingDate
      version
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
