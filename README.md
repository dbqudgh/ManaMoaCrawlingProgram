# dbqudgh
프로글램 기능 설명
1. 검색 창에 원하는 만화 검색하면 윗쪽에 만화 리스트 들 출력됨 그거 클릭하면 바로 url 값에 그 만화 전체 페이지 값이 넣어짐
2. url 넣고 경로 지정해주면..(파일선택이라고 되어있는데 경로 입니다) 자동으로 그 폴더에서 만화가 저장이될거임
3. 진행하면서 버튼아렛쪽에 어떤만화 다운로드 중인지 출력됨ㅇㅇ
4. 다운로드 실패하면 몇화 실패했는지 윗쪽리스트에 정리해둠






electron 으로 만화 사이트 크롤링해서 다운받는 프로그램을 만들고싶었다. electron 으로 개발한 이유는 puppeteer 라이브러리를 사용하고 node js 
코드를 넣을수있고 html css 만 알아도 만들수있으니.. 아무튼 처음 electron으로 개발한 프로그램이니 오류가 조금 있을ㄹ수 있다
테스트 해봤을땐 오류는 없었는데 아마도 쓰다보면 몇개정도는 있겠지

그리고 크롤러 프로그램이다보니 그 사이트가 한번 바뀌면 안될지도 모른다. 그걸 다 해결했다고는 생각하는데 안될수도있고..뭐 아무튼 
코드는 생각나는대로 업데이트할거고 조금더 업그레이드 를 해줄거다

그리고 크롬이 이 경로로 깔ㄹ려있지 않으면 안될지도 모른답 윈도우 --
C : \ Program Files (x86) \ Google \ Chrome \ Application \ chrome.exe


mac사용자 --
/ Applications / Google Chrome.app/Contents/MacOS/Google Chrome

아무튼간 써볼사람써보고..... 내가 필요해서 만든건데 아무튼 공유하겠다

window 사용자 다운로드:
https://drive.google.com/open?id=1ORAJj6nw64oa81k5GmqpYGGu2Xtd396f






좀이따가 
만화를 부분부분 다운받을수 있도록 만들어야겠음 다운로드 버튼 클릭하기 전에 총홧수 리스트 도큐먼트 명령어로 출력해줘서
다운로드 받을 화 선택할수도있고 또한 전부다 다운받을수있고. 그리고 로컬스토지에 다운로드 받았던 만화 다운로드 실패했던 만화홧수 저장해줘 실패한만화클릭하면 바로 다운로드 받을수있도록


2020-04-02 일부분 기능 추가 완료




(난 왤캐 코딩을 못할까;;)
