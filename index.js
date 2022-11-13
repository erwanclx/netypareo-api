const express = require('express')
const cors = require("cors");
const app = express()

// Scrapping lib

const puppeteer = require('puppeteer')

// app.get('/connect:login?:password?',cors(), async (req,res) => {
    
// })

// Récupère les 5 dernières notes - page d'accueil

app.get('/overview/last_notes:login?:password?',cors(), async (req,res) => {
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

app.get('/overview/last_absences:login?:password?',cors(), async (req,res) => {
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
            last_absences.push(last_absences_items)
        });
        console.log(last_absences)
        res.send(last_absences)
    }
    scrape().catch(res.send)
})

// Récupère les contacts - page d'accueil

app.get('/overview/contacts:login?:password?',cors(), async (req,res) => {
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
        await page.screenshot({path: 'screenshot.png'});
        let personne = await page.evaluate(() => Array.from(document.querySelectorAll(".block-body.with-padding>dl>dd"), element => element.innerText));
        let role = await page.evaluate(() => Array.from(document.querySelectorAll(".block-body.with-padding>dl>dt"), element => element.innerText));
        let contacts = []
        personne.forEach((element, index) => {
            let contacts_items = {
                role: role[index],
                personne: element
            }
            contacts.push(contacts_items)
        });
        console.log(contacts)
        res.send(contacts)
    }
    scrape().catch(res.send)
})

// Récupère l'emploi du temps du jour - page d'accueil

app.get('/overview/calendrier_today:login?:password?',cors(), async (req,res) => {
    const {login, password} = req.query;
    async function scrape() {
        const browser = await puppeteer.launch({})
        const page = await browser.newPage()
        await page.setViewport({width:0, height:0});
        await page.goto('https://formations.cci-paris-idf.fr/IntNum/index.php')
        await page.click('#login');
        await page.keyboard.type(login);
        await page.click('#password');
        await page.keyboard.type(password);
        await page.click('#btnSeConnecter');
        await page.waitForNavigation({waitUntil: 'networkidle0'});
        await page.waitForSelector('#jour-suivant-button');
        await page.click('#jour-suivant-button');
        await page.waitForSelector('.fragment-loading');
        await page.waitForFunction('document.querySelector(".fragment-loading") === null')
        await page.screenshot({path: 'screenshot.png'});
        let agenda = await page.evaluate(() => Array.from(document.querySelectorAll(".planning-seance-inner.card.card-seance"), element => element.innerText));
        if (agenda.length == 0 ){
            res.send("Aucun cours aujourd'hui")
        }
        else {
            let agenda_items = []
            let start_by = await page.evaluate(() => Array.from(document.querySelectorAll(".planning-seance"), element => element.getAttribute('style')));
            let start_hour_to_percent = {
                "08:00": '0',
                "08:30": '5',
                "09:00": '10',
                "09:30": '15',
                "10:00": '20',
                "10:30": '25',
                "11:00": '30',
                "11:30": '35',
                "12:00": '40',
                "12:30": '45',
                "13:00": '50',
                "13:30": '55',
                "14:00": '60',
                "14:30": '65',
                "15:00": '70',
                "15:30": '75',
                "16:00": '80',
                "16:30": '85',
                "17:00": '90',
                "17:30": '95',
                "18:00": '100',
            }
            let duree_hour_to_percent = {
                "00:30": '5',
                "01:00": '10',
                "01:30": '15',
                "02:00": '20',
                "02:30": '25',
                "03:00": '30',
                "03:30": '35',
                "04:00": '40',
                "04:30": '45',
                "05:00": '50',
                "05:30": '55',
                "06:00": '60',
                "06:30": '65',
                "07:00": '70',
                "07:30": '75',
                "08:00": '80',
                "08:30": '85',
                "09:00": '90',
                "09:30": '95',
                "10:00": '100',
            }
            function getObjKey(start_hour_to_percent, value) {
                return Object.keys(start_hour_to_percent).find(key => start_hour_to_percent[key] === value);
            }
            // function getEndHour(start_hour, duree) {
            //     let [h, m] = start_hour.split(':');
            //     let date = new Date();
            //     date.setHours(h, m, 0)
            //     date.toString();
            //     let res = `${date.getHours()+duree}:${date.getMinutes()}`
            //     return res
            //   }
              function getEndHour(start_hour, duree) {
                let date = new Date();
                let [h, m] = start_hour.split(':');
                date.setHours(h)
                date.setMinutes(m)

                let [h2, m2] = duree.split(':');
                date.setHours(date.getHours()+parseInt(h2))
                date.setMinutes(date.getMinutes()+parseInt(m2))

                let res = `${date.getHours()}:${date.getMinutes()}`
                return res
              }
            agenda.forEach((element, index) => {
                let object = element.split('\n')
                let start_by_extract = start_by[index].match(/top: (\d+)%/)[1]
                let debut = getObjKey(start_hour_to_percent, start_by_extract)
                let heure = {
                    debut: debut,
                    // fin: getEndHour(debut, 0.5)
                    fin: getEndHour(debut, "00:30")
                }
                let agenda_items_items = {
                    // heure:getObjKey(start_hour_to_percent, start_by_extract),
                    heure: heure,
                    matiere: object[0],
                    prof: object[1],
                    salle: object[2]
                }
                agenda_items.push(agenda_items_items)
            });
            console.log(agenda_items)
            res.send(agenda_items)
        }
    }
    scrape().catch(res.send)
})

app.listen(8080, () => {
    console.log(`API on 8080`)
})