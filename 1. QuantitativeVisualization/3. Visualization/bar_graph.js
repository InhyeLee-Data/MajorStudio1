// VER: Attaching a picture on rollover. // Change of container size
let portraits; // JSON
let allTitles = []; // Array that contains necessary data
let femaleTitles =[];
let maleTitles = []; 

const scl = 0.2; // For relative Scaling: To change the size of thumbnails 0.25 (good view) 

d3.json('data/data_all_painting.json').then(function(data){ 
  portraits = data;
  analyzeData();
  displayStat();
//  displayLegend();
  displayBarGraph();
});//

function analyzeData() {
  portraits.forEach(function(n) {
    let title = n.title;
    let year = Number(n.circa.replace(/[^\d.]/g, '')); // data cleaning - Only digits
    let width = n.width_height[0];
    let height = n.width_height[1]; 
    let dim = width * height; 
    let gender = n.gender;
    let imgURL = n.imageLink;   //console.log(year); // Check the year

    // Now, images are in a local folder;
    // Remove everything except for the file name
    // Only do the following when there is an image URL
    if (imgURL) {
        imgURL = imgURL.replace("https://ids.si.edu/ids/deliveryService?id=", "");
        imgURL = './images/' + imgURL +".jpg";
    } else {
        imgURL = "";
    }

   
    
    let pageURL = n.link; // page Link
    let groupShot = n.groupShot; // Is this a group shot?
    let match = false; // Check if we already have the entry

    // see if the work already exists the allTitles array = Triple Checker
    allTitles.forEach(function(p){
        if (p.title == title && p.year == year && p.dim == dim) { //&& p.year == year && p.dim == dim
          match=true;
        }
    })
    // allTitles.forEach(function(p){
    //     if (groupShot) { //&& p.year == year && p.dim == dim
    //      console.log("I am a groupshot ")
    //     }
    //     else {
    //         console.log("I am not a groupshot ")
    //     }
    // })

    if (!groupShot && !match && year > 0 && height && width && dim) { 
        //519 => 507, after !match,  & dim
        // a new field entered for groupShot to exclude group pictures
        allTitles.push({
                title: title,
                year: year,
                width: height,
                height: width, // Switch two vals here because it was so in data
                dim: dim,
                gender: gender,
                imgURL: imgURL,
                pageURL: pageURL,
                groupShot: groupShot
        });
    } 
  });   

    // // *******  Width Summing 
    for (let i = 0; i < allTitles.length; i++) {
        let prevTitles = allTitles.slice(0, i);
        let xPos = d3.sum(prevTitles, d => d.width + i);
        }
    //

    // **** Work Sorting Logic
    //allTitles = allTitles.sort((a,b) => a.year-b.year); // Ascending order
    allTitles = allTitles.sort((a,b) => b.dim - a.dim); // Dimension: Descending order
    console.log(allTitles);
} // end of analyze data

function displayStat() {
    // Display important statistics
  // Whole Area created by Female VS Male   
  const genderStat = [];
  let femaleArea, maleArea;
  femaleArea = d3.sum(allTitles, d => {if (d.gender =="female") return d.width});
  maleArea = d3.sum(allTitles, d => {if (d.gender =="male") return d.width});

  femaleNums = d3.sum(allTitles, d => {if (d.gender =="female") return 1});
  maleNums = d3.sum(allTitles, d => {if (d.gender =="male") return 1});
  console.log("femaleNums: maleNums", femaleNums, maleNums);
//   console.log("sum of Dimension - Female", d3.sum(allTitles, d => {if (d.gender =="female") return  d.width})); // The whole width
//   console.log("sum of Dimension - Male", d3.sum(allTitles, d => {if (d.gender =="male") return d.width}));
  
  genderStat.push(femaleArea); // 1st item
  genderStat.push(maleArea); //2nd item
  console.log(genderStat);
// Total Painting Numbers
// ***** attach a graphic element, and append rectangles to it

    const vis_total = d3.select('#vis_total')
            .append('svg')
            .attr('class','genderTotal') // defined in css
            .attr('width', "70rem")
            .attr('height', 100) // max of... 
            .attr('x', 0)
            .attr('y', 0);


     const totalWidth = d3.select(".genderTotal").attr('width');
     console.log("the Total Width: ", totalWidth);
     let entireDim = d3.sum(genderStat, d => d);
     console.log("entire dim: ", entireDim);

           vis_total.selectAll('rect')
                .data(genderStat)
                .enter()
                .append("rect")
                // .join('rect')
                .attr('x', (d,i) => {

                    //let entireDim = d3.sum(genderStat, d => d);
                    let prevDim = genderStat.slice(0, i) ; // previous dim
                    let propo_width_by_dim = totalWidth / entireDim;

                    let xPos = d3.sum(prevDim, d => d*0.035); // What's my xPos
                    return xPos;
                }) 
                .attr('y', (d,i) => {
                    return 0;
                    
                })
                .attr('height',300)
                .attr('width', (d,i) => d*0.035)
            //    .attr('stroke',  "#707070") // "#707070"
            //    .attr('stroke-width', '1')
            //    .attr('stroke-opacity', 0.5)
                .style('fill', (d,i) => {
                    if (i === 0) {
                        return "#E6E634";
                    }
                    if (i === 1) {
                        return "#329191";
                    }
                })     
}

function displayLegend() {
        // Display Legends
        const legends = d3.select('#vis_decade_legend')
            .append('svg')
            .attr('width', "50rem")
            .attr('height', "5rem") // max of... 
            .attr('x', 0)
            .attr('y', 0)

        let myH = d3.max(allTitles, (d) => d.height*scl);
        let myW = d3.max(allTitles, (d) => d.width*scl);
        let myXpos = d3.select('#vis_decade_legend').attr("width"); 

        console.log("myH and myW and myPos", myH, myW, myXpos);
        const rectF = legends.append('rect')
            .attr("width", myH/4)
            .attr("height", myH/4)
            .attr("x", "25rem")
            .attr("y", 0)
            .style('fill', "#E6E634") 
            .attr('stroke',  "#707070") // "#707070"
            .attr('stroke-width', '1')
            .attr('stroke-opacity', 0.5)

        const rectM= legends.append('rect')
            .attr("width", myH/4)
            .attr("height", myH/4)
            .attr("x", "30rem")
            .attr("y", 0)
            .style('fill', "#329191") 
            .attr('stroke',  "#707070") // "#707070"
            .attr('stroke-width', '1')
            .attr('stroke-opacity', 0.5)

            rectF.append('text')
                .attr('class','yearText') 
                .text("female")  
                //.attr('font-weight', 'bold')
                .attr('font-size', "0.8em")
                .attr('y', 0) //myH - margin.top
                .attr('x', 0)
                .attr('fill', "#413D3D")
                .attr('text-anchor', 'start')
}


function displayBarGraph(){
   // let sumOfWidth = d3.sum(allTitles, d => d.width +1);
    const margin = {top: 5, right: 15, bottom: 5, left: 50};
    //let bigW = sumOfWidth + margin.left + margin.right;// window.innerWidth; // 40000; // ?

    for (let i = 0; i < 26 ; i++) {  // i = 25 max num
        let myNum = Number(1710 + i * 10);
        let myArray = allTitles.filter( d => d.year == myNum); // Array by year
        let myH = d3.max(myArray, (d) => d.height*scl);
        let myWSum = d3.sum(myArray, (d) => d.width*scl + 4);
        //console.log(myH);

        if (myArray.length != 0) {
            console.log(myNum);
            const container = d3.select('#vis_decade')
                    .append('svg')
                    .attr('class','container') // defined in css
                    .attr('width', myWSum + margin.left + margin.right)
                    .attr('height', myH + margin.top + margin.bottom) // max of... 
                    .attr('x', 0)
                    .attr('y', 0)
                //  .style("border", "1px solid #CCCCCC");

            container.append('g')
                .selectAll('rect')
                .data(myArray)
                .enter()
                .append("rect")
                .attr("id", (d) =>{
                    return d.pageURL; 
                }) // id, unique serial number
                //.join('rect')
                .attr('x', (d,i) => {
                    let prevTitles = myArray.slice(0, i);
                    let xPos; 
                    xPos = margin.left + d3.sum(prevTitles, d => d.width*scl + 4); // Give a space in between
                    return xPos;
                }) 
                .attr('y', (d,i) => {
                    let yPos =  myH - d.height*scl  ;
                    return yPos;
                })
                .attr('height', d => d.height*scl)
                .attr('width', d => d.width*scl)
                .attr('stroke',  "#707070") // "#707070"
                .attr('stroke-width', '1')
                .attr('stroke-opacity', 0.5)
                .attr('xlink:href', (d) => d.imgURL)
               // .attr('href', (d) => d.pageURL)
                .style('fill', d => {
                    if (d.gender === "female") {
                        return "#E6E634";
                    }
                    if (d.gender === "male") {
                        return "#329191";
                    }
                })        
                .attr("opacity","1")
                .on("mouseover", function(d) {
                    console.log("mouse over on " + d3.select(this));
                    let myX = d3.select(this).attr('x');
                    let myY = d3.select(this).attr('y');
                    let myW = d3.select(this).attr('width');
                    let myH = d3.select(this).attr('height');
                    let myIMG  = d3.select(this).attr('xlink:href');
                    //let myPage  = d3.select(this).attr('href');
                    //
                    console.log(myX, myY, myW, myH);
                    if (myIMG){ // If there is an image
                        // BG
                        d3.select(this)
                            .transition()
                            .duration(100)
                            .attr("opacity","0.2")
                            .transition()
                            .duration(100)
                            .style('fill', d => {
                                if (d.gender === "female") {
                                    return "#E6E634";
                                }
                                if (d.gender === "male") {
                                    return "#329191";
                                }
                            })
                            .attr("opacity","0.5")  
                            .attr('stroke',  d => {
                                if (d.gender === "female") {
                                    return "#E6E634";
                                }
                                if (d.gender === "male") {
                                    return "#329191";
                                }
                            })
                            .attr("opacity","1") 
                            // "#707070"  
                        // Show IMG
                        container.append('image')
                            .attr('xlink:href', myIMG)
                            // .attr('href', myPage)
                            .attr("x", myX)
                            .attr("y", myY)
                            .attr("width", myW)
                            .attr("height", myH);
                    }
                    else {
                        //If No IMG, change BG to darker color
                        d3.select(this)
                        .transition()
                        .duration(300)
                        .style('fill', d => {
                            if (d.gender === "female") {
                                return "#5D5D14"; // gets darker
                            }
                            if (d.gender === "male") {
                                return "#1F5555"; // gets darker
                            }
                        })
                        .attr("opacity","1")   
                        
                    }
                })
                .on("mouseout", function(d){
                    console.log("mouse out");
                    // Nothing happens as flickering occurs.. 
                    // Possible to make a tooltip disappear
                });

                // OPEN UP an external Page - Not working yet - Should work on click (mouse activated)
                container
                .selectAll('rect')
                .on('click', function(d) {
                    console.log('open tab')
                    window.open(
                       
                    //  'http://en.wikipedia.org', // Link outside...
                      '_blank' // <- This is what makes it open in a new window.
                    );
                  })

            // TEXT ON TOP => Done in html
            // d3.select('#vis_decade')
            // .append('text')   
            // .text("Portraits over the history")
            // YEAR TEXT
            container.append('text')
                .attr('class','yearText') 
                .text(myNum + "s")  
                //.attr('font-weight', 'bold')
                .attr('font-size', "0.8em")
                .attr('y', myH ) //myH - margin.top
                .attr('x', 0)
                .attr('fill', "#413D3D")
                .attr('text-anchor', 'start')
            // .attr('transform', function(d) {return 'rotate(-90)' });
        }
    }
} // end of
