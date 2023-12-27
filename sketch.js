let state_procedure = 0; //0:blank ~~
let state_play = 0; // 0: play 1: pause
let state_content = 0; //0:countdown 1:~~~
let countdown = 3000;

let contentCount = 0;

let countdownTimer = 0;

let contentTime01 = 43500;
let contentTime02 = 52000;
let contentTime03 = 15000;

let content01_Timer = 0;
let content02_Timer = 0;
let content03_Timer = 0;

let bgm;

let img1, img2_1,img2_2, img2_3, img3, img4, img5, frame_Flex, frame_Plie, frame_Releve;
let video1, video2, video3;
let img_ratio;

let poseNet;
let poses1 = [];

let webcam;

let figureRatio = 0.9;
let figureXdelta = 10.0;
let figureYdelta = 60.0;

function preload() {
  img1 = loadImage('poseit_1.png');
  img2_1 = loadImage('poseit_2_1.png');
  img2_2 = loadImage('poseit_2_2.png');
  img2_3 = loadImage('poseit_2_3.png');
  img3 = loadImage('poseit_3.png');
  img4 = loadImage('poseit_4.png');
  img5 = loadImage('poseit_5.png');  
  frame_Plie = loadImage('frame_Plie.png');
  frame_Flex = loadImage('frame_Flex.png');
  frame_Releve = loadImage('frame_Releve.png');
  //soundFormats('mp3', 'ogg');
  
  bgm = loadSound('Rond De Jambe A Terre-Port De Bras.mp3');
  
  video1 = createVideo('position_1.mp4');
  video1.volume(0);
  video1.loop();
  video1.hide();
  video2 = createVideo('position_2.mp4');
  video2.volume(0);
  video2.loop();
  video2.hide();
  video3 = createVideo('position_3.mp4');
  video3.volume(0);
  video3.loop();
  video3.hide();
}

function setup() {
  createCanvas(1080, 1920);
  
  webcam = createCapture(VIDEO);
  webcam.size(300,534);
  webcam.hide();
  poseNet = ml5.poseNet(webcam, modelReady);
  poseNet.on('pose', function(results) {
    poses1 = results;
  });
  // Hide the video element, and just show the canvas
}
function modelReady() {
  select('#status').html('Model Loaded');
}
function draw() {
  background(0);
  
  if(state_procedure == 0){
    background(0);
  }else if(state_procedure == 1){ //첫화면
    //background(255);
    image(img1, 0, 0, 1080, 1920);
    
  }else if(state_procedure == 2){ //Content
    
    if(state_content == 0){
      if(state_play == 0){ // countdown
        //background(0,255,0);
        if(contentCount ==0){
          image(img2_1, 0, 0, 1080, 1920);
        }else if(contentCount ==1){
          image(img2_2, 0, 0, 1080, 1920);
        }else if(contentCount ==2){
          image(img2_3, 0, 0, 1080, 1920);
        }else if(contentCount ==3){
          state_procedure = 3;
        }
        
        if(millis() - countdownTimer > 3000){
          state_content = contentCount + 1;
          content01_Timer = millis();
          content02_Timer = millis();
          content03_Timer = millis();
        }else if(millis() - countdownTimer <= 3000){
          let digit = ''+3 - nf(( millis() - countdownTimer ) / 1000, 1, 0);
          textSize(200);
          fill(255);
          text(digit, 540, 960);
          stroke(5);
        }
      }
    }else if(state_content == 1){
      if(state_play == 0){ //play
        if(millis()-content01_Timer <= contentTime01){
          //요때에는 영상을 계속 재생
          //background(0,0,255);
          image(img2_1, 0, 0, 1080, 1920);
          image(video1, 60, 375, 300, 534);
          drawKeypoints();
          drawSkeleton();
          image(frame_Flex, 60, 375, 300, 534);
        }else if(millis()-content01_Timer > contentTime01){
          state_content = 0;
          contentCount = 1;
          countdownTimer = millis();
        }
      }else if(state_play == 1){//pause
        img_ratio = img3.height/img3.width;
        image(img3, 0, 0, 1080, 1920);
      }
    }else if(state_content == 2){
      if(state_play == 0){
        
        if(millis()-content02_Timer <= contentTime02){
          //요때에는 영상을 계속 재생
          //background(0,0,255);
          image(img2_2, 0, 0, 1080, 1920);
          image(video2, 60, 375, 300, 534);
          drawKeypoints();
          drawSkeleton();
          image(frame_Plie, 60, 375, 300, 534);
        }else if(millis()-content02_Timer > contentTime02){
          state_content = 0;
          contentCount = 2;
          countdownTimer = millis();
        }
        
      }else if(state_play == 1){
        img_ratio = img3.height/img3.width;
        image(img3, 0, 0, 1080, 1920);
      }
    }else if(state_content == 3){
      if(state_play == 0){
        if(millis()-content03_Timer <= contentTime03){
          //요때에는 영상을 계속 재생
          //background(0,0,255);
          image(img2_3, 0, 0, 1080, 1920);
          image(video3, 60, 375, 300, 534);
          drawKeypoints();
          drawSkeleton();
          image(frame_Releve, 60, 375, 300, 534);
        }else if(millis()-content03_Timer > contentTime03){
          state_content = 0;
          contentCount = 3;
          countdownTimer = millis();
        }
      }else if(state_play == 1){
        img_ratio = img3.height/img3.width;
        image(img3, 0, 0, 1080, 1920);
      }
    }
  }else if(state_procedure == 3){ //완료 팝업
        img_ratio = img4.height/img4.width;
        image(img4, 0, 0, 1080, 1920*img_ratio);
    bgm.stop();
  }else if(state_procedure == 4){ //캘린더
        img_ratio = img5.height/img5.width;
        image(img5, 0, 0, 1080, 1920*img_ratio);
  }
}

function mouseClicked(){
  let tempXpos = mouseX;
  let tempYpos = mouseY;
  //let tempMsg = "" + "X: "+tempXpos +"   Y:"+tempYpos;
  //console.log(tempMsg);
  if(state_procedure == 0){
    state_procedure = 1;
  }else if(state_procedure == 3){
    state_procedure = 4;
  }else if(state_procedure == 4){
    state_procedure = 0;
  }else if(state_procedure == 1){
    state_procedure = 2;
    countdownTimer = millis();
    bgm.play();
  }else if(state_procedure == 2 && state_content != 0){
    if(state_play == 0){
      state_play = 1;
    }else if(state_play == 1){
      state_play = 0;
    }
  }
}

function drawKeypoints()  {
  // Loop through all the poses detected
  for (let i = 0; i < poses1.length; i++) {
    // For each pose detected, loop through all the keypoints
    let pose = poses1[i].pose;
    for (let j = 0; j < pose.keypoints.length; j++) {
      // A keypoint is an object describing a body part (like rightArm or leftShoulder)
      let keypoint = pose.keypoints[j];
      // Only draw an ellipse is the pose probability is bigger than 0.2
      if (keypoint.score > 0.2) {
        fill(255, 0, 0);
        noStroke();
        ellipse((keypoint.position.x*figureRatio)+figureXdelta, (keypoint.position.y*figureRatio)+figureYdelta, 10, 10);
      }
    }
  }
}

// A function to draw the skeletons
function drawSkeleton() {
  // Loop through all the skeletons detected
  for (let i = 0; i < poses1.length; i++) {
    let skeleton = poses1[i].skeleton;
    // For every skeleton, loop through all body connections
    for (let j = 0; j < skeleton.length; j++) {
      let partA = skeleton[j][0];
      let partB = skeleton[j][1];
      stroke(255, 0, 0);
      line((partA.position.x*figureRatio)+figureXdelta, (partA.position.y*figureRatio)+figureYdelta, (partB.position.x*figureRatio)+figureXdelta, (partB.position.y*figureRatio)+figureYdelta);
    }
  }
}

function keyPressed() {
  if (keyCode ==UP_ARROW) {
    let fs = fullscreen();
    fullscreen(!fs);
  }
}