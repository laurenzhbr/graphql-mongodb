const DigitalIdentity = require('../models/DigtialIdentityModels/DigitalIdentity');

function createDigitalIDTest1() {
    const newDigitalIdentity = new DigitalIdentity({
        nickname: "LaurenzHbr1",
        status: "active",
        resourceIdentified: {
          id: "66cf06943a5799a97164e997"
        }
      });
      
      newDigitalIdentity.save()
      .then(() => console.log('Digital ID saved!'))
      .catch(err => console.error(err));
}



module.exports = {
    createDigitalIDTest1
};