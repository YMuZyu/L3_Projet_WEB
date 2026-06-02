import ReplyItem from "./ReplyItem.jsx"
import '../../styles/reply/ReplySection.css'

export default function ReplyList({ replies, postId, user, onDelete, onReply }) {
    if (!replies || replies.length === 0) {
        return <p className="no-reply">Aucun commentaire pour l'instant</p>
    }

    return (
        <div className="reply-list">
            {replies.map(reply => (
                <ReplyItem
                    key={reply._id}
                    reply={reply}
                    postId={postId}
                    user={user}
                    onDelete={onDelete}
                    onReply={onReply}
                    allReplies={replies}
                />
            ))}
        </div>
    )
}
