const { fetchMetrics } = require('../../utils/prepare_metrics');

const rest_use_case_3 = async (id="66f7e21acfa2a96703f22c5e") => {
    const transaction_start = Date.now();
    const actualHost = process.env.HOST || 'localhost:4000';
    let accumulatedMetrics = {};

    const url = `http://${actualHost}/digitalIdentityManagement/digitalIdentity/${id}`
    accumulatedMetrics = await fetchMetrics(url, accumulatedMetrics);

    // get router information
    const href_resourceIdentified = accumulatedMetrics.data.resourceIdentified.href.replace("{host}", actualHost)
    accumulatedMetrics = await fetchMetrics(href_resourceIdentified, accumulatedMetrics);

    // get href to related modem
    resourceRelationshipsRouter = accumulatedMetrics.data.resourceRelationship;
    const relatedModem = resourceRelationshipsRouter.find(modem => modem.relationshipType === "isTargeted");
    
    // get information from related modem
    const href_resource_modem = relatedModem.resource.href.replace("{host}", actualHost)
    accumulatedMetrics = await fetchMetrics(href_resource_modem, accumulatedMetrics);

    // get href to related modem
    resourceRelationshipsModem = accumulatedMetrics.data.resourceRelationship;
    const relatedStreetCabinet = resourceRelationshipsModem.find(modem => modem.relationshipType === "isTargeted");
    
    // get information from related modem
    const href_resource_street_cabinet = relatedStreetCabinet.resource.href.replace("{host}", actualHost)

    accumulatedMetrics = await fetchMetrics(href_resource_street_cabinet, accumulatedMetrics); 

    // get href to related modem
    resourceRelationshipsStreetCabinet = accumulatedMetrics.data.resourceRelationship;
    const relatedCentralOffice = resourceRelationshipsStreetCabinet.find(modem => modem.relationshipType === "isTargeted");
    
    // get information from related modem
    const href_resource_central_office = relatedCentralOffice.resource.href.replace("{host}", actualHost)
    
    accumulatedMetrics = await fetchMetrics(`${href_resource_central_office}?fields=resourceStatus,name`, accumulatedMetrics);
    

    const total_transaction_time = transaction_start != null ? (Date.now() - transaction_start) : 0;
    accumulatedMetrics.total_transaction_time = total_transaction_time;
   
    // parse performance tracing results
    return accumulatedMetrics;
};

module.exports = { rest_use_case_3 };