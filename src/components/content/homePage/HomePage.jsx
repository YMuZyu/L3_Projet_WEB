import { useState } from "react";
import PostList from '../../posts/PostList'
import FilterBar from '../../filter/FilterBar'

import "./HomePage.css"

export default function HomePage(){

    const [posts, setPosts] = useState([
        { id: 1, sujet: "Sujet 1", contenu: "Contenu du message 1", date: "2024-03-01", category: "Economie" },
        { id: 2, sujet: "Sujet 2", contenu: "Contenu du message 2", date: "2024-03-05", category: "Sport" },
        { id: 3, sujet: "Sujet 3", contenu: "Contenu du message 3", date: "2024-03-02", category: "Informatique" }
    ])

    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("");
    const [sort, setSort] = useState("recent");

    // mecanisme de triage :
    const postsAffiché = posts
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
        <main className="contenu-principal">
            <FilterBar 
                setSearch={setSearch} 
                setCategory={setCategory} 
                setSort={setSort}
                activeCategory={category}
                categories={categories}
            />
            <PostList posts={postsAffiché} />
        </main>
    )
   
}