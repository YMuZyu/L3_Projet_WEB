// Contient le formulaire de réponse et la liste des commentaires d'un post

import ReplyList from "./ReplyList.jsx"
import ReplyForm from "./ReplyForm.jsx"
import '../../styles/reply/ReplySection.css'

export default function ReplySection({ postId, replies, setReplies, user, isConnected }) {

    // Ajoute une nouvelle réponse à la liste sans recharger la page
    const handleNewReply = (newReply) => {
        setReplies(prev => [...prev, newReply])
    }

    // Retire la réponse supprimée de la liste
    const handleDelete = (replyId) => {
        setReplies(prev => prev.filter(r => r._id?.toString() !== replyId?.toString()))
    }

    return (
        <div className="reply-section">
            <h3>{replies.length} commentaire{replies.length > 1 ? "s" : ""}</h3>

            {/* Formulaire visible seulement si connecté */}
            {isConnected
                ? <ReplyForm postId={postId} onSubmit={handleNewReply} user={user} />
                : <p className="reply-login">Connectez-vous pour laisser un commentaire</p>
            }

            <ReplyList replies={replies} postId={postId} user={user} onDelete={handleDelete} />
        </div>
    )
}
