const { GraphQLBoolean, GraphQLInt, GraphQLObjectType, GraphQLString, GraphQLList, GraphQLNonNull, GraphQLID } = require('graphql');
const ResourceType = require('../types/resource');
const DigitalIdentityType = require('../types/digitalIdentity')
const Resource = require('../../models/ResourceModels/Resource');
const Organization = require('../../models/PartyModels/Organization');
const DigitalIdentity = require('../../models/DigtialIdentityModels/DigitalIdentity');
const GeographicAddress = require('../../models/GeographicAddressModels/GeographicAddress');
const OrganizationType = require('../types/organization');
const DigitalIdentityUpdateInput = require('../types/inputs/DigitalIdentityInputType');
const ResourceInputType = require('../types/inputs/ResourceInputType');

const RootQuery = new GraphQLObjectType({
  name: 'RootQuery',
  description: 'Entry points for fetching data',
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
      args: {
        category: {type: GraphQLString, description: 'category of the resources'},
        capacity: {type: GraphQLInt, description: 'current capacity usage of the resource'},
        resourceStatus: { type: GraphQLString, description: 'enum: standby, alarm, available, reserved, unknown, suspended'},
        operationalState: { type: GraphQLString, description: 'enum: enable, disable' },
        administrativeState: { type: GraphQLString, description: 'enum: locked, unlocked, shutdown' },
        offset: { type: GraphQLInt, description: 'value for skipping first x entries of data'},
        limit: { type: GraphQLInt, description: 'value for limiting the amount of data'},
        sort: { type: GraphQLString, description: 'field and direction for sorting results ({field} => asc sorting | -{field} => desc sorting'},
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
    searchResourcesInCity:{
      type: new GraphQLList(ResourceType),
      args: {
        category: { type: GraphQLString },
        city: { type: GraphQLString },
        offset: { type: GraphQLInt, description: 'value for skipping first x entries of data (optional)'},
        limit: { type: GraphQLInt, description: 'value for limiting the amount of data (optional)'},
        sort: { type: GraphQLString, description: 'field and direction for sorting results ({field} => asc sorting | -{field} => desc sorting'},
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
    digitalIdentity: {
      type: DigitalIdentityType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return DigitalIdentity.findOne({ _id: args.id }); // Nutze findById, um die DigitalIdentity basierend auf der ID abzurufen
      },
    },
    digitalIdentities:{
      type: new GraphQLList(DigitalIdentityType),
      args: {
        status: { type: GraphQLString, description: 'status of the Digital Identity'}, 
        offset: { type: GraphQLInt, description: 'value for skipping first x entries of data (optional)'},
        limit: { type: GraphQLInt, description: 'value for limiting the amount of data (optional)'},
        sort: { type: GraphQLString, description: 'field and direction for sorting results ( {field} => asc sorting || -{field} => desc sorting )'},
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
      args: {
        organizationType: { type: GraphQLString },
        status: { type: GraphQLString },
        creditRating_gt: { type: GraphQLInt },
        offset: { type: GraphQLInt, description: 'value for skipping first x entries of data (optional)'},
        limit: { type: GraphQLInt, description: 'value for limiting the amount of data (optional)'},
        sort: { type: GraphQLString, description: 'field and direction for sorting results ({field} => asc sorting | -{field} => desc sorting'},
      },
      async resolve(parent, args){
        limit = parseInt(args.limit) || 0
        offset = parseInt(args.offset) || 0
        sortField = args.sort ? args.sort.replace('-', '') : 'id';
        sortDirection = args.sort && args.sort.startsWith('-') ? -1 : 1;

        // Filter-Objekt
        const filter = {
          ...(args.organizationType && { organizationType: { $in: args.organizationType } }),
          ...(args.status && { status: args.status }),
          ...(args.creditRating_gt && {
            creditRating: {
              $elemMatch: { ratingScore: { $gt: args.creditRating_gt } }
            }
          })
        };
        return Organization.find(filter)
        .sort({ [sortField]: sortDirection })
        .skip(offset)
        .limit(limit)
      }
    }
  },
});

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  description: 'Entry points for manipulating data',
  fields: {
    createResource: {
      type: ResourceType,
      args: {
        input: { type: ResourceInputType } // Die Input-Daten für die Ressource
      },
      async resolve(parent, { input }) {
        // Erstelle ein neues Resource-Dokument basierend auf den Eingabedaten
        const resource = new Resource(input);
          
        // Speichern der neuen Ressource in der Datenbank
        const newResource = await resource.save();
        
        // Rückgabe der erstellten Ressource
        return newResource;
      }
    },
    updateDigitalIdentity: {
      type: DigitalIdentityType,
      args: {
        id: { type: GraphQLID },
        data: { type: DigitalIdentityUpdateInput }  // Verwende den Input-Type hier
      },
      async resolve(parent, { id, data }) {

        const digitalIdentity = await DigitalIdentity.findById(id);

        // Aktualisiere nur die übermittelten Felder
        Object.assign(digitalIdentity, data);

        // Speichere das Dokument, damit Pre-save-Hooks ausgeführt werden
        const updatedDigitalIdentity = await digitalIdentity.save();
        return updatedDigitalIdentity;
    }
    },
    deleteDigitalIdentitesByStatus: {
      type: DigitalIdentityType, // Gibt die Anzahl der gelöschten Dokumente zurück
      description: 'Deletes specific amount of DigitalIdentities based on their status',
      args: {
        status: { type: new GraphQLNonNull(GraphQLString) }, // Filter basierend auf dem Status
        limit: { type: GraphQLInt, description: 'Anzahl der zu löschenden Einträge (optional)', defaultValue: 10} // Limit-Argument}
      },
      async resolve(_, { status, limit }) {
        try {
          // Finde die IDs der DigitalIdentities, die gelöscht werden sollen
          const identitiesToDelete = await DigitalIdentity.find({ status })
            .limit(limit)
            .exec();
  
          // Lösche die DigitalIdentities und speichere die gelöschten Datensätze
          const deletedIdentities = [];
          for (let identity of identitiesToDelete) {
            const deletedIdentity = await DigitalIdentity.findByIdAndDelete(identity._id);
            deletedIdentities.push(deletedIdentity);
          }
  
          // Rückgabe der gelöschten Identitäten und einer Bestätigungsmeldung
          /* return {
            message: `${deletedIdentities.length} DigitalIdentities mit Status '${status}' erfolgreich gelöscht.`,
            deletedIdentities
          }; */
        } catch (error) {
          throw new Error('Löschvorgang fehlgeschlagen: ' + error.message);
        }
      }

      /* async resolve(parent, { status, limit }) {
        // Finde die Ressourcen, die gelöscht werden sollen
        const resourcesToDelete = await DigitalIdentity.find({ status: status })
          .limit(limit || 0) // Wenn kein Limit gesetzt ist, werden alle passenden gelöscht
          // .select('_id'); // Nur die IDs holen

        // Extrahiere die IDs
        const idsToDelete = resourcesToDelete.map(resource => resource._id);

        // Lösche die gefundenen Ressourcen
        const result = await DigitalIdentity.deleteMany({ _id: { $in: idsToDelete } });

        // Gibt die Anzahl der gelöschten Einträge zurück
        return result.deletedCount;
      }, */
    },
    deleteDigitalIdentity: {
      type: new GraphQLObjectType({
        name: 'DeleteResponse',
        fields: {
          success: { type: GraphQLBoolean },
          message: { type: GraphQLString }
        }
      }),
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) }
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

    /* ,
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
