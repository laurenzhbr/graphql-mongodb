const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLList,
  GraphQLNonNull,
} = require('graphql');
const { GraphQLDateTime, MixedType } = require('../customScalars/customScalars'); // Falls du einen Custom Scalar für DateTime verwendest
const {
  ResourceAdministrativeStateType,
  ResourceOperationalStateType,
  ResourceStatusType,
  ResourceUsageStateType,
} = require('./enums');
const OrganizationType = require('./organization');
const NoteType = require('./note');
const PlaceType = require('./geographicAdress');
const ResourceSpecificationType = require('./resourceSpecification');

const Resource = require('../../models/ResourceModels/Resource')
const GeographicAdress = require('../../models/GeoAdressModels/GeographicAdress')
const Organization = require('../../models/PartyModels/Organization')
const ResourceSpecification = require('../../models/ResourceCatalogModels/ResourceSpecification');

// Schema für ResourceRelationship, das die vollständige Resource zurückgibt
const ResourceRelationshipType = new GraphQLObjectType({
  name: 'ResourceRelationship',
  fields: () => ({
    relationshipType: { type: GraphQLString },
    resource: { type: ResourceType } // Vollständige Resource
  })
});

// GraphQLType für die resourceCharacteristic
const CharacteristicType = new GraphQLObjectType({
  name: 'Characteristic',
  description: 'Represents a characteristic of a resource.',
  fields: {
    name: { 
      type: new GraphQLNonNull(GraphQLString), 
      description: 'The name of the characteristic.' 
    },
    valueType: { 
      type: GraphQLString, 
      description: 'The type of the characteristic value.' 
    },
    value: { 
      type: MixedType, 
      description: 'The value of the characteristic.' 
    },
  },
});

const ResourceType = new GraphQLObjectType({
  name: 'Resource',
  description: 'Represents a resource with various characteristics and states.',
  fields: {
    id: {
      type: new GraphQLNonNull(GraphQLID),
      description: 'Unique identifier for the resource.',
    },
    description: {
      type: GraphQLString,
      description: 'A free-text description of the resource.',
    },
    category: {
      type: GraphQLString,
      description: 'The category of the resource.',
    },
    value: {
      type: GraphQLString,
      description: 'The value associated with the resource.',
    },
    endOperatingDate: {
      type: GraphQLDateTime,
      description: 'The date until the resource is operating.',
    },
    name: {
      type: GraphQLString,
      description: 'A name for the resource.',
    },
    administrativeState: {
      type: ResourceAdministrativeStateType,
      description: 'The administrative state of the resource, such as locked, unlocked, or shutdown.',
    },
    operationalState: {
      type: ResourceOperationalStateType,
      description: 'The operational state of the resource, such as enabled or disabled.',
    },
    resourceCharacteristic: {
      type: new GraphQLList(CharacteristicType),
      description: 'A list of characteristics associated with the resource.',
      args: {
        names: { type: new GraphQLList(GraphQLString) },  // Argument zum Filtern nach mehreren Namen
      },
      resolve(parent, args) {
        // Wenn eine Liste von Namen übergeben wurde, filtere die Characteristiken
        if (args.names && args.names.length > 0) {
          return parent.resourceCharacteristic.filter(characteristic =>
            args.names.includes(characteristic.name)
          );
        }
        // Wenn keine Namen angegeben wurden, gib alle zurück
        return parent.resourceCharacteristic;
      }
      
    },
    relatedParties: {
      type: new GraphQLList(OrganizationType),
      description: 'Related parties linked to this resource.',
      resolve(parent, args) {
        // Überprüfen, ob relatedParty ein Array ist und die Objekte eine ID haben
        const relatedPartyIds = parent.relatedParty.map(party => party.id);  // Extrahiere alle IDs
        
        // Finde alle Organisationen, deren ID in relatedPartyIds ist
        return Organization.find({ _id: { $in: relatedPartyIds } });
      }
    },
    note: {
      type: new GraphQLList(NoteType),
      description: 'Additional notes associated with the resource.',
    },
    place: {
      type: PlaceType,
      description: 'The place related to this resource.',
      resolve(parent, args) {
        return GeographicAdress.findById(parent.place.id);
      }
    },
    resourceRelationship: {
      type: new GraphQLList(ResourceRelationshipType),
      args: {relationshipType: {type: GraphQLString}},
      resolve: async (parent, args) => {
        if (parent.resourceRelationship && parent.resourceRelationship.length > 0) {
          const filteredRelationships = parent.resourceRelationship.filter(
            (relationship) => relationship.relationshipType === args.relationshipType
          );

          const relatedResources = await Promise.all(
            filteredRelationships.map(async (relationship) => {
              const relatedResourceID = relationship.resource.id
              const relatedResource = await Resource.findById(relatedResourceID);
              return {
                ...relationship.toObject(),
                resource: relatedResource
              };
            })
          );
          return relatedResources;
        }
        return null;
      }
    },
    /* resourceSpecification: {
      type: ResourceSpecificationType,
      description: 'The specification that defines this resource.',
      resolve(parent, args) {
        return ResourceSpecification.findById(parent.resourceSpecificationGql);
      }
    }, */
    resourceStatus: {
      type: ResourceStatusType,
      description: 'The current status of the resource, such as standby, alarm, available, reserved, suspended.',
    },
    usageState: {
      type: ResourceUsageStateType,
      description: 'The current usage state of the resource, such as idle, active, or busy.',
    },
    startOperatingDate: {
      type: GraphQLDateTime,
      description: 'The date from which the resource is operating.',
    },
    version: {
      type: GraphQLString,
      description: 'The version of the resource.',
    },
  },
});

module.exports = ResourceType;
