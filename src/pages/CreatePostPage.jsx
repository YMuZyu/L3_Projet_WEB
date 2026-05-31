import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/pages/CreatePostPage.css';

export default function CreatePostPage() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [domain, setDomain] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:10000/posts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ title, content, domain }),
            });
            const data = await response.json();
            if (response.ok) {
                setTitle('');
                setContent('');
                setDomain('');
                navigate('/');
            } else if (response.status === 401) {
                alert(data.message || 'Vous devez être connecté pour créer un post');
            } else {
                alert(data.message || 'Erreur lors de la création du post');
            }
        } catch (error) {
            console.error('Erreur:', error);
            alert('Erreur serveur');
        }
    };

    return (
        <div className="create-post-page">
            <h2>Créer un nouveau sujet</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="title">Nom du sujet:</label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="content">Contenu:</label>
                    <textarea
                        id="content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="domain">Catégorie:</label>
                    <input
                        type="text"
                        id="domain"
                        value={domain}
                        onChange={(e) => setDomain(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Créer</button>
            </form>
        </div>
    );
}