const {
    GraphQLObjectType
  } = require('graphql');
const GraphQLDate = require('graphql-date')
  
  // Wenn ValidFor ebenfalls ein Sub-Object ist, erstelle den Typ für ValidFor:
  const ValidForType = new GraphQLObjectType({
    name: 'ValidFor',
    fields: () => ({
      startDateTime: { type: GraphQLDate },
      endDateTime: { type: GraphQLDate }
    })
  });

  module.exports = ValidForType;