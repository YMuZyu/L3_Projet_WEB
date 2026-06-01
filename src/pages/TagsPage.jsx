import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import PostCard from '../components/posts/PostCard.jsx'
import '../styles/pages/TagsPage.css'

export default function TagsPage() {
    const [posts, setPosts] = useState([])
    const [searchParams, setSearchParams] = useSearchParams()
    const selectedCat = searchParams.get('cat')

    useEffect(() => {
        fetch('http://localhost:10000/posts')
            .then(r => r.json())
            .then(setPosts)
            .catch(console.error)
    }, [])

    const categories = [...new Set(posts.map(p => p.category).filter(Boolean))]

    const postsFiltered = selectedCat
        ? posts.filter(p => p.category === selectedCat)
        : []

    if (selectedCat) {
        return (
            <div className="tags-page">
                <div className="tags-header">
                    <button className="back-btn" onClick={() => setSearchParams({})}>
                        ← Toutes les catégories
                    </button>
                    <h2>{selectedCat}</h2>
                    <span className="count">{postsFiltered.length} post{postsFiltered.length > 1 ? 's' : ''}</span>
                </div>

                {postsFiltered.length === 0
                    ? <p className="empty">Aucun post dans cette catégorie.</p>
                    : <div className="post-list">
                        {postsFiltered.map(post => (
                            <PostCard key={post._id} post={post} />
                        ))}
                    </div>
                }
            </div>
        )
    }

    return (
        <div className="tags-page">
            <h2>Catégories</h2>
            {categories.length === 0
                ? <p className="empty">Aucune catégorie pour l'instant.</p>
                : <div className="categories-grid">
                    {categories.map(cat => {
                        const nbPosts = posts.filter(p => p.category === cat).length
                        return (
                            <div
                                key={cat}
                                className="category-card"
                                onClick={() => setSearchParams({ cat })}
                            >
                                <span className="cat-name">{cat}</span>
                                <span className="cat-count">{nbPosts} post{nbPosts > 1 ? 's' : ''}</span>
                            </div>
                        )
                    })}
                </div>
            }
        </div>
    )
}
