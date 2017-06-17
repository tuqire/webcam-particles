export default `
	// simulation
	varying vec2 vUv;

	uniform sampler2D tFrame;

	uniform float tWidth;
	uniform float tHeight;

	uniform float size;

	void main() {
		// write new position out
		// gl_FragColor = vec4(vec2(mix(0.0, (tWidth * size) - size, vUv.x), mix(0.0, (tHeight * size) - size, vUv.y)), 0.0, size);
		// gl_FragColor = vec4(mix(0.0, 220.0, vUv.x), mix(0.0, 220.0, vUv.y), 0.0, size);
		// gl_FragColor = vec4(mix(0.0, 1.0, vUv.x), mix(0.0, 1.0, vUv.y), 0.0, 1.0);

		//mix(v1, v2, a) = v1 * (1 - a) + v2 * a

		gl_FragColor = vec4(vUv.x * 45.0, 45.0 * vUv.y, 0.0, 1.0);
	}
`;
