import React, { useState, useEffect, useRef } from 'react';
import LiquidCityAnimation from './LiquidCityAnimation';
import { useAuth } from '../../context/AuthContext';

/* ─── Monochrome SVG Icons for Wallets ─── */
const IconTrain = ({ color = 'currentColor' }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="3" width="16" height="16" rx="2"/><path d="M4 11h16"/><path d="M12 3v8"/>
        <path d="M8 19l-2 3"/><path d="M18 22l-2-3"/><circle cx="9" cy="15" r="1" fill={color}/><circle cx="15" cy="15" r="1" fill={color}/>
    </svg>
);

const IconBuilding = ({ color = 'currentColor' }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/>
        <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/><path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/>
    </svg>
);

const IconMapPin = ({ color = 'currentColor' }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
    </svg>
);

const IconCoffee = ({ color = 'currentColor' }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 8h1a4 4 0 1 1 0 8h-1"/><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/>
        <line x1="6" y1="2" x2="6" y2="4"/><line x1="10" y1="2" x2="10" y2="4"/><line x1="14" y1="2" x2="14" y2="4"/>
    </svg>
);

/* ─── Animated Counter Hook ─── */
const useAnimatedCounter = (target, duration = 1200) => {
    const [count, setCount] = useState(0);
    const prevTarget = useRef(0);

    useEffect(() => {
        const start = prevTarget.current;
        const diff = target - start;
        if (diff === 0) return;
        
        const startTime = performance.now();
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // ease-out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.round(start + diff * eased));
            if (progress < 1) requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
        prevTarget.current = target;
    }, [target, duration]);

    return count;
};

/* ─── Wallet config ─── */
const WALLET_CONFIG = {
    transport: { icon: IconTrain, color: '#06b6d4', label: 'TRANSPORT', cssClass: 'transport', gradient: 'linear-gradient(135deg, #06b6d4, #22d3ee)' },
    stay:      { icon: IconBuilding, color: '#8b5cf6', label: 'STAY', cssClass: 'stay', gradient: 'linear-gradient(135deg, #8b5cf6, #a78bfa)' },
    food:      { icon: IconMapPin, color: '#f59e0b', label: 'VISIT SPOTS', cssClass: 'food', gradient: 'linear-gradient(135deg, #f59e0b, #fbbf24)' },
    buffer:    { icon: IconCoffee, color: '#f43f5e', label: 'FOOD & OTHER EXPENSES', cssClass: 'buffer', gradient: 'linear-gradient(135deg, #f43f5e, #fb7185)' },
};

/* ─── Ripple effect helper ─── */
const createRipple = (e) => {
    const btn = e.currentTarget;
    const circle = document.createElement('span');
    const diameter = Math.max(btn.clientWidth, btn.clientHeight);
    const radius = diameter / 2;
    const rect = btn.getBoundingClientRect();
    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${e.clientX - rect.left - radius}px`;
    circle.style.top = `${e.clientY - rect.top - radius}px`;
    circle.className = 'ripple-circle';
    const existing = btn.querySelector('.ripple-circle');
    if (existing) existing.remove();
    btn.appendChild(circle);
    setTimeout(() => circle.remove(), 600);
};

const SavingsPlannerTab = ({ trip, onUpdate }) => {
    const { session } = useAuth();
    const wallets = trip.trip_wallets || [];
    
    // Sort wallets to have a consistent order (transport, stay, food, buffer)
    const order = { transport: 1, stay: 2, food: 3, buffer: 4 };
    const sortedWallets = [...wallets].sort((a, b) => order[a.wallet_type] - order[b.wallet_type]);

    const totalTarget = sortedWallets.reduce((sum, w) => sum + Number(w.target_amount), 0);
    const totalSaved = sortedWallets.reduce((sum, w) => sum + Number(w.saved_amount), 0);
    const percentage = totalTarget > 0 ? Math.min(100, Math.round((totalSaved / totalTarget) * 100)) : 0;

    const groupMembers = trip.trip_data?.preferences?.groupMembers || [];
    const validMembers = groupMembers.map(m => typeof m === 'object' ? m?.name : m).filter(m => m && String(m).trim() !== '');
    const defaultName = session?.user?.user_metadata?.full_name || session?.user?.user_metadata?.name || session?.user?.email?.split('@')[0] || 'admin';
    const allContributors = [defaultName, ...validMembers];
    const hasMembers = validMembers.length > 0;

    const [fundingAmount, setFundingAmount] = useState('');
    const [selectedWallet, setSelectedWallet] = useState(sortedWallets[0]?.id || '');
    const [contributorName, setContributorName] = useState(allContributors[0]);
    const [isSaving, setIsSaving] = useState(false);
    const [justFunded, setJustFunded] = useState(null); // wallet id that just got funded

    // Animated counters
    const animTarget = useAnimatedCounter(totalTarget);
    const animSaved = useAnimatedCounter(totalSaved);
    const animRemaining = useAnimatedCounter(Math.max(0, totalTarget - totalSaved));

    const handleAddFunds = async (e) => {
        e.preventDefault();
        if (!fundingAmount || isNaN(fundingAmount) || Number(fundingAmount) <= 0) return;
        
        const wallet = sortedWallets.find(w => w.id === selectedWallet);
        if (!wallet) return;

        const maxAllowed = Number(wallet.target_amount) - Number(wallet.saved_amount);
        const amountToAdd = Math.min(Number(fundingAmount), maxAllowed > 0 ? maxAllowed : 0);

        if (amountToAdd <= 0) {
            alert("This wallet is already fully funded!");
            return;
        }

        setIsSaving(true);
        try {
            const token = session?.access_token || '';

            const res = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/saved-trips/savings`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json', 
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify({ 
                    trip_id: trip.id, 
                    wallet_type: wallet.wallet_type, 
                    amount: amountToAdd,
                    contributor_name: contributorName 
                })
            });

            if (!res.ok) throw new Error('Failed to save to backend');
            const newWallets = wallets.map(w => {
                if (w.id === wallet.id) {
                    return { ...w, saved_amount: Number(w.saved_amount) + amountToAdd };
                }
                return w;
            });
            
            // Check if wallet is now fully funded
            const updatedWallet = newWallets.find(w => w.id === wallet.id);
            if (updatedWallet && Number(updatedWallet.saved_amount) >= Number(updatedWallet.target_amount)) {
                setJustFunded(wallet.id);
                setTimeout(() => setJustFunded(null), 2500);
            }

            onUpdate({ ...trip, trip_wallets: newWallets });
            setFundingAmount('');
        } catch (err) {
            console.error('Failed to add funds', err);
            alert('Failed to save funds');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="savings-planner-tab">
            <div className="planner-header">
                <h3>Financial Goal Tracker</h3>
                <div className="goal-overview">
                    <div className="stat">
                        <span className="label">Target</span>
                        <span className="value">₹{animTarget.toLocaleString()}</span>
                    </div>
                    <div className="stat">
                        <span className="label">Saved</span>
                        <span className="value highlight">₹{animSaved.toLocaleString()}</span>
                    </div>
                    <div className="stat">
                        <span className="label">Remaining</span>
                        <span className="value">₹{animRemaining.toLocaleString()}</span>
                    </div>
                </div>
            </div>

            <div className="planner-grid" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div className="contributor-section" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', margin: '20px 0' }}>
                    <label style={{ fontWeight: 'bold', color: '#94a3b8' }}>contributor =</label>
                    {hasMembers ? (
                        <select 
                            value={contributorName}
                            onChange={(e) => setContributorName(e.target.value)}
                            style={{ padding: '8px 12px', borderRadius: '10px', border: '1px solid rgba(6,182,212,0.3)', background: '#0f172a', color: '#fff', width: '250px', outline: 'none', transition: 'border-color 0.3s, box-shadow 0.3s' }}
                            onFocus={e => { e.target.style.borderColor = '#06b6d4'; e.target.style.boxShadow = '0 0 0 3px rgba(6,182,212,0.15)'; }}
                            onBlur={e => { e.target.style.borderColor = 'rgba(6,182,212,0.3)'; e.target.style.boxShadow = 'none'; }}
                        >
                            {allContributors.map((member, idx) => (
                                <option key={idx} value={member}>{member}</option>
                            ))}
                        </select>
                    ) : (
                        <input 
                            type="text" 
                            placeholder="Your name or friend's name" 
                            value={contributorName}
                            onChange={(e) => setContributorName(e.target.value)}
                            style={{ padding: '8px 12px', borderRadius: '10px', border: '1px solid rgba(6,182,212,0.3)', background: '#0f172a', color: '#fff', width: '250px', outline: 'none', transition: 'border-color 0.3s, box-shadow 0.3s' }}
                            onFocus={e => { e.target.style.borderColor = '#06b6d4'; e.target.style.boxShadow = '0 0 0 3px rgba(6,182,212,0.15)'; }}
                            onBlur={e => { e.target.style.borderColor = 'rgba(6,182,212,0.3)'; e.target.style.boxShadow = 'none'; }}
                        />
                    )}
                </div>

                <div className="wallets-list" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                    {sortedWallets.map((wallet, idx) => {
                        const wTarget = Number(wallet.target_amount);
                        const wSaved = Number(wallet.saved_amount);
                        const wPercent = wTarget > 0 ? Math.min(100, Math.round((wSaved / wTarget) * 100)) : 0;
                        const config = WALLET_CONFIG[wallet.wallet_type] || WALLET_CONFIG.transport;
                        const WalletIcon = config.icon;
                        const isComplete = wPercent >= 100;
                        const isJustFunded = justFunded === wallet.id;
                        
                        return (
                            <div 
                                key={wallet.id} 
                                className={`wallet-card wallet-card--${config.cssClass} animate-entrance`} 
                                style={{ 
                                    background: '#0f172a', 
                                    padding: '20px', 
                                    borderRadius: '14px', 
                                    border: `1px solid ${config.color}22`,
                                    position: 'relative',
                                    overflow: 'hidden',
                                    animationDelay: `${idx * 0.1}s`,
                                }}
                            >
                                {/* Confetti burst when wallet is fully funded */}
                                {isJustFunded && Array.from({ length: 12 }).map((_, i) => (
                                    <span
                                        key={i}
                                        className="confetti-piece"
                                        style={{
                                            left: `${Math.random() * 100}%`,
                                            top: `${Math.random() * 40}%`,
                                            background: [config.color, '#fbbf24', '#4ade80', '#60a5fa', '#f87171'][i % 5],
                                            animationDelay: `${Math.random() * 0.5}s`,
                                            animationDuration: `${1 + Math.random() * 1}s`,
                                        }}
                                    />
                                ))}

                                {/* Subtle gradient glow on top */}
                                <div style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    height: '3px',
                                    background: config.gradient,
                                    opacity: 0.8,
                                    borderRadius: '14px 14px 0 0',
                                }} />

                                <div className="wallet-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <span className="wallet-icon" style={{ color: config.color }}>
                                            <WalletIcon color={config.color} />
                                        </span>
                                        <span className="wallet-name" style={{ fontWeight: 'bold', fontSize: '1.05rem', color: '#e2e8f0' }}>
                                            {config.label}
                                        </span>
                                    </div>
                                    {isComplete && (
                                        <span style={{ 
                                            background: 'linear-gradient(135deg, #10b981, #4ade80)', 
                                            color: '#000', 
                                            padding: '2px 10px', 
                                            borderRadius: '20px', 
                                            fontSize: '11px', 
                                            fontWeight: '700',
                                            letterSpacing: '0.5px',
                                        }}>
                                            FUNDED
                                        </span>
                                    )}
                                </div>
                                <div className="progress-bar-bg" style={{ background: '#1e293b', height: '12px', borderRadius: '6px', overflow: 'hidden', marginBottom: '10px' }}>
                                    <div 
                                        className={`progress-bar-fill ${isComplete ? 'progress-bar-fill--complete' : `progress-bar-fill--${config.cssClass}`}`}
                                        style={{ width: `${wPercent}%`, height: '100%' }}
                                    />
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: '#94a3b8' }}>
                                    <span>₹{wSaved.toLocaleString()} saved</span>
                                    <span>Target: ₹{wTarget.toLocaleString()}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="add-funds-container animate-entrance" style={{ background: '#0f172a', padding: '24px', borderRadius: '14px', border: '1px solid rgba(6,182,212,0.15)', marginTop: '10px' }}>
                    <form className="add-funds-form" onSubmit={handleAddFunds} style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', alignItems: 'flex-end', background: 'transparent', padding: 0, borderRadius: 0, marginTop: 0 }}>
                        <div style={{ flex: '1', minWidth: '150px' }}>
                            <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem', color: '#94a3b8' }}>Select Wallet</label>
                            <select 
                                value={selectedWallet} 
                                onChange={(e) => setSelectedWallet(e.target.value)}
                                style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid rgba(6,182,212,0.2)', background: '#1e293b', color: '#fff', outline: 'none', transition: 'border-color 0.3s' }}
                                onFocus={e => e.target.style.borderColor = '#06b6d4'}
                                onBlur={e => e.target.style.borderColor = 'rgba(6,182,212,0.2)'}
                            >
                                {sortedWallets.map(w => {
                                    const cfg = WALLET_CONFIG[w.wallet_type] || WALLET_CONFIG.transport;
                                    return (
                                        <option key={w.id} value={w.id} style={{ background: '#0f172a', color: '#fff' }}>
                                            {cfg.label}
                                        </option>
                                    );
                                })}
                            </select>
                        </div>
                        <div style={{ flex: '1', minWidth: '150px' }}>
                            <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem', color: '#94a3b8' }}>Amount (₹)</label>
                            <input 
                                type="number" 
                                placeholder="Amount (₹)" 
                                value={fundingAmount}
                                onChange={(e) => setFundingAmount(e.target.value)}
                                min="1"
                                style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid rgba(6,182,212,0.2)', background: '#1e293b', color: '#fff', outline: 'none', transition: 'border-color 0.3s' }}
                                onFocus={e => e.target.style.borderColor = '#06b6d4'}
                                onBlur={e => e.target.style.borderColor = 'rgba(6,182,212,0.2)'}
                            />
                        </div>
                        <button 
                            type="submit" 
                            disabled={isSaving || !fundingAmount || !contributorName}
                            className="fund-wallet-btn ripple-btn"
                            onClick={createRipple}
                        >
                            {isSaving ? 'Adding...' : 'Fund Wallet'}
                        </button>
                    </form>
                    {(!contributorName) && <p style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '10px' }}>Please enter a contributor name above first.</p>}
                </div>

                <div className="animation-section animate-entrance" style={{ marginTop: '40px' }}>
                    <h4 style={{ textAlign: 'center', marginBottom: '20px', background: 'linear-gradient(135deg, #06b6d4, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', fontSize: '1.2rem', letterSpacing: '1px' }}>Trip Journey Progress</h4>
                    <LiquidCityAnimation percentage={percentage} city={trip.destination} />
                </div>
            </div>
        </div>
    );
};

export default SavingsPlannerTab;
