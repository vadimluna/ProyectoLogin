const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');

const app = express();
const PORT = 3001;
const USERS_FILE = path.join(__dirname, 'users.json');
const SALT_ROUNDS = 10;

const isEmailValid = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 
    if (!emailRegex.test(email)) {
        return { valid: false, message: 'La dirección de correo electrónico no tiene un formato válido.' };
    }
    return { valid: true };
};

const isPasswordValid = (password) => {
    if (password.length < 8) return { valid: false, message: 'La contraseña debe tener al menos 8 caracteres.' };
    if (!/[A-Z]/.test(password)) return { valid: false, message: 'La contraseña debe contener al menos una letra mayúscula.' };
    if (!/[^a-zA-Z0-9]/.test(password)) return { valid: false, message: 'La contraseña debe contener al menos un símbolo o carácter especial.' };
    return { valid: true };
};

let users = [];

try {
    const data = fs.readFileSync(USERS_FILE, 'utf8');
    users = JSON.parse(data);
    console.log(`Base de datos cargada: ${users.length} usuarios.`);
} catch (error) {
    if (error.code === 'ENOENT') {
        const initialPasswordHash = bcrypt.hashSync('password123', SALT_ROUNDS);
        users = [{ username: 'admin', password: initialPasswordHash, email: 'admin@cooklab.com' }];
        fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
        console.log('Base de datos creada con usuario "admin".');
    } else {
        console.error('Error al cargar la base de datos:', error.message);
        process.exit(1);
    }
}

const saveUsers = () => {
    try {
        fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
    } catch (err) {
        console.error('Error al guardar el archivo de usuarios:', err);
    }
};

app.use(cors());
app.use(bodyParser.json());

app.post('/api/register', async (req, res) => {
    const { username, email, password } = req.body;
    
    if (!username || !email || !password) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
    }

    const emailValidation = isEmailValid(email);
    if (!emailValidation.valid) {
        return res.status(400).json({ message: emailValidation.message });
    }
    
    const validationResult = isPasswordValid(password);
    if (!validationResult.valid) {
        return res.status(400).json({ message: validationResult.message });
    }
    
    const userExists = users.some(u => u.username === username || u.email === email);
    if (userExists) {
        return res.status(409).json({ message: 'El usuario o email ya está en uso.' });
    }
    
    try {
        const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
        
        const newUser = { username, email, password: passwordHash };
        users.push(newUser);
        
        saveUsers(); 
        
        return res.status(201).json({ message: 'Registro exitoso.' });
    } catch (error) {
        return res.status(500).json({ message: 'Error interno del servidor.' });
    }
});

app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    
    if (!username || !password) {
        return res.status(400).json({ message: 'Faltan campos.' });
    }
    
    const user = users.find(u => 
        u.username === username || u.email === username
    );

    if (!user) {
        return res.status(401).json({ message: 'Usuario o contraseña incorrectos.' });
    }

    try {
        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            return res.status(200).json({
                message: 'Inicio de sesión exitoso.',
            });
        } else {
            return res.status(401).json({ message: 'Usuario o contraseña incorrectos.' });
        }
    } catch (error) {
        return res.status(500).json({ message: 'Error interno del servidor.' });
    }
});

app.get('/', (req, res) => {
    res.send('Servidor CookLab API funcionando.');
});

app.listen(PORT, () => {
    console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
});