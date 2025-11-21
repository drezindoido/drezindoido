import { useEffect, useState } from "react";
// Importação de componentes (Mantenha o caminho relativo correto!)
import { PromoBar } from "../components/PromoBar";
import { Sidebar } from "../components/Sidebar";
import Header from "../components/Header";
import { CreationCard } from "../components/CreationCard";
import { FeaturedAppCard } from "../components/FeaturedAppCard";
import { ModelCard } from "../components/ModelCard";
// Ícones Lucide
import { Video, Paintbrush, Grid, FileText, ArrowRight, Search, Lock, Youtube, Instagram, Tiktok, Upload } from "lucide-react";

// A URL do seu servidor Backend hospedado (Render)
// O Vercel/Netlify injeta esta variável de ambiente (VITE_BACKEND_URL)
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001/api'; 

const Index = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [isPremium, setIsPremium] = useState(true); // SIMULANDO USUÁRIO PREMIUM para deploy
  const [loading, setLoading] = useState(false);
  const [uploadedFileUrl, setUploadedFileUrl] = useState(''); // Mock da URL da imagem carregada

  // ----------------------------------------------------
  // FUNÇÃO DE CONEXÃO AO BACKEND
  // ----------------------------------------------------
  const handleAiAction = async (actionType, userPrompt) => {
    // Bloqueio Premium (Image e Video são premium)
    if (!isPremium && (actionType === 'image' || actionType === 'video')) {
         setCurrentPage('payment');
         return;
    }
    
    let endpoint = actionType; // ex: 'image', 'video', 'text'
    let payload = { prompt: userPrompt }; 

    if (actionType === 'remove-bg') {
        // Para remover fundo, usamos a URL do arquivo mockado
        if (!uploadedFileUrl) return alert("Por favor, faça upload de uma imagem primeiro!");
        payload = { imageUrl: uploadedFileUrl };
    }
    
    setLoading(true);
    console.log(`Enviando para: ${BACKEND_URL}/${endpoint}`);
    
    try {
        const response = await fetch(`${BACKEND_URL}/${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        const data = await response.json();
        setLoading(false);

        if (!response.ok) {
            alert(`ERRO: ${data.error} (Fonte: ${data.source})`);
            return;
        }
        
        // Sucesso: Mostrar o Resultado
        let successMessage = `✅ Sucesso! Processado por: ${data.source}\n\n`;
        
        if (actionType === 'image' || actionType === 'remove-bg') {
            // Em uma app real, você exibiria o data.url na tela
            successMessage += `Resultado: Imagem gerada/processada.`;
        } else if (actionType === 'text' || actionType === 'video') {
             // Vídeo retorna o Storyboard
             successMessage += `Resultado (Prévia): ${data.text.substring(0, 300)}...`;
        }
        
        alert(successMessage);

    } catch (networkError) {
        setLoading(false);
        alert(`❌ Erro de Conexão: O servidor (${BACKEND_URL}) pode estar offline. Verifique o Render.`);
        console.error('Network Error:', networkError);
    }
  };
  // ----------------------------------------------------
  // FIM DA FUNÇÃO DE CONEXÃO AO BACKEND
  // ----------------------------------------------------

  // ... (Componentes Auxiliares e Lógica de Pagamento Mock - Omitidos para brevidade) ...

  const PremiumLock = () => (/* ... */);
  const PaymentPage = () => (/* ... */);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
        // MOCK: Em uma app real, você faria upload para o S3/Cloud Storage e obteria a URL pública
        const mockUrl = `https://seuservidor.com/uploads/${file.name}`;
        setUploadedFileUrl(mockUrl);
        alert(`Arquivo selecionado: ${file.name}. URL Mockada: ${mockUrl}. Pronto para processamento!`);
    }
  };

  if (currentPage === 'payment') {
    return (/* Retorno da PaymentPage */);
  }

  // Componente Mock para os Novos Apps de Vídeo (Chamada ao handleAiAction)
  const VideoAppCard = ({ title, subtitle, link, actionType, isNew = false, prompt }) => {
    const handleClick = () => {
        if (link) {
            window.open(link, '_blank');
        } else if (actionType) {
            handleAiAction(actionType, prompt);
        }
    };
    
    return (
        <div onClick={handleClick} className="group cursor-pointer">
            <FeaturedAppCard
                title={title}
                subtitle={subtitle}
                imageSrc="/lovable-uploads/video-icon-placeholder.png"
                isNew={isNew}
            />
            <span className="text-xs text-blue-400 mt-1 block group-hover:underline">
                {link ? 'Acessar Site Externo' : 'Processar via Backend/Gemini'}
            </span>
        </div>
    );
  };
  
  return (
    <div className="min-h-screen flex flex-col">
        {loading && <div className="fixed inset-0 bg-black/70 flex items-center justify-center text-white z-50">Processando com IA... (Aguarde o Backend!)</div>}
        <div className="flex flex-1">
            <Sidebar />
            <div className="flex-1 flex flex-col">
                <Header />
                <div className="flex-1 overflow-auto">
                    <main className="py-8 px-12">
                        
                        {/* SEÇÃO PLATAFORMAS SOCIAIS (MANTIDA) */}
                        <div className="flex items-center space-x-6 mb-8 pt-2">
                            {/* YOUTUBE: LINK MANTIDO EXATAMENTE COMO SOLICITADO */}
                            <a 
                                href="https://l.instagram.com/?u=https%3A%2F%2Fm.youtube.com%2Fchannel%2FUCQrffJZRD6-ONOzJvd9vaKg%3Fsub_confirmation%3D1&e=ATOkaDgVlV0KtVtF2jugCzWNVXeaUgFliGfJZKRFT8KtTUzDNzcLe1iYGD_s4JeBa26eRK8NH5TFFtChIBNweg&s=1" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-gray-400 hover:text-red-500 transition-colors"
                                title="YouTube - Inscreva-se Já!"
                            >
                                <Youtube size={32} />
                            </a>
                            <a 
                                href="https://www.instagram.com/dreeziinff/" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-gray-400 hover:text-pink-500 transition-colors"
                                title="Instagram - dreeziinff"
                            >
                                <Instagram size={32} />
                            </a>
                            <a 
                                href="https://www.tiktok.com/@dreeziinff?lang=pt-BR" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-gray-400 hover:text-white transition-colors"
                                title="TikTok - dreeziinff"
                            >
                                <Tiktok size={32} />
                            </a>
                            <h3 className="text-xl font-medium text-gray-500 ml-4 hidden md:block">
                                Conecte-se com a Turminha da Higiene
                            </h3>
                        </div>
                        {/* FIM DA SEÇÃO SOCIAL */}

                        <h1 className="text-3xl font-bold text-white mb-8">
                            O que você gostaria de criar?
                        </h1>
                        
                        {/* SEÇÃO DE UPLOAD DE ARQUIVOS */}
                        <section className="mb-12 border-2 border-dashed border-gray-700 hover:border-gray-500 transition-colors p-8 rounded-xl flex flex-col items-center bg-[#1A1A1A]/50">
                            <Upload size={48} className="text-gray-500 mb-4" />
                            <h2 className="text-xl text-white mb-2">Adicionar Arquivos ou Imagens</h2>
                            <p className="text-sm text-gray-400 mb-4">Arraste e solte ou clique para selecionar suas mídias para processamento.</p>
                            <input 
                                type="file" 
                                id="file-upload" 
                                className="hidden" 
                                accept="image/*,video/*" 
                                multiple 
                                onChange={handleFileUpload}
                            />
                            <label 
                                htmlFor="file-upload" 
                                className="bg-gray-700 hover:bg-gray-600 transition-colors text-white font-medium py-2 px-6 rounded-full cursor-pointer"
                            >
                                Selecionar Arquivos
                            </label>
                            {uploadedFileUrl && <p className="text-xs text-green-400 mt-2">Pronto: {uploadedFileUrl}</p>}
                        </section>

                        <div className="grid grid-cols-2 gap-6 mb-12">
                            {/* Creation Cards chamam o backend */}
                            <CreationCard type="image" onClick={() => handleAiAction("image", "Gere um gato astronauta no estilo pop art")} />
                            <CreationCard type="storytelling" onClick={() => handleAiAction("text", "Crie uma história de higiene de 5 parágrafos para crianças")} />
                        </div>
                        
                        <section className="mb-12">
                            <h2 className="text-2xl font-bold text-white mb-6">Inícios Rápidos</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                
                                {/* Image to Video (PREMIUM) */}
                                <div 
                                    onClick={() => handleAiAction('video', "Faça um vídeo curto de um cão pulando")} 
                                    className={`bg-[#1A1A1A] rounded-lg p-4 flex items-start cursor-pointer ${!isPremium ? 'opacity-60 border border-yellow-500' : 'hover:bg-[#2A2A2A] transition-colors'}`}
                                >
                                    {/* ... Conteúdo do Card ... */}
                                </div>
                                
                                {/* Choose a Style (FREE) */}
                                <div onClick={() => handleAiAction('text', "Quais estilos são populares agora?")} className="bg-[#1A1A1A] rounded-lg p-4 flex items-start cursor-pointer hover:bg-[#2A2A2A] transition-colors">
                                    {/* ... Conteúdo do Card ... */}
                                </div>
                                
                                {/* Explore Models (FREE) */}
                                <div onClick={() => handleAiAction('text', "Liste os 5 modelos de IA mais eficientes para imagens")} className="bg-[#1A1A1A] rounded-lg p-4 flex items-start cursor-pointer hover:bg-[#2A2A2A] transition-colors">
                                    {/* ... Conteúdo do Card ... */}
                                </div>
                                
                                {/* Train Model (FREE) */}
                                <div onClick={() => handleAiAction('text', "Dicas de treinamento de modelo")} className="bg-[#1A1A1A] rounded-lg p-4 flex items-start cursor-pointer hover:bg-[#2A2A2A] transition-colors">
                                    {/* ... Conteúdo do Card ... */}
                                </div>
                                
                                {/* Ultimate Upscale (PREMIUM) */}
                                <div 
                                    onClick={() => handleAiAction('image', "Aumente a resolução da imagem carregada com qualidade fotorealista")} 
                                    className={`bg-[#1A1A1A] rounded-lg p-4 flex items-start cursor-pointer ${!isPremium ? 'opacity-60 border border-yellow-500' : 'hover:bg-[#2A2A2A] transition-colors'}`}
                                >
                                    {/* ... Conteúdo do Card ... */}
                                </div>
                                
                                {/* Image to Prompt (FREE) */}
                                <div onClick={() => handleAiAction('text', "Crie um prompt detalhado para a imagem carregada")} className="bg-[#1A1A1A] rounded-lg p-4 flex items-start cursor-pointer hover:bg-[#2A2A2A] transition-colors">
                                    {/* ... Conteúdo do Card ... */}
                                </div>
                            </div>
                        </section>
                        
                        {/* SEÇÃO IA VÍDEOS E EDIÇÃO */}
                        <section className="mb-12">
                            <h2 className="text-2xl font-bold text-white mb-6">🎬 IA Vídeos e Edição (APIs e Sites Gratuitos)</h2>
                            <h3 className="text-xl font-semibold text-gray-300 mb-4">APIs Gratuitas para Edição/Criação (Via Nosso Backend) - 5x</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                                {/* Runway Gen-2 */}
                                <VideoAppCard title="Runway Gen-2" subtitle="Texto para Vídeo (Free Trial)" actionType="video" prompt="Gere uma cena de ficção científica" isNew={true}/>
                                {/* CapCut API */}
                                <VideoAppCard title="CapCut API" subtitle="Edição Básica e Filtros" actionType="video" prompt="Aplique o filtro 'Vaporwave' ao vídeo carregado"/>
                                {/* Pikachu API */}
                                <VideoAppCard title="Pikachu API" subtitle="Animação de Imagens" actionType="video" prompt="Anime a imagem carregada com zoom dramático"/>
                                {/* DeepMotion */}
                                <VideoAppCard title="DeepMotion" subtitle="Mocape de Personagens (Free Tier)" actionType="video" prompt="Crie um mocape de dança moderna"/>
                                {/* Luma AI */}
                                <VideoAppCard title="Luma AI" subtitle="Vídeo 3D NeRF (Free Access)" actionType="video" prompt="Gere um objeto 3D flutuante"/>
                            </div>
                            
                            <h3 className="text-xl font-semibold text-gray-300 mb-4 mt-8">Editores de Vídeo Online Gratuitos (Sites Externos) - 5x</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                                {/* Editores Externos */}
                                <VideoAppCard title="DaVinci Resolve" subtitle="Editor Completo (Download Grátis)" link="https://www.blackmagicdesign.com/products/davinciresolve/"/>
                                <VideoAppCard title="Veed.io" subtitle="Edição Online Simples" link="https://www.veed.io/"/>
                                <VideoAppCard title="CapCut Online" subtitle="Editor Web Completo e Gratuito" link="https://www.capcut.com/pt-br/editor-de-video"/>
                                <VideoAppCard title="Clipchamp" subtitle="Editor da Microsoft (Free Tier)" link="https://clipchamp.com/"/>
                                <VideoAppCard title="Kizoa" subtitle="Criação de Montagens e Colagens" link="https://www.kizoa.com/"/>
                            </div>
                        </section>

                        {/* SEÇÃO SERVIÇOS GERAIS DE IA */}
                        <section className="mb-12">
                            <h2 className="text-2xl font-bold text-white mb-6">Serviços Gerais de IA</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {/* Remove background (LINK EXTERNO remove.bg) */}
                                <a href="https://www.remove.bg/" target="_blank" rel="noopener noreferrer" className="cursor-pointer">
                                    <FeaturedAppCard title="Remove background" subtitle="Via remove.bg (External)" imageSrc="/lovable-uploads/b89881e6-12b4-4527-9c22-1052b8116ca9.png"/>
                                </a>
                                {/* Outros Featured Apps (Chamada ao Backend) */}
                                <FeaturedAppCard title="AI Filters" subtitle="By OpenArt (Gemini)" imageSrc="/lovable-uploads/142dea30-a410-4e79-84d0-70189e8fcd07.png" onClick={() => handleAiAction('image', 'Aplique um filtro cyberpunk na imagem carregada')} />
                                <FeaturedAppCard title="Sketch to image" subtitle="By OpenArt (Gemini)" imageSrc="/lovable-uploads/b67f802d-430a-4e5a-8755-b61e10470d58.png" onClick={() => handleAiAction('image', 'Converta o esboço carregado em arte final')} />
                                <FeaturedAppCard title="Blend Board" subtitle="By OpenArt (Gemini)" imageSrc="/lovable-uploads/4255fa40-8036-4424-a210-e3bcd99754df.png" onClick={() => handleAiAction('image', 'Misture a imagem A com a imagem B e crie um dragão')} />
                            </div>
                        </section>
                        
                        {/* ... (Seção Modelos mantida) ... */}

                    </main>
                </div>
            </div>
        </div>
    );
};

export default Index;