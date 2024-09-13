const { fetchMetrics } = require('../../utils/prepare_metrics');
const {faker} = require('@faker-js/faker/locale/de');

const rest_use_case_8 = async (digi_id = "66e4207b1c97fe16e772f57c", resource_name="Router for Modem Hüfingen" ) => {
    const transaction_start = null;
    const actualHost = process.env.HOST || 'localhost:4000';
    let accumulatedMetrics = {};

    /* const resourceUrl = `http://${actualHost}/resourceInventoryManagement/resource?category=Router`
    const resource = await axiosInstance.get(resourceUrl);
    const resources = resource.data
    routerForUpdate = resources[Math.floor(Math.random()*resource.data.length)]; */
    
    // 1. Update-Daten mit den Details des zufälligen Routers füllen
    updateData = {
        "resourceIdentified": {
            id: faker.database.mongodbObjectId(),
            name: `${resource_name} ${faker.number.int({ min: 0, max: 20 }).toString()} ${faker.number.int({ min: 0, max: 20 }).toString()}`
        }
    };

    // 3. Sende PATCH-Anfrage mit den Daten, die aktualisiert werden sollen
    const url = `http://${actualHost}/digitalIdentityManagement/digitalIdentity/${digi_id}`;
    accumulatedMetrics = await fetchMetrics(url, accumulatedMetrics, "patch", updateData);
    
    const total_transaction_time = transaction_start != null ? (Date.now() - transaction_start) : 0;
    accumulatedMetrics.total_transaction_time = total_transaction_time;
   
    // parse performance tracing results
    return accumulatedMetrics;
};


module.exports = { rest_use_case_8 };
