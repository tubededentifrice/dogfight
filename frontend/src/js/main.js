import * as THREE from 'three';

// Game variables
let scene, camera, renderer;
let plane, ground, sky;
let propeller;
let clock;
let keyStates = {};
let planeSpeed = 5; // Default speed
const MIN_SPEED = 1;
const MAX_SPEED = 15;
const SPEED_INCREMENT = 1;

// Weapons
let bullets = [];
let rockets = [];
const BULLET_SPEED = 40;
const ROCKET_SPEED = 30;
const BULLET_LIFETIME = 2; // seconds
const ROCKET_LIFETIME = 3; // seconds
let lastBulletTime = 0;
let lastRocketTime = 0;
const BULLET_COOLDOWN = 0.1; // seconds
const ROCKET_COOLDOWN = 1; // seconds

function init() {
  // Create scene
  scene = new THREE.Scene();
  clock = new THREE.Clock();

  // Create camera
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 5, 10);

  // Create renderer
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x87CEEB); // Sky blue
  document.body.appendChild(renderer.domElement);

  // Create lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(0, 10, 5);
  scene.add(directionalLight);

  // Create ground (Minecraft style terrain with trees and rivers)
  const groundSize = 1000;
  const groundSegments = 100;
  const groundGeometry = new THREE.PlaneGeometry(groundSize, groundSize, groundSegments, groundSegments);
  const groundMaterial = new THREE.MeshLambertMaterial({ 
    color: 0x4CAF50,
    flatShading: true 
  });
  ground = new THREE.Mesh(groundGeometry, groundMaterial);
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -5;
  scene.add(ground);
  
  // Add trees and rivers
  createTerrain(groundSize);

  // Create sky (simple blue background is handled by renderer.setClearColor)

  // Create airplane (WW2 Spitfire style with Minecraft aesthetics)
  createPlane();

  // Setup controls
  document.addEventListener('keydown', onKeyDown);
  document.addEventListener('keyup', onKeyUp);
  window.addEventListener('resize', onWindowResize);

  // Start animation loop
  animate();
}

function createPlane() {
  // Create a group to hold all plane parts
  plane = new THREE.Group();
  
  // Colors
  const bodyColor = 0x19396D; // Dark blue (Spitfire blue)
  const wingColor = 0x19396D; // Same blue for consistency
  const accentColor = 0xD3D3D3; // Light gray
  const propellerColor = 0x8B4513; // Brown
  
  // Main body (fuselage) - more aerodynamic shape
  const bodyGeometry = new THREE.BoxGeometry(1.0, 0.8, 5);
  const bodyMaterial = new THREE.MeshLambertMaterial({ color: bodyColor });
  const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
  body.position.y = 0.2; // Raised a bit
  plane.add(body);
  
  // Cockpit
  const cockpitGeometry = new THREE.BoxGeometry(0.8, 0.4, 1.2);
  const cockpitMaterial = new THREE.MeshLambertMaterial({ color: 0x87CEEB, transparent: true, opacity: 0.7 });
  const cockpit = new THREE.Mesh(cockpitGeometry, cockpitMaterial);
  cockpit.position.y = 0.7;
  cockpit.position.z = 0.5;
  plane.add(cockpit);
  
  // Engine cowling (front)
  const cowlingGeometry = new THREE.CylinderGeometry(0.6, 0.5, 1, 8);
  const cowlingMaterial = new THREE.MeshLambertMaterial({ color: accentColor });
  const cowling = new THREE.Mesh(cowlingGeometry, cowlingMaterial);
  cowling.rotation.x = Math.PI / 2;
  cowling.position.z = 2.4;
  cowling.position.y = 0.2;
  plane.add(cowling);
  
  // Wings - elliptical Spitfire style
  const wingShape = new THREE.Shape();
  wingShape.moveTo(0, 0);
  wingShape.quadraticCurveTo(3.5, 0.5, 4, 0); // Curved top edge
  wingShape.lineTo(4, -0.2);
  wingShape.quadraticCurveTo(3.5, -0.7, 0, -0.2); // Curved bottom edge
  wingShape.lineTo(0, 0);
  
  const wingExtrudeSettings = {
    steps: 1,
    depth: 0.8,
    bevelEnabled: false
  };
  
  const wingGeometry = new THREE.ExtrudeGeometry(wingShape, wingExtrudeSettings);
  const wingMaterial = new THREE.MeshLambertMaterial({ color: wingColor });
  
  // Left wing
  const leftWing = new THREE.Mesh(wingGeometry, wingMaterial);
  leftWing.position.set(-0.5, 0.2, 0);
  leftWing.rotation.y = Math.PI / 2;
  plane.add(leftWing);
  
  // Right wing (mirror of left)
  const rightWing = new THREE.Mesh(wingGeometry, wingMaterial);
  rightWing.position.set(0.5, 0.2, 0);
  rightWing.rotation.y = -Math.PI / 2;
  rightWing.scale.x = -1; // Mirror
  plane.add(rightWing);
  
  // Tail
  const tailGeometry = new THREE.BoxGeometry(0.8, 0.6, 1.5);
  const tailMaterial = new THREE.MeshLambertMaterial({ color: bodyColor });
  const tail = new THREE.Mesh(tailGeometry, tailMaterial);
  tail.position.z = -2;
  tail.position.y = 0.2;
  plane.add(tail);
  
  // Vertical stabilizer (taller and more angular)
  const vStabGeometry = new THREE.BoxGeometry(0.1, 1, 1.2);
  const vStabMaterial = new THREE.MeshLambertMaterial({ color: accentColor });
  const vStab = new THREE.Mesh(vStabGeometry, vStabMaterial);
  vStab.position.z = -2.2;
  vStab.position.y = 0.8;
  plane.add(vStab);
  
  // Horizontal stabilizer (more Spitfire-like)
  const hStabGeometry = new THREE.BoxGeometry(2.4, 0.1, 0.6);
  const hStabMaterial = new THREE.MeshLambertMaterial({ color: accentColor });
  const hStab = new THREE.Mesh(hStabGeometry, hStabMaterial);
  hStab.position.z = -2.2;
  hStab.position.y = 0.5;
  plane.add(hStab);
  
  // Propeller hub
  const hubGeometry = new THREE.SphereGeometry(0.2, 8, 8);
  const hubMaterial = new THREE.MeshLambertMaterial({ color: 0x333333 });
  const hub = new THREE.Mesh(hubGeometry, hubMaterial);
  hub.position.z = 2.9;
  hub.position.y = 0.2;
  plane.add(hub);
  
  // Propeller (three blades for Spitfire realism)
  propeller = new THREE.Group();
  
  const bladeGeometry = new THREE.BoxGeometry(0.1, 1.8, 0.2);
  const bladeMaterial = new THREE.MeshLambertMaterial({ color: propellerColor });
  
  // Create three blades at 120 degree spacing
  for (let i = 0; i < 3; i++) {
    const blade = new THREE.Mesh(bladeGeometry, bladeMaterial);
    blade.rotation.z = (Math.PI * 2 / 3) * i;
    propeller.add(blade);
  }
  
  propeller.position.z = 2.95;
  propeller.position.y = 0.2;
  plane.add(propeller);
  
  // Landing gear (retracted position)
  const gearGeometry = new THREE.BoxGeometry(0.2, 0.3, 0.4);
  const gearMaterial = new THREE.MeshLambertMaterial({ color: 0x333333 });
  
  const leftGear = new THREE.Mesh(gearGeometry, gearMaterial);
  leftGear.position.set(-0.8, -0.3, 0.5);
  plane.add(leftGear);
  
  const rightGear = new THREE.Mesh(gearGeometry, gearMaterial);
  rightGear.position.set(0.8, -0.3, 0.5);
  plane.add(rightGear);
  
  // RAF roundel on wings (simplified)
  const roundelGeometry = new THREE.CircleGeometry(0.4, 16);
  const roundelMaterial = new THREE.MeshBasicMaterial({ color: 0xFFFFFF });
  
  const leftRoundel = new THREE.Mesh(roundelGeometry, roundelMaterial);
  leftRoundel.position.set(-2, 0.31, 0.2);
  leftRoundel.rotation.y = Math.PI / 2;
  leftRoundel.rotation.x = -Math.PI / 2;
  plane.add(leftRoundel);
  
  const rightRoundel = new THREE.Mesh(roundelGeometry, roundelMaterial);
  rightRoundel.position.set(2, 0.31, 0.2);
  rightRoundel.rotation.y = Math.PI / 2;
  rightRoundel.rotation.x = -Math.PI / 2;
  plane.add(rightRoundel);
  
  // Add plane to scene
  plane.position.y = 0;
  scene.add(plane);
}

function onKeyDown(event) {
  keyStates[event.code] = true;
}

function onKeyUp(event) {
  keyStates[event.code] = false;
}

function updatePlane() {
  const delta = clock.getDelta();
  const rotateSpeed = 2;
  
  // Always move forward at current speed
  plane.translateZ(planeSpeed * delta);
  
  // Adjust speed with T and G keys
  if (keyStates['KeyT']) {
    planeSpeed = Math.min(planeSpeed + SPEED_INCREMENT * delta, MAX_SPEED);
  }
  if (keyStates['KeyG']) {
    planeSpeed = Math.max(planeSpeed - SPEED_INCREMENT * delta, MIN_SPEED);
  }
  
  // Pitch up/down with Up/Down arrows
  if (keyStates['ArrowUp']) {
    plane.rotation.x -= rotateSpeed * delta;
  }
  if (keyStates['ArrowDown']) {
    plane.rotation.x += rotateSpeed * delta;
  }
  
  // Roll left/right with Left/Right arrows (inverted)
  if (keyStates['ArrowLeft']) {
    plane.rotation.z -= rotateSpeed * delta;
  }
  if (keyStates['ArrowRight']) {
    plane.rotation.z += rotateSpeed * delta;
  }
  
  // Fire bullets with Space
  if (keyStates['Space']) {
    createBullet();
  }
  
  // Fire rockets with C
  if (keyStates['KeyC']) {
    createRocket();
  }
  
  // Rotate propeller based on speed
  if (propeller) {
    propeller.rotation.x += (planeSpeed * 2) * delta;
  }
}

function updateCamera() {
  // Position the camera behind and slightly above the plane
  const offset = new THREE.Vector3(0, 2, -8);
  offset.applyQuaternion(plane.quaternion);
  camera.position.copy(plane.position).add(offset);
  
  // Make the camera look at the plane
  const lookAtPosition = new THREE.Vector3(0, 0, 2);
  lookAtPosition.applyQuaternion(plane.quaternion);
  lookAtPosition.add(plane.position);
  camera.lookAt(lookAtPosition);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

// Function to create Minecraft-style terrain with trees and rivers
function createTerrain(groundSize) {
  const terrainObjects = new THREE.Group();
  const halfSize = groundSize / 2;
  
  // Create a noise map for river placement
  const riverMap = generateSimpleNoiseMap(100, 100);
  
  // Generate trees
  const numTrees = 500; // Number of trees to generate
  for (let i = 0; i < numTrees; i++) {
    const tree = createMinecraftTree();
    
    // Random position within the ground bounds (with some margin)
    const x = Math.random() * (groundSize - 40) - (halfSize - 20);
    const z = Math.random() * (groundSize - 40) - (halfSize - 20);
    
    // Check if position would be in a river by sampling the noise map
    const mapX = Math.floor(((x + halfSize) / groundSize) * 100);
    const mapZ = Math.floor(((z + halfSize) / groundSize) * 100);
    const noiseValue = riverMap[mapX][mapZ];
    
    // Only place tree if not in a river (noise value > 0.3)
    if (noiseValue > 0.3) {
      tree.position.set(x, -4.5, z); // Place on ground
      terrainObjects.add(tree);
    }
  }
  
  // Generate rivers
  const rivers = createRivers(riverMap, groundSize);
  terrainObjects.add(rivers);
  
  scene.add(terrainObjects);
}

// Create a Minecraft style tree
function createMinecraftTree() {
  const tree = new THREE.Group();
  
  // Tree trunk
  const trunkGeometry = new THREE.BoxGeometry(1, 4, 1);
  const trunkMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 }); // Brown
  const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
  trunk.position.y = 2; // Half height of trunk
  tree.add(trunk);
  
  // Tree leaves (cube-shaped canopy)
  const leavesGeometry = new THREE.BoxGeometry(3, 3, 3);
  const leavesMaterial = new THREE.MeshLambertMaterial({ color: 0x228B22 }); // Forest green
  const leaves = new THREE.Mesh(leavesGeometry, leavesMaterial);
  leaves.position.y = 5; // Place on top of trunk
  tree.add(leaves);
  
  return tree;
}

// Create a simple noise map
function generateSimpleNoiseMap(width, height) {
  const map = [];
  
  // Create a 2D array filled with random values
  for (let x = 0; x < width; x++) {
    map[x] = [];
    for (let y = 0; y < height; y++) {
      // Initialize with random values
      map[x][y] = Math.random();
    }
  }
  
  // Simple smoothing pass
  const smoothedMap = [];
  for (let x = 0; x < width; x++) {
    smoothedMap[x] = [];
    for (let y = 0; y < height; y++) {
      let sum = 0;
      let count = 0;
      
      // Sample a 3x3 grid around the current point
      for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
          const nx = x + dx;
          const ny = y + dy;
          
          if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
            sum += map[nx][ny];
            count++;
          }
        }
      }
      
      smoothedMap[x][y] = sum / count;
    }
  }
  
  return smoothedMap;
}

// Create rivers based on the noise map
function createRivers(noiseMap, groundSize) {
  const rivers = new THREE.Group();
  const waterMaterial = new THREE.MeshBasicMaterial({ 
    color: 0x0077be,
    transparent: true,
    opacity: 0.7
  });
  
  const width = noiseMap.length;
  const height = noiseMap[0].length;
  const tileSize = groundSize / width;
  
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      // If the noise value is low enough, place water
      if (noiseMap[x][y] < 0.3) {
        const waterGeometry = new THREE.BoxGeometry(tileSize, 0.5, tileSize);
        const waterTile = new THREE.Mesh(waterGeometry, waterMaterial);
        
        // Position in world coordinates
        const worldX = (x * tileSize) - (groundSize / 2) + (tileSize / 2);
        const worldZ = (y * tileSize) - (groundSize / 2) + (tileSize / 2);
        
        waterTile.position.set(worldX, -4.7, worldZ); // Slightly lower than ground
        rivers.add(waterTile);
      }
    }
  }
  
  return rivers;
}

function createBullet() {
  // Get current time
  const currentTime = clock.getElapsedTime();
  
  // Check cooldown
  if (currentTime - lastBulletTime < BULLET_COOLDOWN) {
    return;
  }
  
  // Create bullet geometry and material
  const bulletGeometry = new THREE.BoxGeometry(0.1, 0.1, 0.3);
  const bulletMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
  
  // Create left and right bullets from wings
  const leftWingPos = new THREE.Vector3(-3.5, 0.2, 0); // Match new wing positions
  leftWingPos.applyQuaternion(plane.quaternion);
  leftWingPos.add(plane.position);
  
  const rightWingPos = new THREE.Vector3(3.5, 0.2, 0); // Match new wing positions
  rightWingPos.applyQuaternion(plane.quaternion);
  rightWingPos.add(plane.position);
  
  // Get direction vector pointing forward along the plane's Z axis
  const direction = new THREE.Vector3(0, 0, 1);
  direction.applyQuaternion(plane.quaternion);
  
  // Left bullet
  const leftBullet = new THREE.Mesh(bulletGeometry, bulletMaterial);
  leftBullet.position.copy(leftWingPos);
  leftBullet.quaternion.copy(plane.quaternion);
  scene.add(leftBullet);
  
  // Right bullet
  const rightBullet = new THREE.Mesh(bulletGeometry, bulletMaterial);
  rightBullet.position.copy(rightWingPos);
  rightBullet.quaternion.copy(plane.quaternion);
  scene.add(rightBullet);
  
  // Add bullets to array with creation time and direction
  bullets.push({
    mesh: leftBullet,
    creationTime: currentTime,
    direction: direction.clone()
  });
  
  bullets.push({
    mesh: rightBullet,
    creationTime: currentTime,
    direction: direction.clone()
  });
  
  // Update last bullet time
  lastBulletTime = currentTime;
}

function createRocket() {
  // Get current time
  const currentTime = clock.getElapsedTime();
  
  // Check cooldown
  if (currentTime - lastRocketTime < ROCKET_COOLDOWN) {
    return;
  }
  
  // Create rocket geometry and material
  const rocketGeometry = new THREE.CylinderGeometry(0.1, 0.2, 1, 8);
  const rocketMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
  
  // Create left and right rockets from wings
  const leftWingPos = new THREE.Vector3(-3.5, 0.2, 0); // Match new wing positions
  leftWingPos.applyQuaternion(plane.quaternion);
  leftWingPos.add(plane.position);
  
  const rightWingPos = new THREE.Vector3(3.5, 0.2, 0); // Match new wing positions
  rightWingPos.applyQuaternion(plane.quaternion);
  rightWingPos.add(plane.position);
  
  // Get direction vector pointing forward along the plane's Z axis
  const direction = new THREE.Vector3(0, 0, 1);
  direction.applyQuaternion(plane.quaternion);
  
  // Left rocket
  const leftRocket = new THREE.Mesh(rocketGeometry, rocketMaterial);
  leftRocket.position.copy(leftWingPos);
  leftRocket.quaternion.copy(plane.quaternion);
  // Rotate to align with direction of travel
  leftRocket.rotateX(Math.PI / 2);
  scene.add(leftRocket);
  
  // Right rocket
  const rightRocket = new THREE.Mesh(rocketGeometry, rocketMaterial);
  rightRocket.position.copy(rightWingPos);
  rightRocket.quaternion.copy(plane.quaternion);
  // Rotate to align with direction of travel
  rightRocket.rotateX(Math.PI / 2);
  scene.add(rightRocket);
  
  // Add rockets to array with creation time and direction
  rockets.push({
    mesh: leftRocket,
    creationTime: currentTime,
    direction: direction.clone()
  });
  
  rockets.push({
    mesh: rightRocket,
    creationTime: currentTime,
    direction: direction.clone()
  });
  
  // Update last rocket time
  lastRocketTime = currentTime;
}

function updateProjectiles() {
  const currentTime = clock.getElapsedTime();
  const delta = clock.getDelta();
  
  // Update bullets
  for (let i = bullets.length - 1; i >= 0; i--) {
    const bullet = bullets[i];
    
    // Move bullet forward along its direction vector
    const movement = bullet.direction.clone().multiplyScalar(BULLET_SPEED * delta);
    bullet.mesh.position.add(movement);
    
    // Check if bullet has exceeded lifetime
    if (currentTime - bullet.creationTime > BULLET_LIFETIME) {
      // Remove from scene
      scene.remove(bullet.mesh);
      // Remove from array
      bullets.splice(i, 1);
    }
  }
  
  // Update rockets
  for (let i = rockets.length - 1; i >= 0; i--) {
    const rocket = rockets[i];
    
    // Move rocket forward along its direction vector
    const movement = rocket.direction.clone().multiplyScalar(ROCKET_SPEED * delta);
    rocket.mesh.position.add(movement);
    
    // Check if rocket has exceeded lifetime
    if (currentTime - rocket.creationTime > ROCKET_LIFETIME) {
      // Remove from scene
      scene.remove(rocket.mesh);
      // Remove from array
      rockets.splice(i, 1);
    }
  }
}

function animate() {
  requestAnimationFrame(animate);
  
  // Update plane position and rotation based on controls
  updatePlane();
  
  // Update projectiles
  updateProjectiles();
  
  // Update camera to follow the plane
  updateCamera();
  
  // Render scene
  renderer.render(scene, camera);
}

init();