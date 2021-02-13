//----------VARIABLE DECLARATION----------//
var artistEl = document.getElementsByClassName("artist");
var searchButton = document.getElementById("submit-button");
var previousOne = document.getElementById("prev-search-one");
var previousTwo = document.getElementById("prev-search-two");
var previousThree = document.getElementById("prev-search-three");
var periodButton = document.getElementById("period-button");
var mediumButton = document.getElementById("medium-button");
var cityButton = document.getElementById("city-button");
var rightsEl = document.getElementById("rights");
var objectIds = [];
var objectID = 0;
var searchHistory = [];
var searchedTitles = [];
var searchedMedium = [];
var mediumArray = [];
var cityArray = [];
var periodArray = [];
var searchAgainObjID = [];
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

//-----------EVENT LISTENER TO CALL GET API FUNCTION FROM SUBMIT BUTTON-----------------//
searchButton.addEventListener("click", () => getAPI());

//---------------THIS FUNCTION IS SEARCHING THE MET'S API FOR ARTWORK THAT INCLUDES A DEPARTMENT ID---------//
function artDepartment(departmentID) {
    searchString = document.getElementById("search-input").value;
    localStorage.removeItem("objectIDs");

    fetch(
        `https://collectionapi.metmuseum.org/public/collection/v1/search?departmentId=${departmentID}&q=${searchString}`
    )
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            //console.log(data);
            objectIds = data.objectIDs;
            var choseID = Math.floor(Math.random() * objectIds.length);
            localStorage.setItem("objectIDs", objectIds[choseID]);
            getDetails();
        });
};
//-----THIS FUNCTION IS USED FOR PREVIOUSLY SEARCHED WORKS OF ART. ONCE CALLED IT WILL CLEAR THE PREVIOUSLY SEARCHED OBJECT ID AND THEN PULLS THE OBJECT ID FROM LOCAL STORAGE----//
function searchAgain(value) {
    localStorage.removeItem("objectIDs");
    searchAgainObjID = localStorage.getItem("searchHist");
    searchedMedium = searchAgainObjID.split(",");
    localStorage.setItem("objectIDs", searchedMedium[value]);
    getDetails();
};

//-----THIS FUNCTION IS SEARCHING FOR ARTWORK THAT WAS CREATED WITHIN A DEFINED CENTURY AND KEYWORD---//
function artPeriod(periodStart, periodEnd) {
    searchString = document.getElementById("search-input").value;
    localStorage.removeItem("objectIDs");

    fetch(
        `https://collectionapi.metmuseum.org/public/collection/v1/search?dateBegin=${periodStart}&dateEnd=${periodEnd}&q=${searchString}`
    )
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            objectIds = data.objectIDs;
            var choseID = Math.floor(Math.random() * objectIds.length);
            localStorage.setItem("objectIDs", objectIds[choseID]);
            getDetails();
        });
}

//-----THIS FUNCTION SEARCHES FOR ARTWORK BASED ON A KEYWORD SEARCH ALONE AND STORES AN OBJECT ID IN LOCAL STORAGE FOR ACCESSING LATER---//
function getAPI() {
    //Clearing Local Storage before the
    localStorage.removeItem("objectIDs");
    searchString = document.getElementById("search-input").value;

    fetch(
        `https://collectionapi.metmuseum.org/public/collection/v1/search?hasImage=true&q=${searchString}`,
        requestOptions
    )
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            objectIds = data.objectIDs;
            var choseID = Math.floor(Math.random() * objectIds.length);
            localStorage.setItem("objectIDs", objectIds[choseID]);
            getDetails();
        })
        .catch((error) => console.log("error", error));
}

//---THIS FUNCTION SEARCHES FOR DETAILS ON ARTWORK BASED ON AN OBJECT ID STORED IN LOCAL STORAGE AND THEN CALLS THE displayResults FUNCTION----//
function getDetails() {
    objectID = parseInt(localStorage.getItem("objectIDs"));

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

//---THIS FUNCTION STORES DATA INTO A LOCAL ARRAY WHICH DRIVES PREVIOUS SEARCH LOGIC AND THEN DISPLAYS THE DETAILS OF ARTWORK ON THE MAIN PAGE---//
function displayResults(data) {
    console.log(data);
    //adding object ID to search history array so it can be searched again
    searchHistory.unshift(objectID);
    localStorage.setItem("searchHist", searchHistory);

    //adding titles to object ID array
    searchedTitles.unshift(data.title);
    searchedTitles.length = 3;
    localStorage.setItem("titles", searchedTitles);
    previousOne.textContent = searchedTitles[0];
    previousTwo.textContent = searchedTitles[1];
    previousThree.textContent = searchedTitles[2];

    //---handling the date art was made---//
    var objectDate = data.objectDate;
    var date = document.getElementById("artist-date");
    date.innerHTML = `Work Created on/around: ${objectDate}`;

    //---handling where in the met the artwork is---//
    var locationInMuseum = data.GalleryNumber;
    var artistLocation = document.getElementById("artist-location");
    artistLocation.innerHTML = `<a href="https://maps.metmuseum.org/galleries/fifth-ave/2/${locationInMuseum}" target="_blank">Click here to where this is located</a>`;

    //---handling the artist name---//
    var artistName = data.artistDisplayName;
    var artist = document.getElementById("artist-name");
    artist.innerHTML = `Artist Name: ${artistName}`;

    //---hanlding the title of the artwork---//
    var workTitle = data.title;
    var artistTitle = document.getElementById("artist-title");
    artistTitle.innerHTML = `Work Title: ${workTitle}`;

    //---hanlding the rights and reproduction of the artwork---//
    var rightsReproduction = data.rightsAndReproduction;
    rightsEl.textContent = rightsReproduction

    //---handling of learn more---//
    var learnMore = data.objectURL;
    var learnEl = document.getElementById("art-learn");
    learnEl.innerHTML = `<a href="${learnMore}" target="_blank">Click here to learn more about this work or art!</a>`;

    //---handling of displaying the image---//
    var imageURL = data.primaryImageSmall;
    var image = document.getElementById("artDisplay");
    image.src = imageURL;

    //---handling of displaying the medium---//
    var medium = data.medium;
    mediumEl = document.getElementById("art-medium");
    mediumEl.innerHTML = `Artwork Medium: ${medium}`;

}
