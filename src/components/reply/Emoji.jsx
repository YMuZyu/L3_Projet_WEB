import { useState } from "react"
import '../../styles/reply/ReplyForm.css'

const emojis = ["😀", "😂", "😍", "🤔", "👍", "👎", "❤️", "🔥", "🎉", "😢", "😡", "🙏"]

export default function Emoji({ onSelect }) {

    const [isOpen, setIsOpen] = useState(false)

    return (
        <div className="emoji-picker">
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