const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors()); // Habilita o CORS para todas as origens

// Rota para lidar com o envio do formulário
app.post('/send-email', async (req, res) => {
    const { name, email, phone, current_bill, message } = req.body;

    // Configuração do Nodemailer
    let transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: process.env.EMAIL_SECURE === 'true', // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        },
        tls: {
            ciphers:'SSLv3'
        }
    });

    // Opções do email
    let mailOptions = {
        from: `"Formulário de Contato" <${process.env.EMAIL_USER}>`,
        to: process.env.RECIPIENT_EMAIL, // Email que receberá as mensagens
        subject: 'Nova Mensagem do Formulário de Contato Sun Energy',
        html: `
            <p>Você recebeu uma nova mensagem do seu formulário de contato:</p>
            <h3>Detalhes do Contato:</h3>
            <ul>
                <li>Nome: ${name}</li>
                <li>Email: ${email}</li>
                <li>Telefone: ${phone}</li>
                <li>Conta de Luz Atual: ${current_bill}</li>
            </ul>
            <h3>Mensagem:</h3>
            <p>${message}</p>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).send('Email enviado com sucesso!');
    } catch (error) {
        console.error('Erro ao enviar email:', error);
        res.status(500).send('Erro ao enviar email.');
    }
});

// Inicia o servidor