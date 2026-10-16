-- railway_setup.sql: builds the whole Maji database in one run, on MySQL 8.
-- Run ONCE on an empty database. Running it twice duplicates vendors and orders.

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
-- Customers generated from Orders.json
-- Every account uses the same password; see customers.json for the plaintext.

INSERT IGNORE INTO customers (name, email, password, phone, role, estate) VALUES ('Grace Muthoni', 'grace.muthoni.customer@gmail.com', '$2b$10$QkW6VeY0iqhE/0r.NZwm5Oqp4W4CbCVRyPj7J7SQaxKqy.HIdIS0G', '0710007919', 'customer', 'Kasarani');
INSERT IGNORE INTO customers (name, email, password, phone, role, estate) VALUES ('James Ochieng', 'james.ochieng.customer@gmail.com', '$2b$10$QkW6VeY0iqhE/0r.NZwm5Oqp4W4CbCVRyPj7J7SQaxKqy.HIdIS0G', '0710015838', 'customer', 'Lang\'ata');
INSERT IGNORE INTO customers (name, email, password, phone, role, estate) VALUES ('Mary Wanjiru', 'mary.wanjiru.customer@gmail.com', '$2b$10$QkW6VeY0iqhE/0r.NZwm5Oqp4W4CbCVRyPj7J7SQaxKqy.HIdIS0G', '0710023757', 'customer', 'Ruiru');
INSERT IGNORE INTO customers (name, email, password, phone, role, estate) VALUES ('Peter Kimani', 'peter.kimani.customer@gmail.com', '$2b$10$QkW6VeY0iqhE/0r.NZwm5Oqp4W4CbCVRyPj7J7SQaxKqy.HIdIS0G', '0710031676', 'customer', 'South C');
INSERT IGNORE INTO customers (name, email, password, phone, role, estate) VALUES ('Sarah Akinyi', 'sarah.akinyi.customer@gmail.com', '$2b$10$QkW6VeY0iqhE/0r.NZwm5Oqp4W4CbCVRyPj7J7SQaxKqy.HIdIS0G', '0710039595', 'customer', 'Westlands');
INSERT IGNORE INTO customers (name, email, password, phone, role, estate) VALUES ('David Odhiambo', 'david.odhiambo.customer@gmail.com', '$2b$10$QkW6VeY0iqhE/0r.NZwm5Oqp4W4CbCVRyPj7J7SQaxKqy.HIdIS0G', '0710047514', 'customer', 'Karen');
INSERT IGNORE INTO customers (name, email, password, phone, role, estate) VALUES ('Lucy Wambui', 'lucy.wambui.customer@gmail.com', '$2b$10$QkW6VeY0iqhE/0r.NZwm5Oqp4W4CbCVRyPj7J7SQaxKqy.HIdIS0G', '0710055433', 'customer', 'Kilimani');
INSERT IGNORE INTO customers (name, email, password, phone, role, estate) VALUES ('Michael Kiprop', 'michael.kiprop.customer@gmail.com', '$2b$10$QkW6VeY0iqhE/0r.NZwm5Oqp4W4CbCVRyPj7J7SQaxKqy.HIdIS0G', '0710063352', 'customer', 'Eastleigh');
INSERT IGNORE INTO customers (name, email, password, phone, role, estate) VALUES ('Faith Chelangat', 'faith.chelangat.customer@gmail.com', '$2b$10$QkW6VeY0iqhE/0r.NZwm5Oqp4W4CbCVRyPj7J7SQaxKqy.HIdIS0G', '0710071271', 'customer', 'Ngong');
INSERT IGNORE INTO customers (name, email, password, phone, role, estate) VALUES ('Samuel Mwangi', 'samuel.mwangi.customer@gmail.com', '$2b$10$QkW6VeY0iqhE/0r.NZwm5Oqp4W4CbCVRyPj7J7SQaxKqy.HIdIS0G', '0710079190', 'customer', 'Thika Road');
INSERT IGNORE INTO customers (name, email, password, phone, role, estate) VALUES ('Jane Atieno', 'jane.atieno.customer@gmail.com', '$2b$10$QkW6VeY0iqhE/0r.NZwm5Oqp4W4CbCVRyPj7J7SQaxKqy.HIdIS0G', '0710087109', 'customer', 'Umoja');
INSERT IGNORE INTO customers (name, email, password, phone, role, estate) VALUES ('Robert Omondi', 'robert.omondi.customer@gmail.com', '$2b$10$QkW6VeY0iqhE/0r.NZwm5Oqp4W4CbCVRyPj7J7SQaxKqy.HIdIS0G', '0710095028', 'customer', 'Buruburu');
INSERT IGNORE INTO customers (name, email, password, phone, role, estate) VALUES ('Esther Njoroge', 'esther.njoroge.customer@gmail.com', '$2b$10$QkW6VeY0iqhE/0r.NZwm5Oqp4W4CbCVRyPj7J7SQaxKqy.HIdIS0G', '0710102947', 'customer', 'Kileleshwa');
INSERT IGNORE INTO customers (name, email, password, phone, role, estate) VALUES ('John Kamau', 'john.kamau.customer@gmail.com', '$2b$10$QkW6VeY0iqhE/0r.NZwm5Oqp4W4CbCVRyPj7J7SQaxKqy.HIdIS0G', '0710110866', 'customer', 'Embakasi');
INSERT IGNORE INTO customers (name, email, password, phone, role, estate) VALUES ('Catherine Wanjiku', 'catherine.wanjiku.customer@gmail.com', '$2b$10$QkW6VeY0iqhE/0r.NZwm5Oqp4W4CbCVRyPj7J7SQaxKqy.HIdIS0G', '0710118785', 'customer', 'Lavington');
INSERT IGNORE INTO customers (name, email, password, phone, role, estate) VALUES ('Daniel Mutua', 'daniel.mutua.customer@gmail.com', '$2b$10$QkW6VeY0iqhE/0r.NZwm5Oqp4W4CbCVRyPj7J7SQaxKqy.HIdIS0G', '0710126704', 'customer', 'Kawangware');
INSERT IGNORE INTO customers (name, email, password, phone, role, estate) VALUES ('Florence Adhiambo', 'florence.adhiambo.customer@gmail.com', '$2b$10$QkW6VeY0iqhE/0r.NZwm5Oqp4W4CbCVRyPj7J7SQaxKqy.HIdIS0G', '0710134623', 'customer', 'Dagoretti');
INSERT IGNORE INTO customers (name, email, password, phone, role, estate) VALUES ('George Otieno', 'george.otieno.customer@gmail.com', '$2b$10$QkW6VeY0iqhE/0r.NZwm5Oqp4W4CbCVRyPj7J7SQaxKqy.HIdIS0G', '0710142542', 'customer', 'Rongai');
INSERT IGNORE INTO customers (name, email, password, phone, role, estate) VALUES ('Alice Muthoni', 'alice.muthoni.customer@gmail.com', '$2b$10$QkW6VeY0iqhE/0r.NZwm5Oqp4W4CbCVRyPj7J7SQaxKqy.HIdIS0G', '0710150461', 'customer', 'Syokimau');
INSERT IGNORE INTO customers (name, email, password, phone, role, estate) VALUES ('Thomas Kibet', 'thomas.kibet.customer@gmail.com', '$2b$10$QkW6VeY0iqhE/0r.NZwm5Oqp4W4CbCVRyPj7J7SQaxKqy.HIdIS0G', '0710158380', 'customer', 'Kitengela');
INSERT IGNORE INTO customers (name, email, password, phone, role, estate) VALUES ('Susan Achieng', 'susan.achieng.customer@gmail.com', '$2b$10$QkW6VeY0iqhE/0r.NZwm5Oqp4W4CbCVRyPj7J7SQaxKqy.HIdIS0G', '0710166299', 'customer', 'Tena');
INSERT IGNORE INTO customers (name, email, password, phone, role, estate) VALUES ('Brian Mwenda', 'brian.mwenda.customer@gmail.com', '$2b$10$QkW6VeY0iqhE/0r.NZwm5Oqp4W4CbCVRyPj7J7SQaxKqy.HIdIS0G', '0710174218', 'customer', 'Githurai');
INSERT IGNORE INTO customers (name, email, password, phone, role, estate) VALUES ('Rose Kemunto', 'rose.kemunto.customer@gmail.com', '$2b$10$QkW6VeY0iqhE/0r.NZwm5Oqp4W4CbCVRyPj7J7SQaxKqy.HIdIS0G', '0710182137', 'customer', 'Kangemi');
INSERT IGNORE INTO customers (name, email, password, phone, role, estate) VALUES ('Patrick Njuguna', 'patrick.njuguna.customer@gmail.com', '$2b$10$QkW6VeY0iqhE/0r.NZwm5Oqp4W4CbCVRyPj7J7SQaxKqy.HIdIS0G', '0710190056', 'customer', 'Muthaiga');
INSERT IGNORE INTO customers (name, email, password, phone, role, estate) VALUES ('Dorothy Wairimu', 'dorothy.wairimu.customer@gmail.com', '$2b$10$QkW6VeY0iqhE/0r.NZwm5Oqp4W4CbCVRyPj7J7SQaxKqy.HIdIS0G', '0710197975', 'customer', 'Parklands');
INSERT IGNORE INTO customers (name, email, password, phone, role, estate) VALUES ('Eliud Kipchoge', 'eliud.kipchoge.customer@gmail.com', '$2b$10$QkW6VeY0iqhE/0r.NZwm5Oqp4W4CbCVRyPj7J7SQaxKqy.HIdIS0G', '0710205894', 'customer', 'Eldoret (Nairobi Area)');
INSERT IGNORE INTO customers (name, email, password, phone, role, estate) VALUES ('Mildred Adhiambo', 'mildred.adhiambo.customer@gmail.com', '$2b$10$QkW6VeY0iqhE/0r.NZwm5Oqp4W4CbCVRyPj7J7SQaxKqy.HIdIS0G', '0710213813', 'customer', 'Imara Daima');
INSERT IGNORE INTO customers (name, email, password, phone, role, estate) VALUES ('Joseph Kuria', 'joseph.kuria.customer@gmail.com', '$2b$10$QkW6VeY0iqhE/0r.NZwm5Oqp4W4CbCVRyPj7J7SQaxKqy.HIdIS0G', '0710221732', 'customer', 'Ruiru');
INSERT IGNORE INTO customers (name, email, password, phone, role, estate) VALUES ('Mercy Jepkosgei', 'mercy.jepkosgei.customer@gmail.com', '$2b$10$QkW6VeY0iqhE/0r.NZwm5Oqp4W4CbCVRyPj7J7SQaxKqy.HIdIS0G', '0710229651', 'customer', 'Kasarani');
INSERT IGNORE INTO customers (name, email, password, phone, role, estate) VALUES ('Kennedy Oduor', 'kennedy.oduor.customer@gmail.com', '$2b$10$QkW6VeY0iqhE/0r.NZwm5Oqp4W4CbCVRyPj7J7SQaxKqy.HIdIS0G', '0710237570', 'customer', 'South B');
INSERT IGNORE INTO customers (name, email, password, phone, role, estate) VALUES ('Ann Wanjiru', 'ann.wanjiru.customer@gmail.com', '$2b$10$QkW6VeY0iqhE/0r.NZwm5Oqp4W4CbCVRyPj7J7SQaxKqy.HIdIS0G', '0710245489', 'customer', 'Karen');
INSERT IGNORE INTO customers (name, email, password, phone, role, estate) VALUES ('Simon Ndirangu', 'simon.ndirangu.customer@gmail.com', '$2b$10$QkW6VeY0iqhE/0r.NZwm5Oqp4W4CbCVRyPj7J7SQaxKqy.HIdIS0G', '0710253408', 'customer', 'Lang\'ata');
INSERT IGNORE INTO customers (name, email, password, phone, role, estate) VALUES ('Phyllis Okoth', 'phyllis.okoth.customer@gmail.com', '$2b$10$QkW6VeY0iqhE/0r.NZwm5Oqp4W4CbCVRyPj7J7SQaxKqy.HIdIS0G', '0710261327', 'customer', 'Westlands');
INSERT IGNORE INTO customers (name, email, password, phone, role, estate) VALUES ('Timothy Mbuvi', 'timothy.mbuvi.customer@gmail.com', '$2b$10$QkW6VeY0iqhE/0r.NZwm5Oqp4W4CbCVRyPj7J7SQaxKqy.HIdIS0G', '0710269246', 'customer', 'Kilimani');
INSERT IGNORE INTO customers (name, email, password, phone, role, estate) VALUES ('Ruth Nyambura', 'ruth.nyambura.customer@gmail.com', '$2b$10$QkW6VeY0iqhE/0r.NZwm5Oqp4W4CbCVRyPj7J7SQaxKqy.HIdIS0G', '0710277165', 'customer', 'Eastleigh');
INSERT IGNORE INTO customers (name, email, password, phone, role, estate) VALUES ('Vincent Mwangi', 'vincent.mwangi.customer@gmail.com', '$2b$10$QkW6VeY0iqhE/0r.NZwm5Oqp4W4CbCVRyPj7J7SQaxKqy.HIdIS0G', '0710285084', 'customer', 'Ngong');
INSERT IGNORE INTO customers (name, email, password, phone, role, estate) VALUES ('Joyce Akinyi', 'joyce.akinyi.customer@gmail.com', '$2b$10$QkW6VeY0iqhE/0r.NZwm5Oqp4W4CbCVRyPj7J7SQaxKqy.HIdIS0G', '0710293003', 'customer', 'Thika Road');
INSERT IGNORE INTO customers (name, email, password, phone, role, estate) VALUES ('Fredrick Ochieng', 'fredrick.ochieng.customer@gmail.com', '$2b$10$QkW6VeY0iqhE/0r.NZwm5Oqp4W4CbCVRyPj7J7SQaxKqy.HIdIS0G', '0710300922', 'customer', 'Umoja');
INSERT IGNORE INTO customers (name, email, password, phone, role, estate) VALUES ('Margaret Wambui', 'margaret.wambui.customer@gmail.com', '$2b$10$QkW6VeY0iqhE/0r.NZwm5Oqp4W4CbCVRyPj7J7SQaxKqy.HIdIS0G', '0710308841', 'customer', 'Buruburu');
INSERT IGNORE INTO customers (name, email, password, phone, role, estate) VALUES ('Julius Kariuki', 'julius.kariuki.customer@gmail.com', '$2b$10$QkW6VeY0iqhE/0r.NZwm5Oqp4W4CbCVRyPj7J7SQaxKqy.HIdIS0G', '0710316760', 'customer', 'Kileleshwa');
INSERT IGNORE INTO customers (name, email, password, phone, role, estate) VALUES ('Beatrice Atieno', 'beatrice.atieno.customer@gmail.com', '$2b$10$QkW6VeY0iqhE/0r.NZwm5Oqp4W4CbCVRyPj7J7SQaxKqy.HIdIS0G', '0710324679', 'customer', 'Embakasi');
INSERT IGNORE INTO customers (name, email, password, phone, role, estate) VALUES ('Dennis Njenga', 'dennis.njenga.customer@gmail.com', '$2b$10$QkW6VeY0iqhE/0r.NZwm5Oqp4W4CbCVRyPj7J7SQaxKqy.HIdIS0G', '0710332598', 'customer', 'Lavington');
INSERT IGNORE INTO customers (name, email, password, phone, role, estate) VALUES ('Caroline Mutheu', 'caroline.mutheu.customer@gmail.com', '$2b$10$QkW6VeY0iqhE/0r.NZwm5Oqp4W4CbCVRyPj7J7SQaxKqy.HIdIS0G', '0710340517', 'customer', 'Kawangware');
INSERT IGNORE INTO customers (name, email, password, phone, role, estate) VALUES ('Stephen Maina', 'stephen.maina.customer@gmail.com', '$2b$10$QkW6VeY0iqhE/0r.NZwm5Oqp4W4CbCVRyPj7J7SQaxKqy.HIdIS0G', '0710348436', 'customer', 'Dagoretti');
INSERT IGNORE INTO customers (name, email, password, phone, role, estate) VALUES ('Emily Chebet', 'emily.chebet.customer@gmail.com', '$2b$10$QkW6VeY0iqhE/0r.NZwm5Oqp4W4CbCVRyPj7J7SQaxKqy.HIdIS0G', '0710356355', 'customer', 'Rongai');
INSERT IGNORE INTO customers (name, email, password, phone, role, estate) VALUES ('Moses Omollo', 'moses.omollo.customer@gmail.com', '$2b$10$QkW6VeY0iqhE/0r.NZwm5Oqp4W4CbCVRyPj7J7SQaxKqy.HIdIS0G', '0710364274', 'customer', 'Syokimau');
INSERT IGNORE INTO customers (name, email, password, phone, role, estate) VALUES ('Jane Wanja', 'jane.wanja.customer@gmail.com', '$2b$10$QkW6VeY0iqhE/0r.NZwm5Oqp4W4CbCVRyPj7J7SQaxKqy.HIdIS0G', '0710372193', 'customer', 'Kitengela');
INSERT IGNORE INTO customers (name, email, password, phone, role, estate) VALUES ('Charles Njoroge', 'charles.njoroge.customer@gmail.com', '$2b$10$QkW6VeY0iqhE/0r.NZwm5Oqp4W4CbCVRyPj7J7SQaxKqy.HIdIS0G', '0710380112', 'customer', 'Tena');
INSERT IGNORE INTO customers (name, email, password, phone, role, estate) VALUES ('Pamela Awino', 'pamela.awino.customer@gmail.com', '$2b$10$QkW6VeY0iqhE/0r.NZwm5Oqp4W4CbCVRyPj7J7SQaxKqy.HIdIS0G', '0710388031', 'customer', 'Githurai');
INSERT IGNORE INTO customers (name, email, password, phone, role, estate) VALUES ('George Kamotho', 'george.kamotho.customer@gmail.com', '$2b$10$QkW6VeY0iqhE/0r.NZwm5Oqp4W4CbCVRyPj7J7SQaxKqy.HIdIS0G', '0710395950', 'customer', 'Kangemi');
-- Vendors generated from Vendor.json
-- Each vendor is a customers row (role='vendor') plus one vendors row.
-- vendors.is_verified is boolean, so 'Pending' and 'Not Verified' both become 0.

INSERT IGNORE INTO customers (name, email, password, phone, role, estate) VALUES ('Derrick Otieno', 'derrick.otieno.vendor@gmail.com', '$2b$10$QkW6VeY0iqhE/0r.NZwm5Oqp4W4CbCVRyPj7J7SQaxKqy.HIdIS0G', '0717919000', 'vendor', 'Kasarani');
INSERT IGNORE INTO vendors (user_id, estate, is_verified, is_online, rating) VALUES ((SELECT id FROM customers WHERE email = 'derrick.otieno.vendor@gmail.com'), 'Kasarani', 1, 0, NULL);
INSERT IGNORE INTO customers (name, email, password, phone, role, estate) VALUES ('Christine Pauline', 'christine.pauline.vendor@gmail.com', '$2b$10$QkW6VeY0iqhE/0r.NZwm5Oqp4W4CbCVRyPj7J7SQaxKqy.HIdIS0G', '0717926919', 'vendor', 'Madaraka');
INSERT IGNORE INTO vendors (user_id, estate, is_verified, is_online, rating) VALUES ((SELECT id FROM customers WHERE email = 'christine.pauline.vendor@gmail.com'), 'Madaraka', 0, 0, NULL);
INSERT IGNORE INTO customers (name, email, password, phone, role, estate) VALUES ('James Mwangi', 'james.mwangi.vendor@gmail.com', '$2b$10$QkW6VeY0iqhE/0r.NZwm5Oqp4W4CbCVRyPj7J7SQaxKqy.HIdIS0G', '0717934838', 'vendor', 'Westlands');
INSERT IGNORE INTO vendors (user_id, estate, is_verified, is_online, rating) VALUES ((SELECT id FROM customers WHERE email = 'james.mwangi.vendor@gmail.com'), 'Westlands', 1, 0, NULL);
INSERT IGNORE INTO customers (name, email, password, phone, role, estate) VALUES ('Sarah Akinyi', 'sarah.akinyi.vendor@gmail.com', '$2b$10$QkW6VeY0iqhE/0r.NZwm5Oqp4W4CbCVRyPj7J7SQaxKqy.HIdIS0G', '0717942757', 'vendor', 'Lang\'ata');
INSERT IGNORE INTO vendors (user_id, estate, is_verified, is_online, rating) VALUES ((SELECT id FROM customers WHERE email = 'sarah.akinyi.vendor@gmail.com'), 'Lang\'ata', 0, 0, NULL);
INSERT IGNORE INTO customers (name, email, password, phone, role, estate) VALUES ('Peter Kimani', 'peter.kimani.vendor@gmail.com', '$2b$10$QkW6VeY0iqhE/0r.NZwm5Oqp4W4CbCVRyPj7J7SQaxKqy.HIdIS0G', '0717950676', 'vendor', 'Ruiru');
INSERT IGNORE INTO vendors (user_id, estate, is_verified, is_online, rating) VALUES ((SELECT id FROM customers WHERE email = 'peter.kimani.vendor@gmail.com'), 'Ruiru', 1, 0, NULL);
INSERT IGNORE INTO customers (name, email, password, phone, role, estate) VALUES ('Grace Wanjiru', 'grace.wanjiru.vendor@gmail.com', '$2b$10$QkW6VeY0iqhE/0r.NZwm5Oqp4W4CbCVRyPj7J7SQaxKqy.HIdIS0G', '0717958595', 'vendor', 'Karen');
INSERT IGNORE INTO vendors (user_id, estate, is_verified, is_online, rating) VALUES ((SELECT id FROM customers WHERE email = 'grace.wanjiru.vendor@gmail.com'), 'Karen', 0, 0, NULL);
INSERT IGNORE INTO customers (name, email, password, phone, role, estate) VALUES ('David Odhiambo', 'david.odhiambo.vendor@gmail.com', '$2b$10$QkW6VeY0iqhE/0r.NZwm5Oqp4W4CbCVRyPj7J7SQaxKqy.HIdIS0G', '0717966514', 'vendor', 'Kilimani');
INSERT IGNORE INTO vendors (user_id, estate, is_verified, is_online, rating) VALUES ((SELECT id FROM customers WHERE email = 'david.odhiambo.vendor@gmail.com'), 'Kilimani', 1, 0, NULL);
INSERT IGNORE INTO customers (name, email, password, phone, role, estate) VALUES ('Mary Wambui', 'mary.wambui.vendor@gmail.com', '$2b$10$QkW6VeY0iqhE/0r.NZwm5Oqp4W4CbCVRyPj7J7SQaxKqy.HIdIS0G', '0717974433', 'vendor', 'Eastleigh');
INSERT IGNORE INTO vendors (user_id, estate, is_verified, is_online, rating) VALUES ((SELECT id FROM customers WHERE email = 'mary.wambui.vendor@gmail.com'), 'Eastleigh', 0, 0, NULL);
INSERT IGNORE INTO customers (name, email, password, phone, role, estate) VALUES ('Michael Kiprop', 'michael.kiprop.vendor@gmail.com', '$2b$10$QkW6VeY0iqhE/0r.NZwm5Oqp4W4CbCVRyPj7J7SQaxKqy.HIdIS0G', '0717982352', 'vendor', 'Ngong');
INSERT IGNORE INTO vendors (user_id, estate, is_verified, is_online, rating) VALUES ((SELECT id FROM customers WHERE email = 'michael.kiprop.vendor@gmail.com'), 'Ngong', 1, 0, NULL);
INSERT IGNORE INTO customers (name, email, password, phone, role, estate) VALUES ('Faith Chelangat', 'faith.chelangat.vendor@gmail.com', '$2b$10$QkW6VeY0iqhE/0r.NZwm5Oqp4W4CbCVRyPj7J7SQaxKqy.HIdIS0G', '0717990271', 'vendor', 'Thika Road');
INSERT IGNORE INTO vendors (user_id, estate, is_verified, is_online, rating) VALUES ((SELECT id FROM customers WHERE email = 'faith.chelangat.vendor@gmail.com'), 'Thika Road', 0, 0, NULL);
INSERT IGNORE INTO customers (name, email, password, phone, role, estate) VALUES ('Samuel Mwangi', 'samuel.mwangi.vendor@gmail.com', '$2b$10$QkW6VeY0iqhE/0r.NZwm5Oqp4W4CbCVRyPj7J7SQaxKqy.HIdIS0G', '0717998190', 'vendor', 'Umoja');
INSERT IGNORE INTO vendors (user_id, estate, is_verified, is_online, rating) VALUES ((SELECT id FROM customers WHERE email = 'samuel.mwangi.vendor@gmail.com'), 'Umoja', 1, 0, NULL);
INSERT IGNORE INTO customers (name, email, password, phone, role, estate) VALUES ('Jane Atieno', 'jane.atieno.vendor@gmail.com', '$2b$10$QkW6VeY0iqhE/0r.NZwm5Oqp4W4CbCVRyPj7J7SQaxKqy.HIdIS0G', '0718006109', 'vendor', 'Buruburu');
INSERT IGNORE INTO vendors (user_id, estate, is_verified, is_online, rating) VALUES ((SELECT id FROM customers WHERE email = 'jane.atieno.vendor@gmail.com'), 'Buruburu', 0, 0, NULL);
INSERT IGNORE INTO customers (name, email, password, phone, role, estate) VALUES ('Robert Omondi', 'robert.omondi.vendor@gmail.com', '$2b$10$QkW6VeY0iqhE/0r.NZwm5Oqp4W4CbCVRyPj7J7SQaxKqy.HIdIS0G', '0718014028', 'vendor', 'Kileleshwa');
INSERT IGNORE INTO vendors (user_id, estate, is_verified, is_online, rating) VALUES ((SELECT id FROM customers WHERE email = 'robert.omondi.vendor@gmail.com'), 'Kileleshwa', 1, 0, NULL);
INSERT IGNORE INTO customers (name, email, password, phone, role, estate) VALUES ('Esther Njoroge', 'esther.njoroge.vendor@gmail.com', '$2b$10$QkW6VeY0iqhE/0r.NZwm5Oqp4W4CbCVRyPj7J7SQaxKqy.HIdIS0G', '0718021947', 'vendor', 'Embakasi');
INSERT IGNORE INTO vendors (user_id, estate, is_verified, is_online, rating) VALUES ((SELECT id FROM customers WHERE email = 'esther.njoroge.vendor@gmail.com'), 'Embakasi', 0, 0, NULL);
INSERT IGNORE INTO customers (name, email, password, phone, role, estate) VALUES ('John Kamau', 'john.kamau.vendor@gmail.com', '$2b$10$QkW6VeY0iqhE/0r.NZwm5Oqp4W4CbCVRyPj7J7SQaxKqy.HIdIS0G', '0718029866', 'vendor', 'Lavington');
INSERT IGNORE INTO vendors (user_id, estate, is_verified, is_online, rating) VALUES ((SELECT id FROM customers WHERE email = 'john.kamau.vendor@gmail.com'), 'Lavington', 1, 0, NULL);
INSERT IGNORE INTO customers (name, email, password, phone, role, estate) VALUES ('Catherine Wanjiku', 'catherine.wanjiku.vendor@gmail.com', '$2b$10$QkW6VeY0iqhE/0r.NZwm5Oqp4W4CbCVRyPj7J7SQaxKqy.HIdIS0G', '0718037785', 'vendor', 'Kawangware');
INSERT IGNORE INTO vendors (user_id, estate, is_verified, is_online, rating) VALUES ((SELECT id FROM customers WHERE email = 'catherine.wanjiku.vendor@gmail.com'), 'Kawangware', 0, 0, NULL);
INSERT IGNORE INTO customers (name, email, password, phone, role, estate) VALUES ('Daniel Mutua', 'daniel.mutua.vendor@gmail.com', '$2b$10$QkW6VeY0iqhE/0r.NZwm5Oqp4W4CbCVRyPj7J7SQaxKqy.HIdIS0G', '0718045704', 'vendor', 'Dagoretti');
INSERT IGNORE INTO vendors (user_id, estate, is_verified, is_online, rating) VALUES ((SELECT id FROM customers WHERE email = 'daniel.mutua.vendor@gmail.com'), 'Dagoretti', 1, 0, NULL);
INSERT IGNORE INTO customers (name, email, password, phone, role, estate) VALUES ('Florence Adhiambo', 'florence.adhiambo.vendor@gmail.com', '$2b$10$QkW6VeY0iqhE/0r.NZwm5Oqp4W4CbCVRyPj7J7SQaxKqy.HIdIS0G', '0718053623', 'vendor', 'Rongai');
INSERT IGNORE INTO vendors (user_id, estate, is_verified, is_online, rating) VALUES ((SELECT id FROM customers WHERE email = 'florence.adhiambo.vendor@gmail.com'), 'Rongai', 0, 0, NULL);
INSERT IGNORE INTO customers (name, email, password, phone, role, estate) VALUES ('George Otieno', 'george.otieno.vendor@gmail.com', '$2b$10$QkW6VeY0iqhE/0r.NZwm5Oqp4W4CbCVRyPj7J7SQaxKqy.HIdIS0G', '0718061542', 'vendor', 'Syokimau');
INSERT IGNORE INTO vendors (user_id, estate, is_verified, is_online, rating) VALUES ((SELECT id FROM customers WHERE email = 'george.otieno.vendor@gmail.com'), 'Syokimau', 1, 0, NULL);
INSERT IGNORE INTO customers (name, email, password, phone, role, estate) VALUES ('Alice Muthoni', 'alice.muthoni.vendor@gmail.com', '$2b$10$QkW6VeY0iqhE/0r.NZwm5Oqp4W4CbCVRyPj7J7SQaxKqy.HIdIS0G', '0718069461', 'vendor', 'Kitengela');
INSERT IGNORE INTO vendors (user_id, estate, is_verified, is_online, rating) VALUES ((SELECT id FROM customers WHERE email = 'alice.muthoni.vendor@gmail.com'), 'Kitengela', 0, 0, NULL);
INSERT IGNORE INTO customers (name, email, password, phone, role, estate) VALUES ('Thomas Kibet', 'thomas.kibet.vendor@gmail.com', '$2b$10$QkW6VeY0iqhE/0r.NZwm5Oqp4W4CbCVRyPj7J7SQaxKqy.HIdIS0G', '0718077380', 'vendor', 'South C');
INSERT IGNORE INTO vendors (user_id, estate, is_verified, is_online, rating) VALUES ((SELECT id FROM customers WHERE email = 'thomas.kibet.vendor@gmail.com'), 'South C', 1, 0, NULL);
INSERT IGNORE INTO customers (name, email, password, phone, role, estate) VALUES ('Susan Achieng', 'susan.achieng.vendor@gmail.com', '$2b$10$QkW6VeY0iqhE/0r.NZwm5Oqp4W4CbCVRyPj7J7SQaxKqy.HIdIS0G', '0718085299', 'vendor', 'Tena');
INSERT IGNORE INTO vendors (user_id, estate, is_verified, is_online, rating) VALUES ((SELECT id FROM customers WHERE email = 'susan.achieng.vendor@gmail.com'), 'Tena', 0, 0, NULL);
INSERT IGNORE INTO customers (name, email, password, phone, role, estate) VALUES ('Brian Mwenda', 'brian.mwenda.vendor@gmail.com', '$2b$10$QkW6VeY0iqhE/0r.NZwm5Oqp4W4CbCVRyPj7J7SQaxKqy.HIdIS0G', '0718093218', 'vendor', 'Githurai');
INSERT IGNORE INTO vendors (user_id, estate, is_verified, is_online, rating) VALUES ((SELECT id FROM customers WHERE email = 'brian.mwenda.vendor@gmail.com'), 'Githurai', 1, 0, NULL);
INSERT IGNORE INTO customers (name, email, password, phone, role, estate) VALUES ('Rose Kemunto', 'rose.kemunto.vendor@gmail.com', '$2b$10$QkW6VeY0iqhE/0r.NZwm5Oqp4W4CbCVRyPj7J7SQaxKqy.HIdIS0G', '0718101137', 'vendor', 'Kangemi');
INSERT IGNORE INTO vendors (user_id, estate, is_verified, is_online, rating) VALUES ((SELECT id FROM customers WHERE email = 'rose.kemunto.vendor@gmail.com'), 'Kangemi', 0, 0, NULL);
INSERT IGNORE INTO customers (name, email, password, phone, role, estate) VALUES ('Patrick Njuguna', 'patrick.njuguna.vendor@gmail.com', '$2b$10$QkW6VeY0iqhE/0r.NZwm5Oqp4W4CbCVRyPj7J7SQaxKqy.HIdIS0G', '0718109056', 'vendor', 'Muthaiga');
INSERT IGNORE INTO vendors (user_id, estate, is_verified, is_online, rating) VALUES ((SELECT id FROM customers WHERE email = 'patrick.njuguna.vendor@gmail.com'), 'Muthaiga', 1, 0, NULL);
INSERT IGNORE INTO customers (name, email, password, phone, role, estate) VALUES ('Dorothy Wairimu', 'dorothy.wairimu.vendor@gmail.com', '$2b$10$QkW6VeY0iqhE/0r.NZwm5Oqp4W4CbCVRyPj7J7SQaxKqy.HIdIS0G', '0718116975', 'vendor', 'Parklands');
INSERT IGNORE INTO vendors (user_id, estate, is_verified, is_online, rating) VALUES ((SELECT id FROM customers WHERE email = 'dorothy.wairimu.vendor@gmail.com'), 'Parklands', 0, 0, NULL);
INSERT IGNORE INTO customers (name, email, password, phone, role, estate) VALUES ('Eliud Kipchoge', 'eliud.kipchoge.vendor@gmail.com', '$2b$10$QkW6VeY0iqhE/0r.NZwm5Oqp4W4CbCVRyPj7J7SQaxKqy.HIdIS0G', '0718124894', 'vendor', 'Eldoret (Nairobi Area)');
INSERT IGNORE INTO vendors (user_id, estate, is_verified, is_online, rating) VALUES ((SELECT id FROM customers WHERE email = 'eliud.kipchoge.vendor@gmail.com'), 'Eldoret (Nairobi Area)', 1, 0, NULL);
INSERT IGNORE INTO customers (name, email, password, phone, role, estate) VALUES ('Mildred Adhiambo', 'mildred.adhiambo.vendor@gmail.com', '$2b$10$QkW6VeY0iqhE/0r.NZwm5Oqp4W4CbCVRyPj7J7SQaxKqy.HIdIS0G', '0718132813', 'vendor', 'Imara Daima');
INSERT IGNORE INTO vendors (user_id, estate, is_verified, is_online, rating) VALUES ((SELECT id FROM customers WHERE email = 'mildred.adhiambo.vendor@gmail.com'), 'Imara Daima', 0, 0, NULL);
INSERT IGNORE INTO customers (name, email, password, phone, role, estate) VALUES ('Joseph Kuria', 'joseph.kuria.vendor@gmail.com', '$2b$10$QkW6VeY0iqhE/0r.NZwm5Oqp4W4CbCVRyPj7J7SQaxKqy.HIdIS0G', '0718140732', 'vendor', 'Ruiru');
INSERT IGNORE INTO vendors (user_id, estate, is_verified, is_online, rating) VALUES ((SELECT id FROM customers WHERE email = 'joseph.kuria.vendor@gmail.com'), 'Ruiru', 1, 0, NULL);
INSERT IGNORE INTO customers (name, email, password, phone, role, estate) VALUES ('Mercy Jepkosgei', 'mercy.jepkosgei.vendor@gmail.com', '$2b$10$QkW6VeY0iqhE/0r.NZwm5Oqp4W4CbCVRyPj7J7SQaxKqy.HIdIS0G', '0718148651', 'vendor', 'Kasarani');
INSERT IGNORE INTO vendors (user_id, estate, is_verified, is_online, rating) VALUES ((SELECT id FROM customers WHERE email = 'mercy.jepkosgei.vendor@gmail.com'), 'Kasarani', 0, 0, NULL);
INSERT IGNORE INTO customers (name, email, password, phone, role, estate) VALUES ('Kennedy Oduor', 'kennedy.oduor.vendor@gmail.com', '$2b$10$QkW6VeY0iqhE/0r.NZwm5Oqp4W4CbCVRyPj7J7SQaxKqy.HIdIS0G', '0718156570', 'vendor', 'South B');
INSERT IGNORE INTO vendors (user_id, estate, is_verified, is_online, rating) VALUES ((SELECT id FROM customers WHERE email = 'kennedy.oduor.vendor@gmail.com'), 'South B', 1, 0, NULL);
INSERT IGNORE INTO customers (name, email, password, phone, role, estate) VALUES ('Ann Wanjiru', 'ann.wanjiru.vendor@gmail.com', '$2b$10$QkW6VeY0iqhE/0r.NZwm5Oqp4W4CbCVRyPj7J7SQaxKqy.HIdIS0G', '0718164489', 'vendor', 'Karen');
INSERT IGNORE INTO vendors (user_id, estate, is_verified, is_online, rating) VALUES ((SELECT id FROM customers WHERE email = 'ann.wanjiru.vendor@gmail.com'), 'Karen', 0, 0, NULL);
INSERT IGNORE INTO customers (name, email, password, phone, role, estate) VALUES ('Simon Ndirangu', 'simon.ndirangu.vendor@gmail.com', '$2b$10$QkW6VeY0iqhE/0r.NZwm5Oqp4W4CbCVRyPj7J7SQaxKqy.HIdIS0G', '0718172408', 'vendor', 'Lang\'ata');
INSERT IGNORE INTO vendors (user_id, estate, is_verified, is_online, rating) VALUES ((SELECT id FROM customers WHERE email = 'simon.ndirangu.vendor@gmail.com'), 'Lang\'ata', 1, 0, NULL);
INSERT IGNORE INTO customers (name, email, password, phone, role, estate) VALUES ('Phyllis Okoth', 'phyllis.okoth.vendor@gmail.com', '$2b$10$QkW6VeY0iqhE/0r.NZwm5Oqp4W4CbCVRyPj7J7SQaxKqy.HIdIS0G', '0718180327', 'vendor', 'Westlands');
INSERT IGNORE INTO vendors (user_id, estate, is_verified, is_online, rating) VALUES ((SELECT id FROM customers WHERE email = 'phyllis.okoth.vendor@gmail.com'), 'Westlands', 0, 0, NULL);
INSERT IGNORE INTO customers (name, email, password, phone, role, estate) VALUES ('Timothy Mbuvi', 'timothy.mbuvi.vendor@gmail.com', '$2b$10$QkW6VeY0iqhE/0r.NZwm5Oqp4W4CbCVRyPj7J7SQaxKqy.HIdIS0G', '0718188246', 'vendor', 'Kilimani');
INSERT IGNORE INTO vendors (user_id, estate, is_verified, is_online, rating) VALUES ((SELECT id FROM customers WHERE email = 'timothy.mbuvi.vendor@gmail.com'), 'Kilimani', 1, 0, NULL);
INSERT IGNORE INTO customers (name, email, password, phone, role, estate) VALUES ('Ruth Nyambura', 'ruth.nyambura.vendor@gmail.com', '$2b$10$QkW6VeY0iqhE/0r.NZwm5Oqp4W4CbCVRyPj7J7SQaxKqy.HIdIS0G', '0718196165', 'vendor', 'Eastleigh');
INSERT IGNORE INTO vendors (user_id, estate, is_verified, is_online, rating) VALUES ((SELECT id FROM customers WHERE email = 'ruth.nyambura.vendor@gmail.com'), 'Eastleigh', 0, 0, NULL);
INSERT IGNORE INTO customers (name, email, password, phone, role, estate) VALUES ('Vincent Mwangi', 'vincent.mwangi.vendor@gmail.com', '$2b$10$QkW6VeY0iqhE/0r.NZwm5Oqp4W4CbCVRyPj7J7SQaxKqy.HIdIS0G', '0718204084', 'vendor', 'Ngong');
INSERT IGNORE INTO vendors (user_id, estate, is_verified, is_online, rating) VALUES ((SELECT id FROM customers WHERE email = 'vincent.mwangi.vendor@gmail.com'), 'Ngong', 1, 0, NULL);
INSERT IGNORE INTO customers (name, email, password, phone, role, estate) VALUES ('Joyce Akinyi', 'joyce.akinyi.vendor@gmail.com', '$2b$10$QkW6VeY0iqhE/0r.NZwm5Oqp4W4CbCVRyPj7J7SQaxKqy.HIdIS0G', '0718212003', 'vendor', 'Thika Road');
INSERT IGNORE INTO vendors (user_id, estate, is_verified, is_online, rating) VALUES ((SELECT id FROM customers WHERE email = 'joyce.akinyi.vendor@gmail.com'), 'Thika Road', 0, 0, NULL);
INSERT IGNORE INTO customers (name, email, password, phone, role, estate) VALUES ('Fredrick Ochieng', 'fredrick.ochieng.vendor@gmail.com', '$2b$10$QkW6VeY0iqhE/0r.NZwm5Oqp4W4CbCVRyPj7J7SQaxKqy.HIdIS0G', '0718219922', 'vendor', 'Umoja');
INSERT IGNORE INTO vendors (user_id, estate, is_verified, is_online, rating) VALUES ((SELECT id FROM customers WHERE email = 'fredrick.ochieng.vendor@gmail.com'), 'Umoja', 1, 0, NULL);
INSERT IGNORE INTO customers (name, email, password, phone, role, estate) VALUES ('Margaret Wambui', 'margaret.wambui.vendor@gmail.com', '$2b$10$QkW6VeY0iqhE/0r.NZwm5Oqp4W4CbCVRyPj7J7SQaxKqy.HIdIS0G', '0718227841', 'vendor', 'Buruburu');
INSERT IGNORE INTO vendors (user_id, estate, is_verified, is_online, rating) VALUES ((SELECT id FROM customers WHERE email = 'margaret.wambui.vendor@gmail.com'), 'Buruburu', 0, 0, NULL);
INSERT IGNORE INTO customers (name, email, password, phone, role, estate) VALUES ('Julius Kariuki', 'julius.kariuki.vendor@gmail.com', '$2b$10$QkW6VeY0iqhE/0r.NZwm5Oqp4W4CbCVRyPj7J7SQaxKqy.HIdIS0G', '0718235760', 'vendor', 'Kileleshwa');
INSERT IGNORE INTO vendors (user_id, estate, is_verified, is_online, rating) VALUES ((SELECT id FROM customers WHERE email = 'julius.kariuki.vendor@gmail.com'), 'Kileleshwa', 1, 0, NULL);
INSERT IGNORE INTO customers (name, email, password, phone, role, estate) VALUES ('Beatrice Atieno', 'beatrice.atieno.vendor@gmail.com', '$2b$10$QkW6VeY0iqhE/0r.NZwm5Oqp4W4CbCVRyPj7J7SQaxKqy.HIdIS0G', '0718243679', 'vendor', 'Embakasi');
INSERT IGNORE INTO vendors (user_id, estate, is_verified, is_online, rating) VALUES ((SELECT id FROM customers WHERE email = 'beatrice.atieno.vendor@gmail.com'), 'Embakasi', 0, 0, NULL);
INSERT IGNORE INTO customers (name, email, password, phone, role, estate) VALUES ('Dennis Njenga', 'dennis.njenga.vendor@gmail.com', '$2b$10$QkW6VeY0iqhE/0r.NZwm5Oqp4W4CbCVRyPj7J7SQaxKqy.HIdIS0G', '0718251598', 'vendor', 'Lavington');
INSERT IGNORE INTO vendors (user_id, estate, is_verified, is_online, rating) VALUES ((SELECT id FROM customers WHERE email = 'dennis.njenga.vendor@gmail.com'), 'Lavington', 1, 0, NULL);
INSERT IGNORE INTO customers (name, email, password, phone, role, estate) VALUES ('Caroline Mutheu', 'caroline.mutheu.vendor@gmail.com', '$2b$10$QkW6VeY0iqhE/0r.NZwm5Oqp4W4CbCVRyPj7J7SQaxKqy.HIdIS0G', '0718259517', 'vendor', 'Kawangware');
INSERT IGNORE INTO vendors (user_id, estate, is_verified, is_online, rating) VALUES ((SELECT id FROM customers WHERE email = 'caroline.mutheu.vendor@gmail.com'), 'Kawangware', 0, 0, NULL);
INSERT IGNORE INTO customers (name, email, password, phone, role, estate) VALUES ('Stephen Maina', 'stephen.maina.vendor@gmail.com', '$2b$10$QkW6VeY0iqhE/0r.NZwm5Oqp4W4CbCVRyPj7J7SQaxKqy.HIdIS0G', '0718267436', 'vendor', 'Dagoretti');
INSERT IGNORE INTO vendors (user_id, estate, is_verified, is_online, rating) VALUES ((SELECT id FROM customers WHERE email = 'stephen.maina.vendor@gmail.com'), 'Dagoretti', 1, 0, NULL);
INSERT IGNORE INTO customers (name, email, password, phone, role, estate) VALUES ('Emily Chebet', 'emily.chebet.vendor@gmail.com', '$2b$10$QkW6VeY0iqhE/0r.NZwm5Oqp4W4CbCVRyPj7J7SQaxKqy.HIdIS0G', '0718275355', 'vendor', 'Rongai');
INSERT IGNORE INTO vendors (user_id, estate, is_verified, is_online, rating) VALUES ((SELECT id FROM customers WHERE email = 'emily.chebet.vendor@gmail.com'), 'Rongai', 0, 0, NULL);
INSERT IGNORE INTO customers (name, email, password, phone, role, estate) VALUES ('Moses Omollo', 'moses.omollo.vendor@gmail.com', '$2b$10$QkW6VeY0iqhE/0r.NZwm5Oqp4W4CbCVRyPj7J7SQaxKqy.HIdIS0G', '0718283274', 'vendor', 'Syokimau');
INSERT IGNORE INTO vendors (user_id, estate, is_verified, is_online, rating) VALUES ((SELECT id FROM customers WHERE email = 'moses.omollo.vendor@gmail.com'), 'Syokimau', 1, 0, NULL);
INSERT IGNORE INTO customers (name, email, password, phone, role, estate) VALUES ('Jane Wanja', 'jane.wanja.vendor@gmail.com', '$2b$10$QkW6VeY0iqhE/0r.NZwm5Oqp4W4CbCVRyPj7J7SQaxKqy.HIdIS0G', '0718291193', 'vendor', 'Kitengela');
INSERT IGNORE INTO vendors (user_id, estate, is_verified, is_online, rating) VALUES ((SELECT id FROM customers WHERE email = 'jane.wanja.vendor@gmail.com'), 'Kitengela', 0, 0, NULL);
INSERT IGNORE INTO customers (name, email, password, phone, role, estate) VALUES ('Charles Njoroge', 'charles.njoroge.vendor@gmail.com', '$2b$10$QkW6VeY0iqhE/0r.NZwm5Oqp4W4CbCVRyPj7J7SQaxKqy.HIdIS0G', '0718299112', 'vendor', 'Tena');
INSERT IGNORE INTO vendors (user_id, estate, is_verified, is_online, rating) VALUES ((SELECT id FROM customers WHERE email = 'charles.njoroge.vendor@gmail.com'), 'Tena', 1, 0, NULL);
INSERT IGNORE INTO customers (name, email, password, phone, role, estate) VALUES ('Pamela Awino', 'pamela.awino.vendor@gmail.com', '$2b$10$QkW6VeY0iqhE/0r.NZwm5Oqp4W4CbCVRyPj7J7SQaxKqy.HIdIS0G', '0718307031', 'vendor', 'Githurai');
INSERT IGNORE INTO vendors (user_id, estate, is_verified, is_online, rating) VALUES ((SELECT id FROM customers WHERE email = 'pamela.awino.vendor@gmail.com'), 'Githurai', 0, 0, NULL);
-- Orders generated from Orders.json
-- customer_id is looked up by email, so run this after customers.sql.
-- 'Yet to be confirmed' has no equivalent in orders.js and is mapped to 'pending'.

INSERT IGNORE INTO orders (customer_id, vendor_id, estate, volume, delivery_time, total_amount, payment_method, status, created_at) VALUES ((SELECT id FROM customers WHERE email = 'grace.muthoni.customer@gmail.com'), NULL, 'Kasarani', 60, 'Morning (6am - 12pm)', 30.00, 'mpesa', 'delivered', DATE_SUB(NOW(), INTERVAL 24 HOUR));
INSERT IGNORE INTO orders (customer_id, vendor_id, estate, volume, delivery_time, total_amount, payment_method, status, created_at) VALUES ((SELECT id FROM customers WHERE email = 'james.ochieng.customer@gmail.com'), NULL, 'Lang\'ata', 120, 'Afternoon (12pm - 6pm)', 60.00, 'cash', 'on the way', DATE_SUB(NOW(), INTERVAL 30 HOUR));
INSERT IGNORE INTO orders (customer_id, vendor_id, estate, volume, delivery_time, total_amount, payment_method, status, created_at) VALUES ((SELECT id FROM customers WHERE email = 'mary.wanjiru.customer@gmail.com'), NULL, 'Ruiru', 400, 'Evening (6pm - 12am)', 200.00, 'mpesa', 'delivered', DATE_SUB(NOW(), INTERVAL 36 HOUR));
INSERT IGNORE INTO orders (customer_id, vendor_id, estate, volume, delivery_time, total_amount, payment_method, status, created_at) VALUES ((SELECT id FROM customers WHERE email = 'peter.kimani.customer@gmail.com'), NULL, 'South C', 200, 'Morning (6am - 12pm)', 100.00, 'cash', 'pending', DATE_SUB(NOW(), INTERVAL 4 HOUR));
INSERT IGNORE INTO orders (customer_id, vendor_id, estate, volume, delivery_time, total_amount, payment_method, status, created_at) VALUES ((SELECT id FROM customers WHERE email = 'sarah.akinyi.customer@gmail.com'), NULL, 'Westlands', 80, 'Afternoon (12pm - 6pm)', 40.00, 'mpesa', 'pending', DATE_SUB(NOW(), INTERVAL 5 HOUR));
INSERT IGNORE INTO orders (customer_id, vendor_id, estate, volume, delivery_time, total_amount, payment_method, status, created_at) VALUES ((SELECT id FROM customers WHERE email = 'david.odhiambo.customer@gmail.com'), NULL, 'Karen', 150, 'Evening (6pm - 12am)', 75.00, 'cash', 'on the way', DATE_SUB(NOW(), INTERVAL 54 HOUR));
INSERT IGNORE INTO orders (customer_id, vendor_id, estate, volume, delivery_time, total_amount, payment_method, status, created_at) VALUES ((SELECT id FROM customers WHERE email = 'lucy.wambui.customer@gmail.com'), NULL, 'Kilimani', 300, 'Morning (6am - 12pm)', 150.00, 'mpesa', 'delivered', DATE_SUB(NOW(), INTERVAL 60 HOUR));
INSERT IGNORE INTO orders (customer_id, vendor_id, estate, volume, delivery_time, total_amount, payment_method, status, created_at) VALUES ((SELECT id FROM customers WHERE email = 'michael.kiprop.customer@gmail.com'), NULL, 'Eastleigh', 100, 'Afternoon (12pm - 6pm)', 50.00, 'cash', 'pending', DATE_SUB(NOW(), INTERVAL 8 HOUR));
INSERT IGNORE INTO orders (customer_id, vendor_id, estate, volume, delivery_time, total_amount, payment_method, status, created_at) VALUES ((SELECT id FROM customers WHERE email = 'faith.chelangat.customer@gmail.com'), NULL, 'Ngong', 250, 'Evening (6pm - 12am)', 125.00, 'mpesa', 'pending', DATE_SUB(NOW(), INTERVAL 9 HOUR));
INSERT IGNORE INTO orders (customer_id, vendor_id, estate, volume, delivery_time, total_amount, payment_method, status, created_at) VALUES ((SELECT id FROM customers WHERE email = 'samuel.mwangi.customer@gmail.com'), NULL, 'Thika Road', 180, 'Morning (6am - 12pm)', 90.00, 'cash', 'on the way', DATE_SUB(NOW(), INTERVAL 78 HOUR));
INSERT IGNORE INTO orders (customer_id, vendor_id, estate, volume, delivery_time, total_amount, payment_method, status, created_at) VALUES ((SELECT id FROM customers WHERE email = 'jane.atieno.customer@gmail.com'), NULL, 'Umoja', 90, 'Afternoon (12pm - 6pm)', 45.00, 'mpesa', 'delivered', DATE_SUB(NOW(), INTERVAL 84 HOUR));
INSERT IGNORE INTO orders (customer_id, vendor_id, estate, volume, delivery_time, total_amount, payment_method, status, created_at) VALUES ((SELECT id FROM customers WHERE email = 'robert.omondi.customer@gmail.com'), NULL, 'Buruburu', 350, 'Evening (6pm - 12am)', 175.00, 'cash', 'pending', DATE_SUB(NOW(), INTERVAL 12 HOUR));
INSERT IGNORE INTO orders (customer_id, vendor_id, estate, volume, delivery_time, total_amount, payment_method, status, created_at) VALUES ((SELECT id FROM customers WHERE email = 'esther.njoroge.customer@gmail.com'), NULL, 'Kileleshwa', 70, 'Morning (6am - 12pm)', 35.00, 'mpesa', 'on the way', DATE_SUB(NOW(), INTERVAL 96 HOUR));
INSERT IGNORE INTO orders (customer_id, vendor_id, estate, volume, delivery_time, total_amount, payment_method, status, created_at) VALUES ((SELECT id FROM customers WHERE email = 'john.kamau.customer@gmail.com'), NULL, 'Embakasi', 220, 'Afternoon (12pm - 6pm)', 110.00, 'cash', 'delivered', DATE_SUB(NOW(), INTERVAL 102 HOUR));
INSERT IGNORE INTO orders (customer_id, vendor_id, estate, volume, delivery_time, total_amount, payment_method, status, created_at) VALUES ((SELECT id FROM customers WHERE email = 'catherine.wanjiku.customer@gmail.com'), NULL, 'Lavington', 160, 'Evening (6pm - 12am)', 80.00, 'mpesa', 'pending', DATE_SUB(NOW(), INTERVAL 3 HOUR));
INSERT IGNORE INTO orders (customer_id, vendor_id, estate, volume, delivery_time, total_amount, payment_method, status, created_at) VALUES ((SELECT id FROM customers WHERE email = 'daniel.mutua.customer@gmail.com'), NULL, 'Kawangware', 130, 'Morning (6am - 12pm)', 65.00, 'cash', 'pending', DATE_SUB(NOW(), INTERVAL 4 HOUR));
INSERT IGNORE INTO orders (customer_id, vendor_id, estate, volume, delivery_time, total_amount, payment_method, status, created_at) VALUES ((SELECT id FROM customers WHERE email = 'florence.adhiambo.customer@gmail.com'), NULL, 'Dagoretti', 280, 'Afternoon (12pm - 6pm)', 140.00, 'mpesa', 'on the way', DATE_SUB(NOW(), INTERVAL 120 HOUR));
INSERT IGNORE INTO orders (customer_id, vendor_id, estate, volume, delivery_time, total_amount, payment_method, status, created_at) VALUES ((SELECT id FROM customers WHERE email = 'george.otieno.customer@gmail.com'), NULL, 'Rongai', 190, 'Evening (6pm - 12am)', 95.00, 'cash', 'delivered', DATE_SUB(NOW(), INTERVAL 126 HOUR));
INSERT IGNORE INTO orders (customer_id, vendor_id, estate, volume, delivery_time, total_amount, payment_method, status, created_at) VALUES ((SELECT id FROM customers WHERE email = 'alice.muthoni.customer@gmail.com'), NULL, 'Syokimau', 110, 'Morning (6am - 12pm)', 55.00, 'mpesa', 'pending', DATE_SUB(NOW(), INTERVAL 7 HOUR));
INSERT IGNORE INTO orders (customer_id, vendor_id, estate, volume, delivery_time, total_amount, payment_method, status, created_at) VALUES ((SELECT id FROM customers WHERE email = 'thomas.kibet.customer@gmail.com'), NULL, 'Kitengela', 320, 'Afternoon (12pm - 6pm)', 160.00, 'cash', 'pending', DATE_SUB(NOW(), INTERVAL 8 HOUR));
INSERT IGNORE INTO orders (customer_id, vendor_id, estate, volume, delivery_time, total_amount, payment_method, status, created_at) VALUES ((SELECT id FROM customers WHERE email = 'susan.achieng.customer@gmail.com'), NULL, 'Tena', 75, 'Evening (6pm - 12am)', 37.50, 'mpesa', 'delivered', DATE_SUB(NOW(), INTERVAL 144 HOUR));
INSERT IGNORE INTO orders (customer_id, vendor_id, estate, volume, delivery_time, total_amount, payment_method, status, created_at) VALUES ((SELECT id FROM customers WHERE email = 'brian.mwenda.customer@gmail.com'), NULL, 'Githurai', 450, 'Morning (6am - 12pm)', 225.00, 'cash', 'on the way', DATE_SUB(NOW(), INTERVAL 150 HOUR));
INSERT IGNORE INTO orders (customer_id, vendor_id, estate, volume, delivery_time, total_amount, payment_method, status, created_at) VALUES ((SELECT id FROM customers WHERE email = 'rose.kemunto.customer@gmail.com'), NULL, 'Kangemi', 140, 'Afternoon (12pm - 6pm)', 70.00, 'mpesa', 'pending', DATE_SUB(NOW(), INTERVAL 11 HOUR));
INSERT IGNORE INTO orders (customer_id, vendor_id, estate, volume, delivery_time, total_amount, payment_method, status, created_at) VALUES ((SELECT id FROM customers WHERE email = 'patrick.njuguna.customer@gmail.com'), NULL, 'Muthaiga', 380, 'Evening (6pm - 12am)', 190.00, 'cash', 'delivered', DATE_SUB(NOW(), INTERVAL 162 HOUR));
INSERT IGNORE INTO orders (customer_id, vendor_id, estate, volume, delivery_time, total_amount, payment_method, status, created_at) VALUES ((SELECT id FROM customers WHERE email = 'dorothy.wairimu.customer@gmail.com'), NULL, 'Parklands', 85, 'Morning (6am - 12pm)', 42.50, 'mpesa', 'pending', DATE_SUB(NOW(), INTERVAL 1 HOUR));
INSERT IGNORE INTO orders (customer_id, vendor_id, estate, volume, delivery_time, total_amount, payment_method, status, created_at) VALUES ((SELECT id FROM customers WHERE email = 'eliud.kipchoge.customer@gmail.com'), NULL, 'Eldoret (Nairobi Area)', 500, 'Afternoon (12pm - 6pm)', 250.00, 'cash', 'on the way', DATE_SUB(NOW(), INTERVAL 174 HOUR));
INSERT IGNORE INTO orders (customer_id, vendor_id, estate, volume, delivery_time, total_amount, payment_method, status, created_at) VALUES ((SELECT id FROM customers WHERE email = 'mildred.adhiambo.customer@gmail.com'), NULL, 'Imara Daima', 95, 'Evening (6pm - 12am)', 47.50, 'mpesa', 'delivered', DATE_SUB(NOW(), INTERVAL 180 HOUR));
INSERT IGNORE INTO orders (customer_id, vendor_id, estate, volume, delivery_time, total_amount, payment_method, status, created_at) VALUES ((SELECT id FROM customers WHERE email = 'joseph.kuria.customer@gmail.com'), NULL, 'Ruiru', 270, 'Morning (6am - 12pm)', 135.00, 'cash', 'pending', DATE_SUB(NOW(), INTERVAL 4 HOUR));
INSERT IGNORE INTO orders (customer_id, vendor_id, estate, volume, delivery_time, total_amount, payment_method, status, created_at) VALUES ((SELECT id FROM customers WHERE email = 'mercy.jepkosgei.customer@gmail.com'), NULL, 'Kasarani', 310, 'Afternoon (12pm - 6pm)', 155.00, 'mpesa', 'pending', DATE_SUB(NOW(), INTERVAL 5 HOUR));
INSERT IGNORE INTO orders (customer_id, vendor_id, estate, volume, delivery_time, total_amount, payment_method, status, created_at) VALUES ((SELECT id FROM customers WHERE email = 'kennedy.oduor.customer@gmail.com'), NULL, 'South B', 205, 'Evening (6pm - 12am)', 102.50, 'cash', 'on the way', DATE_SUB(NOW(), INTERVAL 198 HOUR));
INSERT IGNORE INTO orders (customer_id, vendor_id, estate, volume, delivery_time, total_amount, payment_method, status, created_at) VALUES ((SELECT id FROM customers WHERE email = 'ann.wanjiru.customer@gmail.com'), NULL, 'Karen', 115, 'Morning (6am - 12pm)', 57.50, 'mpesa', 'delivered', DATE_SUB(NOW(), INTERVAL 204 HOUR));
INSERT IGNORE INTO orders (customer_id, vendor_id, estate, volume, delivery_time, total_amount, payment_method, status, created_at) VALUES ((SELECT id FROM customers WHERE email = 'simon.ndirangu.customer@gmail.com'), NULL, 'Lang\'ata', 425, 'Afternoon (12pm - 6pm)', 212.50, 'cash', 'pending', DATE_SUB(NOW(), INTERVAL 8 HOUR));
INSERT IGNORE INTO orders (customer_id, vendor_id, estate, volume, delivery_time, total_amount, payment_method, status, created_at) VALUES ((SELECT id FROM customers WHERE email = 'phyllis.okoth.customer@gmail.com'), NULL, 'Westlands', 165, 'Evening (6pm - 12am)', 82.50, 'mpesa', 'pending', DATE_SUB(NOW(), INTERVAL 9 HOUR));
INSERT IGNORE INTO orders (customer_id, vendor_id, estate, volume, delivery_time, total_amount, payment_method, status, created_at) VALUES ((SELECT id FROM customers WHERE email = 'timothy.mbuvi.customer@gmail.com'), NULL, 'Kilimani', 235, 'Morning (6am - 12pm)', 117.50, 'cash', 'delivered', DATE_SUB(NOW(), INTERVAL 222 HOUR));
INSERT IGNORE INTO orders (customer_id, vendor_id, estate, volume, delivery_time, total_amount, payment_method, status, created_at) VALUES ((SELECT id FROM customers WHERE email = 'ruth.nyambura.customer@gmail.com'), NULL, 'Eastleigh', 195, 'Afternoon (12pm - 6pm)', 97.50, 'mpesa', 'on the way', DATE_SUB(NOW(), INTERVAL 228 HOUR));
INSERT IGNORE INTO orders (customer_id, vendor_id, estate, volume, delivery_time, total_amount, payment_method, status, created_at) VALUES ((SELECT id FROM customers WHERE email = 'vincent.mwangi.customer@gmail.com'), NULL, 'Ngong', 285, 'Evening (6pm - 12am)', 142.50, 'cash', 'pending', DATE_SUB(NOW(), INTERVAL 12 HOUR));
INSERT IGNORE INTO orders (customer_id, vendor_id, estate, volume, delivery_time, total_amount, payment_method, status, created_at) VALUES ((SELECT id FROM customers WHERE email = 'joyce.akinyi.customer@gmail.com'), NULL, 'Thika Road', 155, 'Morning (6am - 12pm)', 77.50, 'mpesa', 'pending', DATE_SUB(NOW(), INTERVAL 1 HOUR));
INSERT IGNORE INTO orders (customer_id, vendor_id, estate, volume, delivery_time, total_amount, payment_method, status, created_at) VALUES ((SELECT id FROM customers WHERE email = 'fredrick.ochieng.customer@gmail.com'), NULL, 'Umoja', 340, 'Afternoon (12pm - 6pm)', 170.00, 'cash', 'delivered', DATE_SUB(NOW(), INTERVAL 246 HOUR));
INSERT IGNORE INTO orders (customer_id, vendor_id, estate, volume, delivery_time, total_amount, payment_method, status, created_at) VALUES ((SELECT id FROM customers WHERE email = 'margaret.wambui.customer@gmail.com'), NULL, 'Buruburu', 260, 'Evening (6pm - 12am)', 130.00, 'mpesa', 'on the way', DATE_SUB(NOW(), INTERVAL 252 HOUR));
INSERT IGNORE INTO orders (customer_id, vendor_id, estate, volume, delivery_time, total_amount, payment_method, status, created_at) VALUES ((SELECT id FROM customers WHERE email = 'julius.kariuki.customer@gmail.com'), NULL, 'Kileleshwa', 210, 'Morning (6am - 12pm)', 105.00, 'cash', 'pending', DATE_SUB(NOW(), INTERVAL 4 HOUR));
INSERT IGNORE INTO orders (customer_id, vendor_id, estate, volume, delivery_time, total_amount, payment_method, status, created_at) VALUES ((SELECT id FROM customers WHERE email = 'beatrice.atieno.customer@gmail.com'), NULL, 'Embakasi', 175, 'Afternoon (12pm - 6pm)', 87.50, 'mpesa', 'pending', DATE_SUB(NOW(), INTERVAL 5 HOUR));
INSERT IGNORE INTO orders (customer_id, vendor_id, estate, volume, delivery_time, total_amount, payment_method, status, created_at) VALUES ((SELECT id FROM customers WHERE email = 'dennis.njenga.customer@gmail.com'), NULL, 'Lavington', 225, 'Evening (6pm - 12am)', 112.50, 'cash', 'delivered', DATE_SUB(NOW(), INTERVAL 270 HOUR));
INSERT IGNORE INTO orders (customer_id, vendor_id, estate, volume, delivery_time, total_amount, payment_method, status, created_at) VALUES ((SELECT id FROM customers WHERE email = 'caroline.mutheu.customer@gmail.com'), NULL, 'Kawangware', 325, 'Morning (6am - 12pm)', 162.50, 'mpesa', 'on the way', DATE_SUB(NOW(), INTERVAL 276 HOUR));
INSERT IGNORE INTO orders (customer_id, vendor_id, estate, volume, delivery_time, total_amount, payment_method, status, created_at) VALUES ((SELECT id FROM customers WHERE email = 'stephen.maina.customer@gmail.com'), NULL, 'Dagoretti', 135, 'Afternoon (12pm - 6pm)', 67.50, 'cash', 'pending', DATE_SUB(NOW(), INTERVAL 8 HOUR));
INSERT IGNORE INTO orders (customer_id, vendor_id, estate, volume, delivery_time, total_amount, payment_method, status, created_at) VALUES ((SELECT id FROM customers WHERE email = 'emily.chebet.customer@gmail.com'), NULL, 'Rongai', 375, 'Evening (6pm - 12am)', 187.50, 'mpesa', 'delivered', DATE_SUB(NOW(), INTERVAL 288 HOUR));
INSERT IGNORE INTO orders (customer_id, vendor_id, estate, volume, delivery_time, total_amount, payment_method, status, created_at) VALUES ((SELECT id FROM customers WHERE email = 'moses.omollo.customer@gmail.com'), NULL, 'Syokimau', 245, 'Morning (6am - 12pm)', 122.50, 'cash', 'pending', DATE_SUB(NOW(), INTERVAL 10 HOUR));
INSERT IGNORE INTO orders (customer_id, vendor_id, estate, volume, delivery_time, total_amount, payment_method, status, created_at) VALUES ((SELECT id FROM customers WHERE email = 'jane.wanja.customer@gmail.com'), NULL, 'Kitengela', 185, 'Afternoon (12pm - 6pm)', 92.50, 'mpesa', 'on the way', DATE_SUB(NOW(), INTERVAL 300 HOUR));
INSERT IGNORE INTO orders (customer_id, vendor_id, estate, volume, delivery_time, total_amount, payment_method, status, created_at) VALUES ((SELECT id FROM customers WHERE email = 'charles.njoroge.customer@gmail.com'), NULL, 'Tena', 295, 'Evening (6pm - 12am)', 147.50, 'cash', 'pending', DATE_SUB(NOW(), INTERVAL 12 HOUR));
INSERT IGNORE INTO orders (customer_id, vendor_id, estate, volume, delivery_time, total_amount, payment_method, status, created_at) VALUES ((SELECT id FROM customers WHERE email = 'pamela.awino.customer@gmail.com'), NULL, 'Githurai', 125, 'Morning (6am - 12pm)', 62.50, 'mpesa', 'delivered', DATE_SUB(NOW(), INTERVAL 312 HOUR));
INSERT IGNORE INTO orders (customer_id, vendor_id, estate, volume, delivery_time, total_amount, payment_method, status, created_at) VALUES ((SELECT id FROM customers WHERE email = 'george.kamotho.customer@gmail.com'), NULL, 'Kangemi', 365, 'Afternoon (12pm - 6pm)', 182.50, 'cash', 'pending', DATE_SUB(NOW(), INTERVAL 2 HOUR));
-- Business names (MySQL-safe version of business_name.sql)
ALTER TABLE vendors ADD COLUMN business_name VARCHAR(150) NULL AFTER estate;
UPDATE vendors SET business_name = 'Chemchemi Fresh Water Co.' WHERE user_id = (SELECT id FROM customers WHERE email = 'derrick.otieno.vendor@gmail.com');
UPDATE vendors SET business_name = 'Maji Safi Enterprises' WHERE user_id = (SELECT id FROM customers WHERE email = 'christine.pauline.vendor@gmail.com');
UPDATE vendors SET business_name = 'AquaLink Kenya' WHERE user_id = (SELECT id FROM customers WHERE email = 'james.mwangi.vendor@gmail.com');
UPDATE vendors SET business_name = 'Springville Water Suppliers' WHERE user_id = (SELECT id FROM customers WHERE email = 'sarah.akinyi.vendor@gmail.com');
UPDATE vendors SET business_name = 'Kisima Cha Uzima Ventures' WHERE user_id = (SELECT id FROM customers WHERE email = 'peter.kimani.vendor@gmail.com');
UPDATE vendors SET business_name = 'Bluewave Water Solutions' WHERE user_id = (SELECT id FROM customers WHERE email = 'grace.wanjiru.vendor@gmail.com');
UPDATE vendors SET business_name = 'Mvua Fresh Springs' WHERE user_id = (SELECT id FROM customers WHERE email = 'david.odhiambo.vendor@gmail.com');
UPDATE vendors SET business_name = 'Nairobi AquaPure' WHERE user_id = (SELECT id FROM customers WHERE email = 'mary.wambui.vendor@gmail.com');
UPDATE vendors SET business_name = 'Ziwa Kuu Water Co.' WHERE user_id = (SELECT id FROM customers WHERE email = 'michael.kiprop.vendor@gmail.com');
UPDATE vendors SET business_name = 'Maji Tamu Suppliers' WHERE user_id = (SELECT id FROM customers WHERE email = 'faith.chelangat.vendor@gmail.com');
UPDATE vendors SET business_name = 'CrystalFlow Water Enterprises' WHERE user_id = (SELECT id FROM customers WHERE email = 'samuel.mwangi.vendor@gmail.com');
UPDATE vendors SET business_name = 'Bwawa Springs Ltd' WHERE user_id = (SELECT id FROM customers WHERE email = 'jane.atieno.vendor@gmail.com');
UPDATE vendors SET business_name = 'Upesi Water Delivery' WHERE user_id = (SELECT id FROM customers WHERE email = 'robert.omondi.vendor@gmail.com');
UPDATE vendors SET business_name = 'Safi Maji Ventures' WHERE user_id = (SELECT id FROM customers WHERE email = 'esther.njoroge.vendor@gmail.com');
UPDATE vendors SET business_name = 'Highland Springs Kenya' WHERE user_id = (SELECT id FROM customers WHERE email = 'john.kamau.vendor@gmail.com');
UPDATE vendors SET business_name = 'Chemchemi Bora Suppliers' WHERE user_id = (SELECT id FROM customers WHERE email = 'catherine.wanjiku.vendor@gmail.com');
UPDATE vendors SET business_name = 'AquaFresh Nairobi' WHERE user_id = (SELECT id FROM customers WHERE email = 'daniel.mutua.vendor@gmail.com');
UPDATE vendors SET business_name = 'Mto Mkubwa Water Co.' WHERE user_id = (SELECT id FROM customers WHERE email = 'florence.adhiambo.vendor@gmail.com');
UPDATE vendors SET business_name = 'PureFlow Enterprises' WHERE user_id = (SELECT id FROM customers WHERE email = 'george.otieno.vendor@gmail.com');
UPDATE vendors SET business_name = 'Kisima Springs Ltd' WHERE user_id = (SELECT id FROM customers WHERE email = 'alice.muthoni.vendor@gmail.com');
UPDATE vendors SET business_name = 'Rafiki Maji Suppliers' WHERE user_id = (SELECT id FROM customers WHERE email = 'thomas.kibet.vendor@gmail.com');
UPDATE vendors SET business_name = 'Nyota Water Ventures' WHERE user_id = (SELECT id FROM customers WHERE email = 'susan.achieng.vendor@gmail.com');
UPDATE vendors SET business_name = 'Jua Kali Water Solutions' WHERE user_id = (SELECT id FROM customers WHERE email = 'brian.mwenda.vendor@gmail.com');
UPDATE vendors SET business_name = 'Chemchemi Ya Uzima' WHERE user_id = (SELECT id FROM customers WHERE email = 'rose.kemunto.vendor@gmail.com');
UPDATE vendors SET business_name = 'Baraka Springs Co.' WHERE user_id = (SELECT id FROM customers WHERE email = 'patrick.njuguna.vendor@gmail.com');
UPDATE vendors SET business_name = 'AquaTrust Kenya' WHERE user_id = (SELECT id FROM customers WHERE email = 'dorothy.wairimu.vendor@gmail.com');
UPDATE vendors SET business_name = 'Fadhili Water Enterprises' WHERE user_id = (SELECT id FROM customers WHERE email = 'eliud.kipchoge.vendor@gmail.com');
UPDATE vendors SET business_name = 'Maji Poa Suppliers' WHERE user_id = (SELECT id FROM customers WHERE email = 'mildred.adhiambo.vendor@gmail.com');
UPDATE vendors SET business_name = 'Uzima Springs Ltd' WHERE user_id = (SELECT id FROM customers WHERE email = 'joseph.kuria.vendor@gmail.com');
UPDATE vendors SET business_name = 'Waridi Water Co.' WHERE user_id = (SELECT id FROM customers WHERE email = 'mercy.jepkosgei.vendor@gmail.com');
UPDATE vendors SET business_name = 'Zawadi Fresh Water' WHERE user_id = (SELECT id FROM customers WHERE email = 'kennedy.oduor.vendor@gmail.com');
UPDATE vendors SET business_name = 'Neema Aqua Ventures' WHERE user_id = (SELECT id FROM customers WHERE email = 'ann.wanjiru.vendor@gmail.com');
UPDATE vendors SET business_name = 'Mashariki Water Suppliers' WHERE user_id = (SELECT id FROM customers WHERE email = 'simon.ndirangu.vendor@gmail.com');
UPDATE vendors SET business_name = 'Stawi Springs Co.' WHERE user_id = (SELECT id FROM customers WHERE email = 'phyllis.okoth.vendor@gmail.com');
UPDATE vendors SET business_name = 'Amani Maji Enterprises' WHERE user_id = (SELECT id FROM customers WHERE email = 'timothy.mbuvi.vendor@gmail.com');
UPDATE vendors SET business_name = 'Furaha Water Solutions' WHERE user_id = (SELECT id FROM customers WHERE email = 'ruth.nyambura.vendor@gmail.com');
UPDATE vendors SET business_name = 'Tumaini Springs Ltd' WHERE user_id = (SELECT id FROM customers WHERE email = 'vincent.mwangi.vendor@gmail.com');
UPDATE vendors SET business_name = 'Nuru Aqua Co.' WHERE user_id = (SELECT id FROM customers WHERE email = 'joyce.akinyi.vendor@gmail.com');
UPDATE vendors SET business_name = 'Faraja Water Suppliers' WHERE user_id = (SELECT id FROM customers WHERE email = 'fredrick.ochieng.vendor@gmail.com');
UPDATE vendors SET business_name = 'Imani Springs Ventures' WHERE user_id = (SELECT id FROM customers WHERE email = 'margaret.wambui.vendor@gmail.com');
UPDATE vendors SET business_name = 'Baridi Maji Co.' WHERE user_id = (SELECT id FROM customers WHERE email = 'julius.kariuki.vendor@gmail.com');
UPDATE vendors SET business_name = 'Heshima Water Enterprises' WHERE user_id = (SELECT id FROM customers WHERE email = 'beatrice.atieno.vendor@gmail.com');
UPDATE vendors SET business_name = 'Karibu Springs Kenya' WHERE user_id = (SELECT id FROM customers WHERE email = 'dennis.njenga.vendor@gmail.com');
UPDATE vendors SET business_name = 'Thamani Aqua Suppliers' WHERE user_id = (SELECT id FROM customers WHERE email = 'caroline.mutheu.vendor@gmail.com');
UPDATE vendors SET business_name = 'Ustawi Water Co.' WHERE user_id = (SELECT id FROM customers WHERE email = 'stephen.maina.vendor@gmail.com');
UPDATE vendors SET business_name = 'Salama Springs Ltd' WHERE user_id = (SELECT id FROM customers WHERE email = 'emily.chebet.vendor@gmail.com');
UPDATE vendors SET business_name = 'Ngazi Water Ventures' WHERE user_id = (SELECT id FROM customers WHERE email = 'moses.omollo.vendor@gmail.com');
UPDATE vendors SET business_name = 'Msingi Aqua Enterprises' WHERE user_id = (SELECT id FROM customers WHERE email = 'jane.wanja.vendor@gmail.com');
UPDATE vendors SET business_name = 'Ushindi Springs Co.' WHERE user_id = (SELECT id FROM customers WHERE email = 'charles.njoroge.vendor@gmail.com');
UPDATE vendors SET business_name = 'Tija Water Suppliers' WHERE user_id = (SELECT id FROM customers WHERE email = 'pamela.awino.vendor@gmail.com');

UPDATE vendors
SET rating = ROUND(3 + MOD(id * 7, 21) / 10, 1)
WHERE is_verified = 1;

-- Check: expect 100, 50, 50, 25
SELECT (SELECT COUNT(*) FROM customers) AS customers, (SELECT COUNT(*) FROM vendors) AS vendors, (SELECT COUNT(*) FROM orders) AS orders, (SELECT COUNT(rating) FROM vendors) AS rated_vendors;