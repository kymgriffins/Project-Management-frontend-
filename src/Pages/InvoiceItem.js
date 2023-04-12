import React from 'react';
import { useLocation } from 'react-router-dom';
import easyinvoice from 'easyinvoice';
import { URL } from '../Constants/constants';
import { Button } from '@mui/material';
const InvoiceItem = () => {
  const location = useLocation();

  const invoiceItem = location.state.row;
  console.log(invoiceItem);

  const generateInvoice = () => {
    const data = {
      "documentTitle": "INVOICE", //Defaults to INVOICE
      "currency": "KSH",
      "taxNotation": "GST", //or GST
      "marginTop": 25,
      "marginRight": 25,
      "marginLeft": 25,
      "marginBottom": 25,
      "logo": "https://public.easyinvoice.cloud/img/logo_en_original.png", //or base64
      "sender": {
        "company": "Jenga",
        "address": "Nairobi",
        "zip": "230",
        "city": "254",
        "country": "Kenya"
      },
      "client": {
        // "company": invoiceItem.created_by.username,
        "address": "Clientstreet 456",
        "zip": "4567 CD",
        "city": "City",
        "country": "Nairobi"
      },
      "invoiceNumber": "2023.04.08",
      "invoiceDate": "19.04.2023",
      "products": [
        {
          "quantity": 50,
          "description": "Material 1",
          "tax": 6,
          "price": 500
        },
        {
          "quantity": 200,
          "description": "Sand",
          "tax": 21,
          "price": 2000
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
      {/* <p>Project Name: {invoiceItem.project.name}</p> */}
      <p>Amount: {invoiceItem.amount}</p>
      <Button onClick={generateInvoice}>Generate Invoice</Button>
    </div>
  )
}

export default InvoiceItem;
