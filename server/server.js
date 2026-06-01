import express from "express";
import cors from "cors";
import session from "express-session";
import { MongoClient } from "mongodb";
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
} catch { /* pas de fichier .env, on utilise les valeurs par défaut */ }

const app = express();
const PORT = 10000;

// Dossier pour stocker les images uploadées
const uploadsDir = path.join(__dirname, "uploads");
await fs.mkdir(uploadsDir, { recursive: true });

// ========================
// Middleware
// ========================
app.use(cors({ //utilisation de cors pour autoriser React à parler au serveur 
  origin: "http://localhost:5173",
  credentials: true
}));

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

    await users.insertOne({
      login,
      password
    });

    return res.status(201).json({
      status: 201,
      message: "Utilisateur créé"
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

    req.session.user = { _id: user._id, login: user.login };

    return res.status(200).json({
      user: { _id: user._id, login: user.login },
      roles: user.roles || []
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
// GET SESSION USER
// ========================
app.get("/user/me", (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ message: "Non connecté" });
  }
  return res.status(200).json({
    user: req.session.user,
    roles: req.session.user.roles || []
  });
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
// LANCEMENT
// ========================
app.listen(PORT, () => {
  console.log(`Serveur lancé sur http://localhost:${PORT} `);
});