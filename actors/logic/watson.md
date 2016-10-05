Watson
===================

### Overview

This actor acts as the central piece of our system:
- Managing things
- Providing a unified interface for interating with things

### Id

`service/watson`

### 1. Serving thing requests

#### 1.1 Register

Register a thing with Watson

**endpoint:** `:request/thing_register`

**message:**

```javascript
{
  header, // added by our broker

  params: {
  	meta,
  	state // optional
  }
}
```

For example:

```js
params = {
    meta: {
        id: 'deviceMacId@endpoint',

        // class where this thing belongs to
        // The class must be knowledgeable by Watson
        class: 'class.device.sensor.motion' 
    },
    state: { // initial state (optinal)
        temperature: {
            value: 30,
            scale: 'scale.celsius',
            _updatedAt: 3000000
        }
    }
}
}
```

**response** Upon finishing these requests, it should send a response to the sender's `/:response` endpoint:

```js
{
  header, // added by our broker
  request, // the original request here
  response: {
    status: "status.{success, failure.*}"
  }
}
```

**note**

- If there's already a thing with the same `meta.id`, returns `status.failure.already_exist`
- If there's no class with value of `meta.class`, returns `status.failure.no_such_class`
- If the accompanied state does NOT conform the class descriptor, returns `statue.failure.descriptor_violated`

#### 1.2 Unregister

Unregister a registered thing

**endpoint:** `:request/thing_unregister`

**message:**

```javascript
{
  header, // added by our broker

  params: {
    meta: {
        id
    }
  }
}
```

**response** Upon finishing these requests, it should send a response to the sender's `/:response` endpoint:

```js
{
  header, // added by our broker
  request, // the original request here
  response: {
    status: "status.{success, failure.*}"
  }
}
```

**note**

- If there's no such thing with id =  `meta.id`, returns `status.failure.no_such_id`
- Only things' parents can invoke this request. Otherwise, it will return `statue.failure.unauthorized`.

#### 1.2 Update event

Emit an event to Watson's event stream (if it's not hidden)

**endpoint:** `:request/thing_talk`

**message:**

```javascript
{
  header, // added by our broker

  params: {
    meta: { // no need to fully specify the meta. We'll fetch it from the registered
        id
    },
    event: {
        eventMotionDetected: {
            type: 'event.device.sensor.motion.detected',
            params: {
                motion: {
                    value: 1,
                    _updatedAt: 3000000000000
                }
            }
        }
    }
  }

}
```

Watson will use the `params` to update the thing's state.

Watson will then emit the event into the stream after injecting field `origin` into the message. So, if you subscribe to the stream, you may have:

```js
{
    type: 'event.device.sensor.motion.detected',
    params: {
        motion: {
            value: 1,
            _updatedAt: 3000000000000
        }
    },  
    origin: { // injected by Watson
        class,
        id
    }
}
```

**response** Upon finishing these requests, it should send a response to the sender's `/:response` endpoint:

```js
{
  header, // added by our broker
  request, // the original request here
  response: {
    status: "status.{success, failure.*}"
  }
}
```

**note**
- If there's no such thing with id =  `meta.id`, returns `status.failure.no_such_id`
- Only things' parents can invoke this request. Otherwise, it will return `statue.failure.unauthorized`.


#### 1.3 Context

Things operate in a specific context (local & global). Currently, a typical context contains `name` and `location`

##### 1.3.1 Update context

Set the thing's context. It's supposed to be invoked by higher-level services.

Two operations are supported, including `set`, `unset`, `free`.

If `free` is used, it will supersede `set`, `unset`, releasing the context

**endpoint:** `:request/thing_context_update`

**message:**

```javascript
{
  header, // added by our broker

  params: {
    meta: { // no need to fully specify the meta. We'll fetch it from the registered
        id
    },
    context: {
        set: { // object of key-value to set, must conform the associated descriptor
            name: {
                value: 'Front door',
                _updatedAt: 3000000000000
            }

            // or it can reference to the world context
            // ref: {
            //     type: 'string',
            //     description: 'It can be a reference to the global context key. Schema must be `world://<selector>`, in which `<selector>` is in lodash-supported format'
            // }            
        },
        unset: [ // optional
            // array of key selectors to unset (use _.unset from Lodash)
        ]
    }
  }

}
```

Watson will use the `params` to update the thing's context.

**response** Upon finishing these requests, it should send a response to the sender's `/:response` endpoint:

```js
{
  header, // added by our broker
  request, // the original request here
  response: {
    status: "status.{success, failure.*}",
    context // new context
  }
}
```

##### 1.3.2 Fetch context

Fetch context of  a specific thing

**endpoint:** `:request/thing_context_fetch`

**message:**

```js
{
  header, // added by our broker
  params: {
    meta: {
      id
    }
  }
}
```

**response** Upon finishing these requests, it should send a response to the sender's `/:response` endpoint:

```js
{
  header, // added by our broker
  request, // the original request here
  response: {
    status: "status.{success, failure.*}",
    context 
  }
}
```

#### 1.4 Query

Query information about things

**endpoint:** `:request/thing_query`

**message:**

```js
{
  header, // added by our broker
  params: {
    // sift.js-supported query
  }
}
```

**response** Upon finishing these requests, it should send a response to the sender's `/:response` endpoint:

```js
{
  header, // added by our broker
  request, // the original request here
  response: {
    status: "status.{success, failure.*}",
    things // if success, array of satisified things
  }
}
```

**note**
- If the query is invalid, returns `status.failure.invalid_query`

#### 1.5 Act

Ask a specific device to do something

**endpoint:** `:request/thing_act`

**message:**

```js
{
  header, // added by our broker
  params: {
    // action descriptor
    type,
    id,
    endpoint, // optional
    params
  }
}
```

**response** Upon finishing these requests, it should send a response to the sender's `/:response` endpoint:

```js
{
  header, // added by our broker
  request, // the original request here
  response: {
    status: "status.{success, failure.*}"
  }
}
```

### 2. World

Things operate in a world. World also has context that things can reference to.

#### 2.1 Context

##### 2.1.1 Update context

Set the thing's context. It's supposed to be invoked by higher-level services.

Two operations are supported, including `set`, `unset`, `free`.

If `free` is used, it will supersede `set`, `unset`, releasing the context

**endpoint:** `:request/world_context_update`

**message:**

```javascript
{
  header, // added by our broker

  params: {
    meta: { // no need to fully specify the meta. We'll fetch it from the registered
        id
    },
    context: {
        set: { // object of key-value to set, must conform the associated descriptor
            name: {
                value: 'Front door',
                _updatedAt: 3000000000000
            },
            'name.can.also.has.dots': { // we use function _.set() of Lodash to update
                value: 'Front door',
                _updatedAt: 30000000000
            }

            // or it can reference to the world context
            // ref: {
            //     type: 'string',
            //     description: 'It can be a reference to the global context key. Schema must be `world://<selector>`, in which `<selector>` is in lodash-supported format'
            // }            
        },
        unset: [ // optional
            // array of key selectors to unset (use _.unset from Lodash)
        ]
    }
  }

}
```

**response** Upon finishing these requests, it should send a response to the sender's `/:response` endpoint:

```js
{
  header, // added by our broker
  request, // the original request here
  response: {
    status: "status.{success, failure.*}",
    context // new context
  }
}
```

##### 2.2.2 Fetch context

Fetch context of  a specific thing

**endpoint:** `:request/world_context_fetch`

**message:**

```js
{
  header, // added by our broker
  params: {
    meta: {
      id
    }
  }
}
```

**response** Upon finishing these requests, it should send a response to the sender's `/:response` endpoint:

```js
{
  header, // added by our broker
  request, // the original request here
  response: {
    status: "status.{success, failure.*}",
    context 
  }
}
```

#### 2.3 List

List all knowledgable things

**endpoint:** `:request/world_list`

**message:**

```js
{
  header, // added by our broker
  params: {
  }
}
```


**response** Upon finishing these requests, it should send a response to the sender's `/:response` endpoint:

```js
{
  header, // added by our broker
  request, // the original request here
  response: {
    status: "status.{success, failure.*}",
    world // array of descriptors
  }
}
```