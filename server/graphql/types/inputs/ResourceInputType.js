const {
    GraphQLInputObjectType,
    GraphQLString,
    GraphQLID,
    GraphQLList,
    GraphQLNonNull,
  } = require('graphql');
  const { GraphQLDateTime } = require('../../customScalars/customScalars'); // Falls du einen Custom Scalar für DateTime verwendest

  // Enum-Typen, falls sie verwendet werden
  const {
    ResourceAdministrativeStateType,
    ResourceOperationalStateType,
    ResourceStatusType,
    ResourceUsageStateType,
  } = require('../enums');
  

  const ResourceRefInputType = new GraphQLInputObjectType({
    name: 'ResourceRefInput',
    fields: {
      id: { type: GraphQLID }, // ID der Ressource
      href: { type: GraphQLString }, // Hyperlink zur Ressource
      category: { type: GraphQLString }, // Kategorie der Ressource
      name: { type: GraphQLString }, // Name der Ressource
    },
  });
  
  // InputType für ResourceRelationship
  const ResourceRelationshipInputType = new GraphQLInputObjectType({
    name: 'ResourceRelationshipInput',
    fields: {
      relationshipType: { type: GraphQLString }, // Art der Beziehung
      resource: { type: ResourceRefInputType }, // Eingebettete Ressource mit ID, href, category und name
    },
  });

  // InputType für ResourceRelationship
  const relatedPartyInputType = new GraphQLInputObjectType({
    name: 'RelatedPartyInput',
    fields: {
      id: { type: GraphQLID }, // Art der Beziehung
      name: { type: GraphQLString }, // Eingebettete Ressource mit ID, href, category und name
      role: { type: GraphQLString },
    },
  });
  
  // InputType für Characteristic
  const CharacteristicInputType = new GraphQLInputObjectType({
    name: 'CharacteristicInput',
    fields: {
      name: { type: new GraphQLNonNull(GraphQLString) }, // Name der Characteristic
      valueType: { type: GraphQLString }, // Der Werttyp
      value: { type: new GraphQLNonNull(GraphQLString) }, // Der tatsächliche Wert
    },
  });
  
  // InputType für Note
  const NoteInputType = new GraphQLInputObjectType({
    name: 'NoteInput',
    fields: {
      author: { type: GraphQLString },
      date: { type: GraphQLDateTime },
      text: { type: GraphQLString },
    },
  });
  
  // InputType für Place (Geographic Address)
  const PlaceInputType = new GraphQLInputObjectType({
    name: 'PlaceInput',
    fields: {
      id: { type: GraphQLString }, // Die ID der Place
      name: { type: GraphQLString },
    },
  });
  
  // InputType für die Ressource
  const ResourceInputType = new GraphQLInputObjectType({
    name: 'ResourceInput',
    fields: {
      id: {
        type: GraphQLID, // Falls du ein Update machst, könnte eine ID übergeben werden
      },
      description: {
        type: GraphQLString,
        description: 'Eine Freitextbeschreibung der Ressource.',
      },
      category: {
        type: GraphQLString,
        description: 'Die Kategorie der Ressource.',
      },
      value: {
        type: GraphQLString,
        description: 'Der Wert, der mit der Ressource verknüpft ist.',
      },
      endOperatingDate: {
        type: GraphQLDateTime,
        description: 'Das Datum, bis zu dem die Ressource in Betrieb ist.',
      },
      name: {
        type: GraphQLString,
        description: 'Der Name der Ressource.',
      },
      administrativeState: {
        type: ResourceAdministrativeStateType,
        description: 'Der administrative Zustand der Ressource.',
      },
      operationalState: {
        type: ResourceOperationalStateType,
        description: 'Der operative Zustand der Ressource.',
      },
      resourceCharacteristic: {
        type: new GraphQLList(CharacteristicInputType),
        description: 'Eine Liste von Merkmalen, die mit der Ressource verknüpft sind.',
      },
      relatedParties: {
        type: new GraphQLList(relatedPartyInputType), // Liste von IDs der verknüpften Organisationen
        description: 'Verknüpfte Parteien zur Ressource.',
      },
      note: {
        type: new GraphQLList(NoteInputType),
        description: 'Zusätzliche Notizen zur Ressource.',
      },
      place: {
        type: PlaceInputType,
        description: 'Der Ort, der mit dieser Ressource verknüpft ist.',
      },
      resourceRelationship: {
        type: new GraphQLList(ResourceRelationshipInputType),
        description: 'Verknüpfte Ressourcenbeziehungen.',
      },
      resourceStatus: {
        type: ResourceStatusType,
        description: 'Der aktuelle Status der Ressource.',
      },
      usageState: {
        type: ResourceUsageStateType,
        description: 'Der aktuelle Nutzungsstatus der Ressource.',
      },
      startOperatingDate: {
        type: GraphQLDateTime,
        description: 'Das Datum, ab dem die Ressource in Betrieb ist.',
      },
      version: {
        type: GraphQLString,
        description: 'Die Version der Ressource.',
      },
    },
  });
  
  module.exports = ResourceInputType;
  