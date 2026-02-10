/**
 * Guest Layout Component
 * Layout for non-authenticated pages like the Login portal.
 */
import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';
import Footer from '@/Components/Footer';

export default function GuestLayout({ children }) {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#1E3A8A] px-4 py-8">
            <div className="mb-8 flex flex-col items-center">
                <Link href="/" className="transition-transform duration-300 hover:scale-110">
                    <ApplicationLogo className="h-20 w-20 fill-current text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]" />
                </Link>
                <div className="mt-4 text-center">
                    <h1 className="text-2xl font-black text-white tracking-[0.2em] uppercase">
                        Darul-Ulum
                    </h1>
                    <p className="text-sm font-bold text-amber-200 tracking-[0.3em] uppercase mt-1 opacity-90">
                        Islamic School
                    </p>
                </div>
            </div>

            <div className="w-full sm:max-w-md bg-white/95 backdrop-blur-md px-8 py-10 shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-white/10 rounded-2xl">
                {children}
            </div>

            <div className="mt-12 w-full max-w-md">
                <Footer />
            </div>
        </div>
    );
}
