import React, { useState, useRef } from 'react'
import AventoDashboardScreen from './AventoDashboardScreen'

export default function MacbookMockup3D({ 
  className = ''
}) {
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 })
  const containerRef = useRef(null)

  const handleMouseMove = (e) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 4 // gentle mouse response
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -3
    setMouseOffset({ x, y })
  }

  const handleMouseLeave = () => {
    setMouseOffset({ x: 0, y: 0 })
  }

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ 
        perspective: '1800px',
        transformStyle: 'preserve-3d'
      }}
      className={`relative w-full max-w-[700px] xl:max-w-[760px] select-none py-4 group ${className}`}
    >
      {/* 4. 3D Transform: rotateY(-12deg) rotateX(8deg) rotateZ(-2deg) with perspective: 1800px */}
      <div 
        className="relative transition-transform duration-500 ease-out"
        style={{
          transformStyle: 'preserve-3d',
          transform: `rotateY(${-12 + mouseOffset.x}deg) rotateX(${8 + mouseOffset.y}deg) rotateZ(-2deg)`
        }}
      >
        {/* ================= MACBOOK DISPLAY (LID) ================= */}
        <div 
          style={{
            boxShadow: '0 90px 120px rgba(0,0,0,0.18), 0 40px 60px rgba(0,0,0,0.12), 0 15px 25px rgba(0,0,0,0.08)'
          }}
          className="relative mx-auto rounded-[24px] p-[10px] bg-gradient-to-b from-[#363F47] via-[#242A31] to-[#15191D] border-t border-white/30"
        >
          
          {/* Outer Screen Bezel */}
          <div className="relative rounded-[17px] overflow-hidden bg-[#0A0D0F] p-[7px] shadow-inner">
            
            {/* Top Center Camera Notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 z-30 w-28 h-3.5 bg-[#0A0D0F] rounded-b-xl flex items-center justify-center gap-2 border-b border-x border-[#242B33]/60">
              {/* Camera Lens */}
              <div className="w-2 h-2 rounded-full bg-[#05080A] border border-[#2A363E] flex items-center justify-center">
                <span className="w-1 h-1 rounded-full bg-[#184E38] shadow-[0_0_4px_#4ADE80]"></span>
              </div>
              {/* Ambient Light Sensor */}
              <div className="w-1 h-1 rounded-full bg-[#1A2026]"></div>
            </div>

            {/* Screen Content Frame: 6. brightness(1.03) contrast(1.05) saturate(1.08) and subtle inner shadow */}
            <div 
              style={{
                filter: 'brightness(1.03) contrast(1.05) saturate(1.08)',
                boxShadow: 'inset 0 0 10px rgba(0, 0, 0, 0.4)'
              }}
              className="relative rounded-[11px] overflow-hidden aspect-[16/10] bg-[#0A1411] border border-black/40"
            >
              <AventoDashboardScreen />

              {/* Glossy Screen Glare / Specular Sheen */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.04] to-white/[0.10] pointer-events-none"></div>
            </div>

            {/* Bottom Screen Lip Logo Spot */}
            <div className="h-2 flex items-center justify-center">
              <span className="text-[8.5px] tracking-[0.25em] text-[#6B7280]/60 font-semibold uppercase">MacBook Pro</span>
            </div>
          </div>
        </div>

        {/* ================= MACBOOK HINGE & LOWER BASE CHASSIS ================= */}
        <div className="relative -mt-2.5 mx-auto w-[105%] -left-[2.5%]">
          {/* Hinge connector */}
          <div className="mx-auto w-[340px] h-[6px] bg-gradient-to-r from-[#12161A] via-[#323942] to-[#12161A] rounded-t-sm shadow-inner border-t border-white/10"></div>

          {/* Perspective Keyboard Deck Sliver */}
          <div className="mx-auto w-[92%] h-[9px] bg-gradient-to-b from-[#1C2227] to-[#13171A] border-t border-white/15 px-8 flex items-center justify-between opacity-90 shadow-inner">
            {/* Left speaker grill reflection */}
            <div className="w-16 h-[2px] bg-white/10 rounded-full"></div>
            {/* Center keybed row shadow */}
            <div className="flex items-center gap-1.5">
              {[...Array(11)].map((_, i) => (
                <span key={i} className="w-4 h-[2.5px] bg-[#0A0D0F] rounded-[1px] border-t border-white/5 inline-block"></span>
              ))}
            </div>
            {/* Right speaker grill reflection */}
            <div className="w-16 h-[2px] bg-white/10 rounded-full"></div>
          </div>

          {/* Lower Chassis Aluminum Base Body */}
          <div className="relative h-4.5 rounded-b-[20px] bg-gradient-to-b from-[#313941] via-[#242A31] to-[#14181C] border-t border-white/25 shadow-[0_20px_40px_rgba(0,0,0,0.4)] px-5 flex items-start justify-center">
            
            {/* Front Opening Thumb Scoop / Indent with Metallic Bevel */}
            <div className="w-28 h-2 bg-[#12161A] rounded-b-md border-b border-white/15 shadow-inner"></div>

            {/* Chamfered Metallic Edge Light Specular Strip */}
            <div className="absolute inset-x-3 bottom-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/40 to-transparent"></div>
          </div>

          {/* Chassis Under-Shadow / Ambient Occlusion */}
          <div className="h-3 mx-8 bg-black/75 blur-xs rounded-full"></div>
        </div>

      </div>

      {/* ================= 3D SOFT PREMIUM CONTACT & AMBIENT SHADOWS ================= */}
      <div className="relative -mt-2.5 w-[96%] mx-auto pointer-events-none">
        {/* Core Sharp Occlusion Shadow under the bottom rim */}
        <div className="w-[85%] mx-auto h-4 bg-black/60 blur-xs rounded-[100%]"></div>

        {/* Mid Occlusion Shadow */}
        <div className="w-[94%] mx-auto h-10 bg-gradient-to-r from-transparent via-black/30 to-transparent blur-md rounded-[100%] -mt-2 transform -rotate-[0.5deg]"></div>
        
        {/* Ambient Floor Spread Shadow */}
        <div className="w-[110%] -ml-[5%] h-16 bg-gradient-to-r from-transparent via-black/20 to-transparent blur-xl rounded-[100%] -mt-5"></div>
      </div>
    </div>
  )
}
