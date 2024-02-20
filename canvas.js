const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth - 5;
canvas.height = window.innerHeight - 5;

const mouse = {
  x: 75,
  y: canvas.height / 2,
};
const retardation = 0.1;
var timestamp = 0;
var mY = 0,
  mX = 0;

addEventListener("mousemove", (event) => {
  mouse.x = event.clientX;
  mouse.y = event.clientY;

  var now = Date.now();
  currentmY = event.screenY;
  currentmX = event.screenX;

  var dt = now - timestamp;
  var distanceY = currentmY - mY;
  var distanceX = currentmX - mX;
  var speedY = Math.round((distanceY / dt) * 40); //multiplied by 40 for good game experience
  var speedX = Math.round((distanceX / dt) * 40);
  striker1.velocity.y = speedY;
  striker1.velocity.x = speedX;
  mX = currentmX;
  mY = currentmY;
  timestamp = now;
});

addEventListener("resize", () => {
  canvas.width = window.innerWidth - 5;
  canvas.height = window.innerHeight - 5;
  init();
});

let striker1 = {
  x: mouse.x,
  y: mouse.y,
  radius: 40,
  velocity: {
    x: 0,
    y: 0,
  },
  color: "red",
  mass: 1,
};

let striker2 = {
  x: canvas.width - 75,
  y: canvas.height / 2,
  radius: 40,
  velocity: {
    x: 0,
    y: 0,
  },  
  color: "blue",
  mass: 1,
};

let coin = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  radius: 15,
  velocity: {
    x: 0,
    y: 0,
  },
  color: "black",
  mass: 0.5,
};

function calcDistance(striker, coin) {
  return Math.sqrt(
    Math.pow(striker.x - coin.x, 2) + Math.pow(striker.y - coin.y, 2)
  );
}

function rotate(velocity, angle) {
  const rotatedVelocities = {
    x: velocity.x * Math.cos(angle) - velocity.y * Math.sin(angle),
    y: velocity.x * Math.sin(angle) + velocity.y * Math.cos(angle),
  };

  return rotatedVelocities;
}

function resolveCollision(particle, otherParticle) {
  const xVelocityDiff = particle.velocity.x - otherParticle.velocity.x;
  const yVelocityDiff = particle.velocity.y - otherParticle.velocity.y;

  const xDist = otherParticle.x - particle.x;
  const yDist = otherParticle.y - particle.y;

  // Prevent accidental overlap of particles
  if (xVelocityDiff * xDist + yVelocityDiff * yDist >= 0) {
    // Grab angle between the two colliding particles
    const angle = -Math.atan2(
      otherParticle.y - particle.y,
      otherParticle.x - particle.x
    );

    // Store mass in var for better readability in collision equation
    const m1 = particle.mass;
    const m2 = otherParticle.mass;

    // Velocity before equation
    const u1 = rotate(particle.velocity, angle);
    const u2 = rotate(otherParticle.velocity, angle);

    // Velocity after 1d collision equation
    const v2 = {
      x: (u2.x * (m1 - m2)) / (m1 + m2) + (u1.x * 2 * m2) / (m1 + m2),
      y: u2.y,
    };

    const vFinal2 = rotate(v2, -angle);

    particle.velocity.x = 0;
    particle.velocity.y = 0;
    otherParticle.velocity.x = vFinal2.x;
    otherParticle.velocity.y = vFinal2.y;
  }
}

function moveCoin(coin) {
  if (Math.abs(Math.round(coin.velocity.x)) === 0) coin.velocity.x = 0;
  if (Math.abs(Math.round(coin.velocity.y)) === 0) coin.velocity.y = 0;
  if (coin.velocity.x > 0) {
    coin.velocity.x -= retardation;
  } else if (coin.velocity.x < 0) {
    coin.velocity.x += retardation;
  }
  if (coin.velocity.y > 0) {
    coin.velocity.y -= retardation;
  } else if (coin.velocity.y < 0) {
    coin.velocity.y += retardation;
  }
  coin.x += coin.velocity.x;
  coin.y += coin.velocity.y;
}

function draw(obj) {
  ctx.fillStyle = obj.color;
  ctx.beginPath();
  ctx.arc(obj.x, obj.y, obj.radius, 0, 2 * Math.PI);
  ctx.fill();
}

function init() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  draw(striker1);
  draw(striker2);
  moveCoin(coin);
  draw(coin);
}

const animate = () => {
  requestAnimationFrame(animate);
  striker1.x = mouse.x;
  striker1.y = mouse.y;
  if (calcDistance(striker1, coin) < striker1.radius + coin.radius) {
    resolveCollision(striker1, coin);
  }
  if (calcDistance(striker2, coin) < striker2.radius + coin.radius) {
    resolveCollision(striker2, coin);
  }
  if (coin.x < 0 || coin.x > canvas.width) {
    coin.velocity.x = -coin.velocity.x;
  }
  if (coin.y < 0 || coin.y > canvas.height) {
    coin.velocity.y = -coin.velocity.y;
  }
  init();
};

animate();
