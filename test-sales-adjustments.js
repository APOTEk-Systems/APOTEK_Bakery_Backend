// Simple test script for sales adjustments
import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:3000/api';

async function testSalesAdjustments() {
  try {
    console.log('🚀 Testing Sales Adjustments...\n');

    // Step 1: Login
    console.log('1. Authenticating...');
    const loginResponse = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@example.com',
        password: '1738679'
      })
    });

    if (!loginResponse.ok) {
      const error = await loginResponse.json();
      console.error('Login failed:', error);
      return;
    }

    const { token } = await loginResponse.json();
    console.log('✅ Authentication successful\n');

    // Step 2: Test creating a sales adjustment for sale ID 155
    console.log('2. Creating sales adjustment for sale 155...');
    const createResponse = await fetch(`${BASE_URL}/sales-adjustments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        saleId: 155,
        reason: 'Customer returned damaged product',
        items: [
          {
            productId: 1,
            quantity: 2,
            notes: 'Damaged packaging'
          }
        ]
      })
    });

    const createResult = await createResponse.json();
    console.log('Create result:', createResult);

    if (!createResponse.ok) {
      console.error('❌ Create failed:', createResult);
      return;
    }

    const adjustmentId = createResult.data.id;
    console.log('✅ Sales adjustment created with ID:', adjustmentId, '\n');

    // Step 3: Get all sales adjustments to see the list
    console.log('3. Getting all sales adjustments...');
    const listResponse = await fetch(`${BASE_URL}/sales-adjustments`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const listResult = await listResponse.json();
    console.log('Current adjustments count:', listResult.salesAdjustments.length);
    console.log('✅ List retrieved successfully\n');

    // Step 4: Approve the sales adjustment
    console.log('4. Approving sales adjustment...');
    const approveResponse = await fetch(`${BASE_URL}/sales-adjustments/${adjustmentId}/approve`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const approveResult = await approveResponse.json();
    console.log('Approve result:', approveResult);

    if (approveResponse.ok) {
      console.log('✅ Sales adjustment approved successfully');
      if (approveResult.data.calculationSummary) {
        console.log('VAT Calculation Summary:');
        console.log('- VAT Percentage:', approveResult.data.calculationSummary.vatPercentage);
        console.log('- Return Amount:', approveResult.data.calculationSummary.returnAmount);
        console.log('- New Subtotal:', approveResult.data.calculationSummary.newSubtotal);
        console.log('- New VAT:', approveResult.data.calculationSummary.newVAT);
        console.log('- New Total:', approveResult.data.calculationSummary.newTotal);
      }
    } else {
      console.error('❌ Approval failed:', approveResult);
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testSalesAdjustments();