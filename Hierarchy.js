/**
 * @file
 *
 * Summary.
 * <p>Hierarchical Robot object using a matrix stack.</p>
 *
 * @author Paulo Roma
 * @since 27/09/2016
 * @see <a href="/cwdc/13-webgl/Assignment_3/Hierarchy.html">link</a>
 * @see <a href="/cwdc/13-webgl/Assignment_3/Hierarchy.js">source</a>
 * @see <a href="/cwdc/13-webgl/lib/teal_book/cuon-matrix.js">cuon-matrix</a>
 * @see <a href="/roma/Computer Graphics (3rd Edition).pdf#page=189">Foley</a>
 * @see <a href="https://www.cs.drexel.edu/~david/Classes/ICG/Lectures_new/L-14_HierchModels.pdf">Hierarchical Modeling</a>
 * @see <a href="/cwdc/13-webgl/Assignment_3/5.hierarchy.pdf">Hierarchy Tutorial</a>
 * @see <img src="/cwdc/13-webgl/Assignment_3/robot3.png" width="256"> <img src="/cwdc/13-webgl/Assignment_3/robot-full.png" width="420">
 * @see <img src="/cwdc/13-webgl/Assignment_3/camera_view_frustum.svg" width="340"> <img src="/cwdc/13-webgl/Assignment_3/side_view_frustum.png" width="340">
 */

"use strict";

// A few global variables...

/**
 * The OpenGL context.
 * @type {WebGL2RenderingContext}
 */
var gl;

/**
 * Handle to a buffer on the GPU.
 * @type {WebGLBuffer}
 */
var vertexBuffer;

/**
 * Handle to a buffer on the GPU.
 * @type {WebGLBuffer}
 */
var vertexNormalBuffer;

/**
 * Handle to a buffer on the GPU.
 * @type {WebGLBuffer}
 */
var vertexColorBuffer;

/**
 * Handle to the compiled shader program on the GPU.
 * @type {WebGLProgram}
 */
var lightingShader;

/**
 * Joint angles.
 * @type {Object<{String:Number}>}
 */
var joint = {
    torso: 0.0,
    shoulder: 45.0,
    arm: 45.0,
    hand: 0.0,
    head: 0.0,
	leftshoulder: 45.0,
	leftarm: 45.0,
	lefthand:0.0,
	leg:0.0,
	joelho:0.0,
	canela:0.0,
	pe:0.0,
	leftleg:0.0,
	leftjoelho:0.0,
	leftcanela:0.0,
	leftpe:0.0,
};

/**
 * Transformation matrix that is the root of 5 objects in the scene.
 * @type {Matrix4}
 */
var torsoMatrix = new Matrix4()
    .setTranslate(0, 0, 0)
    .rotate(joint.torso, 0, 1, 0);

/**  @type {Matrix4} */
var shoulderMatrix = new Matrix4()
    .setTranslate(6.5, 2, 0)
    .translate(0, 2, 0)
    .rotate(-joint.shoulder, 1, 0, 0)
    .translate(0, -2, 0);

/**  @type {Matrix4} */
var leftshoulderMatrix = new Matrix4()
    .setTranslate(-6.5, 2, 0)
    .translate(0, 2, 0)
    .rotate(-joint.leftshoulder, 1, 0, 0)
    .translate(0, -2, 0);

/**  @type {Matrix4} */
var armMatrix = new Matrix4()
    .setTranslate(0, -5, 0)
    .translate(0, 2.5, 1.0)
    .rotate(-joint.arm, 1, 0, 0)
    .translate(0, -2.5, -1.0);

/**  @type {Matrix4} */
var leftarmMatrix = new Matrix4()
    .setTranslate(0, -5, 0)
    .translate(0, 2.5, 1.0)
    .rotate(-joint.leftarm, 1, 0, 0)
    .translate(0, -2.5, -1.0);

/**  @type {Matrix4} */
var handMatrix = new Matrix4()
    .setTranslate(0, -4, 0)
    .rotate(joint.hand, 0, 1, 0);

/**  @type {Matrix4} */
var lefthandMatrix = new Matrix4()
    .setTranslate(0, -4, 0)
    .rotate(joint.lefthand, 0, 1, 0);

/**  @type {Matrix4} */
var headMatrix = new Matrix4()
    .setTranslate(0, 7, 0)
    .rotate(joint.head, 0, 1, 0);

/**  @type {Matrix4} */
var legMatrix = new Matrix4()
    .setTranslate(3, -7, 0)
    .rotate(joint.leg, 0, 1, 0);

/**  @type {Matrix4} */
var joelhoMatrix = new Matrix4()
    .setTranslate(0, -4, 0)
    .rotate(joint.joelho, 0, 1, 0);

/**  @type {Matrix4} */
var canelaMatrix = new Matrix4()
    .setTranslate(0, -2, 0)
    .rotate(joint.canela, 0, 1, 0);

/**  @type {Matrix4} */
var peMatrix = new Matrix4()
    .setTranslate(0, -2, 0)
    .rotate(joint.pe, 0, 1, 0);

/**  @type {Matrix4} */
var leftlegMatrix = new Matrix4()
    .setTranslate(-3, -7, 0)
    .rotate(joint.leftleg, 0, 1, 0);

/**  @type {Matrix4} */
var leftjoelhoMatrix = new Matrix4()
    .setTranslate(0, -4, 0)
    .rotate(joint.leftjoelho, 0, 1, 0);

/**  @type {Matrix4} */
var leftcanelaMatrix = new Matrix4()
    .setTranslate(0, -2, 0)
    .rotate(joint.leftcanela, 0, 1, 0);

/**  @type {Matrix4} */
var leftpeMatrix = new Matrix4()
    .setTranslate(0, -2, 0)
    .rotate(joint.leftpe, 0, 1, 0);

var torsoMatrixLocal = new Matrix4().setScale(10, 10, 5);
var shoulderMatrixLocal = new Matrix4().setScale(3, 5, 2);
var armMatrixLocal = new Matrix4().setScale(3, 5, 2);
var handMatrixLocal = new Matrix4().setScale(1, 3, 3);
var headMatrixLocal = new Matrix4().setScale(4, 4, 4);
var legMatrixLocal = new Matrix4().setScale(3, 6, 4);
var joelhoMatrixLocal = new Matrix4().setScale(2, 2, 2); 
var canelaMatrixLocal = new Matrix4().setScale(3, 3, 4);
var peMatrixLocal = new Matrix4().setScale(5, 1, 5); 

/* left members*/
var leftshoulderMatrixLocal = new Matrix4().setScale(3,5,2);
var leftarmMatrixLocal = new Matrix4().setScale(3, 5, 2); 
var lefthandMatrixLocal = new Matrix4().setScale(1, 3, 3);
var leftlegMatrixLocal = new Matrix4().setScale(3, 6, 4);
var leftjoelhoMatrixLocal = new Matrix4().setScale(2, 2, 2); 
var leftcanelaMatrixLocal = new Matrix4().setScale(3, 3, 4);
var leftpeMatrixLocal = new Matrix4().setScale(5, 1, 5);

/**
 * Camera position.
 * @type {Array<Number>}
 */
var eye = [20, 20, 20];

/**
 * View matrix.
 * @type {Matrix4}
 */
// prettier-ignore
var viewMatrix = new Matrix4().setLookAt(
  ...eye,     // eye
  0, 0, 0,    // at - looking at the origin
  0, 1, 0     // up vector - y axis
);

/**
 * Model matrix.
 * @type {Matrix4}
 */
var modelMatrix = new Matrix4();

/**
 * Returns the magnitude (length) of a vector.
 * @param {Array<Number>} v n-D vector.
 * @returns {Number} vector length.
 * @see https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce
 */
var vecLen = (v) =>
    Math.sqrt(v.reduce((accumulator, value) => accumulator + value * value, 0));

/**
 * View distance.
 * @type {Number}
 */
var viewDistance = vecLen(eye);

/**
 * <p>Projection matrix.</p>
 * Here use aspect ratio 3/2 corresponding to canvas size 600 x 400.
 * @type {Matrix4}
 */
var projection = new Matrix4().setPerspective(45, 1.5, 0.1, 1000);

/**
 * Object to enable rotation by mouse dragging (arcball).
 * @type {SimpleRotator}
 */
var rotator;

/**
 * A very basic stack class,
 * for keeping a hierarchy of transformations.
 * @class
 */
class Stack {
    /**
     * Constructor.
     * @constructs Stack
     */
    constructor() {
        /** Array for holding the stack elements. */
        this.elements = [];
        /** Top of the stack. */
        this.t = 0;
    }

    /**
     * Pushes a given matrix onto this stack.
     * @param {Matrix4} m transformation matrix.
     */
    push(m) {
        this.elements[this.t++] = m;
    }

    /**
     * Return the matrix at the top of this stack.
     * @return {Matrix4} m transformation matrix.
     */
    top() {
        if (this.t <= 0) {
            console.log("top = ", this.t);
            console.log("Warning: stack underflow");
        } else {
            return this.elements[this.t - 1];
        }
    }

    /**
     * Pops the matrix at the top of this stack.
     * @return {Matrix4} m transformation matrix.
     */
    pop() {
        if (this.t <= 0) {
            console.log("Warning: stack underflow");
        } else {
            this.t--;
            var temp = this.elements[this.t];
            this.elements[this.t] = undefined;
            return temp;
        }
    }

    /**
     * Returns whether this stack is empty.
     * @returns {Boolean} true if the stack is empty.
     */
    isEmpty() {
        return this.t <= 0;
    }
}

/**
 * <p>A cube model.</p>
 *
 * Creates data (numVertices, vertices, colors, and normal vectors)
 * for a unit cube. <br>
 * (Note this is a "self-invoking" anonymous function.)
 *
 * @type {cube_data}
 */
var cube = (() => {
    // vertices of cube
    // prettier-ignore
    var rawVertices = new Float32Array([
      -0.5, -0.5, 0.5,
      0.5, -0.5, 0.5,
      0.5, 0.5, 0.5,
      -0.5, 0.5, 0.5,
      -0.5, -0.5, -0.5,
      0.5, -0.5, -0.5,
      0.5, 0.5, -0.5,
      -0.5, 0.5, -0.5
    ]);

    // prettier-ignore
    var rawColors = new Float32Array([
      1.0, 0.0, 0.0, 1.0,  // red
      0.0, 1.0, 0.0, 1.0,  // green
      0.0, 0.0, 1.0, 1.0,  // blue
      1.0, 1.0, 0.0, 1.0,  // yellow
      1.0, 0.0, 1.0, 1.0,  // magenta
      0.0, 1.0, 1.0, 1.0,  // cyan
    ]);

    // prettier-ignore
    var rawNormals = new Float32Array([
      0, 0, 1,
      1, 0, 0,
      0, 0, -1,
      -1, 0, 0,
      0, 1, 0,
      0, -1, 0
    ]);

    // prettier-ignore
    var indices = new Uint16Array([
      0, 1, 2, 0, 2, 3,  // +z face
      1, 5, 6, 1, 6, 2,  // +x face
      5, 4, 7, 5, 7, 6,  // -z face
      4, 0, 3, 4, 3, 7,  // -x face
      3, 2, 6, 3, 6, 7,  // +y face
      4, 5, 1, 4, 1, 0   // -y face
    ]);

    var verticesArray = [];
    var colorsArray = [];
    var normalsArray = [];
    for (var i = 0; i < 36; ++i) {
        // for each of the 36 vertices...
        var face = Math.floor(i / 6);
        var index = indices[i];

        // (x, y, z): three numbers for each point
        for (var j = 0; j < 3; ++j) {
            verticesArray.push(rawVertices[3 * index + j]);
        }

        // (r, g, b, a): four numbers for each point
        for (var j = 0; j < 4; ++j) {
            colorsArray.push(rawColors[4 * face + j]);
        }

        // three numbers for each point
        for (var j = 0; j < 3; ++j) {
            normalsArray.push(rawNormals[3 * face + j]);
        }
    }

    /**
     * Returned value is an object with four attributes:
     * numVertices, vertices, colors, and normals.
     *
     * @return {Object<{numVertices: Number,
     *                  vertices: Float32Array,
     *                  colors: Float32Array,
     *                  normals: Float32Array}>}
     * cube associated attributes.
     * @callback cube_data
     */
    return {
        numVertices: 36, // number of indices
        vertices: new Float32Array(verticesArray), // 36 * 3 = 108
        colors: new Float32Array(colorsArray), // 36 * 4 = 144
        normals: new Float32Array(normalsArray), // 36 * 3 = 108
    };
})();

/**
 * Return a matrix to transform normals, so they stay
 * perpendicular to surfaces after a linear transformation.
 * @param {Matrix4} model model matrix.
 * @param {Matrix4} view view matrix.
 * @returns {Float32Array} modelview transposed inverse.
 */
function makeNormalMatrixElements(model, view) {
    var n = new Matrix4(view).multiply(model);
    n.transpose();
    n.invert();
    n = n.elements;
    // prettier-ignore
    return new Float32Array([
      n[0], n[1], n[2],
      n[4], n[5], n[6],
      n[8], n[9], n[10]
    ]);
}

/**
 * Translate keydown events to strings.
 * @param {KeyboardEvent} event keyboard event.
 * @return {String | null}
 * @see http://javascript.info/tutorial/keyboard-events
 */
function getChar(event) {
    event = event || window.event;
    let charCode = event.key || String.fromCharCode(event.which);
    return charCode;
}

/**
 * <p>Handler for keydown events.</p>
 * Adjusts object rotations.
 * @param {KeyboardEvent} event keyboard event.
 */
function handleKeyPress(event) {
    var ch = getChar(event);
    var d;
    let opt = document.getElementById("options");
    switch (ch) {
        case "t":
            joint.torso += 15;
            torsoMatrix.setTranslate(0, 0, 0).rotate(joint.torso, 0, 1, 0);
            break;
        case "T":
            joint.torso -= 15;
            torsoMatrix.setTranslate(0, 0, 0).rotate(joint.torso, 0, 1, 0);
            break;
        case "s":
            joint.shoulder += 15;
            // rotate shoulder clockwise about a point 2 units above its center
            var currentShoulderRot = new Matrix4()
                .setTranslate(0, 2, 0)
                .rotate(-joint.shoulder, 1, 0, 0)
                .translate(0, -2, 0);
            shoulderMatrix.setTranslate(6.5, 2, 0).multiply(currentShoulderRot);
            break;
        case "S":
            joint.shoulder -= 15;
            var currentShoulderRot = new Matrix4()
                .setTranslate(0, 2, 0)
                .rotate(-joint.shoulder, 1, 0, 0)
                .translate(0, -2, 0);
            shoulderMatrix.setTranslate(6.5, 2, 0).multiply(currentShoulderRot);
            break;
		case "d":
            joint.leftshoulder += 15;
            // rotate shoulder clockwise about a point 2 units above its center
            var currentleftShoulderRot = new Matrix4()
                .setTranslate(0, 2, 0)
                .rotate(-joint.leftshoulder, 1, 0, 0)
                .translate(0, -2, 0);
            leftshoulderMatrix.setTranslate(-6.5, 2, 0).multiply(currentleftShoulderRot);
            break;
        case "D":
            joint.leftshoulder -= 15;
            var currentleftShoulderRot = new Matrix4()
                .setTranslate(0, 2, 0)
                .rotate(-joint.leftshoulder, 1, 0, 0)
                .translate(0, -2, 0);
            leftshoulderMatrix.setTranslate(-6.5, 2, 0).multiply(currentleftShoulderRot);
            break;
        case "a":
            joint.arm += 15;
            // rotate arm clockwise about its top front corner
            var currentArm = new Matrix4()
                .setTranslate(0, 2.5, 1.0)
                .rotate(-joint.arm, 1, 0, 0)
                .translate(0, -2.5, -1.0);
            armMatrix.setTranslate(0, -5, 0).multiply(currentArm);
            break;
        case "A":
            joint.arm -= 15;
            var currentArm = new Matrix4()
                .setTranslate(0, 2.5, 1.0)
                .rotate(-joint.arm, 1, 0, 0)
                .translate(0, -2.5, -1.0);
            armMatrix.setTranslate(0, -5, 0).multiply(currentArm);
            break;
        case "w":
            joint.leftarm += 15;
            // rotate arm clockwise about its top front corner
            var currentleftArm = new Matrix4()
                .setTranslate(0, 2.5, 1.0)
                .rotate(-joint.leftarm, 1, 0, 0)
                .translate(0, -2.5, -1.0);
            leftarmMatrix.setTranslate(0, -5, 0).multiply(currentleftArm);
            break;
        case "W":
            joint.leftarm -= 15;
            var currentleftArm = new Matrix4()
                .setTranslate(0, 2.5, 1.0)
                .rotate(-joint.leftarm, 1, 0, 0)
                .translate(0, -2.5, -1.0);
            leftarmMatrix.setTranslate(0, -5, 0).multiply(currentleftArm);
            break;
        case "h":
            joint.hand += 15;
            handMatrix.setTranslate(0, -4, 0).rotate(joint.hand, 0, 1, 0);
            break;
        case "H":
            joint.hand -= 15;
            handMatrix.setTranslate(0, -4, 0).rotate(joint.hand, 0, 1, 0);
            break;
        case "q":
            joint.lefthand += 15;
            lefthandMatrix.setTranslate(0, -4, 0).rotate(joint.lefthand, 0, 1, 0);
            break;
        case "Q":
            joint.lefthand -= 15;
            lefthandMatrix.setTranslate(0, -4, 0).rotate(joint.lefthand, 0, 1, 0);
            break;
        case "l":
            joint.head += 15;
            headMatrix.setTranslate(0, 7, 0).rotate(joint.head, 0, 1, 0);
            break;
        case "L":
            joint.head -= 15;
            headMatrix.setTranslate(0, 7, 0).rotate(joint.head, 0, 1, 0);
            break;
        case "z":
            joint.leg += 15;
            legMatrix.setTranslate(3, -7, 0).rotate(joint.leg, 1, 0, 0);
            break;
        case "Z":
            joint.leg -= 15;
            legMatrix.setTranslate(3, -7, 0).rotate(joint.leg, 1, 0, 0);
            break;
        case "c":
            joint.joelho += 15;
            joelhoMatrix.setTranslate(0, -4, 0).rotate(joint.joelho, 0, 1, 0);
            break;
        case "C":
            joint.joelho -= 15;
            joelhoMatrix.setTranslate(0, -4, 0).rotate(joint.joelho, 0, 1, 0);
            break;
        case "f":
            joint.canela += 15;
            canelaMatrix.setTranslate(0, -2, 0).rotate(joint.canela, 0, 1, 0);
            break;
        case "F":
            joint.canela -= 15;
            canelaMatrix.setTranslate(0, -2, 0).rotate(joint.canela, 0, 1, 0);
            break;
        case "p":
            joint.pe += 15;
            peMatrix.setTranslate(0, -2, 0).rotate(joint.pe, 0, 1, 0);
            break;
        case "P":
            joint.pe -= 15;
            peMatrix.setTranslate(0, -2, 0).rotate(joint.pe, 0, 1, 0);
            break;
        case "e":
            joint.leftleg += 15;
            leftlegMatrix.setTranslate(-3, -7, 0).rotate(joint.leftleg, 1, 0, 0);
            break;
        case "E":
            joint.leftleg -= 15;
            leftlegMatrix.setTranslate(-3, -7, 0).rotate(joint.leftleg, 1, 0, 0);
            break;
        case "g":
            joint.leftjoelho += 15;
            leftjoelhoMatrix.setTranslate(0, -4, 0).rotate(joint.leftjoelho, 0, 1, 0);
            break;
        case "G":
            joint.leftjoelho -= 15;
            leftjoelhoMatrix.setTranslate(0, -4, 0).rotate(joint.leftjoelho, 0, 1, 0);
            break;
        case "i":
            joint.leftcanela += 15;
            leftcanelaMatrix.setTranslate(0, -2, 0).rotate(joint.leftcanela, 0, 1, 0);
            break;
        case "I":
            joint.leftcanela -= 15;
            leftcanelaMatrix.setTranslate(0, -2, 0).rotate(joint.leftcanela, 0, 1, 0);
            break;
        case "u":
            joint.leftpe += 15;
            leftpeMatrix.setTranslate(0, -2, 0).rotate(joint.leftpe, 0, 1, 0);
            break;
        case "U":
            joint.leftpe -= 15;
            leftpeMatrix.setTranslate(0, -2, 0).rotate(joint.leftpe, 0, 1, 0);
            break;
        case "ArrowUp":
            // Up pressed
            d = rotator.getViewDistance();
            d = Math.min(d + 1, 90);
            rotator.setViewDistance(d);
            break;
        case "ArrowDown":
            // Down pressed
            d = rotator.getViewDistance();
            d = Math.max(d - 1, 20);
            rotator.setViewDistance(d);
            break;
        default:
            return;
    }
    draw();

    opt.innerHTML = `<br>${gl.getParameter(
        gl.SHADING_LANGUAGE_VERSION
    )}<br>${gl.getParameter(gl.VERSION)}`;
}

/**
 * <p>Helper function.</p>
 * Renders the cube based on the model transformation
 * on top of the stack and the given local transformation.
 * @param {Matrix4} matrixStack matrix on top of the stack;
 * @param {Matrix4} matrixLocal local transformation.
 */
function renderCube(matrixStack, matrixLocal) {
    // bind the shader
    gl.useProgram(lightingShader);

    // get the index for the a_Position attribute defined in the vertex shader
    var positionIndex = gl.getAttribLocation(lightingShader, "a_Position");
    if (positionIndex < 0) {
        console.log("Failed to get the storage location of a_Position");
        return;
    }

    var normalIndex = gl.getAttribLocation(lightingShader, "a_Normal");
    if (normalIndex < 0) {
        console.log("Failed to get the storage location of a_Normal");
        return;
    }

    var colorIndex = gl.getAttribLocation(lightingShader, "a_Color");
    if (colorIndex < 0) {
        console.log("Failed to get the storage location of a_Color");
        return;
    }

    // "enable" the a_position attribute
    gl.enableVertexAttribArray(positionIndex);
    gl.enableVertexAttribArray(normalIndex);
    gl.enableVertexAttribArray(colorIndex);

    // bind data for points and normals
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.vertexAttribPointer(positionIndex, 3, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexNormalBuffer);
    gl.vertexAttribPointer(normalIndex, 3, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer);
    gl.vertexAttribPointer(colorIndex, 4, gl.FLOAT, false, 0, 0);

    var loc = gl.getUniformLocation(lightingShader, "view");
    gl.uniformMatrix4fv(loc, false, viewMatrix.elements);
    loc = gl.getUniformLocation(lightingShader, "projection");
    gl.uniformMatrix4fv(loc, false, projection.elements);
    loc = gl.getUniformLocation(lightingShader, "u_Color");
    gl.uniform4f(loc, 0.0, 1.0, 0.0, 1.0);
    var loc = gl.getUniformLocation(lightingShader, "lightPosition");
    gl.uniform4f(loc, 5.0, 10.0, 5.0, 1.0);

    var modelMatrixloc = gl.getUniformLocation(lightingShader, "model");
    var normalMatrixLoc = gl.getUniformLocation(lightingShader, "normalMatrix");

    // transform using current model matrix on top of stack
    var current = new Matrix4(matrixStack.top()).multiply(matrixLocal);
    current = new Matrix4(modelMatrix).multiply(current);
    gl.uniformMatrix4fv(modelMatrixloc, false, current.elements);
    gl.uniformMatrix3fv(
        normalMatrixLoc,
        false,
        makeNormalMatrixElements(current, viewMatrix)
    );

    gl.drawArrays(gl.TRIANGLES, 0, cube.numVertices);

    // on safari 10, buffer cannot be disposed before drawing...
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.useProgram(null);
}

/**
 * <p>Code to actually render our geometry.</p>
 * @param {Boolean} useRotator whether a {@link SimpleRotator} should be used.
 */
function draw(useRotator = true) {
    // clear the framebuffer
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    if (useRotator) viewMatrix.elements = rotator.getViewMatrix();

    // set up the matrix stack
    var s = new Stack();
    s.push(torsoMatrix);
    renderCube(s, torsoMatrixLocal);

    // shoulder relative to torso
    s.push(new Matrix4(s.top()).multiply(shoulderMatrix));
    renderCube(s, shoulderMatrixLocal);

    // arm relative to shoulder
    s.push(new Matrix4(s.top()).multiply(armMatrix));
    renderCube(s, armMatrixLocal);

    // hand relative to arm
    s.push(new Matrix4(s.top()).multiply(handMatrix));
    renderCube(s, handMatrixLocal);
    s.pop();
    s.pop();
    s.pop();

	// leg relative to torso
	s.push(new Matrix4(s.top()).multiply(legMatrix));
    renderCube(s, legMatrixLocal);
	//joelho relativo a perna
	s.push(new Matrix4(s.top()).multiply(joelhoMatrix));
	renderCube(s,joelhoMatrixLocal);
	// canela relativo a joelho
	s.push(new Matrix4(s.top()).multiply(canelaMatrix));
	renderCube(s,canelaMatrixLocal);
	// pe relativo a canela
	s.push(new Matrix4(s.top()).multiply(peMatrix));
	renderCube(s,peMatrixLocal);

	s.pop();
	s.pop();
	s.pop();
	s.pop();

	// left sholder relative to torso
	s.push(new Matrix4(s.top()).multiply(leftshoulderMatrix));
	renderCube(s,leftshoulderMatrixLocal);

	//left arm relative to sholder
	s.push(new Matrix4(s.top()).multiply(leftarmMatrix));
	renderCube(s,leftarmMatrixLocal);

	//left hand relative to arm
	s.push(new Matrix4(s.top()).multiply(lefthandMatrix));
	renderCube(s,lefthandMatrixLocal);
	s.pop();
	s.pop();
	s.pop();
	// perna esquerda
	s.push(new Matrix4(s.top()).multiply(leftlegMatrix));
	renderCube(s,leftlegMatrixLocal);
	// joelho esqerdo
	s.push(new Matrix4(s.top()).multiply(leftjoelhoMatrix));
	renderCube(s,leftjoelhoMatrixLocal);
	// canela esquerda
	s.push(new Matrix4(s.top()).multiply(leftcanelaMatrix));
	renderCube(s,leftcanelaMatrixLocal);
	// pe esquerdo
	s.push(new Matrix4(s.top()).multiply(leftpeMatrix));
	renderCube(s,leftpeMatrixLocal);
	s.pop();
	s.pop();
	s.pop();
	s.pop();

    // head relative to torso
    s.push(new Matrix4(s.top()).multiply(headMatrix));
    renderCube(s, headMatrixLocal);
    s.pop();
    s.pop();

    if (!s.isEmpty()) {
        console.log("Warning: pops do not match pushes");
    }
}

/**
 * <p>Entry point when page is loaded.</p>
 *
 * Starts an {@link animate animation} loop.
 *
 * <p>Basically this function does setup that "should" only have to be done once,<br>
 * while draw() does things that have to be repeated each time the canvas is
 * redrawn.</p>
 * @function
 * @memberof Window
 * @name anonymous_load
 * @global
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Window/load_event
 */
window.addEventListener("load", (event) => {
    // retrieve <canvas> element
    var canvas = document.getElementById("theCanvas");

    // key handler
    window.addEventListener("keydown", (event) => {
        if (
            [
                "Space",
                "ArrowUp",
                "ArrowDown",
                "ArrowLeft",
                "ArrowRight",
            ].indexOf(event.code) > -1
        ) {
            event.preventDefault();
        }
        handleKeyPress(event);
    });

    gl = canvas.getContext("webgl2");
    if (!gl) {
        console.log("Failed to get the rendering context for WebGL");
        return;
    }

    // load and compile the shader pair, using utility from the teal book
    var vshaderSource = document.getElementById(
        "vertexLightingShader"
    ).textContent;
    var fshaderSource = document.getElementById(
        "fragmentLightingShader"
    ).textContent;
    if (!initShaders(gl, vshaderSource, fshaderSource)) {
        console.log("Failed to initialize shaders.");
        return;
    }
    lightingShader = gl.program;
    gl.useProgram(null);

    // At any given time there can only be one buffer bound for each type
    // (ARRAY_BUFFER and ELEMENT_ARRAY_BUFFER),
    // so the flow is to bind a buffer and set its data followed
    // by setting up the vertex attribute pointers for that specific buffer,
    // then proceed to the next buffer:

    // buffer for vertex positions for triangles
    vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) {
        console.log("Failed to create the buffer object");
        return;
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, cube.vertices, gl.STATIC_DRAW);

    // buffer for vertex normals
    vertexNormalBuffer = gl.createBuffer();
    if (!vertexNormalBuffer) {
        console.log("Failed to create the buffer object");
        return;
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexNormalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, cube.normals, gl.STATIC_DRAW);

    // buffer for vertex colors
    vertexColorBuffer = gl.createBuffer();
    if (!vertexColorBuffer) {
        console.log("Failed to create the buffer object");
        return;
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, cube.colors, gl.STATIC_DRAW);

    // buffer is not needed anymore (not necessary, really)
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    // specify a fill color for clearing the framebuffer
    gl.clearColor(0.9, 0.9, 0.9, 1.0);

    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);
    gl.cullFace(gl.BACK);

    // fix aspect ratio
    projection = new Matrix4().setPerspective(
        60,
        canvas.width / canvas.height,
        0.1,
        1000
    );

    // create new rotator object
    rotator = new SimpleRotator(canvas, draw);
    rotator.setViewMatrix(viewMatrix.elements);
    rotator.setViewDistance(viewDistance);

    /**
     * <p>Define an animation loop.</p>
     * Start drawing!
     * @callback animate
     */
    (function animate() {
        draw();
        // requestAnimationFrame(animate);
    })();
});


