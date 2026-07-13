/**
 * Side-effect barrel: importing this file loads every module component, each of
 * which self-registers into the registry (registerModule). PageComposition
 * imports this once before it maps composition keys → components.
 */
import "@/components/modules/Hero";
import "@/components/modules/KeyNumbers";
import "@/components/modules/Gallery";
import "@/components/modules/Location";
import "@/components/modules/Availability";
import "@/components/modules/Finishes";
import "@/components/modules/Developer";
import "@/components/modules/Investment";
import "@/components/modules/Faq";
import "@/components/modules/FinalCta";
