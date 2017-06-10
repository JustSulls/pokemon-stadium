/**
 * Created by Jerome on 03-03-17.
 */

var Client = {};
Client.socket = io.connect(); // By default to localhost?

Client.askNewPlayer = function(){
    Client.socket.emit('newplayer');
};

Client.socket.on('newplayer',function(data){
    Game.addNewPlayer(data.id,data.x,data.y);
});

Client.socket.on('allplayers',function(data){
    for(var i = 0; i < data.length; i++){
        Game.addNewPlayer(data[i].id,data[i].x,data[i].y);
    }
});

Client.socket.on('move',function(data){
    Game.movePlayer(data.id,data.x,data.y);
});

Client.socket.on('remove',function(id){
    Game.removePlayer(id);
});