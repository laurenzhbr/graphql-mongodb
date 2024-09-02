const { GraphQLSchema } = require('graphql');
const { RootQuery, Mutation } = require('./resolvers/resolvers')

const schema = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation,
  });
  
  module.exports = schema;
