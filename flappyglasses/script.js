// Get the canvas element
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
// Define the character properties
const character = {
    x: 100, // initial x position
    y: 300, // initial y position
    width: 50, // character width
    height: 30, // character height
    speed: 0, // initial speed
    gravity: 0.2, // gravity value
};
// Define the obstacle properties
const obstacles = [];
const obstacleWidth = 200;
const obstacleHeight = 200;
const obstacleGap = 900;
const obstacleSpeed = 2;
// Initialize the score
let score = 0;
// Function to create a new obstacle
function createObstacle() {
    const x = canvas.width + obstacleWidth;
    const topY = Math.random() * (canvas.height / 2); // Random y position for top obstacles
    const bottomY = canvas.height - (Math.random() * (canvas.height / 2) + obstacleHeight); // Random y position for bottom obstacles
    obstacles.push({ x, y: topY, type: 'top' });
    obstacles.push({ x, y: bottomY, type: 'bottom' });
}
// Load the phone images
const iphoneImage = new Image();
iphoneImage.src = 'images/iphone.png';
const samsungImage = new Image();
samsungImage.src = 'images/samsung.png';
// Function to draw an obstacle
function drawObstacle(obstacle) {
    if (obstacle.type === 'top') {
        ctx.drawImage(iphoneImage, obstacle.x, obstacle.y, obstacleWidth, obstacleHeight);
    } else if (obstacle.type === 'bottom') {
        ctx.drawImage(samsungImage, obstacle.x, obstacle.y, obstacleWidth, obstacleHeight);
    }
}
// Function to update the obstacles
function updateObstacles() {
    for (let i = 0; i < obstacles.length; i++) {
        obstacles[i].x -= obstacleSpeed;
        
        if (obstacles[i].x < -obstacleWidth) {
            obstacles.splice(i, 1);
        }
    }
    
    // Create new obstacles with a larger gap between them
    if (obstacles.length === 0 || obstacles[obstacles.length - 1].x < canvas.width - 1200) {
        createObstacle();
    }
}
// Function to create new obstacles
function createNewObstacles() {
    if (Math.random() < 0.05) {
        createObstacle();
    }
}
// Function to check for collisions between the character and obstacles
function checkCollisions() {
    for (let i = 0; i < obstacles.length; i++) {
        const obstacle = obstacles[i];
        
        if (character.x + character.width > obstacle.x &&
            character.x < obstacle.x + obstacleWidth &&
            character.y + character.height > obstacle.y &&
            character.y < obstacle.y + obstacleHeight) {
            return true;
        }
    }
    
    return false;
}
// Function to update the score
function updateScore() {
    for (let i = 0; i < obstacles.length; i++) {
        const obstacle = obstacles[i];
        
        if (character.x > obstacle.x + obstacleWidth && character.x < obstacle.x + obstacleWidth + obstacleSpeed) {
            score++;
        }
    }
}
// Function to draw the score
function drawScore() {
    ctx.font = '24px Arial';
    ctx.fillStyle = '#000';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText(`Score: ${score}`, 10, 10);
}
// Function to draw the game over message
function drawGameOverMessage() {
    ctx.font = '48px Arial';
    ctx.fillStyle = '#000';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Game Over', canvas.width / 2, canvas.height / 2);
}
// Function to handle mouse clicks
function handleMouseClick(event) {
    if (checkCollisions()) {
        // Reset the game state
        score = 0;
        character.x = 100;
        character.y = 300;
        obstacles = [];
    } else {
        // Make the character jump
        character.speed = -6;
    }
}
// Add an event listener for mouse clicks
canvas.addEventListener('click', handleMouseClick);

// Main game loop function
function update() {
    // Update the character position
    character.speed += character.gravity;
    character.y += character.speed;
    
    // Check for collisions with the ground
    if (character.y + character.height > canvas.height) {
        character.y = canvas.height - character.height;
        character.speed = 0;
    }
    
    // Create new obstacles
    createNewObstacles();
    
    // Update the obstacles
    updateObstacles();
    
    // Update the score
    updateScore();
    
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw the background
    ctx.fillStyle = '#f0f0f0';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw the character
    ctx.fillStyle = '#000';
    ctx.fillRect(character.x, character.y, character.width, character.height);
    
    // Draw the obstacles
    for (let i = 0; i < obstacles.length; i++) {
        drawObstacle(obstacles[i]);
    }
    
    // Draw the score
    drawScore();
    
    // Check for game over
    if (checkCollisions()) {
        drawGameOverMessage();
    } else {
        // Request the next frame
        requestAnimationFrame(update);
    }
}
// Start the game loop
update();