export default `
	uniform sampler2D tFrame;
	uniform float sizeMultipler;

	varying vec2 vUv;

	void main() {
		vUv = position.xy;
		// vUv = vec2(0.5, 0.5);

		// position saved as color value in a texture object in memory
		vec3 pos = texture2D(tFrame, vUv).xyz;
		float size = texture2D(tFrame, vUv).w;

		vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
		gl_PointSize = 10.0 * (sizeMultipler / -mvPosition.z);
		gl_Position = projectionMatrix * mvPosition;
	}
`;
