// apiServices.ts

import { GoogleGenAI } from '@google/genai';
import axios from 'axios';

// Variáveis de Ambiente (CHAVES SECRETAS INJETADAS PELO RENDER)
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const REMOVEBG_API_KEY = process.env.REMOVEBG_API_KEY;

// Inicializa o Cliente Gemini
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY }); 

// ------------------------------------
// 1. GERAÇÃO DE IMAGEM (Prioriza API Gratuita, usa Gemini como Failover)
// ------------------------------------
export async function generateImage(prompt: string) {
    // 1. TENTATIVA PRIMÁRIA (MOCK: Ex. DALL-E/Stable Diffusion)
    try {
        // ### CÓDIGO PARA CHAMADA DE API GRÁTIS DE IMAGEM AQUI ###
        // MOCK: Forçando a falha para usar o Gemini para o deploy inicial.
        throw new Error("MOCK: Falha na API primária de imagem."); 
    } catch (primaryError) {
        console.warn(`API primária de imagem falhou. Usando Gemini (Imagen) como Failover.`);
        
        // 2. FAILOVER (Gemini - Imagen)
        try {
            const response = await ai.models.generateImages({
                model: 'imagen-3.0-generate-002', 
                prompt: prompt,
                config: {
                    numberOfImages: 1,
                    outputMimeType: 'image/jpeg',
                    aspectRatio: '1:1',
                }
            });
            
            const base64Image = response.generatedImages[0].image.imageBytes;
            return { 
                url: `data:image/jpeg;base64,${base64Image}`, 
                source: 'Gemini (Imagen Failover)' 
            };
        } catch (geminiError) {
            console.error(`Falha no Gemini: ${geminiError}`);
            throw new Error("Todas as APIs de imagem falharam.");
        }
    }
}


// ------------------------------------
// 2. GERAÇÃO DE TEXTO/STORYTELLING (Usa Gemini como Principal)
// ------------------------------------
export async function generateText(prompt: string) {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash', 
            contents: [{ role: "user", parts: [{ text: prompt }] }],
        });

        return { 
            text: response.text, 
            source: 'Gemini' 
        };
    } catch (error) {
        throw new Error("Falha na geração de texto com Gemini.");
    }
}


// ------------------------------------
// 3. REMOÇÃO DE FUNDO (Prioriza remove.bg, usa Gemini como Failover)
// ------------------------------------
export async function removeBackground(imageUrl: string) {
    // 1. TENTATIVA PRIMÁRIA (remove.bg)
    try {
        if (!REMOVEBG_API_KEY) throw new Error("Chave remove.bg não configurada.");
        // ### CÓDIGO PARA CHAMADA DE API GRÁTIS DE REMOÇÃO DE FUNDO AQUI ###
        throw new Error("MOCK: Limite remove.bg excedido."); 
    } catch (primaryError) {
        console.warn(`API remove.bg falhou. Usando Gemini como Failover criativo.`);
        
        // 2. FAILOVER (Gemini - Criação de Prompt)
        try {
            // Pede ao Gemini para criar um prompt para refazer a imagem com fundo branco
            const promptGeneration = await ai.models.generateContent({
                model: 'gemini-2.5-flash', 
                contents: [
                    {
                        role: "user", 
                        parts: [
                            { text: `Descreva o objeto principal na imagem (URL: ${imageUrl}). Em seguida, crie um prompt para gerar uma imagem IDÊNTICA com fundo BRANCO PURO.` },
                        ]
                    }
                ]
            });
            
            const newPrompt = promptGeneration.text;
            // Reutiliza a função de imagem para gerar o fallback
            return await generateImage(newPrompt);
            
        } catch (geminiError) {
            throw new Error("Todas as APIs de remoção de fundo falharam.");
        }
    }
}


// ------------------------------------
// 4. GERAÇÃO DE VÍDEO (Storyboard como Fallback)
// ------------------------------------
export async function generateVideoStoryboard(prompt: string) {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro', 
            contents: [{ 
                role: "user", 
                parts: [{ text: `Crie um storyboard detalhado com 5 cenas para um vídeo baseado neste prompt: "${prompt}". Descreva a ação, o ângulo da câmera e a música de fundo para cada cena. Seja criativo.` }] 
            }],
        });

        return { 
            text: response.text, 
            source: 'Gemini Storyboard' 
        };
    } catch (error) {
        throw new Error("Falha na geração do Storyboard com Gemini.");
    }
}