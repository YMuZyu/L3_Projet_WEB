import { useState, useRef, useEffect, useCallback } from 'react'
import '../../styles/shared/ImageCropper.css'

// shape : 'rect' (16:9 pour posts) ou 'circle' (avatar)
export default function ImageCropper({ shape = 'rect', onCrop, onCancel }) {
    const CONTAINER_W = shape === 'circle' ? 300 : 480
    const CONTAINER_H = shape === 'circle' ? 300 : 270
    const CROP_W     = shape === 'circle' ? 240 : 440
    const CROP_H     = shape === 'circle' ? 240 : 247
    const CROP_X     = (CONTAINER_W - CROP_W) / 2
    const CROP_Y     = (CONTAINER_H - CROP_H) / 2

    const [imgSrc,    setImgSrc]    = useState(null)
    const [natSize,   setNatSize]   = useState({ w: 1, h: 1 })
    const [dispSize,  setDispSize]  = useState({ w: 0, h: 0 })
    const [pan,       setPan]       = useState({ x: 0, y: 0 })
    const [dragging,  setDragging]  = useState(false)
    const [dragStart, setDragStart] = useState({ mx: 0, my: 0, px: 0, py: 0 })

    const overlayRef = useRef(null)

    // Dessine le masque semi-transparent avec la "fenêtre" de recadrage
    useEffect(() => {
        if (!imgSrc) return
        const canvas = overlayRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')
        ctx.clearRect(0, 0, CONTAINER_W, CONTAINER_H)

        ctx.fillStyle = 'rgba(0,0,0,0.55)'
        ctx.fillRect(0, 0, CONTAINER_W, CONTAINER_H)

        ctx.globalCompositeOperation = 'destination-out'
        if (shape === 'circle') {
            ctx.beginPath()
            ctx.arc(CONTAINER_W / 2, CONTAINER_H / 2, CROP_W / 2, 0, Math.PI * 2)
            ctx.fill()
        } else {
            ctx.fillRect(CROP_X, CROP_Y, CROP_W, CROP_H)
        }

        ctx.globalCompositeOperation = 'source-over'
        ctx.strokeStyle = 'white'
        ctx.lineWidth = 2
        if (shape === 'circle') {
            ctx.beginPath()
            ctx.arc(CONTAINER_W / 2, CONTAINER_H / 2, CROP_W / 2, 0, Math.PI * 2)
            ctx.stroke()
        } else {
            ctx.strokeRect(CROP_X, CROP_Y, CROP_W, CROP_H)
            // Lignes de règle (tiers)
            ctx.setLineDash([4, 4])
            ctx.lineWidth = 1
            ctx.strokeStyle = 'rgba(255,255,255,0.4)'
            for (let i = 1; i < 3; i++) {
                ctx.beginPath()
                ctx.moveTo(CROP_X + (CROP_W / 3) * i, CROP_Y)
                ctx.lineTo(CROP_X + (CROP_W / 3) * i, CROP_Y + CROP_H)
                ctx.stroke()
                ctx.beginPath()
                ctx.moveTo(CROP_X, CROP_Y + (CROP_H / 3) * i)
                ctx.lineTo(CROP_X + CROP_W, CROP_Y + (CROP_H / 3) * i)
                ctx.stroke()
            }
        }
    }, [imgSrc, shape, CONTAINER_W, CONTAINER_H, CROP_W, CROP_H, CROP_X, CROP_Y])

    const handleFile = (e) => {
        const file = e.target.files[0]
        if (!file) return
        const reader = new FileReader()
        reader.onload = (ev) => {
            const src = ev.target.result
            const img = new Image()
            img.onload = () => {
                const nat = { w: img.naturalWidth, h: img.naturalHeight }
                const scale = Math.max(CONTAINER_W / nat.w, CONTAINER_H / nat.h) * 1.05
                const disp = { w: nat.w * scale, h: nat.h * scale }
                setNatSize(nat)
                setDispSize(disp)
                setPan({ x: (CONTAINER_W - disp.w) / 2, y: (CONTAINER_H - disp.h) / 2 })
                setImgSrc(src)
            }
            img.src = src
        }
        reader.readAsDataURL(file)
    }

    const handleMouseDown = (e) => {
        e.preventDefault()
        setDragging(true)
        setDragStart({ mx: e.clientX, my: e.clientY, px: pan.x, py: pan.y })
    }

    const handleMouseMove = useCallback((e) => {
        if (!dragging) return
        setPan({
            x: dragStart.px + (e.clientX - dragStart.mx),
            y: dragStart.py + (e.clientY - dragStart.my)
        })
    }, [dragging, dragStart])

    const handleMouseUp = useCallback(() => setDragging(false), [])

    useEffect(() => {
        if (dragging) {
            window.addEventListener('mousemove', handleMouseMove)
            window.addEventListener('mouseup', handleMouseUp)
        }
        return () => {
            window.removeEventListener('mousemove', handleMouseMove)
            window.removeEventListener('mouseup', handleMouseUp)
        }
    }, [dragging, handleMouseMove, handleMouseUp])

    const handleCrop = () => {
        const scaleX = natSize.w / dispSize.w
        const scaleY = natSize.h / dispSize.h
        const srcX = (CROP_X - pan.x) * scaleX
        const srcY = (CROP_Y - pan.y) * scaleY
        const srcW = CROP_W  * scaleX
        const srcH = CROP_H  * scaleY

        const outW = shape === 'circle' ? 240 : 800
        const outH = shape === 'circle' ? 240 : 450
        const out  = document.createElement('canvas')
        out.width  = outW
        out.height = outH
        const ctx  = out.getContext('2d')

        if (shape === 'circle') {
            ctx.beginPath()
            ctx.arc(outW / 2, outH / 2, outW / 2, 0, Math.PI * 2)
            ctx.clip()
        }

        const img = new Image()
        img.onload = () => {
            ctx.drawImage(img, srcX, srcY, srcW, srcH, 0, 0, outW, outH)
            onCrop(out.toDataURL('image/jpeg', 0.88))
        }
        img.src = imgSrc
    }

    if (!imgSrc) {
        return (
            <div className="image-cropper-picker">
                <label className="cropper-file-label">
                    <span>Choisir une image</span>
                    <input type="file" accept="image/*" onChange={handleFile} />
                </label>
                {onCancel && (
                    <button type="button" className="cropper-cancel" onClick={onCancel}>
                        Annuler
                    </button>
                )}
            </div>
        )
    }

    return (
        <div className="image-cropper">
            <p className="cropper-hint">Glissez l'image pour ajuster le cadrage</p>
            <div
                className="cropper-viewport"
                style={{ width: CONTAINER_W, height: CONTAINER_H, cursor: dragging ? 'grabbing' : 'grab' }}
                onMouseDown={handleMouseDown}
            >
                <img
                    src={imgSrc}
                    alt=""
                    draggable={false}
                    style={{
                        position: 'absolute',
                        left: pan.x,
                        top:  pan.y,
                        width:  dispSize.w,
                        height: dispSize.h,
                        pointerEvents: 'none',
                        userSelect: 'none',
                    }}
                />
                <canvas
                    ref={overlayRef}
                    width={CONTAINER_W}
                    height={CONTAINER_H}
                    style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}
                />
            </div>
            <div className="cropper-actions">
                {onCancel && (
                    <button type="button" className="cropper-cancel" onClick={onCancel}>Annuler</button>
                )}
                <button type="button" className="cropper-confirm" onClick={handleCrop}>
                    Confirmer
                </button>
            </div>
        </div>
    )
}