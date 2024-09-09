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
      }
    },
  });
  
  module.exports = GeographicAddressType;
  