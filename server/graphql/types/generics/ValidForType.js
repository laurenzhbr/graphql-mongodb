const {
    GraphQLObjectType
  } = require('graphql');
  const { GraphQLDateTime } = require('../../customScalars/customScalars');
  
  // Wenn ValidFor ebenfalls ein Sub-Object ist, erstelle den Typ für ValidFor:
  const ValidForType = new GraphQLObjectType({
    name: 'ValidFor',
    fields: () => ({
      startDateTime: { type: GraphQLDateTime },
      endDateTime: { type: GraphQLDateTime }
    })
  });

  module.exports = ValidForType;