//#region Imports
// Library ----------------------------------------------------------------------------------
import { Logger } from './lib/logger';
import { FilePaths } from './lib/file-paths.js';
import { PuppeteerWrapper } from './lib/puppeteer-wrapper';
import { fail } from 'assert';
import { link } from 'fs';
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
const button3 = document.querySelector('.selectDownButton');
const mainDiv = document.querySelector('.login');
const selectListDiv = document.querySelector('.selectListDiv');
const selectListForm = document.querySelector('.selectList');
const button4 = document.querySelector('.allSelect');
const button5 = document.querySelector('.Sdown');
const button6 = document.querySelector('.esc');


const baseStatus = `..로드중.. 프로그램을 종료하지마세요!`
const serachingStatus = `..검색중.. 프로그램을 종료하지마세요!`
const serchBaseUrl = "https://manamoa32.net/bbs/search.php?url=https%3A%2F%2Fmanamoa32.net%2Fbbs%2Fsearch.php&sfl=0&stx=";


//button Listener------------------------------------------------------------------------
button.addEventListener('click',(event)=>{
    
    event.preventDefault();

    if(url.value !== "" && path.value !== ""){
        initMain(url.value,path.files[0].path)
        url.value = "";
    }else {
        alert('파일경로및url를 입력해주세요');
    }

})
//검색버튼
button2.addEventListener('click',(event)=>{
    status(serachingStatus)
    event.preventDefault();

    deleteAll();
    deletFaild();
    
    if(serch.value !== ""){
        initSerch(serchBaseUrl+serch.value)
        console.log(serchBaseUrl+serch.value)
        serch.value = "";
    }else if(serch.value.length < 2){
        alert('두글자이상입력해주세요')
        serch.value = "";
    }else alert('값이없습니다')

})
//선택다운로드버튼
button3.addEventListener('click',(event)=>{
    
    event.preventDefault();
    
    deleteAll();
    deletFaild();
    
    if(url.value !== "" && path.value !== ""){
        status(serachingStatus);
        initSelect(url.value,path.files[0].path)

    }else alert('url값 , 경로를 넣어주세요')
})


//전부선택버튼
button4.addEventListener('click',(event)=>{
    
    event.preventDefault();

    const boxs = document.querySelectorAll('.c');

    for(let i = 0; i < boxs.length; i++){

        if(boxs[i].checked === true){
            boxs[i].checked = false;
        }else boxs[i].checked = true;
        
    }

})

//체크박스에서 다운로드버튼
button5.addEventListener('click',(e)=>{
    
    e.preventDefault();

    selectListForm.classList.add('block');
    mainDiv.classList.remove('block');

    const boxs = document.querySelectorAll('.c');
    const title = document.querySelector('.title');

    let linkList = [];


    for(let i = 0; i < boxs.length; i++){

        if(boxs[i].checked == true){

            linkList.push(boxs[i].value);

        }
    }

    if(linkList.length !== 0){
        initSelectAndDown(linkList,path.files[0].path,title.textContent);

        while(selectListDiv.hasChildNodes()){

            selectListDiv.removeChild(selectListDiv.firstChild);

        }

    }else{alert('..다운받을 만화가 없습니다..')}


})
//체크박스 다운로드 취소 버튼
button6.addEventListener('click',(e)=>{
    
    e.preventDefault();
    status('');


    selectListForm.classList.add('block');
    mainDiv.classList.remove('block');

    while(selectListDiv.hasChildNodes()){
        divList.removeChild(divList.firstChild);
    }

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
    /* main code
    ... 
    const page =  await _puppeteerWrapper.newPage();
    await page.goto('https:/www.google.com');
    ...
    */
    deleteAll();
    deletFaild();
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
    

    const currentTitle = await page.evaluate(() => {
        return document.title
    })
    const maintitle = currentTitle;
    console.log(maintitle)

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

//검색해서 디브에 업데이트 해주는 함수 serchandDown function------------------------------------
async function serchAndDown(URL){

    status(serachingStatus)
    
    deleteAll();
    deletFaild();

    const page =  await  _puppeteerWrapper.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.122 Safari/537.36')
    await page.goto(URL,{waitUntil:"networkidle2"});
    await delay(1000);

    const currentTitle = await page.evaluate(() => {
        return document.title
    })
    
    const maintitle = currentTitle;
    console.log(maintitle)

    if(maintitle === "Just a moment..."){
        await delay(8000);
    }else if(maintitle !== "마나모아"){
        alert(' 잘못된링크입니다. ');
        return;
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
//selecterDownload function ------------------------------------------------------------------

async function selecterDown(baseUrl){
    
    status(serachingStatus);

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
    page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.122 Safari/537.36')
    await page.goto(baseUrl,{waitUntil:"networkidle2"});
    await delay(1000)


    const currentTitle = await page.evaluate(() => {
        return document.title
    })
    const maintitle = currentTitle;

    if(maintitle === "Just a moment..."){
        await delay(8000);
    }else if(maintitle !== "마나모아"){

        alert(' 잘못된링크입니다. ');
        return;

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
    selectList(title,linkList,titleList);
}


function selectList(title,linkList,titleList){


    const titleDiv =  document.createElement('div');
    titleDiv.classList = 'title';
    titleDiv.textContent = `${title}`;
    titleDiv.style = "color:white;"

    selectListDiv.appendChild(titleDiv);

    selectListForm.classList.remove('block');
    mainDiv.classList.add('block');

    const ul = document.createElement('ul');
    selectListDiv.appendChild(ul);



    for(let i = 0; i < linkList.length; i++){
    

        const li = document.createElement('li');
        const label = document.createElement('label');
        const checkBox = document.createElement('input');
        
        checkBox.value = linkList[i];
        li.textContent = titleList[i];

        checkBox.type = "checkbox";
        checkBox.classList = `c`;

        checkBox.style = "width:15px;height:15px;"
        li.style = "color:white;"

        li.appendChild(checkBox);
        label.appendChild(li);

        ul.appendChild(label);

    }
}

//selectAndDown---------------------------------------------------------------------------
async function selectAndDown(linkList,PATH,title){



    deleteAll();
    deletFaild();

    await status(baseStatus)

    const page =  await _puppeteerWrapper.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.122 Safari/537.36');


    const savedir = PATH+`/${filenamify(title)}`
    
    let totallmana = 0;

    if(!fs.existsSync(savedir)){
            fs.mkdirSync(savedir)
    }

    for(let i = totallmana; i < linkList.length; i++){

        await page.goto(linkList[i],{waitUntil: "networkidle2"})

        const currentTitle = await page.evaluate(() => {
            return document.title
        })
        const maintitle = currentTitle;

        console.log(maintitle)

        if(maintitle === "Just a moment..."){
            await delay(8000);
        }
        
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

//initSelect---------------------------------------------------------------------
async function initSelect(baseUrl,PATH){
    try {
        const chromeSet = await _puppeteerWrapper.setup();
        if (!chromeSet) {
            return;
        }
        await selecterDown(baseUrl,PATH);
    } catch(e) {
        _logger.logError('Thrown error:');
        _logger.logError(e);
    } finally {
        await _puppeteerWrapper.cleanup();
    }

    _logger.logInfo('Done. Close window to exit');

    await _logger.exportLogs(_filePaths.logsPath());

}

//initSelectAndDown

async function initSelectAndDown(baseUrlList,PATH,title){
    try {
        const chromeSet = await _puppeteerWrapper.setup();
        if (!chromeSet) {
            return;
        }
        await selectAndDown(baseUrlList,PATH,title);
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