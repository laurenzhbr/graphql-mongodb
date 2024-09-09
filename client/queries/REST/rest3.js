const axiosInstance = require('../../utils/interceptors');

const rest_use_case_3 = async (id) => {
    let total_duration = 0;
    const actualHost = process.env.HOST || 'localhost:4000';

    const url = `http://${actualHost}/digitalIdentityManagement/digitalIdentity/${id}`
    const res1 = await axiosInstance.get(url);
    total_duration += res1.duration;

    // get router information
    const href_resourceIdentified = res1.data.resourceIdentified.href
                                            .replace("{host}", actualHost)
                                            .replace("https", "http")
    const res2 = await axiosInstance.get(href_resourceIdentified);
    total_duration += res2.duration;

    // get href to related modem
    resourceRelationshipsRouter = res2.data.resourceRelationship;
    const relatedModem = resourceRelationshipsRouter.find(modem => modem.relationshipType === "isTargeted");
    
    // get information from related modem
    const href_resource_modem = relatedModem.resource.href
                                            .replace("{host}", actualHost)
                                            .replace("https", "http")
    const res3 = await axiosInstance.get(href_resource_modem);
    total_duration += res3.duration;

    // get href to related modem
    resourceRelationshipsModem = res3.data.resourceRelationship;
    const relatedStreetCabinet = resourceRelationshipsModem.find(modem => modem.relationshipType === "isTargeted");
    
    // get information from related modem
    const href_resource_street_cabinet = relatedStreetCabinet.resource.href
                                            .replace("{host}", actualHost)
                                            .replace("https", "http")
    const res4 = await axiosInstance.get(href_resource_street_cabinet);
    total_duration += res4.duration;

    // get href to related modem
    resourceRelationshipsStreetCabinet = res4.data.resourceRelationship;
    const relatedCentralOffice = resourceRelationshipsStreetCabinet.find(modem => modem.relationshipType === "isTargeted");
    
    // get information from related modem
    const href_resource_central_office = relatedCentralOffice.resource.href
                                            .replace("{host}", actualHost)
                                            .replace("https", "http")
    
    const res5 = await axiosInstance.get(`${href_resource_central_office}?fields=resourceStatus,name`);
    total_duration += res5.duration;
    
    res5.duration = total_duration;
    return res5.duration
};

module.exports = { rest_use_case_3 };
