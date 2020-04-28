const puppeteer = require("puppeteer");
const secrets = require("../secrets");
const sleep = require("../utils/sleep");

const BASE_URL = "https://cyberteachers.eberlitz.com/digital1/rest";
const SECRET_USER = secrets.username;
const SECRET_PW = secrets.password;

activityBot = async (hrs) => {
  try {
    const browser = await puppeteer.launch({headless: false});
    const [page] = await browser.pages();

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

    sleep(5000)

    let ms = 3600000 * hrs

    let loop = 0
    let intervalFunc = setInterval(async () => {
      if (loop % 2 == 0) {
        await page.evaluate(() => {
          document.querySelectorAll("a.program-link")[1].click();
        });
      } else {
        await page.evaluate(() => {
          document.querySelectorAll("a.homepage-link")[1].click();
        });
      }
    
      if (++loop === Math.ceil(ms/180000)) {
        clearInterval(intervalFunc);
      }
    }, 180000)

    return 
  } catch (error) {
    return error
  }
}

activityBot(4);