// Smithsonian API example code
// check API documentation for search here: http://edan.si.edu/openaccess/apidocs/#api-search-search

// put your API key here;
const apiKey = "6g9qUgS89puB1XZMgn5sNjRZf8K5xmhCjgaS2tL3";  

// search base URL
const searchBaseURL = "https://api.si.edu/openaccess/api/v1.0/search";

// Constructing the search query
// const search =  `mask AND unit_code:"FSG"` + "&start=" + 0 + "&rows=" + 81;
const search =  `female head AND data_source: "Cooper Hewitt, Smithsonian Design Museum AND online_media_type: "3D Images"` + "&start=" + 0 + "&rows=" + 10;

// search: fetches an array of terms based on term category
function fetchSearchData(searchTerm) {
    let url = searchBaseURL + "?api_key=" + apiKey + "&q=" + searchTerm;
    console.log(url);
    window
    .fetch(url)
    .then(res => res.json())
    .then(data => {
      console.log(data);
    })
    .catch(error => {
      console.log(error);
    })
}

fetchSearchData(search); 

/* My Questions 
1. What is unit_code: "FSG" ?
FSG stands for Freer Gallery of Art and Arthur M. Sackler Gallery.
-> "unit_code" is one of the term categories (culture, data_source, date, object_type, online_media_type, place, topic, unit_code).
-> It looks to be part of response.rows[index].id 
-> "unit_code" is the museum acronym.


2. What is the best way to include a search with topics, when there are 44680 topics.

*/
