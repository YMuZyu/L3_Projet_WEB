// Page d'accueil : affiche le forum ouvert avec les posts, les filtres et les catégories
// Accessible à tous, mais seuls les membres connectés peuvent créer un post

import { useState, useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import PostList from '../components/posts/PostList.jsx'
import FilterBar from '../components/filters/FilterBar.jsx'
import '../styles/pages/HomePage.css'

export default function HomePage({ isConnected }) {

    const navigate = useNavigate()
    const [posts, setPosts] = useState([])

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
        fetchPosts()
    }, [])

    // États pour les filtres
    const [search, setSearch] = useState("")
    const [searchParams] = useSearchParams()
    const [category, setCategory] = useState(searchParams.get('cat') || "")
    const [sort, setSort] = useState("recent")

    // Filtre et trie les posts selon les critères choisis par l'utilisateur
    const postsAffiches = posts
        .filter(p => p.title?.toLowerCase().includes(search.toLowerCase()))
        .filter(p => category === "" || p.category === category)
        .sort((a, b) => {
            if (sort === "recent") return new Date(b.createdAt) - new Date(a.createdAt)
            if (sort === "ancien") return new Date(a.createdAt) - new Date(b.createdAt)
            if (sort === "alphabetique") return a.title?.localeCompare(b.title)
            return 0
    })

    // On va faire en sorte que pour chaque objet crée, une catégorie est automatiquement crée dans CategoryFilter
    // donc on va faire une copie d'ensemble tel que pour chaque post on prend son category
    const categories = [...new Set(posts.map(post => post.category))]
        
    return (
        <div className="home-page">

            {/* Sidebar gauche : liste des catégories cliquables */}
            <aside className="sidebar-left">
                <h3>Catégories</h3>
                <ul>
                    {categories.map(cat => (
                        <li
                            key={cat}
                            className={category === cat ? "active" : ""}
                            // Clic sur une catégorie déjà active la désélectionne
                            onClick={() => setCategory(category === cat ? "" : cat)}
                        >
                            {cat}
                        </li>
                    ))}
                </ul>
            </aside>

            {/* Zone centrale : barre de filtres + liste des posts */}
            <div className="feed">
                <FilterBar
                    setSearch={setSearch}
                    setCategory={setCategory}
                    setSort={setSort}
                    activeCategory={category}
                    categories={categories}
                />
                <PostList posts={postsAffiches} />
            </div>

            {/* Sidebar droite : widget bienvenue avec bouton selon l'état de connexion */}
            <aside className="sidebar-right">
                <div className="sidebar-widget">
                    <h3>Bienvenue</h3>
                    <p>Rejoignez la communauté et participez aux discussions.</p>
                    {isConnected
                        ? <button onClick={() => navigate("/create")}>Créer un post</button>
                        : <button onClick={() => navigate("/login")}>Se connecter</button>
                    }
                </div>
            </aside>

        </div>
    )
}