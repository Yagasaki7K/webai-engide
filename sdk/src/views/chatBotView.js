import { marked } from "https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js";

export class ChatbotView {
    #config;
    #container;
    #header;
    #messages;
    #input;
    #form;
    #openBtn;
    #stopBtn;
    #closeBtn;
    #chatWin;
    #floatingIcon;
    #floatingIconBadge;
    #welcomeBubble = null;

    constructor(config) {
        this.#config = config;

        // Seleciona os elementos DOM
        this.#container = document.querySelector("#engide-widget");
        this.#header = document.querySelector(".engide-chat-header");
        this.#messages = document.querySelector("#engide-messages");
        this.#input = document.querySelector("#engide-input");
        this.#form = document.querySelector("#engide-form");
        this.#openBtn = document.querySelector("#engide-open-btn");
        this.#stopBtn = document.querySelector("#engide-stop");
        this.#closeBtn = document.querySelector("#engide-close-btn");
        this.#chatWin = document.querySelector("#engide-chat-window");
        this.#floatingIcon = document.querySelector("#engide-icon");
        this.#floatingIconBadge = document.querySelector(".engide-btn-badge");

        // Aplica o tema e configurações
        this.#applyTheme();
        this.#setHeader();
        this.#setFloatingIcon();
        this.setTypingDotDuration();

        console.log('✅ ChatbotView inicializado');
    }

    setupEventHandlers({ onOpen, onSend, onStop }) {
        if (this.#openBtn) {
            this.#openBtn.onclick = () => {
                this.openChat();
                if (onOpen) onOpen();
            };
        }

        if (this.#stopBtn) {
            this.#stopBtn.onclick = () => {
                if (onStop) onStop();
            };
        }

        if (this.#closeBtn) {
            this.#closeBtn.onclick = () => {
                this.closeChat();
            };
        }

        if (this.#form) {
            this.#form.onsubmit = (e) => {
                e.preventDefault();
                const val = this.#input?.value?.trim() || '';
                if (!val) return;
                this.appendUserMessage(val);
                this.clearInput();
                if (onSend) onSend(val);
            };
        }
    }

    setInputEnabled(enabled) {
        if (this.#input) {
            this.#input.disabled = !enabled;
        }

        const submitBtn = this.#form?.querySelector("button[type=submit]");
        if (submitBtn) {
            submitBtn.disabled = !enabled;
        }

        if (this.#stopBtn) {
            this.#stopBtn.disabled = enabled;
        }
    }

    openChat() {
        if (this.#chatWin) {
            this.#chatWin.style.display = "flex";
        }
        if (this.#floatingIconBadge) {
            this.#floatingIconBadge.style.display = "none";
        }
        setTimeout(() => this.focusInput(), 180);
        this.hideWelcomeBubble();
    }

    closeChat() {
        if (this.#chatWin) {
            this.#chatWin.style.display = "none";
        }
    }

    renderWelcomeBubble() {
        this.#removeElement(this.#welcomeBubble);
        const bubble = document.createElement('div');
        bubble.className = 'engide-welcome-bubble';
        bubble.textContent = this.#config.welcomeBubble;
        bubble.onclick = () => {
            this.openChat();
        };
        document.body.appendChild(bubble);
        this.#welcomeBubble = bubble;
    }

    hideWelcomeBubble() {
        if (this.#welcomeBubble) {
            this.#welcomeBubble.style.display = 'none';
        }
    }

    #renderBotMessageHTML(text, renderMarkdown = true) {
        return `
            <img src="${this.#config.botAvatar}" class="engide-avatar" alt="Bot Avatar" />
            <div class="engide-message-content">${renderMarkdown ? marked.parse(text) : text}</div>
        `;
    }

    appendBotMessage(text, element = null, renderMarkdown = true) {
        const el = element || this.#createBotMessage();
        el.innerHTML = this.#renderBotMessageHTML(text, renderMarkdown);
        this.#append(el);
    }

    createStreamingBotMessage() {
        const element = this.#createBotMessage();
        this.#append(element);
        return element;
    }

    updateStreamingBotMessage(element, text, renderMarkdown = true) {
        element.innerHTML = this.#renderBotMessageHTML(text, renderMarkdown);
        this.#scrollToBottom();
    }

    #scrollToBottom() {
        if (this.#messages) {
            this.#messages.scrollTop = this.#messages.scrollHeight;
        }
    }

    appendUserMessage(text) {
        const msg = this.#createUserMessage(text);
        this.#append(msg);
    }

    #createBotMessage() {
        const msg = document.createElement('div');
        msg.className = 'engide-message engide-message-bot';
        return msg;
    }

    #createUserMessage(text) {
        const msg = document.createElement('div');
        msg.className = 'engide-message engide-message-user';
        msg.innerHTML = `<div class="engide-message-content">${text}</div>`;
        return msg;
    }

    showTypingIndicator() {
        this.hideTypingIndicator();

        const indicator = document.createElement('div');
        indicator.className = 'engide-typing-indicator';
        indicator.innerHTML = `
            <span class="engide-typing-dot"></span>
            <span class="engide-typing-dot"></span>
            <span class="engide-typing-dot"></span>
        `;
        this.#append(indicator);
    }

    hideTypingIndicator() {
        if (this.#messages) {
            const indicator = this.#messages.querySelector('.engide-typing-indicator');
            this.#removeElement(indicator);
        }
    }

    clearInput() {
        if (this.#input) {
            this.#input.value = '';
        }
    }

    focusInput() {
        if (this.#input) {
            this.#input.focus();
        }
    }

    setTypingDotDuration() {
        const delayMs = Number(this.#config.typingDelay) || 1200;
        const durationSec = Math.max(0.6, delayMs / 1000 * 0.66);
        if (this.#container) {
            this.#container.style.setProperty('--typingDotDuration', `${durationSec}s`);
        }
    }

    #append(msgNode) {
        if (this.#messages) {
            this.#messages.appendChild(msgNode);
            this.#scrollToBottom();
        }
    }

    #removeElement(el) {
        if (el && el.parentNode) {
            el.parentNode.removeChild(el);
        }
    }

    #applyTheme() {
        if (!this.#container) return;

        Object.entries(this.#config).forEach(([k, v]) => {
            if (
                typeof v === "string" &&
                (k.endsWith('Color') || k.endsWith('Bubble') || k.endsWith('Text') || k === "buttonColor")
            ) {
                this.#container.style.setProperty(`--${k}`, v);
            }
        });
    }

    #setHeader() {
        if (!this.#header) return;

        const icon = this.#header.querySelector("#engide-header-icon");
        const name = this.#header.querySelector("#engide-chatbot-name");

        if (icon) {
            icon.src = this.#config.iconUrl;
        }
        if (name) {
            name.textContent = this.#config.chatbotName;
        }
    }

    #setFloatingIcon() {
        if (this.#floatingIcon) {
            this.#floatingIcon.src = this.#config.iconUrl;
        }
    }
}