import React, { useState } from 'react';

const TripDetailsTab = ({ trip, onUpdate }) => {
    const data = trip.trip_data;
    
    // We can add simple editable states here in the future
    const handleDownloadHTML = () => {
        const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Trip Itinerary - ${trip.destination}</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto; padding: 20px; }
        h1 { color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 10px; }
        h2 { color: #2980b9; margin-top: 30px; }
        .card { background: #f8f9fa; border-radius: 8px; padding: 15px; margin-bottom: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .itinerary-day { border-left: 4px solid #3498db; padding-left: 15px; margin-bottom: 20px; }
        .emergency { background: #fff3cd; color: #856404; border-left: 4px solid #ffeeba; }
    </style>
</head>
<body>
    <h1>Next Stop: ${trip.destination}</h1>
    <p><strong>Total Budget Estimate:</strong> ₹${trip.total_budget}</p>
    
    <div class="card">
        <h2>🏨 Accommodation</h2>
        <p><strong>Hotel:</strong> ${data.hotel?.name || 'Not selected'}</p>
        <p><strong>Price:</strong> ₹${data.hotel?.price || 0}</p>
    </div>

    <div class="card">
        <h2>🚆 Transport</h2>
        <p><strong>Flight:</strong> ${data.flight?.name || 'N/A'} (₹${data.flight?.price || 0})</p>
        <p><strong>Train:</strong> ${data.train?.name || 'N/A'} (₹${data.train?.price || 0})</p>
    </div>

    <div class="card emergency">
        <h2>🚨 Emergency Contacts</h2>
        <ul>
            ${data.plan?.localEmergency?.map(e => `<li><strong>${e.label}:</strong> ${e.number}</li>`).join('') || '<li>Standard: 112</li>'}
        </ul>
    </div>

    <h2>📅 Daily Itinerary</h2>
    ${data.plan?.itinerary?.map(day => `
        <div class="itinerary-day">
            <h3>Day ${day.day}: ${day.title}</h3>
            <p><strong>Morning:</strong> ${day.morning}</p>
            <p><strong>Afternoon:</strong> ${day.afternoon}</p>
            <p><strong>Evening:</strong> ${day.evening}</p>
        </div>
    `).join('') || '<p>No itinerary generated.</p>'}
</body>
</html>
        `;

        const blob = new Blob([htmlContent], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Trip_Itinerary_${trip.destination.replace(/\s+/g, '_')}.html`;
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="trip-details-tab">
            <div className="details-header">
                <h3>Trip Logistics</h3>
                <button className="download-btn" onClick={handleDownloadHTML}>
                    <i className="fa-solid fa-download"></i> Download Itinerary (Offline)
                </button>
            </div>

            <div className="logistics-grid">
                <div className="logistics-card">
                    <h4>🏨 Accommodation</h4>
                    {/* We can make these inputs instead of spans later to allow editing */}
                    <div className="card-row">
                        <span>Name:</span> <strong>{data.hotel?.name || 'Not selected'}</strong>
                    </div>
                    <div className="card-row">
                        <span>Price:</span> <strong>₹{data.hotel?.price || 0}</strong>
                    </div>
                </div>

                <div className="logistics-card">
                    <h4>🚆 Transport</h4>
                    <div className="card-row">
                        <span>Flight:</span> <strong>{data.flight?.name || 'N/A'}</strong> (₹{data.flight?.price || 0})
                    </div>
                    <div className="card-row">
                        <span>Train:</span> <strong>{data.train?.name || 'N/A'}</strong> (₹{data.train?.price || 0})
                    </div>
                </div>

                <div className="logistics-card emergency">
                    <h4>🚨 Emergency Contacts</h4>
                    <ul>
                        {data.plan?.localEmergency?.map((e, idx) => (
                            <li key={idx}><strong>{e.label}:</strong> {e.number}</li>
                        ))}
                    </ul>
                </div>
            </div>

            <div className="itinerary-section">
                <h4>📅 Daily Itinerary</h4>
                <div className="itinerary-timeline">
                    {data.plan?.itinerary?.map((day, idx) => (
                        <div key={idx} className="timeline-item">
                            <div className="timeline-badge">Day {day.day}</div>
                            <div className="timeline-content">
                                <h5>{day.title}</h5>
                                <p><strong>Morning:</strong> {day.morning}</p>
                                <p><strong>Afternoon:</strong> {day.afternoon}</p>
                                <p><strong>Evening:</strong> {day.evening}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TripDetailsTab;
