const myKey = "n4w5RNZSVT2BjED6CorPtsqvEsDqHUNA";
let currentCityKey = null;

function onload(){
  if (localStorage.getItem("cityNamefromFav")==null){
    let telAviv = new Object({EnglishName:"Tel Aviv",Key:"215854"})
    currentCityKey = telAviv.Key;
    setPositionData(telAviv);
    getUserGeoLocation();
  }
  else {
    let fromFavCityName = new Object({EnglishName:localStorage.getItem("cityNamefromFav"),Key:localStorage.getItem("cityKeyfromFav")});
    currentCityKey = fromFavCityName.Key;
    setPositionData(fromFavCityName);
    localStorage.removeItem("cityNamefromFav");
    localStorage.removeItem("cityKeyfromFav");
  }

}

function loadData(URL, cFunction) {
  let request = new XMLHttpRequest();
  console.log(URL);
  request.onerror = function() {
    alert('There was a connection error of some sort');
  };
  request.onreadystatechange = function () {
    if(this.readyState == 4){
      if (this.status >= 200 && this.status < 400) {
        if (this.response != ""){
          cFunction(JSON.parse(this.response));
        }
      }
    }
    else {
      console.log("We reached our target server, but it returned an error. the request stautus is: " + this.status +" ----- "+this.readyState);
    }
  };
  request.open('GET', URL, true);
  request.send();
}

function toggleMode() {
  let element = document.body;
  element.classList.toggle("dark-mode");
}
function getCitiesByStr(Cities){
  const result = document.querySelector('.suggestions');
  result.innerHTML = '';
  const todayWraps = document.querySelectorAll('.make-blur');
  for (let i = 0; i < todayWraps.length; i++) {
    todayWraps[i].classList.remove('backwords-blur')
  }
  if (Cities){
    Cities.forEach(e=>{
      let elem = document.createElement('div');
      elem.classList.add('city-suggested');
      elem.onclick =  function() { suggestionClicked(e); };
      elem.innerHTML =  e.LocalizedName;
      elem.id = e.Key;
      elem.innerHTML += '<div class="country">'+e.Country.LocalizedName +'</div>';
      elem.innerHTML += '<div class="administrative-area">'+e.AdministrativeArea.LocalizedName +'</div>';
      result.appendChild(elem);
    })
    const todayWraps = document.querySelectorAll('.make-blur');
    for (let i = 0; i < todayWraps.length; i++) {
      todayWraps[i].classList.add('backwords-blur')
    }
  }
}
suggestionClicked = function (City) {
  const searchCity = document.querySelector('#search-city');
  searchCity.value = City.LocalizedName;
  getPositionWeather(City.Key);
  setTimeout(function(){ getPositionfiveDaysWeather(City.Key); }, 1000);
  const result = document.querySelector('.suggestions');
  result.innerHTML = '';
  const todayWraps = document.querySelectorAll('.make-blur');
  for (let i = 0; i < todayWraps.length; i++) {
    todayWraps[i].classList.remove('backwords-blur')
  }

}
function getSuggestions(val){
  const result = document.querySelector('.suggestions');
  if(!val){
    result.innerHTML='';
    const todayWraps = document.querySelectorAll('.make-blur');
    for (let i = 0; i < todayWraps.length; i++) {
      todayWraps[i].classList.remove('backwords-blur')
    }
    return
  }
  let URL = 'https://dataservice.accuweather.com/locations/v1/cities/autocomplete?apikey='+myKey+'&q='+ val +'&language=en';
  loadData(URL,getCitiesByStr)
}

function getUserGeoLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(setPosition);
  } else {
    alert("Geolocation is not supported by this browser.");
  }
}
function getPositionWeather(key){
  let URL = 'https://dataservice.accuweather.com/currentconditions/v1/'+ key +'?apikey='+myKey+'&language=en&details=false';
  currentCityKey = key;
  loadData(URL,displayPositionInElements);
}
function getPositionfiveDaysWeather(key){
  URL = 'https://dataservice.accuweather.com/forecasts/v1/daily/5day/'+ key +'?apikey='+myKey+'&language=en&details=false&metric=true';
  loadData(URL,displayPositionInDaysElements);
}
displayPositionInDaysElements=function (fiveDaysWeather) {
  let PrecipitationTxt;
  /*fiveDaysWeather = JSON.parse('{"Headline":{"EffectiveDate":"2020-03-29T07:00:00+10:00","EffectiveEpochDate":1585429200,"Severity":3,"Text":"Rain Sunday can lead to flooding","Category":"rain","EndDate":"2020-03-29T19:00:00+10:00","EndEpochDate":1585472400,"MobileLink":"http://m.accuweather.com/en/pg/londol/258033/extended-weather-forecast/258033?unit=c&lang=en-us","Link":"http://www.accuweather.com/en/pg/londol/258033/daily-weather-forecast/258033?unit=c&lang=en-us"},"DailyForecasts":[{"Date":"2020-03-28T07:00:00+10:00","EpochDate":1585342800,"Temperature":{"Minimum":{"Value":11.4,"Unit":"C","UnitType":17},"Maximum":{"Value":19,"Unit":"C","UnitType":17}},"Day":{"Icon":12,"IconPhrase":"Showers","HasPrecipitation":true,"PrecipitationType":"Rain","PrecipitationIntensity":"Not so heavy"},"Night":{"Icon":12,"IconPhrase":"Showers","HasPrecipitation":true,"PrecipitationType":"Rain","PrecipitationIntensity":"Light"},"Sources":["AccuWeather"],"MobileLink":"http://m.accuweather.com/en/pg/londol/258033/daily-weather-forecast/258033?day=1&unit=c&lang=en-us","Link":"http://www.accuweather.com/en/pg/londol/258033/daily-weather-forecast/258033?day=1&unit=c&lang=en-us"},{"Date":"2020-03-29T07:00:00+10:00","EpochDate":1585429200,"Temperature":{"Minimum":{"Value":12.1,"Unit":"C","UnitType":17},"Maximum":{"Value":17.8,"Unit":"C","UnitType":17}},"Day":{"Icon":12,"IconPhrase":"Showers","HasPrecipitation":true,"PrecipitationType":"Rain","PrecipitationIntensity":"Heavy"},"Night":{"Icon":12,"IconPhrase":"Showers","HasPrecipitation":true,"PrecipitationType":"Rain","PrecipitationIntensity":"Moderate"},"Sources":["AccuWeather"],"MobileLink":"http://m.accuweather.com/en/pg/londol/258033/daily-weather-forecast/258033?day=2&unit=c&lang=en-us","Link":"http://www.accuweather.com/en/pg/londol/258033/daily-weather-forecast/258033?day=2&unit=c&lang=en-us"},{"Date":"2020-03-30T07:00:00+10:00","EpochDate":1585515600,"Temperature":{"Minimum":{"Value":11.3,"Unit":"C","UnitType":17},"Maximum":{"Value":17.4,"Unit":"C","UnitType":17}},"Day":{"Icon":12,"IconPhrase":"Showers","HasPrecipitation":true,"PrecipitationType":"Rain","PrecipitationIntensity":"Heavy"},"Night":{"Icon":12,"IconPhrase":"Showers","HasPrecipitation":true,"PrecipitationType":"Rain","PrecipitationIntensity":"Light"},"Sources":["AccuWeather"],"MobileLink":"http://m.accuweather.com/en/pg/londol/258033/daily-weather-forecast/258033?day=3&unit=c&lang=en-us","Link":"http://www.accuweather.com/en/pg/londol/258033/daily-weather-forecast/258033?day=3&unit=c&lang=en-us"},{"Date":"2020-03-31T07:00:00+10:00","EpochDate":1585602000,"Temperature":{"Minimum":{"Value":11.7,"Unit":"C","UnitType":17},"Maximum":{"Value":18.6,"Unit":"C","UnitType":17}},"Day":{"Icon":12,"IconPhrase":"Showers","HasPrecipitation":true,"PrecipitationType":"Rain","PrecipitationIntensity":"Heavy"},"Night":{"Icon":12,"IconPhrase":"Showers","HasPrecipitation":true,"PrecipitationType":"Rain","PrecipitationIntensity":"Light"},"Sources":["AccuWeather"],"MobileLink":"http://m.accuweather.com/en/pg/londol/258033/daily-weather-forecast/258033?day=4&unit=c&lang=en-us","Link":"http://www.accuweather.com/en/pg/londol/258033/daily-weather-forecast/258033?day=4&unit=c&lang=en-us"},{"Date":"2020-04-01T07:00:00+10:00","EpochDate":1585688400,"Temperature":{"Minimum":{"Value":11.9,"Unit":"C","UnitType":17},"Maximum":{"Value":18.1,"Unit":"C","UnitType":17}},"Day":{"Icon":12,"IconPhrase":"Showers","HasPrecipitation":true,"PrecipitationType":"Rain","PrecipitationIntensity":"Heavy"},"Night":{"Icon":7,"IconPhrase":"Cloudy","HasPrecipitation":true,"PrecipitationType":"Rain","PrecipitationIntensity":"Moderate"},"Sources":["AccuWeather"],"MobileLink":"http://m.accuweather.com/en/pg/londol/258033/daily-weather-forecast/258033?day=5&unit=c&lang=en-us","Link":"http://www.accuweather.com/en/pg/londol/258033/daily-weather-forecast/258033?day=5&unit=c&lang=en-us"}]}')*/
  document.querySelector('.week-Headline').innerHTML = fiveDaysWeather.Headline.Text;
  for (let i = 0; i<5; i++){
    document.querySelector('#day' + i + '> .temp > .min-temp').innerHTML = fiveDaysWeather.DailyForecasts[i].Temperature.Minimum.Value + '°';
    document.querySelector('#day' + i + '> .temp > .max-temp').innerHTML = fiveDaysWeather.DailyForecasts[i].Temperature.Maximum.Value + '°';
    //------day------
    document.querySelector('#day' + i + '> .day-night-wrap > .day > .ver-al-txt > .weather-txt').innerHTML = fiveDaysWeather.DailyForecasts[i].Day.IconPhrase;
    if (fiveDaysWeather.DailyForecasts[i].Day.HasPrecipitation == true){
       PrecipitationTxt = fiveDaysWeather.DailyForecasts[i].Day.PrecipitationIntensity + ' ' + fiveDaysWeather.DailyForecasts[i].Day.PrecipitationType;
      document.querySelector('#day' + i + '> .day-night-wrap > .day > .ver-al-txt > .weather-txt').innerHTML += ' ' + PrecipitationTxt;
    }
    //------night------
    document.querySelector('#day' + i + '> .day-night-wrap > .night > .ver-al-txt > .weather-txt').innerHTML = fiveDaysWeather.DailyForecasts[i].Night.IconPhrase;
    if (fiveDaysWeather.DailyForecasts[i].Night.HasPrecipitation == true){
      PrecipitationTxt = fiveDaysWeather.DailyForecasts[i].Night.PrecipitationIntensity + ' ' + fiveDaysWeather.DailyForecasts[i].Night.PrecipitationType;
      document.querySelector('#day' + i + '> .day-night-wrap > .night > .ver-al-txt > .weather-txt').innerHTML += ' ' + PrecipitationTxt;
    }
  }
}
displayPositionInElements=function (position) {
  if(position[0].IsDayTime != true){
    document.querySelector('.time-icon').classList.add('night-icon');
    document.querySelector('.time-icon').classList.remove('day-icon');
  }
  else {
    document.querySelector('.time-icon').classList.remove('night-icon');
    document.querySelector('.time-icon').classList.add('day-icon');
  }
  document.querySelector('.now-txt').innerHTML = position[0].WeatherText;
  document.querySelector('#now-temp').innerHTML = position[0].Temperature.Metric.Value + '°';
  document.querySelector('#precipitation').innerHTML = position[0].HasPrecipitation == true ? position[0].PrecipitationType : 'No Precipitation';
  if (localStorage.getItem("CityKey_" + currentCityKey) == null){
    document.querySelector('.heart').classList.remove("red");
  }
  else {
    document.querySelector('.heart').classList.add("red");
  }
}
setPositionData=function (position) {
  document.querySelector('#search-city').value = position.EnglishName;
  getPositionWeather(position.Key);
  setTimeout(function(){ getPositionfiveDaysWeather(position.Key); }, 1000);
}

function setPosition(position) {
  let positionCoords = position.coords.latitude + '7%2C' + position.coords.longitude;
  let URL = 'https://dataservice.accuweather.com/locations/v1/cities/geoposition/search?apikey='+myKey+'&q='+ positionCoords +'&language=en&details=false&toplevel=true';
  loadData(URL,setPositionData);
}
function addToFavorites() {
  if (localStorage.getItem("CityKey_"+currentCityKey) == null){
    localStorage.setItem("CityKey_" + currentCityKey,currentCityKey);
    document.querySelector('.heart').classList.add("red");
  }
  else {
    localStorage.removeItem("CityKey_" + currentCityKey);
    document.querySelector('.heart').classList.remove("red");
  }

}
function onloadFav() {
  let favKeys = getAllFavKeys();
  for(let i = 0; i<favKeys.length; i++){
    if (favKeys[i].includes("CityKey_")){
      let x = localStorage.getItem(favKeys[i]);
      getFavPositionWeather(x);
    }
  }
}
function getAllFavKeys() {
  let keys = Object.keys(localStorage)
  return keys;
}

function getFavPositionWeather(key){
  let URL = 'https://dataservice.accuweather.com/currentconditions/v1/'+ key +'?apikey='+myKey+'&language=en&details=false';
  loadData(URL,displayFavElements);
}
function displayFavElements(favWeather) {
    let cityElem = document.createElement("div");
    let CityName = favWeather[0].Link.split("en/")[1].split("/")[1];
    let CityId = favWeather[0].Link.split("en/")[1].split("/")[2];
    cityElem.classList.add('fav-item');
    cityElem.id = "CityKey_" + CityId;
    cityElem.onclick = function() { onFavClick(CityId,CityName); };
    cityElem.innerHTML = "<div class='ttl'>" + CityName + "</div>";
    cityElem.innerHTML += "<div class='temp'>" + favWeather[0].Temperature.Metric.Value + "°</div>";
    cityElem.innerHTML += ("<div class='remove-btn' onclick='removeCityFromFav("+ cityElem.id +")'>remove from favorites</div>");
    document.querySelector('.fav-wrap').appendChild(cityElem);
}
function removeCityFromFav(cityId) {
  localStorage.removeItem(cityId.id);
  var elem = document.querySelector('#'+cityId.id);
  elem.parentNode.removeChild(elem);
}
onAddLetter = function(e){
  if(!(/^[a-zA-Z0-9$@$!%*?&#^-_. +]+$/i.test(e.key))) {
    e.preventDefault();
    return false;
  }
}
function onFavClick(key,name) {
  localStorage.setItem("cityNamefromFav",name);
  localStorage.setItem("cityKeyfromFav",key);
  window.location.href="index.html";
}
