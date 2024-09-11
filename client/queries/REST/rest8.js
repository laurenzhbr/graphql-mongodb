const axiosInstance = require('../../utils/interceptors');


const rest_use_case_8 = async (digi_id = "66db7b5fbbe1351f628ed5e7", resource_id = "66db6d63658d40350e57e43f", resource_name="Router for Modem Hüfingen 0 0" ) => {
    const transaction_start = null;
    const actualHost = process.env.HOST || 'localhost:4000';
    let accumulatedMetrics = {};

    /* const resourceUrl = `http://${actualHost}/resourceInventoryManagement/resource?category=Router`
    const resource = await axiosInstance.get(resourceUrl);
    const resources = resource.data
    routerForUpdate = resources[Math.floor(Math.random()*resource.data.length)]; */
    
    // 1. Update-Daten mit den Details des zufälligen Routers füllen
    updateData.resourceIdentified = {
        id: resource_id,
        name: resource_name,
    };

    // 3. Sende PATCH-Anfrage mit den Daten, die aktualisiert werden sollen
    const patchUrl = `http://${actualHost}/digitalIdentityManagement/digitalIdentity/${id}`;
    accumulatedMetrics = await fetchMetrics(url, accumulatedMetrics, "patch", updateData);
    
    const total_transaction_time = transaction_start != null ? (Date.now() - transaction_start) : 0;
    accumulatedMetrics.total_transaction_time = total_transaction_time;
   
    // parse performance tracing results
    return accumulatedMetrics;
};


module.exports = { rest_use_case_8 };
