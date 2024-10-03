const { fetchMetrics } = require('../../utils/prepare_metrics');
const {faker} = require('@faker-js/faker/locale/de');

const rest_use_case_6 = async (digi_id = "66f7e21acfa2a96703f22d48", resource_name="Router for Modem Hüfingen" ) => {
    const transaction_start = null;
    const actualHost = process.env.HOST || 'localhost:4000';
    let accumulatedMetrics = {};

    // 1. Update-Daten mit den Details des zufälligen Routers füllen
    updateData = {
        "resourceIdentified": {
            id: faker.database.mongodbObjectId(),
            name: `Router ${faker.number.int({ min: 0, max: 20 })} ${resource_name} ${faker.number.int({ min: 0, max: 20 }).toString()}`
        }
    };

    // 2. Sende PATCH-Anfrage mit den Daten, die aktualisiert werden sollen
    const url = `http://${actualHost}/digitalIdentityManagement/digitalIdentity/${digi_id}`;
    accumulatedMetrics = await fetchMetrics(url, accumulatedMetrics, "patch", updateData);
    
    const total_transaction_time = transaction_start != null ? (Date.now() - transaction_start) : 0;
    accumulatedMetrics.total_transaction_time = total_transaction_time;
   
    // parse performance tracing results
    return accumulatedMetrics;
};


module.exports = { rest_use_case_6 };
