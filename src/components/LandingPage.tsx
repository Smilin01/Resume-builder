import React, { useState, useEffect } from 'react';
import { ArrowRight, Check, Star, FileText, Wand2, Github, Twitter, Linkedin, Instagram } from 'lucide-react';

interface LandingPageProps {
    onStart: (view?: 'editor' | 'templates') => void;
}

export function LandingPage({ onStart }: LandingPageProps) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    return (
        <div className={`min-h-screen bg-white text-gray-900 font-sans transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
            {/* Navbar */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">
                        <div className="flex items-center gap-2">
                            <span className="text-2xl font-bold text-gray-900">Resume<span className="text-violet-600">Nova</span></span>
                        </div>

                        <div className="hidden md:flex items-center gap-8">
                            <a href="#home" className="text-gray-600 hover:text-violet-600 font-medium transition-colors">Home</a>
                            <a href="#templates" className="text-gray-600 hover:text-violet-600 font-medium transition-colors">Templates</a>
                            <a href="#features" className="text-gray-600 hover:text-violet-600 font-medium transition-colors">Features</a>
                            <a href="#about" className="text-gray-600 hover:text-violet-600 font-medium transition-colors">About</a>
                        </div>

                        <div className="flex items-center gap-4">
                            <button onClick={() => onStart('editor')} className="hidden md:flex items-center gap-2 px-6 py-2.5 bg-violet-600 text-white rounded-full font-medium hover:bg-violet-700 transition-all hover:scale-105 shadow-lg shadow-violet-200">
                                Create Resume
                                <ArrowRight size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section id="home" className="pt-32 pb-20 overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div className="space-y-8 animate-slide-up">
                            <div className="inline-block px-4 py-1.5 bg-violet-50 text-violet-700 rounded-full text-sm font-semibold tracking-wide uppercase">
                                100% Free AI Resume Builder
                            </div>
                            <h1 className="text-5xl lg:text-7xl font-bold leading-tight text-gray-900">
                                Build a Professional Resume in <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-fuchsia-600">3 Minutes</span> with Free AI.
                            </h1>
                            <p className="text-xl text-gray-600 max-w-lg">
                                Access premium templates and our advanced AI builder for free. ATS-friendly, easy to use, and designed to get you hired fast.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <button onClick={() => onStart('editor')} className="px-8 py-4 bg-violet-600 text-white rounded-full font-bold text-lg hover:bg-violet-700 transition-all hover:scale-105 shadow-xl shadow-violet-200 flex items-center justify-center gap-2">
                                    Create Resume for free
                                    <Wand2 size={20} />
                                </button>
                                <button onClick={() => onStart('templates')} className="px-8 py-4 bg-white text-gray-700 border border-gray-200 rounded-full font-bold text-lg hover:bg-gray-50 transition-all hover:border-violet-200 flex items-center justify-center gap-2">
                                    View Templates
                                </button>
                            </div>

                            <div className="flex items-center gap-4 pt-4">
                                <div className="flex -space-x-4">
                                    {[1, 2, 3, 4].map((i) => (
                                        <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-gray-200 overflow-hidden">
                                            <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="User" className="w-full h-full object-cover" />
                                        </div>
                                    ))}
                                </div>
                                <div className="text-sm text-gray-600">
                                    <span className="font-bold text-gray-900">2,000+</span> happy users
                                </div>
                            </div>
                        </div>

                        <div className="relative lg:h-[600px] flex items-center justify-center">
                            {/* Abstract Background Shapes */}
                            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-violet-100 rounded-full blur-3xl opacity-50 -z-10 animate-pulse-slow"></div>
                            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-fuchsia-100 rounded-full blur-3xl opacity-50 -z-10 animate-pulse-slow delay-1000"></div>

                            {/* Resume Preview Cards */}
                            <div className="relative w-full max-w-md perspective-1000">
                                <div className="relative z-20 bg-white rounded-2xl shadow-2xl p-4 transform rotate-y-12 transition-transform hover:rotate-0 duration-500 border border-gray-100">
                                    <div className="aspect-[3/4] bg-gray-50 rounded-lg overflow-hidden relative">
                                        {/* Mock Resume Content */}
                                        <div className="h-32 bg-gray-900 w-full relative">
                                            <div className="absolute -bottom-12 left-6 w-24 h-24 rounded-lg border-4 border-white overflow-hidden bg-gray-300">
                                                <img src="https://i.pravatar.cc/150?img=33" alt="Profile" className="w-full h-full object-cover" />
                                            </div>
                                        </div>
                                        <div className="pt-14 px-6 space-y-4">
                                            <div className="space-y-1">
                                                <div className="h-6 w-48 bg-gray-200 rounded"></div>
                                                <div className="h-4 w-32 bg-violet-100 rounded"></div>
                                            </div>
                                            <div className="space-y-2">
                                                <div className="h-3 w-full bg-gray-100 rounded"></div>
                                                <div className="h-3 w-full bg-gray-100 rounded"></div>
                                                <div className="h-3 w-2/3 bg-gray-100 rounded"></div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4 pt-4">
                                                <div className="space-y-2">
                                                    <div className="h-4 w-20 bg-gray-200 rounded"></div>
                                                    <div className="h-16 w-full bg-gray-50 border border-gray-100 rounded"></div>
                                                </div>
                                                <div className="space-y-2">
                                                    <div className="h-4 w-20 bg-gray-200 rounded"></div>
                                                    <div className="h-16 w-full bg-gray-50 border border-gray-100 rounded"></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Floating User Card */}
                                    <div className="absolute top-10 -left-12 bg-white p-4 rounded-xl shadow-xl border border-gray-100 flex items-center gap-3 animate-float">
                                        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                                            <Check size={20} />
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500">Status</p>
                                            <p className="font-bold text-gray-900">Hired!</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Back Card */}
                                <div className="absolute top-12 -right-4 z-10 w-full h-full bg-violet-600 rounded-2xl shadow-xl transform rotate-6 opacity-20"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-24 bg-gray-50 relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl font-bold text-violet-600 mb-4">Features</h2>
                        <p className="text-xl text-gray-600">Everything you need to build a professional resume</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-12 relative">
                        {/* Curved Arrows (SVG) */}
                        <svg className="absolute top-1/2 left-0 w-full h-full pointer-events-none hidden md:block -z-10" style={{ transform: 'translateY(-50%)' }}>
                            <path d="M 250 50 Q 350 -50 450 50" fill="none" stroke="#8b5cf6" strokeWidth="2" strokeDasharray="8 8" className="opacity-30" />
                            <path d="M 650 50 Q 750 150 850 50" fill="none" stroke="#8b5cf6" strokeWidth="2" strokeDasharray="8 8" className="opacity-30" />
                        </svg>

                        {/* Feature 1 */}
                        <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-2 group">
                            <div className="w-14 h-14 bg-violet-100 rounded-xl flex items-center justify-center text-violet-600 mb-6 group-hover:bg-violet-600 group-hover:text-white transition-colors">
                                <FileText size={28} />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Free Professional Templates</h3>
                            <p className="text-gray-600">
                                Choose from 30+ ATS-friendly resume templates. Completely free to use and designed by HR experts.
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-2 group mt-12 md:mt-0">
                            <div className="w-14 h-14 bg-fuchsia-100 rounded-xl flex items-center justify-center text-fuchsia-600 mb-6 group-hover:bg-fuchsia-600 group-hover:text-white transition-colors">
                                <Star size={28} />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Smart AI Builder</h3>
                            <p className="text-gray-600">
                                Use our free AI to write your resume content, generate summaries, and optimize for keywords instantly.
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-2 group">
                            <div className="w-14 h-14 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                <Wand2 size={28} />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Ready in 3 Minutes</h3>
                            <p className="text-gray-600">
                                Our intuitive editor and AI tools help you build a polished, job-ready resume in just a few minutes.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Community Section */}
            <section className="py-24 overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div className="order-2 lg:order-1">
                            <h2 className="text-4xl lg:text-5xl font-bold leading-tight mb-6">
                                Join the 2000+ <br />
                                <span className="text-gray-900">Resume</span><span className="text-violet-600">Nova</span> family
                            </h2>
                            <p className="text-xl text-gray-600 mb-8">
                                Fames ac turpis egestas sed. Sagittis vitae et leo duis. Duis at consectetur lorem donec massa.
                            </p>
                            <div className="p-6 bg-pink-50 rounded-2xl border border-pink-100">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="flex text-yellow-400">
                                        {[1, 2, 3, 4, 5].map(i => <Star key={i} size={20} fill="currentColor" />)}
                                    </div>
                                    <span className="font-bold text-gray-900">4.9/5 Rating</span>
                                </div>
                                <p className="text-gray-700 italic">
                                    "This builder helped me land my job at Google! The AI suggestions were a game changer."
                                </p>
                                <div className="mt-4 flex items-center gap-3">
                                    <img src="https://i.pravatar.cc/100?img=5" alt="User" className="w-10 h-10 rounded-full" />
                                    <div>
                                        <p className="font-bold text-sm">Sarah Jenkins</p>
                                        <p className="text-xs text-gray-500">Software Engineer</p>
                                    </div>
                                </div>
                            </div>
                            <button onClick={() => onStart('editor')} className="mt-8 px-8 py-4 bg-violet-600 text-white rounded-full font-bold text-lg hover:bg-violet-700 transition-all hover:scale-105 shadow-xl shadow-violet-200 w-full sm:w-auto">
                                Create Resume for free
                            </button>
                        </div>

                        <div className="order-1 lg:order-2 relative">
                            <div className="absolute inset-0 bg-gradient-to-tr from-violet-200 to-pink-200 rounded-[2rem] transform rotate-3 scale-95 -z-10"></div>
                            <img
                                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                                alt="Happy User"
                                className="rounded-[2rem] shadow-2xl w-full object-cover h-[500px]"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-white border-t border-gray-100 pt-16 pb-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-4 gap-12 mb-12">
                        <div className="col-span-1 md:col-span-1">
                            <span className="text-2xl font-bold text-gray-900 mb-6 block">Resume<span className="text-violet-600">Nova</span></span>
                            <p className="text-gray-500 text-sm mb-6">
                                Updates right to your inbox
                            </p>
                            <div className="flex gap-2">
                                <input type="email" placeholder="Email Address" className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-sm w-full focus:outline-none focus:border-violet-500" />
                                <button className="bg-violet-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-violet-700">Subscribe</button>
                            </div>
                        </div>

                        <div>
                            <h4 className="font-bold text-gray-900 mb-6">Our story</h4>
                            <ul className="space-y-4 text-gray-600 text-sm">
                                <li><a href="#" className="hover:text-violet-600">FAQ</a></li>
                                <li><a href="#" className="hover:text-violet-600">Contact</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-bold text-gray-900 mb-6">Services</h4>
                            <ul className="space-y-4 text-gray-600 text-sm">
                                <li><a href="#" className="hover:text-violet-600">Build Resume</a></li>
                                <li><a href="#" className="hover:text-violet-600">Cover Letter</a></li>
                                <li><a href="#" className="hover:text-violet-600">Template</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-bold text-gray-900 mb-6">About us</h4>
                            <ul className="space-y-4 text-gray-600 text-sm">
                                <li><a href="#" className="hover:text-violet-600">Developers</a></li>
                                <li><a href="#" className="hover:text-violet-600">Meet our team</a></li>
                                <li><a href="#" className="hover:text-violet-600">Join Tabulio</a></li>
                            </ul>
                        </div>
                    </div>

                    <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="flex gap-8 text-sm text-gray-500">
                            <span>© ResumeNova 2025</span>
                            <a href="#" className="hover:text-gray-900">Privacy policy</a>
                            <a href="#" className="hover:text-gray-900">Terms of use</a>
                        </div>
                        <div className="flex gap-4">
                            <a href="#" className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center text-violet-600 hover:bg-violet-600 hover:text-white transition-colors">
                                <Github size={16} />
                            </a>
                            <a href="#" className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center text-violet-600 hover:bg-violet-600 hover:text-white transition-colors">
                                <Linkedin size={16} />
                            </a>
                            <a href="#" className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center text-violet-600 hover:bg-violet-600 hover:text-white transition-colors">
                                <Twitter size={16} />
                            </a>
                            <a href="#" className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center text-violet-600 hover:bg-violet-600 hover:text-white transition-colors">
                                <Instagram size={16} />
                            </a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
