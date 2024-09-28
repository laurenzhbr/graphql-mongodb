const Resource = require('../models/ResourceModels/Resource');

function createTestResource1() {
    const newResource = new Resource({
      "name": "Central Office Berlin Ost",
      "category": "Central Office",
      "resourceCharacteristic": [
        {
          "name": "connected_lines",
          "value": 230132
        },
        {
          "name": "building_size",
          "value": "1032"
        },
        {
          "name": "current_capacity_usage",
          "value": "78%"
        },
        {
          "name": "maximum_capacity",
          "value": 300000
        },
        {
          "name": "fiber_backhaul_available",
          "value": true
        },
        {
          "name": "power_backup_system",
          "value": "Diesel Generator"
        },
        {
          "name": "cooling_system",
          "value": "HVAC"
        },
        {
          "name": "security_status",
          "value": "Access Controlled"
        }
      ],
      "endOperatingDate": "2035-05-12",
      "startOperatingDate": "2005-05-12",
      "version": "3.1",
      "resourceStatus": "available",
      "usageState": "busy",
      "administrativeState": "locked",
      "operationalState": "enable",
      "relatedParty": [
        {
          "id": "party567",
          "href": "http://{host}/partyManagement/party/party567",
          "name": "Provider Inc.",
          "role": "Manufacturer"
        }
      ],
      "note": [
          {
            "author": "Admin",
            "date": "2023-07-25",
            "text": "everything is fine"
          }
      ],
      "place": {
        "id": "place12354",
        "href": "http://{host}/geographicAddressManagement/geographicAddress/place12354"
      },
      "resourceRelationship": [
      {
        "relationshipType": "targets",
        "resource": {
          "id": "9874654",
          "href": "http://{host}/resourceInventoryManagement/resource/9874654",
          "category": "Street Cabinet",
          "name": "Street Cabinet ABC123"
        }
      }]
    });
      
      newResource.save()
      .then(() => console.log('resource saved!'))
      .catch(err => console.error(err));
}

function createTestResource2() {
    const newResource = new Resource({
      "id": "123456789",
      "name": "Modem X200",
      "category": "Modem",
      "resourceCharacteristic": [
        {
          "name": "modem_type",
          "value": "Cable Modem"
        },
        {
          "name": "max_download_speed",
          "value": "1 Gbps"
        },
        {
          "name": "max_upload_speed",
          "value": "100 Mbps"
        },
        {
          "name": "connection_type",
          "value": "DOCSIS 3.1"
        },
        {
          "name": "ethernet_ports",
          "value": 4
        },
        {
          "name": "usb_ports",
          "value": 1
        },
        {
          "name": "coaxial_input",
          "value": true
        },
        {
          "name": "wifi_capability",
          "value": "Wi-Fi 5 (802.11ac)"
        },
        {
          "name": "firmware_version",
          "value": "v3.2.5"
        },
        {
          "name": "power_consumption",
          "value": "12W"
        },
        {
          "name": "security_features",
          "value": "WPA3, Firewall, MAC Address Filtering"
        },
        {
          "name": "maintenance_status",
          "value": "Last firmware update: 12.08.2023"
        },
        {
          "name": "processor",
          "value": "Broadcom BCM3390, 1.5 GHz"
        },
        {
          "name": "memory",
          "value": "2GB DDR3"
        },
        {
          "name": "storage",
          "value": "128MB Flash Storage"
        }
      ],
      "endOperatingDate": "2031-06-01",
      "startOperatingDate": "2021-06-01",
      "version": "1.0",
      "resourceStatus": "standby",
      "usageState": "active",
      "administrativeState": "unlocked",
      "operationalState": "enable",
      "relatedParty": [
        {
          "id": "party12345",
          "href": "http://{host}/partyManagement/party/party12345",
          "name": "John Doe",
          "role": "Technician"
        }
      ],
      "note": [
        {
          "author": "Admin",
          "date": "2023-08-12",
          "text": "Firmware updated successfully"
        }
      ],
      "place": {
        "id": "place123",
        "href": "http://{host}/geographicAddressManagement/geographicAddress/place123"
      },
      "resourceRelationship": [
      {
        "relationshipType": "targets",
        "resource": {
          "id": "891156154",
          "name": "Router R500",
          "category": "Router",
          "href": "http://{host}/resourceInventoryManagement/resource/123456789"
        }
      },
      {
          "relationshipType": "isTargeted",
          "resource": {
            "id": "9874654",
            "name": "Street Cabinet ABC123",
            "category": "Street Cabinet",
            "href": "http://{host}/resourceInventoryManagement/resource/135841351564"
          }
        }
      ]
    });
      
      newResource.save()
      .then(() => console.log('resource saved!'))
      .catch(err => console.error(err));
}

function createTestResource3() {
    const newResource = new Resource({
      "id": "891156154",
      "name": "Router R500",
      "category": "Router",
      "resourceCharacteristic": [
        {
          "name": "router_type",
          "value": "Wireless Router"
        },
        {
          "name": "max_download_speed",
          "value": "1.2 Gbps"
        },
        {
          "name": "max_upload_speed",
          "value": "300 Mbps"
        },
        {
          "name": "connection_type",
          "value": "Gigabit Ethernet"
        },
        {
          "name": "ethernet_ports",
          "value": 4
        },
        {
          "name": "usb_ports",
          "value": 2
        },
        {
          "name": "wifi_capability",
          "value": "Wi-Fi 6 (802.11ax)"
        },
        {
          "name": "firmware_version",
          "value": "v1.4.0"
        },
        {
          "name": "power_consumption",
          "value": "15W"
        },
        {
          "name": "security_features",
          "value": "WPA3, Firewall, Parental Controls"
        },
        {
          "name": "maintenance_status",
          "value": "Last firmware update: 25.07.2023"
        },
        {
          "name": "processor",
          "value": "Qualcomm IPQ8074, 2.2 GHz"
        },
        {
          "name": "memory",
          "value": "512MB DDR4"
        },
        {
          "name": "storage",
          "value": "256MB Flash Storage"
        },
        {
          "name": "antennas",
          "value": 4
        }
      ],
      "endOperatingDate": "2032-09-10",
      "startOperatingDate": "2022-09-10",
      "version": "1.1",
      "resourceStatus": "available",
      "usageState": "active",
      "administrativeState": "unlocked",
      "operationalState": "enable",
      "relatedParty": [
        {
          "id": "party67890",
          "href": "http://{host}/partyManagement/party/party67890",
          "name": "Jane Smith",
          "role": "Network Engineer"
        }
      ],
      "note": [
          {
            "author": "Admin",
            "date": "2023-07-25",
            "text": "Firmware update completed"
          }
      ],
      "place": {
        "id": "place456",
        "href": "http://{host}/geographicAddressManagement/geographicAddress/place456"
      },
      "resourceRelationship": [
      {
          "relationshipType": "isTargeted",
          "resource": {
            "id": "123456789",
            "name": "Modem X200",
            "category": "Modem",
            "href": "http://{host}/resourceInventoryManagement/resource/123456789"
          }
        }
      ]
    }
    );
      
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

function createTestResource5() {
  const newResource = new Resource({
    "name": "Street Cabinet ABC123",
    "category": "Street Cabinet",
    "resourceCharacteristic": [
      {
        "name": "connected_lines",
        "value": 1200
      },
      {
        "name": "cabinet_size",
        "value": "1.5m"
      },
      {
        "name": "network_type",
        "value": "DSL"
      },
      {
        "name": "current_capacity_usage",
        "value": "65%"
      },
      {
        "name": "maximum_capacity",
        "value": 1800
      },
      {
        "name": "fiber_ready",
        "value": true
      },
      {
        "name": "power_backup",
        "value": false
      },
      {
        "name": "cooling_system",
        "value": "Passive Ventilation"
      },
      {
        "name": "security_status",
        "value": "Locked"
      },
      {
        "name": "last_maintenance",
        "value": "10.01.2024 10:21:25"
      }
    ],
    "endOperatingDate": "2032-09-10",
    "startOperatingDate": "2022-09-10",
    "version": "1.1",
    "resourceStatus": "available",
    "usageState": "active",
    "administrativeState": "unlocked",
    "operationalState": "enable",
    "relatedParty": [
      {
        "id": "party67890",
        "href": "http://{host}/partyManagement/party/party67890",
        "name": "Jane Smith",
        "role": "Network Engineer"
      }
    ],
    "note": [
        {
          "author": "Admin",
          "date": "2023-07-25",
          "text": "Firmware update completed"
        }
    ],
    "place": {
      "id": "place456",
      "href": "http://{host}/geographicAddressManagement/geographicAddress/place456"
    },
    "resourceRelationship": [
    {
      "relationshipType": "targets",
      "resource": {
        "id": "123456789",
        "href": "http://{host}/resourceInventoryManagement/resource/123456789",
        "category": "Modem",
        "name": "Modem X200"
      }
    },
    {
        "relationshipType": "isTargeted",
        "resource": {
          "id": "135841351564",
          "href": "http://{host}/resourceInventoryManagement/resource/135841351564",
          "category": "Central Office",
          "name": "Central Office Berlin Ost"
        }
      }]
  });
    
    newResource.save().
    then(() => console.log('Resource saved!')).
    catch(err => console.error(err)); 
};


module.exports = {
    createTestResource1,
    createTestResource2,
    createTestResource3,
    createTestResource4,
    createTestResource5
};