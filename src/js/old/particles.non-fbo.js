import vertexShader from '../shaders/vertexShader';
import fragmentShader from '../shaders/fragmentShader';
import simulationVertexShader from '../shaders/simulationVertexShader';
import simulationFragmentShader from '../shaders/simulationFragmentShader';

export default class Particles {
	constructor({
		scene,
		numParticles = 100 * 120,
		uniforms = {
			color: { value: new THREE.Color( 0xffffff ) },
			texture: { value: new THREE.TextureLoader().load( 'images/star.png' ) }
		},
		blending = THREE.AdditiveBlending,
		transparent = true,
		depthTest = true,
		depthWrite = false,

		renderer
	}) {
		this.scene = scene;
		this.numParticles = numParticles;
		this.renderer = renderer;

		this.setImage();
	}

	setImage() {
		this.image 							= document.createElement('img');
		// image.src 							= 'https://s3-us-west-1.amazonaws.com/powr/defaults/image-slider2.jpg';
		this.image.src 							= 'http://localhost:8080/images/test/DSC_0507.jpg';

		this.image.onload = () => {
			this.addParticles();
		};
	}

	addParticles() {
		var image 							= this.image;
		var renderer 						= this.renderer;
		var numParticles				= this.numParticles;
		var particleSize				= 5;
		var IMAGE_RATIO 				= image.width / image.height;
		var COL_RATIO 					= IMAGE_RATIO > 1 ? IMAGE_RATIO : 1;
		var ROW_RATIO 					= IMAGE_RATIO > 1 ? 1 : image.height / image.width;

		var cols 								= COL_RATIO;
		var rows 								= ROW_RATIO;

		while (cols * rows < numParticles - (COL_RATIO * ROW_RATIO)) {
			cols += COL_RATIO;
			rows += ROW_RATIO;
		}

		var WIDTH 							= Math.ceil(cols);
		var HEIGHT 							= Math.ceil(rows);

		var geometry						= new THREE.Geometry();
		var material 						= new THREE.PointsMaterial({
																blending: THREE.NormalBlending,
																map: new THREE.TextureLoader().load('images/particle.png'),
																size: particleSize,
																opacity: 1,
																vertexColors: true,
																sizeAttenuation: true,
																transparent: true
															});

		this.canvas							= document.createElement('canvas');
		this.canvas.width				= WIDTH;
		this.canvas.height			= HEIGHT;

		// const tWidth = Math.sqrt(numParticles);
		// const tHeight = tWidth;
		//
		// this.FBO = new FBO({
		// 	tWidth,
		// 	tHeight,
		// 	renderer,
		// 	uniforms: {
		// 		tTexture: { type: 't', value: null }
		// 		tPrevPositions: { type: 't', value: null },
		// 		frames: { type: 'f', value: 60 },
		// 		newTexture: {type: 'bool', value: true },
		// 		minSize: { type: 'f', value: 0 },
		// 		maxSize: { type: 'f', value: 5 },
		// 		incSize: { type: 'f', value: 0.1 }
		// 	},
		// 	simulationVertexShader,
		// 	simulationFragmentShader
		// });

		// the canvas is only used to analyse our pic
		const context 					= this.context = this.canvas.getContext('2d');

		// https://www.w3schools.com/tags/canvas_drawimage.asp
		context.drawImage(
			image,
			0,
			0,
			image.width,
			image.height,
			0,
			0,
			WIDTH,
			HEIGHT
		);

		var pixels = context.getImageData(0, 0, WIDTH, HEIGHT);

		for (var y = 0; y < HEIGHT; y += 1) {
			for (var x = 0; x <= WIDTH; x += 1) {
				var p = (x * 4) + (y * WIDTH * 4);

				if (pixels.data[p + 3] > 0) {
					var pixelCol	= (pixels.data[p] << 16) + (pixels.data[p + 1] << 8) + pixels.data[p + 2];
					var color 		= new THREE.Color(pixelCol);
				//	var vector 		= new THREE.Vector3((WIDTH / -2) + x, (HEIGHT / 2) - y / 4, 0);
					var vector 		= new THREE.Vector3((x - (WIDTH / 2)) * particleSize / 2, ((HEIGHT / 2) - y) * particleSize / 2, 0);

					// console.log(vector);

					// push on the particle
					geometry.vertices.push(vector);
					geometry.colors.push(color);
				}
			}
		}

		this.particles = new THREE.Points(geometry, material);
		this.particles.sortParticles = true;

		this.scene.add(this.get());
	}

	update() {
	//	this.FBO.simulate();
	//	this.material.uniforms.map.value = this.FBO.simulationShader.uniforms.tPositions.value;

	//	this.rotateZ(this.speed);
	}

	get() {
		return this.particles;
	}
}
