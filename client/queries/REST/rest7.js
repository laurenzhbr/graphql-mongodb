const { fetchMetrics } = require('../../utils/prepare_metrics');


const rest_use_case_7 = async () => {
    const transaction_start = null;
    const actualHost = process.env.HOST || 'localhost:4000';
    let accumulatedMetrics = {};

    
    const dataForUpdate = {
        "description": "Create Test Router for REST",
        "category": "Router",
        "endOperatingDate": "2030-12-31T23:59:59Z",
        "name": "Router Update REST X1000",
        "administrativeState": "unlocked",
        "operationalState": "enable",
        "resourceStatus": "available",
        "usageState": "active",
        "startOperatingDate": "2022-01-01T00:00:00Z",
        "version": "1.0",
        "resourceCharacteristic": [
          {
            "name": "connection_type",
            "value": "Ethernet",
            "valueType": "String"
          },
          {
            "name": "router_type",
            "value": "Virtual Router",
            "valueType": "String"
          }
        ],
        "note": [
          {
            "author": "Admin",
            "date": "2024-09-10T12:34:56Z",
            "text": "Initial configuration"
          }
        ],
        "place": {
          "id": "66f7de4878e947f6ef1bffa1"
        },
        "resourceRelationship": [
          {
            "relationshipType": "isTargeted",
            "resource": {
              "id": "66f7de63b43b5a54073ff454",
              "name": "Modem Untereisesheim 8"
            }
          }
        ],
        "relatedParties": [
          {
            "id": "66f7de5a9c9c5bcf84326a1e",
            "name": "Bohge Gruppe Manufacturing",
            "role": "Gerätehersteller"
          }
        ]
      }

    // 3. Sende PATCH-Anfrage mit den Daten, die aktualisiert werden sollen
    const postUrl = `http://${actualHost}/resourceInventoryManagement/resource`;
    accumulatedMetrics = await fetchMetrics(postUrl, accumulatedMetrics, "post", dataForUpdate);
    
    const total_transaction_time = transaction_start != null ? (Date.now() - transaction_start) : 0;
    accumulatedMetrics.total_transaction_time = total_transaction_time;
   
    // parse performance tracing results
    return accumulatedMetrics;
};


module.exports = { rest_use_case_7 };
