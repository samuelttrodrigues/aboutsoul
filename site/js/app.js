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
  let currentTheme = localStorage.getItem('guia_utfpr_theme') || 'light';

  // Elementos do DOM
  const sidebar = document.getElementById('sidebar');
  const menuToggle = document.getElementById('menuToggle');
  const sidebarOverlay = document.getElementById('sidebarOverlay');
  const themeButtons = document.querySelectorAll('.theme-opt-btn');
  const themeToggleMobile = document.getElementById('themeToggleMobile');
  const navMenu = document.getElementById('navigationMenu');
  const searchInput = document.getElementById('searchInput');
  const clearSearch = document.getElementById('clearSearch');
  const breadcrumbs = document.getElementById('breadcrumbs');
  const progressText = document.getElementById('progressText');
  const progressBar = document.getElementById('progressBar');
  const pageContainer = document.getElementById('pageContainer');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');

  // ==========================================================================
  // 2. TEMAS DE LEITURA (CLARO, ESCURO, SÉPIA, UTFPR)
  // ==========================================================================
  
  const themesList = ['light', 'dark', 'sepia', 'utfpr'];

  function applyTheme(theme) {
    const finalTheme = themesList.includes(theme) ? theme : 'light';
    document.documentElement.setAttribute('data-theme', finalTheme);
    localStorage.setItem('guia_utfpr_theme', finalTheme);
    currentTheme = finalTheme;
    
    // Atualiza o estado visual ativo dos botões de seleção de tema
    themeButtons.forEach(btn => {
      if (btn.getAttribute('data-theme-val') === finalTheme) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }

  // Inicializa tema
  applyTheme(currentTheme);

  // Cliques nos botões de tema da sidebar
  themeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const selected = btn.getAttribute('data-theme-val');
      applyTheme(selected);
    });
  });
  
  // Botão mobile cicla sequencialmente entre os temas
  if (themeToggleMobile) {
    themeToggleMobile.addEventListener('click', () => {
      const currentIndex = themesList.indexOf(currentTheme);
      const nextIndex = (currentIndex + 1) % themesList.length;
      applyTheme(themesList[nextIndex]);
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
        a.textContent = page.title;
        a.href = `#page-${page.index}`;
        
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
      const index = parseInt(pageMatch[1], 10);
      // Garante que o índice existe
      if (index >= 0 && index < allPages.length) {
        navigateToPage(index);
        return;
      }
    }
    
    // Rota padrão: página inicial (Capa)
    navigateToPage(0);
  }

  function navigateToPage(index) {
    activePageIndex = index;
    
    // Limpa busca ao mudar de página
    if (searchInput.value) {
      searchInput.value = '';
      clearSearch.style.display = 'none';
    }
    
    // Atualiza o hash se for diferente
    if (window.location.hash !== `#page-${index}`) {
      window.location.hash = `#page-${index}`;
    }
    
    renderActivePage();
    updateNavigationControls();
    highlightSidebarItem(index);
    updateProgress();
    
    // Rola a área de conteúdo de volta para o topo
    pageContainer.scrollTop = 0;
  }

  function highlightSidebarItem(index) {
    // Remove classe ativa de todos os links
    document.querySelectorAll('.page-item-link').forEach(link => {
      link.classList.remove('active');
    });
    
    // Adiciona classe ativa no link correspondente
    const activeLink = document.querySelector(`.page-link-${index}`);
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
      return;
    }
    
    // Atualiza Breadcrumbs
    breadcrumbs.innerHTML = `<span>${page.categoryTitle}</span> &rsaquo; <span>${page.title}</span>`;
    
    // Header da Página
    const header = document.createElement('header');
    header.innerHTML = `
      <div class="page-eyebrow">${page.eyebrow}</div>
      <h1 class="page-title">${page.title}</h1>
      <p class="page-subtitle">${page.subtitle}</p>
    `;
    pageWrapper.appendChild(header);
    
    // Grid de Elementos (Cards, Highlights)
    const elementsContainer = document.createElement('div');
    
    // Verifica se a página atual deve renderizar checklists (Ex: Checklist Final ou Antes de Começar)
    const isChecklistPage = page.title.toLowerCase().includes('checklist') || 
                            page.title.toLowerCase().includes('começar');
    
    if (isChecklistPage) {
      elementsContainer.className = 'cards-grid checklist-grid';
    } else {
      elementsContainer.className = 'cards-grid';
    }
    
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
          
          // Clique no card altera o estado do checkbox
          card.addEventListener('click', (e) => {
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
      }
    });
    
    pageWrapper.insertBefore(elementsContainer, pageWrapper.querySelector('.highlight-box'));
    pageContainer.appendChild(pageWrapper);
  }

  // Renderiza o visual de Capa personalizado
  function renderCapa(container, page) {
    const capaDiv = document.createElement('div');
    capaDiv.className = 'capa-container';
    
    // Pega as descrições dos itens da capa
    const bulletsHtml = page.elements
      .filter(el => el.type === 'card')
      .map(el => `
        <div class="capa-bullet-item">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          <span>${el.content}</span>
        </div>
      `).join('');
      
    capaDiv.innerHTML = `
      <span class="capa-eyebrow">${page.eyebrow}</span>
      <h1 class="capa-title">${page.title}</h1>
      <p class="capa-subtitle">${page.subtitle}</p>
      
      <div class="video-container">
        <iframe src="https://www.youtube.com/embed/5bcIIwg_gGQ?si=wfwsdIex0IA_S_Xz" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
      </div>
      
      <div class="capa-bullets">
        ${bulletsHtml}
      </div>
      
      <button id="startReadingBtn" class="start-reading-btn">
        <span>Começar Guia Passo a Passo</span>
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5">
          <line x1="5" y1="12" x2="19" y2="12"></line>
          <polyline points="12 5 19 12 12 19"></polyline>
        </svg>
      </button>
    `;
    
    container.appendChild(capaDiv);
    
    // Ação do Botão Começar
    const startBtn = capaDiv.querySelector('#startReadingBtn');
    startBtn.addEventListener('click', () => {
      // Vai para a página "Antes de começar" (Índice 1 no array final achatado, que é o index 2 original)
      navigateToPage(1);
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
      const matchingElements = page.elements.filter(el => 
        el.content && el.content.toLowerCase().includes(query)
      );
      
      if (matchingElements.length > 0) {
        pageMatches = true;
        if (!textSnippet) {
          textSnippet = matchingElements[0].content;
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
