import { useState } from "react";
import PostList from '../../posts/PostList'
import FilterBar from '../../filter/FilterBar'

function HomePage(){

    const [posts, setPosts] = useState([
        { id: 1, sujet: "Sujet 1", contenu: "Contenu du message 1", category: "Economie" },
        { id: 2, sujet: "Sujet 2", contenu: "Contenu du message 2", category: "Sport" },
        { id: 3, sujet: "Sujet 3", contenu: "Contenu du message 3", category: "Informatique" }
    ])

    return (
        <main className="contenu-principal">
            <FilterBar setPosts={setPosts} />
            <PostList posts={posts} />
        </main>
    )
   
}

export default HomePage