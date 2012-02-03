var cloudfoundry = require("cloudfoundry");
var express = require("express");

var users = {'larry': {username: 'larry', token: '123ABC', roles: ['employee']},
  'curly': {username: 'curly', token: '456DEF', roles: ['employee', 'manager']},
  'moe': {username: 'moe', token: '789GHI', roles: ['manager']}};
var passwords = {'larry': 'larry', 'curly': 'curly', 'moe': 'moe'};

var app = express.createServer();

app.configure(function() {
  app.use(express.methodOverride());
  app.use(express.bodyParser());
  app.use(app.router);
});

app.all("/*", function(req, res, next){
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
});

app.post("/authenticate", function(req, res) {
  var username = req.body.username;
  var password = req.body.password;
  console.log("Received username: "+username);
  console.log("Received password: "+password);
  if (!username || !password) { res.send(403); }
  else if (!users[username]) { res.send(403); }
  else if (password != passwords[username]) { res.send(403); }
  else { res.send(users[username]); }
});

app.listen(cloudfoundry.getAppPort());
