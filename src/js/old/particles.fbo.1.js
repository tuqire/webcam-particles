import FBO from './FBO';

import simulationVertexShader from '../shaders/simulationVertexShader';
import simulationFragmentShader from '../shaders/simulationFragmentShader';
import vertexShader from '../shaders/vertexShader';
import fragmentShader from '../shaders/fragmentShader';

export default class Particles {
	constructor({
		scene,
		numParticles = 100000,
		uniforms = {
			sizeMultipler: { value: (window.innerHeight * window.devicePixelRatio) / 2 },
			color: { value: new THREE.Color( 0xffffff ) }
		},
		blending = THREE.AdditiveBlending,
		transparent = true,
		depthTest = true,
		depthWrite = false,

		renderer
	}) {
		this.scene 							= scene;
		this.numParticles 			= numParticles;
		this.renderer 					= renderer;
		this.uniforms 					= uniforms;

		this.texture = new THREE.TextureLoader().load('http://localhost:8082/images/test/DSC_0507.jpg', () => this.addParticles());
	}

	addParticles() {
		const image 							= this.texture.image;
		const renderer 						= this.renderer;
		const numParticles				= this.numParticles;
		const particleSize				= 2;
		var IMAGE_RATIO 					= image.width / image.height;
		var COL_RATIO 						= IMAGE_RATIO > 1 ? IMAGE_RATIO : 1;
		var ROW_RATIO 						= IMAGE_RATIO > 1 ? 1 : image.height / image.width;

		var cols 									= COL_RATIO;
		var rows 									= ROW_RATIO;

		while (cols * rows < numParticles - (COL_RATIO * ROW_RATIO)) {
			cols += COL_RATIO;
			rows += ROW_RATIO;
		}

		var tWidth 								= Math.ceil(cols);
		var tHeight 							= Math.ceil(rows);

		this.FBO = new FBO({
			tWidth,
			tHeight,
			renderer,
			uniforms: {
				tWidth: {type: 'f', value: tWidth },
				tHeight: {type: 'f', value: tHeight },
				size: { type: 'f', value: particleSize }
			},
			simulationVertexShader,
			simulationFragmentShader
		});

		const material = this.material = new THREE.ShaderMaterial({
			blending: THREE.NormalBlending,
			uniforms: Object.assign({}, this.uniforms, {
				map: new THREE.TextureLoader().load('images/particle.png'),
				tTexture: { type: 't', value: this.texture },
				tFrame: { type: 't', value: this.FBO.targets[0] }
			}),
			fragmentShader,
			vertexShader,
			opacity: 1,
			vertexColors: true,
			sizeAttenuation: true,
			transparent: true
		});

		const geometry = this.geometry = new THREE.Geometry();

		for (let i = 0; i < this.numParticles; i++) {
			const vertex = new THREE.Vector3();
			vertex.x = (i % tWidth) / tWidth;
			vertex.y = Math.floor(i / tWidth) / tHeight;
			geometry.vertices.push(vertex);
		}

		this.particles = new THREE.Points(geometry, material);
		this.particles.sortParticles = true;

		this.scene.add(this.get());

		console.log('scene loaded!', `Expected: ${this.numParticles} particles`, `Actual: ${geometry.vertices.length} particles`);

		this.ready = true;
	}

	update() {
		if (this.ready) {
			this.FBO.simulate();

			this.material.uniforms.tFrame.value = this.FBO.getCurrentFrame();
		}
	}

	get() {
		return this.particles;
	}
}
