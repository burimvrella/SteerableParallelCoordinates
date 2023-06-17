$(document).ready(function () {

    var filters = {}
    
    const myForm = document.getElementById("uploadFile");
    const csvFile = document.getElementById("file");
    const selectfeatures = document.getElementById("selectfeaturs");
    const choosenfeatures = document.getElementById("choosenfeatures");
    var selectedstudent = document.getElementById("selectedstudent");
    var submitdata = document.getElementById("submit");
    
    //Load Date from CSV file and calls the GenarateSVG
    myForm.addEventListener("submit", function (e) {
      if(selectfeatures.childElementCount < 1){
        submitdata.disabled = false;
      }
      else{
        submitdata.disabled = true;
      }
      e.preventDefault();
      const input = csvFile.files[0];
      const reader = new FileReader();
    
      reader.onload = function (e) {
        const text = e.target.result;
        const data = d3.csvParse(text);
        SelectFeatures(data.sort((a,b) => a.Name.toLowerCase() > b.Name.toLowerCase() ? 1 : -1));
        };
      reader.readAsText(input);
    });
    
    const element = document.getElementById("delete");
    element.addEventListener("click", function() {
      d3.select("#parallelcoords").select("svg").remove();
      selectedstudent.innerHTML = " ";
      filters = []
      newfeatures = []
      var get= document.getElementsByName('features');
      for(var i= 0; i < get.length; i++){
        get[i].checked = false;
      }  
      choosenfeatures.disabled = false;
    });
    
    
    var newfeatures = []
    function SelectFeatures(data){
      var features = [];
        data["columns"].forEach(element => {
            features.push({"feature" : element})
        });
    
        features.forEach(feature =>{
          var checkbox = document.createElement("input");
          checkbox.type = "checkbox";
          checkbox.name =  "features";
          checkbox.value = feature.feature;
          checkbox.checked = true;
          checkbox.id = feature.feature;
    
          var label = document.createElement('label');
          label.htmlFor = feature.feature;    
          label.appendChild(document.createTextNode(feature.feature));
    
          selectfeatures.appendChild(checkbox);
          selectfeatures.appendChild(label);
        });
    
        choosenfeatures.addEventListener("click", function() {
            const cb = document.querySelectorAll('input[name="features"]:checked');
            var error = document.getElementById("error");
            if(cb.length < 2)
            {
              error.innerHTML = "<span style='color: red;'>"+
              "Please enter a valid number</span>";
            }else {
              error.innerHTML = "";
              cb.forEach(selectedfeature => {
                newfeatures.push(selectedfeature.value);
              });
              choosenfeatures.disabled = true;

              var paracoords = new SteerableParacoords(data, newfeatures);
              paracoords.GenerateSVG();
            }
        });
    } 
    
    });