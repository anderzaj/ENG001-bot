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

    await page.waitFor(`a[href='/digital1/exercises/exoFrame.jsp?no=1&provenance=33&dest=33&type=worksheet_45&rule=id51233014&&resumeV9=resume']`)

    await page.evaluate(() => {
      document.querySelector(`a[href='/digital1/exercises/exoFrame.jsp?no=1&provenance=33&dest=33&type=worksheet_45&rule=id51233014&&resumeV9=resume']`).click();
    });

    let res00 = "select[name='res[0][0]']";
    /*
    let res10 = "select[name='res[1][0]']";
    let res20 = "select[name='res[2][0]']";
    let res30 = "select[name='res[3][0]']";
    let res40 = "select[name='res[4][0]']";
    */

    sleep(1000)

    await page.waitFor(res00)

    /*
    let ans = [];

    await page.evaluate((ans) => {
      let f = []
      let arr = JSON.parse(document.querySelector("input#correctAnswers").value)
      console.log(arr.length)
      for (let i = 0; i < arr.length; i++) {
        console.log(typeof arr[i], arr[i])
      }
      console.log("f", f)
      console.log(arr[0], arr[1], arr[2], arr[3], arr[4], arr[5], arr[6])
    }, ans);

    await page.evaluate((ans) => {
      console.log(ans)
    }, ans);

    await page.type(res00, 'shelved');
    await page.type(res10, 'championed');
    await page.type(res20, 'plummeted');
    await page.type(res30, 'patented');
    await page.type(res40, 'revamped');
    */

    let ms = 3600000 * hrs

    let loop = 0
    let intervalFunc = setInterval(async () => {
      await page.click("select[name='res[0][0]']");
      await page.evaluate((loop) => {
        console.log("Clicked, loop:", loop);
      }, loop);

      if (++loop === Math.ceil(ms/540000)) {
        clearInterval(intervalFunc)
      }
    }, 5000)

    await browser.close();
    return `Loop ran ${loop} times.`
  } catch (error) {
    return error
  }
}


bot(4);

