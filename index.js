const express = require('express');
const bodyParser = require("body-parser");

const app = express();
app.set("view_engine","ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static("public"));
module.exports = app;

const sqlite3 = require('sqlite3').verbose();
const fs = require("fs");
const dbfile = "meibo.db";
const exists = fs.existsSync(dbfile);
const db = new sqlite3.Database(dbfile);

app.get('/', function(request, response){
  const current = new Date();
  const data = {
    'month': current.getMonth()+1,
    'day':current.getDate(),
    'hour':current.getHours(),
    'minute':current.getMinutes()
  };
  response.render("index.ejs",data);

});

app.get('/form_sample',function(request,response){
  const data = {
    'keyword': request.query.keyword
  }
  response.render("form_sample.ejs",data);
});

app.get('/query_sample',function(request,response){
  const query = "select firstname,lastname,birthday,birthplace from meibo";
  db.all(query, function(err,rows){
    const data = {
      'results': rows
    };
    response.render("query_sample.ejs",data);
  });
});

app.get('/birthplace',function(request,response){
  if(!request.query.pref){
    //入力フォームに何も書かれてない時は何も表示しない    
    response.render("birthplace.ejs",{'results':[]});
    return;
  }
  //課題8-2
  var query = "SELECT lastname,firstname,birthplace,birthday FROM  meibo WHERE birthplace = ?";
  db.all(query,[request.query.pref] ,function(err,rows){
    const data = {
      'results': rows
    };
    response.render("birthplace.ejs",data);
  });

});

app.listen(3000, function(){
  const start = Date.now();
  console.log('server started');
});
