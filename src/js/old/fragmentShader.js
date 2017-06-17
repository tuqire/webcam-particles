export default `
	uniform sampler2D map;
	uniform sampler2D tTexture;

	varying vec2 vUv;

	void main() {
		vec3 colors = texture2D(tTexture, vUv).xyz;

		// gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
			gl_FragColor = vec4(colors, 1.0);
		// 	gl_FragColor = gl_FragColor * texture2D(map, gl_PointCoord);
		//	if (length(gl_PointCoord - vec2(0.5, 0.5)) > 0.475) discard;
	}
`;
