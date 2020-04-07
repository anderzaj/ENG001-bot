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

activityBot = async (hrs) => {
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

    sleep(1000)

    await page.waitFor(res00)

    let ms = 3600000 * hrs

    let loop = 0
    let intervalFunc = setInterval(async () => {
      if (loop % 2 == 0) {
        await page.click("select[name='res[0][0]']");
      } else {
        await page.click("select[name='res[1][0]']");
      }
    
      if (++loop === Math.ceil(ms/540000)) {
        clearInterval(intervalFunc)
      }
    }, 540000)

    return `Loop ran ${loop} times.`
  } catch (error) {
    return error
  }
}


//activityBot(4);


vocabControlBot = async (hrs) => {
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

    sleep(1000)

    let res00 = "select[name='res[0][0]']";

    await page.waitFor(res00)

    const selects = await page.evaluate(() => Array.from(document.querySelectorAll(`select.blank-input`), element => element.name));

    await page.evaluate(() => {
      window.formatArr = function(arr) {
        console.log("running")
        let _new = [[]];
        let between = false;
        let j = 0;
        let ans = [];
      
        for (let i = 0; i < arr.length; i++) {
          if (arr[i] == "'") {
            if (between == true) {
              between = false;
            } else {
              j += 1;
              _new.push(new Array());
              between = true;
            }
          } else {
            if (between == true) {
              _new[j].push(arr[i])
            }
          }
        }
      
        for (let i = 0; i < _new.length; i++) {
          if (_new[i].length > 0) {
            ans.push(_new[i].join(""));
          }
        }
      
        return ans
      }
    })

    await page.evaluate(async (selects) => {
      let arr = await document.querySelector("input#correctAnswers").value
      let ans = formatArr(arr);
      console.log(ans)
      console.log(selects)
      for (let i = 0; i < ans.length; i++) {
        console.log(selects[i], ans[i])
        //await page.type(selects[i], ans[i]);
      }
    }, selects);

    let loop = 0;
    /*
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
    */

    return `Loop ran ${loop} times.`
  } catch (error) {
    return error
  }
}

vocabControlBot(4);