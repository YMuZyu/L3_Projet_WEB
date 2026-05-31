import ReplyItem from "./ReplyItem.jsx"
import '../../styles/reply/ReplySection.css'

export default function ReplyList({ replies }) {

    if (replies.length === 0) {
        return <p className="no-reply">Aucun commentaire pour l'instant</p>
    }

    return (
        <div className="reply-list">
            {replies.map(reply => (
                <ReplyItem key={reply._id} reply={reply} />
            ))}
        </div>
    )
}