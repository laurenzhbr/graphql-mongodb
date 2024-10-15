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
    lastExecuted: { type: GraphQLDate },
    validFor: { type: ValidForType },
  })
});

const ContactMediumType = new GraphQLObjectType({
  name: 'ContactMedium',
  fields: () => ({
    mediumType: { type: GraphQLString },
    preferred: { type: GraphQLBoolean },
    characteristic: { type: CharacteristicType },
    validFor: { type: ValidForType },
  }),
});

const CharacteristicType = new GraphQLObjectType({
  name: 'ContactCharacteristic',
  fields: () => ({
    city: { type: GraphQLString },
    contactType: { type: GraphQLString },
    country: { type: GraphQLString },
    emailAddress: { type: GraphQLString },
    faxNumber: { type: GraphQLString },
    phoneNumber: { type: GraphQLString },
    postCode: { type: GraphQLString },
    socialNetworkId: { type: GraphQLString },
    stateOrProvince: { type: GraphQLString },
    street1: { type: GraphQLString },
    street2: { type: GraphQLString },
  }),
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
      description: 'If value is true, the organization is the head office',
    },
    isLegalEntity: {
      type: GraphQLBoolean,
      description: 'If value is true, the organization is a legal entity known by a national referential.',
    },
    name: {
      type: GraphQLString,
      description: 'Organization name (department name for example)',
    },
    organizationType: {
      type: GraphQLString,
      description: 'Type of Organization (company, department...).',
    },
    tradingName: {
      type: GraphQLString,
      description: 'Name that the organization (unit) trades under',
    },
    tradeRegisterNumber: {
      type: GraphQLString,
      description: 'The type of organization, such as "Corporation", "Non-profit", etc.',
    },
    status:{
      type: GraphQLString,
      description: 'Status of the organization'
    },
    contactMedium: {
      type: new GraphQLList(ContactMediumType),
      description: 'A list of contact mediums associated with the organization',
    },
    creditRating: {
      type: new GraphQLList(PartyCreditProfileType),
      args: {
        ratingScore_gt: { type: GraphQLInt },
        sortBy: { type: GraphQLString }
      },
      resolve(parent, args) {
        let ratings = parent.creditRating;

        // Filter auf Rating-Score > ratingScore_gt
        if (args.ratingScore_gt) {
          ratings = ratings.filter(rating => rating.ratingScore > args.ratingScore_gt);
        }

        if (args.sortBy === 'asc') {
          ratings = ratings.sort((a, b) => a.ratingScore - b.ratingScore);
        } else {
          ratings = ratings.sort((a, b) => b.ratingScore - a.ratingScore);
        }

        return ratings;
      }
    }
  },
});

module.exports = OrganizationType;
