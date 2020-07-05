export default {
  groupSchema: {
        "$schema": "http://json-schema.org/draft-07/schema",
        "$id": "schema/groupSchema.js",
        "type": "array",
        "title": "Consumer group list schema",
        "description": "ckSCADA consumer group list schema",
        "default": [],
        "examples": [
            [
                {
                    "name": "webapi"
                },
                {
                    "name": "client-work-6ccae7ea-87e3-45c3-b146-504b291735c9"
                }
            ]
        ],
        "additionalItems": true,
        "items": {
            "anyOf": [
                {
                    "$id": "#/items/anyOf/0",
                    "type": "object",
                    "title": "Consumer Group List",
                    "description": "",
                    "default": {},
                    "examples": [
                        {
                            "name": "webapi"
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
                            "title": "The name schema",
                            "description": "Name of consumer group",
                            "default": "",
                            "readOnly": true,
                            "examples": [
                                "webapi"
                            ]
                        }
                    }
                }
            ],
            "$id": "#/items"
        }
    }
}
