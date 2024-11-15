//Digital Forest November 2024
//Created for the Being Human Festival 2024, "Trees, Food and You" event
//Created in p5.js by Dave Webb @crispysmokedweb
//You may freely use and develop from this code, but you must attribute 
//the original author as Dave Webb, unless you are scraping this as, or for,
//training data for an AI/ML or LLM model - such uses, or equivalents are forbidden
//Images and sounds are donated by audience members from the festival, who 
//cannot be individually recognised here, but theri rights to authorship and copyright
//are protected

// place sound files (must be .wav) to be included in the givenSounds folder, 
// given a sequential filename gs000-gsnnn (eg. gs002.wav) and update the global 
// variable numGivenSounds to reflect the number to be included

// place image file (must be .png) to be included in the givenSounds folder, 
// given a sequential filename gi000-ginnn (eg. gi002.png) and update the global 
// variable numGivenImages to reflect the number to be included

//gs and gi file numbers must be sequential from gs000 and counting on.
//gaps will cause load errors

//variables to modify to reflect the media files to include
let numGivenImages=14
let numGivenSounds=6

let leaves=[]
let numLeaves=100
let bgImage
let leafShapes=[]
let numLeafShapes=4
let givenImages=[]
let givenSounds=[]
let bgScale=1
let started=false

function preload(){
  bgImage=loadImage('images/SugarloafWoods2.png')
  for(let i=0; i<numLeafShapes; i++){
    leafShapes[i]=loadImage('images/leafShape0'+i+'.png')
  }
  for(let i=0; i<numGivenImages; i++){
    givenImages[i]=loadImage('givenImages/gi'+nf(i,3,0)+'.png')
  }
}

function setup() {
  let maxHeight=min(windowHeight,windowWidth*bgImage.height/bgImage.width)
  createCanvas(windowWidth, maxHeight);
  bgScale=width/bgImage.width
  for(let i=0; i<numGivenImages; i++){
    givenSounds[i]=new SoundPlayer(i,"givenSounds/gs"+nf(i%numGivenSounds,3,0)+".wav")
    givenSounds[i].loadSoundFile()
  }
  
  for(let i=0; i<numLeaves; i++){
    leaves.push(new Leaf(random(width),random(0.80,0.95)*height,height*0.12,leafShapes[i%numLeafShapes], givenImages[i%numGivenImages], givenSounds[i%numGivenSounds]))
  }
}

function draw() {
  background(220);
  noTint()
  image(bgImage,0,0,width, bgImage.height*bgScale)
  if(started){
    leaves.forEach(l=>{
      l.run()
      l.show()
    })
    fill(200,100,0)
    stroke(255)
    strokeWeight(height*0.007)
    textSize(height*0.1)
    textAlign(CENTER, CENTER)
    text('"kick" the leaves with the mouse', width/2, height*0.95)
  } else {
    fill(100,200,0)
    stroke(0)
    strokeWeight(height*0.01)
    textSize(height*0.15)
    textAlign(CENTER, CENTER)
    text('click to begin', width/2, height*0.5)
  }
}

function mousePressed(){
  // leaves.forEach(l=>{
  //   l.disturb()
  // })
  started=true
}

class Leaf{
  constructor(x,y,s,maskImg, givenImg, givenSound){
    this.ox=x
    this.oy=y
    this.s=s
    this.pos=createVector(x,random(-10,-100))
    this.isMoving=false
    this.isFalling=false
    this.initialDelay=floor(random(2,200))
    this.risingA=PI
    this.risingEase=random(20,40)
    this.vDisp=height*0.4
    this.fallA=0
    this.fallRot=-PI/random(100,200)//150
    this.fallRotNow=0
    this.fallG=random(1.01,1.02)
    this.fallNow=random(0.1,0.2)
    this.myRedShade=random(100,200)
    this.myGreenShade=random(50,150)
    this.relBlueTint=255
    this.relGreenTint=255
    this.relRedTint=255
    this.hDisp=height*0.1
    this.hDispNow=0
    this.maxFall=5.5
    this.zA=0
    this.yA=0
    this.zRot=PI/random(80,200)
    this.yRot=PI/random(115,300)
    this.hover=false
    this.maxScale=4
    this.relScale=this.maxScale
    
    givenImg.mask(maskImg)
    this.img=givenImg
    
    this.givenSound=givenSound
  }
  
  disturb(){
    if(this.hover){
      this.isMoving=true
      this.risingA=PI
      this.fallA=0
      this.fallNow=0.1
      this.fallRotNow=0
      this.hDispNow=0
      this.givenSound.triggerSound()
    }
  }
  
  run(){
    if(this.initialDelay>0){
      this.initialDelay--
      if(this.initialDelay==1){
        this.isFalling=true
      }
    }
    this.hover=false
    if(this.isMoving){
      this.risingA+=(0-this.risingA)/this.risingEase
      this.pos.x=this.ox+cos(this.risingA-PI/2)*this.hDisp
      this.pos.y=this.oy-this.vDisp+ sin(this.risingA-PI/2)*this.vDisp
      this.yA+=this.yRot*2
      this.zA+=this.zRot*2
      this.relScale+=(this.maxScale-this.relScale)/10; 
      if(abs(0-this.risingA)<0.25){
        this.isMoving=false
        this.isFalling=true
        this.ox=this.pos.x
      }
    } else if(this.isFalling){ 
      this.pos.y+=this.fallNow
      this.relScale=map(this.pos.y,this.oy-this.vDisp*2,this.oy,this.maxScale,1)
      
      
      if(this.fallNow<this.maxFall){
        this.fallNow*=this.fallG
      }
      this.pos.x=this.ox+sin(this.fallA)*this.hDispNow*3
      this.fallA+=this.fallRotNow
      this.fallRotNow+=(this.fallRot-this.fallRotNow)/30
      this.hDispNow+=(this.hDisp-this.hDispNow)/150
      this.yA+=this.yRot*2
      this.zA+=this.zRot
      if(this.pos.y>this.oy){
        this.isFalling=false
        this.ox=this.pos.x
        this.pos.y=this.oy
        this.yA=PI/2
      }
      
    } else {
      this.hover=dist(mouseX, mouseY, this.pos.x, this.pos.y)<this.s*0.3
      if(this.hover ){ //&& mouseIsPressed
        this.disturb()
      }
    }
    this.relRedTint=map(this.relScale,this.maxScale,1,255,this.myRedShade)
    this.relGreenTint=map(this.relScale,this.maxScale,1,255,this.myGreenShade)
    this.relBlueTint=map(this.relScale,this.maxScale,1,255,0)
    this.pos.x=(this.pos.x+width)%width
    this.givenSound.run()
  }
  
  show(){
    // tint(this.relRedTint,this.relGreenTint,this.relBlueTint)
    if(this.hover){
      // tint(100,100,255)
    }
    // if(this.isFalling){
    //   tint(200,50,50)
    // }
    // if(this.isMoving){
    //   // tint(200,100,0)
    //   noTint()
    // }
    push()
    translate(this.pos.x, this.pos.y)
    push()
    rotate(this.zA)
    imageMode(CENTER)
    scale(this.relScale,sin(this.yA)*this.relScale)
    image(this.img,0,0,this.s, this.s)
    pop()
    pop()
  }
  
}

class SoundPlayer{
  constructor(soundNum,soundFile){
    this.soundFile=soundFile
    this.sound
    this.soundNum=soundNum
    this.triggered=false
    this.playing=false
    this.loaded=false
  }
  
  soundDidLoad(context){
    console.log("loaded" + context.soundNum)
    
    context.loaded=true
  }
  
  loadSoundFile(filename){
    console.log(this.soundNum, "getting", this.soundFile)
    this.sound= loadSound(this.soundFile, this.soundDidLoad(this))
    
  }
  
  triggerSound(){
    this.sound.setVolume(0.8);
    this.sound.stop();
    this.sound.play();
    this.sound.pan(random(-1,1));
    this.triggered=true;
  }
  
  run(){
    this.playing=this.triggered && this.sound.isPlaying();
    if(!this.playing){
      this.triggered=false
    }
  }
}