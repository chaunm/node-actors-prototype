Broker
=================

| Version | Date | Author | Description |
|-------|-------|-------|-------------|
| 1.0  | May 28th 2016 | Anh Le  | Initial release |


This actor acts as a broker, being responsible for managing connections to our system bus

It must conform `Actor Commons` (see more in `../actor-system.md`)

# A. UID
The actor's local UID is: `system_security`

# B. Mailboxes
The actor uses following mailboxes

**Security note**
Only `system_housekeeper` can interact with this actor

## 1. Requests
### 1.1 Actor API
#### 1.1.1 Create or Update
**mailbox:** `request/actors/set`

**message:**
```javascript
{
  from, // sender's guid, added by Message Broker automatically. Only accepts 'housekeeper'
  id, // generated & maintained by the sender (for callbacks)

  actor: {
    account,
    password, //hashed with sha256
    system: true or false
  }
}
```

**response**
Upon finishing these requests, it should send a response to the sender's `/response` mailbox:
```js
{
	from, // the guard's guid, added by Message Broker automatically
  request, // the original request here
  response: {
    status: "status.actor.success or status.actor.failed",
    error: "describing errors if have any"
  }
}
```
**note**
- If there's any actor with such account, it will be overridden.
- System actor can NOT be deleted once created. It can be deleted by using db commands via CLI.

#### 1.1.2 Get all users
**mailbox:** `request/actors/get_all`

**message:**
```javascript
{
  from, // sender's guid, added by Message Broker automatically. Only accepts 'housekeeper'
  id, // generated & maintained by the sender (for callbacks)
}
```

**response**
Upon finishing these requests, it should send a response to the sender's `/response` mailbox:
```js
{
	from, // the guard's guid, added by Message Broker automatically
  request, // the original request here
  response: {
    status: "status.actor.success or status.actor.failed",
    actors: [
      // list of user accounts (without passwords)
    ]
  }
}
```

#### 1.1.3 Check if a user exists
**mailbox:** `request/actors/exists`

**message:**
```javascript
{
  from, // sender's guid, added by Message Broker automatically. Only accepts 'housekeeper'
  id, // generated & maintained by the sender (for callbacks)

  actor: {
    account
  }  
}
```

**response**
Upon finishing these requests, it should send a response to the sender's `/response` mailbox:
```js
{
	from, // the guard's guid, added by Message Broker automatically
  request, // the original request here
  response: {
    status: "status.actor.success or status.actor.failed",
    error: "describing errors if have any"    
  }
}
```
#### 1.1.4 Delete a user
**mailbox:** `request/actors/delete`

**message:**
```javascript
{
  from, // sender's guid, added by Message Broker automatically. Only accepts 'housekeeper'
  id, // generated & maintained by the sender (for callbacks)

  user: {
    account
  }  
}
```

**response**
Upon finishing these requests, it should send a response to the sender's `/response` mailbox:
```js
{
	from, // the guard's guid, added by Message Broker automatically
  request, // the original request here
  response: {
    status: "status.actor.success or status.actor.failed",
    error: "describing errors if have any"    
  }
}
```
**note**
- `system actors` can not be deleted via this request
- any grants associated with the actor will be deleted as well.

### 1.2 Grant APIs
#### 1.2.1 Grant an actor to perform specific actions
**mailbox:** `request/grant/set`

**message:**
```javascript
{
  from, // sender's guid, added by Message Broker automatically. Only accepts 'housekeeper'
  id, // generated & maintained by the sender (for callbacks)

  actor, // guid of the actor to grant
  actions: [ // list of activity & target
    "pub topic1", // publish only
    "sub topic1", // subscribe only
    "pubsub topic1", // publish/subscribe
    "forbid topic1", // forbid the actor to do any pub-sub
    "forbid" // revoke any granted actions
  ]
}
```

**response**
Upon finishing these requests, it should send a response to the sender's `/response` mailbox:
```js
{
	from, // the guard's guid, added by Message Broker automatically
  request, // the original request here
  response: {
    status: "status.actor.success or status.actor.failed",
    error: "describing errors if have any"
  }
}
```

**note**
- The new actions will be merged (NOT overwrite) into the current action set of the actor.
- Grants will be processed sequentially. So you may have following grants to clear granted actions.
```javascript
{
  actions: [
    "forbid", // revoke any grant
    "forbid system/#",
    "pub system/api", // oh yeah, grant it to publish to the system/api topic
    "sub system/"
  ]
}
```
#### 1.2.2 Get all grants for a specific target
**mailbox:** `request/grant/get_by_target`

**message:**
```javascript
{
  from, // sender's guid, added by Message Broker automatically. Only accepts 'housekeeper'
  id, // generated & maintained by the sender (for callbacks)

  target: "system/#"
}
```

**response**
Upon finishing these requests, it should send a response to the sender's `/response` mailbox:
```js
{
	from, // the guard's guid, added by Message Broker automatically
  request, // the original request here
  response: {
    status: "status.actor.success or status.actor.failed",
    error: "describing errors if have any",
    grants:[
      {
        actor, // guid of the actor to grant
        actions: [ // list of activity & target
          "pub topic1", // publish only
          "sub topic1", // subscribe only
          "pubsub topic1", // publish/subscribe
          "forbid topic1", // forbid the actor to do any pub-sub
          "forbid" // revoke any granted actions
        ]
      },
      // ....
    ]
  }
}
```
#### 1.2.3 Get all granted actions for a specific actor
**mailbox:** `request/grant/get_actions_by_actor`

**message:**
```javascript
{
  from, // sender's guid, added by Message Broker automatically. Only accepts 'housekeeper'
  id, // generated & maintained by the sender (for callbacks)

  actor, // guid of the actor
}
```

**response**
Upon finishing these requests, it should send a response to the sender's `/response` mailbox:
```js
{
	from, // the guard's guid, added by Message Broker automatically
  request, // the original request here
  response: {
    status: "status.actor.success or status.actor.failed",
    grant: {
      actor, // guid of the actor to grant
      actions: [ // list of activity & target
        "pub topic1", // publish only
        "sub topic1", // subscribe only
        "pubsub topic1", // publish/subscribe
        "forbid topic1", // forbid the actor to do any pub-sub
        "forbid" // revoke any granted actions
      ]
    }
  }
}
```
#### 1.2.4 Remove grants issued to an actor
**mailbox:** `request/grant/remove_grants_by_actor`

**message:**
```javascript
{
  from, // sender's guid, added by Message Broker automatically. Only accepts 'housekeeper'
  id, // generated & maintained by the sender (for callbacks)

  actor, // guid of the actor
}
```

**response**
Upon finishing these requests, it should send a response to the sender's `/response` mailbox:
```js
{
	from, // the guard's guid, added by Message Broker automatically
  request, // the original request here
  response: {
    status: "status.actor.success or status.actor.failed",
    error: "describing errors if have any"
  }
}
```

**note**:
- `System actors` does not affect by this request
