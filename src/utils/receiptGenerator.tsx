import React from 'react';
import ReactDOMServer from 'react-dom/server';

interface DonationReceiptProps {
  donation: {
    paymentId?: string;
    id?: string; // For MyDonations
    institute: string;
    donorName: string;
    date: string | Date;
    amount: string | number;
    type: 'monetary' | 'resource' | 'item';
    resources?: Array<{ name: string; quantity: number; amount: number }>;
    totalAmount?: number;
    cause?: string; // For MyDonations
  };
}

export const ReceiptContent: React.FC<DonationReceiptProps> = ({ donation }) => {
  const isMonetary = donation.type === 'monetary';
  const amountValue = typeof donation.amount === 'string' 
    ? parseFloat(donation.amount.replace(/[^0-9.-]+/g, "")) 
    : donation.amount;

  const totalAmount = donation.totalAmount || amountValue;
  const receiptId = donation.paymentId || donation.id || 'N/A';
  
  const dateStr = donation.date instanceof Date 
    ? donation.date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    : new Date(donation.date).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      });

  return (
    <div className="bg-white p-8 rounded-xl max-w-2xl mx-auto font-sans">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-indigo-600">KindHearts Foundation</h1>
        <p className="text-gray-600">Donation Receipt</p>
      </div>

      <div className="mb-6">
        <p className="font-medium">KindHearts Foundation</p>
        <div className="text-sm text-gray-600">
          <p>123 Charity Lane</p>
          <p>Mumbai, Maharashtra 400001</p>
          <p>India</p>
          <p>support@kindhearts.org</p>
        </div>
      </div>

      <div className="border-t border-b border-gray-200 py-4 mb-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-gray-600">Receipt Number:</p>
            <p className="font-medium">{receiptId}</p>
          </div>
          <div>
            <p className="text-gray-600">Date:</p>
            <p className="font-medium">{dateStr}</p>
          </div>
          <div>
            <p className="text-gray-600">Donor Name:</p>
            <p className="font-medium">{donation.donorName}</p>
          </div>
          <div>
            <p className="text-gray-600">Recipient Organization:</p>
            <p className="font-medium">{donation.institute}</p>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-4">Donation Details</h2>
        <div className="space-y-2">
          {isMonetary ? (
            <div className="flex justify-between py-2 border-b">
              <span>Charitable Donation</span>
              <span className="font-medium">
                ₹{Number(amountValue).toLocaleString("en-IN")}
              </span>
            </div>
          ) : (
            <>
              {donation.resources?.map((resource, index) => (
                <div key={index} className="flex justify-between py-2 border-b">
                  <span>{`${resource.name} x ${resource.quantity}`}</span>
                  <span className="font-medium">
                    ₹{resource.amount.toLocaleString("en-IN")}
                  </span>
                </div>
              ))}
              {/* Fallback for simple item donation if resources array is missing */}
              {!donation.resources && donation.cause && (
                 <div className="flex justify-between py-2 border-b">
                 <span>{donation.cause}</span>
                 <span className="font-medium">
                   ₹{Number(amountValue).toLocaleString("en-IN")}
                 </span>
               </div>
              )}
            </>
          )}
          <div className="flex justify-between pt-4 font-semibold">
            <span>Total Amount</span>
            <span>₹{Number(totalAmount).toLocaleString("en-IN")}</span>
          </div>
        </div>
      </div>

      <div className="text-center text-sm text-gray-600 mt-8">
        <p>This receipt is computer generated and does not require a physical signature.</p>
        <p className="mt-2">Thank you for your generous donation. Your contribution will make a meaningful impact.</p>
      </div>
    </div>
  );
};

export const generateAndOpenReceipt = (donation: DonationReceiptProps['donation']) => {
  try {
    const receiptWindow = window.open("", "_blank");
    if (!receiptWindow) {
      alert("Please allow popups for this website to view the receipt");
      return;
    }

    receiptWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Donation Receipt</title>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
        </head>
        <body>
          <div class="min-h-screen bg-gray-100 py-8">
            ${ReactDOMServer.renderToString(<ReceiptContent donation={donation} />)}
            <div class="text-center mt-8">
              <button onclick="window.print()" class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                Print Receipt
              </button>
            </div>
          </div>
        </body>
      </html>
    `);
    receiptWindow.document.close();
  } catch (error) {
    console.error("Error generating receipt:", error);
    alert("Failed to generate receipt");
  }
};
