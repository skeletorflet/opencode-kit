'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { checkLicenseStatus } from '@/lib/firebase-license';
import LicenseBlockModal from './LicenseBlockModal';

interface LicenseContextType {
    isLicenseActive: boolean;
    isChecking: boolean;
}

const LicenseContext = createContext<LicenseContextType>({
    isLicenseActive: true,
    isChecking: true,
});

export const useLicense = () => useContext(LicenseContext);

interface LicenseProviderProps {
    children: ReactNode;
}

export default function LicenseProvider({ children }: LicenseProviderProps) {
    const [isLicenseActive, setIsLicenseActive] = useState(true);
    const [isChecking, setIsChecking] = useState(true);
    const [showBlockModal, setShowBlockModal] = useState(false);

    useEffect(() => {
        const verifyLicense = async () => {
            try {
                const isActive = await checkLicenseStatus();
                setIsLicenseActive(isActive);

                if (!isActive) {
                    // Show the block modal if license is inactive
                    setShowBlockModal(true);
                }
            } catch (error) {
                console.error('Error verifying license:', error);
                // On error, allow access
                setIsLicenseActive(true);
            } finally {
                setIsChecking(false);
            }
        };

        verifyLicense();
    }, []);

    return (
        <LicenseContext.Provider value={{ isLicenseActive, isChecking }}>
            {children}
            <LicenseBlockModal isOpen={showBlockModal} />
        </LicenseContext.Provider>
    );
}
