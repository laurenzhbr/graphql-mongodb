const { GraphQLSchema, GraphQLInt, GraphQLObjectType, GraphQLString, GraphQLList, GraphQLNonNull, GraphQLID } = require('graphql');
const ResourceType = require('../types/resource');
const DigitalIdentityType = require('../types/digitalIdentity')
const Resource = require('../../models/ResourceModels/Resource');
const DigitalIdentity = require('../../models/DigtialIdentityModels/DigitalIdentity')
const GeographicAddress = require('../../models/GeoAdressModels/GeographicAdress')

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    resource: {
      type: ResourceType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return Resource.findOne({ _id: args.id });
      },
    },
    resources: {
      type: new GraphQLList(ResourceType),
      resolve(parent, args) {
        return Resource.find({});
      },
    },
    digitalIdentity: {
      type: DigitalIdentityType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return DigitalIdentity.findOne({ _id: args.id }); // Nutze findById, um die DigitalIdentity basierend auf der ID abzurufen
      },
    },
    digitalIdentitiesByStatus:{
      type: new GraphQLList(DigitalIdentityType),
      args: {status: { type: GraphQLString}},
      resolve(parent, args) {
        return DigitalIdentity.find({'status': args.status});
      }
    },
    searchResourcesByCategoryAnCapacityUsage:{
      type: new GraphQLList(ResourceType),
      args: {category: { type: GraphQLString}, capacity: { type: GraphQLInt }},
      resolve(parent, args) {
        // Filter für Kapazitätsnutzung
        const filterObj = {};
        if (args.capacity) {
          filterObj['resourceCharacteristic'] = {
            $elemMatch: {
              name: 'current_capacity_usage',
              value: { $gt: args.capacity },
            },
          };
          return Resource.find(filterObj);
        }
      }
    },
    resourcesByCategoryAndCity:{
      type: new GraphQLList(ResourceType),
      args: {
        category: { type: GraphQLString },
        city: { type: GraphQLString }
      },
      async resolve(parent, args){
        // Filter nach Kategorie
        const categoryFilter = { category: args.category };

        // Finde alle Ressourcen der angegebenen Kategorie
        const resources = await Resource.find(categoryFilter);

        const filteredResources = [];

        // 1. Schritt: Für jede Ressource, die GeographicAddress (relatedPlace) abrufen und Stadt überprüfen
        for (const resource of resources) {
          if (resource.place && resource.place.id) {
            // Abrufen der GeographicAddress anhand der place ID
            const geographicAddress = await GeographicAddress.findById(resource.place.id);
            
            // Prüfen, ob die Stadt der gewünschten Stadt entspricht
            if (geographicAddress && geographicAddress.city === args.city) {
              filteredResources.push(resource);
            }
          }
        }
        return filteredResources;
      }
    }, 
  },
});


const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addResource: {
      type: ResourceType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
        href: { type: new GraphQLNonNull(GraphQLString) },
        category: { type: GraphQLString },
        description: { type: GraphQLString },
        name: { type: GraphQLString },
        resourceVersion: { type: GraphQLString },
        startOperatingDate: { type: GraphQLString },
        // Hier könntest du weitere Felder wie activationFeature, attachment usw. hinzufügen
      },
      resolve(parent, args) {
        const resource = new Resource(args);
        return resource.save();
      },
    }/* ,
    deleteResource: {
      type: ResourceType,
      args: { id: { type: new GraphQLNonNull(GraphQLString) } },
      resolve(parent, args) {
        return Resource.findOneAndDelete({ id: args.id });
      },
    },
    updateResource: {
      type: ResourceType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
        href: { type: GraphQLString },
        category: { type: GraphQLString },
        description: { type: GraphQLString },
        name: { type: GraphQLString },
        resourceVersion: { type: GraphQLString },
        startOperatingDate: { type: GraphQLString },
        // Hier ebenfalls weitere Felder ergänzen
      },
      resolve(parent, args) {
        return Resource.findOneAndUpdate({ id: args.id }, args, { new: true });
      },
    }, */
  },
});

module.exports = { RootQuery, Mutation };
