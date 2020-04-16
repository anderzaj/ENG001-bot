const puppeteer = require("puppeteer")
const secrets = require("./secrets");

const BASE_URL = "https://cyberteachers.eberlitz.com/digital/rest"
const SECRET_USER = secrets.username;
const SECRET_PW = secrets.password;

sleep = (milliseconds) => {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}

formatArr = (arr) => {
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

init = async () => {
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

    await page.goto(BASE_URL + "/#/program")

    sleep(10000)
    
    await page.evaluate(() => {
      let nodesList = document.querySelectorAll(".accordion-heading")

      let index = (function () {
        for (let i = 0; i < nodesList.length; i++) {
          for (let j = 0; j < nodesList[i].children.length; j++) {
            if (nodesList[i].children[j].className.includes("accordion-progress")) {
              if (!nodesList[i].children[j].children[1].textContent.includes("100")) {
                return i + 1
              }
            } 
          }
        }
      })();

      document.querySelector("#header" + index.toString()).children[4].children[0].click();
    });

    // if statement to check what kind of section we encounter goes here
    // if (body has classname X, then run Y function)

    // way to run function
    // await wordChoice(page);

    return 
  } catch (error) {
    return error
  }
}

wordChoice = async (page) => {
  await page.waitFor(`a[href='/digital/exercises/exoFrame.jsp?no=1&provenance=33&dest=33&type=worksheet_45&rule=id51233014&&resumeV9=resume']`)

  await page.evaluate(() => {
    document.querySelector(`a[href='/digital/exercises/exoFrame.jsp?no=1&provenance=33&dest=33&type=worksheet_45&rule=id51233014&&resumeV9=resume']`).click();
  });

  sleep(1000)

  let res00 = "select[name='res[0][0]']";

  await page.waitFor(res00)

  const selects = await page.evaluate(() => Array.from(document.querySelectorAll(`select.blank-input`), element => element.name));
  const stringArr = await page.evaluate(() => document.querySelector("input#correctAnswers").value);
  const answers = formatArr(stringArr);

  for (let i = 0; i < answers.length; i++) {
    console.log(selects[i], answers[i])
    await page.type("select[name='" + selects[i] + "']", answers[i]);
  }

  return page
}

vocabPresentation = async () => {
  console.log("Hello, vocab presentation")
}

wordChoice = async () => {
  console.log("Hello, vocab presentation")
}

vocabPresentation = async () => {
  console.log("Hello, vocab presentation")
}

vocabPresentation = async () => {
  console.log("Hello, vocab presentation")
}

vocabPresentation = async () => {
  console.log("Hello, vocab presentation")
}

vocabPresentation = async () => {
  console.log("Hello, vocab presentation")
}

vocabPresentation = async () => {
  console.log("Hello, vocab presentation")
}

vocabPresentation = async () => {
  console.log("Hello, vocab presentation")
}

vocabPresentation = async () => {
  console.log("Hello, vocab presentation")
}

vocabPresentation = async () => {
  console.log("Hello, vocab presentation")
}

init();