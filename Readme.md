###Example user notification using VueJS
Let's assume some authorized user wishes to look through notifications and send one to another user.
User cames to some page with navbar, clicks 'notifications' link in sidebar. Page with notifications renders. 
There are next tabs atop of page:
1. Inbox - show list of notifications from different users
1. Sent - show list of notifications sent from current users
1. System - show list of notifications received from current system (site)
1. Trash - show list of notifications removed from prev tabs

Every Tab consists of table with notifications and button 'Compose new message' atop of the table.
Tables Inbox, System, Trash notifications consists of next columns:
1. checkbox - to check all or wished notifications and move to trash. (In trash case - to fully remove)
1. Sender - name and email of sender
1. Subject - subject of notification
1. Date - created at date
Every column has filter and some of them order actions.

To look through notification body use can simply click on the row with wished notification and 'Show Notification' page renders.

'Show Notification' page consists of three row containers:
1. Sender - user sender avatar, name and email. Also to the left of currrent row info (notification type and date) and nav menu reply, forward, destroy
1. Receiver - current user receiver avatar, name and email.
1. Subject - subject of notification. Click on subject renders as accordion action notification body.

'Compose new message' button invoke page with form where user can create and send new notification.
There are next fields in 'New notification (message)' form :
1. Receiver (select with search action). User can type user name or mail and choose wished receiver in the list of found users.
1. Subject (simple input). 
1. Sender (disabled select with search action). Consist of current user data.
1. Text field (text area).
1. Buttons 'Send' (to send new notification) & 'Back' (to return to the prev page)

That's it! Appreciated for attention.
	