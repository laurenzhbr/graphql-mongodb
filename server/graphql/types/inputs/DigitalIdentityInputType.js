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

const DigitalIdentityInput = new GraphQLInputObjectType({
  name: 'DigitalIdentityInput',
  description: 'Input type for updating a DigitalIdentity',
  fields: {
      nickname: { type: GraphQLNonNull(GraphQLString), descriptiondescription: 'Nickname associated with this digital identity',},
      status: { type: GraphQLString, defaultValue: "unknown", description: 'Current lifecycle status of this digital identity', },
      resourceIdentified: { type: ResourceIdentifiedInputType, description: 'Resource owned by this digital identity', }
  }
});

module.exports = DigitalIdentityInput;