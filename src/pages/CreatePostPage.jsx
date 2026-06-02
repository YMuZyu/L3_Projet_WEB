import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ImageCropper from '../components/shared/ImageCropper.jsx'
import '../styles/pages/CreatePostPage.css'

export default function CreatePostPage({ isConnected }) {
    const navigate = useNavigate()

    const [title,        setTitle]        = useState('')
    const [content,      setContent]      = useState('')
    const [category,     setCategory]     = useState('')
    const [imageBase64,  setImageBase64]  = useState(null)
    const [showCropper,  setShowCropper]  = useState(false)
    const [error,        setError]        = useState('')

    if (!isConnected) {
        return (
            <div className="create-post-page">
                <p>Vous devez être connecté pour créer un post.</p>
                <button onClick={() => navigate('/login')}>Se connecter</button>
            </div>
        )
    }

    const handleCrop = (base64) => {
        setImageBase64(base64)
        setShowCropper(false)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')

        if (!title || !content || !category) {
            setError('Veuillez remplir tous les champs')
            return
        }

        try {
            const response = await fetch('/posts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ title, content, category, imageBase64 })
            })
            const data = await response.json()

            if (response.ok) {
                navigate('/')
            } else if (response.status === 401) {
                setError(data.message || 'Vous devez être connecté')
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
                        placeholder="Ex: Economie, Informatique, Beauté..."
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

                <div className="form-group">
                    <label>Image (optionnelle)</label>
                    {imageBase64 ? (
                        <div className="image-preview-box">
                            <img src={imageBase64} alt="Aperçu" />
                            <button type="button" onClick={() => { setImageBase64(null); setShowCropper(false) }}>
                                Supprimer l'image
                            </button>
                        </div>
                    ) : showCropper ? (
                        <ImageCropper
                            shape="rect"
                            onCrop={handleCrop}
                            onCancel={() => setShowCropper(false)}
                        />
                    ) : (
                        <button type="button" className="add-image-btn" onClick={() => setShowCropper(true)}>
                            📷 Ajouter une image
                        </button>
                    )}
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