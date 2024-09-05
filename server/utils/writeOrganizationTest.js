const Organization = require('../models/PartyModels/Organization');

function createTestOrganization() {
    const newOrganization1 = new Organization({
        isHeadOffice: true,
        isLegalEntity: false,
        name: "Telekom IT",
        organizationType: "security supplier"
      });
    
    const newOrganization2 = new Organization({
    isHeadOffice: true,
    isLegalEntity: false,
    name: "T-Systems",
    organizationType: "software supplier"
    });
      
    newOrganization1.save()
    newOrganization2.save()
    .then(() => console.log('new Party (Organization) saved!'))
    .catch(err => console.error(err));
}




module.exports = {
    createTestOrganization
};