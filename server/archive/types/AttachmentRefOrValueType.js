const { GraphQLObjectType, GraphQLString } = require('graphql');


const AttachmentRefOrValueType = new GraphQLObjectType({
  name: 'AttachmentRefOrValue',
  description: 'An attachment by value or by reference. An attachment complements the description of an element, for example through a document, a video, a picture.',
  fields: () => ({
    id: {
      type: GraphQLString,
      description: 'Unique identifier for this particular attachment',
    },
    href: {
      type: GraphQLString,
      description: 'URI for this Attachment',
    },
    attachmentType: {
      type: GraphQLString,
      description: 'Attachment type such as video, picture',
    },
    content: {
      type: GraphQLString,
      description: 'The actual contents of the attachment object, if embedded, encoded as base64',
    },
    description: {
      type: GraphQLString,
      description: 'A narrative text describing the content of the attachment',
    },
    mimeType: {
      type: GraphQLString,
      description: 'Attachment mime type such as extension file for video, picture and document',
    },
    name: {
      type: GraphQLString,
      description: 'The name of the attachment',
    },
    url: {
      type: GraphQLString,
      description: 'Uniform Resource Locator, is a web page address (a subset of URI)',
    },
    '@baseType': {
      type: GraphQLString,
      description: 'When sub-classing, this defines the super-class',
    },
    '@schemaLocation': {
      type: GraphQLString,
      description: 'A URI to a JSON-Schema file that defines additional attributes and relationships',
    },
    '@type': {
      type: GraphQLString,
      description: 'When sub-classing, this defines the sub-class Extensible name',
    },
    '@referredType': {
      type: GraphQLString,
      description: 'The actual type of the target instance when needed for disambiguation.',
    },
  }),
});

module.exports = AttachmentRefOrValueType;