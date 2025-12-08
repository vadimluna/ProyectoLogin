const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3001;
const USERS_FILE = path.join(__dirname, 'users.json');

app.use(cors());
app.use(bodyParser.json());

const readUsers = () => {
    try {
        if (!fs.existsSync(USERS_FILE)) {
            fs.writeFileSync(USERS_FILE, '[]', 'utf-8');
            return [];
        }
        const data = fs.readFileSync(USERS_FILE, 'utf-8');
        return JSON.parse(data || '[]');
    } catch (e) {
        return [];
    }
};

const writeUsers = (users) => {
    try {
        fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
    } catch (e) {
        console.error("Error escribiendo DB", e);
    }
};

app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    const users = readUsers();
    const user = users.find(u => u.username === username && u.password === password);
    if (user) res.json({ message: 'Login OK', user: { username: user.username } });
    else res.status(401).json({ message: 'Credenciales inválidas' });
});

app.post('/api/register', (req, res) => {
    const { username, password } = req.body;
    const users = readUsers();
    if (users.find(u => u.username === username)) return res.status(400).json({ message: 'Usuario existe' });
    users.push({ username, password, reports: [] });
    writeUsers(users);
    res.json({ message: 'Registrado' });
});

app.post('/api/save-report', (req, res) => {
    const { username, report } = req.body;
    const users = readUsers();
    const userIndex = users.findIndex(u => u.username === username);
    
    if (userIndex === -1) return res.status(404).json({ message: "Usuario no encontrado" });
    if (!users[userIndex].reports) users[userIndex].reports = [];

    // SIEMPRE CREAR NUEVO SI NO TIENE ID O SI LO FORZAMOS
    // La lógica en el frontend ahora envía id="" para forzar nuevo
    if (report.id) {
        const idx = users[userIndex].reports.findIndex(r => r.id === report.id);
        if (idx !== -1) users[userIndex].reports[idx] = report;
        else users[userIndex].reports.push(report);
    } else {
        report.id = Date.now().toString();
        users[userIndex].reports.push(report);
    }

    writeUsers(users);
    res.json({ message: "Guardado", reportId: report.id });
});

app.get('/api/reports', (req, res) => {
    const { username } = req.query;
    const users = readUsers();
    const user = users.find(u => u.username === username);
    if (!user) return res.status(404).json({ message: "No encontrado" });
    res.json(user.reports || []);
});

app.delete('/api/reports/:id', (req, res) => {
    const { username } = req.body;
    const { id } = req.params;
    const users = readUsers();
    const idx = users.findIndex(u => u.username === username);
    if (idx !== -1 && users[idx].reports) {
        users[idx].reports = users[idx].reports.filter(r => r.id !== id);
        writeUsers(users);
    }
    res.json({ message: "Borrado" });
});

app.listen(PORT, () => console.log(`Server en puerto ${PORT}`));