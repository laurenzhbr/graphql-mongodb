const {
    GraphQLObjectType,
    GraphQLID,
    GraphQLString,
    GraphQLNonNull,
    GraphQLList,
    GraphQLEnumType,
    GraphQLScalarType,
  } = require('graphql');
  const { GraphQLDateTime } = require('../customScalars/customScalars');
  const Resource = require('./resource'); // Typ für das referenzierte Schema
  
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
        type: new GraphQLNonNull(GraphQLID),
        description: 'Unique identifier for the digital identity.',
      },
      href: {
        type: GraphQLString,
        description: 'Hyperlink reference',
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
        type: Resource, // Nutze den Typ, der das referenzierte ResourceRefSchema beschreibt
        description: 'Resource identified by this digital identity',
      },
    },
  });
  
  module.exports = DigitalIdentityType;
  