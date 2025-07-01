import React, { useState } from 'react';

const SenderInterface = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [balance, setBalance] = useState('');
  const [initiatorId, setInitiatorId] = useState('');
  const [phone, setPhone] = useState('');
  const [amount, setAmount] = useState('');
  const [isHighRisk, setIsHighRisk] = useState(false);
  const [transactionSuccess, setTransactionSuccess] = useState(false);

  const checkRisk = (value) => {
    const numAmount = parseFloat(value) || 0;
    setIsHighRisk(numAmount > 1000000);
  };

  const handleStepOneSubmit = (e) => {
    e.preventDefault();
    setCurrentStep(2);
  };

  const handleTransactionSubmit = (e) => {
    e.preventDefault();
    const transactionData = {
      phone,
      amount: parseFloat(amount),
      balance: parseFloat(balance),
      initiatorId,
      timestamp: new Date().toISOString(),
      status: 'completed',
      currency: 'TZS'
    };

    console.log('Submitting:', transactionData);
    setTransactionSuccess(true);
    
    // Store in a global variable for demo purposes
    window.latestTransaction = {
      type: 'NEW_TRANSACTION',
      payload: transactionData
    };
    
    // Reset transaction form
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
  };

  const styles = {
    container: {
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#f5f5f5',
      padding: '24px',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    },
    phoneContainer: {
      width: '375px',
      height: '640px', // 5.0 inches
      borderRadius: '40px',
      border: '12px solid #1a1a1a',
      borderTop: '30px solid #1a1a1a',
      borderBottom: '30px solid #1a1a1a',
      position: 'relative',
      overflow: 'hidden',
      boxShadow: '0 15px 40px rgba(0,0,0,0.3)',
      backgroundColor: '#ffffff'
    },
    notch: {
      position: 'absolute',
      top: 0,
      left: '50%',
      transform: 'translateX(-50%)',
      width: '35%',
      height: '25px',
      backgroundColor: '#1a1a1a',
      borderBottomLeftRadius: '15px',
      borderBottomRightRadius: '15px',
      zIndex: 2,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    },
    notchLine: {
      width: '50%',
      height: '4px',
      backgroundColor: '#333',
      borderRadius: '2px'
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
      display: 'flex',
      alignItems: 'center',
      marginBottom: '16px'
    },
    backButton: {
      background: 'none',
      border: 'none',
      fontSize: '24px',
      cursor: 'pointer',
      marginRight: '8px',
      padding: '4px'
    },
    title: {
      fontSize: '24px',
      fontWeight: 'bold',
      textAlign: 'center',
      flex: 1,
      margin: 0
    },
    divider: {
      height: '1px',
      backgroundColor: '#e0e0e0',
      marginBottom: '24px'
    },
    alert: {
      padding: '12px',
      borderRadius: '8px',
      marginBottom: '16px',
      fontSize: '14px'
    },
    successAlert: {
      backgroundColor: '#d4edda',
      color: '#155724',
      border: '1px solid #c3e6cb'
    },
    warningAlert: {
      backgroundColor: '#fff3cd',
      color: '#856404',
      border: '1px solid #ffeaa7'
    },
    errorAlert: {
      backgroundColor: '#f8d7da',
      color: '#721c24',
      border: '1px solid #f5c6cb'
    },
    inputGroup: {
      marginBottom: '24px'
    },
    label: {
      fontSize: '16px',
      fontWeight: '500',
      marginBottom: '8px',
      display: 'block'
    },
    input: {
      width: '100%',
      padding: '12px',
      border: '1px solid #ccc',
      borderRadius: '8px',
      fontSize: '16px',
      boxSizing: 'border-box'
    },
    card: {
      border: '1px solid #e0e0e0',
      borderRadius: '8px',
      padding: '16px',
      marginBottom: '24px',
      backgroundColor: '#fafafa'
    },
    cardTitle: {
      fontSize: '18px',
      fontWeight: 'bold',
      marginBottom: '12px',
      margin: 0
    },
    summaryRow: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: '8px'
    },
    buttonGroup: {
      display: 'flex',
      justifyContent: 'space-between',
      gap: '16px'
    },
    button: {
      flex: 1,
      padding: '12px 24px',
      border: 'none',
      borderRadius: '8px',
      fontSize: '16px',
      fontWeight: '500',
      cursor: 'pointer'
    },
    primaryButton: {
      backgroundColor: '#1976d2',
      color: 'white'
    },
    warningButton: {
      backgroundColor: '#ed6c02',
      color: 'white'
    },
    outlinedButton: {
      backgroundColor: 'transparent',
      color: '#1976d2',
      border: '1px solid #1976d2'
    },
    disabledButton: {
      backgroundColor: '#e0e0e0',
      color: '#9e9e9e',
      cursor: 'not-allowed'
    },
    homeIndicator: {
      position: 'absolute',
      bottom: '8px',
      left: '50%',
      transform: 'translateX(-50%)',
      width: '25%',
      height: '4px',
      backgroundColor: '#ccc',
      borderRadius: '2px'
    },
    smallCard: {
      border: '1px solid #e0e0e0',
      borderRadius: '8px',
      padding: '12px',
      marginBottom: '16px',
      backgroundColor: '#f8f9fa'
    },
    smallText: {
      fontSize: '14px',
      color: '#666'
    }
  };

  const isStepTwoFormValid = phone && amount && parseFloat(amount) <= parseFloat(balance);

  return (
    <div style={styles.container}>
      <div style={styles.phoneContainer}>
        {/* Notch */}
        <div style={styles.notch}>
          <div style={styles.notchLine} />
        </div>

        {/* Screen Content */}
        <div style={styles.screenContent}>
          {/* Header */}
          <div style={styles.header}>
            {currentStep === 2 && (
              <button style={styles.backButton} onClick={goBackToStepOne}>
                ←
              </button>
            )}
            <h1 style={styles.title}>
              {currentStep === 1 ? 'Account Setup' : 'Send Money'}
            </h1>
          </div>
          
          <div style={styles.divider} />

          {transactionSuccess && (
            <div style={{...styles.alert, ...styles.successAlert}}>
              Transaction submitted successfully!
            </div>
          )}

          {currentStep === 1 ? (
            // Step 1: Balance and Initiator ID
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
                  <span>{balance ? `${parseFloat(balance).toLocaleString()} TZS` : "0 TZS"}</span>
                </div>
                <div style={styles.summaryRow}>
                  <span>Initiator ID:</span>
                  <span>{initiatorId || "Not specified"}</span>
                </div>
              </div>

              <div style={styles.buttonGroup}>
                <button
                  style={{...styles.button, ...styles.outlinedButton}}
                  onClick={resetForm}
                >
                  Clear
                </button>
                <button
                  style={{
                    ...styles.button,
                    ...(balance && initiatorId ? styles.primaryButton : styles.disabledButton)
                  }}
                  onClick={handleStepOneSubmit}
                  disabled={!balance || !initiatorId}
                >
                  Continue
                </button>
              </div>
            </div>
          ) : (
            // Step 2: Transaction Details
            <div>
              {/* Account Info Display */}
              <div style={styles.smallCard}>
                <div style={{...styles.label, ...styles.smallText, marginBottom: '8px'}}>
                  Account Info
                </div>
                <div style={styles.summaryRow}>
                  <span style={styles.smallText}>Balance:</span>
                  <span style={styles.smallText}>{parseFloat(balance).toLocaleString()} TZS</span>
                </div>
                <div style={styles.summaryRow}>
                  <span style={styles.smallText}>ID:</span>
                  <span style={styles.smallText}>{initiatorId}</span>
                </div>
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Recipient's Phone Number</label>
                <input
                  type="tel"
                  style={styles.input}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter phone number"
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
                  <div style={{...styles.alert, ...styles.warningAlert, marginTop: '8px'}}>
                    High-risk transaction detected (over 1,000,000 TZS)!
                  </div>
                )}
                {amount && parseFloat(amount) > parseFloat(balance) && (
                  <div style={{...styles.alert, ...styles.errorAlert, marginTop: '8px'}}>
                    Insufficient balance!
                  </div>
                )}
              </div>

              <div style={styles.card}>
                <h3 style={styles.cardTitle}>Transaction Summary</h3>
                <div style={styles.summaryRow}>
                  <span>Recipient:</span>
                  <span>{phone || "Not specified"}</span>
                </div>
                <div style={styles.summaryRow}>
                  <span>Amount:</span>
                  <span>{amount ? `${parseFloat(amount).toLocaleString()} TZS` : "0 TZS"}</span>
                </div>
                <div style={styles.summaryRow}>
                  <span>Fee:</span>
                  <span>1,000 TZS</span>
                </div>
                <div style={styles.divider} />
                <div style={styles.summaryRow}>
                  <strong>Total:</strong>
                  <strong>
                    {amount ? `${(parseFloat(amount) + 1000).toLocaleString()} TZS` : "0 TZS"}
                  </strong>
                </div>
              </div>

              <div style={styles.buttonGroup}>
                <button
                  style={{...styles.button, ...styles.outlinedButton}}
                  onClick={() => {
                    setPhone('');
                    setAmount('');
                    setIsHighRisk(false);
                  }}
                >
                  Cancel
                </button>
                <button
                  style={{
                    ...styles.button,
                    ...(isStepTwoFormValid 
                      ? (isHighRisk ? styles.warningButton : styles.primaryButton)
                      : styles.disabledButton
                    )
                  }}
                  onClick={handleTransactionSubmit}
                  disabled={!isStepTwoFormValid}
                >
                  {isHighRisk ? "Confirm" : "Send"}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Home Indicator */}
        <div style={styles.homeIndicator} />
      </div>
    </div>
  );
};

export default SenderInterface;