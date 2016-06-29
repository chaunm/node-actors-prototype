Actor System
===============

## 1. Actors
### 1.1 Overview
Actors are programming concepts to model entities communicating via messages.
+ Can be implemented in any programming language
+ Have their own mailboxes which are authorized topics on a message broker.
+ Can be featured by a uid (locally or globally)

### 1.2 Mailboxes
A mailbox (a topic) can be configured to subscribe or publish to a specific set of actors.
+ Each mailbox has its own URIs
+ URIs can be organized into APIs. For example `<uid>/:request/add_device`

#### 1.2.1 Owned mailboxes
Mailbox ownership can be defined as: if an actor is defined a uid 'A', then any mailbox `A/#` will be considered to be owned by the actor.

An actor owns 3 kind of mailboxes which are:

**Request mailboxes:**
+ URIs: `<uid>/:request/#`
+ to store messages asking the actor do something
+ Only authorized actors can publish messages to this mailboxes
+ Only the owning actor can subscribe to

**Response mailboxes**
+ URIs: `<uid>/:response` (no sub-topic)
+ Store response messages from other actors upon request messages.
+ Each response messages must have `:request` fields to refer back to associated `:request messages`

**Event mailboxes:**
+ URIs: `<uid>/:event/#`
+ to store events emitted by the actor
+ Only the owning actor can publish to
+ Only authorized actors can subscribe to

#### 1.2.2 Interactions
if properly configured, actors can:
- Subscribe to their own `:request` & `:response` mailboxes
- Publish messages to their own `:event` mailboxes
- Publish messages to `:request` & `:response` mailboxes of other actors

### 1.3 Messages
Interchanged messages are in JSON format.
Broker will intercept such messages, appending `from` fields:

**Example 1: Request & Response messages**

A requests B to add_device and B responses. Let's assume that A is authorized

*Step 1: A publishes a request message to B-uid/:request/add_device*

```javascript
{
	header: { // added by our broker
    from, // sender's guid
    id, // generated & maintained by the sender (for callbacks)
    timestamp
  },
	params
}
```

*Step 2: B executes the request, replying to A-uid/:response*

```javascript
{
	header: { // added by our broker
    from, // sender's guid
    id, // generated & maintained by the sender (for callbacks)
    timestamp
  },
	request, // original request message
	response // key-value pairs
}
```

**Example 2: Events**

Actor Wifi can emit `connected` events to `:event/connected`:

```javascript
{
  header: { // added by our broker
    from, // sender's guid
    id, // generated & maintained by the sender (for callbacks)
    timestamp
  },
	params // any 	
}
```

## 2. Actor Commons

This section defines a common interface about what Actors must conform in our Actor System

### 2.1  General
- External actors must securely maintain their IDs & tokens (their credentials) which are used to connect to our brokers
- Internal actors must securely maintain their credentials if provided. If they're provided with new credentials during activation period, they must use it.

```js
// activation period: time at which the actor is activated by System
// may be via command
// $ ./dummy_actor --id <provided id> --token <provided token>

// may be via programming language (nodejs)
var DummyActor = new Actor({id, token});
```

### 2.2 Response
Any response must contain the original request. For example:

```javascript
{
  header: { // added by our broker
    from, // sender's guid
    id, // generated & maintained by the sender (for callbacks)
    timestamp
  },
	request, // original request message
	response // key-value pairs
}
```

### 2.3 Requests
- Messages containing parameters passed to requests must have the format:
```js
{
  header: { // added by our broker
    from, // sender's guid
    id, // generated & maintained by the sender (for callbacks)
    timestamp
  },

  params: {
		// any key-value
	}
}
```

- Must response to special requests

#### 2.3.1 Stop

**Purpose** Safely stop any activities

**mailbox** `:request/stop`

**message:**
```javascript
{
  header: { // added by our broker
    from, // sender's guid
    id, // generated & maintained by the sender (for callbacks)
    timestamp
  },
  params: {
    reason: "The reason why you want to stop the actor"
  }
}
```

**response**
Upon finishing these requests, it should send a response to the sender's `/:response` mailbox:

```javascript
{
  header: { // added by our broker
    from, // sender's guid
    id, // generated & maintained by the sender (for callbacks)
    timestamp
  },
  request, // the original request here
  response: {
    status: "status.{success, failure.*}",
  }
}
```

### 2.4 Event
Periodically emit status event via `:event/status` (every 5s)

For example:
```js
{
  header: { // added by our broker
    from, // sender's guid
    id, // generated & maintained by the sender (for callbacks)
    timestamp
  },
  params: {
    status: "status.{online, offline}"
  }
}
```

## 3. Actor System
Actor system contains 3 layers and boot in order

1. Core services: Primitive services
- Validator: validate all components
- LED controllers
- Message broker: eMQTT
- Database (redis)
- ActorUp: activates all actors

2. Actors: executable programs in any programming language

**System Service Actor**
- Initializer: initialize devices in the first time
- Updater: check for any update
- Monitor: monitor actor/messages statuses
- Broker: configure brokers (acl, authen)
- Database: database service
- Bridge: connect to the cloud (if feasible)
- Analytics
- Logger
- Housekeeper

**Driver service actor**
- znp
- wifi
- led
- speaker


**Device actors**: A hardware abstraction layer
- Abstract device actors
- Triggers

**User actors**
- Any registered & authorized users
