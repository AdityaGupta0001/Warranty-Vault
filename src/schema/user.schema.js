// auth.schema.js

export const userSchema = ({
  uid,
  email,
  password,
  name,
  phone = null,
  profilePic = null,
  address = {
    street: null,
    city: null,
    state: null,
    zip: null,
    country: null
  },
  createdAt = new Date()
}) => ({
  uid,                    // Unique identifier (Firebase UID or MongoDB ID)
  email,                  // Email (Required)
  password,               // Encrypted password (Required)
  name,                   // Full name (Required)
  phone,                  // Optional phone number (default: null)
  profilePic,             // Optional profile picture URL (default: null)
  address: {              // Optional address fields (default: null)
    street: address.street,
    city: address.city,
    state: address.state,
    zip: address.zip,
    country: address.country
  },
  createdAt               // Account creation timestamp (default: current date)
});

export default userSchema;
