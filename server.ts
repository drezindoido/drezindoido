// server.ts

import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { generateImage, generateText, removeBackground, generateVideoStoryboard } from './apiServices';

// Carrega variáveis de ambiente (necessário para o Render ler suas chaves)
dotenv.config();

const app = express();
// O Render injeta a porta automaticamente, usamos 3001 para desenvolvimento local
const port = process.env.PORT || 3001; 

// Configurações de CORS para permitir que o Frontend (Vercel) acesse
app.use(cors({
    origin: '*', // Permite acesso de qualquer origem, Mantenha assim para o primeiro deploy.
    methods: ['GET', 'POST'],
}));
app.use(express.json());

// ------------------------------------
// ENDPOINTS
// ------------------------------------

// 1. GERAÇÃO DE IMAGEM (Chamado por CreationCard e Upscale)
app.post('/api/image', async (req, res) => {
    try {
        const result = await generateImage(req.body.prompt);
        res.json(result);
    } catch (e) {
        res.status(500).send({ error: e.message, source: 'Backend/API' });
    }
});

// 2. GERAÇÃO DE TEXTO/STORYTELLING (Chamado por Storytelling, Quick Starts)
app.post('/api/text', async (req, res) => {
    try {
        const result = await generateText(req.body.prompt);
        res.json(result);
    } catch (e) {
        res.status(500).send({ error: e.message, source: 'Backend/API' });
    }
});

// 3. REMOÇÃO DE FUNDO
app.post('/api/remove-bg', async (req, res) => {
    try {
        // imageUrl deve ser a URL pública da imagem que o usuário fez upload
        const result = await removeBackground(req.body.imageUrl); 
        res.json(result);
    } catch (e) {
        res.status(500).send({ error: e.message, source: 'Backend/API' });
    }
});

// 4. GERAÇÃO DE VÍDEO (Storyboard como Mock)
app.post('/api/video', async (req, res) => {
    try {
        const result = await generateVideoStoryboard(req.body.prompt);
        res.json(result);
    } catch (e) {
        res.status(500).send({ error: e.message, source: 'Backend/API' });
    }
});

app.listen(port, () => {
    console.log(`\nServidor rodando na porta ${port}. Status: Pronto para Failover/Gemini.`);
});