import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Button } from "#client/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "#client/components/ui/card";
import { Badge } from "#client/components/ui/badge";
import { Input } from "#client/components/ui/input";
import { 
  Search, 
  MapPin, 
  Calendar, 
  Clock, 
  Users, 
  Heart,
  Star,
  ArrowRight,
  ArrowUpRight,
  ArrowUp,
  BookOpen,
  Target,
  TreePine,
  PawPrint,
  Trophy,
  Code,
  ChevronLeft,
  ChevronRight,
  HeartHandshake
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import { useQuery } from "@tanstack/react-query";
import { fetchDiscoverProjects } from "#client/api/public/discover.ts";

export const Route = createFileRoute("/")({
  component: Index,
});

// Helper function to get category color
const getCategoryColor = (category: string) => {
  const colors: Record<string, string> = {
    "Community": "bg-orange-100 text-orange-700 hover:bg-orange-200",
    "Mentoring": "bg-blue-100 text-blue-700 hover:bg-blue-200",
    "Environment": "bg-green-100 text-green-700 hover:bg-green-200",
    "Elderly": "bg-purple-100 text-purple-700 hover:bg-purple-200",
    "Arts & Culture": "bg-pink-100 text-pink-700 hover:bg-pink-200",
    "Animal Welfare": "bg-rose-100 text-rose-700 hover:bg-rose-200",
    "Sports & Leisure": "bg-yellow-100 text-yellow-700 hover:bg-yellow-200",
    "Coding": "bg-cyan-100 text-cyan-700 hover:bg-cyan-200"
  };
  return colors[category] || "bg-gray-100 text-gray-700 hover:bg-gray-200";
};

// Helper function to get status color and text
const getStatusBadge = (status: string) => {
  const statusConfig: Record<string, { label: string; className: string }> = {
    "open": { label: "Open", className: "bg-green-500 hover:bg-green-600 text-white" },
    "closing-soon": { label: "Closing Soon", className: "bg-yellow-500 hover:bg-yellow-600 text-white" },
    "full": { label: "Full", className: "bg-gray-500 hover:bg-gray-600 text-white" },
    "closed": { label: "Closed", className: "bg-red-500 hover:bg-red-600 text-white" },
  };
  return statusConfig[status] || statusConfig["open"];
};

// Helper function to format date range
const formatDateRange = (startDate: string, endDate?: string) => {
  const formatDate = (date: string) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };
  
  if (!endDate || startDate === endDate) {
    return formatDate(startDate);
  }
  return `${formatDate(startDate)} - ${formatDate(endDate)}`;
};

// Animated Section Wrapper
const AnimatedSection = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Moving Background Component for Hero
const MovingBackground = ({ heroRef }: { heroRef: React.RefObject<HTMLElement> }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const rafRef = useRef<number>();

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (heroRef.current && rafRef.current === undefined) {
        rafRef.current = requestAnimationFrame(() => {
          const rect = heroRef.current!.getBoundingClientRect();
          const x = (e.clientX - rect.left) / rect.width;
          const y = (e.clientY - rect.top) / rect.height;
          setMousePosition({
            x: (x - 0.5) * 100,
            y: (y - 0.5) * 100,
          });
          rafRef.current = undefined;
        });
      }
    };

    const hero = heroRef.current;
    if (hero) {
      hero.addEventListener("mousemove", handleMouseMove);
      return () => {
        hero.removeEventListener("mousemove", handleMouseMove);
        if (rafRef.current) {
          cancelAnimationFrame(rafRef.current);
        }
      };
    }
  }, [heroRef]);

  // Pre-calculate particle positions and timing to avoid glitches
  const particles = Array.from({ length: 12 }, (_, i) => {
    const baseDelay = i * 0.5;
    const baseDuration = 4 + (i % 3) * 0.5;
    const startX = (i * 73.7) % 100; // Use modulo for consistent distribution
    const startY = (i * 61.3) % 100;
    const offsetX = Math.sin(i * 0.7) * 40;
    
    return {
      id: i,
      startX,
      startY,
      offsetX,
      duration: baseDuration,
      delay: baseDelay,
    };
  });

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none -z-0">
      {/* Animated gradient orbs - using smooth continuous motion with cursor parallax */}
      <motion.div
        className="absolute w-96 h-96 bg-primary/20 rounded-full blur-3xl"
        animate={{
          x: [0, 100, 0],
          y: [0, 50, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          repeatType: "loop",
          ease: [0.4, 0, 0.6, 1],
        }}
        style={{ 
          top: "10%", 
          left: "10%",
          transform: `translate(${mousePosition.x * 0.3}px, ${mousePosition.y * 0.3}px)`,
          transition: 'transform 0.1s ease-out',
        }}
      />
      <motion.div
        className="absolute w-96 h-96 bg-[#10b981]/20 rounded-full blur-3xl"
        animate={{
          x: [0, -80, 0],
          y: [0, 80, 0],
          scale: [1, 1.3, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          repeatType: "loop",
          ease: [0.4, 0, 0.6, 1],
        }}
        style={{ 
          top: "60%", 
          right: "10%",
          transform: `translate(${mousePosition.x * -0.4}px, ${mousePosition.y * -0.4}px)`,
          transition: 'transform 0.1s ease-out',
        }}
      />
      <motion.div
        className="absolute w-80 h-80 bg-secondary/20 rounded-full blur-3xl"
        animate={{
          x: [0, 60, 0],
          y: [0, -60, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          repeatType: "loop",
          ease: [0.4, 0, 0.6, 1],
        }}
        style={{ 
          bottom: "20%", 
          left: "50%",
          transform: `translate(${mousePosition.x * 0.2}px, ${mousePosition.y * 0.2}px)`,
          transition: 'transform 0.1s ease-out',
        }}
      />
      {/* Floating particles with fixed positions and timing */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute w-2 h-2 bg-primary/30 rounded-full"
          initial={{ opacity: 0.2 }}
          animate={{
            y: [0, -120, 0],
            x: [0, particle.offsetX, 0],
            opacity: [0.2, 0.6, 0.2],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            repeatType: "loop",
            delay: particle.delay,
            ease: [0.4, 0, 0.6, 1],
          }}
          style={{
            left: `${particle.startX}%`,
            top: `${particle.startY}%`,
            transform: `translate(${mousePosition.x * 0.1}px, ${mousePosition.y * 0.1}px)`,
            transition: 'transform 0.1s ease-out',
          }}
        />
      ))}
    </div>
  );
};

function Index() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("local");
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [slideOffset, setSlideOffset] = useState(0);
  const [countCSPs, setCountCSPs] = useState(0);
  const [countPartners, setCountPartners] = useState(0);
  const [countCountries, setCountCountries] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [showScrollToTop, setShowScrollToTop] = useState(false);

  // Fetch real CSPs from API
  const { data: discoverProjects = [] } = useQuery({
    queryKey: ["discover-projects"],
    queryFn: fetchDiscoverProjects,
  });
  const heroRef = useRef<HTMLElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const smunityRef = useRef<HTMLSpanElement>(null);
  const smuRef = useRef<HTMLSpanElement>(null);
  const communityRef = useRef<HTMLSpanElement>(null);
  const aboutSectionRef = useRef<HTMLElement>(null);
  const categoryCardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const categoriesSectionRef = useRef<HTMLElement>(null);
  const featuredCSPsSectionRef = useRef<HTMLElement>(null);
  const ctaSectionRef = useRef<HTMLElement>(null);

  // Stats counting animation on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setHasAnimated(true);
            
            const duration = 2000; 
            const fps = 60; 
            const totalFrames = (duration / 1000) * fps;
            const frameInterval = duration / totalFrames;
            
            let frame = 0;
            const countInterval = setInterval(() => {
              frame++;
              const progress = frame / totalFrames;
              
              setCountCSPs(Math.floor(150 * progress));
              setCountPartners(Math.floor(430 * progress));
              setCountCountries(Math.floor(40 * progress));
              
              if (frame >= totalFrames) {
                setCountCSPs(150);
                setCountPartners(430);
                setCountCountries(40);
                clearInterval(countInterval);
              }
            }, frameInterval);
          }
        });
      },
      { threshold: 0.3 }
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => {
      if (statsRef.current) {
        observer.unobserve(statsRef.current);
      }
    };
  }, [hasAnimated]);

  useEffect(() => {
    const cards = categoryCardsRef.current.filter(Boolean) as HTMLDivElement[];
    if (cards.length === 0 || !categoriesSectionRef.current) return;

    const handlers: Array<{ card: HTMLDivElement; enter: () => void; leave: () => void }> = [];
    let hasAnimated = false;

    cards.forEach((card) => {
      gsap.set(card, {
        opacity: 0,
        y: 60,
        scale: 0.8,
        rotationX: -20,
      });
    });

    const cardAnimations: gsap.core.Tween[] = [];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (!hasAnimated) {
              hasAnimated = true;

              cards.forEach((card, idx) => {
              const cardInner = card.querySelector('[data-card-inner]') as HTMLElement;
              const cardFront = card.querySelector('[data-card-front]') as HTMLElement;
              const cardBack = card.querySelector('[data-card-back]') as HTMLElement;
              
              if (!cardInner || !cardFront || !cardBack) return;

              gsap.set(card, {
                perspective: 1000,
                transformStyle: "preserve-3d",
              });

              gsap.set(cardInner, {
                transformStyle: "preserve-3d",
                rotationY: 0,
              });

              gsap.set(cardFront, {
                backfaceVisibility: "hidden",
                rotationY: 0,
              });

              gsap.set(cardBack, {
                backfaceVisibility: "hidden",
                rotationY: 180,
              });

                const anim = gsap.to(card, {
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  rotationX: 0,
                  duration: 0.8,
                  ease: "back.out(1.7)",
                  delay: idx * 0.1,
                });
                cardAnimations.push(anim);
              });
            }
          } else if (!entry.isIntersecting && hasAnimated) {
            cardAnimations.forEach((anim, idx) => {
              gsap.to(anim.targets(), {
                opacity: 0,
                y: 60,
                scale: 0.8,
                rotationX: -20,
                duration: 0.6,
                ease: "power2.in",
                delay: idx * 0.05,
                onComplete: () => {
                  if (idx === cardAnimations.length - 1) {
                    hasAnimated = false;
                    cards.forEach((card) => {
                      gsap.set(card, {
                        opacity: 0,
                        y: 60,
                        scale: 0.8,
                        rotationX: -20,
                      });
                    });
                    cardAnimations.length = 0;
                  }
                }
              });
            });
          }
        });
      },
      { threshold: 0.2, rootMargin: "0px 0px -100px 0px" }
    );

    observer.observe(categoriesSectionRef.current);

    cards.forEach((card) => {
      const cardInner = card.querySelector('[data-card-inner]') as HTMLElement;
      const cardFront = card.querySelector('[data-card-front]') as HTMLElement;
      const cardBack = card.querySelector('[data-card-back]') as HTMLElement;
      
      if (!cardInner || !cardFront || !cardBack) return;

      gsap.set(card, {
        perspective: 1000,
        transformStyle: "preserve-3d",
      });

      gsap.set(cardInner, {
        transformStyle: "preserve-3d",
        rotationY: 0,
      });

      gsap.set(cardFront, {
        backfaceVisibility: "hidden",
        rotationY: 0,
      });

      gsap.set(cardBack, {
        backfaceVisibility: "hidden",
        rotationY: 180,
      });

      const handleEnter = () => {
        gsap.to(cardInner, {
          rotationY: 180,
          duration: 0.6,
          ease: "power2.inOut",
        });

        gsap.to(card, {
          scale: 1.05,
          y: -8,
          duration: 0.5,
          ease: "power2.out",
        });

        gsap.fromTo(
          cardBack,
          {
            opacity: 0,
            scale: 0.8,
          },
          {
            opacity: 1,
            scale: 1,
            duration: 0.4,
            ease: "back.out(1.7)",
            delay: 0.15,
          }
        );
      };

      const handleLeave = () => {
        gsap.to(cardInner, {
          rotationY: 0,
          duration: 0.6,
          ease: "power2.inOut",
        });

        gsap.to(card, {
          scale: 1,
          y: 0,
          duration: 0.5,
          ease: "power2.in",
        });
      };

      card.addEventListener("mouseenter", handleEnter);
      card.addEventListener("mouseleave", handleLeave);

      handlers.push({ card, enter: handleEnter, leave: handleLeave });
    });

    return () => {
      handlers.forEach(({ card, enter, leave }) => {
        card.removeEventListener("mouseenter", enter);
        card.removeEventListener("mouseleave", leave);
      });
      if (categoriesSectionRef.current) {
        observer.unobserve(categoriesSectionRef.current);
      }
    };
  }, []);

  // GSAP Animations for Featured CSPs Section
  useEffect(() => {
    if (!featuredCSPsSectionRef.current) return;

    let hasAnimated = false;
    const section = featuredCSPsSectionRef.current;

    const carouselContainer = section.querySelector('[class*="hidden"][class*="lg:block"]');
    const mobileGrid = section.querySelector('.grid.grid-cols-1');
    
    if (carouselContainer) {
      const cardsContainer = carouselContainer.querySelector('[class*="relative"][class*="h-"]') || 
                             carouselContainer.querySelector('[class*="relative"][class*="flex"]');
      if (cardsContainer) {
        const cards = cardsContainer.querySelectorAll('[class*="absolute"]');
        cards.forEach((card) => {
          gsap.set(card, {
            opacity: 0,
            y: 50,
            scale: 0.9,
          });
        });
      }
    }

    if (mobileGrid) {
      const gridCards = Array.from(mobileGrid.children);
      gridCards.forEach((card) => {
        const motionDiv = card.querySelector('div') || card;
        gsap.set(motionDiv, {
          opacity: 0,
          y: 30,
          scale: 0.95,
        });
      });
    }

    const carouselAnimations: gsap.core.Tween[] = [];
    const mobileAnimations: gsap.core.Tween[] = [];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (!hasAnimated) {
              hasAnimated = true;

              if (carouselContainer) {
                const cardsContainer = carouselContainer.querySelector('[class*="relative"][class*="h-"]') || 
                                       carouselContainer.querySelector('[class*="relative"][class*="flex"]');
                if (cardsContainer) {
                  const cards = cardsContainer.querySelectorAll('[class*="absolute"]');
                  cards.forEach((card, idx) => {
                    const anim = gsap.to(card, {
                      opacity: 1,
                      y: 0,
                      scale: 1,
                      duration: 0.6,
                      delay: idx * 0.15,
                      ease: "power2.out",
                    });
                    carouselAnimations.push(anim);
                  });
                }
              }

              if (mobileGrid) {
                const gridCards = Array.from(mobileGrid.children);
                gridCards.forEach((card, idx) => {
                  const motionDiv = card.querySelector('div') || card;
                  const anim = gsap.to(motionDiv, {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 0.5,
                    delay: idx * 0.1,
                    ease: "power2.out",
                  });
                  mobileAnimations.push(anim);
                });
              }
            }
          } else if (!entry.isIntersecting && hasAnimated) {
            const totalAnimations = carouselAnimations.length + mobileAnimations.length;
            let completedReversals = 0;
            
            const resetState = () => {
              hasAnimated = false;
              if (carouselContainer) {
                const cardsContainer = carouselContainer.querySelector('[class*="relative"][class*="h-"]') || 
                                       carouselContainer.querySelector('[class*="relative"][class*="flex"]');
                if (cardsContainer) {
                  const cards = cardsContainer.querySelectorAll('[class*="absolute"]');
                  cards.forEach((card) => {
                    gsap.set(card, {
                      opacity: 0,
                      y: 50,
                      scale: 0.9,
                    });
                  });
                }
              }
              if (mobileGrid) {
                const gridCards = Array.from(mobileGrid.children);
                gridCards.forEach((card) => {
                  const motionDiv = card.querySelector('div') || card;
                  gsap.set(motionDiv, {
                    opacity: 0,
                    y: 30,
                    scale: 0.95,
                  });
                });
              }
              carouselAnimations.length = 0;
              mobileAnimations.length = 0;
            };
            
            carouselAnimations.forEach((anim, idx) => {
              gsap.to(anim.targets(), {
                opacity: 0,
                y: 50,
                scale: 0.9,
                duration: 0.5,
                ease: "power2.in",
                delay: idx * 0.1,
                onComplete: () => {
                  completedReversals++;
                  if (completedReversals === totalAnimations) {
                    resetState();
                  }
                }
              });
            });
            mobileAnimations.forEach((anim, idx) => {
              gsap.to(anim.targets(), {
                opacity: 0,
                y: 30,
                scale: 0.95,
                duration: 0.4,
                ease: "power2.in",
                delay: idx * 0.05,
                onComplete: () => {
                  completedReversals++;
                  if (completedReversals === totalAnimations) {
                    resetState();
                  }
                }
              });
            });
          }
        });
      },
      { threshold: 0.2, rootMargin: "0px 0px -100px 0px" }
    );

    observer.observe(section);

    return () => {
      observer.unobserve(section);
    };
  }, []);

  useEffect(() => {
    if (!ctaSectionRef.current) return;

    const section = ctaSectionRef.current;
    const paragraph = section.querySelector('p');
    const buttons = section.querySelectorAll('a');
    let hasAnimated = false;
    const ctaAnimations: gsap.core.Tween[] = [];
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (!hasAnimated) {
              hasAnimated = true;
              
              const headingContainer = section.querySelector('div.flex.flex-col.items-center');
              if (headingContainer) {
                const readyBox = headingContainer.querySelector('[data-cta-text="ready"]') as HTMLElement;
                const makeBox = headingContainer.querySelector('[data-cta-text="make"]') as HTMLElement;
                
                if (readyBox && makeBox) {
                  gsap.set(readyBox, {
                    y: -100,
                    opacity: 0,
                    scale: 0.8,
                  });
                  
                  gsap.set(makeBox, {
                    y: -150,
                    opacity: 0,
                    scale: 0.8,
                    rotation: -5,
                  });
                  
                  const readyAnim = gsap.to(readyBox, {
                    y: 0,
                    opacity: 1,
                    scale: 1,
                    duration: 0.8,
                    ease: "back.out(1.7)",
                  });
                  ctaAnimations.push(readyAnim);
                  
                  const makeAnim = gsap.to(makeBox, {
                    y: 0,
                    opacity: 1,
                    scale: 1,
                    rotation: 0,
                    duration: 0.9,
                    ease: "back.out(1.7)",
                    delay: 0.4,
                  });
                  ctaAnimations.push(makeAnim);
                }
              }

              if (paragraph) {
                const paraAnim = gsap.fromTo(
                  paragraph,
                  {
                    opacity: 0,
                    y: 20,
                  },
                  {
                    opacity: 0.9,
                    y: 0,
                    duration: 0.8,
                    delay: 0.2,
                    ease: "power2.out",
                  }
                );
                ctaAnimations.push(paraAnim);
              }

              if (buttons.length > 0) {
                const buttonAnim = gsap.fromTo(
                  Array.from(buttons),
                  {
                    opacity: 0,
                    y: 20,
                    scale: 0.9,
                  },
                  {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 0.6,
                    delay: 0.4,
                    stagger: 0.15,
                    ease: "back.out(1.7)",
                  }
                );
                ctaAnimations.push(buttonAnim);
              }
            }
          } else if (!entry.isIntersecting && hasAnimated) {
            const headingContainer = section.querySelector('div.flex.flex-col.items-center');
            if (headingContainer) {
              const readyBox = headingContainer.querySelector('[data-cta-text="ready"]') as HTMLElement;
              const makeBox = headingContainer.querySelector('[data-cta-text="make"]') as HTMLElement;
              
              if (readyBox && makeBox) {
                gsap.to(readyBox, {
                  y: -100,
                  opacity: 0,
                  scale: 0.8,
                  duration: 0.6,
                  ease: "power2.in",
                });
                
                gsap.to(makeBox, {
                  y: -150,
                  opacity: 0,
                  scale: 0.8,
                  rotation: -5,
                  duration: 0.7,
                  ease: "power2.in",
                  delay: 0.2,
                });
              }
            }
            
            if (paragraph) {
              gsap.to(paragraph, {
                opacity: 0,
                y: 20,
                duration: 0.5,
                ease: "power2.in",
              });
            }
            
            Array.from(buttons).forEach((btn) => {
              gsap.to(btn, {
                opacity: 0,
                y: 20,
                scale: 0.9,
                duration: 0.4,
                ease: "power2.in",
              });
            });
            
            const reversalDelay = Math.max(
              buttons.length * 0.05,
              0.7 
            );
            
            setTimeout(() => {
              hasAnimated = false;
              const headingContainer = section.querySelector('div.flex.flex-col.items-center');
              if (headingContainer) {
                const readyBox = headingContainer.querySelector('[data-cta-text="ready"]') as HTMLElement;
                const makeBox = headingContainer.querySelector('[data-cta-text="make"]') as HTMLElement;
                
                if (readyBox && makeBox) {
                  gsap.set(readyBox, {
                    y: -100,
                    opacity: 0,
                    scale: 0.8,
                  });
                  
                  gsap.set(makeBox, {
                    y: -150,
                    opacity: 0,
                    scale: 0.8,
                    rotation: -5,
                  });
                }
              }
              
              if (paragraph) {
                gsap.set(paragraph, {
                  opacity: 0,
                  y: 20,
                });
              }
              
              Array.from(buttons).forEach((btn) => {
                gsap.set(btn, {
                  opacity: 0,
                  y: 20,
                  scale: 0.9,
                });
              });
              
              ctaAnimations.length = 0;
            }, reversalDelay * 1000);
          }
        });
      },
      { threshold: 0.3 }
    );

    observer.observe(section);

    return () => {
      observer.unobserve(section);
    };
  }, []);

  // Scroll to top button visibility - show only after passing the CTA section
  useEffect(() => {
    const handleScroll = () => {
      if (!ctaSectionRef.current) return;
      
      const ctaSection = ctaSectionRef.current;
      const ctaRect = ctaSection.getBoundingClientRect();
      const scrollPosition = window.scrollY + window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      
      // Show button if:
      // 1. User has scrolled past the CTA section (bottom of CTA is above viewport), OR
      // 2. User is within 200px of the bottom of the page
      const hasPassedCTA = ctaRect.bottom < 0;
      const isNearBottom = scrollPosition >= documentHeight - 200;
      
      setShowScrollToTop(hasPassedCTA || isNearBottom);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Check initial position

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const mockFeaturedCSPs = [
    {
      id: "1",
      title: "Beach Cleanup Drive",
      organisation: "Green Singapore",
      location: "East Coast Park",
      category: "Environment",
      type: "local",
      startDate: "2025-03-15",
      endDate: "2025-03-15",
      duration: "4h, One-time",
      serviceHours: 8,
      maxVolunteers: 50,
      currentVolunteers: 32,
      isRemote: false,
      status: "open",
      applicationDeadline: "2025-03-10",
      description: "Join us for a beach cleanup initiative to keep Singapore's coastline clean and beautiful. Help remove litter and debris while raising awareness about marine conservation.",
      skills: ["Teamwork", "Physical Activity", "Outdoor", "Environmental Awareness"],
      tags: ["Environment", "Beach", "Cleanup", "Conservation"]
    },
    {
      id: "2", 
      title: "Mangrove Restoration",
      organisation: "Nature Society Singapore",
      location: "Sungei Buloh",
      category: "Environment",
      type: "local",
      startDate: "2025-03-20",
      endDate: "2025-06-20",
      duration: "3h, Monthly",
      serviceHours: 30,
      maxVolunteers: 30,
      currentVolunteers: 18,
      isRemote: false,
      status: "open",
      applicationDeadline: "2025-03-15",
      description: "Help restore and protect Singapore's mangrove ecosystems. Participate in planting mangroves, monitoring growth, and learning about coastal biodiversity.",
      skills: ["Physical Activity", "Environmental Awareness", "Teamwork", "Outdoor"],
      tags: ["Environment", "Mangrove", "Conservation", "Biodiversity"]
    },
    {
      id: "3",
      title: "Recycling Education Booth",
      organisation: "Zero Waste SG",
      location: "Various Locations",
      category: "Environment",
      type: "local",
      startDate: "2025-03-01",
      endDate: "2025-08-31",
      duration: "2h, Weekly",
      serviceHours: 40,
      maxVolunteers: 20,
      currentVolunteers: 12,
      isRemote: false,
      status: "open",
      applicationDeadline: "2025-02-25",
      description: "Educate the public about recycling practices and waste reduction. Set up booths at community events and help people understand proper waste sorting.",
      skills: ["Communication", "Teaching", "Environmental Awareness", "Public Speaking"],
      tags: ["Environment", "Recycling", "Education", "Sustainability"]
    },
    {
      id: "4",
      title: "Virtual Mentoring Program",
      organisation: "Youth Connect",
      location: "Remote",
      category: "Mentoring",
      type: "local",
      startDate: "2025-03-01",
      endDate: "2025-08-31",
      duration: "1h, Weekly",
      serviceHours: 60,
      maxVolunteers: 25,
      currentVolunteers: 20,
      isRemote: true,
      status: "open",
      applicationDeadline: "2025-02-25",
      description: "Provide virtual mentorship to at-risk youth through online sessions and activities. Help guide young people in their academic and personal development.",
      skills: ["Mentoring", "Communication", "Leadership", "Active Listening"],
      tags: ["Mentoring", "Youth", "Virtual", "Education"]
    },
    {
      id: "5",
      title: "Career Readiness Workshops",
      organisation: "SkillsFuture SG",
      location: "Various Locations",
      category: "Mentoring",
      type: "local",
      startDate: "2025-03-10",
      endDate: "2025-07-10",
      duration: "3h, Biweekly",
      serviceHours: 35,
      maxVolunteers: 15,
      currentVolunteers: 8,
      isRemote: false,
      status: "open",
      applicationDeadline: "2025-03-05",
      description: "Conduct workshops to help job seekers develop essential career skills including resume writing, interview techniques, and professional networking.",
      skills: ["Teaching", "Communication", "Career Counseling", "Public Speaking"],
      tags: ["Mentoring", "Career", "Workshop", "Education"]
    },
    {
      id: "6",
      title: "Animal Shelter Volunteering",
      organisation: "SPCA Singapore",
      location: "Sungei Tengah",
      category: "Animal Welfare",
      type: "local",
      startDate: "2025-03-01",
      endDate: "2025-06-30",
      duration: "2h, Weekly",
      serviceHours: 45,
      maxVolunteers: 40,
      currentVolunteers: 28,
      isRemote: false,
      status: "open",
      applicationDeadline: "2025-02-25",
      description: "Help care for abandoned and rescued animals. Assist with feeding, cleaning, walking dogs, socializing cats, and supporting adoption events.",
      skills: ["Animal Care", "Compassion", "Physical Activity", "Teamwork"],
      tags: ["Animal Welfare", "Shelter", "Pets", "Compassion"]
    },
    // Overseas Projects
    {
      id: "7",
      title: "Cambodia School Building Project",
      organisation: "Habitat for Humanity",
      location: "Siem Reap, Cambodia",
      category: "Community",
      type: "overseas",
      startDate: "2025-06-01",
      endDate: "2025-06-14",
      duration: "Full day, 2 weeks",
      serviceHours: 100,
      maxVolunteers: 20,
      currentVolunteers: 12,
      isRemote: false,
      status: "open",
      applicationDeadline: "2025-04-01",
      description: "Help build classrooms and facilities for underprivileged children in rural Cambodia. Make a lasting impact on education infrastructure.",
      skills: ["Construction", "Teamwork", "Physical Fitness", "Adaptability"],
      tags: ["Overseas", "Construction", "Education", "Cambodia"]
    },
    {
      id: "8",
      title: "Vietnam Community Teaching Program",
      organisation: "Global Education Initiative",
      location: "Ho Chi Minh City, Vietnam",
      category: "Mentoring",
      type: "overseas",
      startDate: "2025-07-05",
      endDate: "2025-07-19",
      duration: "Full day, 2 weeks",
      serviceHours: 120,
      maxVolunteers: 15,
      currentVolunteers: 8,
      isRemote: false,
      status: "open",
      applicationDeadline: "2025-05-01",
      description: "Teach English and basic computer skills to children in underserved communities. Experience Vietnamese culture while making a difference.",
      skills: ["Teaching", "Communication", "Patience", "Cultural Sensitivity"],
      tags: ["Overseas", "Teaching", "Education", "Vietnam"]
    },
    {
      id: "9",
      title: "Thailand Elephant Conservation",
      organisation: "Wildlife Conservation Network",
      location: "Chiang Mai, Thailand",
      category: "Animal Welfare",
      type: "overseas",
      startDate: "2025-03-20",
      endDate: "2025-08-20",
      duration: "2h, Weekly",
      serviceHours: 50,
      maxVolunteers: 30,
      currentVolunteers: 15,
      isRemote: false,
      status: "open",
      applicationDeadline: "2025-02-15",
      description: "Work with rescued elephants in an ethical sanctuary. Learn about conservation efforts and help care for these magnificent animals.",
      skills: ["Animal Care", "Physical Fitness", "Observation", "Compassion"],
      tags: ["Overseas", "Wildlife", "Conservation", "Thailand"]
    },
    {
      id: "10",
      title: "Indonesia Disaster Relief Support",
      organisation: "Red Cross International",
      location: "Jakarta, Indonesia",
      category: "Community",
      type: "overseas",
      startDate: "2025-05-15",
      endDate: "2025-05-29",
      duration: "Full day, 2 weeks",
      serviceHours: 110,
      maxVolunteers: 25,
      currentVolunteers: 18,
      isRemote: false,
      status: "open",
      applicationDeadline: "2025-04-01",
      description: "Assist in disaster relief efforts and community rebuilding. Provide essential support to families affected by natural disasters.",
      skills: ["Crisis Management", "Teamwork", "Resilience", "First Aid"],
      tags: ["Overseas", "Disaster Relief", "Emergency", "Indonesia"]
    },
    {
      id: "11",
      title: "Nepal Mountain School Renovation",
      organisation: "Education Without Borders",
      location: "Pokhara, Nepal",
      category: "Environment",
      type: "overseas",
      startDate: "2025-08-01",
      endDate: "2025-08-21",
      duration: "Full day, 3 weeks",
      serviceHours: 150,
      maxVolunteers: 12,
      currentVolunteers: 5,
      isRemote: false,
      status: "open",
      applicationDeadline: "2025-06-01",
      description: "Renovate and improve school facilities in remote mountain villages. Experience Himalayan culture while supporting education.",
      skills: ["Construction", "Adaptability", "Physical Fitness", "Problem Solving"],
      tags: ["Overseas", "Education", "Construction", "Nepal"]
    }
  ];

  const categories = [
    { 
      value: "Community", 
      label: "Community",
      icon: Users,
      image: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=1920&h=1080&fit=crop&auto=format"
    },
    { 
      value: "Mentoring", 
      label: "Mentoring",
      icon: BookOpen,
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1920&h=1080&fit=crop&auto=format"
    },
    { 
      value: "Environment", 
      label: "Environment",
      icon: TreePine,
      image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1920&h=1080&fit=crop&auto=format"
    },
    { 
      value: "Elderly", 
      label: "Elderly",
      icon: Heart,
      image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1920&h=1080&fit=crop&auto=format"
    },
    { 
      value: "Arts & Culture", 
      label: "Arts & Culture",
      icon: Star,
      image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1920&h=1080&fit=crop&auto=format"
    },
    { 
      value: "Animal Welfare", 
      label: "Animal Welfare",
      icon: PawPrint,
      image: "https://images.unsplash.com/photo-1415369629372-26f2fe60c467?w=1920&h=1080&fit=crop&auto=format"
    },
    { 
      value: "Sports & Leisure", 
      label: "Sports & Leisure",
      icon: Trophy,
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1920&h=1080&fit=crop&auto=format"
    },
    { 
      value: "Coding", 
      label: "Coding",
      icon: Code,
      image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1920&h=1080&fit=crop&auto=format"
    }
  ];

  // Use real CSPs from API for local projects, filter for local and map to match structure
  const realFeaturedCSPs = discoverProjects
    .filter((project: any) => project.type === "local")
    .slice(0, 6)
    .map((project: any) => ({
      id: project.id,
      title: project.title,
      organisation: project.organisation,
      location: project.isRemote ? "Remote" : (project.location || project.district || "—"),
      category: project.category || "Community",
      type: project.type,
      startDate: project.startDate,
      endDate: project.endDate,
      duration: project.serviceHours ? `${project.serviceHours}h` : "",
      serviceHours: project.serviceHours || 0,
      maxVolunteers: project.maxVolunteers || 0,
      currentVolunteers: project.currentVolunteers || 0,
      isRemote: project.isRemote || false,
      status: project.status || "open",
      applicationDeadline: project.applicationDeadline,
      description: project.description || "",
      skills: project.skills || [],
      tags: project.tags || [],
    }));

  // Fallback to mock data if no real CSPs available
  const featuredCSPs = realFeaturedCSPs.length > 0 ? realFeaturedCSPs : mockFeaturedCSPs;

  // Filter CSPs based on search, category, and type
  const filteredFeaturedCSPs = featuredCSPs.filter((csp: any) => {
    const matchesCategory = selectedCategory === "all" || csp.category === selectedCategory;
    const matchesType = selectedType === "all" || (csp as any).type === selectedType;
    
    if (searchQuery === "") return matchesCategory && matchesType;
    
    const query = searchQuery.toLowerCase();
    const matchesSearch = 
      csp.title.toLowerCase().includes(query) ||
      csp.organisation.toLowerCase().includes(query) ||
      csp.location.toLowerCase().includes(query) ||
      csp.category.toLowerCase().includes(query) ||
      csp.description.toLowerCase().includes(query) ||
      csp.skills.some((skill: string) => skill.toLowerCase().includes(query)) ||
      csp.tags.some((tag: string) => tag.toLowerCase().includes(query));
    
    return matchesCategory && matchesType && matchesSearch;
  });

  // Carousel auto-rotation - infinite loop, move to next item every 7 seconds
  useEffect(() => {
    if (filteredFeaturedCSPs.length === 0) return;
    
    const carouselInterval = setInterval(() => {
      setCarouselIndex((prev) => {
        // Infinite loop: wrap around to 0 when reaching the end
        return (prev + 1) % filteredFeaturedCSPs.length;
      });
    }, 7000); // 7 seconds

    return () => clearInterval(carouselInterval);
  }, [filteredFeaturedCSPs.length]);

  // Show 3 cards at a time, centered around carouselIndex (infinite loop)
  const getVisibleIndices = () => {
    if (filteredFeaturedCSPs.length === 0) return [];
    if (filteredFeaturedCSPs.length === 1) return [0, 0, 0];
    if (filteredFeaturedCSPs.length === 2) {
      // For 2 items, show: [1, 0, 1] or [0, 1, 0]
      const prev = (carouselIndex - 1 + 2) % 2;
      const curr = carouselIndex;
      const next = (carouselIndex + 1) % 2;
      return [prev, curr, next];
    }
    
    // For 3+ items, infinite loop with wrapping
    const prev = (carouselIndex - 1 + filteredFeaturedCSPs.length) % filteredFeaturedCSPs.length;
    const curr = carouselIndex;
    const next = (carouselIndex + 1) % filteredFeaturedCSPs.length;
    
    return [prev, curr, next];
  };

  const handlePrevious = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    
    setSlideOffset(1);
    
    setTimeout(() => {
      setCarouselIndex((prev) => (prev - 1 + filteredFeaturedCSPs.length) % filteredFeaturedCSPs.length);
      setSlideOffset(0);
      setTimeout(() => setIsTransitioning(false), 50);
    }, 700);
  };

  const handleNext = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    
    setSlideOffset(-1);
    
    setTimeout(() => {
      setCarouselIndex((prev) => (prev + 1) % filteredFeaturedCSPs.length);
      setSlideOffset(0);
      setTimeout(() => setIsTransitioning(false), 50);
    }, 700);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section ref={heroRef} className="relative bg-gradient-to-br from-primary/10 via-accent/5 to-secondary/10 h-[93vh] lg:h-screen flex items-center justify-center overflow-hidden py-0">
        <MovingBackground heroRef={heroRef} />
        <div className="container mx-auto px-8 md:px-12 lg:px-16 xl:px-4 relative z-10 w-full py-0 pt-0">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h1 
              className="font-heading text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-foreground mb-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              onAnimationComplete={() => {
                // Start GSAP animations after framer-motion completes
                if (smunityRef.current) {
                  // Gradient reveal animation (left to right) using clip-path
                  gsap.fromTo(
                    smunityRef.current,
                    {
                      clipPath: "polygon(0 0, 0 0, 0 100%, 0 100%)",
                    },
                    {
                      clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
                      duration: 1.2,
                      ease: "power2.out",
                    }
                  );

                  // Wiggle animation - starts after gradient reveal
                  gsap.delayedCall(1.5, () => {
                    const wiggleTimeline = gsap.timeline({ repeat: -1, repeatDelay: 3 });
                    wiggleTimeline.to(smunityRef.current, {
                      rotation: 2,
                      duration: 0.1,
                      ease: "power2.inOut",
                    });
                    wiggleTimeline.to(smunityRef.current, {
                      rotation: -2,
                      duration: 0.1,
                      ease: "power2.inOut",
                    });
                    wiggleTimeline.to(smunityRef.current, {
                      rotation: 1,
                      duration: 0.1,
                      ease: "power2.inOut",
                    });
                    wiggleTimeline.to(smunityRef.current, {
                      rotation: 0,
                      duration: 0.1,
                      ease: "power2.inOut",
                    });
                  });
                }
              }}
            >
              Find Your Perfect{" "}
              <motion.span 
                style={{ color: 'oklch(0.45 0.15 200)' }}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                Community Service
              </motion.span>
              {" "}Project with{" "}
              <span 
                className="inline-flex items-center relative group cursor-pointer"
                onClick={() => navigate({ to: "/discover" })}
              >
                <span
                  ref={smunityRef}
                  className="text-gradient-smunity inline-block transition-transform hover:scale-105" 
                  style={{ clipPath: "polygon(0 0, 0 0, 0 100%, 0 100%)" }}
                >
                  SMUnity
              </span>
                <span className="ml-1 -mt-8 opacity-0 group-hover:opacity-100 transition-all duration-200 group-hover:scale-110 pointer-events-none z-10">
                  <span className="relative flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 rounded-full p-[2px]" style={{ 
                    background: "linear-gradient(135deg, #2563eb 0%, #10b981 100%)"
                  }}>
                    <span className="w-full h-full flex items-center justify-center rounded-full bg-transparent">
                      <ArrowUpRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-white" />
                    </span>
                  </span>
                </span>
              </span>
            </motion.h1>
            <motion.p 
              className="text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground font-body mb-8 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              Connect with meaningful volunteer opportunities that align with your interests, 
              schedule, and SMU graduation requirements
            </motion.p>
            
            {/* Search Bar */}
            <motion.div 
              className="max-w-3xl mx-auto mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <div className="relative">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search for CSPs, organisations, or skills..."
                  className="pl-12 pr-20 sm:pr-24 md:pr-28 py-4 text-base sm:text-lg h-14 rounded-xl border-2 bg-background/95 backdrop-blur-sm shadow-lg focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 placeholder:opacity-100 focus:placeholder:opacity-0 transition-all placeholder:text-sm sm:placeholder:text-base"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      navigate({ to: "/discover", search: { q: searchQuery } });
                    }
                  }}
                  onFocus={(e) => e.target.placeholder = ""}
                  onBlur={(e) => e.target.placeholder = "Search for CSPs, organisations, or skills..."}
                />
                <Button 
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-10 px-4 sm:px-6 text-sm sm:text-base"
                  onClick={() => {
                    // Navigate to Discover page with search query
                    navigate({ to: "/discover", search: { q: searchQuery } });
                  }}
                >
                  <span className="hidden sm:inline">Search</span>
                  <Search className="h-4 w-4 sm:hidden" />
                </Button>
              </div>
            </motion.div>

            {/* Quick Stats */}
            <motion.div 
              ref={statsRef} 
              className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <div className="text-center">
                <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-primary font-heading">{countCSPs}+</div>
                <div className="text-xs sm:text-sm md:text-base text-muted-foreground font-body">Active CSPs</div>
              </div>
              <div className="text-center">
                <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-[#10b981] font-heading">{countPartners}+</div>
                <div className="text-xs sm:text-sm md:text-base text-muted-foreground font-body">Partner Organisations</div>
              </div>
              <div className="text-center">
                <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-primary font-heading">{countCountries}</div>
                <div className="text-xs sm:text-sm md:text-base text-muted-foreground font-body">Countries</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* About SMUnity Section */}
      <section ref={aboutSectionRef} id="about" className="pt-16 pb-20 md:pb-24 lg:pt-20 lg:pb-22 bg-background lg:flex items-center">
        <div className="container mx-auto px-8 md:px-12 lg:px-16 xl:px-4 max-w-7xl w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 lg:gap-20 items-center">
            {/* Left side - Heading and Description */}
          <div className="space-y-6">
              <motion.h2 
                className="font-heading text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground"
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6 }}
                onAnimationComplete={() => {
                  if (smuRef.current && communityRef.current) {
                    gsap.fromTo(
                      [smuRef.current, communityRef.current],
                      {
                        clipPath: "polygon(0 0, 0 0, 0 100%, 0 100%)",
                      },
                      {
                        clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
                        duration: 1.2,
                        ease: "power2.out",
                        stagger: 0.4,
                      }
                    );

                    gsap.delayedCall(1.8, () => {
                      const wiggleTimeline = gsap.timeline({ repeat: -1, repeatDelay: 3 });
                      wiggleTimeline.to([smuRef.current, communityRef.current], {
                        rotation: 2,
                        duration: 0.1,
                        ease: "power2.inOut",
                      });
                      wiggleTimeline.to([smuRef.current, communityRef.current], {
                        rotation: -2,
                        duration: 0.1,
                        ease: "power2.inOut",
                      });
                      wiggleTimeline.to([smuRef.current, communityRef.current], {
                        rotation: 1,
                        duration: 0.1,
                        ease: "power2.inOut",
                      });
                      wiggleTimeline.to([smuRef.current, communityRef.current], {
                        rotation: 0,
                        duration: 0.1,
                        ease: "power2.inOut",
                      });
                    });
                  }
                }}
              >
                Connecting <span ref={smuRef} className="text-gradient-smunity inline-block" style={{ clipPath: "polygon(0 0, 0 0, 0 100%, 0 100%)" }}>SMU</span> with the{" "}
                <span ref={communityRef} className="text-gradient-smunity inline-block" style={{ clipPath: "polygon(0 0, 0 0, 0 100%, 0 100%)" }}>Community</span>
              </motion.h2>
              <motion.p 
                className="text-sm sm:text-base md:text-lg lg:text-xl text-muted-foreground font-body leading-relaxed"
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                Finding a volunteer cause should not be complicated. SMUnity aims to brings all your community service needs into <strong className="text-foreground">one centralised, seamless platform</strong>. Discover verified local and overseas projects, submit instant applications, and make an impact while completing CSU requirements all within SMUnity! 
              </motion.p>
                </div>

            {/* Right side - Feature Cards (staggered on scroll) */}
            <div className="space-y-16 md:space-y-24">
              {/* Find Your Match */}
              <motion.div 
                className="space-y-4 text-center md:text-left"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, margin: "-200px 0px -200px 0px", amount: 0.3 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                <div className="flex items-center gap-4 justify-center md:justify-start">
                  <div className="w-14 h-14 bg-gradient-to-br from-[#2563eb] to-[#10b981] rounded-full flex items-center justify-center flex-shrink-0">
                    <Search className="h-7 w-7 text-white" />
              </div>
                  <h3 className="font-heading font-semibold text-lg sm:text-xl md:text-2xl">Find Your Match</h3>
                </div>
                <p className="text-sm sm:text-base md:text-lg text-muted-foreground font-body leading-relaxed">
                  Filter by category, location, and duration to find opportunities that fit you. Browse through verified local and overseas projects, and search by skills or interests.
                </p>
              </motion.div>

              {/* Apply with Ease */}
              <motion.div 
                className="space-y-4 text-center md:text-left"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, margin: "-200px 0px -200px 0px", amount: 0.3 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                <div className="flex items-center gap-4 justify-center md:justify-start">
                  <div className="w-14 h-14 bg-gradient-to-br from-[#2563eb] to-[#10b981] rounded-full flex items-center justify-center flex-shrink-0">
                    <Target className="h-7 w-7 text-white" />
              </div>
                  <h3 className="font-heading font-semibold text-lg sm:text-xl md:text-2xl">Apply with Ease</h3>
                </div>
                <p className="text-sm sm:text-base md:text-lg text-muted-foreground font-body leading-relaxed">
                  Submit applications instantly and track your status in real-time. Fill out your motivation, highlight your relevant skills, and receive instant confirmation when organisations respond.
                </p>
              </motion.div>

              {/* Make an Impact */}
              <motion.div 
                className="space-y-4 text-center md:text-left"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, margin: "-200px 0px -200px 0px", amount: 0.3 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                <div className="flex items-center gap-4 justify-center md:justify-start">
                  <div className="w-14 h-14 bg-gradient-to-br from-[#2563eb] to-[#10b981] rounded-full flex items-center justify-center flex-shrink-0">
                    <HeartHandshake className="h-7 w-7 text-white" />
              </div>
                  <h3 className="font-heading font-semibold text-lg sm:text-xl md:text-2xl">Make an Impact</h3>
                </div>
                <p className="text-sm sm:text-base md:text-lg text-muted-foreground font-body leading-relaxed">
                  Contribute meaningfully to your community and see the real-world difference you're making. Participate in impactful projects while ensuring you meet your CSU requirements.
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <AnimatedSection>
        <section 
          ref={categoriesSectionRef} 
          className="py-16 md:py-20 relative overflow-hidden"
        >
          {/* Blurred background image layer */}
          <div
            className="absolute inset-0 transition-all duration-700"
            style={{
              backgroundImage: hoveredCategory 
                ? `url(${categories.find(c => c.value === hoveredCategory)?.image})`
                : undefined,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              filter: hoveredCategory ? 'blur(12px)' : 'none',
              transform: hoveredCategory ? 'scale(1.1)' : 'scale(1)',
              opacity: hoveredCategory ? 1 : 0,
              transition: 'opacity 0.7s ease, filter 0.7s ease, transform 0.7s ease',
            }}
          />
          
          {/* Default background when no hover */}
          <div 
            className="absolute inset-0 bg-muted/30 transition-opacity duration-700"
            style={{
              opacity: hoveredCategory ? 0 : 1,
            }}
          />
          
          {/* Background overlay that changes opacity based on hover */}
          <div 
            className="absolute inset-0 transition-opacity duration-700"
            style={{
              backgroundColor: hoveredCategory ? 'rgba(0, 0, 0, 0.6)' : 'transparent',
            }}
          />
          
          <div className="container mx-auto px-8 md:px-12 lg:px-16 xl:px-4 relative z-10">
          <div className="text-center mb-12">
              <h2 className={`font-heading text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 transition-colors duration-700 ${
                hoveredCategory ? 'text-white drop-shadow-lg' : 'text-foreground'
              }`}>
              Browse by Category
            </h2>
              <p className={`text-sm sm:text-base md:text-lg font-body transition-colors duration-700 ${
                hoveredCategory ? 'text-white/90 drop-shadow-md' : 'text-muted-foreground'
              }`}>
              Find projects that match your interests and passion
            </p>
          </div>
          
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 max-w-7xl mx-auto">
              {categories.map((category, idx) => {
                const IconComponent = category.icon;
                const isHovered = hoveredCategory === category.value;
                const isOtherHovered = hoveredCategory !== null && hoveredCategory !== category.value;
                
                return (
                  <div
                key={category.value}
                    ref={(el) => {
                      categoryCardsRef.current[idx] = el;
                    }}
                    className={`relative cursor-pointer group px-1 lg:px-2 overflow-hidden rounded-lg transition-opacity duration-700 ${
                      isOtherHovered ? 'opacity-0 pointer-events-none' : 'opacity-100'
                    } ${isHovered ? 'z-20' : ''}`}
                    style={{ perspective: "1000px" }}
                    onMouseEnter={() => {
                      setHoveredCategory(category.value);
                    }}
                    onMouseLeave={() => {
                      setHoveredCategory(null);
                    }}
                onClick={() => {
                  navigate({ to: "/discover", search: { category: category.value } });
                }}
              >
                  <div
                    data-card-inner
                    className="relative w-full h-full"
                    style={{ 
                      transformStyle: "preserve-3d"
                    }}
                  >
                    {/* Front - Image */}
                    <div
                      data-card-front
                      className="absolute inset-0 w-full h-full rounded-lg overflow-hidden"
                      style={{
                        backfaceVisibility: "hidden",
                        WebkitBackfaceVisibility: "hidden",
                      }}
                    >
                      <div 
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                        style={{ backgroundImage: `url(${category.image})` }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                </div>

                    {/* Back - Icon and Label */}
                    <div
                      data-card-back
                      className="absolute inset-0 w-full h-full rounded-lg flex flex-col items-center justify-center bg-background p-3 border-2 border-primary/20"
                      style={{
                        backfaceVisibility: "hidden",
                        WebkitBackfaceVisibility: "hidden",
                        transform: "rotateY(180deg)",
                      }}
                    >
                      <IconComponent className="h-8 w-8 sm:h-10 sm:w-10 text-primary mb-2" />
                      <span className="text-foreground text-xs sm:text-sm md:text-base font-semibold text-center">
                        {category.label}
                      </span>
                    </div>
                  </div>
                  
                  {/* Aspect ratio container */}
                  <div className="aspect-[4/3]" />
                </div>
              );
            })}
          </div>
        </div>
      </section>
      </AnimatedSection>

      {/* Featured CSPs Section */}
      <AnimatedSection>
        <section ref={featuredCSPsSectionRef} id="featured-csps" className="py-16 md:py-20 bg-gradient-to-br from-secondary/10 via-background to-primary/5">
        <div className="container mx-auto px-8 md:px-12 lg:px-16 xl:px-4 max-w-7xl">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-2">
                {searchQuery || selectedCategory !== "all" ? "Search Results" : "Featured CSPs"}
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-muted-foreground font-body">
                {searchQuery || selectedCategory !== "all" 
                  ? `Found ${filteredFeaturedCSPs.length} CSP${filteredFeaturedCSPs.length !== 1 ? 's' : ''}`
                  : "Discover popular and trending community service projects"
                }
              </p>
            </div>
            <Link to="/discover" className="group inline-block">
              <Button 
                variant="outline" 
                className="hidden md:flex transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg border-primary/20 group-hover:border-primary"
                style={{
                  '--hover-bg': 'hsl(var(--primary))',
                  '--hover-text': 'hsl(var(--primary-foreground))',
                } as React.CSSProperties}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'hsl(var(--primary))';
                  e.currentTarget.style.color = 'hsl(var(--primary-foreground))';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '';
                  e.currentTarget.style.color = '';
                }}
              >
                View All CSPs
                <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>

          {/* Local/Overseas Filter */}
          <div className="flex justify-center mb-6">
            <div className="inline-flex bg-muted/50 rounded-full p-0.5 gap-0.5">
              <button
                onClick={() => {
                  setSelectedType("local");
                  setCarouselIndex(0);
                }}
                className={`px-5 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${
                  selectedType === "local"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/80"
                }`}
              >
                Local
              </button>
              <button
                onClick={() => {
                  setSelectedType("overseas");
                  setCarouselIndex(0);
                }}
                className={`px-5 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${
                  selectedType === "overseas"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/80"
                }`}
              >
                Overseas
              </button>
            </div>
          </div>

          {/* Carousel Container */}
          <div className="relative">
            {/* Navigation Buttons - Desktop only */}
            {filteredFeaturedCSPs.length > 3 && (
              <>
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 z-10 h-12 w-12 rounded-full shadow-lg hidden lg:flex"
                  onClick={handlePrevious}
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 z-10 h-12 w-12 rounded-full shadow-lg hidden lg:flex"
                  onClick={handleNext}
                >
                  <ChevronRight className="h-6 w-6" />
                </Button>
              </>
            )}
            
            {/* Mobile/Tablet Grid - Below 992px */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:hidden">
              {filteredFeaturedCSPs.map((csp: any, idx: number) => {
                const isHiddenOnMobile = idx >= 3;
                const statusBadge = getStatusBadge(csp.status);
                const duration = (csp as any).duration || `${csp.serviceHours}h`;
                
                return (
                  <motion.div
                    key={csp.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                    whileHover={{ y: -5 }}
                    className={isHiddenOnMobile ? "hidden md:block" : ""}
                  >
                  <Card 
                    className="hover:shadow-lg transition-all duration-300 cursor-pointer group flex flex-col h-full"
                  >
                  <CardHeader>
                    <div className="flex justify-between items-start mb-2 gap-2">
                      <div className="flex flex-wrap gap-1">
                        <Badge className={`text-xs ${getCategoryColor(csp.category)}`}>
                          {csp.category}
                        </Badge>
                        <Badge className={`text-xs ${statusBadge.className}`}>
                          {statusBadge.label}
                        </Badge>
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0">
                        <Heart className="h-4 w-4" />
                      </Button>
                    </div>
                    <CardTitle className="font-heading text-lg group-hover:text-primary transition-colors">
                      {csp.title}
                    </CardTitle>
                    <CardDescription className="font-body">
                      {csp.organisation}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col justify-between gap-4">
                    <div className="space-y-3">
                      <p className="text-sm text-muted-foreground font-body line-clamp-2">
                        {csp.description}
                      </p>
                      
                      {/* Location + Duration Row */}
                      <div className="flex items-center justify-between gap-2 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-1 flex-1 min-w-0">
                          <MapPin className="h-4 w-4 flex-shrink-0" />
                          <span className="truncate">{csp.location}</span>
                        </div>
                        <div className="flex items-center space-x-1 flex-1 min-w-0">
                          <Clock className="h-4 w-4 flex-shrink-0" />
                          <span className="truncate">{duration}</span>
                        </div>
                      </div>

                      {/* Date + Volunteers Row */}
                      <div className="flex items-center justify-between gap-2 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-1 flex-1 min-w-0">
                          <Calendar className="h-4 w-4 flex-shrink-0" />
                          <span className="truncate">{formatDateRange(csp.startDate, csp.startDate)}</span>
                        </div>
                        <div className="flex items-center space-x-1 flex-1 min-w-0">
                          <Users className="h-4 w-4 flex-shrink-0" />
                          <span>{csp.currentVolunteers}/{csp.maxVolunteers}</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1">
                        {csp.skills.slice(0, window.innerWidth >= 1280 ? 3 : 2).map((skill: string) => (
                          <Badge key={skill} variant="outline" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                        {csp.skills.length > (window.innerWidth >= 1280 ? 3 : 2) && (
                          <Badge variant="outline" className="text-xs">
                            +{csp.skills.length - (window.innerWidth >= 1280 ? 3 : 2)}
                          </Badge>
                        )}
                      </div>
                    </div>

                    <Link to="/csp/$projectID" params={{ projectID: String(csp.id) }} search={{ from: undefined }}>
                      <Button className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        {csp.status === "full" || csp.status === "closed" ? "View Details" : "Apply Now"}
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
                </motion.div>
              );
            })}
            </div>

            {/* Desktop Carousel - 992px and above */}
            <div className="hidden lg:block relative py-6">
              <div className="relative w-full max-w-5xl mx-auto overflow-hidden">
                <div className="relative h-[390px] flex items-center justify-center">
                  {filteredFeaturedCSPs.map((csp: any, idx: number) => {
                    const visibleIndices = getVisibleIndices();
                    const position = visibleIndices.indexOf(idx);
                    
                    if (position === -1) return null;
                    
                    const statusBadge = getStatusBadge(csp.status);
                    const duration = (csp as any).duration || `${csp.serviceHours}h`;
                    
                    // Calculate position: -1 (left), 0 (center), 1 (right)
                    const relativePosition = position - 1;
                    
                    return (
                      <motion.div
                        key={csp.id}
                        className="absolute"
                        initial={false}
                        animate={{
                          x: (relativePosition + slideOffset) * 440,
                          scale: position === 1 ? 1 : 0.85,
                          opacity: position === 1 ? 1 : 0.6,
                        }}
                        transition={{
                          type: "spring",
                          stiffness: 100,
                          damping: 15,
                          duration: 0.7,
                        }}
                        style={{
                          zIndex: position === 1 ? 10 : 1
                        }}
                      >
                      <Card 
                        className="hover:shadow-lg cursor-pointer group flex flex-col w-[400px] h-[390px]"
                      >
                      <CardHeader>
                        <div className="flex justify-between items-start mb-2 gap-2">
                          <div className="flex flex-wrap gap-1">
                            <Badge className={`text-xs ${getCategoryColor(csp.category)}`}>
                              {csp.category}
                            </Badge>
                            <Badge className={`text-xs ${statusBadge.className}`}>
                              {statusBadge.label}
                            </Badge>
                          </div>
                          <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0">
                            <Heart className="h-4 w-4" />
                          </Button>
                        </div>
                        <CardTitle className="font-heading text-lg group-hover:text-primary transition-colors">
                          {csp.title}
                        </CardTitle>
                        <CardDescription className="font-body">
                          {csp.organisation}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="flex-1 flex flex-col justify-between gap-4">
                        <div className="space-y-3">
                          <p className="text-sm text-muted-foreground font-body line-clamp-2">
                            {csp.description}
                          </p>
                          
                          <div className="flex items-center justify-between gap-2 text-sm text-muted-foreground">
                            <div className="flex items-center space-x-1 flex-1 min-w-0">
                              <MapPin className="h-4 w-4 flex-shrink-0" />
                              <span className="truncate">{csp.location}</span>
                            </div>
                            <div className="flex items-center space-x-1 flex-1 min-w-0">
                              <Clock className="h-4 w-4 flex-shrink-0" />
                              <span className="truncate">{duration}</span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between gap-2 text-sm text-muted-foreground">
                            <div className="flex items-center space-x-1 flex-1 min-w-0">
                              <Calendar className="h-4 w-4 flex-shrink-0" />
                              <span className="truncate">{formatDateRange(csp.startDate, csp.startDate)}</span>
                            </div>
                            <div className="flex items-center space-x-1 flex-1 min-w-0">
                              <Users className="h-4 w-4 flex-shrink-0" />
                              <span>{csp.currentVolunteers}/{csp.maxVolunteers}</span>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-1">
                            {csp.skills.slice(0, 3).map((skill: string) => (
                              <Badge key={skill} variant="outline" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                            {csp.skills.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{csp.skills.length - 3}
                              </Badge>
                            )}
                          </div>
                        </div>

                        <Link to="/csp/$projectID" params={{ projectID: String(csp.id) }} search={{ from: undefined }}>
                          <Button className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                            {csp.status === "full" || csp.status === "closed" ? "View Details" : "Apply Now"}
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                    </motion.div>
                  );
                })}
                </div>
              </div>
            </div>
            
            {/* Carousel Indicators - Desktop only */}
            {filteredFeaturedCSPs.length > 3 && (
              <div className="hidden lg:flex justify-center gap-2">
                {filteredFeaturedCSPs.map((_: any, idx: number) => (
                  <button
                    key={idx}
                    className={`h-2 rounded-full transition-all ${
                      idx === carouselIndex 
                        ? 'w-8 bg-primary' 
                        : 'w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50'
                    }`}
                    onClick={() => {
                      if (!isTransitioning) {
                        setIsTransitioning(true);
                        setCarouselIndex(idx);
                        setTimeout(() => setIsTransitioning(false), 700);
                      }
                    }}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            )}
          </div>

          {filteredFeaturedCSPs.length === 0 && (
            <div className="text-center py-12">
              <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-heading text-lg font-semibold mb-2">No CSPs Found</h3>
              <p className="text-muted-foreground font-body mb-4">
                No community service projects match your search criteria.
              </p>
              <Button 
                variant="outline"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                  setSelectedType("local");
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}

          <div className="text-center mt-8 md:hidden">
            <Link to="/discover" className="group inline-block">
              <Button 
                variant="outline" 
                className="transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg border-primary/20 group-hover:border-primary"
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'hsl(var(--primary))';
                  e.currentTarget.style.color = 'hsl(var(--primary-foreground))';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '';
                  e.currentTarget.style.color = '';
                }}
              >
                View All CSPs
                <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
      </AnimatedSection>

      {/* CTA Section */}
      <section ref={ctaSectionRef} className="relative py-16 bg-primary text-primary-foreground overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {Array.from({ length: 6 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full opacity-10"
              style={{
                width: `${100 + i * 50}px`,
                height: `${100 + i * 50}px`,
                background: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)',
                left: `${(i * 20) % 100}%`,
                top: `${(i * 15 + 20) % 100}%`,
              }}
              animate={{
                y: [0, -30, 0],
                x: [0, 20, 0],
                scale: [1, 1.2, 1],
                opacity: [0.1, 0.2, 0.1],
              }}
              transition={{
                duration: 4 + i * 0.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.3,
              }}
            />
          ))}
        </div>

        <div className="container mx-auto px-8 md:px-12 lg:px-16 xl:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
            {/* Left Side - Boxes */}
            <div className="flex flex-col items-center md:items-start justify-center relative md:ml-0 lg:ml-8" style={{ minHeight: '180px' }}>
              {/* First Box - "Ready to" */}
              <div 
                className="px-4 py-2 sm:px-6 sm:py-3 md:px-8 md:py-4 lg:px-10 lg:py-5 xl:px-12 xl:py-6 rounded-xl bg-secondary text-secondary-foreground font-heading font-bold text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl relative z-10 shadow-lg"
                data-cta-text="ready"
              >
                Ready to
              </div>
              
              {/* Second Box - "Make a Difference?" - Overlaps below */}
              <div 
                className="px-4 py-2 sm:px-6 sm:py-3 md:px-8 md:py-4 lg:px-10 lg:py-5 xl:px-12 xl:py-6 rounded-xl bg-accent font-heading font-bold text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl relative -mt-2 sm:-mt-3 md:-mt-3 lg:-mt-4 -ml-2 sm:-ml-4 md:-ml-6 lg:-ml-8 xl:-ml-10 shadow-lg"
                data-cta-text="make"
              >
                <span className="text-gradient-smunity whitespace-nowrap">Make a Difference?</span>
              </div>
            </div>
            
            {/* Right Side - Description and Buttons */}
            <div className="text-center md:text-left md:mr-8 lg:mr-0">
              <p className="text-base sm:text-lg md:text-xl mb-8 max-w-none text-white">
            Join thousands of SMU students who are already making an impact in their communities. 
            Start your community service journey today!
          </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                <Link to="/discover" className="group">
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="relative text-primary font-semibold transition-all duration-300 group-hover:shadow-2xl group-hover:shadow-white/20 border-2 border-white bg-white group-hover:bg-white/95 px-4 py-3 sm:px-6 sm:py-4 md:px-8 md:py-5 lg:px-8 lg:py-6 text-sm sm:text-base md:text-lg overflow-hidden"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                Discover CSPs
                      <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 transition-transform duration-300 group-hover:translate-x-1" />
                    </span>
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-primary/20 via-accent/20 to-secondary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      initial={false}
                    />
              </Button>
            </Link>
                <Link to="/discover" className="group">
                  <Button 
                    size="lg" 
                    className="relative bg-secondary hover:bg-secondary/95 text-secondary-foreground font-semibold transition-all duration-300 group-hover:shadow-2xl group-hover:shadow-secondary/30 border-2 border-secondary/50 group-hover:border-secondary px-4 py-3 sm:px-6 sm:py-4 md:px-8 md:py-5 lg:px-8 lg:py-6 text-sm sm:text-base md:text-lg overflow-hidden group-hover:scale-105"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                Get Started
                      <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 transition-transform duration-300 group-hover:translate-x-1" />
                    </span>
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      initial={false}
                    />
              </Button>
            </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Scroll to Top Button */}
      <AnimatePresence>
        {showScrollToTop && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
          >
            <Button
              onClick={scrollToTop}
              size="icon"
              className="h-12 w-12 rounded-full shadow-lg bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-300 hover:scale-110"
              aria-label="Scroll to top"
            >
              <ArrowUp className="h-5 w-5" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

