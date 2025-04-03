export const productSchema = ({
    userId,
    productName,
    brand,
    category,
    purchaseDate,
    warrantyExpiryDate,
    purchasePrice = null,
    seller = null,
    invoiceUrl = null,
    warrantyDocUrl = null,
    warrantyTerms = null,
    createdAt = new Date(),
    updatedAt = new Date(),
  }) => {
    // Function to calculate warranty period breakdown
    const calculateWarrantyPeriod = (purchaseDate, expiryDate) => {
      const purchase = new Date(purchaseDate);
      const expiry = new Date(expiryDate);
      const diffMs = expiry - purchase;
  
      const years = Math.floor(diffMs / (365 * 24 * 60 * 60 * 1000));
      const months = Math.floor((diffMs % (365 * 24 * 60 * 60 * 1000)) / (30 * 24 * 60 * 60 * 1000));
      const weeks = Math.floor((diffMs % (30 * 24 * 60 * 60 * 1000)) / (7 * 24 * 60 * 60 * 1000));
      const days = Math.floor((diffMs % (7 * 24 * 60 * 60 * 1000)) / (24 * 60 * 60 * 1000));
  
      return { years, months, weeks, days };
    };
  
    return {
      userId,                     // Reference to the user
      productName,                // Name of the product
      brand,                      // Brand or manufacturer
      category,                   // Product category
      purchaseDate,               // Purchase date
      warrantyExpiryDate,         // Warranty expiry date
      warrantyPeriod: calculateWarrantyPeriod(purchaseDate, warrantyExpiryDate), // Calculated
      purchasePrice,              // Optional: Price of the product
      seller,                     // Optional: Seller or retailer
      invoiceUrl,                 // Optional: Invoice document URL
      warrantyDocUrl,             // Optional: Warranty document URL
      warrantyTerms: warrantyTerms
        ? warrantyTerms.substring(0, 250) // Limit summary to 250 characters
        : null,
      createdAt,                  // Timestamp when added
      updatedAt,                  // Timestamp when updated
    };
  };
  
  export default productSchema;
  