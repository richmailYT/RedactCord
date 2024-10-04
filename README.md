This is a script that will redact specific content in a DM on Discord.
You can use this to remove sensitive information in a DM such as your name.

## Downsides
Messages that are not indexed by Discord will not be redacted
New messages will not be redacted (because they haven't been indexed by Discord
yet)

If you're trying to redact the word `run` and one of the messages is `iamcurrentlyrunning`, the
sub-string `run` will not be redacted

## Usage
1. Edit the `config.json` file to include the the token of your Discord account,
   and the ID of the user you want to redact. You can use this tutorial (https://youtu.be/LhCOfaxffaQ) to find someones user id. They use a phone for this, but it works even on desktop or in a browser. 
2. Download Deno from https://deno.land
3. Run `deno --allow-net main.ts` in the terminal or command prompt
4. Enjoy!