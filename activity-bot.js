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

    return 
  } catch (error) {
    return error
  }
}