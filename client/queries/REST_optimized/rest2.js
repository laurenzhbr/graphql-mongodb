const { fetchMetrics } = require('../../utils/prepare_metrics');

const rest_use_case_2_opt = async (id="66f7e10305b9728c48875c62") => {
    const transaction_start = Date.now();
    const actualHost = process.env.HOST || 'localhost:4000';
    let accumulatedMetrics = {};

    const url = `http://${actualHost}/resourceInventoryManagement/resource/${id}`
    accumulatedMetrics = await fetchMetrics(url, accumulatedMetrics);

    // get href to related modem
    resourceRelationshipsRouter = accumulatedMetrics.data.resourceRelationship;
    const relatedModem = resourceRelationshipsRouter.find(modem => modem.relationshipType === "isTargeted");
    
    // get information from related modem
    const href_resource_modem = `${relatedModem.resource.href.replace("{host}", actualHost)}?fields=resourceRelationship`
    accumulatedMetrics = await fetchMetrics(href_resource_modem, accumulatedMetrics);

    // get href to related modem
    resourceRelationshipsModem = accumulatedMetrics.data.resourceRelationship;
    const relatedStreetCabinet = resourceRelationshipsModem.find(modem => modem.relationshipType === "isTargeted");
    
    // get information from related modem
    const href_resource_street_cabinet = `${relatedStreetCabinet.resource.href.replace("{host}", actualHost)}?fields=resourceRelationship`

    accumulatedMetrics = await fetchMetrics(href_resource_street_cabinet, accumulatedMetrics); 

    // get href to related modem
    resourceRelationshipsStreetCabinet = accumulatedMetrics.data.resourceRelationship;
    const relatedCentralOffice = resourceRelationshipsStreetCabinet.find(modem => modem.relationshipType === "isTargeted");
    
    // get information from related modem
    const href_resource_central_office = `${relatedCentralOffice.resource.href.replace("{host}", actualHost)}?fields=name,resourceStatus`
    
    accumulatedMetrics = await fetchMetrics(`${href_resource_central_office}`, accumulatedMetrics);
    

    const total_transaction_time = transaction_start != null ? (Date.now() - transaction_start) : 0;
    accumulatedMetrics.total_transaction_time = total_transaction_time;
   
    // parse performance tracing results
    return accumulatedMetrics;
};

module.exports = { rest_use_case_2_opt };