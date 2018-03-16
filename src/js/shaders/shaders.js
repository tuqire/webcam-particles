/* eslint-disable */

const fragmentShader = `
	uniform sampler2D tTexture;

	varying vec2 vUv;

	void main() {
		vec3 colors = texture2D(tTexture, vUv).xyz;

		gl_FragColor = vec4(colors, 1.0);
		if (length(gl_PointCoord - vec2(0.5, 0.5)) > 0.475) discard;
	}
`

const vertexShader = `
	uniform sampler2D tFrame;
	uniform float sizeMultipler;

	varying vec2 vUv;

	void main() {
		vUv = position.xy;

		// position saved as color value in a texture object in memory
		vec3 pos = texture2D(tFrame, vUv).xyz;
		float size = texture2D(tFrame, vUv).w;

		vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
		gl_PointSize = size * (sizeMultipler / -mvPosition.z);
		gl_Position = projectionMatrix * mvPosition;
	}
`

export {
  fragmentShader,
  vertexShader
}
