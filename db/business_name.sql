--Adding the business_name column
ALTER TABLE vendors ADD COLUMN IF NOT EXISTS business_name VARCHAR(150) NULL AFTER estate;
--The following file contains the business_name for the various vendors.
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
--Then run :
SELECT c.name, v.business_name FROM vendors v
JOIN customers c ON v.user_id = c.id
ORDER BY v.id LIMIT 10;
--The command above will show the linking of the vendor's name to their respective bussiness name.

