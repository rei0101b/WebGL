onload = function() {
  var c = document.getElementById("canvas");

  c.width = 300;
  c.height = 300;

  var gl = c.getContext("webgl") || c.getContext("experimental-webgl");

  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clearDepth(1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  var v_shader = create_shader("vs");
  var f_shader = create_shader("fs");
  var prg = create_program(v_shader, f_shader);

  var attLocation = new Array(2);
  attLocation[0] = gl.getAttribLocation(prg, "position");
  attLocation[1] = gl.getAttribLocation(prg, "color");

  var attStride = new Array(2);
  attStride[0] = 3;
  attStride[1] = 4;

  var vertex_position = [0.0, 1.0, 0.0, 1.0, 0.0, 0.0, -1.0, 0.0, 0.0];
  var vertex_color = [
    1.0,
    0.0,
    0.0,
    1.0,
    0.0,
    1.0,
    0.0,
    1.0,
    0.0,
    0.0,
    1.0,
    1.0
  ];

  pos_vbo = create_vbo(vertex_position);
  co_vbo = create_vbo(vertex_color);
  set_attribute([pos_vbo, co_vbo], attLocation, attStride);

  var m = new matIV();
  var mMatrix = m.identity(m.create());
  var vMatrix = m.identity(m.create());
  var pMatrix = m.identity(m.create());
  var tmpMatrix = m.identity(m.create());
  var mvpMatrix = m.identity(m.create());

  var uniLocation = gl.getUniformLocation(prg, "mvpMatrix");

  m.lookAt([0.0, 1.0, 3.0], [0, 0, 0], [0, 1, 0], vMatrix);
  m.perspective(90, c.width / c.height, 0.1, 100, pMatrix);
  m.multiply(pMatrix, vMatrix, tmpMatrix);

  m.translate(mMatrix, [1.5, 0.0, 0.0], mMatrix);
  m.multiply(tmpMatrix, mMatrix, mvpMatrix);

  gl.uniformMatrix4fv(uniLocation, false, mvpMatrix);
  gl.drawArrays(gl.TRIANGLES, 0, 3);

  m.identity(mMatrix);
  m.translate(mMatrix, [-1.5, 0.0, 0.0], mMatrix);
  m.multiply(tmpMatrix, mMatrix, mvpMatrix);
  gl.uniformMatrix4fv(uniLocation, false, mvpMatrix);
  gl.drawArrays(gl.TRIANGLES, 0, 3);

  m.identity(mMatrix);
  m.translate(mMatrix, [-1.5, -1.0, 0.0], mMatrix);
  m.multiply(tmpMatrix, mMatrix, mvpMatrix);
  gl.uniformMatrix4fv(uniLocation, false, mvpMatrix);
  gl.drawArrays(gl.TRIANGLES, 0, 3);

  m.identity(mMatrix);
  m.translate(mMatrix, [0.5, -0.2, 2.2], mMatrix);
  m.multiply(tmpMatrix, mMatrix, mvpMatrix);
  gl.uniformMatrix4fv(uniLocation, false, mvpMatrix);
  gl.drawArrays(gl.TRIANGLES, 0, 3);

  gl.flush();

  function create_shader(id) {
    var shader;
    var scriptElement = document.getElementById(id);
    if (!scriptElement) {
      return;
    }

    switch (scriptElement.type) {
      case "x-shader/x-vertex":
        shader = gl.createShader(gl.VERTEX_SHADER);
        break;
      case "x-shader/x-fragment":
        shader = gl.createShader(gl.FRAGMENT_SHADER);
        break;
      default:
        return;
    }

    gl.shaderSource(shader, scriptElement.text);
    gl.compileShader(shader);

    if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      return shader;
    } else {
      alert(gl.getShaderInfoLog(shader));
    }
  }

  function create_program(vs, fs) {
    var program = gl.createProgram();

    gl.attachShader(program, vs);
    gl.attachShader(program, fs);

    gl.linkProgram(program);

    if (gl.getProgramParameter(program, gl.LINK_STATUS)) {
      gl.useProgram(program);
      return program;
    } else {
      alert(gl.getProgramInfo(program));
    }
  }

  function create_vbo(data) {
    var vbo = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    return vbo;
  }

  function set_attribute(vbo, attL, attS) {
    for (var i in vbo) {
      gl.bindBuffer(gl.ARRAY_BUFFER, vbo[i]);
      gl.enableVertexAttribArray(attLocation[i]);
      gl.vertexAttribPointer(
        attLocation[i],
        attStride[i],
        gl.FLOAT,
        false,
        0,
        0
      );
    }
  }
};
