Registar
===================

# Overview
Registrar service for Gateways. It must conform `Actor Commons`

# A. ID
The ID is: `cloud/registrar`

# B. Endpoints

## 1. Requests

### 1.1 Register

Endpoint for in-house gateways to register themselves before being put into the market.

**mailbox:** `:request/register`

**message:**

```javascript
{
  header: { // added by our broker
    from, // sender's guid
    id, // generated & maintained by the sender (for callbacks)
    ip,
    port,
    timestamp
  },

  params: {
    id,
    token
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

**Security note**:
- These requests are available in our Factory network only. 
- Gateways use account `Anonymous` to invoke these requests once & only once when they're in our Factory.


### 1.2 Update tokens

**mailbox:** `:request/update/token`

**message:**

```javascript
{
  header: { // added by our broker
    from, // sender's guid
    id, // generated & maintained by the sender (for callbacks)
    ip,
    port,
    timestamp
  },

  params: {
    token
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