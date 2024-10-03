const { fetchMetrics } = require('../../utils/prepare_metrics');

const rest_use_case_4 = async (id = "66f7e21acfa2a96703f22d60") => {
    const transaction_start = Date.now();
    const actualHost = process.env.HOST || 'localhost:4000';
    let accumulatedMetrics = {};
    let useCaseData = {};

    const url = `http://${actualHost}/digitalIdentityManagement/digitalIdentity/${id}`
    accumulatedMetrics = await fetchMetrics(url, accumulatedMetrics);
    useCaseData.digitalIdentity = accumulatedMetrics.data;

    // get router information
    const href_resourceIdentified = `${accumulatedMetrics.data.resourceIdentified.href.replace("{host}", actualHost)}`
    accumulatedMetrics = await fetchMetrics(href_resourceIdentified, accumulatedMetrics);
    const resourceData = accumulatedMetrics.data;
    useCaseData.resource = resourceData;

    // Sammle die RelatedParty IDs und die place href
    const relatedPartyHrefs = resourceData.relatedParty.map(party => party.href.replace("{host}", actualHost));
    const href_geoAdress = resourceData.place.href.replace("{host}", actualHost)

    //GET Data from GeoAdress
    accumulatedMetrics = await fetchMetrics(href_geoAdress, accumulatedMetrics);
    const addressData = accumulatedMetrics.data;
    useCaseData.geographicAddress = addressData;

    // 2. Abfrage der Related Parties (Organization)
    const relatedPartyDetails = await Promise.all(
        relatedPartyHrefs.map(async (partyHref) => {
            const orgUrl = partyHref.replace("{host}", actualHost);
            accumulatedMetrics = await fetchMetrics(orgUrl, accumulatedMetrics);
            return accumulatedMetrics.data;
        })
    );
    useCaseData.relatedParty = relatedPartyDetails;
    const total_transaction_time = transaction_start != null ? (Date.now() - transaction_start) : 0;
    accumulatedMetrics.total_transaction_time = total_transaction_time;
    accumulatedMetrics.data = useCaseData
   
    // parse performance tracing results
    return accumulatedMetrics;
};


module.exports = { rest_use_case_4 };
