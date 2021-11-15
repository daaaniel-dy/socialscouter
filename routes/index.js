var express = require('express');
var router = express.Router();
var url = require('url');
var util = require('util');
const maria = require('../database/maria')

/* GET home page. */
router.get('/', function (req, res, next) {
  // react_rate 내림차순으로 정렬 query
  var sql = `SELECT influencer_id, url, image_src FROM influencer_data ORDER BY react_rate DESC`;

  maria.query(sql, function (err, results, fields) { // DB에 query 전송
    console.log("influencer id / url : " + util.inspect(results));
    if (!err) {
      res.render('index', {
        title: 'Social Scouter', // page title
        // react_rate에 따른 top 10 influencer_id
        rank1: results[0],
        rank2: results[1],
        rank3: results[2],
        rank4: results[3],
        rank5: results[4],
        rank6: results[5],
        rank7: results[6],
        rank8: results[7],
        rank9: results[8],
        rank10: results[9]
      });
    } else { // error
      console.log("err : " + err);
      res.send(err);
    }
  });
});

// influencer 정보 표출 dashboard
router.get('/dashboard', function (req, res, next) {
  var id = url.parse(req.url, true).query.influencer_id; // 입력 influencer id
  console.log("search : " + id);

  var select_sql = `SELECT * FROM influencer_data WHERE influencer_id LIKE ?`; // 전달받은 influencer id의 모든 정보 query

  maria.query(select_sql, [id], function (err, results, fields) { // DB에 query 전송
    if (!err) {
      var influencerData = results;
      console.log("data : " + util.inspect(influencerData[0]));
      console.log(typeof (util.inspect(influencerData[0])));

      // 없는 ID를 검색했을 때
      if (typeof (influencerData[0]) === 'undefined') {        
        res.redirect("/nodata")
      }

      var cnt_sql = `SELECT COUNT(*) AS cnt FROM influencer_data;`; // 전체 인플루언서 수 query
      var rank_sql =
        `SELECT rank
        FROM(SELECT *, RANK() OVER (ORDER BY react_rate ASC) AS rank FROM influencer_data) AS t 
        WHERE t.influencer_id = ?;`; // react_rate의 내림차순 rank query
      var avg_sql = `SELECT avg(follower), avg(react_rate) FROM influencer_data;`; // average data query

      maria.query(cnt_sql + rank_sql + avg_sql, [id], function (err, results, fields) { // DB에 쿼리 전송
        var influencerCnt = results[0]; // 전체 인플루언서 수
        var influencerRank = results[1]; // react_rate의 내림차순 rank
        var dataAvg = results[2];
        console.log("total influencer count : " + influencerCnt[0].cnt);
        console.log("influencer rank(Backward) : " + influencerRank[0].rank);
        console.log("average data : " + util.inspect(dataAvg))

        // 내림차순 rank를 구해서 하위로부터 몇 퍼센트인지 구한 뒤 quality score(가명)라는 점수로 표현
        var qualityScore = (Number(influencerRank[0].rank) / Number(influencerCnt[0].cnt)) * 100;
        console.log("quality Score : " + qualityScore.toFixed(2));

        res.render('dashboard', {
          title: 'Dashboard - ' + id, // Dashboard - (influencer id)
          data: influencerData[0], // influencer data
          qualityScore: qualityScore.toFixed(2) // quality score
        });
      });
    }
    else { // error
      console.log(err);
      res.send(err);
    }
  });
});

// 잘못된 ID 입력으로 인해 return된 데이터가 없을 경우
router.get('/nodata', function(req, res, next){
  res.send(
    `<script>
      alert("Sorry, we can't find ID. Please check again.");
      window.location = document.referrer; // 직전페이지로 이동
    </script>`
  )
});

module.exports = router;
