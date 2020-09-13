// Smithsonian API example code
// check API documentation for search here: http://edan.si.edu/openaccess/apidocs/#api-search-search

// put your API key here;
const apiKey = "6g9qUgS89puB1XZMgn5sNjRZf8K5xmhCjgaS2tL3";  

// search base URL
const searchBaseURL = "https://api.si.edu/openaccess/api/v1.0/search";

// Constructing the search query
//const search =  `female AND head AND data_source: "Cooper Hewitt, Smithsonian Design Museum"` + "&start=" + 0 + "&rows=" + 10;
const search =  `Asian AND data_source: "Cooper Hewitt, Smithsonian Design Museum"` + "&start=" + 0 + "&rows=" + 50;


// array that we will write into
let myArray = [];

// search: fetches an array of terms based on term category
function fetchSearchData(searchTerm) {
    let url = searchBaseURL + "?api_key=" + apiKey + "&q=" + searchTerm;
    console.log(url);

    window
    .fetch(url)
    .then(res => res.json())
    .then(data => {
      data.response.rows.forEach(function(n) {
      //console.log(n);  // Check the object 
         addObject(n);
      })
    })
    .catch(error => {
      console.log(error);
    })

}


// create your own array with just the data you need
function addObject(objectData) {
  let currentID = objectData.id;
  let currentTitle = objectData.title;
  // let objectLink = objectData.content.descriptiveNonRepeating.record_link;
  let imageLink = objectData.content.descriptiveNonRepeating.online_media.media[0].content
  let index = myArray.length;
  
  myArray[index] = {};
  myArray[index]["title"] = currentTitle;
  myArray[index]["id"] = currentID;
  myArray[index]["imageLink"] = imageLink;
  console.log("object at index", index, myArray[index]);
}

fetchSearchData(search);

// Fetch data and write only the most important pieces into your own custom array

/* My questions

1. Does the search with two keywords combined with "AND" give back the results I intended?
At the moment, it seems to skip one of the keyword. This is a thing to look into..

2. What is the best way to include multiple conditions in search ?
ex) Search a mask or a headpiece for women only


*/ 
