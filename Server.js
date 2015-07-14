var express = require("express");
var app     = express();
var path    = require("path");

app.use('/dist',express.static('dist'));
app.use('/app',express.static('app'));
app.use('/Content',express.static('Content'));
app.use('/font-awesome-4.3.0',express.static('font-awesome-4.3.0'));
app.use('/bower_components',express.static('bower_components'));
app.use('/Views',express.static('Views'));

//Store all HTML files in view folder.
app.get('/favicon.ico',function(req,res){
  res.sendFile(path.join(__dirname+'favicon.ico'));
  //__dirname : It will resolve to your project folder.
});
app.get('/',function(req,res){
  res.sendFile(path.join(__dirname+'index.html'));
  //__dirname : It will resolve to your project folder.
});

app.get('*',function(req,res){
  res.sendFile(path.join(__dirname+'index.html'));
});

app.listen(process.env.PORT || 30001, function() {
  console.log("listening on 30001");
});

