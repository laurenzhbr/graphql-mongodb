const axiosInstance = require('../../utils/interceptors');


const rest_use_case_6 = async (id = "66db76c734ed489b211cd3fd") => {
    const transaction_start = Date.now()
    let total_duration= 0;
    const actualHost = process.env.HOST || 'localhost:4000';

    const resourceUrl = `http://${actualHost}/resourceInventoryManagement/resource/${id}`;
    const resourceResponse = await axiosInstance.get(resourceUrl);
    total_duration += resourceResponse.duration;
    const resourceData = resourceResponse.data;

    // Sammle die RelatedParty IDs und die place href
    const relatedPartyHrefs = resourceData.relatedParty.map(party => party.href);
    const href_geoAdress = resourceData.place.href
        .replace("{host}", actualHost)
        .replace("https", "http");

    //GET Data from GeoAdress
    const res2 = await axiosInstance.get(href_geoAdress);
    total_duration += res2.duration;

    
    // 2. Abfrage der Related Parties (Organization)
    const relatedPartyDetails = await Promise.all(
        relatedPartyHrefs.map(async (partyHref) => {
            const orgUrl = partyHref.replace("{host}", actualHost).replace("https", "http");
            const orgResponse = await axiosInstance.get(orgUrl);
            total_duration += orgResponse.duration;
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
    total_transaction_time = Date.now() - transaction_start;
    const measurements = {'request_times': total_duration, 'total_transaction_time': total_transaction_time}
    return measurements
};


module.exports = { rest_use_case_6 };
