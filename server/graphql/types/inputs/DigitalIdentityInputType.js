const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLID,
    GraphQLNonNull,
    GraphQLInputObjectType
  } = require('graphql');

const ResourceIdentifiedInputType = new GraphQLInputObjectType({
    name: 'ResourceIdentifiedInputType',
    fields: {
      id: { type: GraphQLNonNull(GraphQLID) },
      name: { type: GraphQLString },
      href: { type: GraphQLString },
    }
  });

const DigitalIdentityUpdateInput = new GraphQLInputObjectType({
    name: 'DigitalIdentityUpdateInput',
    description: 'Input type for updating a DigitalIdentity',
    fields: {
        nickname: { type: GraphQLString },
        status: { type: GraphQLString },
        resourceIdentified: { type: ResourceIdentifiedInputType }
    }
});

module.exports = DigitalIdentityUpdateInput;