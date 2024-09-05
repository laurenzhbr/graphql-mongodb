const { faker } = require('@faker-js/faker');
const mongoose = require('mongoose');
const Organization = require('../models/PartyModels/Organization'); // Dein Mongoose-Schema hier importieren

// Verbinde dich mit MongoDB
mongoose.connect('mongodb://localhost:27017/resource_inventory', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Funktion zum Generieren von zufälligen Kontaktinformationen
const generateContactMedium = () => {
  // Erzeugt mit 50% Wahrscheinlichkeit leere Daten
  if (Math.random() > 0.5) {
    return [];
  }

  return [
    {
      mediumType: faker.helpers.arrayElement(['email', 'phone', 'fax']),
      preferred: faker.datatype.boolean(),
      characteristic: {
        city: faker.location.city(),
        contactType: faker.helpers.arrayElement(['personal', 'business']),
        country: faker.location.country(),
        emailAddress: faker.internet.email(),
        faxNumber: faker.phone.number(),
        phoneNumber: faker.phone.number(),
        postCode: faker.location.zipCode(),
        socialNetworkId: faker.internet.userName(),
        stateOrProvince: faker.location.state(),
        street1: faker.location.street(),
        street2: faker.location.street(),
      },
      validFor: {
        startDateTime: faker.date.past(),
        endDateTime: faker.date.future(),
      },
    },
  ];
};

// Funktion zum Generieren von zufälligem Kreditrating
const generateCreditRating = () => {
  // Erzeugt mit 50% Wahrscheinlichkeit leere Daten
  if (Math.random() > 0.5) {
    return [];
  }

  return [
    {
      creditAgencyName: faker.company.name(),
      ratingScore: faker.number.int({ min: 300, max: 850 }),
      lastExecuted: faker.date.recent(),
      validFor: {
        startDateTime: faker.date.past(),
        endDateTime: faker.date.future(),
      },
    },
  ];
};

// Funktion zum Generieren von zufälligen Organisationseinträgen
const generateOrganization = (randomObject=null) => {
    let relationship_id;
    let org_name;
    if (randomObject != null) {
        relationship_id = randomObject._id.toString()
        org_name = randomObject.name
    }
    //let relationship_id = new mongoose.Types.ObjectId()
    let company_name = faker.company.name();
    const organization = {
    isHeadOffice: faker.datatype.boolean(),
    isLegalEntity: faker.datatype.boolean(),
    name: company_name,
    organizationType: faker.helpers.arrayElement(['Energieversorger', 'Marketing- und Vertriebspartner', 'Logistikunternehmen', 'Satellitenanbieter', 'Gerätehersteller', 'Sicherheitsdienstleister', 'Unternehmen', 'Wartungsfirma', 'Partner']),
    tradingName: company_name,
    tradeRegisterNumber: faker.string.uuid(),
    contactMedium: generateContactMedium(),
    creditRating: generateCreditRating(),
    existsDuring: {
      startDateTime: faker.date.past(),
      endDateTime: faker.date.future(),
    },
    externalReference: [
      {
        externalReferenceType: faker.helpers.arrayElement(['internetSite', 'socialMediaAccount']),
        name: faker.internet.domainName(),
      },
    ],
    status: faker.helpers.arrayElement(['initialized', 'validated', 'closed']),
    // Füge organizationParentRelationship nur hinzu, wenn randomObject nicht null ist
    ...(randomObject && {
        organizationParentRelationship: {
          relationshipType: faker.helpers.arrayElement(['parent', 'subsidiary']),
          organization: {
            id: relationship_id,
            href: `https://{host}/partyManagement/party/${relationship_id}`,
            name: org_name,
          },
        }
      }),
  };

  return organization;
};

// Funktion zum Generieren und Speichern von 1000 Organisationen
const generateAndSaveOrganizations = async () => {
    const organizations = [];
    
    // Alle Organisationen aus der Datenbank abrufen
    const existing_orgs = await Organization.find({});
    const count = await Organization.countDocuments(); // Zähle alle Dokumente in der Collection
    
    for (let i = 0; i < 5000; i++) {
        let newOrganization; // Deklariere die Variable außerhalb des Blocks
    
        if (i > 0) {
            const do_coupling = faker.datatype.boolean(); 
            if (do_coupling === true) {
                const random = Math.floor(Math.random() * count); // Wähle eine zufällige Position
                const randomObject = existing_orgs[random];
                newOrganization = generateOrganization(randomObject);
            } else {
                newOrganization = generateOrganization(); // Generiere eine neue Organisation ohne Kopplung
            }
        } else {
            newOrganization = generateOrganization(); // Generiere eine neue Organisation für die erste Iteration
        }
    
        organizations.push(newOrganization); // Füge die Organisation dem Array hinzu
    }
   

    try {
        // Speichere die generierten Organisationen in der Datenbank
        await Organization.insertMany(organizations);
        console.log('5000 Organisationen erfolgreich in die Datenbank geschrieben.');
    } catch (error) {
        console.error('Fehler beim Speichern der Organisationen:', error);
    } finally {
        // Schließe die MongoDB-Verbindung
        mongoose.connection.close();
    }
};

// Führe die Generierung und Speicherung der Organisationen aus
generateAndSaveOrganizations();
