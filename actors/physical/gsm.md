GSM Service
=======================


# Overview

This actor works with gsm devices. It must conform `Actor Commons` (see more in `../actor-system.md`)

# UID
The actor's local UID is: `service/gsm`

# Mailboxes
The actor uses following mailboxes:

## 1. Requests
For serving requests from other actors
### 1.1 Send sms

**mailbox:** `:request/send_sms`

**message:**
```javascript
{
  header: { // added by our broker
    from, // sender's guid
    id, // generated & maintained by the sender (for callbacks)
    timestamp
  },

  params: {
    number: //phone number of receiver
    message:
  }
}
```

**response**
Upon finishing these requests, it should send a response to the sender's 'response' mailbox:
```js
{
  header: { // added by our broker
    from, // sender's guid
    id, // generated & maintained by the sender (for callbacks)
    timestamp
  },
  request, // the original request here
  response: {
    status: "status.{success, failure.*}",
    delivered: <true, false> //message is successfully delivered or not
  }
}
```

### 1.2 Make call

**mailbox:** `:request/make_call`

**message:**
```javascript
{
  header: { // added by our broker
    from, // sender's guid
    id, // generated & maintained by the sender (for callbacks)
    timestamp
  },

  params: { 
    number: //phone number to make a call to
  }
}
```

**response**
Upon finishing these requests, it should send a response to the sender's `:response` mailbox:
```js
{
	from, // znp's guid, added by Message Broker automatically
  request, // the original request here
  response: {
    status: "status.{success, failure.*}"  
  }
}
```

## 2. Response
This mailbox contains response from other actors

**mailbox:** `response`

**message:**  messages should conform the format:
```js
{
  header: { // added by our broker
    from, // sender's guid
    id, // generated & maintained by the sender (for callbacks)
    timestamp
  },

  request, // the original request here
  response: {
    status: "status.{success, failure.*}",  
    // any key-value
  }
}
```

## 3. Events
### 3.1 SMS received

**mailbox:** `:event/sms_received`

**message**: messages should conform the format
```js
{
  header: { // added by our broker
    from, // sender's guid
    id, // generated & maintained by the sender (for callbacks)
    timestamp
  },
  params: {
    from: //phone number of sender
    message:
  }
}
```
### 3.2 SMS delivered

**mailbox:** `:event/sms_delivered`

**message**: messages should conform the format
```js
{
  header: { // added by our broker
    from, // sender's guid
    id, // generated & maintained by the sender (for callbacks)
    timestamp
  },
  params: {
    to: //phone number of receiver
  }
}
```

### 3.3 Call received

**mailbox:** `:event/call_received`

**message**: messages should conform the format
```js
{
  header: { // added by our broker
    from, // sender's guid
    id, // generated & maintained by the sender (for callbacks)
    timestamp
  },
  params: {
    from: //phone number of caller
  }
}
```

### 3.4 Gsm start
This message is sent to tell system that the gsm devices is properly started.
**mailbox:** `:event/gsm_started`

**message**: messages should conform the format
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
### 3.5 Gsm error
This message is sent to inform if there is any error with the gsm devices
**mailbox:** `:event/gsm_error`

**message**: messages should conform the format
```js
{
  header: { // added by our broker
    from, // sender's guid
    id, // generated & maintained by the sender (for callbacks)
    timestamp
  },
  params: {
    error: //eror code
  }
}
```

### 3.6 Billing report
This message is sent to inform if there is any error with the gsm devices
**mailbox:** `:event/billing_report`

**message**: messages should conform the format
```js
{
  header: { // added by our broker
    from, // sender's guid
    id, // generated & maintained by the sender (for callbacks)
    timestamp
  },
  params: {
    report: // billing report message received from *101# command
  }
}
```
### 3.7 Carrier report
This message is sent to inform if there is any error with the gsm devices
**mailbox:** `:event/carrier_report`

**message**: messages should conform the format
```js
{
  header: { // added by our broker
    from, // sender's guid
    id, // generated & maintained by the sender (for callbacks)
    timestamp
  },
  params: {
    carrier: <carrier name> // ex: VN VINAPHONE
  }
}
```

### 3.8 Rssi report
This message is sent to inform if there is any error with the gsm devices
**mailbox:** `:event/rssi_report`

**message**: messages should conform the format
```js
{
  header: { // added by our broker
    from, // sender's guid
    id, // generated & maintained by the sender (for callbacks)
    timestamp
  },
  params: {
    report: status.{no_signal,poor,fair,good,excellent} // signal strength status
  }
}
```
