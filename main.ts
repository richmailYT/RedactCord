const userToken = config.userToken
const userId = config.userId
const contentToReplace = config.contentToReplace
const replaceContentWith = config.replaceContentWith
const channelId = config.channelId
import config from "./config.json" with { type: "json" };

async function sleep(ms: number) {
  await new Promise(resolve => setTimeout(resolve, ms));
}

async function isTokenValid(token: string) {
  const tokenCheck = await fetch("https://discord.com/api/v9/quests/@me", {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:129.0) Gecko/20100101 Firefox/129.0",
      "Accept": "*/*",
      "Accept-Language": "en-US,en;q=0.5",
      "Authorization": token,
      "X-Super-Properties": "eyJvcyI6IldpbmRvd3MiLCJicm93c2VyIjoiRmlyZWZveCIsImRldmljZSI6IiIsInN5c3RlbV9sb2NhbGUiOiJlbi1VUyIsImJyb3dzZXJfdXNlcl9hZ2VudCI6Ik1vemlsbGEvNS4wIChXaW5kb3dzIE5UIDEwLjA7IFdpbjY0OyB4NjQ7IHJ2OjEyOS4wKSBHZWNrby8yMDEwMDEwMSBGaXJlZm94LzEyOS4wIiwiYnJvd3Nlcl92ZXJzaW9uIjoiMTI5LjAiLCJvc192ZXJzaW9uIjoiMTAiLCJyZWZlcnJlciI6IiIsInJlZmVycmluZ19kb21haW4iOiIiLCJyZWZlcnJlcl9jdXJyZW50IjoiIiwicmVmZXJyaW5nX2RvbWFpbl9jdXJyZW50IjoiIiwicmVsZWFzZV9jaGFubmVsIjoic3RhYmxlIiwiY2xpZW50X2J1aWxkX251bWJlciI6MzIzNzM4LCJjbGllbnRfZXZlbnRfc291cmNlIjpudWxsfQ==",
      "X-Discord-Locale": "en-US",
      "X-Discord-Timezone": "America/New_York",
      "X-Debug-Options": "bugReporterEnabled",
      "Sec-GPC": "1",
      "Sec-Fetch-Dest": "empty",
      "Sec-Fetch-Mode": "cors",
      "Sec-Fetch-Site": "same-origin"
    },
    "method": "GET",
  });

  const tokenCheckJson: { message: "401: Unauthorized", code: 0 } | { quests: object[] } = await tokenCheck.json();
  if ("message" in tokenCheckJson) {
    return false;
  }
  return true;
}

async function main() {
  const tokenCheck = await isTokenValid(userToken);
  if (tokenCheck == false) {
    console.log("%cToken is invalid", "color: red");
    Deno.exit(1);
  }
  console.log("Token is valid", "color: green");
  while (true) {
    const messages = await fetch(`https://discord.com/api/v9/channels/${channelId}/messages/search?author_id=${userId}&content=${contentToReplace}`, {
      "headers": {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:129.0) Gecko/20100101 Firefox/129.0",
        "Accept": "*/*",
        "Accept-Language": "en-US,en;q=0.5",
        "Authorization": userToken,
        "X-Super-Properties": "eyJvcyI6IldpbmRvd3MiLCJicm93c2VyIjoiRmlyZWZveCIsImRldmljZSI6IiIsInN5c3RlbV9sb2NhbGUiOiJlbi1VUyIsImJyb3dzZXJfdXNlcl9hZ2VudCI6Ik1vemlsbGEvNS4wIChXaW5kb3dzIE5UIDEwLjA7IFdpbjY0OyB4NjQ7IHJ2OjEyOS4wKSBHZWNrby8yMDEwMDEwMSBGaXJlZm94LzEyOS4wIiwiYnJvd3Nlcl92ZXJzaW9uIjoiMTI5LjAiLCJvc192ZXJzaW9uIjoiMTAiLCJyZWZlcnJlciI6IiIsInJlZmVycmluZ19kb21haW4iOiIiLCJyZWZlcnJlcl9jdXJyZW50IjoiIiwicmVmZXJyaW5nX2RvbWFpbl9jdXJyZW50IjoiIiwicmVsZWFzZV9jaGFubmVsIjoic3RhYmxlIiwiY2xpZW50X2J1aWxkX251bWJlciI6MzIzNzM4LCJjbGllbnRfZXZlbnRfc291cmNlIjpudWxsfQ==",
        "X-Discord-Locale": "en-US",
        "X-Discord-Timezone": "America/New_York",
        "X-Debug-Options": "bugReporterEnabled",
        "Sec-Fetch-Dest": "empty",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Site": "same-origin",
        "Priority": "u=0"
      },
      "referrer": `https://discord.com/channels/@me/${channelId}`,
      "method": "GET",
      "mode": "cors"
    });

    const messagesJson: {
      "total_results": number,
      "messages": {
        "id": string, //message id
        "content": string,
        "channel_id": string,
        "author": {
          "id": string, //discord id of the author
          "username": string,
          "global_name": string
        },
      }[][]
    } = await messages.json();
    if (messagesJson.messages.length == 0) {
      console.log("%cNo messages found", "color: red");
      Deno.exit(1);
    }
    console.log(`%cFound ${messagesJson.messages.length} messages`, "color: green");
    for (const message of messagesJson.messages) {
      console.log(`%cEditing message with content ${message[0].content}`, "color: yellow");
      const resp = await fetch(`https://discord.com/api/v9/channels/${channelId}/messages/${message[0].id}`, {
        "credentials": "include",
        "headers": {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:129.0) Gecko/20100101 Firefox/129.0",
          "Accept": "*/*",
          "Accept-Language": "en-US,en;q=0.5",
          "Content-Type": "application/json",
          "Authorization": userToken,
          "X-Super-Properties": "eyJvcyI6IldpbmRvd3MiLCJicm93c2VyIjoiRmlyZWZveCIsImRldmljZSI6IiIsInN5c3RlbV9sb2NhbGUiOiJlbi1VUyIsImJyb3dzZXJfdXNlcl9hZ2VudCI6Ik1vemlsbGEvNS4wIChXaW5kb3dzIE5UIDEwLjA7IFdpbjY0OyB4NjQ7IHJ2OjEyOS4wKSBHZWNrby8yMDEwMDEwMSBGaXJlZm94LzEyOS4wIiwiYnJvd3Nlcl92ZXJzaW9uIjoiMTI5LjAiLCJvc192ZXJzaW9uIjoiMTAiLCJyZWZlcnJlciI6IiIsInJlZmVycmluZ19kb21haW4iOiIiLCJyZWZlcnJlcl9jdXJyZW50IjoiIiwicmVmZXJyaW5nX2RvbWFpbl9jdXJyZW50IjoiIiwicmVsZWFzZV9jaGFubmVsIjoic3RhYmxlIiwiY2xpZW50X2J1aWxkX251bWJlciI6MzIzNzM4LCJjbGllbnRfZXZlbnRfc291cmNlIjpudWxsfQ==",
          "X-Discord-Locale": "en-US",
          "X-Discord-Timezone": "America/New_York",
          "X-Debug-Options": "bugReporterEnabled",
          "Sec-Fetch-Dest": "empty",
          "Sec-Fetch-Mode": "cors",
          "Sec-Fetch-Site": "same-origin",
          "Priority": "u=0"
        },
        "referrer": `https://discord.com/channels/@me/${channelId}`,
        "body": JSON.stringify({
          "content": message[0].content.replace(new RegExp(contentToReplace, "ig"), replaceContentWith)
        }),
        "method": "PATCH",
        "mode": "cors"
      });

      if (resp.status != 200) {
        console.log("%cFailed to edit message", "color: red");
        if (resp.status == 429) {
          console.log("Rate limited, waiting 10 seconds");
          await sleep(1000 * 10)
          continue;
        } else {
          console.log(resp);
          Deno.exit(1);
        }
      } else {
        console.log("%cEdited message", "color: green");
        await sleep(1000 * 5)
      }
    }
    console.log("%cMoving onto the next page", "color: yellow");
  }
}

if (import.meta.main) {
  main();
}
