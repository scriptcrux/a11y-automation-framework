import React, { useState } from 'react';
import { ArrowUpRight, DollarSign, RefreshCw, Send } from 'lucide-react';
import { DataTable, Transaction } from '../components/DataTable';
import { ModalDialog } from '../components/ModalDialog';

const initialTransactions: Transaction[] = [
  {
    id: 'tx-101',
    date: '2026-10-30',
    description: 'Direct Deposit - Enterprise Payroll',
    category: 'Income',
    amount: 4850.00,
    status: 'Completed'
  },
  {
    id: 'tx-102',
    date: '2026-10-29',
    description: 'Amazon Web Services Cloud Hosting',
    category: 'Operations',
    amount: -340.50,
    status: 'Completed'
  },
  {
    id: 'tx-103',
    date: '2026-10-28',
    description: 'Stripe Merchant Processing Payout',
    category: 'Revenue',
    amount: 1250.75,
    status: 'Completed'
  },
  {
    id: 'tx-104',
    date: '2026-10-27',
    description: 'Office Supplies & Equipment',
    category: 'Supplies',
    amount: -128.90,
    status: 'Pending'
  }
];

interface DashboardProps {
  onNotify: (message: string, type?: 'info' | 'alert') => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNotify }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalAmount, setModalAmount] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState('Just now');

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      const timeStr = new Date().toLocaleTimeString();
      setLastRefreshed(timeStr);
      onNotify(`Account balances updated successfully at ${timeStr}. Total balance: $42,390.85.`);
    }, 600);
  };

  const handleQuickSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalAmount || parseFloat(modalAmount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }
    setIsModalOpen(false);
    onNotify(`Quick transfer of $${parseFloat(modalAmount).toFixed(2)} sent successfully!`);
    setModalAmount('');
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1>Commercial Accounts Overview</h1>
          <p>Welcome back! Last verified sync: {lastRefreshed}</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleRefresh}
            disabled={isRefreshing}
            aria-label="Sync Balances - Refresh financial balances and recent activity"
            data-testid="refresh-btn"
          >
            <RefreshCw size={18} className={isRefreshing ? 'spin-icon' : ''} aria-hidden="true" />
            <span>{isRefreshing ? 'Updating...' : 'Sync Balances'}</span>
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => setIsModalOpen(true)}
            data-testid="open-quick-transfer-btn"
          >
            <Send size={18} aria-hidden="true" />
            <span>Quick Transfer</span>
          </button>
        </div>
      </div>

      {/* Account Metric Cards */}
      <section aria-labelledby="metrics-heading">
        <h2 id="metrics-heading" className="sr-only">Account Financial Balances</h2>
        <div className="grid-cols-3">
          <div className="card">
            <h3>Operating Checking</h3>
            <div style={{ fontSize: '2rem', fontWeight: 800, margin: '0.5rem 0', color: 'var(--text-primary)' }}>
              $34,820.50
            </div>
            <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--success)' }}>
              <ArrowUpRight size={16} style={{ display: 'inline', verticalAlign: 'middle' }} aria-hidden="true" />
              <span> +4.2% from previous month</span>
            </p>
          </div>

          <div className="card">
            <h3>High-Yield Reserve</h3>
            <div style={{ fontSize: '2rem', fontWeight: 800, margin: '0.5rem 0', color: 'var(--text-primary)' }}>
              $150,000.00
            </div>
            <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              4.85% APY • Monthly Interest Accruing
            </p>
          </div>

          <div className="card">
            <h3>Pending Outflow</h3>
            <div style={{ fontSize: '2rem', fontWeight: 800, margin: '0.5rem 0', color: 'var(--text-primary)' }}>
              $1,468.90
            </div>
            <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              3 scheduled automated bill payments
            </p>
          </div>
        </div>
      </section>

      {/* Transactions Section with Accessible Table */}
      <section aria-labelledby="activity-heading">
        <h2 id="activity-heading">Activity & Ledger</h2>
        <DataTable transactions={initialTransactions} />
      </section>

      {/* Quick Transfer Modal */}
      <ModalDialog
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Quick Domestic Transfer"
        description="Transfer instant funds to your verified external accounts without fees."
      >
        <form onSubmit={handleQuickSend} noValidate>
          <div className="form-group">
            <label htmlFor="quick-recipient" className="form-label">
              Destination Account
            </label>
            <select id="quick-recipient" className="form-select" defaultValue="checking-2">
              <option value="checking-2">Secondary Checking (*5412)</option>
              <option value="payroll">Payroll Reserve (*9940)</option>
              <option value="tax">Tax Escrow (*3310)</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="quick-amount" className="form-label">
              Transfer Amount ($ USD)
            </label>
            <input
              id="quick-amount"
              type="number"
              step="0.01"
              min="1"
              className="form-input"
              value={modalAmount}
              onChange={(e) => setModalAmount(e.target.value)}
              placeholder="e.g. 500.00"
              required
              data-testid="modal-quick-amount"
            />
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setIsModalOpen(false)}
              data-testid="modal-cancel-btn"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              data-testid="modal-submit-btn"
            >
              Confirm Transfer
            </button>
          </div>
        </form>
      </ModalDialog>
    </div>
  );
};

