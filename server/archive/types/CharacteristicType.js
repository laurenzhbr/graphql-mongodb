const { GraphQLObjectType, GraphQLString, GraphQLList } = require('graphql');
const CharacteristicRelationshipType = require('./CharacteristicRelationshipType');

const CharacteristicType = new GraphQLObjectType({
  name: 'Characteristic',
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    valueType: { type: GraphQLString },
    characteristicRelationship: { type: new GraphQLList(CharacteristicRelationshipType) },
    value: { type: GraphQLString },
    '@baseType': { type: GraphQLString },
    '@schemaLocation': { type: GraphQLString },
    '@type': { type: GraphQLString },
  }),
});

module.exports = CharacteristicType;
