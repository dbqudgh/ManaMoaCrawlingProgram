//#region Imports
// Library ----------------------------------------------------------------------------------
import { Logger } from './lib/logger';
import { FilePaths } from './lib/file-paths.js';
import { PuppeteerWrapper } from './lib/puppeteer-wrapper';
import { fail } from 'assert';
//require-------------------------------------------------------------------------------------

const fs = require('fs');
const filenamify = require('filenamify');
const request = require('request');

//document--------------------------------------------------------------------------------
const url = document.querySelector('.url');
const path = document.querySelector('.path');
const button = document.querySelector('.button');
const currentDiv = document.querySelector('.currentStatus');
const divList = document.querySelector('.list');
const serch = document.querySelector('.serch');
const button2 = document.querySelector('.serchButton');
const divFaild = document.querySelector('.faild');


const baseStatus = `..로드중.. 프로그램을 종료하지마세요!`
const serachingStatus = `..검색중.. 프로그램을 종료하지마세요!`
const serchBaseUrl = "https://manamoa32.net/bbs/search.php?url=https%3A%2F%2Fmanamoa32.net%2Fbbs%2Fsearch.php&sfl=0&stx=";



//button Listener------------------------------------------------------------------------
button.addEventListener('click',(event)=>{
    
    event.preventDefault();

    if(url.value !== "" && path.value !==""){
        initMain(url.value,path.files[0].path)
        url.value = "";
    }else {
        alert('파일경로및url를 입력해주세요');
    }

})
button2.addEventListener('click',(event)=>{
    status(serachingStatus)
    event.preventDefault();

    deleteAll();
    deletFaild();
    
    if(serch.value !== ""){
        initSerch(serchBaseUrl+serch.value)
        serch.value = "";
    }else if(serch.value.length < 2){
        alert('두글자이상입력해주세요')
        serch.value = "";
    }else alert('값이없습니다')

})
//download function ------------------------------------------------------------------------
//설치경로,url,몇화ㅏ,몇번째이미지,에러 카운트
const down = (path, url,title,h,href,retry)=>{
    request({url: url, headers:{'referer': href}
    ,encoding: null},(error,Response,body)=>{
        // console.log('body',body)
//에러 5번 반복
        if(error && --retry>= 0){
            console.log('retry!:'+title+h)
            down(path, url,title,h,href,retry)
        }
//설치경로 , 이름 확장자 받고 다운로드
        fs.writeFile(path + '\\' + title + String(h)+'.jpg',body,null,(err)=>{
            if (err) throw err;//에러출력
            console.log(title + String(h+1))
        })
    })
}
//currentDiv status() function--------------------------------------------------------------------
function status(textContent){
    currentDiv.textContent = `${textContent}`
}

//deletAll divList child all function---------------------------------------------
function deleteAll(){
    while(divList.hasChildNodes()){
        divList.removeChild(divList.firstChild);
    }
}

function deletFaild(){
    while(divFaild.hasChildNodes()){
        divFaild.removeChild(divFaild.firstChild);
    }
}

//faild div and upandchild faildList

function faildDiv(text){

    if(!divFaild.hasChildNodes()){
        const firstDiv = document.createElement('div')
        firstDiv.textContent = '다운로드 실패한 만화 목록'
        firstDiv.style="color:white"
        divFaild.appendChild(firstDiv)
    }
    
    const createDiv = document.createElement('div');
    createDiv.textContent = text;
    createDiv.style="color:white"

    divFaild.appendChild(createDiv)

}


//create div and upandchild serach title,Href
function divListinnerHtml(listTitle,listHref){
    status(``);
    const firstDiv = document.createElement('div')
    firstDiv.style="color:white"
    firstDiv.textContent = '다운받을 만화 클릭'
    divList.appendChild(firstDiv)

    for(let i = 0; i < listTitle.length; i++){
       
       const div = document.createElement('div')
       
       div.textContent = listTitle[i]
       
       div.style = "color:white"

       divList.appendChild(div)

        div.addEventListener('click',(e)=>{
            
            e.preventDefault();

            url.value = listHref[i]
                deleteAll();
                deletFaild();
        })

    }
}

//#endregion

//#region Setup - Dependency Injection-----------------------------------------------
const _logger = new Logger();
const _filePaths = new FilePaths(_logger, "puppeteer-electron-quickstart");
const _puppeteerWrapper = new PuppeteerWrapper(_logger, _filePaths,
    { headless: true, width:1000, height: 1000 });


//delay function
    function delay(timeout){
    return new Promise((resolve)=>{
        setTimeout(resolve,timeout);
    });
}
//#endregion

//#region Main ----------------------------------------------------------------------


//main function -----------------------------------------------------------------------
async function main(baseUrl,PATH) {
    deleteAll();
    deletFaild();
    /* main code
    ... 
    const page =  await _puppeteerWrapper.newPage();
    await page.goto('https:/www.google.com');
    ...
    */
   await status(baseStatus)
    async function autoScroll(page){
    await page.evaluate(async () => {
        await new Promise((resolve, reject) => {
            var totalHeight = 0;
            var distance = 100;
            var timer = setInterval(() => {
                var scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;

                if(totalHeight >= scrollHeight){
                    clearInterval(timer);
                    resolve();
                }
            }, 100);
        });
    });
}


    const page =  await _puppeteerWrapper.newPage();
    page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.122 Safari/537.36')
    await page.goto(baseUrl,{waitUntil:"networkidle2"});
    

    const maintitle = currentTitle();

    if(maintitle === "Just a moment..."){
        await delay(8000);
    }

    await autoScroll(page);

    
    const listData = await page.evaluate(()=>{

        const list = document.querySelectorAll('.slot > a')
        const title = document.querySelector('.red.title').innerText
        const titles = document.querySelectorAll('.chapter-list > .slot > a > .title')
        
            let listArray = [];
            let titleTexts = [];

        
            for(let i = list.length -1; i >= 0; i--){
           
                listArray.push(list[i].href);
           
                titleTexts.push(title+' '+titles[i].firstChild.textContent.trim().split(title)[1].trim())
        
            }
        
            return {
                listArray:listArray,
                titleTexts:titleTexts,
                title:title
            }

    })

    const title = listData.title; //제목
    const linkList = listData.listArray;//총링크 리스트
    const titleList = listData.titleTexts; //제목 리스트

    if(linkList.length === 0){
        status('');
        alert('URL잘못되었습니다.');
        return ;
    }

    console.log(titleList[0])

    const savedir = PATH+`/${filenamify(title)}`
    
    let totallmana = 0;


    if(!fs.existsSync(savedir)){
            fs.mkdirSync(savedir)
    }

    for(let i = totallmana; i < linkList.length; i++){
        await page.goto(linkList[i],{waitUntil: "networkidle2"})
        
        const data = await page.evaluate(()=>{

            const imgs = document.querySelectorAll('.view-content.scroll-viewer > img');
            const toonTitle = document.querySelector('.toon-title').firstChild.textContent.trim();
            let imgSrcs = [];

            for(let j = 0; j < imgs.length; j++){
                if(imgs[j].attributes[0].nodeName.length > 5){
                    imgSrcs.push(imgs[j].attributes[0].value)
                }else{
                    imgSrcs.push(imgs[j].src)
                }
            }

            if(imgs && toonTitle){
                return {
                    imgSrcs:imgSrcs,
                    toonTitle:toonTitle
                }
            }

        })

        const imgLinks = data.imgSrcs;
        const toonTitle = data.toonTitle;

        if(imgLinks.length === 0){
            faildDiv(`${titleList[i]} 다운로드 실패`);
            continue;
        }
        
        await status(`...${toonTitle} 다운로드중...`)
        await delay(1000);
        const savedirList =   PATH + `/${filenamify(title)}/${filenamify(toonTitle)}`

        if(!fs.existsSync(savedirList)){
            fs.mkdirSync(savedirList)
        }

        for(let h = 0; h < imgLinks.length; h++){
            down(PATH + `/${filenamify(title)}/${filenamify(toonTitle)}`,imgLinks[h],i+1+'E',h,linkList[i],5)
        }
    }
    await status('다운로드 완료');
    await page.close();
    await browser.close();
}
//currentTitle function ------------------------------------------------------------------------------
function currentTitle(){
    return document.title 
}


async function serchAndDown(URL){
    status(serachingStatus)
    
    deleteAll();
    deletFaild();

    async function autoScroll(page){
    await page.evaluate(async () => {
        await new Promise((resolve, reject) => {
            var totalHeight = 0;
            var distance = 100;
            var timer = setInterval(() => {
                var scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;

                if(totalHeight >= scrollHeight){
                    clearInterval(timer);
                    resolve();
                }
            }, 100);
        });
    });
}
    const page =  await _puppeteerWrapper.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.122 Safari/537.36')
    await page.goto(URL,{waitUntil:"networkidle2"});
    
    const maintitle = currentTitle();

    if(maintitle === "Just a moment..."){
        await delay(8000);
    }

    const postData = await page.evaluate(()=>{
        
        const list = document.querySelectorAll('.manga-subject > a')
        
        let listTitleArray = [];
        let listTitleHrefArray = [];

        for(let i = 0; i < list.length; i++){
            listTitleArray.push(list[i].text.trim())
            listTitleHrefArray.push(list[i].href)
        }

        return {
            listTitleArray:listTitleArray,
            listTitleHrefArray:listTitleHrefArray
        }
        
    })

    const listTitle = postData.listTitleArray;
    const listHref = postData.listTitleHrefArray;

    if(listTitle.length === 0){
        alert('검색 결과 없습니다.')
        status('');
        return;
    }

    divListinnerHtml(listTitle,listHref);
    
}





//init Main----------------------------------------------------------------------
async function initMain(baseUrl,PATH){
    try {
        const chromeSet = await _puppeteerWrapper.setup();
        if (!chromeSet) {
            return;
        }
        await main(baseUrl,PATH);
    } catch(e) {
        _logger.logError('Thrown error:');
        _logger.logError(e);
    } finally {
        await _puppeteerWrapper.cleanup();
    }

    _logger.logInfo('Done. Close window to exit');

    await _logger.exportLogs(_filePaths.logsPath());

}
//initserch-----------------------------------------------------------------------------
async function initSerch(baseUrl){
    try {
        const chromeSet = await _puppeteerWrapper.setup();
        if (!chromeSet) {
            return;
        }
        await serchAndDown(baseUrl);
    } catch(e) {
        _logger.logError('Thrown error:');
        _logger.logError(e);
    } finally {
        await _puppeteerWrapper.cleanup();
    }

    _logger.logInfo('Done. Close window to exit');

    await _logger.exportLogs(_filePaths.logsPath());

}



//#endregion