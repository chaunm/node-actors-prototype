Monitor
===================

Version | Date          | Author | Description
------- | ------------- | ------ | ---------------
1.0     | May 31th 2016 | Anh Le | Initial release

# Overview
This actor runs forever, monitoring system actors to see if they're healthy
- It subscribes to service/<id>/:event/status
- Periodically check (60s per each check)

It must conform `Actor Commons` (see more in `../actor-system.md`)

# A. UID
The actor's local UID is: `service/monitor`

# B. Mailboxes
The actor uses following mailboxes

## 1. Requests
### 1.1 Check if an actor is online

**mailbox:** `:request/is_online`

**message:**

```javascript
{
  header: { // added by our broker
    from, // sender's guid
    id, // generated & maintained by the sender (for callbacks)
    timestamp
  },


  params: {
    uid // uid of the actor to check
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
    online: {true, false}
  }
}
```

## 2. Response
No response to receive

## 3. Event
### 3.1 An actor goes offline
**mailbox:** `:event/actor_offline`
**message:**

```javascript
{
  header: { // added by our broker
    from, // sender's guid
    id, // generated & maintained by the sender (for callbacks)
    timestamp
  },

  params: {
    uids: [
      // UIDs of offline actors
    ]  
  },
}
```
