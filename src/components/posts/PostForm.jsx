import { useState } from 'react'
import '../../styles/post/PostForm.css'

const CATEGORIES = ['Python', 'JavaScript', 'Java', 'C/C++', 'SQL', 'Autre']

export default function PostForm({ onSubmit }) {
    const [title, setTitle]       = useState('')
    const [category, setCategory] = useState('')
    const [content, setContent]   = useState('')

    const handleSubmit = (e) => {
        e.preventDefault()
        if (!title.trim() || !content.trim()) return
        onSubmit({ title, category, content })
    }

    return (
        <form className="post-form" onSubmit={handleSubmit}>
            <input
                className="post-form-input"
                type="text"
                placeholder="Titre de votre question"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />
            <select
                className="post-form-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
            >
                <option value="">Choisir une catégorie</option>
                {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                ))}
            </select>
            <textarea
                className="post-form-textarea"
                placeholder="Décrivez votre question en détail..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={8}
            />
            <button className="post-form-submit" type="submit">
                Publier la question
            </button>
        </form>
    )
}