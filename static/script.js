// first we load the page, then we initialize webGL. this order is important.
window.onload = main;

// this function runs after my webpage is loaded
function main() {

    // Canvas Resolution // 

    canvas = document.getElementById('webglcanvas');
    // a webgl context is like a class, and we will call functions from it to control our gpu
    // it is called a context, because that's the term used for graphics API, 
    // and it means there's a corresponding component to it in our GPU and our drivers. 
    // this will contain all our GPU data, all the shaders, everything will go through this context.
    gl = canvas.getContext('webgl'); // this function has more optional parameters

    // safeguard for when WEBGL is not supported
    if (!gl) {
        alert('WebGL not supported in your browser!');
        return;
    }

    // the client.Width and client.Height are typically given in pixels, but not always.
    // this is why we need to have this pixelRatio settings, to account for display scaling.
    const pixelRatio = window.devicePixelRatio || 1;
    // I need to set its width and height in pixels. Beware: this is NOT the dimensions of the canvas that appear on my webpage.
    // the .width and .height will define the output image resolution. NOT the entire canvas resolution.
    canvas.width = pixelRatio * canvas.clientWidth;
    canvas.height = pixelRatio * canvas.clientHeight;

    // setting my viewport
        // starting x and y of the viewport, and size of viewport (width and height)
    gl.viewport(0, 0, canvas.width, canvas.height); // this sets it to cover the entire canvas.

    // Clear Screen State
                // RGBA
    gl.clearColor(1, 1, 1, 0);

    // Creating Scene Data //
    
    /* this positions array defines a quad (actually two triangles), with numbered vertices
    4--- 1
    | \  |
    |  \ |
    |   \|
    3 ---2
    kind of like this, where 1 = Red, 2 = Green, 3 = Blue, 4 = Purple
    */
    var positions = [
        -0.8, 0.4, 0, // 1
        0.8, 0.4, 0, // 2
        0.8, -0.4, 0, // 3
        -0.8, 0.4, 0, // 1
        0.8, -0.4, 0, // 3
        -0.8, -0.4, 0 // 4
        ];
    // remember: the winding order matters for backfaces and frontfaces culling

    var colors = [
        1, 0, 0, 1, // Red
        0, 1, 0, 1, // Green
        0, 0, 1, 1, // Blue
        1, 0, 0, 1, // Red
        0, 0, 1, 1, // Blue
        1, 0, 1, 1, // Purple
        ]

    // I don't need to specify the size of that buffer, here I only associate a name to that buffer
    var position_buffer = gl.createBuffer();
    // Here I bind the buffer    
    gl.bindBuffer(gl.ARRAY_BUFFER, position_buffer);
    // and here is where the data is sent to the buffer, I don't need to specify the buffer here
    // because it will be the one I just binded. I also don't need to specify the size, JS already knows what it is.
    // I don't allocate memory manually in WEBGL. This is where the malloc happens.
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW); // what STATIC_DRAW does is assume that I won't modify that data very often

    // here, I do the same to the color data
    var color_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, color_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
    // I can only have one buffer binded at a time. Remember this. One bind at a time.

    // -- //

    // until now, WEBGL doesn't have any idea of what that data is: it's just loaded in a buffer.
    // So I need to create the shaders to make it work

    // Create Vertex Shader //

    const vs_source = document.getElementById('vertexShader').text;

    const vs = gl.createShader(gl.VERTEX_SHADER);
                    // js interprets this as a string that contains my vertex shader code
    gl.shaderSource(vs, vs_source);
    // it is WEBGL that compiles my shader code
    gl.compileShader(vs);
    // then, we need to check if the compilation was succesful
    if (! gl.getShaderParameter(vs, gl.COMPILE_STATUS))
    {
        alert(gl.getShaderInfoLog(vs));
        gl.deleteShader(vs);
        return;
    }

    // Create Fragment Shader //
    const fs_source = document.getElementById('fragmentShader').text;

    const fs = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fs, fs_source);
    gl.compileShader(fs);
    
    // same compilation check
    if (! gl.getShaderParameter(fs, gl.COMPILE_STATUS))
    {
        alert(gl.getShaderInfoLog(fs));
        gl.deleteShader(fs);
        return;
    }

    // After that, we need to link both shaders
    prog = gl.createProgram();
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    // Again, check for linker errors
    if(! gl.getProgramParameter(prog, gl.LINK_STATUS))
    {
        alert(gl.getProgramInfoLog(prog));
    }
                            // this is the compiled and linked program
    var m = gl.getUniformLocation(prog, 'transformation'); // will probably be zero
    // transposed identity matrix
    var matrix = [
            1,0,0,0,
            0,1,0,0,
            0,0,1,0,
            0,0,0,1];
    // I need to indicate which program I'm using.
    gl.useProgram(prog);
    // column formed matrix
    // the fv indicates that we will get an array of values (f is for flot)
    gl.uniformMatrix4fv(m, false, matrix);

    // this loads our previously declared position array
    // into the position attribute in the vertex shader
    var p = gl.getAttribLocation(prog, 'position'); // gets the attribute location
    gl.bindBuffer(gl.ARRAY_BUFFER, position_buffer); // always bind a buffer before using it
    gl.vertexAttribPointer(p, 3, gl.FLOAT, false, 0, 0); // this is where I'm sending the information that WebGL needs
    // p will be a 3D vector of floating point values (p, 3, gl.FLOAT)
    gl.enableVertexAttribArray(p); // and this tells webGL to use that attribute

    // this loads our previously declared colors array
    // into the color attribute in the vertex shader
    var c = gl.getAttribLocation(prog, 'color');
    gl.bindBuffer(gl.ARRAY_BUFFER, color_buffer);
    gl.vertexAttribPointer(c, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(c);

    gl.clear(gl.COLOR_BUFFER_BIT);
    // specifies what shaders I'm using for what I'm about to draw
    gl.useProgram(prog);
    // this is where we finally render something! everything we did until now was initialization to be able to call this function
                // drawing triangles, starting from 0 (vertex buffer objects), 6 vertices, 2 triangles
    gl.drawArrays( gl.TRIANGLES, 0, 6 );
}
