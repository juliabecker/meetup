#Meetup App

The Meetup App is a tcp app that stores information on a developer meetup and allows users to RSVP for the event and see how many people are attending. Admins - authenticated by providing the correct password - can set the details for an event, view the full list of attendees, and clear the list of RSVPs.

## User Features

* All users can access the app via telnet, with the IP address 45.55.134.100 and port 3000:

```node
telnet 45.55.134.100 3000
```

* Upon app connection, users will get the information for the most recent meetup event:

```node
Next Meetup:
"Understanding Javascript"
4/2/15

To RSVP for "Understanding Javascript", provide your full name and email as follows:
RSVP [FIRST NAME] [LAST NAME] [EMAIL]
```

* When a user RSVPs with their name and email, they are added to the list of attendees.

```node
RSVP Julia Becker jcbecker26@gmail.com
```

* Users can type "number_attending" to see the full number of people currently attending the event.

```node
number_attending
There are 25 people attending the "Understanding JavaScript" meetup
```

* Users can get instructions for using the app by typing the command 'instructions'

```node
instructions

Meetup App Instructions:

'RSVP [FIRST NAME] [LAST NAME] [EMAIL]' - RSVP for the current event
'number_attending' - View the number of people attending the event
'info' - Display the current event info
'instructions' = Display the app instructions
'admin [PASSWORD] attending' - Display the full list of people attending the next meetup (requires admin access)
'admin [PASSWORD] set [MM/DD/YY] [TOPIC]' - Set the date and topic of the next event (requires admin access)
'admin [PASSWORD] clear' - Clear the list of attendees (requires admin access)
```

##Admin Features

* Admins must provide the correct password in order to access the admin features.

* Admins will have the ability to see the full list of users attending the current meetup:

```node
admin [PASSWORD] attending

The following 4 people have RSVP'ed for "Understanding JavaScript":

Julia Becker - jbecker@gmail.com
Anna Rankin - arankin@gmail.com
Susan Henke - beckhen@gmail.com
Georgina Oram - goram@gmail.com
```

* Admins can set the date and topic of the next meetup

```node
admin [PASSWORD] set [MM/DD/YY] [TOPIC]
You have updated the event info to: "All About Node" on 4/30/15
```

* Admins can clear the list of current RSVPS

```node
admin [PASSWORD] clear
You have cleared the full list of attendees
```
