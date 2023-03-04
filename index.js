const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

ctx.fillStyle = "white";
ctx.strokeStyle = "white";
ctx.lineWidth = 1;

class Particle {
  constructor(effect) {
    this.effect = effect;
    this.x = Math.floor(Math.random() * this.effect.width);
    this.y = Math.floor(Math.random() * this.effect.height);
    this.speedX;
    this.speedY;
    this.speedModifier = Math.floor(Math.random() * 3 + 1);
    this.history = [{ x: this.x, y: this.y }];
    this.maxLength = Math.floor(Math.random() * 200 + 10);
    this.angle = 0;
    this.timer = this.maxLength * 2;

    this.colors = ["red", "white", "black"];

    this.color = this.colors[Math.floor(Math.random() * this.colors.length)];
  }

  draw(ctx) {
    // ctx.fillRect(this.x, this.y, 10, 10);
    ctx.beginPath();
    ctx.moveTo(this.history[0].x, this.history[0].y);
    for (let i = 0; i < this.history.length; i++) {
      ctx.lineTo(this.history[i].x, this.history[i].y);
    }
    ctx.strokeStyle = this.color;
    ctx.stroke();
  }

  update() {
    this.timer--;
    if (this.timer >= 1) {
      let x = Math.floor(this.x / this.effect.cellSize);
      let y = Math.floor(this.y / this.effect.cellSize);
      let index = x + y * this.effect.cols;
      this.angle = this.effect.flowField[index];

      this.speedX = Math.cos(this.angle);
      this.speedY = Math.sin(this.angle);
      this.x += this.speedX * this.speedModifier;
      this.y += this.speedY * this.speedModifier;

      //  change the directions of particles here
      // this.angle += 0.5;
      // this.x += this.speedX + Math.sign(this.angle);
      // this.y += this.speedY + Math.cos(this.angle);
      this.history.push({ x: this.x, y: this.y });

      if (this.history.length > this.maxLength) {
        this.history.shift();
      }
    } else if (this.history.length > 1) {
      this.history.shift();
    } else {
      this.reset();
      this.timer = this.maxLength * 2;
    }
  }

  reset() {
    this.x = Math.floor(Math.random() * this.effect.width);
    this.y = Math.floor(Math.random() * this.effect.height);
    this.history = [{ x: this.x, y: this.y }];
  }
}

class Effect {
    constructor(width, height) {
      
    this.width = width;
    this.height = height;
    this.particles = [];
    this.numberOfParticles = 500;
    this.cellSize = 30;
    this.rows;
    this.cols;
    this.flowField = [];
    this.curve = 2.9;
    this.zoom = 0.04;

    this.init();
    window.addEventListener("resize", (e) => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      this.init();
    });
  }

  init() {
    //  flow field
    this.rows = Math.floor(this.height / this.cellSize);
    this.cols = Math.floor(this.width / this.cellSize);
    this.flowField = [];
    for (let y = 0; y < this.rows; y++) {
      for (let x = 0; x < this.cols; x++) {
        let angle =
          (Math.cos(x * this.zoom) + Math.sin(y * this.zoom)) * this.curve;
        this.flowField.push(angle);
      }
    }

    // particles
    for (let i = 0; i < this.numberOfParticles; i++) {
      this.particles.push(new Particle(this));
    }
  }

  drawGrid(context) {
    for (let c = 0; c < this.cols; c++) {
      context.beginPath();
      context.moveTo(c * this.cellSize, 0);
      context.lineTo(c * this.cellSize, this.height);
      context.stroke();
    }
    for (let r = 0; r < this.rows; r++) {
      context.beginPath();
      context.moveTo(0, r * this.cellSize);
      context.lineTo(this.width, r * this.cellSize);
      context.stroke();
    }
  }

  render(ctx) {
    // this.drawGrid(ctx);
    this.particles.forEach((particle) => {
      particle.draw(ctx);
      particle.update();
    });
  }
}

const effect = new Effect(canvas.width, canvas.height);
effect.init();

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  effect.render(ctx);
  requestAnimationFrame(animate);
}

animate();

console.log(effect);
