const { faker } = require('@faker-js/faker/locale/de');
const mongoose = require('mongoose');
const Organization = require('../models/PartyModels/Organization'); // Dein Mongoose-Schema hier importieren

const dbName = process.env.DB_NAME || 'resource_inventory';

// MongoDB-Verbindung
mongoose.connect(`mongodb://localhost:27017/${dbName}`, {
});

// Funktion zum Generieren von zufälligen Kontaktinformationen
const generateContactMedium = () => {
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

function generateCompanyName(organizationType) {
  if (organizationType == "Energieversorger") {
    return `${faker.company.name()} ${faker.helpers.arrayElement(['Energie AG', 'Stromnetz AG', 'Energie und Wasser KG', 'Versorgungswerke GmbH', 'Stromnetz AG', 'Energy Supply'])}`;
  }
  if (organizationType == "Sicherheitsdienstleister") {
    return `${faker.company.name()} ${faker.helpers.arrayElement(['Security GmbH', 'Wachdienst GmbH', 'Security Solutions', 'Sicherheitslösungen KG', 'Objektschutz AG', 'Security Services GmbH'])}`;
  }
  if (organizationType == "Marketing- und Vertriebspartner") {
    return `${faker.company.name()} ${faker.helpers.arrayElement(['Marketing Solutions KG', 'Marketing GmbH', 'Sales & Partners AG', 'Vertriebsgesellschaft mbH', 'Marketing- und Vertriebsservice GmbH', 'Sales & Consulting KG'])}`;
  }
  if (organizationType == "Logistikunternehmen") {
    return `${faker.company.name()} ${faker.helpers.arrayElement(['Logistik GmbH', 'Frachtservice KG', 'Spedition und Logistik AG', 'Versandlogistik GmbH', 'Logistikdienstleister AG', 'Transportgesellschaft mbH'])}`;
  }
  if (organizationType == "Gerätehersteller") {
    return `${faker.company.name()} ${faker.helpers.arrayElement(['Hardware Systems AG', 'Technik & Innovation GmbH', 'Produktionssysteme GmbH', 'Manufacturing', 'Constructing oHG', 'Technologies'])}`;
  }
  if (organizationType == "Wartungsfirma") {
    return `${faker.company.name()} ${faker.helpers.arrayElement(['Wartung GmbH', 'Service & Technik AG', 'Instandhaltung GmbH', 'Reparatur & Wartung KG', 'Technische Dienstleistungen GmbH'])}`;
  }
  
};

// Funktion zum Generieren von zufälligen Organisationseinträgen
const generateOrganization = (randomObject=null) => {
    //let relationship_id = new mongoose.Types.ObjectId()
    let organizationType = faker.helpers.arrayElement(['Energieversorger', 'Marketing- und Vertriebspartner', 'Logistikunternehmen', 'Gerätehersteller', 'Sicherheitsdienstleister', 'Wartungsfirma']);
    let company_name = generateCompanyName(organizationType);
    
    const organization = {
      isHeadOffice: faker.datatype.boolean(),
      isLegalEntity: faker.datatype.boolean(),
      name: company_name,
      organizationType: organizationType,
      tradingName: company_name,
      existsDuring: {
        startDateTime: faker.date.past(),
        endDateTime: faker.date.future(),
      },
      externalReference: [{
          externalReferenceType: faker.helpers.arrayElement(['internetSite', 'socialMediaAccount']),
          name: faker.internet.domainName(),
        }],
      status: faker.helpers.arrayElement(['initialized', 'validated', 'closed']),
    };
    if (Math.random() > 0.5) {
      organization.contactMedium = generateContactMedium();
      organization.creditRating = generateCreditRating();
    };

  return organization;
};

// Funktion zum Generieren und Speichern von 1000 Organisationen
const generateAndSaveOrganizations = async (total_amount) => {
    const organizations = [];
    
    // Alle Organisationen aus der Datenbank abrufen
    const existing_orgs = await Organization.find({});
    const count = await Organization.countDocuments(); // Zähle alle Dokumente in der Collection
    
    for (let i = 0; i < total_amount; i++) {
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
        console.log(`${total_amount} Organisationen erfolgreich in die Datenbank geschrieben.`);
    } catch (error) {
        console.error('Fehler beim Speichern der Organisationen:', error);
    } finally {
        // Schließe die MongoDB-Verbindung
        mongoose.connection.close();
    }
};

// Führe die Generierung und Speicherung der Organisationen aus
generateAndSaveOrganizations(2500);
