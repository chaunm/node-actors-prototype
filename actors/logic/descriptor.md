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
                    }
                    class:{
                        type: 'string',
                        description: 'class of the thing. For example: class.device.sensor.motion. Things in the same class behave in the same way.'
                    },
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
                    },
                    key2: {
                        ref: {
                            type: 'string',
                            description: 'It can be a reference to the global context key. Schema must be `world://<selector>`, in which `<selector>` is in lodash-supported format'
                        }
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
                            type: {
                                constant: 'event.device.sensor.motion.detected'
                            },                            
                            params:{
                                type: 'object',
                                description: 'Collected data. This will be update into the state'
                            },
<!--                             origin : { // Watson will inject this field for every emitted events
                                type: 'object',
                                description: 'Meta information about the source: id, class'
                            } -->
                        },
                        required: ['origin'] // params is optional if you dont want to update any information into the state.
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
                                constant: 'action.service.zigbee.add_device'
                            },
                            id: {
                                type: 'string',
                                description: 'Id of device to interact with'
                            },
                            endpoint: {
                                type: 'string',
                                description: 'Relative endpoint to serve requests. If no endpoint is specified, it will be set to the parent id'
                            },
                            params: {
                                type: 'object',
                                description: 'Parameters for the action to start'
                            }
                        },
                        required: ['id', 'type']
                    }
                }
            },

            private: {
                type: 'array'
                description: ` Array of properties to hide from the query engine
                    [ 
                        'meta',
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

