const { GraphQLObjectType, GraphQLString } = require('graphql');

const ResourceRelationshipType = new GraphQLObjectType({
  name: 'ResourceRelationship',
  fields: () => ({
    // Definiere die Felder für ResourceRelationship
  }),
});

module.exports = ResourceRelationshipType;
