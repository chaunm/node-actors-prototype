QR
======


The actor's local UID is: `service/qr`

## Mailboxes
The actor uses following mailboxes

### 1. Requests

Currently, there is no request available for this service.

###2. Response

This service is an actuator and generate no request to other actors.

###3. Events

#### 3.1 Update qr content

**mailbox:** `:event/qr_update`

**message:** messages should conform the format
```js
  header: { // added by our broker
    from, // sender's guid
    id, // generated & maintained by the sender (for callbacks)
    timestamp
  },
  params: {
    content: {content of the QR code},
  }  
```

#### 3.2 Update service info

**mailbox:** `:event/info`

**message:** messages should conform the format
```js
  header: { // added by our broker
    from, // sender's guid
    id, // generated & maintained by the sender (for callbacks)
    timestamp
  },
  params: {
    info: {infomation relate to working state issued by zbarcam service},
  }  
```
