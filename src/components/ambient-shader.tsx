'use client'

import { useEffect, useRef } from 'react'
import { useTheme } from './theme-provider'

const vertexShader = `
  attribute vec2 position;
  void main() {
    gl_Position = vec4(position, 0.0, 1.0);
  }
`

// Dark: Represents always-on intelligence - subtle, alive, thinking
const fragmentDark = `
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
    float v = 0.0, a = 0.5;
    for (int i = 0; i < 5; i++) {
      v += a * snoise(p);
      p *= 2.0;
      a *= 0.5;
    }
    return v;
  }
  
  void main() {
    vec2 uv = gl_FragCoord.xy / resolution.xy;
    float t = time * 0.015;
    
    // Organic flowing noise layers
    float n1 = fbm(uv * 0.7 + t * vec2(0.3, 0.2));
    float n2 = fbm(uv * 1.0 + t * vec2(-0.2, 0.35) + n1 * 0.25);
    float n3 = fbm(uv * 0.4 + t * vec2(0.15, -0.1));
    
    // Deep black base
    vec3 col = vec3(0.039);
    
    // Primary glow - top right, like a thinking presence
    vec2 g1 = vec2(0.75, 0.8);
    float d1 = length(uv - g1);
    float glow1 = smoothstep(1.0, 0.0, d1) * 0.15;
    glow1 *= 0.6 + n1 * 0.6;
    
    // Secondary glow - bottom left, subtle
    vec2 g2 = vec2(0.1, 0.15);
    float d2 = length(uv - g2);
    float glow2 = smoothstep(0.7, 0.0, d2) * 0.05;
    glow2 *= 0.7 + n2 * 0.5;
    
    // Center ambient
    float glow3 = smoothstep(0.9, 0.0, length(uv - 0.5)) * 0.03;
    glow3 *= 0.8 + n3 * 0.3;
    
    // Combine
    float totalGlow = glow1 + glow2 + glow3;
    col += totalGlow;
    
    // Subtle film grain
    float grain = fract(sin(dot(uv * time * 0.02, vec2(12.9898, 78.233))) * 43758.5453);
    col += (grain - 0.5) * 0.015;
    
    gl_FragColor = vec4(col, 1.0);
  }
`

// Light: Soft, warm, subtle movement
const fragmentLight = `
  precision highp float;
  uniform float time;
  uniform vec2 resolution;
  
  float rand(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
  
  float noise(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(mix(rand(i), rand(i + vec2(1.0, 0.0)), f.x),
               mix(rand(i + vec2(0.0, 1.0)), rand(i + vec2(1.0, 1.0)), f.x), f.y);
  }
  
  float fbm(vec2 p) {
    float v = 0.0, a = 0.5;
    for (int i = 0; i < 4; i++) {
      v += a * noise(p);
      p *= 2.0;
      a *= 0.5;
    }
    return v;
  }
  
  void main() {
    vec2 uv = gl_FragCoord.xy / resolution.xy;
    float t = time * 0.01;
    float n = fbm(uv * 1.5 + t);
    
    vec3 col = vec3(0.96, 0.96, 0.965);
    
    // Subtle warm glow
    float g = smoothstep(0.9, 0.0, length(uv - vec2(0.8, 0.8))) * 0.025;
    col -= g * (0.7 + n * 0.5);
    
    // Very subtle grain
    col += (rand(uv * time * 0.01) - 0.5) * 0.008;
    
    gl_FragColor = vec4(col, 1.0);
  }
`

export function AmbientShader() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { resolvedTheme } = useTheme()
  const frameRef = useRef<number>()
  
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const gl = canvas.getContext('webgl', { alpha: false, antialias: false })
    if (!gl) return
    
    // Shaders
    const vs = gl.createShader(gl.VERTEX_SHADER)!
    gl.shaderSource(vs, vertexShader)
    gl.compileShader(vs)
    
    const fs = gl.createShader(gl.FRAGMENT_SHADER)!
    gl.shaderSource(fs, resolvedTheme === 'dark' ? fragmentDark : fragmentLight)
    gl.compileShader(fs)
    
    const program = gl.createProgram()!
    gl.attachShader(program, vs)
    gl.attachShader(program, fs)
    gl.linkProgram(program)
    gl.useProgram(program)
    
    // Geometry
    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW)
    
    const pos = gl.getAttribLocation(program, 'position')
    gl.enableVertexAttribArray(pos)
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0)
    
    const timeLoc = gl.getUniformLocation(program, 'time')
    const resLoc = gl.getUniformLocation(program, 'resolution')
    
    // Resize
    const resize = () => {
      const dpr = Math.min(devicePixelRatio, 1.5)
      canvas.width = innerWidth * dpr
      canvas.height = innerHeight * dpr
      canvas.style.cssText = `width:${innerWidth}px;height:${innerHeight}px`
      gl.viewport(0, 0, canvas.width, canvas.height)
    }
    resize()
    addEventListener('resize', resize)
    
    // Render
    const t0 = performance.now()
    const render = () => {
      gl.uniform1f(timeLoc, (performance.now() - t0) / 1000)
      gl.uniform2f(resLoc, canvas.width, canvas.height)
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
      frameRef.current = requestAnimationFrame(render)
    }
    render()
    
    return () => {
      removeEventListener('resize', resize)
      cancelAnimationFrame(frameRef.current!)
    }
  }, [resolvedTheme])
  
  return <canvas ref={canvasRef} id="ambient-shader" />
}
