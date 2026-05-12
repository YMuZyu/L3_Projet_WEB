import { useState } from "react";
import "./PostList.css"

export default function PostList({posts}){
    const [expandedPost, setExpandedPost] = useState(null);

    const closeModal = () => setExpandedPost(null);

    if(posts.length == 0){
        return (
            <div className="pas-post">
                Recherche non retrouvé
            </div>
        )
    }

    return (
        <>
            <div className="post-list">
                {posts.map((post)=>(
                <article
                    key={post.id}
                    className="post-card"
                >
                    <div>
                        <span className="post-category">{post.category}</span>
                        <span className="post-date">{post.date}</span>
                    </div>
                    <h3>{post.sujet}</h3>
                    <p>{post.contenu}</p>
                    <button className="read-more" onClick={() => setExpandedPost(post)}>...</button>
                </article>
                ))}
            </div>

            {expandedPost && (
                <div className="post-modal" onClick={(event) => event.target === event.currentTarget && closeModal()}>
                    <div className="post-modal-card">
                        <div className="post-modal-body">
                            <div className="post-modal-header">
                                <span className="post-category">{expandedPost.category}</span>
                                <span className="post-date">{expandedPost.date}</span>
                            </div>
                            <h2>{expandedPost.sujet}</h2>
                            <p>{expandedPost.contenu}</p>
                            <button className="read-more" onClick={closeModal}>Fermer</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}