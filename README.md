## Curious Connect Backoffice

Main dependencies:

- Argon dashboard
- Rsuite
- Reactstrap
- Google API
- Airtable API
- (to do) Debouncer api


Main architecture:
1) Front: React
2) Back: Express.js + Airtable (CRM & bulk email sender) + MongoDB (login & permissions system)

Main Features:
- Check Airtable data
- (to do) modify airtable data
- Send email: Send emails trough google API
- Bulk send email: Send multiple emails at once 
- Reciew candidatures: review CVs + Email before sending the campaigns
- Track send errors and bounced emails
- Email address generator: Generate profesional emails addresses
- (to do) bulk verify email address


Main todos: 
1) Get airtable data from express.js server instead of doing direct local request
2) Login system: Front: Create user / change password.  Back: change password logic
3) Student access 
