const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLBoolean,
    GraphQLNonNull,
    GraphQLID,
    GraphQLInt,
    GraphQLList
  } = require('graphql');
const GraphQLDate = require('graphql-date')

const ValidForType = require('./generics/ValidForType');
// GraphQL ObjectType für PartyCreditProfile
const PartyCreditProfileType = new GraphQLObjectType({
  name: 'PartyCreditProfile',
  fields: () => ({
    creditAgencyName: { type: GraphQLString },
    creditAgencyType: { type: GraphQLString },
    ratingReference: { type: GraphQLString },
    ratingScore: { type: GraphQLInt },
    lastExecuted: { type: GraphQLDate }, // GraphQLDate für Date-Typ
    validFor: { type: ValidForType }, // Falls ValidFor ein Objekt ist
    /* "@baseType": { type: GraphQLString },
    "@schemaLocation": { type: GraphQLString },
    "@type": { type: GraphQLString } */
  })
});
  
  const OrganizationType = new GraphQLObjectType({
    name: 'Organization',
    description: 'Represents an organization, including details such as name, type, and whether it is a legal entity or head office.',
    fields: {
      id: {
        type: GraphQLID,
        description: 'Unique identifier for the organization.',
      },
      isHeadOffice: {
        type: GraphQLBoolean,
        description: 'Indicates whether the organization is the head office.',
      },
      isLegalEntity: {
        type: GraphQLBoolean,
        description: 'Indicates whether the organization is a legal entity.',
      },
      name: {
        type: GraphQLString,
        description: 'The name of the organization.',
      },
      organizationType: {
        type: GraphQLString,
        description: 'The type of organization, such as "Corporation", "Non-profit", etc.',
      },
      tradingName: {
        type: GraphQLString,
        description: 'The type of organization, such as "Corporation", "Non-profit", etc.',
      },
      tradeRegisterNumber: {
        type: GraphQLString,
        description: 'The type of organization, such as "Corporation", "Non-profit", etc.',
      },
      creditRating: {
        type: new GraphQLList(PartyCreditProfileType),
        args: {
          ratingScore_gt: { type: GraphQLInt },
          sortBy: { type: GraphQLString } // Argument zur Steuerung der Sortierung
        },
        resolve(parent, args) {
          let ratings = parent.creditRating;

          // Filter auf Rating-Score > ratingScore_gt
          if (args.ratingScore_gt) {
            ratings = ratings.filter(rating => rating.ratingScore > args.ratingScore_gt);
          }

          // Sortierung nach ratingScore, standardmäßig absteigend
          if (args.sortBy === 'asc') {
            ratings = ratings.sort((a, b) => a.ratingScore - b.ratingScore); // Aufsteigend
          } else {
            ratings = ratings.sort((a, b) => b.ratingScore - a.ratingScore); // Absteigend (Standard)
          }

          return ratings;
        }
      }
    },
  });
  
  module.exports = OrganizationType;
  