/*
  Exercise 6
  DOM manipulation with vanilla JS
*/

// Task
// What does DOM stand for?
console.log("DOM stands for Document Object Model")

// Task
// Open the file index.html in AWS Cloud9. Click "Preview" > "Preview File index.html". (Note that you can open it in a new window). What do you see?
console.log("Pink Rectangle with a dark outline")

// Task
// Delete the div with the class rectangle from index.html and refresh the preview.
let el = document.querySelector('.rectangle');
console.log("el is", el);
el.parentNode.removeChild(el);

// Task
// What does the following code do?
console.log("(1) Attach a click event called addChildToViz. \n(2) The event creates a new div (.rectangle) with a random height \n(3) And append it as a child of .viz div");
const viz = document.body.querySelector(".viz");

console.log(viz, viz.children);

const addChildToViz = () => {
  const newChild = document.createElement("div");
  newChild.className = "rectangle";
  newChild.style.height = Math.random() * 100 + "px";
  newChild.style.width = Math.random() * 100 + "px";
  viz.appendChild(newChild);
};

viz.addEventListener("click", addChildToViz);

// Task
// Where can you see the results of the console.log below? How is it different from in previous exercises?
console.log("Fetch is a function on the window object. Not a DOM");
console.log("Reference: https://stackoverflow.com/questions/57899829/what-is-the-difference-between-fetch-and-window-fetch")

function drawIrisData() {
  window
    .fetch("./iris_json.json")
    .then(data => data.json())
    .then(data => {
      console.log(data);
    });
}

drawIrisData();

// Task
// Modify the code above to visualize the Iris dataset in the preview of index.html.
// Feel free to add additional CSS properties in index.html, or using JavaScript, as you see fit.

function drawIrisData2() {
  fetch("./iris_json.json")
    .then(data => data.json()) // returned the value from fetched data
    .then(data => {
      for (let i = 0 ; i < data.length; i++) {
      // (1) Create a SVG for each data item
      // Reference: Create svg with vanilla js: http://output.jsbin.com/Udeyaje/2/
      const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      const svgNS = svg.namespaceURI;    

      // (2) Set the Iris Class from Json - Color Variance
      const irisClass = data[i].class;  
      const irisList = ["Iris-setosa", "Iris-versicolor", "Iris-virginica"];
      const petalColors = ["#5a4fcf", "#19a6c9", "#4f1b1b"];
      const sepalColors = ["#173F5F", "#20639B", "#3CAEA3"];

      let petalColor = " ";
      let sepalColor = " ";
      
      switch(irisClass) {
        case "Iris-setosa":
          petalColor = petalColors[0];
          sepalColor = sepalColors[0];
          break;
        case "Iris-versicolor":
          petalColor = petalColors[1];
          sepalColor = sepalColors[1];
          break;
        case "Iris-virginica":
          petalColor = petalColors[2];
          sepalColor = sepalColors[2];
          break;
      }


      // (3) Set Opacity depending on the index
      let myPetalOpacity;
      const bound = data.length/3; // Segregate by 1/3 - Different Class
      if (i < bound) {
        myPetalOpacity = 0.3 + i * 0.7 / bound;
      } else if (i >= bound && i < bound * 2 ) {
        myPetalOpacity = 0.3 + (i - bound) * 0.7 / bound;
      } else {
        myPetalOpacity = 0.3 + (i - bound * 2) * 0.7 / bound;
      }
      // Set petalHeight, petalWidth, starting pos
      const pH = data[i].petallength * 20; 
      const pW = data[i].petalwidth * 20;  
      const sX = 75; 
      const sY = 150;


      // (4) Append a Sepal to SVG as a rect on the bottom
      const rect = document.createElementNS(svgNS,'rect');
      const rectW = data[i].sepalwidth * 20;
      const rectH = data[i].sepallength * 2;
      rect.setAttribute('x',sX);
      rect.setAttribute('y',sY);
      rect.setAttribute('width',rectW);
      rect.setAttribute('height',rectH);
      rect.setAttribute('fill', sepalColor);
      rect.setAttribute('rx', 20);
      rect.setAttribute('transform', `translate(-${rectW/2},0)`);
      // rect.setAttribute('transform', `translate(-${rectW/2}, -${rectH/2})`);
      rect.setAttribute('opacity', myPetalOpacity);
      svg.appendChild(rect);


      // (5) Append a Petal to SVG as a path : Append different path depending on the class; (Later To Come)
      const path = document.createElementNS(svgNS,'path');
      console.log("pH", pH);
      path.setAttribute('d', `M ${sX},${sY}      
                              C${sX-pW/2},${sY-pH*0.33} ${sX-pW/2},${sY-pH*0.67} ${sX},${sY-pH} 
                              C${sX+pW/2},${sY-pH*0.67} ${sX+pW/2},${sY-pH*0.33} ${sX},${sY}`);       // Note: Using a template string here  ${  } to Insert a variable inside string
      path.setAttribute('fill', petalColor);
      // path.setAttribute('transform', `translate(0, +${pH/2})`);
      path.setAttribute('opacity', myPetalOpacity);
      // path.setAttribute('stroke', "#000");
      path.setAttribute('stroke-width', 1);
      svg.appendChild(path);


      // (6)Append the SVG
      document.body.appendChild(svg);


      // (7) This is  Additional: Add some variance for each item 
      // const angle = i * (360 / (data.length * Math.random(1)) ) ;
      const angle = i * (360 / (data.length))  ;
      svg.setAttribute('transform', `rotate(${angle})`); 
      }
    });
}

drawIrisData2();
