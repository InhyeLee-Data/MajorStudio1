// Smithsonian API example code
// check API documentation for terms here: http://edan.si.edu/openaccess/apidocs/#api-search-terms

// put your API key here;
const apiKey = "6g9qUgS89puB1XZMgn5sNjRZf8K5xmhCjgaS2tL3";  

// Access to terms by term category (I.e. online_media_type > Images)
const termBaseURL = "https://api.si.edu/openaccess/api/v1.0/terms/";

// search: fetches an array of terms based on term category
function fetchTermsData(termCategory) {
    let url = termBaseURL + termCategory +"?api_key=" + apiKey;
    window
    .fetch(url)
    .then(res => res.json())
    .then(data => {
      console.log(data.response.terms);
      console.log(`There are ${data.response.terms.length} terms in the term category: ${termCategory}`);
    })
    .catch(error => {
      console.log(error);
    })
  }

  fetchTermsData("data_source");
// fetchTermsData("online_media_type");
// fetchTermsData("culture");

/*
Task: Play around with the different categories listed here:
http://edan.si.edu/openaccess/apidocs/#api-search-terms

Questions: 

(1) What other media types are available? 
fetchTermsData("online_media_type");
: ["3D Images", "Catalog cards", "Electronic resource", "Finding aids", "Full text documents", "Images", "Online collections", "Online exhibits", "Scanned books", "Sound recordings", "Specimen labels", "Transcripts", "Video recordings"]

(2) How many cultures are represented? 
fetchTermsData("culture");
 => 4265

(3) What acronyms for museums are there?
fetchTermsData("data_source");
=> NMNH, 
*/