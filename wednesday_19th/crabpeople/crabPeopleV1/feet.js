function Feet(){

	this.fL = new THREE.Vector2();
	this.fR = new THREE.Vector2();

	this.stepLength = 0;
	this.stepHeight = 0;
	this.stepF = 0;
	this.sXL = 0;
	this.sXR = 0;

	this.triggerStepL = false;
	this.triggerStepR = false;
	this.turnR = true;

	this.stepR = function(foot, stepL, stepH, velMag){
		var itp = THREE.Math.mapLinear(THREE.Math.clamp(velMag, 0, 15), 0, 15, .25, .75);
		this.stepF = THREE.Math.lerp(this.stepF, Math.PI, itp);
		foot.set(
			this.sXR + stepL*this.stepF/Math.PI,
			Math.sin(this.stepF)*stepH
		);

		if(this.stepF >= Math.PI-.01){
			this.stepF = Math.PI;
			this.triggerStepR = false;
			this.turnR = !this.turnR;
		}
	}

	this.stepL = function(foot, stepL, stepH, velMag){
		var itp = THREE.Math.mapLinear(THREE.Math.clamp(velMag, 0, 15), 0, 15, .25, .75);
		this.stepF = THREE.Math.lerp(this.stepF, Math.PI, itp);
		foot.set(
			this.sXL + stepL*this.stepF/Math.PI,
			Math.sin(this.stepF)*stepH
		);

		if(this.stepF >= Math.PI-.01){
			this.stepF = Math.PI;
			this.triggerStepL = false;
			this.turnR = !this.turnR;
		}
	}

	this.update = function(xL, xR, velMag){
		if(this.turnR){
			if (!this.triggerStepR && this.fR.x - xR > 150) {
		        this.triggerStepR = true;
		        this.stepLength = (xR - this.fR.x)+THREE.Math.randFloat(-10, 100);
		        this.stepHeight = Math.abs(this.stepLength * THREE.Math.randFloat(.4, .6));
		        this.sXR = this.fR.x;
		        this.stepF = 0;
		     } else if (!this.triggerStepR && this.fR.x - xR < -25) {
		        this.triggerStepR = true;
		        this.stepLength = (xR - this.fR.x)+THREE.Math.randFloat(25, 125);
		        this.stepHeight = Math.abs(this.stepLength * THREE.Math.randFloat(.4, .6));
		        this.sXR = this.fR.x;
		        this.stepF = 0;
		     }
		     if (this.triggerStepR) {
		        this.stepR(this.fR, this.stepLength, this.stepHeight, velMag);
		     }
		}else{
			if (!this.triggerStepL && this.fL.x - xL < -150) {
		        this.triggerStepL = true;
		        this.stepLength = (xL - this.fL.x)+THREE.Math.randFloat(-100, 10);
		        this.stepHeight = Math.abs(this.stepLength * THREE.Math.randFloat(.4, .6));
		        this.sXL = this.fL.x;
		        this.stepF = 0;
		     } else if (!this.triggerStepL && this.fL.x - xL > 25) {
		        this.triggerStepL = true;
		        this.stepLength = (xL - this.fL.x)-THREE.Math.randFloat(25, 125);
		        this.stepHeight = Math.abs(this.stepLength * THREE.Math.randFloat(.4, .6));
		        this.sXL = this.fL.x;
		        this.stepF = 0;
		     }
		     if (this.triggerStepL) {
		        this.stepL(this.fL, this.stepLength, this.stepHeight, velMag);
		     }
		}
	}
}