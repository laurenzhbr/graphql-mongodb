const { GraphQLObjectType, GraphQLString } = require('graphql');

const FeatureType = new GraphQLObjectType({
  name: 'Feature',
  fields: () => ({
    // Definiere die Felder für Feature
  }),
});

module.exports = FeatureType;