UID
The actor's local UID is: service/led

Mailboxes
The actor uses following mailboxes

1. Requests

For serving requests from other actors

1.1 Turn on led

mailbox: :request/turn_on

message:

{ // added by our broker
  from, // sender's guid
  timestamp
}
{
  params: {
    color: <int 0, 1, 2 for 3 colors>
  }
  id: <add by sender for callback processing when receive response message>
}

response Upon finishing these requests, it should send a response to the sender's 'response' mailbox:

{ // added by our broker
  from, // sender's guid
  timestamp
}
{
  request: <original request here>
  response: {
    params: {
      status: <status.{success, failure}>
    }
  }
}

1.2 Turn off led

mailbox: :request/turn_off

{ // added by our broker
  from, // sender's guid
  timestamp
}
{
  id: <add by sender for callback processing when receive response message>
}

response Upon finishing these requests, it should send a response to the sender's 'response' mailbox:

{ // added by our broker
  from, // sender's guid
  timestamp
}
{
  request: <original request here>
  response: {
    params: {
      status: <status.{success, failure}>
    }
  }
}

1.3 Blink led

{ // added by our broker
  from, // sender's guid
  timestamp
}
{
  params: {
    color: <int 0, 1, 2 for 3 colors>
    freq : <cycle count per second (Hz)>
  }
  id: <add by sender for callback processing when receive response message>
}

response Upon finishing these requests, it should send a response to the sender's 'response' mailbox:

{ // added by our broker
  from, // sender's guid
  timestamp
}
{
  request: <original request here>
  response: {
    params: {
      status: <status.{success, failure}>
    }
  }
}

2. Response

This service is an actuator and generate no request to other actors.

3. Events

3.1 state change

mailbox: :event/state_change

message: messages should conform the format

{ // added by our broker
  from, // sender's guid
  timestamp
}
{
  params: {
    color: <int 0, 1, 2 for 3 colors>
    state : <on, off, blink>
  }
}
