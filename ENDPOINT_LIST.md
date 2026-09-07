# TEAM 4 API ENDPOINTS LIST

| Method | Path | Purpose | Maps to need |
| :--- | :--- | :--- | :--- |
| **GET** | `/estates` | Returns a list of customer estates | SkillBridge needs to read a list of Maji customer estates with active delivery schedules, to recommend local skill-exchange sessions to users in the same neighbourhoods. |
| **GET** | `/vendors/stations` | Return water vendor station names and target estates | SkillBridge needs to read each water vendor's station name and primary target estate, to suggest those vendor locations as physical meetup venues for skill sessions. |
| **GET** | `/customers/payment-method` | Returns a list of the customers' payment method | SkillBridge needs to read Maji customers' M-Pesa payment history (payment method only, not amount). |
| **DELETE** | `/customers/{id}` | Deletes a customer's record | SkillBridge may need to delete a customer's record when he/she has been inactive for too long. |
| **GET** | `/vendors/delivery-times` | Returns a list of the vendor's delivery times. | SkillBridge needs to read delivery time windows (e.g., morning/afternoon) per estate, to schedule skill session reminders during waiting periods when customers are likely free. |
| **POST** | `/estates/{estateId}/driver-interests` | Create a record when user wants to be connected to delivery work at the estate | SkillBridge needs to add records of drivers interested in delivery work in various estates. |

---

## Feedback & Comments from Group 2

* **Row 3 — `GET /customers/paymentmethod`**
  * Pluralization is inconsistent; `paymentmethod` is singular while `customers` is plural.
  * The path segment is a run-together compound word, making it hard to read.
* **Row 4 — `DELETE /customer/{id}`**
  * `customer` is singular here, while every other endpoint in the file uses plural resource names.
* **Row 5 — `GET /vendors/deliverytime`**
  * `deliverytime` is singular, inconsistent with pluralization used elsewhere.
  * The path segment is a run-together compound word, making it hard to read.
