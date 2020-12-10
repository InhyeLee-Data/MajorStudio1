// Initial: 
const margin = {top: 5, right: 5, bottom: 5, left: 5};
// let salonWidth = window.innerWidth;
// let salonHeight = window.innerHeight;
let salonWidth = 1400;
let salonHeight = 1000;
let scl = 0.2; // For relative Scaling: To change the size of thumbnails 0.25 (good view) 
// let scl = (window.innerHeight  / window.innerWidth ) /2;

// VER: Attaching a picture on rollover. // Change of container size
let portraits; // JSON
let oneClusterPos, twoClustersPos, decadePos;
let allTitles = []; // Array that contains necessary portrait data
let femaleTitles =[];
let maleTitles = []; 
let oneClusterArr = [];
let twoClustersArr = [];
let decadeArr = [];
let sizeArr = [];

let centerX =  salonWidth/2;   
let centerY =  salonHeight/2;
let centerYs = [salonHeight/5, (salonHeight/4)*3 ];
let centerXs = [salonWidth/5, (salonWidth/4)*3 ];

let node; // each picture in the nodes
let statBar;// Info to show stat


// FOR STATS
let oneHundredCM;

let colors = {female: "#f1ce4a", male: "#4290c6"} // yellow: f1ce4a, blue: 4290c6 //old colors: #E6E634, #329191
              
// * create a tooltip to show further Information about the artwork
let tooltip = d3.select('div.tooltip')
                    .style("opacity", 0);

let stattip = d3.select('div.stattip')
                    .style("opacity", 0);

let mainContainer;
let addedH = 30;
let salonFrame; 
let legend;
let frontDes;


Promise.all([
  d3.json('data/data_all_painting.json'), 
  d3.json('data/oneClusterPos.json'),
  d3.json('data/twoClustersPos.json'),
  d3.json('data/decadePos.json'),
  d3.json('data/sizePos.json')
  ])
.then(([portraits, oneClusterPos, twoClustersPos, decadePos, sizePos]) => {
  portraits = portraits; // json
  oneClusterPos = oneClusterPos;
  twoClustersPos = twoClustersPos;
  decadePos = decadePos;
  sizePos = sizePos;
  // console.log("oneClusterPos", oneClusterPos);
  // console.log("twoClustersPos", twoClustersPos);
  //console.log("decadePos", decadePos);
  analyzeData(portraits, oneClusterPos, twoClustersPos, decadePos, sizePos);
  basicSetup();     
})

function analyzeData(portraits, oneClusterPos, twoClustersPos, decadePos, sizePos) {
  portraits.forEach(function(n,i) {
    let title = n.title;
    let year = Number(n.circa.replace(/[^\d.]/g, '')); // data cleaning - Only digits
    let width = n.width_height[0]*scl;
    let height = n.width_height[1]*scl; 
    let x = Math.random() * salonWidth;
    let y = Math.random() * salonHeight;
    let dim = width * height; 
    let gender = n.gender;
    let imgURL = n.imageLink;   //console.log(year); // Check the year

    // Now, images are in a local folder;    // Remove everything except for the file name  
    if (imgURL) { // Only do the following when there is an image URL
        imgURL = imgURL.replace("https://ids.si.edu/ids/deliveryService?id=", "");
        imgURL = './images/' + imgURL +".jpg";
    } else { imgURL = "";}
    
    let pageURL = n.link; // page Link
    let groupShot = n.groupShot; // Is this a group shot?
    let match = false; // Check if we already have the entry

    // see if the work already exists the allTitles array = Triple Checker
    allTitles.forEach(function(p){
        if (p.title == title && p.year == year && p.dim == dim) { //&& p.year == year && p.dim == dim
          match=true;
        }
    })

    if (!groupShot && !match && year > 0 && height && width && dim) { 
        allTitles.push({
                title: title,
                year: year,
                width: height,
                height: width, // ** Switch two vals here because it was so in data
                x: x,
                y: y,
                dim: dim,
                gender: gender,
                imgURL: imgURL,
                pageURL: pageURL,
                groupShot: groupShot,
                id: i
        });
    } 
  });   
    // **** Work Sorting Logic   
    allTitles = allTitles.sort((a,b) => a.id - b.id); // YEAR: Ascending order

    let picWMax = d3.max(allTitles, (d) => d.width/scl); //Max Width 
    let picHMax = d3.max(allTitles, (d) => d.height/scl); //Max Width 
    console.log("picWMax", picWMax);
    console.log("picHMax ", picHMax);

    let scl_picWMax= d3.max(allTitles, (d) => d.width); 
    let scl_picHMax= d3.max(allTitles, (d) => d.height); 
    console.log("scl_picWMax", scl_picWMax);
    console.log("scl_picHMax ", scl_picHMax);

    oneHundredCM = (scl_picWMax  * 100 ) / picWMax
    console.log("oneHundredCM", oneHundredCM);

    oneClusterPos.forEach(function(n) {
      let x = n.x;
      let y = n.y;
      let id = n.id;
      let title = n.title;
      oneClusterArr.push({
                x: x,
                y: y,
               id: id,
               title: title
          })      
    })
    oneClusterArr.sort((a,b) => a.id - b.id); //position array sort by ID 

    twoClustersPos.forEach(function(n) {
      let x = n.x;
      let y = n.y;
      let id = n.id;
      let title = n.title;
      twoClustersArr.push({
                x: x,
                y: y,
               id: id,
               title: title
          })      
    })
    twoClustersArr.sort((a,b) => a.id - b.id); //position array sort by ID 
    console.log("twoClustersArr", twoClustersArr);

    decadePos.forEach(function(n) {
      let x = n.x;
      let y = n.y;
      let id = n.id;
      let title = n.title;
      decadeArr.push({
                x: x,
                y: y,
                id: id,
                title: title
          })      
    })
    decadeArr.sort((a,b) => a.id - b.id); //position array sort by ID 
    console.log("decadeArr", decadeArr);


    sizePos.forEach(function(n) {
      let x = n.x;
      let y = n.y;
      let id = n.id;
      let title = n.title;
      sizeArr.push({
                x: x,
                y: y,
                id: id,
                title: title
          })      
    })
    sizeArr.sort((a,b) => a.id - b.id); //position array sort by ID 
    console.log("sizeArr", sizeArr);

} // end of analyze data

  // Set Up 
function basicSetup() {
   mainContainer = d3.select('#vis_all')
      .append('svg')
      .attr('viewBox', [0, 0, salonWidth, salonWidth])
      // .attr('width', window.innerWidth)
      // .attr('height', window.innerHeight)
      .attr('x', 0)
      .attr('y', 0)
     // .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

     salonFrame = mainContainer // a separate Frame to contain the pictures 
     .append("rect")
     .attr("class", "frame")
     .attr("x", 0)
     .attr("y", 0)
     // .transition().duration(10)
     .attr('width', salonWidth)
     .attr('stroke',  "#000") // "#707070"
     .attr('stroke-width', '1')
     .attr('stroke-opacity', 1)
     .style('fill', "#fff")

    salonFrame 
          .attr('height', salonHeight - addedH *3);

     node = mainContainer.append("g")
     .selectAll("rect.painting")
     .data(allTitles) // oneClusterPos allTitles
     .join("rect")
     .attr("class", "painting")
     // .attr("x", d => d.x - d.width/2)
     // .attr("y", d => d.y - d.height/2)
     .attr('width', d => d.width)
     .attr('height', d => d.height)
         .attr("page", (d) => d.pageURL) // id, unique serial number
         .attr('xlink:href', (d) => d.imgURL)
         .attr('stroke',  "#707070") // "#707070"
         .attr('stroke-width', '1')
         .attr('stroke-opacity', 0.5)
         .style('fill', d => {
             if (d.gender === "female") {
                 return colors.female;
             }
             if (d.gender === "male") {
                 return colors.male;
             }
         }) 
    
      let scl_picWMax= d3.max(allTitles, (d) => d.width); 
      let xPos = salonWidth - scl_picWMax +2;
         node
         .style("opacity", 1)
         .attr("x", (d,i) => (xPos/(allTitles.length))*i)
         .attr("y", (d,i) => (salonHeight- addedH *3)/2 - d.height/2)

    // LEGEND -  STAYS THERE THE WHOLE TIME
    legend = mainContainer
    .append("g")
    .attr("class", "legend")

    legend  
      .append("text")
      .text("* These two squares represent a dimension of 100x100cm each")
      .attr('font-size', "0.8em")
      .attr('y', 33) //myH - margin.top
      .attr('x', salonWidth -15)  
      .attr('text-anchor', 'end')
      

    legend
      .append("text")
      .text("Famale")
      .attr('font-size', "0.8em")
      .attr('y', 57) //myH - margin.top
      .attr('x', salonWidth - 40)  
      .attr('text-anchor', 'end')
      .attr('fill', "#413D3D")

    legend
      .append("rect")
      .attr("x", salonWidth - 35)
      .attr("y", 43)
      .attr('width', oneHundredCM)
      .attr('height', oneHundredCM)
      .style('fill', colors.female)

      legend  
      .append("text")
      .text("Male")
      .attr('font-size', "0.8em")
      .attr('x', salonWidth - 40)  
      .attr('y', 79) //myH - margin.top
      .attr('text-anchor', 'end')
      .attr('fill', "#413D3D")

    legend
      .append("rect")
      .attr("x", salonWidth - 35)
      .attr("y", 65)
      .attr('width', oneHundredCM)
      .attr('height', oneHundredCM)
      .style('fill', colors.male)
    
      preSalon(); 
}



function nullEvertyhing() {
  mainContainer.selectAll('image.picture')
  .remove();
  mainContainer.selectAll('text.yearText')
  .remove();
  mainContainer.select('g.frontDes')
  .remove();
  mainContainer.select('g.stat')
  .remove();
  
  stattip.transition()
        .duration(200)
        .style("opacity", 0);
}

function preSalon(){ // Show All pictures together
    nullEvertyhing();

    salonFrame
          .transition().duration(1500)
          .attr('height', salonHeight - addedH *3)
    
          let scl_picWMax= d3.max(allTitles, (d) => d.width); 
          let xPos = salonWidth - scl_picWMax +2;

    node
    .transition().duration(2000)
    .style("opacity", 1)
    .attr("x", (d,i) => (xPos/(allTitles.length))*i)
    .attr("y", (d,i) => (salonHeight- addedH *3)/2 - d.height/2)

    // ******* DESCRIPT
    const desW = 400; 
    const desH = 400;    

    frontDes= mainContainer
           .append("g")
           .attr("class", "frontDes")
               
    const box = frontDes.append("rect")
      .attr("x", salonWidth/2 - desW/2)
      .attr("y", (salonHeight - addedH *3)/2 - desW/2)
      .attr("width", desW)
      .attr('height', desH)
      .style('fill', "#CCC")
      // .style("opacity", 0)

    box
    // .transition().duration(1000).delay(500)  
      .style("opacity", .75)
      .attr('stroke',  "#707070") // "#707070"
      .attr('stroke-width', '1')
      .attr('stroke-opacity', 0.5)
  
    let introT = frontDes
    .append("g")
    .attr("x", 0)
    .attr("y", 0)
    // .style("opacity", 0)

  let introTexts = [
    "A PORTRAIT is an artistic representation of a person, where", 
    "the face and its expression is predominant.",
    " ",
    "Does the size of a portrait tell anything about the social ", 
    "status or power of an individual?", 
    " ",
    "Would people of more importance have had a bigger ", 
    "presence on canvas ?",
    " ",
    "For this visualization, the actual dimension ",
    "(width x height) of each painting in National Portrait Gallery",
    "at The Smithsonian institute is extracted from each work’s", 
    "record. This information is then used to visually compare",
    "portrait sizes in the collection, as in a salon exhibiiton",
    "",
    "By looking at the size of the work, We might be able to ", 
    "imagine the time and efforts spent for the portrait and infer", 
    "the subject figure’s dominance in a society at that time. "
  ]

  introTexts.forEach((text, i) => {
      introT
        .append("text")
        .attr("class", "introT")
        .text(text)
        .attr('x', salonWidth/2 - desW/2 + 25)  
        .attr('y', (salonHeight - addedH *3)/2 - desW/2  + 30+ i*20) 

      introT  
        // .transition().duration(1000).delay(500) 
        .style("opacity", "1")
        .attr('x', salonWidth/2 - desW/2 + 25)  
        .attr('y', (salonHeight - addedH *3)/2 - desW/2  + 30+ i*20) 
        //myH - margin.top
  })

      mainContainer.selectAll('.introT')
      .attr('font-size', "0.95em")
      .attr('text-anchor', 'left')
      .attr('text-anchor', 'top')

}

function genderView() {
  nullEvertyhing();

  salonFrame
  .transition().duration(1500)
  .attr('height', salonHeight -addedH *3)

  console.log("two Clusters");
  node // start from two cluster lication; 
    .transition().duration(2000)
    .style("opacity", 1)
    .attr("x", (d,i) => twoClustersArr[i].x - d.width/2)
    .attr("y", (d,i) => twoClustersArr[i].y - d.height/2)

   imageViewer(node);
}


function statView() {
  nullEvertyhing();

  salonFrame
    .transition().duration(1500)
    .attr('height', salonHeight - addedH *3);
  console.log("stats view");
  // Start from one cluster location;
  node
    .transition().duration(1000)
    .style("opacity", 0)

  // SHOW STAT
  displayStat(); 

}

function displayStat() {
  // Display important statistics
  // Whole Area created by Female VS Male   

    let femaleArea, maleArea, scl_femaleArea, scl_maleArea;
    let scl_femaleArea_w, scl_maleArea_w , scl_total_w; 
     
    scl_femaleArea = d3.sum(allTitles, d => {if (d.gender =="female") return d.dim});
    scl_maleArea = d3.sum(allTitles, d => {if (d.gender =="male") return d.dim});
    scl_femaleArea_w = Math.sqrt(scl_femaleArea);
    scl_maleArea_w = Math.sqrt(scl_maleArea);
    scl_total_w = scl_femaleArea_w + (scl_maleArea / scl_femaleArea_w) ;
    femaleArea = Math.round ((scl_femaleArea / scl) /scl);
    maleArea = Math.round ((scl_maleArea / scl) / scl) ;
    console.log("femaleArea: maleArea", femaleArea, maleArea);
    console.log("scl_femaleArea: scl_maleArea", scl_femaleArea, scl_maleArea);

    let femaleNums, maleNums;
    femaleNums = d3.sum(allTitles, d => {if (d.gender =="female") return 1});
    maleNums = d3.sum(allTitles, d => {if (d.gender =="male") return 1});
    console.log("femaleNums: maleNums", femaleNums, maleNums);

    let femaleMean, maleMean, scl_femaleMean, scl_maleMean; 
    let scl_femaleMean_w, scl_maleMean_w, scl_total_Mean_w; 
    scl_femaleMean = d3.mean(allTitles, d => {if (d.gender =="female") return d.dim })
    scl_maleMean = d3.mean(allTitles, d => {if (d.gender =="male") return d.dim })

    scl_femaleMean_w = Math.sqrt(scl_femaleMean);
    scl_maleMean_w = Math.sqrt(scl_maleMean);
    scl_total_Mean_w = scl_femaleMean_w + (scl_maleMean / scl_femaleMean_w) ;

    femaleMean = Math.round  ((scl_femaleMean / scl) / scl);
    maleMean = Math.round ((scl_maleMean / scl) / scl);
    console.log("femaleMean: ", femaleMean, "maleMean: ", maleMean);
    console.log("scl_femaleMean: ", scl_femaleMean, "scl_maleMean: ", scl_maleMean);

    let femaleMedian, maleMedian, scl_femaleMedian, scl_maleMedian; 
    let scl_femaleMedian_w, scl_maleMedian_w, scl_total_Median_w; 
    scl_femaleMedian = d3.median(allTitles, d => {if (d.gender =="female") return d.dim })
    scl_maleMedian = d3.median(allTitles, d => {if (d.gender =="male") return d.dim })

    scl_femaleMedian_w = Math.sqrt(scl_femaleMedian);
    scl_maleMedian_w = Math.sqrt(scl_maleMedian);
    scl_total_Median_w = scl_femaleMedian_w + (scl_maleMedian / scl_femaleMedian_w) ;

    femaleMedian = (scl_femaleMedian / scl) / scl;
    maleMedian = (scl_maleMedian / scl) / scl;

    console.log("femaleMedian: ", femaleMedian, "maleMean: ", maleMedian);
    console.log("scl_femaleMedian: ", scl_femaleMedian, "scl_maleMean: ", scl_maleMedian);

  statBar = mainContainer // a separate Frame to contain the pictures 
    .append("g")
    .attr("class", "stat");

      const whiteBG =  statBar
      .append("rect")
      .attr('x', 0) 
      .attr('y', 0)
      .style('fill', "#ddd")  
      .attr('width', salonWidth)
      .attr('height', salonHeight -addedH *3)
      .style("opacity", 0)

      const statT1 =  statBar.append('text')
      .attr('class','statText') 
      .text("AVERAGE DIMENSION OF A PAINTING")  
      .attr('font-size', "1.2em")
      .attr('x', (salonWidth - scl_total_w)/2 )
      .attr('y', 290)
      .attr('fill', "#413D3D")
      .attr('text-anchor', 'start')
      .style("opacity", 0)

      // AVERAGE SIZE 
      const averageF =  statBar
      .append("rect")
      .attr('x', (d,i) => {
          let xPos = (salonWidth - scl_total_w)/2  ; // What's my xPos
          return  xPos;
      }) 
      .attr('y', (d,i) => {
          return 300;
      })
      .attr('height', scl_femaleMean_w)
      .attr('width', scl_femaleMean/scl_femaleMean_w)
      .style('fill', (d,i) => {
              return colors.female;
      })     
      .attr('stroke',  "#707070") // "#707070"
      .attr('stroke-width', '1')
      .attr('stroke-opacity', 0.5)
      .style("opacity", 0)

      const averageM =  statBar
      .append("rect")
      .attr('x', (salonWidth - scl_total_w)/2 )
      .attr('y', (d,i) => {
          return 320;
      })
      .attr('height', scl_maleMean_w)
      .attr('width', scl_maleMean/scl_maleMean_w)
      .style('fill', (d,i) => {
              return colors.male;
      })     
      .attr('stroke',  "#707070") // "#707070"
      .attr('stroke-width', '1')
      .attr('stroke-opacity', 0.5)
      .style("opacity", 0);

      const statT2 =  statBar.append('text')
      .attr('class','statText') 
      .text("TOTAL AREA CREATED BY ALL PAINTINGS")  
      .attr('font-size', "1.2em")
      .attr('x', (salonWidth - scl_total_w)/2 )
      .attr('y', 390)
      .attr('fill', "#413D3D")
      .attr('text-anchor', 'start')
      .style("opacity", 0)

    // ***** AREAS
        const areaF =  statBar
              .append("rect")
              .attr('x', (d,i) => {
                  let xPos = (salonWidth - scl_total_w)/2 ; // What's my xPos
                  return  xPos;
              }) 
              .attr('y', (d,i) => {
                  return 400;
              })
              .attr('height', scl_femaleArea_w)
              .attr('width', scl_femaleArea/scl_femaleArea_w)
              .style('fill', (d,i) => {
                      return colors.female;
              })     
              .attr('stroke',  "#707070") // "#707070"
              .attr('stroke-width', '1')
              .attr('stroke-opacity', 0.5)
              .style("opacity", 0)
              .style("opacity", 0)
      
        const areaM =  statBar
              .append("rect")
              .attr('x', (salonWidth - scl_total_w)/2 + scl_femaleArea_w) 
              .attr('y', (d,i) => {
                  return 400;
              })
              .attr('height', scl_femaleArea_w)
              .attr('width', scl_maleArea/scl_femaleArea_w)
              .style('fill', (d,i) => {
                      return colors.male;
              })     
              .attr('stroke',  "#707070") // "#707070"
              .attr('stroke-width', '1')
              .attr('stroke-opacity', 0.5)
              .style("opacity", 0)
              .style("opacity", 0)

    // ****** RETRIEVE LEGEND
    legend = statBar
    .append("g")
    .attr("class", "legend")

    legend  
      .append("text")
      .text("* These two squares represent a dimension of 100x100cm each")
      .attr('font-size', "0.8em")
      .attr('y', 33) //myH - margin.top
      .attr('x', salonWidth -15)  
      .attr('text-anchor', 'end')
      
    legend
      .append("text")
      .text("Famale")
      .attr('font-size', "0.8em")
      .attr('y', 57) //myH - margin.top
      .attr('x', salonWidth - 40)  
      .attr('text-anchor', 'end')
      .attr('fill', "#413D3D")

    legend
      .append("rect")
      .attr("x", salonWidth - 35)
      .attr("y", 43)
      .attr('width', oneHundredCM)
      .attr('height', oneHundredCM)
      .style('fill', colors.female)

      legend  
      .append("text")
      .text("Male")
      .attr('font-size', "0.8em")
      .attr('x', salonWidth - 40)  
      .attr('y', 79) //myH - margin.top
      .attr('text-anchor', 'end')
      .attr('fill', "#413D3D")

    legend
      .append("rect")
      .attr("x", salonWidth - 35)
      .attr("y", 65)
      .attr('width', oneHundredCM)
      .attr('height', oneHundredCM)
      .style('fill', colors.male)
  
    // STAT ELEMENTS
    let stats = [whiteBG, statT1, statT2, areaF, areaM, averageF, averageM, legend];
    let statsWText = [areaF, areaM, averageF, averageM];
    
    stats.forEach(e => {
        e
        .transition().duration(1500)
                .style("opacity", 1)
      }) 

      // 	&#13217; - m2 &#13216; - cm2
    for (let i = 0 ; i < statsWText.length; i++) {
      let e = statsWText[i];
      let myT; // TEXT
      switch (i) {
        case 0:
          myT = `Female: About ${femaleArea/10000} &#13217;
                  <br>
                 Number of Artworks: ${femaleNums}    
          ` 
          break;
        case 1:
          myT = `Male: About ${maleArea/10000} &#13217;
                  <br>
                 Number of Artworks: ${maleNums} 
          ` 
          break;
        case 2:
          myT = `Female: About ${femaleMean/10000} &#13217;` 
          break;
        case 3:
          myT = `Male: About ${maleMean/10000} &#13217;` 
          break;
      }

      e.on("mouseover", function(event, d) { 
        console.log("mouseOver");
        // *** Tooltips *** //
        stattip.transition()
        .duration(200)
        .style("opacity", .9);

        stattip
              .style("left", (event.pageX + 10) + "px")
              .style("top", (event.pageY + 10) + "px")
              .style("cursor", "pointer")
              stattip
              .html(                    
                  `${myT}`
              );
      }).on("mouseout", function(event, d) { 
        console.log("mouseOut");
        stattip.transition()
                        .duration(500)
                        .style("opacity", 0);
      })
    }
}

function salonView() {
  nullEvertyhing();

  salonFrame
    .transition().duration(1500)
    .attr('height', salonHeight - addedH *3)

  console.log("one Cluster");
  // Start from one cluster location;
  node
    .transition().duration(2000)
    .style("opacity", 1)
    .attr("x", (d,i) => oneClusterArr[i].x - d.width/2)
    .attr("y", (d,i) => oneClusterArr[i].y - d.height/2 + addedH)
   imageViewer(node);
}


function sizeView() {
  nullEvertyhing();

  salonFrame
    .transition().duration(1500)
    .attr('height', salonHeight - addedH *3)

  console.log("size view");
  // Start from one cluster location;
  node
    .transition().duration(2000)
    .style("opacity", 1)
    .attr("x", (d,i) => sizeArr[i].x)
    .attr("y", (d,i) => sizeArr[i].y - (-60)); // *** HACK
  
   imageViewer(node);
}


function decadeView() {
  nullEvertyhing();

  salonFrame
    .transition().duration(1000).delay(100)
    .attr('height', salonHeight + addedH)

  console.log("decade View");
  // Start from one cluster location;
  node
    .transition().duration(2000)
    .style("opacity", 1)
    .attr("x", (d,i) => decadeArr[i].x)
    .attr("y", (d,i) => decadeArr[i].y)
  
  // YEAR TEXT
  for (let i = 0; i < 26 ; i++) {  // i = 25 max num
      let myNum = Number(1710 + i * 10); // Each Year Num 
      let myArray = allTitles.filter( d => d.year == myNum); // Array by year
      let myWSum = d3.sum(myArray, (d) => d.width + 4);
      // ** Calculate the YPos for each Decade
      let myPrevH;
      let myYearPos;
      let myHArr = []; // Array to contain H Max for Each Year
      let prevDecadesArr = [] // Array to contain each decade info

      if (i >= 0) { 
        for (let j = 0; j < i; j++) {
              let myPrevNum = myNum - 10 * (j+1);
              prevDecadesArr.push(allTitles.filter(d => d.year ==  myPrevNum) );
              if (prevDecadesArr[j] !=[])  { //If Not an empty array
                myPrevH = d3.max(prevDecadesArr[j], (d) => d.height+ 10); 
                // add myself too 
                myHArr.push(myPrevH); 
              }
            }
            let myH = d3.max(myArray, (d) => d.height+ 10); 
            myHArr.push(myH);
            myYearPos = d3.sum(myHArr, (d) => d);
        } 

      if (myArray.length != 0) {
        const yearT =  mainContainer.append('text')
          .attr('class','yearText') 
          .text(myNum + "s")  
          .attr('font-size', "0.8em")

          yearT
          .transition().duration(1000)
          .attr('x', 10)
          .attr('y', myYearPos)
          .attr('fill', "#413D3D")
          .attr('text-anchor', 'start')
          textIsCreated = true;
      }
  }

   imageViewer(node);
}

function imageViewer(node) {
  let modal = document.getElementById("myModal");
  let modalImg = document.getElementById("img01");
  let captionText = document.getElementById("caption");

  node.on("click", function(event, d) {  
    if (d3.select(this).attr('xlink:href')) {
      modalImg.src = d3.select(this).attr('xlink:href');
    } else {
      modalImg.src = './images/noImgAvailable.jpg';
    }
    let width = Math.round(d3.select(this).attr('width') / scl);
    let height = Math.round(d3.select(this).attr('height') / scl * 10) / 10
    let info = d3.select(this).attr('page');
    modal.style.display = "block";
    captionText.innerHTML =   "<br/>" +
                              "Title: " +  
                              "<b>" + d.title + "</b>"+                      
                              ", " + 
                              d.year + "s" +
                              // ", Width:" + width + "cm" + 
                              // ", Height:" + height + "cm" +
                              "<br/>" +
                              "For more information: " + 
                              "<a href = " + 
                              info + " target='_blank'>" + "Visit here" + "</a>"            
  })
  
  // Get the <span> element that closes the modal
  let span = document.getElementsByClassName("close")[0];

  // When the user clicks on <span> (x), close the modal
  span.onclick = function() { 
    modal.style.display = "none";
  }

  node.on("mouseover", function(event, d) { 
    console.log("mouseOver");
     // *** Tooltips *** //
     tooltip.transition()
     .duration(200)
     .style("opacity", .9);

      tooltip
          .style("left", (event.pageX + 10) + "px")
          .style("top", (event.pageY + 10) + "px")
          .style("cursor", "pointer")
      tooltip
          .html(
              d.title +  
              "<br/>" + 
              d.year + "s"
          );
  }).on("mouseout", function(event, d) { 
    console.log("mouseOut");
                      tooltip.transition()
                    .duration(500)
                    .style("opacity", 0);
  })

}

// ********** NAV VAR: DOM Btn Action   
let homeBtn = document.getElementsByClassName("navbar-brand");
let dropDownBtns = document.getElementsByClassName("nav-link");

for (let i = 0; i < dropDownBtns.length; i++) {
  dropDownBtns[i].addEventListener("click", function() {
    switch (i) {
      case 0:
        salonView();
        break;
      case 1:
        sizeView();
          break;
      case 2:
        decadeView();
        break;
      case 3:
        genderView();
        break;
      case 4:
        statView();
        break;
    }
  });
}

for (let i = 0 ; i < homeBtn.length; i++) {
  homeBtn[i].addEventListener("click", function() { 
    preSalon();
  });
}


window.onload = function() {
  window.addEventListener('keyup', doKeyUp, true);
}

let keys =[];
function doKeyUp(evt) {
  keys[evt.keyCode] = true;
  console.log("current keyCode:",evt.keyCode)
  //move()
    switch (evt.keyCode) {
    case 49:
      preSalon();
      break;
    case 50:
      salonView();
      break;
    case 51:
      sizeView();
        break;
    case 52:
      decadeView();
      break;
    case 53:
      genderView();
      break;
    case 54:
      statView();
      break;
  }
  evt.preventDefault(); // Prevents the page to scroll up/down while pressing arrow keys
}

function move() {
  console.log("Entered move function")
  if (38 in keys && keys[38]) { //up
    console.log("entered '38 in keys'. UP ")
    preSalon();
    
  }
  else if (40 in keys && keys[40]) { //down
    console.log("entered '40 in keys'. DOWN ")
    salonView();
  
  }
}

// function keyevent() {
//   let keycode = event.keyCode;
//   console.log("keycode = ", keycode)
//   switch (keycode) {
//     case 1:
//       preSalon();
//       break;
//     case 2:
//       salonView();
//       break;
//     case 3:
//       sizeView();
//         break;
//     case 4:
//       decadeView();
//       break;
//     case 5:
//       genderView();
//       break;
//     case 6:
//       statView();
//       break;
//   }

// }

// document.addEventListener("keydown", function(event) {
//   //console.log(event.which);
//   switch (event.which) {
//     case 1:
//       preSalon();
//       break;
//     case 2:
//       salonView();
//       break;
//     case 3:
//       sizeView();
//         break;
//     case 4:
//       decadeView();
//       break;
//     case 5:
//       genderView();
//       break;
//     case 6:
//       statView();
//       break;
//   }
// })