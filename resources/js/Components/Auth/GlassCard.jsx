export default function GlassCard({ children, className = '' }) {
    return (
        <div className={`relative backdrop-blur-xl bg-white/10 border border-white/20 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] rounded-2xl overflow-hidden ${className}`}>
            {/* Reflection/Sheen overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none"></div>

            {/* Inner Content */}
            <div className="relative z-10 w-full h-full">
                {children}
            </div>
        </div>
    );
}
