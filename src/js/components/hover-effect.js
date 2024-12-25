const shader = {
  vertex: `#ifdef GL_ES
	precision mediump float;
    #endif
    attribute vec3 aVertexPosition;
    attribute vec2 aTextureCoord;

    // those are mandatory uniforms that the lib sets and that contain our model view and projection matrix
    uniform mat4 uMVMatrix;
    uniform mat4 uPMatrix;

    uniform mat4 texture0Matrix;
    uniform mat4 texture1Matrix;
    uniform mat4 mapMatrix;

    // if you want to pass your vertex and texture coords to the fragment shader
    varying vec3 vVertexPosition;
    varying vec2 vTextureCoord0;
    varying vec2 vTextureCoord1;
    varying vec2 vTextureCoordMap;

    void main() {
	vec3 vertexPosition = aVertexPosition;

	gl_Position = uPMatrix * uMVMatrix * vec4(vertexPosition, 1.0);

	// set the varyings
	vTextureCoord0 = (texture0Matrix * vec4(aTextureCoord, 0., 1.)).xy;
	vTextureCoord1 = (texture1Matrix * vec4(aTextureCoord, 0., 1.)).xy;
	vTextureCoordMap = (mapMatrix * vec4(aTextureCoord, 0., 1.)).xy;
	vVertexPosition = vertexPosition;
    }`,
  fragment: `#ifdef GL_ES
    precision mediump float;
    #endif

    #define PI2 6.28318530718
    #define PI 3.14159265359
    #define S(a,b,n) smoothstep(a,b,n)

    uniform float uTime;
    uniform float uProgress;
    uniform vec2 uReso;
    uniform vec2 uMouse;

    // get our varyings
    varying vec3 vVertexPosition;
    varying vec2 vTextureCoord0;
    varying vec2 vTextureCoord1;
    varying vec2 vTextureCoordMap;

    // the uniform we declared inside our javascript

    // our texture sampler (default name, to use a different name please refer to the documentation)
    uniform sampler2D texture0;
    uniform sampler2D texture1;
    uniform sampler2D map;
    // http://www.flong.com/texts/code/shapers_exp/
    float exponentialEasing (float x, float a){

	float epsilon = 0.00001;
	float min_param_a = 0.0 + epsilon;
	float max_param_a = 1.0 - epsilon;
	a = max(min_param_a, min(max_param_a, a));
	if (a < 0.5){
	// emphasis
	a = 2.0 * a;
	float y = pow(x, a);
	return y;
	} else {
	// de-emphasis
	a = 2.0 * (a-0.5);
	float y = pow(x, 1.0 / (1.-a));
	return y;
	}
    }
    void main(){
	vec2 uv0 = vTextureCoord0;
	vec2 uv1 = vTextureCoord1;
	float progress0 = uProgress;
	float progress1 = 1. - uProgress;
	vec4 map = texture2D(map, vTextureCoordMap );
	float t0 = uv0.y * progress0 * map.r;
	float t1 = uv1.y * progress1 * map.r;
	uv0.x += t0;
	uv1.x -= t1;
	vec4 color = texture2D(texture0, uv0 );
	vec4 color1 = texture2D( texture1, uv1 );
	gl_FragColor = mix(color, color1, progress0 );
    }`,
};
class WEBGL {
  constructor(set) {
    this.canvas = set.canvas;
    this.webGLCurtain = new Curtains(set.curtains);
    this.planeElement = set.planeElement;
    this.mouse = {
      x: 0,
      y: 0,
    };
    this.params = {
      vertexShader: shader.vertex,
      fragmentShader: shader.fragment,
      alwaysDraw: true,
      widthSegments: 40,
      heightSegments: 40, // we now have 40*40*6 = 9600 vertices !
      uniforms: {
        time: {
          name: "uTime", // uniform name that will be passed to our shaders
          type: "1f", // this means our uniform is a float
          value: 0,
        },
        mousepos: {
          name: "uMouse",
          type: "2f",
          value: [0, 0],
        },
        resolution: {
          name: "uReso",
          type: "2f",
          value: [innerWidth, innerHeight],
        },
        progress: {
          name: "uProgress",
          type: "1f",
          value: 0,
        },
      },
    };
  }
  initPlane() {
    // create our plane mesh
    this.plane = this.webGLCurtain.addPlane(this.planeElement, this.params);
    // use the onRender method of our plane fired at each requestAnimationFrame call
    if (this.plane) {
      this.plane.onReady(() => {
        this.update();
        this.initEvent();
      });
    }
  }
  update() {
    this.plane.onRender(() => {
      this.plane.uniforms.time.value += 0.01; // update our time uniform value
      this.plane.uniforms.resolution.value = [innerWidth, innerHeight];
    });
  }
  initEvent() {
    this.planeElement.addEventListener("mouseenter", (e) => {
      TweenMax.to(this.plane.uniforms.progress, 0.5, {
        value: 1,
      });
    });
    this.planeElement.addEventListener("mouseout", (e) => {
      TweenMax.to(this.plane.uniforms.progress, 0.5, {
        value: 0,
      });
    });
  }
}
document.querySelectorAll(".canvas-wrap").forEach((el) => {
  const id = el.querySelector(".canvas-plane").id;
  const webgl = new WEBGL({
    canvas: el.querySelector(".canvas-plane"),
    curtains: id,
    planeElement: el.getElementsByClassName("plane")[0],
  });
  webgl.initPlane();
});
