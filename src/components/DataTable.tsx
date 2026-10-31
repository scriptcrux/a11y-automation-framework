import React, { useState } from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';

export interface Transaction {
  id: string;
  date: string;
  description: string;
  category: string;
  amount: number;
  status: 'Completed' | 'Pending';
}

interface DataTableProps {
  transactions: Transaction[];
}

type SortField = 'date' | 'description' | 'amount';
type SortDirection = 'ascending' | 'descending' | 'none';

export const DataTable: React.FC<DataTableProps> = ({ transactions: initialData }) => {
  const [data, setData] = useState<Transaction[]>(initialData);
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>('none');

  const handleSort = (field: SortField) => {
    let newDirection: SortDirection = 'ascending';

    if (sortField === field) {
      if (sortDirection === 'ascending') newDirection = 'descending';
      else if (sortDirection === 'descending') newDirection = 'none';
      else newDirection = 'ascending';
    }

    setSortField(newDirection === 'none' ? null : field);
    setSortDirection(newDirection);

    if (newDirection === 'none') {
      setData(initialData);
      return;
    }

    const sorted = [...data].sort((a, b) => {
      if (field === 'amount') {
        return newDirection === 'ascending' ? a.amount - b.amount : b.amount - a.amount;
      }
      const valA = a[field].toLowerCase();
      const valB = b[field].toLowerCase();
      if (valA < valB) return newDirection === 'ascending' ? -1 : 1;
      if (valA > valB) return newDirection === 'ascending' ? 1 : -1;
      return 0;
    });

    setData(sorted);
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field || sortDirection === 'none') {
      return <ArrowUpDown size={14} aria-hidden="true" />;
    }
    return sortDirection === 'ascending' ? (
      <ArrowUp size={14} aria-hidden="true" />
    ) : (
      <ArrowDown size={14} aria-hidden="true" />
    );
  };

  const getAriaSort = (field: SortField): 'ascending' | 'descending' | 'none' => {
    if (sortField === field) {
      return sortDirection;
    }
    return 'none';
  };

  return (
    <div className="table-wrapper">
      <table className="data-table" aria-label="Recent Account Transactions">
        <caption>Recent Account Transactions & Activity Log</caption>
        <thead>
          <tr>
            <th scope="col" aria-sort={getAriaSort('date')}>
              <button
                type="button"
                className="sort-btn"
                onClick={() => handleSort('date')}
                aria-label={`Sort by Date. Currently sorted ${getAriaSort('date')}`}
              >
                Date {getSortIcon('date')}
              </button>
            </th>
            <th scope="col" aria-sort={getAriaSort('description')}>
              <button
                type="button"
                className="sort-btn"
                onClick={() => handleSort('description')}
                aria-label={`Sort by Description. Currently sorted ${getAriaSort('description')}`}
              >
                Description {getSortIcon('description')}
              </button>
            </th>
            <th scope="col">Category</th>
            <th scope="col" aria-sort={getAriaSort('amount')}>
              <button
                type="button"
                className="sort-btn"
                onClick={() => handleSort('amount')}
                aria-label={`Sort by Amount. Currently sorted ${getAriaSort('amount')}`}
              >
                Amount {getSortIcon('amount')}
              </button>
            </th>
            <th scope="col">Status</th>
          </tr>
        </thead>
        <tbody>
          {data.map((tx) => (
            <tr key={tx.id}>
              <th scope="row">{tx.date}</th>
              <td>{tx.description}</td>
              <td>{tx.category}</td>
              <td style={{ fontWeight: 600 }}>
                {tx.amount < 0 ? `-$${Math.abs(tx.amount).toFixed(2)}` : `+$${tx.amount.toFixed(2)}`}
              </td>
              <td>
                <span
                  className={`badge-status ${
                    tx.status === 'Completed' ? 'badge-completed' : 'badge-pending'
                  }`}
                  role="status"
                >
                  {tx.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

