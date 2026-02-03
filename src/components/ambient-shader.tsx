'use client'

import { useEffect, useRef } from 'react'
import { useTheme } from './theme-provider'

const vertexShader = `
  attribute vec2 position;
  void main() {
    gl_Position = vec4(position, 0.0, 1.0);
  }
`

// Dark mode - subtle ambient glow, almost like fog/haze
const fragmentShaderDark = `
  precision highp float;
  uniform float time;
  uniform vec2 resolution;
  
  float noise(vec2 p) {
    return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
  }
  
  float smoothNoise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(noise(i), noise(i + vec2(1.0, 0.0)), f.x),
      mix(noise(i + vec2(0.0, 1.0)), noise(i + vec2(1.0, 1.0)), f.x),
      f.y
    );
  }
  
  float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;
    for (int i = 0; i < 4; i++) {
      value += amplitude * smoothNoise(p);
      p *= 2.0;
      amplitude *= 0.5;
    }
    return value;
  }
  
  void main() {
    vec2 uv = gl_FragCoord.xy / resolution.xy;
    float t = time * 0.015;
    
    // Very subtle flowing noise
    float n = fbm(uv * 1.5 + vec2(t, t * 0.5));
    float n2 = fbm(uv * 2.0 - vec2(t * 0.3, t * 0.7));
    
    // Base: near black
    vec3 baseColor = vec3(0.039, 0.039, 0.039);
    
    // Subtle glow in top-right area
    vec2 glowCenter = vec2(0.85, 0.85);
    float glowDist = length(uv - glowCenter);
    float glow = smoothstep(0.8, 0.0, glowDist) * 0.08;
    
    // Secondary subtle glow bottom-left
    vec2 glowCenter2 = vec2(0.1, 0.15);
    float glowDist2 = length(uv - glowCenter2);
    float glow2 = smoothstep(0.6, 0.0, glowDist2) * 0.03;
    
    // Combine with noise for organic feel
    float combinedGlow = glow * (0.8 + n * 0.4) + glow2 * (0.8 + n2 * 0.4);
    
    vec3 color = baseColor + vec3(combinedGlow);
    
    // Very subtle noise grain
    color += (noise(uv * 500.0 + t * 10.0) - 0.5) * 0.015;
    
    gl_FragColor = vec4(color, 1.0);
  }
`

// Light mode - soft warm ambient
const fragmentShaderLight = `
  precision highp float;
  uniform float time;
  uniform vec2 resolution;
  
  float noise(vec2 p) {
    return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
  }
  
  float smoothNoise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(noise(i), noise(i + vec2(1.0, 0.0)), f.x),
      mix(noise(i + vec2(0.0, 1.0)), noise(i + vec2(1.0, 1.0)), f.x),
      f.y
    );
  }
  
  float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;
    for (int i = 0; i < 4; i++) {
      value += amplitude * smoothNoise(p);
      p *= 2.0;
      amplitude *= 0.5;
    }
    return value;
  }
  
  void main() {
    vec2 uv = gl_FragCoord.xy / resolution.xy;
    float t = time * 0.015;
    
    float n = fbm(uv * 1.5 + vec2(t, t * 0.5));
    
    // Light base
    vec3 baseColor = vec3(0.92, 0.92, 0.93);
    
    // Subtle warm glow
    vec2 glowCenter = vec2(0.8, 0.8);
    float glowDist = length(uv - glowCenter);
    float glow = smoothstep(0.7, 0.0, glowDist) * 0.03;
    
    vec3 color = baseColor - vec3(glow * (0.8 + n * 0.4));
    
    // Subtle grain
    color += (noise(uv * 400.0 + t * 10.0) - 0.5) * 0.01;
    
    gl_FragColor = vec4(color, 1.0);
  }
`

function createShader(gl: WebGLRenderingContext, type: number, source: string) {
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
}

function createProgram(gl: WebGLRenderingContext, vs: WebGLShader, fs: WebGLShader) {
  const program = gl.createProgram()
  if (!program) return null
  gl.attachShader(program, vs)
  gl.attachShader(program, fs)
  gl.linkProgram(program)
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error('Program error:', gl.getProgramInfoLog(program))
    gl.deleteProgram(program)
    return null
  }
  return program
}

export function AmbientShader() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { resolvedTheme } = useTheme()
  const frameRef = useRef<number>()
  
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const gl = canvas.getContext('webgl', { alpha: false, antialias: false })
    if (!gl) return
    
    const vs = createShader(gl, gl.VERTEX_SHADER, vertexShader)
    const fs = createShader(gl, gl.FRAGMENT_SHADER, resolvedTheme === 'dark' ? fragmentShaderDark : fragmentShaderLight)
    if (!vs || !fs) return
    
    const program = createProgram(gl, vs, fs)
    if (!program) return
    
    gl.useProgram(program)
    
    const vertices = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1])
    const buffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)
    
    const position = gl.getAttribLocation(program, 'position')
    gl.enableVertexAttribArray(position)
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0)
    
    const timeLoc = gl.getUniformLocation(program, 'time')
    const resLoc = gl.getUniformLocation(program, 'resolution')
    
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 1.5)
      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr
      canvas.style.width = window.innerWidth + 'px'
      canvas.style.height = window.innerHeight + 'px'
      gl.viewport(0, 0, canvas.width, canvas.height)
    }
    
    resize()
    window.addEventListener('resize', resize)
    
    const start = Date.now()
    const render = () => {
      gl.uniform1f(timeLoc, (Date.now() - start) / 1000)
      gl.uniform2f(resLoc, canvas.width, canvas.height)
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
      frameRef.current = requestAnimationFrame(render)
    }
    
    render()
    
    return () => {
      window.removeEventListener('resize', resize)
      if (frameRef.current) cancelAnimationFrame(frameRef.current)
    }
  }, [resolvedTheme])
  
  return <canvas ref={canvasRef} id="shader-canvas" />
}
