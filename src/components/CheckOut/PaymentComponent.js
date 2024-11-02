import React, { useState } from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import SHA256 from 'jssha';

const PaytmPayment = () => {
  const [orderId, setOrderId] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const generateOrderId = () => `ORDER_${uuidv4()}`;

  const generateChecksum = (data, secretKey) => {
    const shaObj = new SHA256("SHA-256", "TEXT");
    const sortedData = Object.keys(data)
      .sort()
      .map(key => `${key}=${data[key]}`)
      .join('|') + `|${secretKey}`;

    shaObj.update(sortedData);
    return shaObj.getHash("HEX");
  };

  const handlePayment = async () => {
    if (!amount || isNaN(amount) || amount <= 0) {
      alert("Please enter a valid Amount");
      return;
    }

    setLoading(true);
    const newOrderId = generateOrderId();
    setOrderId(newOrderId);

    const data = {
      MID: 'eSobNZ45587182728364',
      ORDER_ID: newOrderId,
      CUST_ID: 'CUST123',
      CHANNEL_ID: 'WEB',
      INDUSTRY_TYPE_ID: 'Retail',
      CALLBACK_URL: 'http://localhost:3000/callback',
      TXN_AMOUNT: amount,
      WEBSITE: 'DEFAULT',
    };

    try {
      const checksum = generateChecksum(data, 'YOUR_SECRET_KEY');
      data.CHECKSUMHASH = checksum;

      const response = await axios.post(`https://securegw-stage.paytm.in/theia/api/v1/initiateTransaction?mid=${data.MID}&orderId=${data.ORDER_ID}`, data);
      const { txnToken } = response.data;

      const form = document.createElement('form');
      form.method = 'POST';
      form.action = 'https://securegw-stage.paytm.in/theia/processTransaction';

      Object.keys(data).forEach(key => {
        const hiddenField = document.createElement('input');
        hiddenField.type = 'hidden';
        hiddenField.name = key;
        hiddenField.value = data[key];
        form.appendChild(hiddenField);
      });

      const tokenField = document.createElement('input');
      tokenField.type = 'hidden';
      tokenField.name = 'txnToken';
      tokenField.value = txnToken;
      form.appendChild(tokenField);

      document.body.appendChild(form);
      form.submit();
    } catch (error) {
      console.error('Error initiating payment:', error);
      alert('Payment initiation failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Paytm Payment</h2>
      <input 
        type="text" 
        placeholder="Amount" 
        value={amount} 
        onChange={(e) => setAmount(e.target.value)} 
      />
      <button onClick={handlePayment} disabled={loading}>
        {loading ? 'Processing...' : 'Pay Now'}
      </button>
    </div>
  );
};

export default PaytmPayment;
