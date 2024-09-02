const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLNonNull,
    GraphQLID
  } = require('graphql');
  
  const ResourceSpecificationType = new GraphQLObjectType({
    name: 'ResourceSpecification',
    description: 'Represents a specification of a resource, including details such as name, category, version, and lifecycle status.',
    fields: {
      id: {
        type: new GraphQLNonNull(GraphQLID),
        description: 'Unique identifier for the resource specification.',
      },
      category: {
        type: GraphQLString,
        description: 'The category of the resource specification, e.g., "Network", "Software", etc.',
      },
      description: {
        type: GraphQLString,
        description: 'A free-text description of the resource specification.',
      },
      name: {
        type: GraphQLString,
        description: 'The name of the resource specification.',
      },
      lifecycleStatus: {
        type: GraphQLString,
        description: 'The lifecycle status of the resource specification, such as "Active", "Deprecated", etc.',
      },
      version: {
        type: GraphQLString,
        description: 'The version of the resource specification.',
      },
    },
  });
  
  module.exports = ResourceSpecificationType;
  