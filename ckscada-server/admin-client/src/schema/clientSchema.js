export default {
  clientSchema: {
    "$schema": "http://json-schema.org/draft-07/schema",
    "$id": "schema/clientSchema.js",
    "type": "array",
    "title": "Client List Schema",
    "description": "ckSCADA client list schema",
    "default": [],
    "examples": [
        [
            {
                "name": "client-work-692fe34a-f1dc-4595-b3cb-02310042c212"
            },
            {
                "name": "client-work-a2eed149-55e9-4e54-b1d5-4866c2e50d02"
            }
        ]
    ],
    "additionalItems": true,
    "items": {
        "anyOf": [
            {
                "$id": "#/items/anyOf/0",
                "type": "object",
                "title": "List of Client that are connected to the servers",
                "description": "",
                "default": {},
                "examples": [
                    {
                        "name": "client-work-692fe34a-f1dc-4595-b3cb-02310042c212"
                    }
                ],
                "required": [
                    "name"
                ],
                "additionalProperties": true,
                "properties": {
                    "name": {
                        "$id": "#/items/anyOf/0/properties/name",
                        "type": "string",
                        "tab": "General",
                        "title": "Name of the client",
                        "description": "<client identifier>-<hostname>-<guid>",
                        "default": "",
                        "examples": [
                            "client-work-692fe34a-f1dc-4595-b3cb-02310042c212"
                        ]
                    }
                }
            }
        ],
        "$id": "#/items"
    }
  }
}
