# Socket.io protocol
## Request log from server
Client to Server
```bash
  'open room': uid
```
Server to Client
```bash
  'log response': {
    uid,
    log_msg
  }
```
## Send message
Client send an object
```bash
  'new message': {
    to: (destination_userid),
    msg: (msg "bear: 123")
  }
```

Server send an object
```bash
  'broadcast msg': {
    sender_id,
    msg
  }
  'online': u_id
  'offline': u_id
```
## Send file
Client ack send success
```bash
    'file sent': {
        to,
        fileUID
    }
```
Client want this file or not
```bash
    'file confirm': {
        ok (true or false),
        fileUID
    }
```
Server: u got a new file!
```bash
  'file incoming': {
      sender_id,
      fileUID
  }
```

# Non Socket.io protocol
## On client connect
Server send a list
```bash
  userlist[]{
    id,
    username
  }
```
