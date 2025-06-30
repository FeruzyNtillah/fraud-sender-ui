import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  Card,
  Divider,
} from '@mui/material';

const SenderInterface = () => {
  const [phone, setPhone] = useState('');
  const [amount, setAmount] = useState('');
  const [isHighRisk, setIsHighRisk] = useState(false);
  const [transactionSuccess, setTransactionSuccess] = useState(false);

  const checkRisk = (value) => {
    const numAmount = parseFloat(value) || 0;
    setIsHighRisk(numAmount > 1000000); // Adjusted risk threshold for TZS (1 million TZS)
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const transactionData = {
      phone,
      amount: parseFloat(amount),
      timestamp: new Date().toISOString(),
      status: 'completed',
      currency: 'TZS'
    };

    console.log('Submitting:', transactionData);
    setTransactionSuccess(true);
    
    // Broadcast transaction to recipient (using localStorage for demo)
    const transactionEvent = {
      type: 'NEW_TRANSACTION',
      payload: transactionData
    };
    
    // This triggers the storage event listener in RecipientInterface
    localStorage.setItem('latestTransaction', JSON.stringify(transactionEvent));
    localStorage.removeItem('latestTransaction'); // Force event trigger
    
    // Reset form
    setPhone('');
    setAmount('');
    setIsHighRisk(false);
    
    setTimeout(() => setTransactionSuccess(false), 5000);
  };

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
      {/* iPhone 13-like Container */}
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
            Send Money
          </Typography>
          <Divider sx={{ my: 3 }} />

          {transactionSuccess && (
            <Alert severity="success" sx={{ mb: 3 }}>
              Transaction submitted successfully!
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                Recipient's Phone Number
              </Typography>
              <TextField
                type="tel"
                fullWidth
                variant="outlined"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter phone number"
                required
              />
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                Amount (TZS)
              </Typography>
              <TextField
                type="number"
                fullWidth
                variant="outlined"
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                  checkRisk(e.target.value);
                }}
                placeholder="Enter amount in TZS"
                inputProps={{ min: "100", step: "100" }} // Minimum 100 TZS
                required
              />
              {isHighRisk && (
                <Alert severity="warning" sx={{ mt: 1 }}>
                  High-risk transaction detected (over 1,000,000 TZS)!
                </Alert>
              )}
            </Box>

            <Card variant="outlined" sx={{ p: 2, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Transaction Summary
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>Recipient:</Typography>
                <Typography>{phone || "Not specified"}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>Amount:</Typography>
                <Typography>{amount ? `${parseFloat(amount).toLocaleString()} TZS` : "0 TZS"}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>Fee:</Typography>
                <Typography>1,000 TZS</Typography> {/* Adjusted fee for TZS */}
              </Box>
              <Divider sx={{ my: 1 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="subtitle1">Total:</Typography>
                <Typography variant="subtitle1">
                  {amount ? `${(parseFloat(amount) + 1000).toLocaleString()} TZS` : "0 TZS"}
                </Typography>
              </Box>
            </Card>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
              <Button
                variant="outlined"
                fullWidth
                size="large"
                onClick={() => {
                  setPhone('');
                  setAmount('');
                  setIsHighRisk(false);
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                disabled={!phone || !amount}
                color={isHighRisk ? "warning" : "primary"}
              >
                {isHighRisk ? "Confirm" : "Send"}
              </Button>
            </Box>
          </form>
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

export default SenderInterface;