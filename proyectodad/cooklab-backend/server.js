const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = 3001;
const USERS_FILE = path.join(__dirname, 'users.json');
const RECIPES_FILE = path.join(__dirname, 'recipes.json');
const ENCYCLOPEDIA_FILE = path.join(__dirname, 'encyclopedia.json');

app.use(cors());
app.use(bodyParser.json());

const DEFAULT_ENCYCLOPEDIA = [
  {
    id: 1,
    title: "Ajo Negro",
    category: "Ingrediente",
    description: "Ajo madurado a altas temperaturas. Sabor umami, dulce y balsámico.",
    pairings: "Trufa, Champiñones, Cerdo",
    icon: "🧄"
  },
  {
    id: 2,
    title: "Sous-vide",
    category: "Técnica",
    description: "Cocción al vacío a baja temperatura durante largos periodos. Textura perfecta.",
    difficulty: "Alta",
    icon: "🌡️"
  },
  {
    id: 3,
    title: "Agar-Agar",
    category: "Química",
    description: "Gelificante vegetal derivado de algas. Se usa para esferificaciones y gelatinas calientes.",
    pairings: "Frutas ácidas, Salsas",
    icon: "🧪"
  },
  {
    id: 4,
    title: "Maillard",
    category: "Teoría",
    description: "Reacción química entre aminoácidos y azúcares que da sabor y color dorado a la carne asada.",
    icon: "🥩"
  },
  {
    id: 5,
    title: "Coulis",
    category: "Técnica",
    description: "Salsa espesa hecha de puré de frutas o verduras coladas.",
    difficulty: "Baja",
    icon: "🍓"
  },
  {
    id: 6,
    title: "Kimchi",
    category: "Ingrediente",
    description: "Preparación fermentada de origen coreano a base de col china deshidratada con sal.",
    pairings: "Arroz, Cerdo, Tofu",
    icon: "🥬"
  },
  {
    id: 7,
    title: "Goma Xantana",
    category: "Química",
    description: "Espesante potente que no altera el sabor. Ideal para suspender partículas en líquidos.",
    difficulty: "Media",
    icon: "⚗️"
  },
  {
    id: 8,
    title: "Esferificación",
    category: "Técnica",
    description: "Técnica molecular para encapsular líquidos en esferas con textura de caviar.",
    difficulty: "Alta",
    icon: "🔮"
  },
  {
    id: 9,
    title: "Miso",
    category: "Ingrediente",
    description: "Pasta fermentada de soja. Aporta un profundo sabor umami a sopas y marinados.",
    pairings: "Berenjena, Pescado blanco",
    icon: "🥣"
  },
  {
    id: 10,
    title: "Confitar",
    category: "Técnica",
    description: "Cocinar un alimento sumergido en grasa a muy baja temperatura (60-90°C).",
    difficulty: "Media",
    icon: "🦆"
  }
];


const readData = (filePath) => {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, '[]');
    return [];
  }
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return data.trim() === "" ? [] : JSON.parse(data);
  } catch (err) {
    return [];
  }
};

const writeData = (filePath, data) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    return true;
  } catch (err) {
    return false;
  }
};

const initDatabase = () => {
  const encData = readData(ENCYCLOPEDIA_FILE);
  if (encData.length === 0) {
    console.log("Inicializando Enciclopedia con datos base...");
    writeData(ENCYCLOPEDIA_FILE, DEFAULT_ENCYCLOPEDIA);
  }
};

initDatabase();


app.post('/api/register', (req, res) => {
  const { username, password, email } = req.body;
  const users = readData(USERS_FILE);

  if (users.some(u => u.username === username)) {
    return res.status(400).json({ success: false, message: 'El usuario ya existe.' });
  }

  const hashedPassword = bcrypt.hashSync(password, 8);

  const newUser = { 
    id: Date.now(), 
    username, 
    password: hashedPassword, 
    email 
  };
  
  users.push(newUser);
  
  if (writeData(USERS_FILE, users)) {
    res.json({ success: true, message: 'Usuario registrado correctamente' });
  } else {
    res.status(500).json({ success: false, message: 'Error al guardar usuario' });
  }
});

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  const users = readData(USERS_FILE);
  
  const user = users.find(u => u.username === username);

  if (user && bcrypt.compareSync(password, user.password)) {
    res.json({ success: true, message: 'Login exitoso', user: { username: user.username } });
  } else {
    res.status(401).json({ success: false, message: 'Credenciales inválidas' });
  }
});

app.put('/api/update-password', (req, res) => {
  const { username, currentPassword, newPassword } = req.body;
  const users = readData(USERS_FILE);
  const userIndex = users.findIndex(u => u.username === username);

  if (userIndex === -1) {
    return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
  }

  if (!bcrypt.compareSync(currentPassword, users[userIndex].password)) {
    return res.status(401).json({ success: false, message: 'La contraseña actual es incorrecta' });
  }

  users[userIndex].password = bcrypt.hashSync(newPassword, 8);

  if (writeData(USERS_FILE, users)) {
    res.json({ success: true, message: 'Contraseña actualizada con éxito' });
  } else {
    res.status(500).json({ success: false, message: 'Error al guardar la nueva contraseña' });
  }
});

app.delete('/api/delete-account', (req, res) => {
  const { username } = req.body;
  let users = readData(USERS_FILE);
  const initialLength = users.length;
  users = users.filter(u => u.username !== username);

  if (users.length < initialLength) {
    if (writeData(USERS_FILE, users)) {
      res.json({ success: true, message: 'Cuenta eliminada' });
    } else {
      res.status(500).json({ success: false, message: 'Error al borrar usuario' });
    }
  } else {
    res.status(404).json({ success: false, message: 'Usuario no encontrado' });
  }
});


app.get('/api/recipes', (req, res) => {
  const username = req.query.username;
  const allRecipes = readData(RECIPES_FILE);
  const recipes = username ? allRecipes.filter(r => r.author === username) : [];
  res.json(recipes);
});

app.post('/api/recipes', (req, res) => {
  const recipeData = req.body;
  const allRecipes = readData(RECIPES_FILE);
  const newRecipe = { id: Date.now(), ...recipeData, date: new Date().toISOString() };
  allRecipes.push(newRecipe);
  
  if (writeData(RECIPES_FILE, allRecipes)) {
    res.json({ success: true, recipe: newRecipe });
  } else {
    res.status(500).json({ success: false, message: 'Error al guardar receta' });
  }
});

app.put('/api/recipes/:id', (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  const allRecipes = readData(RECIPES_FILE);
  const index = allRecipes.findIndex(r => r.id === parseInt(id));

  if (index !== -1) {
    allRecipes[index] = { ...allRecipes[index], ...updates };
    writeData(RECIPES_FILE, allRecipes);
    res.json({ success: true, recipe: allRecipes[index] });
  } else {
    res.status(404).json({ success: false, message: 'Receta no encontrada' });
  }
});

app.delete('/api/recipes/:id', (req, res) => {
  const { id } = req.params;
  let allRecipes = readData(RECIPES_FILE);
  const filtered = allRecipes.filter(r => r.id !== parseInt(id));
  
  if (filtered.length < allRecipes.length) {
    writeData(RECIPES_FILE, filtered);
    res.json({ success: true });
  } else {
    res.status(404).json({ success: false });
  }
});


app.get('/api/encyclopedia', (req, res) => {
  const data = readData(ENCYCLOPEDIA_FILE);
  res.json(data);
});

app.post('/api/encyclopedia', (req, res) => {
  const itemData = req.body;
  const allItems = readData(ENCYCLOPEDIA_FILE);
  const newItem = { id: Date.now(), ...itemData };
  allItems.push(newItem);

  if (writeData(ENCYCLOPEDIA_FILE, allItems)) {
    res.json({ success: true, item: newItem });
  } else {
    res.status(500).json({ success: false, message: 'Error al guardar en enciclopedia' });
  }
});

app.put('/api/encyclopedia/:id', (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  const allItems = readData(ENCYCLOPEDIA_FILE);
  const index = allItems.findIndex(i => i.id === parseInt(id));

  if (index !== -1) {
    allItems[index] = { ...allItems[index], ...updates };
    writeData(ENCYCLOPEDIA_FILE, allItems);
    res.json({ success: true, item: allItems[index] });
  } else {
    res.status(404).json({ success: false });
  }
});

app.delete('/api/encyclopedia/:id', (req, res) => {
  const { id } = req.params;
  let allItems = readData(ENCYCLOPEDIA_FILE);
  const filtered = allItems.filter(i => i.id !== parseInt(id));

  if (filtered.length < allItems.length) {
    writeData(ENCYCLOPEDIA_FILE, filtered);
    res.json({ success: true });
  } else {
    res.status(404).json({ success: false });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});