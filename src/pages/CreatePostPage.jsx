import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/pages/CreatePostPage.css'

export default function CreatePostPage({ isConnected }) {
    const navigate = useNavigate()

    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [category, setCategory] = useState('')
    const [error, setError] = useState('')

    if (!isConnected) {
        return (
            <div className="create-post-page">
                <p>Vous devez être connecté pour créer un post.</p>
                <button onClick={() => navigate('/login')}>Se connecter</button>
            </div>
        )
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')

        if (!title || !content || !domain) {
            setError('Veuillez remplir tous les champs')
            return
        }

        try {
            const response = await fetch('http://localhost:10000/posts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ title, content, category })
            })

            const data = await response.json()

            if (response.ok) {
                navigate('/')
            } else if (response.status === 401) {
                setError(data.message || 'Vous devez être connecté pour créer un post')
            } else {
                setError(data.message || 'Erreur lors de la création du post')
            }

        } catch (err) {
            setError('Erreur serveur')
            console.error(err)
        }
    }

    return (
        <div className="create-post-page">
            <h2>Créer un nouveau sujet</h2>
            <form onSubmit={handleSubmit} className="create-post-form">

                <div className="form-group">
                    <label htmlFor="title">Titre du sujet</label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Titre de votre sujet"
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="category">Catégorie</label>
                    <input
                        type="text"
                        id="category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        placeholder="Ex: Python, JavaScript, Java..."
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="content">Contenu</label>
                    <textarea
                        id="content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Décrivez votre sujet..."
                        rows={8}
                        required
                    />
                </div>

                {error && <p className="error">{error}</p>}

                <div className="form-actions">
                    <button type="button" onClick={() => navigate('/')}>Annuler</button>
                    <button type="submit">Créer le post</button>
                </div>

            </form>
        </div>
    )
}