import React, { useState } from 'react';
import LiquidCityAnimation from './LiquidCityAnimation';
import { useAuth } from '../../context/AuthContext';

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
    const validMembers = groupMembers.filter(m => m && m.trim() !== '');
    const defaultName = session?.user?.user_metadata?.full_name || session?.user?.user_metadata?.name || session?.user?.email?.split('@')[0] || 'admin';
    const allContributors = [defaultName, ...validMembers];

    const [fundingAmount, setFundingAmount] = useState('');
    const [selectedWallet, setSelectedWallet] = useState(sortedWallets[0]?.id || '');
    const [contributorName, setContributorName] = useState(allContributors[0]);
    const [isSaving, setIsSaving] = useState(false);

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
                        <span className="value">₹{totalTarget.toLocaleString()}</span>
                    </div>
                    <div className="stat">
                        <span className="label">Saved</span>
                        <span className="value highlight">₹{totalSaved.toLocaleString()}</span>
                    </div>
                    <div className="stat">
                        <span className="label">Remaining</span>
                        <span className="value">₹{Math.max(0, totalTarget - totalSaved).toLocaleString()}</span>
                    </div>
                </div>
            </div>

            <div className="planner-grid" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div className="contributor-section" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', margin: '20px 0' }}>
                    <label style={{ fontWeight: 'bold' }}>contributor =</label>
                    {hasMembers ? (
                        <select 
                            value={contributorName}
                            onChange={(e) => setContributorName(e.target.value)}
                            style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #4ade8055', background: '#ffffff0a', color: '#fff', width: '250px' }}
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
                            style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #4ade8055', background: '#ffffff0a', color: '#fff', width: '250px' }}
                        />
                    )}
                </div>

                <div className="wallets-list" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                    {sortedWallets.map(wallet => {
                        const wTarget = Number(wallet.target_amount);
                        const wSaved = Number(wallet.saved_amount);
                        const wPercent = wTarget > 0 ? Math.min(100, Math.round((wSaved / wTarget) * 100)) : 0;
                        
                        return (
                            <div key={wallet.id} className="wallet-card" style={{ background: '#1a1d24', padding: '20px', borderRadius: '12px', border: '1px solid #333' }}>
                                <div className="wallet-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <span className="wallet-icon">
                                            {wallet.wallet_type === 'transport' && '🚆'}
                                            {wallet.wallet_type === 'stay' && '🏨'}
                                            {wallet.wallet_type === 'food' && '📍'}
                                            {wallet.wallet_type === 'buffer' && '🍔'}
                                        </span>
                                        <span className="wallet-name" style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                                            {wallet.wallet_type === 'transport' && 'TRANSPORT'}
                                            {wallet.wallet_type === 'stay' && 'STAY'}
                                            {wallet.wallet_type === 'food' && 'VISIT SPOTS'}
                                            {wallet.wallet_type === 'buffer' && 'FOOD & OTHER EXPENSES'}
                                        </span>
                                    </div>
                                </div>
                                <div className="progress-bar-bg" style={{ background: '#333', height: '12px', borderRadius: '6px', overflow: 'hidden', marginBottom: '10px' }}>
                                    <div className="progress-bar-fill" style={{ width: `${wPercent}%`, background: wPercent >= 100 ? '#4ade80' : '#3b82f6', height: '100%', transition: 'width 0.5s ease' }}></div>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: '#aaa' }}>
                                    <span>₹{wSaved.toLocaleString()} saved</span>
                                    <span>Target: ₹{wTarget.toLocaleString()}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="add-funds-container" style={{ background: '#1a1d24', padding: '20px', borderRadius: '12px', border: '1px solid #333', marginTop: '10px' }}>
                    <form className="add-funds-form" onSubmit={handleAddFunds} style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', alignItems: 'flex-end' }}>
                        <div style={{ flex: '1', minWidth: '150px' }}>
                            <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem', color: '#aaa' }}>Select Wallet</label>
                            <select 
                                value={selectedWallet} 
                                onChange={(e) => setSelectedWallet(e.target.value)}
                                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #444', background: '#0a0a0a', color: '#fff' }}
                            >
                                {sortedWallets.map(w => (
                                    <option key={w.id} value={w.id}>
                                        {w.wallet_type === 'transport' && 'TRANSPORT'}
                                        {w.wallet_type === 'stay' && 'STAY'}
                                        {w.wallet_type === 'food' && 'VISIT SPOTS'}
                                        {w.wallet_type === 'buffer' && 'FOOD & OTHER EXPENSES'}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div style={{ flex: '1', minWidth: '150px' }}>
                            <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem', color: '#aaa' }}>Amount (₹)</label>
                            <input 
                                type="number" 
                                placeholder="Amount (₹)" 
                                value={fundingAmount}
                                onChange={(e) => setFundingAmount(e.target.value)}
                                min="1"
                                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #444', background: '#0a0a0a', color: '#fff' }}
                            />
                        </div>
                        <button 
                            type="submit" 
                            disabled={isSaving || !fundingAmount || !contributorName}
                            style={{ 
                                padding: '10px 24px', borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: 'pointer', height: '42px',
                                background: (!fundingAmount || !contributorName) ? '#444' : '#3b82f6', color: '#fff' 
                            }}
                        >
                            {isSaving ? 'Adding...' : 'Fund Wallet'}
                        </button>
                    </form>
                    {(!contributorName) && <p style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '10px' }}>Please enter a contributor name above first.</p>}
                </div>

                <div className="animation-section" style={{ marginTop: '40px', background: '#1a1d24', padding: '30px', borderRadius: '16px', border: '1px solid #333' }}>
                    <h4 style={{ textAlign: 'center', marginBottom: '20px' }}>Trip Journey Progress</h4>
                    <LiquidCityAnimation percentage={percentage} city={trip.destination} />
                </div>
            </div>
        </div>
    );
};

export default SavingsPlannerTab;
