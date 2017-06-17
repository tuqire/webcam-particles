export default `
	varying vec2 vUv;

	void main() {
	  vUv = vec2(uv);
		gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
	}
`;
