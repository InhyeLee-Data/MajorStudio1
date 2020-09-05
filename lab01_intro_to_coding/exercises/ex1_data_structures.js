/*
  Exercise 1
  JavaScript data structures & functions
*/

var names = [
  "Rubin Museum",
  "The Cooper Hewitt (Smithsonian)",
  "The Morgan Library and Museum",
  "The Whitney Museum of American Art",
  "The Frick Collection",
  "American Museum of Natural History",
];

var URLs = [
  "rubinmuseum.org",
  "cooperhewitt.org",
  "themorgan.org",
  "whitney.org",
  "frick.org",
  "amnh.org",
];

var years = [
  2004,
  1896,
  1924,
  1930,
  1935,
  1869
];

// Task 1
// Console log the length of each Array
console.log(names.length);
console.log(URLs.length);
console.log(years.length);



// Task 2
// add a new item to an array
var newName = "The International Center of Photography"
var newURL = "icp.org"
var newYear = 1974
//(1)
names.push(newName);
console.log("names is now " + names); 
//(2)
URLs[6] = newURL;
console.log("URLs is now " + URLs); // Check
//(3)
let years2 = [];
years2.push(newYear);
years = years.concat(years2);
console.log("years is now " + years); // Check

// Task 3
// construct an Object out of our three Arrays
// the result should look similar to this:
var result = {
  "Museum Name 1": {
    URL: "www.museumwebsite.com",
    year: 2019
  }
}

var museums = {};
for (var i = 0; i < names.length; i++) {
  var currentName = names[i];
  var currentURL = URLs[i];
  var currentYear = years[i];

  museums[currentName] = {};
  museums[currentName]["URL"] = currentURL;
  museums[currentName].year = currentYear;
}

console.log('museums', museums)

var museums2 = {};
names.forEach(function(name, i) { //item, index
  museums2[name] = {}; // an empty object with the name

  var currentURL = URLs[i];
  var currentYear = years[i];

  museums2[name].URL = currentURL;
  museums2[name]["year"] = currentYear;
});

console.log('museums2', museums2)

// Task
// Write a function to add a new museum object, with properties URL and year, to an existing museums object. Call it on museums2
function addAMuseum(museums, newName, newURL, newYear){

  museums[newName] = {}; // Create an empty object with the name
  museums[newName].URL = newURL; // Push URL
  museums[newName].year = newYear; // Push "year"

  return museums;
}

addAMuseum(museums2, "Smithsonian National Air and Space Museum", "https://airandspace.si.edu/", 1946); // 
addAMuseum(museums2, "MOCA", "https://www.mocanyc.org/", 1980); // 
console.log('updated museums2', museums2);
