$(document).ready(function () {
  let weatherData;
  let dateTimesStrings = [];
// let todayDate
// let today
  let removeMarkerArray = [];
  let marker;

  mapboxgl.accessToken = "pk.eyJ1Ijoiam9zaHVhODciLCJhIjoiY2tvZWdlc2J4MDhwMjJ3anh4amFtc3E5ZiJ9.wfvdwsZvL2DaQRwQPbUlXA"
  let map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/dark-v10', // style URL
    center: [-97.6709, 31.0689], // starting position [lng, lat]
    zoom: 9 // starting zoom

  }).addControl(new mapboxgl.NavigationControl());


  function weatherAjax(lng, lat) {

    $.ajax(" https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lng + "&exclude=current,hourly,minutely&units=imperial&appid=" + "3b1249c494eafbb7ec1bd59ce57987e3").done(function (resp) {
      resp.daily.splice(5, 3);
      // console.log(resp)
      weatherData = resp
      // today = resp.daily[0]

      // todayDate = new Date(today.dt * 1000)
      // console.log(todayDate)

      //  dt * 1000? but uh oof.

      function dayTimeHTML(day) {
        let result = new Date(weatherData.daily[day].dt * 1000).toString();
        // console.log(result);
        let resultArray = result.split(" ");
        // console.log(resultArray);
        let resultObject = {
          day: resultArray[0],
          month: resultArray[1],
          date: resultArray[2],
          year: resultArray[3],
        }
        if (day === 0) {
          resultObject.day = resultObject.day + " (Today)"
        }
        return resultObject;
      }

      function dateHTML(day) {
        let result = new Date(weatherData.daily[day].dt * 1000).toString();
        // console.log(result);
        let resultArray = result.split(" ");
        // console.log(resultArray);
        let resultObject = {
          day: resultArray[0],
          month: resultArray[1],
          date: resultArray[2],
          year: resultArray[3],
        }

        return resultObject;
      }


      function tempHTML(day) {
        return weatherData.daily[day].temp
      }

      function weatherHTML(day) {
        return weatherData.daily[day].weather[0]
      }

      function rainHTML(day) {
        let stuff = weatherData.daily[day].pop.toFixed(2) * 100;
        stuff = stuff.toFixed(0);
        return stuff + "%";
      }

      function humidHTML(day) {
        return weatherData.daily[day].humidity + "%";
      }


      function capitalizeFirst(string) {

        let stringArray = string.toLowerCase().split(" ");
        let resultArray = [];
        stringArray.forEach(function (element, index) {
          let elementArray = element.split("");
          // console.log(elementArray)
          let firstLetter = elementArray[0].toUpperCase();
          // console.log(firstLetter)
          elementArray.splice(0, 1, firstLetter);
          // console.log(elementArray)
          element = elementArray.join("")
          resultArray.push(element);
        });
        return resultArray.join(" ");
      }


      function loadData() {
        $("#days").html("");

        weatherData.daily.forEach(function (day, index) {
          // console.log(day,index)

          $("#days").append(
            "<div class=\"card weatherCard text-white bg-dark mx-2 grow animated fadeInDown\">\n" +
            "    <img class='icons' src=\"http://openweathermap.org/img/wn/" + weatherData.daily[index].weather[0].icon + "@2x.png\n\" class=\"card-img-top\" alt=\"...\">\n" +
            "    <div class=\"card-body cardInfo p-0\">\n" +
            "      <h4 class=\"card-title pl-2\">" + dayTimeHTML(index).day + "</h4>\n" +
            "      <ul class=\"list-group cardList m-0 py-0\">\n" +
            "        <li class=\"list-group-item m-0 py-0\">" + dateHTML(index).year + "-" + dateHTML(index).month + "-" + dateHTML(index).date + "</li>\n" +

            "        <li class=\"list-group-item m-0 py-0\">" + "<i class=\"fas fa-temperature-high\"></i>" + tempHTML(index).max + " - " + " <i class=\"fas fa-temperature-low\"></i>" + tempHTML(index).min + "</li>\n" +
            "        <li class=\"list-group-item m-0 py-0\">" + capitalizeFirst(weatherHTML(index).description) + "</li>\n" +
            "        <li class=\"list-group-item m-0 py-0\">" + "Chance of Rain: " + rainHTML(index) + "</li>\n" +
            "        <li class=\"list-group-item m-0 py-0\">" + "Humidity: " + humidHTML(index) + "</li>\n" +
            "      </ul>\n" +
            // "      <a href=\"#\" class=\"btn btn-primary\">Go somewhere</a>\n" +
            "    </div>\n" +
            "  </div>"
          )

        });


      }

      loadData();
      let newCenter = {
        lng: lng,
        lat: lat
      };

      if (marker === undefined) {
      } else {
        marker.remove();
      }
      $("#markerLocation").html("");

      let testCode;
      reverseGeocode(newCenter, "pk.eyJ1Ijoiam9zaHVhODciLCJhIjoiY2tvZWdlc2J4MDhwMjJ3anh4amFtc3E5ZiJ9.wfvdwsZvL2DaQRwQPbUlXA").then(function (info) {

        testCode = info.toString();
        let resultArray = testCode.split(", ");
        resultArray.shift();
        testCode = resultArray.join(", ");
        // console.log(testCode);

        // let markerInfo = markerNewLocation(newCenter)
        $("#markerLocation").html(
          testCode
        );

      });


      marker = new mapboxgl.Marker({
        draggable: true,
        color: "limegreen",


      })
        .setLngLat(newCenter)
        .addTo(map);

      marker.on("dragend", function () {
        // console.log(marker.getLngLat());
        let geoCenter = {
          lng: marker.getLngLat().lng,
          lat: marker.getLngLat().lat
        }
        map.flyTo({center: geoCenter, zoom: 9,});
        weatherAjax(marker.getLngLat().lng, marker.getLngLat().lat);
      });

    });
  }

  let defaultCenter =
    [-97.6709, 31.0689]
  ;
  weatherAjax(defaultCenter[0], defaultCenter[1]);


  removeMarkerArray.push(marker);


  $("#markers").click(function () {
    // resLocMarkers.remove();
    removeMarkerArray.forEach(function (markerx, index) {
      markerx.remove();
    });
  });

  $("#inputMapStyle").change(function () {
    let selected = $(this).val();
    // console.log(selected)
    map.setStyle(selected)
  });

  // $("#btn").click(function () {
  //   let userInput = $("#input").val();
  //   geocode(userInput, "pk.eyJ1Ijoiam9zaHVhODciLCJhIjoiY2tvZWdlc2J4MDhwMjJ3anh4amFtc3E5ZiJ9.wfvdwsZvL2DaQRwQPbUlXA").then(function (info) {
  //     console.log(info);
  //     let newCenter = {
  //       lng: info[0],
  //       lat: info[1]
  //     };
  //     marker.setLngLat(newCenter);
  //     // popup.setHTML('<h3 class="font">' + userInput + '</h3>');
  //     map.flyTo({center: newCenter,zoom: 9,});
  //   });
  // });

  $("#geoSearch").click(function () {
    let search = $("#inputGeoSearch").val();
    // console.log(search);
    geocode(search, "pk.eyJ1Ijoiam9zaHVhODciLCJhIjoiY2tvZWdlc2J4MDhwMjJ3anh4amFtc3E5ZiJ9.wfvdwsZvL2DaQRwQPbUlXA").then(function (info) {
      // console.log(info);
      let geoCenter = {
        lng: info[0],
        lat: info[1]
      };

      map.flyTo({center: geoCenter, zoom: 9,});

      console.log(geoCenter)
      weatherAjax(geoCenter.lng, geoCenter.lat)
    });
  });



});









