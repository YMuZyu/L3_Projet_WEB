import express from "express"; //créer le serveur 
import cors from "cors"; //autoriser React à appeler le serveur 
import session from "express-session"; //gérer les connexions 
import { MongoClient } from "mongodb"; //communiquer avec la dbs

const app = express();
const PORT = 10000;

// ========================
// Middleware
// ========================
app.use(cors({ //utilisation de cors pour autoriser React à parler au serveur 
  origin: "http://localhost:5173",
  credentials: true
}));

app.use(express.json()); //permet transformer le JSON reçu en objet JS


//garder l'utilisateur connecté
app.use(session({
  secret: "secret",
  resave: false,
  saveUninitialized: false
}));

// ========================
// MongoDB
// ========================

const uri = "mongodb://localhost:27017"; //27017, le port par défaut de mongo
const client = new MongoClient(uri);

let db;

async function connectDB() {
  try {
    await client.connect(); //connexion à mongo
    db = client.db("monprojet");
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

// ========================
// CREATE USER
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

    req.session.userId = user._id;

    return res.status(200).json({
      status: 200,
      message: "Login OK"
    });

  } catch (err) {
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