var supportedApi = ['stats'];
var supportedGames = ['9','BR'];
//Constructor
function Formatter() {
}

Formatter.prototype.formatChat = function(api_path,data) {
  // process JSON into... other stuff here
  var ret = "";
  var lastKey = Object.keys(data)[Object.keys(data).length - 1];

  // !stats
  if(api_path === "stats") {
    var first=1;
    for(var key in data) {
      if(data.hasOwnProperty(key)) {
        ret += key + ": "
        if(first === 1) {
          first=0;
          for(var i=0;i<data[key].length-1;i++) {
            ret += data[key][i] + ", ";
          }
          ret += data[key][i] + " | ";
        }
        else if (key === lastKey) {
          ret += data[key] + "%";
        }
        else {
          ret += data[key] + "% | ";
        }
      }
    }
  }

  // !skills
  if(api_path === "skills") {
    for(var key in data) {
      if(data.hasOwnProperty(key)) {
        ret += key + ": ";
        if(key === "Name") {
          for(var i=0;i<data[key].length-1;i++) {
            ret += data[key][i] + ", ";
          }
          ret += data[key][i] + " | [Skill/Condition]: ";
          continue;
        }

        if(key === "Skills") {
          // Iterate through each Skill object.
          var skillArr = data[key];
          for(var i=0;i<skillArr.length-1;i++) {
            ret += "[" + skillArr[i]['skillName'] + "/" + skillArr[i]['skillCond'] + "], ";
          }
          ret += "[" + skillArr[skillArr.length-1]['skillName'] + "/" + skillArr[skillArr.length-1]['skillCond'] + "]";
        }
      }
    }
  }

  return ret;
};

// export the class
module.exports = Formatter;