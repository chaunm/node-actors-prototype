LED
======


The actor's local UID is: `service/led`

## Mailboxes
The actor uses following mailboxes

### 1. Requests

For serving requests from other actors

#### 1.1 Turn on led

**mailbox:** `:request/turn_on`

**message:**
```js
{
  header: { // added by our broker
    from, // sender's guid
    id, // generated & maintained by the sender (for callbacks)
    timestamp
  },
  params: {
    red: < 0 - 255 >
    green: < 0 - 255 >
    blue: < 0 - 255 >
  }
}
```

**response** Upon finishing these requests, it should send a response to the sender's 'response' mailbox:

```js
{
  header: { // added by our broker
    from, // sender's guid
    id, // generated & maintained by the sender (for callbacks)
    timestamp
  },
  request,
  response: {
    status: "status.{success, failure}"
  }
}
```

#### 1.2 Turn off led

**mailbox:** `:request/turn_off`

**message**
```js
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

**response** Upon finishing these requests, it should send a response to the sender's 'response' mailbox:

```js
{
  header: { // added by our broker
    from, // sender's guid
    id, // generated & maintained by the sender (for callbacks)
    timestamp
  },
  request,
  response: {
    status: "status.{success, failure}"
  }
}
```

#### 1.3 Blink led

**mailbox:** `:request/blink`

**message**

```js

{
  header: { // added by our broker
    from, // sender's guid
    id, // generated & maintained by the sender (for callbacks)
    timestamp
  },
  params: {
    red: <0 - 255 >
    green: < 0 - 255 >
    blue: < 0 - 255 >
    period: "int, time for a blinking cycle in mss"
  }
  id: <add by sender for callback processing when receive response message>
}
```

**response** Upon finishing these requests, it should send a response to the sender's 'response' mailbox:

```js
{
  header: { // added by our broker
    from, // sender's guid
    id, // generated & maintained by the sender (for callbacks)
    timestamp
  },
  request,
  response: {
    status: <status.{success, failure}>
  }
}
```

###2. Response

This service is an actuator and generate no request to other actors.

###3. Events

#### 3.1 State changed

**mailbox:** `:event/state_changed`

**message:** messages should conform the format
```js
  header: { // added by our broker
    from, // sender's guid
    id, // generated & maintained by the sender (for callbacks)
    timestamp
  },
  params: {
    color: "color.{red, green, orange}",
    state : "state.{on,off,blinking}"
    period: <period for 1 blinking cycle in ms (only valid in blinking mode)>
  }  
```
