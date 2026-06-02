import express from "express";
import cors from "cors";
import session from "express-session";
import { MongoClient, ObjectId } from "mongodb";
import { promises as fs } from "fs";
import { Buffer } from "buffer";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

try {
  const envFile = await fs.readFile(path.join(__dirname, ".env"), "utf8");
  for (const line of envFile.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const [key, ...rest] = trimmed.split("=");
    process.env[key.trim()] = rest.join("=").trim();
  }
} catch {
  /* pas de fichier .env */
}

const app = express();
const PORT = 10000;

const uploadsDir = path.join(__dirname, "uploads");
await fs.mkdir(uploadsDir, { recursive: true });

// ========================
// Middleware
// ========================
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true
  })
);

app.use(express.json({ limit: '10mb' }));
app.use('/uploads', express.static(uploadsDir));

app.use(session({
  secret: "secret",
  resave: false,
  saveUninitialized: false
}));

// ========================
// MongoDB
// ========================
const uri = process.env.MONGO_URI || "mongodb://localhost:27017";
const client = new MongoClient(uri);

let db;

async function connectDB() {
  try {
    await client.connect();
    db = client.db("projet_Web");
    console.log("Mongo connecté");
  } catch (err) {
    console.error("Erreur Mongo", err);
  }
}

connectDB();

// ========================
// Helper: créer une notification
// ========================
async function createNotification(db, { userId, type, fromUserId, fromUserLogin, postId, replyId, messageId, preview }) {
  if (!userId) return;
  const fromIdStr = fromUserId?.toString();
  if (userId.toString() === fromIdStr) return; // ne pas se notifier soi-même
  const notifs = db.collection("notifications");
  await notifs.insertOne({
    userId: userId.toString(),
    type,
    fromUserId: fromIdStr || null,
    fromUserLogin: fromUserLogin || null,
    postId: postId?.toString() || null,
    replyId: replyId?.toString() || null,
    messageId: messageId?.toString() || null,
    preview: preview || null,
    read: false,
    createdAt: new Date()
  });
}

// ========================
// TEST
// ========================
app.get("/", (req, res) => {
  res.send("Serveur OK");
});

// ========================
// Vérification si connecté
// ========================
app.get("/connexion", (req, res) => {
  if (!req.session.user) {
    return res.json({ logged: false });
  }
  return res.json({ logged: true, user: req.session.user });
});

// ========================
// GET SESSION USER
// ========================
app.get("/user/me", (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ message: "Non connecté" });
  }
  return res.status(200).json({ user: req.session.user });
});

// ========================
// CREATE USER / Register
// ========================
app.put("/user", async (req, res) => {
  const { login, password, password2 } = req.body;

  if (!login || !password || !password2) {
    return res.status(400).json({ status: 400, message: "Champs manquants" });
  }

  if (password !== password2) {
    return res.status(400).json({ status: 400, message: "Passwords différents" });
  }

  try {
    const users = db.collection("users");
    const existingUser = await users.findOne({ login });

    if (existingUser) {
      return res.status(409).json({ status: 409, message: "Utilisateur déjà existant" });
    }

    const result = await users.insertOne({
      login,
      password,
      isAdmin: false,
      isValidated: false,
      avatar: null,
      createdAt: new Date()
    });

    req.session.user = { _id: result.insertedId, login, isAdmin: false, isValidated: false };

    return res.status(201).json({
      user: { _id: result.insertedId, login, isAdmin: false, isValidated: false },
      roles: []
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ status: 500, message: "Erreur serveur" });
  }
});

// ========================
// LOGIN
// ========================
app.post("/user/login", async (req, res) => {
  const { login, password } = req.body;

  if (!login || !password) {
    return res.status(400).json({ status: 400, message: "Champs manquants" });
  }

  try {
    const users = db.collection("users");
    const user = await users.findOne({ login });

    if (!user) {
      return res.status(401).json({ status: 401, message: "Utilisateur inconnu" });
    }

    if (user.password !== password) {
      return res.status(401).json({ status: 401, message: "Mot de passe incorrect" });
    }

    req.session.user = {
      _id: user._id,
      login: user.login,
      isAdmin: user.isAdmin || false,
      isValidated: user.isValidated || false,
      avatar: user.avatar || null
    };

    return res.status(200).json({
      user: {
        _id: user._id,
        login: user.login,
        isAdmin: user.isAdmin || false,
        isValidated: user.isValidated || false,
        avatar: user.avatar || null
      }
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ status: 500, message: "Erreur serveur" });
  }
});

// ========================
// LOGOUT
// ========================
app.post("/user/logout", (req, res) => {
  req.session.destroy(() => {
    res.status(200).json({ message: "Déconnecté" });
  });
});

// ========================
// GET USER by ID
// ========================
app.get("/user/:id", async (req, res) => {
  try {
    const users = db.collection("users");
    const user = await users.findOne(
      { _id: new ObjectId(req.params.id) },
      { projection: { password: 0 } }
    );

    if (!user) return res.status(404).json({ message: "Utilisateur introuvable" });

    return res.json(user);
  } catch (err) {
    return res.status(500).json({ message: "Erreur serveur" });
  }
});

// ========================
// CREATE POST
// ========================
app.post("/posts", async (req, res) => {
  const { title, content, category, imageBase64 } = req.body;

  if (!title || !content || !category) {
    return res.status(400).json({ status: 400, message: "Champs manquants" });
  }

  if (!req.session.user) {
    return res.status(401).json({ status: 401, message: "Non connecté" });
  }

  try {
    // Stockage en base64 dans MongoDB (comme les avatars) pour que l'image
    // soit accessible depuis n'importe quel PC sans partage de fichiers
    let imageUrl = null;
    if (imageBase64) {
      const valid = /^data:image\/(png|jpeg|jpg|gif|webp);base64,/.test(imageBase64);
      if (valid) imageUrl = imageBase64;
    }

    const posts = db.collection("posts");
    await posts.insertOne({
      title,
      content,
      category,
      imageUrl,
      userId: req.session.user._id,
      author: req.session.user.login,
      createdAt: new Date()
    });

    return res.status(201).json({ status: 201, message: "Post créé" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ status: 500, message: "Erreur serveur" });
  }
});

// ========================
// GET POSTS (enrichis avec avatar auteur)
// ========================
app.get("/posts", async (req, res) => {
  try {
    const posts = await db.collection("posts").find({}).toArray();

    const userIdStrings = [...new Set(posts.map(p => p.userId?.toString()).filter(Boolean))];
    const objectIds = userIdStrings
      .map(id => { try { return new ObjectId(id); } catch { return null; } })
      .filter(Boolean);

    let avatarMap = {};
    if (objectIds.length > 0) {
      const users = await db.collection("users")
        .find({ _id: { $in: objectIds } }, { projection: { avatar: 1 } })
        .toArray();
      users.forEach(u => { avatarMap[u._id.toString()] = u.avatar || null; });
    }

    const enriched = posts.map(p => ({ ...p, authorAvatar: avatarMap[p.userId?.toString()] || null }));
    return res.json(enriched);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ status: 500, message: "Erreur serveur" });
  }
});

// ========================
// GET POSTS BY USER (doit être avant /posts/:postId)
// ========================
app.get("/posts/user/:userId", async (req, res) => {
  try {
    const posts = db.collection("posts");
    const userPosts = await posts
      .find({ userId: req.params.userId })
      .sort({ createdAt: -1 })
      .toArray();
    return res.json(userPosts);
  } catch (err) {
    return res.status(500).json({ message: "Erreur serveur" });
  }
});

// ========================
// GET ONE POST
// ========================
app.get("/posts/:postId", async (req, res) => {
  try {
    const posts = db.collection("posts");
    const post = await posts.findOne({ _id: new ObjectId(req.params.postId) });
    if (!post) return res.status(404).json({ message: "Post introuvable" });
    return res.json(post);
  } catch (err) {
    return res.status(500).json({ message: "Erreur serveur" });
  }
});

// ========================
// DELETE POST
// ========================
app.delete("/posts/:postId", async (req, res) => {
  if (!req.session.user) return res.status(401).json({ message: "Non connecté" });

  try {
    const posts = db.collection("posts");
    const post = await posts.findOne({ _id: new ObjectId(req.params.postId) });

    if (!post) return res.status(404).json({ message: "Post introuvable" });

    const userId = req.session.user._id.toString();
    if (post.userId.toString() !== userId && !req.session.user.isAdmin) {
      return res.status(403).json({ message: "Non autorisé" });
    }

    await posts.deleteOne({ _id: new ObjectId(req.params.postId) });
    await db.collection("replies").deleteMany({ postId: req.params.postId });

    return res.json({ message: "Post supprimé" });
  } catch (err) {
    return res.status(500).json({ message: "Erreur serveur" });
  }
});

// ========================
// GET REPLIES
// ========================
app.get("/posts/:postId/replies", async (req, res) => {
  try {
    const replies = db.collection("replies");
    const allReplies = await replies
      .find({ postId: req.params.postId })
      .sort({ createdAt: 1 })
      .toArray();
    return res.json(allReplies);
  } catch (err) {
    return res.status(500).json({ message: "Erreur serveur" });
  }
});

// ========================
// CREATE REPLY
// ========================
app.post("/posts/:postId/replies", async (req, res) => {
  const { content } = req.body;

  if (!content) return res.status(400).json({ message: "Contenu manquant" });
  if (!req.session.user) return res.status(401).json({ message: "Non connecté" });

  try {
    const replies = db.collection("replies");
    const posts = db.collection("posts");

    const newReply = {
      postId: req.params.postId,
      content,
      author: req.session.user.login,
      userId: req.session.user._id.toString(),
      createdAt: new Date(),
    };

    const result = await replies.insertOne(newReply);

    await posts.updateOne(
      { _id: new ObjectId(req.params.postId) },
      { $inc: { comments: 1 } }
    );

    // Notifier l'auteur du post
    const post = await posts.findOne({ _id: new ObjectId(req.params.postId) });
    if (post && post.userId) {
      await createNotification(db, {
        userId: post.userId.toString(),
        type: 'reply_post',
        fromUserId: req.session.user._id,
        fromUserLogin: req.session.user.login,
        postId: req.params.postId,
        replyId: result.insertedId,
        preview: content.length > 80 ? content.substring(0, 80) + '...' : content
      });
    }

    return res.status(201).json({ ...newReply, _id: result.insertedId });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Erreur serveur" });
  }
});

// ========================
// COMPTEUR DE NOTIFICATIONS
// ========================
app.get("/notifications/count", async (req, res) => {
    if (!req.session.user) return res.json({ count: 0 })

    try {
        const posts = db.collection("posts")
        const replies = db.collection("replies")

        // On récupère tous les posts de l'utilisateur
        const userPosts = await posts
            .find({ userId: req.session.user._id.toString() })
            .toArray()

        const postIds = userPosts.map(p => p._id.toString())

        // On compte les réponses reçues sur ses posts
        const count = await replies.countDocuments({
            postId: { $in: postIds },
            userId: { $ne: req.session.user._id.toString() } // pas ses propres réponses
        })

        return res.json({ count })
    } catch (err) {
        return res.status(500).json({ count: 0 })
    }
})

// ========================
// DELETE REPLY (auteur seulement)
// ========================
app.delete("/posts/:postId/replies/:replyId", async (req, res) => {
  if (!req.session.user) return res.status(401).json({ message: "Non connecté" });

  try {
    const replies = db.collection("replies");
    const reply = await replies.findOne({ _id: new ObjectId(req.params.replyId) });

    if (!reply) return res.status(404).json({ message: "Réponse introuvable" });

    const userId = req.session.user._id.toString();
    if (reply.userId !== userId && !req.session.user.isAdmin) {
      return res.status(403).json({ message: "Non autorisé" });
    }

    await replies.deleteOne({ _id: new ObjectId(req.params.replyId) });
    await db.collection("posts").updateOne(
      { _id: new ObjectId(req.params.postId) },
      { $inc: { comments: -1 } }
    );

    return res.json({ message: "Réponse supprimée" });
  } catch (err) {
    return res.status(500).json({ message: "Erreur serveur" });
  }
});

// ========================
// LIKE POST
// ========================
app.post("/posts/:postId/like", async (req, res) => {
  if (!req.session.user) return res.status(401).json({ message: "Non connecté" });

  try {
    const posts = db.collection("posts");
    const post = await posts.findOne({ _id: new ObjectId(req.params.postId) });
    if (!post) return res.status(404).json({ message: "Post introuvable" });

    const userId = req.session.user._id.toString();
    let likes = [...(post.likes || [])];
    let dislikes = [...(post.dislikes || [])];
    const hasLiked = likes.includes(userId);
    const hasDisliked = dislikes.includes(userId);

    if (hasLiked) {
      likes = likes.filter(id => id !== userId);
    } else {
      likes.push(userId);
      if (hasDisliked) dislikes = dislikes.filter(id => id !== userId);
    }

    await posts.updateOne({ _id: post._id }, { $set: { likes, dislikes } });

    if (!hasLiked && post.userId) {
      await createNotification(db, {
        userId: post.userId.toString(),
        type: 'like_post',
        fromUserId: req.session.user._id,
        fromUserLogin: req.session.user.login,
        postId: req.params.postId,
        preview: `a aimé votre post "${(post.title || '').substring(0, 40)}"`
      });
    }

    return res.json({ likes: likes.length, liked: !hasLiked, dislikes: dislikes.length, disliked: false });
  } catch (err) {
    return res.status(500).json({ message: "Erreur serveur" });
  }
});

// ========================
// DISLIKE POST
// ========================
app.post("/posts/:postId/dislike", async (req, res) => {
  if (!req.session.user) return res.status(401).json({ message: "Non connecté" });

  try {
    const posts = db.collection("posts");
    const post = await posts.findOne({ _id: new ObjectId(req.params.postId) });
    if (!post) return res.status(404).json({ message: "Post introuvable" });

    const userId = req.session.user._id.toString();
    let likes = [...(post.likes || [])];
    let dislikes = [...(post.dislikes || [])];
    const hasDisliked = dislikes.includes(userId);
    const hasLiked = likes.includes(userId);

    if (hasDisliked) {
      dislikes = dislikes.filter(id => id !== userId);
    } else {
      dislikes.push(userId);
      if (hasLiked) likes = likes.filter(id => id !== userId);
    }

    await posts.updateOne({ _id: post._id }, { $set: { likes, dislikes } });

    return res.json({ dislikes: dislikes.length, disliked: !hasDisliked, likes: likes.length, liked: false });
  } catch (err) {
    return res.status(500).json({ message: "Erreur serveur" });
  }
});

// ========================
// LIKE REPLY
// ========================
app.post("/posts/:postId/replies/:replyId/like", async (req, res) => {
  if (!req.session.user) return res.status(401).json({ message: "Non connecté" });

  try {
    const replies = db.collection("replies");
    const reply = await replies.findOne({ _id: new ObjectId(req.params.replyId) });
    if (!reply) return res.status(404).json({ message: "Réponse introuvable" });

    const userId = req.session.user._id.toString();
    let likes = [...(reply.likes || [])];
    let dislikes = [...(reply.dislikes || [])];
    const hasLiked = likes.includes(userId);
    const hasDisliked = dislikes.includes(userId);

    if (hasLiked) {
      likes = likes.filter(id => id !== userId);
    } else {
      likes.push(userId);
      if (hasDisliked) dislikes = dislikes.filter(id => id !== userId);
    }

    await replies.updateOne({ _id: reply._id }, { $set: { likes, dislikes } });

    if (!hasLiked && reply.userId) {
      await createNotification(db, {
        userId: reply.userId.toString(),
        type: 'like_reply',
        fromUserId: req.session.user._id,
        fromUserLogin: req.session.user.login,
        postId: req.params.postId,
        replyId: req.params.replyId,
        preview: `a aimé votre réponse "${(reply.content || '').substring(0, 40)}"`
      });
    }

    return res.json({ likes: likes.length, liked: !hasLiked, dislikes: dislikes.length, disliked: false });
  } catch (err) {
    return res.status(500).json({ message: "Erreur serveur" });
  }
});

// ========================
// DISLIKE REPLY
// ========================
app.post("/posts/:postId/replies/:replyId/dislike", async (req, res) => {
  if (!req.session.user) return res.status(401).json({ message: "Non connecté" });

  try {
    const replies = db.collection("replies");
    const reply = await replies.findOne({ _id: new ObjectId(req.params.replyId) });
    if (!reply) return res.status(404).json({ message: "Réponse introuvable" });

    const userId = req.session.user._id.toString();
    let likes = [...(reply.likes || [])];
    let dislikes = [...(reply.dislikes || [])];
    const hasDisliked = dislikes.includes(userId);
    const hasLiked = likes.includes(userId);

    if (hasDisliked) {
      dislikes = dislikes.filter(id => id !== userId);
    } else {
      dislikes.push(userId);
      if (hasLiked) likes = likes.filter(id => id !== userId);
    }

    await replies.updateOne({ _id: reply._id }, { $set: { likes, dislikes } });

    return res.json({ dislikes: dislikes.length, disliked: !hasDisliked, likes: likes.length, liked: false });
  } catch (err) {
    return res.status(500).json({ message: "Erreur serveur" });
  }
});

// ========================
// GET REPLIES BY USER
// ========================
app.get("/user/:userId/replies", async (req, res) => {
  try {
    const replies = db.collection("replies");
    const userReplies = await replies
      .find({ userId: req.params.userId })
      .sort({ createdAt: -1 })
      .toArray();
    return res.json(userReplies);
  } catch (err) {
    return res.status(500).json({ message: "Erreur serveur" });
  }
});

// ========================
// UPDATE AVATAR
// ========================
app.patch("/user/me/avatar", async (req, res) => {
  if (!req.session.user) return res.status(401).json({ message: "Non connecté" });
  const { imageBase64 } = req.body;
  if (!imageBase64) return res.status(400).json({ message: "Image manquante" });

  const valid = /^data:image\/(png|jpeg|jpg|gif|webp);base64,/.test(imageBase64);
  if (!valid) return res.status(400).json({ message: "Format invalide" });

  try {
    const users = db.collection("users");
    await users.updateOne(
      { _id: new ObjectId(req.session.user._id.toString()) },
      { $set: { avatar: imageBase64 } }
    );
    req.session.user.avatar = imageBase64;

    return res.json({ avatar: imageBase64 });
  } catch (err) {
    return res.status(500).json({ message: "Erreur serveur" });
  }
});

// ========================
// MESSAGES — ENVOYER
// ========================
app.post("/messages", async (req, res) => {
  if (!req.session.user) return res.status(401).json({ message: "Non connecté" });
  const { toUserId, content } = req.body;
  if (!toUserId || !content) return res.status(400).json({ message: "Champs manquants" });

  try {
    const users = db.collection("users");
    const recipient = await users.findOne({ _id: new ObjectId(toUserId) });
    if (!recipient) return res.status(404).json({ message: "Destinataire introuvable" });

    const msg = {
      fromUserId: req.session.user._id.toString(),
      fromUserLogin: req.session.user.login,
      toUserId: toUserId.toString(),
      toUserLogin: recipient.login,
      content,
      createdAt: new Date()
    };

    const messages = db.collection("messages");
    const result = await messages.insertOne(msg);

    await createNotification(db, {
      userId: toUserId,
      type: 'message',
      fromUserId: req.session.user._id,
      fromUserLogin: req.session.user.login,
      messageId: result.insertedId,
      preview: content.length > 80 ? content.substring(0, 80) + '...' : content
    });

    return res.status(201).json({ ...msg, _id: result.insertedId });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Erreur serveur" });
  }
});

// ========================
// MESSAGES — LISTE DES CONVERSATIONS
// ========================
app.get("/messages/conversations", async (req, res) => {
  if (!req.session.user) return res.status(401).json({ message: "Non connecté" });

  try {
    const messages = db.collection("messages");
    const myId = req.session.user._id.toString();

    const allMessages = await messages
      .find({ $or: [{ fromUserId: myId }, { toUserId: myId }] })
      .sort({ createdAt: -1 })
      .toArray();

    const convMap = {};
    for (const msg of allMessages) {
      const isFrom = msg.fromUserId === myId;
      const partnerId = isFrom ? msg.toUserId : msg.fromUserId;
      const partnerLogin = isFrom ? msg.toUserLogin : msg.fromUserLogin;
      if (!convMap[partnerId]) {
        convMap[partnerId] = {
          partnerId,
          partnerLogin: partnerLogin || partnerId,
          lastMessage: msg.content,
          lastAt: msg.createdAt
        };
      }
    }

    return res.json(Object.values(convMap));
  } catch (err) {
    return res.status(500).json({ message: "Erreur serveur" });
  }
});

// ========================
// MESSAGES — CONVERSATION AVEC UN UTILISATEUR
// ========================
app.get("/messages/conversation/:userId", async (req, res) => {
  if (!req.session.user) return res.status(401).json({ message: "Non connecté" });

  try {
    const messages = db.collection("messages");
    const myId = req.session.user._id.toString();
    const otherId = req.params.userId;

    const conversation = await messages
      .find({
        $or: [
          { fromUserId: myId, toUserId: otherId },
          { fromUserId: otherId, toUserId: myId }
        ]
      })
      .sort({ createdAt: 1 })
      .toArray();

    return res.json(conversation);
  } catch (err) {
    return res.status(500).json({ message: "Erreur serveur" });
  }
});

// ========================
// NOTIFICATIONS — COMPTEUR NON LUES
// ========================
app.get("/notifications/count", async (req, res) => {
  if (!req.session.user) return res.status(401).json({ message: "Non connecté" });

  try {
    const notifs = db.collection("notifications");
    const myId = req.session.user._id.toString();
    const count = await notifs.countDocuments({ userId: myId, read: false });
    return res.json({ count });
  } catch (err) {
    return res.status(500).json({ message: "Erreur serveur" });
  }
});

// ========================
// NOTIFICATIONS — MARQUER TOUTES COMME LUES
// ========================
app.patch("/notifications/read-all", async (req, res) => {
  if (!req.session.user) return res.status(401).json({ message: "Non connecté" });

  try {
    const notifs = db.collection("notifications");
    const myId = req.session.user._id.toString();
    await notifs.updateMany({ userId: myId, read: false }, { $set: { read: true } });
    return res.json({ message: "Toutes lues" });
  } catch (err) {
    return res.status(500).json({ message: "Erreur serveur" });
  }
});

// ========================
// NOTIFICATIONS — LISTE
// ========================
app.get("/notifications", async (req, res) => {
  if (!req.session.user) return res.status(401).json({ message: "Non connecté" });

  try {
    const notifs = db.collection("notifications");
    const myId = req.session.user._id.toString();
    const all = await notifs
      .find({ userId: myId })
      .sort({ createdAt: -1 })
      .limit(50)
      .toArray();
    return res.json(all);
  } catch (err) {
    return res.status(500).json({ message: "Erreur serveur" });
  }
});

// ========================
// NOTIFICATIONS — MARQUER UNE COMME LUE
// ========================
app.patch("/notifications/:id/read", async (req, res) => {
  if (!req.session.user) return res.status(401).json({ message: "Non connecté" });

  try {
    const notifs = db.collection("notifications");
    await notifs.updateOne(
      { _id: new ObjectId(req.params.id), userId: req.session.user._id.toString() },
      { $set: { read: true } }
    );
    return res.json({ message: "Lue" });
  } catch (err) {
    return res.status(500).json({ message: "Erreur serveur" });
  }
});

// ========================
// Middleware admin
// ========================
function requireAdmin(req, res, next) {
  if (!req.session.user || !req.session.user.isAdmin) {
    return res.status(403).json({ message: "Accès refusé" });
  }
  next();
}

// ========================
// GET ALL USERS (admin)
// ========================
app.get("/admin/users", requireAdmin, async (req, res) => {
  try {
    const users = db.collection("users");
    const allUsers = await users
      .find({}, { projection: { password: 0 } })
      .toArray();
    return res.json(allUsers);
  } catch (err) {
    return res.status(500).json({ message: "Erreur serveur" });
  }
});

// ========================
// VALIDER / REJETER un utilisateur (admin)
// ========================
app.patch("/admin/users/:id/validate", requireAdmin, async (req, res) => {
  const { isValidated } = req.body;

  try {
    const users = db.collection("users");
    await users.updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: { isValidated } }
    );
    return res.json({ message: isValidated ? "Utilisateur validé" : "Utilisateur rejeté" });
  } catch (err) {
    return res.status(500).json({ message: "Erreur serveur" });
  }
});

// ========================
// DONNER / RETIRER admin (admin)
// ========================
app.patch("/admin/users/:id/admin", requireAdmin, async (req, res) => {
  const { isAdmin } = req.body;

  if (req.params.id === req.session.user._id.toString()) {
    return res.status(403).json({ message: "Impossible de modifier ses propres droits" });
  }

  try {
    const users = db.collection("users");
    await users.updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: { isAdmin } }
    );
    return res.json({ message: isAdmin ? "Droits admin accordés" : "Droits admin retirés" });
  } catch (err) {
    return res.status(500).json({ message: "Erreur serveur" });
  }
});

// ========================
// LANCEMENT
// ========================
app.listen(PORT, () => {
  console.log(`Serveur lancé sur http://localhost:${PORT} `);
});
