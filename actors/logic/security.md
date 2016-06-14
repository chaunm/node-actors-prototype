Security
===================

Version | Date          | Author | Description
------- | ------------- | ------ | ---------------
1.0     | May 28th 2016 | Anh Le | Initial release
1.1.0     | June 14th 2016 | Anh Le | Modify requests

# Overview

This actor acts as a broker, being responsible for managing connections to our system bus

It must conform `Actor Commons` (see more in `../actor-system.md`)

**Security** Only `service/housekeeper`, `system` can interact with this actor

# A. ID
The actor's local ID is: `service/security`

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

**mailbox:** `:request/update/<id>`

**message:**

```javascript
{
  header: { // added by our broker
    from, // sender's guid
    id, // generated & maintained by the sender (for callbacks)
    timestamp
  },

  params: {
    // any key-value else (excluding id)
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
**mailbox:** `:request/get`

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

### 1.4 Get a specific actor
**mailbox:** `:request/get/<id>`

**message:**

```javascript
{
  header: { // added by our broker
    from, // sender's guid
    id, // generated & maintained by the sender (for callbacks)
    timestamp
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
      // list of key-value attributes (without passwords)
    }
  }
}
```

### 1.5 Remove an actor
**mailbox:** `:request/remove/<id>`

**message:**

```javascript
{
  header: { // added by our broker
    from, // sender's guid
    id, // generated & maintained by the sender (for callbacks)
    timestamp
  },
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