const { fetchMetrics } = require('../../utils/prepare_metrics');

const rest_use_case_6 = async (id = "66e07529def2563e777ee8db") => {
    const transaction_start = Date.now();
    const actualHost = process.env.HOST || 'localhost:4000';
    let accumulatedMetrics = {};

    const resourceUrl = `http://${actualHost}/resourceInventoryManagement/resource/${id}`;
    accumulatedMetrics = await fetchMetrics(resourceUrl, accumulatedMetrics);
    const resourceData = accumulatedMetrics.data;

    // Sammle die RelatedParty IDs und die place href
    const relatedPartyHrefs = resourceData.relatedParty.map(party => party.href
        .replace("{host}", actualHost)
        .replace("https", "http"));
    const href_geoAdress = resourceData.place.href
        .replace("{host}", actualHost)
        .replace("https", "http");

    //GET Data from GeoAdress
    accumulatedMetrics = await fetchMetrics(href_geoAdress, accumulatedMetrics);

    // 2. Abfrage der Related Parties (Organization)
    const relatedPartyDetails = await Promise.all(
        relatedPartyHrefs.map(async (partyHref) => {
            const orgUrl = partyHref.replace("{host}", actualHost).replace("https", "http");
            accumulatedMetrics, orgResponse = await fetchMetrics(orgUrl, accumulatedMetrics);
            return {
                name: orgResponse.data.name,
                organizationType: orgResponse.data.organizationType,
                status: orgResponse.data.status,
            };
        })
    );

    /* const resourceSpecification = res1.data.resourceSpecification
    const href_resourceSpecification = resourceSpecification.href
        .replace("{host}", actualHost)
        .replace("https", "http");
    const res4 = await axiosInstance.get(href_resourceSpecification.replace("https", "http"));
    total_duration += res4.duration; */
    /* for (resourceSpec of resourceSpecifications) {
        const href_resourceSpecification = resourceSpec.href.replace("{host}", actualHost)
        const res5 = await axiosInstance.get(href_resourceSpecification.replace("https", "http"));
        total_duration += res5.duration;
    }    
 */
    const total_transaction_time = transaction_start != null ? (Date.now() - transaction_start) : 0;
    accumulatedMetrics.total_transaction_time = total_transaction_time;
   
    // parse performance tracing results
    return accumulatedMetrics;
};


module.exports = { rest_use_case_6 };
