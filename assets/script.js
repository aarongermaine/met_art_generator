/** ----------------PSUEDO CODE FOR MAIN PAGE-----------------

Once the page loads i enter my keyword into the search box and hit submit
-- If no results are found a message is presented on the web page
-- Need to determine how to to pass values outside of API or need to clear specific items in local storage and keep search history for longer. 

My search is passed into the Met API search
-- search criteria is passed into initial MET API and the object IDs are stored into an array
-- a random object ID is selected and passed into the second MET API and the detailed results are stored into an object
---- Date
---- Location in museum
---- Period Type
---- Image
---- Name of Artist
---- Title of piece/work
---- Rights and Reproduction

-- API Parameters:g
----HAS IMAGE

//maps
https://maps.metmuseum.org/galleries/fifth-ave/2/822

The results are displayed on the screen

 */
var artistEl = document.getElementsByClassName("artist");
var searchButton = document.getElementById("submit-button");

var periodButton = document.getElementById("period-button")
var mediumButton = document.getElementById("medium-button")
var cityButton = document.getElementById("city-button")
//var searchString = "";
var objectIds = [];
var objectID = 0;
var searchHistory = [];
var searchedTitles = [];
var searchedMedium = [];
var mediumArray = [];
var cityArray = [];
var periodArray = [];
var myHeaders = new Headers();
myHeaders.append(
    "Cookie",
    "incap_ses_208_1662004=wtUiUDkio3mJwBg7C/fiAsPsHWAAAAAAHxEusp5NdaZhKLNQkhNvkw==; visid_incap_1662004=yWfsog6jQna1Q6+jh2eZPSBmG2AAAAAAQUIPAAAAAADi+cYxvBpgB+yJk2PSo8a7"
);
var requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
};

//-----------EVENT LISTENER TO CALL GET API FUNCTION-----------------//
searchButton.addEventListener("click", () => getAPI());
//mediumButton.addEventListener("click", () => artMedium());
//periodButton.addEventListener("click", () => artPeriod());
//cityButton.addEventListener("click", () => artCity());

//Create a function that generates a random index from particular array
function random(array) {
    var randomIndex = Math.floor(Math.random() * array.length);
    var randomElement = array[randomIndex];
    return randomElement;
}
function artDepartment(departmentID) {
    searchString = document.getElementById("search-input").value;
    localStorage.clear("objectIDs");

    fetch(`https://collectionapi.metmuseum.org/public/collection/v1/search?departmentId=${departmentID}&q=${searchString}`)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            objectIds = data.objectIDs;
            var choseID = Math.floor(Math.random() * objectIds.length);
            localStorage.setItem("objectIDs", objectIds[choseID]);
            getDetails();

        })

}

function artCity(city) {
    searchString = document.getElementById("search-input").value;
    console.log("I've been clicked Art City");
    fetch(`https://collectionapi.metmuseum.org//public/collection/v1/search?geoLocation=${city}&q=${searchString}`)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            objectIds = data.objectIDs;
            var choseID = Math.floor(Math.random() * objectIds.length);
            localStorage.setItem("objectIDs", objectIds[choseID]);
            getDetails();
        })

}
function artPeriod(periodStart, periodEnd) {
    searchString = document.getElementById("search-input").value;
    console.log("I've been clicked Art Period");
    fetch(`https://collectionapi.metmuseum.org/public/collection/v1/search?dateBegin=${periodStart}&dateEnd=${periodEnd}&q=${searchString}`)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);

        })
}



function getAPI() {
    //Clearing Local Storage before the
    localStorage.clear("objectIDs");

    searchString = document.getElementById("search-input").value;
    console.log(searchString);

    //console.log("I made it!!");

    //----------------pulled from POSTMAN-----------------------//

    //---additional parameter added to only return object IDs that have images (would be silly to have facts without something pretty to show)---//
    fetch(
        `https://collectionapi.metmuseum.org/public/collection/v1/search?hasImage=true&q=${searchString}`,
        requestOptions
    )
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            objectIds = data.objectIDs;
            var choseID = Math.floor(Math.random() * objectIds.length);
            //console.log(objectIds[choseID]);
            localStorage.setItem("objectIDs", objectIds[choseID]);
            //console.log(objectIds);
            getDetails();
        })
        .catch((error) => console.log("error", error));
}

function getDetails() {
    objectID = parseInt(localStorage.getItem("objectIDs"));
    //console.log(objectID);

    //with additional search parameter - add if statement to identify whether or not department ID

    //-------------COPIED FROM POSTMAN---------------------//
    // - Second Function call using the object ID obtained fromthe prior inquiry - //
    fetch(
        `https://collectionapi.metmuseum.org/public/collection/v1/objects/${objectID}`,
        requestOptions
    )
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            displayResults(data);
        })
        .catch((error) => console.log("error", error));
}

function displayResults(data) {

    //adding object ID to search history array so it can be searched again
    searchHistory.unshift(objectID);
    searchHistory.length = 3;
    console.log(searchHistory);
    localStorage.setItem("searchHist", searchHistory);

    //adding titles to object ID array
    searchedTitles.unshift(data.title);
    searchedTitles.length = 3;
    console.log(searchedTitles);
    localStorage.setItem("titles", searchedTitles);

    console.log(data);
    var objectDate = data.objectDate;
    //console.log(objectDate);

    //--obtained from Gallery Number - correlates to place in Museum--//
    var locationInMuseum = data.GalleryNumber;
    //console.log(locationInMuseum);
    var periodType = data.period;
    console.log(periodType);

    //var periodEl = document.getElementById("art-period");
    //periodEl.innerHTML = `This is from the ${periodType} period`;



    var artistName = data.artistDisplayName;
    artistEl.textContent = artistName;
    //console.log(artistName);
    var workTitle = data.title;
    //console.log(workTitle);git 
    var rightsReproduction = data.rightsAndReproduction;
    //console.log(rightsReproduction);
    var learnMore = data.objectWikidata_URL;
    var learnEl = document.getElementById("art-learn");
    learnEl.innerHTML = `<a href="${learnMore} target="_blank">Click here to learn more about this work or art!</a>`;
    //console.log(learnMore);
    var imageURL = data.primaryImageSmall;
    //console.log(imageURL);

    var medium = data.medium;
    mediumEl = document.getElementById("art-medium");
    mediumEl.innerHTML = `Artwork Medium: ${medium}`;
    //console.log(medium);
    function displayImage() {
        image = document.getElementById("artDisplay");
        image.src = imageURL;

        console.log(image.src);
    }
    displayImage();

    function displayTitle() {
        artistTitle = document.getElementById("artist-title");
        artistTitle.innerHTML = `Work Title: ${workTitle}`;
    }
    displayTitle();

    function displayName() {
        artist = document.getElementById("artist-name");
        artist.innerHTML = `Artist Name: ${artistName}`;

    }
    displayName();

    function displayDate() {
        date = document.getElementById("artist-date");
        date.innerHTML = `Work Created on/around: ${objectDate}`;
    }
    displayDate();

    function displayLoc() {
        artistLocation = document.getElementById("artist-location");
        artistLocation.innerHTML = `<a href="https://maps.metmuseum.org/galleries/fifth-ave/2/${locationInMuseum} target="_blank">Click here to where this is located</a>`;
    }
    displayLoc();

}
