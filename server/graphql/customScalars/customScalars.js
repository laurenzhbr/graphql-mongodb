// customScalars.js
const { GraphQLScalarType, Kind } = require('graphql');

// Custom Scalar for URL
const GraphQLURL = new GraphQLScalarType({
  name: 'URL',
  description: 'A valid URL value.',
  serialize: (value) => value.toString(),  // Converts value for client 
  parseValue: (value) => new URL(value),  // Converts value from Client 
  parseLiteral: (ast) => {
    if (ast.kind === Kind.STRING) {
      return new URL(ast.value); 
    }
    return null;
  },
});

// Custom Scalar for DateTime
const GraphQLDateTime = new GraphQLScalarType({
  name: 'DateTime',
  description: 'A valid date time value.',
  serialize: (value) => value.toISOString(),
  parseValue: (value) => new Date(value),
  parseLiteral: (ast) => {
    if (ast.kind === Kind.STRING) {
      return new Date(ast.value);
    }
    return null;
  },
});

// Custom Scalar for Type ANY
const MixedType = new GraphQLScalarType({
  name: 'MixedType',
  description: 'A field that can represent multiple types (String, Boolean, Number)',
  parseValue(value) {
    return value;
  },
  serialize(value) {
    return value;
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
