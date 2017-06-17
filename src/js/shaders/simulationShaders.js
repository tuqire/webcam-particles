const simulationVertexShader = `
	varying vec2 vUv;

	void main() {
	  vUv = vec2(uv);
		gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
	}
`;

const simulationFragmentShader = `
	varying vec2 vUv;

	uniform sampler2D tFrame;

	uniform float tWidth;
	uniform float tHeight;

	uniform float size;

	void main() {
		// write new position out
		gl_FragColor = vec4((vUv.x * 1.0) - 0.5, (vUv.y * 1.0) - 0.5, 0.0, size);
	}
`;

export {
	simulationFragmentShader,
	simulationVertexShader
};
