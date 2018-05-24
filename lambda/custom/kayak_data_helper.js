const rp = require('request-promise');
const cheerio = require('cheerio');

const options = {
  //uri: `https://www.kayak.com/flights/` + flightcode + '-BOS/' + date + '?sort=price_a',
  uri: 'https://www.kayak.com/flights/AMA-BOS/2018-07-18?sort=price_a',
  transform: function (body) {
    return cheerio.load(body);
  }
};

rp(options)
  .then(($) => {
    $('.price').each(function(i, elem) {
  console.log($(this).text());
});
  })
  .catch((err) => {
    console.log(err);
  });
