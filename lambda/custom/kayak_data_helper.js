const rp = require('request-promise');
const cheerio = require('cheerio');

const options = {
  uri: `https://www.kayak.com/flights/` + flightcode + '-BOS/' + date + '?sort=price_a',
  transform: function (body) {
    return cheerio.load(body);
  }
};

rp(options)
  .then(($) => {
    console.log($);
  })
  .catch((err) => {
    console.log(err);
  });
