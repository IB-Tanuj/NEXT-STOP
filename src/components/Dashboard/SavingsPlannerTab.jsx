import React, { useState } from 'react';
import LiquidCityAnimation from './LiquidCityAnimation';

const SavingsPlannerTab = ({ trip, onUpdate }) => {
    const wallets = trip.trip_wallets || [];
    
    // Sort wallets to have a consistent order (transport, stay, food, buffer)
    const order = { transport: 1, stay: 2, food: 3, buffer: 4 };
    const sortedWallets = [...wallets].sort((a, b) => order[a.wallet_type] - order[b.wallet_type]);

    const totalTarget = sortedWallets.reduce((sum, w) => sum + Number(w.target_amount), 0);
    const totalSaved = sortedWallets.reduce((sum, w) => sum + Number(w.saved_amount), 0);
    const percentage = totalTarget > 0 ? Math.min(100, Math.round((totalSaved / totalTarget) * 100)) : 0;

    const [fundingAmount, setFundingAmount] = useState('');
    const [selectedWallet, setSelectedWallet] = useState(sortedWallets[0]?.id || '');
    const [isSaving, setIsSaving] = useState(false);

    const handleAddFunds = async (e) => {
        e.preventDefault();
        if (!fundingAmount || isNaN(fundingAmount) || Number(fundingAmount) <= 0) return;
        
        const wallet = sortedWallets.find(w => w.id === selectedWallet);
        if (!wallet) return;

        setIsSaving(true);
        try {
            // Note: In real app, we need the user auth token
            const userStr = localStorage.getItem('sb-yatra-auth-token'); // Check how token is stored
            const token = userStr ? JSON.parse(userStr)?.access_token : ''; // Rough guess, better to pass user token via props/context

            // For now we will mock the local update to make UI instantly responsive
            // A real fetch would look like:
            /*
            await fetch('/api/saved-trips/savings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ trip_id: trip.id, wallet_type: wallet.wallet_type, amount: Number(fundingAmount) })
            });
            */
            
            const newWallets = wallets.map(w => {
                if (w.id === wallet.id) {
                    return { ...w, saved_amount: Number(w.saved_amount) + Number(fundingAmount) };
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

            <div className="planner-grid">
                <div className="wallets-section">
                    <h4>Segmented Wallets</h4>
                    <p className="subtitle">Fund your trip piece by piece. Prioritize early bookings like transport!</p>
                    
                    <div className="wallets-list">
                        {sortedWallets.map(wallet => {
                            const wTarget = Number(wallet.target_amount);
                            const wSaved = Number(wallet.saved_amount);
                            const wPercent = wTarget > 0 ? Math.min(100, Math.round((wSaved / wTarget) * 100)) : 0;
                            
                            return (
                                <div key={wallet.id} className="wallet-card">
                                    <div className="wallet-header">
                                        <span className="wallet-icon">
                                            {wallet.wallet_type === 'transport' && '🚆'}
                                            {wallet.wallet_type === 'stay' && '🏨'}
                                            {wallet.wallet_type === 'food' && '🍔'}
                                            {wallet.wallet_type === 'buffer' && '💰'}
                                        </span>
                                        <span className="wallet-name">{wallet.wallet_type.toUpperCase()}</span>
                                        <span className="wallet-amount">₹{wSaved} / ₹{wTarget}</span>
                                    </div>
                                    <div className="progress-bar-bg">
                                        <div className="progress-bar-fill" style={{ width: `${wPercent}%`, background: wPercent >= 100 ? '#2ecc71' : '#3498db' }}></div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <form className="add-funds-form" onSubmit={handleAddFunds}>
                        <h5>Add Savings</h5>
                        <div className="form-row">
                            <select 
                                value={selectedWallet} 
                                onChange={(e) => setSelectedWallet(e.target.value)}
                            >
                                {sortedWallets.map(w => (
                                    <option key={w.id} value={w.id}>{w.wallet_type.toUpperCase()}</option>
                                ))}
                            </select>
                            <input 
                                type="number" 
                                placeholder="Amount (₹)" 
                                value={fundingAmount}
                                onChange={(e) => setFundingAmount(e.target.value)}
                                min="1"
                            />
                            <button type="submit" disabled={isSaving || !fundingAmount}>
                                {isSaving ? 'Adding...' : 'Fund Wallet'}
                            </button>
                        </div>
                    </form>
                </div>

                <div className="animation-section">
                    <h4>Trip Journey Progress</h4>
                    <LiquidCityAnimation percentage={percentage} city={trip.destination} />
                </div>
            </div>
        </div>
    );
};

export default SavingsPlannerTab;
