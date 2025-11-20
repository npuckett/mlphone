function Body(initX, initY){

	this.pos = new THREE.Vector2(initX, initY);
	this.vel = new THREE.Vector2();
	this.acc = new THREE.Vector2();
	this.tgt = new THREE.Vector2();

	this.eyeL = new THREE.Vector2();
	this.eyeR = new THREE.Vector2();
	this.pupilL = new THREE.Vector2();
	this.pupilR = new THREE.Vector2();

	this.vts = [];
	for(var i=0; i<4; i++){
		this.vts.push(new THREE.Vector2());
	}

	this.bdVts = [];
	for(var i=0; i<10; i++){
		this.bdVts.push(new THREE.Vector2());
	}

	this.legRoots = [];
	for(var i=0; i<6; i++){
		this.legRoots.push(new THREE.Vector2());
	}

	this.feet = [];
	for(var i=0; i<3; i++){
		this.feet.push(new Feet());
	}

	this.legsR = [];
	this.legsL = [];
	for(var i=0; i<3; i++){
      this.legsL[i] = new Leg(this.legRoots[i], 0);
      this.legsR[i] = new Leg(this.legRoots[this.legRoots.length-1-i], 1);
	}

	this.decay = .8;
	this.w = 200;
	this.h = 100;
	this.rotZ = 0;
	this.rFOfst = 0;
	this.eyeYOfst = 0;
	this.eyeH = 48;
	this.blinking = false;
	this.blinkF = Math.PI*.5;

	this.initMeshes = function(){
		this.mtrlBlack = new THREE.MeshBasicMaterial( { color: 0x000000 } );
		this.mtrlWhite = new THREE.MeshBasicMaterial( { color: 0xffffff } );
		this.eyes = [];
		var eyeGeo = new THREE.CircleGeometry( 24, 20 );
		this.eyes[0] = new THREE.Mesh( eyeGeo, this.mtrlWhite );
		this.eyes[1] = new THREE.Mesh( eyeGeo, this.mtrlWhite );
		scene.add( this.eyes[0] );
		scene.add( this.eyes[1] );

		this.pupils = [];
		var pupilGeo = new THREE.CircleGeometry( 10, 10 );
		this.pupils[0] = new THREE.Mesh( pupilGeo, this.mtrlBlack );
		this.pupils[1] = new THREE.Mesh( pupilGeo, this.mtrlBlack );
		scene.add( this.pupils[0] );
		scene.add( this.pupils[1] );

		this.spcls = [];
		var spclGeo = new THREE.CircleGeometry( 1.5, 10 );
		this.spcls[0] = new THREE.Mesh( spclGeo, this.mtrlWhite );
		this.spcls[1] = new THREE.Mesh( spclGeo, this.mtrlWhite );
		scene.add( this.spcls[0] );
		scene.add( this.spcls[1] );
	}

	this.updateBodyFrame = function(){

		var minY = this.h*.6;
		var maxY = this.h*2-THREE.Math.mapLinear(THREE.Math.clamp(this.vel.length(), 0, 15), 0, 15, -this.h*.2, this.h*.2);

		this.acc.set(
      		mousePos.x,
      		THREE.Math.clamp(mousePos.y, minY, maxY)
      	);

	    this.acc.sub(this.pos);
	    this.acc.multiplyScalar(.025);
	    this.vel.add(this.acc);
	    this.pos.add(this.vel);
	    this.vel.multiplyScalar(this.decay);

	    this.rotZ = THREE.Math.mapLinear(THREE.Math.clamp(this.vel.x, -25, 25), -25, 25, Math.PI*.0625, -Math.PI*.0625);

	    this.vts[0].set(-this.w*.5, this.h*.5);
    	this.vts[1].set(this.w*.5, this.h*.5);
    	this.vts[2].set(this.w*.5, -this.h*.5);
    	this.vts[3].set(-this.w*.5, -this.h*.5);

    	var rotCenter = new THREE.Vector2(0, 0);

    	for (var i=0; i<this.vts.length; i++) {
      		this.vts[i].rotateAround(rotCenter, this.rotZ);
      		this.vts[i].add(this.pos);
    	}

    	var tmpItp = 0;
    	for (var i=0; i<this.legRoots.length; i++) {
	      if (i<this.legRoots.length/2) {
	        tmpItp = THREE.Math.mapLinear(i, 0, this.legRoots.length/2-1, 0, .25);
	      } else {
	        tmpItp = THREE.Math.mapLinear(i, this.legRoots.length/2, this.legRoots.length-1, .75, 1);
	      }
	      this.legRoots[i].set(
	      	THREE.Math.lerp(this.vts[3].x, this.vts[2].x, tmpItp),
	      	THREE.Math.lerp(this.vts[3].y, this.vts[2].y, tmpItp)
	      );
	    }
	}

	this.updateBody = function(){
		var rotCenter = new THREE.Vector2(0, 0);
		for (var i=0; i<this.bdVts.length; i++) {

	      var tmpRdns = i*1.0/(this.bdVts.length-1)*Math.PI*2-Math.PI*.5;
	      var r = 0;

	      if (tmpRdns<Math.PI*.5) r = THREE.Math.mapLinear(Math.abs(tmpRdns), 0, Math.PI*.5, 150, 100);
	      else r = THREE.Math.mapLinear(Math.abs(tmpRdns-Math.PI), 0, Math.PI*.5, 150, 100);

	      var rOfstRange = THREE.Math.mapLinear(THREE.Math.clamp(this.vel.length(), 0, 20), 0, 20, 50, 75);

		  var rOfst = noise.simplex2(Math.cos(tmpRdns)*.25+this.rFOfst, Math.sin(tmpRdns)*.25)*rOfstRange*.5;
	      //var rOfst = noise.simplex2(i*.15+this.rFOfst, 0)*rOfstRange*.5;
	      
	      this.bdVts[i].set(Math.cos(tmpRdns)*(r+rOfst),
	      			   Math.sin(tmpRdns)*(r+rOfst));
	      this.bdVts[i].rotateAround(rotCenter, this.rotZ);
	      this.bdVts[i].add(this.pos);
	    }
	    this.rFOfst += THREE.Math.mapLinear(THREE.Math.clamp(this.vel.length(), 0, 20), 0, 20, .0025, .1);
	}

	this.updateBodyShape = function(){
		scene.remove(this.bodyMesh);
		var curve = new THREE.SplineCurve( this.bdVts );
		var tmpPts = curve.getPoints( 30 );
		var tmpShape = new THREE.Shape( tmpPts );
		this.bodyGeo = new THREE.ShapeGeometry( tmpShape );
		this.bodyMesh = new THREE.Mesh( this.bodyGeo, this.mtrlBlack ) ;
		this.bodyMesh.position.set(0, 0, -1);
		scene.add( this.bodyMesh );
	}

	this.updateEyes = function(){

		this.eyeYOfst = THREE.Math.lerp(this.eyeYOfst, THREE.Math.mapLinear(THREE.Math.clamp(mousePos.y-this.pos.y, 0, 100), 0, 100, -40, 0), .125);
    
	    this.eyeR.set(
	    	THREE.Math.lerp((this.bdVts[5].x+this.bdVts[6].x)*.5, this.pos.x, .5),
	    	THREE.Math.lerp((this.bdVts[5].y+this.bdVts[6].y)*.5, this.pos.y, .5)+this.eyeYOfst
	    );
	    
	    this.eyeL.set(
	    	THREE.Math.lerp((this.bdVts[3].x+this.bdVts[4].x)*.5, this.pos.x, .5),
	    	THREE.Math.lerp((this.bdVts[3].y+this.bdVts[4].y)*.5, this.pos.y, .5)+this.eyeYOfst
	    );
	    
	    this.pupilL.set(
	    	THREE.Math.lerp(this.pupilL.x, mousePos.x, .2),
	    	THREE.Math.lerp(this.pupilL.y, mousePos.y, .2)
	    );

	    this.pupilR.set(
	    	THREE.Math.lerp(this.pupilR.x, mousePos.x, .2),
	    	THREE.Math.lerp(this.pupilR.y, mousePos.y, .2)
	    );
	    
	    this.pupilL.x = THREE.Math.clamp(this.pupilL.x, this.eyeL.x-40*0.25, this.eyeL.x+40*0.25);
	    this.pupilL.y = THREE.Math.clamp(this.pupilL.y, this.eyeL.y-this.eyeH*0.25, this.eyeL.y+this.eyeH*0.25);
	    
	    this.pupilR.x = THREE.Math.clamp(this.pupilR.x, this.eyeR.x-40*0.25, this.eyeR.x+40*0.25);
	    this.pupilR.y = THREE.Math.clamp(this.pupilR.y, this.eyeR.y-this.eyeH*0.25, this.eyeR.y+this.eyeH*0.25);
	}

	this.blink = function(){
		if (!this.blinking) {
	      this.eyeH = 48;
	    } else {
	      this.eyeH = 48*Math.abs(Math.sin(this.blinkF))*.8;
	      if (this.blinkF<Math.PI*1.5) {
	        this.blinkF += Math.PI*.1;
	      } else {
	        this.blinkF = Math.PI*.5;
	        this.blinking = false;
	      }
	    }
	}

	this.updateEyesShape = function(){
		this.eyes[0].position.set(this.eyeL.x, this.eyeL.y, 0);
		this.eyes[1].position.set(this.eyeR.x, this.eyeR.y, 0);
		this.eyes[0].scale.set(1, this.eyeH/48.0, 1);
		this.eyes[1].scale.set(1, this.eyeH/48.0, 1);

		this.pupils[0].position.set(this.pupilL.x, this.pupilL.y, 2);
		this.pupils[1].position.set(this.pupilR.x, this.pupilR.y, 2);

		this.spcls[0].position.set(this.pupilL.x, this.pupilL.y, 4);
		this.spcls[1].position.set(this.pupilR.x, this.pupilR.y, 4);
	}

	this.updateLegsAndFeet = function(){
		for (var i=0; i<this.feet.length; i++) {
	      this.feet[i].update(
	      	this.legRoots[i].x,
	      	this.legRoots[this.legRoots.length-1-i].x,
	      	this.vel.length()
	      );
	    }

	    for (var i=0; i<this.legsR.length; i++) {
	      this.legsR[i].update(this.feet[i].fR);
	      this.legsL[i].update(this.feet[i].fL);
	    }
	}

	this.update = function(){
		this.updateBodyFrame();
		this.updateBody();
		this.updateBodyShape();
		this.updateEyes();
		this.updateEyesShape();
		this.updateLegsAndFeet();

		if (f%60 == 0 && Math.random()<.5) {
	      this.blinking = true;
	    }

		this.blink();
	}

	this.initMeshes();
}