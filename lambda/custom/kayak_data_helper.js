const rp = require('request-promise');
    const cheerio = require('cheerio');

    const options = {
      //uri: `https://www.kayak.com/flights/` + flightcode + '-BOS/' + date + '?sort=price_a',
      uri: 'https://www.airhob.com/Flights/Search/Index?origin=AUS&destination=BOS&onwardDate=06/12/2018&returnDate=&tripType=O&adults=1&childs=0&infants=0&hostAccess=Y&classType=Economy&fareType=N&ProgramId=-1&ProgramName=&TierId=-1&TierName=&originLabel=Austin,%20US%20(AUS)&destinationLabel=Boston,%20US%20(BOS)&lccPref=All&fccPref=All&lccAir=&fccAir=&AllEarnings=true&ShowMiles=false&ShowUpgrades=false&ShowBenefits=false&ShowNoMiles=false&cur=USD&loaded=true',
      transform: function (body) {
        return cheerio.load(body);
      }
    };

    var min_price;
    rp(options)
      .then(($) => {
        var prices = new Array();
        var get = false;
        $('.each_flight_pricing_and_actions').children('h4').each(function(i, elem) {
          if(!get){
            var price = $(this).text().trim().replace(/\s+/, "");
            console.log(price);
            prices.push(price);
            get = true;
          }

      });
        min_price = prices[0];

        console.log('Cheapest flight found was ' + min_price);

      })
      .catch((err) => {
        console.log(err);
      });


    const speechText = 'The cheapest flight that I found was ' + min_price;