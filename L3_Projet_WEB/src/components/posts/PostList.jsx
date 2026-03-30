import "./PostList.css"

export default function PostList({posts}){
    if(posts.length == 0){
        return (
            <div className="pas-post">
                Recherche non retrouvé
            </div>

        )
    }

    else{
        return (
            <div className="post-list">
                {posts.map((post)=>
                <article key = {post.id} className="post-card">
                    <div>
                        <span className="post-category">{post.category}</span>
                        <span className="post-date">{post.date}</span>
                    </div>
                    <h3>{post.sujet}</h3>
                    <p>{post.contenu}</p>
                    <button className="read-more">...</button>
                </article>
                )}
            </div>
        )
    }
}