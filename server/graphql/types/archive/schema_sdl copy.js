const typeDefs = `
    scalar URL @specifiedBy(url: "https://tools.ietf.org/html/rfc3986")

    """Query for fetching one Resource"""
    type Query{
        resource(id: ID!): Resource
        resources: [Resource!]
    }

    """Write Resource record into dataSource"""
    type Mutation {
        createResource(resourceInput: Resource!): Resource
        deleteResource(id: ID!): Resource
        updateResource(resourceInput: Resource!): Resource
    }

    """Input type for creating Resource object"""
    input ResourceInput {
        id: ID
        name: String!
        href: URL
        category: String
        description: String
        endOperatingDate: DateTime
        startOperatingDate: DateTime
        activationFeature: [Feature]
        administrativeState: ResourceAdministrativeStateType
        attachment: [AttachmentRefOrValue]
        note: [Note]
        operationalState: ResourceOperationalStateType
        place: RelatedPlaceRefOrValue
        relatedParty: [RelatedParty]
        resourceCharacteristic: [Characteristic]
        resourceRelationship: [ResourceRelationship]
        resourceSpecification: ResourceSpecificationRef
        resourceStatus: ResourceStatusType
        usageState: ResourceUsageStateType
        baseType: String
        schemaLocation: String
        type: String
    }

    """
    Enum for the administrative state of a resource.
    """
    enum ResourceAdministrativeStateType {
        """Resource is locked."""
        locked
        """Resource is unlocked."""
        unlocked
        """Resource is in shutdown state."""
        shutdown
    }

    """
    Enum for the operational state of a resource.
    """
    enum ResourceOperationalStateType {
        """Resource is enabled."""
        enable
        """Resource is disabled."""
        disable
    }

    """
    Enum for the status of a resource.
    """
    enum ResourceStatusType {
        """Resource is in standby."""
        standby
        """Resource is in alarm state."""
        alarm
        """Resource is available."""
        available
        """Resource is reserved."""
        reserved
        """Resource status is unknown."""
        unknown
        """Resource is suspended."""
        suspended
    }

    """
    Enum for the usage state of a resource.
    """
    enum ResourceUsageStateType {
        """Resource is idle."""
        idle
        """Resource is active."""
        active
        """Resource is busy."""
        busy
    }

    """
    Represents a period of time, either as a startDateTime, endDateTime, or both.
    """
    type TimePeriod {
        """Start of the time period, using IETC-RFC-3339 format."""
        startDateTime: DateTime
        """End of the time period, using IETC-RFC-3339 format."""
        endDateTime: DateTime
    }



    """
    Extra information about a given entity.
    """
    type Note {
        """Identifier of the note within its containing entity (may or may not be globally unique, depending on provider implementation)."""
        id: ID
        """Hyperlink reference."""
        href: URL
        """Author of the note."""
        author: String
        """Date of the note."""
        date: DateTime
        """Text of the note."""
        text: String
        """When sub-classing, this defines the super-class."""
        baseType: String
        """A URI to a JSON-Schema file that defines additional attributes and relationships."""
        schemaLocation: URL
        """When sub-classing, this defines the sub-class Extensible name."""
        type: String
    }

    "all inputs - including stock, parts, assets, production components etc."
    type Resource {
        """Identifier of an instance of the resource. Required to be unique within the
        resource type. Used in URIs as the identifier for specific instances of a type."""
        id: ID!
        """The URI for the object itself."""
        href: URL!
        """Category of the concrete resource. e.g Gold, Silver for MSISDN concrete resource."""
        category: String
        """free-text description of the resource."""
        description: String
        """A date time( DateTime). The date till the resource is operating."""
        endOperatingDate: DateTime 
        """A string used to give a name to the resource."""
        name: String
        """A field that identifies the specific version of an instance of a resource."""
        resourceVersion: String
        """A date time( DateTime). The date from which the resource is operating."""
        startOperatingDate: DateTime
        """A list of features (Feature [*]). Applicable configuration features of a resource for activation."""
        activationFeature: [Feature]
        """A resource administrative state type (ResourceAdministrativeStateType). Tracks the
        administrative state of the resource, such as locked, unlocked, shutdown and so on."""
        administrativeState: ResourceAdministrativeStateType
        """A list of attachment ref or values (AttachmentRefOrValue [*]). the attribute
        type,schemaLocation and referredType are related to the contained entity and not to
        AttchmentRefOrValue itself."""
        attachment: [AttachmentRefOrValue]
        """A list of notes (Note [*]). Extra information about a given entity."""
        note: [Note]
        """A resource operational state type (ResourceOperationalStateType). Tracks the
        operational state of the resource, such as enable, disable and so on."""
        operationalState: ResourceOperationalStateType
        """A related place ref or value (RelatedPlaceRefOrValue). Related Entity reference. A
        related place defines a place described by reference or by value linked to a specific
        entity. The polymorphic attributes @type, @schemaLocation & @referredType are
        related to the place entity and not the RelatedPlaceRefOrValue class itself."""
        place: RelatedPlaceRefOrValue
        """A list of related parties (RelatedParty [*]). Related Entity reference. A related party
        defines party or party role linked to a specific entity."""
        relatedParty: [RelatedParty]
        """A list of characteristics (Characteristic [*]). Describes a given characteristic of an
        object or entity through a name/value pair."""
        resourceCharacteristic: [Characteristic]
        """A list of resource relationships (ResourceRelationship [*]). Linked resources to the one
        instantiate, such as [bundled] if the resource is a bundle and you want to describe the
        bundled resources inside this bundle; [reliesOn] if the resource needs another already
        owned resource to rely on (e.g. an option on an already owned mobile access
        resource) [targets] or [isTargeted] (depending on the way of expressing the link) for
        any other kind of links that may be useful."""
        resourceRelationship: [ResourceRelationship]
        """A resource specification reference (ResourceSpecificationRef). The
        ResourceSpecification is required to realize a ProductSpecification."""
        resourceSpecification: ResourceSpecificationRef
        """A resource status type (ResourceStatusType). Tracks the resource status of the
        resource, such as standby, alarm, available, reserved, suspended and so on."""
        resourceStatus: ResourceStatusType
        """A resource usage state type (ResourceUsageStateType). Tracks the usage state of the
        resource, such as idle, active, busy and so on"""
        usageState: ResourceUsageStateType
        """The @baseType attribute gives a way to provide explicitly the base of class of a given resource that has been
        extended."""
        baseType: String
        """The @schemaLocation property can be used in resources to allow specifying user-defined properties of an Entity or
        to specify the expected characteristics of an entity."""
        schemaLocation: String
        """The @type attribute provides a way to represent the actual class type of an entity."""
        type: String
    },


    """
    Related Entity reference. A related party defines party or party role linked to a specific entity.
    """
    type RelatedParty {
        """Unique identifier."""
        id: ID!
        """Hyperlink reference."""
        href: URL
        """Name of the related entity."""
        name: String
        """Role played by the related party."""
        role: String
        """When sub-classing, this defines the super-class."""
        baseType: String
        """A URI to a JSON-Schema file that defines additional attributes and relationships."""
        schemaLocation: URL
        """When sub-classing, this defines the sub-class Extensible name."""
        type: String
        """The actual type of the target instance when needed for disambiguation."""
        referredType: String!
    }

    """
    Related Entity reference. A related place defines a place described by reference or by value linked to a specific entity.
    """
    type RelatedPlaceRefOrValue {
        """Unique identifier of the place."""
        id: ID
        """Unique reference of the place."""
        href: URL
        """A user-friendly name for the place, such as [Paris Store], [London Store], [Main Home]."""
        name: String
        """Role of the place in the context of the related entity."""
        role: String!
        """When sub-classing, this defines the super-class."""
        baseType: String
        """A URI to a JSON-Schema file that defines additional attributes and relationships."""
        schemaLocation: URL
        """When sub-classing, this defines the sub-class Extensible name."""
        type: String
        """The actual type of the target instance when needed for disambiguation."""
        referredType: String
    }

    """
    A resource to be created defined by value or existing defined by reference.
    """
    type ResourceRefOrValue {
        """Identifier of an instance of the resource. Required to be unique within the resource type.
        Used in URIs as the identifier for specific instances of a type."""
        id: ID!
        """The URI for the object itself."""
        href: URL!
        """Category of the concrete resource, e.g., Gold, Silver for MSISDN concrete resource."""
        category: String
        """Free-text description of the resource."""
        description: String
        """A date (DateTime). The date until the resource is operating."""
        endOperatingDate: DateTime
        """A string used to give a name to the resource."""
        name: String
        """A field that identifies the specific version of an instance of a resource."""
        resourceVersion: String
        """A date (DateTime). The date from which the resource is operating."""
        startOperatingDate: DateTime
        """Configuration features."""
        activationFeature: [Feature]
        """Tracks the lifecycle status of the resource, such as planning, installing, operating, retiring, and so on."""
        administrativeState: ResourceAdministrativeStateType
        """Attachments, either by reference or by value."""
        attachment: [AttachmentRefOrValue]
        """Notes associated with the resource."""
        note: [Note]
        """Tracks the lifecycle status of the resource, such as planning, installing, operating, retiring, and so on."""
        operationalState: ResourceOperationalStateType
        """
        Linked place to this resource.
        """
        place: RelatedPlaceRefOrValue
        """
        Linked parties to this resource.
        """
        relatedParty: [RelatedParty]
        """
        Characteristics of the resource.
        """
        resourceCharacteristic: [Characteristic]
        """
        Relationships to other resources.
        """
        resourceRelationship: [ResourceRelationship]
        """
        Reference to the resource specification.
        """
        resourceSpecification: ResourceSpecificationRef
        """
        Tracks the lifecycle status of the resource, such as planning, installing, operating, retiring, and so on.
        """
        resourceStatus: ResourceStatusType
        """
        Tracks the usage status of the resource, such as planning, installing, operating, retiring, and so on.
        """
        usageState: ResourceUsageStateType
        """
        When subclassing, this defines the superclass.
        """
        baseType: String
        """
        A URI to a JSON Schema file that defines additional attributes and relationships.
        """
        schemaLocation: URL
        """
        When subclassing, this defines the subclass extensible name.
        """
        type: String
        """
        The actual type of the target instance when needed for disambiguation.
        """
        referredType: String
    }

    """
    Relationships between resources that are linked, such as [bundled] if the resource is a bundle and you want to describe the bundled resources inside this bundle;
    [reliesOn] if the resource needs another already owned resource to rely on (e.g., an option on an already owned mobile access resource);
    [targets] or [isTargeted] (depending on the way of expressing the link) for any other kind of links that may be useful.
    """
    type ResourceRelationship {
        """
        Unique identifier.
        """
        id: ID
        """
        Hyperlink reference.
        """
        href: URL
        """
        Type of the resource relationship, such as [bundled] if the resource is a bundle and you want to describe the bundled resources inside this bundle;
        [reliesOn] if the resource needs another already owned resource to rely on (e.g., an option on an already owned mobile access resource);
        [targets] or [isTargeted] (depending on the way of expressing the link) for any other kind of links that may be useful.
        """
        relationshipType: String!
        """
        Reference to the linked resource.
        """
        resource: ResourceRefOrValue!
        """
        When subclassing, this defines the superclass.
        """
        baseType: String
        """
        A URI to a JSON Schema file that defines additional attributes and relationships.
        """
        schemaLocation: URL
        """
        When subclassing, this defines the subclass extensible name.
        """
        type: String
    }

    """
    Resources are physical or non-physical components (or a combination of these) within an enterprise's infrastructure or inventory.
    They are typically consumed or used by services (e.g., a physical port assigned to a service) or contribute to the realization of a product (e.g., a SIM card).
    They can be drawn from the application, computing, and network domains, and include, for example, network elements, software, IT systems, content and information, and technology components.
    A ResourceSpecification is an abstract base class for representing a generic means for implementing a particular type of resource.
    In essence, a ResourceSpecification defines the common attributes and relationships of a set of related resources, while a Resource defines a specific instance that is based on a particular ResourceSpecification.
    """
    type ResourceSpecificationRef {
        """
        Unique identifier.
        """
        id: ID!
        """
        Hyperlink reference.
        """
        href: URL
        """
        Name of the related entity.
        """
        name: String
        """
        Resource Specification version.
        """
        version: String
        """
        When subclassing, this defines the superclass.
        """
        baseType: String
        """
        A URI to a JSON Schema file that defines additional attributes and relationships.
        """
        schemaLocation: URL
        """
        When subclassing, this defines the subclass extensible name.
        """
        type: String
        """
        The actual type of the target instance when needed for disambiguation.
        """
        referredType: String
    }
`

module.exports = typeDefs;