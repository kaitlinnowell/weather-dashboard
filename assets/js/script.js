
APIKey='af4567deab7872f4d093c4a656fcba26';
let currentWeatherTitle = document.getElementById('currentTitle');
let id;
let iconURL = `https://openweathermap.org/img/wn/${id}.png`;

function getCurrentWeather(city) {
  const queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIKey}&units=imperial`;
  fetch(queryURL)
    .then(function (response) {
      if (response.ok) {
        return response.json();
      }
      throw new Error('city not found');
    })
    .then(function (data) {
      // Make sure to look at the response in the console and read how 404 response is structured.
      const title = `${data.name} (${dayjs().format('M/D/YYYY')})`;
      currentWeatherTitle.textContent = title;
      console.log(data)
      $('#currentIcon').attr('src', `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`)
      $('#temp').text(`Temp: ${data.main.temp} °F`);
      $('#wind').text(`Wind: ${data.wind.speed} MPH`);
      $('#humidity').text(`Humidity: ${data.main.humidity} %`);
      getForcast(data.coord.lat, data.coord.lon);

      //Update Search History
      const cities = JSON.parse(localStorage.getItem('cities')) || [];
      if (!cities.includes(data.name)) {
        cities.push(data.name);
      }
      localStorage.setItem('cities', JSON.stringify(cities));
      addHistory(cities);
    })
    .catch((error) => {
      alert('Invalid city name.')
    });
}

function getForcast(lat, lon) {
  // const geoURL = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${APIKey}`
  const queryURL= `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&cnt=5&appid=${APIKey}&units=imperial`
  $('#forcast').empty();
  fetch(queryURL)
    .then(function(response) {
      return response.json();
    })
      .then(function(data) {
      i=0;
      for (day of data.list) {
        i++;
        card = $('<div>')
        card.addClass('card bg-info col-2.5 mx-auto p-2 text-white')
        date = $('<h4>').text(dayjs().add(i, 'day').format('M/D/YYYY'))
        icon = $('<img>').attr('src', `https://openweathermap.org/img/wn/${day.weather[0].icon}.png`)
        temp = $('<p>').text(`Temp: ${day.main.temp} °F`)
        wind = $('<p>').text(`Wind: ${day.wind.speed} MPH`)
        humidity = $('<p>').text(`Humidty: ${day.main.humidity} %`)

        icon.attr('height', '30px')
        icon.attr('width', '30px')

        card.append(date);
        card.append(icon);
        card.append(temp);
        card.append(wind);
        card.append(humidity);
        $('#forcast').append(card)
      }
    })
}

function search(event) {
  const city = $('#cityInput').val();
  getCurrentWeather(city);
  $('#cityInput').val('')
}

function addHistory(cities) {
  if (!cities) {
    cities = JSON.parse(localStorage.getItem('cities')) || [];
  }
  $('#history').empty();
  for (historyCity of cities) {
    newCity = $('<button>').text(historyCity).addClass('btn btn-secondary col-12 mt-1 city-button');
    $('#history').append(newCity);
  }
  $('.city-button').click(loadHistoryCity)
}

function loadHistoryCity(event) {
  city = event.target.textContent;
  getCurrentWeather(city);
}

$(document).ready(function () {
  $('#search').click(search)
  addHistory();
});
