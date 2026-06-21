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
      } else if (el.type === 'pdf-viewer') {
        const pdfWrap = document.createElement('div');
        pdfWrap.className = 'pdf-viewer-wrapper';
        pdfWrap.innerHTML = `
          <div class="pdf-viewer-header">
            <h3>Visualização Direta do Documento</h3>
            <p>Caso o seu navegador não suporte visualização direta de arquivos PDF, você pode baixá-lo no botão inferior.</p>
          </div>
          <div class="pdf-viewer-container">
            <object data="${el.url}" type="application/pdf" width="100%" height="700px">
              <iframe src="${el.url}" width="100%" height="700px" style="border: none;">
                Este navegador não suporta visualização de PDFs.
              </iframe>
            </object>
          </div>
          <div class="pdf-viewer-footer">
            <a href="${el.url}" download class="download-btn">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 6px; vertical-align: middle;">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
              <span>Baixar Documento Completo</span>
            </a>
          </div>
        `;
        pageWrapper.appendChild(pdfWrap);
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
      // Se houver algum box de destaque ou vídeo, colocamos o container de cards antes
      const firstMediaEl = pageWrapper.querySelector('.highlight-box, .video-wrapper, .pdf-viewer-wrapper');
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

  // Renderiza o visual de Capa personalizado
  function renderCapa(container, page) {
    const capaDiv = document.createElement('div');
    capaDiv.className = 'capa-container';
    
    capaDiv.innerHTML = `
      <span class="capa-eyebrow">${page.eyebrow}</span>
      <h1 class="capa-title">${page.title}</h1>
      <p class="capa-subtitle">${page.subtitle}</p>
      
      <div class="capa-description-box">
        <p>Este informativo interativo foi criado para simplificar o seu processo de inscrição no <strong>Programa de Auxílio Estudantil da UTFPR (Edital 01/2026 PROGRAD/ASSAE)</strong>. Aqui você encontrará instruções diretas, modelos de documentos e listas de verificação para garantir que sua solicitação seja enviada sem erros.</p>
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
        <p class="wizard-question">1. Você já leu o Edital 01/2026 PROGRAD/ASSAE ou o tem em mãos?</p>
        <div class="wizard-options">
          <button class="wizard-opt-btn" data-value="sim">Sim, já li / estou com ele</button>
          <button class="wizard-opt-btn" data-value="nao">Não li ainda</button>
        </div>
        <div class="wizard-feedback" style="display: none; margin-top: 12px;"></div>
      </div>

      <!-- Passo 2: Ingressante ou Veterano -->
      <div class="wizard-step" id="step-vinculo" style="display: none; margin-top: 24px;">
        <p class="wizard-question">2. Qual o seu vínculo de matrícula com a UTFPR?</p>
        <div class="wizard-options">
          <button class="wizard-opt-btn" data-value="calouro">Estudante Calouro (Ingressante em 2026)</button>
          <button class="wizard-opt-btn" data-value="veterano">Estudante Veterano</button>
        </div>
        <div class="wizard-feedback" style="display: none; margin-top: 12px;"></div>
        
        <!-- Sub-passo 2.1 para Veteranos: Reaproveitamento -->
        <div class="wizard-substep" id="substep-reaproveitamento" style="display: none; margin-top: 16px; border-left: 2px dashed var(--border); padding-left: 16px;">
          <p class="wizard-question" style="font-size: 0.9rem;">2.1. Você participou do Edital de Auxílio de 2025, obteve status DEFERIDO e sua situação familiar/renda continua 100% IDÊNTICA?</p>
          <div class="wizard-options">
            <button class="wizard-opt-btn btn-sm" data-value="sim">Sim (Elegível para Reaproveitamento)</button>
            <button class="wizard-opt-btn btn-sm" data-value="nao">Não / Tive alterações na renda ou família</button>
          </div>
          <div class="wizard-feedback" style="display: none; margin-top: 12px;"></div>
        </div>

        <!-- Sub-passo 2.2 para Veteranos: Desempenho -->
        <div class="wizard-substep" id="substep-desempenho" style="display: none; margin-top: 16px; border-left: 2px dashed var(--border); padding-left: 16px;">
          <p class="wizard-question" style="font-size: 0.9rem;">2.2. Teve reprovação ou cancelamento em mais de 33% das matérias no semestre anterior (2025/2)?</p>
          <div class="wizard-options">
            <button class="wizard-opt-btn btn-sm" data-value="sim">Sim, tive reprovações acima de 33%</button>
            <button class="wizard-opt-btn btn-sm" data-value="nao">Não, reprovações menores ou iguais a 33%</button>
          </div>
          <div class="wizard-feedback" style="display: none; margin-top: 12px;"></div>
        </div>
      </div>

      <!-- Passo 3: Independência Financeira -->
      <div class="wizard-step" id="step-independencia" style="display: none; margin-top: 24px;">
        <p class="wizard-question">3. Você é financeiramente independente dos seus pais/núcleo familiar de origem?</p>
        <div class="wizard-options">
          <button class="wizard-opt-btn" data-value="sim">Sim, sou independente e me sustento por conta própria</button>
          <button class="wizard-opt-btn" data-value="nao">Não, dependo deles ou resido junto</button>
        </div>
        <div class="wizard-feedback" style="display: none; margin-top: 12px;"></div>
      </div>

      <!-- Passo 4: Moradia -->
      <div class="wizard-step" id="step-moradia" style="display: none; margin-top: 24px;">
        <p class="wizard-question">4. Qual é a sua situação de moradia na cidade onde estuda?</p>
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

      <!-- Passo 5: Fontes de Renda -->
      <div class="wizard-step" id="step-fontes-renda" style="display: none; margin-top: 24px;">
        <p class="wizard-question">5. Quais são as fontes de renda existentes no seu grupo familiar? (Selecione todas que se aplicam)</p>
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
        <button id="wizard-btn-renda-next" class="wizard-btn-calc" style="margin-top: 16px; width: 100%;">Avançar</button>
        <div class="wizard-feedback" style="display: none; margin-top: 12px;"></div>
      </div>

      <!-- Passo 6: Renda Per Capita -->
      <div class="wizard-step" id="step-renda" style="display: none; margin-top: 24px;">
        <p class="wizard-question">6. Simulador de Renda Familiar Per Capita</p>
        <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 12px;">Informe a quantidade total de pessoas do seu grupo familiar (incluindo você) e o somatório das rendas brutas mensais.</p>
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
        <button id="wizard-btn-calcular" class="wizard-btn-calc" style="margin-top: 16px; width: 100%;">Calcular Renda Per Capita</button>
        <div class="wizard-feedback" style="display: none; margin-top: 16px;"></div>
      </div>

      <!-- Passo 7: Imposto de Renda -->
      <div class="wizard-step" id="step-irpf" style="display: none; margin-top: 24px;">
        <p class="wizard-question">7. Qual a situação do Imposto de Renda (IRPF) dos membros maiores de 18 anos?</p>
        <div class="wizard-options-vertical">
          <button class="wizard-opt-btn text-left" data-value="todos_declararam">Todos os membros maiores de 18 anos declararam IRPF</button>
          <button class="wizard-opt-btn text-left" data-value="isentos_mir">Existem membros isentos e todos conseguem emitir o comprovante pelo Portal MIR (gov.br Prata/Ouro)</button>
          <button class="wizard-opt-btn text-left" data-value="isentos_sem_mir">Existem membros isentos, mas algum NÃO consegue emitir no Portal MIR (conta Bronze ou sem acesso)</button>
        </div>
        <div class="wizard-feedback" style="display: none; margin-top: 12px;"></div>
      </div>

      <!-- Passo 8: Situações Especiais -->
      <div class="wizard-step" id="step-especiais" style="display: none; margin-top: 24px;">
        <p class="wizard-question">8. Algum membro do seu grupo familiar se enquadra em alguma dessas situações adicionais? (Selecione se aplicável)</p>
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
        <button id="wizard-btn-especiais-next" class="wizard-btn-calc" style="margin-top: 16px; width: 100%;">Gerar Roteiro Personalizado</button>
        <div class="wizard-feedback" style="display: none; margin-top: 12px;"></div>
      </div>

      <!-- Passo 9: Resultado / Checklist Personalizado -->
      <div class="wizard-step" id="step-resultado" style="display: none; margin-top: 24px;">
        <div class="wizard-result-box">
          <h3 style="color: var(--text-title); margin-bottom: 12px; font-weight: 700; border-bottom: 2px solid var(--primary); padding-bottom: 8px;">Caminho de Inscrição Recomendado</h3>
          <div id="wizard-result-eligibility" style="margin-bottom: 16px;"></div>
          <h4 style="font-size: 0.95rem; font-weight: 700; margin-bottom: 8px;">Lista de Documentos e Declarações Obrigatórias:</h4>
          <ul class="wizard-doc-list" id="wizard-result-docs">
            <!-- Gerado via JS -->
          </ul>
          
          <div style="margin-top: 24px; display: flex; justify-content: center;">
            <button id="wizard-btn-reiniciar" class="wizard-btn-reiniciar">Reiniciar Simulação</button>
          </div>
        </div>
      </div>
    `;
    
    container.appendChild(wizardCard);
    
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
      situacoesEspeciais: []
    };

    function showFeedback(stepEl, type, html) {
      const feedbackEl = stepEl.querySelector('.wizard-feedback');
      feedbackEl.style.display = 'block';
      feedbackEl.className = `wizard-feedback ${type}`;
      feedbackEl.innerHTML = html;
    }

    function revealStep(id) {
      const stepEl = wizardCard.querySelector(`#${id}`);
      if (stepEl.style.display === 'none') {
        stepEl.style.display = 'block';
        stepEl.classList.add('fade-in');
        
        setTimeout(() => {
          stepEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 100);
      }
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
        
        if (val === 'nao') {
          showFeedback(stepEdital, 'warning', `
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 8px; vertical-align: middle;"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
            <strong>Atenção:</strong> É altamente recomendável ler o edital oficial. Você pode consultá-lo na página <a href="#page-28">Edital Oficial</a> do guia.
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
    const btnsVinculo = stepVinculo.querySelectorAll('.wizard-opt-btn:not(.btn-sm)');
    btnsVinculo.forEach(btn => {
      btn.addEventListener('click', () => {
        btnsVinculo.forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        
        const val = btn.getAttribute('data-value');
        wizardState.vinculo = val;
        
        const substepReaproveitamento = stepVinculo.querySelector('#substep-reaproveitamento');
        const substepDesempenho = stepVinculo.querySelector('#substep-desempenho');
        const feedbackVinculo = stepVinculo.querySelector('.wizard-feedback');
        
        if (val === 'veterano') {
          feedbackVinculo.style.display = 'none';
          substepReaproveitamento.style.display = 'block';
          substepDesempenho.style.display = 'none';
          wizardState.reaproveitamento = null;
          wizardState.desempenhoOk = null;
        } else {
          substepReaproveitamento.style.display = 'none';
          substepDesempenho.style.display = 'none';
          wizardState.reaproveitamento = 'nao';
          wizardState.desempenhoOk = true;
          showFeedback(stepVinculo, 'success', `
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 8px; vertical-align: middle;"><polyline points="20 6 9 17 4 12"></polyline></svg>
            Estudantes calouros são avaliados puramente pelos critérios socioeconômicos da nova inscrição.
          `);
          revealStep('step-independencia');
        }
      });
    });

    // Substep 2.1 para Veteranos: Reaproveitamento
    const substepReaproveitamento = stepVinculo.querySelector('#substep-reaproveitamento');
    const btnsReaproveitamento = substepReaproveitamento.querySelectorAll('.wizard-opt-btn');
    btnsReaproveitamento.forEach(btn => {
      btn.addEventListener('click', () => {
        btnsReaproveitamento.forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        
        const val = btn.getAttribute('data-value');
        wizardState.reaproveitamento = val;
        
        const substepDesempenho = stepVinculo.querySelector('#substep-desempenho');
        
        if (val === 'sim') {
          showFeedback(substepReaproveitamento, 'success', `
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 8px; vertical-align: middle;"><polyline points="20 6 9 17 4 12"></polyline></svg>
            <strong>Elegível para Reaproveitamento de Documentos (Item 5.1):</strong> Ótimo! Como veterano com situação idêntica à de 2025, seu processo de envio de documentos é simplificado. Clique no botão abaixo para ver seu roteiro direto.
            <button id="wizard-btn-skip-to-reaproveitamento" class="wizard-btn-calc" style="margin-top: 12px; width: 100%; display: block; cursor: pointer;">Gerar Roteiro de Reaproveitamento</button>
          `);
          
          substepDesempenho.style.display = 'none';
          
          // Ação para pular direto para o resultado
          setTimeout(() => {
            const btnSkip = substepReaproveitamento.querySelector('#wizard-btn-skip-to-reaproveitamento');
            if (btnSkip) {
              btnSkip.addEventListener('click', () => {
                wizardState.desempenhoOk = true;
                wizardState.rendaElegivel = true;
                generateResults();
                revealStep('step-resultado');
              });
            }
          }, 50);
        } else {
          showFeedback(substepReaproveitamento, 'warning', `
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 8px; vertical-align: middle;"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
            Entendido. Como houve alteração ou não participou do último edital, você fará uma inscrição completa. Prossiga para avaliar o desempenho acadêmico.
          `);
          substepDesempenho.style.display = 'block';
          wizardState.desempenhoOk = null;
        }
      });
    });

    // Substep 2.2 para Veteranos: Desempenho
    const substepDesempenho = stepVinculo.querySelector('#substep-desempenho');
    const btnsDesempenho = substepDesempenho.querySelectorAll('.wizard-opt-btn');
    btnsDesempenho.forEach(btn => {
      btn.addEventListener('click', () => {
        btnsDesempenho.forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        
        const val = btn.getAttribute('data-value');
        
        if (val === 'sim') {
          wizardState.desempenhoOk = false;
          showFeedback(substepDesempenho, 'danger', `
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 8px; vertical-align: middle;"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
            <strong>Alerta crítico (Item 5.4):</strong> Veteranos com mais de 33% de reprovações ou cancelamentos em 2025/2 terão o pedido indeferido de início. Será obrigatório anexar uma justificativa oficial/recurso pedagógico nos dias 09 e 10 de março de 2026.
          `);
        } else {
          wizardState.desempenhoOk = true;
          showFeedback(substepDesempenho, 'success', `
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 8px; vertical-align: middle;"><polyline points="20 6 9 17 4 12"></polyline></svg>
            Desempenho acadêmico qualificado (reprovações menores ou iguais a 33%).
          `);
        }
        revealStep('step-independencia');
      });
    });

    // Passo 3: Independência Financeira
    const stepIndependencia = wizardCard.querySelector('#step-independencia');
    const btnsIndependencia = stepIndependencia.querySelectorAll('.wizard-opt-btn');
    btnsIndependencia.forEach(btn => {
      btn.addEventListener('click', () => {
        btnsIndependencia.forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        
        const val = btn.getAttribute('data-value');
        wizardState.independencia = val;
        
        if (val === 'sim') {
          showFeedback(stepIndependencia, 'warning', `
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 8px; vertical-align: middle;"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
            <strong>Atenção:</strong> Declarar independência financeira exige comprovação de residência e renda próprias que cubram sua subsistência, separada dos pais. Você precisará preencher a <strong>Declaração 4 (Independência Financeira)</strong> assinada pelos seus pais confirmando que não te dão apoio financeiro, e indicar duas referências de testemunhas.
          `);
        } else {
          showFeedback(stepIndependencia, 'success', `
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 8px; vertical-align: middle;"><polyline points="20 6 9 17 4 12"></polyline></svg>
            Entendido. Sua análise socioeconômica considerará o grupo familiar de origem.
          `);
        }
        
        revealStep('step-moradia');
      });
    });

    // Passo 4: Moradia
    const stepMoradia = wizardCard.querySelector('#step-moradia');
    const btnsMoradia = stepMoradia.querySelectorAll('.wizard-opt-btn');
    btnsMoradia.forEach(btn => {
      btn.addEventListener('click', () => {
        btnsMoradia.forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        
        const val = btn.getAttribute('data-value');
        wizardState.moradia = val;
        
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
        revealStep('step-fontes-renda');
      });
    });

    // Passo 5: Fontes de Renda
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
      
      showFeedback(stepFontesRenda, 'success', `
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 8px; vertical-align: middle;"><polyline points="20 6 9 17 4 12"></polyline></svg>
        Fontes de renda mapeadas. Prossiga para a simulação de valores per capita.
      `);
      
      revealStep('step-renda');
    });

    // Passo 6: Renda Per Capita
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
      
      const SALARIO_MINIMO = 1518; // Mínimo 2026
      const LIMITE_RENDA = 1.5 * SALARIO_MINIMO;
      
      let html = '';
      if (perCapita <= LIMITE_RENDA) {
        wizardState.rendaElegivel = true;
        html = `
          <div class="feedback-inner-success" style="padding: 4px 0;">
            <strong>Cálculo Concluído:</strong> Renda familiar per capita estimada em <strong>R$ ${perCapita.toFixed(2)}</strong> (equivalente a ${(perCapita / SALARIO_MINIMO).toFixed(2)} salários mínimos por pessoa).
            <p style="margin-top: 6px;">Você está <strong>dentro do limite regulamentar</strong> do edital (teto de R$ ${LIMITE_RENDA.toFixed(2)} per capita, correspondente a 1.5 salários mínimos - Item 3.2).</p>
          </div>
        `;
        showFeedback(stepRenda, 'success', html);
      } else {
        wizardState.rendaElegivel = false;
        html = `
          <div class="feedback-inner-danger" style="padding: 4px 0;">
            <strong>Alerta de Limite Excedido:</strong> Renda familiar per capita estimada em <strong>R$ ${perCapita.toFixed(2)}</strong>.
            <p style="margin-top: 6px;">Sua renda per capita estimada excede o teto de R$ ${LIMITE_RENDA.toFixed(2)} previsto no edital (Item 3.2). Inscrições acima da renda regulamentar estão sujeitas a indeferimento pela equipe de análise.</p>
          </div>
        `;
        showFeedback(stepRenda, 'danger', html);
      }
      
      revealStep('step-irpf');
    });

    // Passo 7: Imposto de Renda
    const stepIrpf = wizardCard.querySelector('#step-irpf');
    const btnsIrpf = stepIrpf.querySelectorAll('.wizard-opt-btn');
    btnsIrpf.forEach(btn => {
      btn.addEventListener('click', () => {
        btnsIrpf.forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        
        const val = btn.getAttribute('data-value');
        wizardState.irpf = val;
        
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
        
        revealStep('step-especiais');
      });
    });

    // Passo 8: Situações Especiais
    const stepEspeciais = wizardCard.querySelector('#step-especiais');
    const btnEspeciaisNext = stepEspeciais.querySelector('#wizard-btn-especiais-next');
    btnEspeciaisNext.addEventListener('click', () => {
      const selectedEspeciais = [];
      const checkboxes = stepEspeciais.querySelectorAll('input[name="situacao-especial"]:checked');
      checkboxes.forEach(cb => {
        selectedEspeciais.push(cb.value);
      });
      
      wizardState.situacoesEspeciais = selectedEspeciais;
      
      showFeedback(stepEspeciais, 'success', `
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 8px; vertical-align: middle;"><polyline points="20 6 9 17 4 12"></polyline></svg>
        Simulação e mapeamento finalizados! Confira seu roteiro completo de documentos e declarações abaixo.
      `);
      
      generateResults();
      revealStep('step-resultado');
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
          <p style="margin-top: 8px; font-size: 0.9rem; font-weight: 550; color: var(--text-main);">Você atende aos critérios do Item 5.1 do Edital 01/2026 PROGRAD/ASSAE. Seu cadastro socioeconômico de 2025 será reaproveitado.</p>
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
              Risco Alto de Indeferimento
            </div>
            <p style="margin-top: 8px; font-size: 0.9rem; font-weight: 550; color: var(--text-main);">Sua simulação aponta restrições importantes que descumprem itens obrigatórios do edital:</p>
            <ul style="margin-left: 18px; margin-top: 4px; font-size: 0.85rem; line-height: 1.4; color: var(--danger);">
              ${wizardState.desempenhoOk === false ? '<li style="font-weight: 600;">Desempenho acadêmico inferior ao exigido no semestre anterior (reprovações > 33% em 2025/2). Será obrigatório apresentar Recurso Pedagógico oficial nos dias 09 e 10/03/2026.</li>' : ''}
              ${wizardState.rendaElegivel === false ? `<li style="font-weight: 600;">Renda familiar per capita de R$ ${wizardState.perCapita.toFixed(2)} excede o limite regulamentar de R$ 2.277,00 (1.5 salários mínimos - Item 3.2).</li>` : ''}
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
            docsList.push('<b>Declaração VII - Não Obrigatoriedade de IRPF (<a href="#page-27">Baixar Modelo 7</a>):</b> Obrigatória para cada membro maior de 18 anos isento que não possui acesso ao gov.br Prata/Ouro para emitir o MIR. <b>Preenchimento:</b> Marque os anos de 2024 e/ou 2025 e o membro deve assinar.');
          }
        }
        
        // 5. Independência Financeira
        if (wizardState.independencia === 'sim') {
          docsList.push('<b>Declaração IV - Independência Financeira (<a href="#page-27">Baixar Modelo 4</a>):</b> Deve ser preenchida e assinada por seus <b>pais ou responsável legal</b>, atestando expressamente que não contribuem financeira ou materialmente com o estudante. Deve conter as assinaturas e telefones de duas testemunhas externas (não familiares).');
          docsList.push('<b>Comprovantes de Independência:</b> Comprovante de endereço próprio diferente do dos pais, além de comprovante de renda própria suficiente para prover a subsistência.');
        }
        
        // 6. Comprovante de Situação de Moradia e Declaração 2 / 6
        if (wizardState.moradia === 'familia_alugada') {
          docsList.push('<b>Comprovante de Despesa de Moradia:</b> Cópia do contrato de locação em nome de algum membro do grupo familiar e recibo de pagamento do aluguel/financiamento recente.');
        } else if (wizardState.moradia === 'estudante_aluguel_contrato') {
          docsList.push('<b>Comprovantes para Auxílio Moradia:</b> Cópia do Contrato de Locação em seu nome e recibo de pagamento do aluguel recente na cidade do campus.');
          docsList.push('<b>Declaração II - Situação de Moradia do Estudante (<a href="#page-27">Baixar Modelo 2</a>):</b> Preenchida por você. <b>Preenchimento:</b> Marque a <b>Opção 1</b> (Resido sozinho e pago R$ ... de aluguel). Assine o documento.');
        } else if (wizardState.moradia === 'estudante_aluguel_sem_contrato') {
          docsList.push('<b>Declaração II - Situação de Moradia do Estudante (<a href="#page-27">Baixar Modelo 2</a>):</b> Preenchida por você. <b>Preenchimento:</b> Marque a <b>Opção 1</b> (Resido sozinho e pago R$ ... de aluguel). Assine.');
          docsList.push('<b>Declaração VI - Comprovação de Pagamento de Aluguel (<a href="#page-27">Baixar Modelo 6</a>):</b> Deve ser preenchida e assinada pelo **proprietário/locador** do imóvel, atestando a locação informal e o valor pago. Requer assinatura de duas testemunhas de referência com dados completos (não familiares). <b>Preenchimento:</b> Marque a **Opção 1** (Sou proprietário do imóvel e Alugo residência sem contrato).');
          docsList.push('<b>Comprovante de Pagamento:</b> Recibo recente de pagamento do aluguel ou comprovante de transferência bancária ao proprietário.');
        } else if (wizardState.moradia === 'estudante_pensionato') {
          docsList.push('<b>Declaração II - Situação de Moradia do Estudante (<a href="#page-27">Baixar Modelo 2</a>):</b> Preenchida por você. <b>Preenchimento:</b> Marque a <b>Opção 3</b> (Resido em pensionato e pago R$ ...). Assine.');
          docsList.push('<b>Declaração VI - Comprovação de Pagamento de Aluguel (<a href="#page-27">Baixar Modelo 6</a>):</b> Preenchida e assinada pelo **proprietário do pensionato**. <b>Preenchimento:</b> Marque a **Opção 2** (Alugo vaga em regime de pensionato). Deve ser assinado pelo dono do pensionato e conter duas testemunhas.');
          docsList.push('<b>Comprovante de Pensionato:</b> Recibo de pagamento mensal recente.');
        } else if (wizardState.moradia === 'estudante_compartilhada') {
          docsList.push('<b>Declaração II - Situação de Moradia do Estudante (<a href="#page-27">Baixar Modelo 2</a>):</b> Preenchida por você. <b>Preenchimento:</b> Marque a <b>Opção 4</b> (Resido em moradia compartilhada/república, pagando R$ ... de aluguel). Liste os nomes, CPF e telefones dos seus colegas de república.');
          docsList.push('<b>Contrato de Locação e Comprovantes:</b> Contrato de aluguel da república e recibo de pagamento do último mês, acompanhados de comprovantes de rateio se houver.');
          docsList.push('<b>Declaração VI - Comprovação de Aluguel (<a href="#page-27">Baixar Modelo 6</a>):</b> Caso a república não possua contrato formal assinado, o proprietário deve preencher e assinar a Declaração VI (Opção 1).');
        } else if (wizardState.moradia === 'estudante_cedido') {
          docsList.push('<b>Declaração II - Situação de Moradia do Estudante (<a href="#page-27">Baixar Modelo 2</a>):</b> Preenchida por você. <b>Preenchimento:</b> Marque a <b>Opção 2</b> (Resido sozinho e não pago aluguel - cedido gratuitamente) ou a opção de residência com familiares correspondente. Requer preenchimento de duas testemunhas de referência com dados completos (não familiares).');
        } else if (wizardState.moradia === 'estudante_alojamento') {
          docsList.push('<b>Declaração II - Situação de Moradia do Estudante (<a href="#page-27">Baixar Modelo 2</a>):</b> Preenchida por você. <b>Preenchimento:</b> Marque a <b>Opção 2</b> e informe no texto a residência gratuita em alojamento estudantil oferecido pela UTFPR.');
        } else if (wizardState.moradia === 'estudante_casado_aluguel') {
          docsList.push('<b>Declaração II - Situação de Moradia do Estudante (<a href="#page-27">Baixar Modelo 2</a>):</b> Preenchida por você. <b>Preenchimento:</b> Marque a <b>Opção 5</b> (Resido com cônjuge/filhos e pago R$ ...). Informe nome e CPF dos familiares.');
          docsList.push('<b>Contrato de Locação e Recibos:</b> Contrato de aluguel e recibo recente em nome do estudante ou cônjuge.');
        } else if (wizardState.moradia === 'estudante_casado_proprio') {
          docsList.push('<b>Declaração II - Situação de Moradia do Estudante (<a href="#page-27">Baixar Modelo 2</a>):</b> Preenchida por você. <b>Preenchimento:</b> Marque a <b>Opção 6</b> (Resido com cônjuge/filhos e não pago aluguel).');
        }
        
        // 7. Fontes de Renda específicas e suas respectivas declarações
        if (wizardState.fontesRenda.includes('clt')) {
          docsList.push('<b>Comprovantes de Rendimento de Trabalho Formal (CLT):</b> Cópias dos 3 últimos holerites (ou contracheques) mensais de cada membro que possui vínculo CLT ou é servidor público. Em caso de renda variável, anexe também extratos correspondentes.');
        }
        
        if (wizardState.fontesRenda.includes('autonomo')) {
          docsList.push('<b>Declaração I - Declaração de Renda (<a href="#page-27">Baixar Modelo 1</a>):</b> Obrigatória para o membro familiar autônomo, profissional liberal ou trabalhador informal. <b>Preenchimento:</b> Marque a <b>Opção 2</b> (Exerço atividade de forma autônoma ou informal ou profissional liberal como...), preencha a atividade exercida, a média de rendimentos dos últimos 3 meses e informe nome e telefone de dois clientes atendidos.');
        }
        
        if (wizardState.fontesRenda.includes('estagio')) {
          docsList.push('<b>Declaração I - Declaração de Renda (<a href="#page-27">Baixar Modelo 1</a>):</b> Para o estudante ou membro estagiário/bolsista. <b>Preenchimento:</b> Marque a <b>Opção 3</b> (Recebo na condição de bolsista/estagiário do projeto/órgão...), informe a data de início e o valor de bolsa mensal. Anexe cópia do Termo de Compromisso de Estágio.');
        }
        
        if (wizardState.fontesRenda.includes('mei')) {
          docsList.push('<b>Declaração I - Declaração de Renda (<a href="#page-27">Baixar Modelo 1</a>):</b> Obrigatória para os membros MEI da família. <b>Preenchimento:</b> Marque a <b>Opção 4</b> (Microempreendedor Individual), preencha o CNPJ, atividade e valor mensal médio. Anexe a Certidão de Condição de Microempreendedor Individual (CCMEI) e Declaração Anual do Simples Nacional (DASN-SIMEI) do último exercício.');
        }
        
        if (wizardState.fontesRenda.includes('desempregado')) {
          docsList.push('<b>Declaração I - Declaração de Renda (<a href="#page-27">Baixar Modelo 1</a>):</b> Obrigatória para <b>cada membro maior de 18 anos</b> que se declare desempregado, estudante sem renda ou do lar. <b>Preenchimento:</b> Marque a <b>Opção 1</b> (Não exerço nenhuma atividade remunerada, formal ou informal) para atestar a ausência de renda.');
        }
        
        if (wizardState.fontesRenda.includes('rural')) {
          docsList.push('<b>Declaração III - Renda de Atividade Rural (<a href="#page-27">Baixar Modelo 3</a>):</b> Obrigatória para produtores rurais ou trabalhadores da agricultura. Deve ser emitida e preenchida/assinada por sindicato de produtores, sindicato de trabalhadores rurais ou Secretaria Municipal/Estadual de Agricultura. <b>Preenchimento:</b> Identifique a localização, área total da propriedade, condição de exploração (proprietário, arrendatário, etc.) e preencha o quadro de comercialização, receitas brutas e custos dos últimos 12 meses.');
          docsList.push('<b>Comprovantes Rurais Adicionais:</b> Bloco de Notas de Produtor Rural (notas emitidas nos últimos 12 meses) e extrato DAP (Declaração de Aptidão ao Pronaf) ou CAF.');
        }
        
        if (wizardState.fontesRenda.includes('aposentado')) {
          docsList.push('<b>Extrato de Pagamento de Benefício do INSS:</b> Extrato oficial emitido pelo Meu INSS do último mês, contendo o valor bruto do benefício (aposentadoria, pensão por morte ou BPC/LOAS). Não serve o cartão do banco.');
        }
        
        if (wizardState.fontesRenda.includes('pensao_judicial')) {
          docsList.push('<b>Comprovantes de Pensão Alimentícia Formal:</b> Cópia da sentença homologatória do divórcio (ou acordo em cartório) fixando o valor da pensão, acompanhada de extrato bancário recente demonstrando o recebimento.');
        }
        
        if (wizardState.fontesRenda.includes('pensao_verbal')) {
          docsList.push('<b>Declaração I - Declaração de Renda (<a href="#page-27">Baixar Modelo 1</a>):</b> Preenchida pelo responsável ou estudante que recebe. <b>Preenchimento:</b> Marque a <b>Opção 5</b> (Recebo pensão alimentícia de... no valor de R$ ... mensal).');
          docsList.push('<b>Declaração VIII - Renda de Terceiros (<a href="#page-27">Baixar Modelo 8</a>):</b>');
          docsList.push('&bull; Se o estudante for maior de 18 anos: o genitor pagador deve assinar e marcar a <b>Opção 4</b> (Contribuo mensalmente com R$ ... de pensão para o estudante).');
          docsList.push('&bull; Se for para menor de 18 anos do grupo: a mãe ou responsável legal residente deve assinar e marcar a <b>Opção 5</b> (Estudante ... recebe pensão alimentícia de ... no valor de R$ ... mensal).');
        }
        
        if (wizardState.fontesRenda.includes('comissao')) {
          docsList.push('<b>Declaração VIII - Renda de Terceiros (<a href="#page-27">Baixar Modelo 8</a>):</b> Obrigatória para quem recebe comissão de vendas. Deve ser preenchida e assinada pelo parceiro/empresa pagadora. <b>Preenchimento:</b> Marque a <b>Opção 3</b> (Pago o valor mensal médio de R$ ... por comissão de vendas dos produtos...).');
        }
        
        if (wizardState.fontesRenda.includes('ajuda_terceiros')) {
          docsList.push('<b>Declaração VIII - Renda de Terceiros (<a href="#page-27">Baixar Modelo 8</a>):</b> A ser preenchida e assinada por quem envia a ajuda financeira de fora do grupo familiar. <b>Preenchimento:</b> Marque a <b>Opção 1</b> (Contribuo financeiramente com o estudante ... com o valor de R$ ... mensais).');
        }
        
        if (wizardState.fontesRenda.includes('programa_social')) {
          docsList.push('<b>Declaração I - Declaração de Renda (<a href="#page-27">Baixar Modelo 1</a>):</b> Preenchida pelo beneficiário do domicílio. <b>Preenchimento:</b> Marque a <b>Opção 6</b> (Recebo do programa social ... o valor de R$ ... mensal).');
          docsList.push('<b>Extrato de Pagamento do Programa:</b> Extrato recente do recebimento do benefício (ex: Bolsa Família), com nome do titular e valor histórico das parcelas.');
        }
        
        // 8. Situações Especiais e Casos de Exceção
        if (wizardState.situacoesEspeciais.includes('separacao_verbal')) {
          docsList.push('<b>Declaração V - Diversas Situações (<a href="#page-27">Baixar Modelo 5</a>):</b> Preenchida pelo genitor com quem você reside ou por você, descrevendo detalhadamente a separação de fato informal e o acordo de boca estabelecido. Exige assinatura de duas testemunhas de referência com dados completos.');
          docsList.push('<b>Declaração VIII - Renda de Terceiros (<a href="#page-27">Baixar Modelo 8</a>):</b> Se houver pensão informal decorrente dessa separação, junte a Declaração VIII (Opção 4 ou 5) preenchida conforme o caso.');
        }
        
        if (wizardState.situacoesEspeciais.includes('doenca_grave')) {
          docsList.push('<b>Laudo Médico e Comprovantes de Despesas Médicas:</b> Laudo médico circunstanciado recente atestando a enfermidade grave crônica do membro familiar e cópias de receitas e notas fiscais de compras de medicamentos de uso contínuo dos últimos meses. Isso é avaliado como dedução de renda na análise socioeconômica.');
        }
        
        if (wizardState.situacoesEspeciais.includes('filhos_guarda')) {
          docsList.push('<b>Pleito de Auxílio Infância:</b> Certidão de nascimento dos filhos sob sua guarda direta e termo de guarda unilateral (se houver). Isso habilita a concessão do benefício Auxílio Infância.');
        }
        
        if (wizardState.situacoesEspeciais.includes('aluguel_terceiros')) {
          docsList.push('<b>Declaração VIII - Renda de Terceiros (<a href="#page-27">Baixar Modelo 8</a>):</b> Preenchida e assinada por quem paga o seu aluguel de forma direta. <b>Preenchimento:</b> Marque a <b>Opção 2</b> (Pago o valor de R$ ... mensais a título de aluguel do imóvel localizado em...).');
        }
        
        if (wizardState.situacoesEspeciais.includes('outros_casos')) {
          docsList.push('<b>Declaração V - Diversas Situações (<a href="#page-27">Baixar Modelo 5</a>):</b> Preenchida por você ou membro familiar justificando a realidade excepcional não prevista (ex: abandono, perda de contato, etc.). Deve conter duas referências.');
        }
        
        if (wizardState.desempenhoOk === false) {
          docsList.push('<span style="color: var(--danger); font-weight: 600;">Formulário de Recurso Pedagógico:</span> Relatório/recurso pedagógico circunstanciado justificando o motivo do baixo desempenho e reprovações superiores a 33% em 2025/2, a ser preenchido e anexado na plataforma de inscrição nos dias de interposição do cronograma.');
        }
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
       btnReiniciar.addEventListener('click', () => {
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
           situacoesEspeciais: []
         };
         
         wizardCard.querySelectorAll('.wizard-opt-btn').forEach(btn => btn.classList.remove('selected'));
         wizardCard.querySelectorAll('.wizard-feedback').forEach(fb => {
           fb.style.display = 'none';
           fb.innerHTML = '';
         });
         
         wizardCard.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
         
         inputMembros.value = 1;
         inputRenda.value = 0;
         
         wizardCard.querySelector('#substep-reaproveitamento').style.display = 'none';
         wizardCard.querySelector('#substep-desempenho').style.display = 'none';
         wizardCard.querySelector('#step-vinculo').style.display = 'none';
         wizardCard.querySelector('#step-independencia').style.display = 'none';
         wizardCard.querySelector('#step-moradia').style.display = 'none';
         wizardCard.querySelector('#step-fontes-renda').style.display = 'none';
         wizardCard.querySelector('#step-renda').style.display = 'none';
         wizardCard.querySelector('#step-irpf').style.display = 'none';
         wizardCard.querySelector('#step-especiais').style.display = 'none';
         wizardCard.querySelector('#step-resultado').style.display = 'none';
         
         wizardCard.querySelector('#step-edital').scrollIntoView({ behavior: 'smooth' });
       });
    }
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
