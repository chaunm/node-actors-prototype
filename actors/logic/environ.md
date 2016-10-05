Specifications for EnvironService (v1.3)
===============


### 1. Overview

- Environ is where our aktors hosted, providing environment for aktors to live
- Environ comprises of multiple containers running on independent processes
- Environ is implemented as a CommonAktor
- Environ only supports CommonAktors. We will refer to `CommonAktors` as aktors from now on

### 2. Specifications

#### 2.1 Resilience

Environ will run in a dedicated process which is monitored by PM2.

It's capable of dealing with unexpected exceptions by restoring most recent sessions which contains running aktors

Bad aktors (which cause unexpected things > 3 times) will be destroyed from the containers.

#### 2.2 Boot

Check for platform services before entering any further stage. Platform services include:
- eMQTT
- MongoDb
- InfluxDb
- Parse

#### 2.3 Self initialization

Environ will initialize itself only for the first time it's started.

No configuration is needed

The initialization works as follow:
- get platform configuration
- get core services (which are CommonAktors) and generate configurations for them
- start them sequentially in the order

**NOTE**:
- Platform configuration may contain field `clean = true` to trigger the initialization every time Environ starts

#### 2.4 Containers

Environ uses multiple containers to host aktors.
Containers are actually independent processes managed by PM2.

#### 2.5 Responsibilities

To aktorks, Environ's responsible for:

**Starting**
- Generating appropriate configurations: an MqttInterface named `local`, a ParseStorage named `local`, a TimeSeriesStorage named `timeseries`
- Starting aktors
- Aktors are featuring via IDs. There's no aktors having the same ID allowed to run.
- Parent aktors are aktors requesting to create another aktors (which are child ones) . Environ has no parent by itself.
- Aktors can be implemented in any programming languages as long as they conform CommonAktor specifications.

**Monitoring**
- Monitoring and restarting faulty aktors if there's any unhandled exceptions
- Preventing faulty aktors committing to much restarts from starting/running

**Destroying**
- Only parent aktors can stop/remove their child aktors.
- Bad aktors are automatically destroyed
- Environ can stop any aktors (for example when upgrading the entire system)
- Aktors can kill themselves ( by `tell`ing Environ to stop them. If not, aktors may be resurrect by PM2)

**Preserving**
- Environ stores configuration for aktors to start
- Data stored by aktors will be deleted only when the aktors are destroyed.

**Security**
- Generate tokens for aktors to access platform services

### 3. Interface

- id: `service/environ`

- requests:
    - `:request/aktor_start`: Launch an aktor
    - `:request/aktor_stop`: Stop an aktor (stop but not destroy)
    - `:request/aktor_destroy`: Remove an aktor from the environment
    - `:request/aktor_get`: Get information about hosted aktors
    - `:request/stop`: Stop the container
    - `:request/environ_get`: Get configurations for Environ
    - `:request/environ_set`: Set configurations for Environ

- events:
    - `:event/aktor_faulty`: A faulty aktor detected
    - `:event/status`: Status events

- subscriptions:
    - `service/container/+/:event/container_started`
    - `service/container/+/:event/aktor_started`: To handle restarting-events of containers
    - `service/container/+/:event/container_stopped`
    - `service/container/+/:event/aktor_stopped`
    - `service/container/+/:event/aktor_faulty`

#### 3.1. Requests

##### 3.1.1. Start an aktor

Support nodejs and non-nodejs aktor

**endpoint** `:request/aktor_start`

**message**:

```js
{
  header, // added by our custom broker
  params: {
    script, // required, absolute path to nodejs aktor scripts or other binaries
    maxRestarts ,  // optional, default 3, the maximum number of times in a row a script will be restarted      
    id, // required
    timeout, // time (in ms) to wait for aktors to start. Optional, defaul 10000 ms (10s)
    token, // token may be omitted. If none's provided, an random one will be used.
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
- Aktor can NOT start successfully (exceptions or timeouts)
- Any aktor with the same id running

If there's  an aktor running with the same id , returns `status.failure.already_running`


**note**
- Aktors invoking this request will be marked as parents of the newly started aktor (via field `_parent`)

##### 3.1.2. Stop an aktor

Stop an aktor but not remove it from the environ.

**endpoint** `:request/aktor_stop`

**message**:

```js
{
  header, // added by our custom broker
  params: { // optional
    id, // id of the aktor to stop
  }
}
```

If no id is provided, one from the header will be used.

Environ will fulfill the request by:
- Ask the aktor gracefully by invoking `:request/stop` (with a `forward timeout`)
- Ask PM2 to `delete` the associated process (if have, for non-NodeJs aktor) after a specific timeout (2000 ms)

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

Only parent aktors, Environ, the aktor itself may terminate a specific aktor.

If invokers are not authorized, returns `status.failure.unauthorized`

If no such aktor's running, returns `status.failure.no_such_aktor`

##### 3.1.3. Remove an aktor

Remove data about an aktor from the environ.
Remember you must stop it before invoking this request

**endpoint** `:request/aktor_destroy`

**message**:

```js
{
  header, // added by our custom broker
  params: { // optional
    id // id of the aktor to remove
  }
}
```

If no id is provided, one from the header will be used.

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

Only parent aktors, Environ, the aktor itself may terminate a specific aktor.

If invokers are not authorized, returns `status.failure.unauthorized`

If there's no such aktor, returns `status.failure.no_such_aktor`

##### 3.1.4 Get information about hosted aktors

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
        _container // string, name of the hosting container
        ...
      },
      // other aktors
    ]
  }
}
```

##### 3.1.5 Stop the environ

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

Only Environ or System may invoke these requests.

Returns `failure` if Requesters are NOT authorized to invoke such requests.

Environ will stop by:
- Ask hosted aktors to stop gracefully (timeout)
- Response to requesters
- Release resources (callbacks, ports...)
- Exit the running process

##### 3.1.6 Get configurations for Environ

**endpoint**  `:request/environ_get`

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
    status: 'status.{failure, success}',
    configuration: {
        maxRestarts // blah blah blah
    }
  }
}
```

**security**
Only `system` or `service/environ` can invoke this requests

##### 3.1.7 Set configurations for Environ

**endpoint** `:request/environ_set`

**message**

```js
{
  header, // added by our custom broker
  params: { // params to set
    //  following fields are supported
    //   "container": {
    //       "instances": 3
    //   },
    //   "maxRestarts": 3,
    //   "clean": true,
    //   "timeout": 10000,
    //   "timeoutRatio": 0.8      
  }
}
```

To unset a key, just set its associated value to null
For example:

```js
{
    header,
    params: {
        clean: null
    }
}
``

**response**

```js
{
  header,
  request,
  response: {
    status: 'status.{failure, success}',
    configuration // newly updated configuration
  }
}
```

**security**
Only `system` or `service/environ` can invoke this requests


#### 3.2. Events

##### 3.2.1 Faulty

This kind of events will be emitted if there's any `faulty` aktor. Faulty ones will not be hosted in the container and be deleted.

If the aktor's fixed, you must invoke `:request/aktor_start` again to start it over.

**endpoint** `:event/aktor_faulty`

**message**:

```js
{
  header, // added by our custom broker
  params: {
    id, // id of the faulty aktor
  },
}
```

##### 3.2.2 Status

Just like other CommonAktor
