# UCAScraper is a Simple sCRAPER

## Lectures Calendar
科技&明德 series included.

Periodicly manually run result is accessible from
 https://calendar.google.com/calendar/ical/8b1087cb41e1dbaab08c72e1db5f1c3fdc03c814448ffd2b0dcf0b7f62146e3c%40group.calendar.google.com/public/basic.ics

You can subscribe to this public google calendar in your calendar/email provider, whatever brand yours is.

![Outlook](https://github.com/user-attachments/assets/3845853d-62d3-40f8-8cb5-1eee7496508c)
![Google Calendar](https://github.com/user-attachments/assets/6e24475d-3c77-465a-b875-3a54ec85d218)

Tested on Outlook, Mi Mailbox.

### Usage
Preconditions:
- An google cloud account is required
- GreaseMonkey is required

Steps:
- Add this `get-lecture.user.js` script to your GM extension.
- Enable calendar API according to [JavaScript 快速入门  |  Google Calendar  |  Google for Developers](https://developers.google.com/calendar/api/quickstart/js?hl=zh-cn#next_steps)
  - Add an item of 'https://xkcts.ucas.ac.cn:8443' in Authorized JavaScript Origins
- Fill the API_KEY and CLIENT_ID just got in GM script's `data` config.
