export default {
  pointSchema: {
        "$schema": "http://json-schema.org/draft-07/schema",
        "$id": "schema/pointSchema.js",
        "type": "array",
        "title": "Point list schema",
        "description": "ckSCADA point list schema",
        "default": [],
        "examples": [
            [
                {
                    "name": "000001",
                    "value": 18.82949188097678,
                    "description": "Description Text",
                    "enghigh": "100",
                    "englow": "0",
                    "rawhigh": "100",
                    "rawlow": "0",
                    "eu": "%",
                    "type": "int",
                    "device": "Simulated_Modbus_PLC"
                },
                {
                    "name": "100001",
                    "value": 48.60711981975049,
                    "description": "Description Text",
                    "enghigh": "100",
                    "englow": "0",
                    "rawhigh": "100",
                    "rawlow": "0",
                    "eu": "%",
                    "type": "int",
                    "device": "Simulated_Modbus_PLC"
                }
            ]
        ],
        "additionalItems": true,
        "items": {
            "anyOf": [
                {
                    "$id": "#/items/anyOf/0",
                    "type": "object",
                    "title": "Point List Schema",
                    "description": "",
                    "default": {},
                    "examples": [
                        {
                            "name": "000001",
                            "value": 18.82949188097678,
                            "description": "Description Text",
                            "enghigh": "100",
                            "englow": "0",
                            "rawhigh": "100",
                            "rawlow": "0",
                            "eu": "%",
                            "type": "int",
                            "device": "Simulated_Modbus_PLC"
                        }
                    ],
                    "required": [
                        "name",
                        "description",                        
                        "type",
                        "device"
                    ],
                    "additionalProperties": true,
                    "properties": {
                        "name": {
                            "$id": "#/items/anyOf/0/properties/name",
                            "type": "string",
                            "title": "Point Name",
                            "description": "Name of point",
                            "default": "",
                            "examples": [
                                "000001"
                            ]
                        },
                        "value": {
                            "$id": "#/items/anyOf/0/properties/value",
                            "type": "number",
                            "title": "Initial Value",
                            "description": "Initial value of point",
                            "default": 0.0,
                            "examples": [
                                18.82949188097678
                            ]
                        },
                        "description": {
                            "$id": "#/items/anyOf/0/properties/description",
                            "type": "string",
                            "title": "Description",
                            "description": "Description of point",
                            "default": "",
                            "examples": [
                                "Description Text"
                            ]
                        },
                        "enghigh": {
                            "$id": "#/items/anyOf/0/properties/enghigh",
                            "type": "string",
                            "title": "High Engineering Limit",
                            "description": "High engineering limit",
                            "default": "",
                            "examples": [
                                "100"
                            ]
                        },
                        "englow": {
                            "$id": "#/items/anyOf/0/properties/englow",
                            "type": "string",
                            "title": "Low Engineering Limit",
                            "description": "Low Engineering Limit",
                            "default": "",
                            "examples": [
                                "0"
                            ]
                        },
                        "rawhigh": {
                            "$id": "#/items/anyOf/0/properties/rawhigh",
                            "type": "string",
                            "title": "High Raw Limit",
                            "description": "High Raw Limit",
                            "default": "",
                            "examples": [
                                "100"
                            ]
                        },
                        "rawlow": {
                            "$id": "#/items/anyOf/0/properties/rawlow",
                            "type": "string",
                            "title": "Low Raw Limit",
                            "description": "Low Raw Limit",
                            "default": "",
                            "examples": [
                                "0"
                            ]
                        },
                        "eu": {
                            "$id": "#/items/anyOf/0/properties/eu",
                            "type": "string",
                            "title": "Engineering Unit",
                            "description": "Engineering Unit",
                            "default": "",
                            "examples": [
                                "%"
                            ]
                        },
                        "type": {
                            "$id": "#/items/anyOf/0/properties/type",
                            "type": "string",
                            "title": "Point Type",
                            "description": "Point Type",
                            "default": "",
                            "examples": [
                                "int"
                            ]
                        },
                        "device": {
                            "$id": "#/items/anyOf/0/properties/device",
                            "type": "string",
                            "title": "Point's Device",
                            "description": "Device point is attached to.",
                            "default": "",
                            "examples": [
                                "Simulated_Modbus_PLC"
                            ]
                        }
                    }
                }
            ],
            "$id": "#/items"
        }
    }
}
