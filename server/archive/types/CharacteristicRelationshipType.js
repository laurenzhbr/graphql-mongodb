const { GraphQLObjectType, GraphQLString } = require('graphql');

const CharacteristicRelationshipType = new GraphQLObjectType({
  name: 'CharacteristicRelationship',
  fields: () => ({
    id: { type: GraphQLString },
    href: { type: GraphQLString },
    relationshipType: { type: GraphQLString },
    '@baseType': { type: GraphQLString },
    '@schemaLocation': { type: GraphQLString },
    '@type': { type: GraphQLString },
  }),
});

module.exports = CharacteristicRelationshipType;
