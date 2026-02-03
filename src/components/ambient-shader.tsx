'use client'

import { useEffect, useRef } from 'react'
import { useTheme } from './theme-provider'

// Vertex shader - simple passthrough
const vertexShader = `
  attribute vec2 position;
  void main() {
    gl_Position = vec4(position, 0.0, 1.0);
  }
`

// Fragment shader - ambient gradient animation
const fragmentShaderLight = `
  precision highp float;
  uniform float time;
  uniform vec2 resolution;
  
  // Soft noise function
  float noise(vec2 p) {
    return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
  }
  
  float smoothNoise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    
    float a = noise(i);
    float b = noise(i + vec2(1.0, 0.0));
    float c = noise(i + vec2(0.0, 1.0));
    float d = noise(i + vec2(1.0, 1.0));
    
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }
  
  void main() {
    vec2 uv = gl_FragCoord.xy / resolution.xy;
    
    // Slow-moving coordinates
    float t = time * 0.05;
    
    // Multiple layers of movement
    float n1 = smoothNoise(uv * 2.0 + t);
    float n2 = smoothNoise(uv * 3.0 - t * 0.7);
    float n3 = smoothNoise(uv * 1.5 + vec2(t * 0.3, -t * 0.5));
    
    // Combine noise layers
    float n = (n1 + n2 * 0.5 + n3 * 0.25) / 1.75;
    
    // Light mode colors - soft warm grays with subtle blue hint
    vec3 color1 = vec3(0.96, 0.96, 0.97); // Almost white
    vec3 color2 = vec3(0.94, 0.94, 0.96); // Light gray with blue
    vec3 color3 = vec3(0.92, 0.93, 0.95); // Slightly deeper
    
    // Gradient based on position and noise
    vec3 color = mix(color1, color2, uv.y + n * 0.1);
    color = mix(color, color3, n * 0.15);
    
    // Subtle vignette
    float vignette = 1.0 - length(uv - 0.5) * 0.3;
    color *= vignette;
    
    gl_FragColor = vec4(color, 1.0);
  }
`

const fragmentShaderDark = `
  precision highp float;
  uniform float time;
  uniform vec2 resolution;
  
  // Smooth noise
  float noise(vec2 p) {
    return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
  }
  
  float smoothNoise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    
    float a = noise(i);
    float b = noise(i + vec2(1.0, 0.0));
    float c = noise(i + vec2(0.0, 1.0));
    float d = noise(i + vec2(1.0, 1.0));
    
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
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
    
    // Very slow time
    float t = time * 0.03;
    
    // Flowing noise
    float n = fbm(uv * 2.0 + vec2(t, t * 0.5));
    float n2 = fbm(uv * 3.0 - vec2(t * 0.7, t * 0.3));
    
    // Dark mode colors - deep zinc with subtle blue undertones
    vec3 color1 = vec3(0.035, 0.035, 0.043); // Near black
    vec3 color2 = vec3(0.055, 0.055, 0.067); // Dark zinc
    vec3 color3 = vec3(0.08, 0.08, 0.10);    // Slightly lighter
    
    // Subtle accent glow
    vec3 accentColor = vec3(0.15, 0.25, 0.45); // Deep blue
    
    // Build color from layers
    vec3 color = mix(color1, color2, n * 0.6);
    color = mix(color, color3, n2 * 0.3);
    
    // Subtle accent in corners
    float cornerGlow = smoothstep(0.7, 1.4, length(uv - vec2(0.0, 1.0)));
    cornerGlow += smoothstep(0.8, 1.5, length(uv - vec2(1.0, 0.0))) * 0.5;
    color = mix(color, color + accentColor * 0.08, (1.0 - cornerGlow) * n);
    
    // Subtle radial gradient from center
    float radial = 1.0 - length(uv - 0.5) * 0.4;
    color *= radial;
    
    gl_FragColor = vec4(color, 1.0);
  }
`

function createShader(gl: WebGLRenderingContext, type: number, source: string): WebGLShader | null {
  const shader = gl.createShader(type)
  if (!shader) return null
  
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error('Shader compile error:', gl.getShaderInfoLog(shader))
    gl.deleteShader(shader)
    return null
  }
  
  return shader
}

function createProgram(gl: WebGLRenderingContext, vertexShader: WebGLShader, fragmentShader: WebGLShader): WebGLProgram | null {
  const program = gl.createProgram()
  if (!program) return null
  
  gl.attachShader(program, vertexShader)
  gl.attachShader(program, fragmentShader)
  gl.linkProgram(program)
  
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error('Program link error:', gl.getProgramInfoLog(program))
    gl.deleteProgram(program)
    return null
  }
  
  return program
}

export function AmbientShader() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { resolvedTheme } = useTheme()
  const animationRef = useRef<number>()
  const glRef = useRef<WebGLRenderingContext | null>(null)
  const programRef = useRef<WebGLProgram | null>(null)
  
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const gl = canvas.getContext('webgl', { 
      alpha: false,
      antialias: false,
      preserveDrawingBuffer: false 
    })
    if (!gl) return
    
    glRef.current = gl
    
    // Create shaders
    const vs = createShader(gl, gl.VERTEX_SHADER, vertexShader)
    const fs = createShader(
      gl, 
      gl.FRAGMENT_SHADER, 
      resolvedTheme === 'dark' ? fragmentShaderDark : fragmentShaderLight
    )
    
    if (!vs || !fs) return
    
    const program = createProgram(gl, vs, fs)
    if (!program) return
    
    programRef.current = program
    gl.useProgram(program)
    
    // Setup geometry - full screen quad
    const vertices = new Float32Array([
      -1, -1,
       1, -1,
      -1,  1,
       1,  1,
    ])
    
    const buffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)
    
    const positionLocation = gl.getAttribLocation(program, 'position')
    gl.enableVertexAttribArray(positionLocation)
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0)
    
    // Get uniform locations
    const timeLocation = gl.getUniformLocation(program, 'time')
    const resolutionLocation = gl.getUniformLocation(program, 'resolution')
    
    // Resize handler
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 2)
      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr
      canvas.style.width = window.innerWidth + 'px'
      canvas.style.height = window.innerHeight + 'px'
      gl.viewport(0, 0, canvas.width, canvas.height)
    }
    
    resize()
    window.addEventListener('resize', resize)
    
    // Animation loop
    const startTime = Date.now()
    
    const render = () => {
      const time = (Date.now() - startTime) / 1000
      
      gl.uniform1f(timeLocation, time)
      gl.uniform2f(resolutionLocation, canvas.width, canvas.height)
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
      
      animationRef.current = requestAnimationFrame(render)
    }
    
    render()
    
    return () => {
      window.removeEventListener('resize', resize)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [resolvedTheme])
  
  return (
    <canvas
      ref={canvasRef}
      id="shader-canvas"
      className="fixed inset-0 -z-10"
    />
  )
}
