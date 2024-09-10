const axiosInstance = require('../../utils/interceptors');


const rest_use_case_8 = async (digi_id = "66db7b5fbbe1351f628ed5e7", resource_id = "66db6d63658d40350e57e43f", resource_name="Router for Modem Hüfingen 0 0" ) => {
    const actualHost = process.env.HOST || 'localhost:4000';

    /* const resourceUrl = `http://${actualHost}/resourceInventoryManagement/resource?category=Router`
    const resource = await axiosInstance.get(resourceUrl);
    const resources = resource.data
    routerForUpdate = resources[Math.floor(Math.random()*resource.data.length)]; */
    
    // 1. Update-Daten mit den Details des zufälligen Routers füllen
    updateData.resourceIdentified = {
        id: resource_id,
        name: resource_name,
    };

    let total_duration = 0;

    // 3. Sende PATCH-Anfrage mit den Daten, die aktualisiert werden sollen
    const patchUrl = `http://${actualHost}/digitalIdentityManagement/digitalIdentity/${id}`;
    const patchResponse = await axiosInstance.patch(patchUrl, updateData);
    total_duration += patchResponse.duration;
    
    // 2. Überprüfen der Ergebnisse und Rückgabe der Modemdaten
    const modems = modemResponse.data;

    if (modems.length === 0) {
        console.log('KEINE Modems gefunden, die ohne Probleme laufen');
    }

    return {'request_times': total_duration};
};


module.exports = { rest_use_case_8 };
