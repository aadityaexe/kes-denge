"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { Button } from "@/components/ui/Button";
import { staggerContainer, fadeInUp, fadeIn } from "@/lib/animations";
import { ArrowRight, CheckCircle2, Package } from "lucide-react";
import { Parallax } from "@/components/ui/Parallax";

interface ProductsSectionProps {
  productsData?: any[];
  showAll?: boolean;
  hideHeader?: boolean;
  className?: string;
}

export function ProductsSection({
  productsData = [],
  showAll = false,
  hideHeader = false,
  className = "",
}: ProductsSectionProps) {
  const { ref, isVisible } = useScrollReveal({ delay: 0.1 });
  
  const activeProducts = productsData.filter((p) => p.isActive !== false).sort((a, b) => (a.order || 0) - (b.order || 0));
  const displayedProducts = showAll ? activeProducts : activeProducts.slice(0, 3);

  if (activeProducts.length === 0) {
    return (
      <section id="products" className="section-padding bg-surface-1 border-t border-[var(--color-border)]">
        <div className="container-site text-center py-16">
          <Package className="w-12 h-12 text-text-muted mx-auto mb-4" />
          <h3 className="text-xl font-bold font-display text-text-primary mb-2">No platforms listed yet</h3>
          <p className="text-sm text-text-secondary max-w-md mx-auto">
            Our flagship products are currently being configured. Check back soon or contact us for custom engineering.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section
      id="products"
      className={`${className ? className : hideHeader ? "pb-16 md:pb-24 pt-4" : "section-padding"} bg-surface-1 border-t border-[var(--color-border)] relative overflow-hidden`}
    >
      {/* Background Parallax Layer */}
      <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
        <Parallax speed={0.8} className="absolute top-1/2 left-0 -translate-y-1/2 w-[50vw] h-[50vw] max-w-[700px] max-h-[700px] rounded-full bg-gradient-to-br from-[var(--color-accent)]/5 to-transparent blur-[120px]" />
      </div>

      <div className="container-site relative z-10">
        {!hideHeader && (
          <div ref={ref} className={`transition-all duration-[var(--transition-slow)] ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <SectionHeading
              title="Our Flagship Products"
              subtitle="Ready-to-deploy, scalable platforms that can be customized to fit your exact operational needs."
              badge="Solutions"
              align="left"
            />
          </div>
        )}

        <div className={`${hideHeader ? "mt-4" : "mt-8 md:mt-10"} flex flex-col gap-12 md:gap-16`}>
          {displayedProducts.map((product, index) => (
            <motion.div 
              key={product._id || product.id || product.slug || index}
              initial="hidden"
              whileInView="animate"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
              className={`flex flex-col ${index % 2 === 1 ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-8 lg:gap-14 items-center`}
            >
              {/* Product Info */}
              <div className="flex-1 w-full">
                <motion.div variants={fadeInUp} className="mb-4">
                  <span className="inline-block px-3 py-1 rounded-full bg-accent/10 text-accent-light text-[var(--text-caption)] font-semibold tracking-wide uppercase">
                    {product.category}
                  </span>
                </motion.div>
                
                <motion.h3 variants={fadeInUp} className="text-display-md font-bold mb-3 break-words">
                  {product.name}
                </motion.h3>
                
                <motion.p variants={fadeInUp} className="text-[var(--text-heading-sm)] text-text-secondary mb-4 font-medium break-words">
                  {product.tagline}
                </motion.p>
                
                <motion.p variants={fadeInUp} className="text-[var(--text-body-md)] text-text-secondary mb-6 leading-relaxed break-words">
                  {product.description}
                </motion.p>
                
                {product.features && product.features.length > 0 && (
                  <motion.ul variants={staggerContainer} className="flex flex-col gap-3 mb-8">
                    {product.features.slice(0, 4).map((feature: any, i: number) => {
                      const featureText = typeof feature === "string" ? feature : (feature.title || feature.description || "");
                      return (
                        <motion.li key={i} variants={fadeInUp} className="flex items-start gap-3">
                          <CheckCircle2 className="w-5 h-5 text-[var(--color-accent)] shrink-0 mt-0.5" />
                          <span className="text-[var(--text-body-sm)] text-text-primary break-words">{featureText}</span>
                        </motion.li>
                      );
                    })}
                  </motion.ul>
                )}
                
                <motion.div variants={fadeInUp}>
                  <Button href={`/products/${product.slug}`} className="group w-full sm:w-auto justify-center">
                    Explore Platform
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </motion.div>
              </div>
              
              {/* Product Visual Mockup */}
              <motion.div 
                variants={fadeIn}
                className="flex-1 w-full relative"
              >
                <Parallax speed={1.05} className="aspect-[4/3] rounded-[var(--radius-lg)] bg-surface-2 border border-[var(--color-border)] overflow-hidden relative group">
                  {product.images && product.images.length > 0 ? (
                    <Image 
                      src={product.images[0]} 
                      alt={`Architecture and user interface preview for ${product.name} enterprise platform`}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <>
                      <div className="absolute inset-0 bg-gradient-to-br from-surface-1 to-surface-2 opacity-50" />
                      <div className="absolute inset-x-3 sm:inset-x-8 -bottom-16 top-8 sm:top-16 bg-surface-1 rounded-t-[var(--radius-md)] border-x border-t border-[var(--color-border)] shadow-2xl overflow-hidden transition-transform duration-[var(--transition-normal)] group-hover:-translate-y-4">
                        <div className="h-10 sm:h-12 border-b border-[var(--color-border)] flex items-center px-3 sm:px-6 gap-2 sm:gap-4">
                          <div className="flex gap-1.5 sm:gap-2 shrink-0">
                            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-red-500/50" />
                            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-yellow-500/50" />
                            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-green-500/50" />
                          </div>
                          <div className="flex-1 h-5 sm:h-6 bg-surface-2 rounded-md mx-2 sm:mx-8" />
                        </div>
                        <div className="p-4 sm:p-8 flex gap-3 sm:gap-6 h-full">
                          <div className="w-1/4 h-full flex flex-col gap-2.5 sm:gap-4">
                            <div className="h-6 sm:h-8 bg-surface-2 rounded-md" />
                            <div className="h-6 sm:h-8 bg-surface-2 rounded-md" />
                            <div className="h-6 sm:h-8 bg-surface-2 rounded-md" />
                          </div>
                          <div className="flex-1 h-full flex flex-col gap-3 sm:gap-6">
                            <div className="h-1/3 bg-surface-1 rounded-[var(--radius-md)] border border-[var(--color-border)]" />
                            <div className="flex-1 flex gap-6">
                              <div className="flex-1 bg-surface-1 rounded-[var(--radius-md)] border border-[var(--color-border)]" />
                              <div className="flex-1 bg-surface-1 rounded-[var(--radius-md)] border border-[var(--color-border)]" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </Parallax>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
