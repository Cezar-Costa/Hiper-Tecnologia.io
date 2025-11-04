const navToggle = document.querySelector('.main-nav__toggle');
const navToggleIcon = navToggle?.querySelector('i');
const navList = document.querySelector('.main-nav__list');
const navLinks = document.querySelectorAll('.nav-link');
const counters = document.querySelectorAll('.metric__number');
const form = document.querySelector('.contact__form');
const formStatus = document.querySelector('.form-status');
const toast = document.querySelector('.toast');
const whatsappButton = document.querySelector('.floating-whatsapp');
const chatWidget = document.querySelector('.chat-widget');
const chatCloseButton = document.querySelector('.chat-widget__close');
const chatCTAButton = document.querySelector('.chat-widget__cta');
const chatTypingBubble = chatWidget?.querySelector('.chat-bubble--typing');
const chatMessageBubble = chatWidget?.querySelector('.chat-bubble--message');
const chatMessageTime = chatMessageBubble?.querySelector('time');
const chatMessageContent = chatMessageBubble?.querySelector('[data-chat-message]');
const chatTypingDots = chatTypingBubble?.querySelectorAll('.typing-indicator span');
const yearEl = document.getElementById('year');
const modal = document.getElementById('solution-modal');
const modalTitle = modal?.querySelector('.modal__title');
const modalBody = modal?.querySelector('.modal__body');
const modalCloseButton = modal?.querySelector('.modal__close');
const modalOverlay = modal?.querySelector('[data-dismiss-modal]');
const modalTriggers = document.querySelectorAll('[data-modal]');
let lastFocusedElement = null;
let chatTypingTimeout = null;

const getChatTimestamp = () => {
  const now = new Date();
  return now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
};

if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

if (chatMessageTime) {
  const timestamp = getChatTimestamp();
  chatMessageTime.textContent = timestamp;
  chatMessageTime.setAttribute('datetime', timestamp);
}

const toggleNav = () => {
  const expanded = navToggle.getAttribute('aria-expanded') === 'true';
  navToggle.setAttribute('aria-expanded', String(!expanded));
  navToggle.setAttribute('aria-label', !expanded ? 'Fechar menu' : 'Abrir menu');
  navList.setAttribute('aria-expanded', String(!expanded));
  navList.classList.toggle('is-open');
  if (navToggleIcon) {
    navToggleIcon.classList.toggle('fa-bars', expanded);
    navToggleIcon.classList.toggle('fa-xmark', !expanded);
  }
};

navToggle?.addEventListener('click', toggleNav);

navLinks.forEach((link) =>
  link.addEventListener('click', () => {
    if (window.innerWidth <= 768 && navToggle) {
      toggleNav();
    }
  })
);

const animateCounter = (entry) => {
  entry.forEach((item) => {
    if (!item.isIntersecting) return;
    const element = item.target;
    const targetValue = element.dataset.count;
    const isPercent = targetValue.includes('%');
    const isPrefix = targetValue.startsWith('+');
    const numericValue = parseInt(targetValue.replace(/[^0-9]/g, ''), 10);
    let current = 0;
    const increment = Math.ceil(numericValue / 40);

    const updateCounter = () => {
      current += increment;
      if (current > numericValue) {
        current = numericValue;
      }
      const formatted = `${isPrefix ? '+' : ''}${current}${isPercent ? '%' : ''}`;
      element.textContent = formatted;
      if (current < numericValue) {
        requestAnimationFrame(updateCounter);
      }
    };

    requestAnimationFrame(updateCounter);
    observer.unobserve(element);
  });
};

const observer = new IntersectionObserver(animateCounter, {
  threshold: 0.6,
});

counters.forEach((counter) => observer.observe(counter));

form?.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!formStatus || !toast) return;

  formStatus.textContent = 'Enviando...';
  formStatus.style.color = 'var(--text-muted)';

  setTimeout(() => {
    formStatus.textContent = 'Mensagem enviada com sucesso!';
    formStatus.style.color = 'var(--primary-dark)';
    toast.setAttribute('aria-hidden', 'false');
    setTimeout(() => {
      toast.setAttribute('aria-hidden', 'true');
      form.reset();
      formStatus.textContent = '';
    }, 2200);
  }, 900);
});

const resetTypingAnimation = () => {
  if (!chatTypingDots) return;
  chatTypingDots.forEach((dot) => {
    dot.style.animation = 'none';
    // Force reflow to restart the animation timeline
    void dot.offsetWidth;
    dot.style.animation = '';
  });
};

const stopChatTyping = () => {
  if (chatTypingTimeout) {
    window.clearTimeout(chatTypingTimeout);
    chatTypingTimeout = null;
  }
  if (chatTypingBubble) {
    chatTypingBubble.hidden = true;
    chatTypingBubble.setAttribute('aria-hidden', 'true');
  }
  if (chatMessageBubble) {
    chatMessageBubble.hidden = false;
    chatMessageBubble.setAttribute('aria-hidden', 'false');
  }
};

const simulateChatGreeting = () => {
  if (!chatWidget) return;
  stopChatTyping();
  if (chatTypingBubble) {
    chatTypingBubble.hidden = false;
    chatTypingBubble.setAttribute('aria-hidden', 'false');
  }
  if (chatMessageBubble) {
    chatMessageBubble.hidden = true;
    chatMessageBubble.setAttribute('aria-hidden', 'true');
  }
  resetTypingAnimation();
  chatTypingTimeout = window.setTimeout(() => {
    const formatted = getChatTimestamp();
    if (chatMessageTime) {
      chatMessageTime.textContent = formatted;
      chatMessageTime.setAttribute('datetime', formatted);
    }
    if (chatMessageContent) {
      chatMessageContent.textContent = 'Olá, como podemos auxiliar você hoje?';
    }
    if (chatTypingBubble) {
      chatTypingBubble.hidden = true;
      chatTypingBubble.setAttribute('aria-hidden', 'true');
    }
    if (chatMessageBubble) {
      chatMessageBubble.hidden = false;
      chatMessageBubble.setAttribute('aria-hidden', 'false');
    }
    chatTypingTimeout = null;
  }, 1100);
};

const toggleChatWidget = () => {
  if (!chatWidget || !whatsappButton) return;
  const isOpen = chatWidget.classList.toggle('is-open');
  chatWidget.setAttribute('aria-hidden', String(!isOpen));
  whatsappButton.setAttribute('aria-expanded', String(isOpen));
  whatsappButton.setAttribute('aria-label', isOpen ? 'Fechar simulador do chat' : 'Abrir simulador do chat');
  if (isOpen) {
    simulateChatGreeting();
  } else {
    stopChatTyping();
  }
};

whatsappButton?.addEventListener('click', toggleChatWidget);

chatCloseButton?.addEventListener('click', () => {
  if (!chatWidget || !whatsappButton) return;
  chatWidget.classList.remove('is-open');
  chatWidget.setAttribute('aria-hidden', 'true');
  whatsappButton.setAttribute('aria-expanded', 'false');
  whatsappButton.setAttribute('aria-label', 'Abrir simulador do chat');
  stopChatTyping();
});

chatCTAButton?.addEventListener('click', () => {
  window.open('https://wa.me/5588996514258', '_blank');
});

const openModal = (id) => {
  if (!modal || !modalTitle || !modalBody) return;
  const template = document.getElementById(`modal-template-${id}`);
  if (!(template instanceof HTMLTemplateElement)) return;

  lastFocusedElement = document.activeElement;
  modalTitle.textContent = template.dataset.title ?? '';
  modalBody.innerHTML = '';
  modalBody.appendChild(template.content.cloneNode(true));

  modal.classList.add('is-open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
  modalCloseButton?.focus();
};

const closeModal = () => {
  if (!modal || !modalBody) return;
  modal.classList.remove('is-open');
  modal.setAttribute('aria-hidden', 'true');
  modalBody.innerHTML = '';
  document.body.classList.remove('modal-open');
  if (lastFocusedElement instanceof HTMLElement) {
    lastFocusedElement.focus();
  }
};

modalTriggers.forEach((trigger) =>
  trigger.addEventListener('click', (event) => {
    event.preventDefault();
    const id = trigger.getAttribute('data-modal');
    if (id) {
      openModal(id);
    }
  })
);

modalCloseButton?.addEventListener('click', closeModal);
modalOverlay?.addEventListener('click', closeModal);

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && chatWidget?.classList.contains('is-open')) {
    chatWidget.classList.remove('is-open');
    chatWidget.setAttribute('aria-hidden', 'true');
    whatsappButton?.setAttribute('aria-expanded', 'false');
    whatsappButton?.setAttribute('aria-label', 'Abrir simulador do chat');
    stopChatTyping();
  }

  if (event.key === 'Escape' && modal?.classList.contains('is-open')) {
    closeModal();
  }
});

const header = document.querySelector('.site-header');
const heroSection = document.querySelector('.hero');

const handleScroll = () => {
  if (!header || !heroSection) return;
  const heroHeight = heroSection.offsetHeight;
  header.classList.toggle('site-header--scrolled', window.scrollY > heroHeight * 0.15);
};

window.addEventListener('scroll', handleScroll);
handleScroll();