var fs = require('fs');
var readline = require('readline');
var stream = require('stream');
var now = require('performance-now');

var instream = fs.createReadStream('itcont.txt');
var outstream = new stream();
var rl = readline.createInterface(instream, outstream);

//get line count for file
var lineCount = 0;

// create array list of names
var names = [];

// donations occurring in each month
var dateDonationCount = [];
var dateDonations = {};

// list of first names, and most common first name
var firstNames = [];
var dupeNames = {};

var t0;
var t1;
var t2;
var t3;
var t4;
var t5;
var t6;
var t7;

rl.on('line', function(line) {
  // increment line count
  console.time('line count');
  t0 = now();
  lineCount++;

  // get all names
  console.time('names');
  t2 = now();
  var name = line.split('|')[7];
  names.push(name);

  // get all first halves of names
  console.time('most common first name');
  t4 = now();
  var firstHalfOfName = name.split(', ')[1];
  if (firstHalfOfName !== undefined) {
    firstHalfOfName.trim();
    // filter out middle initials
    if (firstHalfOfName.includes(' ') && firstHalfOfName !== ' ') {
      firstName = firstHalfOfName.split(' ')[0];
      firstName.trim();
      firstNames.push(firstName);
    } else {
      firstNames.push(firstHalfOfName);
    }
  }

  // year and month
  console.time('total donations for each month');
  t6 = now();
  var timestamp = line.split('|')[4].slice(0, 6);
  var formattedTimestamp = timestamp.slice(0, 4) + '-' + timestamp.slice(4, 6);
  dateDonationCount.push(formattedTimestamp);
});

rl.on('close', function() {
  // total line count
  t1 = now();
  console.log(lineCount);
  console.timeEnd('line count');
  console.log(
    `Performance now line count timing: ` + (t1 - t0).toFixed(3) + `ms`,
  );

  // names at various points in time
  console.log(names[432]);
  console.log(names[43243]);
  t3 = now();
  console.timeEnd('names');
  console.log(`Performance now names timing: ` + (t3 - t2).toFixed(3) + `ms`);

  // most common first name
  firstNames.forEach(x => {
    dupeNames[x] = (dupeNames[x] || 0) + 1;
  });
  var sortedDupeNames = [];
  sortedDupeNames = Object.entries(dupeNames);

  sortedDupeNames.sort((a, b) => {
    return b[1] - a[1];
  });
  console.log(sortedDupeNames[0]);
  t1 = now();
  console.timeEnd('most common first name');
  console.log(
    `Performance now first name timing: ` + (t5 - t4).toFixed(3) + `ms`,
  );

  // number of donations per month
  dateDonationCount.forEach(x => {
    dateDonations[x] = (dateDonations[x] || 0) + 1;
  });
  logDateElements = (key, value, map) => {
    console.log(
      `Donations per month and year: ${value} and donation count ${key}`,
    );
  };
  new Map(Object.entries(dateDonations)).forEach(logDateElements);
  t1 = now();
  console.timeEnd('total donations for each month');
  console.log(
    `Performance now donations per month timing: ` +
      (t7 - t6).toFixed(3) +
      `ms`,
  );
});
