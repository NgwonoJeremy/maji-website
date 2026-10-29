-- Health Journal: copies of treatment orders placed with SafeMeds, so customers can see them in Maji.
-- Run once on the local database (phpMyAdmin) and once on Railway.

CREATE TABLE IF NOT EXISTS health_orders (
  id INT(11) AUTO_INCREMENT PRIMARY KEY,
  customer_id INT(11) NOT NULL,
  safemeds_order_id INT(11) NOT NULL,
  product_id INT(11) NOT NULL,
  product_name VARCHAR(120),
  quantity INT(11) NOT NULL,
  status VARCHAR(30) DEFAULT 'Pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customers(id)
) ENGINE=InnoDB;
