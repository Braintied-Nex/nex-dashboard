'use client'

import { useEffect, useRef, useCallback } from 'react'
import { useTheme } from './theme-provider'

const vertexShader = `
  attribute vec2 position;
  void main() {
    gl_Position = vec4(position, 0.0, 1.0);
  }
`

// Dark mode shader - represents always-on intelligence
// Subtle, organic movement like thoughts forming
const fragmentShaderDark = `
  precision highp float;
  uniform float time;
  uniform vec2 resolution;
  uniform vec2 mouse;
  
  // Simplex-like noise
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }
  
  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
    vec2 i = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m*m; m = m*m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
    vec3 g;
    g.x = a0.x * x0.x + h.x * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }
  
  float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;
    float frequency = 1.0;
    for (int i = 0; i < 5; i++) {
      value += amplitude * snoise(p * frequency);
      frequency *= 2.0;
      amplitude *= 0.5;
    }
    return value;
  }
  
  void main() {
    vec2 uv = gl_FragCoord.xy / resolution.xy;
    float aspect = resolution.x / resolution.y;
    vec2 p = (uv - 0.5) * vec2(aspect, 1.0);
    
    float t = time * 0.02;
    
    // Multiple layers of organic movement
    float n1 = fbm(p * 0.8 + vec2(t * 0.3, t * 0.2));
    float n2 = fbm(p * 1.2 + vec2(-t * 0.2, t * 0.4) + n1 * 0.3);
    float n3 = fbm(p * 0.5 + vec2(t * 0.1, -t * 0.15) + n2 * 0.2);
    
    // Base: deep black
    vec3 color = vec3(0.031, 0.031, 0.031);
    
    // Primary glow - top right, like a distant light source
    vec2 glow1Center = vec2(0.7, 0.75);
    float glow1Dist = length(uv - glow1Center);
    float glow1 = smoothstep(0.9, 0.0, glow1Dist) * 0.12;
    glow1 *= 0.7 + n1 * 0.5;
    
    // Secondary glow - bottom left, subtle
    vec2 glow2Center = vec2(0.15, 0.2);
    float glow2Dist = length(uv - glow2Center);
    float glow2 = smoothstep(0.7, 0.0, glow2Dist) * 0.04;
    glow2 *= 0.8 + n2 * 0.4;
    
    // Tertiary - subtle center ambient
    float glow3 = smoothstep(0.8, 0.0, length(uv - 0.5)) * 0.02;
    glow3 *= 0.9 + n3 * 0.2;
    
    // Combine glows
    float totalGlow = glow1 + glow2 + glow3;
    
    // Slight color variation in the glow (very subtle warm/cool)
    vec3 warmTint = vec3(1.0, 0.98, 0.95);
    vec3 coolTint = vec3(0.95, 0.97, 1.0);
    vec3 glowColor = mix(warmTint, coolTint, n1 * 0.5 + 0.5);
    
    color += glowColor * totalGlow;
    
    // Very subtle film grain
    float grain = (fract(sin(dot(uv * time * 0.01, vec2(12.9898, 78.233))) * 43758.5453) - 0.5) * 0.012;
    color += grain;
    
    // Vignette
    float vignette = 1.0 - smoothstep(0.4, 1.1, length(uv - 0.5));
    color *= 0.95 + vignette * 0.05;
    
    gl_FragColor = vec4(color, 1.0);
  }
`

// Light mode shader - softer, warmer ambient
const fragmentShaderLight = `
  precision highp float;
  uniform float time;
  uniform vec2 resolution;
  
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }
  
  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
    vec2 i = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m*m; m = m*m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
    vec3 g;
    g.x = a0.x * x0.x + h.x * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }
  
  float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;
    for (int i = 0; i < 4; i++) {
      value += amplitude * snoise(p);
      p *= 2.0;
      amplitude *= 0.5;
    }
    return value;
  }
  
  void main() {
    vec2 uv = gl_FragCoord.xy / resolution.xy;
    float t = time * 0.015;
    
    float n = fbm(uv * 1.0 + t);
    
    // Light base with subtle warmth
    vec3 color = vec3(0.96, 0.96, 0.965);
    
    // Subtle shadows/depth
    float shadow = fbm(uv * 0.8 - t * 0.5) * 0.015;
    color -= shadow;
    
    // Warm glow in corner
    vec2 glowPos = vec2(0.8, 0.75);
    float glow = smoothstep(0.8, 0.0, length(uv - glowPos)) * 0.02;
    color -= glow * (0.8 + n * 0.4);
    
    // Subtle grain
    float grain = (fract(sin(dot(uv * time * 0.01, vec2(12.9898, 78.233))) * 43758.5453) - 0.5) * 0.008;
    color += grain;
    
    gl_FragColor = vec4(color, 1.0);
  }
`

export function AmbientShader() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { resolvedTheme } = useTheme()
  const frameRef = useRef<number>()
  const glRef = useRef<WebGLRenderingContext | null>(null)
  const programRef = useRef<WebGLProgram | null>(null)
  
  const createShader = useCallback((gl: WebGLRenderingContext, type: number, source: string) => {
    const shader = gl.createShader(type)
    if (!shader) return null
    gl.shaderSource(shader, source)
    gl.compileShader(shader)
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error('Shader error:', gl.getShaderInfoLog(shader))
      gl.deleteShader(shader)
      return null
    }
    return shader
  }, [])
  
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const gl = canvas.getContext('webgl', { 
      alpha: false, 
      antialias: false,
      powerPreference: 'low-power'
    })
    if (!gl) return
    
    glRef.current = gl
    
    const vs = createShader(gl, gl.VERTEX_SHADER, vertexShader)
    const fs = createShader(
      gl, 
      gl.FRAGMENT_SHADER, 
      resolvedTheme === 'dark' ? fragmentShaderDark : fragmentShaderLight
    )
    if (!vs || !fs) return
    
    const program = gl.createProgram()
    if (!program) return
    
    gl.attachShader(program, vs)
    gl.attachShader(program, fs)
    gl.linkProgram(program)
    
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Program error:', gl.getProgramInfoLog(program))
      return
    }
    
    programRef.current = program
    gl.useProgram(program)
    
    // Geometry
    const vertices = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1])
    const buffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)
    
    const position = gl.getAttribLocation(program, 'position')
    gl.enableVertexAttribArray(position)
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0)
    
    // Uniforms
    const timeLoc = gl.getUniformLocation(program, 'time')
    const resLoc = gl.getUniformLocation(program, 'resolution')
    
    // Resize
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 1.5)
      const w = window.innerWidth
      const h = window.innerHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      canvas.style.width = w + 'px'
      canvas.style.height = h + 'px'
      gl.viewport(0, 0, canvas.width, canvas.height)
    }
    
    resize()
    window.addEventListener('resize', resize)
    
    // Render loop
    const start = performance.now()
    
    const render = () => {
      const elapsed = (performance.now() - start) / 1000
      gl.uniform1f(timeLoc, elapsed)
      gl.uniform2f(resLoc, canvas.width, canvas.height)
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
      frameRef.current = requestAnimationFrame(render)
    }
    
    render()
    
    return () => {
      window.removeEventListener('resize', resize)
      if (frameRef.current) cancelAnimationFrame(frameRef.current)
    }
  }, [resolvedTheme, createShader])
  
  return <canvas ref={canvasRef} id="ambient-shader" />
}
