

const axiosInstance = require('../../utils/interceptors');

const rest_use_case_1 = async (id) => {
    const actualHost = process.env.HOST || 'localhost:4000';

    const url = `http://${actualHost}/digitalIdentityManagement/digitalIdentity?status=active}`
    const res1 = await axiosInstance.get(url);
    total_duration += res1.duration;

    const href_resourceIdentified = res1.data.resourceIdentified.href.replace("{host}", actualHost)
    const res2 = await axiosInstance.get(href_resourceIdentified.replace("https", "http"));
    total_duration += res2.duration;

    const href_geoAdress = res2.data.place.href.replace("{host}", actualHost)
    const res3 = await axiosInstance.get(href_geoAdress.replace("https", "http"));
    total_duration += res3.duration;

    const relatedParty = res2.data.relatedParty;
    const matchingParty = relatedParty.find(party => party.role === "equipment supplier");
    const href_relatedParty = matchingParty.href.replace("{host}", actualHost);
    const res4 = await axiosInstance.get(href_relatedParty.replace("https", "http"));
    total_duration += res4.duration;

    const resourceSpecification = res2.data.resourceSpecification
    const href_resourceSpecification = resourceSpecification.href.replace("{host}", actualHost)
    const res5 = await axiosInstance.get(href_resourceSpecification.replace("https", "http"));
    total_duration += res5.duration;
    /* for (resourceSpec of resourceSpecifications) {
        const href_resourceSpecification = resourceSpec.href.replace("{host}", actualHost)
        const res5 = await axiosInstance.get(href_resourceSpecification.replace("https", "http"));
        total_duration += res5.duration;
    }    
 */
    res5.duration = total_duration;
    return res5.duration
};


module.exports = { rest_use_case_1 };
