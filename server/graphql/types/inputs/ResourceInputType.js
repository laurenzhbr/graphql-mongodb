const {
    GraphQLInputObjectType,
    GraphQLString,
    GraphQLID,
    GraphQLList,
    GraphQLNonNull,
  } = require('graphql');
  const { GraphQLDateTime, MixedType } = require('../../customScalars/customScalars'); 

  const {
    ResourceAdministrativeStateType,
    ResourceOperationalStateType,
    ResourceStatusType,
    ResourceUsageStateType,
  } = require('../enums');
  

  const ResourceRefInputType = new GraphQLInputObjectType({
    name: 'ResourceRefInput',
    fields: {
      id: { type: GraphQLID }, 
      href: { type: GraphQLString }, 
      category: { type: GraphQLString }, 
      name: { type: GraphQLString }, 
    },
  });
  
  // InputType for resourceRelationship
  const ResourceRelationshipInputType = new GraphQLInputObjectType({
    name: 'ResourceRelationshipInput',
    fields: {
      relationshipType: { type: GraphQLString }, 
      resource: { type: ResourceRefInputType },
    },
  });

  // InputType for relatedParty (Organization)
  const relatedPartyInputType = new GraphQLInputObjectType({
    name: 'RelatedPartyInput',
    fields: {
      id: { type: GraphQLID },
      name: { type: GraphQLString },
      role: { type: GraphQLString },
    },
  });
  
  // InputType for ResourceCharacteristic
  const CharacteristicInputType = new GraphQLInputObjectType({
    name: 'CharacteristicInput',
    fields: {
      name: { type: new GraphQLNonNull(GraphQLString) }, 
      valueType: { type: GraphQLString }, 
      value: { type: new GraphQLNonNull(MixedType) },
    },
  });
  
  //InputType for note
  const NoteInputType = new GraphQLInputObjectType({
    name: 'NoteInput',
    fields: {
      author: { type: GraphQLString },
      date: { type: GraphQLDateTime },
      text: { type: GraphQLString },
    },
  });
  
  // InputType for place (Geographic Address)
  const PlaceInputType = new GraphQLInputObjectType({
    name: 'PlaceInput',
    fields: {
      id: { type: GraphQLString },
      name: { type: GraphQLString },
    },
  });
  
  // InputType für die Ressource
  const ResourceInputType = new GraphQLInputObjectType({
    name: 'ResourceInput',
    fields: {
      id: {
        type: GraphQLID,
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
        type: new GraphQLList(relatedPartyInputType),
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
  