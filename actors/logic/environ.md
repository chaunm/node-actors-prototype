Service Environ
===================

# Overview

This service acts as a storage, being responsible for managing:
- entities in our system 
- related meta data for each entitiy

It must conform `Actor Commons` (see more in `../actor-system.md`)

**Security** 
- Only `service/gateway`, `system`, `service/device-manager` can modify information of another service
- Services can modify their records themselves.

# A. ID
The actor's local ID is: `service/environ`

# B. Mailboxes
The actor uses following mailboxes

## 1.  Common requests

### 1.1 Set

Update/create meta data for a specific entity

**mailbox:** `:request/set`

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
    // data: {object} for storing data
    // permissions: {rules} for storing ACLs
    // class, // class.service, class.device.*, class.user.{guest, admin}
    // For example:
    // permissions: {
    //   publish: [], // publish only
    //   subscribe: [], // subscribe only
    //   pubsub: [] // both publish & subscribe
    // },
    // keys may be separated by dots to indicate sub-objects
    // For example, with key ='time.year', value = 2016
    // we will have `{ time: { year: 2016 } }` inside the updated record

    // optionally, to remove key-value pairs by keys, 
    // you may use `$unset`, for example:
    // $unset: "data.value" 
    // or
    // $unset : [ "data.value", "platform.os"]

    // optionally, you may decide to remove completely the record (excluding _id & id)
    // with a new one by using $replace
    // $replace: {
    //  // any key-value 
    // }

    // NOTE #1:
    // If $replace is found in requests, Environ will omit other fields
    // For example: with params = {
    //    id: 'service/dummy',
    //    $unset: ['data.value'],
    //    'data.value': 3,
    //    $replace: {
    //      'data.platform': 'tinos'
    //    }
    // }
    // The final record will be: 
    //  { 
    //    _id,
    //    id,
    //    data: {
    //      platform: 'tinos'
    //    }
    //  }

    // NOTE #2:
    // If $unset is used without $replace, Environ will unset the fields, 
    // and then upserting the other fields.
    // For example: with params =
    // {
    //    id,
    //    'platform.value' : 3,
    //    $unset : 'data.platform'
    // }  
    // Environ will unset 'data.platform' first, updating other fields then.

    // NOTE 3: Unset permissions
    // You may use $unset to remove permissions. Here are the keys to use with $unset
    // - 'permissions': to remove any permissions granted
    // - 'permissions.pubsub': to remove any pubsub granted
    // - 'permissions.publish': to remove any publication granted
    // - 'permissions.subscribe': to remove any publication granted

    // NOTE 4: Unset `data` fields
    // You may use $unset to remove `data` fields. Here are the keys:
    // - 'data': to remove any field in `data`
    // - `data.xxx`: to remove a specific field
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

### 1.2 Get all entities

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

    // and optionally a key to restrict returned fields
    $fields
    // for example, to return only field 'configuration.grant', you may set
    // $fields: 'configuration.grant'
    // you can also set multiple fields 
    // $fields: [ 'configuration', 'platform' ]
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

### 1.3 Get information about a specific entity

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

    // and optionally a key to restrict returned fields
    $fields
    // for example, to return only field 'configuration.grant', you may set
    // $fields: 'configuration.grant'
    // you can also set multiple fields 
    // $fields: [ 'configuration', 'platform' ]
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

### 1.4 Get time series data for a specific entity

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

### 1.5 Remove an entity

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

### 1.6 List entities
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

