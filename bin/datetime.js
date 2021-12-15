function getLocalTimeOffset() {
  return new Date().getTimezoneOffset() * 60 * -1;
}

function getDate() {
  return new Date().toDateString();
}

function getTime(offset) {
  if (!offset && offset !== 0) {
    offset = getLocalTimeOffset() * 1000;
  }
  let dateObj = new Date(new Date().getTime() + offset);
  return (
    dateObj.getUTCHours().toString().padStart(2, 0) +
    ":" +
    dateObj.getUTCMinutes().toString().padStart(2, 0)
  )
    .split("")
    .map((char) => char + " ")
    .join("");q
}

module.exports.createDateTime = function (offset) {
  return {
    getTime: function () {
      return getTime(offset);
    },
    getDate: function () {
      return getDate();
    },
  };
};
