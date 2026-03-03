'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { useRouter } from 'next/navigation'

export const dynamic = 'force-dynamic'

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
  Y: { symbol: 'Y', name: 'Yttrium', atomicNumber: 39, shells: [2, 8, 18, 9, 2] },
  Zr: { symbol: 'Zr', name: 'Zirconium', atomicNumber: 40, shells: [2, 8, 18, 10, 2] },
  Nb: { symbol: 'Nb', name: 'Niobium', atomicNumber: 41, shells: [2, 8, 18, 12, 1] },
  Mo: { symbol: 'Mo', name: 'Molybdenum', atomicNumber: 42, shells: [2, 8, 18, 13, 1] },
  Tc: { symbol: 'Tc', name: 'Technetium', atomicNumber: 43, shells: [2, 8, 18, 13, 2] },
  Ru: { symbol: 'Ru', name: 'Ruthenium', atomicNumber: 44, shells: [2, 8, 18, 15, 1] },
  Rh: { symbol: 'Rh', name: 'Rhodium', atomicNumber: 45, shells: [2, 8, 18, 16, 1] },
  Pd: { symbol: 'Pd', name: 'Palladium', atomicNumber: 46, shells: [2, 8, 18, 18] },
  Ag: { symbol: 'Ag', name: 'Silver', atomicNumber: 47, shells: [2, 8, 18, 18, 1] },
  Cd: { symbol: 'Cd', name: 'Cadmium', atomicNumber: 48, shells: [2, 8, 18, 18, 2] },
  In: { symbol: 'In', name: 'Indium', atomicNumber: 49, shells: [2, 8, 18, 18, 3] },
  Sn: { symbol: 'Sn', name: 'Tin', atomicNumber: 50, shells: [2, 8, 18, 18, 4] },
  Sb: { symbol: 'Sb', name: 'Antimony', atomicNumber: 51, shells: [2, 8, 18, 18, 5] },
  Te: { symbol: 'Te', name: 'Tellurium', atomicNumber: 52, shells: [2, 8, 18, 18, 6] },
  I: { symbol: 'I', name: 'Iodine', atomicNumber: 53, shells: [2, 8, 18, 18, 7] },
  Xe: { symbol: 'Xe', name: 'Xenon', atomicNumber: 54, shells: [2, 8, 18, 18, 8] },
  Cs: { symbol: 'Cs', name: 'Cesium', atomicNumber: 55, shells: [2, 8, 18, 18, 8, 1] },
  Ba: { symbol: 'Ba', name: 'Barium', atomicNumber: 56, shells: [2, 8, 18, 18, 8, 2] },
  La: { symbol: 'La', name: 'Lanthanum', atomicNumber: 57, shells: [2, 8, 18, 18, 9, 2] },
  Ce: { symbol: 'Ce', name: 'Cerium', atomicNumber: 58, shells: [2, 8, 18, 19, 9, 2] },
  Pr: { symbol: 'Pr', name: 'Praseodymium', atomicNumber: 59, shells: [2, 8, 18, 21, 8, 2] },
  Nd: { symbol: 'Nd', name: 'Neodymium', atomicNumber: 60, shells: [2, 8, 18, 22, 8, 2] },
  Pm: { symbol: 'Pm', name: 'Promethium', atomicNumber: 61, shells: [2, 8, 18, 23, 8, 2] },
  Sm: { symbol: 'Sm', name: 'Samarium', atomicNumber: 62, shells: [2, 8, 18, 24, 8, 2] },
  Eu: { symbol: 'Eu', name: 'Europium', atomicNumber: 63, shells: [2, 8, 18, 25, 8, 2] },
  Gd: { symbol: 'Gd', name: 'Gadolinium', atomicNumber: 64, shells: [2, 8, 18, 25, 9, 2] },
  Tb: { symbol: 'Tb', name: 'Terbium', atomicNumber: 65, shells: [2, 8, 18, 27, 8, 2] },
  Dy: { symbol: 'Dy', name: 'Dysprosium', atomicNumber: 66, shells: [2, 8, 18, 28, 8, 2] },
  Ho: { symbol: 'Ho', name: 'Holmium', atomicNumber: 67, shells: [2, 8, 18, 29, 8, 2] },
  Er: { symbol: 'Er', name: 'Erbium', atomicNumber: 68, shells: [2, 8, 18, 30, 8, 2] },
  Tm: { symbol: 'Tm', name: 'Thulium', atomicNumber: 69, shells: [2, 8, 18, 31, 8, 2] },
  Yb: { symbol: 'Yb', name: 'Ytterbium', atomicNumber: 70, shells: [2, 8, 18, 32, 8, 2] },
  Lu: { symbol: 'Lu', name: 'Lutetium', atomicNumber: 71, shells: [2, 8, 18, 32, 9, 2] },
  Hf: { symbol: 'Hf', name: 'Hafnium', atomicNumber: 72, shells: [2, 8, 18, 32, 10, 2] },
  Ta: { symbol: 'Ta', name: 'Tantalum', atomicNumber: 73, shells: [2, 8, 18, 32, 11, 2] },
  W: { symbol: 'W', name: 'Tungsten', atomicNumber: 74, shells: [2, 8, 18, 32, 12, 2] },
  Re: { symbol: 'Re', name: 'Rhenium', atomicNumber: 75, shells: [2, 8, 18, 32, 13, 2] },
  Os: { symbol: 'Os', name: 'Osmium', atomicNumber: 76, shells: [2, 8, 18, 32, 14, 2] },
  Ir: { symbol: 'Ir', name: 'Iridium', atomicNumber: 77, shells: [2, 8, 18, 32, 15, 2] },
  Pt: { symbol: 'Pt', name: 'Platinum', atomicNumber: 78, shells: [2, 8, 18, 32, 17, 1] },
  Au: { symbol: 'Au', name: 'Gold', atomicNumber: 79, shells: [2, 8, 18, 32, 18, 1] },
  Hg: { symbol: 'Hg', name: 'Mercury', atomicNumber: 80, shells: [2, 8, 18, 32, 18, 2] },
  Tl: { symbol: 'Tl', name: 'Thallium', atomicNumber: 81, shells: [2, 8, 18, 32, 18, 3] },
  Pb: { symbol: 'Pb', name: 'Lead', atomicNumber: 82, shells: [2, 8, 18, 32, 18, 4] },
  Bi: { symbol: 'Bi', name: 'Bismuth', atomicNumber: 83, shells: [2, 8, 18, 32, 18, 5] },
  Po: { symbol: 'Po', name: 'Polonium', atomicNumber: 84, shells: [2, 8, 18, 32, 18, 6] },
  At: { symbol: 'At', name: 'Astatine', atomicNumber: 85, shells: [2, 8, 18, 32, 18, 7] },
  Rn: { symbol: 'Rn', name: 'Radon', atomicNumber: 86, shells: [2, 8, 18, 32, 18, 8] },
  Fr: { symbol: 'Fr', name: 'Francium', atomicNumber: 87, shells: [2, 8, 18, 32, 18, 8, 1] },
  Ra: { symbol: 'Ra', name: 'Radium', atomicNumber: 88, shells: [2, 8, 18, 32, 18, 8, 2] },
  Ac: { symbol: 'Ac', name: 'Actinium', atomicNumber: 89, shells: [2, 8, 18, 32, 18, 9, 2] },
  Th: { symbol: 'Th', name: 'Thorium', atomicNumber: 90, shells: [2, 8, 18, 32, 18, 10, 2] },
  Pa: { symbol: 'Pa', name: 'Protactinium', atomicNumber: 91, shells: [2, 8, 18, 32, 20, 9, 2] },
  U: { symbol: 'U', name: 'Uranium', atomicNumber: 92, shells: [2, 8, 18, 32, 21, 9, 2] },
  Np: { symbol: 'Np', name: 'Neptunium', atomicNumber: 93, shells: [2, 8, 18, 32, 22, 9, 2] },
  Pu: { symbol: 'Pu', name: 'Plutonium', atomicNumber: 94, shells: [2, 8, 18, 32, 24, 8, 2] },
  Am: { symbol: 'Am', name: 'Americium', atomicNumber: 95, shells: [2, 8, 18, 32, 25, 8, 2] },
  Cm: { symbol: 'Cm', name: 'Curium', atomicNumber: 96, shells: [2, 8, 18, 32, 25, 9, 2] },
  Bk: { symbol: 'Bk', name: 'Berkelium', atomicNumber: 97, shells: [2, 8, 18, 32, 27, 8, 2] },
  Cf: { symbol: 'Cf', name: 'Californium', atomicNumber: 98, shells: [2, 8, 18, 32, 28, 8, 2] },
  Es: { symbol: 'Es', name: 'Einsteinium', atomicNumber: 99, shells: [2, 8, 18, 32, 29, 8, 2] },
  Fm: { symbol: 'Fm', name: 'Fermium', atomicNumber: 100, shells: [2, 8, 18, 32, 30, 8, 2] },
  Md: { symbol: 'Md', name: 'Mendelevium', atomicNumber: 101, shells: [2, 8, 18, 32, 31, 8, 2] },
  No: { symbol: 'No', name: 'Nobelium', atomicNumber: 102, shells: [2, 8, 18, 32, 32, 8, 2] },
  Lr: { symbol: 'Lr', name: 'Lawrencium', atomicNumber: 103, shells: [2, 8, 18, 32, 32, 8, 3] },
  Rf: { symbol: 'Rf', name: 'Rutherfordium', atomicNumber: 104, shells: [2, 8, 18, 32, 32, 10, 2] },
  Db: { symbol: 'Db', name: 'Dubnium', atomicNumber: 105, shells: [2, 8, 18, 32, 32, 11, 2] },
  Sg: { symbol: 'Sg', name: 'Seaborgium', atomicNumber: 106, shells: [2, 8, 18, 32, 32, 12, 2] },
  Bh: { symbol: 'Bh', name: 'Bohrium', atomicNumber: 107, shells: [2, 8, 18, 32, 32, 13, 2] },
  Hs: { symbol: 'Hs', name: 'Hassium', atomicNumber: 108, shells: [2, 8, 18, 32, 32, 14, 2] },
  Mt: { symbol: 'Mt', name: 'Meitnerium', atomicNumber: 109, shells: [2, 8, 18, 32, 32, 15, 2] },
  Ds: { symbol: 'Ds', name: 'Darmstadtium', atomicNumber: 110, shells: [2, 8, 18, 32, 32, 16, 2] },
  Rg: { symbol: 'Rg', name: 'Roentgenium', atomicNumber: 111, shells: [2, 8, 18, 32, 32, 17, 2] },
  Cn: { symbol: 'Cn', name: 'Copernicium', atomicNumber: 112, shells: [2, 8, 18, 32, 32, 18, 2] },
  Nh: { symbol: 'Nh', name: 'Nihonium', atomicNumber: 113, shells: [2, 8, 18, 32, 32, 18, 3] },
  Fl: { symbol: 'Fl', name: 'Flerovium', atomicNumber: 114, shells: [2, 8, 18, 32, 32, 18, 4] },
  Mc: { symbol: 'Mc', name: 'Moscovium', atomicNumber: 115, shells: [2, 8, 18, 32, 32, 18, 5] },
  Lv: { symbol: 'Lv', name: 'Livermorium', atomicNumber: 116, shells: [2, 8, 18, 32, 32, 18, 6] },
  Ts: { symbol: 'Ts', name: 'Tennessine', atomicNumber: 117, shells: [2, 8, 18, 32, 32, 18, 7] },
  Og: { symbol: 'Og', name: 'Oganesson', atomicNumber: 118, shells: [2, 8, 18, 32, 32, 18, 8] },
}

const COLORS = [
  '#ef4444', // red
  '#f97316', // orange
  '#eab308', // yellow
  '#22c55e', // green
  '#06b6d4', // cyan
  '#3b82f6', // blue
  '#8b5cf6', // violet
  '#ec4899', // pink
]

const ACCESSORIES = ['None', 'Shades', 'Grad Cap', 'Crown', 'Lab Coat', 'Headphones', 'Star', 'Lightning']

const GRADE_OPTIONS = [
  { id: 'middle', label: 'Middle School', sublabel: 'Grade 6-8' },
  { id: 'high', label: 'High School', sublabel: 'Grade 9-10' },
  { id: 'senior', label: 'Senior High', sublabel: 'Grade 11-12' },
  { id: 'university', label: 'University', sublabel: 'Self-learning' },
]

const EXPERIENCE_OPTIONS = [
  { id: 'beginner', label: 'Complete beginner', sublabel: 'never studied it' },
  { id: 'basics', label: 'Some basics', sublabel: "I've covered the fundamentals" },
  { id: 'intermediate', label: 'Intermediate', sublabel: "I'm comfortable with most topics" },
]

type Step = 1 | 2 | 3 | 4
type AvatarState = { elementN: number; color: string; accessory: string }

const ELEMENT_LIST = Object.values(ELEMENTS)

export default function OnboardingPage() {
  const router = useRouter()
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const [step, setStep] = useState<Step>(1)
  const [loading, setLoading] = useState(false)

  // Step 1: Avatar
  const [avatarState, setAvatarState] = useState<AvatarState>({
    elementN: 1,
    color: COLORS[5],
    accessory: 'None',
  })
  const [searchQuery, setSearchQuery] = useState('')
  const [showSearchDropdown, setShowSearchDropdown] = useState(false)

  // Step 2: Username
  const [username, setUsername] = useState('')
  const [usernameStatus, setUsernameStatus] = useState<'checking' | 'available' | 'taken' | 'invalid'>('invalid')
  const [usernameError, setUsernameError] = useState<string | null>(null)

  // Step 3: Grade
  const [selectedGrade, setSelectedGrade] = useState<string | null>(null)

  // Step 4: Experience
  const [selectedExperience, setSelectedExperience] = useState<string | null>(null)

  // Canvas ref for atom animation
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number | null>(null)
  const timeRef = useRef(0)

  // Get current element
  const currentElement = ELEMENT_LIST.find(e => e.atomicNumber === avatarState.elementN) || ELEMENT_LIST[0]

  // Check username availability (debounced)
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (!username) {
        setUsernameStatus('invalid')
        setUsernameError(null)
        return
      }

      const isValid = /^[a-zA-Z0-9_]{3,20}$/.test(username)
      if (!isValid) {
        setUsernameStatus('invalid')
        setUsernameError('Username must be 3-20 characters, letters/numbers/underscores only')
        return
      }

      setUsernameStatus('checking')
      setUsernameError(null)

      const { data, error } = await supabase
        .from('profiles')
        .select('username')
        .eq('username', username)
        .maybeSingle()

      if (error) {
        setUsernameStatus('invalid')
        setUsernameError('Failed to check username')
        return
      }

      if (data) {
        setUsernameStatus('taken')
        setUsernameError('Username is already taken')
      } else {
        setUsernameStatus('available')
        setUsernameError(null)
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [username, supabase])

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

    // Clear canvas
    ctx.clearRect(0, 0, width, height)

    const shells = currentElement.shells
    const numShells = shells.length
    const nucleusRadius = 22
    const maxRadius = Math.min(centerX, centerY) - 10

    // Calculate shell radii
    const shellRadii: number[] = []
    for (let i = 0; i < numShells; i++) {
      if (numShells === 1) {
        shellRadii.push(45)
      } else {
        const minR = nucleusRadius + 20
        const maxR = maxRadius
        const step = (maxR - minR) / (numShells - 1)
        shellRadii.push(minR + step * i)
      }
    }

    // Draw electron orbits (flat circles - Bohr model)
    ctx.lineWidth = 1
    for (let i = 0; i < numShells; i++) {
      ctx.beginPath()
      ctx.arc(centerX, centerY, shellRadii[i], 0, Math.PI * 2)
      ctx.strokeStyle = `${avatarState.color}40`
      ctx.stroke()
    }

    // Calculate electron positions
    const deltaTime = (timestamp - timeRef.current) / 1000
    timeRef.current = timestamp

    // Base rotation speeds (outer shells slower)
    const baseSpeeds = shellRadii.map((r, i) => {
      const direction = i % 2 === 0 ? 1 : -1
      return direction * (1 / (r * 0.02)) * (i * 0.3 + 0.7)
    })

    // Draw electrons
    const electronRadius = 4
    for (let shellIdx = 0; shellIdx < numShells; shellIdx++) {
      const numElectrons = shells[shellIdx]
      const radius = shellRadii[shellIdx]
      const speed = baseSpeeds[shellIdx]

      for (let e = 0; e < numElectrons; e++) {
        const angle = (timestamp / 1000) * speed + (e * 2 * Math.PI) / numElectrons
        const x = centerX + Math.cos(angle) * radius
        const y = centerY + Math.sin(angle) * radius

        // Electron glow
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, electronRadius * 2)
        gradient.addColorStop(0, avatarState.color)
        gradient.addColorStop(1, 'transparent')
        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(x, y, electronRadius * 2, 0, Math.PI * 2)
        ctx.fill()

        // Electron core
        ctx.fillStyle = '#ffffff'
        ctx.beginPath()
        ctx.arc(x, y, electronRadius, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    // Draw nucleus with glow
    const nucleusGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, nucleusRadius * 2)
    nucleusGradient.addColorStop(0, avatarState.color)
    nucleusGradient.addColorStop(0.5, avatarState.color + 'cc')
    nucleusGradient.addColorStop(1, 'transparent')
    ctx.fillStyle = nucleusGradient
    ctx.beginPath()
    ctx.arc(centerX, centerY, nucleusRadius * 2, 0, Math.PI * 2)
    ctx.fill()

    // Nucleus core
    ctx.fillStyle = avatarState.color
    ctx.beginPath()
    ctx.arc(centerX, centerY, nucleusRadius, 0, Math.PI * 2)
    ctx.fill()

    // Cute face on nucleus
    // Eyes
    const eyeOffsetX = 7
    const eyeOffsetY = -3
    const eyeSize = 4

    // Left eye
    ctx.fillStyle = '#ffffff'
    ctx.beginPath()
    ctx.arc(centerX - eyeOffsetX, centerY + eyeOffsetY, eyeSize, 0, Math.PI * 2)
    ctx.fill()

    // Right eye
    ctx.beginPath()
    ctx.arc(centerX + eyeOffsetX, centerY + eyeOffsetY, eyeSize, 0, Math.PI * 2)
    ctx.fill()

    // Pupils
    ctx.fillStyle = '#1a1a1a'
    ctx.beginPath()
    ctx.arc(centerX - eyeOffsetX + 1, centerY + eyeOffsetY, 2, 0, Math.PI * 2)
    ctx.fill()
    ctx.beginPath()
    ctx.arc(centerX + eyeOffsetX + 1, centerY + eyeOffsetY, 2, 0, Math.PI * 2)
    ctx.fill()

    // Eye shine
    ctx.fillStyle = '#ffffff'
    ctx.beginPath()
    ctx.arc(centerX - eyeOffsetX, centerY + eyeOffsetY - 1, 1.5, 0, Math.PI * 2)
    ctx.fill()
    ctx.beginPath()
    ctx.arc(centerX + eyeOffsetX, centerY + eyeOffsetY - 1, 1.5, 0, Math.PI * 2)
    ctx.fill()

    // Smile
    ctx.strokeStyle = '#1a1a1a'
    ctx.lineWidth = 2
    ctx.lineCap = 'round'
    ctx.beginPath()
    ctx.arc(centerX, centerY + 2, 6, 0.2 * Math.PI, 0.8 * Math.PI)
    ctx.stroke()

    // Draw accessories
    if (avatarState.accessory === 'Shades') {
      ctx.fillStyle = '#1a1a1a'
      ctx.fillRect(centerX - 12, centerY - 5, 24, 8)
      ctx.strokeStyle = '#333'
      ctx.lineWidth = 2
      ctx.strokeRect(centerX - 12, centerY - 5, 24, 8)
      // Lens shine
      ctx.fillStyle = 'rgba(255,255,255,0.3)'
      ctx.fillRect(centerX - 10, centerY - 3, 8, 4)
    } else if (avatarState.accessory === 'Grad Cap') {
      ctx.fillStyle = '#1a1a1a'
      // Mortarboard
      ctx.fillRect(centerX - 16, centerY - 18, 32, 4)
      // Cap top
      ctx.beginPath()
      ctx.moveTo(centerX - 16, centerY - 18)
      ctx.lineTo(centerX - 18, centerY - 14)
      ctx.lineTo(centerX + 18, centerY - 14)
      ctx.lineTo(centerX + 16, centerY - 18)
      ctx.fill()
      // Tassel
      ctx.strokeStyle = '#fbbf24'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(centerX + 16, centerY - 14)
      ctx.lineTo(centerX + 18, centerY - 6)
      ctx.stroke()
    } else if (avatarState.accessory === 'Crown') {
      ctx.fillStyle = '#fbbf24'
      ctx.strokeStyle = '#f59e0b'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(centerX - 14, centerY - 10)
      ctx.lineTo(centerX - 12, centerY - 22)
      ctx.lineTo(centerX - 6, centerY - 14)
      ctx.lineTo(centerX, centerY - 24)
      ctx.lineTo(centerX + 6, centerY - 14)
      ctx.lineTo(centerX + 12, centerY - 22)
      ctx.lineTo(centerX + 14, centerY - 10)
      ctx.closePath()
      ctx.fill()
      ctx.stroke()
    } else if (avatarState.accessory === 'Lab Coat') {
      ctx.fillStyle = '#ffffff'
      ctx.strokeStyle = '#e5e5e5'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(centerX - 10, centerY + 18)
      ctx.lineTo(centerX - 14, centerY + 32)
      ctx.lineTo(centerX + 14, centerY + 32)
      ctx.lineTo(centerX + 10, centerY + 18)
      ctx.closePath()
      ctx.fill()
      ctx.stroke()
      // Buttons
      ctx.fillStyle = '#e5e5e5'
      ctx.beginPath()
      ctx.arc(centerX - 4, centerY + 24, 2, 0, Math.PI * 2)
      ctx.fill()
      ctx.beginPath()
      ctx.arc(centerX + 4, centerY + 24, 2, 0, Math.PI * 2)
      ctx.fill()
    } else if (avatarState.accessory === 'Headphones') {
      ctx.strokeStyle = '#1a1a1a'
      ctx.lineWidth = 4
      // Band
      ctx.beginPath()
      ctx.arc(centerX, centerY - 4, 20, Math.PI, 0)
      ctx.stroke()
      // Ear cups
      ctx.fillStyle = '#1a1a1a'
      ctx.beginPath()
      ctx.ellipse(centerX - 20, centerY, 6, 10, 0, 0, Math.PI * 2)
      ctx.fill()
      ctx.beginPath()
      ctx.ellipse(centerX + 20, centerY, 6, 10, 0, 0, Math.PI * 2)
      ctx.fill()
    } else if (avatarState.accessory === 'Star') {
      ctx.font = '20px Arial'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText('⭐', centerX, centerY - 26)
    } else if (avatarState.accessory === 'Lightning') {
      ctx.font = '20px Arial'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText('⚡', centerX, centerY - 26)
    }

    animationRef.current = requestAnimationFrame(drawAtom)
  }, [currentElement, avatarState])

  useEffect(() => {
    if (step === 1) {
      animationRef.current = requestAnimationFrame(drawAtom)
      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current)
        }
      }
    }
  }, [step, drawAtom])

  const canContinue = () => {
    switch (step) {
      case 1:
        return true
      case 2:
        return usernameStatus === 'available'
      case 3:
        return selectedGrade !== null
      case 4:
        return selectedExperience !== null
      default:
        return false
    }
  }

  const handleContinue = async () => {
    if (step < 4) {
      setStep((step + 1) as Step)
    } else {
      await completeOnboarding()
    }
  }

  const completeOnboarding = async () => {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      router.push('/login')
      return
    }

    const { error } = await supabase
      .from('profiles')
      .insert({
        user_id: user.id,
        username: username,
        avatar_url: JSON.stringify(avatarState),
        onboarding_completed: true,
        xp: 0,
        streak: 0,
        hearts: 5,
        is_premium: false,
      })

    if (error) {
      console.error('Failed to create profile:', error)
      setLoading(false)
      return
    }

    router.push('/dashboard')
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    setShowSearchDropdown(query.length > 0)
  }

  const filteredElements = ELEMENT_LIST.filter(el =>
    el.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    el.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
    el.atomicNumber.toString().includes(searchQuery)
  )

  const progress = ((step - 1) / 3) * 100

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-950 px-4 py-12">
      <div className="w-full max-w-2xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-medium text-white">Step {step} of 4</span>
            <span className="text-sm text-gray-400">{Math.round(progress)}% complete</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-gray-800">
            <div
              className="h-full bg-blue-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="rounded-2xl bg-white p-8 shadow-xl">
          {/* Step Content */}
          {step === 1 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Customize your atom</h2>
              <p className="mt-2 text-gray-600">Choose an element and style for your avatar</p>

              {/* Canvas */}
              <div className="mt-6 flex justify-center">
                <canvas
                  ref={canvasRef}
                  width={210}
                  height={210}
                  className="rounded-lg border border-gray-200 bg-gray-50"
                />
              </div>

              {/* Element badge */}
              <div className="mt-4 text-center">
                <div className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-4 py-2">
                  <span className="text-lg font-bold text-gray-900">{currentElement.symbol}</span>
                  <span className="text-gray-600">|</span>
                  <span className="text-sm text-gray-600">{currentElement.name}</span>
                  <span className="text-gray-600">|</span>
                  <span className="text-sm text-gray-600">{currentElement.atomicNumber}</span>
                  <span className="text-gray-600">|</span>
                  <span className="text-sm text-gray-600">{currentElement.shells.join(', ')}</span>
                </div>
              </div>

              {/* Search */}
              <div className="mt-6 relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  onFocus={() => setShowSearchDropdown(searchQuery.length > 0)}
                  onBlur={() => setTimeout(() => setShowSearchDropdown(false), 200)}
                  placeholder="Search elements..."
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                {showSearchDropdown && (
                  <div className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-lg border border-gray-200 bg-white shadow-lg">
                    {filteredElements.map(el => (
                      <button
                        key={el.symbol}
                        onClick={() => {
                          setAvatarState({ ...avatarState, elementN: el.atomicNumber })
                          setSearchQuery('')
                          setShowSearchDropdown(false)
                        }}
                        className="w-full px-4 py-2 text-left hover:bg-gray-50"
                      >
                        <span className="font-medium text-gray-900">{el.symbol}</span>
                        <span className="ml-2 text-gray-600">{el.name}</span>
                        <span className="ml-2 text-sm text-gray-400">({el.atomicNumber})</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* +/- buttons */}
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => setAvatarState({ ...avatarState, elementN: Math.max(1, avatarState.elementN - 1) })}
                  className="flex-1 rounded-lg border border-gray-300 py-2 font-medium text-gray-700 hover:bg-gray-50"
                >
                  -
                </button>
                <button
                  onClick={() => setAvatarState({ ...avatarState, elementN: Math.min(118, avatarState.elementN + 1) })}
                  className="flex-1 rounded-lg border border-gray-300 py-2 font-medium text-gray-700 hover:bg-gray-50"
                >
                  +
                </button>
              </div>

              {/* Color swatches */}
              <div className="mt-6">
                <label className="mb-2 block text-sm font-medium text-gray-700">Atom color</label>
                <div className="flex gap-2">
                  {COLORS.map(color => (
                    <button
                      key={color}
                      onClick={() => setAvatarState({ ...avatarState, color })}
                      className={`h-10 w-10 rounded-full transition-transform hover:scale-110 ${
                        avatarState.color === color ? 'ring-2 ring-offset-2 ring-gray-400' : ''
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              {/* Accessories */}
              <div className="mt-6">
                <label className="mb-2 block text-sm font-medium text-gray-700">Accessory</label>
                <div className="grid grid-cols-4 gap-2">
                  {ACCESSORIES.map(acc => (
                    <button
                      key={acc}
                      onClick={() => setAvatarState({ ...avatarState, accessory: acc })}
                      className={`rounded-lg border py-2 text-sm font-medium transition-colors ${
                        avatarState.accessory === acc
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {acc}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Choose a username</h2>
              <p className="mt-2 text-gray-600">This is how others will see you</p>

              <div className="mt-8">
                <div className="relative">
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter username"
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 pr-12 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  {usernameStatus === 'available' && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-green-500">
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  )}
                  {usernameStatus === 'taken' && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-red-500">
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </div>
                  )}
                  {usernameStatus === 'checking' && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                      <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-blue-500" />
                    </div>
                  )}
                </div>
                {usernameError && (
                  <p className="mt-2 text-sm text-red-600">{usernameError}</p>
                )}
                {usernameStatus === 'available' && (
                  <p className="mt-2 text-sm text-green-600">Username is available!</p>
                )}
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900">What grade are you in?</h2>
              <p className="mt-2 text-gray-600">This helps us personalize your learning</p>

              <div className="mt-8 grid grid-cols-2 gap-4">
                {GRADE_OPTIONS.map(option => (
                  <button
                    key={option.id}
                    onClick={() => setSelectedGrade(option.id)}
                    className={`rounded-xl border-2 p-6 text-left transition-all ${
                      selectedGrade === option.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-semibold text-gray-900">{option.label}</div>
                    <div className="text-sm text-gray-600">{option.sublabel}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 4 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900">What's your physics experience?</h2>
              <p className="mt-2 text-gray-600">We'll adapt the content to your level</p>

              <div className="mt-8 space-y-4">
                {EXPERIENCE_OPTIONS.map(option => (
                  <button
                    key={option.id}
                    onClick={() => setSelectedExperience(option.id)}
                    className={`w-full rounded-xl border-2 p-6 text-left transition-all ${
                      selectedExperience === option.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-semibold text-gray-900">{option.label}</div>
                    <div className="text-sm text-gray-600">{option.sublabel}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="mt-8 flex gap-4">
            {step > 1 && (
              <button
                onClick={() => setStep((step - 1) as Step)}
                className="flex-1 rounded-lg border border-gray-300 px-4 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-50"
              >
                Back
              </button>
            )}
            <button
              onClick={handleContinue}
              disabled={!canContinue() || loading}
              className="flex-1 rounded-lg bg-blue-600 px-4 py-3 font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                </div>
              ) : step === 4 ? (
                'Complete'
              ) : (
                'Continue'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
