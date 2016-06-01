Monitor
===================

Version | Date          | Author | Description
------- | ------------- | ------ | ---------------
1.0     | May 31th 2016 | Anh Le | Initial release

# Overview
This actor runs forever, monitoring other actors to see if they're healthy
- It subscribes to <any guid>/event/status
- Periodically check (60s per each check)

It must conform `Actor Commons` (see more in `../actor-system.md`)

# A. UID
The actor's local UID is: `system_monitor`

# B. Mailboxes
The actor uses following mailboxes

## 1. Requests
### 1.1 Check if an actor is online

**mailbox:** `request/is_online`

**message:**

```javascript
{
  from, // sender's guid, added by Message Broker automatically.
  id, // generated & maintained by the sender (for callbacks)

  params: {
    uid // uid of the actor to check
  }
}
```
**response** Upon finishing these requests, it should send a response to the sender's `/response` mailbox:

```js
{
    from, // the guard's guid, added by Message Broker automatically
  request, // the original request here
  response: {
    online: {true, false}
  }
}
```

## 2. Response


## 3. Event
No event emitted
