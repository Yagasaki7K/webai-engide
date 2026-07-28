# 100% Offline Intelligent Chatbot with Chrome's Prompt API

Building an embedded chatbot widget that runs entirely in the browser, exploring the experimental local AI features of the Chrome Prompt API.

⭐ Leave a star • [Join the community](https://discord.gg/jhSepmE7nN) • [Report an issue](../../issues)

## Objective

Learn, in a practical way, how to create a chatbot that uses **local / embedded AI models** via Chrome's experimental features, without relying on an external backend. You will have a reusable widget that can be plugged into any page.

## Key Features

- 100% offline (no server calls – ideal for prototypes and privacy).
- Modern Chrome API (Prompt API / experimental AI APIs).
- Simple architecture with separation between Controller, View, and Services.
- Support for simulated streaming messages / typing indicator.
- Easy to style via CSS custom properties.
- Prepared to abort requests (e.g., Stop button in advanced lessons).

## Architecture and Widget Structure

```
sdk/
    ew-chatbot.html      # Snippet for embedding
    ew-chatbot.css       # Styles and CSS variables
    src/
        index.js           # Bootstrapping
        controllers/chatBotController.js
        views/chatBotView.js
        services/promptService.js (adapts AI calls)
    botData/
        systemPrompt.txt
        chatbot-config.json
        avatar.webp
```

## Prerequisites

- Node.js 22+ (for utility scripts and simple static server).
- **Chrome** browser (version compatible with experimental AI / Prompt APIs).
- Enable experimental flags:
    - [chrome://flags/#prompt-api-for-gemini-nano](chrome://flags/#prompt-api-for-gemini-nano)

## Quick Installation

Clone the repository and install dependencies inside the desired lesson folder.

Example to access the first lesson:
```bash
git clone https://github.com/Yagasaki7K/template-webai

cd template-webai

bun i
bun start
```

Then interact with the widget in the corner of the screen.

## Embedding the Widget in Another Site

Create the `botData` folder in the project where you want to embed the widget and customize `botData/chatbot-config.json` to change name, avatar, and colors.

You can publish the files from the `sdk/` folder on the Web (e.g., a CDN) and reference the file, like:

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>EW Academy AI Chatbot</title>
    <link rel="icon" type="image/x-icon" href="./botData/avatar.webp">
</head>

<body>
    <script type="module" src="https://yagasaki7k.github.io/template-webai/sdk/src/index.js"></script>
</body>

</html>
```
Then the widget will automatically appear on page load.

## Customization

Initial content / behavior:

- `systemPrompt.txt`: system instructions for the model.
- `chatbot-config.json`: metadata (name, avatar, colors, welcomeBubble, etc.).

## Challenges

1 - Download the model upon user authorization

- Ask the user if they want to download the model
    - Check if the model is not available on the client's machine, so that in the chat, they click a button, start the download, and then be notified that it's finished.

2 - Make it available in other browsers

- If the client is not on Google Chrome, you can switch the model, use Hugging Face, or even Google's Gemma model and follow the same process, asking if they want to download the model and more.

3 - Make it available on incompatible / less powerful computers

- Implement a backend to consume free AI APIs, the smaller Google Gemma models to respond to users
    - Recommendation is to use [OpenRouter](https://openrouter.ai/), an aggregator of AI models that work in the cloud. They allow you to use APIs for free, with some limits, but in my tests it works very well.
    - Take a look at the [documentation](https://openrouter.ai/docs/community/open-ai-sdk) to see how to integrate with Node.js and ensure your keys won't be exposed on the frontend.

## Limitations and Warnings

- The Chrome AI / Prompt APIs are still experimental and may change or require flags.
- Offline features depend on browser support / local hardware.
- This project is educational – not intended for production without security reviews.

## FAQ

**Does it work in Firefox / Safari?** Currently the focus is Chrome (specific experimental APIs).

**Do I need a backend server?** No for the core demonstrated; everything runs on the client.

**How do I change the initial prompt?** Edit `botData/systemPrompt.txt`.

## Contribution

Contributions are welcome! Suggestions, issues, and PRs help evolve the material.

1. Fork the repository
2. Create a branch: `git checkout -b feat/my-feature`
3. Commit: `git commit -m "feat: my feature"`
4. Push: `git push origin feat/my-feature`
5. Open a Pull Request

If this project helped you, leave a ⭐. It encourages new free content.