const { GraphQLObjectType, GraphQLString } = require('graphql');
const QuantityType = require('./QuantityType');
const TimePeriodType = require('./TimePeriodType');

const AttachmentType = new GraphQLObjectType({
  name: 'Attachment',
  fields: () => ({
    id: { type: GraphQLString },
    href: { type: GraphQLString },
    attachmentType: { type: GraphQLString },
    content: { type: GraphQLString },
    description: { type: GraphQLString },
    mimeType: { type: GraphQLString },
    name: { type: GraphQLString },
    url: { type: GraphQLString },
    size: { type: QuantityType },
    validFor: { type: TimePeriodType },
    '@baseType': { type: GraphQLString },
    '@schemaLocation': { type: GraphQLString },
    '@type': { type: GraphQLString },
  }),
});

module.exports = AttachmentType;