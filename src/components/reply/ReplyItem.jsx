import '../../styles/reply/ReplyItem.css'

export default function ReplyItem({ reply }) {
    return (
        <div className="reply-item">
            <div className="reply-header">
                <span className="reply-author">✍️ {reply.author}</span>
                <span className="reply-date">{new Date(reply.createdAt).toLocaleDateString()}</span>
            </div>
            <p className="reply-content">{reply.content}</p>
        </div>
    )
}