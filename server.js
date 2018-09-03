/*웹서버의 종류는 상당히 많으나, 우리가 사용하고자 하는 웹서버는
자바스크립트로 운영되는 node.js 기술을 이용한 서버이다!!*/

var http=require("http"); //기본적인 기능을 갖춘 서버를 구축할수있게 해주는모듈
var express=require("express");//외부(처음부터 설치X) 모듈!!
var mysql=require("mysql"); //mysql 제어 드라이버 외부 모듈!!

var app=express(); //express 객체 생성
var server=http.createServer(app);//서버 객체 생성

//현재로서는 너무 기본적인 서버이므로, 할수있는 일이 별로 없다..
//업그레이드 하자!! 이미 외부 모듈로 지원됨...
//express 모듈을 가장 많이 사용한다!!

//이미지, html ,css 등 프로그램과 상관없는 단순한 자원을 가리켜 정적자원
//이라 하며, 이러한 자원들의 위치를 서버에 지정해놓으면, 클라이언트인
//브라우저는 자원의 이름만 알면 서버로 부터 자원을 다운로드해갈수있다
//그리고 이러한 기능을 express 모듈이 가지고 있다...
//__dirname 이라는 전역변수는 현재 실행중인 js 파일의 하드경로를
//보유하고 있다..
app.use(express.static(__dirname));

//클라이언트인 브라우저가 mysql에  insert 시켜달라는
//요청을 할 것이고, 그 요청을 여기서 처리하겠다!!!
app.use("/regist", function(request, response){
	console.log("클라이언트의 요청 발견!!");
	
	//클라이언트가 보낸 데이터인 파라미터들을 받아보자!!
	console.log("클라이언트가 보낸 파라미터는",request.query);

	//json으로 날아온 데이터들을 분리시켜 저장한다!!
	var name=request.query.name;
	var age=request.query.age;
	var msg=request.query.msg;
	console.log("분리시킨 결과 ",name, age, msg);
	
	//데이터베이스에 넣자!! ( oracel, mysql, mssql , mongodb...)
	//mysql 접속하기!!
	var con=mysql.createConnection({
		host:"localhost",  /*node mysql이 같은 pc..*/
		user:"root",
		password:"",
		database:"front2"
	}); //접속!!!
	
	//쿼리 수행!!!	
	var sql="insert into member(name, age, msg) values(?,?,?)";
	con.query(sql,[name, age, msg],function(error, result){
		if(error){
			console.log("등록실패", error);
			response.writeHead(500, {"Content-Type":"text/html"});
			response.end("fail"); //클라이언트에 보낼 문자열 대입!!
		}else{
			console.log("등록성공");
			//클라이언트의 요청에 응답을 하지 않으면 클라이언트는 계속 무한대기에
			//빠지게 된다....
			response.writeHead(200, {"Content-Type":"text/html"});
			response.end("ok"); //클라이언트에 보낼 문자열 대입!!
		}
	});

	
});


server.listen(7777, function(){ //서버 가동!!
	console.log("웹서버가 7777포트에서 가동중...");
});