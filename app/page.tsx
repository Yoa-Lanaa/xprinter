"use client";

import "arrive";
import React, { useState } from "react";

const PrintPriceTag: React.FC = () => {
  const [product] = useState<{
    name: string;
    price: string;
    code: string;
  }>({
    name: "Plant Pot",
    price: "25.00",
    code: "PP001",
  });

  const printViaUSB = async () => {
    try {
      const device = await navigator.usb.requestDevice({
        filters: [{ vendorId: 0x2d37, productId: 0x83d7 }],
      });

      await device.open();
      await device.selectConfiguration(1);
      await device.claimInterface(0);

      const zpl = `
        ^XA
        ^FO50,50^A0N,50,50^FDPrice Tag^FS
        ^FO50,120^A0N,40,40^FDName: ${product.name}^FS
        ^FO50,170^A0N,40,40^FDPrice: $${product.price}^FS
        ^FO50,220^A0N,40,40^FDCode: ${product.code}^FS
        ^XZ
      `;

      const encoder = new TextEncoder();
      const data = encoder.encode(zpl);

      await device.transferOut(1, data);

      alert("Printed successfully!");
    } catch (error) {
      console.error("Error printing:", error);
      alert("Failed to print. Check the console for more details.");
    }
  };

  return (
    <div>
      <h1>Print Price Tag</h1>
      <div>
        <p>Name: {product.name}</p>
        <p>Price: ${product.price}</p>
        <p>Code: {product.code}</p>
      </div>
      <button onClick={printViaUSB}>Print Price Tag</button>
    </div>
  );
};

export default PrintPriceTag;
