Service Storage
===================

# Overview

This actor acts as a storage, being responsible for managing:
- entities in our system 
- related meta data for each entitiy

It must conform `Actor Commons` (see more in `../actor-system.md`)

**Security** 
Only `service/housekeeper`, `system`, `service/device-manager` can interact with this actor

# A. ID
The actor's local ID is: `service/storage`

# B. Mailboxes
The actor uses following mailboxes

## 1.  Common requests

### 1.1 Create

Create a new entity

**mailbox:** `:request/create`

**message:**

```javascript
{
  header: { // added by our broker
    from, // sender's guid
    id, // generated & maintained by the sender (for callbacks)
    timestamp
  },

  params: {
    id,
    token, //may be pre-hashed with sha256
    class, // class.service, class.device.*, class.user.{guest, admin}
    permissions: {
      publish: [], // publish only
      subscribe: [], // subscribe only
      pubsub: [] // both publish & subscribe
    },
    // any key-value else
    // dedicated fields including:
    // data: object for storing device data 
  }
}
```

**response** Upon finishing these requests, it should send a response to the sender's `/:response` mailbox:

```js
{
  header: { // added by our broker
    from, // sender's guid
    id, // generated & maintained by the sender (for callbacks)
    timestamp
  },

  request, // the original request here
  response: {
    status: "status.{success, failure.*}"
  }
}
```

**note**
- If there's any entity with such information, it will be overridden.

### 1.2 Update

Update meta data for a specific entity

**mailbox:** `:request/update`

**message:**

```javascript
{
  header: { // added by our broker
    from, // sender's guid
    id, // generated & maintained by the sender (for callbacks)
    timestamp
  },

  params: {
    id, // id of account to update
    // any key-value else
    // other dedicated keys:
    // data: [object] for storing data
    // permissions: {rules} for storing ACLs
  }
}
```

**response** Upon finishing these requests, it should send a response to the sender's `/:response` mailbox:

```js
{
  header: { // added by our broker
    from, // sender's guid
    id, // generated & maintained by the sender (for callbacks)
    timestamp
  },

  request, // the original request here
  response: {
    status: "status.{success, failure.*}"
  }
}
```

**note** This request will override existing data.

### 1.3 Get all entities

**mailbox:** `:request/get_all`

**message:**

```javascript
{
  header: { // added by our broker
    from, // sender's guid
    id, // generated & maintained by the sender (for callbacks)
    timestamp
  },

  params: {
    // You may query via id patterns
    id: 'pattern'
    //id : 'device/.*' -> for all devices
    // id: 'service/.*' -> for all services
    // id: '.*' -> for all
    // if no id pattern specified, by default pattern = '.*'  
  }
}
```

**response** Upon finishing these requests, it should send a response to the sender's `/:response` mailbox:

```js
{
  header: { // added by our broker
    from, // sender's guid
    id, // generated & maintained by the sender (for callbacks)
    timestamp
  },

  request, // the original request here
  response: {
    status: "status.{success, failure.*}",
    entities: [
      {} // ..
    ]
  }
}
```

### 1.4 Get information about a specific entity

**mailbox:** `:request/get`

**message:**

```javascript
{
  header: { // added by our broker
    from, // sender's guid
    id, // generated & maintained by the sender (for callbacks)
    timestamp
  },
  params:{
    id, // id of account to get
  }
}
```

**response** Upon finishing these requests, it should send a response to the sender's `/:response` mailbox:

```js
{
  header: { // added by our broker
    from, // sender's guid
    id, // generated & maintained by the sender (for callbacks)
    timestamp
  },

  request, // the original request here
  response: {
    status: "status.{success, failure.*}",
    entity: {
      // list of key-value attributes (without passwords or token)
    }
  }
}
```

### 1.5 Get time series data for a specific entity

**mailbox:** `:request/get_data_series`

**message:**

```javascript
{
  header: { // added by our broker
    from, // sender's guid
    id, // generated & maintained by the sender (for callbacks)
    timestamp
  },
  params:{
    id, // id of account to get

    // you may optionally specify the time range
    time: [start, stop] 
    // or may be
    time: [start] 
  }
}
```

**response** Upon finishing these requests, it should send a response to the sender's `/:response` mailbox:

```js
{
  header: { // added by our broker
    from, // sender's guid
    id, // generated & maintained by the sender (for callbacks)
    timestamp
  },

  request, // the original request here
  response: {
    status: "status.{success, failure.{no_data,*}}",
    data: {
      field1: [
        {value: 1, time: 3232323},
        {value: 2, time: 3232324},
      ],
      field2: [
      ]
    }
  }
}
```

### 1.6 Remove an entity

**mailbox:** `:request/remove`

**message:**

```javascript
{
  header: { // added by our broker
    from, // sender's guid
    id, // generated & maintained by the sender (for callbacks)
    timestamp
  },
  params: {
    id, // id of account to update
    // any key-value else
  }
}
```

**response** Upon finishing these requests, it should send a response to the sender's `/:response` mailbox:

```js
{
  header: { // added by our broker
    from, // sender's guid
    timestamp
  },

  request, // the original request here
  response: {
    status: "status.{success, failure.*}"
  }
}
```

### 1.7 List entities
List all entities in our system

**mailbox:** `:request/list`

**message:**

```javascript
{
  header: { // added by our broker
    from, // sender's guid
    id, // generated & maintained by the sender (for callbacks)
    timestamp
  },
  params: {
    // You may query via id patterns
    id: 'pattern'
    //id : 'device/*' -> for all devices
    // id: 'services/*' -> for all services
    // id: '*' -> for all
    // if no id pattern specified, by default pattern = '*'
  }
}
```

**response** Upon finishing these requests, it should send a response to the sender's `/:response` mailbox:

```js
{
  header: { // added by our broker
    from, // sender's guid
    timestamp
  },

  request, // the original request here
  response: {
    status: "status.{success, failure.*}",
    entities:[
      // list of entities's id
    ]
  }
}
```


**note**
- `service/#` can not be deleted via this request
- any grants associated with the entity will be deleted as well.

### 2. Health requests

This requests are dedicated for service monitor

Only `service/monitor` is allowed to interact with these requests

#### 2.1 Get all health records of entities

**mailbox:** `:request/health/get_all`

**message:**

```javascript
{
  header: { // added by our broker
    from, // sender's guid
    id, // generated & maintained by the sender (for callbacks)
    timestamp
  },
  params: {
  }
}
```

**response** Upon finishing these requests, it should send a response to the sender's `/:response` mailbox:

```js
{
  header: { // added by our broker
    from, // sender's guid
    timestamp
  },

  request, // the original request here
  response: {
    status: "status.{success, failure.*}",
    health: [ // list of available records
      {
        id, 
        timestamp,
        status
      }
    ]
  }
}
```

#### 2.2 Update health records for an entity

**mailbox:** `:request/health/update`

**message:**

```javascript
{
  header: { // added by our broker
    from, // sender's guid
    id, // generated & maintained by the sender (for callbacks)
    timestamp
  },
  params: {
    id, 
    // any key-value else
    // supposed to be: status, timestamp
    // status = status.health.{unknown, alive, dead }
  }
}
```

**response** Upon finishing these requests, it should send a response to the sender's `/:response` mailbox:

```js
{
  header: { // added by our broker
    from, // sender's guid
    timestamp
  },

  request, // the original request here
  response: {
    status: "status.{success, failure.*}"
  }
}
```

