// Smithsonian API example code
// check API documentation for search here: http://edan.si.edu/openaccess/apidocs/#api-search-search
// Using this data set https://collections.si.edu/search/results.htm?q=Flowers&view=grid&fq=data_source%3A%22Cooper+Hewitt%2C+Smithsonian+Design+Museum%22&fq=online_media_type%3A%22Images%22&media.CC0=true&fq=object_type:%22Embroidery+%28visual+works%29%22

// put your API key here;
const apiKey = " ";  

// search base URL
const searchBaseURL = "https://api.si.edu/openaccess/api/v1.0/search";

// constructing the initial search query
//https://npg.si.edu/
const search =  `male AND unit_code: "NPG" AND online_media_type: "Images" AND object_type: "painting"`; //AND object_type: "painting"
// const search =  `Flowers AND unit_code:"CHNDM" AND object_type:"Embroidery (visual works)" AND online_media_type:"Images"`;
// ** Search terms: culture, data_source, date, object_type, online_media_type, place, topic, unit_code

// array that we will write into
let myArray = [];

// string that will hold the stringified JSON data
let jsonString = '';

// search: fetches an array of terms based on term category
function fetchSearchData(searchTerm) {
    let url = searchBaseURL + "?api_key=" + apiKey + "&q=" + searchTerm;
    console.log(url);
    window
    .fetch(url)
    .then(res => res.json())
    .then(data => {
      console.log(data)
      // constructing search queries to get all the rows of data
      // you can change the page size
      let pageSize = 1000;
      let numberOfQueries = Math.ceil(data.response.rowCount / pageSize);
      console.log(numberOfQueries)
      for(let i = 0; i < numberOfQueries; i++) {
        // making sure that our last query calls for the exact number of rows
        if (i == (numberOfQueries - 1)) {
          searchAllURL = url + `&start=${i * pageSize}&rows=${data.response.rowCount - (i * pageSize)}`;
        } else {
          searchAllURL = url + `&start=${i * pageSize}&rows=${pageSize}`;
        }
        console.log(searchAllURL)
        fetchAllData(searchAllURL);
      
      }
    })
    .catch(error => {
      console.log(error);
    })
}

// fetching all the data listed under our search and pushing them all into our custom array
function fetchAllData(url) {
  window
  .fetch(url)
  .then(res => res.json())
  .then(data => {
   // console.log(data)

    data.response.rows.forEach(function(n) {
      addObject(n);
    });
    jsonString += JSON.stringify(myArray);
    console.log(myArray); // Here I show the array of saved objects

    // ***** Show my image here?
    // let image;
    // image.src = data.imageLink; // for each data
    // image.width = 100;
    // document.querySelector('body').appendChild(image);
    //console.log(imageLink);

  })
  .catch(error => {
    console.log(error);
  })

}

// create your own array with just the data you need
function addObject(objectData) {  
  // we've encountered that some places have data others don't
  //************ SANITY CHECK: TO BE OR NOT TO BE ?************//
  let state = ""; // PLACE[0]
  let country = ""; // PLACE[1]
  let publishedDate = ""; // YEAR
  let dateInIndex = ""; // approximate Year info in structuredIndex
  let medium = "";
  let dimension = "";// Physical SIZE of the portrait -> This is the data I'm interested in for visualizing
  let width_height = [];
  let imageURL ="";
  let link = "";
  let source ="";

  /* PLACE - state & country */
  if (objectData.content.indexedStructured.place) { 
    state = objectData.content.indexedStructured.place[0];
    country = objectData.content.indexedStructured.place[1];
  }
  /* DATE */
  if (objectData.content.freetext.date) {
    publishedDate = objectData.content.freetext.date[0].content; //YEAR info
  }
  if (objectData.content.indexedStructured.date) {
    dateInIndex = objectData.content.indexedStructured.date[0]; // circa...
  } 
  /* MEDIUM */
  if (objectData.content.freetext.physicalDescription[0]) {
    medium = objectData.content.freetext.physicalDescription[0].content;
  }
  /* DIMENSION */
  if (objectData.content.freetext.physicalDescription[1]) {
    dimension = objectData.content.freetext.physicalDescription[1].content;

    // Data Cleaning for Dimension
    let myDim = [];
    // (1) Remove everything inside a parenthesis; -> I only care about metric dimension
    myDim = dimension.replace(/\([^()]*\)/g, ''); 
    // (2) Get rid of all alphabet. Don't remove numbers or .
    myDim = myDim.replace(/[^\d.]/g, ' ').trim().split(" ");
    // (3) Remove all "" (null) values from array
    myDim = myDim.filter(word => word.length > 1);
    // (4) Some contain depth info. Some contain only one dimension
    if (myDim.length >= 2) {
      width_height[0] = Number(myDim[0]);
      width_height[1] = Number(myDim[1]);
    }
    else {
      width_height[0] = Number(myDim[0]);
      width_height[1] = 0;
    } 
    console.log(width_height);


  } // It looks like we have items that are missing dimension info

  /* IMAGE URL*/
  if (objectData.content.descriptiveNonRepeating.online_media) {
    imageURL = objectData.content.descriptiveNonRepeating.online_media.media[0].content;
  }

  /* Link */
  if (objectData.content.descriptiveNonRepeating.record_link) {
    link = objectData.content.descriptiveNonRepeating.record_link;
  }
  /* SOURCE */
  if (objectData.content.descriptiveNonRepeating.data_source) {
    source = objectData.content.descriptiveNonRepeating.data_source;
  }
 
 // May need to add some conditionals here later to filter items, before push
 // For example, only push when " dimension- both width and height " exists
 if (width_height[1] != 0 ) { // Only push with both width & height
      myArray.push({ //objectData === data.response
        id: objectData.id,
        title: objectData.title,
        date: publishedDate,
        circa: dateInIndex, //approximate period
        link: link,
        state: state,
        country: country,
        medium: medium,
        dimension: dimension,
        width_height: width_height,
        source: source,
        imageLink: imageURL
      })
 }

}


fetchSearchData(search);


//---------------------------UNIT CODES------------------------------
// ACAH: Archives Center, National Museum of American History
// ACM: Anacostia Community Museum
// CFCHFOLKLIFE: Smithsonian Center for Folklife and Cultural Heritage
// CHNDM: Cooper-Hewitt, National Design Museum
// FBR: Smithsonian Field Book Project
// FSA: Freer Gallery of Art and Arthur M. Sackler Gallery Archives
// FSG: Freer Gallery of Art and Arthur M. Sackler Gallery
// HAC: Smithsonian Gardens
// HMSG: Hirshhorn Museum and Sculpture Garden
// HSFA: Human Studies Film Archives
// NAA: National Anthropological Archives
// NASM: National Air and Space Museum
// NMAAHC: National Museum of African American History and Culture
// NMAfA: Smithsonian National Museum of African Art
// NMAH: Smithsonian National Museum of American History
// NMAI: National Museum of the American Indian
// NMNHANTHRO: NMNH - Anthropology Dept.
// NMNHBIRDS: NMNH - Vertebrate Zoology - Birds Division
// NMNHBOTANY: NMNH - Botany Dept.
// NMNHEDUCATION: NMNH - Education & Outreach
// NMNHENTO: NMNH - Entomology Dept.
// NMNHFISHES: NMNH - Vertebrate Zoology - Fishes Division
// NMNHHERPS: NMNH - Vertebrate Zoology - Herpetology Division
// NMNHINV: NMNH - Invertebrate Zoology Dept.
// NMNHMAMMALS: NMNH - Vertebrate Zoology - Mammals Division
// NMNHMINSCI: NMNH - Mineral Sciences Dept.
// NMNHPALEO: NMNH - Paleobiology Dept.
// NPG: National Portrait Gallery
// NPM: National Postal Museum
// SAAM: Smithsonian American Art Museum
// SI: Smithsonian Institution, Digitization Program Office
// SIA: Smithsonian Institution Archives
// SIL: Smithsonian Libraries
