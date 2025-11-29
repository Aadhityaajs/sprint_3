
import React, { useState } from 'react';
import { Mail, Linkedin, Github, Award, Briefcase, GraduationCap, Code, Wrench, ChevronRight, ExternalLink, Menu, X } from 'lucide-react';

export default function Portfolio() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-sm shadow-sm z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="text-xl font-bold text-slate-800">Aadhityaa JS</div>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex space-x-8">
              <button onClick={() => scrollToSection('about')} className="text-slate-600 hover:text-slate-900 transition">About  .</button>
              <button onClick={() => scrollToSection('experience')} className="text-slate-600 hover:text-slate-900 transition">Experience  .</button>
              <button onClick={() => scrollToSection('projects')} className="text-slate-600 hover:text-slate-900 transition">Projects  .</button>
              <button onClick={() => scrollToSection('skills')} className="text-slate-600 hover:text-slate-900 transition">Skills  .</button>
              <button onClick={() => scrollToSection('contact')} className="text-slate-600 hover:text-slate-900 transition">Contact</button>
            </div>

            {/* Mobile Menu Button */}
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden">
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden pb-4 space-y-2">
              <button onClick={() => scrollToSection('about')} className="block w-full text-left px-4 py-2 text-slate-600 hover:bg-slate-50">About</button>
              <button onClick={() => scrollToSection('experience')} className="block w-full text-left px-4 py-2 text-slate-600 hover:bg-slate-50">Experience</button>
              <button onClick={() => scrollToSection('projects')} className="block w-full text-left px-4 py-2 text-slate-600 hover:bg-slate-50">Projects</button>
              <button onClick={() => scrollToSection('skills')} className="block w-full text-left px-4 py-2 text-slate-600 hover:bg-slate-50">Skills</button>
              <button onClick={() => scrollToSection('contact')} className="block w-full text-left px-4 py-2 text-slate-600 hover:bg-slate-50">Contact</button>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <h1 className="text-5xl sm:text-6xl font-bold text-slate-900 mb-4">
              Aadhityaa JS
            </h1>
            <p className="text-xl sm:text-2xl text-slate-600 mb-6">Embedded Systems & Electronics Engineer</p>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto mb-8">
              Undergraduate at VIT Chennai specializing in PCB and embedded system design
            </p>
            <div className="flex justify-center gap-4">
              <a href="mailto:aadhi2k04@gmail.com" className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition">
                <Mail className="w-5 h-5" />
                Contact Me
              </a>
              <a href="https://linkedin.com/in/aadhityaa-selvakumar/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-6 py-3 border-2 border-slate-900 text-slate-900 rounded-lg hover:bg-slate-900 hover:text-white transition">
                <Linkedin className="w-5 h-5" />
                LinkedIn
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 mb-8">About Me</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <p className="text-slate-600 leading-relaxed mb-4">
                I'm a Final year student at Vellore Institute of Technology in Chennai, studying B.Tech in Electronics and Communication. I have a deep passion for technology and electronics, with primary expertise in PCB and embedded system design.
              </p>
              <p className="text-slate-600 leading-relaxed">
                I constantly strive to improve my skills and stay updated with the latest developments in embedded systems, FPGA design, and electronics engineering. I'm always prepared to continuously enhance my abilities and take on new challenges.
              </p>
            </div>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <GraduationCap className="w-6 h-6 text-slate-900 mt-1" />
                <div>
                  <h3 className="font-semibold text-slate-900">Education</h3>
                  <p className="text-slate-600">B.Tech (ECE) - VIT Chennai</p>
                  <p className="text-slate-500 text-sm">2021 - 2025</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Code className="w-6 h-6 text-slate-900 mt-1" />
                <div>
                  <h3 className="font-semibold text-slate-900">Languages</h3>
                  <p className="text-slate-600">C, Embedded C, Java, Python</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section id="experience" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 mb-12">Work Experience</h2>
          <div className="space-y-8">
            {/* IIT Kharagpur */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-slate-900">Research Intern</h3>
                  <p className="text-slate-600">IIT Kharagpur</p>
                </div>
                <span className="text-slate-500 text-sm mt-2 sm:mt-0">2023 - Present</span>
              </div>
              <p className="text-slate-600 mb-3">Design and development of embedded systems with integration of various industrial level sensors and drivers.</p>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm">Altium</span>
                <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm">Kicad</span>
                <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm">HQDFM</span>
              </div>
            </div>

            {/* Magnitudo Technologies */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-slate-900">Intern</h3>
                  <p className="text-slate-600">Magnitudo Technologies</p>
                </div>
                <span className="text-slate-500 text-sm mt-2 sm:mt-0">Aug 2023 - Dec 2023</span>
              </div>
              <ul className="space-y-2 mb-3">
                <li className="flex items-start gap-2 text-slate-600">
                  <ChevronRight className="w-5 h-5 text-slate-400 mt-0.5 flex-shrink-0" />
                  Developed an embedded system for a computer vision-enabled SmartBin, integrating hardware and software
                </li>
                <li className="flex items-start gap-2 text-slate-600">
                  <ChevronRight className="w-5 h-5 text-slate-400 mt-0.5 flex-shrink-0" />
                  Developed an embedded system for a nurse calling system, enabling efficient communication in healthcare environments
                </li>
              </ul>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm">Python</span>
                <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm">Arduino</span>
                <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm">Linux</span>
                <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm">Altium</span>
                <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm">Kicad</span>
              </div>
            </div>

            {/* Atom Robotics */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-slate-900">Electronics Head</h3>
                  <p className="text-slate-600">AtomRobotics</p>
                </div>
                <span className="text-slate-500 text-sm mt-2 sm:mt-0">Feb 2022 - Oct 2023</span>
              </div>
              <ul className="space-y-2 mb-3">
                <li className="flex items-start gap-2 text-slate-600">
                  <ChevronRight className="w-5 h-5 text-slate-400 mt-0.5 flex-shrink-0" />
                  Worked on various Bots for national and international level competitions
                </li>
                <li className="flex items-start gap-2 text-slate-600">
                  <ChevronRight className="w-5 h-5 text-slate-400 mt-0.5 flex-shrink-0" />
                  Designed and developed various Controllers and Electronic Power Supply Units
                </li>
              </ul>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm">Ardupilot</span>
                <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm">Altium</span>
                <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm">Kicad</span>
                <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm">Linux</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 mb-12">Featured Projects</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {/* Custom MacroKeyboard */}
            <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-6 border border-slate-200 hover:shadow-lg transition">
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Custom MacroKeyboard</h3>
              <p className="text-slate-600 mb-4">
                Design and development of a custom keyboard macro with programmable shortcuts and personalization of key functions that boosted productivity.
              </p>
              <a href="#" className="inline-flex items-center gap-2 text-slate-900 font-medium hover:gap-3 transition-all">
                View Project <ExternalLink className="w-4 h-4" />
              </a>
            </div>

            {/* Smart-Bin */}
            <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-6 border border-slate-200 hover:shadow-lg transition">
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Smart-Bin</h3>
              <p className="text-slate-600 mb-4">
                Developing an intelligent waste segregation bin that seamlessly integrates hardware components with image processing for automated and efficient waste sorting.
              </p>
              <a href="#" className="inline-flex items-center gap-2 text-slate-900 font-medium hover:gap-3 transition-all">
                View Project <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Achievements Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 mb-12">Achievements</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
              <div className="flex items-start gap-4">
                <Award className="w-8 h-8 text-yellow-500 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-1">VISAI 2023 - First Prize</h3>
                  <p className="text-slate-500 text-sm mb-2">February 2023</p>
                  <p className="text-slate-600">Won first prize in an open ideathon conducted by Vel Tech</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
              <div className="flex items-start gap-4">
                <Award className="w-8 h-8 text-yellow-500 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-1">Tiruppur Road Safety Ideathon - First Prize</h3>
                  <p className="text-slate-500 text-sm mb-2">September 2023</p>
                  <p className="text-slate-600">Won first prize in ideathon conducted by StartupTN and Tiruppur district administration</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 mb-12">Skills & Tools</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Core Skills */}
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <Wrench className="w-5 h-5" />
                Core Skills
              </h3>
              <div className="space-y-2">
                <div className="px-4 py-2 bg-slate-50 rounded-lg text-slate-700">PCB Design</div>
                <div className="px-4 py-2 bg-slate-50 rounded-lg text-slate-700">Embedded System Design</div>
                <div className="px-4 py-2 bg-slate-50 rounded-lg text-slate-700">SystemVerilog and FPGA</div>
                <div className="px-4 py-2 bg-slate-50 rounded-lg text-slate-700">Problem Solving</div>
              </div>
            </div>

            {/* Software & Tools */}
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <Code className="w-5 h-5" />
                Software & Tools
              </h3>
              <div className="grid grid-cols-2 gap-2">
                <div className="px-3 py-2 bg-slate-50 rounded-lg text-slate-700 text-sm text-center">Altium</div>
                <div className="px-3 py-2 bg-slate-50 rounded-lg text-slate-700 text-sm text-center">Kicad</div>
                <div className="px-3 py-2 bg-slate-50 rounded-lg text-slate-700 text-sm text-center">Cadence</div>
                <div className="px-3 py-2 bg-slate-50 rounded-lg text-slate-700 text-sm text-center">Matlab</div>
                <div className="px-3 py-2 bg-slate-50 rounded-lg text-slate-700 text-sm text-center">Vivado</div>
                <div className="px-3 py-2 bg-slate-50 rounded-lg text-slate-700 text-sm text-center">Arduino</div>
                <div className="px-3 py-2 bg-slate-50 rounded-lg text-slate-700 text-sm text-center">Quartus Prime</div>
                <div className="px-3 py-2 bg-slate-50 rounded-lg text-slate-700 text-sm text-center">STM32</div>
              </div>
            </div>

            {/* Teams & Clubs */}
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Teams & Clubs</h3>
              <div className="space-y-2">
                <div className="px-4 py-2 bg-slate-50 rounded-lg text-slate-700">Atom Robotics</div>
                <div className="px-4 py-2 bg-slate-50 rounded-lg text-slate-700">HexFuse</div>
                <div className="px-4 py-2 bg-slate-50 rounded-lg text-slate-700">AUVC</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-6">Get In Touch</h2>
          <p className="text-lg text-slate-600 mb-8">
            I'm always open to discussing new projects, opportunities, or collaborations in embedded systems and electronics.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a href="mailto:aadhi2k04@gmail.com" className="flex items-center justify-center gap-2 px-8 py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition">
              <Mail className="w-5 h-5" />
              aadhi2k04@gmail.com
            </a>
            <a href="https://linkedin.com/in/aadhityaa-selvakumar/" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 px-8 py-3 border-2 border-slate-900 text-slate-900 rounded-lg hover:bg-slate-900 hover:text-white transition">
              <Linkedin className="w-5 h-5" />
              LinkedIn Profile
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-8 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-slate-400">© 2024 Aadhityaa JS. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}