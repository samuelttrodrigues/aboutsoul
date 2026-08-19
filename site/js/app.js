// LÓGICA PRINCIPAL - SITE GUIA AUXÍLIO ESTUDANTIL UTFPR

document.addEventListener('DOMContentLoaded', () => {
  
  // ==========================================================================
  // 1. ESTADO GLOBAL DA APLICAÇÃO
  // ==========================================================================
  
  // Achatando a estrutura de categorias para obter uma lista linear de páginas
  const allPages = [];
  GUIA_DATA.forEach(category => {
    category.pages.forEach(page => {
      // Guarda a referência de ID da categoria para navegação/breadcrumbs
      allPages.push({
        ...page,
        categoryTitle: category.title,
        categoryId: category.id
      });
    });
  });

  let activePageIndex = 0;
  let checklistState = JSON.parse(localStorage.getItem('guia_utfpr_checklist_state')) || {};
  // Elementos do DOM
  const sidebar = document.getElementById('sidebar');
  const menuToggle = document.getElementById('menuToggle');
  const sidebarOverlay = document.getElementById('sidebarOverlay');
  const navMenu = document.getElementById('navigationMenu');
  const searchInput = document.getElementById('searchInput');
  const clearSearch = document.getElementById('clearSearch');
  const breadcrumbs = document.getElementById('breadcrumbs');
  const progressText = document.getElementById('progressText');
  const progressBar = document.getElementById('progressBar');
  const pageContainer = document.getElementById('pageContainer');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const themeOptBtns = document.querySelectorAll('.theme-opt-btn');
  const themeToggleMobile = document.getElementById('themeToggleMobile');

  // ==========================================================================
  // 2. GERENCIAMENTO DE TEMAS E ACESSIBILIDADE
  // ==========================================================================

  const themes = ['light', 'dark'];

  const sunIconSvg = `
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="5"></circle>
      <line x1="12" y1="1" x2="12" y2="3"></line>
      <line x1="12" y1="21" x2="12" y2="23"></line>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
      <line x1="1" y1="12" x2="3" y2="12"></line>
      <line x1="21" y1="12" x2="23" y2="12"></line>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
    </svg>
  `;

  const moonIconSvg = `
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
    </svg>
  `;

  function applyTheme(themeName) {
    if (!themes.includes(themeName)) {
      themeName = 'light';
    }

    document.documentElement.setAttribute('data-theme', themeName);
    localStorage.setItem('guia_utfpr_theme', themeName);

    // Atualiza classes ativas nos seletores desktop
    themeOptBtns.forEach(btn => {
      if (btn.getAttribute('data-theme-val') === themeName) {
        btn.classList.add('active');
        btn.setAttribute('aria-pressed', 'true');
      } else {
        btn.classList.remove('active');
        btn.setAttribute('aria-pressed', 'false');
      }
    });

    // Atualiza ícone e rótulo no botão mobile
    if (themeToggleMobile) {
      if (themeName === 'dark') {
        themeToggleMobile.innerHTML = sunIconSvg;
        themeToggleMobile.setAttribute('title', 'Mudar para Tema Claro');
        themeToggleMobile.setAttribute('aria-label', 'Mudar para Tema Claro');
      } else {
        themeToggleMobile.innerHTML = moonIconSvg;
        themeToggleMobile.setAttribute('title', 'Mudar para Tema Escuro');
        themeToggleMobile.setAttribute('aria-label', 'Mudar para Tema Escuro');
      }
    }
  }

  // Inicializa tema salvo ou detecta preferência do sistema
  const savedTheme = localStorage.getItem('guia_utfpr_theme');
  if (savedTheme && themes.includes(savedTheme)) {
    applyTheme(savedTheme);
  } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    applyTheme('dark');
  } else {
    applyTheme('light');
  }

  // Event Listeners nos botões de tema do cabeçalho desktop
  themeOptBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const selectedTheme = btn.getAttribute('data-theme-val');
      applyTheme(selectedTheme);
    });
  });

  // Event Listener no botão de alternar tema mobile
  if (themeToggleMobile) {
    themeToggleMobile.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
      const nextTheme = (currentTheme === 'light') ? 'dark' : 'light';
      applyTheme(nextTheme);
    });
  }

  // ==========================================================================
  // 3. CONSTRUÇÃO DA NAVEGAÇÃO LATERAL
  // ==========================================================================
  
  function buildSidebarNav() {
    navMenu.innerHTML = '';
    
    GUIA_DATA.forEach(category => {
      const categoryDiv = document.createElement('div');
      categoryDiv.className = 'menu-category';
      
      // Cabeçalho da Categoria
      const header = document.createElement('div');
      header.className = 'category-header';
      header.innerHTML = `
        <span class="category-badge">${category.badge}</span>
        <span>${category.title}</span>
      `;
      categoryDiv.appendChild(header);
      
      // Lista de Páginas
      const ul = document.createElement('ul');
      ul.className = 'pages-list';
      
      category.pages.forEach(page => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.className = `page-item-link page-link-${page.index}`;
        
        if (page.externalUrl) {
          a.href = page.externalUrl;
          a.target = '_blank';
          a.rel = 'noopener noreferrer';
          a.innerHTML = `<span>${page.title}</span> <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="margin-left: 6px; vertical-align: middle; opacity: 0.8;"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>`;
        } else {
          a.textContent = page.title;
          a.href = `#page-${page.index}`;
        }
        
        a.addEventListener('click', (e) => {
          // No mobile, fecha a barra lateral ao clicar
          closeMobileSidebar();
        });
        
        li.appendChild(a);
        ul.appendChild(li);
      });
      
      categoryDiv.appendChild(ul);
      navMenu.appendChild(categoryDiv);
    });
  }

  // ==========================================================================
  // 4. ROTEAMENTO BASEADO NO HASH (#page-X)
  // ==========================================================================
  
  function handleRoute() {
    const hash = window.location.hash;
    const pageMatch = hash.match(/^#page-(\d+)$/);
    
    if (pageMatch) {
      const pageIndexAttr = parseInt(pageMatch[1], 10);
      // Encontra a página com o index correspondente no array
      const targetIndex = allPages.findIndex(p => p.index === pageIndexAttr);
      if (targetIndex !== -1) {
        navigateToPage(targetIndex);
        return;
      }
    }
    
    // Rota padrão: página inicial (Capa)
    navigateToPage(0);
  }

  function navigateToPage(index) {
    activePageIndex = index;
    const page = allPages[index];
    if (!page) return;
    
    // Limpa busca ao mudar de página
    if (searchInput.value) {
      searchInput.value = '';
      clearSearch.style.display = 'none';
    }
    
    // Atualiza o hash se for diferente, usando o index real da página
    if (window.location.hash !== `#page-${page.index}`) {
      window.location.hash = `#page-${page.index}`;
    }
    
    renderActivePage();
    updateNavigationControls();
    highlightSidebarItem(index);
    updateProgress();
    
    // Rola a área de conteúdo de volta para o topo
    pageContainer.scrollTop = 0;
  }

  function highlightSidebarItem(index) {
    const page = allPages[index];
    if (!page) return;
    
    // Remove classe ativa de todos os links
    document.querySelectorAll('.page-item-link').forEach(link => {
      link.classList.remove('active');
    });
    
    // Adiciona classe ativa no link correspondente usando o index real do objeto de dados (page.index)
    const activeLink = document.querySelector(`.page-link-${page.index}`);
    if (activeLink) {
      activeLink.classList.add('active');
    }
  }

  // ==========================================================================
  // 5. RENDERIZAÇÃO DO CONTEÚDO DA PÁGINA
  // ==========================================================================
  
  function renderActivePage() {
    const page = allPages[activePageIndex];
    if (!page) return;
    
    pageContainer.innerHTML = '';
    
    const pageWrapper = document.createElement('div');
    pageWrapper.className = 'page-content-wrapper fade-in';
    
    // Caso especial: Capa (Página de Boas-vindas)
    if (activePageIndex === 0) {
      renderCapa(pageWrapper, page);
      pageContainer.appendChild(pageWrapper);
      
      // Atualiza Breadcrumbs e Progresso da Capa
      breadcrumbs.innerHTML = `<span>Início</span> &rsaquo; <span>Capa</span>`;
      breadcrumbs.title = 'Início › Capa';
      return;
    }
    
    // Atualiza Breadcrumbs
    breadcrumbs.innerHTML = `<span>${page.categoryTitle}</span> &rsaquo; <span>${page.title}</span>`;
    breadcrumbs.title = `${page.categoryTitle} › ${page.title}`;
    
    // Header da Página
    const header = document.createElement('header');
    header.innerHTML = `
      <div class="page-eyebrow">${page.eyebrow}</div>
      <h1 class="page-title">${page.title}</h1>
      <p class="page-subtitle">${page.subtitle}</p>
    `;
    pageWrapper.appendChild(header);
    
    // Grid de Elementos (Cards) e Grid de Downloads
    const elementsContainer = document.createElement('div');
    const downloadsContainer = document.createElement('div');
    
    // Verifica se a página atual deve renderizar checklists (Ex: Checklist Final ou Antes de Começar)
    const isChecklistPage = page.checklist === true || 
                            page.title.toLowerCase().includes('checklist') || 
                            page.title.toLowerCase().includes('começar');
    
    if (isChecklistPage) {
      elementsContainer.className = 'cards-grid checklist-grid';
    } else {
      elementsContainer.className = 'cards-grid';
    }
    
    downloadsContainer.className = 'cards-grid download-grid';
    
    page.elements.forEach((el, elIdx) => {
      if (el.type === 'card') {
        const card = document.createElement('div');
        
        if (isChecklistPage) {
          // Renderiza como item de checklist interativo
          card.className = 'checklist-card';
          const checklistKey = `page_${page.index}_item_${elIdx}`;
          const isChecked = !!checklistState[checklistKey];
          
          card.innerHTML = `
            <input type="checkbox" id="${checklistKey}" class="checklist-checkbox-input" ${isChecked ? 'checked' : ''}>
            <span class="checkmark">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </span>
            <span class="checklist-text">${el.content}</span>
          `;
          
          // Clique no card altera o estado do checkbox (evita interferir com links clicáveis)
          card.addEventListener('click', (e) => {
            // Se o clique foi em um link HTML dentro do card, deixa o comportamento padrão do link ocorrer
            if (e.target.closest('a')) {
              return;
            }
            const checkbox = card.querySelector('input[type="checkbox"]');
            // Se clicou na checkbox diretamente, o evento nativo já trata. Se clicou no card, invertemos.
            if (e.target !== checkbox) {
              checkbox.checked = !checkbox.checked;
            }
            toggleChecklistState(checklistKey, checkbox.checked);
          });
          
        } else {
          // Renderiza como card de conteúdo normal (mantém negritos se houver tags HTML)
          card.className = 'content-card';
          card.innerHTML = `<p>${el.content}</p>`;
        }
        
        elementsContainer.appendChild(card);
        
      } else if (el.type === 'highlight') {
        // Caixa de Destaque / Alerta
        const highlight = document.createElement('div');
        highlight.className = 'highlight-box';
        highlight.innerHTML = `
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="16" x2="12" y2="12"></line>
            <line x1="12" y1="8" x2="12.01" y2="8"></line>
          </svg>
          <p>${el.content}</p>
        `;
        pageWrapper.appendChild(highlight);
      } else if (el.type === 'video') {
        // Caixa de Vídeo Incorporado Dinâmico
        const videoWrap = document.createElement('div');
        videoWrap.className = 'video-wrapper';
        videoWrap.innerHTML = `
          <div class="video-container">
            <iframe width="560" height="315" src="${el.content}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
          </div>
          <div class="video-fallback">
            <a href="${el.content.replace('/embed/', '/watch?v=')}" target="_blank" rel="noopener noreferrer" class="fallback-video-btn">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" style="margin-right: 6px; vertical-align: middle;">
                <path d="M10 15l5.197-3L10 9v6z"/>
                <path fill-rule="evenodd" d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" clip-rule="evenodd"/>
              </svg>
              Assistir vídeo no YouTube
            </a>
          </div>
        `;
        pageWrapper.appendChild(videoWrap);
      } else if (el.type === 'download') {
        const downloadCard = document.createElement('div');
        downloadCard.className = `download-card ${el.fileType}-card`;
        
        let iconSvg = '';
        if (el.fileType === 'pdf') {
          iconSvg = `<svg class="download-icon pdf" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>`;
        } else {
          iconSvg = `<svg class="download-icon docx" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>`;
        }

        downloadCard.innerHTML = `
          <div class="download-card-body">
            <div class="download-card-icon-wrap">
              ${iconSvg}
            </div>
            <div class="download-card-info">
              <h3 class="download-card-title">${el.title}</h3>
              <p class="download-card-desc">${el.description}</p>
              <div class="download-card-meta">
                <span class="meta-tag type-${el.fileType}">${el.fileType.toUpperCase()}</span>
                <span class="meta-tag size">${el.fileSize}</span>
              </div>
            </div>
          </div>
          <div class="download-card-action">
            <a href="${el.url}" download class="download-btn" aria-label="Baixar ${el.title}">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
              <span>Baixar</span>
            </a>
          </div>
        `;
        downloadsContainer.appendChild(downloadCard);
      } else if (el.type === 'official_link') {
        const linkCard = document.createElement('div');
        linkCard.className = 'official-edital-card';
        linkCard.innerHTML = `
          <div class="official-edital-icon-wrap">
            <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" style="color: var(--primary);">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
          </div>
          <div class="official-edital-info">
            <span class="meta-tag type-pdf" style="margin-bottom: 8px; display: inline-block;">PUBLICAÇÃO SEI-UTFPR</span>
            <h2 class="official-edital-title">${el.title}</h2>
            <p class="official-edital-desc">${el.description}</p>
            <div class="official-edital-actions">
              <a href="${el.url}" target="_blank" rel="noopener noreferrer" class="btn-edital-link">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 8px;">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                  <polyline points="15 3 21 3 21 9"></polyline>
                  <line x1="10" y1="14" x2="21" y2="3"></line>
                </svg>
                <span>Acessar Publicação Oficial no SEI-UTFPR</span>
              </a>
              <a href="documentos/edital aux.pdf" download class="btn-edital-download">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 8px;">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="7 10 12 15 17 10"></polyline>
                  <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
                <span>Baixar Cópia em PDF</span>
              </a>
            </div>
          </div>
        `;
        pageWrapper.appendChild(linkCard);
      } else if (el.type === 'campi_contacts') {
        const campiWrapper = document.createElement('div');
        campiWrapper.className = 'campi-container-block';
        renderCampiContacts(campiWrapper);
        pageWrapper.appendChild(campiWrapper);
      } else if (el.type === 'wizard') {
        const wizardContainer = document.createElement('div');
        wizardContainer.className = 'wizard-wrapper';
        wizardContainer.id = el.id;
        renderWizard(wizardContainer);
        pageWrapper.appendChild(wizardContainer);
      }
    });
    
    // Insere elementsContainer se tiver elementos dentro
    if (elementsContainer.children.length > 0) {
      // Se houver algum box de destaque ou vídeo, colocamos o container de cards antes dele
      const firstMediaEl = pageWrapper.querySelector('.highlight-box, .video-wrapper, .official-edital-card');
      if (firstMediaEl) {
        pageWrapper.insertBefore(elementsContainer, firstMediaEl);
      } else {
        pageWrapper.appendChild(elementsContainer);
      }
    }

    // Insere downloadsContainer se tiver elementos dentro
    if (downloadsContainer.children.length > 0) {
      pageWrapper.appendChild(downloadsContainer);
    }
    
    pageContainer.appendChild(pageWrapper);
  }

  // Dados de contato e horários dos 13 Câmpus da UTFPR (ASSAE) em ordem alfabética
  const CAMPI_CONTACTS_DATA = [
    {
      name: 'Apucarana',
      assaeEmail: 'assae-ap@utfpr.edu.br',
      auxilioEmail: null,
      phone: '(43) 3162-1369 / (43) 3162-1200',
      hours: 'Segunda a sexta-feira: 08h às 12h e das 13h às 17h'
    },
    {
      name: 'Campo Mourão',
      assaeEmail: 'assae-cm@utfpr.edu.br',
      auxilioEmail: null,
      phone: '(44) 3518-1453 / (44) 3518-1465',
      hours: 'Seg, Ter e Sex: 08h às 12h e 13h às 17h | Qua e Qui: 13h às 17h e 18h às 22h'
    },
    {
      name: 'Cornélio Procópio',
      assaeEmail: 'assae-cp@utfpr.edu.br',
      auxilioEmail: null,
      phone: '(43) 3133-3000',
      hours: 'Segunda a sexta-feira: 08h às 20h'
    },
    {
      name: 'Curitiba',
      assaeEmail: 'assae-ct@utfpr.edu.br',
      auxilioEmail: null,
      phone: '(41) 3310-4545',
      hours: 'Segunda a sexta-feira: 08h30 às 12h e das 13h às 17h30'
    },
    {
      name: 'Dois Vizinhos',
      assaeEmail: 'assae-dv@utfpr.edu.br',
      auxilioEmail: 'auxilio_estudantil-dv@utfpr.edu.br',
      phone: '(46) 3536-8900',
      hours: 'Segunda a sexta-feira: 08h às 12h e das 13h às 17h'
    },
    {
      name: 'Francisco Beltrão',
      assaeEmail: 'assae-fb@utfpr.edu.br',
      auxilioEmail: 'auxilioestudantil-fb@utfpr.edu.br',
      phone: '(46) 3151-1213 (WhatsApp e Fone)',
      hours: 'Segunda a sexta-feira: 13h30 às 17h30'
    },
    {
      name: 'Guarapuava',
      assaeEmail: 'assae-gp@utfpr.edu.br',
      auxilioEmail: null,
      phone: '(42) 3141-6850',
      hours: 'Seg, Qua e Sex: 08h às 12h e 13h às 20h | Ter e Qui: 08h às 12h e 13h às 17h'
    },
    {
      name: 'Londrina',
      assaeEmail: 'assae-ld@utfpr.edu.br',
      auxilioEmail: null,
      phone: '(43) 3315-6100',
      hours: 'Seg e Sex: 08h às 12h e 14h às 18h | Ter, Qua e Qui: 08h às 12h e 14h às 20h'
    },
    {
      name: 'Medianeira',
      assaeEmail: 'assae-md@utfpr.edu.br',
      auxilioEmail: null,
      phone: '(45) 3240-8000',
      hours: 'Segunda a sexta-feira: 08h às 12h e das 13h às 17h'
    },
    {
      name: 'Pato Branco',
      assaeEmail: 'assae-pb@utfpr.edu.br',
      auxilioEmail: null,
      phone: '(46) 3220-2500',
      hours: 'Segunda a sexta-feira: 08h às 12h e das 13h30 às 17h30'
    },
    {
      name: 'Ponta Grossa',
      assaeEmail: 'assae-pg@utfpr.edu.br',
      auxilioEmail: null,
      phone: '(42) 3220-4800',
      hours: 'Seg, Qua e Sex: 09h às 18h | Ter e Qui: 10h às 19h'
    },
    {
      name: 'Santa Helena',
      assaeEmail: 'assae-sh@utfpr.edu.br',
      auxilioEmail: 'auxilioestudantil-sh@utfpr.edu.br',
      phone: '(45) 3268-8800',
      hours: 'Seg a Qui: 13h às 21h30 | Sex: 08h às 12h e das 13h às 17h'
    },
    {
      name: 'Toledo',
      assaeEmail: 'assae-td@utfpr.edu.br',
      auxilioEmail: null,
      phone: '(45) 3379-6800',
      hours: 'Seg, Qua e Qui: 07h30 às 11h30 e 13h às 20h | Ter e Sex: 07h30 às 11h30 e 13h às 17h'
    }
  ];

  // Renderiza o seletor interativo dos 13 campi
  function renderCampiContacts(container) {
    const wrap = document.createElement('div');
    wrap.className = 'campi-contacts-wrapper';
    
    wrap.innerHTML = `
      <div class="campi-selector-header">
        <h3 class="campi-selector-title">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--primary); flex-shrink: 0;">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
          </svg>
          <span>Selecione o seu Câmpus da UTFPR:</span>
        </h3>
        <p class="campi-selector-subtitle">Clique no botão correspondente para visualizar os e-mails, telefones e horários de atendimento da ASSAE:</p>
      </div>
      <div class="campi-btn-grid" id="campiBtnGrid"></div>
      <div class="campus-info-card" id="campusInfoCard"></div>
    `;

    const btnGrid = wrap.querySelector('#campiBtnGrid');
    const infoCard = wrap.querySelector('#campusInfoCard');

    function updateCampusCard(campus) {
      infoCard.innerHTML = `
        <div class="campus-info-header">
          <div class="campus-info-title">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.2" style="color: var(--primary); flex-shrink: 0;">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            <span>UTFPR Câmpus ${campus.name}</span>
          </div>
          <span class="campus-tag-badge">ASSAE</span>
        </div>
        <div class="campus-details-list">
          <div class="campus-detail-row">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
            <div><strong>Horário de Atendimento:</strong> <span>${campus.hours}</span></div>
          </div>
          <div class="campus-detail-row">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
            <div><strong>E-mail ASSAE (Atendimento Câmpus):</strong> <a href="mailto:${campus.assaeEmail}">${campus.assaeEmail}</a></div>
          </div>
          ${campus.auxilioEmail ? `
            <div class="campus-detail-row">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
              <div><strong>E-mail Específico de Auxílio Estudantil:</strong> <a href="mailto:${campus.auxilioEmail}">${campus.auxilioEmail}</a></div>
            </div>
          ` : ''}
          ${campus.phone ? `
            <div class="campus-detail-row">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
              <div><strong>Telefone / Atendimento:</strong> <span>${campus.phone}</span></div>
            </div>
          ` : ''}
        </div>
      `;
    }

    CAMPI_CONTACTS_DATA.forEach((campus, idx) => {
      const btn = document.createElement('button');
      btn.className = `campus-btn ${idx === 0 ? 'active' : ''}`;
      btn.innerText = campus.name;
      btn.setAttribute('type', 'button');
      btn.addEventListener('click', () => {
        btnGrid.querySelectorAll('.campus-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        updateCampusCard(campus);
      });
      btnGrid.appendChild(btn);
    });

    // Exibe o primeiro campus por padrão (Apucarana)
    updateCampusCard(CAMPI_CONTACTS_DATA[0]);

    container.appendChild(wrap);
  }

  // Renderiza o visual de Capa personalizado
  function renderCapa(container, page) {
    const capaDiv = document.createElement('div');
    capaDiv.className = 'capa-container';
    
    capaDiv.innerHTML = `
      <span class="capa-eyebrow">${page.eyebrow}</span>
      <h1 class="capa-title">${page.title}</h1>
      <p class="capa-subtitle">${page.subtitle}</p>
      
      <div class="capa-description-box">
        <p>Este informativo interativo foi criado para simplificar o seu processo de inscrição no <strong>Programa de Auxílio Estudantil da UTFPR (Edital 01/2026 PROAE)</strong>. Aqui você encontrará instruções diretas, modelos de documentos e listas de verificação para garantir que sua solicitação seja enviada sem erros.</p>
      </div>
      
      <div class="capa-features-grid">
        <a href="#page-2" class="capa-feature-card">
          <div class="feature-card-icon">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="9 11 12 14 22 4"></polyline>
              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
            </svg>
          </div>
          <h3>Organização Linear</h3>
          <p>Navegue sequencialmente usando as setas no rodapé para acompanhar o passo a passo completo desde a preparação até o envio final.</p>
        </a>
        
        <a href="#page-12" class="capa-feature-card">
          <div class="feature-card-icon">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
            </svg>
          </div>
          <h3>Documentação Segura</h3>
          <p>Confira as seções específicas sobre o preenchimento de declarações e obtenção sem erros do extrato do CNIS e IRPF.</p>
        </a>
        
        <a href="#page-26" class="capa-feature-card">
          <div class="feature-card-icon">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
          </div>
          <h3>Central de Downloads</h3>
          <p>Acesse a seção dedicada para baixar os 8 modelos de declarações oficiais em formato Word e os tutoriais detalhados em formato PDF.</p>
        </a>
        
        <a href="#page-11" class="capa-feature-card">
          <div class="feature-card-icon">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="16" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
          </div>
          <h3>Alertas do Edital</h3>
          <p>Fique atento aos blocos informativos em destaque contendo regras críticas de desempenho acadêmico e regras para veteranos.</p>
        </a>
      </div>
      
      <div class="capa-cta-area">
        <button id="startReadingBtn" class="start-reading-btn">
          <span>Iniciar Guia Passo a Passo</span>
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </button>
      </div>
    `;
    
    container.appendChild(capaDiv);
    
    // Ação do Botão Começar
    const startBtn = capaDiv.querySelector('#startReadingBtn');
    startBtn.addEventListener('click', () => {
      // Vai para a página "Antes de começar" (Índice 1 no array final achatado, que é o index 2 original)
      navigateToPage(1);
    });

    // Ação de clique nos cards da capa para garantir navegação imediata e consistente
    const featureCards = capaDiv.querySelectorAll('.capa-feature-card');
    featureCards.forEach(card => {
      card.addEventListener('click', (e) => {
        e.preventDefault();
        const href = card.getAttribute('href');
        const pageMatch = href.match(/^#page-(\d+)$/);
        if (pageMatch) {
          const pageIndexAttr = parseInt(pageMatch[1], 10);
          const targetIndex = allPages.findIndex(p => p.index === pageIndexAttr);
          if (targetIndex !== -1) {
            navigateToPage(targetIndex);
          }
        }
      });
    });
  }

  // Gerencia o estado de conclusão dos itens de checklist
  function toggleChecklistState(key, isChecked) {
    if (isChecked) {
      checklistState[key] = true;
    } else {
      delete checklistState[key];
    }
    localStorage.setItem('guia_utfpr_checklist_state', JSON.stringify(checklistState));
    updateProgress();
  }

  // Lógica e renderização do Simulador de Elegibilidade Interativo (Wizard)
  function renderWizard(container) {
    container.innerHTML = '';
    
    const wizardCard = document.createElement('div');
    wizardCard.className = 'wizard-container-card';
    
    wizardCard.innerHTML = `
      <div class="wizard-header">
        <h2>Simulador de Elegibilidade & Roteiro de Documentos</h2>
        <p>Responda às perguntas sequencialmente para verificar se você atende às normas do Edital 01/2026 e veja a relação exata de declarações que você precisará providenciar.</p>
      </div>
      
      <!-- Passo 1: Edital em Mãos -->
      <div class="wizard-step active" id="step-edital">
        <p class="wizard-question">1. Você já leu o Edital 01/2026 PROAE ou o tem em mãos?</p>
        <div class="wizard-options">
          <button class="wizard-opt-btn" data-value="sim">Sim, já li / estou com ele</button>
          <button class="wizard-opt-btn" data-value="nao">Não li ainda</button>
        </div>
        <div class="wizard-feedback" style="display: none; margin-top: 12px;"></div>
      </div>

      <!-- Passo 2: Vínculo (Enrollment Type) -->
      <div class="wizard-step hidden" id="step-vinculo" style="margin-top: 24px;">
        <p class="wizard-question">2. Qual o seu vínculo de matrícula com a UTFPR?</p>
        <div class="wizard-options">
          <button class="wizard-opt-btn" data-value="calouro">Estudante Calouro (Ingressante em 2026)</button>
          <button class="wizard-opt-btn" data-value="veterano">Estudante Veterano</button>
        </div>
        <div class="wizard-feedback" style="display: none; margin-top: 12px;"></div>
      </div>

      <!-- Passo 2.1: Reaproveitamento (Previous Edital Status) -->
      <div class="wizard-step hidden" id="step-reaproveitamento" style="margin-top: 24px;">
        <p class="wizard-question">2.1. Você participou do Edital de Auxílio de 2025, obteve status DEFERIDO e sua situação familiar/renda continua 100% IDÊNTICA?</p>
        <div class="wizard-options">
          <button class="wizard-opt-btn" data-value="sim">Sim (Elegível para Reaproveitamento)</button>
          <button class="wizard-opt-btn" data-value="nao">Não / Tive alterações na renda ou família</button>
        </div>
        <div class="wizard-feedback" style="display: none; margin-top: 12px;"></div>
      </div>

      <!-- Passo 3: Desempenho Acadêmico (Academic Performance) -->
      <div class="wizard-step hidden" id="step-desempenho" style="margin-top: 24px;">
        <p class="wizard-question">3. O seu índice de reprovações ou cancelamentos de disciplinas ultrapassou 33% das disciplinas cursadas?</p>
        <p class="wizard-note">Nota: O estudante não precisa calcular o índice de atenuação. Essa análise é realizada internamente pela UTFPR.</p>
        <div class="wizard-options">
          <button class="wizard-opt-btn" data-value="sim">Sim, ultrapassou 33%</button>
          <button class="wizard-opt-btn" data-value="nao">Não, estou dentro do limite</button>
        </div>
        <div class="wizard-feedback" style="display: none; margin-top: 12px;"></div>
      </div>

      <!-- Passo 4: Independência Financeira -->
      <div class="wizard-step hidden" id="step-independencia" style="margin-top: 24px;">
        <p class="wizard-question">4. Você é financeiramente independente dos seus pais/núcleo familiar de origem?</p>
        <div class="wizard-options">
          <button class="wizard-opt-btn" data-value="sim">Sim, sou independente e me sustento por conta própria</button>
          <button class="wizard-opt-btn" data-value="nao">Não, dependo deles ou resido junto</button>
        </div>
        <div class="wizard-feedback" style="display: none; margin-top: 12px;"></div>
      </div>

      <!-- Passo 5: Moradia -->
      <div class="wizard-step hidden" id="step-moradia" style="margin-top: 24px;">
        <p class="wizard-question">5. Qual é a sua situação de moradia na cidade onde estuda?</p>
        <div class="wizard-options-vertical">
          <button class="wizard-opt-btn text-left" data-value="familia_propria">Moro com meus pais/grupo familiar de origem em imóvel próprio/quitado</button>
          <button class="wizard-opt-btn text-left" data-value="familia_alugada">Moro com meus pais/grupo familiar de origem em imóvel alugado ou financiado</button>
          <button class="wizard-opt-btn text-left" data-value="estudante_aluguel_contrato">Resido sozinho(a) ou divido aluguel com contrato de locação formal em meu nome</button>
          <button class="wizard-opt-btn text-left" data-value="estudante_aluguel_sem_contrato">Resido sozinho(a) ou divido aluguel, mas NÃO tenho contrato de locação formal (de boca)</button>
          <button class="wizard-opt-btn text-left" data-value="estudante_pensionato">Moro em pensionato ou vaga compartilhada paga (sem contrato)</button>
          <button class="wizard-opt-btn text-left" data-value="estudante_compartilhada">Moro em moradia compartilhada/república dividindo aluguel</button>
          <button class="wizard-opt-btn text-left" data-value="estudante_cedido">Moro em imóvel cedido gratuitamente (por parentes/amigos)</button>
          <button class="wizard-opt-btn text-left" data-value="estudante_alojamento">Moro em alojamento estudantil gratuito ou moradia universitária da UTFPR</button>
          <button class="wizard-opt-btn text-left" data-value="estudante_casado_aluguel">Resido com meu cônjuge, companheiro(a) e/ou filhos(as) e PAGO aluguel</button>
          <button class="wizard-opt-btn text-left" data-value="estudante_casado_proprio">Resido com meu cônjuge, companheiro(a) e/ou filhos(as) e NÃO pago aluguel (imóvel próprio/cedido)</button>
        </div>
        <div class="wizard-feedback" style="display: none; margin-top: 12px;"></div>
      </div>

      <!-- Passo 6: Fontes de Renda -->
      <div class="wizard-step hidden" id="step-fontes-renda" style="margin-top: 24px;">
        <p class="wizard-question">6. Quais são as fontes de renda existentes no seu grupo familiar? (Selecione todas que se aplicam)</p>
        <div class="wizard-options-vertical checkbox-group" style="gap: 10px;">
          <label class="wizard-checkbox-label">
            <input type="checkbox" name="fonte-renda" value="clt">
            <span>Trabalho formal com carteira assinada (CLT) ou Servidor Público</span>
          </label>
          <label class="wizard-checkbox-label">
            <input type="checkbox" name="fonte-renda" value="autonomo">
            <span>Trabalho autônomo, profissional liberal ou informal (bicos)</span>
          </label>
          <label class="wizard-checkbox-label">
            <input type="checkbox" name="fonte-renda" value="estagio">
            <span>Estágio remunerado ou bolsista de projeto</span>
          </label>
          <label class="wizard-checkbox-label">
            <input type="checkbox" name="fonte-renda" value="mei">
            <span>Microempreendedor Individual (MEI)</span>
          </label>
          <label class="wizard-checkbox-label">
            <input type="checkbox" name="fonte-renda" value="desempregado">
            <span>Membro maior de idade desempregado, do lar ou estudante sem renda</span>
          </label>
          <label class="wizard-checkbox-label">
            <input type="checkbox" name="fonte-renda" value="rural">
            <span>Produtor rural ou trabalhador da atividade rural</span>
          </label>
          <label class="wizard-checkbox-label">
            <input type="checkbox" name="fonte-renda" value="aposentado">
            <span>Aposentado, pensionista do INSS ou beneficiário do BPC</span>
          </label>
          <label class="wizard-checkbox-label">
            <input type="checkbox" name="fonte-renda" value="pensao_verbal">
            <span>Recebe pensão alimentícia informal (acordo verbal, sem decisão do juiz)</span>
          </label>
          <label class="wizard-checkbox-label">
            <input type="checkbox" name="fonte-renda" value="pensao_judicial">
            <span>Recebe pensão alimentícia formal (via decisão judicial ou escritura de divórcio)</span>
          </label>
          <label class="wizard-checkbox-label">
            <input type="checkbox" name="fonte-renda" value="comissao">
            <span>Vendedor comissionista (renda de comissão por vendas de produtos)</span>
          </label>
          <label class="wizard-checkbox-label">
            <input type="checkbox" name="fonte-renda" value="ajuda_terceiros">
            <span>Recebe ajuda financeira mensal de parentes ou amigos de fora do domicílio</span>
          </label>
          <label class="wizard-checkbox-label">
            <input type="checkbox" name="fonte-renda" value="programa_social">
            <span>Recebe benefício de programa social (ex: Bolsa Família, Benefício Estadual)</span>
          </label>
        </div>
        <div class="wizard-feedback" style="display: none; margin-top: 12px;"></div>
        <button id="wizard-btn-renda-next" class="wizard-btn-calc" style="margin-top: 16px; width: 100%;">Avançar</button>
      </div>

      <!-- Passo 7: Renda Per Capita -->
      <div class="wizard-step hidden" id="step-renda" style="margin-top: 24px;">
        <p class="wizard-question">7. Simulador de Renda Familiar Per Capita</p>
        <p class="wizard-note">Informe a quantidade total de pessoas do seu grupo familiar (incluindo você) e o somatório das rendas brutas mensais.</p>
        <div class="wizard-calc-grid">
          <div class="wizard-input-group">
            <label for="wizard-membros" style="font-size: 0.85rem; font-weight: 600;">Membros da família:</label>
            <input type="number" id="wizard-membros" class="wizard-input" value="1" min="1" max="20">
          </div>
          <div class="wizard-input-group">
            <label for="wizard-renda-bruta" style="font-size: 0.85rem; font-weight: 600;">Renda bruta total familiar (R$):</label>
            <input type="number" id="wizard-renda-bruta" class="wizard-input" value="0" min="0" step="100">
          </div>
        </div>
        <div class="wizard-feedback" style="display: none; margin-top: 16px;"></div>
        <button id="wizard-btn-calcular" class="wizard-btn-calc" style="margin-top: 16px; width: 100%;">Calcular Renda Per Capita</button>
      </div>

      <!-- Passo 8: Imposto de Renda -->
      <div class="wizard-step hidden" id="step-irpf" style="margin-top: 24px;">
        <p class="wizard-question">8. Qual a situação do Imposto de Renda (IRPF) dos membros maiores de 18 anos?</p>
        <div class="wizard-options-vertical">
          <button class="wizard-opt-btn text-left" data-value="todos_declararam">Todos os membros maiores de 18 anos declararam IRPF</button>
          <button class="wizard-opt-btn text-left" data-value="isentos_mir">Existem membros isentos e todos conseguem emitir o comprovante pelo Portal MIR (gov.br Prata/Ouro)</button>
          <button class="wizard-opt-btn text-left" data-value="isentos_sem_mir">Existem membros isentos, mas algum NÃO consegue emitir no Portal MIR (conta Bronze ou sem acesso)</button>
        </div>
        <div class="wizard-feedback" style="display: none; margin-top: 12px;"></div>
      </div>

      <!-- Passo 9: Situações Especiais -->
      <div class="wizard-step hidden" id="step-especiais" style="margin-top: 24px;">
        <p class="wizard-question">9. Algum membro do seu grupo familiar se enquadra em alguma dessas situações adicionais? (Selecione se aplicável)</p>
        <div class="wizard-options-vertical checkbox-group" style="gap: 10px;">
          <label class="wizard-checkbox-label">
            <input type="checkbox" name="situacao-especial" value="separacao_verbal">
            <span>Pais separados/divorciados com pensão de acordo informal (sem decisão judicial ou escritura)</span>
          </label>
          <label class="wizard-checkbox-label">
            <input type="checkbox" name="situacao-especial" value="doenca_grave">
            <span>Membro familiar com doença grave ou despesas com tratamento médico de uso contínuo de alto valor</span>
          </label>
          <label class="wizard-checkbox-label">
            <input type="checkbox" name="situacao-especial" value="filhos_guarda">
            <span>Estudante com filhos menores sob sua guarda legal direta (pleito ao Auxílio Infância)</span>
          </label>
          <label class="wizard-checkbox-label">
            <input type="checkbox" name="situacao-especial" value="aluguel_terceiros">
            <span>Ajuda de terceiros: uma pessoa de fora da família paga o aluguel do estudante diretamente ao proprietário</span>
          </label>
          <label class="wizard-checkbox-label">
            <input type="checkbox" name="situacao-especial" value="outros_casos">
            <span>Outras situações atípicas (ex: abandono, perda de moradia, justificação excepcional)</span>
          </label>
        </div>
        <div class="wizard-feedback" style="display: none; margin-top: 12px;"></div>
        <button id="wizard-btn-especiais-next" class="wizard-btn-calc" style="margin-top: 16px; width: 100%;">Avançar</button>
      </div>

      <!-- Passo 10: Confirmação de Pré-requisitos Obrigatórios (NEW) -->
      <div class="wizard-step hidden" id="step-prerequisitos" style="margin-top: 24px;">
        <p class="wizard-question">10. Confirmação de Pré-requisitos Obrigatórios</p>
        <p class="wizard-note">Por favor, declare ciência e confirme os pré-requisitos fundamentais para a sua inscrição:</p>
        <div class="wizard-options-vertical checkbox-group" style="gap: 10px;">
          <label class="wizard-checkbox-label">
            <input type="checkbox" id="prereq-dados">
            <span>Confirmo que meus dados (renda, endereço, composição familiar, estágio/bolsa) estão 100% atualizados no Portal do Aluno.</span>
          </label>
          <label class="wizard-checkbox-label">
            <input type="checkbox" id="prereq-conta">
            <span>Declaro que possuo conta bancária ativa estritamente em MEU NOME (não é permitido conta de terceiros).</span>
          </label>
          <label class="wizard-checkbox-label">
            <input type="checkbox" id="prereq-email">
            <span>Estou ciente de que devo verificar regularmente meu e-mail institucional e a caixa de SPAM para comunicações oficiais.</span>
          </label>
        </div>
        <div class="wizard-feedback" style="display: none; margin-top: 12px;"></div>
        <button id="wizard-btn-prereq-next" class="wizard-btn-calc" style="margin-top: 16px; width: 100%;" disabled>Avançar</button>
      </div>

      <!-- Passo 11: Termos de Uso Consciente & RU Rules (NEW) -->
      <div class="wizard-step hidden" id="step-termos" style="margin-top: 24px;">
        <p class="wizard-question">11. Termos de Uso Consciente e Regras do Restaurante Universitário (RU)</p>
        <p class="wizard-note">Declare sua ciência quanto ao uso dos auxílios financeiros e do benefício do RU:</p>
        <div class="wizard-options-vertical checkbox-group" style="gap: 10px;">
          <label class="wizard-checkbox-label">
            <input type="checkbox" id="termo-uso">
            <span>Compreendo que os auxílios (R$ 350 Básico/Infância, R$ 450 Moradia) devem ser priorizados para alimentação, moradia, transporte, internet ou materiais acadêmicos.</span>
          </label>
          <label class="wizard-checkbox-label">
            <input type="checkbox" id="termo-ru">
            <span>Estou ciente de que o acesso ao Restaurante Universitário (RU) é um benefício ESTRITAMENTE PESSOAL, intransferível e válido apenas para almoço e jantar.</span>
          </label>
        </div>
        <div class="wizard-feedback" style="display: none; margin-top: 12px;"></div>
        <button id="wizard-btn-termos-next" class="wizard-btn-calc" style="margin-top: 16px; width: 100%;" disabled>Gerar Roteiro Personalizado</button>
      </div>

      <!-- Passo 12: Resultado / Checklist Personalizado -->
      <div class="wizard-step hidden" id="step-resultado" style="margin-top: 24px;">
        <div class="wizard-result-box">
          <h3 style="color: var(--text-title); margin-bottom: 12px; font-weight: 700; border-bottom: 2px solid var(--primary); padding-bottom: 8px;">Caminho de Inscrição Recomendado</h3>
          <div id="wizard-result-eligibility" style="margin-bottom: 16px;"></div>
          <h4 style="font-size: 0.95rem; font-weight: 700; margin-bottom: 8px;">Lista de Documentos e Declarações Obrigatórias:</h4>
          <ul class="wizard-doc-list" id="wizard-result-docs">
            <!-- Gerado via JS -->
          </ul>
          
          <div style="margin-top: 24px; padding: 14px; background-color: var(--bg-card-hover); border-radius: var(--radius-md); border: 1px solid var(--border); font-size: 0.88rem; line-height: 1.5; color: var(--text-main); font-weight: 500;">
            <p>💡 <strong>Apoio ao Estudante:</strong> Dificuldades ao longo do semestre? Não espere a situação piorar! O NUAPE oferece apoio pedagógico, social e psicológico. Procure ajuda no seu campus.</p>
          </div>

          <div style="margin-top: 24px; display: flex; justify-content: center;">
            <button id="wizard-btn-reiniciar" class="wizard-btn-reiniciar">Reiniciar Simulação</button>
          </div>
        </div>
      </div>
    `;
    
    container.appendChild(wizardCard);
    
    const SALARIO_MINIMO = 1518; // Mínimo 2026

    let wizardState = {
      edital: null,
      vinculo: null,
      reaproveitamento: null,
      desempenhoOk: null,
      independencia: null,
      moradia: null,
      fontesRenda: [],
      membros: 1,
      renda: 0,
      perCapita: 0,
      rendaElegivel: null,
      irpf: null,
      situacoesEspeciais: [],
      prereqOk: false,
      termosOk: false,
      isCompleted: false
    };

    const stepOrder = [
      'step-edital',
      'step-vinculo',
      'step-reaproveitamento',
      'step-desempenho',
      'step-independencia',
      'step-moradia',
      'step-fontes-renda',
      'step-renda',
      'step-irpf',
      'step-especiais',
      'step-prerequisitos',
      'step-termos',
      'step-resultado'
    ];

    function saveWizardState() {
      try {
        localStorage.setItem('guia_utfpr_wizard_state', JSON.stringify(wizardState));
      } catch (e) {
        console.error('Erro ao salvar estado do wizard:', e);
      }
    }

    function showFeedback(stepEl, type, html) {
      const feedbackEl = stepEl.querySelector('.wizard-feedback');
      feedbackEl.style.display = 'block';
      feedbackEl.className = `wizard-feedback ${type}`;
      feedbackEl.innerHTML = html;
    }

    function revealStep(id) {
      const stepEl = wizardCard.querySelector(`#${id}`);
      if (stepEl) {
        stepEl.classList.remove('hidden');
        stepEl.classList.add('active');
        
        setTimeout(() => {
          stepEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 100);
      }
    }

    function hideDownstream(currentStepId) {
      const idx = stepOrder.indexOf(currentStepId);
      if (idx === -1) return;
      
      for (let i = idx + 1; i < stepOrder.length; i++) {
        const stepEl = wizardCard.querySelector(`#${stepOrder[i]}`);
        if (stepEl) {
          stepEl.classList.add('hidden');
          stepEl.classList.remove('active');
          
          // Limpa seleções dentro do passo ocultado
          stepEl.querySelectorAll('.wizard-opt-btn').forEach(btn => btn.classList.remove('selected'));
          const feedback = stepEl.querySelector('.wizard-feedback');
          if (feedback) {
            feedback.style.display = 'none';
            feedback.innerHTML = '';
          }
          // Reseta checkboxes
          stepEl.querySelectorAll('input[type="checkbox"]').forEach(cb => {
            cb.checked = false;
          });
          // Re-desabilita botões se aplicável
          const nextBtn = stepEl.querySelector('.wizard-btn-calc');
          if (nextBtn && (stepOrder[i] === 'step-prerequisitos' || stepOrder[i] === 'step-termos')) {
            nextBtn.disabled = true;
          }
          // Oculta botões de navegação dinâmica criados no DOM
          if (stepOrder[i] === 'step-independencia') {
            const indBtn = stepEl.querySelector('#btn-independencia-next');
            if (indBtn) indBtn.style.display = 'none';
          }
          if (stepOrder[i] === 'step-moradia') {
            const morBtn = stepEl.querySelector('#btn-moradia-next');
            if (morBtn) morBtn.style.display = 'none';
          }
          if (stepOrder[i] === 'step-renda') {
            const rendaBtn = stepEl.querySelector('#btn-renda-next-step');
            if (rendaBtn) rendaBtn.style.display = 'none';
          }
          if (stepOrder[i] === 'step-irpf') {
            const irpfBtn = stepEl.querySelector('#btn-irpf-next-step');
            if (irpfBtn) irpfBtn.style.display = 'none';
          }
        }
      }

      // Limpa propriedades a jusante do estado
      if (idx <= stepOrder.indexOf('step-edital')) wizardState.vinculo = null;
      if (idx <= stepOrder.indexOf('step-vinculo')) wizardState.reaproveitamento = null;
      if (idx <= stepOrder.indexOf('step-reaproveitamento')) wizardState.desempenhoOk = null;
      if (idx <= stepOrder.indexOf('step-desempenho')) wizardState.independencia = null;
      if (idx <= stepOrder.indexOf('step-independencia')) wizardState.moradia = null;
      if (idx <= stepOrder.indexOf('step-moradia')) wizardState.fontesRenda = [];
      if (idx <= stepOrder.indexOf('step-fontes-renda')) { wizardState.rendaElegivel = null; wizardState.perCapita = 0; }
      if (idx <= stepOrder.indexOf('step-renda')) wizardState.irpf = null;
      if (idx <= stepOrder.indexOf('step-irpf')) wizardState.situacoesEspeciais = [];
      if (idx <= stepOrder.indexOf('step-especiais')) wizardState.prereqOk = false;
      if (idx <= stepOrder.indexOf('step-prerequisitos')) { wizardState.termosOk = false; wizardState.isCompleted = false; }

      saveWizardState();
    }

    // Passo 1: Edital
    const stepEdital = wizardCard.querySelector('#step-edital');
    const btnsEdital = stepEdital.querySelectorAll('.wizard-opt-btn');
    btnsEdital.forEach(btn => {
      btn.addEventListener('click', () => {
        btnsEdital.forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        
        const val = btn.getAttribute('data-value');
        wizardState.edital = val;
        saveWizardState();
        
        hideDownstream('step-edital');
        
        if (val === 'nao') {
          showFeedback(stepEdital, 'warning', `
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 8px; vertical-align: middle;"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
            <strong>Atenção:</strong> É altamente recomendável ler o edital oficial. Você pode consultar a <a href="https://sei.utfpr.edu.br/sei/publicacoes/controlador_publicacoes.php?acao=publicacao_visualizar&id_documento=6394999&id_orgao_publicacao=0" target="_blank" rel="noopener noreferrer">Publicação Oficial do Edital no SEI-UTFPR</a>.
          `);
        } else {
          showFeedback(stepEdital, 'success', `
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 8px; vertical-align: middle;"><polyline points="20 6 9 17 4 12"></polyline></svg>
            Excelente! Estar ciente das regras do edital evita erros de preenchimento.
          `);
        }
        
        revealStep('step-vinculo');
      });
    });

    // Passo 2: Vínculo
    const stepVinculo = wizardCard.querySelector('#step-vinculo');
    const btnsVinculo = stepVinculo.querySelectorAll('.wizard-opt-btn');
    btnsVinculo.forEach(btn => {
      btn.addEventListener('click', () => {
        btnsVinculo.forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        
        const val = btn.getAttribute('data-value');
        wizardState.vinculo = val;
        
        hideDownstream('step-vinculo');
        
        if (val === 'calouro') {
          wizardState.reaproveitamento = 'nao';
          wizardState.desempenhoOk = true;
          saveWizardState();
          showFeedback(stepVinculo, 'success', `
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 8px; vertical-align: middle;"><polyline points="20 6 9 17 4 12"></polyline></svg>
            Estudantes calouros são avaliados puramente pelos critérios socioeconômicos da nova inscrição.
          `);
          revealStep('step-independencia');
        } else {
          saveWizardState();
          showFeedback(stepVinculo, 'success', `
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 8px; vertical-align: middle;"><polyline points="20 6 9 17 4 12"></polyline></svg>
            Estudante veterano. Prossiga para verificar a opção de reaproveitamento.
          `);
          revealStep('step-reaproveitamento');
        }
      });
    });

    // Passo 2.1: Reaproveitamento
    const stepReaproveitamento = wizardCard.querySelector('#step-reaproveitamento');
    const btnsReaproveitamento = stepReaproveitamento.querySelectorAll('.wizard-opt-btn');
    btnsReaproveitamento.forEach(btn => {
      btn.addEventListener('click', () => {
        btnsReaproveitamento.forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        
        const val = btn.getAttribute('data-value');
        wizardState.reaproveitamento = val;
        saveWizardState();
        
        hideDownstream('step-reaproveitamento');
        
        if (val === 'sim') {
          showFeedback(stepReaproveitamento, 'success', `
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 8px; vertical-align: middle;"><polyline points="20 6 9 17 4 12"></polyline></svg>
            <strong>Elegível para Reaproveitamento de Documentos (Item 5.1):</strong> Ótimo! Como veterano com situação idêntica à de 2025, seu processo de envio de documentos é simplificado. Prossiga para avaliar o desempenho acadêmico.
          `);
        } else {
          showFeedback(stepReaproveitamento, 'warning', `
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 8px; vertical-align: middle;"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
            Entendido. Como houve alteração ou não participou do último edital, você fará uma inscrição completa. Prossiga para avaliar o desempenho acadêmico.
          `);
        }
        
        revealStep('step-desempenho');
      });
    });

    // Passo 3: Desempenho
    const stepDesempenho = wizardCard.querySelector('#step-desempenho');
    const btnsDesempenho = stepDesempenho.querySelectorAll('.wizard-opt-btn');
    
    btnsDesempenho.forEach(btn => {
      btn.addEventListener('click', () => {
        btnsDesempenho.forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        
        const val = btn.getAttribute('data-value');
        
        hideDownstream('step-desempenho');
        
        if (val === 'sim') {
          wizardState.desempenhoOk = false;
          saveWizardState();
          showFeedback(stepDesempenho, 'danger', `
            <div class="wizard-alert">
              <strong>Atenção:</strong> Você precisará abrir um <strong>PROCESSO DE RECURSO</strong>.
              Prepare a seguinte documentação justificativa: Relatórios de monitoria ou P.Aluno; Laudos, declarações e certificados; Comprovação documental para justificar faltas.
            </div>
          `);
        } else {
          wizardState.desempenhoOk = true;
          saveWizardState();
          showFeedback(stepDesempenho, 'success', `
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 8px; vertical-align: middle;"><polyline points="20 6 9 17 4 12"></polyline></svg>
            Desempenho acadêmico qualificado (reprovações menores ou iguais a 33%).
          `);
        }
        
        setTimeout(() => {
          if (wizardState.reaproveitamento === 'sim') {
            revealStep('step-prerequisitos');
          } else {
            revealStep('step-independencia');
          }
        }, 800);
      });
    });

    // Passo 4: Independência Financeira
    const stepIndependencia = wizardCard.querySelector('#step-independencia');
    const btnsIndependencia = stepIndependencia.querySelectorAll('.wizard-opt-btn');
    btnsIndependencia.forEach(btn => {
      btn.addEventListener('click', () => {
        btnsIndependencia.forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        
        const val = btn.getAttribute('data-value');
        wizardState.independencia = val;
        saveWizardState();
        
        hideDownstream('step-independencia');
        
        if (val === 'sim') {
          showFeedback(stepIndependencia, 'warning', `
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 8px; vertical-align: middle;"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
            <strong>Atenção:</strong> Declarar independência financeira exige comprovação de residência e renda próprias que cubram sua subsistência, separada dos pais. Você precisará preencher a <strong>Declaração 4 (Independência Financeira)</strong> assinada pelos seus pais confirmando que não te dão apoio financeiro, e indicar duas referências de testemunhas.
          `);
          
          let nextBtn = stepIndependencia.querySelector('#btn-independencia-next');
          if (!nextBtn) {
            nextBtn = document.createElement('button');
            nextBtn.id = 'btn-independencia-next';
            nextBtn.className = 'wizard-btn-calc';
            nextBtn.style.marginTop = '12px';
            nextBtn.style.width = '100%';
            nextBtn.innerText = 'Avançar';
            stepIndependencia.appendChild(nextBtn);
            nextBtn.addEventListener('click', () => {
              revealStep('step-moradia');
            });
          } else {
            nextBtn.style.display = 'block';
          }
        } else {
          showFeedback(stepIndependencia, 'success', `
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 8px; vertical-align: middle;"><polyline points="20 6 9 17 4 12"></polyline></svg>
            Entendido. Sua análise socioeconômica considerará o grupo familiar de origem.
          `);
          
          const nextBtn = stepIndependencia.querySelector('#btn-independencia-next');
          if (nextBtn) nextBtn.style.display = 'none';
          
          revealStep('step-moradia');
        }
      });
    });

    // Passo 5: Moradia
    const stepMoradia = wizardCard.querySelector('#step-moradia');
    const btnsMoradia = stepMoradia.querySelectorAll('.wizard-opt-btn');
    btnsMoradia.forEach(btn => {
      btn.addEventListener('click', () => {
        btnsMoradia.forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        
        const val = btn.getAttribute('data-value');
        wizardState.moradia = val;
        saveWizardState();
        
        hideDownstream('step-moradia');
        
        if (val.includes('aluguel') || val.includes('pensionato') || val.includes('compartilhada') || val.includes('casado_aluguel')) {
          showFeedback(stepMoradia, 'success', `
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 8px; vertical-align: middle;"><polyline points="20 6 9 17 4 12"></polyline></svg>
            Você poderá pleitear o <strong>Auxílio Moradia</strong>. Tenha em mãos o comprovante de pagamento recente e documentos de moradia adicionais recomendados ao final.
          `);
        } else if (val.includes('cedido') || val === 'estudante_alojamento') {
          showFeedback(stepMoradia, 'warning', `
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 8px; vertical-align: middle;"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
            Moradia gratuita em imóvel cedido ou alojamento exige preenchimento da <strong>Declaração 2 (Situação de Moradia)</strong> para atestar sua habitação na cidade onde estuda.
          `);
        } else {
          showFeedback(stepMoradia, 'success', `
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 8px; vertical-align: middle;"><polyline points="20 6 9 17 4 12"></polyline></svg>
            Residindo com a família. A análise considerará as condições de habitação e despesas do domicílio de origem.
          `);
        }
        
        let nextBtn = stepMoradia.querySelector('#btn-moradia-next');
        if (!nextBtn) {
          nextBtn = document.createElement('button');
          nextBtn.id = 'btn-moradia-next';
          nextBtn.className = 'wizard-btn-calc';
          nextBtn.style.marginTop = '12px';
          nextBtn.style.width = '100%';
          nextBtn.innerText = 'Avançar';
          stepMoradia.appendChild(nextBtn);
          nextBtn.addEventListener('click', () => {
            revealStep('step-fontes-renda');
          });
        } else {
          nextBtn.style.display = 'block';
        }
      });
    });

    // Passo 6: Fontes de Renda
    const stepFontesRenda = wizardCard.querySelector('#step-fontes-renda');
    const btnRendaNext = stepFontesRenda.querySelector('#wizard-btn-renda-next');
    btnRendaNext.addEventListener('click', () => {
      const selectedRendas = [];
      const checkboxes = stepFontesRenda.querySelectorAll('input[name="fonte-renda"]:checked');
      checkboxes.forEach(cb => {
        selectedRendas.push(cb.value);
      });
      
      wizardState.fontesRenda = selectedRendas;
      
      if (selectedRendas.length === 0) {
        showFeedback(stepFontesRenda, 'warning', `
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 8px; vertical-align: middle;"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
          Por favor, selecione pelo menos uma opção correspondente às fontes de renda familiar.
        `);
        return;
      }
      
      saveWizardState();
      hideDownstream('step-fontes-renda');
      
      showFeedback(stepFontesRenda, 'success', `
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 8px; vertical-align: middle;"><polyline points="20 6 9 17 4 12"></polyline></svg>
        Fontes de renda mapeadas. Prossiga para a simulação de valores per capita.
      `);
      
      revealStep('step-renda');
    });

    // Passo 7: Renda Per Capita
    const stepRenda = wizardCard.querySelector('#step-renda');
    const inputMembros = stepRenda.querySelector('#wizard-membros');
    const inputRenda = stepRenda.querySelector('#wizard-renda-bruta');
    const btnCalcular = stepRenda.querySelector('#wizard-btn-calcular');

    btnCalcular.addEventListener('click', () => {
      const membros = parseInt(inputMembros.value, 10) || 1;
      const renda = parseFloat(inputRenda.value) || 0;
      
      wizardState.membros = membros;
      wizardState.renda = renda;
      
      const perCapita = renda / membros;
      wizardState.perCapita = perCapita;
      
      const LIMITE_RENDA = 1 * SALARIO_MINIMO;
      
      hideDownstream('step-renda');
      
      let html = '';
      if (perCapita <= LIMITE_RENDA) {
        wizardState.rendaElegivel = true;
        html = `
          <div class="feedback-inner-success" style="padding: 4px 0;">
            <strong>Cálculo Concluído:</strong> Renda familiar per capita estimada em <strong>R$ ${perCapita.toFixed(2)}</strong> (equivalente a ${(perCapita / SALARIO_MINIMO).toFixed(2)} salários mínimos por pessoa).
            <p style="margin-top: 6px;">Você está <strong>dentro do limite regulamentar</strong> do edital (teto de R$ ${SALARIO_MINIMO.toFixed(2)} per capita, correspondente a 1 salários mínimos - Item 3.2).</p>
          </div>
        `;
        showFeedback(stepRenda, 'success', html);
      } else {
        wizardState.rendaElegivel = false;
        html = `
          <div class="feedback-inner-danger" style="padding: 4px 0;">
            <strong>Alerta de Limite Excedido:</strong> Renda familiar per capita estimada em <strong>R$ ${perCapita.toFixed(2)}</strong>.
            <p style="margin-top: 6px;">Sua renda per capita estimada excede o teto de R$ ${SALARIO_MINIMO.toFixed(2)} previsto no edital (Item 3.2). Inscrições acima da renda regulamentar estão sujeitas a indeferimento pela equipe de análise.</p>
          </div>
        `;
        showFeedback(stepRenda, 'danger', html);
      }

      saveWizardState();
      
      let nextBtn = stepRenda.querySelector('#btn-renda-next-step');
      if (!nextBtn) {
        nextBtn = document.createElement('button');
        nextBtn.id = 'btn-renda-next-step';
        nextBtn.className = 'wizard-btn-calc';
        nextBtn.style.marginTop = '12px';
        nextBtn.style.width = '100%';
        nextBtn.innerText = 'Avançar';
        stepRenda.appendChild(nextBtn);
        nextBtn.addEventListener('click', () => {
          revealStep('step-irpf');
        });
      } else {
        nextBtn.style.display = 'block';
      }
    });

    // Passo 8: Imposto de Renda
    const stepIrpf = wizardCard.querySelector('#step-irpf');
    const btnsIrpf = stepIrpf.querySelectorAll('.wizard-opt-btn');
    btnsIrpf.forEach(btn => {
      btn.addEventListener('click', () => {
        btnsIrpf.forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        
        const val = btn.getAttribute('data-value');
        wizardState.irpf = val;
        saveWizardState();
        
        hideDownstream('step-irpf');
        
        if (val === 'isentos_sem_mir') {
          showFeedback(stepIrpf, 'warning', `
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 8px; vertical-align: middle;"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
            <strong>Atenção ao IRPF:</strong> Como há membros isentos sem acesso ao Portal MIR (ou sem conta gov.br qualificada Prata/Ouro), será obrigatório apresentar a <strong>Declaração VII (Não Obrigatoriedade de IRPF)</strong> devidamente preenchida e assinada por esses membros.
          `);
        } else if (val === 'isentos_mir') {
          showFeedback(stepIrpf, 'success', `
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 8px; vertical-align: middle;"><polyline points="20 6 9 17 4 12"></polyline></svg>
            Excelente. Baixe o PDF de consulta "Não entregue" no Portal Meu Imposto de Renda (com status visível, data, hora e código de autenticação) para todos os isentos.
          `);
        } else {
          showFeedback(stepIrpf, 'success', `
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 8px; vertical-align: middle;"><polyline points="20 6 9 17 4 12"></polyline></svg>
            Para os declarantes, junte a Declaração de IRPF 2025 completa (ano-calendário 2024) com o respectivo Recibo de Entrega em um único arquivo PDF.
          `);
        }
        
        let nextBtn = stepIrpf.querySelector('#btn-irpf-next-step');
        if (!nextBtn) {
          nextBtn = document.createElement('button');
          nextBtn.id = 'btn-irpf-next-step';
          nextBtn.className = 'wizard-btn-calc';
          nextBtn.style.marginTop = '12px';
          nextBtn.style.width = '100%';
          nextBtn.innerText = 'Avançar';
          stepIrpf.appendChild(nextBtn);
          nextBtn.addEventListener('click', () => {
            revealStep('step-especiais');
          });
        } else {
          nextBtn.style.display = 'block';
        }
      });
    });

    // Passo 9: Situações Especiais
    const stepEspeciais = wizardCard.querySelector('#step-especiais');
    const btnEspeciaisNext = stepEspeciais.querySelector('#wizard-btn-especiais-next');
    btnEspeciaisNext.addEventListener('click', () => {
      const selectedEspeciais = [];
      const checkboxes = stepEspeciais.querySelectorAll('input[name="situacao-especial"]:checked');
      checkboxes.forEach(cb => {
        selectedEspeciais.push(cb.value);
      });
      
      wizardState.situacoesEspeciais = selectedEspeciais;
      saveWizardState();
      
      hideDownstream('step-especiais');
      
      showFeedback(stepEspeciais, 'success', `
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 8px; vertical-align: middle;"><polyline points="20 6 9 17 4 12"></polyline></svg>
        Mapeamento de situações especiais finalizado. Prossiga para as declarações finais de ciência.
      `);
      
      revealStep('step-prerequisitos');
    });

    // Passo 10: Prerequisites Check (NEW)
    const stepPrereq = wizardCard.querySelector('#step-prerequisitos');
    const btnPrereqNext = stepPrereq.querySelector('#wizard-btn-prereq-next');
    const prereqCbs = [
      stepPrereq.querySelector('#prereq-dados'),
      stepPrereq.querySelector('#prereq-conta'),
      stepPrereq.querySelector('#prereq-email')
    ];
    function checkPrereq() {
      const allChecked = prereqCbs.every(cb => cb.checked);
      btnPrereqNext.disabled = !allChecked;
    }
    prereqCbs.forEach(cb => cb.addEventListener('change', checkPrereq));

    btnPrereqNext.addEventListener('click', () => {
      wizardState.prereqOk = true;
      saveWizardState();
      hideDownstream('step-prerequisitos');
      showFeedback(stepPrereq, 'success', `
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 8px; vertical-align: middle;"><polyline points="20 6 9 17 4 12"></polyline></svg>
        Pré-requisitos confirmados. Prossiga para a declaração de termos de uso do benefício.
      `);
      
      revealStep('step-termos');
    });

    // Passo 11: Terms of Use & RU Rules (NEW)
    const stepTermos = wizardCard.querySelector('#step-termos');
    const btnTermosNext = stepTermos.querySelector('#wizard-btn-termos-next');
    const termosCbs = [
      stepTermos.querySelector('#termo-uso'),
      stepTermos.querySelector('#termo-ru')
    ];
    function checkTermos() {
      const allChecked = termosCbs.every(cb => cb.checked);
      btnTermosNext.disabled = !allChecked;
    }
    termosCbs.forEach(cb => cb.addEventListener('change', checkTermos));

    btnTermosNext.addEventListener('click', () => {
      wizardState.termosOk = true;
      wizardState.isCompleted = true;
      saveWizardState();
      hideDownstream('step-termos');
      showFeedback(stepTermos, 'success', `
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 8px; vertical-align: middle;"><polyline points="20 6 9 17 4 12"></polyline></svg>
        Termos declarados e aceitos! Gerando o seu roteiro de documentos personalizado...
      `);
      
      setTimeout(() => {
        generateResults();
        revealStep('step-resultado');
      }, 1000);
    });

    function generateResults() {
      const resultEligibility = wizardCard.querySelector('#wizard-result-eligibility');
      const resultDocs = wizardCard.querySelector('#wizard-result-docs');
      
      let statusHtml = '';
      
      if (wizardState.reaproveitamento === 'sim') {
        statusHtml = `
          <div class="status-badge success-badge">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5" style="margin-right: 6px; vertical-align: middle;"><polyline points="20 6 9 17 4 12"></polyline></svg>
            Reaproveitamento de Documentos Autorizado
          </div>
          <p style="margin-top: 8px; font-size: 0.9rem; font-weight: 550; color: var(--text-main);">Você atende aos critérios do Item 5.1 do Edital 01/2026 PROAE. Seu cadastro socioeconômico de 2025 será reaproveitado.</p>
        `;
      } else {
        let isEligibleGeneral = (wizardState.desempenhoOk !== false) && (wizardState.rendaElegivel !== false);
        
        if (isEligibleGeneral) {
          statusHtml = `
            <div class="status-badge success-badge">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5" style="margin-right: 6px; vertical-align: middle;"><polyline points="20 6 9 17 4 12"></polyline></svg>
              Perfil Elegível
            </div>
            <p style="margin-top: 8px; font-size: 0.9rem; font-weight: 550; color: var(--text-main);">Com base nos dados fornecidos, você é elegível para participar do edital. Providencie a documentação listada abaixo.</p>
          `;
        } else {
          statusHtml = `
            <div class="status-badge danger-badge">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5" style="margin-right: 6px; vertical-align: middle;"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
              Restrições Encontradas (Alerta de Indeferimento)
            </div>
            <p style="margin-top: 8px; font-size: 0.9rem; font-weight: 550; color: var(--text-main);">Sua simulação aponta restrições importantes que descumprem itens obrigatórios do edital:</p>
            <ul style="margin-left: 18px; margin-top: 4px; font-size: 0.85rem; line-height: 1.4; color: var(--danger);">
              ${wizardState.desempenhoOk === false ? '<li style="font-weight: 600;">Desempenho acadêmico inferior ao exigido no semestre anterior (reprovações > 33% em 2025/2). Será obrigatório abrir Processo de Recurso.</li>' : ''}
              ${wizardState.rendaElegivel === false ? `<li style="font-weight: 600;">Renda familiar per capita de R$ ${wizardState.perCapita.toFixed(2)} excede o limite regulamentar de R$ ${SALARIO_MINIMO.toFixed(2)} (1 salário mínimo - Item 3.2).</li>` : ''}
            </ul>
          `;
        }
      }
      
      resultEligibility.innerHTML = statusHtml;
      
      let docsList = [];
      
      if (wizardState.reaproveitamento === 'sim') {
        // Roteiro de Reaproveitamento Simplificado
        docsList.push('<b>Termo de Reaproveitamento de Documentos:</b> Assinado eletronicamente via conta gov.br pelo estudante, manifestando interesse em reaproveitar os dados declarados no Edital 01/2025.');
        docsList.push('<b>Histórico Acadêmico Atualizado:</b> Histórico escolar oficial completo contendo o rendimento acadêmico do semestre 2025/2, emitido pelo Portal do Aluno da UTFPR.');
        docsList.push('<b>Extrato do CNIS Completo:</b> Extrato de Relações Previdenciárias (Meu INSS) para você e para <b>todos os membros maiores de 18 anos</b> do grupo familiar, emitido no ano corrente.');
      } else {
        // Inscrição Completa
        
        // 1. Identificação Geral (RG/CPF) de todos
        docsList.push('<b>Documentos de Identificação do Grupo Familiar:</b> Cópia de documento oficial com foto e assinatura (RG, CNH) e CPF de <b>todos os membros</b> do núcleo familiar declarado (inclusive crianças, onde certidão de nascimento é aceita).');
        
        // 2. Histórico Escolar do Estudante
        docsList.push('<b>Histórico Escolar Oficial:</b> Histórico completo emitido eletronicamente via Portal do Aluno da UTFPR.');
        
        // 3. Extrato CNIS (Obrigatório para todos maiores de 18 anos)
        docsList.push('<b>Extrato do CNIS Completo (Relações Previdenciárias):</b> Emitido via Meu INSS de forma completa (com vínculos e remunerações detalhadas) para você e <b>todos os membros do grupo maiores de 18 anos</b>. Atenção: não serve extrato simples ou cartão de benefício.');
        
        // 4. IRPF (Imposto de Renda)
        if (wizardState.irpf === 'todos_declararam') {
          docsList.push('<b>Declaração de IRPF + Recibo de Entrega (Unificados):</b> Cópia completa da declaração do Imposto de Renda de 2025 (ano-calendário 2024) com o respectivo recibo de entrega da Receita Federal, para <b>todos os membros da família maiores de 18 anos</b>.');
        } else {
          docsList.push('<b>Declaração de IRPF + Recibo de Entrega (Declarantes):</b> Para os membros do grupo familiar maiores de 18 anos que declaram Imposto de Renda.');
          
          if (wizardState.irpf === 'isentos_mir') {
            docsList.push('<b>Comprovante de Isenção MIR:</b> Print da consulta "Não Entregue" do Portal Meu Imposto de Renda da Receita Federal para os membros maiores de 18 anos isentos (precisa conter CPF/nome no topo e autenticação no rodapé).');
          } else if (wizardState.irpf === 'isentos_sem_mir') {
            docsList.push('<b>Comprovante de Isenção MIR:</b> Print do Portal Meu Imposto de Renda para os membros isentos com acesso.');
            docsList.push('<b>Declaração VII - Não Obrigatoriedade de IRPF (<a href="documentos/Declaração 7 - Não obrigatoriedade IR.docx" download class="wizard-doc-download-link">📥 Baixar Modelo 7 (.docx)</a>):</b> Obrigatória para cada membro maior de 18 anos isento que não possui acesso ao gov.br Prata/Ouro para emitir o MIR. <b>Preenchimento:</b> Marque os anos de 2024 e/ou 2025 e o membro deve assinar.');
          }
        }
        
        // 5. Independência Financeira
        if (wizardState.independencia === 'sim') {
          docsList.push('<b>Declaração IV - Independência Financeira (<a href="documentos/Declaração 4 - Independência financeira.docx" download class="wizard-doc-download-link">📥 Baixar Modelo 4 (.docx)</a>):</b> Deve ser preenchida e assinada por seus <b>pais ou responsável legal</b>, atestando expressamente que não contribuem financeira ou materialmente com o estudante. Deve conter as assinaturas e telefones de duas testemunhas externas (não familiares).');
          docsList.push('<b>Comprovantes de Independência:</b> Comprovante de endereço próprio diferente do dos pais, além de comprovante de renda própria suficiente para prover a subsistência.');
        }
        
        // 6. Comprovante de Situação de Moradia e Declaração 2 / 6
        if (wizardState.moradia === 'familia_alugada') {
          docsList.push('<b>Comprovante de Despesa de Moradia:</b> Cópia do contrato de locação em nome de algum membro do grupo familiar e recibo de pagamento do aluguel/financiamento recente.');
        } else if (wizardState.moradia === 'estudante_aluguel_contrato') {
          docsList.push('<b>Comprovantes para Auxílio Moradia:</b> Cópia do Contrato de Locação em seu nome e recibo de pagamento do aluguel recente na cidade do campus.');
          docsList.push('<b>Declaração II - Situação de Moradia do Estudante (<a href="documentos/Declaração 2 - Situação moradia estudante.docx" download class="wizard-doc-download-link">📥 Baixar Modelo 2 (.docx)</a>):</b> Preenchida por você. <b>Preenchimento:</b> Marque a <b>Opção 1</b> (Resido sozinho e pago R$ ... de aluguel). Assine o documento.');
        } else if (wizardState.moradia === 'estudante_aluguel_sem_contrato') {
          docsList.push('<b>Declaração II - Situação de Moradia do Estudante (<a href="documentos/Declaração 2 - Situação moradia estudante.docx" download class="wizard-doc-download-link">📥 Baixar Modelo 2 (.docx)</a>):</b> Preenchida por você. <b>Preenchimento:</b> Marque a <b>Opção 1</b> (Resido sozinho e pago R$ ... de aluguel). Assine.');
          docsList.push('<b>Declaração VI - Comprovação de Pagamento de Aluguel (<a href="documentos/Declaração 6 - Pagamento de aluguel.docx" download class="wizard-doc-download-link">📥 Baixar Modelo 6 (.docx)</a>):</b> Deve ser preenchida e assinada pelo **proprietário/locador** do imóvel, atestando a locação informal e o valor pago. Requer assinatura de duas testemunhas de referência com dados completos (não familiares). <b>Preenchimento:</b> Marque a **Opção 1** (Sou proprietário do imóvel e Alugo residência sem contrato).');
          docsList.push('<b>Comprovante de Pagamento:</b> Recibo recente de pagamento do aluguel ou comprovante de transferência bancária ao proprietário.');
        } else if (wizardState.moradia === 'estudante_pensionato') {
          docsList.push('<b>Declaração II - Situação de Moradia do Estudante (<a href="documentos/Declaração 2 - Situação moradia estudante.docx" download class="wizard-doc-download-link">📥 Baixar Modelo 2 (.docx)</a>):</b> Preenchida por você. <b>Preenchimento:</b> Marque a <b>Opção 3</b> (Resido em pensionato e pago R$ ...). Assine.');
          docsList.push('<b>Declaração VI - Comprovação de Pagamento de Aluguel (<a href="documentos/Declaração 6 - Pagamento de aluguel.docx" download class="wizard-doc-download-link">📥 Baixar Modelo 6 (.docx)</a>):</b> Preenchida e assinada pelo **proprietário do pensionato**. <b>Preenchimento:</b> Marque a **Opção 2** (Alugo vaga em regime de pensionato). Deve ser assinado pelo dono do pensionato e conter duas testemunhas.');
          docsList.push('<b>Comprovante de Pensionato:</b> Recibo de pagamento mensal recente.');
        } else if (wizardState.moradia === 'estudante_compartilhada') {
          docsList.push('<b>Declaração II - Situação de Moradia do Estudante (<a href="documentos/Declaração 2 - Situação moradia estudante.docx" download class="wizard-doc-download-link">📥 Baixar Modelo 2 (.docx)</a>):</b> Preenchida por você. <b>Preenchimento:</b> Marque a <b>Opção 4</b> (Resido em moradia compartilhada/república, pagando R$ ... de aluguel). Liste os nomes, CPF e telefones dos seus colegas de república.');
          docsList.push('<b>Contrato de Locação e Comprovantes:</b> Contrato de aluguel da república e recibo de pagamento do último mês, acompanhados de comprovantes de rateio se houver.');
          docsList.push('<b>Declaração VI - Comprovação de Aluguel (<a href="documentos/Declaração 6 - Pagamento de aluguel.docx" download class="wizard-doc-download-link">📥 Baixar Modelo 6 (.docx)</a>):</b> Caso a república não possua contrato formal assinado, o proprietário deve preencher e assinar a Declaração VI (Opção 1).');
        } else if (wizardState.moradia === 'estudante_cedido') {
          docsList.push('<b>Declaração II - Situação de Moradia do Estudante (<a href="documentos/Declaração 2 - Situação moradia estudante.docx" download class="wizard-doc-download-link">📥 Baixar Modelo 2 (.docx)</a>):</b> Preenchida por você. <b>Preenchimento:</b> Marque a <b>Opção 2</b> (Resido sozinho e não pago aluguel - cedido gratuitamente) ou a opção de residência com familiares correspondente. Requer preenchimento de duas testemunhas de referência com dados completos (não familiares).');
        } else if (wizardState.moradia === 'estudante_alojamento') {
          docsList.push('<b>Declaração II - Situação de Moradia do Estudante (<a href="documentos/Declaração 2 - Situação moradia estudante.docx" download class="wizard-doc-download-link">📥 Baixar Modelo 2 (.docx)</a>):</b> Preenchida por você. <b>Preenchimento:</b> Marque a <b>Opção 2</b> e informe no texto a residência gratuita em alojamento estudantil oferecido pela UTFPR.');
        } else if (wizardState.moradia === 'estudante_casado_aluguel') {
          docsList.push('<b>Declaração II - Situação de Moradia do Estudante (<a href="documentos/Declaração 2 - Situação moradia estudante.docx" download class="wizard-doc-download-link">📥 Baixar Modelo 2 (.docx)</a>):</b> Preenchida por você. <b>Preenchimento:</b> Marque a <b>Opção 5</b> (Resido com cônjuge/filhos e pago R$ ...). Informou nome e CPF dos familiares.');
          docsList.push('<b>Contrato de Locação e Recibos:</b> Contrato de aluguel e recibo recente em nome do estudante ou cônjuge.');
        } else if (wizardState.moradia === 'estudante_casado_proprio') {
          docsList.push('<b>Declaração II - Situação de Moradia do Estudante (<a href="documentos/Declaração 2 - Situação moradia estudante.docx" download class="wizard-doc-download-link">📥 Baixar Modelo 2 (.docx)</a>):</b> Preenchida por você. <b>Preenchimento:</b> Marque a <b>Opção 6</b> (Resido com cônjuge/filhos e não pago aluguel).');
        }
        
        // 7. Fontes de Renda específicas e suas respectivas declarações
        if (wizardState.fontesRenda.includes('clt')) {
          docsList.push('<b>Comprovantes de Rendimento de Trabalho Formal (CLT):</b> Cópias dos 3 últimos holerites (ou contracheques) mensais de cada membro que possui vínculo CLT ou é servidor público. Em caso de renda variável, anexe também extratos correspondentes.');
        }
        
        if (wizardState.fontesRenda.includes('autonomo')) {
          docsList.push('<b>Declaração I - Declaração de Renda (<a href="documentos/Declaração 1 - Renda.docx" download class="wizard-doc-download-link">📥 Baixar Modelo 1 (.docx)</a>):</b> Obrigatória para o membro familiar autônomo, profissional liberal ou trabalhador informal. <b>Preenchimento:</b> Marque a <b>Opção 2</b> (Exerço atividade de forma autônoma ou informal ou profissional liberal como...), preencha a atividade exercida, a média de rendimentos dos últimos 3 meses e informe nome e telefone de dois clientes atendidos.');
        }
        
        if (wizardState.fontesRenda.includes('estagio')) {
          docsList.push('<b>Declaração I - Declaração de Renda (<a href="documentos/Declaração 1 - Renda.docx" download class="wizard-doc-download-link">📥 Baixar Modelo 1 (.docx)</a>):</b> Para o estudante ou membro estagiário/bolsista. <b>Preenchimento:</b> Marque a <b>Opção 3</b> (Recebo na condição de bolsista/estagiário do projeto/órgão...), informe a data de início e o valor de bolsa mensal. Anexe cópia do Termo de Compromisso de Estágio.');
        }
        
        if (wizardState.fontesRenda.includes('mei')) {
          docsList.push('<b>Declaração I - Declaração de Renda (<a href="documentos/Declaração 1 - Renda.docx" download class="wizard-doc-download-link">📥 Baixar Modelo 1 (.docx)</a>):</b> Obrigatória para os membros MEI da família. <b>Preenchimento:</b> Marque a <b>Opção 4</b> (Microempreendedor Individual), preencha o CNPJ, atividade e valor mensal médio. Anexe a Certidão de Condição de Microempreendedor Individual (CCMEI) e Declaração Anual do Simples Nacional (DASN-SIMEI) do último exercício.');
        }
        
        if (wizardState.fontesRenda.includes('desempregado')) {
          docsList.push('<b>Declaração I - Declaração de Renda (<a href="documentos/Declaração 1 - Renda.docx" download class="wizard-doc-download-link">📥 Baixar Modelo 1 (.docx)</a>):</b> Obrigatória para <b>cada membro maior de 18 anos</b> que se declare desempregado, estudante sem renda ou do lar. <b>Preenchimento:</b> Marque a <b>Opção 1</b> (Não exerço nenhuma atividade remunerada, formal ou informal) para atestar a ausência de renda.');
        }
        
        if (wizardState.fontesRenda.includes('rural')) {
          docsList.push('<b>Declaração III - Renda de Atividade Rural (<a href="documentos/Declaração 3 - Rural.docx" download class="wizard-doc-download-link">📥 Baixar Modelo 3 (.docx)</a>):</b> Obrigatória para produtores rurais ou trabalhadores da agricultura. Deve ser emitida e preenchida/assinada por sindicato de produtores, sindicato de trabalhadores rurais ou Secretaria Municipal/Estadual de Agricultura. <b>Preenchimento:</b> Identifique a localização, área total da propriedade, condição de exploração (proprietário, arrendatário, etc.) e preencha o quadro de comercialização, receitas brutas e custos dos últimos 12 meses.');
          docsList.push('<b>Comprovantes Rurais Adicionais:</b> Bloco de Notas de Produtor Rural (notas emitidas nos últimos 12 meses) e extrato DAP (Declaração de Aptidão ao Pronaf) ou CAF.');
        }
        
        if (wizardState.fontesRenda.includes('aposentado')) {
          docsList.push('<b>Extrato de Pagamento de Benefício do INSS:</b> Extrato oficial emitido pelo Meu INSS do último mês, contendo o valor bruto do benefício (aposentadoria, pensão por morte ou BPC/LOAS). Não serve o cartão do banco.');
        }
        
        if (wizardState.fontesRenda.includes('pensao_judicial')) {
          docsList.push('<b>Comprovantes de Pensão Alimentícia Formal:</b> Cópia da sentença homologatória do divórcio (ou acordo em cartório) fixando o valor da pensão, acompanhada de extrato bancário recente demonstrando o recebimento.');
        }
        
        if (wizardState.fontesRenda.includes('pensao_verbal')) {
          docsList.push('<b>Declaração I - Declaração de Renda (<a href="documentos/Declaração 1 - Renda.docx" download class="wizard-doc-download-link">📥 Baixar Modelo 1 (.docx)</a>):</b> Preenchida pelo responsável ou estudante que recebe. <b>Preenchimento:</b> Marque a <b>Opção 5</b> (Recebo pensão alimentícia de... no valor de R$ ... mensal).');
          docsList.push('<b>Declaração VIII - Renda de Terceiros (<a href="documentos/Declaração 8 - Renda terceiros .docx" download class="wizard-doc-download-link">📥 Baixar Modelo 8 (.docx)</a>):</b>');
          docsList.push('&bull; Se o estudante for maior de 18 anos: o genitor pagador deve assinar e marcar a <b>Opção 4</b> (Contribuo mensalmente com R$ ... de pensão para o estudante).');
          docsList.push('&bull; Se for para menor de 18 anos do grupo: a mãe ou responsável legal residente deve assinar e marcar a <b>Opção 5</b> (Estudante ... recebe pensão alimentícia de ... no valor de R$ ... mensal).');
        }
        
        if (wizardState.fontesRenda.includes('comissao')) {
          docsList.push('<b>Declaração VIII - Renda de Terceiros (<a href="documentos/Declaração 8 - Renda terceiros .docx" download class="wizard-doc-download-link">📥 Baixar Modelo 8 (.docx)</a>):</b> Obrigatória para quem recebe comissão de vendas. Deve ser preenchida e assinada pelo parceiro/empresa pagadora. <b>Preenchimento:</b> Marque a <b>Opção 3</b> (Pago o valor mensal médio de R$ ... por comissão de vendas dos produtos...).');
        }
        
        if (wizardState.fontesRenda.includes('ajuda_terceiros')) {
          docsList.push('<b>Declaração VIII - Renda de Terceiros (<a href="documentos/Declaração 8 - Renda terceiros .docx" download class="wizard-doc-download-link">📥 Baixar Modelo 8 (.docx)</a>):</b> A ser preenchida e assinada por quem envia a ajuda financeira de fora do grupo familiar. <b>Preenchimento:</b> Marque a <b>Opção 1</b> (Contribuo financeiramente com o estudante ... com o valor de R$ ... mensais).');
        }
        
        if (wizardState.fontesRenda.includes('programa_social')) {
          docsList.push('<b>Declaração I - Declaração de Renda (<a href="documentos/Declaração 1 - Renda.docx" download class="wizard-doc-download-link">📥 Baixar Modelo 1 (.docx)</a>):</b> Preenchida pelo beneficiário do domicílio. <b>Preenchimento:</b> Marque a <b>Opção 6</b> (Recebo do programa social ... o valor de R$ ... mensal).');
          docsList.push('<b>Extrato de Pagamento do Programa:</b> Extrato recente do recebimento do benefício (ex: Bolsa Família), com nome do titular e valor histórico das parcelas.');
        }
        
        // 8. Situações Especiais e Casos de Exceção
        if (wizardState.situacoesEspeciais.includes('separacao_verbal')) {
          docsList.push('<b>Declaração V - Diversas Situações (<a href="documentos/Declaração 5 - Diversas situações.docx" download class="wizard-doc-download-link">📥 Baixar Modelo 5 (.docx)</a>):</b> Preenchida pelo genitor com quem você reside ou por você, descrevendo detalhadamente a separação de fato informal e o acordo de boca estabelecido. Exige assinatura de duas testemunhas de referência com dados completos.');
          docsList.push('<b>Declaração VIII - Renda de Terceiros (<a href="documentos/Declaração 8 - Renda terceiros .docx" download class="wizard-doc-download-link">📥 Baixar Modelo 8 (.docx)</a>):</b> Se houver pensão informal decorrente dessa separação, junte a Declaração VIII (Opção 4 ou 5) preenchida conforme o caso.');
        }
        
        if (wizardState.situacoesEspeciais.includes('doenca_grave')) {
          docsList.push('<b>Laudo Médico e Comprovantes de Despesas Médicas:</b> Laudo médico circunstanciado recente atestando a enfermidade grave crônica do membro familiar e cópias de receitas e notas fiscais de compras de medicamentos de uso contínuo dos últimos meses. Isso é avaliado como dedução de renda na análise socioeconômica.');
        }
        
        if (wizardState.situacoesEspeciais.includes('filhos_guarda')) {
          docsList.push('<b>Pleito de Auxílio Infância:</b> Certidão de nascimento dos filhos sob sua guarda direta e termo de guarda unilateral (se houver). Isso habilita a concessão do benefício Auxílio Infância.');
        }
        
        if (wizardState.situacoesEspeciais.includes('aluguel_terceiros')) {
          docsList.push('<b>Declaração VIII - Renda de Terceiros (<a href="documentos/Declaração 8 - Renda terceiros .docx" download class="wizard-doc-download-link">📥 Baixar Modelo 8 (.docx)</a>):</b> Preenchida e assinada por quem paga o seu aluguel de forma direta. <b>Preenchimento:</b> Marque a <b>Opção 2</b> (Pago o valor de R$ ... mensais a título de aluguel do imóvel localizado em...).');
        }
        
        if (wizardState.situacoesEspeciais.includes('outros_casos')) {
          docsList.push('<b>Declaração V - Diversas Situações (<a href="documentos/Declaração 5 - Diversas situações.docx" download class="wizard-doc-download-link">📥 Baixar Modelo 5 (.docx)</a>):</b> Preenchida por você ou membro familiar justificando a realidade excepcional não prevista (ex: abandono, perda de contato, etc.). Deve conter duas referências.');
        }
      }
      
      // Se tiver reprovações > 33%, adiciona obrigatoriamente a comprovação de recurso para calouros/veteranos
      if (wizardState.desempenhoOk === false) {
        docsList.push('<span style="color: var(--danger); font-weight: 600;">Formulário e Justificativas de Recurso:</span> Como seu índice de reprovações/cancelamentos superou 33%, você deve abrir um processo de recurso juntando comprovantes de monitoria, laudos, declarações e justificação formal de faltas.');
      }
      
      // Renderiza na lista
      resultDocs.innerHTML = '';
      docsList.forEach(docText => {
        const li = document.createElement('li');
        li.innerHTML = `
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" class="doc-list-check" style="margin-right: 8px; flex-shrink: 0; margin-top: 3px;"><polyline points="20 6 9 17 4 12"></polyline></svg>
          <span>${docText}</span>
        `;
        resultDocs.appendChild(li);
      });
  
      const btnReiniciar = wizardCard.querySelector('#wizard-btn-reiniciar');
      if (btnReiniciar) {
        btnReiniciar.onclick = resetWizard;
      }
    }

    function resetWizard() {
      wizardState = {
        edital: null,
        vinculo: null,
        reaproveitamento: null,
        desempenhoOk: null,
        independencia: null,
        moradia: null,
        fontesRenda: [],
        membros: 1,
        renda: 0,
        perCapita: 0,
        rendaElegivel: null,
        irpf: null,
        situacoesEspeciais: [],
        prereqOk: false,
        termosOk: false,
        isCompleted: false
      };
      
      try {
        localStorage.removeItem('guia_utfpr_wizard_state');
      } catch (e) {}

      const banner = wizardCard.querySelector('.wizard-restored-banner');
      if (banner) banner.remove();
      
      wizardCard.querySelectorAll('.wizard-opt-btn').forEach(btn => btn.classList.remove('selected'));
      wizardCard.querySelectorAll('.wizard-feedback').forEach(fb => {
        fb.style.display = 'none';
        fb.innerHTML = '';
      });
      
      wizardCard.querySelectorAll('input[type="checkbox"]').forEach(cb => {
        cb.checked = false;
      });
      
      inputMembros.value = 1;
      inputRenda.value = 0;
      btnPrereqNext.disabled = true;
      btnTermosNext.disabled = true;
      
      // Oculta todos os passos exceto o primeiro
      wizardCard.querySelectorAll('.wizard-step').forEach(stepEl => {
        if (stepEl.id === 'step-edital') {
          stepEl.classList.remove('hidden');
          stepEl.classList.add('active');
        } else {
          stepEl.classList.add('hidden');
          stepEl.classList.remove('active');
        }
      });
      
      // Oculta botões dinâmicos criados no DOM
      const dynamicIndNav = stepIndependencia.querySelector('#btn-independencia-next');
      if (dynamicIndNav) dynamicIndNav.style.display = 'none';
      
      const dynamicMoradiaNav = stepMoradia.querySelector('#btn-moradia-next');
      if (dynamicMoradiaNav) dynamicMoradiaNav.style.display = 'none';

      const dynamicRendaNav = stepRenda.querySelector('#btn-renda-next-step');
      if (dynamicRendaNav) dynamicRendaNav.style.display = 'none';
      
      const dynamicIrpfNav = stepIrpf.querySelector('#btn-irpf-next-step');
      if (dynamicIrpfNav) dynamicIrpfNav.style.display = 'none';
      
      stepEdital.scrollIntoView({ behavior: 'smooth' });
    }

    function restoreWizardState() {
      const saved = localStorage.getItem('guia_utfpr_wizard_state');
      if (!saved) return;
      
      try {
        const savedState = JSON.parse(saved);
        if (!savedState || typeof savedState !== 'object') return;
        
        // Verifica se há algo preenchido
        const hasData = savedState.edital || savedState.vinculo || (savedState.fontesRenda && savedState.fontesRenda.length > 0);
        if (!hasData) return;

        // Banner informativo
        const banner = document.createElement('div');
        banner.className = 'wizard-restored-banner';
        banner.style.cssText = 'background-color: var(--primary-glow); border: 1px solid var(--primary); border-radius: var(--radius-md); padding: 10px 14px; display: flex; align-items: center; justify-content: space-between; font-size: 0.85rem; color: var(--text-main); margin-bottom: 20px;';
        banner.innerHTML = `
          <div style="display: flex; align-items: center; gap: 8px;">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" style="color: var(--primary); flex-shrink: 0;"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
            <span><strong>Simulação Restaurada:</strong> Suas respostas anteriores foram recuperadas.</span>
          </div>
          <button id="btn-banner-reiniciar" style="background: none; border: none; color: var(--primary); font-weight: 700; cursor: pointer; text-decoration: underline; font-size: 0.82rem; white-space: nowrap; margin-left: 10px;">Recomeçar</button>
        `;
        
        const wizardHeader = wizardCard.querySelector('.wizard-header');
        if (wizardHeader && wizardHeader.parentNode) {
          wizardHeader.parentNode.insertBefore(banner, wizardHeader.nextSibling);
        }
        
        const btnBannerReiniciar = banner.querySelector('#btn-banner-reiniciar');
        if (btnBannerReiniciar) {
          btnBannerReiniciar.addEventListener('click', resetWizard);
        }
        
        // Passo 1: Edital
        if (savedState.edital) {
          wizardState.edital = savedState.edital;
          const btn = stepEdital.querySelector(`.wizard-opt-btn[data-value="${savedState.edital}"]`);
          if (btn) {
            btnsEdital.forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            if (savedState.edital === 'nao') {
              showFeedback(stepEdital, 'warning', `
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 8px; vertical-align: middle;"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                <strong>Atenção:</strong> É altamente recomendável ler o edital oficial. Você pode consultar a <a href="https://sei.utfpr.edu.br/sei/publicacoes/controlador_publicacoes.php?acao=publicacao_visualizar&id_documento=6394999&id_orgao_publicacao=0" target="_blank" rel="noopener noreferrer">Publicação Oficial do Edital no SEI-UTFPR</a>.
              `);
            } else {
              showFeedback(stepEdital, 'success', `
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 8px; vertical-align: middle;"><polyline points="20 6 9 17 4 12"></polyline></svg>
                Excelente! Estar ciente das regras do edital evita erros de preenchimento.
              `);
            }
            revealStep('step-vinculo');
          }
        }
        
        // Passo 2: Vínculo
        if (savedState.vinculo) {
          wizardState.vinculo = savedState.vinculo;
          const btn = stepVinculo.querySelector(`.wizard-opt-btn[data-value="${savedState.vinculo}"]`);
          if (btn) {
            btnsVinculo.forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            if (savedState.vinculo === 'calouro') {
              wizardState.reaproveitamento = 'nao';
              wizardState.desempenhoOk = true;
              showFeedback(stepVinculo, 'success', `
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 8px; vertical-align: middle;"><polyline points="20 6 9 17 4 12"></polyline></svg>
                Estudantes calouros são avaliados puramente pelos critérios socioeconômicos da nova inscrição.
              `);
              revealStep('step-independencia');
            } else {
              showFeedback(stepVinculo, 'success', `
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 8px; vertical-align: middle;"><polyline points="20 6 9 17 4 12"></polyline></svg>
                Estudante veterano. Prossiga para verificar a opção de reaproveitamento.
              `);
              revealStep('step-reaproveitamento');
            }
          }
        }
        
        // Passo 2.1: Reaproveitamento
        if (savedState.vinculo === 'veterano' && savedState.reaproveitamento) {
          wizardState.reaproveitamento = savedState.reaproveitamento;
          const btn = stepReaproveitamento.querySelector(`.wizard-opt-btn[data-value="${savedState.reaproveitamento}"]`);
          if (btn) {
            btnsReaproveitamento.forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            if (savedState.reaproveitamento === 'sim') {
              showFeedback(stepReaproveitamento, 'success', `
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 8px; vertical-align: middle;"><polyline points="20 6 9 17 4 12"></polyline></svg>
                <strong>Elegível para Reaproveitamento de Documentos (Item 5.1):</strong> Ótimo! Como veterano com situação idêntica à de 2025, seu processo de envio de documentos é simplificado. Prossiga para avaliar o desempenho acadêmico.
              `);
            } else {
              showFeedback(stepReaproveitamento, 'warning', `
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 8px; vertical-align: middle;"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                Entendido. Como houve alteração ou não participou do último edital, você fará uma inscrição completa. Prossiga para avaliar o desempenho acadêmico.
              `);
            }
            revealStep('step-desempenho');
          }
        }
        
        // Passo 3: Desempenho
        if (savedState.desempenhoOk !== null && savedState.desempenhoOk !== undefined) {
          wizardState.desempenhoOk = savedState.desempenhoOk;
          const btnVal = savedState.desempenhoOk ? 'nao' : 'sim';
          const btn = stepDesempenho.querySelector(`.wizard-opt-btn[data-value="${btnVal}"]`);
          if (btn) {
            btnsDesempenho.forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            if (!savedState.desempenhoOk) {
              showFeedback(stepDesempenho, 'danger', `
                <div class="wizard-alert">
                  <strong>Atenção:</strong> Você precisará abrir um <strong>PROCESSO DE RECURSO</strong>.
                  Prepare a seguinte documentação justificativa: Relatórios de monitoria ou P.Aluno; Laudos, declarações e certificados; Comprovação documental para justificar faltas.
                </div>
              `);
            } else {
              showFeedback(stepDesempenho, 'success', `
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 8px; vertical-align: middle;"><polyline points="20 6 9 17 4 12"></polyline></svg>
                Desempenho acadêmico qualificado (reprovações menores ou iguais a 33%).
              `);
            }
            if (savedState.reaproveitamento === 'sim') {
              revealStep('step-prerequisitos');
            } else {
              revealStep('step-independencia');
            }
          }
        }
        
        // Passo 4: Independência
        if (savedState.reaproveitamento !== 'sim' && savedState.independencia) {
          wizardState.independencia = savedState.independencia;
          const btn = stepIndependencia.querySelector(`.wizard-opt-btn[data-value="${savedState.independencia}"]`);
          if (btn) {
            btnsIndependencia.forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            if (savedState.independencia === 'sim') {
              showFeedback(stepIndependencia, 'warning', `
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 8px; vertical-align: middle;"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                <strong>Atenção:</strong> Declarar independência financeira exige comprovação de residência e renda próprias que cubram sua subsistência, separada dos pais. Você precisará preencher a <strong>Declaração 4 (Independência Financeira)</strong> assinada pelos seus pais confirmando que não te dão apoio financeiro, e indicar duas referências de testemunhas.
              `);
              let nextBtn = stepIndependencia.querySelector('#btn-independencia-next');
              if (!nextBtn) {
                nextBtn = document.createElement('button');
                nextBtn.id = 'btn-independencia-next';
                nextBtn.className = 'wizard-btn-calc';
                nextBtn.style.marginTop = '12px';
                nextBtn.style.width = '100%';
                nextBtn.innerText = 'Avançar';
                stepIndependencia.appendChild(nextBtn);
                nextBtn.addEventListener('click', () => {
                  revealStep('step-moradia');
                });
              } else {
                nextBtn.style.display = 'block';
              }
            } else {
              showFeedback(stepIndependencia, 'success', `
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 8px; vertical-align: middle;"><polyline points="20 6 9 17 4 12"></polyline></svg>
                Entendido. Sua análise socioeconômica considerará o grupo familiar de origem.
              `);
            }
            revealStep('step-moradia');
          }
        }
        
        // Passo 5: Moradia
        if (savedState.reaproveitamento !== 'sim' && savedState.moradia) {
          wizardState.moradia = savedState.moradia;
          const btn = stepMoradia.querySelector(`.wizard-opt-btn[data-value="${savedState.moradia}"]`);
          if (btn) {
            btnsMoradia.forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            if (savedState.moradia.includes('aluguel') || savedState.moradia.includes('pensionato') || savedState.moradia.includes('compartilhada') || savedState.moradia.includes('casado_aluguel')) {
              showFeedback(stepMoradia, 'success', `
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 8px; vertical-align: middle;"><polyline points="20 6 9 17 4 12"></polyline></svg>
                Você poderá pleitear o <strong>Auxílio Moradia</strong>. Tenha em mãos o comprovante de pagamento recente e documentos de moradia adicionais recomendados ao final.
              `);
            } else if (savedState.moradia.includes('cedido') || savedState.moradia === 'estudante_alojamento') {
              showFeedback(stepMoradia, 'warning', `
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 8px; vertical-align: middle;"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                Moradia gratuita em imóvel cedido ou alojamento exige preenchimento da <strong>Declaração 2 (Situação de Moradia)</strong> para atestar sua habitação na cidade onde estuda.
              `);
            } else {
              showFeedback(stepMoradia, 'success', `
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 8px; vertical-align: middle;"><polyline points="20 6 9 17 4 12"></polyline></svg>
                Residindo com a família. A análise considerará as condições de habitação e despesas do domicílio de origem.
              `);
            }
            let nextBtn = stepMoradia.querySelector('#btn-moradia-next');
            if (!nextBtn) {
              nextBtn = document.createElement('button');
              nextBtn.id = 'btn-moradia-next';
              nextBtn.className = 'wizard-btn-calc';
              nextBtn.style.marginTop = '12px';
              nextBtn.style.width = '100%';
              nextBtn.innerText = 'Avançar';
              stepMoradia.appendChild(nextBtn);
              nextBtn.addEventListener('click', () => {
                revealStep('step-fontes-renda');
              });
            } else {
              nextBtn.style.display = 'block';
            }
            revealStep('step-fontes-renda');
          }
        }
        
        // Passo 6: Fontes de Renda
        if (savedState.reaproveitamento !== 'sim' && Array.isArray(savedState.fontesRenda) && savedState.fontesRenda.length > 0) {
          wizardState.fontesRenda = savedState.fontesRenda;
          savedState.fontesRenda.forEach(val => {
            const cb = stepFontesRenda.querySelector(`input[name="fonte-renda"][value="${val}"]`);
            if (cb) cb.checked = true;
          });
          showFeedback(stepFontesRenda, 'success', `
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 8px; vertical-align: middle;"><polyline points="20 6 9 17 4 12"></polyline></svg>
            Fontes de renda mapeadas. Prossiga para a simulação de valores per capita.
          `);
          revealStep('step-renda');
        }
        
        // Passo 7: Renda
        if (savedState.reaproveitamento !== 'sim' && (savedState.rendaElegivel !== null && savedState.rendaElegivel !== undefined)) {
          wizardState.membros = savedState.membros || 1;
          wizardState.renda = savedState.renda || 0;
          wizardState.perCapita = savedState.perCapita || 0;
          wizardState.rendaElegivel = savedState.rendaElegivel;
          
          inputMembros.value = wizardState.membros;
          inputRenda.value = wizardState.renda;
          
          const perCapita = wizardState.perCapita;
          if (wizardState.rendaElegivel) {
            showFeedback(stepRenda, 'success', `
              <div class="feedback-inner-success" style="padding: 4px 0;">
                <strong>Cálculo Concluído:</strong> Renda familiar per capita estimada em <strong>R$ ${perCapita.toFixed(2)}</strong> (equivalente a ${(perCapita / SALARIO_MINIMO).toFixed(2)} salários mínimos por pessoa).
                <p style="margin-top: 6px;">Você está <strong>dentro do limite regulamentar</strong> do edital (teto de R$ ${SALARIO_MINIMO.toFixed(2)} per capita, correspondente a 1 salários mínimos - Item 3.2).</p>
              </div>
            `);
          } else {
            showFeedback(stepRenda, 'danger', `
              <div class="feedback-inner-danger" style="padding: 4px 0;">
                <strong>Alerta de Limite Excedido:</strong> Renda familiar per capita estimada em <strong>R$ ${perCapita.toFixed(2)}</strong>.
                <p style="margin-top: 6px;">Sua renda per capita estimada excede o teto de R$ ${SALARIO_MINIMO.toFixed(2)} previsto no edital (Item 3.2). Inscrições acima da renda regulamentar estão sujeitas a indeferimento pela equipe de análise.</p>
              </div>
            `);
          }
          
          let nextBtn = stepRenda.querySelector('#btn-renda-next-step');
          if (!nextBtn) {
            nextBtn = document.createElement('button');
            nextBtn.id = 'btn-renda-next-step';
            nextBtn.className = 'wizard-btn-calc';
            nextBtn.style.marginTop = '12px';
            nextBtn.style.width = '100%';
            nextBtn.innerText = 'Avançar';
            stepRenda.appendChild(nextBtn);
            nextBtn.addEventListener('click', () => {
              revealStep('step-irpf');
            });
          } else {
            nextBtn.style.display = 'block';
          }
          revealStep('step-irpf');
        }
        
        // Passo 8: IRPF
        if (savedState.reaproveitamento !== 'sim' && savedState.irpf) {
          wizardState.irpf = savedState.irpf;
          const btn = stepIrpf.querySelector(`.wizard-opt-btn[data-value="${savedState.irpf}"]`);
          if (btn) {
            btnsIrpf.forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            if (savedState.irpf === 'isentos_sem_mir') {
              showFeedback(stepIrpf, 'warning', `
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 8px; vertical-align: middle;"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                <strong>Atenção ao IRPF:</strong> Como há membros isentos sem acesso ao Portal MIR (ou sem conta gov.br qualificada Prata/Ouro), será obrigatório apresentar a <strong>Declaração VII (Não Obrigatoriedade de IRPF)</strong> devidamente preenchida e assinada por esses membros.
              `);
            } else if (savedState.irpf === 'isentos_mir') {
              showFeedback(stepIrpf, 'success', `
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 8px; vertical-align: middle;"><polyline points="20 6 9 17 4 12"></polyline></svg>
                Excelente. Baixe o PDF de consulta "Não entregue" no Portal Meu Imposto de Renda (com status visível, data, hora e código de autenticação) para todos os isentos.
              `);
            } else {
              showFeedback(stepIrpf, 'success', `
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 8px; vertical-align: middle;"><polyline points="20 6 9 17 4 12"></polyline></svg>
                Para os declarantes, junte a Declaração de IRPF 2025 completa (ano-calendário 2024) com o respectivo Recibo de Entrega em um único arquivo PDF.
              `);
            }
            let nextBtn = stepIrpf.querySelector('#btn-irpf-next-step');
            if (!nextBtn) {
              nextBtn = document.createElement('button');
              nextBtn.id = 'btn-irpf-next-step';
              nextBtn.className = 'wizard-btn-calc';
              nextBtn.style.marginTop = '12px';
              nextBtn.style.width = '100%';
              nextBtn.innerText = 'Avançar';
              stepIrpf.appendChild(nextBtn);
              nextBtn.addEventListener('click', () => {
                revealStep('step-especiais');
              });
            } else {
              nextBtn.style.display = 'block';
            }
            revealStep('step-especiais');
          }
        }
        
        // Passo 9: Situações Especiais
        if (savedState.reaproveitamento !== 'sim' && Array.isArray(savedState.situacoesEspeciais)) {
          wizardState.situacoesEspeciais = savedState.situacoesEspeciais;
          savedState.situacoesEspeciais.forEach(val => {
            const cb = stepEspeciais.querySelector(`input[name="situacao-especial"][value="${val}"]`);
            if (cb) cb.checked = true;
          });
          if (savedState.situacoesEspeciais.length > 0 || savedState.prereqOk) {
            showFeedback(stepEspeciais, 'success', `
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 8px; vertical-align: middle;"><polyline points="20 6 9 17 4 12"></polyline></svg>
              Mapeamento de situações especiais finalizado. Prossiga para as declarações finais de ciência.
            `);
            revealStep('step-prerequisitos');
          }
        }
        
        // Passo 10: Pré-requisitos
        if (savedState.prereqOk) {
          wizardState.prereqOk = true;
          prereqCbs.forEach(cb => cb.checked = true);
          btnPrereqNext.disabled = false;
          showFeedback(stepPrereq, 'success', `
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 8px; vertical-align: middle;"><polyline points="20 6 9 17 4 12"></polyline></svg>
            Pré-requisitos confirmados. Prossiga para a declaração de termos de uso do benefício.
          `);
          revealStep('step-termos');
        }
        
        // Passo 11: Termos e Resultado
        if (savedState.termosOk) {
          wizardState.termosOk = true;
          termosCbs.forEach(cb => cb.checked = true);
          btnTermosNext.disabled = false;
          showFeedback(stepTermos, 'success', `
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 8px; vertical-align: middle;"><polyline points="20 6 9 17 4 12"></polyline></svg>
            Termos declarados e aceitos! Gerando o seu roteiro de documentos personalizado...
          `);
          if (savedState.isCompleted) {
            wizardState.isCompleted = true;
            generateResults();
            revealStep('step-resultado');
          }
        }
        
      } catch (e) {
        console.error('Erro ao restaurar estado do wizard:', e);
      }
    }

    // Restaura estado salvo automaticamente se houver
    restoreWizardState();
  }


  // ==========================================================================
  // 6. CONTROLES DE NAVEGAÇÃO (ANTERIOR / PRÓXIMO)
  // ==========================================================================
  
  function updateNavigationControls() {
    prevBtn.disabled = (activePageIndex === 0);
    nextBtn.disabled = (activePageIndex === allPages.length - 1);
  }

  prevBtn.addEventListener('click', () => {
    if (activePageIndex > 0) {
      navigateToPage(activePageIndex - 1);
    }
  });

  nextBtn.addEventListener('click', () => {
    if (activePageIndex < allPages.length - 1) {
      navigateToPage(activePageIndex + 1);
    }
  });

  // ==========================================================================
  // 7. PROGRESSO DE LEITURA
  // ==========================================================================
  
  function updateProgress() {
    // O progresso é baseado no índice da página atual em relação ao total de páginas
    const percent = Math.round((activePageIndex / (allPages.length - 1)) * 100);
    
    progressText.textContent = `Progresso: ${percent}%`;
    progressBar.style.width = `${percent}%`;
  }

  // ==========================================================================
  // 8. BUSCA GLOBAL EM TEMPO REAL
  // ==========================================================================
  
  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();
    
    if (!query) {
      clearSearch.style.display = 'none';
      renderActivePage();
      updateNavigationControls();
      return;
    }
    
    clearSearch.style.display = 'block';
    performSearch(query);
  });

  clearSearch.addEventListener('click', () => {
    searchInput.value = '';
    clearSearch.style.display = 'none';
    renderActivePage();
    updateNavigationControls();
    searchInput.focus();
  });

  function performSearch(query) {
    pageContainer.innerHTML = '';
    
    const resultsWrapper = document.createElement('div');
    resultsWrapper.className = 'page-content-wrapper fade-in';
    
    const title = document.createElement('h2');
    title.className = 'search-results-title';
    title.textContent = `Resultados da busca por "${query}"`;
    resultsWrapper.appendChild(title);
    
    const resultsList = document.createElement('div');
    resultsList.className = 'search-results-list';
    
    let matchesCount = 0;
    
    allPages.forEach(page => {
      // Ignora a capa na busca por padrão
      if (page.index === 0) return;
      
      let pageMatches = false;
      let textSnippet = '';
      
      // Procura no título, eyebrow e subtítulo
      if (page.title.toLowerCase().includes(query) || 
          page.eyebrow.toLowerCase().includes(query) || 
          page.subtitle.toLowerCase().includes(query)) {
        pageMatches = true;
        textSnippet = page.subtitle;
      }
      
      // Procura no conteúdo dos elementos
      const matchingElements = page.elements.filter(el => {
        if (el.content && el.content.toLowerCase().includes(query)) return true;
        if (el.type === 'download') {
          return (el.title && el.title.toLowerCase().includes(query)) ||
                 (el.description && el.description.toLowerCase().includes(query));
        }
        return false;
      });
      
      if (matchingElements.length > 0) {
        pageMatches = true;
        if (!textSnippet) {
          const matchedEl = matchingElements[0];
          textSnippet = matchedEl.type === 'download' ? `${matchedEl.title} - ${matchedEl.description}` : matchedEl.content;
        }
      }
      
      if (pageMatches) {
        matchesCount++;
        const resultItem = document.createElement('div');
        resultItem.className = 'search-result-item';
        
        // Destaca o termo de busca no snippet
        const highlightedSnippet = highlightText(textSnippet, query);
        
        resultItem.innerHTML = `
          <div class="result-eyebrow">${page.eyebrow}</div>
          <h3>${page.title}</h3>
          <p>${highlightedSnippet}</p>
        `;
        
        resultItem.addEventListener('click', () => {
          navigateToPage(allPages.findIndex(p => p.index === page.index));
        });
        
        resultsList.appendChild(resultItem);
      }
    });
    
    if (matchesCount === 0) {
      const noResults = document.createElement('div');
      noResults.className = 'no-results';
      noResults.innerHTML = `
        <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" stroke-width="1.5">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <p>Nenhum resultado encontrado para "${query}". tente termos diferentes.</p>
      `;
      resultsWrapper.appendChild(noResults);
    } else {
      resultsWrapper.appendChild(resultsList);
    }
    
    pageContainer.appendChild(resultsWrapper);
    
    // Desabilita botões de navegação rápida quando estiver na tela de busca
    prevBtn.disabled = true;
    nextBtn.disabled = true;
  }

  // Função utilitária para destacar o termo buscado
  function highlightText(text, query) {
    if (!text) return '';
    const cleanText = text.replace(/<[^>]*>/g, ''); // Remove tags HTML para busca
    const index = cleanText.toLowerCase().indexOf(query);
    if (index === -1) return cleanText.substring(0, 140) + '...';
    
    const start = Math.max(0, index - 40);
    const end = Math.min(cleanText.length, index + query.length + 60);
    let snippet = cleanText.substring(start, end);
    
    if (start > 0) snippet = '...' + snippet;
    if (end < cleanText.length) snippet = snippet + '...';
    
    const regex = new RegExp(`(${escapeRegExp(query)})`, 'gi');
    return snippet.replace(regex, '<mark style="background-color: var(--primary); color: #000000; padding: 2px 4px; border-radius: 4px; font-weight: 600;">$1</mark>');
  }

  function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  // ==========================================================================
  // 9. EVENTOS DO DRAWER MOBILE (SIDEBAR GAVETA)
  // ==========================================================================
  
  function openMobileSidebar() {
    sidebar.classList.add('open');
    sidebarOverlay.classList.add('visible');
    document.body.style.overflow = 'hidden'; // Evita scroll do fundo
  }

  function closeMobileSidebar() {
    sidebar.classList.remove('open');
    sidebarOverlay.classList.remove('visible');
    document.body.style.overflow = '';
  }

  menuToggle.addEventListener('click', openMobileSidebar);
  sidebarOverlay.addEventListener('click', closeMobileSidebar);

  // ==========================================================================
  // 10. INICIALIZAÇÃO DO APP
  // ==========================================================================
  
  buildSidebarNav();
  handleRoute();
  
  // Escuta mudanças de hash na URL para navegação por links do navegador
  window.addEventListener('hashchange', handleRoute);
});
