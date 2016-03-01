/***
 * Created by Glen Berseth Feb 5, 2016
 * Created for Project 2 of CPSC314 Introduction to graphics Course.
 */

// Build a visual axis system
function buildAxis(src, dst, colorHex, dashed) {
    var geom = new THREE.Geometry(),
        mat;

    if (dashed) {
        mat = new THREE.LineDashedMaterial({
            linewidth: 3,
            color: colorHex,
            dashSize: 3,
            gapSize: 3
        });
    } else {
        mat = new THREE.LineBasicMaterial({linewidth: 3, color: colorHex});
    }

    geom.vertices.push(src.clone());
    geom.vertices.push(dst.clone());
    geom.computeLineDistances(); // This one is SUPER important, otherwise dashed lines will appear as simple plain lines

    var axis = new THREE.Line(geom, mat, THREE.LinePieces);

    return axis;

}
var length = 100.0;
// Build axis visuliaztion for debugging.
x_axis = buildAxis(
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(length, 0, 0),
    0xFF0000,
    false
);
y_axis = buildAxis(
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(0, length, 0),
    0x00ff00,
    false
);
z_axis = buildAxis(
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(0, 0, length),
    0x0000FF,
    false
);

// ASSIGNMENT-SPECIFIC API EXTENSION
THREE.Object3D.prototype.setMatrix = function (a) {
    this.matrix = a;
    this.matrix.decompose(this.position, this.quaternion, this.scale);
};
//ASSIGNMENT-SPECIFIC API EXTENSION
// For use with matrix stack
THREE.Object3D.prototype.setMatrixFromStack = function (a) {
    this.matrix = mvMatrix;
    this.matrix.decompose(this.position, this.quaternion, this.scale);
};

// Data to for the two camera view
var mouseX = 0, mouseY = 0;
var windowWidth, windowHeight;
var views = [
    {
        left: 0,
        bottom: 0,
        width: 0.499,
        height: 1.0,
        background: new THREE.Color().setRGB(0.1, 0.1, 0.1),
        eye: [80, 20, 80],
        up: [0, 1, 0],
        fov: 45,
        updateCamera: function (camera, scene, mouseX, mouseY) {
            camera.lookAt(camera.lookAtPoint.position);
        }
    },
    {
        left: 0.501,
        bottom: 0.0,
        width: 0.499,
        height: 1.0,
        background: new THREE.Color().setRGB(0.1, 0.1, 0.1),
        eye: [65, 20, 65],
        up: [0, 1, 0],
        fov: 45,
        updateCamera: function (camera, scene, mouseX, mouseY) {
            camera.lookAt(camera.lookAtPoint.position);
        }
    }
];


//SETUP RENDERER & SCENE
var canvas = document.getElementById('canvas');
var scene = new THREE.Scene();
var renderer = new THREE.WebGLRenderer();
renderer.shadowMap.enabled = true;
// renderer.setClearColor(0xFFFFFF); // white background colour
canvas.appendChild(renderer.domElement);

// Creating the two cameras and adding them to the scene.
function resetCameraToView(camera, view) {
    camera.position.x = view.eye[0];
    camera.position.y = view.eye[1];
    camera.position.z = view.eye[2];
    camera.up.x = view.up[0];
    camera.up.y = view.up[1];
    camera.up.z = view.up[2];
    camera.lookAtPoint = new THREE.Object3D();
    camera.lookAtPoint.position = scene.position.clone();
    camera.add(camera.lookAtPoint);
}

var camera_MotherShip = new THREE.PerspectiveCamera(views[0].fov, window.innerWidth / window.innerHeight, 1, 10000);
resetCameraToView(camera_MotherShip, views[0]);
views[0].camera = camera_MotherShip;
scene.add(views[0].camera);


var camera_ScoutShip = new THREE.PerspectiveCamera(views[1].fov, window.innerWidth / window.innerHeight, 1, 10000);
resetCameraToView(camera_ScoutShip, views[1]);
views[1].camera = camera_ScoutShip;
scene.add(views[1].camera);

var scoutShip = new THREE.Mesh(new THREE.TetrahedronGeometry(2, 0), new THREE.MeshBasicMaterial({color: getRandomColor()}));
var motherShip = new THREE.Mesh(new THREE.TetrahedronGeometry(3, 0), new THREE.MeshBasicMaterial({color: getRandomColor()}));

camera_MotherShip.add(motherShip);
camera_ScoutShip.add(scoutShip);

// ADDING THE AXIS DEBUG VISUALIZATIONS
scene.add(x_axis);
scene.add(y_axis);
scene.add(z_axis);


// ADAPT TO WINDOW RESIZE
function resize() {
    windowWidth = window.innerWidth;
    windowHeight = window.innerHeight;
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// EVENT LISTENER RESIZE
window.addEventListener('resize', resize);
resize();

//SCROLLBAR FUNCTION DISABLE
window.onscroll = function () {
    window.scrollTo(0, 0);
};

var ambientLight = new THREE.AmbientLight(0x222222);
scene.add(ambientLight);

var lights = [];
lights[0] = new THREE.PointLight(0xffffff, 1, 0);
lights[0].castShadow = true;

lights[0].position.set(0, 0, 0); // IN THE SUN....

scene.add(lights[0]);

// SETUP HELPER GRID
// Note: Press Z to show/hide
var gridGeometry = new THREE.Geometry();
var i;
for (i = -50; i < 51; i += 2) {
    gridGeometry.vertices.push(new THREE.Vector3(i, 0, -50));
    gridGeometry.vertices.push(new THREE.Vector3(i, 0, 50));
    gridGeometry.vertices.push(new THREE.Vector3(-50, 0, i));
    gridGeometry.vertices.push(new THREE.Vector3(50, 0, i));
}

var gridMaterial = new THREE.LineBasicMaterial({color: 0xBBBBBB});
var grid = new THREE.Line(gridGeometry, gridMaterial, THREE.LinePieces);

/////////////////////////////////
//   YOUR WORK STARTS BELOW    //
/////////////////////////////////


// Create Solar System
var geometry = new THREE.SphereGeometry(5, 32, 32);
generateVertexColors(geometry);

var material = new THREE.MeshBasicMaterial({color: 0xffdd00});
material.transparent = true;
material.opacity = 0.5;

var seeThroughMat = new THREE.MeshBasicMaterial({color: 0xffdd00});
seeThroughMat.transparent = true;
seeThroughMat.opacity = 0;

var sun = new THREE.Mesh(geometry, material);
var sunWire = new THREE.Line(geometry, material);
scene.add(sun);
scene.add(sunWire);


//TO-DO: INITIALIZE THE REST OF YOUR PLANETS
var generatePlanet = function(size, color, distance) {
    var material = new THREE.MeshBasicMaterial({color: color});
    var geometry = new THREE.SphereGeometry(size, 32, 32);
    var mesh = new THREE.Mesh(geometry, material);
    mesh.translateZ(distance);

    var pivot = new THREE.Mesh(geometry, seeThroughMat);
    pivot.add(mesh);
    var rotSpeedScale = 5;

    var orbit_mat = new THREE.LineDashedMaterial({color: 0xffffff});
    var orbit_geom = new THREE.CircleGeometry(distance, 64);
    var orbit = new THREE.Line(orbit_geom, orbit_mat);
    orbit.rotateX(Math.PI/2);

    var planet = {
        pivot: pivot,
        mesh: mesh,
        rotationSpeed: rotSpeedScale * (1.0/Math.sqrt(distance)),
        orbit: orbit
    };

    return planet;
};


var generateSaturnRing = function(r) {
    r *= 0.8;
    var geom = new THREE.TorusGeometry(r, r/100, 16, 100);
    var material = new THREE.MeshBasicMaterial({color: getRandomColor()});
    var ring = new THREE.Mesh(geom, material);
    return ring
};


function getRandomColor() {
    return Math.random() * 0xFFFFFF;
}

var planets = [];
var distance = 10;

planets['mercury'] = generatePlanet(1, getRandomColor(), distance * 0.8);
planets['venus'] = generatePlanet(1.5, getRandomColor(), distance * 1.5);
planets['earth'] = generatePlanet(1.8, getRandomColor(), distance * 2.5);
planets['mars'] = generatePlanet(1.65, getRandomColor(), distance * 3.5);
planets['jupiter'] = generatePlanet(4, getRandomColor(), distance * 5);
planets['saturn'] = generatePlanet(3.5, getRandomColor(), distance * 6.5);
planets['neptune'] = generatePlanet(2.8, getRandomColor(), distance * 7.5);
planets['uranus'] = generatePlanet(2.6, getRandomColor(), distance * 9);

var moon = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), new THREE.MeshBasicMaterial({color: getRandomColor()}));
moon.translateOnAxis(new THREE.Vector3(0, 0, 0.9), 4);
planets['earth']['mesh'].add(moon);

for (var planet in planets) {
    scene.add(planets[planet]['pivot']);
    scene.add(planets[planet]['orbit']);
    var NUM_SATURN_RINGS = 4;
    var SATURN_RING_START_RADIUS = 7;
    if (planet == 'saturn') {
        for (var i=SATURN_RING_START_RADIUS;
             i<SATURN_RING_START_RADIUS+NUM_SATURN_RINGS; i++) {
            var ring = generateSaturnRing(i);
            ring.rotateX(Math.PI/2);
            planets[planet]['mesh'].add(ring);
        }
    }

}

//Note: Use of parent attribute IS allowed.
//Hint: Keep hierarchies in mind!



var clock = new THREE.Clock(true);
var lastUpdate = clock.getElapsedTime();
function updateSystem() {
    var secondsPassed = (clock.getElapsedTime() - lastUpdate);
    lastUpdate = clock.getElapsedTime();

    // ANIMATE YOUR SOLAR SYSTEM HERE.
    if (!pause) {
        var localRotSpeed = 1;
        sun.rotateY(localRotSpeed * secondsPassed);
        for (var planet in planets) {
            planets[planet]['pivot'].rotateY(planets[planet]['rotationSpeed'] * secondsPassed);
            planets[planet]['mesh'].rotateY(localRotSpeed * secondsPassed);
        }
    }

}

// LISTEN TO KEYBOARD
// Hint: Pay careful attention to how the keys already specified work!
var keyboard = new THREEx.KeyboardState();
var grid_state = false;
var pause = false;
var currentCamera = camera_MotherShip;
var moveDistance = 2;
var rotationStep = 0.05;
var isInLookAtMode = true;

function onKeyDown(event) {
    // TO-DO: BIND KEYS TO YOUR CONTROLS
    // Stateless commands
    if (keyboard.eventMatches(event, "l")) {  // Reveal/Hide helper grid
        isInLookAtMode = true;
    } else if (keyboard.eventMatches(event, "r")) {
        isInLookAtMode = false;
    } else if (keyboard.eventMatches(event, "shift+g")) {  // Reveal/Hide helper grid
        grid_state = !grid_state;
        grid_state ? scene.add(grid) : scene.remove(grid);
    } else if (keyboard.eventMatches(event, "space")) {
        pause = !pause;
    } else if (keyboard.eventMatches(event, "o")) {
        currentCamera = camera_MotherShip;
    } else if (keyboard.eventMatches(event, "p")) {
        currentCamera = camera_ScoutShip;
    } else if (keyboard.eventMatches(event, "m")) {
        for (var i in views) {
            resetCameraToView(views[i].camera, views[i]);
        }
    } else if (keyboard.eventMatches(event, "shift+K")) {
        rotationStep /= 2;
        moveDistance /= 2;
    } else if (keyboard.eventMatches(event, "k")) {
        rotationStep *= 2;
        moveDistance *= 2;

    if (isInLookAtMode) {
        handleLookAtCommand(event);
    } else {
        handleRelativeFlyingCommand(event);
    }



}

function handleRelativeFlyingCommand(event) {
    if (keyboard.eventMatches(event, "shift+q")) {
        // Yaw
    } else if (keyboard.eventMatches(event, "q")) {

    } else if (keyboard.eventMatches(event, "shift+s")) {
        // Pitch
    } else if (keyboard.eventMatches(event, "s")) {

    } else if (keyboard.eventMatches(event, "shift+a")) {
        // Roll
    } else if (keyboard.eventMatches(event, "a")) {

    } else if (keyboard.eventMatches(event, "shift+w")) {
        // Forward / backward
    } else if (keyboard.eventMatches(event, "w")) {


}

function handleLookAtCommand(event) {
    if (keyboard.eventMatches(event, "shift+x")) {
        currentCamera.position.x -= moveDistance;
        currentCamera.lookAtPoint.position.x -= moveDistance;
    } else if (keyboard.eventMatches(event, "x")) {
        currentCamera.position.x += moveDistance;
        currentCamera.lookAtPoint.position.x += moveDistance;
    } else if (keyboard.eventMatches(event, "shift+Y")) {
        currentCamera.position.y -= moveDistance;
        currentCamera.lookAtPoint.position.y -= moveDistance;
    } else if (keyboard.eventMatches(event, "y")) {
        currentCamera.position.y += moveDistance;
        currentCamera.lookAtPoint.position.y += moveDistance;
    } else if (keyboard.eventMatches(event, "shift+Z")) {
        currentCamera.position.z -= moveDistance;
        currentCamera.lookAtPoint.position.z -= moveDistance;
    } else if (keyboard.eventMatches(event, "z")) {
        currentCamera.position.z += moveDistance;
        currentCamera.lookAtPoint.position.z += moveDistance;
    } else if (keyboard.eventMatches(event, "shift+a")) {
        currentCamera.lookAtPoint.position.x -= moveDistance;
    } else if (keyboard.eventMatches(event, "a")) {
        currentCamera.lookAtPoint.position.x += moveDistance;
    } else if (keyboard.eventMatches(event, "shift+b")) {
        currentCamera.lookAtPoint.position.y -= moveDistance;
    } else if (keyboard.eventMatches(event, "b")) {
        currentCamera.lookAtPoint.position.y += moveDistance;
    } else if (keyboard.eventMatches(event, "shift+C")) {
        currentCamera.lookAtPoint.position.z -= moveDistance;
    } else if (keyboard.eventMatches(event, "c")) {
        currentCamera.lookAtPoint.position.z += moveDistance;
    } else if (keyboard.eventMatches(event, "shift+d")) {
        currentCamera.up.x -=rotationStep;
    } else if (keyboard.eventMatches(event, "d")) {
        currentCamera.up.x +=rotationStep;
    } else if (keyboard.eventMatches(event, "shift+E")) {
        currentCamera.up.y -=rotationStep;
    } else if (keyboard.eventMatches(event, "e")) {
        currentCamera.up.y +=rotationStep;
    } else if (keyboard.eventMatches(event, "shift+F")) {
        currentCamera.up.z -=rotationStep;
    } else if (keyboard.eventMatches(event, "f")) {
        currentCamera.up.z +=rotationStep;
    }
}

keyboard.domElement.addEventListener('keydown', onKeyDown);


// SETUP UPDATE CALL-BACK
// Hint: It is useful to understand what is being updated here, the effect, and why.
// DON'T TOUCH THIS
function update() {
    updateSystem();

    requestAnimationFrame(update);

    // UPDATES THE MULTIPLE CAMERAS IN THE SIMULATION
    for (var ii = 0; ii < views.length; ++ii) {

        view = views[ii];
        camera_ = view.camera;

        view.updateCamera(camera_, scene, mouseX, mouseY);

        var left = Math.floor(windowWidth * view.left);
        var bottom = Math.floor(windowHeight * view.bottom);
        var width = Math.floor(windowWidth * view.width);
        var height = Math.floor(windowHeight * view.height);
        renderer.setViewport(left, bottom, width, height);
        renderer.setScissor(left, bottom, width, height);
        renderer.enableScissorTest(true);
        renderer.setClearColor(view.background);

        camera_.aspect = width / height;
        camera_.updateProjectionMatrix();

        renderer.render(scene, camera_);
    }
}

update();
