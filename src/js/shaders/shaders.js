/* eslint-disable */

const fragmentShader = `
	uniform sampler2D tVideo;
	uniform bool isCircle;

	varying vec2 vUv;

	void main() {
		vec3 colors = texture2D(tVideo, vUv).rgb;

		gl_FragColor = vec4(colors, 1.0);

		if (isCircle) {
			if (length(gl_PointCoord - vec2(0.5, 0.5)) > 0.475) discard; // makes particles a circle
		}
	}
`

const vertexShader = `
	uniform sampler2D tParams;
	uniform float sizeMultipler;

	varying vec2 vUv;

	void main() {
		vUv = position.xy;

		vec3 pos = texture2D(tParams, vUv).xyz;
		float size = texture2D(tParams, vUv).a;

		vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
		gl_PointSize = size * (sizeMultipler / -mvPosition.z);
		gl_Position = projectionMatrix * mvPosition;
	}
`

export {
  fragmentShader,
  vertexShader
}
