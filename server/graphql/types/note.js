const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLNonNull,
} = require('graphql');

// load custom scalars
const { GraphQLURL, GraphQLDateTime } = require('../customScalars/customScalars');

// Definition des Note-Typs
const NoteType = new GraphQLObjectType({
  name: 'Note',
  description: 'Extra information about a given entity',
  fields: {
    id: {
      type: GraphQLID,
      description: 'Identifier of the note within its containing entity (may or may not be globally unique, depending on provider implementation)',
    },
    author: {
      type: GraphQLString,
      description: 'Author of the note',
    },
    date: {
      type: GraphQLDateTime,
      description: 'Date of the note',
    },
    text: {
      type: GraphQLString,
      description: 'Text of the note',
    },
  },
});

module.exports = NoteType;