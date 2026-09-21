import React, { useState, useEffect, useRef } from 'react';
import LiquidCityAnimation from './LiquidCityAnimation';
import { useAuth } from '../../context/AuthContext';
import ViewProfileModal from './ViewProfileModal';

/* ─── SVG Icons ─── */
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

const IconChevronDown = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="6 9 12 15 18 9"/>
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
    transport: { icon: IconTrain, color: '#0ea5e9', label: 'TRANSPORT', cssClass: 'transport', gradient: 'linear-gradient(135deg, #0ea5e9, #38bdf8)', bgTint: 'rgba(14, 165, 233, 0.06)' },
    stay:      { icon: IconBuilding, color: '#6366f1', label: 'STAY', cssClass: 'stay', gradient: 'linear-gradient(135deg, #6366f1, #818cf8)', bgTint: 'rgba(99, 102, 241, 0.06)' },
    food:      { icon: IconMapPin, color: '#f59e0b', label: 'VISIT SPOTS', cssClass: 'food', gradient: 'linear-gradient(135deg, #f59e0b, #fbbf24)', bgTint: 'rgba(245, 158, 11, 0.06)' },
    buffer:    { icon: IconCoffee, color: '#f43f5e', label: 'FOOD & OTHER EXPENSES', cssClass: 'buffer', gradient: 'linear-gradient(135deg, #f43f5e, #fb7185)', bgTint: 'rgba(244, 63, 94, 0.06)' },
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
    
    // Filter out members who have a uid but are no longer in the trip (left or kicked previously)
    const activeGroupMembers = groupMembers.filter(m => {
        if (typeof m === 'object' && (m.uid || m.id)) {
            const hasId = m.id && (trip.member_ids?.includes(m.id) || trip.user_id === m.id);
            const hasUid = m.uid && (trip.member_ids?.includes(m.uid) || trip.user_id === m.uid);
            return hasId || hasUid;
        }
        return true;
    });
    
    const validMembers = activeGroupMembers.map(m => typeof m === 'object' ? m?.name : m).filter(m => m && String(m).trim() !== '');
    
    // Group members fetch state
    const [members, setMembers] = useState([]);
    const [loadingMembers, setLoadingMembers] = useState(false);
    const [viewProfile, setViewProfile] = useState(null);

    const ownerMember = members.find(m => m.id === trip.user_id);
    const ownerName = ownerMember 
        ? (ownerMember.full_name || ownerMember.username || 'Owner')
        : 'Owner';

    const currentMember = members.find(m => m.id === session?.user?.id);
    const currentUserName = currentMember
        ? (currentMember.full_name || currentMember.username)
        : (session?.user?.user_metadata?.full_name || session?.user?.user_metadata?.name || session?.user?.email?.split('@')[0] || 'Guest');
    
    const allContributors = [ownerName, ...validMembers.filter(v => v !== ownerName)];
    const hasMembers = validMembers.length > 0;

    const [fundingAmount, setFundingAmount] = useState('');
    const [selectedWallet, setSelectedWallet] = useState(sortedWallets[0]?.id || '');
    const [contributorName, setContributorName] = useState(allContributors[0]);
    const [isSaving, setIsSaving] = useState(false);
    const [justFunded, setJustFunded] = useState(null);
    const [membersOpen, setMembersOpen] = useState(true);

    const isOwner = session?.user?.id === trip.user_id;

    // Ensure non-owners can only contribute as themselves
    useEffect(() => {
        if (!isOwner) {
            setContributorName(currentUserName);
        } else if (!contributorName || !allContributors.includes(contributorName)) {
            setContributorName(allContributors[0]);
        }
    }, [isOwner, currentUserName, allContributors, contributorName]);

    // Calculate Member Contributions
    const personalTarget = allContributors.length > 0 ? Math.round(totalTarget / allContributors.length) : totalTarget;
    
    const memberContributions = {};
    allContributors.forEach(name => {
        memberContributions[name] = 0;
    });

    wallets.forEach(w => {
        if (w.wallet_transactions) {
            w.wallet_transactions.forEach(tx => {
                if (memberContributions[tx.contributor_name] !== undefined) {
                    memberContributions[tx.contributor_name] += Number(tx.amount);
                } else {
                    memberContributions[tx.contributor_name] = Number(tx.amount);
                }
            });
        }
    });

    const getActiveOwnerFunds = (contributorName) => {
        let activeOwnerFunds = 0;
        wallets.forEach(w => {
            if (w.wallet_transactions) {
                let currentBalance = 0;
                let memberNet = 0;
                w.wallet_transactions.forEach(tx => {
                    if (tx.contributor_name === contributorName) {
                        const amt = Number(tx.amount);
                        currentBalance += amt;
                        // If added by someone other than the owner (i.e. the member themselves)
                        if (tx.added_by && tx.added_by !== trip.user_id) {
                            memberNet += amt;
                        }
                    }
                });
                activeOwnerFunds += Math.max(0, currentBalance - memberNet);
            }
        });
        return activeOwnerFunds;
    };

    // Animated counters
    const animTarget = useAnimatedCounter(totalTarget);
    const animSaved = useAnimatedCounter(totalSaved);
    const animRemaining = useAnimatedCounter(Math.max(0, totalTarget - totalSaved));

    useEffect(() => {
        const fetchMembers = async () => {
            if (!trip.member_ids || trip.member_ids.length === 0) return;
            setLoadingMembers(true);
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/saved-trips/${trip.id}/members`, {
                    headers: { 'Authorization': `Bearer ${session.access_token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setMembers(data);
                }
            } catch (err) {
                console.error("Failed to fetch members:", err);
            } finally {
                setLoadingMembers(false);
            }
        };
        fetchMembers();
    }, [trip.id, trip.member_ids, session]);

    const handleAddFunds = async (e) => {
        e.preventDefault();
        if (!fundingAmount || isNaN(fundingAmount) || Number(fundingAmount) <= 0) return;
        
        const wallet = sortedWallets.find(w => w.id === selectedWallet);
        if (!wallet) return;

        const maxWalletAllowed = Number(wallet.target_amount) - Number(wallet.saved_amount);
        const contributedSoFar = memberContributions[contributorName] || 0;
        const remainingPersonalBudget = personalTarget - contributedSoFar;

        if (maxWalletAllowed <= 0) {
            alert("This wallet is already fully funded!");
            return;
        }

        if (remainingPersonalBudget <= 0) {
            alert(`${contributorName} has already reached their funding target of ₹${personalTarget}!`);
            return;
        }

        const actualMaxAllowed = Math.min(maxWalletAllowed, remainingPersonalBudget);
        
        if (Number(fundingAmount) > actualMaxAllowed) {
            if (remainingPersonalBudget < maxWalletAllowed) {
                alert(`Cannot fund ₹${fundingAmount}. ${contributorName} only has ₹${remainingPersonalBudget} left in their personal budget.`);
            } else {
                alert(`Cannot fund ₹${fundingAmount}. This wallet only needs ₹${maxWalletAllowed} to be fully funded.`);
            }
            return;
        }

        const amountToAdd = Number(fundingAmount);

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
            const { wallet: dbWallet } = await res.json();
            
            const newWallets = wallets.map(w => {
                if (w.id === wallet.id) {
                    const newTx = { contributor_name: contributorName, amount: amountToAdd, added_by: session?.user?.id };
                    return { 
                        ...w, 
                        saved_amount: Number(w.saved_amount) + amountToAdd,
                        wallet_transactions: w.wallet_transactions ? [...w.wallet_transactions, newTx] : [newTx]
                    };
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

    const handleRejectOwnerFunds = async (memberToReject) => {
        if (!window.confirm(`Are you sure you want to reject the owner's funds for ${memberToReject}?`)) return;

        setIsSaving(true);
        try {
            const token = session?.access_token || '';

            const res = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/saved-trips/${trip.id}/remove-owner-funds`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json', 
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify({ 
                    contributor_name: memberToReject 
                })
            });

            if (!res.ok) throw new Error('Failed to remove owner funds from backend');
            
            const { trip: updatedTrip } = await res.json();
            
            // updatedTrip has the fresh trip_wallets from the backend
            onUpdate(updatedTrip);
            alert(`Successfully rejected owner funds for ${memberToReject}`);
        } catch (err) {
            console.error('Failed to reject funds', err);
            alert('Failed to reject funds');
        } finally {
            setIsSaving(false);
        }
    };

    const handleKickMember = async (memberId) => {
        if (!window.confirm('Are you sure you want to kick this member? They will lose access to the trip immediately.')) return;
        
        try {
            const token = session?.access_token || '';
            const res = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/saved-trips/${trip.id}/kick`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ member_id: memberId })
            });

            if (res.ok) {
                const { trip: updatedTrip } = await res.json();
                onUpdate(updatedTrip);
                setMembers(prev => prev.filter(m => m.id !== memberId));
            } else {
                throw new Error('Failed to kick member');
            }
        } catch (err) {
            console.error('Error kicking member:', err);
            alert('Failed to kick member');
        }
    };


    return (
        <div style={{ padding: '0px', color: '#f8fafc', animation: 'fadeIn 0.5s ease-out' }}>
            {/* ─── Header ─── */}
            <div className="planner-header animate-entrance">
                <h3>Financial Goal Tracker</h3>
            </div>

            {/* ─── Stat Cards ─── */}
            <div style={{ display: 'flex', gap: '24px', marginBottom: '20px', flexWrap: 'wrap' }}>
                <div className="stat-card" style={{ flex: '1', minWidth: '150px' }}>
                    <div className="stat-label">TARGET</div>
                    <div className="stat-value">₹{animTarget.toLocaleString()}</div>
                </div>
                <div className="stat-card stat-card--saved" style={{ flex: '1', minWidth: '150px' }}>
                    <div className="stat-label">SAVED</div>
                    <div className="stat-value" style={{ color: '#10b981' }}>₹{animSaved.toLocaleString()}</div>
                </div>
                <div className="stat-card stat-card--remaining" style={{ flex: '1', minWidth: '150px' }}>
                    <div className="stat-label">REMAINING</div>
                    <div className="stat-value" style={{ color: '#f59e0b' }}>₹{animRemaining.toLocaleString()}</div>
                </div>
            </div>

            {/* ─── Group Members ─── */}
            {trip.member_ids && trip.member_ids.length > 0 && (
                <div className="accordion-card animate-entrance" style={{ margin: '28px 0', animationDelay: '0.12s' }}>
                    <div className="accordion-header" onClick={() => setMembersOpen(!membersOpen)}>
                        <h3>
                            <span className="section-dot" style={{ background: '#0ea5e9' }} />
                            Group Members
                        </h3>
                        <span className={`accordion-chevron ${membersOpen ? 'open' : ''}`}>
                            <IconChevronDown />
                        </span>
                    </div>
                    {membersOpen && (
                        <div className="accordion-body">
                            {loadingMembers ? (
                                <p style={{ color: '#94a3b8', margin: 0, padding: '8px 0' }}>Loading members...</p>
                            ) : (
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                                    {members.map(member => (
                                        <div key={member.id} className="member-card">
                                            <div className="member-avatar">
                                                {member.avatar_url ? (
                                                    <img src={member.avatar_url} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                ) : (
                                                    member.full_name?.charAt(0) || member.username?.charAt(0) || 'U'
                                                )}
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <h4 style={{ margin: 0, color: '#e2e8f0', fontSize: '14px', fontWeight: 600 }}>
                                                    {member.full_name || member.username}
                                                    {member.id === trip.user_id && <span className="owner-badge">Owner</span>}
                                                </h4>
                                                {member.username && <p style={{ margin: '2px 0 0', color: '#64748b', fontSize: '12px' }}>@{member.username}</p>}
                                            </div>
                                            <div style={{ display: 'flex', gap: '6px' }}>
                                                <button 
                                                    className="member-view-btn"
                                                    onClick={() => setViewProfile(member)}
                                                >
                                                    View
                                                </button>
                                                {member.id !== trip.user_id && isOwner && (
                                                    <button 
                                                        className="member-kick-btn"
                                                        onClick={() => handleKickMember(member.id)}
                                                        style={{ 
                                                            background: 'rgba(239, 68, 68, 0.1)', 
                                                            color: '#ef4444', 
                                                            border: '1px solid rgba(239, 68, 68, 0.2)', 
                                                            padding: '6px 12px', 
                                                            borderRadius: '6px', 
                                                            fontSize: '12px', 
                                                            fontWeight: 600, 
                                                            cursor: 'pointer',
                                                            transition: 'all 0.2s' 
                                                        }}
                                                        onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)'; }}
                                                        onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'; }}
                                                    >
                                                        Kick
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* ─── Member Wallets Section ─── */}
            <div className="animate-entrance" style={{ margin: '28px 0', animationDelay: '0.14s' }}>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>
                    Member Wallets (Target: ₹{personalTarget.toLocaleString()} each)
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
                    {allContributors.map((name, idx) => {
                        const contributed = memberContributions[name] || 0;
                        const percent = personalTarget > 0 ? Math.min(100, Math.round((contributed / personalTarget) * 100)) : 0;
                        
                        // Check if the current user is viewing their own profile, or if it's the owner checking another member
                        const isSelf = currentUserName === name;
                        const ownerFundsAmount = getActiveOwnerFunds(name);
                        
                        // Only show reject button if there are active owner funds, AND the member is viewing their own profile
                        // The user said: "so if the owner miss funds then the member can remove it"
                        const canRejectFunds = ownerFundsAmount > 0 && isSelf && !isOwner;
                        
                        return (
                            <div key={idx} className="glass-card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontWeight: 600, color: '#f1f5f9', fontSize: '15px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '120px' }} title={name}>
                                        {name}
                                    </span>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        {canRejectFunds && (
                                            <button 
                                                className="member-kick-btn"
                                                onClick={() => handleRejectOwnerFunds(name)}
                                                disabled={isSaving}
                                                style={{ 
                                                    background: 'rgba(245, 158, 11, 0.15)', 
                                                    color: '#f59e0b', 
                                                    border: '1px solid rgba(245, 158, 11, 0.3)', 
                                                    padding: '4px 10px', 
                                                    borderRadius: '6px', 
                                                    fontSize: '11px', 
                                                    fontWeight: 600, 
                                                    cursor: 'pointer',
                                                    transition: 'all 0.2s' 
                                                }}
                                                onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(245, 158, 11, 0.25)'; }}
                                                onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(245, 158, 11, 0.15)'; }}
                                            >
                                                Reject Owner Funds (₹{ownerFundsAmount})
                                            </button>
                                        )}
                                        <span style={{ color: '#0ea5e9', fontWeight: 700, fontSize: '14px', flexShrink: 0 }}>
                                            ₹{contributed.toLocaleString()} <span style={{ color: '#64748b', fontSize: '12px', fontWeight: 500 }}>/ ₹{personalTarget.toLocaleString()}</span>
                                        </span>
                                    </div>
                                </div>
                                <div className="progress-bar-bg" style={{ height: '6px', background: 'rgba(255,255,255,0.06)' }}>
                                    <div 
                                        className="progress-bar-fill" 
                                        style={{ width: `${percent}%`, background: 'linear-gradient(90deg, #0ea5e9, #10b981)' }} 
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>


            <div className="planner-grid" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                
                {/* ─── Contributor Selector ─── */}
                <div className="animate-entrance" style={{ 
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', 
                    padding: '16px 24px', background: 'rgba(255,255,255,0.055)', borderRadius: '14px',
                    border: '1px solid rgba(255,255,255,0.08)', animationDelay: '0.18s',
                    flexWrap: 'wrap'
                }}>
                    <label style={{ fontWeight: 700, color: '#64748b', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1px' }}>Contributor</label>
                    {isOwner && hasMembers ? (
                        <select 
                            className="glass-select"
                            value={contributorName}
                            onChange={(e) => setContributorName(e.target.value)}
                            style={{ width: '250px' }}
                        >
                            {allContributors.map((member, idx) => (
                                <option key={idx} value={member}>{member}</option>
                            ))}
                        </select>
                    ) : (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <input 
                                type="text" 
                                className="glass-input"
                                value={defaultName}
                                disabled
                                style={{ width: '250px', cursor: 'not-allowed', color: '#94a3b8', background: 'rgba(255,255,255,0.03)' }}
                            />
                            {!isOwner && <span style={{ fontSize: '12px', color: '#64748b' }} title="Only the trip owner can fund on behalf of others">🔒</span>}
                        </div>
                    )}
                </div>

                {/* ─── Wallet Cards Grid ─── */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '18px' }}>
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
                                style={{ animationDelay: `${0.2 + idx * 0.08}s` }}
                            >
                                {/* Confetti burst when wallet is fully funded */}
                                {isJustFunded && Array.from({ length: 12 }).map((_, i) => (
                                    <span
                                        key={i}
                                        className="confetti-piece"
                                        style={{
                                            left: `${Math.random() * 100}%`,
                                            top: `${Math.random() * 40}%`,
                                            background: [config.color, '#fbbf24', '#34d399', '#38bdf8', '#fb7185'][i % 5],
                                            animationDelay: `${Math.random() * 0.5}s`,
                                            animationDuration: `${1 + Math.random() * 1}s`,
                                        }}
                                    />
                                ))}

                                {/* Top accent bar */}
                                <div className="wallet-accent-bar" style={{ background: config.gradient }} />

                                {/* Header */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '18px', flexWrap: 'wrap', gap: '8px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
                                        <div className="wallet-icon-badge" style={{ background: config.bgTint }}>
                                            <WalletIcon color={config.color} />
                                        </div>
                                        <div style={{ minWidth: 0 }}>
                                            <span className="wallet-name">
                                                {config.label}
                                            </span>
                                            <div className="wallet-subtitle">{wPercent}% funded</div>
                                        </div>
                                    </div>
                                    {isComplete && <span className="funded-badge">FUNDED ✓</span>}
                                </div>

                                {/* Progress */}
                                <div className="progress-bar-bg" style={{ marginBottom: '12px' }}>
                                    <div 
                                        className={`progress-bar-fill ${isComplete ? 'progress-bar-fill--complete' : `progress-bar-fill--${config.cssClass}`}`}
                                        style={{ width: `${wPercent}%` }}
                                    />
                                </div>

                                {/* Stats row */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', color: '#cbd5e1', flexWrap: 'wrap', gap: '4px' }}>
                                    <span>₹{wSaved.toLocaleString()} <span style={{ color: '#64748b' }}>saved</span></span>
                                    <span>₹{wTarget.toLocaleString()} <span style={{ color: '#64748b' }}>target</span></span>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* ─── Add Funds Form ─── */}
                <div className="animate-entrance" style={{ 
                    background: 'rgba(255,255,255,0.055)', 
                    padding: '26px', 
                    borderRadius: '18px', 
                    border: '1px solid rgba(255,255,255,0.09)',
                    animationDelay: '0.4s'
                }}>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>
                        Add Funds
                    </div>
                    <form className="add-funds-form" onSubmit={handleAddFunds} style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', alignItems: 'flex-end', background: 'transparent', padding: 0, borderRadius: 0, marginTop: 0 }}>
                        <div style={{ flex: '1', minWidth: '150px' }}>
                            <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', color: '#64748b', fontWeight: 600 }}>Select Wallet</label>
                            <select 
                                className="glass-select"
                                value={selectedWallet} 
                                onChange={(e) => setSelectedWallet(e.target.value)}
                                style={{ width: '100%' }}
                            >
                                {sortedWallets.map(w => {
                                    const cfg = WALLET_CONFIG[w.wallet_type] || WALLET_CONFIG.transport;
                                    return (
                                        <option key={w.id} value={w.id}>
                                            {cfg.label}
                                        </option>
                                    );
                                })}
                            </select>
                        </div>
                        <div style={{ flex: '1', minWidth: '150px' }}>
                            <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', color: '#64748b', fontWeight: 600 }}>Amount (₹)</label>
                            <input 
                                type="number" 
                                className="glass-input"
                                placeholder="Enter amount" 
                                value={fundingAmount}
                                onChange={(e) => setFundingAmount(e.target.value)}
                                min="1"
                                style={{ width: '100%' }}
                            />
                        </div>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button 
                                type="submit" 
                                disabled={isSaving || !fundingAmount || !contributorName}
                                className="fund-wallet-btn ripple-btn"
                                onClick={createRipple}
                                style={{
                                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                    color: '#fff',
                                    border: 'none',
                                    padding: '12px 20px',
                                    borderRadius: '8px',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '6px',
                                    transition: 'all 0.3s ease',
                                    opacity: (isSaving || !fundingAmount || !contributorName) ? 0.5 : 1,
                                    pointerEvents: (isSaving || !fundingAmount || !contributorName) ? 'none' : 'auto'
                                }}
                            >
                                {isSaving ? 'Processing...' : '+ Fund Wallet'}
                            </button>
                        </div>
                    </form>
                    {(!contributorName) && <p style={{ color: '#f87171', fontSize: '0.8rem', marginTop: '12px' }}>Please enter a contributor name above first.</p>}
                </div>

                {/* ─── Liquid City Animation ─── */}
                <div className="animate-entrance" style={{ marginTop: '20px', animationDelay: '0.5s' }}>
                    <h4 style={{ 
                        textAlign: 'center', marginBottom: '20px', 
                        background: 'linear-gradient(135deg, #0ea5e9, #10b981)', 
                        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', 
                        backgroundClip: 'text', fontSize: '1.1rem', letterSpacing: '0.5px', fontWeight: 800, paddingBottom: '0.1em', lineHeight: '1.2' 
                    }}>
                        Trip Journey Progress
                    </h4>
                    <LiquidCityAnimation percentage={percentage} city={trip.destination} />
                </div>
            </div>

            {viewProfile && (
                <ViewProfileModal userProfile={viewProfile} onClose={() => setViewProfile(null)} />
            )}
        </div>
    );
};

export default SavingsPlannerTab;
