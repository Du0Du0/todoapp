const express = require('express');
const app = express();
//body-parser은 요청 데이터(body)해석을 쉽게 도와줌
const bodyParser = require('body-parser');
// 주소 형식으로 데이터를 보내는 방식. form 전송은 URL-encoded 방식을 주로 사용
// extended 옵션은 false면 노드의 querystring 모듈을 사용해 쿼리스트링을 해석, true면 qs 모듈을 사용해 쿼리스트링을 해석 
// qs는 내장모듈이 아닌 npm 패키지이고, querystring 기능을 더 확장한 모듈
app.use(bodyParser.urlencoded({extended : true}));
const MongoClient = require('mongodb').MongoClient;
//EJS관련 등록코드 -> node.js가 인식을 잘해줌
app.set('view engine','ejs');

//전역변수 지정
let db;
//database 접속이 완료되면, 내부코드 실행해줌
MongoClient.connect('mongodb+srv://wearetheone:1234@cluster0.eq2jygj.mongodb.net/?retryWrites=true&w=majority', { useUnifiedTopology: true }, function (에러, client) {
if (에러) return console.log(에러);
db = client.db('todoapp');

//.listen(서버띄울 포트번호, 띄운 후 실행할 코드) 
// app.listen(3000, 함수) 3000포트를 기반으로 함수 실행, 대기 중인 상태로 머물러있음
// localhost:3000은 127.0.0.1:3000과 같음
app.listen(8000, function () {
    console.log('listening on 8000')
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


app.post('/add', function(요청, 응답){ 
    응답.send('전송완료');
    db.collection('counter').findOne({name:'게시물갯수'}, function(에러, 결과){
        console.log(결과.totalPost);
        var 총게시물갯수 = 결과.totalPost;
        
        db.collection('post').insertOne({ _id : 총게시물갯수 + 1, 제목 : 요청.body.title, 날짜 : 요청.body.date }, function(에러, 결과) {
            console.log('저장완료');
            db.collection('counter').updateOne({name:'게시물갯수'},{ $inc: {totalPost:1} },function(에러, 결과){
                if(에러){return console.log(에러)}
            })
        })
    });
});


// list 로 접속(GET)요청으로 접속하면
// 실제 DB에 저장된 데이터들로 예쁘게 꾸며진 HTML을 보여줌
app.get('/list', function(요청,응답) {
    // 디비에 저장된 post라는 collection안의 제목인 뭐인 모든 데이터를 꺼내주세요
    // DB안 collection안의 post파일안에서 찾아라. 
    db.collection('post').find().toArray(function(에러,결과) {
        console.log(결과);
        응답.render('list.ejs', {posts : 결과} );
    });
   
});