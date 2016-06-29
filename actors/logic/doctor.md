Service Doctor
===================

# Overview
This actor runs forever, monitoring system entities to see if they're healthy
- It subscribes to service/<id>/:event/status
- Periodically check (60s per each check)

It must conform `Actor Commons` (see more in `../actor-system.md`)

# A. UID
The actor's local UID is: `service/doctor`

# B. Mailboxes
The actor uses following mailboxes

## 1. Requests

```js
{
  health: {
    isHealthy: true| false,
    timestamp: 00
  }
}
```

- watch dog 
  -> get health all entities 
  -> loop through each entity
      isHealthy = now - health.timestamp < max_ttl
      if isHealthy != health.isHealthy:
        -> update
        -> emit event report


- on event:
  -> update health.timestamp

## 2. Response
No response to receive

## 3. Event
### 3.1 Report
Periodical emits these kind of events (6m)

**mailbox:** `:event/report`
**message:**

```javascript
{
  header: { // added by our broker
    from, // sender's guid
    id, // generated & maintained by the sender (for callbacks)
    timestamp
  },

  params: {
    id: <id>, 
    status: <status.{online, offline}>
  },
}
```
