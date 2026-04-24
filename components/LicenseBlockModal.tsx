'use client';

import { XCircle, Phone, Mail, AlertTriangle } from 'lucide-react';

interface LicenseBlockModalProps {
    isOpen: boolean;
}

export default function LicenseBlockModal({ isOpen }: LicenseBlockModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />

            {/* Modal */}
            <div className="relative z-10 w-full max-w-md mx-4">
                <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl shadow-2xl border border-white/10 overflow-hidden">
                    {/* Header with icon */}
                    <div className="bg-gradient-to-r from-red-600/20 to-orange-600/20 border-b border-white/10 p-8 text-center">
                        <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center shadow-lg shadow-red-500/30">
                            <AlertTriangle className="w-10 h-10 text-white" />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">
                            Servicio No Disponible
                        </h2>
                        <p className="text-white/60 text-sm">
                            El servicio se encuentra temporalmente suspendido
                        </p>
                    </div>

                    {/* Content */}
                    <div className="p-8">
                        <p className="text-white/80 text-center mb-8 leading-relaxed">
                            Para reactivar el servicio o resolver cualquier consulta,
                            por favor contacte con el desarrollador:
                        </p>

                        {/* Contact info */}
                        <div className="space-y-4">
                            {/* Name */}
                            <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                                <p className="text-white font-semibold text-lg text-center">
                                    Julian Perez
                                </p>
                            </div>

                            {/* Phone */}
                            <a
                                href="tel:2994194401"
                                className="flex items-center gap-4 bg-gradient-to-r from-emerald-600/20 to-teal-600/20 hover:from-emerald-600/30 hover:to-teal-600/30 rounded-2xl p-4 border border-emerald-500/30 transition-all duration-300 group"
                            >
                                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                                    <Phone className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <p className="text-white/60 text-xs uppercase tracking-wider mb-1">Teléfono</p>
                                    <p className="text-white font-semibold text-lg">299 419 4401</p>
                                </div>
                            </a>

                            {/* Email */}
                            <a
                                href="mailto:mordecaaii@gmail.com"
                                className="flex items-center gap-4 bg-gradient-to-r from-blue-600/20 to-indigo-600/20 hover:from-blue-600/30 hover:to-indigo-600/30 rounded-2xl p-4 border border-blue-500/30 transition-all duration-300 group"
                            >
                                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
                                    <Mail className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <p className="text-white/60 text-xs uppercase tracking-wider mb-1">Email</p>
                                    <p className="text-white font-semibold">mordecaaii@gmail.com</p>
                                </div>
                            </a>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="bg-white/5 border-t border-white/10 px-8 py-4">
                        <p className="text-white/40 text-xs text-center">
                            Toval Seguros © {new Date().getFullYear()}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
