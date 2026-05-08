import { PageTransition } from "@/components/layout/PageTransition";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Skills } from "@/components/sections/Skills";
import { Experience } from "@/components/sections/Experience";
import { Projects } from "@/components/sections/Projects";
import { Services } from "@/components/sections/Services";
import { Stats } from "@/components/sections/Stats";
import { Contact } from "@/components/sections/Contact";

export default function HomePage() {
  return (
    <PageTransition>
      <Hero />
      <About />
      <Skills />
      <Experience />
      <Projects />
      <Services />
      <Stats />
      <Contact />
    </PageTransition>
  );
}
