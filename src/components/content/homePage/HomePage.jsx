import { useState, useEffect } from "react";
import PostList from '../../posts/PostList'
import FilterBar from '../../filter/FilterBar'

import "./HomePage.css"

export default function HomePage(){

    const [posts, setPosts] = useState([])

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await fetch('http://localhost:10000/posts');
                if (response.ok) {
                    const data = await response.json();
                    setPosts(data.map(post => ({
                        id: post._id,
                        sujet: post.title,
                        contenu: post.content,
                        date: post.createdAt,
                        category: post.domain
                    })));
                }
            } catch (error) {
                console.error('Erreur lors du fetch des posts:', error);
            }
        };
        fetchPosts();
    }, []);

    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("");
    const [sort, setSort] = useState("recent");

    // mecanisme de triage :
    const postsAffiches = posts
    .filter(p => p.sujet.toLowerCase().includes(search.toLowerCase()))
    .filter(p => category === "" || p.category === category)
    .sort((a, b) => {
            if (sort === "recent") {
                return new Date(b.date) - new Date(a.date); // Plus récent d'abord
            } else if (sort === "ancien") {
                return new Date(a.date) - new Date(b.date); // Plus ancien d'abord
            } else if (sort === "alphabetique") {
                return a.sujet.localeCompare(b.sujet); // A-Z
            }
            return 0;
        });


    // on va faire en sorte que pour chaque objet crée, une catégorie est automatiquement crée dans CategoryFilter
    // donc on va faire une copie d'ensemble tel que pour chaque post on prend son category
    const categories = [...new Set(posts.map((post) => post.category))];
        
    return (
        <main className="homepage">
            <FilterBar 
                setSearch={setSearch} 
                setCategory={setCategory} 
                setSort={setSort}
                activeCategory={category}
                categories={categories}
            />
            <PostList posts={postsAffiches} />
        </main>
    )
   
}