const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLBoolean,
    GraphQLNonNull,
    GraphQLID
  } = require('graphql');
  
  const OrganizationType = new GraphQLObjectType({
    name: 'Organization',
    description: 'Represents an organization, including details such as name, type, and whether it is a legal entity or head office.',
    fields: {
      id: {
        type: GraphQLID,
        description: 'Unique identifier for the organization.',
      },
      isHeadOffice: {
        type: GraphQLBoolean,
        description: 'Indicates whether the organization is the head office.',
      },
      isLegalEntity: {
        type: GraphQLBoolean,
        description: 'Indicates whether the organization is a legal entity.',
      },
      name: {
        type: GraphQLString,
        description: 'The name of the organization.',
      },
      organizationType: {
        type: GraphQLString,
        description: 'The type of organization, such as "Corporation", "Non-profit", etc.',
      },
    },
  });
  
  module.exports = OrganizationType;
  