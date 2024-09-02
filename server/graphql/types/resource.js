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
} = require('./enums'); // Importiere die Enum-Typen
const RelatedPartyType = require('./organization'); // Importiere den RelatedParty-Typ
const NoteType = require('./note'); // Importiere den Note-Typ
const RelatedPlaceRefOrValueType = require('./geographicAdress'); // Importiere den RelatedPlaceRefOrValue-Typ
const ResourceSpecificationRefType = require('./resourceSpecification'); // Importiere den ResourceSpecificationRef-Typ

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
    relatedParty: {
      type: new GraphQLList(RelatedPartyType),
      description: 'Related parties linked to this resource.',
    },
    note: {
      type: new GraphQLList(NoteType),
      description: 'Additional notes associated with the resource.',
    },
    place: {
      type: RelatedPlaceRefOrValueType,
      description: 'The place related to this resource.',
    },
    resourceSpecification: {
      type: ResourceSpecificationRefType,
      description: 'The specification that defines this resource.',
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
