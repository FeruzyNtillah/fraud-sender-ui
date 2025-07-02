import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
// eslint-disable-next-line no-unused-vars
import { Box, Typography, Card } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const RecipientInterface = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const initialRecipientId = urlParams.get('recipient'); // No default ID
  const [recipientId, setRecipientId] = useState(initialRecipientId);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  // eslint-disable-next-line no-unused-vars
  const [error, setError] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [newTransactionAlert, setNewTransactionAlert] = useState(false);

  useEffect(() => {
    if (!recipientId) return; // Do not fetch if no recipient

    const checkForTransactions = async () => {
      try {
        setLoading(true);
        const { data, error: fetchError } = await supabase
          .from('transactions')
          .select('*')
          .eq('recipient', recipientId)
          .in('status', ['legit', 'flagged'])
          .order('transaction_time', { ascending: false });

        if (fetchError) {
          console.error('Error fetching transactions:', fetchError);
          setError('Failed to load transactions');
          setTransactions([]);
        } else {
          const recipientTransactions = data.map(tx => ({
            ...tx,
            amount: parseFloat(tx.amount) || 0,
            transaction_time: tx.transaction_time || new Date().toISOString(),
            fraud_probability: parseFloat(tx.fraud_probability) || 0
          }));

          if (recipientTransactions.length > transactions.length && transactions.length > 0) {
            setNewTransactionAlert(true);
            setTimeout(() => setNewTransactionAlert(false), 3000);
          }

          setTransactions(recipientTransactions);
          setError(null);
        }
      } catch (error) {
        console.error('Error processing transactions:', error);
        setError('Failed to load transactions');
      } finally {
        setLoading(false);
      }
    };

    checkForTransactions();
    const interval = setInterval(checkForTransactions, 2000);
    return () => clearInterval(interval);
  }, [recipientId, transactions.length]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const newRecipientId = urlParams.get('recipient');
    if (newRecipientId && newRecipientId !== recipientId) {
      setRecipientId(newRecipientId);
      setTransactions([]);
      setLoading(true);
    }
  }, [recipientId]);

  const formatTime = (timestamp) => {
    try {
      const date = new Date(timestamp);
      const now = new Date();
      const diffMs = now - date;
      const diffMins = Math.floor(diffMs / 60000);
      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
      return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Unknown time';
    }
  };

  const styles = {
    container: {
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#f5f5f5',
      padding: '24px'
    },
    phoneContainer: {
      width: 375,
      height: 640,
      borderRadius: '40px',
      border: '12px solid #1a1a1a',
      borderTop: '30px solid #1a1a1a',
      borderBottom: '30px solid #1a1a1a',
      position: 'relative',
      overflow: 'hidden',
      boxShadow: '0 15px 40px rgba(0,0,0,0.3)',
      backgroundColor: '#ffffff'
    },
    screenContent: {
      height: '100%',
      overflowY: 'auto',
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      paddingTop: '40px',
      paddingBottom: '24px'
    },
    header: {
      textAlign: 'center',
      marginBottom: '16px'
    },
    title: {
      fontSize: '24px',
      fontWeight: 'bold',
      margin: 0
    },
    divider: {
      height: '1px',
      backgroundColor: '#e0e0e0',
      marginBottom: '24px'
    },
    recipientInfo: {
      backgroundColor: '#f8f9fa',
      padding: '12px',
      borderRadius: '8px',
      marginBottom: '16px',
      textAlign: 'center'
    },
    transactionCard: {
      border: '1px solid #e0e0e0',
      borderRadius: '8px',
      padding: '16px',
      marginBottom: '16px',
      backgroundColor: '#ffffff',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    },
    avatar: {
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      backgroundColor: '#1976d2',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      marginRight: '12px'
    },
    amount: {
      fontSize: '18px',
      fontWeight: 'bold',
      color: '#2e7d32'
    },
    sender: {
      fontSize: '14px',
      color: '#666',
      marginBottom: '8px'
    },
    timestamp: {
      fontSize: '12px',
      color: '#999',
      backgroundColor: '#f0f0f0',
      padding: '4px 8px',
      borderRadius: '12px'
    },
    emptyState: {
      flex: 1,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center',
      color: '#666',
      padding: '20px'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.phoneContainer}>
        <div style={styles.screenContent}>
          <div style={styles.header}>
            <h1 style={styles.title}>Incoming Transaction</h1>
          </div>
          <div style={styles.divider} />
          
          {recipientId ? (
            <>
              <div style={styles.recipientInfo}>
                <strong>Recipient ID: {recipientId}</strong>
                <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                  {loading ? 'Checking for transactions...' : 'Live monitoring active'}
                </div>
              </div>
              
              {transactions.length > 0 ? (
                transactions.map((transaction) => (
                  <div key={transaction.transactionid} style={styles.transactionCard}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <div style={styles.avatar}>
                        <AccountCircleIcon />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={styles.amount}>
                          {transaction.amount.toLocaleString()} TZS
                        </div>
                        <div style={styles.sender}>
                          From: {transaction.initiator || 'Unknown sender'}
                        </div>
                        <div style={styles.timestamp}>
                          {formatTime(transaction.transaction_time)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div style={styles.emptyState}>
                  Waiting for sender to initiate a transaction...
                </div>
              )}
            </>
          ) : (
            <div style={styles.emptyState}>
              Waiting for transaction...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecipientInterface;