const puppeteer = require("puppeteer");
const secrets = require("../secrets");
const sleep = require("../utils/sleep");

const BASE_URL = "https://cyberteachers.eberlitz.com/digital1/rest";
const SECRET_USER = secrets.username;
const SECRET_PW = secrets.password;

activityBot = async (hrs) => {
  try {
    console.log("opening new puppeteer browser instance");
    const browser = await puppeteer.launch({headless: true});
    const [page] = await browser.pages();

    await page.setViewport({
      width: 1920,
      height: 1080,
      deviceScaleFactor: 1,
    });

    console.log("going to", BASE_URL + "/login");
    await page.goto(BASE_URL + "/login");

    console.log("waiting for selector and logging in");
    await page.waitForSelector('.login--form-login');
    await page.type('input#j_username', SECRET_USER);
    await page.type('input#password', SECRET_PW);
    await page.click('.btn.btn-default');

    console.log("sleeping (5000)")
    sleep(5000);

    let ms = 3600000 * hrs;

    console.log("entering loop");
    let loop = 0
    let intervalFunc = setInterval(async () => {
      console.log("loop:", loop);
      if (loop % 2 == 0) {
        await page.evaluate(() => {
          document.querySelectorAll("a.program-link")[1].click();
        });
      } else {
        await page.evaluate(() => {
          document.querySelectorAll("a.homepage-link")[1].click();
        });
      }
    
      if (++loop === Math.ceil(ms/300000)) {
        console.log("finished looping");
        clearInterval(intervalFunc);
        process.exit();
      }
    }, 300000);

    return;
  } catch (err) {
    console.error(err);
    process.exit();
  }
}

const hrs = parseFloat(process.argv[2]);

activityBot(hrs);