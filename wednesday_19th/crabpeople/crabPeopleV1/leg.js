function Leg(vS, mode){

	this.legLength = 120;

	this.vS = vS;
	this.mode = mode;

	this.vE = new THREE.Vector2();
	this.vM = new THREE.Vector2();
	this.vCS = new THREE.Vector2();
	this.vCE = new THREE.Vector2();

	this.bonePts = [];

	this.initMeshes = function(){
		this.mtrlBlack = new THREE.MeshBasicMaterial( { color: 0x000000 } );
		this.legGeo = new THREE.Geometry();
		for(var i=0; i<40; i++){
			this.legGeo.vertices.push(new THREE.Vector3());
		}
		for(var i=0; i<38; i+=2){
			this.legGeo.faces.push(new THREE.Face3( i+1, i+2, i+3 ));
			this.legGeo.faces.push(new THREE.Face3( i, i+2, i+1 ));
		}
		this.legMesh = new THREE.Mesh( this.legGeo, this.mtrlBlack ) ;
		scene.add( this.legMesh );
	}

	this.update = function(tgt){

		var diff = tgt.clone();
		diff.sub(this. vS);
		var d = diff.length();

		if(d >= 2*this.legLength){
			diff.normalize();
			diff.multiplyScalar(this.legLength);
			this.vM.set(
				this.vS.x + diff.x, 
				this.vS.y + diff.y, 
			);
			this.vE.set(
				this.vM.x + diff.x, 
				this.vM.y + diff.y, 
			);
		}else{
			this.vE.set(tgt.x, tgt.y);
      		if(this.mode == 0) diff.set(diff.y, -diff.x);
      		else diff.set(-diff.y, diff.x);
      		diff.normalize();
      		diff.multiplyScalar(Math.sqrt(Math.pow(this.legLength, 2)-Math.pow(d*.5, 2)));
      		this.vM.set(
      			(this.vS.x+this.vE.x)*.5+diff.x,
      			(this.vS.y+this.vE.y)*.5+diff.y
      		);
		}

		this.vCS = this.vS.clone();
		this.vCS.sub(this.vM);
		this.vCS.multiplyScalar(.1);
		this.vCS.add(this.vS);

		this.vCE = this.vE.clone();
		this.vCE.sub(this.vM);
		this.vCE.multiplyScalar(.1);
		this.vCE.add(this.vE);

		this.updateLegShape();
	}

	this.updateLegShape = function(){
		var curve = new THREE.SplineCurve([this.vCS, this.vS, this.vM, this.vE, this.vCE]);
		this.bonePts = curve.getPoints( 19 );

		this.legGeo.verticesNeedUpdate = true;
		for(var i=0; i<this.bonePts.length; i++){
			var j = i*2;
			var k = j+1;
			if(i==0){
				this.legGeo.vertices[j].set(this.bonePts[i].x-this.bonePts[i+1].x, this.bonePts[i].y-this.bonePts[i+1].y, 0);
				this.legGeo.vertices[j].normalize();
				this.legGeo.vertices[k].set(this.legGeo.vertices[j].x, this.legGeo.vertices[j].y, this.legGeo.vertices[j].z);
			}else if(i==this.bonePts.length-1){
				this.legGeo.vertices[j].set(this.bonePts[i-1].x-this.bonePts[i].x, this.bonePts[i-1].y-this.bonePts[i].y, 0);
				this.legGeo.vertices[j].normalize();
				this.legGeo.vertices[k].set(this.legGeo.vertices[j].x, this.legGeo.vertices[j].y, this.legGeo.vertices[j].z);
			}else {
				this.legGeo.vertices[j].set(
					(this.bonePts[i].x - this.bonePts[i+1].x + this.bonePts[i-1].x - this.bonePts[i].x)*.25,
					(this.bonePts[i].y - this.bonePts[i+1].y + this.bonePts[i-1].y - this.bonePts[i].y)*.25,
					0
				);
				this.legGeo.vertices[j].normalize();
				this.legGeo.vertices[k].set(this.legGeo.vertices[j].x, this.legGeo.vertices[j].y, this.legGeo.vertices[j].z);
			}
			this.legGeo.vertices[j].set(-this.legGeo.vertices[j].y, this.legGeo.vertices[j].x, 0);
			this.legGeo.vertices[k].set(this.legGeo.vertices[k].y, -this.legGeo.vertices[k].x, 0);
			this.legGeo.vertices[j].multiplyScalar(6);
			this.legGeo.vertices[k].multiplyScalar(6);
			this.legGeo.vertices[j].set(
				this.legGeo.vertices[j].x+this.bonePts[i].x,
				this.legGeo.vertices[j].y+this.bonePts[i].y,
				-2
			);
			this.legGeo.vertices[k].set(
				this.legGeo.vertices[k].x+this.bonePts[i].x,
				this.legGeo.vertices[k].y+this.bonePts[i].y,
				-2
			);
		}
	}

	this.initMeshes();
}