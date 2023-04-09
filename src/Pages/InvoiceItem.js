import React from 'react';
import { useLocation } from 'react-router-dom';
import easyinvoice from 'easyinvoice';

const InvoiceItem = () => {
  const location = useLocation();

  const invoiceItem = location.state.row;
  console.log(invoiceItem);

  const generateInvoice = () => {
    const data = {
      "documentTitle": "INVOICE", //Defaults to INVOICE
      "currency": "USD",
      "taxNotation": "GST", //or GST
      "marginTop": 25,
      "marginRight": 25,
      "marginLeft": 25,
      "marginBottom": 25,
      "logo": "https://public.easyinvoice.cloud/img/logo_en_original.png", //or base64
      "sender": {
        "company": "Sample Corp",
        "address": "Sample Street 123",
        "zip": "1234 AB",
        "city": "Sampletown",
        "country": "Samplecountry"
      },
      "client": {
        // "company": invoiceItem.created_by.username,
        "address": "Clientstreet 456",
        "zip": "4567 CD",
        "city": "Clientcity",
        "country": "Clientcountry"
      },
      "invoiceNumber": "2023.04.08",
      "invoiceDate": "08.04.2023",
      "products": [
        {
          "quantity": 50,
          "description": "Material 1",
          "tax": 6,
          "price": 500
        },
        {
          "quantity": 200,
          "description": "Material 2",
          "tax": 21,
          "price": 200
        }
      ],
      "bottomNotice": "Kindly pay your invoice within 15 days."
    };

    easyinvoice.createInvoice(data, function (result) {
      easyinvoice.download('invoice.pdf', result.pdf);
    });
  }

  return (
    <div>
      <h1>Invoice Details</h1>
      <p>Project Name: {invoiceItem.project.name}</p>
      <p>Amount: {invoiceItem.amount}</p>
      <button onClick={generateInvoice}>Generate Invoice</button>
    </div>
  )
}

export default InvoiceItem;
