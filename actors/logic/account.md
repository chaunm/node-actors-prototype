Service Account
===================

Version | Date          | Author | Description
------- | ------------- | ------ | ---------------
1.0     | May 28th 2016 | Anh Le | Initial release
1.1.0     | June 14th 2016 | Anh Le | Modify requests
1.1.1     | June 15th 2016 | Anh Le | Modify service name
1.1.2     | June 16th 2016 | Anh Le | Modify endpoints to not include <id>, adding attribute data 

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
- Update meta data for a specific actor

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
**mailbox:** `:request/getAll`

**message:**

```javascript
{
  header: { // added by our broker
    from, // sender's guid
    id, // generated & maintained by the sender (for callbacks)
    timestamp
  },

  params: {
    // if have any key-value query against data field
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

### 1.5 Remove an actor
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

**note**
- `service/#` can not be deleted via this request
- any grants associated with the actor will be deleted as well.