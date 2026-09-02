export const SPARK_BADGE_MARKUP = String.raw`<!doctype html>
<html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<style>html,body{margin:0;width:100%;height:100%;overflow:hidden;background:#000}canvas{display:block;width:100%;height:100%;background:#000;cursor:pointer}</style>
</head><body><canvas id="scene"></canvas><script>
const canvas=document.getElementById("scene"),ctx=canvas.getContext("2d");
const shape=[],backRain=[],frontRain=[],splashes=[];
const rand=(a,b)=>a+Math.random()*(b-a);
let W=0,H=0,DPR=1,card={w:0,h:0};

function reset(drop,initial,front){
  drop.x=rand(-W*.1,W*1.1); drop.y=initial?rand(-H,H):rand(-H*.22,-12);
  drop.len=front?rand(16,42):rand(11,31); drop.speed=front?rand(2.8,5.4):rand(2,4);
  drop.alpha=front?rand(.32,.88):rand(.045,.18); drop.weight=front&&Math.random()>.82?1.2:.55;
}
function addShape(x,y,isText){
  shape.push({bx:x,by:y,x:x+rand(-20,20),y:y+rand(-20,20),vx:rand(-.8,.8),vy:rand(-.8,.8),
    len:isText?rand(3,9):rand(4,13),weight:isText?rand(.65,1.45):rand(.45,1.25),
    alpha:isText?rand(.48,1):rand(.25,.92),phase:rand(0,6.28),text:isText});
}
function addEdge(x1,y1,x2,y2,count){
  for(let i=0;i<count;i++){const t=Math.random();addShape(x1+(x2-x1)*t+rand(-2,2),y1+(y2-y1)*t+rand(-2,2),false)}
}
function addText(){
  const scale=2,off=document.createElement("canvas"); off.width=card.w*scale;off.height=card.h*scale;
  const ink=off.getContext("2d");ink.scale(scale,scale);ink.fillStyle="#fff";ink.textAlign="center";ink.textBaseline="middle";
  ink.font="700 "+(card.w*.22)+"px Arial,sans-serif";
  ink.fillText("넥토리얼",card.w/2,card.h*.44); ink.fillText("지원",card.w/2,card.h*.60);
  const data=ink.getImageData(0,0,off.width,off.height).data,step=5;
  for(let y=0;y<off.height;y+=step)for(let x=0;x<off.width;x+=step)
    if(data[(y*off.width+x)*4+3]>120&&Math.random()>.18)addShape(x/scale-card.w/2+rand(-1,1),y/scale-card.h/2+rand(-1,1),true);
}
function resize(){
  DPR=Math.min(devicePixelRatio||1,2);W=innerWidth;H=innerHeight;canvas.width=W*DPR;canvas.height=H*DPR;ctx.setTransform(DPR,0,0,DPR,0,0);
  card.w=Math.min(W*.55,H*.65);card.h=Math.min(H*.85,card.w*1.48);shape.length=0;
  const l=-card.w/2,r=card.w/2,t=-card.h/2,b=card.h/2;
  addEdge(l,t,r,t,360);addEdge(r,t,r,b,510);addEdge(r,b,l,b,360);addEdge(l,b,l,t,510);addText();
  backRain.length=frontRain.length=0;
  for(let i=0;i<Math.max(125,W*.16);i++){let d={};reset(d,true,false);backRain.push(d)}
  for(let i=0;i<Math.max(110,W*.14);i++){let d={};reset(d,true,true);frontRain.push(d)}
}
function transform(time){return{x:W*.5+Math.sin(time*.00031)*W*.023,y:H*.5+Math.sin(time*.00043+1)*H*.018,rot:Math.sin(time*.00024)*.055+Math.cos(time*.00017)*.018}}
function localToWorld(x,y,tr){const c=Math.cos(tr.rot),s=Math.sin(tr.rot);return{x:tr.x+x*c-y*s,y:tr.y+x*s+y*c}}
function worldToLocal(x,y,tr){const dx=x-tr.x,dy=y-tr.y,c=Math.cos(tr.rot),s=Math.sin(tr.rot);return{x:dx*c+dy*s,y:-dx*s+dy*c}}
function splashAt(x,y,nx,ny){for(let i=0;i<rand(5,10);i++){let f=rand(1.7,4.8);splashes.push({x,y,vx:nx*f+rand(-1.8,1.8),vy:ny*f+rand(-1.6,.6),life:rand(13,28),max:28,size:rand(.45,1.4)})}}
function collide(drop,nx,ny,tr){
  const a=worldToLocal(drop.x,drop.y,tr),b=worldToLocal(nx,ny,tr),dx=b.x-a.x,dy=b.y-a.y,l=-card.w/2,r=card.w/2,t=-card.h/2,bt=card.h/2;
  const edges=[["x",l,t,bt,-1,0],["x",r,t,bt,1,0],["y",t,l,r,0,-1],["y",bt,l,r,0,1]];
  for(const [axis,value,min,max,normalX,normalY] of edges){
    const move=axis==="x"?dx:dy,start=axis==="x"?a.x:a.y;if(!move)continue;
    const q=(value-start)/move,other=axis==="x"?a.y+dy*q:a.x+dx*q;
    if(q>=0&&q<=1&&other>=min&&other<=max){const p=axis==="x"?{x:value,y:other}:{x:other,y:value},w=localToWorld(p.x,p.y,tr),n=localToWorld(p.x+normalX,p.y+normalY,tr);splashAt(w.x,w.y,n.x-w.x,n.y-w.y);reset(drop,false,true);return true}
  }return false;
}
function rain(drops,front,tr){
  ctx.lineCap="round";for(const d of drops){const nx=d.x-d.speed*.35,ny=d.y+d.speed;ctx.globalAlpha=d.alpha;ctx.strokeStyle="#fff";ctx.lineWidth=d.weight;
    ctx.beginPath();ctx.moveTo(d.x,d.y);ctx.lineTo(d.x-d.len*.35,d.y+d.len);ctx.stroke();
    if(!front||!collide(d,nx,ny,tr)){d.x=nx;d.y=ny;if(d.y>H+48||d.x<-72)reset(d,false,front)}
  }
}
function animateShape(time,tr){
  ctx.lineCap="round";
  for(const p of shape){
    const waveX=Math.sin(time*.002+p.phase)*3.8,waveY=Math.cos(time*.0017+p.phase)*2.4,target=localToWorld(p.bx+waveX,p.by+waveY,tr);
    p.vx=(p.vx+(target.x-p.x)*.038+Math.sin(time*.004+p.phase)*.045)*.86;
    p.vy=(p.vy+(target.y-p.y)*.038+Math.cos(time*.003+p.phase)*.045)*.86;p.x+=p.vx;p.y+=p.vy;
    const angle=1.9+Math.sin(time*.003+p.phase)*.38+Math.atan2(p.vy,p.vx)*.18;
    ctx.globalAlpha=p.alpha*(.62+Math.sin(time*.004+p.phase)*.25);ctx.strokeStyle="#fff";ctx.lineWidth=p.weight;
    const len=p.len*(.7+Math.sin(time*.005+p.phase)*.28);ctx.beginPath();ctx.moveTo(p.x-Math.cos(angle)*len*.5,p.y-Math.sin(angle)*len*.5);ctx.lineTo(p.x+Math.cos(angle)*len*.5,p.y+Math.sin(angle)*len*.5);ctx.stroke();
  }
}
function drawSplashes(){for(let i=splashes.length-1;i>=0;i--){const p=splashes[i];p.x+=p.vx;p.y+=p.vy;p.vy+=.065;p.life--;if(p.life<=0){splashes.splice(i,1);continue}ctx.globalAlpha=p.life/p.max*.95;ctx.strokeStyle="#fff";ctx.lineWidth=p.size;ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(p.x-p.vx*1.8,p.y-p.vy*1.8);ctx.stroke()}}
function frame(time){const tr=transform(time);ctx.globalAlpha=1;ctx.fillStyle="#000";ctx.fillRect(0,0,W,H);rain(backRain,false,tr);animateShape(time,tr);rain(frontRain,true,tr);drawSplashes();requestAnimationFrame(frame)}
addEventListener("resize",resize);resize();requestAnimationFrame(frame);
</script></body></html>`;
