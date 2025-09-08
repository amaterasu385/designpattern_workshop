// Main functions for the Bridge Pattern Learning Website with Shapes & Colors
document.addEventListener('DOMContentLoaded', function () {
    console.log('🌉 Bridge Pattern Website loaded');

    initializeNavigation();
    initializeShapeColorDemo();
    initializeConceptCards();
    initializeExplosionCalculator();
    initializeAccessibility();
});

// Navigation and Smooth Scrolling
function initializeNavigation() {
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const navHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight - 20;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Active navigation based on scroll position
    window.addEventListener('scroll', updateActiveNavigation);
}

function updateActiveNavigation() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');
    const navHeight = document.querySelector('.navbar').offsetHeight;

    let currentSection = '';

    sections.forEach(section => {
        const sectionTop = section.getBoundingClientRect().top;
        const sectionHeight = section.offsetHeight;

        if (sectionTop <= navHeight + 100 && sectionTop + sectionHeight > navHeight + 100) {
            currentSection = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
}

// Shapes & Colors Demo
function initializeShapeColorDemo() {
    const shapeSelector = document.getElementById('shape-selector');
    const colorSelector = document.getElementById('color-selector');
    const currentShape = document.getElementById('current-shape');
    const currentColor = document.getElementById('current-color');
    const demoCanvas = document.getElementById('demo-canvas');

    if (!shapeSelector || !colorSelector || !currentShape || !currentColor || !demoCanvas) {
        console.warn('Shapes & Colors Demo elements not found');
        return;
    }

    const ctx = demoCanvas.getContext('2d');

    const shapes = {
        circle: { name: 'Circle', draw: drawCircle },
        square: { name: 'Square', draw: drawSquare },
        triangle: { name: 'Triangle', draw: drawTriangle }
    };

    const colors = {
        red: { name: 'Red', value: '#ef4444' },
        blue: { name: 'Blue', value: '#3b82f6' },
        green: { name: 'Green', value: '#10b981' }
    };

    function updateShapeColorDemo() {
        try {
            const selectedShape = shapeSelector.value;
            const selectedColor = colorSelector.value;

            if (!shapes[selectedShape] || !colors[selectedColor]) {
                console.warn('Invalid shape or color selection');
                return;
            }

            currentShape.textContent = shapes[selectedShape].name;
            currentColor.textContent = colors[selectedColor].name;

            // Clear and redraw
            ctx.clearRect(0, 0, demoCanvas.width, demoCanvas.height);

            // Draw background grid
            drawGrid(ctx);

            // Draw the shape with selected color (Bridge Pattern in action!)
            shapes[selectedShape].draw(ctx, colors[selectedColor].value);

            // Animated color change for visual feedback
            const demoResult = document.getElementById('metaphor-demo');
            if (demoResult) {
                demoResult.style.transform = 'scale(1.02)';
                setTimeout(() => {
                    demoResult.style.transform = 'scale(1)';
                }, 200);
            }

            // Accessibility: Announce changes to screen readers
            announceToScreenReader(`${shapes[selectedShape].name} drawn in ${colors[selectedColor].name}`);

        } catch (error) {
            console.error('Error updating shape color demo:', error);
        }
    }

    function drawGrid(ctx) {
        ctx.strokeStyle = '#e5e7eb';
        ctx.lineWidth = 1;
        for (let x = 0; x <= demoCanvas.width; x += 20) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, demoCanvas.height);
            ctx.stroke();
        }
        for (let y = 0; y <= demoCanvas.height; y += 20) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(demoCanvas.width, y);
            ctx.stroke();
        }
    }

    function drawCircle(ctx, color) {
        const centerX = demoCanvas.width / 2;
        const centerY = demoCanvas.height / 2;
        const radius = 60;

        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.strokeStyle = '#374151';
        ctx.lineWidth = 3;
        ctx.stroke();
    }

    function drawSquare(ctx, color) {
        const size = 120;
        const x = (demoCanvas.width - size) / 2;
        const y = (demoCanvas.height - size) / 2;

        ctx.beginPath();
        ctx.rect(x, y, size, size);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.strokeStyle = '#374151';
        ctx.lineWidth = 3;
        ctx.stroke();
    }

    function drawTriangle(ctx, color) {
        const centerX = demoCanvas.width / 2;
        const centerY = demoCanvas.height / 2;
        const size = 70;

        ctx.beginPath();
        ctx.moveTo(centerX, centerY - size);
        ctx.lineTo(centerX - size, centerY + size);
        ctx.lineTo(centerX + size, centerY + size);
        ctx.closePath();
        ctx.fillStyle = color;
        ctx.fill();
        ctx.strokeStyle = '#374151';
        ctx.lineWidth = 3;
        ctx.stroke();
    }

    shapeSelector.addEventListener('change', updateShapeColorDemo);
    colorSelector.addEventListener('change', updateShapeColorDemo);

    // Initial draw
    updateShapeColorDemo();
}

// Explosion Calculator
function initializeExplosionCalculator() {
    const explosionDemo = document.querySelector('.explosion-counter');
    if (explosionDemo) {
        // Add click handler to show detailed calculation
        explosionDemo.addEventListener('click', showExplosionCalculator);
        explosionDemo.style.cursor = 'pointer';
        explosionDemo.setAttribute('role', 'button');
        explosionDemo.setAttribute('tabindex', '0');

        explosionDemo.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                showExplosionCalculator();
            }
        });
    }
}

function showExplosionCalculator() {
    const content = {
        title: 'Class Explosion Calculator',
        description: 'Understand why Bridge Pattern prevents exponential growth.',
        example: `
        <div class="calculator-demo">
            <h4>Without Bridge Pattern:</h4>
            <p>One class for each combination:</p>
            <ul>
                <li>RedCircle, RedSquare, RedTriangle</li>
                <li>BlueCircle, BlueSquare, BlueTriangle</li>
                <li>GreenCircle, GreenSquare, GreenTriangle</li>
            </ul>
            <p><strong>Result: 3 × 3 = 9 Classes</strong></p>
            
            <h4>With Bridge Pattern:</h4>
            <p>Separate hierarchies:</p>
            <ul>
                <li>Shapes: Circle, Square, Triangle (3 Classes)</li>
                <li>Colors: Red, Blue, Green (3 Classes)</li>
            </ul>
            <p><strong>Result: 3 + 3 = 6 Classes</strong></p>
            
            <div class="calculation-formula">
                <h4>Scalability:</h4>
                <p>With n shapes and m colors:</p>
                <p><strong>Without Bridge:</strong> n × m classes</p>
                <p><strong>With Bridge:</strong> n + m classes</p>
            </div>
        </div>
        `,
        code: `// Without Bridge - Class Hell
class RedCircle extends Circle {
    draw() {
        setColor('#ef4444');
        super.drawCircle();
    }
}

class BlueCircle extends Circle { /* ... */ }
// ... 7 more classes

// With Bridge - Elegant!
class Circle extends Shape {
    draw() {
        const style = this.color.getFillStyle();
        this.drawWithColor(style);
    }
}

// Usage:
new Circle(new Red());
new Square(new Blue());`
    };

    showModal(content);
}

// Konzept-Karten Interaktivität
function initializeConceptCards() {
    const conceptCards = document.querySelectorAll('.concept-card');

    conceptCards.forEach(card => {
        card.addEventListener('click', showConceptDetails);
        card.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                showConceptDetails.call(this, e);
            }
        });
    });
}

function showConceptDetails(e) {
    const concept = this.getAttribute('data-concept');
    const conceptInfo = getConceptInfo(concept);

    if (conceptInfo) {
        showModal(conceptInfo);
        announceToScreenReader(`Details about ${conceptInfo.title} are being displayed`);
    }
}

function getConceptInfo(concept) {
    const concepts = {
        'abstraction': {
            title: 'Abstraction (Shape)',
            description: 'The high-level class that defines shape operations and holds a reference to a Color object for delegation.',
            example: 'From our project: The BridgePatternPlayground manages shapes and delegates color operations.',
            code: `// From our Bridge Pattern implementation
class BridgePatternPlayground {
    constructor() {
        this.connections = new Map(); // color -> shape mapping
        this.shapeTypes = {
            'circle': { name: 'Circle', actions: ['move'], size: 40 },
            'square': { name: 'Square', actions: ['move'], size: 40 },
            'triangle': { name: 'Triangle', actions: ['move'], size: 40 }
        };
        this.colorTypes = {
            'red': { name: 'Red', value: '#ef4444' },
            'blue': { name: 'Blue', value: '#3b82f6' }
        };
    }
    
    // Bridge connection: Shape delegates to Color
    connectShapeToColor(shapeType, colorType) {
        this.connections.set(colorType, shapeType);
        this.updateCanvas(); // Triggers delegation
    }
}`
        },
        'refined-abstraction': {
            title: 'Refined Abstraction',
            description: 'Concrete shape implementations that define specific drawing logic but delegate color details to Color objects.',
            example: 'Our drawing functions for Circle, Square, and Triangle with color delegation.',
            code: `// From our Canvas drawing implementation
function drawCircle(ctx, color) {
    const centerX = demoCanvas.width / 2;
    const centerY = demoCanvas.height / 2;
    const radius = 60;
    
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    
    // Bridge Pattern: Delegate color styling
    ctx.fillStyle = color; // Color implementation provides style
    ctx.fill();
    ctx.strokeStyle = '#374151';
    ctx.lineWidth = 3;
    ctx.stroke();
}

function drawSquare(ctx, color) {
    const size = 120;
    const x = (demoCanvas.width - size) / 2;
    const y = (demoCanvas.height - size) / 2;
    
    ctx.beginPath();
    ctx.rect(x, y, size, size);
    ctx.fillStyle = color; // Bridge delegation
    ctx.fill();
    ctx.strokeStyle = '#374151';
    ctx.lineWidth = 3;
    ctx.stroke();
}`
        },
        'implementor': {
            title: 'Implementor (Color)',
            description: 'The Color interface defines primitive operations for color rendering, independent of the shape.',
            example: 'Our color system with different color values and properties.',
            code: `// Our Color system implementation
const colorTypes = {
    'red': {
        name: 'Red',
        icon: '🔴',
        value: '#ef4444',
        strokeValue: '#dc2626'
    },
    'blue': {
        name: 'Blue', 
        icon: '🔵',
        value: '#3b82f6',
        strokeValue: '#2563eb'
    },
    'green': {
        name: 'Green',
        icon: '🟢', 
        value: '#10b981',
        strokeValue: '#059669'
    }
};

// Bridge Pattern: Shape asks Color for styling info
function applyColor(colorType, context) {
    const color = colorTypes[colorType];
    context.fillStyle = color.value;
    context.strokeStyle = color.strokeValue;
}`
        },
        'concrete-implementor': {
            title: 'Concrete Implementor',
            description: 'Specific color implementations that fulfill the Color interface and encapsulate platform-specific rendering details.',
            example: 'Our Canvas-specific color implementations with visual effects.',
            code: `// Our Canvas-specific color rendering
function drawShapeAtPosition(shapeType, color, x, y) {
    const ctx = this.ctx;
    const size = 40;
    
    // Concrete Implementor: Canvas-specific rendering
    ctx.fillStyle = color.value;      // #ef4444, #3b82f6, #10b981
    ctx.strokeStyle = color.strokeValue; // #dc2626, #2563eb, #059669
    ctx.lineWidth = 3;
    
    // Add shadow effects (platform-specific)
    ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
    ctx.shadowBlur = 10;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    
    // Draw based on shape type
    switch (shapeType) {
        case 'circle':
            ctx.beginPath();
            ctx.arc(x, y, size, 0, 2 * Math.PI);
            ctx.fill();
            ctx.stroke();
            break;
        // ... other shapes
    }
}`
        }
    };

    return concepts[concept] || null;
}

// Modal system for concept details
function showModal(content) {
    // Remove existing modals
    const existingModal = document.querySelector('.concept-modal');
    if (existingModal) {
        existingModal.remove();
    }

    // Create modal
    const modal = document.createElement('div');
    modal.className = 'concept-modal';
    modal.innerHTML = `
        <div class="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="modal-title">
            <div class="modal-content">
                <div class="modal-header">
                    <h3 id="modal-title">${content.title}</h3>
                    <button class="modal-close" aria-label="Close modal">&times;</button>
                </div>
                <div class="modal-body">
                    <p>${content.description}</p>
                    ${content.example ? `<div class="example-content">${content.example}</div>` : ''}
                    ${content.code ? `
                        <h4>Code-Example:</h4>
                        <pre><code>${content.code}</code></pre>
                    ` : ''}
                </div>
            </div>
        </div>
    `;

    // Add CSS for modal (if not already present)
    addModalCSS();

    // Add modal to DOM
    document.body.appendChild(modal);

    // Event listeners for closing
    const closeBtn = modal.querySelector('.modal-close');
    const overlay = modal.querySelector('.modal-overlay');

    closeBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', function (e) {
        if (e.target === overlay) {
            closeModal();
        }
    });

    // Keyboard navigation
    modal.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            closeModal();
        }
    });

    // Focus management
    closeBtn.focus();

    function closeModal() {
        modal.classList.add('modal-closing');
        setTimeout(() => modal.remove(), 300);

        // Return focus to the card that opened the modal
        const activeCard = document.querySelector('.concept-card[data-concept]:focus');
        if (activeCard) {
            activeCard.focus();
        }
    }
}

function addModalCSS() {
    if (document.getElementById('modal-styles')) return;

    const style = document.createElement('style');
    style.id = 'modal-styles';
    style.textContent = `
        .concept-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 10000;
            animation: modalFadeIn 0.3s ease-out;
        }
        
        .concept-modal.modal-closing {
            animation: modalFadeOut 0.3s ease-out;
        }
        
        @keyframes modalFadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        @keyframes modalFadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
        }
        
        .modal-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 2rem;
        }
        
        .modal-content {
            background: white;
            border-radius: 12px;
            max-width: 700px;
            width: 100%;
            max-height: 85vh;
            overflow-y: auto;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
            animation: modalSlideIn 0.3s ease-out;
        }
        
        @keyframes modalSlideIn {
            from { 
                transform: translateY(20px) scale(0.95);
                opacity: 0;
            }
            to { 
                transform: translateY(0) scale(1);
                opacity: 1;
            }
        }
        
        .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 2rem 2rem 1rem;
            border-bottom: 1px solid var(--gray-200);
        }
        
        .modal-header h3 {
            margin: 0;
            color: var(--primary-color);
        }
        
        .modal-close {
            background: none;
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
            color: var(--gray-500);
            padding: 0.5rem;
            border-radius: 4px;
            transition: var(--transition);
        }
        
        .modal-close:hover, .modal-close:focus {
            background: var(--gray-100);
            color: var(--gray-700);
        }
        
        .modal-body {
            padding: 1rem 2rem 2rem;
        }
        
        .modal-body h4 {
            color: var(--gray-700);
            margin: 1.5rem 0 0.5rem;
        }
        
        .modal-body pre {
            background: var(--gray-900);
            color: white;
            padding: 1rem;
            border-radius: 6px;
            overflow-x: auto;
            font-size: 0.875rem;
            line-height: 1.5;
        }
        
        .modal-body code {
            font-family: var(--font-mono);
        }
        
        .example-content {
            background: var(--gray-50);
            padding: 1rem;
            border-radius: 6px;
            margin: 1rem 0;
        }
        
        .calculator-demo h4 {
            color: var(--primary-color);
            margin-top: 1.5rem;
        }
        
        .calculation-formula {
            background: var(--primary-color);
            color: white;
            padding: 1rem;
            border-radius: 6px;
            margin-top: 1rem;
        }
        
        .calculation-formula h4 {
            color: var(--accent-color) !important;
        }
    `;

    document.head.appendChild(style);
}

// Accessibility Improvements
function initializeAccessibility() {
    // Announce function for Screen Reader
    const announcer = document.createElement('div');
    announcer.setAttribute('aria-live', 'polite');
    announcer.setAttribute('aria-atomic', 'true');
    announcer.className = 'sr-only';
    document.body.appendChild(announcer);

    window.announceToScreenReader = function (message) {
        announcer.textContent = message;
        setTimeout(() => {
            announcer.textContent = '';
        }, 1000);
    };

    // Skip-to-content Link
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'skip-link sr-only';
    skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 6px;
        background: var(--primary-color);
        color: white;
        padding: 8px;
        text-decoration: none;
        z-index: 10001;
        border-radius: 4px;
    `;

    skipLink.addEventListener('focus', function () {
        this.classList.remove('sr-only');
        this.style.top = '6px';
    });

    skipLink.addEventListener('blur', function () {
        this.classList.add('sr-only');
        this.style.top = '-40px';
    });

    document.body.insertBefore(skipLink, document.body.firstChild);

    // Add main content ID if not present
    const hero = document.getElementById('home');
    if (hero && !document.getElementById('main-content')) {
        hero.setAttribute('id', 'main-content');
    }
}

// Utility Functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Performance optimization: Debounce scroll events
window.addEventListener('scroll', debounce(updateActiveNavigation, 10));

// Error handling
window.addEventListener('error', function (e) {
    console.error('JavaScript Error:', e.error);
    // Optional: Send error to analytics service
});

// Loading states
window.addEventListener('load', function () {
    document.body.classList.add('loaded');
    announceToScreenReader('Website fully loaded');
});