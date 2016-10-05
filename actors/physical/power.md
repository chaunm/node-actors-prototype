POWER
======


The actor's local UID is: `service/power`

## Endpoints
The actor uses following endpointes

### 1. Requests

#### 1.1. Request/hi

**endpoint:** `:request/hi`

**request:**
```js
{
  header,  // added by brokers

  params: { // no params
  },
}
```
**response:**
```js
{
  header, // added by brokers
  request, // the original request
  response: {
      status: "status.{success, failure}",
      "blackout": "true or false. true if there's a electric power outage",
      "blackoutTime": "Unix timestamp at which the outage happens",
      "durationTime": "time in second that the system can work by using battery",
      "elapsedTime": "elapsed time in second since there's a blackout"
  }
}`
```
###2. Response

This service is an actuator and generate no request to other actors.

###3. Events

#### 3.1 Blackout event

**endpoint:** `:event/blackout`

**message:** messages should conform the format
```js
  header: { // added by our broker
    from, // sender's guid
    id, // generated & maintained by the sender (for callbacks)
    timestamp
  },
  params: {
    "blackout" : "true",
    "blackoutTime": "time in ms at which the outage happens"
  }  
```

#### 3.2 Power restored

**endpoint:** `:event/restored`

**message:** messages should conform the format
```js
  header: { // added by our broker
    from, // sender's guid
    id, // generated & maintained by the sender (for callbacks)
    timestamp
  },
  params: {
    "blackout" : "false"
  }  
```
