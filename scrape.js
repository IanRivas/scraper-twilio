const axios = require('axios');
const cheerio = require('cheerio');
require('dotenv').config();
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

const url =
  'https://articulo.mercadolibre.com.ar/MLA-1100856715-oculus-quest-2-advanced-all-in-one-casco-vr-128gb-_JM#reco_item_pos=4&reco_backend=machinalis-homes-pdp-boos&reco_backend_type=function&reco_client=home_second-best-navigation-trend-recommendations&reco_id=41b60975-9a48-4e12-8a5e-5ad0111d7b1f&c_id=/home/second-best-navigation-trends-recommendations/element&c_element_order=5&c_uid=6248aacd-a8a5-45c6-b61d-b58aa0ef0339';

const product = { name: '', price: '', link: '' };

// Set Interval
const handle = setInterval(scrape, 20000);

async function scrape() {
  // Fetch the html
  const { data } = await axios.get(url);
  // Load up the html
  const $ = cheerio.load(data);
  // get the container
  const item = $('div.ui-vip-core-container--column__right');
  // Extract the data that we need from the content
  product.name = $(item).find('h1').text();
  product.link = url;
  const price = $(item)
    .find('span.andes-money-amount__fraction')
    .first()
    .text()
    .replace(/[,.]/g, '');
  product.price = parseInt(price);
  console.log(product);
  // Send an SMS
  if (product.price < 124900) {
    client.messages
      .create({
        body: `The price of ${product.name} went below ${price}. Purchase it at ${product.link}`,
        from: '+18106389093',
        to: '+541150402265',
      })
      .then((message) => {
        console.log(message);
        clearInterval(handle);
      });
  }
}

scrape();
