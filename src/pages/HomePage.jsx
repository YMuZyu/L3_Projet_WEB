import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import PostList from '../components/posts/PostList.jsx'
import FilterBar from '../components/filters/FilterBar.jsx'
import '../styles/pages/HomePage.css'

export default function HomePage({ isConnected }) {

    const navigate = useNavigate()
    const [posts, setPosts] = useState([])

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await fetch('http://localhost:10000/posts')
                if (response.ok) {
                    const data = await response.json()
                    setPosts(data.map(post => ({
                        id: post._id,
                        sujet: post.title,
                        contenu: post.content,
                        date: post.createdAt,
                        category: post.domain
                    })))
                }
            } catch (error) {
                console.error('Erreur lors du fetch des posts:', error)
            }
        }
        fetchPosts()
    }, [])

    const [search, setSearch] = useState("")
    const [category, setCategory] = useState("")
    const [sort, setSort] = useState("recent")

    const postsAffiches = posts
        .filter(p => p.sujet.toLowerCase().includes(search.toLowerCase()))
        .filter(p => category === "" || p.category === category)
        .sort((a, b) => {
            if (sort === "recent") return new Date(b.date) - new Date(a.date)
            if (sort === "ancien") return new Date(a.date) - new Date(b.date)
            if (sort === "alphabetique") return a.sujet.localeCompare(b.sujet)
            return 0
        })

    // on va faire en sorte que pour chaque objet crée, une catégorie est automatiquement crée dans CategoryFilter
    // donc on va faire une copie d'ensemble tel que pour chaque post on prend son category
    const categories = [...new Set(posts.map((post) => post.category))];
        
    return (
        <div className="home-page">

            <aside className="sidebar-left">
                <h3>Catégories</h3>
                <ul>
                    {categories.map(cat => (
                        <li
                            key={cat}
                            className={category === cat ? "active" : ""}
                            onClick={() => setCategory(category === cat ? "" : cat)}
                        >
                            {cat}
                        </li>
                    ))}
                </ul>
            </aside>

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