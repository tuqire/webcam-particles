export default class Camera {
	constructor({
		fov = 45,
		aspectRatio = window.innerHeight / window.innerWidth,
		near = 0.01,
		far = 500,
		position = {
			x: 0, y: 0, z: 0
		},
		up = [0, 0, 1]
	}) {
		this.camera = new THREE.PerspectiveCamera(fov, aspectRatio, near, far);

		this.setPosition(position);

		window.addEventListener('resize', this.onWindowResize.bind(this));
	}

	onWindowResize() {
		const WIDTH = window.innerWidth;
		const HEIGHT = window.innerHeight;
		this.camera.aspect = WIDTH / HEIGHT;
		this.camera.updateProjectionMatrix();
	}

	setUp(x, y, z) {
		this.camera.up.set(x, y, z);
	}

	setPosition({
		x = this.camera.position.x,
		y = this.camera.position.y,
		z = this.camera.position.z
	}) {
		this.setX(x);
		this.setY(y);
		this.setZ(z);
	}

	setX(x) {
		this.camera.position.x = x;
	}

	setY(y) {
		this.camera.position.y = y;
	}

	setZ(z) {
		this.camera.position.z = z;
	}

	update() {
	}

	get() {
		return this.camera;
	}
}
