// @ts-check

import { ChatbotView } from './views/chatBotView.js';
import { PromptService } from './services/promptService.js'
import { ChatbotController } from './controllers/chatBotController.js';

function isChrome() {
    const ua = navigator.userAgent;
    return (
        ua.indexOf("Chrome") > -1 &&
        ua.indexOf("Edg") === -1 &&
        ua.indexOf("OPR") === -1
    );
}

function createWidgetHTML() {
    return `
        <button id="engide-open-btn" class="engide-btn" aria-label="Abrir chat">
            <span class="engide-btn-avatar-wrapper">
                <img id="engide-icon" alt="Chatbot" src="https://yagasaki7k.github.io/webai-engide/botData/avatar.png" />
                <span class="engide-btn-badge">1</span>
            </span>
        </button>
        <div class="engide-chat-window" id="engide-chat-window" style="display:none">
            <div class="engide-chat-header">
                <img src="https://yagasaki7k.github.io/webai-engide/botData/avatar.png" alt="Bot logo" class="engide-chat-header-logo" id="engide-header-icon" />
                <span class="engide-chatbot-name" id="engide-chatbot-name"></span>
                <button class="engide-close-btn" id="engide-close-btn">&times;</button>
            </div>
            <div class="engide-chat-body" id="engide-messages"></div>
            <form class="engide-chat-footer" id="engide-form" autocomplete="off">
                <input type="text" id="engide-input" placeholder="Digite sua mensagem..." autocomplete="off" />
                <button type="submit" id="engide-submit">Enviar</button>
            </form>
        </div>
    `;
}

function ensureWidget() {
    let widget = document.getElementById('engide-widget');
    if (!widget) {
        console.log('🔧 Widget não encontrado, criando...');
        widget = document.createElement('div');
        widget.id = 'engide-widget';
        widget.style.display = 'none';
        widget.innerHTML = createWidgetHTML();
        document.body.appendChild(widget);
        console.log('✅ Widget criado com sucesso');
    }
    return widget;
}

function showWidget() {
    const widget = ensureWidget();
    if (!widget) {
        console.error('❌ Widget não encontrado');
        return false;
    }

    if (isChrome()) {
        widget.style.display = 'block';
        console.log('✅ Chrome detectado - Widget visível');
        return true;
    } else {
        widget.style.display = 'none';
        console.log('❌ Navegador não suportado - Widget oculto');
        return false;
    }
}

async function initChatbot() {
    console.log('🚀 Inicializando chatbot...');

    const isChromeBrowser = showWidget();

    if (!isChromeBrowser) {
        console.log('⛔ Chatbot não inicializado - Navegador não suportado');
        return;
    }

    const root = new URL('../../', import.meta.url);
    // @ts-ignore
    const fromMainProject = (path) => new URL(path, root).toString();

    const [css, config, llmsTxt] = await Promise.all([
        fetch(fromMainProject('https://yagasaki7k.github.io/webai-engide/sdk/engide-chatbot.css')).then(r => r.text()),
        fetch('https://yagasaki7k.github.io/webai-engide/botData/chatbot-config.json').then(r => r.json()),
        fetch('https://yagasaki7k.github.io/webai-engide/llms.txt').then(r => r.text()),
    ]);

    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);

    const systemPrompt = llmsTxt;

    console.log('📝 System prompt carregado, tamanho:', systemPrompt.length);
    console.log('📄 llms.txt carregado, tamanho:', llmsTxt.length);

    const promptService = new PromptService();
    const chatbotView = new ChatbotView(config);
    const controller = new ChatbotController({ chatbotView, promptService });

    await controller.init({
        firstBotMessage: config.welcomeBubble || "Olá! Como posso ajudar sua empresa hoje?",
        text: systemPrompt,
    });

    console.log('✅ Chatbot inicializado com sucesso!');
}

initChatbot();