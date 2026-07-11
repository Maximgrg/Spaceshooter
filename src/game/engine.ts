import { useGameStore } from '../store/gameStore';

// Entities
interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

class Player implements Rect {
  x: number;
  y: number;
  width = 40;
  height = 40;
  targetX: number;
  targetY: number;
  speed = 0.2; // Interpolation speed for smooth touch movement
  lastFireTime = 0;
  fireRate = 150; // ms

  constructor(canvasWidth: number, canvasHeight: number) {
    this.x = canvasWidth / 2;
    this.y = canvasHeight - 80;
    this.targetX = this.x;
    this.targetY = this.y;
  }

  update(dt: number, canvasWidth: number, canvasHeight: number) {
    // Smooth movement towards target
    this.x += (this.targetX - this.x) * this.speed * (dt / 16);
    this.y += (this.targetY - this.y) * this.speed * (dt / 16);

    // Clamp to screen
    this.x = Math.max(this.width / 2, Math.min(canvasWidth - this.width / 2, this.x));
    this.y = Math.max(this.height / 2, Math.min(canvasHeight - this.height / 2, this.y));
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.translate(this.x, this.y);
    
    // Draw ship
    ctx.fillStyle = '#00f3ff';
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#00f3ff';
    
    ctx.beginPath();
    ctx.moveTo(0, -this.height / 2);
    ctx.lineTo(this.width / 2, this.height / 2);
    ctx.lineTo(0, this.height / 4);
    ctx.lineTo(-this.width / 2, this.height / 2);
    ctx.closePath();
    ctx.fill();

    // Engine exhaust
    ctx.fillStyle = '#ff0055';
    ctx.shadowColor = '#ff0055';
    ctx.beginPath();
    ctx.moveTo(-this.width / 4, this.height / 3);
    ctx.lineTo(0, this.height / 2 + Math.random() * 15);
    ctx.lineTo(this.width / 4, this.height / 3);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  }
}

class Bullet implements Rect {
  x: number;
  y: number;
  width = 6;
  height = 15;
  speed = 0.8;
  markedForDeletion = false;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  update(dt: number) {
    this.y -= this.speed * dt;
    if (this.y < -50) this.markedForDeletion = true;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.fillStyle = '#00ffff';
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#00ffff';
    ctx.fillRect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
    ctx.restore();
  }
}

class Enemy implements Rect {
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
  hp: number;
  maxHp: number;
  markedForDeletion = false;
  wobbleOffset = Math.random() * Math.PI * 2;
  wobbleSpeed = 0.002 + Math.random() * 0.002;

  constructor(canvasWidth: number) {
    this.width = 30 + Math.random() * 20;
    this.height = this.width;
    this.x = Math.random() * (canvasWidth - this.width) + this.width / 2;
    this.y = -this.height;
    this.speed = 0.1 + Math.random() * 0.2;
    this.hp = Math.floor(this.width / 10);
    this.maxHp = this.hp;
  }

  update(dt: number, canvasHeight: number) {
    this.y += this.speed * dt;
    this.x += Math.sin(Date.now() * this.wobbleSpeed + this.wobbleOffset) * 1.5;

    if (this.y > canvasHeight + 50) this.markedForDeletion = true;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.translate(this.x, this.y);
    
    ctx.fillStyle = '#ff0055';
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#ff0055';
    
    // Draw diamond shape
    ctx.beginPath();
    ctx.moveTo(0, -this.height / 2);
    ctx.lineTo(this.width / 2, 0);
    ctx.lineTo(0, this.height / 2);
    ctx.lineTo(-this.width / 2, 0);
    ctx.closePath();
    ctx.fill();
    
    // Core
    ctx.fillStyle = '#ffffff';
    ctx.shadowBlur = 5;
    ctx.beginPath();
    ctx.arc(0, 0, this.width / 6, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }
}

class Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
  markedForDeletion = false;

  constructor(x: number, y: number, color: string) {
    this.x = x;
    this.y = y;
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 3 + 1;
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;
    this.maxLife = 20 + Math.random() * 30;
    this.life = this.maxLife;
    this.color = color;
    this.size = Math.random() * 3 + 1;
  }

  update(dt: number) {
    this.x += this.vx * (dt / 16);
    this.y += this.vy * (dt / 16);
    this.life -= dt / 16;
    if (this.life <= 0) this.markedForDeletion = true;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.globalAlpha = Math.max(0, this.life / this.maxLife);
    ctx.fillStyle = this.color;
    ctx.shadowBlur = 5;
    ctx.shadowColor = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

class Star {
  x: number;
  y: number;
  size: number;
  speed: number;

  constructor(canvasWidth: number, canvasHeight: number) {
    this.x = Math.random() * canvasWidth;
    this.y = Math.random() * canvasHeight;
    this.size = Math.random() * 1.5;
    this.speed = this.size * 0.1;
  }

  update(dt: number, canvasHeight: number) {
    this.y += this.speed * dt;
    if (this.y > canvasHeight) {
      this.y = 0;
      this.x = Math.random() * window.innerWidth;
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

export class GameEngine {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  player!: Player;
  bullets: Bullet[] = [];
  enemies: Enemy[] = [];
  particles: Particle[] = [];
  stars: Star[] = [];
  
  lastTime = 0;
  enemySpawnTimer = 0;
  enemySpawnInterval = 1000;
  
  animationFrameId = 0;
  isRunning = false;
  screenShakeTime = 0;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.resize();
    this.initStars();
  }

  resize() {
    // Handle high DPI displays
    const dpr = window.devicePixelRatio || 1;
    const rect = this.canvas.getBoundingClientRect();
    this.canvas.width = rect.width * dpr;
    this.canvas.height = rect.height * dpr;
    this.ctx.scale(dpr, dpr);
    
    // Ensure player stays on screen after resize
    if (this.player) {
      this.player.x = Math.min(this.player.x, rect.width);
      this.player.y = Math.min(this.player.y, rect.height);
    }
  }

  initStars() {
    this.stars = [];
    const rect = this.canvas.getBoundingClientRect();
    for (let i = 0; i < 100; i++) {
      this.stars.push(new Star(rect.width, rect.height));
    }
  }

  start() {
    const rect = this.canvas.getBoundingClientRect();
    this.player = new Player(rect.width, rect.height);
    this.bullets = [];
    this.enemies = [];
    this.particles = [];
    this.enemySpawnTimer = 0;
    this.enemySpawnInterval = 1500;
    this.lastTime = performance.now();
    this.isRunning = true;
    this.loop(this.lastTime);
  }

  stop() {
    this.isRunning = false;
    cancelAnimationFrame(this.animationFrameId);
  }

  setTargetPosition(x: number, y: number) {
    if (this.player && this.isRunning) {
      this.player.targetX = x;
      // Provide a slight offset so finger doesn't cover the ship
      this.player.targetY = y - 40;
    }
  }

  shakeScreen() {
    this.screenShakeTime = 200; // ms
  }

  checkCollisions() {
    // Bullet vs Enemy
    for (const bullet of this.bullets) {
      for (const enemy of this.enemies) {
        if (bullet.markedForDeletion || enemy.markedForDeletion) continue;
        
        // Simple AABB collision (treating enemy as rect for simplicity)
        if (
          bullet.x < enemy.x + enemy.width / 2 &&
          bullet.x + bullet.width > enemy.x - enemy.width / 2 &&
          bullet.y < enemy.y + enemy.height / 2 &&
          bullet.y + bullet.height > enemy.y - enemy.height / 2
        ) {
          bullet.markedForDeletion = true;
          enemy.hp--;
          
          // Hit particles
          for (let i = 0; i < 5; i++) {
            this.particles.push(new Particle(bullet.x, bullet.y, '#00ffff'));
          }

          if (enemy.hp <= 0) {
            enemy.markedForDeletion = true;
            // Explosion particles
            for (let i = 0; i < 15; i++) {
              this.particles.push(new Particle(enemy.x, enemy.y, '#ff0055'));
            }
            this.shakeScreen();
            
            // Increase score
            const store = useGameStore.getState();
            store.setScore(store.score + 100);
            
            // Difficulty curve
            if (this.enemySpawnInterval > 400) {
              this.enemySpawnInterval -= 20;
            }
          }
        }
      }
    }

    // Player vs Enemy
    for (const enemy of this.enemies) {
      if (enemy.markedForDeletion) continue;
      
      const dx = this.player.x - enemy.x;
      const dy = this.player.y - enemy.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < (this.player.width / 2 + enemy.width / 2) * 0.8) {
        // Player hit
        this.stop();
        
        // Final explosion
        for (let i = 0; i < 50; i++) {
          this.particles.push(new Particle(this.player.x, this.player.y, '#00f3ff'));
          this.particles.push(new Particle(enemy.x, enemy.y, '#ff0055'));
        }
        
        // Update state
        const store = useGameStore.getState();
        if (store.score > store.highScore) {
          store.setHighScore(store.score);
        }
        store.setGameState('GAMEOVER');
        
        // One last render for explosion
        this.draw();
      }
    }
  }

  loop = (timestamp: number) => {
    if (!this.isRunning) return;
    
    let dt = timestamp - this.lastTime;
    if (dt > 100) dt = 16; // Prevent massive jumps if tab is inactive
    this.lastTime = timestamp;

    this.update(dt);
    this.draw();

    this.animationFrameId = requestAnimationFrame(this.loop);
  }

  update(dt: number) {
    const rect = this.canvas.getBoundingClientRect();
    
    // Update Stars
    this.stars.forEach(star => star.update(dt, rect.height));

    if (!this.isRunning) return; // Only stars update if not playing

    // Spawn Enemies
    this.enemySpawnTimer += dt;
    if (this.enemySpawnTimer > this.enemySpawnInterval) {
      this.enemies.push(new Enemy(rect.width));
      this.enemySpawnTimer = 0;
    }

    // Player Fire
    if (this.player) {
      this.player.update(dt, rect.width, rect.height);
      if (performance.now() - this.player.lastFireTime > this.player.fireRate) {
        this.bullets.push(new Bullet(this.player.x, this.player.y - this.player.height / 2));
        this.player.lastFireTime = performance.now();
      }
    }

    // Update entities
    this.bullets.forEach(b => b.update(dt));
    this.enemies.forEach(e => e.update(dt, rect.height));
    this.particles.forEach(p => p.update(dt));

    this.checkCollisions();

    // Clean up
    this.bullets = this.bullets.filter(b => !b.markedForDeletion);
    this.enemies = this.enemies.filter(e => !e.markedForDeletion);
    this.particles = this.particles.filter(p => !p.markedForDeletion);
    
    if (this.screenShakeTime > 0) {
      this.screenShakeTime -= dt;
    }
  }

  draw() {
    const rect = this.canvas.getBoundingClientRect();
    
    this.ctx.fillStyle = '#050510'; // Deep space black
    this.ctx.fillRect(0, 0, rect.width, rect.height);

    this.ctx.save();

    // Apply screen shake
    if (this.screenShakeTime > 0) {
      const shakeMag = (this.screenShakeTime / 200) * 5;
      this.ctx.translate(
        (Math.random() - 0.5) * shakeMag,
        (Math.random() - 0.5) * shakeMag
      );
    }

    // Draw entities
    this.stars.forEach(star => star.draw(this.ctx));
    this.particles.forEach(p => p.draw(this.ctx));
    this.bullets.forEach(b => b.draw(this.ctx));
    this.enemies.forEach(e => e.draw(this.ctx));
    
    if (this.player && this.isRunning) {
      this.player.draw(this.ctx);
    }

    this.ctx.restore();
  }
}
