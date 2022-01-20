var showCounter = 0;

window.onload = function() {
     closeLightBox();
	 header();
} // window.onload

function fetchData() {
  document.getElementById("main").innerHTML = "";
  document.getElementById("info").innerHTML = "";
  document.getElementById("cast").innerHTML = "";
  document.getElementById("crew").innerHTML = "";
  document.getElementById("episode").innerHTML = "";
  document.getElementById("header").innerHTML = "";
  var search = document.getElementById("search").value;  
  fetch('http://api.tvmaze.com/search/shows?q=' + search)
    .then(response => response.json())
    .then(data => updatePage(data) 
    );
}

function header(){
	headerDiv = document.getElementById("header"); 
    headerDiv.innerHTML = "<h1>Welcome to ShowTown</h1>"
    headerDiv.innerHTML += "<h2>Lets go find your favourite Show! </h2>"
    headerDiv.innerHTML += "<h3> Just simply search up the show you're looking for, then you can find all the information including the casting, crew, summary, episodes, and latest news. </h3>"
	headerDiv.innerHTML += "<img src='/images/TvD.jpg' alt='Movie background'>";	
}

function updatePage(data) {
  console.log(data);
  var tvshow; 
  for (tvshow in data) {
    createTVShow(data[tvshow]);
  }
} 

function createTVShow (tvshowJSON) {

    var elemMain = document.getElementById("main");
    var elemDiv = document.createElement("div");
    var elemImage = document.createElement("img");
    var elemShowTitle = document.createElement("h2");
    elemShowTitle.classList.add("showtitle"); 
    
    elemImage.src = tvshowJSON.show.image.medium;
    elemShowTitle.innerHTML = "<a onclick='fetchredirect(\"" + tvshowJSON.show.id + "\")'>" + tvshowJSON.show.name + "</a>";

    elemDiv.appendChild(elemShowTitle);  
    elemDiv.appendChild(elemImage);

    var showId = tvshowJSON.show.id;

    elemMain.appendChild(elemDiv);

} // createTVShow

function fetchredirect(showId) {

    console.log("showId is " + showId);
    var elemMain = document.getElementById("main");
    var elemDiv = document.createElement("div");
    var elemImage = document.createElement("img");
    var elemShowTitle = document.createElement("h2");
    elemShowTitle.classList.add("showtitle"); 

    elemDiv.appendChild(elemShowTitle);  
    elemDiv.appendChild(elemImage);

    fetch('https://api.tvmaze.com/shows/' + showId )
    .then(response => response.json())
    .then(data => showTvInfo(data, elemDiv));

    fetch('https://api.tvmaze.com/shows/'+ showId +'/cast' )
    .then(response => response.json())
    .then(data => showTvCast(data));

    fetch('https://api.tvmaze.com/shows/'+ showId +'/crew' )
    .then(response => response.json())
    .then(data => showTvCrew(data));
    
    fetch('https://api.tvmaze.com/shows/'+ showId +'/episodes' )
    .then(response => response.json())
    .then(data => showTvEpisode(data));
    
    elemMain.appendChild(elemDiv);
}

function fetchepisode(showId) {
    console.log("episodeId is " + showId);

    let url= " https://api.tvmaze.com/episodes/" + showId;
    fetch(url)
    .then(response => response.json())
    .then(data => changeLightBox(data));
}

function changeLightBox(data){
    
    messageDiv = document.getElementById("message"); 
    document.getElementById("lightbox").style.display ="block";
    messageDiv.innerHTML = "Name: " + data.name;
    if(data.image != undefined || data.image != null){
        messageDiv.innerHTML += "<img src='" + data.image.medium + "' alt='image'>"
    }
    messageDiv.innerHTML += "<div>" + '<br> Id: ' + data.id + '<br> Season: ' + data.season + '<br> Rating: ' + data.rating.average + '/10 <br> Airdate: ' + data.airdate + '<br>Description: ' + data.summary + "</div>";
}

const toSearch = function (event) {
    var keyPressed = event.keyCode || event.which;
    if (keyPressed === 13) {
         fetchData();
         event.preventDefault();
    }
}

function showTvInfo(data, elemDiv){
    console.log("show Tvinfo");
    console.log(data);
    document.getElementById("main").innerHTML = "";
    infoDiv = document.getElementById("info"); 
    infoDiv.innerHTML = '<h1>' + data.name + '</h1>';
    if(data.image != undefined || data.image != null){
       infoDiv.innerHTML += "<img src='" + data.image.medium + "' alt='image'>"
    }
    infoDiv.innerHTML += '<h6> <p>Show Information :  </p><br> Id: ' + data.id + '<br> Premiered Time: ' + data.premiered + '<br> Description: ' + data.summary + '</h6>';
}

function showTvEpisode(data){
    console.log("showTVepisode");
    console.log(data);
    episodeDiv = document.getElementById("episode"); 
    episodeDiv.innerHTML += "<h1> Episodes </h1>";
    let e = 0;
    while(e < data.length){
        episodeDiv.innerHTML += "<ol>"
        episodeDiv.innerHTML += "<li><a onclick='fetchepisode(\"" + data[e].id + "\")'>" + data[e].name + "</a></li>";
        episodeDiv.innerHTML += "</ol>"
        e++;
    }
}

 function closeLightBox(){
     document.getElementById("lightbox").style.display="none";
 }

function showTvCast(data){
    console.log("showTVcast");
    console.log(data);
    castDiv = document.getElementById("cast");
    castDiv.innerHTML += "<h1> Cast </h1>";
    let i = 0;
    
    while(i < data.length){
        var elemCast = document.createElement("div");
        if(data[i].person.image != undefined || data[i].person.image != null){
                elemCast.innerHTML += "<img src='" + data[i].person.image.medium + " ' alt='cast image'>"
        }
            elemCast.innerHTML += '<h5> Name : ' + data[i].person.name + '<br> Character name : ' + data[i].character.name + '</h5>';
            castDiv.appendChild(elemCast);
        i++;
    }
    
}

function showTvCrew(data){
    console.log("showTVcrew");
    console.log(data);
    crewDiv = document.getElementById("crew"); 
    crewDiv.innerHTML += "<h1> Crew </h1>";
    let a = 0;
    while(a < data.length){
        var elemCrew = document.createElement("div");
        elemCrew.innerHTML += '<h5>' + data[a].type + " : " + data[a].person.name + '</h5>';
        crewDiv.appendChild(elemCrew);
        a++;
    }
}
