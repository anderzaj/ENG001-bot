const puppeteer = require("puppeteer");
const secrets = require("./secrets");

const BASE_URL = "https://cyberteachers.eberlitz.com/digital/rest";
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
        _new[j].push(arr[i]);
      }
    }
  }

  for (let i = 0; i < _new.length; i++) {
    if (_new[i].length > 0) {
      ans.push(_new[i].join(""));
    }
  }

  return ans;
}

programFinder = async (page) => {
  let i = await page.evaluate(() => {
    const nodes = document.querySelectorAll(".accordion-heading");

    const index = (function () {
      for (let i = 0; i < nodes.length; i++) {
        for (let j = 0; j < nodes[i].children.length; j++) {
          if (nodes[i].children[j].className.includes("accordion-progress")) {
            if (!nodes[i].children[j].children[1].textContent.includes("100")) {
              return i + 1;
            }
          } 
        }
      }
      return -1;
    })();

    return index;
  });

  return i;
}

init = async () => {
  try {
    const browser = await puppeteer.launch({headless: false});
    const [page] = await browser.pages();

    await page.setViewport({
      width: 1920,
      height: 1080,
      deviceScaleFactor: 1,
    });

    await page.goto(BASE_URL + "/login");

    await page.waitForSelector('.login--form-login');
    await page.type('input#j_username', SECRET_USER);
    await page.type('input#password', SECRET_PW);
    await page.click('.btn.btn-default');

    sleep(5000);

    await page.goto(BASE_URL + "/#/program");

    sleep(5000);

    await page.waitFor(`a[href='/digital/exercises/exoFrame.jsp?no=1&provenance=33&dest=33&type=worksheet_45&rule=id51233014&&resumeV9=resume']`);

    await page.evaluate(() => {
      document.querySelector(`a[href='/digital/exercises/exoFrame.jsp?no=1&provenance=33&dest=33&type=worksheet_45&rule=id51233014&&resumeV9=resume']`).click();
    });

    sleep(1000);

    // TODO: aqui hay que agregar un loop o algo, para que si index = -1 (no encontro un programa que no este listo) avanze a la siguiente pagina y busque denuevo
    /*const index = await programFinder(page);

    await page.waitFor("#header" + index.toString())

    await page.evaluate(async (index) => {
      await document.querySelector("#header" + index.toString()).children[4].children[0].click();
    }, index)
*/
    sleep(1000);

    await page.waitFor("body");
    
    sleep(5000);

    await sectionIdentifier(page);
  } catch (err) {
    console.error(err);
  }

  return
}

sectionIdentifier = async (page) => {
  const sectionClasses = await page.evaluate(() => {
    return document.getElementsByTagName("body")[0].className;
  })

  if (sectionClasses.includes("vocabulary-presentation")) {
    await vocabularyPresentation(page);
  } else if (sectionClasses.includes("word-choice")) {
    await wordChoice(page);
  } else if (sectionClasses.includes("ficheFonctionnelle")) {
    console.log("ficheFonctionnelle");
  } else if (sectionClasses.includes("sentence-ordering")) { 
    await sentenceOrdering(page);
  } else if (sectionClasses.includes("fill-blank-in-text")) {
    await fillInBlankText(page);
  } else if (sectionClasses.includes("qcm-video")) {
    await qcmVideo(page);
  } else if (sectionClasses.includes("writing-assistant")) { // in one program this class appears more than one time, careful
    console.log("writing-assistant");
  } else if (sectionClasses.includes("speaking-role-play")) {
    await speakingRolePlay(page);
  } else if (sectionClasses.includes("speech-trainer")) {
    console.log("speech-trainer");
  } else if (sectionClasses.includes("blank-sentence")) {
    console.log("blank-sentence");
  } else if (sectionClasses.includes("speech-trainer")) {
    console.log("speech-trainer");
  } else if (sectionClasses.includes("speech-trainer")) {
    console.log("speech-trainer");
  } else if (sectionClasses.includes("speech-trainer")) {
    console.log("speech-trainer");
  }

  return;
}

wordChoice = async (page) => {
  try {
    let res00 = "select[name='res[0][0]']";

    await page.waitFor(res00);

    const selects = await page.evaluate(() => Array.from(document.querySelectorAll(`select.blank-input`), element => element.name));
    const stringArr = await page.evaluate(() => document.querySelector("input#correctAnswers").value);
    const answers = formatArr(stringArr);

    for (let i = 0; i < answers.length; i++) {
      console.log(selects[i], answers[i]);
      await page.type("select[name='" + selects[i] + "']", answers[i]);
    }

    await page.evaluate(() => {
      document.querySelector(".btn-correction").click();
      document.querySelector(".btn-last").click();
    })

    sleep(5000);

    await page.waitFor("body");

    await sectionIdentifier(page);
  } catch (err) {
    console.error(err);
  }

  return;
}

// TODO: should we add something to wait for before running the logic? (like waitFor(body) or something)
vocabularyPresentation = async (page) => {
  try {
    await page.evaluate(() => {
      document.querySelector(".btn-last").click();
    })

    sleep(5000);

    await page.waitFor("body");

    await sectionIdentifier(page);
  } catch (err) {
    console.error(err);
  }

  return;
}

// TODO: should we add something to wait for before running the logic? (like waitFor(body) or something)
speakingRolePlay = async (page) => {
  try {
    await page.evaluate(() => {
      document.querySelector(".btn-last").click();
    })

    sleep(5000);

    await page.waitFor("body");

    await sectionIdentifier(page);
  } catch (err) {
    console.error(err);
  }

  return;
}

fillInBlankText = async (page) => {
  try {
    await page.waitFor(".exercice-content");

    const snaptargets = await page.evaluate(async () => {
      const snaptargets = document.querySelectorAll(".snaptarget");

      let elements = [];

      for (let i = 0; i < snaptargets.length; i++) {
        let tag = snaptargets[i].getAttribute("correct");
        let bounds = snaptargets[i].getBoundingClientRect();

        let finalX = parseInt(bounds.x + (bounds.width/2));
        let finalY = parseInt(bounds.y + (bounds.height/2));

        let coords = [finalX, finalY];
        elements.push({[tag]: coords});
      }

      return elements;
    });

    for (let i = 0; i < snaptargets.length; i++) {
      const draggableCoords = await page.evaluate(async (ans) => {
        const bounds = document.querySelector(`[ans='${ans}']`).getBoundingClientRect();
        return [(bounds.x + bounds.width*0.33), (bounds.y + bounds.height/2)];
      }, Object.keys(snaptargets[i])[0]);

      let finalX = snaptargets[i][Object.keys(snaptargets[i])[0]][0];
      let finalY = snaptargets[i][Object.keys(snaptargets[i])[0]][1];
      
      await page.mouse.move(draggableCoords[0] + 5, draggableCoords[1]);
      await page.mouse.down();
      await page.mouse.move(finalX, finalY);
      await page.mouse.up();
    }

    await page.evaluate(() => {
      document.querySelector(".btn-correction").click();
      document.querySelector(".btn-last").click();
    })

    sleep(5000);

    await page.waitFor("body");

    await sectionIdentifier(page);
  } catch (err) {
    console.error(err);
  }

  return
}

sentenceOrdering = async (page) => {
  try {
    await page.waitFor(".exercice-content");

    let answerOrder = await page.evaluate(() => {
      let arr = [];
      const elements = document.querySelectorAll(".show_answer");

      for (let i = 0; i < elements.length; i++) {
        arr.push(elements[i].textContent);
      }

      return arr;
    });

    for (let i = 0; i < answerOrder.length; i++) {
      const final = await page.evaluate((i) => {
        const answerBoxes = document.querySelectorAll(".dialog-text");
        let bounds = answerBoxes[i].getBoundingClientRect();
        let x = parseInt(bounds.x + (bounds.width/2));
        let y = parseInt(bounds.y + (bounds.height/2));

        return {x: x, y: y}
      }, i)

      const initial = await page.evaluate(async (ans) => {
        const options = document.querySelectorAll(".dialog-text");
        for (let i = 0; i < options.length; i++) {
          if (options[i].innerHTML == ans) {
            let bounds = options[i].getBoundingClientRect();
            let x = parseInt(bounds.x + (bounds.width/2));
            let y = parseInt(bounds.y + (bounds.height/2));

            return {x: x, y: y};
          }
        }
      }, answerOrder[i]);

      await page.mouse.move(initial.x, initial.y);
      await page.mouse.down();
      await page.mouse.move(final.x, final.y);
      await page.mouse.up();
      sleep(250);
    }

    await page.evaluate(() => {
      document.querySelector(".btn-correction").click();
      document.querySelector(".btn-last").click();
    })

    sleep(5000);

    await page.waitFor("body");

    await sectionIdentifier(page);
  } catch (err) {
    console.error(err);
  }

  return
}

qcmVideo = async (page) => {
  try {
    await page.waitFor(".exercice-content");

    await page.evaluate(() => {
      const options = document.querySelectorAll(".answer-text");

      for (let i = 0; i < options.length; i++) {
        if (options[i].innerHTML.includes(options[i].getAttribute("correct"))) {
          options[i].click();
        }
      }
    });

    await page.evaluate(() => {
      document.querySelector(".btn-correction").click();
      document.querySelector(".btn-last").click();
    })

    sleep(5000);

    await page.waitFor("body");

    await sectionIdentifier(page);
  } catch (err) {
    console.error(err);
  }

  return
}

vocabPresentation_ = async () => {
  console.log("Hello, vocab presentation");
}

vocabPresentation_ = async () => {
  console.log("Hello, vocab presentation");
}

vocabPresentation_ = async () => {
  console.log("Hello, vocab presentation");
}

vocabPresentation_ = async () => {
  console.log("Hello, vocab presentation");
}

init();
