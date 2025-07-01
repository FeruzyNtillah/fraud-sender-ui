import React, { useState } from 'react';
// eslint-disable-next-line no-unused-vars
import { Box, Typography, Button, TextField, Card, CardContent } from '@mui/material';

const SenderInterface = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [balance, setBalance] = useState('');
  const [initiatorId, setInitiatorId] = useState('');
  const [phone, setPhone] = useState('');
  const [amount, setAmount] = useState('');
  const [isHighRisk, setIsHighRisk] = useState(false);
  const [transactionSuccess, setTransactionSuccess] = useState(false);
  const [error, setError] = useState('');
  const [transactionResult, setTransactionResult] = useState(null);
  const [transactionsArray, setTransactionsArray] = useState([]);

  const checkRisk = (value) => {
    const numAmount = parseFloat(value) || 0;
    setIsHighRisk(numAmount > 1000000);
  };

  const validateInputs = () => {
    if (parseFloat(amount) <= 0 || isNaN(parseFloat(amount))) return 'Invalid amount';
    if (parseFloat(amount) > parseFloat(balance)) return 'Insufficient balance';
    return null;
  };

  const checkFraud = async (transactionData) => {
    // Validate transaction data before processing
    if (!transactionData.initiator || !transactionData.recipient || isNaN(transactionData.amount)) {
      console.error('Invalid transaction data:', transactionData);
      setError('Invalid transaction data');
      return 0;
    }

    // Ensure all values are properly formatted
    const cleanTransactionData = {
      ...transactionData,
      initiator: String(transactionData.initiator).trim(),
      recipient: String(transactionData.recipient).trim(),
      amount: Number(transactionData.amount),
      oldbalinitiator: Number(transactionData.oldbalinitiator),
      newbalinitiator: Number(transactionData.newbalinitiator),
      oldbalrecipient: Number(transactionData.oldbalrecipient),
      newbalrecipient: Number(transactionData.newbalrecipient)
    };

    console.log('Clean transaction data:', cleanTransactionData);

    // Fixed XML structure to match the expected format
    const xmlData = `<?xml version="1.0" encoding="UTF-8"?>
<Document xmlns="urn:iso:std:iso:20022:tech:xsd:pain.001.001.09">
    <CstmrCdtTrfInitn>
        <PmtInf>
            <Dbtr>
                <Id>
                    <PrvtId>
                        <Othr>
                            <Id>${cleanTransactionData.initiator}</Id>
                            <OldBal>${cleanTransactionData.oldbalinitiator.toFixed(2)}</OldBal>
                            <NewBal>${cleanTransactionData.newbalinitiator.toFixed(2)}</NewBal>
                        </Othr>
                    </PrvtId>
                </Id>
            </Dbtr>
            <CdtTrfTxInf>
                <Cdtr>
                    <Id>
                        <PrvtId>
                            <Othr>
                                <Id>${cleanTransactionData.recipient}</Id>
                                <OldBal>${cleanTransactionData.oldbalrecipient.toFixed(2)}</OldBal>
                                <NewBal>${cleanTransactionData.newbalrecipient.toFixed(2)}</NewBal>
                            </Othr>
                        </PrvtId>
                    </Id>
                </Cdtr>
                <Amt>
                    <InstdAmt Ccy="TZS">${cleanTransactionData.amount.toFixed(2)}</InstdAmt>
                </Amt>
            </CdtTrfTxInf>
        </PmtInf>
    </CstmrCdtTrfInitn>
</Document>`;

    console.log('XML Payload:', xmlData);

    try {
      const response = await fetch('https://fds-it.us-east-1.aws.modelbit.com/v1/predict_from_iso20022/latest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data: xmlData }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API error:', {
          status: response.status,
          statusText: response.statusText,
          body: errorText,
        });
        setError(`API error: ${response.status} - ${errorText}`);
        return 0;
      }

      const result = await response.json();
      console.log('Raw API Response:', result);

      let fraudProbability = 0;
      
      // Enhanced error handling for API response
      if (result.data && result.data.error) {
        console.error('API returned error:', result.data.error);
        setError(`API Error: ${result.data.error}`);
        return 0;
      }
      
      // Handle different response formats
      if (typeof result === 'number') {
        fraudProbability = result;
      } 
      else if (result.data && typeof result.data === 'number') {
        fraudProbability = result.data;
      }
      else if (result.fraud_probability !== undefined) {
        fraudProbability = parseFloat(result.fraud_probability) || 0;
      }
      else if (result.data && typeof result.data === 'object') {
        if (result.data.fraud_probability !== undefined) {
          fraudProbability = parseFloat(result.data.fraud_probability) || 0;
        } else if (result.data.result !== undefined) {
          fraudProbability = parseFloat(result.data.result) || 0;
        }
      }
      else if (typeof result.data === 'string') {
        try {
          const parser = new DOMParser();
          const xmlDoc = parser.parseFromString(result.data, 'application/xml');
          const parserError = xmlDoc.querySelector('parsererror');
          if (parserError) {
            console.error('XML parsing error:', parserError.textContent);
            setError('Failed to parse API response');
            return 0;
          }
          const fraudProbabilityNode = xmlDoc.getElementsByTagName('fraud_probability')[0];
          fraudProbability = parseFloat(fraudProbabilityNode?.textContent) || 0;
        } catch (e) {
          console.error('Error parsing XML response:', e);
          setError('Failed to parse API response');
          return 0;
        }
      }

      console.log('Final fraud probability:', fraudProbability);
      return fraudProbability;
    } catch (error) {
      console.error('Fraud detection failed:', error);
      setError('Fraud detection service unavailable');
      return 0;
    }
  };

  const handleStepOneSubmit = (e) => {
    e.preventDefault();
    if (!initiatorId.trim() || !balance) {
      setError('Initiator ID and balance are required');
      return;
    }
    setError('');
    setCurrentStep(2);
  };

  const handleTransactionSubmit = async (e) => {
    e.preventDefault();
    const errorMsg = validateInputs();
    if (errorMsg) {
      setError(errorMsg);
      return;
    }
    if (!initiatorId.trim() || !phone.trim()) {
      setError('Initiator ID and recipient phone number are required');
      return;
    }
    console.log('Transaction Submit Inputs:', {
      initiatorId,
      phone,
      amount,
      balance,
    });
    setError('');

    const transactionId = crypto.randomUUID();
    const transactionData = {
      transactionid: transactionId,
      initiator: initiatorId.trim(),
      recipient: phone.trim(),
      amount: parseFloat(amount),
      transactiontype: 'transfer',
      oldbalinitiator: parseFloat(balance),
      newbalinitiator: parseFloat(balance) - parseFloat(amount),
      oldbalrecipient: 0,
      newbalrecipient: parseFloat(amount),
      timestamp: new Date().toISOString(),
      fraud_probability: 0,
      status: 'pending',
      transaction_time: new Date().toISOString(),
    };

    console.log('Transaction Data:', transactionData);

    const fraudProbability = await checkFraud(transactionData);
    if (fraudProbability > 0.8) {
      transactionData.fraud_probability = fraudProbability;
      transactionData.status = 'blocked';
      transactionData.notes = 'Transaction blocked due to high fraud probability';
    } else if (fraudProbability > 0.5) {
      transactionData.fraud_probability = fraudProbability;
      transactionData.status = 'flagged';
      transactionData.notes = 'Potential fraud detected by Modelbit';
    } else {
      transactionData.fraud_probability = fraudProbability;
      transactionData.status = 'legit';
    }

    setTransactionResult(transactionData);
    
    // Add transaction to array and save to localStorage
    const updatedTransactions = [...transactionsArray, transactionData];
    setTransactionsArray(updatedTransactions);
    localStorage.setItem('transactions', JSON.stringify(updatedTransactions));
    
    setTransactionSuccess(true);
    setPhone('');
    setAmount('');
    setIsHighRisk(false);
    setTimeout(() => setTransactionSuccess(false), 5000);
  };

  const goBackToStepOne = () => {
    setCurrentStep(1);
    setPhone('');
    setAmount('');
    setIsHighRisk(false);
    setTransactionSuccess(false);
  };

  const resetForm = () => {
    setBalance('');
    setInitiatorId('');
    setPhone('');
    setAmount('');
    setIsHighRisk(false);
    setTransactionSuccess(false);
    setCurrentStep(1);
    setTransactionResult(null);
    setTransactionsArray([]);
  };

  const isStepTwoFormValid = phone.trim() && amount && parseFloat(amount) <= parseFloat(balance);

  const styles = {
    container: { minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f5f5', padding: '24px' },
    phoneContainer: { width: 375, height: 640, borderRadius: '40px', border: '12px solid #1a1a1a', borderTop: '30px solid #1a1a1a', borderBottom: '30px solid #1a1a1a', position: 'relative', overflow: 'hidden', boxShadow: '0 15px 40px rgba(0,0,0,0.3)', backgroundColor: '#ffffff' },
    notch: { position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '35%', height: '25px', backgroundColor: '#1a1a1a', borderBottomLeftRadius: '15px', borderBottomRightRadius: '15px', zIndex: 2, display: 'flex', justifyContent: 'center', alignItems: 'center' },
    notchLine: { width: '50%', height: '4px', backgroundColor: '#333', borderRadius: '2px' },
    screenContent: { height: '100%', overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', paddingTop: '40px', paddingBottom: '24px' },
    header: { display: 'flex', alignItems: 'center', marginBottom: '16px' },
    backButton: { background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', marginRight: '8px', padding: '4px' },
    title: { fontSize: '24px', fontWeight: 'bold', textAlign: 'center', flex: 1, margin: 0 },
    divider: { height: '1px', backgroundColor: '#e0e0e0', marginBottom: '24px' },
    alert: { padding: '12px', borderRadius: '8px', marginBottom: '16px', fontSize: '14px' },
    successAlert: { backgroundColor: '#d4edda', color: '#155724', border: '1px solid #c3e6cb' },
    warningAlert: { backgroundColor: '#fff3cd', color: '#856404', border: '1px solid #ffeaa7' },
    errorAlert: { backgroundColor: '#f8d7da', color: '#721c24', border: '1px solid #f5c6cb' },
    inputGroup: { marginBottom: '24px' },
    label: { fontSize: '16px', fontWeight: '500', marginBottom: '8px', display: 'block' },
    input: { width: '100%', padding: '12px', border: '1px solid #ccc', borderRadius: '8px', fontSize: '16px', boxSizing: 'border-box' },
    card: { border: '1px solid #e0e0e0', borderRadius: '8px', padding: '16px', marginBottom: '24px', backgroundColor: '#fafafa' },
    cardTitle: { fontSize: '18px', fontWeight: 'bold', marginBottom: '12px', margin: 0 },
    summaryRow: { display: 'flex', justifyContent: 'space-between', marginBottom: '8px' },
    buttonGroup: { display: 'flex', justifyContent: 'space-between', gap: '16px' },
    button: { flex: 1, padding: '12px 24px', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: '500', cursor: 'pointer' },
    primaryButton: { backgroundColor: '#1976d2', color: 'white' },
    warningButton: { backgroundColor: '#ed6c02', color: 'white' },
    outlinedButton: { backgroundColor: 'transparent', color: '#1976d2', border: '1px solid #1976d2' },
    disabledButton: { backgroundColor: '#e0e0e0', color: '#9e9e9e', cursor: 'not-allowed' },
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
            {currentStep === 2 && (
              <button style={styles.backButton} onClick={goBackToStepOne}>
                ←
              </button>
            )}
            <h1 style={styles.title}>
              {currentStep === 1 ? 'Zpesa Account' : 'Send Money'}
            </h1>
          </div>
          <div style={styles.divider} />
          {transactionSuccess && (
            <div style={{ ...styles.alert, ...styles.successAlert }}>
              Transaction sent successfully!
            </div>
          )}
          {error && <div style={{ ...styles.alert, ...styles.errorAlert }}>{error}</div>}
          {currentStep === 1 ? (
            <div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Manual Balance (TZS)</label>
                <input
                  type="number"
                  style={styles.input}
                  value={balance}
                  onChange={(e) => setBalance(e.target.value)}
                  placeholder="Enter your balance in TZS"
                  min="0"
                  step="100"
                  required
                />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Initiator ID</label>
                <input
                  type="text"
                  style={styles.input}
                  value={initiatorId}
                  onChange={(e) => setInitiatorId(e.target.value)}
                  placeholder="Enter your initiator ID"
                  required
                />
              </div>
              <div style={styles.card}>
                <h3 style={styles.cardTitle}>Account Summary</h3>
                <div style={styles.summaryRow}>
                  <span>Balance:</span>
                  <span>{balance ? `${parseFloat(balance).toLocaleString()} TZS` : '0 TZS'}</span>
                </div>
                <div style={styles.summaryRow}>
                  <span>Initiator ID:</span>
                  <span>{initiatorId || 'Not specified'}</span>
                </div>
              </div>
              <div style={styles.buttonGroup}>
                <button style={{ ...styles.button, ...styles.outlinedButton }} onClick={resetForm}>
                  Clear
                </button>
                <button
                  style={{ ...styles.button, ...(balance && initiatorId.trim() ? styles.primaryButton : styles.disabledButton) }}
                  onClick={handleStepOneSubmit}
                  disabled={!balance || !initiatorId.trim()}
                >
                  Continue
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Recipient's Phone Number</label>
                <input
                  type="text"
                  style={styles.input}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter any string as recipient"
                  required
                />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Amount (TZS)</label>
                <input
                  type="number"
                  style={styles.input}
                  value={amount}
                  onChange={(e) => {
                    setAmount(e.target.value);
                    checkRisk(e.target.value);
                  }}
                  placeholder="Enter amount in TZS"
                  min="100"
                  step="100"
                  max={balance}
                  required
                />
                {isHighRisk && (
                  <div style={{ ...styles.alert, ...styles.warningAlert, marginTop: '8px' }}>
                    High-risk transaction detected (over 1,000,000 TZS)!
                  </div>
                )}
                {amount && parseFloat(amount) > parseFloat(balance) && (
                  <div style={{ ...styles.alert, ...styles.errorAlert, marginTop: '8px' }}>
                    Insufficient balance!
                  </div>
                )}
              </div>
              <div style={styles.card}>
                <h3 style={styles.cardTitle}>Transaction Summary</h3>
                <div style={styles.summaryRow}>
                  <span>Recipient:</span>
                  <span>{phone || 'Not specified'}</span>
                </div>
                <div style={styles.summaryRow}>
                  <span>Amount:</span>
                  <span>{amount ? `${parseFloat(amount).toLocaleString()} TZS` : '0 TZS'}</span>
                </div>
                <div style={styles.summaryRow}>
                  <span>Fee:</span>
                  <span>1,000 TZS</span>
                </div>
                <div style={styles.divider} />
                <div style={styles.summaryRow}>
                  <strong>Total:</strong>
                  <strong>{amount ? `${(parseFloat(amount) + 1000).toLocaleString()} TZS` : '0 TZS'}</strong>
                </div>
              </div>
              {transactionResult && (
                <div style={styles.card}>
                  <h3 style={styles.cardTitle}>Transaction Result</h3>
                  <div style={styles.summaryRow}>
                    <span>Status:</span>
                    <span>{transactionResult.status}</span>
                  </div>
                  <div style={styles.summaryRow}>
                    <span>Fraud Probability:</span>
                    <span>{(transactionResult.fraud_probability * 100).toFixed(2)}%</span>
                  </div>
                  {transactionResult.notes && (
                    <div style={styles.summaryRow}>
                      <span>Notes:</span>
                      <span>{transactionResult.notes}</span>
                    </div>
                  )}
                </div>
              )}
              <div style={styles.buttonGroup}>
                <button style={{ ...styles.button, ...styles.outlinedButton }} onClick={goBackToStepOne}>
                  Cancel
                </button>
                <button
                  style={{
                    ...styles.button,
                    ...(isStepTwoFormValid ? (isHighRisk ? styles.warningButton : styles.primaryButton) : styles.disabledButton),
                  }}
                  onClick={handleTransactionSubmit}
                  disabled={!isStepTwoFormValid}
                >
                  {isHighRisk ? 'Confirm' : 'Send'}
                </button>
              </div>
            </div>
          )}
        </div>
        <div style={styles.homeIndicator} />
      </div>
    </div>
  );
};

export default SenderInterface;