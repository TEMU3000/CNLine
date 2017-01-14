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
        filename
    }
```
Client want this file or not
```bash
    'file confirm': {
        ok (true or false),
        filename
    }
```
Server: u got a new file!
```bash
  'file incoming': {
      sender_id,
      filename
  }
```
## Group related
Client create group room
```bash
    'open group room': {
      uid_list: [user_id list]
    }
```

Server: u have a new group room!
```bash
    'new group room': {
      sender_id,
      uid_list: [user_id list],
      group_id
    }
```

Client send group message
```bash
  'new group message': {
    to_list: [to user_id list],
    group_id: (to group_id),
    msg: (msg "bear: 123")
  }
```

Server send group message
```bash
  'broadcast group msg': {
    group_id,
    msg
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
