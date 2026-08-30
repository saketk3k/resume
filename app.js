document.addEventListener('DOMContentLoaded', () => {
    // 1. Scroll Progress Bar
    const progressBar = document.getElementById('progress-bar');
    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        progressBar.style.width = scrollPercent + '%';
    });

    // 2. Active Nav Link on Scroll (Intersection Observer)
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    const observerOptions = {
        root: null,
        rootMargin: '-30% 0px -60% 0px',
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => observer.observe(section));

    // 3. Theme Toggle (Light/Dark Mode)
    const themeToggleBtn = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;
    const themeIcon = themeToggleBtn.querySelector('i');

    const savedTheme = localStorage.getItem('theme') || 'dark';
    htmlElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        htmlElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });

    function updateThemeIcon(theme) {
        if (theme === 'light') {
            themeIcon.className = 'fas fa-sun';
        } else {
            themeIcon.className = 'fas fa-moon';
        }
    }

    // 4. Layout Mode Selector (Full vs Concise)
    const btnModeFull = document.getElementById('btn-mode-full');
    const btnModeConcise = document.getElementById('btn-mode-concise');

    const switchMode = (mode) => {
        if (mode === 'full') {
            btnModeFull.classList.add('active');
            btnModeConcise.classList.remove('active');
            htmlElement.setAttribute('data-mode', 'full');
        } else {
            btnModeConcise.classList.add('active');
            btnModeFull.classList.remove('active');
            htmlElement.setAttribute('data-mode', 'concise');
        }
        localStorage.setItem('resume-mode', mode);
    };

    // Load saved layout mode or default to full
    const savedMode = localStorage.getItem('resume-mode') || 'full';
    switchMode(savedMode);

    btnModeFull.addEventListener('click', () => switchMode('full'));
    btnModeConcise.addEventListener('click', () => switchMode('concise'));

    // 5. Interactive Skills Filtering
    const filterButtons = document.querySelectorAll('.filter-btn');
    const skillCategories = document.querySelectorAll('.skill-category');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');

            skillCategories.forEach(category => {
                const categoryCat = category.getAttribute('data-cat');
                
                if (filterValue === 'all') {
                    category.style.display = 'block';
                    category.classList.remove('highlight');
                    category.style.opacity = '1';
                } else if (categoryCat === filterValue) {
                    category.style.display = 'block';
                    category.classList.add('highlight');
                    category.style.opacity = '1';
                } else {
                    category.style.display = 'none';
                    category.classList.remove('highlight');
                }
            });
        });
    });

    // 6. Experience Timeline Accordion
    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach(item => {
        const contentHeader = item.querySelector('.job-header');
        contentHeader.addEventListener('click', () => {
            timelineItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
        });
    });

    // 7. "Ask Saket AI" Chat Widget
    const chatWidget = document.getElementById('ai-chat-widget');
    const chatToggleBtn = document.getElementById('chat-toggle');
    const chatMessages = document.getElementById('chat-messages');
    const chatSuggestions = document.getElementById('chat-suggestions');

    const toggleChat = (e) => {
        if (e) e.stopPropagation();
        chatWidget.classList.toggle('minimized');
        const icon = chatToggleBtn.querySelector('i');
        if (chatWidget.classList.contains('minimized')) {
            icon.className = 'fas fa-chevron-up';
        } else {
            icon.className = 'fas fa-chevron-down';
            scrollToBottom();
        }
    };

    chatWidget.querySelector('.chat-header').addEventListener('click', toggleChat);
    chatToggleBtn.addEventListener('click', toggleChat);

    // Q&A Database updated with new projects
    const qaResponses = {
        release_intelligence: {
            question: "Tell me about Release Intelligence",
            answer: "Release Intelligence is a milestone agentic project I designed at Accelya. It acts as an **autonomous deployment gatekeeper**. It analyzes telemetry, test suites, and live logs at various stages of production deployment. The system makes fact-based **go/no-go release decisions** and triggers auto-abort/rollback routines if it detects anomalies, ensuring extreme production safety."
        },
        devops_achievements: {
            question: "What did you build in DevOps?",
            answer: "I consolidated divergent DevOps processes across portfolios into a **'Common Way of Working'** tooling and pipeline process. I built CI/CD infrastructures from scratch, resulting in **50%+ build time reductions** using runner parallelism and intelligent caching. Additionally, I implemented AI-driven on-the-fly pipeline generators, self-service portals, and automated PR reviewers."
        },
        replay_testing: {
            question: "Explain Replay testing",
            answer: "Replay testing (comprising **Engine Replay** and traffic mirroring) is a unique QA strategy I introduced. We mirror real-world production traffic and database transactions, then 'replay' them inside safe replica sandboxes. This allows us to validate backend logic, configuration changes, and performance limits against real workloads without impacting live users."
        },
        ai_onboarding: {
            question: "How did you accelerate onboarding?",
            answer: "I introduced LLM agents that read client custom documentation to automatically map configurations, speeding up customer onboarding times by **60%**. Furthermore, I set up AI-driven support bots that deflect **45%** of common DevOps platform support queries, allowing the platform team to focus on core features."
        }
    };

    chatSuggestions.addEventListener('click', (e) => {
        const btn = e.target.closest('.chat-suggest-btn');
        if (!btn) return;

        const responseKey = btn.getAttribute('data-question');
        const qaData = qaResponses[responseKey];
        if (!qaData) return;

        appendMessage('user', qaData.question);
        
        chatSuggestions.style.pointerEvents = 'none';
        chatSuggestions.style.opacity = '0.5';

        showTypingIndicator();

        setTimeout(() => {
            removeTypingIndicator();
            appendMessage('system', qaData.answer);
            
            chatSuggestions.style.pointerEvents = 'auto';
            chatSuggestions.style.opacity = '1';
        }, 1000);
    });

    function appendMessage(sender, text) {
        const msgDiv = document.createElement('div');
        msgDiv.className = `message ${sender}`;
        
        const txtDiv = document.createElement('div');
        txtDiv.className = 'message-text';
        txtDiv.innerHTML = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        
        msgDiv.appendChild(txtDiv);
        chatMessages.appendChild(msgDiv);
        scrollToBottom();
    }

    let typingIndicator = null;

    function showTypingIndicator() {
        typingIndicator = document.createElement('div');
        typingIndicator.className = 'message system typing-indicator-wrapper';
        
        const txtDiv = document.createElement('div');
        txtDiv.className = 'message-text';
        
        const dotsDiv = document.createElement('div');
        dotsDiv.className = 'typing-dots';
        dotsDiv.innerHTML = '<span></span><span></span><span></span>';
        
        txtDiv.appendChild(dotsDiv);
        typingIndicator.appendChild(txtDiv);
        chatMessages.appendChild(typingIndicator);
        scrollToBottom();
    }

    function removeTypingIndicator() {
        if (typingIndicator) {
            typingIndicator.remove();
            typingIndicator = null;
        }
    }

    function scrollToBottom() {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
});
