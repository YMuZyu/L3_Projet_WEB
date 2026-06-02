// Formulaire pour écrire un commentaire avec sélecteur d'emojis

import { useState } from "react"
import Emoji from "./Emoji.jsx"
import '../../styles/reply/ReplyForm.css'

export default function ReplyForm({ postId, onSubmit, user }) {

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
            const response = await fetch(`http://localhost:10000/posts/${postId}/replies`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ content })
            })

            const data = await response.json()

            if (response.ok) {
                onSubmit(data)
                setContent("") // vider le champ après envoi
            } else {
                setError(data.message || "Erreur lors de l'envoi")
            }

        } catch (err) {
            setError("Erreur serveur")
            console.error(err)
        }
    }

    // Ajoute l'emoji à la fin du texte en cours
    const handleEmojiSelect = (emoji) => {
        setContent(prev => prev + emoji)
    }

    return (
        <form className="reply-form" onSubmit={handleSubmit}>
            <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Écrire un commentaire..."
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