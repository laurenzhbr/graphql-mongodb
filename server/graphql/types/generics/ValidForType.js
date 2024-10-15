const {
    GraphQLObjectType
  } = require('graphql');
  const { GraphQLDateTime } = require('../../customScalars/customScalars');
  
  const ValidForType = new GraphQLObjectType({
    name: 'ValidFor',
    fields: () => ({
      startDateTime: { type: GraphQLDateTime },
      endDateTime: { type: GraphQLDateTime }
    })
  });

  module.exports = ValidForType;