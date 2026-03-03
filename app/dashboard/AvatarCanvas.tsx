'use client'

import { useEffect, useRef, useCallback } from 'react'

const ELEMENTS: Record<string, { symbol: string; name: string; atomicNumber: number; shells: number[] }> = {
  H: { symbol: 'H', name: 'Hydrogen', atomicNumber: 1, shells: [1] },
  He: { symbol: 'He', name: 'Helium', atomicNumber: 2, shells: [2] },
  Li: { symbol: 'Li', name: 'Lithium', atomicNumber: 3, shells: [2, 1] },
  Be: { symbol: 'Be', name: 'Beryllium', atomicNumber: 4, shells: [2, 2] },
  B: { symbol: 'B', name: 'Boron', atomicNumber: 5, shells: [2, 3] },
  C: { symbol: 'C', name: 'Carbon', atomicNumber: 6, shells: [2, 4] },
  N: { symbol: 'N', name: 'Nitrogen', atomicNumber: 7, shells: [2, 5] },
  O: { symbol: 'O', name: 'Oxygen', atomicNumber: 8, shells: [2, 6] },
  F: { symbol: 'F', name: 'Fluorine', atomicNumber: 9, shells: [2, 7] },
  Ne: { symbol: 'Ne', name: 'Neon', atomicNumber: 10, shells: [2, 8] },
  Na: { symbol: 'Na', name: 'Sodium', atomicNumber: 11, shells: [2, 8, 1] },
  Mg: { symbol: 'Mg', name: 'Magnesium', atomicNumber: 12, shells: [2, 8, 2] },
  Al: { symbol: 'Al', name: 'Aluminum', atomicNumber: 13, shells: [2, 8, 3] },
  Si: { symbol: 'Si', name: 'Silicon', atomicNumber: 14, shells: [2, 8, 4] },
  P: { symbol: 'P', name: 'Phosphorus', atomicNumber: 15, shells: [2, 8, 5] },
  S: { symbol: 'S', name: 'Sulfur', atomicNumber: 16, shells: [2, 8, 6] },
  Cl: { symbol: 'Cl', name: 'Chlorine', atomicNumber: 17, shells: [2, 8, 7] },
  Ar: { symbol: 'Ar', name: 'Argon', atomicNumber: 18, shells: [2, 8, 8] },
  K: { symbol: 'K', name: 'Potassium', atomicNumber: 19, shells: [2, 8, 8, 1] },
  Ca: { symbol: 'Ca', name: 'Calcium', atomicNumber: 20, shells: [2, 8, 8, 2] },
  Sc: { symbol: 'Sc', name: 'Scandium', atomicNumber: 21, shells: [2, 8, 9, 2] },
  Ti: { symbol: 'Ti', name: 'Titanium', atomicNumber: 22, shells: [2, 8, 10, 2] },
  V: { symbol: 'V', name: 'Vanadium', atomicNumber: 23, shells: [2, 8, 11, 2] },
  Cr: { symbol: 'Cr', name: 'Chromium', atomicNumber: 24, shells: [2, 8, 13, 1] },
  Mn: { symbol: 'Mn', name: 'Manganese', atomicNumber: 25, shells: [2, 8, 13, 2] },
  Fe: { symbol: 'Fe', name: 'Iron', atomicNumber: 26, shells: [2, 8, 14, 2] },
  Co: { symbol: 'Co', name: 'Cobalt', atomicNumber: 27, shells: [2, 8, 15, 2] },
  Ni: { symbol: 'Ni', name: 'Nickel', atomicNumber: 28, shells: [2, 8, 16, 2] },
  Cu: { symbol: 'Cu', name: 'Copper', atomicNumber: 29, shells: [2, 8, 18, 1] },
  Zn: { symbol: 'Zn', name: 'Zinc', atomicNumber: 30, shells: [2, 8, 18, 2] },
  Ga: { symbol: 'Ga', name: 'Gallium', atomicNumber: 31, shells: [2, 8, 18, 3] },
  Ge: { symbol: 'Ge', name: 'Germanium', atomicNumber: 32, shells: [2, 8, 18, 4] },
  As: { symbol: 'As', name: 'Arsenic', atomicNumber: 33, shells: [2, 8, 18, 5] },
  Se: { symbol: 'Se', name: 'Selenium', atomicNumber: 34, shells: [2, 8, 18, 6] },
  Br: { symbol: 'Br', name: 'Bromine', atomicNumber: 35, shells: [2, 8, 18, 7] },
  Kr: { symbol: 'Kr', name: 'Krypton', atomicNumber: 36, shells: [2, 8, 18, 8] },
  Rb: { symbol: 'Rb', name: 'Rubidium', atomicNumber: 37, shells: [2, 8, 18, 8, 1] },
  Sr: { symbol: 'Sr', name: 'Strontium', atomicNumber: 38, shells: [2, 8, 18, 8, 2] },
  Y: { symbol: 'Y', name: 'Yttrium', atomicNumber: 39, shells: [2, 8, 18, 8, 2, 9] },
  Zr: { symbol: 'Zr', name: 'Zirconium', atomicNumber: 40, shells: [2, 8, 18, 8, 2, 10] },
  Nb: { symbol: 'Nb', name: 'Niobium', atomicNumber: 41, shells: [2, 8, 18, 8, 2, 12] },
  Mo: { symbol: 'Mo', name: 'Molybdenum', atomicNumber: 42, shells: [2, 8, 18, 8, 2, 13] },
  Tc: { symbol: 'Tc', name: 'Technetium', atomicNumber: 43, shells: [2, 8, 18, 8, 2, 13] },
  Ru: { symbol: 'Ru', name: 'Ruthenium', atomicNumber: 44, shells: [2, 8, 18, 8, 2, 15] },
  Rh: { symbol: 'Rh', name: 'Rhodium', atomicNumber: 45, shells: [2, 8, 18, 8, 2, 16] },
  Pd: { symbol: 'Pd', name: 'Palladium', atomicNumber: 46, shells: [2, 8, 18, 8, 2, 18] },
  Ag: { symbol: 'Ag', name: 'Silver', atomicNumber: 47, shells: [2, 8, 18, 8, 2, 18, 1] },
  Cd: { symbol: 'Cd', name: 'Cadmium', atomicNumber: 48, shells: [2, 8, 18, 8, 2, 18, 2] },
  In: { symbol: 'In', name: 'Indium', atomicNumber: 49, shells: [2, 8, 18, 8, 2, 18, 3] },
  Sn: { symbol: 'Sn', name: 'Tin', atomicNumber: 50, shells: [2, 8, 18, 8, 2, 18, 4] },
  Sb: { symbol: 'Sb', name: 'Antimony', atomicNumber: 51, shells: [2, 8, 18, 8, 2, 18, 5] },
  Te: { symbol: 'Te', name: 'Tellurium', atomicNumber: 52, shells: [2, 8, 18, 8, 2, 18, 6] },
  I: { symbol: 'I', name: 'Iodine', atomicNumber: 53, shells: [2, 8, 18, 8, 2, 18, 7] },
  Xe: { symbol: 'Xe', name: 'Xenon', atomicNumber: 54, shells: [2, 8, 18, 8, 2, 18, 8] },
  Cs: { symbol: 'Cs', name: 'Cesium', atomicNumber: 55, shells: [2, 8, 18, 8, 2, 18, 8, 1] },
  Ba: { symbol: 'Ba', name: 'Barium', atomicNumber: 56, shells: [2, 8, 18, 8, 2, 18, 8, 2] },
  La: { symbol: 'La', name: 'Lanthanum', atomicNumber: 57, shells: [2, 8, 18, 8, 2, 18, 8, 2, 9] },
  Ce: { symbol: 'Ce', name: 'Cerium', atomicNumber: 58, shells: [2, 8, 18, 8, 2, 18, 8, 2, 19] },
  Pr: { symbol: 'Pr', name: 'Praseodymium', atomicNumber: 59, shells: [2, 8, 18, 8, 2, 18, 8, 2, 21] },
  Nd: { symbol: 'Nd', name: 'Neodymium', atomicNumber: 60, shells: [2, 8, 18, 8, 2, 18, 8, 2, 22] },
  Pm: { symbol: 'Pm', name: 'Promethium', atomicNumber: 61, shells: [2, 8, 18, 8, 2, 18, 8, 2, 23] },
  Sm: { symbol: 'Sm', name: 'Samarium', atomicNumber: 62, shells: [2, 8, 18, 8, 2, 18, 8, 2, 24] },
  Eu: { symbol: 'Eu', name: 'Europium', atomicNumber: 63, shells: [2, 8, 18, 8, 2, 18, 8, 2, 25] },
  Gd: { symbol: 'Gd', name: 'Gadolinium', atomicNumber: 64, shells: [2, 8, 18, 8, 2, 18, 8, 2, 25] },
  Tb: { symbol: 'Tb', name: 'Terbium', atomicNumber: 65, shells: [2, 8, 18, 8, 2, 18, 8, 2, 27] },
  Dy: { symbol: 'Dy', name: 'Dysprosium', atomicNumber: 66, shells: [2, 8, 18, 8, 2, 18, 8, 2, 28] },
  Ho: { symbol: 'Ho', name: 'Holmium', atomicNumber: 67, shells: [2, 8, 18, 8, 2, 18, 8, 2, 29] },
  Er: { symbol: 'Er', name: 'Erbium', atomicNumber: 68, shells: [2, 8, 18, 8, 2, 18, 8, 2, 30] },
  Tm: { symbol: 'Tm', name: 'Thulium', atomicNumber: 69, shells: [2, 8, 18, 8, 2, 18, 8, 2, 31] },
  Yb: { symbol: 'Yb', name: 'Ytterbium', atomicNumber: 70, shells: [2, 8, 18, 8, 2, 18, 8, 2, 32] },
  Lu: { symbol: 'Lu', name: 'Lutetium', atomicNumber: 71, shells: [2, 8, 18, 8, 2, 18, 8, 2, 32] },
  Hf: { symbol: 'Hf', name: 'Hafnium', atomicNumber: 72, shells: [2, 8, 18, 8, 2, 18, 8, 2, 32] },
  Ta: { symbol: 'Ta', name: 'Tantalum', atomicNumber: 73, shells: [2, 8, 18, 8, 2, 18, 8, 2, 32] },
  W: { symbol: 'W', name: 'Tungsten', atomicNumber: 74, shells: [2, 8, 18, 8, 2, 18, 8, 2, 32] },
  Re: { symbol: 'Re', name: 'Rhenium', atomicNumber: 75, shells: [2, 8, 18, 8, 2, 18, 8, 2, 32] },
  Os: { symbol: 'Os', name: 'Osmium', atomicNumber: 76, shells: [2, 8, 18, 8, 2, 18, 8, 2, 32] },
  Ir: { symbol: 'Ir', name: 'Iridium', atomicNumber: 77, shells: [2, 8, 18, 8, 2, 18, 8, 2, 32] },
  Pt: { symbol: 'Pt', name: 'Platinum', atomicNumber: 78, shells: [2, 8, 18, 8, 2, 18, 8, 2, 32] },
  Au: { symbol: 'Au', name: 'Gold', atomicNumber: 79, shells: [2, 8, 18, 8, 2, 18, 8, 2, 32] },
  Hg: { symbol: 'Hg', name: 'Mercury', atomicNumber: 80, shells: [2, 8, 18, 8, 2, 18, 8, 2, 32] },
  Tl: { symbol: 'Tl', name: 'Thallium', atomicNumber: 81, shells: [2, 8, 18, 8, 2, 18, 8, 2, 32] },
  Pb: { symbol: 'Pb', name: 'Lead', atomicNumber: 82, shells: [2, 8, 18, 8, 2, 18, 8, 2, 32] },
  Bi: { symbol: 'Bi', name: 'Bismuth', atomicNumber: 83, shells: [2, 8, 18, 8, 2, 18, 8, 2, 32] },
  Po: { symbol: 'Po', name: 'Polonium', atomicNumber: 84, shells: [2, 8, 18, 8, 2, 18, 8, 2, 32] },
  At: { symbol: 'At', name: 'Astatine', atomicNumber: 85, shells: [2, 8, 18, 8, 2, 18, 8, 2, 32] },
  Rn: { symbol: 'Rn', name: 'Radon', atomicNumber: 86, shells: [2, 8, 18, 8, 2, 18, 8, 2, 32] },
  Fr: { symbol: 'Fr', name: 'Francium', atomicNumber: 87, shells: [2, 8, 18, 8, 2, 18, 8, 2, 32, 1] },
  Ra: { symbol: 'Ra', name: 'Radium', atomicNumber: 88, shells: [2, 8, 18, 8, 2, 18, 8, 2, 32, 2] },
  Ac: { symbol: 'Ac', name: 'Actinium', atomicNumber: 89, shells: [2, 8, 18, 8, 2, 18, 8, 2, 32, 2] },
  Th: { symbol: 'Th', name: 'Thorium', atomicNumber: 90, shells: [2, 8, 18, 8, 2, 18, 8, 2, 32, 2] },
  Pa: { symbol: 'Pa', name: 'Protactinium', atomicNumber: 91, shells: [2, 8, 18, 8, 2, 18, 8, 2, 32, 2] },
  U: { symbol: 'U', name: 'Uranium', atomicNumber: 92, shells: [2, 8, 18, 8, 2, 18, 8, 2, 32, 2] },
  Np: { symbol: 'Np', name: 'Neptunium', atomicNumber: 93, shells: [2, 8, 18, 8, 2, 18, 8, 2, 32, 2] },
  Pu: { symbol: 'Pu', name: 'Plutonium', atomicNumber: 94, shells: [2, 8, 18, 8, 2, 18, 8, 2, 32, 2] },
  Am: { symbol: 'Am', name: 'Americium', atomicNumber: 95, shells: [2, 8, 18, 8, 2, 18, 8, 2, 32, 2] },
  Cm: { symbol: 'Cm', name: 'Curium', atomicNumber: 96, shells: [2, 8, 18, 8, 2, 18, 8, 2, 32, 2] },
  Bk: { symbol: 'Bk', name: 'Berkelium', atomicNumber: 97, shells: [2, 8, 18, 8, 2, 18, 8, 2, 32, 2] },
  Cf: { symbol: 'Cf', name: 'Californium', atomicNumber: 98, shells: [2, 8, 18, 8, 2, 18, 8, 2, 32, 2] },
  Es: { symbol: 'Es', name: 'Einsteinium', atomicNumber: 99, shells: [2, 8, 18, 8, 2, 18, 8, 2, 32, 2] },
  Fm: { symbol: 'Fm', name: 'Fermium', atomicNumber: 100, shells: [2, 8, 18, 8, 2, 18, 8, 2, 32, 2] },
  Md: { symbol: 'Md', name: 'Mendelevium', atomicNumber: 101, shells: [2, 8, 18, 8, 2, 18, 8, 2, 32, 2] },
  No: { symbol: 'No', name: 'Nobelium', atomicNumber: 102, shells: [2, 8, 18, 8, 2, 18, 8, 2, 32, 2] },
  Lr: { symbol: 'Lr', name: 'Lawrencium', atomicNumber: 103, shells: [2, 8, 18, 8, 2, 18, 8, 2, 32, 2] },
  Rf: { symbol: 'Rf', name: 'Rutherfordium', atomicNumber: 104, shells: [2, 8, 18, 8, 2, 18, 8, 2, 32, 2] },
  Db: { symbol: 'Db', name: 'Dubnium', atomicNumber: 105, shells: [2, 8, 18, 8, 2, 18, 8, 2, 32, 2] },
  Sg: { symbol: 'Sg', name: 'Seaborgium', atomicNumber: 106, shells: [2, 8, 18, 8, 2, 18, 8, 2, 32, 2] },
  Bh: { symbol: 'Bh', name: 'Bohrium', atomicNumber: 107, shells: [2, 8, 18, 8, 2, 18, 8, 2, 32, 2] },
  Hs: { symbol: 'Hs', name: 'Hassium', atomicNumber: 108, shells: [2, 8, 18, 8, 2, 18, 8, 2, 32, 2] },
  Mt: { symbol: 'Mt', name: 'Meitnerium', atomicNumber: 109, shells: [2, 8, 18, 8, 2, 18, 8, 2, 32, 2] },
  Ds: { symbol: 'Ds', name: 'Darmstadtium', atomicNumber: 110, shells: [2, 8, 18, 8, 2, 18, 8, 2, 32, 2] },
  Rg: { symbol: 'Rg', name: 'Roentgenium', atomicNumber: 111, shells: [2, 8, 18, 8, 2, 18, 8, 2, 32, 2] },
  Cn: { symbol: 'Cn', name: 'Copernicium', atomicNumber: 112, shells: [2, 8, 18, 8, 2, 18, 8, 2, 32, 2] },
  Nh: { symbol: 'Nh', name: 'Nihonium', atomicNumber: 113, shells: [2, 8, 18, 8, 2, 18, 8, 2, 32, 2] },
  Fl: { symbol: 'Fl', name: 'Flerovium', atomicNumber: 114, shells: [2, 8, 18, 8, 2, 18, 8, 2, 32, 2] },
  Mc: { symbol: 'Mc', name: 'Moscovium', atomicNumber: 115, shells: [2, 8, 18, 8, 2, 18, 8, 2, 32, 2] },
  Lv: { symbol: 'Lv', name: 'Livermorium', atomicNumber: 116, shells: [2, 8, 18, 8, 2, 18, 8, 2, 32, 2] },
  Ts: { symbol: 'Ts', name: 'Tennessine', atomicNumber: 117, shells: [2, 8, 18, 8, 2, 18, 8, 2, 32, 2] },
  Og: { symbol: 'Og', name: 'Oganesson', atomicNumber: 118, shells: [2, 8, 18, 8, 2, 18, 8, 2, 32, 2] },
}

interface AvatarCanvasProps {
  elementN: number
  color: string
  accessory: string
}

export default function AvatarCanvas({ elementN, color, accessory }: AvatarCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const ELEMENT_LIST = Object.values(ELEMENTS)
  const currentElement = ELEMENT_LIST.find((e) => e.atomicNumber === elementN) || ELEMENT_LIST[0]

  // Draw accessory function
  function drawAccessory(ctx: CanvasRenderingContext2D, acc: string, CX: number, CY: number, nucleusR: number) {
    ctx.save()

    switch (acc) {
      case 'glasses': {
        const eyeY = CY - nucleusR * 0.15
        const lensR = nucleusR * 0.28
        const lensOffset = nucleusR * 0.38
        ctx.strokeStyle = 'rgba(255,255,255,0.95)'
        ctx.lineWidth = 1.5
        ctx.fillStyle = 'rgba(255,255,255,0.08)'
        ctx.beginPath()
        ctx.arc(CX - lensOffset, eyeY, lensR, 0, Math.PI * 2)
        ctx.fill()
        ctx.stroke()
        ctx.beginPath()
        ctx.arc(CX + lensOffset, eyeY, lensR, 0, Math.PI * 2)
        ctx.fill()
        ctx.stroke()
        ctx.beginPath()
        ctx.moveTo(CX - lensOffset + lensR, eyeY)
        ctx.lineTo(CX + lensOffset - lensR, eyeY)
        ctx.stroke()
        ctx.beginPath()
        ctx.moveTo(CX - lensOffset - lensR, eyeY)
        ctx.lineTo(CX - nucleusR * 0.95, eyeY - 2)
        ctx.stroke()
        ctx.beginPath()
        ctx.moveTo(CX + lensOffset + lensR, eyeY)
        ctx.lineTo(CX + nucleusR * 0.95, eyeY - 2)
        ctx.stroke()
        break
      }
      case 'hat': {
        const capY = CY - nucleusR * 0.85
        const capW = nucleusR * 1.4
        const capH = nucleusR * 0.7
        const brimW = nucleusR * 1.8
        const brimH = nucleusR * 0.2
        ctx.fillStyle = 'rgba(255,255,255,0.95)'
        ctx.fillRect(CX - capW / 2, capY - capH, capW, capH)
        ctx.fillRect(CX - brimW / 2, capY - brimH, brimW, brimH)
        ctx.fillStyle = color
        ctx.fillRect(CX - capW / 2, capY - capH, capW, nucleusR * 0.15)
        break
      }
      case 'crown': {
        const crownBase = CY - nucleusR * 0.8
        const crownH = nucleusR * 0.75
        const crownW = nucleusR * 1.3
        ctx.fillStyle = '#ffd700'
        ctx.beginPath()
        ctx.moveTo(CX - crownW / 2, crownBase)
        ctx.lineTo(CX - crownW / 2, crownBase - crownH * 0.6)
        ctx.lineTo(CX - crownW / 4, crownBase - crownH * 0.3)
        ctx.lineTo(CX, crownBase - crownH)
        ctx.lineTo(CX + crownW / 4, crownBase - crownH * 0.3)
        ctx.lineTo(CX + crownW / 2, crownBase - crownH * 0.6)
        ctx.lineTo(CX + crownW / 2, crownBase)
        ctx.closePath()
        ctx.fill()
        ctx.fillStyle = 'white'
        ctx.beginPath()
        ctx.arc(CX, crownBase - crownH, 2.5, 0, Math.PI * 2)
        ctx.fill()
        ctx.fillStyle = '#ff6b6b'
        ctx.beginPath()
        ctx.arc(CX - crownW / 4, crownBase - crownH * 0.3, 2, 0, Math.PI * 2)
        ctx.fill()
        ctx.fillStyle = '#a78bfa'
        ctx.beginPath()
        ctx.arc(CX + crownW / 4, crownBase - crownH * 0.3, 2, 0, Math.PI * 2)
        ctx.fill()
        break
      }
      case 'lab': {
        const shirtY = CY + nucleusR * 0.7
        const shirtW = nucleusR * 1.6
        const shirtH = nucleusR * 1.1
        ctx.fillStyle = 'rgba(255,255,255,0.9)'
        ctx.beginPath()
        ctx.moveTo(CX - shirtW / 2, shirtY)
        ctx.lineTo(CX - shirtW / 2, shirtY + shirtH)
        ctx.lineTo(CX + shirtW / 2, shirtY + shirtH)
        ctx.lineTo(CX + shirtW / 2, shirtY)
        ctx.lineTo(CX + shirtW * 0.15, shirtY)
        ctx.lineTo(CX, shirtY + shirtH * 0.3)
        ctx.lineTo(CX - shirtW * 0.15, shirtY)
        ctx.closePath()
        ctx.fill()
        ctx.fillStyle = 'rgba(200,220,255,0.6)'
        ctx.beginPath()
        ctx.moveTo(CX, shirtY + shirtH * 0.3)
        ctx.lineTo(CX - shirtW * 0.15, shirtY)
        ctx.lineTo(CX - shirtW * 0.35, shirtY + shirtH * 0.4)
        ctx.closePath()
        ctx.fill()
        ctx.beginPath()
        ctx.moveTo(CX, shirtY + shirtH * 0.3)
        ctx.lineTo(CX + shirtW * 0.15, shirtY)
        ctx.lineTo(CX + shirtW * 0.35, shirtY + shirtH * 0.4)
        ctx.closePath()
        ctx.fill()
        break
      }
      case 'headphones': {
        const arcR = nucleusR * 1.05
        const cupW = nucleusR * 0.32
        const cupH = nucleusR * 0.45
        const cupY = CY - nucleusR * 0.1
        ctx.strokeStyle = 'rgba(40,40,40,0.95)'
        ctx.lineWidth = nucleusR * 0.22
        ctx.lineCap = 'round'
        ctx.beginPath()
        ctx.arc(CX, CY, arcR, Math.PI + 0.55, -0.55)
        ctx.stroke()
        ctx.fillStyle = 'rgba(50,50,50,0.95)'
        ctx.beginPath()
        ctx.ellipse(CX - arcR, cupY, cupW, cupH, 0, 0, Math.PI * 2)
        ctx.fill()
        ctx.fillStyle = 'rgba(80,80,80,0.8)'
        ctx.beginPath()
        ctx.ellipse(CX - arcR, cupY, cupW * 0.6, cupH * 0.6, 0, 0, Math.PI * 2)
        ctx.fill()
        ctx.fillStyle = 'rgba(50,50,50,0.95)'
        ctx.beginPath()
        ctx.ellipse(CX + arcR, cupY, cupW, cupH, 0, 0, Math.PI * 2)
        ctx.fill()
        ctx.fillStyle = 'rgba(80,80,80,0.8)'
        ctx.beginPath()
        ctx.ellipse(CX + arcR, cupY, cupW * 0.6, cupH * 0.6, 0, 0, Math.PI * 2)
        ctx.fill()
        break
      }
      case 'star': {
        const starCX = CX
        const starCY = CY - nucleusR * 1.15
        const outerR = nucleusR * 0.45
        const innerR = nucleusR * 0.2
        ctx.fillStyle = '#ffd700'
        ctx.beginPath()
        for (let i = 0; i < 10; i++) {
          const angle = (i * Math.PI) / 5 - Math.PI / 2
          const r = i % 2 === 0 ? outerR : innerR
          if (i === 0) ctx.moveTo(starCX + r * Math.cos(angle), starCY + r * Math.sin(angle))
          else ctx.lineTo(starCX + r * Math.cos(angle), starCY + r * Math.sin(angle))
        }
        ctx.closePath()
        ctx.fill()
        ctx.fillStyle = 'rgba(255,255,255,0.6)'
        ctx.beginPath()
        ctx.arc(starCX - outerR * 0.2, starCY - outerR * 0.2, outerR * 0.2, 0, Math.PI * 2)
        ctx.fill()
        break
      }
      case 'lightning': {
        const boltX = CX + nucleusR * 0.55
        const boltY = CY - nucleusR * 1.3
        const boltH = nucleusR * 0.9
        const boltW = nucleusR * 0.5
        ctx.fillStyle = '#fbbf24'
        ctx.beginPath()
        ctx.moveTo(boltX + boltW * 0.3, boltY)
        ctx.lineTo(boltX - boltW * 0.1, boltY + boltH * 0.45)
        ctx.lineTo(boltX + boltW * 0.15, boltY + boltH * 0.45)
        ctx.lineTo(boltX - boltW * 0.3, boltY + boltH)
        ctx.lineTo(boltX + boltW * 0.5, boltY + boltH * 0.5)
        ctx.lineTo(boltX + boltW * 0.2, boltY + boltH * 0.5)
        ctx.closePath()
        ctx.fill()
        break
      }
    }
    ctx.restore()
  }

  // Atom animation
  const drawAtom = useCallback((timestamp: number) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height
    const centerX = width / 2
    const centerY = height / 2

    ctx.clearRect(0, 0, width, height)

    const shells = currentElement.shells
    const numShells = shells.length
    const nucleusRadius = 18
    const maxRadius = Math.min(centerX, centerY) - 8

    const shellRadii: number[] = []
    for (let i = 0; i < numShells; i++) {
      if (numShells === 1) {
        shellRadii.push(38)
      } else {
        const minR = nucleusRadius + 12
        const maxR = maxRadius
        const step = (maxR - minR) / (numShells - 1)
        shellRadii.push(minR + step * i)
      }
    }

    // Draw orbits
    ctx.lineWidth = 1
    for (let i = 0; i < numShells; i++) {
      ctx.beginPath()
      ctx.arc(centerX, centerY, shellRadii[i], 0, Math.PI * 2)
      ctx.strokeStyle = `${color}40`
      ctx.stroke()
    }

    const baseSpeeds = shellRadii.map((r, i) => {
      const direction = i % 2 === 0 ? 1 : -1
      return direction * (1 / (r * 0.02)) * (i * 0.3 + 0.7)
    })

    const electronRadius = 3.5
    for (let shellIdx = 0; shellIdx < numShells; shellIdx++) {
      const numElectrons = shells[shellIdx]
      const radius = shellRadii[shellIdx]
      const speed = baseSpeeds[shellIdx]

      for (let e = 0; e < numElectrons; e++) {
        const angle = (timestamp / 1000) * speed + (e * 2 * Math.PI) / numElectrons
        const x = centerX + Math.cos(angle) * radius
        const y = centerY + Math.sin(angle) * radius

        const gradient = ctx.createRadialGradient(x, y, 0, x, y, electronRadius * 2)
        gradient.addColorStop(0, color)
        gradient.addColorStop(1, 'transparent')
        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(x, y, electronRadius * 2, 0, Math.PI * 2)
        ctx.fill()

        ctx.fillStyle = '#ffffff'
        ctx.beginPath()
        ctx.arc(x, y, electronRadius, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    const nucleusGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, nucleusRadius * 2)
    nucleusGradient.addColorStop(0, color)
    nucleusGradient.addColorStop(0.5, color + 'cc')
    nucleusGradient.addColorStop(1, 'transparent')
    ctx.fillStyle = nucleusGradient
    ctx.beginPath()
    ctx.arc(centerX, centerY, nucleusRadius * 2, 0, Math.PI * 2)
    ctx.fill()

    ctx.fillStyle = color
    ctx.beginPath()
    ctx.arc(centerX, centerY, nucleusRadius, 0, Math.PI * 2)
    ctx.fill()

    // Face
    const eyeOffsetX = 6
    const eyeOffsetY = -2.5
    const eyeSize = 3.5

    ctx.fillStyle = '#ffffff'
    ctx.beginPath()
    ctx.arc(centerX - eyeOffsetX, centerY + eyeOffsetY, eyeSize, 0, Math.PI * 2)
    ctx.fill()
    ctx.beginPath()
    ctx.arc(centerX + eyeOffsetX, centerY + eyeOffsetY, eyeSize, 0, Math.PI * 2)
    ctx.fill()

    ctx.fillStyle = '#1a1a1a'
    ctx.beginPath()
    ctx.arc(centerX - eyeOffsetX + 1, centerY + eyeOffsetY, 1.5, 0, Math.PI * 2)
    ctx.fill()
    ctx.beginPath()
    ctx.arc(centerX + eyeOffsetX + 1, centerY + eyeOffsetY, 1.5, 0, Math.PI * 2)
    ctx.fill()

    ctx.fillStyle = '#ffffff'
    ctx.beginPath()
    ctx.arc(centerX - eyeOffsetX, centerY + eyeOffsetY - 1, 1, 0, Math.PI * 2)
    ctx.fill()
    ctx.beginPath()
    ctx.arc(centerX + eyeOffsetX, centerY + eyeOffsetY - 1, 1, 0, Math.PI * 2)
    ctx.fill()

    ctx.strokeStyle = '#1a1a1a'
    ctx.lineWidth = 1.8
    ctx.lineCap = 'round'
    ctx.beginPath()
    ctx.arc(centerX, centerY + 2, 5, 0.2 * Math.PI, 0.8 * Math.PI)
    ctx.stroke()

    // Draw accessory
    if (accessory !== 'None') {
      drawAccessory(ctx, accessory, centerX, centerY, nucleusRadius)
    }
  }, [currentElement, color, accessory])

  useEffect(() => {
    const animationId = requestAnimationFrame(drawAtom)
    return () => cancelAnimationFrame(animationId)
  }, [drawAtom])

  return (
    <canvas
      ref={canvasRef}
      width={160}
      height={160}
      className="rounded-lg"
    />
  )
}
