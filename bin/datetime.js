function getLocalTimeOffset() {
  return new Date().getTimezoneOffset() * 60 * -1;
}

function getDate() {
  return new Date().toDateString();
}

function getTime(offset) {
  let dateObj = new Date(new Date().getTime() + offset * 1000);
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
  if (!offset) {
    offset = getLocalTimeOffset();
  }
  return {
    getTime: function () {
      return getTime(offset);
    },
    getDate: function () {
      return getDate();
    },
  };
};
