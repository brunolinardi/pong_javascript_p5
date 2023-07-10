//Setup variables
let singlePlayer = false;
let hitRacketSound;
let scoreSound;
let soundtrack;

//Ball variables
let xBall = 100;
let yBall = 100;
let diameterBall = 13;
let radiusBall = diameterBall/2;
//Ball speed
let speedXBall = 6;
let speedYBall = 6;

//Racket variables
let xRacketPlayer1 = 5;
let yRacketPlayer1 = 150;
let xRacketOpponent = 585;
let yRacketOpponent = 150;
let widthRacket = 10;
let heightRacket = 90;
//Racket speed for multiplayer and single player
let speedRacket = 6;
let speedRacketOpponent;
let opponentMissChance = 0;

//Collision library
let hit = false;

//Score
let player1Points = 0;
let opponentPoints = 0;

function preload(){
  soundtrack = loadSound("trilha.mp3");
  hitRacketSound = loadSound("raquetada.mp3");
  scoreSound = loadSound("ponto.mp3")
}

function setup() {
  createCanvas(600, 400);
  soundtrack.loop();
}

function draw() {
  background(0);
  showBall();
  moveBall();
  checkCollisionBorder();  
  showRacket(xRacketPlayer1,yRacketPlayer1);
  showRacket(xRacketOpponent,yRacketOpponent);
  moveRacketPlayer1();
  if (singlePlayer){
    moveRacketAI();
  }else{
    moveRacketOpponent();    
  }
  //checkCollisionRacket();
  collisionRacketLibrary(xRacketPlayer1,yRacketPlayer1);
  collisionRacketLibrary(xRacketOpponent,yRacketOpponent);
  showScoreboard();  
  scorePoint();
  showCenterLine();
  //BallStuckRacketFix();
}

function showBall(){
  circle(xBall,yBall,diameterBall);
}

function moveBall(){
  xBall += speedXBall;
  yBall += speedYBall;
}

function showRacket(x,y){
  rect(x,y,widthRacket,heightRacket);
}

function moveRacketPlayer1(){
  if (keyIsDown(UP_ARROW)){
    yRacketPlayer1 -= speedRacket;
  }
  if (keyIsDown(DOWN_ARROW)){
    yRacketPlayer1 += speedRacket;
  }
  yRacketPlayer1 = constrain(yRacketPlayer1,0,height-heightRacket)
}

function moveRacketOpponent(){
  if (keyIsDown(87)){    //W key
    yRacketOpponent -= speedRacket;
  }
  if (keyIsDown(83)){    //S key
    yRacketOpponent += speedRacket;
  }
  yRacketOpponent = constrain(yRacketOpponent,0,height-heightRacket)
}

function moveRacketAI(){
  speedRacketOpponent = yBall -yRacketOpponent -widthRacket / 2 - 30;
  yRacketOpponent += speedRacketOpponent + opponentMissChance;
  yRacketOpponent = constrain(yRacketOpponent,0,height-heightRacket)
  calculateChanceToMiss();
}

function calculateChanceToMiss(){
  if (opponentPoints >= player1Points){
    opponentMissChance += 1;
    if(opponentMissChance >= 39){
      opponentMissChance = 40;
    }
  }else{
    opponentMissChance -= 1;
    if(opponentMissChance <= 35){
      opponentMissChance = 35;
    }
  }
}

function checkCollisionBorder(){
  if (xBall + radiusBall > width ||
      xBall - radiusBall < 0){
    speedXBall *= -1;
  }
  
  if (yBall + radiusBall > height ||
      yBall - radiusBall < 0){
    speedYBall *= -1;
  }
}

function checkCollisionRacket(){
  if (xBall - radiusBall < xRacketPlayer1 + widthRacket &&
     yBall - radiusBall < yRacketPlayer1 + heightRacket &&
     yBall + radiusBall > yRacketPlayer1){
    speedXBall *= -1;
    hitRacketSound.play();
  }
}

function collisionRacketLibrary(x,y){
  hit = collideRectCircle(x, y, widthRacket, heightRacket, xBall, yBall, radiusBall);
  if (hit){
    speedXBall *= -1;
    hitRacketSound.play();
  }
}

function showScoreboard(){
  stroke(255);
  textAlign(CENTER);
  textSize(16);
  fill(color(255,165,0));
  rect(150,10,40,20);
  fill(255);
  text(player1Points,170,26);
  fill(color(255,165,0));
  rect(450,10,40,20);
  fill(255);
  text(opponentPoints,470,26);
}

function scorePoint(){
  if (xBall > 595){
    player1Points += 1;
    scoreSound.play();
  }
  if (xBall < 10){
    opponentPoints += 1;
    scoreSound.play();
  }
}

function BallStuckRacketFix(){
  if (xBall - radiusBall < 0){
    xBall = 23;
  }
  if (xBall + radiusBall > 600){
    xBall = 577;
  }
}

function showCenterLine(){
  rect(297,0,6,400);
}