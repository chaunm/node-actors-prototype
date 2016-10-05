Big plan
===========================


### Overview

This plan provides general guidelines to implement the next version of Evolas OS

### 1. Components

## 1.1 Aktor

- Topics (in mqtt) are called as `endpoints`

- Has a unique ID (also used as endpoints for receiving response) & a token associated

- The ID can be considered as a `primary endpoint`.

- The id & token are means for the aktor to access `World Bus` ( an mqtt-based messaging system )

- Has events at endpoint `event/#`

- Has actions at endpoint `action/#`


## 1.2 Things

### 1.2.1 Overview
- Are aktors with descriptors

```js
descriptor = {
	meta,
	event,
	action
}
```

### 1.2.2 Typed messages

- Things must response to typed messages delivered to their `primary endpoints`, including:

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

### 1.2.3 Special typed messages
- Manifest itself by invoking `action/world/manifest` with `status` = `status.{online, offline}`

- Register/unregister its instances by invoking `action/world/register`, `action/world/unregister`

- Response to typed messages of `action/stop` (delivered directly to primary endpoints) by:
	- checking the invokers' authority
	- releasing any resources allocated
	- invoking `action/world/manifest` with `status` = `status.offline`
	- terminating itself

## 1.3 World



## 1.2 