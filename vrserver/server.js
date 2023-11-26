const app = require('express')();
const http = require('http').Server(app);
const socketIO = require('socket.io');
const fs = require('fs');
const path = require('path');
const jsonFolderPath = path.join(__dirname, 'json');
const io = socketIO(http, {
  cors: {
    origin: '*',
  },
});

var users = {};
var sockets = {};
var loggedUsers = [];
var jsonfiles = [];
app.use(function (req, res, next) {

  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header('Access-Control-Allow-Methods', 'DELETE, PUT');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');

  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});


io.on('connection', function (socket) {
  socket.on('join', function (user) {
    if (user) {

      users[user] = socket.id;
      sockets[socket.id] = {
        username: user,
        socket: socket
      };
      var loguser = {};
      loguser = {
        socket: users[user],
        'name': user
      };
      loggedUsers.push(loguser);
      io.emit('user authentication', loggedUsers);
    }

  });


  socket.on('disconnect', function () {
    if (socket.id) {
      for (var i = 0; i < loggedUsers.length; i++) {
        if (socket.id === loggedUsers[i].socket) {
          var index = loggedUsers.indexOf(loggedUsers[i]);
          loggedUsers.splice(index, 1);
        }
      }
      io.emit('user authentication', loggedUsers);
      delete sockets[socket.id];
    }
  });


  socket.on('jsonupdate', function (msg) {
    var to = [];
    to = loggedUsers.filter(function (obj) {
      return obj.name != msg.from && msg.filename === obj.filename;
    });

    const folderPath = 'json'; // Specify the folder path
    const fileName = msg.filename;
    const filePath = path.join(folderPath, fileName);
    let jsn = jsonfiles.find(file=>file.name === msg.filename);
    if(jsn) {
      jsn.user = msg.from
    } else {
      let newjsn = {
      name:msg.filename,
      user:msg.from
      }
      jsonfiles.push(newjsn);
    }

    fs.writeFile(filePath, JSON.stringify(msg.json, null, 2), (err) => {
      if (err) {
        console.error('Error writing JSON to file:', err);
      } else {
        console.log(`JSON data saved to ${msg.filename}`);
      }
    });
    to = uniq(to, 'socket');
    (to).forEach(function (value) {
      var sid = value.socket;
      io.to(sid).emit(
        'notifyjson', msg.json);
    });
    (loggedUsers).forEach(function (value) {
      var sid = value.socket;
      io.to(sid).emit(
        'notifyupdates', jsonfiles);
    });
  });

  socket.on('fileopen', function (msg) {
    for (let i = 0; i < loggedUsers.length; i++) {
      if (loggedUsers[i].name === msg.from) {
        loggedUsers[i]['filename'] = msg.fileName;
      }
    }
    (loggedUsers).forEach(function (value) {
      var sid = value.socket;
      io.to(sid).emit(
        'notifyupdates', jsonfiles);
    });
  });



  /*   socket.on('statusnotify', function (msg) {
      var user = loggedUsers.find(function (obj) {
        return obj.name === msg.from;
      });
      if (user) {
        var sid = sockets[users[user.name]].socket.id;
        io.to(sid).emit('statusnotify', msg);
      }
    }); */


  function uniq(a, param) {
    return a.filter(function (item, pos, array) {
      return array.map(function (mapItem) {
        return mapItem[param];
      }).indexOf(item[param]) === pos;
    });
  }


});


// API to list all JSON file names
app.get('/api/listFiles', (req, res) => {
  fs.readdir(jsonFolderPath, (err, files) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    const jsonFiles = files.filter(file => path.extname(file) === '.json');
    res.json(jsonFiles);
  });
});

// API to get JSON data for a specific file
app.get('/api/getData/:filename', (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(jsonFolderPath, filename);

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    const jsonData = JSON.parse(data);
    res.json(jsonData);
  });
});



/**
 * Server start
 */
http.listen(3003, function () {
  console.log("server started");

});
