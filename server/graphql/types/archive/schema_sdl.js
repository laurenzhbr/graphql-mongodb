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
        endOperatingDate: String 
        """A string used to give a name to the resource."""
        name: String
        """A field that identifies the specific version of an instance of a resource."""
        resourceVersion: String
        """A date time( DateTime). The date from which the resource is operating."""
        startOperatingDate: String
        """A list of features (Feature [*]). Applicable configuration features of a resource for activation."""
        activationFeature: String
        """A resource administrative state type (ResourceAdministrativeStateType). Tracks the
        administrative state of the resource, such as locked, unlocked, shutdown and so on."""
        administrativeState: ResourceAdministrativeStateType
        """A list of attachment ref or values (AttachmentRefOrValue [*]). the attribute
        type,schemaLocation and referredType are related to the contained entity and not to
        AttchmentRefOrValue itself."""
        attachment: String
        """A list of notes (Note [*]). Extra information about a given entity."""
        note: String
        """A resource operational state type (ResourceOperationalStateType). Tracks the
        operational state of the resource, such as enable, disable and so on."""
        operationalState: ResourceOperationalStateType
        """A related place ref or value (RelatedPlaceRefOrValue). Related Entity reference. A
        related place defines a place described by reference or by value linked to a specific
        entity. The polymorphic attributes @type, @schemaLocation & @referredType are
        related to the place entity and not the RelatedPlaceRefOrValue class itself."""
        place: String
        """A list of related parties (RelatedParty [*]). Related Entity reference. A related party
        defines party or party role linked to a specific entity."""
        relatedParty: String
        """A list of characteristics (Characteristic [*]). Describes a given characteristic of an
        object or entity through a name/value pair."""
        resourceCharacteristic: String
        """A list of resource relationships (ResourceRelationship [*]). Linked resources to the one
        instantiate, such as [bundled] if the resource is a bundle and you want to describe the
        bundled resources inside this bundle; [reliesOn] if the resource needs another already
        owned resource to rely on (e.g. an option on an already owned mobile access
        resource) [targets] or [isTargeted] (depending on the way of expressing the link) for
        any other kind of links that may be useful."""
        resourceRelationship: String
        """A resource specification reference (ResourceSpecificationRef). The
        ResourceSpecification is required to realize a ProductSpecification."""
        resourceSpecification: String
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
`

module.exports = typeDefs;