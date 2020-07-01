export default {
  deviceSchema: {
      "$schema": "http://json-schema.org/draft-07/schema",
      "$id": "schema/deviceSchema.js",
      "type": "array",
      "title": "Device List Schema",
      "description": "ckSCADA device list schema",
      "default": [],
      "examples": [
        [
            {
                "name": "Simulated_Modbus_PLC",
                "type": "simulation",
                "tagCount": 36,
                "replication": 2,
                "scantime": 2000
            },
            {
                "name": "Simulated_Flow_Transmitter",
                "type": "simulation",
                "tagCount": 3,
                "replication": 2,
                "scantime": 2000
            }
        ]
      ],
      "additionalItems": true,
      "items": {
        "anyOf": [
            {
                "$id": "#/items/anyOf/0",
                "type": "object",
                "title": "Device List",
                "description": "",
                "default": {},
                "examples": [
                    {
                        "name": "Simulated_Modbus_PLC",
                        "type": "simulation",
                        "tagCount": 36,
                        "replication": 2,
                        "scantime": 2000
                    }
                ],
                "required": [
                    "name",
                    "type",
                    "tagCount",
                    "replication",
                    "scantime"
                ],
                "additionalProperties": true,
                "properties": {
                    "name": {
                        "$id": "#/items/anyOf/0/properties/name",
                        "type": "string",
                        "title": "The name schema",
                        "description": "Name of the device",
                        "default": "",
                        "examples": [
                            "Simulated_Modbus_PLC"
                        ]
                    },
                    "type": {
                        "$id": "#/items/anyOf/0/properties/type",
                        "type": "string",
                        "title": "The type schema",
                        "description": "Device type such as simulation",
                        "default": "",
                        "examples": [
                            "simulation"
                        ]
                    },
                    "tagCount": {
                        "$id": "#/items/anyOf/0/properties/tagCount",
                        "type": "integer",
                        "title": "The tagCount schema",
                        "description": "Number of tags attached to the device",
                        "default": 0,
                        "examples": [
                            36
                        ]
                    },
                    "replication": {
                        "$id": "#/items/anyOf/0/properties/replication",
                        "type": "integer",
                        "title": "The replication schema",
                        "description": "Number of active instances of this device",
                        "default": 0,
                        "examples": [
                            2
                        ]
                    },
                    "scantime": {
                        "$id": "#/items/anyOf/0/properties/scantime",
                        "type": "integer",
                        "title": "The scantime schema",
                        "description": "Scan time, for periodic devices it updates tags every scan time. For report by exception it responds to messages every scan time",
                        "default": 0,
                        "examples": [
                            2000
                        ]
                    }
                }
            }
        ],
        "$id": "#/items"
      }
    }
}
