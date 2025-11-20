var scene, camera, renderer, screenW, screenH;
var mousePos, mouseButton;
var f = 0;
var testBody;
var isMobile = false;

function init(){

	if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
 		isMobile = true;
	}

	scene = new THREE.Scene();
	scene.background = new THREE.Color( 0xffffff );
	camera = new THREE.PerspectiveCamera(60, window.innerWidth/window.innerHeight, .1, 20000);
	renderer = new THREE.WebGLRenderer();//{ antialias: true });
	renderer.setSize(window.innerWidth, window.innerHeight);

	screenW = renderer.getSize().width;
	screenH = renderer.getSize().height;
	
	console.log("Screen - w: "+screenW + ", h: "+screenH);

	document.body.appendChild(renderer.domElement);
	document.addEventListener('contextmenu', event => event.preventDefault());

	camera.position.set(screenW*.5, screenH*.5, screenH*.5/Math.tan(Math.PI/6.0));

	mousePos = new THREE.Vector2();

	testBody = new Body(screenW*.5, screenH*.5);

}

function animate(){
	requestAnimationFrame(animate);
	f++;
	testBody.update();
	renderer.render(scene, camera);
}

document.onkeyup = function(e){
	//if(e.key == "~"){
	//	console.log("");
	//}
}

document.onmousemove = function(e){
	if(!isMobile) mousePos.set(e.clientX, screenH-e.clientY);
}

document.onmousedown = function(e){
	// if(e.buttons == 1){//LEFT
	// 	mouseButton = 0;
	// }else if(e.buttons == 2){//RIGHT
	// 	mouseButton = 1;
	// }
}

document.onmouseup = function(e){

}

document.ontouchstart = function(e){
	if(isMobile) mousePos.set(e.touches[0].clientX, screenH-e.touches[0].clientY);
}

document.ontouchmove = function(e){
	if(isMobile) mousePos.set(e.touches[0].clientX, screenH-e.touches[0].clientY);
}

init();
animate();