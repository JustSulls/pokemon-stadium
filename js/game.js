/**
 * Created by Jerome on 03-03-16.
 */
/*
 * Author: Jerome Renaux
 * E-mail: jerome.renaux@gmail.com
 */

var Game = {};

Game.init = function () {
    game.stage.disableVisibilityChange = true;
};

var spriteArray = [];
var reduceCountKeyPressLeftBy = 2;
var reduceMeterEvery = 2000;    //milliseconds

Game.preload = function () {
    game.load.image('sky', 'assets/sky.png');
    game.load.image('ground', 'assets/platform.png');
    game.load.image('star', 'assets/star.png');
    game.load.image('pikachu', 'assets/Pikachu.png');
    game.load.image('electricMachineBlueLeft', 'assets/ElectricMachineBlueLeft.png');
    game.load.image('electricMachineGreenRight', 'assets/ElectricMachineGreenRight.png');
    game.load.image('vu', 'assets/vu.png');
};

var player, platforms, cursors, text;
var countKeyPresses = 0;
var textCounter = 0;
var leftDownFlag = false;
var rightDownFlag = false;
var timer;
var fillMeterPic;
    
var electricMachineBlueLeft;
var electricMachineGreenRight;
var electricMachineTimer;

Game.create = function () {
    game.physics.startSystem(Phaser.Physics.ARCADE);
    //  A simple background for our game
    game.add.sprite(0, 0, 'sky');

    //MYCODE
    electricMachineBlueLeft = game.add.sprite(300, 400, 'electricMachineBlueLeft');
    electricMachineBlueLeft.visible = true;
    electricMachineGreenRight = game.add.sprite(300, 400, 'electricMachineGreenRight');
    electricMachineGreenRight.visible = false;

    //  The platforms group contains the ground and the 2 ledges we can jump on
    platforms = game.add.group();
    //  We will enable physics for any object that is created in this group
    platforms.enableBody = true;
    // Here we create the ground.
    var ground = platforms.create(0, game.world.height - 64, 'ground');
    //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
    ground.scale.setTo(2, 2);
    //  This stops it from falling away when you jump on it
    ground.body.immovable = true;
    // The player and its settings
    player = game.add.sprite(32, game.world.height - 150, 'pikachu');
    //  We need to enable physics on the player
    game.physics.arcade.enable(player);
    //  Player physics properties. Give the little guy a slight bounce.
    player.body.bounce.y = 0;
    player.body.gravity.y = 300;
    player.body.collideWorldBounds = true;

    //  Our controls.
    cursors = game.input.keyboard.createCursorKeys();

    //MYCODE
    text = game.add.text(game.world.centerX, game.world.centerY, 'Counter: 0', { font: "64px Arial", fill: "#ffffff", align: "center" });
    text.anchor.setTo(0.5, 0.5);

    fillMeterPic = game.add.image(game.world.centerX, 550, 'vu');

    //  Create our Timer
    timer = game.time.create(false);
    //  Set a TimerEvent to occur after 2 seconds
    timer.loop(reduceMeterEvery, reduceMeter, this);

    //Set another TimerEvent to occur every random seconds
    electricMachineTimer = timer.loop(game.rnd.integerInRange(1000, 5000), changeElectricMachine, this);

    //  Start the timer running - this is important!
    //  It won't start automatically, allowing you to hook it to button events and the like.
    timer.start();

    Client.askNewPlayer();
};

function fillMeter() 
{
    var numSprites = Math.floor(countKeyPresses/5);
    
    for(var i=0;i<spriteArray.length;i++){
        spriteArray[i].kill();
    }
    if(countKeyPresses>=50){
        text.setText('You Won!');
    }else{
        numSprites = Math.floor(countKeyPresses/5);
        for(i=0;i<numSprites;i++){
            var meterPictureSprite = game.add.sprite(fillMeterPic.x + ((i)*32), fillMeterPic.y, 'pikachu');
            spriteArray.push(meterPictureSprite);
        }
    }
}
function reduceMeter() {
    if(countKeyPresses > (0 + reduceCountKeyPressLeftBy))
        {
            countKeyPresses -= reduceCountKeyPressLeftBy;
            text.setText('Counter: ' + countKeyPresses);
            fillMeter();   
        }
}
function changeElectricMachine()
{
    
    if (electricMachineBlueLeft.visible == true)
    {
        electricMachineBlueLeft.visible = false;
        electricMachineGreenRight.visible = true;
    }
    else
    {
        electricMachineBlueLeft.visible = true;
        electricMachineGreenRight.visible = false;
    }
    electricMachineTimer.delay = game.rnd.integerInRange(1000, 5000);
}
function countKeyPressLeft()
{
    if(cursors.left.isDown)
    {
        leftDownFlag = true;
    }
    else{
        if(leftDownFlag){
            leftDownFlag = false;
            countKeyPresses++;
        }
    }
    
    //MYCODE
    text.setText('Counter: ' + countKeyPresses);
    
    fillMeter();
}
function countKeyPressRight()
{
    if(cursors.right.isDown)
        {
            rightDownFlag = true;
        }
    else
    {
        if(rightDownFlag){
            rightDownFlag = false;
            countKeyPresses++;
        }
    }
    //MYCODE
    text.setText('Counter: ' + countKeyPresses);
    
    fillMeter();
}

Game.update = function(){
    // Collide player with platforms
    game.physics.arcade.collide(player, platforms);
    //Check what electricMachine is up
    if(electricMachineBlueLeft.visible == true)
    {
        countKeyPressLeft();
    }
    else
    {
        countKeyPressRight();
    }
}

Game.addNewPlayer = function (id, x, y) {
    Game.playerMap[id] = game.add.sprite(x, y, 'sprite');
};

Game.movePlayer = function (id, x, y) {
    var player = Game.playerMap[id];
    var distance = Phaser.Math.distance(player.x, player.y, x, y);
    var tween = game.add.tween(player);
    var duration = distance * 10;
    tween.to({ x: x, y: y }, duration);
    tween.start();
};

Game.removePlayer = function (id) {
    Game.playerMap[id].destroy();
    delete Game.playerMap[id];
};