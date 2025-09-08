// Vereinfachtes JavaScript für Bridge Pattern Learning - Ohne Punktesystem
class BridgePatternLearning {
    constructor() {
        this.currentStep = 1;
        this.connections = new Map();
        this.shapePositions = new Map();

        this.shapes = {
            circle: { name: 'Circle', icon: '⭕' },
            square: { name: 'Square', icon: '⬜' },
            triangle: { name: 'Triangle', icon: '🔺' }
        };

        this.colors = {
            red: { name: 'Red', icon: '🔴', value: '#FF4757', strokeValue: '#c44569' },
            blue: { name: 'Blue', icon: '🔵', value: '#4ECDC4', strokeValue: '#26d0ce' },
            green: { name: 'Green', icon: '🟢', value: '#00D084', strokeValue: '#00a865' }
        };

        this.initializeLearning();
    }

    initializeLearning() {
        this.setupEventListeners();
        this.initializeCanvas();
        this.showStep(1);

        // Debug: Show available elements
        console.log('🎓 Bridge Pattern Learning Module started!');
        console.log('Available draggable items:', document.querySelectorAll('.draggable-item.shape').length);
        console.log('Available drop zones:', document.querySelectorAll('.drop-zone').length);
        console.log('Call-log Container:', document.getElementById('call-log') ? 'found' : 'MISSING!');
        console.log('UML Container:', document.getElementById('interactive-uml') ? 'found' : 'MISSING!');
    }

    setupEventListeners() {
        this.setupDragAndDrop();

        document.getElementById('draw-all')?.addEventListener('click', () => this.drawAll());
        document.getElementById('move-all')?.addEventListener('click', () => this.moveAll());
        document.getElementById('clear-all')?.addEventListener('click', () => this.clearAll());

        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
    }

    setupDragAndDrop() {
        const draggableItems = document.querySelectorAll('.draggable-item.shape');
        draggableItems.forEach(item => {
            item.addEventListener('dragstart', (e) => this.handleDragStart(e));
            item.addEventListener('dragend', (e) => this.handleDragEnd(e));
        });

        const dropZones = document.querySelectorAll('.drop-zone');
        dropZones.forEach(zone => {
            zone.addEventListener('dragover', (e) => this.handleDragOver(e));
            zone.addEventListener('dragenter', (e) => this.handleDragEnter(e));
            zone.addEventListener('dragleave', (e) => this.handleDragLeave(e));
            zone.addEventListener('drop', (e) => this.handleDrop(e));
        });
    }

    initializeCanvas() {
        this.canvas = document.getElementById('playground-canvas');
        if (this.canvas) {
            this.ctx = this.canvas.getContext('2d');
            this.clearCanvas();
        }
    }

    showStep(stepNumber) {
        document.querySelectorAll('.learning-step').forEach(step => {
            step.classList.remove('active');
        });

        const stepIds = ['problem-section', 'solution-section', 'playground-section', 'draw-method-section'];
        const targetStep = document.querySelector(`#${stepIds[stepNumber - 1]}`);

        if (targetStep) {
            targetStep.classList.add('active');
            this.currentStep = stepNumber;
            this.updateProgressTracker();
        }
    }

    updateProgressTracker() {
        const steps = document.querySelectorAll('.progress-step');
        steps.forEach((step, index) => {
            step.classList.remove('active', 'completed');

            if (index + 1 < this.currentStep) {
                step.classList.add('completed');
            } else if (index + 1 === this.currentStep) {
                step.classList.add('active');
            }
        });
    }

    handleDragStart(e) {
        const shapeType = e.target.getAttribute('data-shape');
        e.dataTransfer.setData('text/plain', shapeType);
        e.target.classList.add('dragging');
    }

    handleDragEnd(e) {
        e.target.classList.remove('dragging');
        // Reset alle Drop Zone Styles
        document.querySelectorAll('.drop-zone').forEach(zone => {
            zone.classList.remove('drag-over');
            zone.style.borderColor = '';
            zone.style.background = '';
        });
    }

    handleDragOver(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    }

    handleDragEnter(e) {
        e.preventDefault();
        e.target.classList.add('drag-over');
    }

    handleDragLeave(e) {
        // Nur entfernen wenn wirklich verlassen
        const rect = e.target.getBoundingClientRect();
        const x = e.clientX;
        const y = e.clientY;

        if (x < rect.left || x >= rect.right || y < rect.top || y >= rect.bottom) {
            e.target.classList.remove('drag-over');
        }
    }

    handleDrop(e) {
        e.preventDefault();
        e.target.classList.remove('drag-over');

        const shapeType = e.dataTransfer.getData('text/plain');
        const colorType = e.target.getAttribute('data-color');

        console.log('Drop detected:', shapeType, '→', colorType);

        if (shapeType && colorType) {
            this.connectShapeToColor(shapeType, colorType);
        } else {
            console.warn('Drop failed - Shape or Color not recognized:', shapeType, colorType);
        }
    }

    connectShapeToColor(shapeType, colorType) {
        const shape = this.shapes[shapeType];
        const color = this.colors[colorType];

        if (!shape || !color) return;

        this.connections.set(colorType, shapeType);

        const position = {
            x: Math.random() * (this.canvas.width - 100) + 50,
            y: Math.random() * (this.canvas.height - 100) + 50
        };
        this.shapePositions.set(`${shapeType}_${colorType}`, position);

        this.updateConnectionUI(colorType, shapeType);
        this.logBridgeCall(shapeType, colorType);
        this.updateCanvas(); // UML wird bereits hier aktualisiert

        // Success message
        console.log(`Bridge connection created: ${shape.name} ↔ ${color.name}`);
    }

    updateConnectionUI(colorType, shapeType) {
        const dropZone = document.querySelector(`[data-color="${colorType}"]`);
        const connectionStatus = dropZone?.querySelector('.connection-status');

        if (dropZone && connectionStatus) {
            dropZone.classList.add('connected');
            connectionStatus.textContent = `${this.shapes[shapeType].name} connected!`;
        }

        document.querySelectorAll('.action-btn').forEach(button => {
            button.disabled = false;
        });
    }

    logBridgeCall(shapeType, colorType) {
        const shape = this.shapes[shapeType];
        const color = this.colors[colorType];
        const logContainer = document.getElementById('call-log');

        console.log('Logging Bridge call for:', shape.name, '+', color.name);

        if (!logContainer) {
            console.warn('Call-Log Container not found!');
            return;
        }

        // Remove placeholder if present
        const placeholder = logContainer.querySelector('.log-placeholder');
        if (placeholder) {
            console.log('Removing placeholder');
            placeholder.remove();
        }

        // Create new log entry
        const logEntry = document.createElement('div');
        logEntry.className = 'log-entry';
        logEntry.style.border = '1px solid var(--success-green)';
        logEntry.innerHTML = `
            <div class="log-call">🔗 ${shape.name}.draw() → Bridge Delegation</div>
            <div class="log-result">→ ${color.name}.getFillStyle() → "${color.value}"</div>
            <div class="log-result">→ ${color.name}.getStrokeStyle() → "${color.strokeValue}"</div>
            <div class="log-result">✨ ${shape.name} successfully drawn in ${color.name}!</div>
        `;

        logContainer.insertBefore(logEntry, logContainer.firstChild);
        console.log('Bridge call logged');

        // Limit to 8 entries
        const entries = logContainer.querySelectorAll('.log-entry');
        if (entries.length > 8) {
            entries[entries.length - 1].remove();
        }
    }

    updateCanvas() {
        this.clearCanvas();

        this.connections.forEach((shapeType, colorType) => {
            const position = this.shapePositions.get(`${shapeType}_${colorType}`);
            const color = this.colors[colorType];

            if (position) {
                this.drawShapeAtPosition(shapeType, color, position.x, position.y);
            }
        });

        // Automatically update UML diagram
        this.updateUMLVisualization();
    }

    drawShapeAtPosition(shapeType, color, x, y) {
        const ctx = this.ctx;
        const size = 30;

        ctx.fillStyle = color.value;
        ctx.strokeStyle = color.strokeValue;
        ctx.lineWidth = 3;

        ctx.save();
        ctx.translate(x, y);

        switch (shapeType) {
            case 'circle':
                ctx.beginPath();
                ctx.arc(0, 0, size, 0, 2 * Math.PI);
                ctx.fill();
                ctx.stroke();
                break;
            case 'square':
                ctx.beginPath();
                ctx.rect(-size, -size, size * 2, size * 2);
                ctx.fill();
                ctx.stroke();
                break;
            case 'triangle':
                ctx.beginPath();
                ctx.moveTo(0, -size);
                ctx.lineTo(-size, size);
                ctx.lineTo(size, size);
                ctx.closePath();
                ctx.fill();
                ctx.stroke();
                break;
        }

        ctx.restore();
    }

    clearCanvas() {
        if (!this.ctx) return;

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Grid
        this.ctx.strokeStyle = '#f0f0f0';
        this.ctx.lineWidth = 1;

        for (let x = 0; x < this.canvas.width; x += 40) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.canvas.height);
            this.ctx.stroke();
        }

        for (let y = 0; y < this.canvas.height; y += 40) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.canvas.width, y);
            this.ctx.stroke();
        }
    }

    drawAll() {
        if (this.connections.size === 0) {
            console.log('No connections available');
            return;
        }

        this.updateCanvas();

        // Log extended Bridge calls
        this.logExtendedBridgeCall();

        // Canvas animation effect
        if (this.canvas) {
            this.canvas.style.transform = 'scale(1.02)';
            setTimeout(() => {
                this.canvas.style.transform = 'scale(1)';
            }, 200);
        }

        console.log('All shapes redrawn with Bridge delegation');
    }

    moveAll() {
        this.connections.forEach((shapeType, colorType) => {
            const position = {
                x: Math.random() * (this.canvas.width - 100) + 50,
                y: Math.random() * (this.canvas.height - 100) + 50
            };
            this.shapePositions.set(`${shapeType}_${colorType}`, position);
        });

        this.updateCanvas();
        console.log('All shapes moved');
    }

    clearAll() {
        this.connections.clear();
        this.shapePositions.clear();

        document.querySelectorAll('.drop-zone').forEach(zone => {
            zone.classList.remove('connected');
            const status = zone.querySelector('.connection-status');
            if (status) status.textContent = 'Waiting for shape...';
        });

        document.querySelectorAll('.action-btn').forEach(button => {
            button.disabled = true;
        });

        this.clearCanvas();

        const logContainer = document.getElementById('call-log');
        if (logContainer) {
            logContainer.innerHTML = '<div class="log-placeholder">Connect a shape with a color to see the Bridge calls!</div>';
        }

        this.updateUMLVisualization();

        console.log('Playground was reset');
    }

    updateUMLVisualization() {
        const umlContainer = document.getElementById('interactive-uml');
        if (!umlContainer) return;

        if (this.connections.size === 0) {
            umlContainer.innerHTML = '<div class="empty-uml"><p>Create connections to see the UML diagram</p></div>';
            return;
        }

        // Simplified UML
        const connections = Array.from(this.connections.entries());
        const svg = `
            <svg viewBox="0 0 800 400" style="width: 100%; height: 400px;">
                <rect x="50" y="50" width="200" height="100" fill="#6C5CE7" stroke="white" stroke-width="2" rx="8"/>
                <text x="150" y="80" text-anchor="middle" fill="white" font-weight="bold">Abstraction</text>
                <text x="150" y="100" text-anchor="middle" fill="white">Shape</text>
                
                <rect x="450" y="50" width="200" height="100" fill="#00D084" stroke="white" stroke-width="2" rx="8"/>
                <text x="550" y="80" text-anchor="middle" fill="white" font-weight="bold">Implementor</text>
                <text x="550" y="100" text-anchor="middle" fill="white">Color</text>
                
                <line x1="250" y1="100" x2="450" y2="100" stroke="#FF6B35" stroke-width="4"/>
                <text x="350" y="90" text-anchor="middle" font-weight="bold" fill="#FF6B35">BRIDGE</text>
                
                ${connections.map(([colorType, shapeType], index) => {
            const y = 200 + index * 60;
            return `
                        <rect x="50" y="${y}" width="150" height="40" fill="#8B5CF6" stroke="white" rx="4"/>
                        <text x="125" y="${y + 25}" text-anchor="middle" fill="white">${this.shapes[shapeType].name}</text>
                        
                        <rect x="450" y="${y}" width="150" height="40" fill="#10B981" stroke="white" rx="4"/>
                        <text x="525" y="${y + 25}" text-anchor="middle" fill="white">${this.colors[colorType].name}</text>
                        
                        <line x1="200" y1="${y + 20}" x2="450" y2="${y + 20}" stroke="#FF6B35" stroke-width="2"/>
                    `;
        }).join('')}
            </svg>
        `;

        umlContainer.innerHTML = svg;
    }

    logExtendedBridgeCall() {
        const logContainer = document.getElementById('call-log');
        if (!logContainer) return;

        const extendedLogEntry = document.createElement('div');
        extendedLogEntry.className = 'log-entry';
        extendedLogEntry.style.border = '2px solid var(--warning-orange)';
        extendedLogEntry.innerHTML = `
            <div class="log-call">🎯 BRIDGE PATTERN DEMONSTRATION</div>
            <div class="log-result">→ ${this.connections.size} active Bridge connection(s)</div>
            <div class="log-result">→ Each shape delegates color operations to Color object</div>
            <div class="log-result">→ Abstraction and implementation remain independent! ✨</div>
        `;

        logContainer.insertBefore(extendedLogEntry, logContainer.firstChild);
    }

    handleKeyboard(e) {
        if (e.key >= '1' && e.key <= '4') {
            this.showStep(parseInt(e.key));
        }

        // Additional keyboard shortcuts
        if (e.key === 'd' && !e.ctrlKey && !e.metaKey) {
            this.drawAll();
        }
        if (e.key === 'm' && !e.ctrlKey && !e.metaKey) {
            this.moveAll();
        }
        if (e.key === 'c' && !e.ctrlKey && !e.metaKey) {
            this.clearAll();
        }
    }
}

// Global Functions
function goToStep(stepNumber) {
    window.bridgeLearning?.showStep(stepNumber);
}

// Initialization
document.addEventListener('DOMContentLoaded', function () {
    console.log('🎓 Bridge Pattern Learning Module loading...');
    window.bridgeLearning = new BridgePatternLearning();
    console.log('✅ Bridge Pattern Learning Module successfully started!');
});
