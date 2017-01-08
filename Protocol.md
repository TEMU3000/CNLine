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
# Non Socket.io protocol
## On client connect
Server send a list
```bash
  userlist[]{
    id,
    username
  }
```
