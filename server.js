const express = require('express');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;
const REGISTRO_FILE = 'usuarios.txt';

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/api/register', (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ success: false, message: 'Por favor, completa todos los campos.' });
    }

    const userData = `${name};${email};${password}\n`;

    fs.appendFile(REGISTRO_FILE, userData, (err) => {
        if (err) {
            console.error('Error al escribir en el archivo:', err);
            return res.status(500).json({ success: false, message: 'Error al guardar el usuario.' });
        }
        res.status(201).json({ success: true, message: 'Usuario registrado y guardado en usuarios.txt (¡INSEGURO!).' });
    });
});

// Nueva ruta para el inicio de sesión
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Por favor, introduce correo electrónico y contraseña.' });
    }

    fs.readFile(REGISTRO_FILE, 'utf8', (err, data) => {
        if (err) {
            console.error('Error al leer el archivo:', err);
            return res.status(500).json({ success: false, message: 'Error al intentar iniciar sesión.' });
        }

        const users = data.split('\n').filter(line => line.trim() !== '');
        let loggedIn = false;

        for (const user of users) {
            const [storedName, storedEmail, storedPassword] = user.split(';');
            if (email === storedEmail && password === storedPassword) {
                loggedIn = true;
                break;
            }
        }

        if (loggedIn) {
            res.status(200).json({ success: true, message: '¡Inicio de sesión exitoso!' });
            // Aquí podrías generar una sesión o token para el usuario
        } else {
            res.status(401).json({ success: false, message: 'Credenciales incorrectas.' });
        }
    });
});

app.listen(port, () => {
    console.log('Servidor funcionando en: http://localhost:3000');
});