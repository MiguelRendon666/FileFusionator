class FileFusionApp {
    constructor() {
        this.files = [];
        this.selectedFormat = 'txt';
        this.activeTab = 'documents';
        this.init();
    }

    init() {
        this.bindEvents();
        this.updateExportButton();
        
        // Detectar si está ejecutándose en Tauri
        if (window.__TAURI__) {
            console.log('Running in Tauri environment');
            this.showStatusMessage('Aplicación ejecutándose en Tauri ✓', 'info');
        } else {
            console.log('Running in browser environment');
            this.showStatusMessage('Aplicación ejecutándose en navegador', 'warning');
        }
    }

    bindEvents() {
        // Input principal de carpeta
        const folderInput = document.getElementById('folderInput');
        folderInput.addEventListener('change', (e) => this.handleFolderSelection(e));

        // Input para cambiar carpeta
        const changeFolderInput = document.getElementById('changeFolderInput');
        changeFolderInput.addEventListener('change', (e) => this.handleFolderSelection(e));

        // Selector de formato
        const formatSelector = document.getElementById('formatSelector');
        formatSelector.addEventListener('change', (e) => {
            this.selectedFormat = e.target.value;
            this.updateExportButton();
        });

        // Botón de exportar
        const exportButton = document.getElementById('exportButton');
        exportButton.addEventListener('click', () => this.exportFiles());
        
        // Event listeners para las pestañas
        document.getElementById('documentsTab').addEventListener('click', () => this.switchTab('documents'));
        document.getElementById('orderTab').addEventListener('click', () => this.switchTab('order'));
        
        // Event listener para debugging (Ctrl+D)
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'd') {
                e.preventDefault();
                this.debugApp();
                this.showStatusMessage('Debug info mostrado en consola', 'info');
            }
        });
    }

    async handleFolderSelection(event) {
        const files = Array.from(event.target.files);
        
        if (files.length === 0) return;

        // Obtener nombre de la carpeta
        const folderPath = files[0].webkitRelativePath;
        const folderName = folderPath.split('/')[0];

        // Filtrar solo archivos de texto y código
        const supportedExtensions = [
            'txt', 'js', 'html', 'css', 'json', 'xml', 'md', 'py', 'php', 
            'sql', 'java', 'cpp', 'c', 'h', 'ts', 'jsx', 'tsx', 'vue',
            'scss', 'sass', 'less', 'yml', 'yaml', 'ini', 'cfg', 'conf',
            'log', 'csv', 'tsv', 'sh', 'bat', 'ps1', 'rb', 'go', 'rs',
            'swift', 'kt', 'scala', 'pl', 'r', 'lua', 'dart', 'elm'
        ];

        this.files = [];
        
        for (const file of files) {
            const extension = this.getFileExtension(file.name).toLowerCase();
            
            // Solo procesar archivos con extensiones soportadas
            if (supportedExtensions.includes(extension)) {
                try {
                    const content = await this.readFileContent(file);
                    this.files.push({
                        name: file.name,
                        path: file.webkitRelativePath,
                        content: content,
                        size: file.size,
                        extension: extension
                    });
                } catch (error) {
                    console.warn(`No se pudo leer el archivo ${file.name}:`, error);
                }
            }
        }

        // Ordenar archivos por nombre
        this.files.sort((a, b) => a.name.localeCompare(b.name));

        // Mostrar el layout de dos columnas
        this.showTwoColumnLayout(folderName);
        
        // Renderizar los archivos
        this.renderFiles();
        this.renderSortableFiles();
        
        // Actualizar estado del botón
        this.updateExportButton();
        
        // Actualizar badge de la pestaña
        this.updateOrderTabBadge();
        
        // Mostrar mensaje de éxito
        this.showStatusMessage(`${this.files.length} archivo(s) cargado(s) correctamente`, 'info');
    }

    readFileContent(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = (e) => {
                try {
                    // Intentar leer como texto UTF-8
                    resolve(e.target.result);
                } catch (error) {
                    reject(error);
                }
            };
            
            reader.onerror = () => reject(reader.error);
            reader.readAsText(file, 'UTF-8');
        });
    }

    showTwoColumnLayout(folderName) {
        const initialState = document.getElementById('initialState');
        const twoColumnLayout = document.getElementById('twoColumnLayout');
        const folderNameElement = document.getElementById('folderName');

        initialState.style.display = 'none';
        twoColumnLayout.style.display = 'grid';
        folderNameElement.textContent = folderName;
    }

    renderFiles() {
        const container = document.getElementById('filesContainer');
        
        if (this.files.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <p>No se encontraron archivos de texto en la carpeta seleccionada.</p>
                    <p>Formatos soportados: txt, js, html, css, json, xml, md, py, php, sql, etc.</p>
                </div>
            `;
            return;
        }

        // Agregar botón para ir a reordenar
        const reorderButton = `
            <div class="quick-action-bar">
                <button class="quick-action-btn" onclick="app.switchTab('order')">
                    Ir a Reordenar Archivos
                </button>
                <span class="file-count">${this.files.length} archivo(s) cargado(s)</span>
            </div>
        `;

        container.innerHTML = reorderButton + this.files.map((file, index) => this.createFileItemHTML(file, index)).join('');
    }

    createFileItemHTML(file, index) {
        const icon = this.getFileIcon(file.extension);
        const sizeFormatted = this.formatFileSize(file.size);
        const contentPreview = this.truncateContent(file.content, 2000);

        return `
            <div class="file-item" data-file-index="${index}">
                <div class="file-header">
                    <svg class="file-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        ${icon}
                    </svg>
                    <span class="file-name">${file.name}</span>
                    <span class="file-size">${sizeFormatted}</span>
                </div>
                <div class="file-content">${this.escapeHtml(contentPreview)}</div>
            </div>
        `;
    }

    getFileIcon(extension) {
        const icons = {
            'js': '<path d="M3 3h18v18H3V3zm16 16V5H5v14h14z"/><path d="M8 15V9h1v6H8zm2-6h1v6h-1V9zm2 0h1v6h-1V9z"/>',
            'html': '<path d="M12 2l3 3 3-3v6l-3 3-3-3V2z"/><path d="M3 14l3 3 3-3v6l-3 3-3-3v-6z"/>',
            'css': '<path d="M5 3l2 18 7-2 7 2L19 3H5z"/><path d="M16 8H8v2h8v-2zm0 4H8v2h8v-2z"/>',
            'json': '<path d="M5 3a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H5z"/><path d="M9 9h6v6H9V9z"/>',
            'txt': '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14,2 14,8 20,8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10,9 9,9 8,9"/>',
            'md': '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14,2 14,8 20,8"/><line x1="10" y1="13" x2="8" y2="15"/><line x1="8" y1="13" x2="10" y2="15"/>',
        };
        
        return icons[extension] || '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14,2 14,8 20,8"/>';
    }

    getFileExtension(filename) {
        return filename.slice((filename.lastIndexOf(".") - 1 >>> 0) + 2);
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
    }

    truncateContent(content, maxLength) {
        if (content.length <= maxLength) return content;
        return content.substring(0, maxLength) + '\n\n... (contenido truncado para vista previa)';
    }

    escapeHtml(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, (m) => map[m]);
    }

    updateExportButton() {
        const exportButton = document.getElementById('exportButton');
        exportButton.disabled = this.files.length === 0;
    }

    exportFiles() {
        if (this.files.length === 0) return;

        const separator = this.getSeparatorForFormat(this.selectedFormat);
        const footer = this.getFooterForFormat(this.selectedFormat);

        let mergedContent = '';

        this.files.forEach((file, index) => {
            // Agregar separador de archivo
            mergedContent += this.getFileSeparator(file, this.selectedFormat);
            
            // Agregar contenido del archivo
            mergedContent += file.content;
            
            // Agregar separador entre archivos (excepto el último)
            if (index < this.files.length - 1) {
                mergedContent += separator;
            }
        });

        mergedContent += footer;

        // Crear y descargar el archivo
        this.downloadFile(mergedContent, `fusionado.${this.selectedFormat}`);
    }

    getSeparatorForFormat(format) {
        const separators = {
            'txt': '\n\n' + '='.repeat(80) + '\n\n',
            'js': '\n\n// ' + '='.repeat(75) + '\n\n',
            'html': '\n\n<!-- ' + '='.repeat(70) + ' -->\n\n',
            'css': '\n\n/* ' + '='.repeat(75) + ' */\n\n',
            'sql': '\n\n-- ' + '='.repeat(75) + '\n\n',
            'json': ',\n\n',
            'xml': '\n\n<!-- ' + '='.repeat(70) + ' -->\n\n',
            'md': '\n\n---\n\n',
            'py': '\n\n# ' + '='.repeat(75) + '\n\n',
            'php': '\n\n// ' + '='.repeat(75) + '\n\n'
        };
        
        return separators[format] || '\n\n' + '='.repeat(80) + '\n\n';
    }

    getFileSeparator(file, format) {
        const timestamp = new Date().toLocaleString();
        
        const separators = {
            'txt': `ARCHIVO: ${file.name}\n${'='.repeat(80)}\n\n`,
            'js': `// ARCHIVO: ${file.name}\n// ${'='.repeat(75)}\n\n`,
            'html': `<!-- ARCHIVO: ${file.name}\n${'='.repeat(70)} -->\n\n`,
            'css': `/* ARCHIVO: ${file.name}\n   ${'='.repeat(75)} */\n\n`,
            'sql': `-- ARCHIVO: ${file.name}\n-- ${'='.repeat(75)}\n\n`,
            'xml': `<!-- ARCHIVO: ${file.name}\n${'='.repeat(70)} -->\n\n`,
            'md': `> ARCHIVO: ${file.name}\n\n---\n\n`,
            'py': `# ARCHIVO: ${file.name}\n# ${'='.repeat(75)}\n\n`,
            'php': `// ARCHIVO: ${file.name}\n// ${'='.repeat(75)}\n\n`
        };
        
        return separators[format] || `ARCHIVO: ${file.name}\nRUTA: ${file.path}\nFECHA: ${timestamp}\n${'='.repeat(80)}\n\n`;
    }

    getFooterForFormat(format) {
        const footers = {
            'json': '\n  ]\n}',
            'xml': '\n</fusion>',
            'md': '\n\n---\n\n*Archivo generado automáticamente por Fusionador de Archivos de Miguel Rendón*',
            'php': '\n?>'
        };
        
        return footers[format] || '';
    }

    downloadFile(content, filename) {
        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        URL.revokeObjectURL(url);
        
        // Mostrar feedback al usuario
        this.showExportFeedback();
    }

    showExportFeedback() {
        const exportButton = document.getElementById('exportButton');
        const originalText = exportButton.innerHTML;
        
        exportButton.innerHTML = `
            <svg class="export-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 6L9 17l-5-5"/>
            </svg>
            Exportado
        `;
        exportButton.style.background = 'linear-gradient(145deg, #4a7c59, #5a8c69)';
        
        setTimeout(() => {
            exportButton.innerHTML = originalText;
            exportButton.style.background = '';
        }, 2000);
    }

    renderSortableFiles() {
        const container = document.getElementById('sortableFiles');
        
        // Actualizar el badge de la pestaña
        this.updateOrderTabBadge();
        
        if (this.files.length === 0) {
            container.innerHTML = `
                <div class="empty-order-state">
                    <p>No hay archivos para ordenar.</p>
                    <p>Selecciona una carpeta para comenzar.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = this.files.map((file, index) => this.createSortableFileCard(file, index)).join('');
    }

    createSortableFileCard(file, index) {
        const sizeFormatted = this.formatFileSize(file.size);
        
        return `
            <div class="sortable-file-card" data-index="${index}">
                <div class="file-info">
                    <div class="file-name-small" title="${file.name}">${file.name}</div>
                    <div class="file-details">
                        <span class="file-extension">${file.extension}</span>
                        <span>${sizeFormatted}</span>
                    </div>
                </div>
                <div class="reorder-buttons">
                    <button class="reorder-btn reorder-up" title="Mover arriba" onclick="app.moveFileUp(${index})" ${index === 0 ? 'disabled' : ''}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="18,15 12,9 6,15"/>
                        </svg>
                    </button>
                    <button class="reorder-btn reorder-down" title="Mover abajo" onclick="app.moveFileDown(${index})" ${index === this.files.length - 1 ? 'disabled' : ''}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="6,9 12,15 18,9"/>
                        </svg>
                    </button>
                </div>
                <div class="file-order">${index + 1}</div>
            </div>
        `;
    }

    updateOrderTabBadge() {
        const orderTab = document.getElementById('orderTab');
        if (this.files.length > 0) {
            orderTab.innerHTML = `Reordenar <span class="tab-badge">${this.files.length}</span>`;
        } else {
            orderTab.innerHTML = 'Reordenar';
        }
    }

    reorderFiles(fromIndex, toIndex, skipAnimation = false) {
        if (fromIndex === toIndex || fromIndex === null || toIndex === null) return;
        
        console.log('Reordering files from', fromIndex, 'to', toIndex);
        
        // Verificar que los índices sean válidos
        if (fromIndex < 0 || fromIndex >= this.files.length || toIndex < 0 || toIndex >= this.files.length) {
            console.warn('Invalid indices for reordering:', fromIndex, toIndex);
            this.showStatusMessage('Error: índices inválidos para reordenar', 'error');
            return;
        }
        
        // Reordenar el array de archivos
        const movedFile = this.files.splice(fromIndex, 1)[0];
        this.files.splice(toIndex, 0, movedFile);
        
        // Solo re-renderizar completamente si no viene de una animación
        if (!skipAnimation) {
            this.renderFiles();
            this.renderSortableFiles();
            this.showReorderFeedback();
        } else {
            // Cuando viene de animación, actualizar el contenido de las tarjetas
            // sin cambiar su posición física en el DOM
            this.updateCardContents(fromIndex, toIndex);
            this.renderFiles(); // Solo actualiza la pestaña de documentos
        }
        
        // Mostrar mensaje
        this.showStatusMessage(`Archivo "${movedFile.name}" reordenado correctamente`, 'info');
        
        console.log('Files reordered successfully');
    }

    updateCardContents(fromIndex, toIndex) {
        const cards = document.querySelectorAll('.sortable-file-card');
        const fromCard = cards[fromIndex];
        const toCard = cards[toIndex];
        
        if (!fromCard || !toCard) {
            console.warn('Cards not found for content update:', fromIndex, toIndex);
            return;
        }
        
        // Obtener los archivos en su nuevo orden
        const fromFile = this.files[fromIndex];
        const toFile = this.files[toIndex];
        
        // Actualizar el contenido de la tarjeta fromCard con los datos de fromFile
        this.updateSingleCardContent(fromCard, fromFile, fromIndex);
        
        // Actualizar el contenido de la tarjeta toCard con los datos de toFile
        this.updateSingleCardContent(toCard, toFile, toIndex);
        
        // Actualizar todos los números de orden y botones
        this.updateFileOrderNumbers();
    }

    updateSingleCardContent(card, file, index) {
        const sizeFormatted = this.formatFileSize(file.size);
        
        // Actualizar el nombre del archivo
        const fileNameElement = card.querySelector('.file-name-small');
        if (fileNameElement) {
            fileNameElement.textContent = file.name;
            fileNameElement.title = file.name;
        }
        
        // Actualizar la extensión
        const extensionElement = card.querySelector('.file-extension');
        if (extensionElement) {
            extensionElement.textContent = file.extension;
        }
        
        // Actualizar el tamaño
        const detailsElement = card.querySelector('.file-details');
        if (detailsElement) {
            const spans = detailsElement.querySelectorAll('span');
            if (spans.length >= 2) {
                spans[1].textContent = sizeFormatted;
            }
        }
        
        // Actualizar el número de orden
        const orderElement = card.querySelector('.file-order');
        if (orderElement) {
            orderElement.textContent = index + 1;
        }
        
        // Actualizar el data-index
        card.dataset.index = index;
    }

    showReorderFeedback() {
        const container = document.getElementById('sortableFiles');
        container.style.transform = 'scale(0.98)';
        container.style.transition = 'transform 0.2s ease';
        
        setTimeout(() => {
            container.style.transform = 'scale(1)';
            setTimeout(() => {
                container.style.transition = '';
            }, 200);
        }, 100);
   }

    // Agregar método de debug general
    debugApp() {
        console.log('=== FUSIONEITOR DEBUG INFO ===');
        console.log('Files array:', this.files);
        console.log('Active tab:', this.activeTab);
        console.log('Selected format:', this.selectedFormat);
        
        const cards = document.querySelectorAll('.sortable-file-card');
        console.log('Number of cards:', cards.length);
        cards.forEach((card, index) => {
            console.log(`Card ${index}:`, card.dataset.index);
        });
        
        // Información de Tauri
        if (window.__TAURI__) {
            console.log('Tauri environment detected');
        } else {
            console.log('Running in browser');
        }
        console.log('==============================');
    }

    moveFileUp(index) {
        if (index > 0) {
            this.animateSwap(index, index - 1, () => {
                this.reorderFiles(index, index - 1, true);
            });
        }
    }

    moveFileDown(index) {
        if (index < this.files.length - 1) {
            this.animateSwap(index, index + 1, () => {
                this.reorderFiles(index, index + 1, true);
            });
        }
    }
    
    highlightCard(index) {
        const cards = document.querySelectorAll('.sortable-file-card');
        if (cards[index]) {
            cards[index].style.transform = 'scale(1.05)';
            cards[index].style.boxShadow = '0 8px 32px rgba(34, 197, 94, 0.3)';
            setTimeout(() => {
                cards[index].style.transform = '';
                cards[index].style.boxShadow = '';
            }, 300);
        }
    }

    switchTab(tabName) {
        this.activeTab = tabName;
        
        // Actualizar botones de pestañas
        document.querySelectorAll('.tab-button').forEach(btn => {
            btn.classList.remove('active');
        });
        document.getElementById(tabName + 'Tab').classList.add('active');
        
        // Actualizar paneles
        document.querySelectorAll('.tab-panel').forEach(panel => {
            panel.classList.remove('active');
        });
        document.getElementById(tabName + 'Panel').classList.add('active');
        
        // Mostrar mensaje de feedback
        const tabNames = {
            'documents': 'Documentos',
            'order': 'Reordenar'
        };
        //this.showStatusMessage(`Pestaña "${tabNames[tabName]}" activada`, 'info');
    }

    // Método para agregar mensajes de estado/debug
    showStatusMessage(message, type = 'info') {
        // Crear o actualizar un mensaje de estado
        let statusDiv = document.getElementById('statusMessage');
        if (!statusDiv) {
            statusDiv = document.createElement('div');
            statusDiv.id = 'statusMessage';
            statusDiv.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 12px 16px;
                border-radius: 8px;
                font-size: 14px;
                font-weight: 500;
                z-index: 10000;
                max-width: 300px;
                box-shadow: 0 4px 24px rgba(0, 0, 0, 0.3);
                backdrop-filter: blur(12px);
                transition: all 0.3s ease;
            `;
            document.body.appendChild(statusDiv);
        }
        
        // Configurar colores según el tipo
        const colors = {
            info: { bg: 'rgba(34, 197, 94, 0.9)', text: 'white' },
            warning: { bg: 'rgba(245, 158, 11, 0.9)', text: 'white' },
            error: { bg: 'rgba(239, 68, 68, 0.9)', text: 'white' }
        };
        
        const color = colors[type] || colors.info;
        statusDiv.style.background = color.bg;
        statusDiv.style.color = color.text;
        statusDiv.textContent = message;
        
        // Auto-ocultar después de 3 segundos
        setTimeout(() => {
            if (statusDiv && statusDiv.parentNode) {
                statusDiv.style.opacity = '0';
                statusDiv.style.transform = 'translateX(100%)';
                setTimeout(() => {
                    if (statusDiv && statusDiv.parentNode) {
                        statusDiv.parentNode.removeChild(statusDiv);
                    }
                }, 300);
            }
        }, 3000);
    }

    animateSwap(fromIndex, toIndex, callback) {
        const cards = document.querySelectorAll('.sortable-file-card');
        const fromCard = cards[fromIndex];
        const toCard = cards[toIndex];
        
        if (!fromCard || !toCard) return;
        
        // Obtener las posiciones actuales
        const fromRect = fromCard.getBoundingClientRect();
        const toRect = toCard.getBoundingClientRect();
        
        // Calcular la distancia a mover
        const deltaY = toRect.top - fromRect.top;
        
        // Deshabilitar botones durante la animación
        this.setReorderButtonsEnabled(false);
        
        // Agregar clases de animación
        fromCard.classList.add('swapping');
        toCard.classList.add('swapping');
        
        // Aplicar transformaciones con efecto visual mejorado
        fromCard.style.transform = `translateY(${deltaY}px) scale(1.02)`;
        fromCard.style.zIndex = '1000';
        fromCard.style.boxShadow = '0 12px 40px rgba(34, 197, 94, 0.5)';
        fromCard.style.borderColor = 'var(--pine-green-light)';
        
        toCard.style.transform = `translateY(${-deltaY}px) scale(0.98)`;
        toCard.style.zIndex = '999';
        toCard.style.opacity = '0.8';
        
        // Después de la animación
        setTimeout(() => {
            // Ejecutar el callback para actualizar los datos
            callback();
            
            // Inmediatamente después limpiar las transformaciones de forma suave
            fromCard.style.transition = 'transform 0.2s ease, z-index 0s 0.2s, box-shadow 0.2s ease, border-color 0.2s ease';
            toCard.style.transition = 'transform 0.2s ease, z-index 0s 0.2s, opacity 0.2s ease';
            
            // Resetear las transformaciones gradualmente
            fromCard.style.transform = 'scale(1)';
            fromCard.style.boxShadow = '';
            fromCard.style.borderColor = '';
            
            toCard.style.transform = 'scale(1)';
            toCard.style.opacity = '';
            
            // Limpiar los z-index y clases después de la transición
            setTimeout(() => {
                fromCard.style.zIndex = '';
                fromCard.style.transition = '';
                fromCard.classList.remove('swapping');
                
                toCard.style.zIndex = '';
                toCard.style.transition = '';
                toCard.classList.remove('swapping');
                
                // Re-habilitar botones
                this.setReorderButtonsEnabled(true);
                
            }, 200); // Tiempo de la transición de limpieza
            
        }, 400); // Duración de la animación principal
    }
    
    setReorderButtonsEnabled(enabled) {
        const buttons = document.querySelectorAll('.reorder-btn');
        buttons.forEach(btn => {
            btn.disabled = !enabled;
            btn.style.opacity = enabled ? '' : '0.5';
        });
    }

    updateFileOrderNumbers() {
        const cards = document.querySelectorAll('.sortable-file-card');
        cards.forEach((card, index) => {
            const orderElement = card.querySelector('.file-order');
            const fileNameElement = card.querySelector('.file-name-small');
            const buttonsContainer = card.querySelector('.reorder-buttons');
            
            if (orderElement) {
                orderElement.textContent = index + 1;
            }
            
            // Actualizar data-index
            card.dataset.index = index;
            
            // Actualizar botones para el nuevo índice
            if (buttonsContainer) {
                const upButton = buttonsContainer.querySelector('.reorder-up');
                const downButton = buttonsContainer.querySelector('.reorder-down');
                
                if (upButton) {
                    upButton.onclick = () => this.moveFileUp(index);
                    upButton.disabled = index === 0;
                }
                
                if (downButton) {
                    downButton.onclick = () => this.moveFileDown(index);
                    downButton.disabled = index === this.files.length - 1;
                }
            }
        });
        
        // Actualizar badge
        this.updateOrderTabBadge();
    }
}

// Inicializar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.app = new FileFusionApp();
});
