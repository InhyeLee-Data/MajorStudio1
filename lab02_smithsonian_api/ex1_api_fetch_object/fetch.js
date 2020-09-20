// Smithsonian API example code
// check full API documentation here: https://edan.si.edu/openaccess/apidocs/


// put your API key here;
const apiKey = "";  

// Access to individual objects by ID
const objectBaseURL = "https://api.si.edu/openaccess/api/v1.0/content/";

//fetches content based on id of an object.
function fetchContentDataById(id) {
  let url = objectBaseURL + id + "?api_key="+apiKey;
  window
  .fetch(url)
  .then(res => res.json())
  .then(data => {
    console.log("Here's the content data of the specified object:", data.response);
  
    const source = data.response.content.descriptiveNonRepeating.data_source;
    const title = data.response.content.descriptiveNonRepeating.title.content;
    let imageLink = data.response.content.descriptiveNonRepeating.online_media.media[0].content;
    const image = document.createElement('img');
    image.src = imageLink;
    image.width = 600;
    document.querySelector('body').appendChild(image);
    console.log(imageLink);
    console.log("Source: " + source);
    console.log("Title: " + title);
    
  })
  .catch(error => {
    console.log(error);
  })
}

fetchContentDataById("edanmdm:npg_NPG.87.123"); // Gertrude Stein Charcoal Drawing

// Task 1: Find a different object on https://collections.si.edu/search/ and retrieve the data with the code above
// Make sure to check the box "Only return results with CC0 media" when searching
// Task 2: Write the result into a variable and explore different variables through the Console

