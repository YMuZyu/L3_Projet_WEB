// Vue d'ensemble des catégories avec stats : nombre de posts, date du dernier post, auteur le plus actif
// Clic sur une carte : redirige vers HomePage avec le filtre de catégorie déjà appliqué

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/pages/CategoriesPage.css'

export default function CategoriesPage() {
    const [posts, setPosts] = useState([])
    const navigate = useNavigate()

    useEffect(() => {
        fetch('http://localhost:10000/posts', { credentials: 'include' })
            .then(r => r.json())
            .then(setPosts)
            .catch(console.error)
    }, [])

    // Catégories uniques
    const categories = [...new Set(posts.map(p => p.category).filter(Boolean))]

    // Calcule les stats d'une catégorie
    const getStats = (cat) => {
        const catPosts = posts.filter(p => p.category === cat)

        // Post le plus récent
        const latest = catPosts.sort((a, b) =>
            new Date(b.createdAt) - new Date(a.createdAt)
        )[0]

        // Auteur le plus actif
        const authorCount = {}
        catPosts.forEach(p => {
            authorCount[p.author] = (authorCount[p.author] || 0) + 1
        })
        const topAuthor = Object.entries(authorCount)
            .sort((a, b) => b[1] - a[1])[0]?.[0]

        return {
            count: catPosts.length,
            latestDate: latest?.createdAt,
            latestAuthor: latest?.author,
            topAuthor
        }
    }

    // Formate la date en "il y a X"
    const timeAgo = (date) => {
        if (!date) return ''
        const diff = Date.now() - new Date(date).getTime()
        const minutes = Math.floor(diff / 60000)
        const hours   = Math.floor(diff / 3600000)
        const days    = Math.floor(diff / 86400000)
        if (minutes < 60)  return `il y a ${minutes} min`
        if (hours < 24)    return `il y a ${hours}h`
        return `il y a ${days}j`
    }

    return (
        <div className="tags-page">
            <h2>🏷️ Catégories</h2>
            <p className="tags-subtitle">
                {categories.length} catégorie{categories.length > 1 ? 's' : ''} — cliquez pour explorer
            </p>

            {categories.length === 0
                ? <p className="empty">Aucune catégorie pour l'instant.</p>
                : <div className="categories-grid">
                    {categories.map((cat, i) => {
                        const stats = getStats(cat)
                        return (
                            <div
                                key={cat}
                                className={`category-card color-${(i % 6) + 1}`}
                                onClick={() => navigate(`/?cat=${encodeURIComponent(cat)}`)}
                            >
                                <div className="cat-top">
                                    <span className="cat-name">{cat}</span>
                                    <span className="cat-count">
                                        {stats.count} post{stats.count > 1 ? 's' : ''}
                                    </span>
                                </div>

                                {stats.latestDate && (
                                    <div className="cat-bottom">
                                        <span className="cat-latest">
                                            Dernier : {timeAgo(stats.latestDate)}
                                        </span>
                                        {stats.topAuthor && (
                                            <span className="cat-author">
                                                ✍️ {stats.topAuthor}
                                            </span>
                                        )}
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>
            }
        </div>
    )
}
