// first we load the page, then we initialize webGL. this order is important.
window.onload = main;

// this function runs after my webpage is loaded
function main() {
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

    // clearing the screen with white
                // RGBA
    gl.clearColor(1, 1, 1, 0);
    gl.lineWidth(1.0);
    
    /* this positions array defines a quad (actually two triangles), with numbered vertices
    4--- 1
    | \  |
    |  \ |
    |   \|
    3 ---2
    kind of like this
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

    // I don't need to specify the size of that buffer, and I associate a name with that buffer
    var position_buffer = gl.createBuffer();

    // then, I bind that buffer and 

    console.log('Drawing buffer size:', canvas.width, 'x', canvas.height);
    console.log('CSS display size:', canvas.clientWidth, 'x', canvas.clientHeight);
    console.log(positions);
}
