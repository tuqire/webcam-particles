import FBO from './FBO';

import { simulationVertexShader, simulationFragmentShader } from '../shaders/simulationShaders';
import { vertexShader, fragmentShader } from '../shaders/shaders';

export default class Particles {
	constructor({
		scene,
		numParticles 		= 100000,
		uniforms 				= {
			sizeMultipler:	{ value: (window.innerHeight * window.devicePixelRatio) / 2 },
			color:					{ value: new THREE.Color( 0xffffff ) }
		},
		blending 				= THREE.AdditiveBlending,
		transparent 		= true,
		depthTest 			= true,
		depthWrite 			= false,

		renderer,

		particleSize 		= 0.1,
		particleSizeInc = 0.0002,
		zInc						= 0.0002,
		yInc						= 0.001,
		yThreshold 			= 0.2
	}) {
		this.scene 								= scene;
		this.numParticles 				= numParticles;
		this.renderer 						= renderer;
		this.uniforms 						= uniforms;

		this.particleSize					= particleSize;
		this.particleSizeInc			= particleSizeInc;
		this.zInc 								= zInc;
		this.yInc 								= yInc;
		this.yThreshold 					= yThreshold;

		this.video 								= document.createElement('video');
		navigator.getUserMedia({ video: { width: 1280, height: 720 } }, stream => {
			const video 						= this.video;
	  	video.src    						= URL.createObjectURL(stream);
			video.width							= 480;
			video.height						= 480;

			this.addParticles();
		}, () => console.error('video failed to load'));
	}

	addParticles() {
		const video 							= this.video;
		const renderer 						= this.renderer;
		const numParticles				= this.numParticles;
		const IMAGE_RATIO 				= video.width / video.height;
		const COL_RATIO 					= IMAGE_RATIO > 1 ? IMAGE_RATIO : 1;
		const ROW_RATIO 					= IMAGE_RATIO > 1 ? 1 : video.height / video.width;

		let cols 									= COL_RATIO;
		let rows 									= ROW_RATIO;

		while (cols * rows < numParticles - (COL_RATIO * ROW_RATIO)) {
			cols += COL_RATIO;
			rows += ROW_RATIO;
		}

		const tWidth 							= Math.ceil(cols);
		const tHeight 						= Math.ceil(rows);
		this.numParticles 				= tWidth * tHeight;

		this.FBO = new FBO({
			tWidth,
			tHeight,
			renderer,
			uniforms: {
				tWidth: { type: 'f', value: tWidth },
				tHeight: { type: 'f', value: tHeight },

				tSize: { type: 't', value: 0 },
				yThreshold: { type: 'f', value: this.yThreshold }
			},
			simulationVertexShader,
			simulationFragmentShader
		});

		this.FBO.setTextureUniform('tSize', this.getSizes());

		const videoImage = this.videoImage = document.createElement('canvas');
		const videoImageContext = this.videoImageContext = videoImage.getContext('2d');

		const videoTexture = this.videoTexture = new THREE.Texture(videoImage);
		videoTexture.minFilter = videoTexture.magFilter = THREE.NearestFilter;
		videoTexture.needsUpdate = true;

		const material = this.material = new THREE.ShaderMaterial({
			blending: THREE.NormalBlending,
			uniforms: Object.assign({}, this.uniforms, {
				tTexture: { type: 't', value: videoTexture },
				tFrame: { type: 't', value: this.FBO.targets[0] }
			}),
			fragmentShader,
			vertexShader,
			opacity: 1,
			vertexColors: true,
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
		this.particles.frustumCulled = false;

		this.scene.add(this.get());

		console.log('scene loaded!',
			`Expected: ${this.numParticles} particles`,
			`Actual: ${geometry.vertices.length} particles`,
			`Cols: ${tWidth}`,
			`Rows: ${tHeight}`);

		this.ready = true;
	}

	getSizes() {
		const sizes = new Float32Array(this.numParticles * 4);
		for (let i = 0, i4 = 0; i < this.numParticles; i++, i4 += 4) {
			sizes[i4] = this.zInc * Math.random();
			sizes[i4 + 1] = this.yInc * Math.random();
			sizes[i4 + 2] = this.calcSize();
			sizes[i4 + 3] = this.particleSizeInc * Math.random();
		}
		return sizes;
	}

	calcSize() {
		const size = this.particleSize * Math.random();

		return size;
	}

	update() {
		if (this.ready) {
			// update video texture with webcam feed
			const { video, videoImageContext, videoImage: { width: videoWidth, height: videoHeight }, videoTexture } = this;
			if (video.readyState === video.HAVE_ENOUGH_DATA) {
				videoImageContext.drawImage(video, 0, 0, videoWidth, videoHeight);

				videoTexture.needsUpdate = true;
			}

			this.FBO.simulate();

			this.material.uniforms.tFrame.value = this.FBO.getCurrentFrame();
		}
	}

	get() {
		return this.particles;
	}
}
