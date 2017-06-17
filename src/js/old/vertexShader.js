export default `
	uniform sampler2D tFrame;
	uniform float sizeMultipler;

	varying vec2 vUv;

	void main() {
		vUv = position.xy;

		// position saved as color value in a texture object in memory
		vec3 pos = texture2D(tFrame, vUv).xyz;
		float size = 3.0;

		vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
		gl_PointSize = size * (sizeMultipler / -mvPosition.z);
		gl_Position = projectionMatrix * mvPosition;
	}
`;
