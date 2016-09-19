Updater
================

## 1. Overview
Platform-update services for gateways. It must conform `Actor Commons`

The ID is: `cloud/updater`

## 2. Endpoints

### 2.1 Get information about the latest available update

**mailbox:** `:request/probe`

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
    gateway: {
      about: { 
        // entire information about the gateway
        // which can be reached via requests: `gateway/<id>/:request/about`
      }
    }
  }
}
```

**response** Upon finishing these requests, it should send a response to the sender's `/:response` mailbox:

```js
{
  header: { // added by our broker
    from, // sender's guid
    timestamp,
    ip,
    port
  },
  request, // the original request here
  response: {
    status: "status.{success, failure.*}",
    latest: {
      name: 'Evolas System',
      version: '1.0.1',
      releasedTime: 'Jul 14th 2016'
    }
  }
}
```

**Notes:**
Whenever Evolas System has an update:
- If gateways are located inside our factory network (that means: they find the presence of service Registrars), gateways will automatically invoke `:request/update/get` to start the update process
- Otherwise, gateways will silently download the update via `:request/update/get`, then asking users to allow the update process to start.

### 2.2 Download the LATEST update 

Updates are ZIP files protected by keys = gateway id + token hash (join)

Updates are then splitted into smaller, base64-encoded 32KB chunks

The download processes have 2 steps:
- `download/init`: Ask the service to initialize the processes. (protected zip -> 64k splits -> bases64 encoded -> store in Mongodb with predefined expiration time of 12 hours )
- `download/get`: Ask the service to provide a specific chunk

**NOTE**:
- Download clients should call `:request/download/get` repeatedly with gradually increasing `chunk` until there's no chunk data left


#### 2.2.1 Init

**mailbox:** `:request/download/init`

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
    chunk // index of chunk to download
  }
}
```

**response** Upon finishing these requests, it should send a response to the sender's `/:response` mailbox:

```js
{
  header: { // added by our broker
    from, // sender's guid
    timestamp,
    ip,
    port
  },
  request, // the original request here
  response: {
    status: "status.{success, failure.*}"
  }
}
```

#### 2.2.2 Get
**mailbox:** `:request/download/get`

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
    chunk // index of chunk to download
  }
}
```

**response** Upon finishing these requests, it should send a response to the sender's `/:response` mailbox:

```js
{
  header: { // added by our broker
    from, // sender's guid
    timestamp,
    ip,
    port
  },
  request, // the original request here
  response: {
    status: "status.{success, failure.*}",
    data // Base64-encoded data. If there's no chunk left, `response.data` = null
  }
}
```

**NOTE:**
- `qos` should be set to 2 (highest, most dependable)
- if `response.status` == `status.failure.uninitialized`, the client should re-invoke `:request/download/init`
