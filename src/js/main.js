import isWebglEnabled from 'detector-webgl';

import Camera from './io/camera';
import Controls from './io/controls';
import Renderer from './io/renderer';
import Stats from './io/stats';
import GUI from './io/gui';

import Scene from './objects/scene';
import Particles from './objects/particles';

function getParameterByName(name, url) {
	if (!url) {
		url = window.location.href;
	}

	name = name.replace(/[\[\]]/g, '\\$&');
	const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`);
	const results = regex.exec(url);

	if (!results) return null;
	if (!results[2]) return '';

	return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

document.addEventListener('DOMContentLoaded', () => {
	if (isWebglEnabled) {
		const WIDTH = window.innerWidth;
		const HEIGHT = window.innerHeight;
		const aspectRatio =  1;

		const container = document.getElementById('container');

		const renderer = new Renderer({
			width: WIDTH,
			height: HEIGHT,
			container
		});

		const scene = new Scene();

		const camera = new Camera({
			aspectRatio,
			position: {
				x: 0,
				y: 0,
				z: -1.5
			}
		});

		const controls = new Controls({
			minDistance: 0,
			maxDistance: 1700,
			camera: camera.get(),
			rendererDomElement: renderer.getDomElement()
		});

		const stats = new Stats();

		const particles = new Particles({
			numParticles: 30000,
			scene,
			renderer
		});

	//	const gui = new GUI({ particles, scene });

		const init = () => {
			controls.onChange(render);

			if (getParameterByName('stats') === 'true') {
				container.appendChild(stats.getDomElement());
			}
		};

		const animate = () => {
			requestAnimationFrame(animate);
			controls.update();
			render();
		};

		const render = () => {
			camera.update();
			stats.update();

			particles.update();

			renderer.render({
				scene: scene.get(),
				camera: camera.get()
			});
		};

		init();
		animate();
	} else {
		const info = document.getElementById('info');
		info.innerHTML = 'Your browser is not supported. Please use the latest version of Firefox or Chrome.';
	}
});
