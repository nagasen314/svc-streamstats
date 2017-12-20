const http = require('http');

//Constructor
function Processor(h,p) {
  this.hostname=h;
  this.port=p;
  this.nullStr="";
}

Processor.prototype.processChat = function(input) {
  // process into APIs here
  var words = input.split(" ");
  var apiOptions = this.buildApi(words);
  if(apiOptions === this.nullStr) {
    return this.nullStr;
  }
  return apiOptions;
};

Processor.prototype.invokeApi = function(options, callback) {
  // Need to dynamically add parameters to URL.
  var url = "http://" + this.hostname + ":" + this.port + "/api/" + options.api_path + "?";
  var lastKey = Object.keys(options)[Object.keys(options).length - 1];
  console.log(options);
  for(var key in options) {
    if(key === "api_path")
      continue;

    url += key + "=" + options[key];
    if(key === lastKey) {
      continue;
    }
    url += "&";
  }
  console.log("[DEBUG] URL: " + url);

  // Make the request
  http.get(url, (res) => {
    // Pull status code and content type
    const statusCode = res.statusCode;
    const contentType = res.headers['content-type'];

    // Error out if response not 200
    var error;
    if (statusCode !== 200) {
      error = new Error('Request Failed.\n' +
                        "Status Code: " + statusCode);
    } else if (contentType !== "application/json; charset=utf-8") {
      error = new Error('Invalid content-type.\n' +
                        `Expected application/json but received ${contentType}`);
    }
    if (error) {
      console.error(error.message);
      // consume response data to free up memory
      res.resume();
      return;
    }

    // Chunking received data.
    res.setEncoding('utf8');
    var rawData = '';
    res.on('data', (chunk) => { rawData += chunk;});
    res.on('end', () => {
      try {
        const parsedData = JSON.parse(rawData);
        console.log("[DEBUG] Data received: " + parsedData);
        callback(parsedData);
      } catch (e) {
        console.error(e.message);
      }
    });
  }).on('error', (e) => {
    console.error(`Got error: ${e.message}`);
  });
}; 

Processor.prototype.buildApi = function(arr) {
  // Parse array into API call
  var supportedCommands = ['!stats','!skills'];
  var supportedGames = ['TRS','10'];
  if (arr.length === 4) {
    // If Command supported
    var commandLoc = supportedCommands.indexOf(arr[0]);
    if(commandLoc > -1) {
      // Strip ! from command to form API sub-block.
      var commandStr =  arr[0].substring(1,arr[0].length);
      // If game supported
      var gameLoc = supportedGames.indexOf(arr[1]);
      if(gameLoc > -1) {

        //!stats id_game id_char growths
        //!stats id_game id_char bases
        if (commandStr.localeCompare("stats") === 0) {

          return {
            api_path: commandStr,
            id_game: arr[1],
            id_char: arr[2],
            query_type: arr[3]
          };
        }

        //!skills id_game class id_class
        //!skills id_game char id_char
        if (commandStr.localeCompare("skills") === 0) {
          return {
            api_path: commandStr,
            id_game: arr[1],
            id_char: arr[3],
            id_type: arr[2]
          };         
        }
      }
    }
  }
  return this.nullStr;
  
}


// export the class
module.exports = Processor;