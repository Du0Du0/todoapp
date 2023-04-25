const express = require('express');
const app = express();
//body-parser은 요청 데이터(body)해석을 쉽게 도와줌
const bodyParser = require('body-parser');
// 주소 형식으로 데이터를 보내는 방식. form 전송은 URL-encoded 방식을 주로 사용
// extended 옵션은 false면 노드의 querystring 모듈을 사용해 쿼리스트링을 해석, true면 qs 모듈을 사용해 쿼리스트링을 해석 
// qs는 내장모듈이 아닌 npm 패키지이고, querystring 기능을 더 확장한 모듈
app.use(bodyParser.urlencoded({extended : true}));
const MongoClient = require('mongodb').MongoClient;

//전역변수 지정
let db;
//database 접속이 완료되면, 내부코드 실행해줌
MongoClient.connect('mongodb+srv://wearetheone:1234@cluster0.eq2jygj.mongodb.net/?retryWrites=true&w=majority', { useUnifiedTopology: true }, function (에러, client) {
if (에러) return console.log(에러);
db = client.db('todoapp');

//.listen(서버띄울 포트번호, 띄운 후 실행할 코드) 
// app.listen(3000, 함수) 3000포트를 기반으로 함수 실행, 대기 중인 상태로 머물러있음
// localhost:3000은 127.0.0.1:3000과 같음
app.listen(8080, function () {
    console.log('listening on 8080')
    });
});

//app.get('/', 함수) 
//누군가가 /beauty으로 들어오면 ~해주세요
app.get('/beauty',function(요청,응답){
    응답.send('뷰티용품 쇼핑할 수 있는 페이지입니다.');
});

app.get('/pet',function(요청,응답){
    응답.send('펫용품 쇼핑할 수 있는 페이지입니다.');
});

app.get('/',function(요청,응답){
    응답.sendFile(__dirname + '/index.html');
});

// 함수 안에 함수(function(){})=콜백함수
// 순차적으로 실행하고 싶을 때
// .get(경로.function(요청내용,응답할 방법){})
// 응답할 방법: 응답.send 또는 응답.sendFile
// ES6 신문법: .get(경로,(요청내용,응답할 방법)=>{})
app.get('/write', function(요청, 응답) { 
    응답.sendFile(__dirname +'/write.html')
});

app.post('/add', function(요청,응답){
    응답.send('전송완료');

db.collection('post').insertOne( {제목 : 요청.body.title , 날짜 : 요청.body.date} , function(){
    console.log('저장완료');
});
});

// body-parser 미들웨어가 만드는 요청의 본문을 해석한 객체
// 클라이언트에서 보낸 것들이 객체로 들어있다. input태그의 name 속성값이 이 객체의 키가 됨
app.post('/add', function(요청, 응답){
    응답.send('전송완료');
    // 데이터 저장하는 법
    // 1. db.collection('post'). = post라는 db컬렉션을 선택  
    // 2. .insertOne () = post라는 collection에 데이터 하나를 저장해주세요. () = 저장할 데이터, {} = 그 다음 실행 할 함수
    db.collection('post').insertOne( { 제목 : 요청.body.title, 날짜 : 요청.body.date } , function(){
    console.log('저장완료')
    });
});

// list 로 접속(GET)요청으로 접속하면
// 실제 DB에 저장되 데이터들로 예쁘게 꾸며진 HTML을 보여줌
