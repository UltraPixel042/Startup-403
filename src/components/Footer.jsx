export default function Footer() {
  return (
    <footer className="glass mt-auto border-t border-white/5" role="contentinfo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-gradient-to-br from-[#D4A373] to-[#8B5A2B] flex items-center justify-center font-bold text-white text-xs" aria-hidden="true">
              VC
            </div>
            <span className="text-sm font-semibold gradient-text" style={{ fontFamily: 'var(--font-heading)' }}>
              BrewBook
            </span>
          </div>
          <p className="text-xs text-slate-500 text-center">
            © {new Date().getFullYear()} BrewBook. All rights reserved. Crafted with ☕ and 🤎
          </p>
          <div className="flex gap-4">
            <a href="#privacy" className="text-xs text-slate-500 hover:text-[#D4A373] transition-colors no-underline">Privacy</a>
            <a href="#terms" className="text-xs text-slate-500 hover:text-[#D4A373] transition-colors no-underline">Terms</a>
            <a href="#contact" className="text-xs text-slate-500 hover:text-[#D4A373] transition-colors no-underline">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
