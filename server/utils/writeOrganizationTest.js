const Organization = require('../PartyModels/Organization');

function createTestOrganization1() {
    const newOrganization = new Organization({
        isHeadOffice: true,
        isLegalEntity: false,
        name: "Deutsche Telekom Technik GmbH",
        organizationType: "equipment supplier"
      });
      
      newOrganization.save()
      .then(() => console.log('new Party (Organization) saved!'))
      .catch(err => console.error(err));
}



module.exports = {
    createTestOrganization1
};