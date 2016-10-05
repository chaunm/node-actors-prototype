Aktor v2.0
===============

## 1. Aktors

### 1.1 Overview

Aktors are programming concepts to model entities communicating via messages.
+ Can be implemented in any programming language
+ Have their own endpoints which are authorized topics on a message broker.
+ Can be featured via an ID (locally or globally)

This specification is not fully compatible with Aktor v1.0

### 1.2 Endpoints
An endpoint is an MQTT topic can be configured to subscribe or publish messages

Endpoints can be organized into APIs. For example `action/service/zigbee/add_device`

An aktor works with 3 kinds of endpoints which are:

**Primary endpoints**

A certain aktor has a `primary endpoint` named by its ID. For example, aktor `service/zigbee` will have the primary endpoint of `service/zigbee`

This endpoints act a central point for processing `typed messages` ( see more in section `1.3 Typed messages` )

**Action endpoints**

Action endpoints are located at `action/#`. This endpoints is used by aktors to provide services to others

**Event endpoints**

Event endpoints have the form of `event/#`. This endpoints is used by aktors to notify others about their states.

### 1.3 Typed messages

Messages interchanged between aktors are JSON-based ones.

Our broker will intercept such messages, appending field `header`

Messages are typed. There are 3 kinds of messages:

**action**

Every messages got from endpoints `action/#` will be stuffed with field `type` = `action/#`

```js
{
  header, // added by brokers
  type: 'action/#', // added by brokers if not
  params: { // any parameters for actions

  }
}
```

**event**

Every messages got from endpoints `event/#` (as a subscription result) will be stuffed with field `type` = `event/#`

```js
{
  header, // added by brokers
  type: 'event/#', // added by brokers if not
  params: {

  }
}
```

**response**

Results of actions may be delivered back to the invoker via this kind of messages:

```js
{
  header,
  type: 'response',
  request, // the original request
  response
}
```

#### 1.4 Interactions

- Aktors can emit events (via its event endpoints). Others can listen

```js
aktor.listen('event/service/zigbee/device_added', options, function(message){

})
```

With `options` you can specify `timeout` to wait for incoming messages.

- Aktors can `ask` other aktors to do something, and wait for results back

```js

aktor.ask('action/service/zigbee/add_device', message, options, function(err, result){
  // if there's no aktor serving at the endpoint, after a specific timeout
  // the callback function will be invoked with `err` = `status.failure.timeout`
})
```

With `options` you can specify `timeout` to wait for the result

- Aktors can `tell` others to do something and don't care about the results

```js
aktor.tell('action/service/zigbee/add_device', message)
aktor.tell('event/service/zigbee/device_added', message)
```

## 2. Things

Things are aktors with [descriptors](./descriptor.md)

```js
descriptor = {
  meta,
  event,
  action
}
```

- Manifest itself by telling `event/service/world/manifest/<id>` with `status` = `status.{online, offline}`. If `status` = `status.online`, it optionally provide its descriptors:

```js
var message = {
  type: 'event/service/world/manifest',
  params: {
    status: 'status.online',
    descriptors: [
      // array of descriptors
    ]
  }
}

thing.tell('event/service/world/manifest/id', message, callback)
```

- Register/unregister its instances by invoking `action/service/world/register`, `action/service/world/unregister`

- Response to typed messages of `action/stop` (delivered directly to primary endpoints) by:
  - checking for the invokers' authority
  - releasing any resources allocated
  - invoking `action/service/world/manifest` with `status` = `status.offline`
  - terminating itself
