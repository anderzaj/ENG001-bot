formatArr = (arr) => {
  let _new = [[]];
  let between = false;
  let j = 0;
  let ans = [];

  for (let i = 0; i < arr.length; i++) {
    if (arr[i] == '"') {
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
      ans.push(_new[i]);
    }
  }

  return ans
}

let test = formatArr('[["Hola"], ["Chao"], ["Que tal"]]');
console.log(test);

arr1=[1, 2, 3, 4]
arr2=[2, 4, 3, 1]

arr1.forEach((e1) => arr2.forEach((e2) => {
  if (e1 == e2) {
    console.log(e1, e1)
  }
}));

/*
programFinder = async (page) => {
  await page.evaluate(() => {
    const nodes = document.querySelectorAll(".accordion-heading");

    const counter = document.querySelector(".pagination-counter").textContent.trim().split("");
    if (counter[0] == counter[4]) {
      process.exit()
    }

    for (let i = 0; i < nodes.length; i++) {
      for (let j = 0; j < nodes[i].children.length; j++) {
        if (nodes[i].children[j].className.includes("accordion-progress")) {
          if (!nodes[i].children[j].children[1].textContent.includes("100")) {
            await document.querySelector("#header" + (i + 1).toString()).children[4].children[0].click();
          }
        } 
      }
    }

    await document.querySelector("a[ng-click='nextPage()']").click();
    programFinder(page)
  });
}

vocabularyPresentation = async (page) => {
  try {
    await page.waitFor(".btn-last");

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

speakingRolePlay = async (page) => {
  try {
    await page.waitFor(".btn-retry");

    await page.evaluate(() => {
      document.querySelector(`a[name='nextBte']`).click();
    });

    sleep(5000);

    await page.waitFor("body");

    await sectionIdentifier(page);
  } catch (err) {
    console.error(err);
  }

  return;
}

ficheFonctionnelle = async (page) => {
  try {
    await page.waitFor(".btn-next");

    await page.evaluate(() => {
      document.querySelector(`a[name='nextBte']`).click();
    });

    sleep(5000);

    await page.waitFor("body");

    await sectionIdentifier(page);
  } catch (err) {
    console.error(err);
  }

  return;
}

blankSentence = async (page) => {
  try {
    await page.waitFor(".exercice-content");

    const snaptargets = await page.evaluate(async () => {
      const snaptargets = document.querySelectorAll(".snaptarget");

      let elements = [];

      for (let i = 0; i < snaptargets.length; i++) {
        let tag = snaptargets[i].getAttribute("ans");
        let bounds = snaptargets[i].children[0].getBoundingClientRect();

        let finalX = parseInt(bounds.x + (bounds.width/2));
        let finalY = parseInt(bounds.y + (bounds.height/2));

        let coords = [finalX, finalY];
        elements.push({[tag]: coords});
      }

      return elements;
    });

    for (let i = 0; i < snaptargets.length; i++) {
      const draggableCoords = await page.evaluate(async (ans) => {
        const bounds = document.querySelector(`span[ans='${ans}']`).getBoundingClientRect();
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
    });

    sleep(5000);

    await page.waitFor("body");

    await sectionIdentifier(page);
  } catch (err) {
    console.error(err);
  }
}
*/

const ternaryTest = 1 ? "true" : "false";
console.log(ternaryTest)

let boolTest = 0

if (boolTest) {
  console.log("bool true")
} else {
  console.log("bool false")
}

console.log(0 % 2)

console.log(process.argv)