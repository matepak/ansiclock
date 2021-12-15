function getLocalTimeOffset() {
  return new Date().getTimezoneOffset() * 60 * -1;
}

function getDate(offset) {
  let dateObj = new Date(new Date().getTime() + offset);
  return dateObj.toDateString();
}

function getTime(offset) {

  let dateObj = new Date(new Date().getTime() + offset);
  return (
    dateObj.getUTCHours().toString().padStart(2, 0) +
    ":" +
    dateObj.getUTCMinutes().toString().padStart(2, 0)
  )
    .split("")
    .map((char) => char + " ")
    .join("");
}

module.exports.createDateTime = function (offset) {
  if (offset === undefined) {
    offset = getLocalTimeOffset() * 1000;
  } else {
    offset *= 1000;
  }
  return {
    getTime: function () {
      return getTime(offset);
    },
    getDate: function () {
      return getDate(offset);
    },
  };
};
