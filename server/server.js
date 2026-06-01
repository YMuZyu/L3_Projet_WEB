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

// Charger les variables d'environnement depuis .env (sans dépendance externe)
try {
  const envFile = await fs.readFile(path.join(__dirname, ".env"), "utf8");
  for (const line of envFile.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const [key, ...rest] = trimmed.split("=");
    process.env[key.trim()] = rest.join("=").trim();
  }
} catch { 
  /* pas de fichier .env, on utilise les valeurs par défaut */ 
}

const app = express();
const PORT = 10000;

// Dossier pour stocker les images uploadées
const uploadsDir = path.join(__dirname, "uploads");
await fs.mkdir(uploadsDir, { recursive: true });

// ========================
// Middleware
// ========================
app.use(
  cors({ 
    //utilisation de cors pour autoriser React à parler au serveur 
    origin: "http://localhost:5173",
    credentials: true
  })
);

app.use(express.json({ limit: '10mb' }));
app.use('/uploads', express.static(uploadsDir));


//garder l'utilisateur connecté
//on a utilisé session, un système intégré de express-session qui stocke des données coté serveur, et qui crée un cookie de session côté client pour faire le lien entre les deux
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
    await client.connect(); //connexion à mongo
    db = client.db("projet_Web");
    console.log("Mongo connecté");
  } catch (err) {
    console.error("Erreur Mongo", err);
  }
}

connectDB();

// ========================
// TEST
// ========================
app.get("/", (req, res) => {
  res.send("Serveur OK");
});

// cf TME 7, on doit écrire tout les méthodes nécessaire pour les routes, puis dans notre serveur, la route sera appelé avec la methode


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
    return res.status(400).json({
      status: 400,
      message: "Champs manquants"
    });
  }

  if (password !== password2) {
    return res.status(400).json({
      status: 400,
      message: "Passwords différents"
    });
  }

  try {
    const users = db.collection("users"); //équivalent à SELECT * FROM users

    const existingUser = await users.findOne({ login });

    if (existingUser) {
      return res.status(409).json({
        status: 409,
        message: "Utilisateur déjà existant"
      });
    }

    const result = await users.insertOne({
      login,
      password,
      isAdmin: false,
      isValidated: false,
      createdAt: new Date()
    });

    req.session.user = { _id: result.insertedId, login, isAdmin: false, isValidated: false };

    return res.status(201).json({
      user: { _id: result.insertedId, login, isAdmin: false, isValidated: false },
      roles: []
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      status: 500,
      message: "Erreur serveur"
    });
  }
});

// ========================
// LOGIN
// ========================
app.post("/user/login", async (req, res) => {
  const { login, password } = req.body;

  if (!login || !password) {
    return res.status(400).json({
      status: 400,
      message: "Champs manquants"
    });
  }

  try {
    const users = db.collection("users");

    const user = await users.findOne({ login });

    if (!user) {
      return res.status(401).json({
        status: 401,
        message: "Utilisateur inconnu"
      });
    }

    if (user.password !== password) {
      return res.status(401).json({
        status: 401,
        message: "Mot de passe incorrect"
      });
    }

    req.session.user = {
      _id: user._id, 
      login: user.login,
      isAdmin: user.isAdmin || false,
      isValidated: user.isValidated || false 
    };

    return res.status(200).json({
      user: {
        _id: user._id, 
        login: user.login,
        isAdmin: user.isAdmin || false,
        isValidated: user.isValidated || false
      }
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      status: 500,
      message: "Erreur serveur"
    });
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
    return res.status(400).json({
      status: 400,
      message: "Champs manquants"
    });
  }

  if (!req.session.user) {
    return res.status(401).json({
      status: 401,
      message: "Non connecté"
    });
  }

  try {
    // Si une image est fournie en base64, on l'écrit sur le disque
    let imageUrl = null;
    if (imageBase64) {
      const matches = imageBase64.match(/^data:([a-zA-Z]+\/[a-zA-Z+]+);base64,(.+)$/);
      if (matches) {
        const ext = matches[1].split('/')[1].replace('+xml', ''); // ex: jpeg, png, gif
        const buffer = Buffer.from(matches[2], 'base64');
        const filename = `${Date.now()}.${ext}`;
        await fs.writeFile(path.join(uploadsDir, filename), buffer);
        imageUrl = `/uploads/${filename}`;
      }
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

    return res.status(201).json({
      status: 201,
      message: "Post créé"
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      status: 500,
      message: "Erreur serveur"
    });
  }
});

// ========================
// GET POSTS
// ========================
app.get("/posts", async (req, res) => {
  try {
    const posts = db.collection("posts");
    const allPosts = await posts.find({}).toArray();
    return res.json(allPosts);
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      status: 500,
      message: "Erreur serveur"
    });
  }
});

// ========================
// GET POSTS BY USER  (doit être avant /posts/:postId)
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
 
    return res.status(201).json({ ...newReply, _id: result.insertedId });
  } catch (err) {
    console.error(err);
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
    const likes = post.likes || [];
    const hasLiked = likes.includes(userId);

    await posts.updateOne(
      { _id: post._id },
      hasLiked ? { $pull: { likes: userId } } : { $push: { likes: userId } }
    );
    return res.json({ likes: hasLiked ? likes.length - 1 : likes.length + 1, liked: !hasLiked });
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
    const likes = reply.likes || [];
    const hasLiked = likes.includes(userId);

    await replies.updateOne(
      { _id: reply._id },
      hasLiked ? { $pull: { likes: userId } } : { $push: { likes: userId } }
    );
    return res.json({ likes: hasLiked ? likes.length - 1 : likes.length + 1, liked: !hasLiked });
  } catch (err) {
    return res.status(500).json({ message: "Erreur serveur" });
  }
});

// ========================
// GET REPLIES BY USER (historique profil)
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

  try {
    const matches = imageBase64.match(/^data:([a-zA-Z]+\/[a-zA-Z+]+);base64,(.+)$/);
    if (!matches) return res.status(400).json({ message: "Format invalide" });

    const ext = matches[1].split('/')[1].replace('+xml', '');
    const buffer = Buffer.from(matches[2], 'base64');
    const filename = `avatar-${req.session.user._id}-${Date.now()}.${ext}`;
    await fs.writeFile(path.join(uploadsDir, filename), buffer);
    const avatarUrl = `/uploads/${filename}`;

    const users = db.collection("users");
    await users.updateOne(
      { _id: req.session.user._id },
      { $set: { avatar: avatarUrl } }
    );
    req.session.user.avatar = avatarUrl;

    return res.json({ avatar: avatarUrl });
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
    return res.json({
      message: isValidated ? "Utilisateur validé" : "Utilisateur rejeté",
    });
  } catch (err) {
    return res.status(500).json({ message: "Erreur serveur" });
  }
});
 
// ========================
// DONNER / RETIRER admin (admin)
// ========================
app.patch("/admin/users/:id/admin", requireAdmin, async (req, res) => {
  const { isAdmin } = req.body;
 
  // Un admin ne peut pas modifier ses propres droits
  if (req.params.id === req.session.user._id.toString()) {
    return res
      .status(403)
      .json({ message: "Impossible de modifier ses propres droits" });
  }
 
  try {
    const users = db.collection("users");
    await users.updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: { isAdmin } }
    );
    return res.json({
      message: isAdmin ? "Droits admin accordés" : "Droits admin retirés",
    });
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