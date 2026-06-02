import { useState } from "react"
import Emoji from "./Emoji.jsx"
import '../../styles/reply/ReplyForm.css'

export default function ReplyForm({ postId, onSubmit, user, parentReply, onCancelReply }) {

    const [content, setContent] = useState("")
    const [error, setError] = useState("")

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError("")

        if (!content.trim()) {
            setError("Le commentaire ne peut pas être vide")
            return
        }

        try {
            const body = { content }
            if (parentReply?._id) body.parentReplyId = parentReply._id

            const response = await fetch(`http://localhost:10000/posts/${postId}/replies`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(body)
            })

            const data = await response.json()

            if (response.ok) {
                onSubmit(data)
                setContent("")
                onCancelReply?.()
            } else {
                setError(data.message || "Erreur lors de l'envoi")
            }

        } catch (err) {
            setError("Erreur serveur")
            console.error(err)
        }
    }

    const handleEmojiSelect = (emoji) => {
        setContent(prev => prev + emoji)
    }

    return (
        <form className="reply-form" onSubmit={handleSubmit}>
            {/* Aperçu de la réponse citée */}
            {parentReply && (
                <div className="reply-quote-preview">
                    <span className="reply-quote-author">↩ {parentReply.author}</span>
                    <span className="reply-quote-content">
                        {parentReply.content?.length > 100
                            ? parentReply.content.substring(0, 100) + '...'
                            : parentReply.content}
                    </span>
                    <button type="button" className="reply-quote-cancel" onClick={onCancelReply}>✕</button>
                </div>
            )}
            <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={parentReply ? `Répondre à ${parentReply.author}...` : "Écrire un commentaire..."}
                rows={3}
            />
            <div className="reply-form-footer">
                <Emoji onSelect={handleEmojiSelect} />
                {error && <p className="error">{error}</p>}
                <button type="submit">Envoyer</button>
            </div>
        </form>
    )
}
