const puppeteer = require("puppeteer")
const secrets = require("./secrets");

const BASE_URL = "https://cyberteachers.eberlitz.com/digital1/rest"
const SECRET_USER = secrets.username;
const SECRET_PW = secrets.password;

sleep = (milliseconds) => {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}

bot = async (hrs) => {
  try {
    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();

    await page.setViewport({
      width: 1920,
      height: 1080,
      deviceScaleFactor: 1,
    })

    await page.goto(BASE_URL + "/login")

    await page.waitForSelector('.login--form-login')
    await page.type('input#j_username', SECRET_USER)
    await page.type('input#password', SECRET_PW)
    await page.click('.btn.btn-default')

    await page.goto(BASE_URL + "/#/program")

    sleep(10000)

    await page.evaluate(() => {
      document.querySelector(`a[href='/digital1/exercises/exoFrame.jsp?no=1&provenance=33&dest=33&type=worksheet_45&rule=id51233014&&resumeV9=resume']`).click();
    });

    sleep(10000)

    let ms = 3600000 * hrs

    // 540000ms = 9 minutes, assuming inactivity == 10 minutes this should save us
    // ms/540000 = times loop will run in time given
    let loop = 0
    let intervalFunc = setInterval(() => {
      // logic here


      if (++loop === Math.ceil(ms/540000)) {
        clearInterval(intervalFunc)
      }
    }, 540000)

    return `Loop ran ${loop} times.`
  } catch (error) {
    return error
  }
  
}

bot(4);