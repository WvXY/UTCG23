const canvas = document.getElementById("glCanvas");
// GL コンテキストを初期化する
const gl = canvas.getContext("webgl");

let vertices = [
    -0.7, -0.1, 0,
    -0.3, 0.6, 0,
    -0.3, -0.3, 0,
    0.2, 0.6, 0,
    0.3, -0.3, 0,
    0.7, 0.6, 0
    ];


// Code Below referred from
// https://www.tutorialspoint.com/webgl/webgl_modes_of_drawing.htm#

// Buffer
const vertexBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
gl.bindBuffer(gl.ARRAY_BUFFER, null);

// Shader
const vertexShader = gl.createShader(gl.VERTEX_SHADER);
const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);


const vertexSource =
    'attribute vec3 coordinates;' +
    'void main(void) {' +
    'gl_Position = vec4(coordinates, 1.0);' +
    '}';


gl.shaderSource(vertexShader, vertexSource);
gl.compileShader(vertexShader);


const fragmentSource =
    'void main(void) {' +
    'gl_FragColor = vec4(0.0, 0.0, 1.0, 1);' +
    '}';

gl.shaderSource(fragmentShader, fragmentSource);
gl.compileShader(fragmentShader);

// Shader Program
const shaderProgram = gl.createProgram();
gl.attachShader(shaderProgram,vertexShader);
gl.attachShader(shaderProgram,fragmentShader);
gl.linkProgram(shaderProgram);
gl.useProgram(shaderProgram);

// console.log(gl)

gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
const coord = gl.getAttribLocation(shaderProgram, "coordinates");
gl.vertexAttribPointer(coord, 3, gl.FLOAT, false, 0, 0); // what?
gl.enableVertexAttribArray(coord);

// Draw
//gl.clearColor(0,1, 1, 1);
//gl.enable(gl.DEPTH_TEST);
//gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
// gl.viewport(0,0,canvas.width, canvas.height);
gl.drawArrays(gl.LINE_LOOP, 0, 6);

