const Resource = require('../models/ResourceModels/Resource');

function createTestResource1() {
    const newResource = new Resource({
        description: "Das ist eine beschreibung",
        category: "Category_1",
        value: "Das ist ein Value",
        endOperatingDate: new Date("2022-07-04T08:00:00.000Z"),
        name: "resource 1",
        administrativeState: "locked",
        operationalState: "disable",
        usageState: "active",
        resourceStatus: "available",
        startOperatingDate: new Date("2022-07-03T08:00:00.000Z"),
        version: "version_1"
      });
      
      newResource.save()
      .then(() => console.log('resource saved!'))
      .catch(err => console.error(err));
}

function createTestResource2() {
    const newResource = new Resource({
        description: "Das ist eine beschreibung",
        category: "Premium",
        value: "Das ist ein Value",
        endOperatingDate: new Date("2022-07-04T08:00:00.000Z"),
        name: "resource 2",
        administrativeState: "locked",
        operationalState: "disable",
        usageState: "active",
        resourceStatus: "available",
        startOperatingDate: new Date("2022-07-03T08:00:00.000Z"),
        version: "version_1",
        note: {
            author: 'Peggy Huber',
            date: new Date(),
            text: "Es gibt essen"
        }
      });
      
      newResource.save()
      .then(() => console.log('resource saved!'))
      .catch(err => console.error(err));
}

function createTestResource3() {
    const newResource = new Resource({
        description: "This is a MSISDN resource with the category Premium and with a reserved resourceStatus for organisations.",
        category: "Premium",
        value: "0170112231",
        endOperatingDate: "2022-07-04",
        name: "MobileNumber xx",
        administrativeState: "locked",
        operationalState: "enable",
        usageState: "active",
        resourceStatus: "reserved",
        relatedParty: [{
          id: "66d0795bd88f332326c210c6",
          role: "equipment supplier",
        }],
        note: [{
          text: "something about this resource"
        }],
        place: {
          id: "9912",
        },
        /* resourceRelationship: [{
          relationshipType: "contains",
          resource: {
            id: "44",
            href: "http://server:port/resourceInventoryManagement/resource/44"
          }
        }], */
        resourceSpecification: {
          id: "4",
        },
        startOperatingDate: "2020-03-04",
        version: "business v2",
      });
      
      newResource.save().
      then(() => console.log('Resource saved!')).
      catch(err => console.error(err)); 
};

function createTestResource4() {
  const newResource = new Resource({
      description: "testing",
      category: "Premium",
      value: "0170112231",
      endOperatingDate: "2022-07-04",
      name: "MobileNumber xx",
      administrativeState: "locked",
      operationalState: "enable",
      usageState: "active",
      resourceStatus: "reserved",
      startOperatingDate: "2020-03-04",
      version: "business v3",
      placeGql: "66d5b01aeb8705a1b5c64538",
      relatedPartyGql: ["66d9a132db762da2bdda6261", "66d9a132db762da2bdda6260"],
      resourceSpecificationGql: "66d9a5cfeda5b8efce737013"
    });
    
    newResource.save().
    then(() => console.log('Resource saved!')).
    catch(err => console.error(err)); 
};


module.exports = {
    createTestResource1,
    createTestResource2,
    createTestResource3,
    createTestResource4
};