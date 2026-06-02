import * as THREE from 'https://unpkg.com/three@0.159.0/build/three.module.js';

let m=1;
let k=100;
let c=5;
let F0=20;
let f=2;

const massSlider=document.getElementById("mass");
const stiffSlider=document.getElementById("stiffness");
const dampSlider=document.getElementById("damping");
const freqSlider=document.getElementById("freq");
const forceSlider=document.getElementById("force");

massSlider.oninput=()=>{
m=parseFloat(massSlider.value);
document.getElementById("massVal").textContent=m;
updateCharts();
};

stiffSlider.oninput=()=>{
k=parseFloat(stiffSlider.value);
document.getElementById("stiffnessVal").textContent=k;
updateCharts();
};

dampSlider.oninput=()=>{
c=parseFloat(dampSlider.value);
document.getElementById("dampingVal").textContent=c;
updateCharts();
};

freqSlider.oninput=()=>{
f=parseFloat(freqSlider.value);
document.getElementById("freqVal").textContent=f;
updateCharts();
};

forceSlider.oninput=()=>{
F0=parseFloat(forceSlider.value);
document.getElementById("forceVal").textContent=F0;
updateCharts();
};

const container=document.getElementById("canvas-container");

const scene=new THREE.Scene();
scene.background=new THREE.Color(0x08111f);

const camera=new THREE.PerspectiveCamera(
60,
container.clientWidth/container.clientHeight,
0.1,
1000
);

camera.position.set(0,3,8);

const renderer=new THREE.WebGLRenderer({
antialias:true
});

renderer.setSize(
container.clientWidth,
container.clientHeight
);

container.appendChild(renderer.domElement);

const ambient=new THREE.AmbientLight(0xffffff,1);
scene.add(ambient);

const dir=new THREE.DirectionalLight(0xffffff,2);
dir.position.set(5,10,5);
scene.add(dir);

const base=new THREE.Mesh(
new THREE.BoxGeometry(4,0.5,4),
new THREE.MeshStandardMaterial({
color:0x333333
})
);

scene.add(base);

const spring=new THREE.Mesh(
new THREE.CylinderGeometry(0.2,0.2,2,16),
new THREE.MeshStandardMaterial({
color:0x00ffff
})
);

spring.position.y=1.25;
scene.add(spring);

const toy=new THREE.Mesh(
new THREE.SphereGeometry(0.7,32,32),
new THREE.MeshStandardMaterial({
color:0xff4444
})
);

toy.position.y=2.5;
scene.add(toy);

let time=0;

const freqCtx=document.getElementById("freqChart");

const freqChart=new Chart(freqCtx,{
type:'line',
data:{
labels:[],
datasets:[{
label:'Amplitude',
data:[]
}]
}
});

const timeCtx=document.getElementById("timeChart");

const timeChart=new Chart(timeCtx,{
type:'line',
data:{
labels:[],
datasets:[{
label:'Displacement',
data:[]
}]
}
});

function updateCharts(){

const fn=(1/(2*Math.PI))*Math.sqrt(k/m);

document.getElementById("fn").textContent=
fn.toFixed(2);

const w=2*Math.PI*f;

const amp=
F0/
Math.sqrt(
Math.pow(k-m*w*w,2)+
Math.pow(c*w,2)
);

document.getElementById("amp").textContent=
amp.toFixed(4);

if(Math.abs(f-fn)<0.5){

document.getElementById("status").textContent=
"Near Resonance";

document.getElementById("status").style.color=
"red";

}else{

document.getElementById("status").textContent=
"Stable";

document.getElementById("status").style.color=
"lime";

}

const labels=[];
const amps=[];

for(let freq=0.1;freq<=20;freq+=0.2){

const ww=2*Math.PI*freq;

const A=
F0/
Math.sqrt(
Math.pow(k-m*ww*ww,2)+
Math.pow(c*ww,2)
);

labels.push(freq.toFixed(1));
amps.push(A);

}

freqChart.data.labels=labels;
freqChart.data.datasets[0].data=amps;
freqChart.update();

const tlabels=[];
const tdata=[];

for(let t=0;t<10;t+=0.1){

tlabels.push(t.toFixed(1));

tdata.push(
amp*Math.sin(w*t)
);

}

timeChart.data.labels=tlabels;
timeChart.data.datasets[0].data=tdata;
timeChart.update();

}

updateCharts();

function animate(){

requestAnimationFrame(animate);

time+=0.016;

const w=2*Math.PI*f;

const amp=
F0/
Math.sqrt(
Math.pow(k-m*w*w,2)+
Math.pow(c*w,2)
);

const y=
amp*
Math.sin(w*time);

toy.position.y=
2.5+y*10;

spring.scale.y=
1+y;

spring.position.y=
1.25+(y/2);

toy.rotation.z=
y;

renderer.render(scene,camera);

}

animate();
