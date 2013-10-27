var app = require('http').createServer(handler).listen(7777)
  , io = require('socket.io').listen(app)

app.listen(80);
var clients={};
var stack=[];
function handler(req,res){
  console.log(req.connection);
  res.write('hi');
  res.end();
}
io.configure(function () {
  io.set("transports", ["xhr-polling"]);
  io.set("polling duration", 10);
});
io.sockets.on('connection', function (socket) {
  on_connect(socket);
  clients[socket.id]=socket;
  socket.on('message',function(data){
      console.log(socket.handshake)
  var address = socket.handshake.headers['user-agent'];
  var user=/Firefox|Chrome/;
    obj={message:data.message,sender:user.exec(address)[0]}
    console.log(obj);
    stack.push(obj);
    for(var key in clients){
      socket!=clients[key]?clients[key].emit('message',obj):0;
    }
  })
});
function on_connect(socket){
  var main=[];
  var address = socket.handshake.headers['user-agent'];
  var user=/Firefox|Chrome/; user=user.exec(address)[0];
    for(var key in stack){
      var value=stack[key];
      value.sender!=user?main.push(value):0;
    }
  console.log(main);
  socket.emit('data',main);
}
io.sockets.on('close',function(socket){
  socket.close();
})
