const maria = require('mysql');

// DB 접속에 필요한 정보
const conn = maria.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'puren',
    password: '960305',
    database: 'socialscouter',
    multipleStatements : true // 다중쿼리 허용
});

// DB 접속 성공 여부
conn.connect(function (err) {
    if (!err) { // DB 접속 성공
        console.log("Database is connected ... \n\n");
    } else {    // DB 접속 실패
        console.log("Error connecting database ... \n\n");
    }
});

module.exports = conn;