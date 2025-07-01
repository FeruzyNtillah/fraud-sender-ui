import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Box, Typography, Divider, Card, List, ListItem, ListItemText, Avatar, Chip } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const RecipientInterface = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('recipient', 'any_recipient_string'); // Replace with dynamic recipient string
      if (!error) setTransactions(data || []);
      setLoading(false);
    };

    fetchTransactions();

    const channel = supabase
      .channel('transactions')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'transactions' }, (payload) => {
        setTransactions((prev) => [payload.new, ...prev]); // Show all transactions
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        bgcolor: 'background.default',
        p: 3,
      }}
    >
      <Box
        sx={{
          width: 375,
          height: 812,
          borderRadius: '50px',
          border: '16px solid #1a1a1a',
          borderTop: '40px solid #1a1a1a',
          borderBottom: '40px solid #1a1a1a',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
          bgcolor: 'background.paper',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: '40%',
            height: '30px',
            bgcolor: '#1a1a1a',
            borderBottomLeftRadius: '18px',
            borderBottomRightRadius: '18px',
            zIndex: 2,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Box sx={{ width: '60%', height: '6px', bgcolor: '#333', borderRadius: '3px' }} />
        </Box>
        <Box
          sx={{
            height: '100%',
            overflowY: 'auto',
            p: 3,
            display: 'flex',
            flexDirection: 'column',
            pt: 6,
            pb: 4,
          }}
        >
          <Typography variant="h5" component="h1" gutterBottom align="center" sx={{ mt: 2 }}>
            Incoming Transactions
          </Typography>
          <Divider sx={{ my: 3 }} />
          {loading ? (
            <Typography variant="body1" align="center" sx={{ mt: 4 }}>
              Loading...
            </Typography>
          ) : transactions.length === 0 ? (
            <Typography variant="body1" align="center" sx={{ mt: 4 }}>
              No transactions received yet
            </Typography>
          ) : (
            <List sx={{ width: '100%' }}>
              {transactions.map((transaction) => (
                <Card key={transaction.transactionid} variant="outlined" sx={{ mb: 2 }}>
                  <ListItem>
                    <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                      <AccountCircleIcon />
                    </Avatar>
                    <ListItemText
                      primary={`$${transaction.amount.toFixed(2)} (${transaction.status})`}
                      secondary={`From: ${transaction.initiator}`}
                    />
                    <Chip
                      label={new Date(transaction.transaction_time).toLocaleTimeString()}
                      size="small"
                    />
                  </ListItem>
                </Card>
              ))}
            </List>
          )}
        </Box>
        <Box
          sx={{
            position: 'absolute',
            bottom: '10px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '30%',
            height: '5px',
            bgcolor: '#ccc',
            borderRadius: '3px',
          }}
        />
      </Box>
    </Box>
  );
};

export default RecipientInterface;