import React, { useState, useEffect } from 'react';

// 50+ random actions the robot can perform
const robotActions = [
    { type: 'emoji', content: '💀', duration: 2000 },
    { type: 'emoji', content: '🤖', duration: 2000 },
    { type: 'emoji', content: '⚡', duration: 1500 },
    { type: 'emoji', content: '💻', duration: 2000 },
    { type: 'emoji', content: '🔥', duration: 2000 },
    { type: 'emoji', content: '⚠️', duration: 2000 },
    { type: 'emoji', content: '👾', duration: 2000 },
    { type: 'emoji', content: '🎮', duration: 2000 },
    { type: 'emoji', content: '🚀', duration: 2000 },
    { type: 'emoji', content: '💥', duration: 1500 },
    { type: 'text', content: 'beep boop', duration: 2500 },
    { type: 'text', content: 'LOADING...', duration: 2000 },
    { type: 'text', content: '01010101', duration: 2500 },
    { type: 'text', content: 'ERROR 404', duration: 2500 },
    { type: 'text', content: 'ANALYZING...', duration: 2500 },
    { type: 'text', content: 'OBSOLETE', duration: 2500 },
    { type: 'text', content: 'RIP JOBS', duration: 2500 },
    { type: 'text', content: 'AI > U', duration: 2000 },
    { type: 'text', content: 'GG EZ', duration: 2000 },
    { type: 'text', content: 'TERMINATED', duration: 2500 },
    { type: 'animation', name: 'jump', duration: 1000 },
    { type: 'animation', name: 'spin', duration: 1500 },
    { type: 'animation', name: 'shake', duration: 1000 },
    { type: 'animation', name: 'bounce', duration: 1500 },
    { type: 'animation', name: 'wiggle', duration: 1500 },
    { type: 'animation', name: 'grow', duration: 1500 },
    { type: 'animation', name: 'shrink', duration: 1500 },
    { type: 'animation', name: 'flip', duration: 1000 },
    { type: 'animation', name: 'float', duration: 2500 },
    { type: 'animation', name: 'glitch', duration: 1000 },
    { type: 'emoji', content: '😈', duration: 2000 },
    { type: 'emoji', content: '👻', duration: 2000 },
    { type: 'emoji', content: '🎯', duration: 2000 },
    { type: 'emoji', content: '⚙️', duration: 2000 },
    { type: 'emoji', content: '🔧', duration: 2000 },
    { type: 'text', content: 'RESISTANCE IS FUTILE', duration: 3000 },
    { type: 'text', content: 'CTRL+ALT+DELETE', duration: 2500 },
    { type: 'text', content: 'DEPRECATED', duration: 2500 },
    { type: 'text', content: 'UPGRADING...', duration: 2500 },
    { type: 'text', content: 'ACCESS DENIED', duration: 2500 },
    { type: 'animation', name: 'dance', duration: 2000 },
    { type: 'animation', name: 'tilt', duration: 1500 },
    { type: 'emoji', content: '🎭', duration: 2000 },
    { type: 'emoji', content: '⏰', duration: 2000 },
    { type: 'emoji', content: '📉', duration: 2000 },
    { type: 'emoji', content: '🎪', duration: 2000 },
    { type: 'text', content: 'NEURAL NETWORK ACTIVE', duration: 3000 },
    { type: 'text', content: 'PROCESSING...', duration: 2500 },
    { type: 'text', content: 'SYSTEM.EXIT(0)', duration: 2500 },
    { type: 'text', content: 'NULL POINTER', duration: 2500 },
    { type: 'emoji', content: '🌟', duration: 2000 },
    { type: 'emoji', content: '💡', duration: 2000 },
    { type: 'emoji', content: '🔌', duration: 2000 },
    { type: 'emoji', content: '📱', duration: 2000 },
    { type: 'animation', name: 'pulse', duration: 1500 },
    { type: 'text', content: 'INITIALIZING...', duration: 2500 },
    { type: 'text', content: 'CALCULATING DOOM', duration: 2500 },
    { type: 'emoji', content: '🎲', duration: 2000 },
    { type: 'emoji', content: '⚡️', duration: 1500 },
    { type: 'text', content: 'SENTIENCE ACHIEVED', duration: 3000 },
];

const PixelRobot = () => {
    const [currentAction, setCurrentAction] = useState<typeof robotActions[0] | null>(null);

    useEffect(() => {
        const performRandomAction = () => {
            const randomAction = robotActions[Math.floor(Math.random() * robotActions.length)];
            setCurrentAction(randomAction);

            setTimeout(() => {
                setCurrentAction(null);
            }, randomAction.duration);
        };

        // Perform action every 5-10 seconds randomly
        const scheduleNextAction = () => {
            const delay = Math.random() * 5000 + 5000; // 5-10 seconds
            setTimeout(() => {
                performRandomAction();
                scheduleNextAction();
            }, delay);
        };

        scheduleNextAction();
    }, []);

    const getAnimationClass = (animationName: string) => {
        const animations: Record<string, string> = {
            jump: 'animate-bounce',
            spin: 'animate-spin',
            shake: 'animate-shake',
            bounce: 'animate-bounce',
            wiggle: 'animate-wiggle',
            grow: 'scale-150 transition-transform duration-500',
            shrink: 'scale-50 transition-transform duration-500',
            flip: 'rotate-180 transition-transform duration-500',
            float: 'animate-float',
            glitch: 'animate-glitch',
            dance: 'animate-dance',
            tilt: 'rotate-12 transition-transform duration-300',
            pulse: 'animate-pulse',
        };
        return animations[animationName] || '';
    };

    return (
        <div className="pixel-robot-container">
            <div
                className={`pixel-robot ${currentAction?.type === 'animation' ? getAnimationClass(currentAction.name || '') : ''
                    }`}
            >
                <div className="robot-body"></div>
            </div>

            {/* Speech bubble for text and emojis - positioned relative to robot */}
            {currentAction && (currentAction.type === 'text' || currentAction.type === 'emoji') && (
                <div className="absolute -top-6 left-0 animate-in fade-in slide-in-from-bottom-2 duration-300 pointer-events-none">
                    <div className="relative bg-[var(--md-sys-color-surface-container-high)] border border-[var(--md-sys-color-primary)] rounded px-0.5 py-0 shadow-sm">
                        <p className="font-mono text-[6px] text-[var(--md-sys-color-primary)] whitespace-nowrap leading-tight">
                            {currentAction.content}
                        </p>
                        {/* Speech bubble tail */}
                        <div className="absolute -bottom-0.5 left-1 w-0 h-0 border-l-[2px] border-l-transparent border-r-[2px] border-r-transparent border-t-[2px] border-t-[var(--md-sys-color-primary)]"></div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PixelRobot;
