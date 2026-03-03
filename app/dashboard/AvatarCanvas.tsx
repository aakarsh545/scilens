'use client'

import { useEffect, useRef } from 'react'

const ELEMENTS = [
  { n: 1, s: 'H', shells: [1] },
  { n: 2, s: 'He', shells: [2] },
  { n: 3, s: 'Li', shells: [2, 1] },
  { n: 4, s: 'Be', shells: [2, 2] },
  { n: 5, s: 'B', shells: [2, 3] },
  { n: 6, s: 'C', shells: [2, 4] },
  { n: 7, s: 'N', shells: [2, 5] },
  { n: 8, s: 'O', shells: [2, 6] },
  { n: 9, s: 'F', shells: [2, 7] },
  { n: 10, s: 'Ne', shells: [2, 8] },
  { n: 11, s: 'Na', shells: [2, 8, 1] },
  { n: 12, s: 'Mg', shells: [2, 8, 2] },
  { n: 13, s: 'Al', shells: [2, 8, 3] },
  { n: 14, s: 'Si', shells: [2, 8, 4] },
  { n: 15, s: 'P', shells: [2, 8, 5] },
  { n: 16, s: 'S', shells: [2, 8, 6] },
  { n: 17, s: 'Cl', shells: [2, 8, 7] },
  { n: 18, s: 'Ar', shells: [2, 8, 8] },
  { n: 19, s: 'K', shells: [2, 8, 8, 1] },
  { n: 20, s: 'Ca', shells: [2, 8, 8, 2] },
  { n: 21, s: 'Sc', shells: [2, 8, 9, 2] },
  { n: 22, s: 'Ti', shells: [2, 8, 10, 2] },
  { n: 23, s: 'V', shells: [2, 8, 11, 2] },
  { n: 24, s: 'Cr', shells: [2, 8, 13, 1] },
  { n: 25, s: 'Mn', shells: [2, 8, 13, 2] },
  { n: 26, s: 'Fe', shells: [2, 8, 14, 2] },
  { n: 27, s: 'Co', shells: [2, 8, 15, 2] },
  { n: 28, s: 'Ni', shells: [2, 8, 16, 2] },
  { n: 29, s: 'Cu', shells: [2, 8, 18, 1] },
  { n: 30, s: 'Zn', shells: [2, 8, 18, 2] },
  { n: 31, s: 'Ga', shells: [2, 8, 18, 3] },
  { n: 32, s: 'Ge', shells: [2, 8, 18, 4] },
  { n: 33, s: 'As', shells: [2, 8, 18, 5] },
  { n: 34, s: 'Se', shells: [2, 8, 18, 6] },
  { n: 35, s: 'Br', shells: [2, 8, 18, 7] },
  { n: 36, s: 'Kr', shells: [2, 8, 18, 8] },
  { n: 37, s: 'Rb', shells: [2, 8, 18, 8, 1] },
  { n: 38, s: 'Sr', shells: [2, 8, 18, 8, 2] },
  { n: 39, s: 'Y', shells: [2, 8, 18, 9, 2] },
  { n: 40, s: 'Zr', shells: [2, 8, 18, 10, 2] },
  { n: 41, s: 'Nb', shells: [2, 8, 18, 12, 1] },
  { n: 42, s: 'Mo', shells: [2, 8, 18, 13, 1] },
  { n: 43, s: 'Tc', shells: [2, 8, 18, 13, 2] },
  { n: 44, s: 'Ru', shells: [2, 8, 18, 15, 1] },
  { n: 45, s: 'Rh', shells: [2, 8, 18, 16, 1] },
  { n: 46, s: 'Pd', shells: [2, 8, 18, 18] },
  { n: 47, s: 'Ag', shells: [2, 8, 18, 18, 1] },
  { n: 48, s: 'Cd', shells: [2, 8, 18, 18, 2] },
  { n: 49, s: 'In', shells: [2, 8, 18, 18, 3] },
  { n: 50, s: 'Sn', shells: [2, 8, 18, 18, 4] },
  { n: 51, s: 'Sb', shells: [2, 8, 18, 18, 5] },
  { n: 52, s: 'Te', shells: [2, 8, 18, 18, 6] },
  { n: 53, s: 'I', shells: [2, 8, 18, 18, 7] },
  { n: 54, s: 'Xe', shells: [2, 8, 18, 18, 8] },
  { n: 55, s: 'Cs', shells: [2, 8, 18, 18, 8, 1] },
  { n: 56, s: 'Ba', shells: [2, 8, 18, 18, 8, 2] },
  { n: 57, s: 'La', shells: [2, 8, 18, 18, 9, 2] },
  { n: 58, s: 'Ce', shells: [2, 8, 18, 19, 9, 2] },
  { n: 59, s: 'Pr', shells: [2, 8, 18, 21, 8, 2] },
  { n: 60, s: 'Nd', shells: [2, 8, 18, 22, 8, 2] },
  { n: 61, s: 'Pm', shells: [2, 8, 18, 23, 8, 2] },
  { n: 62, s: 'Sm', shells: [2, 8, 18, 24, 8, 2] },
  { n: 63, s: 'Eu', shells: [2, 8, 18, 25, 8, 2] },
  { n: 64, s: 'Gd', shells: [2, 8, 18, 25, 9, 2] },
  { n: 65, s: 'Tb', shells: [2, 8, 18, 27, 8, 2] },
  { n: 66, s: 'Dy', shells: [2, 8, 18, 28, 8, 2] },
  { n: 67, s: 'Ho', shells: [2, 8, 18, 29, 8, 2] },
  { n: 68, s: 'Er', shells: [2, 8, 18, 30, 8, 2] },
  { n: 69, s: 'Tm', shells: [2, 8, 18, 31, 8, 2] },
  { n: 70, s: 'Yb', shells: [2, 8, 18, 32, 8, 2] },
  { n: 71, s: 'Lu', shells: [2, 8, 18, 32, 9, 2] },
  { n: 72, s: 'Hf', shells: [2, 8, 18, 32, 10, 2] },
  { n: 73, s: 'Ta', shells: [2, 8, 18, 32, 11, 2] },
  { n: 74, s: 'W', shells: [2, 8, 18, 32, 12, 2] },
  { n: 75, s: 'Re', shells: [2, 8, 18, 32, 13, 2] },
  { n: 76, s: 'Os', shells: [2, 8, 18, 32, 14, 2] },
  { n: 77, s: 'Ir', shells: [2, 8, 18, 32, 15, 2] },
  { n: 78, s: 'Pt', shells: [2, 8, 18, 32, 17, 1] },
  { n: 79, s: 'Au', shells: [2, 8, 18, 32, 18, 1] },
  { n: 80, s: 'Hg', shells: [2, 8, 18, 32, 18, 2] },
  { n: 81, s: 'Tl', shells: [2, 8, 18, 32, 18, 3] },
  { n: 82, s: 'Pb', shells: [2, 8, 18, 32, 18, 4] },
  { n: 83, s: 'Bi', shells: [2, 8, 18, 32, 18, 5] },
  { n: 84, s: 'Po', shells: [2, 8, 18, 32, 18, 6] },
  { n: 85, s: 'At', shells: [2, 8, 18, 32, 18, 7] },
  { n: 86, s: 'Rn', shells: [2, 8, 18, 32, 18, 8] },
  { n: 87, s: 'Fr', shells: [2, 8, 18, 32, 18, 8, 1] },
  { n: 88, s: 'Ra', shells: [2, 8, 18, 32, 18, 8, 2] },
  { n: 89, s: 'Ac', shells: [2, 8, 18, 32, 18, 9, 2] },
  { n: 90, s: 'Th', shells: [2, 8, 18, 32, 18, 10, 2] },
  { n: 91, s: 'Pa', shells: [2, 8, 18, 32, 20, 9, 2] },
  { n: 92, s: 'U', shells: [2, 8, 18, 32, 21, 9, 2] },
  { n: 93, s: 'Np', shells: [2, 8, 18, 32, 22, 9, 2] },
  { n: 94, s: 'Pu', shells: [2, 8, 18, 32, 24, 8, 2] },
  { n: 95, s: 'Am', shells: [2, 8, 18, 32, 25, 8, 2] },
  { n: 96, s: 'Cm', shells: [2, 8, 18, 32, 25, 9, 2] },
  { n: 97, s: 'Bk', shells: [2, 8, 18, 32, 27, 8, 2] },
  { n: 98, s: 'Cf', shells: [2, 8, 18, 32, 28, 8, 2] },
  { n: 99, s: 'Es', shells: [2, 8, 18, 32, 29, 8, 2] },
  { n: 100, s: 'Fm', shells: [2, 8, 18, 32, 30, 8, 2] },
  { n: 101, s: 'Md', shells: [2, 8, 18, 32, 31, 8, 2] },
  { n: 102, s: 'No', shells: [2, 8, 18, 32, 32, 8, 2] },
  { n: 103, s: 'Lr', shells: [2, 8, 18, 32, 32, 8, 3] },
  { n: 104, s: 'Rf', shells: [2, 8, 18, 32, 32, 10, 2] },
  { n: 105, s: 'Db', shells: [2, 8, 18, 32, 32, 11, 2] },
  { n: 106, s: 'Sg', shells: [2, 8, 18, 32, 32, 12, 2] },
  { n: 107, s: 'Bh', shells: [2, 8, 18, 32, 32, 13, 2] },
  { n: 108, s: 'Hs', shells: [2, 8, 18, 32, 32, 14, 2] },
  { n: 109, s: 'Mt', shells: [2, 8, 18, 32, 32, 15, 2] },
  { n: 110, s: 'Ds', shells: [2, 8, 18, 32, 32, 16, 2] },
  { n: 111, s: 'Rg', shells: [2, 8, 18, 32, 32, 17, 2] },
  { n: 112, s: 'Cn', shells: [2, 8, 18, 32, 32, 18, 2] },
  { n: 113, s: 'Nh', shells: [2, 8, 18, 32, 32, 18, 3] },
  { n: 114, s: 'Fl', shells: [2, 8, 18, 32, 32, 18, 4] },
  { n: 115, s: 'Mc', shells: [2, 8, 18, 32, 32, 18, 5] },
  { n: 116, s: 'Lv', shells: [2, 8, 18, 32, 32, 18, 6] },
  { n: 117, s: 'Ts', shells: [2, 8, 18, 32, 32, 18, 7] },
  { n: 118, s: 'Og', shells: [2, 8, 18, 32, 32, 18, 8] },
]

interface AvatarCanvasProps {
  elementN: number
  color: string
  accessory: string
}

export default function AvatarCanvas({ elementN, color, accessory }: AvatarCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const el = ELEMENTS.find(e => e.n === elementN) ?? ELEMENTS[0]
    const shells = el.shells
    const W = 160, H = 160, CX = 80, CY = 80
    const NUCLEUS_R = 18

    // init angles
    const angles: number[] = []
    const speeds: number[] = []
    shells.forEach((count, si) => {
      const dir = si % 2 === 0 ? 1 : -1
      const speed = Math.max(0.004, 0.014 - si * 0.002) * dir
      for (let j = 0; j < count; j++) {
        angles.push((2 * Math.PI * j) / count)
        speeds.push(speed)
      }
    })

    function hexToRgb(hex: string) {
      return {
        r: parseInt(hex.slice(1, 3), 16),
        g: parseInt(hex.slice(3, 5), 16),
        b: parseInt(hex.slice(5, 7), 16)
      }
    }

    function getShellRadii(shells: number[]) {
      const maxR = W / 2 - 8
      const minR = NUCLEUS_R + 14
      const gap = shells.length > 1 ? (maxR - minR) / (shells.length - 1) : 0
      return shells.map((_, i) => minR + i * gap)
    }

    let animId: number

    function draw() {
      ctx.clearRect(0, 0, W, H)
      const { r, g, b } = hexToRgb(color)
      const radii = getShellRadii(shells)

      for (let i = 0; i < angles.length; i++) angles[i] += speeds[i]

      // orbit rings
      shells.forEach((_, si) => {
        ctx.beginPath()
        ctx.arc(CX, CY, radii[si], 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(${r},${g},${b},0.22)`
        ctx.lineWidth = 1.2
        ctx.stroke()
      })

      // nucleus glow
      const ng = ctx.createRadialGradient(CX, CY, 0, CX, CY, NUCLEUS_R)
      ng.addColorStop(0, `rgba(${r},${g},${b},1)`)
      ng.addColorStop(0.7, `rgba(${r},${g},${b},0.85)`)
      ng.addColorStop(1, `rgba(${r},${g},${b},0.3)`)
      ctx.beginPath()
      ctx.arc(CX, CY, NUCLEUS_R, 0, Math.PI * 2)
      ctx.fillStyle = ng
      ctx.fill()
      ctx.beginPath()
      ctx.arc(CX, CY, NUCLEUS_R + 5, 0, Math.PI * 2)
      ctx.strokeStyle = `rgba(${r},${g},${b},0.15)`
      ctx.lineWidth = 7
      ctx.stroke()

      // face - eyes
      [[-5, -1], [5, -1]].forEach(([ox, oy]) => {
        ctx.beginPath()
        ctx.arc(CX + ox, CY + oy, 2.8, 0, Math.PI * 2)
        ctx.fillStyle = 'white'
        ctx.fill()
        ctx.beginPath()
        ctx.arc(CX + ox + 0.4, CY + oy + 0.5, 1.5, 0, Math.PI * 2)
        ctx.fillStyle = '#1a1a2e'
        ctx.fill()
        ctx.beginPath()
        ctx.arc(CX + ox + 0.8, CY + oy - 0.3, 0.6, 0, Math.PI * 2)
        ctx.fillStyle = 'white'
        ctx.fill()
      })
      // smile
      ctx.beginPath()
      ctx.arc(CX, CY + 2, 5.5, 0.25, Math.PI - 0.25)
      ctx.strokeStyle = 'white'
      ctx.lineWidth = 1.7
      ctx.lineCap = 'round'
      ctx.stroke()

      // electrons
      let eIdx = 0
      shells.forEach((count, si) => {
        const R = radii[si]
        for (let j = 0; j < count; j++) {
          const a = angles[eIdx]
          const ex = CX + R * Math.cos(a)
          const ey = CY + R * Math.sin(a)
          const eg = ctx.createRadialGradient(ex, ey, 0, ex, ey, 7)
          eg.addColorStop(0, `rgba(${r},${g},${b},0.6)`)
          eg.addColorStop(1, `rgba(${r},${g},${b},0)`)
          ctx.beginPath()
          ctx.arc(ex, ey, 7, 0, Math.PI * 2)
          ctx.fillStyle = eg
          ctx.fill()
          ctx.beginPath()
          ctx.arc(ex, ey, 3.8, 0, Math.PI * 2)
          ctx.fillStyle = color
          ctx.fill()
          ctx.beginPath()
          ctx.arc(ex - 0.8, ey - 0.8, 1.2, 0, Math.PI * 2)
          ctx.fillStyle = 'rgba(255,255,255,0.55)'
          ctx.fill()
          eIdx++
        }
      })

      animId = requestAnimationFrame(draw)
    }

    animId = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(animId)
  }, [elementN, color, accessory])

  return <canvas ref={canvasRef} width={160} height={160} />
}
