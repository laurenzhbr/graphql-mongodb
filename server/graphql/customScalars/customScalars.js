// customScalars.js
const { GraphQLScalarType, Kind } = require('graphql');

// Custom Scalar für URL
const GraphQLURL = new GraphQLScalarType({
  name: 'URL',
  description: 'A valid URL value.',
  serialize: (value) => value.toString(),  // Konvertiert den Wert für den Client
  parseValue: (value) => new URL(value),  // Konvertiert den Wert vom Client
  parseLiteral: (ast) => {
    if (ast.kind === Kind.STRING) {
      return new URL(ast.value);  // Verarbeitet URL-Strings direkt aus dem Query AST
    }
    return null;
  },
});

// Custom Scalar für DateTime
const GraphQLDateTime = new GraphQLScalarType({
  name: 'DateTime',
  description: 'A valid date time value.',
  serialize: (value) => value.toISOString(),  // Konvertiert den Wert für den Client
  parseValue: (value) => new Date(value),  // Konvertiert den Wert vom Client
  parseLiteral: (ast) => {
    if (ast.kind === Kind.STRING) {
      return new Date(ast.value);  // Verarbeitet Datums-Strings direkt aus dem Query AST
    }
    return null;
  },
});

const MixedType = new GraphQLScalarType({
  name: 'MixedType',
  description: 'A field that can represent multiple types (String, Boolean, Number)',
  parseValue(value) {
    return value; // Eingehende Werte werden nicht verändert
  },
  serialize(value) {
    return value; // Ausgabe wird nicht verändert
  },
  parseLiteral(ast) {
    switch (ast.kind) {
      case Kind.STRING:
        return ast.value;
      case Kind.BOOLEAN:
        return ast.value;
      case Kind.INT:
      case Kind.FLOAT:
        return parseFloat(ast.value);
      default:
        return null;
    }
  }
});

module.exports = {
  GraphQLURL,
  GraphQLDateTime,
  MixedType
};
