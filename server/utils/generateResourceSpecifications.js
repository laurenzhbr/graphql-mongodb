const { faker } = require('@faker-js/faker');
const mongoose = require('mongoose');
const ResourceSpecification = require('../models/ResourceCatalogModels/ResourceSpecification'); // Dein Mongoose-Schema hier importieren
const Organization = require('../models/PartyModels/Organization');

// Verbinde dich mit MongoDB
mongoose.connect('mongodb://localhost:27017/resource_inventory', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Funktion zum Generieren von zufälligen Anhängen (Attachments)
const generateAttachment = () => {
  let file_id = faker.string.uuid()
  let filename= faker.system.fileName()
    return {
    id: file_id,
    href: `http://{host}/filestorage/${file_id}.pdf`,
    name: filename,
    mimeType: 'application/pdf',
    url: faker.internet.url(),
  };
};

// Funktion zum Generieren von zufälligen Parteien (Related Party)
const generateRelatedParty = (organization) => {
    let organization_id = organization._id.toString();
    let org_href = organization.href;
    const relatedPartyObj = {
        role: organization.organizationType,
        id: organization_id, // Verwende die _id der existierenden Organisation
        href: org_href,
        name: organization.name,
  };
  return relatedPartyObj;
};

// Funktion zum Generieren von zufälligen Charakteristika
const generateCharacteristic = () => {
  return {
    name: 'Maximum Allowed Storage',
    description: 'The storage limit in the virtual storage medium',
    valueType: 'integer',
    configurable: faker.datatype.boolean(),
    minCardinality: 1,
    maxCardinality: 1,
    isUnique: faker.datatype.boolean(),
  };
};

// Funktion zum Generieren von zufälligen Beziehungen (Resource Specification Relationships)
const generateResourceSpecRelationship = () => {
  return {
    id: faker.string.uuid(),
    href: faker.internet.url(),
    name: 'Underlying Physical Disk',
    relationshipType: 'dependency',
    "@type": 'ResourceSpecificationRelationship',
  };
};

// Arrays für Namen, Beschreibungen und Kategorien aus dem IT-Infrastruktur-Umfeld
const resourceNames = [
    'Cloud Compute Instance',
    'Network Load Balancer',
    'Object Storage Bucket',
    'Database as a Service (DBaaS)',
    'Virtual Private Cloud (VPC)',
    'Content Delivery Network (CDN)'
  ];
  
  const resourceDescriptions = [
    'This resource specification defines a virtual machine for cloud computing tasks.',
    'This resource specification defines a load balancer for distributing network traffic.',
    'This resource specification defines a scalable object storage container.',
    'This resource specification defines a managed cloud database service.',
    'This resource specification defines an isolated network within a public cloud.',
    'This resource specification defines a system for delivering web content and media at scale.'
  ];
  
  const resourceCategories = [
    'Compute resource',
    'Network resource',
    'Storage resource',
    'Database resource',
    'Network resource',
    'Network resource'
  ];

// Funktion zum Generieren von zufälligen Ressourcen-Spezifikationen
const generateResourceSpecification = (organization, spec_index, previousResourceSpecification = null) => {
    const resourceSpec =  {
    name: resourceDescriptions[spec_index],
    description: resourceNames[spec_index],
    version: faker.system.semver(),
    validFor: {
      startDateTime: faker.date.past(),
      endDateTime: faker.date.future(),
    },
    lastUpdate: faker.date.recent(),
    lifecycleStatus: faker.helpers.arrayElement(['Active', 'Deprecated', 'In Progress']),
    isBundle: faker.datatype.boolean(),
    category: resourceCategories[spec_index],
    attachment: [generateAttachment()],
    relatedParty: [generateRelatedParty(organization)],
    resourceSpecCharacteristic: [generateCharacteristic()],
    resourceSpecRelationship: []
  };
  // Wenn es eine vorherige ResourceSpecification gibt, füge sie als Beziehung hinzu
  if (previousResourceSpecification) {
    resourceSpec.resourceSpecRelationship.push({
      id: previousResourceSpecification.id,
      href: previousResourceSpecification.href,
      name: previousResourceSpecification.name,
      relationshipType: 'dependency',
      "@type": 'ResourceSpecificationRelationship',
    });
  }

  return resourceSpec;
};

// Funktion zum Abrufen der Organisationen und Generieren von ResourceSpecifications
const generateAndSaveResourceSpecifications = async () => {
    try {
      // Alle Organisationen aus der Datenbank abrufen
      const organizations = await Organization.find({});
      const count = await Organization.countDocuments(); // Zähle alle Dokumente in der Collection
  
      if (!organizations.length) {
        console.log('Keine Organisationen gefunden, ResourceSpecifications können nicht erstellt werden.');
        return;
      }
  
      
  
      // Generiere 10 ResourceSpecifications, die jeweils die vorherige referenzieren
      for (let i = 0; i < 10; i++) {
        const resourceSpecifications = [];
        let previousResourceSpecification = null;
        for (let j = 0; j < 10; j++) {
            const random = Math.floor(Math.random() * count); // Wähle eine zufällige Position
            const randomObject = organizations[random];
            
            let spec_index = faker.number.int({max: 5})
            // Erstelle die ResourceSpecification und referenziere die vorherige
            const resourceSpecification = generateResourceSpecification(randomObject, spec_index, previousResourceSpecification);
      
            // Speichere die aktuelle ResourceSpecification in der Datenbank
            const savedResourceSpecification = await ResourceSpecification.create(resourceSpecification);
      
            // Setze die aktuelle ResourceSpecification als vorherige für die nächste Iteration
            previousResourceSpecification = savedResourceSpecification;
      
            resourceSpecifications.push(savedResourceSpecification);
        }
      }  
      console.log('20 Resource Specifications erfolgreich in die Datenbank geschrieben.');
    } catch (error) {
      console.error('Fehler beim Abrufen der Organisationen oder Speichern der Resource Specifications:', error);
    } finally {
      // Schließe die MongoDB-Verbindung
      mongoose.connection.close();
    }
  };
  
  // Führe die Generierung und Speicherung der ResourceSpecifications aus
  generateAndSaveResourceSpecifications();
