var utils = {
  norm: function(value, min, max) {
    return (value - min) / (max - min);
  },

  lerp: function(norm, min, max) {
    return (max - min) * norm + min;
  },

  map: function(value, sourceMin, sourceMax, destMin, destMax) {
    return utils.lerp(utils.norm(value, sourceMin, sourceMax), destMin, destMax);
  },

  clamp: function(value, min, max) {
    return Math.min(Math.max(value, Math.min(min, max)), Math.max(min, max));
  },

  distance: function(p0, p1) {
    var dx = p1.x - p0.x,
      dy = p1.y - p0.y;
    return Math.sqrt(dx * dx + dy * dy);
  },

  distanceXY: function(x0, y0, x1, y1) {
    var dx = x1 - x0,
      dy = y1 - y0;
    return Math.sqrt(dx * dx + dy * dy);
  },

  circleCollision: function(c0, c1) {
    return utils.distance(c0, c1) <= c0.radius + c1.radius;
  },

  circlePointCollision: function(x, y, circle) {
    return utils.distanceXY(x, y, circle.x, circle.y) < circle.radius;
  },

  pointInRect: function(x, y, rect) {
    return utils.inRange(x, rect.x, rect.x + rect.radius) &&
      utils.inRange(y, rect.y, rect.y + rect.radius);
  },

  inRange: function(value, min, max) {
    return value >= Math.min(min, max) && value <= Math.max(min, max);
  },

  rangeIntersect: function(min0, max0, min1, max1) {
    return Math.max(min0, max0) >= Math.min(min1, max1) &&
      Math.min(min0, max0) <= Math.max(min1, max1);
  },

  rectIntersect: function(r0, r1) {
    return utils.rangeIntersect(r0.x, r0.x + r0.width, r1.x, r1.x + r1.width) &&
      utils.rangeIntersect(r0.y, r0.y + r0.height, r1.y, r1.y + r1.height);
  },

  degreesToRads: function(degrees) {
    return degrees / 180 * Math.PI;
  },

  radsToDegrees: function(radians) {
    return radians * 180 / Math.PI;
  },

  randomRange: function(min, max) {
    return min + Math.random() * (max - min);
  },

  randomInt: function(min, max) {
    return min + Math.random() * (max - min + 1);
  },

  getmiddle: function(p0, p1) {
    var x = p0.x,
      x2 = p1.x;
    middlex = (x + x2) / 2;
    var y = p0.y,
      y2 = p1.y;
    middley = (y + y2) / 2;
    pos = [middlex, middley];

    return pos;
  },

  getAngle: function(p0, p1) {
    var deltaX = p1.x - p0.x;
    var deltaY = p1.y - p0.y;
    var rad = Math.atan2(deltaY, deltaX);
    return rad;
  },
  inpercentW: function(size) {
    return (size * W) / 100;
  },

  inpercentH: function(size) {
    return (size * H) / 100;
  },
}

function Particle(x, y, type) {
  this.radius = 1.1;
  this.futurRadius = utils.randomInt(radVal, radVal+3); //[1.1,5.1]
  
  this.rebond = utils.randomInt(1, 5);
  this.x = x;
  this.y = y;
  
  this.dying = false;
  
  this.base = [x, y];

  this.vx = 0;
  this.vy = 0;
  this.type = type;
  this.friction = .99;
  this.gravity = graVal;
  this.color = colors[Math.floor(Math.random() * colors.length)];

  this.getSpeed = function() {
    return Math.sqrt(this.vx * this.vx + this.vy * this.vy);
  };

  this.setSpeed = function(speed) {
    var heading = this.getHeading();
    this.vx = Math.cos(heading) * speed;
    this.vy = Math.sin(heading) * speed;
  };

  this.getHeading = function() {
    return Math.atan2(this.vy, this.vx);
  };

  this.setHeading = function(heading) {
    var speed = this.getSpeed();
    this.vx = Math.cos(heading) * speed;
    this.vy = Math.sin(heading) * speed;
  };

  this.update = function(heading) {
    this.x += this.vx;
    this.y += this.vy;
    this.vy += graVal;

    this.vx *= this.friction;
    this.vy *= this.friction;
    
    if(this.radius < this.futurRadius && this.dying === false){
      this.radius += durVal;
    }else{
      this.dying = true;
    }
      
    if(this.dying === true){
      this.radius -= durVal;
    }
    
    if(type === "ball"){
      context.save();
      context.fillStyle = this.color;
      context.beginPath();
      context.arc(this.x, this.y, this.radius, Math.PI * 2, false);
      context.closePath();
      context.fill();
      context.restore();
    }

    if(type === "rect"){
      context.save();
      context.fillStyle = this.color;
      context.beginPath();
      context.fillRect(this.x, this.y, this.futurRadius, this.futurRadius)
      context.closePath();
      context.fill();
      context.restore();
    }
    

    if (this.y < 0 || this.radius < 1) {
      this.x = this.base[0];
      this.y = this.base[1];
      this.dying = false;
      this.radius = 1.1;
      this.setSpeed(spdVal);
      this.futurRadius = utils.randomInt(radVal, radVal+3);  
      this.setHeading(utils.randomInt(utils.degreesToRads(0), utils.degreesToRads(360)));
    }

  }

  this.setSpeed(utils.randomInt(.1, .5));
  this.setHeading(utils.randomInt(utils.degreesToRads(0), utils.degreesToRads(360)));
}
function Shape(x, y, texte){
	this.x = x;
	this.y = y;
	this.size = 100;

	this.text = texte;
	this.placement = [];
	//this.vectors = [];
}

Shape.prototype.getValue = function(){
	//draw the shape
	 context.textAlign = "center";
	 context.font =  this.size + "px arial";
	 context.fillText(this.text, this.x, this.y);

	 var idata = context.getImageData(0, 0, W, H);
	 var buffer32 = new Uint32Array(idata.data.buffer);

	 for(var j=0; j < H; j += gridY){
	 	for(var i=0 ; i < W; i += gridX){
	 		if(buffer32[j * W + i]){
	 			var particle = new Particle(i, j, type);
	 			this.placement.push(particle);
	 		}
	 	}
	 }
    
    context.clearRect(0, 0, W, H);
}

var canvas = document.getElementById('canvas');
	context = canvas.getContext('2d');
	W = canvas.width = 600;
 	H = canvas.height = 300;
	gridY = 7, gridX = 9;

	type = "ball";

   	colors = [
   		'#5C3D46', '#5C868D', '#99BFAA', '#C8D6CA', '#1ecfd5',
   		'#aba5bf', '#5a5776', '#f1e0d6', '#ed6c82', '#a4978e',
   		'#bf9064', '#dab4d9', '#f3eaed', '#ebf2ea', '#d4dca9',
   		'#bf9d7a', '#80add7', '#f3d3a0', '#d8d584', '#9199be',
	];

   graVal = parseFloat(0);
   durVal = parseFloat(0.2);
   spdVal = parseFloat(0.05);
   radVal = parseFloat(2);
   resVal = parseFloat(4);	   

var word = new Shape(W/2, H/2, "橙子安全");
	word.getValue();

(function drawFrame(){
	window.requestAnimationFrame(drawFrame, canvas);
	context.clearRect(0, 0, W, H);

	for(var i=0; i< word.placement.length; i++){
		word.placement[i].update();
	}
}())

//resize
function resize(){
	W = canvas.width = window.innerWidth;
 	H = canvas.height = window.innerHeight;
}

window.addEventListener('resize', resize, false);
