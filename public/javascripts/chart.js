let header = ()=>{
    return {
        'Content-Type' : 'application/json',
        'Accept': '*/*',
    }
}

async function sendAjax(url, json, method = 'POST', hd){ 
    var dataInfo = {
      method : method, 
      body : JSON.stringify(json),
      headers : hd ? hd : header()
    }; 
    const reqURL = await fetch(url, dataInfo); 
    try {
        const result = await reqURL.json();
        return result;
    } catch (err) {
        return reqURL;
    }
}

function test(){
    sendAjax('/insta').then((res) => {
        setTimeout(()=>{
            console.log("좋아요 수 : ", res.data.data.like)
            console.log("댓글 수 : ", res.data.data.comment)
            console.log("Desire to Mimic : ", res.data.data.desire_to_mimic)
            console.log("sWOM : ", res.data.data.sWOM)
            console.log("Purchase Intention : ", res.data.data.purchase_intention)

            var myConfig = {
                "type":"radar",
                "plot":{
                    "aspect":"rose"
                },
                "scale-k":{
                    "labels":["반응률","포스트","DESIRE TO MIMIC","SWOM","PURCHASE\nINTENTION"],
                    "item":{
                        "font-color":"black",
                        "font-family":"Georgia",
                        "font-size":12,
                        "font-weight":"bold",
                        "font-style":"italic"
                    },
                    "tick":{
                        "line-color":"black",
                        "line-width":3,
                        "size":15,
                        "placement":"outer"
                    },
                    "guide":{
                        "line-color":"black",
                        "line-width":1,
                        "line-style":"solid",
                        "background-color":"#f0f0f5 #e0e0eb"
                    }
                },
                "scale-v":{
                    "visible":false
                },
                "series":[                    
                    {
                        "values":[
                            2.703,
                            15.2961,
                            9.778,
                            4.234,
                            5.994
                        ] 
                    },
                    {
                        "values":[
                            res.data.data.react_rate * 100,
                            res.data.data.post,
                            res.data.data.desire_to_mimic,
                            res.data.data.sWOM,
                            res.data.data.purchase_intention
                        ] 
                    }
                ]
            };
            
            zingchart.render({ 
                id : 'myChart', 
                data : myConfig, 
                height: '100%', 
                width: '100%' 
            });
        },500)
    })
}

test();


