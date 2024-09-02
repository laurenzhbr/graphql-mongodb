const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLNonNull,
    GraphQLID
  } = require('graphql');
  
  const GeographicAddressType = new GraphQLObjectType({
    name: 'GeographicAddress',
    description: 'Represents a geographic address, including details like street name, city, country, etc.',
    fields: {
      id: {
        type: new GraphQLNonNull(GraphQLID),
        description: 'Unique identifier for the geographic Adress.',
      },
      city: {
        type: GraphQLString,
        description: 'The city where the address is located.',
      },
      country: {
        type: GraphQLString,
        description: 'The country where the address is located.',
      },
      locality: {
        type: GraphQLString,
        description: 'A locality within a city, such as a neighborhood or district.',
      },
      name: {
        type: GraphQLString,
        description: 'The name associated with the address, possibly a building or complex name.',
      },
      postcode: {
        type: GraphQLString,
        description: 'The postal code for the address.',
      },
      stateOrProvince: {
        type: GraphQLString,
        description: 'The state or province where the address is located.',
      },
      streetName: {
        type: GraphQLString,
        description: 'The name of the street.',
      },
      streetNr: {
        type: GraphQLString,
        description: 'The primary street number of the address.',
      },
      streetNrLast: {
        type: GraphQLString,
        description: 'The last street number in a range, if applicable.',
      },
      streetNrLastSuffix: {
        type: GraphQLString,
        description: 'The suffix of the last street number in a range, if applicable.',
      },
      streetNrSuffix: {
        type: GraphQLString,
        description: 'The suffix of the street number, such as a letter or fraction.',
      },
      streetSuffix: {
        type: GraphQLString,
        description: 'The suffix of the street, such as "Avenue", "Boulevard", etc.',
      },
      streetType: {
        type: GraphQLString,
        description: 'The type of street, such as "Street", "Road", etc.',
      },
    },
  });
  
  module.exports = GeographicAddressType;
  