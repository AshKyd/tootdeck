var formats = [
  [60, 's'],
  [60, 'm'],
  [24, 'h'],
  [365, 'd'],
];

function relativeDate(date, now){
  let diff = (now - date)/1000;
  for(let i in formats){
    const format = formats[i];
    if(diff < format[0]) return `${Math.round(diff)}${format[1]}`;
    diff /= format[0];
  }
  return `${Math.round(diff)}y`;
}

module.exports = relativeDate;
