// enums.js
const { GraphQLEnumType } = require('graphql');

const ResourceAdministrativeStateType = new GraphQLEnumType({
  name: 'ResourceAdministrativeStateType',
  description: 'ResourceAdministrativeStateType enumerations',
  values: {
    locked: {},
    unlocked: {},
    shutdown: {},
  },
});

const ResourceOperationalStateType = new GraphQLEnumType({
  name: 'ResourceOperationalStateType',
  description: 'ResourceOperationalStateType enumerations',
  values: {
    enable: {},
    disable: {},
  },
});

const ResourceStatusType = new GraphQLEnumType({
    name: 'ResourceStatusType',
    description: 'ResourceStatusType enumerations',
    values: {
      standby: {},
      alarm: {},
      available: {},
      reserved: {},
      unknown: {},
      suspended: {},
    },
  });
  
  const ResourceUsageStateType = new GraphQLEnumType({
    name: 'ResourceUsageStateType',
    description: 'ResourceUsageStateType enumerations',
    values: {
      idle: {},
      active: {},
      busy: {},
    },
  });
  
  module.exports = {
    ResourceAdministrativeStateType,
    ResourceOperationalStateType,
    ResourceStatusType,
    ResourceUsageStateType,
  };