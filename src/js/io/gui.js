import DatGUI from 'dat-gui';

export default class GUI {
	constructor({ 
		particles,
		scene
	} = {}) {
		this.gui = new DatGUI.GUI();

		this.addCirclesControls(particles);
		this.addRadiusControls(particles);
		this.addSpeedControls(particles);
		this.addSphereControls(particles);
	}

	addCirclesControls(particles) {
		this.gui.add(particles, 'circles')
			.min(1)
			.max(25)
			.step(1)
			.onFinishChange(() => {
				particles.initParticleVars();
				particles.setTargetPositions();
			});
	}

	addRadiusControls(particles) {
		this.gui.add(particles, 'radius')
			.min(50)
			.max(150)
			.onFinishChange(() => {
				particles.initParticleVars();
				particles.setTargetPositions();
			});
	}

	addSpeedControls(particles) {
		this.gui.add(particles, 'speed')
			.min(0)
			.max(0.01);
	}

	addSphereControls(particles) {
		this.gui.add(particles, 'sphere')
			.onFinishChange(() => {
				particles.setSimType();
				particles.setTargetPositions();
			});
	}


	// not used

	addBrightnessControls(particles) {
		this.gui.add(particles, 'maxSize')
			.min(1)
			.max(15)
			.step(0.5);
	}

	addVibrationControls(particles) {
		this.gui.add(particles, 'vibration')
			.min(0)
			.max(0.5);
	}

	addBeatsControls(particles) {
		this.gui.add(particles, 'beats')
			.min(0)
			.max(0.5);
	}
}