# messengerBot
node.js Interview task

Task

The goal is to create a Messenger bot in Node.js. The app should:

1. Be able to set up a Messenger webhook

2. When a user starts a conversation, say Hi and ask few questions:

  1. User's first name
  2. Birth date
  3. If the user wants to know how many days till his next birtday. This is a yes/no answer
    and the bot should accept both user text answer („yes", „yeah", „yup”, "no”, "nah", etc.)
    and quick reply buttons. To make it simpler, you can assume there's only one valid
    date format: YYYY-MM-DD
3. If user says yes to the last question, send him a message: There are <N> days left until
 your next birthday

4. If user says no, just say: Goodbye

5. Within the same app, create a REST endpoint /messages that lists all messages received
 from users

6. Create a REST endpoint for viewing a single message by its ID and also for deleting a
 single message.
 Don't worry about the persistence layer. Feel free to keep all messages in the runtime
 memory, although using a database of your choice is a big plus.
