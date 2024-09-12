const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLEnumType,
    GraphQLID
  } = require('graphql');
  const { GraphQLDateTime } = require('../customScalars/customScalars');
  const ResourceType = require('./resource'); // resource type
  const Resource = require('../../models/ResourceModels/Resource')
  
  // Definiere den Enum-Typ für den Status
  const DigitalIdentityStatusEnum = new GraphQLEnumType({
    name: 'DigitalIdentityStatus',
    description: 'Current lifecycle status of this digital identity',
    values: {
      unknown: {},
      active: {},
      suspended: {},
      archived: {},
    },
  });
  
  // GraphQL-Typ für DigitalIdentity
  const DigitalIdentityType = new GraphQLObjectType({
    name: 'DigitalIdentity',
    description: 'Represents a Digital Identity with associated metadata and resources.',
    fields: {
      id: {
        type: GraphQLID,
        description: 'Unique identifier for the digital identity.',
      },
      creationDate: {
        type: GraphQLDateTime, // Nutze GraphQLDate oder einen eigenen DateTime-Scalar-Typ
        description: 'Date and time of the Digital Identity creation (timestamp)',
      },
      lastUpdate: {
        type: GraphQLDateTime, // Nutze GraphQLDate oder einen eigenen DateTime-Scalar-Typ
        description: 'Date and time of the Digital Identity last update (timestamp)',
      },
      nickname: {
        type: GraphQLString,
        description: 'Nickname associated with this digital identity',
      },
      status: {
        type: DigitalIdentityStatusEnum,
        description: 'Current lifecycle status of this digital identity',
      },
      resource: {
        type: ResourceType,
        description: 'Resource identified by this digital identity',
        resolve(parent, args){
            return Resource.findById(parent.resourceIdentified.id); //fetches connected resource
        }
      },
    },
  });
  
  module.exports = DigitalIdentityType;
  