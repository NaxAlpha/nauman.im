<!-- December 20, 2025 -->

# Lessons Learned Vibe Coding an iOS App from Scratch

I've been a developer for over 7 years, primarily focused on Python and Machine Learning. For a long time, I've had the desire to build my own apps, but my lack of experience in frontend and mobile development was a constant source of frustration. 

Everything changed with the recent rise of "vibe-coding." I discovered a newfound ability to build across the entire stack—frontend, backend, and infrastructure—regardless of my prior expertise. In fact, this very website was developed using Cursor and Claude.

With this new momentum, I decided to take on a challenge: publishing a vibe-coded iOS app from scratch. This blog post is a collection of the lessons I learned along the way, shared so that others can benefit from my journey.

## The Lessons Learned

### 1. Choosing the Right Tools: IDEs and Models

The first step was deciding on the environment. In vibe-coding, your IDE and LLM are your primary collaborators. I weighed my options between **Claude Code**, **Codex**, and **Cursor**. Although I've since learned more about the others, I stuck with Cursor at the time because of my familiarity with it.

For the models, I had access to both **Claude Sonnet 4.5** and **GPT-5**. I ended up developing a hybrid strategy based on their strengths:

*   **GPT-5-High**: This became my primary workhorse. While it was a bit slower, it was incredibly methodological and precise. It was also more cost-effective, making it ideal for the bulk of the coding tasks.
*   **Claude Sonnet 4.5**: Whenever GPT-5 hit a wall or when I needed a quick solution for complex logic, I switched to Sonnet 4.5. It was exceptionally fast and agile, though it came at a higher cost.

**The takeaway:** You don't have to stick to one model. Use the precise, cost-effective one for the foundation, and bring in the specialized "powerhouse" when you need to solve high-level architectural or logic puzzles.

### 2. Framework Selection: The "Native-ish" Sweet Spot

Choosing the right framework was critical. I evaluated three main contenders: **SwiftUI**, **React Native**, and **Flutter**. 

*   **SwiftUI (Xcode)**: Coming from a Python background, Xcode and Swift felt somewhat "alien." It reminded me of the heavy, monolithic IDEs from the Visual Studio era, and since I had never developed for the Apple ecosystem, the learning curve felt unnecessarily steep for a vibe-coding project.
*   **React Native**: This felt too much like web development. The massive `node_modules` folders, the heavy React dependency, and the layers of wrappers didn't appeal to me. I wanted something that felt more focused on the mobile experience itself.
*   **Flutter**: This turned out to be the balanced option. It provided a "native-ish" feel without the overhead of React Native or the steep barrier of entry of SwiftUI. 

**The takeaway:** Trust your intuition on the developer experience. Flutter provided the perfect middle ground for someone with a non-mobile background, and this decision paid off significantly as the project progressed.

### 3. Solving a Real Problem: The "Not-Just-a-Wrapper" Realization

My goal wasn't to build a $1M+ MRR powerhouse; I simply had a specific problem I wanted to solve: **real-time voice translation.** 

To achieve this, I chose **OpenAI's GPT-realtime** as the engine. With the right prompting, it works remarkably well. On the surface, the app was essentially a "wrapper" around this API. However, the process of building it taught me a humbling lesson: **creating a truly great user experience around an AI wrapper is far from trivial.**

When you're dealing with real-time audio, latency, and voice interactions, the "wrapper" part is actually the smallest piece of the puzzle. Most of the effort goes into making the interaction feel seamless—handling network interruptions, visual feedback for voice activity, and ensuring the interface doesn't get in the way of the conversation.

**The takeaway:** Don't underestimate the complexity of the "wrapper." The value isn't just in the API you're calling, but in the polish, reliability, and user experience you build on top of it.

### 4. Backend Infrastructure: Staying Lightweight with Cloudflare

For the backend, I needed something that matched the speed and efficiency of the "vibe-coding" philosophy. I chose **Cloudflare Workers**, and it turned out to be the best decision for several reasons:

*   **Serverless & Scalable**: It's extremely lightweight and handles scaling out of the box.
*   **Integrated Ecosystem**: With a built-in database (D1) and KV storage, it felt like an almost complete "all-in-one" solution for serverless development.
*   **Email via Resend**: The only missing piece in Cloudflare's core offering (currently in private beta) was email. I bridged this gap by using **Resend**, which was incredibly easy to integrate and maintain.

**The takeaway:** A serverless, integrated backend allows you to focus 90% of your energy on the actual product features rather than managing infrastructure. Cloudflare Workers + Resend provided the perfect minimal-overhead stack.

### 5. Mastering the Workflow: Read, Redirect, and Plan

The day-to-day development process was a fascinating experiment in human-AI collaboration. My workflow evolved through several distinct stages:

*   **The "Watch and Learn" Phase**: Initially, I’d give broad instructions like "create email + OTP-based authentication" and simply watch the AI work. Even though I wasn't a Dart or JS expert, my 7+ years of experience in Python allowed me to *read* the code effectively. I could spot patterns, understand logic flows, and ensure things weren't going wildly off the rails.
*   **The "Active Redirection" Phase**: As with any collaborator, AI sometimes goes off on a tangent. I learned early on that I couldn't just be a passive observer. I had to stop the process, provide feedback, and redirect the AI back to the intended path.
*   **The Breakthrough: Plan Mode**: The biggest shift in productivity came when I discovered **Plan Mode**. Instead of having the AI jump straight into coding, I started asking it to outline its approach first. We would refine the plan together until I was satisfied, and *then* let it execute. This "think first, code later" approach drastically reduced errors and rework.

**The takeaway:** Your value as an experienced developer in "vibe-coding" isn't necessarily in writing every line, but in your ability to **read, review, and strategize**. Moving from immediate execution to a "Plan -> Refine -> Execute" cycle is the secret to high-velocity, high-quality development.

### 6. The Automation Secret: The Power of the Makefile

One of the most impactful decisions I made during development was asking GPT-5 to help me create a comprehensive **Makefile**. This wasn't just for compiling; it became the central nervous system of my development cycle.

*   **`make debug`**: This single command started the backend server locally, built the app, and launched it with all local environments configured.
*   **The Flutter Advantage**: Flutter was a game-changer here. For local debugging, I would run the app as a **macOS desktop app** rather than an iOS simulator. This made the feedback loop incredibly fast.
*   **Targeted Commands**: 
    *   **`make android`**: Handled the build and deployment directly to my personal device.
    *   **`make deploy`**: Automated the backend deployment.
    *   **`make screenshots`**: Automatically generated screenshots and overlaid the marketing text.
    *   **`make bundle` & `make publish`**: These handled the final App Store release steps, even creating a new draft version on App Store Connect based on local JSON configurations.

**The takeaway:** Don't just vibe-code the app; vibe-code your tools. Whether it's a Makefile or NPM scripts, automating the repetitive tasks (debugging, deploying, screenshotting) accelerates your velocity and keeps you in the "flow state."

### 7. The Final Hurdle: Navigating Apple's App Review

While the coding was fast, the final step—getting into the App Store—had its own set of challenges. It wasn't that the review itself was impossible to pass, but the logistics were surprisingly complex.

The biggest hurdle was understanding the dance between the build and the configuration of **In-App Purchases (IAP)**. Figuring out how to submit the first IAP alongside the initial build for review was a bit of a puzzle. It required a fair amount of trial and error, cross-referencing documentation, and patience.

But eventually, the notification came through: **Approved.**

Seeing my own iOS app live on the Apple App Store was truly a "dream come true" moment. After years of frustration, I could finally send a link to friends and colleagues and say, "I built this."

**The takeaway:** The last 5% of the project—the distribution and compliance—can feel like a different world compared to coding. Don't let the bureaucratic hurdles of the App Store discourage you; the feeling of seeing your app live is worth every trial and error.

### 8. The Reality Check: Manual Testing is Non-Negotiable

Vibe-coding is remarkably fast, but that speed comes with a hidden risk: opacity. When you're building in a new language or framework, many of the underlying nuances are invisible to you. This makes rigorous **manual testing** an absolute necessity.

I learned this the hard way by accidentally shipping a test build to the App Store—twice. Because I couldn't easily verify every detail of the final generated build, small configuration errors slipped through. 

You don't need to know every line of the framework, but you **must** ensure the final build passes:
*   **Sanity Checks**: Does the app even open?
*   **The Happy Path**: Can a new user complete the core task (in my case, a translation)?
*   **Critical Edge Cases**: What happens if the internet drops?

**The takeaway:** Don't let the AI's confidence fool you. You are the final quality gate. While even huge organizations ship bugs, your goal should be to bridge the knowledge gap with a robust manual verification process.

### 9. Beyond "AI Slop": The Developer as Creative Director

There is a valid concern in the industry about "shipping slop"—low-quality, AI-generated junk. I sympathize with this; I never want to ship bugs or subpar experiences. However, my goal is to solve real problems.

Working with AI during this project felt less like using a code generator and more like having access to a team of mid-level engineers for every specialized task—frontend, backend, automation, and even App Store optimization. 

Ultimately, I am responsible for every line of code that gets shipped. The AI provides the labor, but I provide the **vision**. It is this human-driven guidance, creativity, and commitment to solving a problem that serves as the ultimate antidote to AI slop. 

**The takeaway:** AI isn't a replacement for the developer; it's an amplifier for the developer's vision. Your unique value lies in your ability to guide, refine, and take responsibility for the final solution.

## Conclusion

The journey from a "backend-only" developer to a published iOS app creator was made possible by the bridge that vibe-coding provides. It's not just about writing code faster; it's about removing the barriers that keep ideas trapped in our heads.

I have always wanted to do more than just write code—I wanted to write fiction, create games, build apps, and share ideas through creative storytelling. For a long time, these fields felt closed off to anyone who hadn't spent years specializing in them. AI has changed that, making it possible for anyone with a vision to build and create across disciplines.

However, this democratization comes with a caveat. I still believe a writer with deep, lifelong expertise is far superior to someone using AI to generate a story. In the same way, an experienced software engineer can spot subtle architectural flaws in AI-generated code that an average user might miss. As a society, our collective eye for "slop" will sharpen, and we will learn to value the depth that only human expertise brings to the table.

There are many problems still to be solved as we head into this future. But for now, if you've been sitting on an idea because you don't "know the stack," let this be your sign. Pick a problem you care about, choose your AI collaborator, and start vibing. 

The world is waiting for your story, your app, and your vision.
