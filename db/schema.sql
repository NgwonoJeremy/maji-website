-- STEP 1 of 4. Creates the three tables if they don't already exist.
-- Safe to paste more than once — nothing happens on a repeat paste.

CREATE TABLE IF NOT EXISTS customers (
  id INT(11) AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(150) NOT NULL UNIQUE,
  password VARCHAR(255),
  phone VARCHAR(20),
  role VARCHAR(20),
  estate VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS vendors (
  id INT(11) AUTO_INCREMENT PRIMARY KEY,
  user_id INT(11),
  estate VARCHAR(100),
  is_verified TINYINT(1) DEFAULT 0,
  is_online TINYINT(1) DEFAULT 0,
  rating DECIMAL(3,1),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES customers(id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS orders (
  id INT(11) AUTO_INCREMENT PRIMARY KEY,
  customer_id INT(11),
  vendor_id INT(11),
  estate VARCHAR(100),
  volume INT(11),
  delivery_time VARCHAR(50),
  total_amount DECIMAL(10,2),
  payment_method VARCHAR(20),
  status VARCHAR(30),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (vendor_id) REFERENCES vendors(id)
) ENGINE=InnoDB;