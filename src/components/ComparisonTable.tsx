import React from 'react';
import { Check, X } from 'lucide-react';
import './ComparisonTable.css';

const features = [
  {
    name: 'AI-based crop recommendation',
    ecoFarm: true,
    others: false,
  },
  {
    name: 'User input for customization',
    ecoFarm: true,
    others: false,
  },
  {
    name: 'Mobile responsiveness',
    ecoFarm: true,
    others: true,
  },
  {
    name: 'Real-time soil analysis',
    ecoFarm: true,
    others: false,
  },
  {
    name: 'Personalized growth tracking',
    ecoFarm: true,
    others: false,
  },
];

const ComparisonTable = () => {
  return (
    <section className="comparison-section">
      <div className="comparison-container">
        <div className="comparison-header">
          <h2>Why Choose Eco Farm?</h2>
          <p>See how we compare to traditional agriculture websites</p>
        </div>

        <table className="comparison-table">
          <thead>
            <tr>
              <th>Feature</th>
              <th>Eco Farm</th>
              <th>Other Agriculture Websites</th>
            </tr>
          </thead>
          <tbody>
            {features.map((feature, index) => (
              <tr key={index}>
                <td className="feature-name">{feature.name}</td>
                <td>
                  {feature.ecoFarm ? (
                    <Check className="status-icon present" />
                  ) : (
                    <X className="status-icon not-present" />
                  )}
                </td>
                <td>
                  {feature.others ? (
                    <Check className="status-icon present" />
                  ) : (
                    <X className="status-icon not-present" />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default ComparisonTable;