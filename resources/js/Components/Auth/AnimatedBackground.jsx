import { useEffect } from 'react';

export default function AnimatedBackground() {
    return (
        <div className="fixed inset-0 overflow-hidden -z-10 bg-[#0f172a]">
            {/* Animated Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a]"></div>

            {/* Floating Orbs/Shapes */}
            <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-purple-500/30 blur-[120px] animate-float-slow"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-blue-500/20 blur-[130px] animate-float-medium"></div>
            <div className="absolute top-[40%] left-[30%] w-[300px] h-[300px] rounded-full bg-teal-500/20 blur-[100px] animate-pulse-slow"></div>

            {/* Particle Overlay (CSS or Canvas implementation could go here for more complex particles) */}
            <div className="absolute inset-0 bg-[url('/images/noise.png')] opacity-[0.03]"></div>

            <style>{`
                @keyframes float-slow {
                    0%, 100% { transform: translate(0, 0); }
                    50% { transform: translate(30px, 50px); }
                }
                @keyframes float-medium {
                    0%, 100% { transform: translate(0, 0); }
                    50% { transform: translate(-40px, -20px); }
                }
                @keyframes pulse-slow {
                    0%, 100% { opacity: 0.4; transform: scale(1); }
                    50% { opacity: 0.6; transform: scale(1.1); }
                }
                .animate-float-slow {
                    animation: float-slow 15s ease-in-out infinite;
                }
                .animate-float-medium {
                    animation: float-medium 20s ease-in-out infinite;
                }
                .animate-pulse-slow {
                    animation: pulse-slow 8s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
}
