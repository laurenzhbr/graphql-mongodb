const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLList,
  GraphQLNonNull,
} = require('graphql');
const { GraphQLDateTime } = require('../customScalars/customScalars'); // Falls du einen Custom Scalar für DateTime verwendest
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
    relatedParties: {
      type: new GraphQLList(OrganizationType),
      description: 'Related parties linked to this resource.',
      resolve(parent, args) {
        return Organization.find({_id: {$in: parent.relatedParty.id}});
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
    resourceSpecification: {
      type: ResourceSpecificationType,
      description: 'The specification that defines this resource.',
      resolve(parent, args) {
        return ResourceSpecification.findById(parent.resourceSpecificationGql);
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
