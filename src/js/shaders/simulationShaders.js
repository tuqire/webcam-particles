const simulationVertexShader = `
	varying vec2 vUv;

	void main() {
	  vUv = vec2(uv);
		gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
	}
`;

const simulationFragmentShader = `
	/** generates a random number between 0 and 1 **/
	highp float rand(vec2 co)
	{
		highp float a = 12.9898;
		highp float b = 78.233;
		highp float c = 43758.5453;
		highp float dt= dot(co.xy ,vec2(a,b));
		highp float sn= mod(dt,3.14);
		return fract(sin(sn) * c);
	}

	varying vec2 vUv;

	uniform sampler2D tPrevFrame;
	uniform sampler2D tFrame;

	uniform vec3 mouse;
	uniform sampler2D tSize;
	uniform float yThreshold;

	uniform float tWidth;
	uniform float tHeight;

	vec3 getPos(vec3 defaultPos) {
		vec3 prevPos = texture2D(tPrevFrame, vUv).xyz;
		vec3 currPos = texture2D(tFrame, vUv).xyz;
		float xInc = texture2D(tSize, vUv).x;
		float yInc = texture2D(tSize, vUv).y;

		vec3 pos = currPos;

		float dist = length(pos - mouse);

		if (dist < 0.07) {
			pos += pos - mouse;
		} else if (pos == vec3(0.0, 0.0, 0.0) || pos.y - yThreshold > defaultPos.y) {
			pos = defaultPos;
		} else {
			pos.y += yInc;
			pos.x += rand(vec2(defaultPos.x, defaultPos.y)) > 0.5 ? xInc : -xInc;
		}

		return pos;
	}

	float getSize(vec3 defaultPos, vec3 pos) {
		float defaultSize = texture2D(tSize, vUv).z;
		float incSize = texture2D(tSize, vUv).w;
		float currSize = texture2D(tFrame, vUv).w;

		currSize += incSize;

		currSize += currSize > defaultSize + (incSize * 60.0) ? 0.0 : incSize;

		if (pos.y == defaultPos.y) {
			currSize = defaultSize / 2.0;
		}

		return currSize;
	}

	void main() {
		vec3 defaultPos = vec3((vUv.x * 1.0) - 0.5, (vUv.y * 1.0) - 0.5, 0.0);

		vec3 pos = getPos(defaultPos);
		float size = getSize(defaultPos, pos);

		// write new position out
		gl_FragColor = vec4(pos, size);
	}
`;

export {
	simulationFragmentShader,
	simulationVertexShader
};
