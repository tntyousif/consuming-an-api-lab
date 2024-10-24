const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
require('dotenv').config();

const app = express();
// Set the port from environment variable or default to 3000
const port = process.env.PORT ? process.env.PORT : '3000';

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.render('index');
});


app.post('/weather', async (req, res) => {
    const zipCode = req.body.zip;
    const apiKey = process.env.API_KEY;

    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `https://api.openweathermap.org/data/2.5/weather?zip=${zipCode}&units=imperial&appid=${apiKey}`,
      headers: { }
    };
    
    axios.request(config)
    .then((response) => {
      console.log(JSON.stringify(response.data));
      const weather = response.data; //save the response data in weather

      const cityName = weather.name;
      const temperature = weather.main.temp;
      const weatherDescription = weather.weather[0].description;

      res.render('weather/show.ejs', {
        city: cityName,
          temp: temperature,
          description: weatherDescription
      });
    })
    .catch((error) => {
        console.log(error);
    });
});


app.listen(port, () => {
    console.log(`The express app is ready on port ${port}!`);
});