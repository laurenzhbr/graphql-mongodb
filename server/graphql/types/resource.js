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

const Resource = require('../../models/ResourceModels/Resource')
const GeographicAdress = require('../../models/GeographicAddressModels/GeographicAddress')
const Organization = require('../../models/PartyModels/Organization')

const ResourceRelationshipType = new GraphQLObjectType({
  name: 'ResourceRelationship',
  description: "defines the relationship between to Resources in the hierarchy.",
  fields: () => ({
    relationshipType: { type: GraphQLString, description: "'targets' = reference to child resource || 'isTargeted' = reference to parent resource"},
    resource: { type: ResourceType, description: "Related Resource(s) entities" }
  })
});

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
    value: {
      type: GraphQLString,
      description: 'The value associated with the resource.',
    },
    operationalState: {
      type: ResourceOperationalStateType,
      description: 'The operational state of the resource, such as enabled or disabled.',
    },
    resourceCharacteristic: {
      type: new GraphQLList(CharacteristicType),
      description: 'A list of characteristics associated with the resource.',
      args: {
        names: { type: new GraphQLList(GraphQLString) },
      },
      resolve(parent, args) {
        if (args.names && args.names.length > 0) {
          return parent.resourceCharacteristic.filter(characteristic =>
            args.names.includes(characteristic.name)
          );
        }
        return parent.resourceCharacteristic;
      }
      
    },
    relatedParty: {
      type: new GraphQLList(OrganizationType),
      description: 'Related parties linked to this resource.',
      resolve(parent, args) {
        const relatedPartyIds = parent.relatedParty.map(party => party.id);
        
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
      description: "Relationship between Resources (i.e. targets or isTargeted)",
      args: {relationshipType: {type: GraphQLString, description: "such as targets, isTargeted"}},
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
