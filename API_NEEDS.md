## API Needs
### Upstream Interview
____
*What resources or data does your app manage and use?*
- Pharmacy location - (address, coordinates, operating hours, contact info)

*What we do with it*
- Read only for external partners like searching for medicines by name and see which pharmacies them in stock have, get pharmacy details, filter by geographic radius

*Is there anything sensitive or restricted we shouldn't expect access to?*
- User Data
- Location
- Pharmacy revenue data and payment processing
- Chatbot logs are internal only

*How up to date is the data likely to be when we fetch it?*
- Inventory is updated in near-real time:- update their stock via their app and changes are reflected in 5 minutes


### Downstream Interview
____ 
*What data or actions from Maji would be useful to you?*

- Customer Location
- Vendor station and Primary Target estate
- Order Information to HR

*Would you ever need to create or change data in our system, or only read it?*
- Only Read 

*How often would you need this - once per page load? Real-time?*
- Once per user session  

*Is there anything about our app you assumed you could access, that isn't there?*
- None since the requirements are specific
___

#### API Needs Statement  
**1.** SkillBridge needs to read a list of Maji customer estates with active delivery schedules, to recommend local skill-exchange sessions to users in the same neighborhoods.

**2.** SkillBridge needs to read each water vendor's station name and primary target estate, to suggest those vendor locations as physical meetup venues for skill sessions.

**3.** SkillBridge needs to read Maji customers' M-Pesa payment history (payment method only, not amount)

**4.** SkillBridge needs to read delivery time windows (e.g., morning/afternoon) per estate, to schedule skill session reminders during waiting periods when customers are likely free.

#### Reflection

They saw our delivery schedules and estate locations as 'triggers' for their own user engagement. I expected them to want customer contact info, but they specifically said they only need estate-level aggregation to avoid privacy concerns. Also, I assumed they'd want real-time GPS tracking of delivery trucks, but they said estate names time windows were sufficient because they just need to know 'when and where people are gathered'—not exact coordinates.

