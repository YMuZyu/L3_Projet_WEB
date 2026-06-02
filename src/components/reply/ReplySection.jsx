import { useState } from 'react'
import ReplyList from "./ReplyList.jsx"
import ReplyForm from "./ReplyForm.jsx"
import '../../styles/reply/ReplySection.css'

export default function ReplySection({ postId, replies, setReplies, user, isConnected }) {

    const [replyTarget, setReplyTarget] = useState(null)
    const [authorSearch, setAuthorSearch] = useState("")

    const handleNewReply = (newReply) => {
        setReplies(prev => [...prev, newReply])
        setReplyTarget(null)
    }

    const handleDelete = (replyId) => {
        setReplies(prev => prev.filter(r => r._id?.toString() !== replyId?.toString()))
    }

    const filteredReplies = authorSearch
        ? replies.filter(r => r.author?.toLowerCase().includes(authorSearch.toLowerCase()))
        : replies

    return (
        <div className="reply-section">
            <div className="reply-section-header">
                <h3>{replies.length} commentaire{replies.length > 1 ? "s" : ""}</h3>
                <input
                    type="text"
                    className="reply-author-search"
                    placeholder="👤 Filtrer par auteur..."
                    value={authorSearch}
                    onChange={e => setAuthorSearch(e.target.value)}
                />
            </div>

            {isConnected
                ? <ReplyForm
                    postId={postId}
                    onSubmit={handleNewReply}
                    user={user}
                    parentReply={replyTarget}
                    onCancelReply={() => setReplyTarget(null)}
                  />
                : <p className="reply-login">Connectez-vous pour laisser un commentaire</p>
            }

            <ReplyList
                replies={filteredReplies}
                postId={postId}
                user={user}
                onDelete={handleDelete}
                onReply={setReplyTarget}
            />
        </div>
    )
}
