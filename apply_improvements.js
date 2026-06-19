const fs = require('fs');

const filePath = 'C:/Users/UTFPR - FB/Downloads/ebook/Guia_Pratico_Auxilio_Estudantil_UTFPR_EDITADO.html';
let content = fs.readFileSync(filePath, 'utf8');

// 1. Add CSS style rules for locked elements
const oldShapeCSS = `.element.selected {
  border-color: var(--primary);
  box-shadow: 0 0 0 2px rgba(255, 204, 0, 0.35), 0 8px 28px rgba(0, 0, 0, 0.18);
  cursor: move;
}`;

const newShapeCSS = `.element.selected {
  border-color: var(--primary);
  box-shadow: 0 0 0 2px rgba(255, 204, 0, 0.35), 0 8px 28px rgba(0, 0, 0, 0.18);
  cursor: move;
}

/* Estilos de seleção para elementos bloqueados */
.element.selected.locked {
  border-color: #6b7280 !important;
  box-shadow: 0 0 0 2px rgba(107, 114, 128, 0.35) !important;
  cursor: not-allowed;
}

.element.selected.locked .resizeHandle,
.element.selected.locked .rotateHandle {
  display: none !important; /* Esconde as alças se estiver bloqueado */
}`;

if (content.includes(oldShapeCSS)) {
    content = content.replace(oldShapeCSS, newShapeCSS);
} else {
    console.error("Could not find oldShapeCSS in stylesheet.");
    return;
}

// 2. Add page management toolbar in left sidebar HTML
const oldPagesLabel = `<div class="label">Páginas do guia</div>`;
const newPagesLabel = `<div class="label">Páginas do guia</div>
    <div class="toolbarLine" style="margin-bottom: 10px;">
      <button class="btn dark small" onclick="duplicateCurrentPage()">Duplicar Pág.</button>
      <button class="btn red small" style="margin: 0;" onclick="deleteCurrentPage()">Excluir Pág.</button>
    </div>`;

if (content.includes(oldPagesLabel)) {
    content = content.replace(oldPagesLabel, newPagesLabel);
} else {
    console.error("Could not find oldPagesLabel in HTML.");
    return;
}

// 3. Update right sidebar "Elemento selecionado" panel HTML
const oldSelectedPanel = `<div class="panel"><h3>Elemento selecionado</h3><div id="selectedInfo" class="tip">Nenhum elemento selecionado.</div><div class="toolbarLine"><button class="btn dark small" onclick="bringForward()">Frente</button><button class="btn dark small" onclick="sendBackward()">Trás</button></div><div class="toolbarLine"><button class="btn dark small" onclick="duplicateSelected()">Duplicar</button><button class="btn red small" onclick="deleteSelected()">Excluir</button></div><button class="btn dark" onclick="resetCurrentPage()">Resetar página atual</button></div>`;

const newSelectedPanel = `<div class="panel">
      <h3>Elemento selecionado</h3>
      <div id="selectedInfo" class="tip">Nenhum elemento selecionado.</div>
      <div class="toolbarLine">
        <button class="btn dark small" onclick="bringForward()">Frente</button>
        <button class="btn dark small" onclick="sendBackward()">Trás</button>
      </div>
      <div class="toolbarLine">
        <button class="btn dark small" onclick="duplicateSelected()">Duplicar</button>
        <button class="btn red small" onclick="deleteSelected()">Excluir</button>
      </div>
      <div class="toolbarLine">
        <button class="btn dark small" id="lockBtn" onclick="toggleLockSelected()">Bloquear</button>
        <button class="btn dark small" onclick="alignSelected('center')">Centralizar</button>
      </div>
      <div class="toolbarLine">
        <button class="btn dark small" onclick="alignSelected('left')">Alinhar Esq.</button>
        <button class="btn dark small" onclick="alignSelected('right')">Alinhar Dir.</button>
      </div>
      <button class="btn dark" onclick="resetCurrentPage()">Resetar página atual</button>
    </div>`;

if (content.includes(oldSelectedPanel)) {
    content = content.replace(oldSelectedPanel, newSelectedPanel);
} else {
    console.error("Could not find oldSelectedPanel in HTML.");
    return;
}

// 4. Update right sidebar "Exportação" panel HTML
const oldExportPanel = `<div class="panel"><h3>Exportação</h3><button class="btn dark" onclick="toggleAll()">Ver todas as páginas</button><button class="btn" onclick="downloadHTML()">Baixar HTML editado</button><button class="btn dark" onclick="printAll()">Imprimir / Salvar PDF</button></div>`;

const newExportPanel = `<div class="panel">
      <h3>Exportação</h3>
      <button class="btn dark" onclick="toggleAll()">Ver todas as páginas / Grade</button>
      <button class="btn" onclick="printAll()">Salvar como PDF</button>
      <button class="btn dark" onclick="downloadHTML()">Salvar projeto editável (HTML)</button>
    </div>`;

if (content.includes(oldExportPanel)) {
    content = content.replace(oldExportPanel, newExportPanel);
} else {
    console.error("Could not find oldExportPanel in HTML.");
    return;
}

// 5. Update Javascript globals to include allPagesDirty
const oldGlobals = `let pages = JSON.parse(JSON.stringify(sourcePages));
// Mantém uma cópia limpa em 'defaultPages' para poder restaurar estados originais
let defaultPages = JSON.parse(JSON.stringify(sourcePages));

// Variáveis de controle de navegação e seleção do editor
let current = 0;          // Índice da página atual em foco
let showingAll = false;   // Se está exibindo a visualização em grade com todas as páginas
let selectedId = null;    // ID do elemento selecionado no momento
let drag = null;          // Objeto que armazena os dados do drag/resize/rotate atual
let zCounter = 30;        // Contador incremental para controlar a ordem de empilhamento (z-index)`;

const newGlobals = `let pages = JSON.parse(JSON.stringify(sourcePages));
// Mantém uma cópia limpa em 'defaultPages' para poder restaurar estados originais
let defaultPages = JSON.parse(JSON.stringify(sourcePages));

// Variáveis de controle de navegação e seleção do editor
let current = 0;          // Índice da página atual em foco
let showingAll = false;   // Se está exibindo a visualização em grade com todas as páginas
let selectedId = null;    // ID do elemento selecionado no momento
let drag = null;          // Objeto que armazena os dados do drag/resize/rotate atual
let zCounter = 30;        // Contador incremental para controlar a ordem de empilhamento (z-index)
let allPagesDirty = true; // Controla se a visualização geral/impressão precisa ser reconstruída`;

if (content.includes(oldGlobals)) {
    content = content.replace(oldGlobals, newGlobals);
} else {
    console.error("Could not find oldGlobals in JS.");
    return;
}

// 6. Update Hist object in JS to set allPagesDirty = true
const oldHist = `const Hist = {
  u: [], // Lista de desfeitas (Undo stack)
  r: [], // Lista de refeitas (Redo stack)
  
  // Salva o estado atual no histórico caso seja diferente do último salvo
  save() {
    const st = JSON.stringify(pages);
    if (this.u[this.u.length - 1] !== st) {
      this.u.push(st);
      if (this.u.length > 60) this.u.shift(); // Limita o histórico a 60 estados
      this.r = []; // Limpa a pilha de refazer
    }
  },
  
  // Desfaz a última ação realizada
  undo() {
    if (!this.u.length) return;
    this.r.push(JSON.stringify(pages));
    pages = JSON.parse(this.u.pop());
    selectedId = null;
    render();
  },
  
  // Refaz a última ação desfeita
  redo() {
    if (!this.r.length) return;
    this.u.push(JSON.stringify(pages));
    pages = JSON.parse(this.r.pop());
    selectedId = null;
    render();
  }
};`;

const newHist = `const Hist = {
  u: [], // Lista de desfeitas (Undo stack)
  r: [], // Lista de refeitas (Redo stack)
  
  // Salva o estado atual no histórico caso seja diferente do último salvo
  save() {
    const st = JSON.stringify(pages);
    if (this.u[this.u.length - 1] !== st) {
      this.u.push(st);
      if (this.u.length > 60) this.u.shift(); // Limita o histórico a 60 estados
      this.r = []; // Limpa a pilha de refazer
      allPagesDirty = true; // Sinaliza que o conteúdo geral mudou
    }
  },
  
  // Desfaz a última ação realizada
  undo() {
    if (!this.u.length) return;
    this.r.push(JSON.stringify(pages));
    pages = JSON.parse(this.u.pop());
    selectedId = null;
    allPagesDirty = true;
    render();
  },
  
  // Refaz a última ação desfeita
  redo() {
    if (!this.r.length) return;
    this.u.push(JSON.stringify(pages));
    pages = JSON.parse(this.r.pop());
    selectedId = null;
    allPagesDirty = true;
    render();
  }
};`;

if (content.includes(oldHist)) {
    content = content.replace(oldHist, newHist);
} else {
    console.error("Could not find oldHist in JS.");
    return;
}

// 7. Update elHTML to support locked class
const oldElHTMLJS = `function elHTML(e) {
  let inner = e.type === 'image' ? '<img src="' + (e.src || '') + '" alt="">' : (e.content || '');
  return '<div class="element ' + (e.cls || e.type) + ' ' + (selectedId === e.id ? 'selected' : '') + '" data-id="' + e.id + '" style="' + styleStr(e) + '" tabindex="0">' +`;

const newElHTMLJS = `function elHTML(e) {
  let inner = e.type === 'image' ? '<img src="' + (e.src || '') + '" alt="">' : (e.content || '');
  const isLocked = !!e.locked;
  return '<div class="element ' + (e.cls || e.type) + ' ' + (selectedId === e.id ? 'selected' : '') + ' ' + (isLocked ? 'locked' : '') + '" data-id="' + e.id + '" style="' + styleStr(e) + '" tabindex="0">' +`;

if (content.includes(oldElHTMLJS)) {
    content = content.replace(oldElHTMLJS, newElHTMLJS);
} else {
    console.error("Could not find oldElHTMLJS in JS.");
    return;
}

// 8. Update startPointer in JS to prevent dragging locked elements
const oldStartPointer = `function startPointer(ev) {
  if (ev.button !== 0) return;
  const node = ev.currentTarget;
  const id = node.dataset.id;
  select(id);
  
  const e = findEl(id);
  const rect = $('#page').getBoundingClientRect();
  const isResize = ev.target.classList.contains('resizeHandle');
  const isRotate = ev.target.classList.contains('rotateHandle');`;

const newStartPointer = `function startPointer(ev) {
  if (ev.button !== 0) return;
  const node = ev.currentTarget;
  const id = node.dataset.id;
  select(id);
  
  const e = findEl(id);
  if (e && e.locked) {
    // Objeto bloqueado não inicia arraste ou redimensionamento
    return;
  }
  const rect = $('#page').getBoundingClientRect();
  const isResize = ev.target.classList.contains('resizeHandle');
  const isRotate = ev.target.classList.contains('rotateHandle');`;

if (content.includes(oldStartPointer)) {
    content = content.replace(oldStartPointer, newStartPointer);
} else {
    console.error("Could not find oldStartPointer in JS.");
    return;
}

// 9. Update mousemove to throttle renderSoft with requestAnimationFrame
const oldMouseMove = `// Escuta os movimentos de mouse na tela para aplicar transformações ao elemento arrastado
document.addEventListener('mousemove', ev => {
  if (!drag) return;
  const e = findEl(drag.id);
  if (!e) return;
  
  const dx = ev.clientX - drag.start.mx;
  const dy = ev.clientY - drag.start.my;
  
  if (drag.type === 'move') {
    let nx = drag.start.x + dx;
    let ny = drag.start.y + dy;
    // Se a tecla Shift não estiver pressionada, o movimento encaixa a cada 10 pixels
    if (!ev.shiftKey) {
      nx = Math.round(nx / 10) * 10;
      ny = Math.round(ny / 10) * 10;
    }
    e.x = clamp(nx, -80, 620);
    e.y = clamp(ny, -80, 840);
  }
  
  if (drag.type === 'resize') {
    e.w = clamp(drag.start.w + dx, 20, 650);
    e.h = clamp(drag.start.h + dy, 20, 850);
  }
  
  if (drag.type === 'rotate') {
    const px = ev.clientX - drag.rect.left;
    const py = ev.clientY - drag.rect.top;
    e.rotate = Math.round(Math.atan2(py - drag.cy, px - drag.cx) * 180 / Math.PI + 90);
  }
  
  renderSoft();
});`;

const newMouseMove = `let renderPending = false;
// Escuta os movimentos de mouse na tela para aplicar transformações ao elemento arrastado
document.addEventListener('mousemove', ev => {
  if (!drag) return;
  const e = findEl(drag.id);
  if (!e) return;
  
  const dx = ev.clientX - drag.start.mx;
  const dy = ev.clientY - drag.start.my;
  
  if (drag.type === 'move') {
    let nx = drag.start.x + dx;
    let ny = drag.start.y + dy;
    // Se a tecla Shift não estiver pressionada, o movimento encaixa a cada 10 pixels
    if (!ev.shiftKey) {
      nx = Math.round(nx / 10) * 10;
      ny = Math.round(ny / 10) * 10;
    }
    e.x = clamp(nx, -80, 620);
    e.y = clamp(ny, -80, 840);
  }
  
  if (drag.type === 'resize') {
    e.w = clamp(drag.start.w + dx, 20, 650);
    e.h = clamp(drag.start.h + dy, 20, 850);
  }
  
  if (drag.type === 'rotate') {
    const px = ev.clientX - drag.rect.left;
    const py = ev.clientY - drag.rect.top;
    e.rotate = Math.round(Math.atan2(py - drag.cy, px - drag.cx) * 180 / Math.PI + 90);
  }
  
  // Throttle renderSoft using requestAnimationFrame for optimal performance
  if (!renderPending) {
    renderPending = true;
    requestAnimationFrame(() => {
      renderSoft();
      renderPending = false;
    });
  }
});`;

if (content.includes(oldMouseMove)) {
    content = content.replace(oldMouseMove, newMouseMove);
} else {
    console.error("Could not find oldMouseMove in JS.");
    return;
}

// 10. Update keydown listener to save history before keyboard move
const oldKeyDown = `  const e = findEl(selectedId);
  if (!e) return;
  
  let step = ev.shiftKey ? 10 : 1;
  if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(ev.key)) {
    ev.preventDefault();
    if (ev.key === 'ArrowUp') e.y -= step;
    if (ev.key === 'ArrowDown') e.y += step;
    if (ev.key === 'ArrowLeft') e.x -= step;
    if (ev.key === 'ArrowRight') e.x += step;
    render();
  }`;

const newKeyDown = `  const e = findEl(selectedId);
  if (!e) return;
  
  let step = ev.shiftKey ? 10 : 1;
  if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(ev.key)) {
    ev.preventDefault();
    Hist.save(); // Salva estado no histórico para possibilitar Undo
    if (ev.key === 'ArrowUp') e.y -= step;
    if (ev.key === 'ArrowDown') e.y += step;
    if (ev.key === 'ArrowLeft') e.x -= step;
    if (ev.key === 'ArrowRight') e.x += step;
    render();
  }`;

if (content.includes(oldKeyDown)) {
    content = content.replace(oldKeyDown, newKeyDown);
} else {
    console.error("Could not find oldKeyDown in JS.");
    return;
}

// 11. Update updatePanel JS function to update lockBtn text
const oldUpdatePanelJS = `  $('#elColor').value = colorToHex((e.style || {}).color) || '#253142';
  $('#elBg').value = colorToHex((e.style || {}).backgroundColor) || '#ffffff';
  $('#elBorder').value = colorToHex((e.style || {}).borderColor) || '#e5e7eb';
  
  $('#elVerticalAlign').value = (e.style || {}).justifyContent || 'flex-start';
}`;

const newUpdatePanelJS = `  $('#elColor').value = colorToHex((e.style || {}).color) || '#253142';
  $('#elBg').value = colorToHex((e.style || {}).backgroundColor) || '#ffffff';
  $('#elBorder').value = colorToHex((e.style || {}).borderColor) || '#e5e7eb';
  
  $('#elVerticalAlign').value = (e.style || {}).justifyContent || 'flex-start';
  
  // Atualiza texto do botão de Bloquear/Desbloquear
  $('#lockBtn').textContent = e.locked ? 'Desbloquear' : 'Bloquear';
}`;

if (content.includes(oldUpdatePanelJS)) {
    content = content.replace(oldUpdatePanelJS, newUpdatePanelJS);
} else {
    console.error("Could not find oldUpdatePanelJS in JS.");
    return;
}

// 12. Update renderAll JS to check allPagesDirty
const oldRenderAll = `function renderAll() {
  const box = $('#allPages');
  box.innerHTML = '';
  pages.forEach((p, i) => {
    const wrapper = document.createElement('div');
    wrapper.className = 'printPageWrapper';
    
    const s = document.createElement('div');
    s.className = 'sheet ' + (p.dark ? 'dark' : '');
    renderSheet(s, p, i);
    
    wrapper.appendChild(s);
    box.appendChild(wrapper);
  });
}`;

const newRenderAll = `function renderAll() {
  if (!allPagesDirty) return; // Evita reconstrução custosa desnecessária
  const box = $('#allPages');
  box.innerHTML = '';
  pages.forEach((p, i) => {
    const wrapper = document.createElement('div');
    wrapper.className = 'printPageWrapper';
    
    const s = document.createElement('div');
    s.className = 'sheet ' + (p.dark ? 'dark' : '');
    renderSheet(s, p, i);
    
    wrapper.appendChild(s);
    box.appendChild(wrapper);
  });
  allPagesDirty = false;
}`;

if (content.includes(oldRenderAll)) {
    content = content.replace(oldRenderAll, newRenderAll);
} else {
    console.error("Could not find oldRenderAll in JS.");
    return;
}

// 13. Update printAll JS function
const oldPrintAll = `// Aciona a renderização total e abre a janela de impressão nativa
function printAll() {
  showingAll = true;
  renderAll();
  $('#allPages').style.display = 'grid';
  $('.canvasWrap').style.display = 'none';
  // Pequeno intervalo para dar tempo do navegador calcular os estilos e abrir a impressão
  setTimeout(() => window.print(), 200);
}`;

const newPrintAll = `// Aciona a renderização total e abre a janela de impressão nativa
function printAll() {
  window.print(); // O fluxo principal e restauração de visualizações são tratados por onbeforeprint / onafterprint
}`;

if (content.includes(oldPrintAll)) {
    content = content.replace(oldPrintAll, newPrintAll);
} else {
    console.error("Could not find oldPrintAll in JS.");
    return;
}

// 14. Update downloadHTML JS function to sanitize DOM before saving
const oldDownloadHTML = `// Reconstrói a string do código do arquivo HTML completo incorporando o 'pages' editado e dispara o download
function downloadHTML() {
  const html = '<!DOCTYPE html>\\n' +
    document.documentElement.outerHTML
      .replace(/let sourcePages = [\\s\\S]*?;\\r?\\nlet pages = JSON\\.parse/, 'let sourcePages = ' + JSON.stringify(pages, null, 2) + ';\\nlet pages = JSON.parse')
      .replace('<title>Guia Prático do Auxílio Estudantil UTFPR — Editor Livre V9 Global</title>', '<title>Guia Prático do Auxílio Estudantil UTFPR — EDITADO</title>');
      
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'Guia_Pratico_Auxilio_Estudantil_UTFPR_EDITADO.html';
  a.click();
  URL.revokeObjectURL(a.href);
  showToast('HTML editado baixado.');
}`;

const newDownloadHTML = `// Reconstrói a string do código do arquivo HTML completo incorporando o 'pages' editado e dispara o download
function downloadHTML() {
  // Salva estados de seleção e exibição da sessão do usuário
  const prevSelected = selectedId;
  const prevShowingAll = showingAll;
  
  // Limpa seleção e força visualização simples para um salvamento limpo no DOM
  selectedId = null;
  showingAll = false;
  render();
  
  // Garante que o DOM esteja configurado na visualização padrão de edição simples
  $('#allPages').style.display = 'none';
  $('.canvasWrap').style.display = 'flex';
  
  const html = '<!DOCTYPE html>\\n' +
    document.documentElement.outerHTML
      .replace(/let sourcePages = [\\s\\S]*?;\\r?\\nlet pages = JSON\\.parse/, 'let sourcePages = ' + JSON.stringify(pages, null, 2) + ';\\nlet pages = JSON.parse')
      .replace('<title>Guia Prático do Auxílio Estudantil UTFPR — Editor Livre V9 Global</title>', '<title>Guia Prático do Auxílio Estudantil UTFPR — EDITADO</title>');
      
  // Restaura estados para o usuário continuar trabalhando
  selectedId = prevSelected;
  showingAll = prevShowingAll;
  render();
  
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'Guia_Pratico_Auxilio_Estudantil_UTFPR_EDITADO.html';
  a.click();
  URL.revokeObjectURL(a.href);
  showToast('HTML editado baixado.');
}`;

if (content.includes(oldDownloadHTML)) {
    content = content.replace(oldDownloadHTML, newDownloadHTML);
} else {
    console.error("Could not find oldDownloadHTML in JS.");
    return;
}

fs.writeFileSync(filePath, content, 'utf8');
console.log("Successfully applied all proposed editor quality and usability improvements!");
