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
    id: { type: GraphQLNonNull(GraphQLID), description: 'Unique identifier for the resource.', },
    name: { type: GraphQLString, description: 'A name for the resource.', },
  }
});

const DigitalIdentityCreateInput = new GraphQLInputObjectType({
  name: 'DigitalIdentityCreateInput',
  description: 'Input type for updating a DigitalIdentity',
  fields: {
      nickname: { type: GraphQLNonNull(GraphQLString), description: 'Nickname associated with this digital identity',},
      status: { type: GraphQLString, defaultValue: "unknown", description: 'Current lifecycle status of this digital identity (default: unknown)', },
      resourceIdentified: { type: ResourceIdentifiedInputType, description: 'Resource owned by this digital identity', }
  }
});

const DigitalIdentityUpdateInput = new GraphQLInputObjectType({
  name: 'DigitalIdentityUpdateInput',
  description: 'Input type for updating a DigitalIdentity',
  fields: {
      nickname: { type: GraphQLString, description: 'Nickname associated with this digital identity',},
      status: { type: GraphQLString, defaultValue: "unknown", description: 'Current lifecycle status of this digital identity', },
      resourceIdentified: { type: ResourceIdentifiedInputType, description: 'Resource owned by this digital identity', }
  }
});

module.exports = { DigitalIdentityCreateInput, DigitalIdentityUpdateInput};