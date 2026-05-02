import { Space_Grotesk, Syne, DM_Mono, Barlow_Condensed, Bebas_Neue, Archivo_Black, IBM_Plex_Mono, Rajdhani, Outfit } from 'next/font/google'

const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--preview-space-grotesk' })
const syne = Syne({ subsets: ['latin'], variable: '--preview-syne' })
const dmMono = DM_Mono({ subsets: ['latin'], weight: ['400', '500'], variable: '--preview-dm-mono' })
const barlowCondensed = Barlow_Condensed({ subsets: ['latin'], weight: ['400', '600', '700', '800'], variable: '--preview-barlow' })
const bebasNeue = Bebas_Neue({ subsets: ['latin'], weight: '400', variable: '--preview-bebas' })
const archivoBl = Archivo_Black({ subsets: ['latin'], weight: '400', variable: '--preview-archivo' })
const ibmPlexMono = IBM_Plex_Mono({ subsets: ['latin'], weight: ['400', '500', '600'], variable: '--preview-ibm' })
const rajdhani = Rajdhani({ subsets: ['latin'], weight: ['400', '600', '700'], variable: '--preview-rajdhani' })
const outfit = Outfit({ subsets: ['latin'], variable: '--preview-outfit' })

const FONTS = [
  {
    name: 'Space Grotesk',
    variable: '--preview-space-grotesk',
    desc: 'Geometric grotesque with a technical edge. Ideal for navigation, body copy, and data tables.',
    tag: '⭐ TOP PICK – BODY + UI',
    tagColor: '#fff',
  },
  {
    name: 'Syne',
    variable: '--preview-syne',
    desc: 'Editorial and distinctive. Built for display — feels high-design without being decorative.',
    tag: '⭐ TOP PICK – HEADINGS',
    tagColor: '#fff',
  },
  {
    name: 'DM Mono',
    variable: '--preview-dm-mono',
    desc: 'Clean monospaced. Works beautifully for numeric data, IDs, and metadata labels.',
    tag: 'BEST FOR DATA / LABELS',
    tagColor: 'rgba(255,255,255,0.5)',
  },
  {
    name: 'Barlow Condensed',
    variable: '--preview-barlow',
    desc: 'Industrial condensed grotesque. Exceptional for uppercase tags, pills, and sidebar nav.',
    tag: 'BEST FOR TAGS + NAV',
    tagColor: 'rgba(255,255,255,0.5)',
  },
  {
    name: 'Bebas Neue',
    variable: '--preview-bebas',
    desc: 'All-caps display powerhouse. Maximum visual authority for page titles only.',
    tag: 'DISPLAY TITLES ONLY',
    tagColor: 'rgba(255,255,255,0.5)',
  },
  {
    name: 'Archivo Black',
    variable: '--preview-archivo',
    desc: 'Broad, forceful grotesque. Bold display with a poster-like industrial personality.',
    tag: 'ALTERNATIVE TO SYNE',
    tagColor: 'rgba(255,255,255,0.5)',
  },
  {
    name: 'IBM Plex Mono',
    variable: '--preview-ibm',
    desc: 'Terminal-grade monospace from IBM. Authoritative, technical, almost militaristic.',
    tag: 'TECHNICAL / TERMINAL',
    tagColor: 'rgba(255,255,255,0.5)',
  },
  {
    name: 'Rajdhani',
    variable: '--preview-rajdhani',
    desc: 'Technical and compact. Slightly futuristic — great for a data-intelligence system.',
    tag: 'FUTURISTIC FEEL',
    tagColor: 'rgba(255,255,255,0.5)',
  },
  {
    name: 'Outfit',
    variable: '--preview-outfit',
    desc: 'Clean, modern variable grotesque. Versatile fallback with excellent readability.',
    tag: 'MODERN / CLEAN',
    tagColor: 'rgba(255,255,255,0.5)',
  },
]

export default function FontPreviewPage() {
  return (
    <div
      className={[
        spaceGrotesk.variable,
        syne.variable,
        dmMono.variable,
        barlowCondensed.variable,
        bebasNeue.variable,
        archivoBl.variable,
        ibmPlexMono.variable,
        rajdhani.variable,
        outfit.variable,
      ].join(' ')}
      style={{ background: '#000', color: '#fff', minHeight: '100vh', padding: '60px 48px' }}
    >
      {/* Header */}
      <div style={{ borderBottom: '2px solid #fff', paddingBottom: '32px', marginBottom: '64px' }}>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.3em', opacity: 0.4, textTransform: 'uppercase', marginBottom: '12px' }}>
          FLODON CRM // TYPOGRAPHY SELECTION
        </p>
        <h1 style={{ fontFamily: 'var(--font-sans)', fontSize: '48px', fontWeight: 900, letterSpacing: '-2px', textTransform: 'uppercase', lineHeight: 1 }}>
          Font Previews
        </h1>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', opacity: 0.5, marginTop: '12px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          Each font shown in the exact contexts it would be used in the system
        </p>
      </div>

      {/* Font Cards */}
      <div style={{ display: 'grid', gap: '48px' }}>
        {FONTS.map((font) => (
          <div
            key={font.name}
            style={{
              border: '2px solid rgba(255,255,255,0.15)',
              padding: '40px',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '40px',
              alignItems: 'start',
            }}
          >
            {/* Left: Meta */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <p style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '9px',
                  letterSpacing: '0.25em',
                  textTransform: 'uppercase',
                  color: font.tagColor,
                  border: `1px solid ${font.tagColor}`,
                  padding: '3px 8px',
                  whiteSpace: 'nowrap',
                }}>
                  {font.tag}
                </p>
              </div>
              <p style={{
                fontFamily: `var(${font.variable})`,
                fontSize: '32px',
                fontWeight: 700,
                letterSpacing: '-0.5px',
                marginBottom: '12px',
                lineHeight: 1.1,
              }}>
                {font.name}
              </p>
              <p style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '12px',
                opacity: 0.55,
                lineHeight: 1.7,
                letterSpacing: '0.03em',
                maxWidth: '340px',
              }}>
                {font.desc}
              </p>
            </div>

            {/* Right: Live Context Preview */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* As a page title */}
              <div style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '16px' }}>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '8px', opacity: 0.3, letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: '6px' }}>AS PAGE TITLE</p>
                <p style={{ fontFamily: `var(${font.variable})`, fontSize: '36px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '-1px', lineHeight: 1 }}>
                  Sales Analytics
                </p>
              </div>
              {/* As nav item */}
              <div style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '16px' }}>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '8px', opacity: 0.3, letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: '8px' }}>AS NAV + LABELS</p>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {['Database', 'Comm Link', 'Overview', 'Employees'].map(item => (
                    <span key={item} style={{
                      fontFamily: `var(${font.variable})`,
                      fontSize: '11px',
                      fontWeight: 700,
                      letterSpacing: '0.15em',
                      textTransform: 'uppercase',
                      border: '1.5px solid rgba(255,255,255,0.3)',
                      padding: '5px 12px',
                    }}>
                      {item}
                    </span>
                  ))}
                </div>
              </div>
              {/* As body / data */}
              <div>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '8px', opacity: 0.3, letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: '8px' }}>AS DATA ROW</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                  {[['Raj Mehta', 'Contacted', 'SolarTech Inc.'], ['Ayaan Shah', 'Proposal', 'NovaBuild'], ['Priya Joshi', 'Won', 'FlowCorp']].map(([name, stage, brand]) => (
                    <div key={name} style={{ borderLeft: '2px solid rgba(255,255,255,0.2)', paddingLeft: '10px' }}>
                      <p style={{ fontFamily: `var(${font.variable})`, fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{name}</p>
                      <p style={{ fontFamily: `var(${font.variable})`, fontSize: '10px', opacity: 0.5, textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '2px' }}>{brand}</p>
                      <p style={{ fontFamily: `var(${font.variable})`, fontSize: '9px', letterSpacing: '0.2em', marginTop: '6px', border: '1px solid rgba(255,255,255,0.2)', display: 'inline-block', padding: '1px 6px', textTransform: 'uppercase' }}>{stage}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer note */}
      <div style={{ marginTop: '80px', borderTop: '2px solid rgba(255,255,255,0.1)', paddingTop: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', opacity: 0.3, letterSpacing: '0.3em', textTransform: 'uppercase' }}>
          FLODON CRM // TEMP PREVIEW PAGE // DELETE AFTER SELECTION
        </p>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: '9px', opacity: 0.3, letterSpacing: '0.2em', textTransform: 'uppercase' }}>
          /font-preview
        </p>
      </div>
    </div>
  )
}
