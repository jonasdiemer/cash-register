import type { Transaction } from '$lib/types';
import { formatCurrency } from './currency';

export function generateReceiptHTML(transaction: Transaction, storeName: string, cashierName: string): string {
  const date = new Date(transaction.timestamp).toLocaleDateString();
  const time = new Date(transaction.timestamp).toLocaleTimeString();

  return `
    <div class="receipt" style="font-family: monospace; width: 300px; padding: 20px;">
      <div style="text-align: center; margin-bottom: 20px;">
        <h2>${storeName}</h2>
        <p>${date} ${time}</p>
        <p>Cashier: ${cashierName}</p>
      </div>
      
      <div style="border-top: 1px dashed #000; border-bottom: 1px dashed #000; padding: 10px 0;">
        ${transaction.items.map(item => `
          <div style="display: flex; justify-content: space-between; margin: 5px 0;">
            <div>${item.name.de}</div>
            <div>${item.quantity}x ${formatCurrency(item.price)}</div>
          </div>
        `).join('')}
      </div>
      
      <div style="margin-top: 10px; text-align: right;">
        <p><strong>Total: ${formatCurrency(transaction.total)}</strong></p>
        ${transaction.paymentMethod === 'cash' ? `
          <p>Cash: ${formatCurrency(transaction.cashGiven || 0)}</p>
          <p>Change: ${formatCurrency(transaction.changeGiven || 0)}</p>
        ` : `
          <p>Paid by card</p>
        `}
      </div>
      
      <div style="text-align: center; margin-top: 20px;">
        <p>Thank you for shopping!</p>
        <p>Please come again!</p>
      </div>
    </div>
  `;
}

export function printReceipt(transaction: Transaction, storeName: string, cashierName: string): void {
  const receiptWindow = window.open('', 'Print Receipt', 'width=400,height=600');
  if (receiptWindow) {
    receiptWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Receipt</title>
        </head>
        <body>
          ${generateReceiptHTML(transaction, storeName, cashierName)}
          <script>
            window.onload = function() {
              window.print();
              setTimeout(function() { window.close(); }, 500);
            };
          </script>
        </body>
      </html>
    `);
    receiptWindow.document.close();
  }
}
