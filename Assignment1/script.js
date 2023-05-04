// var nj = require('numjs');

function basis_function(u, i, p, U) {
    if (p === 0) {
        if (U[i] <= u && u < U[i + 1]) {
            return 1;
        } else {
            return 0;
        }
    } else {    // can be optimized
        let N1 = 0; let N2 = 0;
        let B1 = basis_function(u, i, p - 1, U);
        let B2 = basis_function(u, i + 1, p - 1, U);
        if (B1 !== 0) {N1 = B1 * (u - U[i]) / (U[i + p] - U[i] );}
        if (B2 !== 0) {N2 = B2 * (U[i + p + 1] - u) / (U[i + p + 1] - U[i + 1]);}
        return N1 + N2;
    }
}

function rational_base_function(u, i, p, n, w, U) {
    let sum = 0;
    for (let j = 0; j <= n; j++) {
        sum += w[j] * basis_function(u, j, p, U);
    }
    return basis_function(u, i, p, U) * w[i] / sum;
}


function nurbs(u, p, n, w, U, controlPoints) {
    let vertices = [0, 0];
    var R;
    for (let i = 0; i <= n; i++) {
        R = rational_base_function(u, i, p, n, w, U);
        vertices[0] += R * controlPoints[i][0];
        vertices[1] += R * controlPoints[i][1];
    }
    return vertices;
}

function draw_line(p, n, w, U, lines, controlPoints) {
    //var lines = 1000;
    let vertices = [];
    for (let i = 0; i <= lines; i++) {
        let point = nurbs((i + 1) / lines, p, n, w, U, controlPoints);
        vertices.push(point[0] || 0, (point[1]  || 0 )-0.5, 0); // x/2, y/2 -.5(offset), z=0
    }
    return vertices;
}


// -------------------------Draw Circle-------------------------------
let P = [[0, 0], [1, 0], [1 / 2, Math.sqrt(3) / 2],
    [0, Math.sqrt(3)], [-1 / 2, Math.sqrt(3) / 2], [-1, 0],
    [0, 0]];                                                  // Control Points
const U = [0, 0, 0, 1/3, 1/3, 2/3, 2/3, 1, 1, 1];   // Knot Vector
let w = [1, 0.5, 1, 0.5, 1, 0.5, 1];                // weight (=ones(): B-Spline)
let n = 6;
let p = 2;
let m = n + p + 1;

let vertices = draw_line(p, n, w, U, 100, P);

console.log(vertices);


/*-----------------------------WebGL-------------------------------------
Code Below referred from (Edited)
https://www.tutorialspoint.com/webgl/webgl_modes_of_drawing.htm#
*/

// init
const canvas = document.getElementById("glCanvas");
const gl = canvas.getContext("webgl");

// Buffer
const vertexBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
gl.bindBuffer(gl.ARRAY_BUFFER, null);

console.log(gl.ARRAY_BUFFER)

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
    'gl_FragColor = vec4(1.0, 0.0, 0.0, 1);' +
    '}';

gl.shaderSource(fragmentShader, fragmentSource);
gl.compileShader(fragmentShader);

// Shader Program
const shaderProgram = gl.createProgram();
gl.attachShader(shaderProgram, vertexShader);
gl.attachShader(shaderProgram, fragmentShader);
gl.linkProgram(shaderProgram);
gl.useProgram(shaderProgram);

gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
const coord = gl.getAttribLocation(shaderProgram, "coordinates");
gl.vertexAttribPointer(coord, 3, gl.FLOAT, false, 0, 0); // what?
gl.enableVertexAttribArray(coord);

// Draw
gl.clearColor(0,1, 1, 0.5);
gl.enable(gl.DEPTH_TEST);
gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
gl.viewport(0, 0, canvas.width, canvas.height);
gl.drawArrays(gl.LINE_LOOP, 0, 100);

