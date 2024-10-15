const { GraphQLBoolean, GraphQLInt, GraphQLObjectType, GraphQLString, GraphQLList, GraphQLNonNull, GraphQLID } = require('graphql');
const ResourceType = require('../types/resource');
const DigitalIdentityType = require('../types/digitalIdentity')
const Resource = require('../../models/ResourceModels/Resource');
const Organization = require('../../models/PartyModels/Organization');
const DigitalIdentity = require('../../models/DigtialIdentityModels/DigitalIdentity');
const GeographicAddress = require('../../models/GeographicAddressModels/GeographicAddress');
const OrganizationType = require('../types/organization');
const {DigitalIdentityCreateInput,DigitalIdentityUpdateInput} = require('../types/inputs/DigitalIdentityInputType');
const ResourceInputType = require('../types/inputs/ResourceInputType');

const RootQuery = new GraphQLObjectType({
  name: 'RootQuery',
  description: 'Entry points for fetching data, including resources, digital identities, and organizations',
  fields: {
    resource: {
      type: ResourceType,
      description: 'Fetch a single Resource by its unique ID.',
      args: { id: { type: GraphQLID, description: 'The unique ID of the resource to retrieve' } },
      resolve(parent, args) {
        return Resource.findOne({ _id: args.id });
      },
    },
    resources: {
      type: new GraphQLList(ResourceType),
      description: 'Fetch a list of Resources.',
      args: {
        category: {type: GraphQLString, description: 'Category of the Resources'},
        capacity: {type: GraphQLInt, description: 'current capacity usage of the resource'},
        resourceStatus: { type: GraphQLString, description: 'enum: standby, alarm, available, reserved, unknown, suspended'},
        operationalState: { type: GraphQLString, description: 'enum: enable, disable' },
        administrativeState: { type: GraphQLString, description: 'enum: locked, unlocked, shutdown' },
        offset: { type: GraphQLInt, description: 'value for skipping first x entries of data'},
        limit: { type: GraphQLInt, description: 'value for limiting the amount of data'},
        sort: { type: GraphQLString, description: 'Sort results by a specific field ({field} => ascending, -{field} => descending)'},
      },
      async resolve(parent, args) {
        limit = parseInt(args.limit) || 0
        offset = parseInt(args.offset) || 0
        sortField = args.sort ? args.sort.replace('-', '') : 'id';
        sortDirection = args.sort && args.sort.startsWith('-') ? -1 : 1;

        const filter = {
          ...(args.category && { category: args.category }),
          ...(args.resourceStatus && { resourceStatus: args.resourceStatus }),
          ...(args.operationalState && { operationalState: args.operationalState }),
          ...(args.administrativeState && { administrativeState: args.administrativeState }),
          ...(args.capacity && {
            resourceCharacteristic: {
              $elemMatch: {
                name: 'current_capacity_usage',
                value: { $gt: args.capacity },
              },
            },
          }),
        }
        return Resource.find(filter)
        .sort({ [sortField]: sortDirection})
        .skip(offset)
        .limit(limit)
      },
    },
    digitalIdentity: {
      type: DigitalIdentityType,
      description: 'Fetch a single Digital Identity by its unique ID.',
      args: { id: { type: GraphQLID, description: 'The unique ID of the digital identity to retrieve' } },
      resolve(parent, args) {
        return DigitalIdentity.findOne({ _id: args.id });
      },
    },
    digitalIdentities:{
      type: new GraphQLList(DigitalIdentityType),
      description: 'Fetch a list of Digital Identities.',
      args: {
        status: { type: GraphQLString, description: 'status of the Digital Identity'}, 
        offset: { type: GraphQLInt, description: 'value for skipping first x entries of data (optional)'},
        limit: { type: GraphQLInt, description: 'value for limiting the amount of data (optional)'},
        sort: { type: GraphQLString, description: 'Sort results by a specific field ({field} => ascending, -{field} => descending)'},
      },
      async resolve(parent, args) {
        limit = parseInt(args.limit) || 0;
        offset = parseInt(args.offset) || 0;
        sortField = args.sort ? args.sort.replace('-', '') : 'id';
        sortDirection = args.sort && args.sort.startsWith('-') ? -1 : 1;

        const filter = {
          ...(args.status && { status: args.status }),
        }

        return DigitalIdentity.find(filter)
        .sort({ [sortField]: sortDirection })
        .skip(offset)
        .limit(limit)
      }
    },
    organizations: {
      type: new GraphQLList(OrganizationType),
      description: 'Fetch a list of organizations.',
      args: {
        organizationType: { type: GraphQLString, description: 'Type of the organization' },
        status: { type: GraphQLString, description: 'Status of the organization' },
        creditRating_gt: { type: GraphQLInt, description: 'Filter organizations where creditRating.ratingScore is greater than this value' },
        creditRating_lt: { type: GraphQLInt, description: 'Filter organizations where creditRating.ratingScore is less than this value' },
        creditRating_gte: { type: GraphQLInt, description: 'Filter organizations where creditRating.ratingScore is greater than or equal to this value'},
        creditRating_lte: { type: GraphQLInt, description: 'Filter organizations where creditRating.ratingScore is less than or equal to this value'},        
        offset: { type: GraphQLInt, description: 'value for skipping first x entries of data (optional)'},
        limit: { type: GraphQLInt, description: 'value for limiting the amount of data (optional)'},
        sort: { type: GraphQLString, description: 'Sort results by a specific field ({field} => ascending, -{field} => descending)'},
      },
      async resolve(parent, args){
        limit = parseInt(args.limit) || 0
        offset = parseInt(args.offset) || 0
        sortField = args.sort ? args.sort.replace('-', '') : 'id';
        sortDirection = args.sort && args.sort.startsWith('-') ? -1 : 1;

        const ratingScoreFilter = {
          ...(args.creditRating_gt ? { $gt: args.creditRating_gt } : {}),
          ...(args.creditRating_lt ? { $lt: args.creditRating_lt } : {}),
          ...(args.creditRating_gte ? { $gte: args.creditRating_gte } : {}),
          ...(args.creditRating_lte ? { $lte: args.creditRating_lte } : {})
      };

        const filter = {
          ...(args.organizationType && { organizationType: { $in: args.organizationType } }),
          ...(args.status && { status: args.status }),
          ...(Object.keys(ratingScoreFilter).length > 0 && {
            creditRating: { $elemMatch: { ratingScore: ratingScoreFilter } }
          }),
        };
        return Organization.find(filter)
        .sort({ [sortField]: sortDirection })
        .skip(offset)
        .limit(limit)
      }
    },
  },
});

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  description: 'Entry points for manipulating data',
  fields: {
    createResource: {
      type: ResourceType,
      description: 'Create a new resource in the database',
      args: {
        data: { type: ResourceInputType, description: 'Input data for creating a new resource' }
      },
      async resolve(parent, { data }) {
        // Create new Resource object with given data
        const resource = new Resource(data);
          
        // Save new Resource to DB
        const newResource = await resource.save();
        
        // return new Object
        return newResource;
      }
    },
    createDigitalIdentity: {
      type: DigitalIdentityType,
      description: 'Create a new digital identity in the database',
      args: {
        data: { type: DigitalIdentityCreateInput, description: 'Input data for creating a new digital identity' }
      },
      async resolve(parent, { data }) {
        // Create new DigitalIdentity object with given data
        const digitalIdentity = new DigitalIdentity(data);
          
        // Save new DigitalIdentity to DB
        const newDigitalIdentity = await digitalIdentity.save();
        
        // return new Object
        return newDigitalIdentity;
      }
    },
    updateDigitalIdentity: {
      type: DigitalIdentityType,
      description: 'Update a specific Digital Identity',
      args: {
        id: { type: GraphQLID, description: 'Unique ID of the Digital Identity to update' },
        data: { type: DigitalIdentityUpdateInput, 'description': 'Data for updating the Digital Identity' }
      },
      async resolve(parent, { id, data }) {

        const digitalIdentity = await DigitalIdentity.findById(id);

        Object.assign(digitalIdentity, data);

        const updatedDigitalIdentity = await digitalIdentity.save();
        return updatedDigitalIdentity;
    }
    },
    deleteDigitalIdentity: {
      type: new GraphQLObjectType({
        name: 'DeleteResponse',
        description: 'Response after deleting a Digital Identity',
        fields: {
          success: { type: GraphQLBoolean, description: 'Indicates if the deletion was successful' },
          message: { type: GraphQLString, description: 'Message with details about the deletion result' }
        }
      }),
      description: 'Delete a specific Digital Identity from the database',
      args: {
        id: { type: new GraphQLNonNull(GraphQLID), description: 'Unique ID of the Digital Identity to delete' }
      },
      resolve: async (_, { id }) => {
        try {
          const deletedIdentity = await DigitalIdentity.findByIdAndDelete(id);
          if (!deletedIdentity) {
            return { success: false, message: `DigitalIdentity with ID ${id} not found.` };
          }
          return { success: true, message: `DigitalIdentity with ID ${id} successfully deleted.` };
        } catch (error) {
          return { success: false, message: `Error: ${error.message}` };
        }
      }
    }
  },
});

module.exports = { RootQuery, Mutation };
