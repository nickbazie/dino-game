var time = new Date();
var deltaTime = 0;

var floorY = 22;
var velY = 0;
var impulse = 900;
var gravity = 2500;

var dinoPosX = 42;
var dinoPosY = floorY;

var floorX = 0;
var speedScenario = 1280/3;
var gameSpeed = 1;
var score = 0;

var stopped = false;
var jumping = false;

var timeBeforeObstacle = 2;
var timeObstacleMin = 0.7;
var timeObstacleMax = 1.8;
var obstaclePosY = 16;
var obstacles = [];

var timeBeforeCloud = 0.5;
var timeCloudMin = 0.7;
var timeCloudMax = 2.7;
var maxCloudY = 270;
var minCloudY = 100;
var clouds = [];
var speedCloud = 0.5;

var container;
var dino;
var scoreText;
var floor;
var gameOver;

if(document.readyState === "complete" || document.readyState === "interactive") {
    setTimeout(Init, 1);
}else{
    document.addEventListener("DOMContentLoaded", Init);
}

function Init() {
    time = new Date();
    Start();
    Loop();
}

function Loop() {
    deltaTime = (new Date() - time) / 1000;
    time = new Date();
    Update()
    requestAnimationFrame(Loop);
}

function Start() {
    gameOver = document.querySelector(".game-over");
    floor = document.querySelector(".floor");
    container = document.querySelector(".container");
    scoreText = document.querySelector(".score");
    dino = document.querySelector(".dino");
    document.addEventListener("keydown", HandleKeyDown);
}

function HandleKeyDown(ev) {
    if(ev.keyCode == 32){
        Jump();
    }
}

function Jump() {
    if(dinoPosY === floorY) {
        jumping = true;
        velY = impulse;
        dino.classList.remove("dino-run")
    }
}


function Update() {

    if(stopped) return;

    MoveFloor();
    MoveDino();
    DecideCreateObstacles();
    DecideCreateClouds();
    MoveObstacles();
    MoveClouds();
    DetectCrush();

    velY -= gravity * deltaTime;
}

function MoveFloor() {
    floorX += CalculateMove();
    floor.style.left = -(floorX % container.clientWidth) + "px";
}

function CalculateMove() {
    return speedScenario * deltaTime * gameSpeed;
}

function MoveDino() {
    dinoPosY += velY * deltaTime;
    if(dinoPosY < floorY){
        TouchFloor();
    }
    dino.style.bottom = dinoPosY+"px";
}

function TouchFloor() {
    dinoPosY = floorY;
    velY = 0;
    if(jumping){
        dino.classList.add("dino-run");
    }
    jumping = false;
}

function DecideCreateObstacles() {
    timeBeforeObstacle -= deltaTime;
    if(timeBeforeObstacle <= 0){
        CreateObstacle();
    }
}

function DecideCreateClouds() {
    timeBeforeCloud -= deltaTime;
    if(timeBeforeCloud <= 0){
        CreateCloud();
    }
}

function CreateObstacle() {
    var obstacle = document.createElement("div");
    container.appendChild(obstacle);
    obstacle.classList.add("cactus");
    if(Math.random() > 0.5) obstacle.classList.add("cactus2");
    obstacle.posX = container.clientWidth;
    obstacle.style.left = container.clientWidth+"px";

    obstacles.push(obstacle);
    timeBeforeObstacle = timeObstacleMin + Math.random() *
    (timeObstacleMax - timeObstacleMin) / gameSpeed;
}

function CreateCloud() {
    var cloud = document.createElement("div");
    container.appendChild(cloud);
    cloud.classList.add("cloud");
    cloud.posX = container.clientWidth;
    cloud.style.left = container.clientWidth+"px";
    cloud.style.bottom = minCloudY + Math.random() * (maxCloudY-minCloudY)+"px";

    clouds.push(cloud);
    timeBeforeCloud = timeCloudMin + Math.random() *
    (timeCloudMax - timeCloudMin) / gameSpeed;
}

function MoveObstacles() {
    for(var i = obstacles.length - 1; i >= 0; i--) {
        if(obstacles[i].posX < -obstacles[i].clientWidth) {
            obstacles[i].parentNode.removeChild(obstacles[i]);
            obstacles.splice(i, 1);
            WinPoints();
        }else{
            obstacles[i].posX -= CalculateMove();
            obstacles[i].style.left = obstacles[i].posX+"px";
        }
    }
}

function MoveClouds() {
    for(var i = clouds.length - 1; i >= 0; i--) {
        if(clouds[i].posX < -clouds[i].clientWidth) {
            clouds[i].parentNode.removeChild(clouds[i]);
            clouds.splice(i, 1);
            WinPoints();
        }else{
            clouds[i].posX -= CalculateMove() * speedCloud;
            clouds[i].style.left = clouds[i].posX+"px";
        }
    }
}

function WinPoints() {
    score++;
    scoreText.innerText = score;
}

function GameOver() {
    Crush();
    gameOver.style.display = "block";
}

function DetectCrush() {
    for(var i = 0; i < obstacles.length; i++){
        if(obstacles[i].posX > dinoPosX + dino.clientWidth) {
            break;
        }else{
            if(IsCrush(dino, obstacles[i], 10, 30, 15, 20)) {
                GameOver();
            }
        };
    }     
}

function Crush() {
    dino.classList.remove("dino-run");
    dino.classList.add("dino-crush");
    stopped = true;
}

function IsCrush(a, b, paddingTop, paddingRight, paddingBottom, paddingLeft) {
    var aRect = a.getBoundingClientRect();
    var bRect = b.getBoundingClientRect();

    return !(
        ((aRect.top + aRect.height - paddingBottom) < (bRect.top)) ||
        (aRect.top + paddingTop > (bRect.top + bRect.height)) ||
        ((aRect.left + aRect.width - paddingRight) < bRect.left) ||
        (aRect.left + paddingLeft > (bRect.left + bRect.width))
    );
}