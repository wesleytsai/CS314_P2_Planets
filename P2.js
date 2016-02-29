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
var view = views[0];
camera_MotherShip = new THREE.PerspectiveCamera(view.fov, window.innerWidth / window.innerHeight, 1, 10000);
camera_MotherShip.position.x = view.eye[0];
camera_MotherShip.position.y = view.eye[1];
camera_MotherShip.position.z = view.eye[2];
camera_MotherShip.up.x = view.up[0];
camera_MotherShip.up.y = view.up[1];
camera_MotherShip.up.z = view.up[2];
camera_MotherShip.lookAt(scene.position);
view.camera = camera_MotherShip;
scene.add(view.camera);

var view = views[1];
camera_ScoutShip = new THREE.PerspectiveCamera(view.fov, window.innerWidth / window.innerHeight, 1, 10000);
camera_ScoutShip.position.x = view.eye[0];
camera_ScoutShip.position.y = view.eye[1];
camera_ScoutShip.position.z = view.eye[2];
camera_ScoutShip.up.x = view.up[0];
camera_ScoutShip.up.y = view.up[1];
camera_ScoutShip.up.z = view.up[2];
camera_ScoutShip.lookAt(scene.position);
view.camera = camera_ScoutShip;
scene.add(view.camera);


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

var spaceShip = new THREE.Mesh(new THREE.TetrahedronGeometry(2, 0), new THREE.MeshBasicMaterial({color: 0x00ff00}));
spaceShip.translateOnAxis(new THREE.Vector3(0, 1, 0), 10);

var motherShip = new THREE.Mesh(new THREE.TetrahedronGeometry(3, 0), new THREE.MeshBasicMaterial({color: 0xff0000}));
motherShip.translateOnAxis(new THREE.Vector3(0, 1, 0), 20);

scene.add(spaceShip);
scene.add(motherShip);

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
        rotationSpeed: rotSpeedScale * size / distance,
        orbit: orbit
    };

    return planet;
};


var generateSaturnRing = function(r) {
    var geom = new THREE.TorusGeometry(r, r/100, 16, 100);
    var material = new THREE.MeshBasicMaterial({color: 0xfff000});
    var ring = new THREE.Mesh(geom, material);
    return ring
};


var planets = [];
var distance = 10;
var color = 0x0055ff;

planets['mercury'] = generatePlanet(1, color * 4, distance);
planets['venus'] = generatePlanet(2, color * 3, distance * 2);
planets['earth'] = generatePlanet(2, color * 2, distance * 3);
planets['mars'] = generatePlanet(1, color, distance * 4);
planets['saturn'] = generatePlanet(6, color * 5, distance * 5);
planets['jupiter'] = generatePlanet(5, color * 6, distance * 6);
planets['neptune'] = generatePlanet(4, color * 7, distance * 7);
planets['uranus'] = generatePlanet(4, color * 6, distance * 8);

var moon = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 32), new THREE.MeshBasicMaterial({color: 'white'}));
moon.translateOnAxis(new THREE.Vector3(0, 0, 1), 4);
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

function onKeyDown(event) {
    // TO-DO: BIND KEYS TO YOUR CONTROLS
    if (keyboard.eventMatches(event, "shift+g")) {  // Reveal/Hide helper grid
        grid_state = !grid_state;
        grid_state ? scene.add(grid) : scene.remove(grid);
    } if (keyboard.eventMatches(event, "space")) {
        pause = !pause;
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
