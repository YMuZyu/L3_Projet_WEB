// Page d'accueil : affiche le forum ouvert avec les posts, les filtres et les catégories
// Accessible à tous, mais seuls les membres connectés peuvent créer un post

import { useState, useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import PostList from '../components/posts/PostList.jsx'
import FilterBar from '../components/filters/FilterBar.jsx'
import '../styles/pages/HomePage.css'

export default function HomePage({ isConnected, user }) {

    const navigate = useNavigate()
    const [posts, setPosts] = useState([])
    const [forumOpen, setForumOpen] = useState(true)

    // Récupère tous les posts au chargement de la page
    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await fetch('http://localhost:10000/posts', {
                    credentials: 'include'
                })
                if (response.ok) {
                    const data = await response.json()
                    setPosts(data)
                }
            } catch (error) {
                console.error('Erreur lors du fetch des posts:', error)
            }
        }
        fetchPosts();

        const checkForumStatus = async () => {
            try {
                const res = await fetch('http://localhost:10000/admin/forum-status')
                if (res.ok) {
                    const data = await res.json()
                    setForumOpen(data.isOpen)
                }
            } catch {}
        }
        checkForumStatus()
    }, [])

    // États pour les filtres
    const [search, setSearch] = useState("")
    const [author, setAuthor] = useState("")
    const [searchParams] = useSearchParams()
    const [category, setCategory] = useState(searchParams.get('cat') || "")
    const [sort, setSort] = useState("recent")

    // Filtre et trie les posts selon les critères choisis par l'utilisateur
    const postsAffiches = posts
        .filter(p => p.title?.toLowerCase().includes(search.toLowerCase()))
        .filter(p => !author || p.author?.toLowerCase().includes(author.toLowerCase()))
        .filter(p => category === "" || p.category === category)
        .sort((a, b) => {
            if (sort === "recent") return new Date(b.createdAt) - new Date(a.createdAt)
            if (sort === "ancien") return new Date(a.createdAt) - new Date(b.createdAt)
            if (sort === "alphabetique") return a.title?.localeCompare(b.title)
            return 0
    })

    const categories = [...new Set(posts.map(post => post.category))]

    // 8 catégories avec le plus de posts pour la sidebar
    const topCategories = [...categories]
        .sort((a, b) =>
            posts.filter(p => p.category === b).length -
            posts.filter(p => p.category === a).length
        )
        .slice(0, 8)

    if (!forumOpen) {
        return (
            <div className="forum-closed">
                <h2>🔒 Forum temporairement fermé</h2>
                <p>Le forum est actuellement fermé par un administrateur. Revenez plus tard.</p>
            </div>
        )
    }

    return (
        <div className="home-page">

            {/* Sidebar gauche : top 8 catégories cliquables */}
            <aside className="sidebar-left">
                <h3>Catégories</h3>
                <ul>
                    {topCategories.map(cat => (
                        <li
                            key={cat}
                            className={category === cat ? "active" : ""}
                            onClick={() => setCategory(category === cat ? "" : cat)}
                        >
                            <span>{cat}</span>
                            <span className="sidebar-cat-count">
                                {posts.filter(p => p.category === cat).length}
                            </span>
                        </li>
                    ))}
                </ul>
            </aside>

            {/* Zone centrale : barre de filtres + liste des posts */}
            <div className="feed">
                <FilterBar
                    setSearch={setSearch}
                    setAuthor={setAuthor}
                    setCategory={setCategory}
                    setSort={setSort}
                    activeCategory={category}
                    categories={categories}
                />
                <PostList posts={postsAffiches} />
            </div>

            {/* Sidebar droite */}
            <aside className="sidebar-right">

                {/* Widget bienvenue */}
                <div className="sidebar-widget">
                    {isConnected ? (
                        <>
                            <h3>👋 Bonjour, {user?.login} !</h3>
                            <button onClick={() => navigate("/create")}>➕ Créer un post</button>
                            <button onClick={() => navigate(`/profile/${user?._id}`)}>👤 Mon profil</button>
                        </>
                    ) : (
                        <>
                            <h3>Bienvenue</h3>
                            <p>Rejoignez la communauté et participez aux discussions.</p>
                            <button onClick={() => navigate("/login")}>Se connecter</button>
                            <button onClick={() => navigate("/register")}>S'inscrire</button>
                        </>
                    )}
                </div>

                {/* Widget posts populaires */}
                <div className="sidebar-widget">
                    <h3>🔥 Posts populaires</h3>
                    {[...posts]
                        .sort((a, b) => (b.likes?.length ?? 0) - (a.likes?.length ?? 0))
                        .slice(0, 3)
                        .map(post => (
                            <div
                                key={post._id}
                                className="popular-post"
                                onClick={() => navigate(`/post/${post._id}`)}
                            >
                                <span className="popular-post-title">{post.title}</span>
                                <span className="popular-post-likes">❤️ {post.likes?.length ?? 0}</span>
                            </div>
                        ))
                    }
                </div>

            </aside>

        </div>
    )
}
