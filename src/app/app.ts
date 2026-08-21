import { Component, signal, OnInit, HostListener, Inject, PLATFORM_ID, NgZone } from '@angular/core';
import { isPlatformBrowser, DOCUMENT, CommonModule } from '@angular/common';
import { initSplashCursor } from './splash-cursor';

@Component({
  selector: 'app-root',
  imports: [CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected readonly title = signal('portfolio');
  public showLanding = signal(true);
  public showResume = signal(false);
  public loadingProgress = signal(0);
  public currentFontStyle = signal('hologram');
  private isBrowser: boolean;
  private progressInterval: any = null;
  private autoCycleInterval: any = null;
  private userSelectedStyle = false;

  readonly fontStyles = [
    { id: 'hologram', label: 'Holographic', font: 'Syne', badge: '💎 Hologram', desc: 'Avant-Garde Gradient' },
    { id: 'neon', label: 'Cyber Neon', font: 'Orbitron', badge: '⚡ Cyber Neon', desc: 'Glowing Matrix Laser' },
    { id: 'luxury', label: 'Royal Luxury', font: 'Cinzel', badge: '👑 Royal Gold', desc: '24K Metallic Serif' },
    { id: 'scifi', label: 'Sci-Fi Future', font: 'Space Grotesk', badge: '🚀 Futuristic', desc: 'Modern High-Tech' },
    { id: 'editorial', label: 'Luxury Italic', font: 'Playfair Display', badge: '✨ Luxury Italic', desc: 'High-Fashion Cursive' },
    { id: 'synthwave', label: 'Synthwave', font: 'Rajdhani', badge: '🔥 Synthwave', desc: 'Sunset Retro Pulse' }
  ];

  constructor(
    @Inject(PLATFORM_ID) platformId: Object,
    @Inject(DOCUMENT) private document: Document,
    private ngZone: NgZone
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit() {
    if (!this.isBrowser) return;
    
    // Global mouse tracking for 3D landing page effect
    window.addEventListener('mousemove', (e) => {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      const tiltX = (e.clientY - centerY) / centerY; // -1 to 1
      const tiltY = (e.clientX - centerX) / centerX; // -1 to 1
      
      document.body.style.setProperty('--global-tilt-x', `${-tiltX * 10}deg`);
      document.body.style.setProperty('--global-tilt-y', `${tiltY * 10}deg`);
    });

    // Start animated progress and multi-style transition for the refresh page
    this.runRefreshLoader();
  }

  triggerRefresh() {
    this.showLanding.set(true);
    this.userSelectedStyle = false;
    window.scrollTo({ top: 0, behavior: 'instant' });
    this.runRefreshLoader();
  }

  setFontStyle(styleId: string) {
    this.currentFontStyle.set(styleId);
    this.userSelectedStyle = true;
  }

  runRefreshLoader() {
    if (this.progressInterval) clearInterval(this.progressInterval);
    if (this.autoCycleInterval) clearInterval(this.autoCycleInterval);

    this.loadingProgress.set(0);
    const totalDurationMs = 2600;
    const intervalStepMs = 35;
    const increment = 100 / (totalDurationMs / intervalStepMs);

    let current = 0;
    let cycleIndex = 0;

    // Cycle through font styles dynamically if user hasn't manually clicked one
    this.autoCycleInterval = setInterval(() => {
      if (!this.userSelectedStyle) {
        cycleIndex = (cycleIndex + 1) % this.fontStyles.length;
        this.currentFontStyle.set(this.fontStyles[cycleIndex].id);
      }
    }, 550);

    this.progressInterval = setInterval(() => {
      current += increment;
      if (current >= 100) {
        current = 100;
        this.loadingProgress.set(100);
        clearInterval(this.progressInterval);
        clearInterval(this.autoCycleInterval);
        setTimeout(() => {
          this.startPortfolio();
        }, 250);
      } else {
        this.loadingProgress.set(Math.floor(current));
      }
    }, intervalStepMs);
  }

  skipRefresh() {
    if (this.progressInterval) clearInterval(this.progressInterval);
    if (this.autoCycleInterval) clearInterval(this.autoCycleInterval);
    this.loadingProgress.set(100);
    this.startPortfolio();
  }

  startPortfolio() {
    this.showLanding.set(false);
    if (!this.isBrowser) return;
    
    // We wait for the DOM to render the portfolio components
    setTimeout(() => {
      this.initPortfolioEffects();
    }, 50);
  }

  openResume() {
    this.showResume.set(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  closeResume() {
    this.showResume.set(false);
    // Give Angular a moment to render the portfolio again
    setTimeout(() => {
      this.initPortfolioEffects();
    }, 100);
  }

  initPortfolioEffects() {
    this.ngZone.runOutsideAngular(() => {
      // Intersection Observer for scroll animations
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-show');
            // Remove observer after animation is triggered
            observer.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.05,
        rootMargin: "0px"
      });

      // Dynamic stagger delay (speed optimized)
      const hiddenElements = document.querySelectorAll('.animate-hidden, .blur-reveal-text, .scroll-stack');
      hiddenElements.forEach((el, index) => {
        if (el instanceof HTMLElement && !el.classList.contains('delay-1') && !el.classList.contains('delay-2')) {
          el.style.transitionDelay = `${(index % 4) * 0.05}s`;
        }
        observer.observe(el);
      });

      // Global Mouse tracking effect for Brittany Chiang style spotlight
      window.addEventListener('mousemove', (e) => {
        // Global spotlight
        document.body.style.setProperty('--mouse-local-x', `${e.clientX}px`);
        document.body.style.setProperty('--mouse-local-y', `${e.clientY}px`);
        
        // Card specific glow & 3D tilt & Spotlight Reveal
        const cards = document.querySelectorAll('.glass-card, .project-card, .info-item, .goals-card, .tool-item, .spotlight-wrapper');
        cards.forEach((card) => {
          if (!(card instanceof HTMLElement)) return;
          const rect = card.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          
          card.style.setProperty('--mouse-x', `${x}px`);
          card.style.setProperty('--mouse-y', `${y}px`);

          // Immersive 3D Tilt calculation (Jesse Zhou / interactive style)
          const tiltX = (y / rect.height) * 2 - 1; // -1 to 1
          const tiltY = (x / rect.width) * 2 - 1; // -1 to 1
          card.style.setProperty('--tilt-x', `${-tiltX * 8}deg`); // Max 8 degrees
          card.style.setProperty('--tilt-y', `${tiltY * 8}deg`);
        });
      });

      // Reset tilt on mouse leave
      const allInteractiveCards = document.querySelectorAll('.glass-card, .project-card, .info-item, .goals-card, .tool-item');
      allInteractiveCards.forEach((card) => {
        card.addEventListener('mouseleave', () => {
          if (card instanceof HTMLElement) {
            card.style.setProperty('--tilt-x', '0deg');
            card.style.setProperty('--tilt-y', '0deg');
          }
        });
      });

      // Initialize WebGL Splash Cursor
      const fluidCanvas = document.getElementById('fluid') as HTMLCanvasElement;
      if (fluidCanvas) {
        try {
          initSplashCursor(fluidCanvas);
        } catch (e) {
          console.error('Splash Cursor failed:', e);
        }
      }

      // Back to Top button and Navbar scroll logic
      const backBtn = document.getElementById('backToTopBtn');
      const navbar = document.querySelector('.custom-navbar');
      
      window.addEventListener('scroll', () => {
        // Back to Top visibility
        if (backBtn) {
          if (window.scrollY > 500) {
            backBtn.classList.add('active');
          } else {
            backBtn.classList.remove('active');
          }
        }
        
        // Navbar transparency
        if (navbar) {
          if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
          } else {
            navbar.classList.remove('scrolled');
          }
        }
      });
      
      if (backBtn) {
        backBtn.addEventListener('click', () => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        });
      }

      // Live System Clock logic
      const clockElement = document.getElementById('live-clock');
      if(clockElement) {
        setInterval(() => {
          const now = new Date();
          clockElement.textContent = now.toLocaleTimeString('en-IN', { hour12: true });
        }, 1000);
      }
    });
  }

  @HostListener('window:click', ['$event'])
  onClick(e: MouseEvent) {
    if (!this.isBrowser || this.showLanding()) return;

    // The Ripple Splash
    const ripple = document.createElement('div');
    ripple.classList.add('cursor-ripple');
    ripple.style.left = `${e.clientX}px`;
    ripple.style.top = `${e.clientY}px`;
    document.body.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);

    // The Sparks
    const numSparks = 12;
    for (let i = 0; i < numSparks; i++) {
      const spark = document.createElement('div');
      spark.classList.add('cursor-spark');
      document.body.appendChild(spark);

      const size = Math.random() * 8 + 4;
      spark.style.width = `${size}px`;
      spark.style.height = `${size}px`;
      spark.style.left = `${e.clientX}px`;
      spark.style.top = `${e.clientY}px`;
      spark.style.backgroundColor = i % 2 === 0 ? '#06B6D4' : '#4F46E5';

      const angle = (Math.PI * 2 * i) / numSparks;
      const velocity = 80 + Math.random() * 60;

      spark.animate([
        { transform: `translate(-50%, -50%) scale(1)`, opacity: 1 },
        { transform: `translate(calc(-50% + ${Math.cos(angle)*velocity}px), calc(-50% + ${Math.sin(angle)*velocity}px)) scale(0)`, opacity: 0 }
      ], { duration: 600, easing: 'cubic-bezier(0, .9, .57, 1)' });

      setTimeout(() => spark.remove(), 600);
    }
  }
}
