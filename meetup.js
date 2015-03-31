var net = require('net');
var fs = require('fs');

var attendeesFile = './attendees.json';
var adminFile = './admin.json';
var eventFile = './event.json';

var attendeesArray = JSON.parse(fs.readFileSync(attendeesFile, 'utf8'));
var eventObj = JSON.parse(fs.readFileSync(eventFile, 'utf8'));
var adminObj = JSON.parse(fs.readFileSync(adminFile, 'utf8'));

var server = net.createServer();


server.on('connection', function(client) {
    console.log('client connected');
    client.setEncoding('utf8');

    meetupInfo(client);

    client.on('data', function(stringFromClient) {
        var trimmedString = stringFromClient.trim();
        var inputArray = trimmedString.split(' ');
        var command = inputArray[0].toLowerCase();

        switch (command) {
            case ('rsvp'):
                rsvp(inputArray, client);
                client.end();
                break;
            case ('number_attending'):
                numberAttending(client);
                client.end();
                break;
            case ('info'):
                meetupInfo(client);
                client.end();
                break;
            case ('admin'):
                admin(inputArray, client);
                client.end();
                break;
            case ('instructions'):
                showInstructions(client);
                client.end();
                break;
            default:
                client.write("\nIncorrect command!\n");
                showInstructions(client);
                client.end();
                break;
        }

    });
});

// Add a user to the input array
function rsvp(inputArray, client) {

    // User didn't provide correct # of arguments
    if (inputArray.length !== 4) {
        client.write("Please enter a first name, last name, and email address, separated by spaces:\nRSVP first last email")

        // User provided correct # of arguments
    } else {
        var firstName = inputArray[1];
        var lastName = inputArray[2];
        var email = inputArray[3];

        var attendee = {
            "name": firstName + " " + lastName,
            "email": email
        };

        // Check if email already registered
        var rsvped = false;
        attendeesArray.forEach(function(attendee) {
            if (attendee.email === email) {
                rsvped = true;
            }
        });
        if (rsvped) { // Already registered
            client.write("\nThanks! You've already registered under the email address " + email + ". To view the number of people attending, log in again and type 'number_attending'\n\n")
        } else { // New registrant
            attendeesArray.push(attendee);
            save(attendeesArray, attendeesFile);
            client.write("\nThanks " + firstName + "! You have successfully RSVP'ed for " + eventObj.topic + "\n\n");
        }
    }
}

// Display info for latest meetup
function meetupInfo(client) {
    client.write("\n\nNext Meetup:\n'" + eventObj.topic + "'\n" + eventObj.date + "\n\n");
    client.write("To RSVP for this event, type 'RSVP [FIRST NAME] [LAST NAME] email'\n\n")
}

// Display number of people RSVP'ed
function numberAttending(client) {
    var number = attendeesArray.length;
    client.write("\n" + number + " people have RSVP'ed for " + eventObj.topic + " on " + eventObj.date + ". If you have not RSVP'ed, you can do so by providing your full name and email address:\n'RSVP first last email'\n\n")
}

// Display app instructions
function showInstructions(client) {
    client.write("\nMeetup App Instructions:\n\n\t'RSVP [FIRST NAME] [LAST NAME] [EMAIL]' - RSVP for the current event\n\n\t'number_attending' - View the number of people attending the event\n\n\t'info' - Display the current event info\n\n\t'instructions' - Display the app instructions\n\n\t'admin [PASSWORD] attending' - Display the full list of people attending the next meetup (requires admin access)\n\n\t'admin [PASSWORD] set [MM/DD/YY] [TOPIC]' - Set the date and topic of the next event (requires admin access)\n\n\t'admin [PASSWORD] clear - Clear the list of attendees (requires admin access)\n\n");
}

// Admin features
function admin(inputArray, client) {
    // No password entered
    if (inputArray.length === 1) {
        client.write("\nPlease enter a password following the 'admin' command to access admin features\n\n")
        client.end();
    }
    // Check if password accurate
    var password = inputArray[1];
    if (password !== adminObj.password) {
        client.write("\nBad password! Try again.\n\n")
    } else {
        var action = inputArray[2]

        switch (action) {
            case ('attending'):
                listAttending(client);
                break;
            case ('set'):
                setEvent(inputArray, client);
                break;
            case ('clear'):
                clearAttendees(client);
                break;
            default:
                client.write("\nIncorrect command. Use one of the following with admin + password:\n\n'attending' - View all people currently attending\n'set [MM/DD/YY] [TOPIC]'' - Set a new event\n'clear' - Clear all current attendees\n\n");
                break;
        }
    }
}

// List all people who have currently RSVP'ed
function listAttending(client) {
    client.write("\nThe following " + attendeesArray.length + " people have RSVP'ed for " + eventObj.topic + " on " + eventObj.date + ":\n\n")
    attendeesArray.forEach(function(attendee) {
        client.write(attendee.name + " - " + attendee.email + "\n");
    });
    client.write("\n");
}

// Set a new event
function setEvent(inputArray, client) {
    var date = inputArray[3];
    var topic = "";
    for (i = 4; i < inputArray.length; i++) {
        topic += inputArray[i] + " ";
    }
    var event = {
        "topic": topic.trim(),
        "date": date
    };
    save(event, eventFile);
    client.write("\nYou have updated the event info to:\n" + topic.trim() + " on " + eventObj.date + "\n\n");
}

// Clear list of attendees
function clearAttendees(client) {
    save([], attendeesFile);
    client.write("\nYou have cleared the full list of attendees\n\n")
}

// Save data to a JSON datafile
function save(data, dataFile) {
    fs.writeFile(dataFile, JSON.stringify(data), function(err) {
        if (err) {
            console.log(err)
        }
    });
}


server.listen(3000, function() { //'listening' listener
    console.log('Connected to Server!');
});