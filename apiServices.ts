// apiServices.ts
// Versão 100% Mockada sem chaves de API

import axios from 'axios';

// Variáveis de Ambiente são ignoradas para este deploy
const GEMINI_API_KEY = process.env.GEMINI_API_KEY; 

// ------------------------------------
// 1. GERAÇÃO DE IMAGEM
// ------------------------------------
export async function generateImage(prompt: string) {
    console.log(`MOCK: Processando imagem para o prompt: ${prompt}`);
    
    // Retorna um link de imagem de placeholder (simulando a URL da imagem gerada)
    return { 
        url: `https://picsum.photos/400/400?random=${Math.random()}`, 
        source: 'MOCK API (Imagem Gerada)' 
    };
}


// ------------------------------------
// 2. GERAÇÃO DE TEXTO/STORYTELLING
// ------------------------------------
export async function generateText(prompt: string) {
    console.log(`MOCK: Processando texto para o prompt: ${prompt}`);
    
    // Retorna um texto de placeholder longo
    const textResult = `MOCK GEMINI RESPONSE: "A Turminha da Higiene e a Missão da Escova Mágica."
    
    Era uma vez, no Reino da Boca Limpa, um pequeno herói chamado Dente. Dente estava sempre pronto para aventuras, mas ele precisava da ajuda de sua fiel amiga, a Escova Mágica. Certo dia, o vilão Cárie tentou se esconder em um canto escuro.

    A Escova Mágica, guiada pelo nosso herói, Dente, começou a fazer sua dança especial, um zigue-zague mágico que espantava todos os vilões. O Doutor Creme Dental deu a eles a espuma superpoderosa, garantindo que o reino ficasse brilhante e seguro.

    Moral da história: Com a Escova Mágica e o Creme Dental, todos os dentes ficam fortes e brilhantes, prontos para sorrir para o mundo!
    
    (Resultado gerado por MOCK TEXT API)`;

    return { 
        text: textResult, 
        source: 'MOCK API (Gemini Text)' 
    };
}


// ------------------------------------
// 3. REMOÇÃO DE FUNDO
// ------------------------------------
export async function removeBackground(imageUrl: string) {
    console.log(`MOCK: Processando remoção de fundo para: ${imageUrl}`);
    
    // Simula a URL da imagem processada
    return { 
        url: `https://picsum.photos/400/400?grayscale&random=${Math.random()}`, 
        source: 'MOCK API (Remove BG)' 
    };
}


// ------------------------------------
// 4. GERAÇÃO DE VÍDEO (Storyboard como Fallback)
// ------------------------------------
export async function generateVideoStoryboard(prompt: string) {
    console.log(`MOCK: Gerando Storyboard para: ${prompt}`);
    
    const storyboardText = `MOCK STORYBOARD GEMINI PRO:
    
    **CENA 1: Introdução Mágica**
    * **Ação:** Um close-up na Escova Mágica que brilha, seguida por um zoom out revelando Dente, o herói, pronto para agir.
    * **Ângulo:** Ângulo alto, estilo épico.
    * **Música:** Música orquestral leve e inspiradora.

    **CENA 2: O Vilão Cárie**
    * **Ação:** O vilão Cárie (uma mancha preta) tentando se esconder no canto de um molar, tremendo de medo.
    * **Ângulo:** Close-up nos "esconderijos".
    * **Música:** Suspense cômico.

    **CENA 3: A Dança da Escovação**
    * **Ação:** Movimentos rápidos e fluidos da Escova Mágica em um movimento de zigue-zague, limpando a tela.
    * **Ângulo:** Visão microscópica e dinâmica.
    * **Música:** Batida animada e rápida.
    
    (Resultado gerado por MOCK VIDEO API)`;

    return { 
        text: storyboardText, 
        source: 'MOCK API (Storyboard)' 
    };
}