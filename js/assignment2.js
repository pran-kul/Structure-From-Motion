import * as THREE from 'three';
import Stats from 'three/addons/libs/stats.module.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { PLYLoader } from 'https://unpkg.com/three@0.147.0/examples/jsm/loaders/PLYLoader.js';

const containers = [
	document.getElementById('container1'),
	document.getElementById('container2'),
	document.getElementById('container3'),
	document.getElementById('container4'),
];
const modelPaths = containers.map(container => container.dataset.modelPath);

containers.forEach((container, index) => {
    container.style.position = 'relative';

    let renderer, stats, gui;
    let scene, camera, controls, cube, dirlight, ambientLight;
    let isinitialized = false;

    function initScene() {
        scene = new THREE.Scene();
        scene.background = new THREE.Color(0xffffff);
        camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);

        renderer = new THREE.WebGLRenderer();
		renderer.setSize(container.clientWidth, container.clientWidth);
		window.addEventListener('resize', function() {
			// Update the size of the renderer when the window is resized
			renderer.setSize(container.clientWidth, container.clientWidth);
			camera.aspect = container.clientWidth / container.clientWidth;
			
		});
        container.appendChild(renderer.domElement);

        controls = new OrbitControls(camera, renderer.domElement);
        controls.minDistance = -1;
        controls.maxDistance = 50;
        controls.addEventListener('change', function () { renderer.render(scene, camera); });

        dirlight = new THREE.DirectionalLight(0xffffff, 0.5);
        dirlight.position.set(0, 0, 1);
        scene.add(dirlight);

        ambientLight = new THREE.AmbientLight(0x404040, 2);
        scene.add(ambientLight);

        let loader = new PLYLoader();
		loader.load(
			// URL of the PLY file
			modelPaths[index],
			// Callback function when the file is loaded
			function (geometry) {
				let material = new THREE.PointsMaterial({ size: 0.05, vertexColors: true });
				let points = new THREE.Points(geometry, material);
				points.rotation.x = Math.PI;  // rotate 180 degrees around the x-axis
				scene.add(points);
				
				renderer.render(scene, camera);
			},
			// Optional: onProgress callback
			function (xhr) {
				console.log((xhr.loaded / xhr.total * 100) + '% loaded');
			},
			// Optional: onError callback
			function (error) {
				console.log('An error happened');
			}
		);

        camera.position.z = 5;
    }

    function initSTATS() {
        stats = new Stats();
        stats.showPanel(0);
        stats.dom.style.position = 'absolute';
        stats.dom.style.bottom  = 0;
        stats.dom.style.left = 0;
        container.appendChild(stats.dom);
    }

    function initGUI() {
        if (!isinitialized) {
            gui = new GUI();
            cube = scene.getObjectByName("cube");
            gui.add(cube.position, 'x', -1, 1);
            gui.add(cube.position, 'y', -1, 1);
            gui.add(cube.position, 'z', -1, 1);
            gui.domElement.style.position = 'absolute';
            gui.domElement.style.top = '0px';
            gui.domElement.style.right = '0px';
            container.appendChild(gui.domElement);
            isinitialized = true;
        }
    }

    function animate() {
        requestAnimationFrame(animate);

        cube = scene.getObjectByName("cube");
        if (cube) {
            cube.rotation.x += 0.01;
            cube.rotation.y += 0.01;
            initGUI();
        }

        renderer.render(scene, camera);
        stats.update();
    }

    function onWindowResize() {
        camera.aspect =(window.innerWidth * 0.5) / (window.innerHeight * 0.25);
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth* 0.5, window.innerHeight * 0.25);
    }

    window.addEventListener('resize', onWindowResize, false);

    initScene();
    initSTATS();
    //animate();
});