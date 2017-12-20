// Dependencies
var fs = require('fs');
var tmi = require('tmi.js');
var Processor = require('./Processor.js');
var Formatter = require('./Formatter.js');

// tmi creation
var contents = fs.readFileSync('oauth.token', 'utf8');

// vars
var channel = "Smaepdii"; //"nagasen314";
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

var p = new Processor("127.0.0.1",8888);
var f = new Formatter();

var client = new tmi.client(options);
client.connect();

client.on('connected', function(address, port) {
  // You can mess with this to give your bot personality.
  var onConnectMsg = "Why not me, Marth? Anyway, feel free to query me for FE stats. Supported commands: !stats.";
  client.action(channel,onConnectMsg);
});

client.on("chat", function (channel, userstate, message, self) {
  var userComp = "#"+ userstate.username;
  if(true) { //userComp.localeCompare(channel) === 0) {
    //client.action(channel,"[DEBUG] Triggering Processor parsing method...");
    var options = p.processChat(message);
    if(options === "")
      return;

    var result = p.invokeApi(options, function(data) {
      delete data._id;
      console.log(data);
      var ftype = "";
      if(options.api_path === "stats") {
        if(options.query_type === "growths")
          ftype="%";
        //if(options.query_type === "bases")
        //  ftype="";
      }
      var outStr = f.formatChat(options.api_path,data,ftype);

      client.action(channel,outStr);//JSON.stringify(data));
    });
    
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

