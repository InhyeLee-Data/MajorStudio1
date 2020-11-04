let drawingData; // JSON
let aList =[]; // Array to Contain the list of architecture

let desText =`<p>This page intends to re-imagine W.H. Holmes' voyage to Chichen Itza in 1895 by looking at his field notes.</p>
<p>
  On December 16, 1894 in New York, Holmes begins his journey to Mexico on a steam yacht Ituna with a few other scientific researchers on an invitation. 
  W.H. Holmes was an explorer, anthropologist, artist, cartographer and curator and he left many field notes which contain beautiful and accurate drawings from his field trips.</p>
  <p>
  During the 3 months stay in Yucatan, Chiapas and Oaxaca, a few fieldnotes were created and a book was published later. 
  In his field notes, a single architectural structure was often viewed in many different perspectives; plans or section drawings were drawn and then re-drawn with pencils and ink.
  In this project, related sketches are sequenced, as an attempt to understand the process of W.H.Holmes.
  To make a better visual comparison, some images were cropped from the archived document.
</p>
<p>
Text information for each drawing is referencing transcription by digital volunteers of the Smithsonian Museum and also Holmes' book, Archeological Studies among the Ancient Cities of Mexico. 
Two maps are retrieved from his book as well.
</p>
<p>Could we possibly imagine the feeling of an explorer from these drawings?
</p>  
<span class="info"><b>Data Source</b>
  <ul class="info">
    <li>Smithsonian Institution Archives, Record Unit 7084, SIA_007084_B03_F02(<a href="http://siarchives.si.edu/sites/default/files/media/SIA-SIA_007084_B03_F02.pdf">link</a>), SIA_007084_B03_F03(<a href="http://siarchives.si.edu/sites/default/files/media/SIA-SIA_007084_B03_F03.pdf">link</a>)</li>
    <li>Smithsonian Transcription Center(<a href="https://transcription.si.edu/project/8619">link</a>)</li>
    <li>William H. Holmes, Archeological Studies among the Ancient Cities of Mexico: Part I, Monuments of Yucatan (<a href="https://www.jstor.org/stable/29782002?seq=1#metadata_info_tab_contents">link</a>)</li>
  </ul>
</span>
`;

/*initial*/
document.querySelector('#description').innerHTML = desText;

document.querySelector('#imgContainer').style.backgroundImage = `url('./Resized_IMG/ChichenItza_PanoramaView_By_holmes.gif')`;

fetch('chichenItza.json')
    .then(response => response.json())
    .then((data) => {
        drawingData = data;
        console.log("my chichenItza json", drawingData);
        countNumOfArchitecture(drawingData); //
        let content = document.querySelector('#content');
        displayDataByArchitecture(drawingData);
})

function countNumOfArchitecture(json) {
    json.forEach(function(item) {
        let architecture = item.Architecture;  
        aList.push(architecture); 
        aList = aList.filter(onlyUnique);
        aList = aList.sort( (a,b) => (a > b) ? 1 : -1 ); // order alphabetically
        function onlyUnique(value, index, self) {
            return self.indexOf(value) === index;
          }
     })
     console.log(aList);
     console.log("num of architecture", aList.length); // 5
}

function displayDataByArchitecture(json) {
    // Sort Alphabetically by Architecture name -> IMG order
    let data = json.sort( (a,b) => (a["IMG order"] > b["IMG order"]) ? 1 : -1 );

    let description = document.querySelector('#description');
    let imgContainer = document.querySelector('#imgContainer');
    let prevBtn = document.querySelector('#prevBtn');
    let nextBtn = document.querySelector('#nextBtn');
    let count = 0;

    /* Btns Control */
    prevBtn.addEventListener('click', prevPage);
    nextBtn.addEventListener('click', nextPage);

    /* Arrow Keys Control */
    document.addEventListener("keydown", function(event) {
      //console.log(event.key);
      if (event.key == "ArrowLeft") {
        console.log("left");
        prevPage();
      }
      if (event.key == "ArrowRight") {
        console.log("right");
        nextPage();
      }
    })

    /*Define the action*/
    function prevPage() {
      console.log("which page", count);
      if (count > 0) {
        let item = data[count-1];
        imgContainer.style.backgroundRepeat ="no-repeat";
        imgContainer.style.backgroundImage = `url('${'./Resized_IMG/' + item["IMG link"]}')`;
        //
        let myNum;
        for (let i = 0; i < aList.length; i++) {
          if (item.Architecture == aList[i]) {
            myNum = i + 1; 
          }
        }
        //
        let myMap = './images/' + "chichenItzaMap_"+ myNum +".png";
        console.log("myMap", myMap);
        console.log("myIMG", item["IMG order"]);
        //<li>${item["IMG link"]}</li>
        description.innerHTML = `          
        <div id="des">
            <img id="map" src="${myMap}">
            <h3>${item.Architecture}</h3>
            <h4>${item.Title}</h4>
            <p>${item["Transcription or Longer Des"]}</p>
            <span class="info"><b>Data Source</b>
            <ul class="info">
              <li>${item["Citation"]}</li>
              <li>Page: ${item["PAGE on PDF"]}</li>
              
            </ul>
          </div>`;        
          count--;
      } else {
        imgContainer.style.backgroundImage = `url('./Resized_IMG/ChichenItza_PanoramaView_By_holmes.gif')`;
        description.innerHTML = desText;
        count = data.length;
      }
    }

    function nextPage() {
      console.log("which page", count);
      if (count < data.length) {
        let item = data[count];
        imgContainer.style.backgroundRepeat ="no-repeat";
        imgContainer.style.backgroundImage = `url('${'./Resized_IMG/' + item["IMG link"]}')`;
        //
        let myNum;
        for (let i = 0; i < aList.length; i++) {
          if (item.Architecture == aList[i]) {
             myNum = i + 1; 
          }
        }
        //
        let myMap = './images/' + "chichenItzaMap_"+ myNum +".png";
        console.log("myMap", myMap);
        console.log("myIMG", item["IMG order"]);
        //<li>${item["IMG link"]}</li>
        description.innerHTML = `          
        <div id="des">
            <img id="map" src="${myMap}">
            <h3>${item.Architecture}</h3>
            <h4>${item.Title}</h4>
            <p>${item["Transcription or Longer Des"]}</p>
            <span class="info"><b>Data Source</b>
            <ul class="info">
              <li>${item["Citation"]}</li>
              <li>Page: ${item["PAGE on PDF"]}</li>
              
            </ul>
          </div>`;
        count++;
      } else {
        imgContainer.style.backgroundImage =  `url('./Resized_IMG/ChichenItza_PanoramaView_By_holmes.gif')`;
        description.innerHTML = desText;
        count = 0;
      }
    }
    
}


/* NOT USED HERE */
d3.json('chichenItza.json')
  .then(json => {
      // execute our 
      // display images function
     // displayImages(json);
  }); 

// this function creates all
// of our DOM elements
function displayImages(json){
    // select a <div> with an id of "thumbnails"
    // this is where we want all of our
    // images to be added
    let app  = d3.select('#thumbnails').text('');

    // take our JSON and sort it
    // date descending

    let data = json.sort( (a,b) => (a.Architecture > b.Architecture ) ? 1 : -1 );

    // define "cards" for each item
    let card = app.selectAll('div.smithsonian-card')
                .data(data)
                .join('div')
                .attr('class', 'smithsonian-card');

    // create a div with a class of "image"
    // and populate it with an <img/> tag
    // that contains our filepath
    card.append('div')
        .attr('class', 'image')
        .append('img')
        .attr('src', d => {
            // all our images are in the "images"
            // folder which we will need to 
            // add to our filename first
            return './HD_IMG/' + d["IMG link"]
        });

    
}