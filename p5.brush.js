/**
 * @fileoverview p5.brush - A comprehensive toolset for brush management in p5.js.
 * @version 1.0
 * @license MIT
 * @author Alejandro Campos Uribe
 * 
 * @description
 * p5.brush is a p5.js library dedicated to the creation and management of custom brushes.
 * It extends the drawing capabilities of p5.js by allowing users to simulate a wide range
 * of brush strokes, vector fields, hatching patterns, and fill textures. These features
 * are essential for emulating the nuanced effects found in traditional sketching and painting.
 * Whether for digital art applications or procedural generation of graphics, p5.brush provides
 * a robust framework for artists and developers to create rich, dynamic, and textured visuals.
 *
 * @example
 * // Basic usage:
 * brush.pick('marker'); // Select brush type
 * brush.stroke(255, 0, 0); // Set brush color
 * brush.strokeWeight(10); // Set brush size
 * brush.line(25, 25, 75, 75); // Draw a line
 * 
 * // Add a new brush type:
 * brush.add('customBrush', { /* parameters for the brush *\/ });
 * brush.pick('customBrush');
 * 
 * // Use the custom brush for a vector-field line:
 * brush.field('field_name') // Pick a flowfield
 * brush.flowLine(50, 50, 100, PI / 4); // Draw a line within the vector-field
 *
 * // Fill textures:
 * brush.noStroke();
 * brush.fill('#FF0000', 90); // Set fill color to red and opacity to 90
 * brush.bleed(0.3); // Set bleed effect for a watercolor-like appearance
 * brush.rect(100, 100, 50, 50); // Fill a rectangle with the bleed effect
 * 
 * @license
 * MIT License
 * 
 * Copyright (c) 2023 Alejandro Campos Uribe
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 */

(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = global || self, factory(global.brush = {}));
} (this, (function (exports) { 
    'use strict';

// =============================================================================
// Section: Configure and Initiate
// =============================================================================
/**
 * This section contains functions for setting up the drawing system. It allows 
 * for configuration with custom options, initialization of the system, preloading
 * necessary assets, and a check to ensure the system is ready before any drawing 
 * operation is performed.
 */

    /**
     * Reference to the renderer or canvas object.
     * @type {Object}
     */
    let _r;

    /**
     * Flag to indicate if the system is ready for rendering.
     * @type {boolean}
     */
    let _isReady = false;

    /**
     * Configures the drawing system with custom options.
     * @param {Object} [objct={}] - Optional configuration object.
     * EXPORTED
     */
    function configureSystem(objct = {}) {
        if (objct.R) R.source = objct.R; // Overrides the default random source if provided
    }

    /**
     * Initializes the drawing system and sets up the environment.
     * @param {string|boolean} [canvasID=false] - Optional ID of the canvas element to use.
     *                                            If false, it uses the current window as the rendering context.
     * EXPORTED
     */
    function loadSystem (canvasID = false) {
        _isReady = true;
        // Set the renderer to the specified canvas or to the window if no ID is given
        _r = (!canvasID) ? window.self : canvasID;
        // Load realistic color blending
        Mix.load();
        // Load flowfield system
        FF.create();
        // Adjust standard brushes to match canvas size
        globalScale(_r.width / 250) // Adjust standard brushes to match canvas
    }

    /**
     * Preloads necessary assets or configurations.
     * This function should be called before setup to ensure all assets are loaded.
     * EXPORTED
     */
    function preloadBrushAssets () {
        // Load custom image tips
        T.load();
    }

    /**
     * Ensures that the drawing system is ready before any drawing operation.
     * Loads the system if it hasn't been loaded already.
     */
    function _ensureReady () {
        if (!_isReady) loadSystem();
    }

// =============================================================================
// Section: Randomness and other auxiliary functions
// =============================================================================
/**
 * This section includes utility functions for randomness, mapping values, 
 * constraining numbers within a range, and precalculated trigonometric values 
 * to optimize performance. Additionally, it provides auxiliary functions for 
 * geometric calculations such as translation extraction, line intersection, 
 * and angle calculation.
 */

    /**
     * Object for random number generation and related utility functions.
     * @property {function} source - Function that returns a random number from the base random generator.
     * @property {function} random - Function to generate a random number within a specified range.
     * @property {function} randInt - Function to generate a random integer within a specified range.
     * @property {function} weightedRand - Function to generate a random value based on weighted probabilities.
     * @property {function} map - Function to remap a number from one range to another.
     * @property {function} constrain - Function to constrain a number within a range.
     * @property {function} cos - Function to get the cosine of an angle from precalculated values.
     * @property {function} sin - Function to get the sine of an angle from precalculated values.
     * @property {boolean} isPrecalculationDone - Flag to check if precalculation of trigonometric values is complete.
     * @property {function} preCalculation - Function to precalculate trigonometric values.
     */
    const R = {

        /**
         * The basic source of randomness, can be replaced with a deterministic alternative for testing.
         * @returns {number} A random number between 0 and 1.
         */
        source: () => random(),

        /**
         * Generates a random number within a specified range.
         * @param {number} [min=0] - The lower bound of the range.
         * @param {number} [max=1] - The upper bound of the range.
         * @returns {number} A random number within the specified range.
         */
        random(e = 0, r = 1) {
            if (arguments.length === 1) {return this.map(this.source(), 0, 1, 0, e); }
            else {return this.map(this.source(), 0, 1, e, r)}
        },

        /**
         * Generates a random integer within a specified range.
         * @param {number} min - The lower bound of the range.
         * @param {number} max - The upper bound of the range.
         * @returns {number} A random integer within the specified range.
         */
        randInt(e, r) {
            return Math.floor(this.random(e,r))
        },

        /**
         * Generates a random value based on weighted probabilities.
         * @param {Object} weights - An object containing values as keys and their probabilities as values.
         * @returns {string} A key randomly chosen based on its weight.
         */
        weightedRand(e) {
            let r, a, n = [];
            for (r in e)
                for (a = 0; a < 10 * e[r]; a++)
                    n.push(r);
                return n[Math.floor(this.source() * n.length)]
        },

        /**
         * Remaps a number from one range to another.
         * @param {number} value - The number to remap.
         * @param {number} a - The lower bound of the value's current range.
         * @param {number} b- The upper bound of the value's current range.
         * @param {number} c - The lower bound of the value's target range.
         * @param {number} d - The upper bound of the value's target range.
         * @param {boolean} [withinBounds=false] - Whether to constrain the value to the target range.
         * @returns {number} The remapped number.
         */
        map(value, a, b, c, d, withinBounds = false) {
            let r = c + (value - a) / (b - a) * (d - c);
            if (!withinBounds) return r;
            if (c < d) {return this.constrain(r, c, d)} 
            else {return this.constrain(r, d, c)}
        },

        /**
         * Constrains a number to be within a range.
         * @param {number} n - The number to constrain.
         * @param {number} low - The lower bound of the range.
         * @param {number} high - The upper bound of the range.
         * @returns {number} The constrained number.
         */
        constrain (n, low, high) {
            return Math.max(Math.min(n, high), low);
        },

        /**
         * Calculates the cosine for a given angle using precalculated values.
         * @param {number} angle - The angle in degrees.
         * @returns {number} The cosine of the angle.
         */
        cos(angle) {
            return this.c[Math.floor(4 * ((angle % 360 + 360) % 360))];
        },

        /**
         * Calculates the sine for a given angle using precalculated values.
         * @param {number} angle - The angle in degrees.
         * @returns {number} The sine of the angle.
         */
        sin(angle) {
            return this.s[Math.floor(4 * ((angle % 360 + 360) % 360))];
        },
        // Flag to indicate if the trigonometric tables have been precalculated
        isPrecalculationDone: false,
        
        /**
         * Precalculates trigonometric values for improved performance.
         * This function should be called before any trigonometric calculations are performed.
         */
        preCalculation() {
            if (this.isPrecalculationDone) return;
            const totalDegrees = 1440;
            const radiansPerIndex = 2 * Math.PI / totalDegrees;
            this.c = new Float64Array(totalDegrees);
            this.s = new Float64Array(totalDegrees);
            for (let i = 0; i < totalDegrees; i++) {
                const radians = i * radiansPerIndex;
                R.c[i] = Math.cos(radians);
                R.s[i] = Math.sin(radians);
            }
            this.isPrecalculationDone = true;
        }
    }
    // Perform the precalculation of trigonometric values for the R object
    R.preCalculation();

    /**
     * Captures the current translation values from the renderer's transformation matrix.
     * 
     * Assumes that the renderer's transformation matrix (`uMVMatrix`) is a 4x4 matrix
     * where the translation components are in the 13th (index 12) and 14th (index 13) positions.
     * 
     * @returns {number[]} An array containing the x (horizontal) and y (vertical) translation values.
     */
    let _matrix = [0,0];
    const _trans = function () {
        // Access the renderer's current model-view matrix and extract the translation components
        _matrix = [_r._renderer.uMVMatrix.mat4[12],_r._renderer.uMVMatrix.mat4[13]]
        // Return the translation components as a two-element array
        return _matrix;
    }

    /**
     * Calculates the intersection point between two line segments if it exists.
     * 
     * @param {Object} seg1Start - The start point of the first line segment.
     * @param {Object} seg1End - The end point of the first line segment.
     * @param {Object} seg2Start - The start point of the second line segment.
     * @param {Object} seg2End - The end point of the second line segment.
     * @param {boolean} [includeSegmentExtension=false] - Whether to include points of intersection not lying on the segments.
     * @returns {Object|boolean} The intersection point as an object with 'x' and 'y' properties, or 'false' if there is no intersection.
     */
    function _intersectLines(seg1Start, seg1End, seg2Start, seg2End, includeSegmentExtension = false) {
        // Extract coordinates from points
        let x1 = seg1Start.x, y1 = seg1Start.y;
        let x2 = seg1End.x, y2 = seg1End.y;
        let x3 = seg2Start.x, y3 = seg2Start.y;
        let x4 = seg2End.x, y4 = seg2End.y;
        // Early return if line segments are points or if the lines are parallel
        if ((x1 === x2 && y1 === y2) || (x3 === x4 && y3 === y4)) {
            return false; // Segments are points
        }
        let deltaX1 = x2 - x1, deltaY1 = y2 - y1;
        let deltaX2 = x4 - x3, deltaY2 = y4 - y3;
        let denominator = (deltaY2 * deltaX1 - deltaX2 * deltaY1);
        if (denominator === 0) {
            return false; // Lines are parallel
        }
        // Calculate the intersection point
        let ua = (deltaX2 * (y1 - y3) - deltaY2 * (x1 - x3)) / denominator;
        let ub = (deltaX1 * (y1 - y3) - deltaY1 * (x1 - x3)) / denominator;
        // Check if the intersection is within the bounds of the line segments
        if (!includeSegmentExtension && (ub < 0 || ub > 1)) {
            return false;
        }
        // Calculate the intersection coordinates
        let x = x1 + ua * deltaX1;
        let y = y1 + ua * deltaY1;
        return { x: x, y: y };
    }

    /**
     * Calculates the angle in degrees between two points in 2D space.
     * The angle is measured in a clockwise direction from the positive X-axis.
     *
     * @param {number} x1 - The x-coordinate of the first point.
     * @param {number} y1 - The y-coordinate of the first point.
     * @param {number} x2 - The x-coordinate of the second point.
     * @param {number} y2 - The y-coordinate of the second point.
     * @returns {number} The angle in degrees between the two points.
     */
    function _calculateAngle(x1,y1,x2,y2) {
        // Calculate the angle based on the quadrant in which the second point lies
        let angleRadians = Math.atan2(-(y2 - y1), (x2 - x1));
        
        // Convert radians to degrees and normalize the angle between 0 and 360
        let angleDegrees = angleRadians * (180 / Math.PI);
        return (angleDegrees % 360 + 360) % 360;
    }
    

// =============================================================================
// Section: Color Blending - Uses spectral.js as a module
// =============================================================================
/**
 * The Mix object is responsible for handling color blending operations within 
 * the rendering context. It utilizes WebGL shaders to apply advanced blending 
 * effects based on Kubelka-Munk theory. It depends on spectral.js for the 
 * blending logic incorporated into its fragment shader.
 */

    /**
     * Object handling blending operations with WebGL shaders.
     * @property {boolean} loaded - Flag indicating if the blend shaders have been loaded.
     * @property {Float32Array} pigmentTypedArray - Typed array to hold color values for shaders.
     * @property {function} load - Loads resources and initializes blend operations.
     * @property {function} blend - Applies blending effects using the initialized shader.
     * @property {string} vert - Vertex shader source code.
     * @property {string} frag - Fragment shader source code with blending logic.
     */
    const Mix = {
        loaded: false,
        pigmentTypedArray: new Float32Array(3),

        /**
         * Loads necessary resources and prepares the framebuffer and shader for blending.
         */
        load() {
            // Create a framebuffer to be used as a mask
            this.mask = _r.createFramebuffer({
                width: _r.width, 
                height: _r.height, 
                density: _r.pixelDensity(), 
                depth: false, 
                antialias: false
            });    
            // Clear the mask to start fresh
            this.mask.begin(), _r.clear(), this.mask.end();
            // Load the spectral.js shader code only once                                                        
            if (!Mix.loaded) {
                this.frag = this.frag.replace('#include "spectral.glsl"', spectral.glsl());
            }
            // Create the shader program from the vertex and fragment shaders
            this.shader = _r.createShader(this.vert, this.frag);
            Mix.loaded = true;
        },

        /**
         * Applies the blend shader to the current rendering context.
         * @param {string} _c - The color used for blending, in any CSS color format.
         */
        blend (_c) {
            this.pigmentTypedArray[0] = red(color(_c)) / 255.0;
            this.pigmentTypedArray[1] = green(color(_c)) / 255.0;
            this.pigmentTypedArray[2] = blue(color(_c)) / 255.0;
            _r.push();
            // Use the blend shader for rendering
            _r.shader(this.shader);
            _r.translate(-_trans()[0],-_trans()[1])
            // Set shader uniforms: color to add, source texture, and mask texture
            this.shader.setUniform('addColor', this.pigmentTypedArray);
            this.shader.setUniform('source', _r._renderer);
            this.shader.setUniform('mask', this.mask);
            // Draw a rectangle covering the whole canvas to apply the shader
            _r.fill(0,0,0,0);
            _r.noStroke();
            _r.rect(-_r.width/2, -_r.height/2, _r.width, _r.height);
            _r.pop();
            // Clear the mask after drawing
            this.mask.draw(function () {_r.clear()})
        },

        // Vertex shader source code
        vert: `precision highp float;attribute vec3 aPosition;attribute vec2 aTexCoord;uniform mat4 uModelViewMatrix,uProjectionMatrix;varying vec2 vVertTexCoord;void main(){gl_Position=uProjectionMatrix*uModelViewMatrix*vec4(aPosition,1);vVertTexCoord=aTexCoord;}`,
        
        // Fragment shader source code with blending operations
        frag: `
        precision highp float;varying vec2 vVertTexCoord;
        uniform sampler2D source;
        uniform sampler2D mask;
        uniform vec4 addColor;
        #include "spectral.glsl"
        float rand(vec2 co, float a, float b, float c){return fract(sin(dot(co, vec2(a, b))) * c);}
        void main() {
            vec4 maskColor = texture2D(mask, vVertTexCoord);
            if (maskColor.r > 0.0) {
                vec2 randParams1 = vec2(12.9898, 78.233);
                vec2 randParams2 = vec2(7.9898, 58.233);
                vec2 randParams3 = vec2(17.9898, 3.233);
                float r1 = rand(vVertTexCoord, randParams1.x, randParams1.y, 43358.5453) * 2.0 - 1.0;
                float r2 = rand(vVertTexCoord, randParams2.x, randParams2.y, 43213.5453) * 2.0 - 1.0;
                float r3 = rand(vVertTexCoord, randParams3.x, randParams3.y, 33358.5453) * 2.0 - 1.0;
                vec4 canvasColor = texture2D(source, vVertTexCoord);
                vec3 mixedColor = spectral_mix(canvasColor.rgb, addColor.rgb, maskColor.a * 0.8);
                if (maskColor.a > 0.8) {
                    mixedColor = spectral_mix(mixedColor, vec3(0.0), (maskColor.a - 0.8) / 0.6);
                }
                gl_FragColor = vec4(mixedColor + 0.02 * vec3(r1, r2, r3), 1.0);
            } else {
                gl_FragColor = vec4(0.0);
            }
        }
        `
    }

// =============================================================================
// Section: FlowField
// =============================================================================
/**
 * The FlowField (FF) section includes functions and objects for creating and managing vector fields.
 * These fields can guide the motion of particles or brush strokes in a canvas, creating complex and
 * dynamic visual patterns.
 */

    /**
     * Activates a specific vector field by name, ensuring it's ready for use.
     * @param {string} a - The name of the vector field to activate.
     * EXPORTED
     */
    function selectField (a) {
        _ensureReady();
        FF.isActive = true; // Mark the field framework as active
        if (FF.current !== a) FF.current = a; // Update the current field if a different one is selected
    }

    /**
     * Deactivates the current vector field.
     * EXPORTED
     */
    function disableField () {FF.isActive = false}

    /**
     * Adds a new vector field to the field list with a unique name and a generator function.
     * @param {string} name - The unique name for the new vector field.
     * @param {Function} funct - The function that generates the field values.
     * EXPORTED
     */
    function addField(name,funct) {
        _ensureReady(); 
        FF.list.set(name,{gen: funct}); // Map the field name to its generator function
        FF.current = name; // Set the newly added field as the current one to be used
        FF.refresh(); // Refresh the field values using the generator function
    }

    /**
     * Refreshes the current vector field based on the generator function, which can be time-dependent.
     * @param {number} [t=0] - An optional time parameter that can affect field generation.
     * EXPORTED
     */
    function refreshField(t) {
        FF.refresh(t)
    }

    /**
     * Retrieves a list of all available vector field names.
     * @returns {Iterator<string>} An iterator that provides the names of all the fields.
     * EXPORTED
     */
    function listFields() {return FF.list.keys()}

    /**
     * Represents a framework for managing vector fields used in dynamic simulations or visualizations.
     * @property {boolean} isActive - Indicates whether any vector field is currently active.
     * @property {Map} list - A map associating field names to their respective generator functions and current states.
     * @property {Array} field - An array representing the current vector field grid with values.
     */
    const FF = {
        isActive: false,
        list: new Map(),
        current: '',

        /**
         * Calculates a relative step length based on the renderer's dimensions, used in field grid calculations.
         * @returns {number} The relative step length value.
         */
        step_length() {
            return Math.min(_r.width,_r.height) / 1000
        },

        /**
         * Initializes the field grid and sets up the vector field's structure based on the renderer's dimensions.
         */
        create() {
            this.R = _r.width * 0.01; // Determine the resolution of the field grid
            this.left_x = -1 * _r.width; // Left boundary of the field
            this.top_y = -1 * _r.height; // Top boundary of the field
            this.num_columns = Math.round(2 * _r.width / this.R); // Number of columns in the grid
            this.num_rows = Math.round(2 * _r.height / this.R); // Number of columns in the grid
            this.field = new Array(FF.num_columns); // Initialize the field array
            for (let i = 0; i < this.num_columns; i++) {
                this.field[i] = new Float64Array(this.num_rows);
            }
            this.addStandard(); // Add default vector fields
        },

        /**
         * Retrieves the field values for the current vector field.
         * @returns {Float64Array[]} The current vector field grid.
         */
        flow_field() {
            return this.list.get(this.current).field
        },

        /**
         * Regenerates the current vector field using its associated generator function.
         * @param {number} [t=0] - An optional time parameter that can affect field generation.
         */
        refresh(t = 0) {
            this.list.get(this.current).field = this.list.get(this.current).gen(t)
        },

        /**
         * Adds standard predefined vector fields to the list with unique behaviors.
         */
        addStandard() {
            addField("curved", function(t) {
                let angleRange = R.randInt(-25,-15);
                if (R.randInt(0,100)%2 == 0) {angleRange = angleRange * -1}
                for (let column=0;column<FF.num_columns;column++){
                    for (let row=0;row<FF.num_rows;row++) {               
                        let noise_val = noise(column * 0.02 + t * 0.03, row * 0.02 + t * 0.03)
                        let angle = R.map(noise_val, 0.0, 1.0, -angleRange, angleRange)
                        FF.field[column][row] = 3 * angle;
                    }
                }
                return FF.field;
            })
            addField("truncated", function(t) {
                let angleRange = R.randInt(-25,-15) + 5 * R.sin(t);
                if (R.randInt(0,100)%2 == 0) {angleRange=angleRange*-1}
                let truncate = R.randInt(5,10);
                for (let column=0;column<FF.num_columns;column++){
                    for (let row=0;row<FF.num_rows;row++) {               
                        let noise_val = noise(column * 0.02, row * 0.02)
                        let angle = Math.round(R.map(noise_val, 0.0, 1.0, -angleRange, angleRange)/truncate)*truncate;
                        FF.field[column][row] = 4 * angle;
                    }
                }
                return FF.field;
            })
            addField("zigzag", function(t) {   
                let angleRange = R.randInt(-30,-15) + Math.abs(44 * R.sin(t));
                if (R.randInt(0,100)%2 == 0) {angleRange=angleRange*-1}
                let dif = angleRange;
                let angle = 0;
                for (let column=0;column<FF.num_columns;column++){
                    for (let row=0;row<FF.num_rows;row++) {               
                        FF.field[column][row] = angle;
                        angle = angle + dif;
                        dif = -1*dif;
                    }
                    angle = angle + dif;
                    dif = -1*dif;
                }
                return FF.field;
            })
            addField("waves", function(t) {
                let sinrange = R.randInt(10,15) + 5 * R.sin(t);
                let cosrange = R.randInt(3,6) + 3 * R.cos(t);
                let baseAngle = R.randInt(20,35);
                for (let column=0;column<FF.num_columns;column++){
                    for (let row=0;row<FF.num_rows;row++) {               
                        let angle = R.sin(sinrange*column)*(baseAngle * R.cos(row*cosrange)) + R.randInt(-3,3);
                        FF.field[column][row] = angle;
                    }
                }
                return FF.field;
            })
            addField("seabed", function(t) {
                let baseSize = R.random(0.4,0.8)
                let baseAngle = R.randInt(18,26) ;
                for (let column=0;column<FF.num_columns;column++){
                    for (let row=0;row<FF.num_rows;row++) {       
                        let addition = R.randInt(15,20)        
                        let angle = baseAngle*R.sin(baseSize*row*column+addition);
                        FF.field[column][row] = 1.1*angle * R.cos(t);
                    }
                }
                return FF.field;
            })           
        }
    }

    /**
     * The Position class represents a point within a two-dimensional space, which can interact with a vector field.
     * It provides methods to update the position based on the field's flow and to check whether the position is
     * within certain bounds (e.g., within the field or canvas).
     * EXPORTED
     */
    class Position {

        /**
         * Constructs a new Position instance.
         * @param {number} x - The initial x-coordinate.
         * @param {number} y - The initial y-coordinate.
         */
        constructor (x,y) {
            this.update(x, y);
            this.plotted = 0;
        }

        /**
         * Updates the position's coordinates and calculates its offsets and indices within the flow field if active.
         * @param {number} x - The new x-coordinate.
         * @param {number} y - The new y-coordinate.
         */
        update (x,y) {
            this.x = x , this.y = y;
            if (FF.isActive) {
                this.x_offset = this.x - FF.left_x + _trans()[0];
                this.y_offset = this.y - FF.top_y + _trans()[1];
                this.column_index = Math.round(this.x_offset / FF.R);
                this.row_index = Math.round(this.y_offset / FF.R);
            }
        }

        /**
         * Resets the 'plotted' property to 0.
         */
        reset() {
            this.plotted = 0;
        }

        /**
         * Checks if the position is within the active flow field's bounds.
         * @returns {boolean} - True if the position is within the flow field, false otherwise.
         */
        isIn() {
            return (FF.isActive) ? ((this.column_index >= 0 && this.row_index >= 0) && (this.column_index < FF.num_columns && this.row_index < FF.num_rows)) : this.isInCanvas()
        }

        /**
         * Checks if the position is within the canvas bounds.
         * @returns {boolean} - True if the position is within the canvas, false otherwise.
         */
        isInCanvas() {
            let w = 0.55 * _r.width, h = 0.55 * _r.height;
            return (this.x >= -w - _trans()[0] && this.x <= w - _trans()[0]) && (this.y >= -h - _trans()[1] && this.y <= h - _trans()[1])
        }

        /**
         * Calculates the angle of the flow field at the position's current coordinates.
         * @returns {number} - The angle in radians, or 0 if the position is not in the flow field or if the flow field is not active.
         */
        angle () {
            return (this.isIn() && FF.isActive) ? FF.flow_field()[this.column_index][this.row_index] : 0
        }

        /**
         * Moves the position along the flow field by a certain length.
         * @param {number} _length - The length to move along the field.
         * @param {number} _dir - The direction of movement.
         * @param {number} _step_length - The length of each step.
         * @param {boolean} isFlow - Whether to use the flow field for movement.
         */
        moveTo (_length, _dir, _step_length = FF.step_length(), isFlow = true) {
            if (this.isIn()) {
                let a, b;
                if (!isFlow) {
                    a = R.cos(-_dir);
                    b = R.sin(-_dir);
                }
                for (let i = 0; i < _length / _step_length; i++) {
                    if (isFlow) {
                        let angle = this.angle();
                        a = R.cos(angle - _dir);
                        b = R.sin(angle - _dir);
                    }
                    let x_step = (_step_length * a), y_step = (_step_length * b);
                    this.plotted += _step_length;
                    this.update(this.x + x_step, this.y + y_step);   
                }
            } else {
                this.plotted += _step_length;
            }
        }

        /**
         * Plots a point to another position within the flow field, following a Plot object
         * @param {Position} _plot - The Plot path object.
         * @param {number} _length - The length to move towards the target position.
         * @param {number} _step_length - The length of each step.
         * @param {number} _scale - The scaling factor for the plotting path.
         */
        plotTo (_plot, _length, _step_length, _scale) {
            if (this.isIn()) {
                const inverse_scale = 1 / _scale;
                for (let i = 0; i < _length / _step_length; i++) {
                    let current_angle = this.angle();
                    let plot_angle = _plot.angle(this.plotted);
                    let x_step = (_step_length * R.cos(current_angle - plot_angle));
                    let y_step = (_step_length * R.sin(current_angle - plot_angle));
                    this.plotted += _step_length * inverse_scale;
                    this.update(this.x + x_step, this.y + y_step);
                }
            } else {
                this.plotted += _step_length / scale;
            }
        }
    }


// =============================================================================
// Section: Brushes
// =============================================================================
/**
 * The Brushes section provides tools for drawing with various brush types. Each brush
 * can simulate different materials and techniques, such as spray, marker, or custom
 * image stamps. The 'B' object is central to this section, storing brush properties
 * and methods for applying brush strokes to the canvas.
 *
 * The 'B' object contains methods to control the brush, including setting the brush
 * type, color, weight, and blending mode. It also handles the application of the brush
 * to draw lines, flow lines, and shapes with specific behaviors defined by the brush type.
 * Additionally, it provides a mechanism to clip the drawing area, ensuring brush strokes
 * only appear within the defined region.
 *
 * Brush tips can vary from basic circles to complex patterns, with support for custom
 * pressure curves, opacity control, and dynamic size adjustments to simulate natural
 * drawing tools. The brush engine can create effects like variable line weight, texture,
 * and color blending, emulating real-world drawing experiences.
 *
 * The brush system is highly customizable, allowing users to define their own brushes
 * with specific behaviors and appearances. By extending the brush types and parameters,
 * one can achieve a wide range of artistic styles and techniques.
 */

    /**
     * Disables the stroke for subsequent drawing operations.
     * This function sets the brush's `isActive` property to false, indicating that no stroke
     * should be applied to the shapes drawn after this method is called.
     * EXPORTED
     */
    function disableBrush() {
        B.isActive = false;
    }

    /**
     * Retrieves a list of all available brush names from the brush manager.
     * @returns {Array<string>} An array containing the names of all brushes.
     * EXPORTED
     */
    function listOfBrushes() {
        return Array.from(B.list.keys())
    }

    /**
     * The B object, representing a brush, contains properties and methods to manipulate
     * the brush's appearance and behavior when drawing on the canvas.
     * @type {Object}
     */
    const B = {
        isActive: true, // Indicates if the brush is active.
        list: new Map(), // Stores brush definitions by name.
        c: "#000000", // Current color of the brush.
        w: 1, // Current weight (size) of the brush.
        cr: null, // Clipping region for brush strokes.
        name: "HB", // Name of the current brush.
        
        /**
         * Adds a new brush with the specified parameters to the brush list.
         * @param {string} name - The unique name for the new brush.
         * @param {BrushParameters} params - The parameters defining the brush behavior and appearance.
         * EXPORTED
         */
        add: (a, b) => {
            const isBlendableType = b.type === "marker" || b.type === "custom" || b.type === "image";
            if (b.type === "image") {
                T.add(b.image.src);
                b.tip = () => _r.image(T.tips.get(B.p.image.src), -B.p.weight / 2, -B.p.weight / 2, B.p.weight, B.p.weight);
            }
            b.blend = isBlendableType && b.blend !== false;
            B.list.set(a, { param: b, colors: [], buffers: [] });
        },

        /**
         * Sets the current brush with the specified name, color, and weight.
         * @param {string} brushName - The name of the brush to set as current.
         * @param {string|p5.Color} color - The color to set for the brush.
         * @param {number} weight - The weight (size) to set for the brush.
         * EXPORTED
         */  
        set(brushName, color, weight) {
            B.name = brushName; 
            B.c = color;
            B.w = weight;
        },

        /**
         * Sets only the current brush type based on the given name.
         * @param {string} brushName - The name of the brush to set as current.
         * EXPORTED
         */
        setBrush(brushName) {
            B.name = brushName;
        },

        /**
         * Sets the color of the current brush.
         * @param {number|string|p5.Color} r - The red component of the color, a CSS color string, or a p5.Color object.
         * @param {number} [g] - The green component of the color.
         * @param {number} [b] - The blue component of the color.
         * EXPORTED
         */        
        setColor(r,g,b) {
            B.c = (arguments.length < 2) ? r : [r,g,b]; 
            B.isActive = true;
        },

        /**
         * Sets the weight (size) of the current brush.
         * @param {number} weight - The weight to set for the brush.
         * EXPORTED
         */        
        setWeight(weight) {
            B.w = weight;
        },

        /**
         * Defines a clipping region for the brush strokes.
         * @param {number[]} clippingRegion - An array defining the clipping region as [x1, y1, x2, y2].
         * EXPORTED
         */
        clip(clippingRegion) {
            B.cr = clippingRegion;
        },

        /**
         * Draws a line using the current brush from (x1, y1) to (x2, y2).
         * @param {number} x1 - The x-coordinate of the start point.
         * @param {number} y1 - The y-coordinate of the start point.
         * @param {number} x2 - The x-coordinate of the end point.
         * @param {number} y2 - The y-coordinate of the end point.
         * EXPORTED
         */        
        line(x1,y1,x2,y2) {
            _ensureReady();
            B.initializeDrawingState(x1, y1, dist(x1,y1,x2,y2), false, false);
            let angle = _calculateAngle(x1,y1,x2,y2);
            B.draw(angle, false);
        },

        /**
         * Draws a flow line with the current brush from a starting point in a specified direction.
         * @param {number} x - The x-coordinate of the starting point.
         * @param {number} y - The y-coordinate of the starting point.
         * @param {number} length - The length of the line to draw.
         * @param {number} dir - The direction in which to draw the line. Angles measured anticlockwise from the x-axis
         * EXPORTED
         */
        flowLine(x,y,length,dir) {
            _ensureReady();
            if (angleMode() === "radians") dir = dir * 180 / Math.PI;
            B.initializeDrawingState(x, y, length, true, false);
            B.draw(dir, false);
        },

        /**
         * Draws a shape with a flowing brush stroke.
         * @param {Object} p - An object representing the shape to draw.
         * @param {number} x - The x-coordinate of the starting position to draw the shape.
         * @param {number} y - The y-coordinate of the starting position to draw the shape.
         * @param {number} scale - The scale at which to draw the shape.
         * EXPORTED
         */
        flowShape(p,x,y,scale) {
            _ensureReady();
            B.initializeDrawingState(x, y, p.length, true, p);
            B.draw(scale, true);
        },

        /**
         * Calculates the tip spacing based on the current brush parameters.
         * @returns {number} The calculated spacing value.
         */
        spacing() {
            return this.p.spacing * this.w;
        },

        /**
         * Initializes the drawing state with the given parameters.
         * @param {number} x - The x-coordinate of the starting point.
         * @param {number} y - The y-coordinate of the starting point.
         * @param {number} length - The length of the line to draw.
         * @param {boolean} flow - Flag indicating if the line should follow the vector-field.
         * @param {Object|boolean} plot - The shape object to be used for plotting, or false if not plotting a shape.
         */
        initializeDrawingState(x, y, length, flow, plot) {
            this.position = new Position(x, y);
            this.length = length;
            this.flow = flow;
            this.plot = plot;
            if (plot) plot.calcIndex(0);
        },

        /**
         * Executes the drawing operation for lines or shapes.
         * @param {number} angle_scale - The angle or scale to apply during drawing.
         * @param {boolean} isPlot - Flag indicating if the operation is plotting a shape.
         */
        draw(angle_scale, isPlot) {
            if (!isPlot) this.dir = angle_scale;
            this.pushState();
                const st = this.spacing();
                const total_steps = isPlot ? Math.round(this.length * angle_scale / st) : Math.round(this.length / st);
                for (let steps = 0; steps < total_steps; steps++) {
                    this.tip(); 
                    if (isPlot) {
                        this.position.plotTo(this.plot, st, st, angle_scale);
                    } else {
                        this.position.moveTo(st, angle_scale, st, this.flow);
                    }
                }
            this.popState();
        },

        /**
         * Sets up the environment for a brush stroke.
         */
        pushState() {
            this.p = this.list.get(this.name).param
            // Pressure values for the stroke
                this.a = this.p.pressure.type !== "custom" ? R.random(-1, 1) : 0;
                this.b = this.p.pressure.type !== "custom" ? R.random(1, 1.5) : 0;
                this.cp = this.p.pressure.type !== "custom" ? R.random(3, 3.5) : R.random(-0.2, 0.2);
                const [min, max] = this.p.pressure.min_max;
                this.min = min;
                this.max = max;
            // Blend Mode
                this.c = _r.color(this.c);
                if (this.p.blend) _trans(), Mix.mask.begin();
                _r.push(); 
                _r.noStroke();
                if (this.p.blend) _r.translate(_matrix[0],_matrix[1]), this.markerTip();
        },

        /**
         * Restores the drawing state after a brush stroke is completed.
         */
        popState() {
            if (this.p.blend) this.markerTip();
            _r.pop();
            if (this.p.blend) Mix.mask.end(), Mix.blend(this.c);
        },
        
        /**
         * Draws the tip of the brush based on the current pressure and position.
         */
        tip() {
            let pressure = this.calculatePressure(); // Calculate Pressure
            let alpha = this.calculateAlpha(pressure); // Calcula Alpha
            this.applyColor(alpha); // Apply Color
            if (this.isInsideClippingArea()) { // Check if it's inside clipping area
                switch (this.p.type) { // Draw different tip types
                    case "spray":
                        this.drawSpray(pressure);
                        break;
                    case "marker":
                        this.drawMarker(pressure);
                        break;
                    case "custom":
                    case "image":
                        this.drawCustomOrImage(pressure, alpha);
                        break;
                    default:
                        this.drawDefault(pressure);
                        break;
                }
            }
        },

        /**
         * Calculates the pressure for the current position in the stroke.
         * @returns {number} The calculated pressure value.
         */
        calculatePressure() {
            return this.plot
            ? this.simPressure() * this.plot.pressure(this.position.plotted)
            : this.simPressure();
        },

        /**
         * Simulates brush pressure based on the current position and brush parameters.
         * @returns {number} The simulated pressure value.
         */
        simPressure () {
            if (this.p.pressure.type === "custom") {
                return R.map(this.p.pressure.curve(this.position.plotted / this.length) + this.cp, 0, 1, this.min, this.max, true);
            }
            return this.gauss()
        },

        /**
         * Generates a Gaussian distribution value for the pressure calculation.
         * @param {number} a - Center of the Gaussian bell curve.
         * @param {number} b - Width of the Gaussian bell curve.
         * @param {number} c - Shape of the Gaussian bell curve.
         * @param {number} min - Minimum pressure value.
         * @param {number} max - Maximum pressure value.
         * @returns {number} The calculated Gaussian value.
         */
        gauss(a = 0.5 + B.p.pressure.curve[0] * B.a, b = 1 - B.p.pressure.curve[1] * B.b, c = B.cp, min = B.min, max = B.max) {
            return R.map((1 / ( 1 + Math.pow(Math.abs( ( this.position.plotted - a * this.length ) / ( b * this.length / 2 ) ), 2 * c))), 0, 1, min, max);
        },

        /**
         * Calculates the alpha (opacity) level for the brush stroke based on pressure.
         * @param {number} pressure - The current pressure value.
         * @returns {number} The calculated alpha value.
         */
        calculateAlpha(pressure) {
            return Math.floor(this.p.opacity * Math.pow(pressure, this.p.type === "marker" ? 1 : 1.5));
        },

        /**
         * Applies the current color and alpha to the renderer.
         * @param {number} alpha - The alpha (opacity) level to apply.
         */
        applyColor(alpha) {
            if (this.p.blend) {
                _r.fill(255, 0, 0, alpha / 2);
            } else {
                this.c.setAlpha(alpha);
                _r.fill(this.c);
            }
        },

        /**
         * Checks if the current brush position is inside the defined clipping area.
         * @returns {boolean} True if the position is inside the clipping area, false otherwise.
         */
        isInsideClippingArea() {
            if (B.cr) return this.position.x >= B.cr[0] && this.position.x <= B.cr[2] && this.position.y >= B.cr[1] && this.position.y <= B.cr[3];
            else return true;
        },

        /**
         * Draws the spray tip of the brush.
         * @param {number} pressure - The current pressure value.
         */
        drawSpray(pressure) {
            let vibration = (this.w * this.p.vibration * pressure) + this.w * randomGaussian() * this.p.vibration / 3;
            let sw = this.p.weight * R.random(0.9,1.1);
            const iterations = this.p.quality / pressure;
            for (let j = 0; j < iterations; j++) {
                let r = R.random(0.9,1.1);
                let rX = r * vibration * R.random(-1,1);
                let yRandomFactor = R.random(-1, 1);
                let rVibrationSquared = Math.pow(r * vibration, 2);
                let sqrtPart = Math.sqrt(rVibrationSquared - Math.pow(rX, 2));
                _r.circle(this.position.x + rX, this.position.y + yRandomFactor * sqrtPart, sw);
            }
        },

        /**
         * Draws the marker tip of the brush.
         * @param {number} pressure - The current pressure value.
         * @param {boolean} [vibrate=true] - Whether to apply vibration effect.
         */
        drawMarker(pressure, vibrate = true) {
            let vibration = vibrate ? this.w * this.p.vibration : 0;
            let rx = vibrate ? vibration * R.random(-1,1) : 0;
            let ry = vibrate ? vibration * R.random(-1,1) : 0;
            _r.circle(this.position.x + rx, this.position.y + ry, this.w * this.p.weight * pressure)
        },

        /**
         * Draws the custom or image tip of the brush.
         * @param {number} pressure - The current pressure value.
         * @param {number} alpha - The alpha (opacity) level to apply.
         * @param {boolean} [vibrate=true] - Whether to apply vibration effect.
         */
        drawCustomOrImage(pressure, alpha, vibrate = true) {
            _r.push();
            let vibration = vibrate ? this.w * this.p.vibration : 0;
            let rx = vibrate ? vibration * R.random(-1,1) : 0;
            let ry = vibrate ? vibration * R.random(-1,1) : 0;
            _r.translate(this.position.x + rx, this.position.y + ry), 
            this.adjustSizeAndRotation(this.w * pressure, alpha)
            this.p.tip();
            _r.pop();
        },

        /**
         * Draws the default tip of the brush.
         * @param {number} pressure - The current pressure value.
         */
        drawDefault(pressure) {
            let vibration = this.w * this.p.vibration * (this.p.definition + (1-this.p.definition) * randomGaussian() * this.gauss(0.5,0.9,5,0.2,1.2) / pressure);
            if (R.random(0, this.p.quality) > 0.4) {
                _r.circle(this.position.x + 0.7 * vibration * R.random(-1,1),this.position.y + vibration * R.random(-1,1), pressure * this.p.weight * this.w * R.random(0.85,1.15));
            }
        },

        /**
         * Adjusts the size and rotation of the brush tip before drawing.
         * @param {number} pressure - The current pressure value.
         * @param {number} alpha - The alpha (opacity) level to apply.
         */
        adjustSizeAndRotation(pressure, alpha) {
            _r.scale(pressure);
            if (this.p.type === "image") (this.p.blend) ? _r.tint(255, 0, 0, alpha / 2) : _r.tint(_r.red(this.c), _r.green(this.c), _r.blue(this.c), alpha);
            if (this.p.rotate === "random") _r.rotate(R.randInt(0,360));
            if (this.p.rotate === "natural") _r.rotate(((this.plot) ? - this.plot.angle(this.position.plotted) : - this.dir) + (this.flow ? this.position.angle() : 0))
        },

        /**
         * Draws the marker tip with a blend effect.
         */
        markerTip() {
            if (this.isInsideClippingArea()) {
                let pressure = this.calculatePressure();
                let alpha = this.calculateAlpha(pressure);
                _r.fill(255, 0, 0, alpha / 1.5);
                if (B.p.type === "marker") {
                    for (let s = 1; s < 5; s++) {
                        this.drawMarker(pressure * s/5, false)
                    }
                } else if (B.p.type === "custom" || B.p.type === "image") {
                    for (let s = 1; s < 5; s++) {
                        this.drawCustomOrImage(pressure * s/5, alpha, false)
                    }
                }
            }
        },
    }

// =============================================================================
// Section: Hatching
// =============================================================================
/**
 * The Hatching section of the code is responsible for creating and drawing hatching patterns.
 * Hatching involves drawing closely spaced parallel lines.
 */

    /**
     * Creates a hatching pattern across the given polygons.
     * 
     * @param {Array|Object} polygons - A single polygon or an array of polygons to apply the hatching.
     * @param {number} dist - The distance between hatching lines.
     * @param {number} angle - The angle at which hatching lines are drawn.
     * @param {Object} options - An object containing optional parameters to affect the hatching style:
     *                           - rand: Introduces randomness to the line placement.
     *                           - continuous: Connects the end of a line with the start of the next.
     *                           - gradient: Changes the distance between lines to create a gradient effect.
     *                           Defaults to {rand: false, continuous: false, gradient: false}.
     * EXPORTED
     */
    B.hatch = function (polygons, dist, angle, options = {rand: false, continuous: false, gradient: false}) {
        _ensureReady();
        angle = ((angleMode() === "radians") ? angle * 180 / Math.PI : angle) % 180
        // Calculate the bounding area of the provided polygons
        let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
        let processPolygonPoints = (p) => {
            for (let a of p.a) {
                // (process points of a single polygon to find bounding area)
                minX = a[0] < minX ? a[0] : minX;
                maxX = a[0] > maxX ? a[0] : maxX;
                minY = a[1] < minY ? a[1] : minY;
                maxY = a[1] > maxY ? a[1] : maxY;
            }
        };
        // Ensure polygons is an array and find overall bounding area
        if (!Array.isArray(polygons)) {polygons = [polygons]}
        for (let p of polygons) {processPolygonPoints(p);}
        // Create a bounding polygon
        let ventana = new Polygon([[minX,minY],[maxX,minY],[maxX,maxY],[minX,maxY]])
        // Set initial values for line generation
        let startY = (angle <= 90 && angle >= 0) ? minY : maxY;
        let gradient = options.gradient ? map(options.gradient,0,1,1,1.1,true) : 1
        let dots = [], i = 0, dist1 = dist;
        let linea = (i) => {
            return {
                point1 : { x: minX + dist1 * i * R.cos(-angle+90),                   y: startY + dist1 * i * R.sin(-angle+90) },
                point2 : { x: minX + dist1 * i * R.cos(-angle+90) + R.cos(-angle),   y: startY + dist1 * i * R.sin(-angle+90) + R.sin(-angle) }
            }
        }
        // Generate lines and calculate intersections with polygons
        // Loop through the lines based on the distance and angle to calculate intersections with the polygons
        // The loop continues until a line does not intersect with the bounding window polygon
        // Each iteration accounts for the gradient effect by adjusting the distance between lines
        while (ventana.intersect(linea(i)).length > 0) {
            let tempArray = [];
            for (let p of polygons) {tempArray.push(p.intersect(linea(i)))};
            dots[i] = tempArray.flat().sort((a, b) => (a.x === b.x) ? (a.y - b.y) : (a.x - b.x));
            dist1 *= gradient
            i++
        }
        // Filter out empty arrays to avoid drawing unnecessary lines
        let gdots = []
        for (let dd of dots) {if (typeof dd[0] !== "undefined") { gdots.push(dd)} }
        // Draw the hatching lines using the calculated intersections
        // If the 'rand' option is enabled, add randomness to the start and end points of the lines
        // If the 'continuous' option is set, connect the end of one line to the start of the next
        for (let j = 0; j < gdots.length; j++) {
            let dd = gdots[j]
            let r = options.rand || 0;
            let shouldDrawContinuousLine = j > 0 && options.continuous;
            for (let i = 0; i < dd.length-1; i += 2) {
                if (r !== 0) {
                    dd[i].x += r * dist * R.random(-1, 1);
                    dd[i].y += r * dist * R.random(-1, 1);
                    dd[i + 1].x += r * dist * R.random(-1, 1);
                    dd[i + 1].y += r * dist * R.random(-1, 1);
                }
                B.line(dd[i].x, dd[i].y, dd[i + 1].x, dd[i + 1].y);
                if (shouldDrawContinuousLine) {
                    B.line(gdots[j - 1][1].x, gdots[j - 1][1].y, dd[i].x, dd[i].y);
                }
            }
        }
    }

// =============================================================================
// Section: Loading Custom Image Tips
// =============================================================================
/**
 * This section defines the functionality for managing the loading and processing of image tips.
 * Images are loaded from specified source URLs, converted to a white tint for visual effects,
 * and then stored for future use. It includes methods to add new images, convert their color
 * scheme, and integrate them into the p5.js graphics library.
 */

    /**
     * A utility object for loading images, converting them to a red tint, and managing their states.
     */
    const T = {
        tips: new Map(),

        /**
         * Adds an image to the tips Map and sets up loading and processing.
         * 
         * @param {string} src - The source URL of the image to be added and processed.
         */
        add (src) {
            // Create a new Image object
            const myImage = new Image();
            // Initially set the source as not processed
            this.tips.set(src,false)
            // Define the onload handler for the image
            myImage.onload = function(){
                // Once the image is loaded, convert it to white and update the Map
                T.tips.set(src,(T.imageToWhite(myImage)))
            };
            // Set the source of the Image object, which begins the loading process
            myImage.src = src;
        },

        /**
         * Converts the given image to a white tint by setting all color channels to white and adjusting the alpha channel.
         * 
         * @param {Image} image - The image to be converted.
         * @returns {string} - The data URL of the converted canvas image.
         */
        imageToWhite (image) {
            // Create a canvas element to manipulate the image
            let canvas = document.createElement("canvas");
            canvas.width = image.width, canvas.height = image.height;
            let context = canvas.getContext("2d");
            // Draw the image onto the canvas
            context.drawImage(image,0,0);
            // Get the image data from the canvas
            let imageData=context.getImageData(0,0, image.width, image.height);
            // Modify the image data to create a white tint effect
            for (let i = 0; i < 4 * image.width * image.height; i += 4) {
                // Calculate the average for the grayscale value
                let average = (imageData.data[i] + imageData.data[i + 1] + imageData.data[i + 2]) / 3;
                // Set all color channels to white
                imageData.data[i] = imageData.data[i + 1] = imageData.data[i + 2] = 255;
                // Adjust the alpha channel to the inverse of the average, creating the white tint effect
                imageData.data[i + 3] = 255 - average;
            }
            // Put the modified image data back onto the canvas
            context.putImageData(imageData,0,0);
            // Return a data URL representing the canvas image
            return canvas.toDataURL();
        },
        /**
         * Loads all processed images into the p5.js environment.
         * If no images are in the tips Map, logs a warning message.
         */
        load() {
            if (this.tips.size === 0) return console.log("ojo");
            for (let key of this.tips.keys()){
                this.tips.set(key,loadImage(this.tips.get(key)))
            }
        }
    }
    
// =============================================================================
// Section: Polygon management. Basic geometries
// =============================================================================
/**
 * This section includes the Polygon class for managing polygons and functions for drawing basic geometries
 * like rectangles and circles. It provides methods for creating, intersecting, drawing, and filling polygons,
 * as well as hatching them with a given distance and angle. Additional functions leverage the Polygon class
 * to draw rectangles with options for randomness and different drawing modes.
 */

    /**
     * Represents a polygon with a set of vertices.
     * EXPORTED
     */
    class Polygon {

        /**
         * Constructs the Polygon object from an array of points.
         * 
         * @param {Array} pointsArray - An array of points, where each point is an array of two numbers [x, y].
         */
        constructor (array) {
            this.a = array;
            this.vertices = array.map(a => ({ x: a[0], y: a[1] }));
            this.sides = this.vertices.map((v, i, arr) => [v, arr[(i + 1) % arr.length]]);
        }
        /**
         * Intersects a given line with the polygon, returning all intersection points.
         * 
         * @param {Object} line - The line to intersect with the polygon, having two properties 'point1' and 'point2'.
         * @returns {Array} An array of intersection points (each with 'x' and 'y' properties) or an empty array if no intersections.
         */
        intersect (line) {
            // Check if the result has been cached
            let cacheKey = `${line.point1.x},${line.point1.y}-${line.point2.x},${line.point2.y}`;
            if (this._intersectionCache && this._intersectionCache[cacheKey]) {
                return this._intersectionCache[cacheKey];
            }
            let points = []
            for (let s of this.sides) {
                let intersection = _intersectLines(line.point1,line.point2,s[0],s[1])
                if (intersection !== false) {points.push(intersection)}
            }
            // Cache the result
            if (!this._intersectionCache) this._intersectionCache = {};
            this._intersectionCache[cacheKey] = points;

            return points;
        }
        /**
         * Draws the polygon by iterating over its sides and drawing lines between the vertices.
         */
        draw () {
            _ensureReady();
            if (B.isActive) {
                for (let s of this.sides) {B.line(s[0].x,s[0].y,s[1].x,s[1].y)}
            }
        }
        /**
         * Fills the polygon using the current fill state.
         */
        fill () {
            _ensureReady();
            F.fill(this);
        }
        /**
         * Creates hatch lines across the polygon based on a given distance and angle.
         * 
         * @param {number} dist - The distance between hatch lines.
         * @param {number} angle - The angle of the hatch lines.
         * @param {Object} options - Additional options for hatching.
         * @param {number} [options.rand=0] - The vibration of the lines, between 0 (none) and 1 (a lot)
         * @param {number} [options.gradient=0] - Gradually increase distance between lines, between 0 (none) and 1 (a lot)
         * @param {boolean} [options.continuous=false] - If true, hatches the polygon with a single, continuous line
         */
        hatch (dist, angle, options) {
            _ensureReady();
            B.hatch(this,dist,angle,options)
        }
    }

    /**
     * Creates a Polygon from a given array of points and performs drawing and filling
     * operations based on active states.
     * 
     * @param {Array} pointsArray - An array of points where each point is an array of two numbers [x, y].
     * EXPORTED
     */
    function drawPolygon(pointsArray) {
        if (!Array.isArray(pointsArray) || pointsArray.length < 3) {
            console.error('Invalid input for polygon: An array with at least 3 points is required.');
            return;
        }
        // Create a new Polygon instance
        let polygon = new Polygon(pointsArray);
        // Draw the polygon if the B state is active
        if (B.isActive) {
            polygon.draw();
        }
        // Fill the polygon if the F state is active
        if (F.isActive) {
            polygon.fill();
        }
    }

    /**
     * Draws a rectangle on the canvas and fills it with the current fill color.
     * 
     * @param {number} x - The x-coordinate of the rectangle.
     * @param {number} y - The y-coordinate of the rectangle.
     * @param {number} w - The width of the rectangle.
     * @param {number} h - The height of the rectangle.
     * @param {boolean} [mode=false] - If true, the rectangle is drawn centered at (x, y).
     */
    function drawRectangle(x,y,w,h,mode = false) {
        _ensureReady();
        if (mode) x = x - w / 2, y = y - h / 2;
        let p = new Polygon([[x,y],[x+w,y],[x+w,y+h],[x,y+h]])
        p.draw();
        p.fill();
    }


// =============================================================================
// Section: Shape, Stroke, and Spline. Plot System
// =============================================================================
/**
 * This section defines the functionality for creating and managing plots, which are used to draw complex shapes,
 * strokes, and splines on a canvas. It includes classes and functions to create plots of type "curve" or "segments",
 * manipulate them with operations like adding segments and applying rotations, and render them as visual elements
 * like polygons or strokes. The spline functionality allows for smooth curve creation using control points with 
 * specified curvature, which can be rendered directly or used as part of more complex drawings.
 */

    /**
     * The Plot class is central to the plot system, serving as a blueprint for creating and manipulating a variety
     * of shapes and paths. It manages a collection of segments, each defined by an angle, length, and pressure,
     * allowing for intricate designs such as curves and custom strokes. Plot instances can be transformed by rotation,
     * and their visual representation can be controlled through pressure and angle calculations along their length.
     * EXPORTED
     */
    class Plot {

        /**
         * Creates a new Plot.
         * @param {string} _type - The type of plot, "curve" or "segments"
         */
        constructor (_type) {
            this.segments = [], this.angles = [], this.pres = [];
            this.type = _type;
            this.dir = 0;
            this.calcIndex(0);
        }

        /**
         * Adds a segment to the plot with specified angle, length, and pressure.
         * @param {number} _a - The angle of the segment.
         * @param {number} _length - The length of the segment.
         * @param {number} _pres - The pressure of the segment.
         * @param {boolean} _degrees - Whether the angle is in degrees.
         */
        addSegment (_a = 0,_length = 0,_pres = 1,_degrees = false) {
            // Convert angle to degrees if necessary
            if (angleMode() === "radians" && !_degrees) _a = _a * 180 / Math.PI
            // Remove the last angle if the angles array is not empty
            if (this.angles.length > 0) {
                this.angles.splice(-1)
            }
            // Normalize the angle between 0 and 360 degrees
            _a = (_a + 360) % 360;
            // Store the angle, pressure, and segment length
            this.angles.push(_a);
            this.pres.push(_pres);
            this.segments.push(_length);
            // Calculate the total length of the plot
            this.length =  this.segments.reduce((partialSum, a) => partialSum + a, 0);
            // Push the angle again to prepare for the next segment
            this.angles.push(_a)
        }

        /**
         * Finalizes the plot by setting the last angle and pressure.
         * @param {number} _a - The final angle of the plot.
         * @param {number} _pres - The final pressure of the plot.
         * @param {boolean} _degrees - Whether the angle is in degrees.
         */
        endPlot (_a = 0, _pres = 1, _degrees = false) {
            // Convert angle to degrees if necessary
            if (angleMode() === "radians" && !_degrees) _a = _a * 180 / Math.PI
            // Replace the last angle with the final angle
            this.angles.splice(-1)
            this.angles.push(_a);
            // Store the final pressure
            this.pres.push(_pres);
        }

        /**
         * Rotates the entire plot by a given angle.
         * @param {number} _a - The angle to rotate the plot.
         */
        rotate (_a) {
            if (angleMode() === "radians") _a = _a * 180 / Math.PI; 
            this.dir = _a;
        }

        /**
         * Calculates the pressure at a given distance along the plot.
         * @param {number} _d - The distance along the plot.
         * @returns {number} - The calculated pressure.
         */
        pressure (_d) {
            // If the distance exceeds the plot length, return the last pressure
            if (_d > this.length) return this.pres[this.pres.length-1];
            // Otherwise, calculate the pressure using the curving function
            return this.curving(this.pres,_d);
        }

        /**
         * Calculates the angle at a given distance along the plot.
         * @param {number} _d - The distance along the plot.
         * @returns {number} - The calculated angle.
         */
        angle (_d) {
            // If the distance exceeds the plot length, return the last angle
            if (_d > this.length) return this.angles[this.angles.length-1];
            // Calculate the index for the given distance
            this.calcIndex(_d);
            // Return the angle, adjusted for the plot type and direction
            return (this.type === "curve") ?
            this.curving(this.angles, _d) + this.dir :
            this.angles[this.index] + this.dir;
        }

        /**
         * Interpolates values between segments for smooth transitions.
         * @param {Array<number>} array - The array to interpolate within.
         * @param {number} _d - The distance along the plot.
         * @returns {number} - The interpolated value.
         */
        curving (array,_d) {
            let map0 = array[this.index];
            let map1 = array[this.index+1];
            if (typeof map1 == "undefined") { map1 = map0}
            if (Math.abs(map1-map0) > 180) {if (map1 > map0) {map1 = - (360-map1);} else {map0 = - (360-map0);}}
            return R.map(_d-this.suma,0,this.segments[this.index],map0,map1,true);
        }

        /**
         * Calculates the current index of the plot based on the distance.
         * @param {number} _d - The distance along the plot.
         */
        calcIndex(_d) {
            this.index = -1, this.suma = 0;
            let d = 0;
            while (d <= _d) {this.suma = d; d += this.segments[this.index+1]; this.index++;}
        }

        /**
         * Generates a polygon based on the plot.
         * @param {number} _x - The x-coordinate for the starting point of the polygon.
         * @param {number} _y - The y-coordinate for the starting point of the polygon.
         * @returns {Polygon} - The generated polygon.
         */
        genPol (_x,_y) {
            _ensureReady();
            let max = 0;
            let min = 9999;
            for (let o of this.segments) {
                max = Math.max(max,o) == 0 ? max : Math.max(max,o);
                min = Math.min(min,o) == 0 ? min : Math.min(min,o);
            }
            let _step = B.spacing()  // get last spacing
            let vertices = []
            let side = (max + min) / 1.5 * F.b;
            let linepoint = new Position(_x,_y);
            let numsteps = Math.round(this.length/_step);
            for (let steps = 0; steps < numsteps; steps++) {
                vertices[Math.floor(linepoint.plotted / side)] = [linepoint.x,linepoint.y]
                linepoint.plotTo(this,_step,_step,1)
            }
            this.calcIndex(0);
            return new Polygon(vertices);
        }

        /**
         * Draws the plot on the canvas.
         * @param {number} x - The x-coordinate to draw at.
         * @param {number} y - The y-coordinate to draw at.
         * @param {number} scale - The scale to draw with.
         */
        draw (x,y,scale) {
            _ensureReady();
            if (this.origin) x = this.origin[0], y = this.origin[1], scale = 1;
            B.flowShape(this,x,y,scale)
        }
    }

    /**
     * Draws a circle on the canvas and fills it with the current fill color.
     * 
     * @param {number} x - The x-coordinate of the center of the circle.
     * @param {number} y - The y-coordinate of the center of the circle.
     * @param {number} radius - The radius of the circle.
     * @param {boolean} [r=false] - If true, applies a random factor to the radius for each segment.
     */
        function drawCircle(x,y,radius,r = false) {
            _ensureReady();
            // Create a new Plot instance for a curve shape
            let p = new Plot("curve")
            // Calculate the length of the arc for each quarter of the circle
            let l = Math.PI * radius / 2;
            // Initialize the angle for the drawing segments
            let angle = 0
            // Define a function to optionally add randomness to the segment length
            let rr = () => (r ? R.random(-1,1) : 0)
            // Add segments for each quarter of the circle with optional randomness
            p.addSegment(0 + angle + rr(), l + rr(), 1, true)
            p.addSegment(-90 + angle + rr(), l + rr(), 1, true)
            p.addSegment(-180 + angle + rr(), l + rr(), 1, true)
            p.addSegment(-270 + angle + rr(), l + rr(), 1, true)
            // Optionally add a random final angle for the last segment
            let angle2 = r ? R.randInt(-5,5) : 0;
            if (r) p.addSegment(0 + angle, angle2 * (Math.PI/180) * radius, true)
            // Finalize the plot
            p.endPlot(angle2 + angle,1, true)
            // If the fill is active, generate a polygon from the plot and fill it
            if (F.isActive) {
                let pol = p.genPol(x - radius * R.sin(angle),y - radius * R.cos(-angle))
                pol.fill()
            }
            // If the border is active, draw the plot
            if (B.isActive) p.draw(x - radius * R.sin(angle),y - radius * R.cos(-angle),1)
        }
    
    // Holds the array of vertices for the custom shape being defined. Each vertex includes position and optional pressure.
    let _strokeArray = false;
    // Holds options for the stroke, such as curvature, that can influence the shape's rendering.
    let _strokeOption;

    /**
     * Starts recording vertices for a custom shape. Optionally, a curvature can be defined.
     * @param {number} [curvature] - Defines the curvature for the vertices being recorded (optional).
     * EXPORTED
     */
    function _beginShape(curvature) {
        _ensureReady(); // Ensure that the drawing context is ready
        _strokeOption = curvature; // Set the curvature option for the shape
        _strokeArray = []; // Initialize the array to store vertices
    }

    /**
     * Records a vertex in the custom shape being defined between _beginShape and _endShape.
     * @param {number} x - The x-coordinate of the vertex.
     * @param {number} y - The y-coordinate of the vertex.
     * @param {number} [pressure] - The pressure at the vertex (optional).
     */
    function _vertex(x, y, pressure) {
        _strokeArray.push([x, y, pressure]); // Add the vertex to the array
    }

    /**
     * Finishes recording vertices for a custom shape and either closes it or leaves it open.
     * It also triggers the drawing of the shape if the brush state is active.
     * @param {string} [a] - An optional argument to close the shape if set to CLOSE.
     */
    function _endShape(a) {
        if (a === CLOSE) {
            _strokeArray.push(_strokeArray[0]); // Close the shape by connecting the last vertex to the first
        }
        let sp = new Spline(_strokeArray, _strokeOption); // Create a new Spline with the recorded vertices and curvature option
        if (F.isActive) {
            sp.p.genPol(sp.origin[0], sp.origin[1]).fill(); // Fill the shape if the fill state is active
        }
        if (B.isActive) {
            sp.draw(); // Draw the shape if the brush state is active
        }
        _strokeArray = false; // Clear the array after the shape has been drawn
    }
    
    /**
     * Begins a new stroke with a given type and starting position. This initializes
     * a new Plot to record the stroke's path.
     * @param {string} type - The type of the stroke, which defines the kind of Plot to create.
     * @param {number} x - The x-coordinate of the starting point of the stroke.
     * @param {number} y - The y-coordinate of the starting point of the stroke.
     */
    function _beginStroke(type, x, y) {
        _ensureReady(); // Ensure that the drawing environment is prepared
        _strokeOption = [x, y]; // Store the starting position for later use
        _strokeArray = new Plot(type); // Initialize a new Plot with the specified type
    }

    /**
     * Adds a segment to the stroke with a given angle, length, and pressure. This function
     * is called between _beginStroke and _endStroke to define the stroke's path.
     * @param {number} angle - The initial angle of the segment, relative to the canvas.
     * @param {number} length - The length of the segment.
     * @param {number} pressure - The pressure at the start of the segment, affecting properties like width.
     */
    function _move(angle, length, pressure) {
        _strokeArray.addSegment(angle, length, pressure); // Add the new segment to the Plot
    }

    /**
     * Completes the stroke path and triggers the rendering of the stroke.
     * @param {number} angle - The angle of the curve at the last point of the stroke path.
     * @param {number} pressure - The pressure at the end of the stroke.
     */
    function _endStroke(angle, pressure) {
        _strokeArray.endPlot(angle, pressure); // Finalize the Plot with the end angle and pressure
        _strokeArray.draw(_strokeOption[0], _strokeOption[1], 1); // Draw the stroke using the stored starting position
        _strokeArray = false; // Clear the _strokeArray to indicate the end of this stroke
    }
    
    /**
     * Represents a spline curve, which is a type of smooth curve defined by a series of points.
     * EXPORTED
     */
    class Spline {

        /**
         * Constructs a new Spline object.
         * @param {Array<Array<number>>} array_points - An array of points defining the spline curve.
         * @param {number} [curvature=0.5] - The curvature of the spline curve, beterrn 0 and 1. A curvature of 0 will create a series of straight segments.
         */
        constructor (array_points, curvature = 0.5) {
            // Initialize the plot type based on curvature
            this.plotType = (curvature === 0) ? "segments" : "curve";
            this.p = new Plot(this.plotType);

            // Proceed only if there are points provided
            if (array_points && array_points.length > 0) {
                // Set the origin point from the first point in the array
                this.setOrigin(array_points[0]);
                
                // Add each segment to the plot
                let done = 0;
                for (let i = 0; i < array_points.length - 1; i++) {
                    if (curvature > 0 && i < array_points.length - 2) {
                        // Get the current and next points
                        let p1 = array_points[i], p2 = array_points[i+1], p3 = array_points[i+2];
                        // Calculate distances and angles between points
                        let d1 = dist(p1[0],p1[1],p2[0],p2[1]), d2 = dist(p2[0],p2[1],p3[0],p3[1]);
                        let a1 = _calculateAngle(p1[0],p1[1],p2[0],p2[1]), a2 = _calculateAngle(p2[0],p2[1],p3[0],p3[1]);
                        // Calculate curvature based on the minimum distance
                        let dd = curvature * Math.min(Math.min(d1,d2),0.5 * Math.min(d1,d2)), dmax = Math.max(d1,d2)
                        let s1 = d1 - dd, s2 = d2 - dd;
                        // If the angles are approximately the same, create a straight segment
                        if (Math.floor(a1) === Math.floor(a2)) {
                            this.p.addSegment(a1,s1,p1[2],true)
                            this.p.addSegment(a2,d2,p2[2],true)
                        } else {
                        // If the angles are not the same, create curves, etc (this is a too complex...)
                            let point1 = {x: p2[0] - dd * R.cos(-a1), y: p2[1] - dd * R.sin(-a1)}
                            let point2 = {x: point1.x + dmax * R.cos(-a1+90), y: point1.y + dmax * R.sin(-a1+90)}
                            let point3 = {x: p2[0] + dd * R.cos(-a2), y: p2[1] + dd * R.sin(-a2)}
                            let point4 = {x: point3.x + dmax * R.cos(-a2+90), y: point3.y + dmax * R.sin(-a2+90)}
                            let int = _intersectLines(point1,point2,point3,point4,true)
                            let radius = dist(point1.x,point1.y,int.x,int.y)
                            let disti = dist(point1.x,point1.y,point3.x,point3.y)/2
                            let a3 = 2*asin(disti/radius)
                            let s3 = 2 * Math.PI * radius * a3 / 360;
                            this.p.addSegment(a1,s1-done, p1[2],true)
                            this.p.addSegment(a1,s3, p1[2],true)
                            this.p.addSegment(a2,i === array_points.length - 3 ? s2 : 0, p2[2],true)
                            done = dd;
                        }
                        if (i == array_points.length - 3) {
                            this.p.endPlot(a2,p2[2],true)
                        }
                    } else if (curvature === 0) {
                        // If curvature is 0, simply create segments
                        let p1 = array_points[i], p2 = array_points[i+1]
                        let d = dist(p1[0],p1[1],p2[0],p2[1]);
                        let a = _calculateAngle(p1[0],p1[1],p2[0],p2[1]);
                        this.p.addSegment(a,d,1,true)
                        if (i == array_points.length - 2) {
                            this.p.endPlot(a,1,true)
                        }
                    }
                }
            }
        }
        setOrigin(point) {
            this.p.origin = [point[0], point[1]];
        }
        /**
         * Draws the spline curve on the canvas.
         */
        draw () {this.p.draw()}
    }
    /**
     * Creates and draws a spline curve with the given points and curvature.
     * @param {Array<Array<number>>} array_points - An array of points defining the spline curve.
     * @param {number} [curvature=0.5] - The curvature of the spline curve, between 0 and 1. A curvature of 0 will create a series of straight segments.
     * EXPORTED
     */
    function drawSpline(array_points, curvature = 0.5) {
        _ensureReady(); // Ensure that the drawing environment is prepared
        let p = new Spline(array_points, curvature); // Create a new Spline instance
        p.draw(); // Draw the spline
    }

// =============================================================================
// Section: Fill Management
// =============================================================================
/**
 * The Fill Management section contains functions and classes dedicated to handling
 * the fill properties of shapes within the drawing context. It supports complex fill
 * operations with effects such as bleeding to simulate watercolor-like textures. The
 * methods provided allow for setting the fill color with opacity, controlling the
 * intensity of the bleed effect, and enabling or disabling the fill operation.
 *
 * The watercolor effect implementation is inspired by Tyler Hobbs' generative art
 * techniques for simulating watercolor paints.
 */

    /**
     * Sets the fill color and opacity for subsequent drawing operations.
     * @param {number|p5.Color} a - The red component of the color or grayscale value, or a color object.
     * @param {number} [b] - The green component of the color or grayscale opacity.
     * @param {number} [c] - The blue component of the color.
     * @param {number} [d] - The opacity of the color.
     * EXPORTED
     */
    function setFill(a,b,c,d) {
        F.o = (arguments.length < 4) ? ((arguments.length < 3) ? b : 1) : d;
        F.c = (arguments.length < 3) ? color(a) : color(a,b,c);
        F.isActive = true;
    }

    /**
     * Sets the bleed level for the fill operation, simulating a watercolor effect.
     * @param {number} _i - The intensity of the bleed effect, capped at 0.5.
     * EXPORTED
     */
    function setBleed(_i) {
        F.b = _i > 0.5 ? 0.5 : _i;
    }

    /**
     * Disables the fill for subsequent drawing operations.
     * EXPORTED
     */
    function disableFill() {
        F.isActive = false;
    }

    /**
     * Object representing the fill state and operations for drawing.
     * @property {boolean} isActive - Indicates if the fill operation is active.
     * @property {number} b - Base value for bleed effect.
     * @property {Array} v - Array of p5.Vector representing vertices of the polygon to fill.
     * @property {Array} m - Array of multipliers for the bleed effect on each vertex.
     * @property {function} fill - Method to fill a polygon with a watercolor effect.
     * @property {function} calcCenter - Method to calculate the centroid of the polygon.
     */
    const F = {
        isActive: false,
        b: 0.07,
        /**
         * Fills the given polygon with a watercolor effect.
         * @param {Object} polygon - The polygon to fill.
         */
        fill (polygon) {
            if (this.isActive) {
                // Map polygon vertices to p5.Vector objects
                this.v = polygon.a.map(vert => createVector(vert[0], vert[1]));
                // Calculate fluidity once, outside the loop
                const fluid = this.v.length * R.random(0.4);
                // Map vertices to bleed multipliers with more intense effect on 'fluid' vertices
                F.m = this.v.map((_, i) => {
                    let multiplier = R.random(0.8, 1.2) * this.b;
                    return i < fluid ? constrain(multiplier * 2, 0, 0.9) : multiplier;
                });
                // Shift vertices randomly to create a more natural watercolor edge
                let shift = R.randInt(0, this.v.length);
                this.v = [...this.v.slice(shift), ...this.v.slice(0, shift)];
                // Create and fill the polygon with the calculated bleed effect
                let pol = new FillPolygon (this.v, this.m, this.calcCenter())
                pol.fill(this.c, int(map(this.o,0,255,0,30,true)))
            }
        },
        /**
         * Calculates the center point of the polygon based on the vertices.
         * @returns {p5.Vector} A vector representing the centroid of the polygon.
         */
        calcCenter () {
            let midx = 0, midy = 0;
            for(let i = 0; i < this.v.length; ++i) {
                midx += this.v[i].x;
                midy += this.v[i].y;
            }
            midx /= this.v.length, midy /= this.v.length; 
            return createVector(midx,midy)
        }
    }

    /**
     * The FillPolygon class is used to create and manage the properties of the polygons that produces
     * the watercolor effect. It includes methods to grow (expand) the polygon and apply layers
     * of color with varying intensity and erase parts to simulate a natural watercolor bleed.
     * The implementation follows Tyler Hobbs' guide to simulating watercolor: 
     * https://tylerxhobbs.com/essays/2017/a-generative-approach-to-simulating-watercolor-paints
     */
    class FillPolygon {

        /**
         * The constructor initializes the polygon with a set of vertices, multipliers for the bleed effect, and a center point.
         * @param {p5.Vector[]} _v - An array of p5.Vector objects representing the vertices of the polygon.
         * @param {number[]} _m - An array of numbers representing the multipliers for the bleed effect at each vertex.
         * @param {p5.Vector} _center - A p5.Vector representing the calculated center point of the polygon.
         */
        constructor (_v,_m,_center) {
            this.v = _v;
            this.m = _m;
            this.midP = _center;
            this.size = p5.Vector.sub(this.midP,this.v[0]).mag();
        }

        /**
         * Grows the polygon's vertices outwards to simulate the spread of watercolor.
         * Optionally, can also shrink (degrow) the polygon's vertices inward.
         * @param {number} _a - The growth factor.
         * @param {boolean} [degrow=false] - If true, vertices will move inwards.
         * @returns {FillPolygon} A new `FillPolygon` object with adjusted vertices.
         */
        grow (growthFactor, degrow = false) {
            const newVerts = [];
            const newMods = [];
            // Determine the length of vertices to process based on growth factor
            let verticesToProcess = growthFactor >= 0.2 ? Math.floor(growthFactor * this.v.length) : this.v.length;
            // Function to change the modifier based on a Gaussian distribution
            const changeModifier = (modifier) => {
                const gaussianVariation = randomGaussian(0.5, 0.1);
                return modifier + (gaussianVariation - 0.5) * 0.1;
            };
            // Pre-calculate rotation factor if angleMode is constant
            const rotationFactor = (angleMode() === "radians") ? Math.PI / 180 : 1;
            // Loop through each vertex to calculate the new position based on growth
            for (let i = 0; i < verticesToProcess; i++) {
                const currentVertex = this.v[i];
                const nextVertex = this.v[(i + 1) % verticesToProcess];
                // Determine the growth modifier
                let mod = (growthFactor === 0.1) ? 0.75 : this.m[i];
                if (degrow) mod *= -0.5;
                // Add the current vertex and its modified value
                newVerts.push(currentVertex);
                newMods.push(changeModifier(mod));
                // Calculate the new vertex position
                let newVertex = p5.Vector.lerp(currentVertex, nextVertex, constrain(randomGaussian(0.5,0.2),0.1,0.9));
                let side = p5.Vector.sub(nextVertex, currentVertex)
                let direction = side.copy().normalize();
                let rotationDegrees = -90 + (randomGaussian(0,0.4)) * 45;
                direction.rotate(rotationDegrees * rotationFactor);
                direction.mult(randomGaussian(0.5, 0.2) * random(0.6, 1.4) * side.mag() * mod);
                newVertex.add(direction);
                // Add the new vertex and its modifier
                newVerts.push(newVertex);
                newMods.push(changeModifier(mod));
            }
            return new FillPolygon (newVerts, newMods, this.midP);
        }

        /**
         * Fills the polygon with the specified color and intensity.
         * It uses layered growth to simulate watercolor paper absorption and drying patterns.
         * @param {p5.Color|string} color - The fill color.
         * @param {number} intensity - The opacity of the color layers.
         */
        fill (color, intensity) {
            // Precalculate stuff
            const numLayers = 18;
            const intensityThird = intensity / 3;
            const intensityQuarter = intensity / 4;
            const intensityHalf = intensity / 2;

            // Perform initial setup only once
            _trans();
            Mix.mask.begin();
            push();
            noStroke();
            translate(_matrix[0], _matrix[1]);

            let pol = this.grow()
            let pol2 = pol.grow().grow(0.5);
            let pol3 = pol2.grow(0.4);
            let pol4 = this.grow(0.6)

            for (let i = 0; i < numLayers; i ++) {
                if (i === Math.floor(numLayers / 3) || i === Math.floor(2 * numLayers / 3)) {
                    // Grow the polygon objects once per third of the process
                    pol = pol.grow();
                    pol2 = pol2.grow(0.1);
                    pol3 = pol3.grow(0.1);
                    pol4 = pol4.grow(0.1);
                }
                // Draw layers
                pol.grow().layer(i, intensityHalf);
                pol4.grow(0.1, true).grow().layer(i, intensityQuarter, false);
                pol2.grow(0.1).layer(i, intensityQuarter, false);
                pol3.grow(0.1).layer(i, intensityThird, false);
                // Erase after each set of layers is drawn
                pol.erase();
            }
            pop();
            Mix.mask.end();
            Mix.blend(color)
        }

        /**
         * Adds a layer of color to the polygon with specified opacity.
         * It also sets a stroke to outline the layer edges.
         * @param {number} _nr - The layer number, affecting the stroke and opacity mapping.
         * @param {number} _alpha - The opacity of the layer.
         * @param {boolean} [bool=true] - If true, adds a stroke to the layer.
         */
        layer (_nr,_alpha,bool = true) {
            // Set fill and stroke properties once
            fill(255, 0, 0, _alpha);
            if (bool) {
                stroke(255, 0, 0, R.map(_nr, 0, 18, 3.5, 1));
                strokeWeight(R.map(_nr, 0, 18, 3, 0.5));
            } else {
                noStroke();
            }
            beginShape();
            for(let v of this.v) {vertex(v.x, v.y);}
            endShape(CLOSE);
        }

        /**
         * Erases parts of the polygon to create a more natural, uneven watercolor texture.
         * Uses random placement and sizing of circles to simulate texture.
         */
        erase () {
            const numCircles = R.random(70, 100);
            const halfSize = this.size / 2;
            const minSizeFactor = 0.030 * this.size;
            const maxSizeFactor = 0.20 * this.size;
            erase(4);
            for (let i = 0; i < numCircles; i++) {
                const x = this.midP.x + randomGaussian(0, halfSize);
                const y = this.midP.y + randomGaussian(0, halfSize);
                const size = R.random(minSizeFactor, maxSizeFactor);
                circle(x, y, size);
            }
            noErase();
        }
    }


    /**
     * Extension of the p5.RendererGL prototype to fix the erase function for the WebGL renderer.
     */
    p5.RendererGL.prototype.erase = function(opacityFill, opacityStroke) {
        if (!this._isErasing) {
            this._cachedBlendMode = this.curBlendMode;
            this._isErasing = true;
            this.blendMode('destination-out');
            this._cachedFillStyle = this.curFillColor.slice();
            this.curFillColor = [1, 1, 1, opacityFill / 255];
            this._cachedStrokeStyle = this.curStrokeColor.slice();
            this.curStrokeColor = [1, 1, 1, opacityStroke / 255];
        }
    }
    /**
     * Extension of the p5.RendererGL prototype to fix the noErase function for the WebGL renderer.
     */
    p5.RendererGL.prototype.noErase = function() {
        if (this._isErasing) {
            this.curFillColor = this._cachedFillStyle.slice();
            this.curStrokeColor = this._cachedStrokeStyle.slice();
            let temp = this.curBlendMode;
            this.blendMode(this._cachedBlendMode);
            this._cachedBlendMode = temp;
            this._isErasing = false;
            this._applyBlendMode();
        }
    }

// =============================================================================
// Section: Standard Brushes
// =============================================================================
    /**
     * Defines a set of standard brushes with specific characteristics. Each brush is defined
     * with properties such as weight, vibration, definition, quality, opacity, spacing, and
     * pressure sensitivity. Some brushes have additional properties like type, tip, and rotate.
     */
    const _standard_brushes = [
        // Define each brush with a name and a set of parameters
        // For example, the "pen" brush has a weight of 0.35, a vibration of 0.12, etc.
        // The "marker2" brush has a custom tip defined by a function that draws rectangles.
        ["pen", { weight: 0.35, vibration: 0.12, definition: 0.5, quality: 8, opacity: 200, spacing: 0.3, pressure: {curve: [0.15,0.2], min_max: [1.3,1]} }],
        ["rotring", { weight: 0.2, vibration: 0.05, definition: 1, quality: 300, opacity: 250, spacing: 0.15, pressure: {curve: [0.05,0.2], min_max: [1.2,0.95]} }],
        ["2B", { weight: 0.4, vibration: 0.45, definition: 0.1, quality: 9, opacity: 160, spacing: 0.2, pressure: {curve: [0.15,0.2], min_max: [1.2,1]} }],
        ["HB", { weight: 0.3, vibration: 0.5, definition: 0.4, quality: 4,  opacity: 180, spacing: 0.25, pressure: {curve: [0.15,0.2], min_max: [1.2,0.9]} }],
        ["2H", { weight: 0.2, vibration: 0.4, definition: 0.3, quality: 2,  opacity: 150, spacing: 0.2, pressure: {curve: [0.15,0.2], min_max: [1.2,0.9]} }],
        ["cpencil", { weight: 0.4, vibration: 0.6, definition: 0.8, quality: 7,  opacity: 120, spacing: 0.15, pressure: {curve: [0.15,0.2], min_max: [0.95,1.15]} }],
        ["charcoal", { weight: 0.45, vibration: 2, definition: 0.7, quality: 300,  opacity: 110, spacing: 0.07, pressure: {curve: [0.15,0.2], min_max: [1.3,0.95]} }],
        ["hatch_brush", { weight: 0.2, vibration: 0.4, definition: 0.3, quality: 2,  opacity: 150, spacing: 0.15, pressure: {curve: [0.5,0.7], min_max: [1,1.5]} }],
        ["spray", { type: "spray", weight: 0.3, vibration: 12, definition: 15, quality: 40,  opacity: 120, spacing: 0.65, pressure: {curve: [0,0.1], min_max: [0.15,1.2]} }],
        ["marker", { type: "marker", weight: 2.5, vibration: 0.08, opacity: 30, spacing: 0.4, pressure: {curve: [0.35,0.25], min_max: [1.35,1]}}],
        ["marker2", { type: "custom", weight: 2.5, vibration: 0.08, opacity: 23, spacing: 0.6, pressure: {curve: [0.35,0.25], min_max: [1.35,1]}, 
            tip: function () { _r.rect(-1.5,-1.5,3,3); _r.rect(1,1,1,1) }, rotate: "natural"
        }],
    ];
    /**
     * Iterates through the list of standard brushes and adds each one to the brush manager.
     * The brush manager is assumed to be a global object `B` that has an `add` method.
     */
    for (let s of _standard_brushes) {
        B.add(s[0],s[1])
    }
    /**
     * Adjusts the global scale of brush parameters based on the provided scale factor.
     * This affects the weight, vibration, and spacing of each standard brush.
     * 
     * @param {number} _scale - The scaling factor to apply to the brush parameters.
     * EXPORTED
     */
    function globalScale(_scale) {
        for (let s of _standard_brushes) {
            let params = B.list.get(s[0]).param
            params.weight *= _scale, params.vibration *= _scale, params.spacing *= _scale;
        }
    }

// =============================================================================
// Section: Exports
// =============================================================================
/** 
 * This section lists the public API for the module, providing access
 * to the core functionalities such as managing the flow field, brushes, strokes, fills,
 * and geometrical shapes drawing.
 */

// Basic Functions
exports.config = configureSystem;                // Configures and seeds the RNG (Random Number Generator).
exports.load = loadSystem;                    // Loads the library into the selected buffer.
exports.preload = preloadBrushAssets;              // Preloads custom tips for the library.

// FLOWFIELD Management
exports.addField = addField;            // Adds a new vector field.
exports.field = selectField;                  // Activates or selects a specific vector field.
exports.noField = disableField;         // Disables the current vector field.
exports.refreshField = refreshField;    // Refreshes the vector field, useful for animations.
exports.listFields = listFields;        // Lists all the available fields.

// BRUSH Management
exports.scale = globalScale;            // Rescales all standard brushes.
exports.add = B.add;                     // Adds a new brush definition.
exports.box = listOfBrushes;                   // Retrieves an array with existing brushes.
exports.set = B.set;                     // Sets values for all properties of a brush.
exports.pick = B.setBrush;               // Selects a brush to use.
exports.clip = B.clip;                   // Clips brushes with a rectangle.

// STROKE Properties
exports.stroke = B.setColor;             // Sets the stroke color.
exports.strokeWeight = B.setWeight;      // Sets the weight (thickness) of the stroke.
exports.noStroke = disableBrush;            // Disables the stroke.

// FILL Operations (affects rect, circle, and beginShape)
exports.fill = setFill;                    // Sets the fill color.
exports.bleed = setBleed;                  // Sets the bleed property for fills.
exports.noFill = disableFill;                // Disables the fill.

// GEOMETRY Drawing Functions
exports.line = B.line;                   // Draws a line.
exports.flowLine = B.flowLine;           // Draws a line that follows the vector field.
exports.flowShape = B.flowShape;         // Draws a shape that follows the vector field.
exports.rect = drawRectangle;                    // Draws a rectangle.
exports.circle = drawCircle;                // Draws a circle.
exports.polygon = drawPolygon;              // Draws a polygon.
exports.spline = drawSpline;                // Draws a spline curve.
// Equivalent to beginShape in p5.js
exports.beginShape = _beginShape;        // Begins recording vertices for a custom shape.
exports.vertex = _vertex;                // Records a vertex for a custom shape.
exports.endShape = _endShape;            // Finishes recording vertices and draws the shape.
// HandStroke - simulates a hand-drawn stroke
exports.beginStroke = _beginStroke;      // Begins a hand-drawn stroke.
exports.move = _move;                    // Moves to a specified point in the hand-drawn stroke.
exports.endStroke = _endStroke;          // Ends a hand-drawn stroke.

// HATCHING Operations
exports.hatch = B.hatch;                 // Function to create hatched patterns within polygons.

// Classes Exposed
exports.Polygon = Polygon;               // The Polygon class, used for creating and manipulating polygons.
exports.Plot = Plot;                     // The Plot class, for plotting curves.
exports.Pos = Position;                  // The Position class, for managing positions on the canvas.

})));