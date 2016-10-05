Containers
===============

Environ is where our aktors hosted. Environ comprises of multiple containers

### 1. Overview
- Containers are livelong & independent processes for hosting aktors locally (nodejs and non-nodejs ones)
- Containers are special kinds of aktors
- Containers are managed by pm2

### 2. Interface
- id: `service/container/<id>`
- requests:
    - `:request/aktor_start`: Launch an aktor
    - `:request/aktor_stop`: Stop an aktor
    - `:request/aktor_get`: Get information about hosted aktors
    - `:request/stop`: Stop the container
- events:
    - `:event/aktor_faulty`: A faulty aktor detected
    - `:event/status`: Status events

#### 2.1. Requests

##### 2.1.1. Launch an aktor
Support nodejs and non-nodejs aktor

**endpoint** `:request/aktor_start`

**message**:

```js
{
  header, // added by our custom broker
  params: {
    script, // required, absolute path to nodejs aktor scripts or other binaries
    maxRestarts ,  // optional, default 3, the maximum number of times in a row a script will be restarted      
    id,
    timeout, // time to wait for aktors to start
    token,
    //... other options      
  }

}
```

**response**

```js
{
  header,
  request,
  response: {
    status: 'status.{failure, success}'
  }
}
```

Returns `failure` if:
- Requesters are NOT authorized (`status.failure.unauthorized`). By default, only `service/environ` can invoke these requests.
- Aktor can NOT start successfully (exceptions or timeouts)
- Any aktor with the same script, id & token running

If success, the container should store information about the launched aktor in its storage which is a mapping between <id> and its configuration.

##### 2.1.2. Stop an aktor

**endpoint** `:request/aktor_stop`

**message**:

```js
{
  header, // added by our custom broker
  params: {
    id // id of the aktor to stop
  }
}
```

**response**

```js
{
  header,
  request,
  response: {
    status: 'status.{failure, success}'
  }
}
```

**details**

Returs `failure` if:
- Requesters are NOT authorized to perform

Containers will:
- Ask hosted aktors to stop gracefully (timeout)
- Clear the aktor's record


##### 2.1.3 Stop the container

**endpoint** `:request/stop`

**message**:

```js
{
  header, // added by our custom broker
  params: { // blank params
  }
}
```

**response**

```js
{
  header,
  request,
  response: {
    status: 'status.{failure, success}'
  }
}
```

Returns `failure` if Requesters are NOT authorized to invoke such requests.
By default, only `service/environ` is granted.

**details**

Container will stop by:
- Ask hosted aktors to stop gracefully (timeout)
- Clear all records about aktors
- Response to requesters
- Release resources (callbacks, ports...)
- Exit the running process

##### 2.1.4 Get information about hosted aktors

**endpoint** `:request/aktor_get`

**message**:

```js
{
  header, // added by our custom broker
  params: { // blank params
    id // optional. If there's no id specified, all hosted aktors will be returned
  }
}
```

**response**
s
```js
{
  header,
  request,
  response: {
    status: 'status.{failure, success}',
    aktors: [
      {
        script,
        id,
        token, // --> must be dropped
        faulty,
        status,
        ...
      },
      // other aktors
    ]
  }
}
```

Returns `failure` if Requesters are NOT authorized to invoke such requests.

By default, only `service/container` is granted.

#### 2.2. Events

##### 2.2.1 Faulty

This kind of events will be emitted if there's any `faulty` aktor. Faulty ones will not be hosted in the container.
If the aktor's fixed, you must invoke `:request/launch` again to start it over.

**endpoint** `:event/aktor_faulty`

**message**:

```js
{
  header, // added by our custom broker
  params: {
    id,
  },
}
```

##### 2.2.2 Status

Just like other CommonAktor

### 3. Other specifications

Containers must monitor aktors by:

#### 3.3.1 Listening for Status events

- Common aktors periodically emit `:event/status` within a time range (timeout) with `status.online`
- If an aktor gracefully stops, it must emit `status.offline`
- If an last-time-online aktor does NOT emit properly, it will be marked with `status.faulty`
- Containers then:
    + Try to stop the aktor by invoking method `stop()` for Nodejs aktors or kill the hosted process for non-nodejs aktors
    + Increase field `faulty` of the associated aktor+
    + If the value of `faulty` is < MAX_TRY, we'll start it over. Otherwise, emit `:event/aktor_faulty`

#### 3.3.2 Processing unhandled exceptions

Containers must register handlers for processing unhandled exceptions

```js
process.on('uncaughtException', (err) => {
  // ...
});
```

Containers should:
- Inspect such exceptions to know which module is faulty
- Increase field `faulty` of the associated aktor
- Restart themselves
- Read all aktors stored, for an aktor with `faulty` > MAX_TRY will be rejected. Containers then emit `:event/aktor_faulty` with information describing the faulty aktor, delete entire record of the aktor
