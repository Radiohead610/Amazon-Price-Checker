"a-price-whole"
"a-price-fraction"
"https://www.amazon.ca/dp/B0CN9H2PLY/ref=twister_B0CJ9XLZSF?"
"node parser.js https://www.amazon.ca/dp/B0CN9H2PLY/ref=twister_B0CJ9XLZSF? 400"

require('dotenv').config()
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const nightmare = require('nightmare')()

const args = process.argv.slice(2)                //an array: node + file + url passing, so just get the url
const url = args[0]
const minPrice = args[1]


checkPrice()

//dynamic function
async function checkPrice(){
  try {
    const priceString = await nightmare.goto(url)       //download the info from the web
                                        .wait(".a-price-whole")
                                        .evaluate(() => document.getElementsByClassName("a-price-whole")[0].innerText)
                                        .end()  // End the Nightmare instance here
                                        .catch((error) => {
                                        console.error('Search failed:', error);
                                        });

    // Now work with the priceString outside of the Nightmare chain
    if (priceString) {
        const priceNumber = parseInt(priceString.replace('.', ''), 10);
        if (priceNumber < minPrice) {
          //just to make sure that the email is sent
          await sendEmail(
            'Price Is Low',
            `The price on ${url} has dropped below ${minPrice}` 
          )
          console.log(priceNumber);
          console.log('It is cheap');
        } else {
          console.log(priceNumber);
          console.log('It is expensive');
        }  }} catch (e){
          await sendEmail('Amazon Price Check Error', e.message)
          throw e
  }
  }

  function sendEmail(subject, body){
    const email = {
      to: 'stinging610@gmail.com',
      from: 'stinging610@gmail.com',
      subject: subject,
      text: body,
      html: body
    }
    //since it's an async function, so we need to make sure we wait for the code
    return sgMail.send(email)
  }


// //static function
// async function checkPrice(){
//     const priceString = await nightmare.goto("https://www.amazon.ca/dp/B0CN9H2PLY/ref=twister_B0CJ9XLZSF?")       //download the info from the web
//                                         .wait(".a-price-whole")
//                                         .evaluate(() => document.getElementsByClassName("a-price-whole")[0].innerText)
//                                         .end()  // End the Nightmare instance here
//                                         .catch((error) => {
//                                         console.error('Search failed:', error);
//                                         });

//     // Now work with the priceString outside of the Nightmare chain
//     if (priceString) {
//         const priceNumber = parseInt(priceString.replace('.', ''), 10);
//         if (priceNumber < 350) {
//         console.log(priceNumber);
//         console.log('It is cheap');
//         } else {
//         console.log(priceNumber);
//         console.log('It is expensive');
//         }
//   }



