// Dependencies
var fs = require('fs');
var tmi = require('tmi.js');

// tmi creation
var contents = fs.readFileSync('oauth.token', 'utf8');

// vars
var channel = "nagasen314";
const util = require('util');

var botname = "catriabot";

// tmi options
var options = {
  options: {
    debug: true
  },
  connection: {
    cluster: "aws",
    reconnect: true
  },
  identity: {
    username: botname,
    password: contents
  },
  channels: [channel]
};

var client = new tmi.client(options);
client.connect();

client.on('connected', function(address, port) {
  // You can mess with this to give your bot personality.
  var onConnectMsg = "Why not me, Marth? Anyway, feel free to query me for FEStats(tm?!?).";
  client.action(channel,onConnectMsg);
});

client.on("chat", function (channel, userstate, message, self) {
    var userComp = "#"+ userstate.username;
    if(userComp.localeCompare(channel) === 0) {
    client.action(channel,"Triggering Processor parsing method...");
    return;
  }
  //client.action(channel,util.inspect(userstate, false, null));
  //client.action(channel,userstate.username);
  // Do your stuff.
  if(message.indexOf(botname) > -1) {
    client.action(channel, "I'm " + botname + "! nagasen314 is developing me as a hobby to support FE streamers. Repository at https://github.com/nagasen314/svc-streamstats.git");
    return;
  }   

});

