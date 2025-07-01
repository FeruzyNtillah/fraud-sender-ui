import React, { useState, useEffect } from 'react';
// eslint-disable-next-line no-unused-vars
import { Box, Typography, Divider, Card, List, ListItem, ListItemText, Avatar, Chip, Alert } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import BlockIcon from '@mui/icons-material/Block';

const RecipientInterface = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  // eslint-disable-next-line no-unused-vars
  const [error, setError] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [recipientId, setRecipientId] = useState('4928304117905205'); // Default recipient ID

  useEffect(() => {
    const checkForTransactions = () => {
      try {
        const storedData = localStorage.getItem('transactions');
        
        if (!storedData) {
          setTransactions([]);
          setLoading(false);
          return;
        }

        const storedTransactions = JSON.parse(storedData);
        
        if (!Array.isArray(storedTransactions)) {
          console.error('Stored transactions is not an array:', storedTransactions);
          setError('Invalid transaction data format');
          setLoading(false);
          return;
        }

        // Filter and map to ensure consistent data structure
        const recipientTransactions = storedTransactions
          .filter(tx => tx && tx.recipient && tx.recipient.toString() === recipientId.toString())
          .map(tx => ({
            ...tx,
            // Ensure these fields exist
            transactionid: tx.transactionid || crypto.randomUUID(),
            amount: parseFloat(tx.amount) || 0,
            status: tx.status || 'pending',
            fraud_probability: parseFloat(tx.fraud_probability) || 0,
            transaction_time: tx.transaction_time || new Date().toISOString()
          }));

        setTransactions(recipientTransactions);
        setError(null);
        setLoading(false);
      } catch (error) {
        console.error('Error processing transactions:', error);
        setError('Failed to load transactions');
        setLoading(false);
      }
    };

    checkForTransactions();
    const interval = setInterval(checkForTransactions, 2000);
    return () => clearInterval(interval);
  }, [recipientId]);

  // eslint-disable-next-line no-unused-vars
  const getStatusColor = (status) => {
    switch (status) {
      case 'legit':
        return 'success';
      case 'flagged':
        return 'warning';
      case 'blocked':
        return 'error';
      default:
        return 'info';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'legit':
        return <CheckCircleIcon />;
      case 'flagged':
        return <WarningIcon />;
      case 'blocked':
        return <BlockIcon />;
      default:
        return <AccountCircleIcon />;
    }
  };

  const getStatusMessage = (transaction) => {
    const fraudPercentage = (transaction.fraud_probability * 100).toFixed(1);
    
    switch (transaction.status) {
      case 'legit':
        return `Transaction approved - Low fraud risk (${fraudPercentage}%)`;
      case 'flagged':
        return `Transaction flagged - Moderate fraud risk (${fraudPercentage}%). Please verify with sender.`;
      case 'blocked':
        return `Transaction blocked - High fraud risk (${fraudPercentage}%). Contact support if this seems incorrect.`;
      default:
        return `Transaction pending verification`;
    }
  };

  const styles = {
    container: { minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f5f5', padding: '24px' },
    phoneContainer: { width: 375, height: 640, borderRadius: '40px', border: '12px solid #1a1a1a', borderTop: '30px solid #1a1a1a', borderBottom: '30px solid #1a1a1a', position: 'relative', overflow: 'hidden', boxShadow: '0 15px 40px rgba(0,0,0,0.3)', backgroundColor: '#ffffff' },
    notch: { position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '35%', height: '25px', backgroundColor: '#1a1a1a', borderBottomLeftRadius: '15px', borderBottomRightRadius: '15px', zIndex: 2, display: 'flex', justifyContent: 'center', alignItems: 'center' },
    notchLine: { width: '50%', height: '4px', backgroundColor: '#333', borderRadius: '2px' },
    screenContent: { height: '100%', overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', paddingTop: '40px', paddingBottom: '24px' },
    header: { textAlign: 'center', marginBottom: '16px' },
    title: { fontSize: '24px', fontWeight: 'bold', margin: 0 },
    divider: { height: '1px', backgroundColor: '#e0e0e0', marginBottom: '24px' },
    recipientInfo: { backgroundColor: '#f8f9fa', padding: '12px', borderRadius: '8px', marginBottom: '16px', textAlign: 'center' },
    transactionCard: { border: '1px solid #e0e0e0', borderRadius: '8px', padding: '16px', marginBottom: '16px', backgroundColor: '#ffffff' },
    transactionHeader: { display: 'flex', alignItems: 'center', marginBottom: '12px' },
    avatar: { width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#1976d2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', marginRight: '12px' },
    transactionDetails: { flex: 1 },
    amount: { fontSize: '18px', fontWeight: 'bold', marginBottom: '4px' },
    sender: { fontSize: '14px', color: '#666', marginBottom: '8px' },
    timestamp: { fontSize: '12px', color: '#999', backgroundColor: '#f0f0f0', padding: '4px 8px', borderRadius: '12px', display: 'inline-block' },
    statusAlert: { marginTop: '12px', padding: '12px', borderRadius: '8px', fontSize: '14px' },
    successAlert: { backgroundColor: '#d4edda', color: '#155724', border: '1px solid #c3e6cb' },
    warningAlert: { backgroundColor: '#fff3cd', color: '#856404', border: '1px solid #ffeaa7' },
    errorAlert: { backgroundColor: '#f8d7da', color: '#721c24', border: '1px solid #f5c6cb' },
    emptyState: { textAlign: 'center', marginTop: '60px', color: '#666' },
    homeIndicator: { position: 'absolute', bottom: '8px', left: '50%', transform: 'translateX(-50%)', width: '25%', height: '4px', backgroundColor: '#ccc', borderRadius: '2px' },
  };

  return (
    <div style={styles.container}>
      <div style={styles.phoneContainer}>
        <div style={styles.notch}>
          <div style={styles.notchLine} />
        </div>
        <div style={styles.screenContent}>
          <div style={styles.header}>
            <h1 style={styles.title}>Incoming Transactions</h1>
          </div>
          <div style={styles.divider} />
          
          <div style={styles.recipientInfo}>
            <strong>Recipient ID: {recipientId}</strong>
            <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
              Monitoring for incoming transactions...
            </div>
          </div>

          {error && (
            <Alert severity="error" style={{ marginBottom: '16px' }}>
              {error}
            </Alert>
          )}

          {loading ? (
            <div style={styles.emptyState}>
              <div>Loading transactions...</div>
            </div>
          ) : transactions.length === 0 ? (
            <div style={styles.emptyState}>
              <div>No transactions received yet</div>
              <div style={{ fontSize: '14px', marginTop: '8px' }}>
                Transactions will appear here automatically
              </div>
            </div>
          ) : (
            <div>
              {transactions.map((transaction) => (
                <div key={transaction.transactionid} style={styles.transactionCard}>
                  <div style={styles.transactionHeader}>
                    <div style={styles.avatar}>
                      {getStatusIcon(transaction.status)}
                    </div>
                    <div style={styles.transactionDetails}>
                      <div style={styles.amount}>
                        {transaction.amount.toLocaleString()} TZS
                      </div>
                      <div style={styles.sender}>
                        From: {transaction.initiator || 'Unknown sender'}
                      </div>
                      <div style={styles.timestamp}>
                        {new Date(transaction.transaction_time).toLocaleString()}
                      </div>
                    </div>
                  </div>
                  
                  <div style={{
                    ...styles.statusAlert,
                    ...(transaction.status === 'legit' ? styles.successAlert :
                        transaction.status === 'flagged' ? styles.warningAlert :
                        transaction.status === 'blocked' ? styles.errorAlert : {})
                  }}>
                    <strong>Status: {transaction.status.toUpperCase()}</strong>
                    <div style={{ marginTop: '4px' }}>
                      {getStatusMessage(transaction)}
                    </div>
                    {transaction.notes && (
                      <div style={{ marginTop: '8px', fontSize: '12px', fontStyle: 'italic' }}>
                        Note: {transaction.notes}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div style={styles.homeIndicator} />
      </div>
    </div>
  );
};

export default RecipientInterface;