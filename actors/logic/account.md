Service Account
===================

# Overview

This actor acts as a broker, being responsible for managing:
- accounts in our system
- related meta data for each account

It must conform `Actor Commons` (see more in `../actor-system.md`)

**Security** 
Only `service/housekeeper`, `system`, `service/device-manager` can interact with this actor

# A. ID
The actor's local ID is: `service/account`

# B. Mailboxes
The actor uses following mailboxes

## 1. Requests

### 1.1 Create

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
    permissions: [ // this field is required
      "publish topic", // publish only
      "subscribe topic", // subscribe only
      "pubsub topic", // publish/subscribe
    ],
    // any key-value else
    // dedicated fields including:
    // data: [object] for storing device data 
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
- If there's any actor with such account, it will be overridden.

### 1.2 Update

Update meta data for a specific actor

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
    // permissions: [rules] for storing ACLs
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

### 1.3 Get all actors

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
    id, // generated & maintained by the sender (for callbacks)
    timestamp
  },

  request, // the original request here
  response: {
    status: "status.{success, failure.*}",
    actors: [
      {} // ..
    ]
  }
}
```

### 1.4 Get information about a specific actor

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
    actor: {
      // list of key-value attributes (without passwords or token)
    }
  }
}
```

### 1.5 Get time series data for a specific actor

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

### 1.6 Remove an actor

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

### 1.7 List actors
List all actors in our system

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
    actors:[
      // list of actors's id
    ]
  }
}
```


**note**
- `service/#` can not be deleted via this request
- any grants associated with the actor will be deleted as well.