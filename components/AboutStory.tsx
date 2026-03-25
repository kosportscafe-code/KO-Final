import React from 'react';

const AboutStory: React.FC = () => {
    return (
        <section id="story" className="py-24 bg-white relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-stone-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-bronze/10 rounded-full mix-blend-multiply filter blur-3xl opacity-70 translate-x-1/3 translate-y-1/3"></div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                    <div className="space-y-8">
                        <h2 className="font-serif text-4xl md:text-5xl text-obsidian leading-tight">
                            More than just a <span className="text-bronze italic">Sports Café</span>.
                        </h2>
                        <p className="font-sans text-stone-600 font-light leading-relaxed">
                            At KOSC, we've created a destination where the energy of competition meets the joy of exceptional dining. From the moment you step in, you're immersed in an atmosphere that pulses with sportsmanship, laughter, and the unmistakable aroma of quality food being prepared with passion.
                        </p>
                        <div className="space-y-4 pt-4 border-t border-stone-100">
                            <h3 className="font-serif text-2xl text-obsidian">Our Mission</h3>
                            <p className="font-sans text-sm text-stone-500">
                                To deliver an unparalleled experience where world-class gaming meets world-class cuisine. Quality isn't just important to us—it's everything.
                            </p>
                        </div>
                    </div>
                    <div className="relative">
                        <div className="aspect-[4/5] bg-stone-200 overflow-hidden rounded-sm">
                            <img
                                src="/images/Hero2.jpg"
                                alt="Close-up of the elegant coffee station and interior design at KOS Sports Café"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        {/* Floating card */}
                        <div className="absolute -bottom-10 -left-10 bg-alabaster p-8 shadow-xl max-w-xs hidden md:block">
                            <p className="font-serif text-xl italic text-obsidian text-center">
                                "Champions deserve nothing less."
                            </p>
                            <p className="text-center text-xs uppercase tracking-widest mt-4 text-stone-400">KOSC Team</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutStory;
