'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

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
  '#63b3ed', '#9f7aea', '#68d391', '#fc8181', '#f6ad55', '#76e4f7', '#f687b3', '#ffd700',
]

const ACCESSORIES = ['None', 'glasses', 'hat', 'crown', 'lab', 'headphones', 'star', 'lightning']

const GRADE_OPTIONS = [
  { id: 'middle', icon: '📚', title: 'Middle School', subtitle: 'Grade 6–8' },
  { id: 'high', icon: '🔬', title: 'High School', subtitle: 'Grade 9–10' },
  { id: 'senior', icon: '🧪', title: 'Senior High', subtitle: 'Grade 11–12' },
  { id: 'university', icon: '🎓', title: 'University / Self-learning', subtitle: '' },
]

const EXPERIENCE_OPTIONS = [
  { id: 'beginner', icon: '⚡', title: 'Complete beginner', subtitle: "I've never really studied it" },
  { id: 'basics', icon: '📖', title: 'Know the basics', subtitle: "I've covered some fundamentals" },
  { id: 'intermediate', icon: '🚀', title: 'Intermediate', subtitle: "I'm comfortable with most topics" },
]

type Step = 1 | 2 | 3 | 4 | 5 | 6
type AvatarState = { elementN: number; color: string; accessory: string }

const ELEMENT_LIST = Object.values(ELEMENTS)

export default function SignUpPage() {
  const router = useRouter()

  const [step, setStep] = useState<Step>(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null)

  // Step 2: Grade
  const [selectedGrade, setSelectedGrade] = useState<string | null>(null)

  // Step 3: Experience
  const [selectedExperience, setSelectedExperience] = useState<string | null>(null)

  // Step 4: Account
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  // Step 5: Avatar
  const [avatarState, setAvatarState] = useState<AvatarState>({
    elementN: 1,
    color: COLORS[5],
    accessory: 'None',
  })
  const [searchQuery, setSearchQuery] = useState('')
  const [showSearchDropdown, setShowSearchDropdown] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number | null>(null)
  const timeRef = useRef(0)

  // Step 6: Username
  const [username, setUsername] = useState('')
  const [usernameStatus, setUsernameStatus] = useState<'checking' | 'available' | 'taken' | 'invalid'>('invalid')
  const [usernameError, setUsernameError] = useState<string | null>(null)

  const currentElement = ELEMENT_LIST.find((e) => e.atomicNumber === avatarState.elementN) || ELEMENT_LIST[0]

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

      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )

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

      setUsernameStatus(data ? 'taken' : 'available')
    }, 500)

    return () => clearTimeout(timer)
  }, [username])

  // Draw accessory function
  function drawAccessory(ctx: CanvasRenderingContext2D, acc: string, CX: number, CY: number, nucleusR: number, color: string) {
    ctx.save();

    switch (acc) {
      case 'glasses': {
        // Two small round lenses sitting on the eye line, bridge connecting them
        const eyeY = CY - nucleusR * 0.15;
        const lensR = nucleusR * 0.28;
        const lensOffset = nucleusR * 0.38;
        ctx.strokeStyle = 'rgba(255,255,255,0.95)';
        ctx.lineWidth = 1.5;
        ctx.fillStyle = 'rgba(255,255,255,0.08)';
        // Left lens
        ctx.beginPath(); ctx.arc(CX - lensOffset, eyeY, lensR, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        // Right lens
        ctx.beginPath(); ctx.arc(CX + lensOffset, eyeY, lensR, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        // Bridge
        ctx.beginPath(); ctx.moveTo(CX - lensOffset + lensR, eyeY); ctx.lineTo(CX + lensOffset - lensR, eyeY); ctx.stroke();
        // Arms
        ctx.beginPath(); ctx.moveTo(CX - lensOffset - lensR, eyeY); ctx.lineTo(CX - nucleusR * 0.95, eyeY - 2); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(CX + lensOffset + lensR, eyeY); ctx.lineTo(CX + nucleusR * 0.95, eyeY - 2); ctx.stroke();
        break;
      }
      case 'hat': {
        // Graduation cap sitting ON TOP of the nucleus, not floating
        const capY = CY - nucleusR * 0.85;
        const capW = nucleusR * 1.4;
        const capH = nucleusR * 0.7;
        const brimW = nucleusR * 1.8;
        const brimH = nucleusR * 0.2;
        ctx.fillStyle = 'rgba(255,255,255,0.95)';
        // Cap body
        ctx.fillRect(CX - capW / 2, capY - capH, capW, capH);
        // Brim
        ctx.fillRect(CX - brimW / 2, capY - brimH, brimW, brimH);
        // Tassel color band
        ctx.fillStyle = color;
        ctx.fillRect(CX - capW / 2, capY - capH, capW, nucleusR * 0.15);
        break;
      }
      case 'crown': {
        // Crown sitting neatly on top of nucleus
        const crownBase = CY - nucleusR * 0.8;
        const crownH = nucleusR * 0.75;
        const crownW = nucleusR * 1.3;
        ctx.fillStyle = '#ffd700';
        ctx.beginPath();
        // 5-point crown shape
        ctx.moveTo(CX - crownW / 2, crownBase);
        ctx.lineTo(CX - crownW / 2, crownBase - crownH * 0.6);
        ctx.lineTo(CX - crownW / 4, crownBase - crownH * 0.3);
        ctx.lineTo(CX, crownBase - crownH);
        ctx.lineTo(CX + crownW / 4, crownBase - crownH * 0.3);
        ctx.lineTo(CX + crownW / 2, crownBase - crownH * 0.6);
        ctx.lineTo(CX + crownW / 2, crownBase);
        ctx.closePath();
        ctx.fill();
        // Gem dots on crown points
        ctx.fillStyle = 'white'; ctx.beginPath(); ctx.arc(CX, crownBase - crownH, 2.5, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#ff6b6b'; ctx.beginPath(); ctx.arc(CX - crownW / 4, crownBase - crownH * 0.3, 2, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#a78bfa'; ctx.beginPath(); ctx.arc(CX + crownW / 4, crownBase - crownH * 0.3, 2, 0, Math.PI * 2); ctx.fill();
        break;
      }
      case 'lab': {
        // White lab coat collar + body BELOW the nucleus, properly sized
        const shirtY = CY + nucleusR * 0.7;
        const shirtW = nucleusR * 1.6;
        const shirtH = nucleusR * 1.1;
        ctx.fillStyle = 'rgba(255,255,255,0.9)';
        // Shirt body
        ctx.beginPath();
        ctx.moveTo(CX - shirtW / 2, shirtY);
        ctx.lineTo(CX - shirtW / 2, shirtY + shirtH);
        ctx.lineTo(CX + shirtW / 2, shirtY + shirtH);
        ctx.lineTo(CX + shirtW / 2, shirtY);
        // V-neck
        ctx.lineTo(CX + shirtW * 0.15, shirtY);
        ctx.lineTo(CX, shirtY + shirtH * 0.3);
        ctx.lineTo(CX - shirtW * 0.15, shirtY);
        ctx.closePath();
        ctx.fill();
        // Lapels
        ctx.fillStyle = 'rgba(200,220,255,0.6)';
        ctx.beginPath(); ctx.moveTo(CX, shirtY + shirtH * 0.3); ctx.lineTo(CX - shirtW * 0.15, shirtY); ctx.lineTo(CX - shirtW * 0.35, shirtY + shirtH * 0.4); ctx.closePath(); ctx.fill();
        ctx.beginPath(); ctx.moveTo(CX, shirtY + shirtH * 0.3); ctx.lineTo(CX + shirtW * 0.15, shirtY); ctx.lineTo(CX + shirtW * 0.35, shirtY + shirtH * 0.4); ctx.closePath(); ctx.fill();
        break;
      }
      case 'headphones': {
        // Headphones arc over the top, ear cups on sides at correct height
        const arcR = nucleusR * 1.05;
        const cupW = nucleusR * 0.32;
        const cupH = nucleusR * 0.45;
        const cupY = CY - nucleusR * 0.1;
        ctx.strokeStyle = 'rgba(40,40,40,0.95)';
        ctx.lineWidth = nucleusR * 0.22;
        ctx.lineCap = 'round';
        // Arc over top
        ctx.beginPath();
        ctx.arc(CX, CY, arcR, Math.PI + 0.55, -0.55);
        ctx.stroke();
        // Left ear cup
        ctx.fillStyle = 'rgba(50,50,50,0.95)';
        ctx.beginPath(); ctx.ellipse(CX - arcR, cupY, cupW, cupH, 0, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = 'rgba(80,80,80,0.8)';
        ctx.beginPath(); ctx.ellipse(CX - arcR, cupY, cupW * 0.6, cupH * 0.6, 0, 0, Math.PI * 2); ctx.fill();
        // Right ear cup
        ctx.fillStyle = 'rgba(50,50,50,0.95)';
        ctx.beginPath(); ctx.ellipse(CX + arcR, cupY, cupW, cupH, 0, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = 'rgba(80,80,80,0.8)';
        ctx.beginPath(); ctx.ellipse(CX + arcR, cupY, cupW * 0.6, cupH * 0.6, 0, 0, Math.PI * 2); ctx.fill();
        break;
      }
      case 'star': {
        // Clean 5-point star sitting on top of nucleus
        const starCX = CX;
        const starCY = CY - nucleusR * 1.15;
        const outerR = nucleusR * 0.45;
        const innerR = nucleusR * 0.2;
        ctx.fillStyle = '#ffd700';
        ctx.beginPath();
        for (let i = 0; i < 10; i++) {
          const angle = (i * Math.PI) / 5 - Math.PI / 2;
          const r = i % 2 === 0 ? outerR : innerR;
          if (i === 0) ctx.moveTo(starCX + r * Math.cos(angle), starCY + r * Math.sin(angle));
          else ctx.lineTo(starCX + r * Math.cos(angle), starCY + r * Math.sin(angle));
        }
        ctx.closePath(); ctx.fill();
        // Star shine
        ctx.fillStyle = 'rgba(255,255,255,0.6)';
        ctx.beginPath(); ctx.arc(starCX - outerR * 0.2, starCY - outerR * 0.2, outerR * 0.2, 0, Math.PI * 2); ctx.fill();
        break;
      }
      case 'lightning': {
        // Lightning bolt above and to the right of nucleus
        const boltX = CX + nucleusR * 0.55;
        const boltY = CY - nucleusR * 1.3;
        const boltH = nucleusR * 0.9;
        const boltW = nucleusR * 0.5;
        ctx.fillStyle = '#fbbf24';
        ctx.beginPath();
        ctx.moveTo(boltX + boltW * 0.3, boltY);
        ctx.lineTo(boltX - boltW * 0.1, boltY + boltH * 0.45);
        ctx.lineTo(boltX + boltW * 0.15, boltY + boltH * 0.45);
        ctx.lineTo(boltX - boltW * 0.3, boltY + boltH);
        ctx.lineTo(boltX + boltW * 0.5, boltY + boltH * 0.5);
        ctx.lineTo(boltX + boltW * 0.2, boltY + boltH * 0.5);
        ctx.closePath();
        ctx.fill();
        break;
      }
    }
    ctx.restore();
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
    const nucleusRadius = 22
    const maxRadius = Math.min(centerX, centerY) - 10

    const shellRadii: number[] = []
    for (let i = 0; i < numShells; i++) {
      if (numShells === 1) {
        shellRadii.push(45)
      } else {
        const minR = nucleusRadius + 14
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
      ctx.strokeStyle = `${avatarState.color}40`
      ctx.stroke()
    }

    const baseSpeeds = shellRadii.map((r, i) => {
      const direction = i % 2 === 0 ? 1 : -1
      return direction * (1 / (r * 0.02)) * (i * 0.3 + 0.7)
    })

    const electronRadius = 4
    for (let shellIdx = 0; shellIdx < numShells; shellIdx++) {
      const numElectrons = shells[shellIdx]
      const radius = shellRadii[shellIdx]
      const speed = baseSpeeds[shellIdx]

      for (let e = 0; e < numElectrons; e++) {
        const angle = (timestamp / 1000) * speed + (e * 2 * Math.PI) / numElectrons
        const x = centerX + Math.cos(angle) * radius
        const y = centerY + Math.sin(angle) * radius

        const gradient = ctx.createRadialGradient(x, y, 0, x, y, electronRadius * 2)
        gradient.addColorStop(0, avatarState.color)
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
    nucleusGradient.addColorStop(0, avatarState.color)
    nucleusGradient.addColorStop(0.5, avatarState.color + 'cc')
    nucleusGradient.addColorStop(1, 'transparent')
    ctx.fillStyle = nucleusGradient
    ctx.beginPath()
    ctx.arc(centerX, centerY, nucleusRadius * 2, 0, Math.PI * 2)
    ctx.fill()

    ctx.fillStyle = avatarState.color
    ctx.beginPath()
    ctx.arc(centerX, centerY, nucleusRadius, 0, Math.PI * 2)
    ctx.fill()

    // Face
    const eyeOffsetX = 7
    const eyeOffsetY = -3
    const eyeSize = 4

    ctx.fillStyle = '#ffffff'
    ctx.beginPath()
    ctx.arc(centerX - eyeOffsetX, centerY + eyeOffsetY, eyeSize, 0, Math.PI * 2)
    ctx.fill()
    ctx.beginPath()
    ctx.arc(centerX + eyeOffsetX, centerY + eyeOffsetY, eyeSize, 0, Math.PI * 2)
    ctx.fill()

    ctx.fillStyle = '#1a1a1a'
    ctx.beginPath()
    ctx.arc(centerX - eyeOffsetX + 1, centerY + eyeOffsetY, 2, 0, Math.PI * 2)
    ctx.fill()
    ctx.beginPath()
    ctx.arc(centerX + eyeOffsetX + 1, centerY + eyeOffsetY, 2, 0, Math.PI * 2)
    ctx.fill()

    ctx.fillStyle = '#ffffff'
    ctx.beginPath()
    ctx.arc(centerX - eyeOffsetX, centerY + eyeOffsetY - 1, 1.5, 0, Math.PI * 2)
    ctx.fill()
    ctx.beginPath()
    ctx.arc(centerX + eyeOffsetX, centerY + eyeOffsetY - 1, 1.5, 0, Math.PI * 2)
    ctx.fill()

    ctx.strokeStyle = '#1a1a1a'
    ctx.lineWidth = 2
    ctx.lineCap = 'round'
    ctx.beginPath()
    ctx.arc(centerX, centerY + 2, 6, 0.2 * Math.PI, 0.8 * Math.PI)
    ctx.stroke()

    // Draw accessory
    if (avatarState.accessory !== 'None') {
      drawAccessory(ctx, avatarState.accessory, centerX, centerY, nucleusRadius, avatarState.color)
    }

    animationRef.current = requestAnimationFrame(drawAtom)
  }, [currentElement, avatarState])

  useEffect(() => {
    if (step === 5) {
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
      case 2:
        return selectedGrade !== null
      case 3:
        return selectedExperience !== null
      case 4:
        return email.length > 0 && password.length >= 8
      case 6:
        return usernameStatus === 'available'
      default:
        return true
    }
  }

  const handleContinue = async () => {
    setError(null)
    if (step < 6) {
      if (step === 4) {
        await handleCreateAccount()
      } else {
        setStep((step + 1) as Step)
      }
    } else {
      await handleFinish()
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep((step - 1) as Step)
    }
  }

  const handleCreateAccount = async () => {
    setLoading(true)
    setError(null)

    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    if (data.user) {
      setUserId(data.user.id)
      setStep(5)
      setLoading(false)
    }
  }

  const handleFinish = async () => {
    setLoading(true)
    setError(null)

    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const { error: profileError } = await supabase.from('profiles').insert({
      user_id: userId!,
      username: username,
      avatar_url: JSON.stringify(avatarState),
      grade: selectedGrade,
      experience: selectedExperience,
      onboarding_completed: true,
      xp: 0,
      streak: 0,
      hearts: 5,
      is_premium: false,
    })

    if (profileError) {
      setError(profileError.message)
      setLoading(false)
      return
    }

    router.push('/dashboard')
  }

  const getPasswordStrength = (pwd: string) => {
    if (pwd.length < 8) return { label: 'weak', color: 'text-red-400' }
    if (pwd.length < 12) return { label: 'good', color: 'text-yellow-400' }
    if (/[!@#$%^&*]/.test(pwd)) return { label: 'strong', color: 'text-green-400' }
    return { label: 'good', color: 'text-yellow-400' }
  }

  const progress = ((step - 1) / 5) * 100

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Progress bar */}
      {step > 1 && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-sm border-b border-slate-800/50">
          <div className="mx-auto max-w-4xl px-4 py-3 flex items-center justify-between">
            <div className="flex-1 mr-4">
              <div className="h-1.5 overflow-hidden rounded-full bg-slate-800">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
            <span className="text-xs text-slate-400">Step {step} of 6</span>
          </div>
        </div>
      )}

      {/* Step 1: Welcome */}
      {step === 1 && (
        <div className="flex min-h-screen items-center justify-center px-4">
          <div className="max-w-2xl text-center">
            <style>{`
              @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
              .fade-in { animation: fadeIn 0.6s ease-out forwards; }
              .fade-in-delay { animation: fadeIn 0.6s ease-out 0.5s forwards; opacity: 0; }
              .fade-in-btn { animation: fadeIn 0.6s ease-out 1.5s forwards; opacity: 0; }
            `}</style>

            <div className="relative w-64 h-64 mx-auto mb-12">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <ellipse cx="50" cy="50" rx="35" ry="12" fill="none" stroke="url(#gradient1)" strokeWidth="0.5" opacity="0.3" transform="rotate(-15 50 50)" />
                <ellipse cx="50" cy="50" rx="30" ry="8" fill="none" stroke="url(#gradient1)" strokeWidth="0.5" opacity="0.3" transform="rotate(30 50 50)" />
                <ellipse cx="50" cy="50" rx="25" ry="6" fill="none" stroke="url(#gradient1)" strokeWidth="0.5" opacity="0.3" transform="rotate(75 50 50)" />
                <circle cx="15" cy="35" r="3" fill="url(#gradient2)" className="animate-pulse" style={{ animationDuration: '2s' }} />
                <circle cx="72" cy="55" r="3" fill="url(#gradient1)" className="animate-pulse" style={{ animationDuration: '2.5s' }} />
                <circle cx="62" cy="25" r="3" fill="url(#gradient1)" className="animate-pulse" style={{ animationDuration: '3s' }} />
                <circle cx="50" cy="50" r="10" fill="url(#gradient2)" />
                <defs>
                  <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#6366f1" />
                  </linearGradient>
                  <radialGradient id="gradient2">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                  </radialGradient>
                </defs>
              </svg>
            </div>

            <h1 className="text-4xl md:text-5xl font-semibold text-white mb-4 fade-in tracking-tight">
              Welcome to SciLens
            </h1>
            <p className="text-lg text-slate-400 mb-12 fade-in-delay">
              Your science journey starts here.
            </p>
            <button
              onClick={() => setStep(2)}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium hover:from-blue-500 hover:to-indigo-500 transition-all fade-in-btn"
            >
              Begin →
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Grade */}
      {step === 2 && (
        <div className="min-h-screen flex items-center justify-center px-4 py-24">
          <div className="max-w-2xl w-full">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-semibold text-white mb-2 tracking-tight">
                First, tell us about yourself
              </h2>
              <p className="text-slate-400">We'll personalize your learning path</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {GRADE_OPTIONS.map((option) => (
                <button
                  key={option.id}
                  onClick={() => setSelectedGrade(option.id)}
                  className={`p-6 rounded-2xl border cursor-pointer transition-all ${
                    selectedGrade === option.id
                      ? 'border-blue-500 bg-blue-500/10'
                      : 'border-slate-700 bg-slate-800/60 hover:bg-slate-800'
                  }`}
                >
                  <div className="text-4xl mb-3">{option.icon}</div>
                  <div className="text-lg font-semibold text-white mb-1">{option.title}</div>
                  <div className="text-sm text-slate-400">{option.subtitle}</div>
                </button>
              ))}
            </div>

            <div className="mt-8 flex justify-end">
              <button
                onClick={handleContinue}
                disabled={!canContinue()}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium hover:from-blue-500 hover:to-indigo-500 transition-all disabled:cursor-not-allowed disabled:opacity-50"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Experience */}
      {step === 3 && (
        <div className="min-h-screen flex items-center justify-center px-4 py-24">
          <div className="max-w-lg w-full">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-semibold text-white mb-2 tracking-tight">
                How comfortable are you with physics?
              </h2>
            </div>

            <div className="space-y-3">
              {EXPERIENCE_OPTIONS.map((option) => (
                <button
                  key={option.id}
                  onClick={() => setSelectedExperience(option.id)}
                  className={`w-full p-6 rounded-2xl border text-left transition-all ${
                    selectedExperience === option.id
                      ? 'border-blue-500 bg-blue-500/10'
                      : 'border-slate-700 bg-slate-800/60 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span className="text-2xl">{option.icon}</span>
                    <div>
                      <div className="text-lg font-semibold text-white">{option.title}</div>
                      <div className="text-sm text-slate-400">{option.subtitle}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-8 flex gap-4">
              <button
                onClick={handleBack}
                className="px-6 py-3 text-slate-400 hover:text-white transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleContinue}
                disabled={!canContinue()}
                className="ml-auto px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium hover:from-blue-500 hover:to-indigo-500 transition-all disabled:cursor-not-allowed disabled:opacity-50"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Step 4: Create Account */}
      {step === 4 && (
        <div className="min-h-screen flex items-center justify-center px-4 py-24">
          <div className="max-w-md w-full">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-semibold text-white mb-2 tracking-tight">
                Almost there!
              </h2>
              <p className="text-slate-400">Create your account to continue</p>
            </div>

            {error && (
              <div className="mb-4 rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-sm text-red-400">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-slate-300">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-slate-300">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Min. 8 characters"
                />
                {password.length > 0 && (
                  <div className="mt-1.5 flex items-center gap-2">
                    <div className="h-1.5 flex-1 rounded-full bg-slate-700 overflow-hidden">
                      <div
                        className={`h-full ${password.length < 8 ? 'w-1/3 bg-red-400' : password.length < 12 ? 'w-2/3 bg-yellow-400' : 'w-full bg-green-400'}`}
                      />
                    </div>
                    <span className={`text-xs ${getPasswordStrength(password).color}`}>
                      {getPasswordStrength(password).label}
                    </span>
                  </div>
                )}
              </div>

              <button
                onClick={handleContinue}
                disabled={loading || !canContinue()}
                className="w-full rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3 text-sm font-medium text-white hover:from-blue-500 hover:to-indigo-500 transition-all disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  </div>
                ) : (
                  'Continue'
                )}
              </button>
            </div>

            <div className="mt-6 flex gap-4">
              <button
                onClick={handleBack}
                className="px-6 py-3 text-slate-400 hover:text-white transition-colors"
              >
                Back
              </button>
              <Link
                href="/login"
                className="ml-auto px-6 py-3 text-slate-400 hover:text-white transition-colors"
              >
                Already have an account?
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Step 5: Atom Avatar */}
      {step === 5 && (
        <div className="min-h-screen flex items-center justify-center px-4 py-24">
          <div className="max-w-2xl w-full">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-semibold text-white mb-2 tracking-tight">
                Meet your atom ⚛️
              </h2>
              <p className="text-slate-400">This is your science companion — make it yours</p>
            </div>

            <div className="flex justify-center mb-6">
              <canvas
                ref={canvasRef}
                width={210}
                height={210}
                className="rounded-lg border border-slate-700 bg-slate-900/50"
              />
            </div>

            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-2 rounded-full bg-slate-800/60 px-4 py-2">
                <span className="text-lg font-bold text-white">{currentElement.symbol}</span>
                <span className="text-slate-500">|</span>
                <span className="text-sm text-slate-400">{currentElement.name}</span>
                <span className="text-slate-500">|</span>
                <span className="text-sm text-slate-400">{currentElement.atomicNumber}</span>
                <span className="text-slate-500">|</span>
                <span className="text-sm text-slate-400">{currentElement.shells.join(', ')}</span>
              </div>
            </div>

            <div className="relative mb-4">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setShowSearchDropdown(e.target.value.length > 0)
                }}
                onFocus={() => setShowSearchDropdown(searchQuery.length > 0)}
                onBlur={() => setTimeout(() => setShowSearchDropdown(false), 200)}
                placeholder="Search elements..."
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              {showSearchDropdown && (
                <div className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-lg border border-slate-700 bg-slate-800 shadow-lg">
                  {ELEMENT_LIST.filter(el =>
                    el.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    el.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    el.atomicNumber.toString().includes(searchQuery)
                  ).slice(0, 8).map(el => (
                    <button
                      key={el.symbol}
                      onClick={() => {
                        setAvatarState({ ...avatarState, elementN: el.atomicNumber })
                        setSearchQuery('')
                        setShowSearchDropdown(false)
                      }}
                      className="w-full px-4 py-2 text-left hover:bg-slate-700"
                    >
                      <span className="font-medium text-white">{el.symbol}</span>
                      <span className="ml-2 text-slate-400">{el.name}</span>
                      <span className="ml-2 text-xs text-slate-500">({el.atomicNumber})</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-2 mb-6">
              <button
                onClick={() => setAvatarState({ ...avatarState, elementN: Math.max(1, avatarState.elementN - 1) })}
                className="flex-1 rounded-lg border border-slate-700 py-2 text-sm font-medium text-slate-300 hover:bg-slate-800"
              >
                -
              </button>
              <button
                onClick={() => setAvatarState({ ...avatarState, elementN: Math.min(118, avatarState.elementN + 1) })}
                className="flex-1 rounded-lg border border-slate-700 py-2 text-sm font-medium text-slate-300 hover:bg-slate-800"
              >
                +
              </button>
            </div>

            <div className="mb-6">
              <label className="mb-2 block text-sm font-medium text-slate-300">Atom color</label>
              <div className="flex gap-2">
                {COLORS.map(color => (
                  <button
                    key={color}
                    onClick={() => setAvatarState({ ...avatarState, color })}
                    className={`h-10 w-10 rounded-full transition-transform hover:scale-110 ${
                      avatarState.color === color ? 'ring-2 ring-offset-2 ring-offset-slate-950 ring-blue-400' : ''
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            <div className="mb-8">
              <label className="mb-2 block text-sm font-medium text-slate-300">Accessory</label>
              <div className="grid grid-cols-4 gap-2">
                {ACCESSORIES.map(acc => {
                  const labels: Record<string, string> = {
                    'None': 'None',
                    'glasses': 'Shades',
                    'hat': 'Cap',
                    'crown': 'Crown',
                    'lab': 'Lab Coat',
                    'headphones': 'Phones',
                    'star': '⭐',
                    'lightning': '⚡'
                  }
                  return (
                    <button
                      key={acc}
                      onClick={() => setAvatarState({ ...avatarState, accessory: acc })}
                      className={`rounded-lg border py-2 text-xs font-medium transition-colors ${
                        avatarState.accessory === acc
                          ? 'border-blue-500 bg-blue-500/10 text-blue-400'
                          : 'border-slate-700 text-slate-400 hover:bg-slate-800'
                      }`}
                    >
                      {labels[acc]}
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={handleBack}
                className="px-6 py-3 text-slate-400 hover:text-white transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleContinue}
                className="ml-auto px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium hover:from-blue-500 hover:to-indigo-500 transition-all"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Step 6: Username + Finish */}
      {step === 6 && (
        <div className="min-h-screen flex items-center justify-center px-4 py-24">
          <div className="max-w-md w-full">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-semibold text-white mb-2 tracking-tight">
                Choose your username
              </h2>
            </div>

            <div className="relative mb-4">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              {usernameStatus === 'available' && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-green-400">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              )}
              {usernameStatus === 'taken' && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-red-400">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
              )}
              {usernameStatus === 'checking' && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-600 border-t-blue-500" />
                </div>
              )}
            </div>
            {usernameError && (
              <p className="mb-6 text-sm text-red-400">{usernameError}</p>
            )}
            {usernameStatus === 'available' && (
              <p className="mb-6 text-sm text-green-400">Username is available!</p>
            )}

            <div className="flex gap-4">
              <button
                onClick={handleBack}
                className="px-6 py-3 text-slate-400 hover:text-white transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleContinue}
                disabled={loading || !canContinue()}
                className="ml-auto px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium hover:from-blue-500 hover:to-indigo-500 transition-all disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  </div>
                ) : (
                  'Start Learning →'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
