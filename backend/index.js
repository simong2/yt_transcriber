// selenium
const { Builder, Browser, By, Key, until, error, Options } = require('selenium-webdriver')

// express
const express = require('express')

const app = express()
const port = 3000

app.use(express.json())

// dot env ... api key
const dotenv = require("dotenv");
dotenv.config() // load env variables

// open ai 
const OpenAI = require("openai");
const openai = new OpenAI({
    apiKey: process.env.OPEN_AI_API_KEY,
})

// fs
const fs = require('fs');
const directoryPath = process.env.DOWNLOAD_PATH;



app.get('/', (req, res) => {
    res.send('hello world')
})

app.post('/search', async (req,res) => {
    const { query } = req.body
    if (!query) {
        return res.status(400).json({error : "empty body"})
    }
    
    console.log(query)
    url = await searchOnYoutube(query);
    console.log(url)
    
    // there will be a ? from the get request
    x = url.split('?')[0]
    if (x.slice(x.length - 5) != "watch") {
        return res.status(400).json({error : "failed to retrive correct video url"})
    }
   
    await pasteOnY2Mate(url)
    
    txt = await downloadAndWhisper()
    if (txt == "") {
        return res.status(400).json({error : "download of video failed to read or be found"})
    }
    console.log(`FILE: ${txt}`)
    res.status(200).json({"res": txt})
    
})

app.listen(port, () => {
    console.log(`running on port ${port}`)
})


searchOnYoutube = async(songName) => {
    let driver = await new Builder().forBrowser(Browser.FIREFOX).build()
    try {
        await driver.get('https://www.youtube.com/')
        
        // wait up to 5 seconds
        let searchBox = await driver.wait(until.elementLocated(By.name('search_query')), 5000)

        await searchBox.sendKeys(songName, Key.RETURN)


        await driver.wait(until.elementLocated(By.id('video-title')), 15000)
        let firstResult = await driver.findElement(By.id('video-title'))

        await firstResult.click()

        url = await driver.getCurrentUrl()
      
        return url
      } catch (e) {
        console.error(e)
      } finally {
        await driver.quit()
      }
}


pasteOnY2Mate = async(url) => {
    let driver = await new Builder().forBrowser(Browser.FIREFOX).build()
    try {
        await driver.get("https://y2mate.nu/en-6yjH/")
        let linkArea = await driver.findElement(By.id("video"))
        await linkArea.sendKeys(url)

        // click to convert button
        await driver.findElement(By.xpath("/html/body/form/div[2]/button[2]")).click()


        // wait for it to get to download screen...
        await driver.wait(until.elementLocated(By.xpath("/html/body/form/div[2]/button[1]")), 30000) // 30 second wait
        let downloadButton = await driver.findElement(By.xpath("/html/body/form/div[2]/button[1]"))
        await downloadButton.click()


    } catch (e) {
        console.error(e)
    } finally {
        await driver.quit()
    }
}

downloadAndWhisper = async() => {
    fname = getMp3File()
    if (fname == "") {
        return ""
    }
    console.log(`${directoryPath}/${fname}`)
    try {
        const transcription = await openai.audio.transcriptions.create({
            file: fs.createReadStream(`${directoryPath}/${fname}`),
            model: "whisper-1",
          })

        return transcription.text
    } catch (e) {
        console.error(e)
        return ""
    }
    
}


const getMp3File = () => {
    files = fs.readdirSync(directoryPath)
    for (file of files) {
        if (file.split('.').pop() == "mp3") {
            return file
        }
    }

    return ""
}
