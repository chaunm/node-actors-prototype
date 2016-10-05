Descriptor
=============================

### Overview

A JSON-Schema-inspired structure to describe things.

Watson's responsible for managing descriptor database.

Descriptors are means for representing things to the outside world, letting others know how to work with individual things.

### Specification

```js
{
		type: 'object',
        properties: {
            meta: {
                type: 'object',
                description: '[Required] Meta information about the thing',
                properties: {
                    id: {
                        type: 'string',
                        description: 'Id of the thing. It should be unique.'
                    },
                    class:{
                        type: 'string',
                        description: 'class of the thing. For example: class.device.sensor.motion. Things in the same class behave in the same way.'
                    }
                },
                required: ['id', 'class']
            },

            context: {  // thing context, user defined information [optional]
                type: 'object',
                properties: {
                    key1: {
                        value: { // any type

                        },
                        _updatedAt: 3000
                    }
                }
            },

            state: {
                type: 'object',
                description: 'A structure describes information about the current state of thing',
                // For state fields, we require them to be objects with at least 2 fields: `value` and `_updatedAt`
                // sample properties may be:
                properties: {
                    online: {
                        type: 'object',
                        properties: {
                            value: {
                                type: 'boolean'
                            },
                            _updatedAt: {
                                type: 'number',
                                description: 'Unix time at which the value is set'
                            }
                        }
                    },
                    signal: {
                        type: 'object',
                        properties: {
                            value: {
                                type: 'boolean',
                                description: 'True means signal is strong enough to work. Otherwise, set to false.'
                            },
                            _updatedAt: {
                                type: 'number',
                                description: 'Unix time at which the value is set'
                            }
                        }
                    }
                }
            },

            event: {
                type: 'object',
                description: 'Describe emittable events in fashion of mapping between <event names> and their descriptors'
                // sample properties
                properties: {
                    eventMotionDetected: {
                        type: 'object',
                        properties: {
                            origin : {
                                type: 'object',
                                description: 'origin information about the source. Only id is required. Environ will update with field `class`',
                                properties: {
                                    id: {
                                        type: 'string'
                                    }
                                },
                                required: ['id']
                            },

                            type: {
                                constant: 'event/device/sensor/motion/detected'
                            },                            

                            data: {
                                type: 'object',
                                description: 'Collected data. This will be update into the state'
                            }

                        },
                        required: ['origin', 'type']
                    }
                }
            },

            action: {
                type: 'object',
                description: 'Describe serving actions. It is a mapping between <action names> and their descriptors. We recommend to have action types unique'
                properties:{
                    actionAddDevice: {
                        type: 'object',
                        properties: {
                            type: { 
                                constant: 'action/service/zigbee/add_device'
                            },
                            meta: {

                            }, // optional for zigbee actuators sharing same endpoints
                            params: {
                                type: 'object',
                                description: 'Arguments for the action'
                            }                             
                        },
                        required: ['type']
                    }
                }
            },

            private: {
                type: 'array'
                description: ` Array of properties to hide from the query engine
                    [ 
                        'origin',
                        'state',
                        'event.eventMotionDetected',
                        'action.actionDismiss'
                    ]                
                `
            }
        },
        required: [ 'meta' ]
}
```

