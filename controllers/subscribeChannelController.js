
var bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const url = "mongodb://localhost:27017/";
var urlencodeparser = bodyParser.urlencoded({extended:false});
var channelArray =[];
var finalOutupt ;
var channelList =[];
var counter = 0;


MongoClient.connect(url, function(err, db) {
if (err) throw err;
var dbo = db.db("DTH");
dbo.collection("channels").find({}, function(err, result) {
if (err) throw err;
result.forEach(function(doc){
  //  console.log(doc);
    channelArray.push(doc);
})
db.close();
});
}); 


module.exports = function(app){

    app.get('/home', function (req, res) {
        
            finalOutupt={} ;
            channelList =[];
            counter = 0;
        res.render('index')
     })

     
    
    app.get("/subscribeChannel",function(req,res){
        console.log("");
        res.render('subscribeChannel',{chanels:channelArray})
    
    
    });

    app.get("/userDetails",function(req,res){
        console.log("");
        res.render('userSubscribeDetails')
    
    
    });

    app.post("/subscribed",urlencodeparser,function(req,res){
       //console.log(req.body);
       
       MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("DTH");
        dbo.collection("subscription_channel").insertOne(req.body, function(err, res) {
          if (err) throw err;
          console.log("1 document inserted");
          db.close();
        });
      });
      return res.render('index');
      
    });

    app.get("/subscriberDetails",function(req,res){
        console.log("");
        res.render('subscriberDetails')
    
    
    });

    
    app.post("/userSubscribeDetails",urlencodeparser,function(req,res){


            MongoClient.connect(url, function(err, db) {
                if (err) throw err;
                var dbo = db.db("DTH");
                var query = req.body ;
                console.log(query);
                dbo.collection("customers").find(query).toArray(function(err, result) {
                if (err) throw err;
                console.log(result);
                console.log();
                var custName = JSON.stringify(result[0].first_name + " " + result[0].last_name);
               
              var subId= JSON.stringify(result[0].subscriber_id);
                var value = JSON.parse(custName);
                var subscId =  JSON.parse(subId);
               // var subscriber_ID= {subscriber_id:subscId}
               //var customerName = {customer_name: value} 
                finalOutupt={subscriber_id:subscId,customer_name: value};
                console.log("Final Output000000")
                console.log(finalOutupt);
                db.close();
                 
                });
                var aray =[]
                dbo.collection("subscription_channel").find(query).toArray(function(err,response){
                    if (err) throw err;
                    console.log(query);
                    console.log(response);

                    db.close();
                   
                    response.forEach(function (ds){
                     
                        aray.push(ds.channel_id);
                    })

                    console.log(aray);
                    dataOperation(aray);
                    
                });
                
                
                
                }); 
                function dataOperation(aray){
                    MongoClient.connect(url, function(err, db) {
                        var dbo = db.db("DTH");
                    for(var j =0;j<aray.length;j++){
                        var value = JSON.parse(aray[j]);
                        var queryParam = {channel_id: value} 
                        dbo.collection("channels").find(queryParam).toArray(function(err,resps){
                
                            if (err) throw err;
                            console.log(queryParam);
                            console.log("i am here")
                            console.log(resps);
                            resps.forEach(function(par){
                              var channel_name=   JSON.stringify( par.channel_name);
                              var total_cost=  JSON.stringify(par.cost_per_month);
                              counter+= parseFloat(par.cost_per_month);
                              channelList.push({channel_name:channel_name,total_cost: total_cost});
                              console.log(channelList);
                             

                            })
                
                            db.close();
                            
                        });
                
                
                
                    }

                    });
                    
                   }
                   setTimeout( function() {
                   return res.render('userSubscribeDetails',{dsc:channelList,sdc:finalOutupt,count:counter});
                   },6000);

                   


    });

   

};