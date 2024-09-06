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
      description: "this is an equipment resource instance",
      category: "equipment",
      value: "0170112231",
      endOperatingDate: "2022-07-04",
      name: "Router WIfi",
      administrativeState: "locked",
      operationalState: "enable",
      usageState: "active",
      resourceStatus: "reserved",
      startOperatingDate: "2020-03-04",
      version: "business v3",
      placeGql: "66d5b01aeb8705a1b5c64538",
      relatedPartyGql: ["66d9a132db762da2bdda6261", "66d9a132db762da2bdda6260"],
      resourceSpecificationGql: "66d9a5cfeda5b8efce737013",
      resourceCharacteristic: [
      {
        "name": "FSZ",
        "valueType": "string",
        "value": "0000"
      },
      {
        "name": "Status",
        "valueType": "string",
        "value": "InBetrieb"
      },
      {
        "name": "add/VK/SchK",
        "valueType": "string",
        "value": "VtRack/0001/0014/0093_Vt/0001/0014/0093_4"
      },
      {
        "name": "Zusatzname",
        "valueType": "string",
        "value": "EndA Platz 001 - EndB Platz 008"
      },
      {
        "name": "Planungsstatus",
        "valueType": "string",
        "value": "Bestueckt"
      },
      {
        "name": "Datum",
        "valueType": "date-time",
        "value": "17.03.2008 08:31:22"
      },
      {
        "name": "TE-Block",
        "valueType": "string",
        "value": "IP2Vt;KOM2"
      },
      {
        "name": "Shelf",
        "valueType": "string",
        "value": "00000"
      },
      {
        "name": "letzte Aenderung",
        "valueType": "date-time",
        "value": "17.10.2014 15:00:42"
      },
      {
        "name": "VPSZ",
        "valueType": "string",
        "value": "49/431/23"
      },
      {
        "name": "node",
        "valueType": "string",
        "value": "105/1/7406/5456"
      },
      {
        "name": "ENDSZ",
        "valueType": "string",
        "value": "49/431/23/0000"
      },
      {
        "name": "property",
        "valueType": "string",
        "value": "105/1/7408/129329"
      },
      {
        "name": "propertyValue",
        "valueType": "string",
        "value": "170/1/7408/88439"
      },
      {
        "name": "Bestückungsstatus",
        "valueType": "string",
        "value": "Bestueckt"
      },
      {
        "name": "Belegungsstatus",
        "valueType": "string",
        "value": "Teilweise"
      },
      {
        "name": "Löschkennzeichen",
        "valueType": "boolean",
        "value": false
      },
      {
        "name": "Verkabelungsstatus",
        "valueType": "string",
        "value": "Vollstaendig"
      },
      {
        "name": "PropertyLongname",
        "valueType": "string",
        "value": "Kiel 23"
      },
      {
        "name": "KindOfEquip",
        "valueType": "string",
        "value": "Switch_Cable"
      },
      {
        "name": "Name",
        "valueType": "string",
        "value": "SCHK SY4_49/431/23/0000_59"
      },
      {
        "name": "Gestellplatz A",
        "valueType": "string",
        "value": "0001"
      },
      {
        "name": "Gestellplatz B",
        "valueType": "string",
        "value": "0008"
      }
    ],
    "resourceRelationship": [
      {
        "relationshipType": "bundled",
        "resource": {
          "id": "66168d6eef7b4a0ae1b68510",
          "href": "/net4f/resource-inventory-int/v1/resource/66168d6eef7b4a0ae1b68510",
          "category": "slot",
          "name": "Def"
        }
      }
    ]
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