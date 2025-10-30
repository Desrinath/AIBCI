
import React from 'react';
import { BrainCircuitIcon } from './icons';

const Header: React.FC = () => {
    return (
        <header className="bg-gray-800/50 backdrop-blur-sm shadow-lg sticky top-0 z-10">
            <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <BrainCircuitIcon className="h-10 w-10 text-cyan-400" />
                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold text-white">AI BCI Caretaker Interface</h1>
                        <p className="text-xs sm:text-sm text-gray-400">Real-Time Patient Need Monitoring</p>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
