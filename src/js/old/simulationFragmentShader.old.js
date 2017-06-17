export default `
	// simulation
	varying vec2 vUv;

	uniform sampler2D tFrame;
	// uniform sampler2D tTexture;
	// uniform bool newTexture;

	uniform float frames;
	uniform float tWidth;

	uniform float size;

	void main() {
		// vec3 pos = texture2D(tTexture, vUv).xyz;
		float normalWidth = tWidth;

		vec4 targetColAlpha = texture2D(tFrame, vUv).xyzw;

		// if (targetColAlpha.w > 0.0) {
			// push on the particle
			vec3 pos = vec3(
				0.0,
				100.0,
				490.0
			);
		// }

		// write new position out
		gl_FragColor = vec4(pos, 1.0);
	}
`;
