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

programFinder = async (page) => {
  let i = await page.evaluate(() => {
    const nodes = document.querySelectorAll(".accordion-heading")

    const index = (function () {
      for (let i = 0; i < nodes.length; i++) {
        for (let j = 0; j < nodes[i].children.length; j++) {
          if (nodes[i].children[j].className.includes("accordion-progress")) {
            if (!nodes[i].children[j].children[1].textContent.includes("100")) {
              return i + 1
            }
          } 
        }
      }
      return -1
    })();

    return index
  });

  return i
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

    sleep(5000)

    await page.waitFor(`a[href='/digital/exercises/exoFrame.jsp?no=1&provenance=33&dest=33&type=worksheet_45&rule=id51233014&&resumeV9=resume']`)

    await page.evaluate(() => {
      document.querySelector(`a[href='/digital/exercises/exoFrame.jsp?no=1&provenance=33&dest=33&type=worksheet_45&rule=id51233014&&resumeV9=resume']`).click();
    });

    sleep(1000)

    // TODO: aqui hay que agregar un loop o algo, para que si index = -1 (no encontro un programa que no este listo) avanze a la siguiente pagina y busque denuevo
    /*const index = await programFinder(page);

    await page.waitFor("#header" + index.toString())

    await page.evaluate(async (index) => {
      await document.querySelector("#header" + index.toString()).children[4].children[0].click();
    }, index)
*/
    sleep(1000)

    await page.waitFor("body")
    
    sleep(5000)

    await sectionIdentifier(page);

    return 
  } catch (err) {
    console.error(err)
    return 
  }
}

sectionIdentifier = async (page) => {
  const sectionClasses = await page.evaluate(() => {
    return document.getElementsByTagName("body")[0].className
  })

  if (sectionClasses.includes("vocabulary-presentation")) {
    await vocabularyPresentation(page);
  } else if (sectionClasses.includes("word-choice")) {
    await wordChoice(page)
  } else if (sectionClasses.includes("ficheFonctionnelle")) {
    console.log("ficheFonctionnelle")
  } else if (sectionClasses.includes("sentence-ordering")) { // this one might need to be fixed since there are multiple classes
    console.log("sentence-ordering")
  } else if (sectionClasses.includes("fill-blank-in-text")) {
    await fillInBlankText(page);
  } else if (sectionClasses.includes("qcm-video")) {
    console.log("qcm-video")
  } else if (sectionClasses.includes("writing-assistant")) { // in one program this class appears more than one time, careful
    console.log("writing-assistant")
  } else if (sectionClasses.includes("speaking-role-play")) {
    await speakingRolePlay(page);
  } else if (sectionClasses.includes("speech-trainer")) {
    console.log("speech-trainer")
  } else if (sectionClasses.includes("blank-sentence")) {
    console.log("blank-sentence")
  } else if (sectionClasses.includes("speech-trainer")) {
    console.log("speech-trainer")
  } else if (sectionClasses.includes("speech-trainer")) {
    console.log("speech-trainer")
  } else if (sectionClasses.includes("speech-trainer")) {
    console.log("speech-trainer")
  }

  return
}

// TODO: todas las funciones que resuelvan secciones de un programa, tienen la misma estructura:
// 1) esperar a que el ejercicio cargue
// 2) aplicar la logica y acciones necesarias para resolver el ejercicio
// 3) apretar next/continuar/lo que sea para ir al siguiente ejercicio
// 4) sleep, para que el siguiente ejercicio cargue, (esto es lo mismo que paso 1, en este punto ya deberia estar corriendo el siguiente ejercicio)
// 5) identificar que tipo de ejercicio es -> tenemos que identificar el tipo de ejercicio muchas veces, deberia ser su propia funcion

wordChoice = async (page) => {
  try {
    let res00 = "select[name='res[0][0]']";

    await page.waitFor(res00)

    const selects = await page.evaluate(() => Array.from(document.querySelectorAll(`select.blank-input`), element => element.name));
    const stringArr = await page.evaluate(() => document.querySelector("input#correctAnswers").value);
    const answers = formatArr(stringArr);

    for (let i = 0; i < answers.length; i++) {
      console.log(selects[i], answers[i])
      await page.type("select[name='" + selects[i] + "']", answers[i]);
    }

    await page.evaluate(() => {
      document.querySelector(".btn-correction").click();
      document.querySelector(".btn-last").click();
    })

    sleep(5000)

    await page.waitFor("body");

    await sectionIdentifier(page);
  } catch (err) {
    console.error(err)
  }

  return
}

vocabularyPresentation = async (page) => {
  try {
    await page.evaluate(() => {
      document.querySelector(".btn-last").click();
    })

    sleep(5000)

    await page.waitFor("body");

    await sectionIdentifier(page);
  } catch (err) {
    console.error(err)
  }

  return
}

speakingRolePlay = async (page) => {
  try {
    await page.evaluate(() => {
      document.querySelector(".btn-last").click();
    })

    sleep(5000)

    await page.waitFor("body");

    await sectionIdentifier(page);
  } catch (err) {
    console.error(err)
  }

  return
}

fillInBlankText = async (page) => {
  try {
    await page.waitFor(".exercice-content")

    await page.evaluate(async () => {
      const draggables = document.querySelectorAll(".ui-draggable");
      const snaptargets = document.querySelectorAll(".snaptarget");

      draggables.forEach((e1) => snaptargets.forEach((e2) => {
        if (e1.textContent.includes(e2.getAttribute("correct"))) {
          // aqui hay que hacer la logica para drag and drop
          console.log("found match")
        }
      }));
    });
/*
    sleep(5000)

    await page.waitFor("body");

    await sectionIdentifier(page);*/
  } catch (err) {
    console.error(err)
  }

  return
}

vocabPresentation_ = async () => {
  console.log("Hello, vocab presentation")
}

vocabPresentation_ = async () => {
  console.log("Hello, vocab presentation")
}

vocabPresentation_ = async () => {
  console.log("Hello, vocab presentation")
}

vocabPresentation_ = async () => {
  console.log("Hello, vocab presentation")
}

vocabPresentation_ = async () => {
  console.log("Hello, vocab presentation")
}

vocabPresentation_ = async () => {
  console.log("Hello, vocab presentation")
}

async function dragAndDrop(source, target) {
  await page.evaluate((source, target) => {
    source = document.querySelector('#'+source);

    event = document.createEvent("CustomEvent");
    event.initCustomEvent("mousedown", true, true, null);
    event.clientX = source.getBoundingClientRect().top;
    event.clientY = source.getBoundingClientRect().left;
    source.dispatchEvent(event);

    event = document.createEvent("CustomEvent");
    event.initCustomEvent("dragstart", true, true, null);
    event.clientX = source.getBoundingClientRect().top;
    event.clientY = source.getBoundingClientRect().left;
    source.dispatchEvent(event);

    event = document.createEvent("CustomEvent");
    event.initCustomEvent("drag", true, true, null);
    event.clientX = source.getBoundingClientRect().top;
    event.clientY = source.getBoundingClientRect().left;
    source.dispatchEvent(event);


    target = document.querySelector('#'+target);

    event = document.createEvent("CustomEvent");
    event.initCustomEvent("dragover", true, true, null);
    event.clientX = target.getBoundingClientRect().top;
    event.clientY = target.getBoundingClientRect().left;
    target.dispatchEvent(event);

    event = document.createEvent("CustomEvent");
    event.initCustomEvent("drop", true, true, null);
    event.clientX = target.getBoundingClientRect().top;
    event.clientY = target.getBoundingClientRect().left;
    target.dispatchEvent(event);

    event = document.createEvent("CustomEvent");
    event.initCustomEvent("dragend", true, true, null);
    event.clientX = target.getBoundingClientRect().top;
    event.clientY = target.getBoundingClientRect().left;
    target.dispatchEvent(event);
  }, source, target);
}

init();
