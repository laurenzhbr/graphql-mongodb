const DigitalIdentity = require('../models/DigtialIdentityModels/DigitalIdentity');

function createDigitalIDTest1() {
    const newDigitalIdentity = new DigitalIdentity({
        nickname: "LaurenzHbr2",
        status: "active",
        resource: "66cadf46308d3cacdaacd4b0"
      });
      
      newDigitalIdentity.save()
      .then(() => console.log('Digital ID saved!'))
      .catch(err => console.error(err));
}



module.exports = {
    createDigitalIDTest1
};