import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Divider,
  Card,
  List,
  ListItem,
  ListItemText,
  Avatar,
  Chip,
} from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const RecipientInterface = () => {
  const [transactions, setTransactions] = useState([]);

  // Simulate receiving transactions (in a real app, this would come from an API or socket)
  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data.type === 'NEW_TRANSACTION') {
        setTransactions(prev => [event.data.payload, ...prev]);
      }
    };

    // This is just for demo purposes - in a real app you'd use proper messaging
    window.addEventListener('storage', handleMessage);
    return () => window.removeEventListener('storage', handleMessage);
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
      {/* iPhone 13-like Container (same as sender) */}
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
        {/* Notch */}
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
          <Box
            sx={{
              width: '60%',
              height: '6px',
              bgcolor: '#333',
              borderRadius: '3px',
            }}
          />
        </Box>

        {/* Screen Content */}
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

          {transactions.length === 0 ? (
            <Typography variant="body1" align="center" sx={{ mt: 4 }}>
              No transactions received yet
            </Typography>
          ) : (
            <List sx={{ width: '100%' }}>
              {transactions.map((transaction, index) => (
                <Card key={index} variant="outlined" sx={{ mb: 2 }}>
                  <ListItem>
                    <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                      <AccountCircleIcon />
                    </Avatar>
                    <ListItemText
                      primary={`$${transaction.amount.toFixed(2)}`}
                      secondary={`From: ${transaction.phone}`}
                    />
                    <Chip
                      label={new Date(transaction.timestamp).toLocaleTimeString()}
                      size="small"
                    />
                  </ListItem>
                </Card>
              ))}
            </List>
          )}
        </Box>

        {/* Home Indicator */}
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