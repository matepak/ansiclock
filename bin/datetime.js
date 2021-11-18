const timeZones = require('./timeZones.json');
function getTimeOffset() {
    return (new Date().getTimezoneOffset()/60)*(-1);
  }

function getDate() {
    return new Date().toDateString();
  }

function getTime(offset) {
    let dateObj = new Date();
    return (
      (dateObj.getUTCHours()+offset).toString().padStart(2, 0) +
      ":" +
      dateObj.getUTCMinutes().toString().padStart(2, 0)
    )
      .split("")
      .map((char) => char + " ")
      .join("");
  }

module.exports.createDateTime = function(timeZone)  {
        let offset = getTimeOffset();
        if(timeZone) {
            offset = timeZones[timeZone].ToUTCdifference;
        }
        return {
        getTime: function() {return getTime(offset)},
        getDate: function() {return getDate()},
        }
}