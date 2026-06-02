import { useState, useRef, useEffect } from "react"
import '../../styles/reply/ReplyForm.css'

const emojis = ["😀", "😂", "😍", "🤔", "👍", "👎", "❤️", "🔥", "🎉", "😢", "😡", "🙏"]

export default function Emoji({ onSelect }) {

    const [isOpen, setIsOpen] = useState(false)
    const ref = useRef(null)

    // Ferme la liste quand on clique en dehors
    useEffect(() => {
        function handleClickOutside(e) {
            if (ref.current && !ref.current.contains(e.target)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    return (
        <div className="emoji-picker" ref={ref}>
            <button type="button" onClick={() => setIsOpen(!isOpen)}>😊</button>
            {isOpen && (
                <div className="emoji-list">
                    {emojis.map(emoji => (
                        <span
                            key={emoji}
                            onClick={() => {
                                onSelect(emoji)
                                setIsOpen(false)
                            }}
                        >
                            {emoji}
                        </span>
                    ))}
                </div>
            )}
        </div>
    )
}