POWER
======


The actor's local UID is: `service/button`

## Mailboxes
The actor uses to report an event created by button on the device

### 1. Requests

Currently, there's no request available.

###2. Response

This service is an actuator and generate no request to other actors.

###3. Events

#### 3.1 Button event

**mailbox:** `:event/button_event`

**message:** messages should conform the format
```js
  header: { // added by our broker
    from, // sender's guid
    id, // generated & maintained by the sender (for callbacks)
    timestamp
  },
  params: {
    "event" : "event create by button", <ex: event.reset, event.add_device>
  }  
```
