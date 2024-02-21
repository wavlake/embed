export function dateString(x) {
  const str = new Date(x);
  return `${str.getFullYear()}-${str.getMonth() + 1}-${str.getDate()}`;
}

export function dayString(x) {
  const str = new Date(x);
  return `${str.getMonth() + 1}-${str.getDate()}`;
}

export function monthString(x) {
  const ary = x.split("-");
  return `${ary[0]}-${ary[1]}`;
}

export function dateTimeString(x) {
  const str = new Date(x);
  return `${str.getFullYear()}-${
    str.getMonth() + 1
  }-${str.getDate()} ${str.getHours()}:${
    str.getMinutes() < 10 ? "0" : ""
  }${str.getMinutes(2)}:${str.getSeconds() < 10 ? "0" : ""}${str.getSeconds()}`;
}

export function playsAbbreviated(x) {
  if (x >= 1000) {
    return spliceSlice(parseInt(x / 100).toString(), -1, 0, ".").concat("k");
  } else {
    return parseInt(x)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  }
}

export function sats(x) {
  if (!x) return "0";

  return parseInt(x / 1000)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

// a function that takes in a millisats and returns a string (in sats) with M for millions, k for thousands, and no suffix for numbers less than 1000
export const satsAbbreviated = (num) => {
  const sats = parseInt(num / 1000);

  if (sats >= 1000000) {
    return spliceSlice(parseInt(sats / 100000).toString(), -1, 0, ".").concat(
      "M"
    );
  } else if (sats >= 1000) {
    return spliceSlice(parseInt(sats / 100).toString(), -1, 0, ".").concat("k");
  } else {
    return parseInt(sats)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  }
};

export function time(x) {
  var sec_num = parseInt(x, 10); // don't forget the second param
  var hours = Math.floor(sec_num / 3600);
  var minutes = Math.floor((sec_num - hours * 3600) / 60);
  var seconds = sec_num - hours * 3600 - minutes * 60;

  if (hours < 10) {
    hours = "0" + hours;
  }
  if (minutes < 10) {
    minutes = "0" + minutes;
  }
  if (seconds < 10) {
    seconds = "0" + seconds;
  }
  return hours > 0
    ? hours + ":" + minutes + ":" + seconds
    : minutes + ":" + seconds;
}

function spliceSlice(str, index, count, add) {
  // We cannot pass negative indexes directly to the 2nd slicing operation.
  if (index < 0) {
    index = str.length + index;
    if (index < 0) {
      index = 0;
    }
  }

  return str.slice(0, index) + (add || "") + str.slice(index + count);
}

export function millisats(x) {
  return parseFloat(x / 1000)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

export const convertMsatToSats = (msat) => {
  if (msat < 1000) return "< 1";
  const sats = Math.floor(msat / 1000);

  if (sats >= 1000 && sats < 1000000) {
    const thousands = Math.floor(sats / 1000);
    const remainder = sats % 1000;

    if (remainder > 0) {
      return (sats / 1000).toFixed(2) + "k";
    }
    return thousands + "k";
  } else if (sats >= 1000000) {
    const millions = Math.floor(sats / 1000000);
    const remainder = sats % 1000000;

    if (remainder > 0) {
      return (sats / 1000000).toFixed(2) + "M";
    }

    return millions + "M";
  }

  if (sats > 999 && sats < 999999) {
    // add a comma between the thousands and hundreds
    return sats.toString().slice(0, -3) + "," + sats.toString().slice(-3);
  }

  return sats.toString();
};

export const formatDuration = (duration) => {
  if (typeof duration !== "number") {
    console.log("duration is not a number", duration);
    return "0:00";
  }
  const minutes = Math.floor(duration / 60);
  const seconds = duration % 60;
  return `${minutes}:${seconds}`;
};
