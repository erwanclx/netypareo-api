const express = require('express')
const cors = require("cors");
const app = express()

// Scrapping lib

const puppeteer = require('puppeteer')

// app.get('/connect:login?:password?',cors(), async (req,res) => {
    
// })

// Récupère les 5 dernières notes - page d'accueil

app.get('/last_notes:login?:password?',cors(), async (req,res) => {
    const {login, password} = req.query;
    async function scrape() {
        const browser = await puppeteer.launch({})
        const page = await browser.newPage()
        await page.goto('https://formations.cci-paris-idf.fr/IntNum/index.php')
        await page.click('#login');
        await page.keyboard.type(login);
        await page.click('#password');
        await page.keyboard.type(password);
        await page.click('#btnSeConnecter');
        await page.waitForNavigation();
        // await page.screenshot({path: 'screenshot.png'});
        let text = await page.evaluate(() => Array.from(document.querySelectorAll(".evaluation"), element => element.innerText));
        let last_notes = []
        for (let index = 0; index < 5; index++) {
            let object = text[index].split('\n')
            let date_extract = object[1].match(/\d{2}([\/.-])\d{2}\1\d{4}/g).pop();
            let moyenne_extract = object[3].match(/(\d|,)+/g).pop()
            let last_notes_items = {
                matiere: object[0],
                date:date_extract,
                note:object[2],
                moyenne:moyenne_extract
            }
            console.log(last_notes_items);
            last_notes.push(last_notes_items)
        }
        res.send(last_notes)
        browser.close()
    }
    scrape().catch(res.send)
})

// Récupère les absences - page d'accueil

app.get('/last_absences:login?:password?',cors(), async (req,res) => {
    const {login, password} = req.query;
    async function scrape() {
        const browser = await puppeteer.launch({})
        const page = await browser.newPage()
        await page.goto('https://formations.cci-paris-idf.fr/IntNum/index.php')
        await page.click('#login');
        await page.keyboard.type(login);
        await page.click('#password');
        await page.keyboard.type(password);
        await page.click('#btnSeConnecter');
        await page.waitForNavigation();
        // await page.screenshot({path: 'screenshot.png'});
        let text = await page.evaluate(() => Array.from(document.querySelectorAll(".no-margin>li"), element => element.innerText));
        let last_absences = []
        text.forEach(element => {
            let object = element.split('\n')
            let last_absences_items = {
                type: object[0],
                date:object[1]
            }
            console.log(last_absences_items);
            last_absences.push(last_absences_items)
        });
        console.log(last_absences)
        res.send(last_absences)
    }
    scrape().catch(res.send)
})



app.listen(8080, () => {
    console.log(`API on 8080`)
})