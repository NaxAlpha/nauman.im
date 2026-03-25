March 24, 2026

> **Disclaimer**: This essay is based on a real YouTube automation experiment I ran for roughly two months. The system worked, but my thinking on the right strategy is still evolving.

# Running a YouTube Channel on Autopilot

Over the past two months, I ran an experiment: could I build an end-to-end system that creates and uploads YouTube videos automatically?

The answer is yes.

I created a brand new channel from scratch, scraped news websites, selected topics with AI, turned articles into videos, reviewed them for policy issues, and automated the upload pipeline. By the end of the experiment, the channel had gone from 0 to roughly 300 subscribers.

But the more important answer is this: just because the system works does not mean the business works.

It cost me around $250 over two months to get there. As someone new to YouTube automation, that was enough to prove the pipeline was technically viable, but not enough to prove the channel model was sustainable. I came away with a much clearer understanding of what matters, what I got wrong, and what I would do differently next time.

## What I Built

At a high level, the system looked like this:

- scrape recent news from the web
- rank or filter stories based on relevance and expected usefulness
- turn selected stories into scripts, visuals, and edited video assets
- review the output for policy risks
- upload to YouTube automatically
- publish on a schedule without manual intervention

At later stages, I moved most of the workflow from my laptop to Cloudflare Workers, added cron jobs, and built a dashboard to monitor the pipeline. At that point, the system could keep producing videos while I slept. I only needed to step in when I wanted to improve prompts, fix quality issues, or adjust strategy.

From a pure engineering perspective, this was satisfying. I had built a content factory that could run in the background.

From a creator perspective, the real lessons started after that.

## Lesson 1: Niche Matters More Than Generic Relevance

The hardest lesson was also the most obvious in hindsight: niche matters a lot.

I approached the problem like an engineer. My assumption was that if I could use AI to identify the most important or relevant news, then the channel would naturally find its audience. In practice, that was not enough.

The channel was too broad. It covered useful news, but it did not stand for one specific thing in the viewer's mind.

The people who are truly good at this game usually do the opposite. They go narrow. Very narrow. They build a channel around a specific vertical, a specific audience, and often even a specific content format. Paradoxically, that narrowness gives them more leverage, not less. Their audience knows exactly why it should come back.

That is how loyalty compounds.

If I do this again, I would start by choosing one clear niche first and only then design the automation around it. The automation should serve the niche, not define it.

## Lesson 2: I Entered a Very Competitive Market Late

Another realization was that YouTube automation is not new. I did not discover some secret untouched opportunity. I just entered an already mature and highly competitive field.

There are people who have been doing this for years. Many of them run multiple channels at once. They understand thumbnails, packaging, watch-time optimization, topic selection, audience psychology, and aggressive SEO far better than I did when I started.

I entered the space with a somewhat idealistic mindset. I wanted to make useful, non-clickbait content, build something ethical, and help people one video at a time.

That instinct is still good.

But idealism alone does not win in a market where many participants are optimizing for reach with extreme focus. YouTube does have policies that limit abuse, but experienced operators are constantly looking for edges and loopholes. If I want to stay idealistic and still compete, then I need a long-term strategy. Burning more than $100 per month without a strong niche or monetization path is not a strategy.

## Lesson 3: Shorts Gave Views, Long-Form Gave Real Watch Time

I started with Shorts because the early feedback looked exciting. On average, they often got more than 1,000 views per video, which felt great psychologically.

That early dopamine was misleading.

Shorts are very good at creating the feeling of momentum. They are not automatically good at building a durable channel. I eventually realized that the path from "some views on Shorts" to a meaningful business was much weaker than I expected, at least with the kind of content I was making.

Later I shifted more attention toward long-form videos. One of them was only around three minutes long, but it reached roughly 2,000 views and generated about 100 watch hours. That was the moment I realized I should have started testing long-form much earlier.

The lesson was simple: views are not all equal. Watch time, returning viewers, and depth of engagement matter more than vanity metrics.

## Lesson 4: More Content Is Not Always Better

I tested multiple production strategies:

- generate many videos at once from the previous 24 hours of news and schedule them every 30 minutes
- scrape every two hours and publish from a smaller rolling window
- batch content every 6 hours
- combine multiple stories into one short summary
- turn a single story into a more detailed breakdown

Each strategy had tradeoffs around freshness, cost, quality, and volume.

What I eventually learned is that I was producing too much content.

As an engineer, it is tempting to think that if automation is working, then the right answer is to increase throughput. But content is not a traditional software pipeline where more output automatically improves outcomes. Flooding a channel can dilute quality, confuse the audience, and increase cost without improving retention.

In hindsight, I would rather publish fewer, better-targeted videos than keep a machine running at maximum speed just because it can.

## Lesson 5: The First Version Was Manual, and That Was the Right Call

Before building the full system, I made the first video manually. I jumped between Claude, Canva, Google AI Studio, and other tools to figure out whether the concept had any pull at all.

That was important.

My first Short got roughly 1,000 views within a few hours. That was not enough to prove a business, but it was enough to justify building a system around the idea.

After that, I started automating piece by piece. The earliest system-generated videos were rough. Quality was inconsistent. Some outputs were clearly weak. But as I kept posting and iterating, the system improved. Scripts got better, visuals improved, the workflow became more reliable, and eventually I added auto-upload and then auto-publication.

This was not a case where I built the perfect machine first and launched later. I improved the machine while it was already producing.

That was messy, but it was realistic.

## Lesson 6: Cost Per Video Matters More Than You Think

One of the most important metrics in the whole experiment was cost per video.

For text generation, I mostly used lighter models for simple tasks and stronger models for harder reasoning. The text side of the workflow usually cost around $0.05 to $0.10 per video.

The expensive part was image generation.

I wanted visuals that felt good enough to support a polished video, so I used high-quality image generation. One trick that helped was generating a 3x3 grid of images inside a single 4K image, which lowered the effective cost per usable visual. Even then, the total cost per video often landed somewhere around $0.50 to $1.00.

That adds up quickly.

At peak activity, the system was costing around $3 to $5 per day, or roughly $100 to $150 per month. Compared to people who run YouTube automation more efficiently, I was still operating like a beginner. More experienced operators usually constrain costs much harder, often with subscription-based tooling, fewer uploads, and tighter topic selection.

This changed how I think about automation. The question is not "Can AI make the video?" The question is "Can AI make the video cheaply enough that the channel economics still make sense?"

## Lesson 7: Policy Review Needed to Be Part of the System

One thing I am glad I implemented was a policy-aware generation and review layer.

I built a workflow where AI would fetch YouTube policy guidance, update the generation prompts accordingly, and then run a second review pass to flag content that might violate policies before publication.

This was not in the earliest version of the system. It came later, which means some early videos may have had policy issues I would not be comfortable with now.

By the final stage, the pipeline looked more responsible:

- generate content with policy constraints in mind
- review scripts and visuals for possible violations
- only publish automatically when the review stage passed

Once that review loop was in place, I felt much more comfortable enabling automatic publication.

## Lesson 8: Infrastructure Was Not the Bottleneck

At first, I ran the system locally on my laptop. Later I moved it into Cloudflare Workers, added cron scheduling, and created a dashboard so I could monitor the full flow.

That made the whole experiment feel much more real. The pipeline became durable, remote, and less dependent on me sitting in front of a machine.

But infrastructure was never the main challenge.

The real bottlenecks were content strategy, channel positioning, and economics.

That is a useful lesson for engineers. We often assume the hard part is making the system autonomous. Sometimes that is true. In this case, the harder problem was deciding what the system should produce, how often it should produce it, and for whom.

## Why I Paused the Experiment

By the end, I had many ideas to improve the next version:

- reduce unnecessary code and simplify the pipeline
- narrow the niche dramatically
- focus more on long-form video
- improve subscriber and watch-time growth
- reduce generation costs
- publish less often but with stronger editorial intent

But I paused the experiment because of time.

The technical foundation was there. The strategic foundation was not yet strong enough to justify continued spending and attention. I would rather pause a system that works than keep feeding it money without conviction.

## Final Takeaway

This experiment taught me that fully automated YouTube production is possible. You can scrape information, transform it into videos, review it, upload it, and run the whole thing in the background.

That part is real.

One interesting thing I noticed while studying the space is that many of the more experienced operators are still doing a lot of this manually. They move between tools and browser tabs, generate assets in one place, edit in another, upload somewhere else, and manage the whole system through habit and process rather than full automation.

That does not mean they are doing it wrong. In many cases, they are faster than beginners because their manual workflow is already highly optimized.

But my advantage is different. I can build the whole pipeline so it runs automatically. Instead of living in a maze of tabs, prompts, and repetitive upload steps, I can turn the workflow itself into software.

What is harder is building a channel that deserves to grow.

If I revisit this idea, I would approach it less like a generic automation engineer and more like a media operator: one niche, one audience, one editorial identity, and one cost structure that actually makes sense.

I still think there is real opportunity here. In fact, I am more convinced of it now than when I started. But the opportunity is not in blindly automating content production. It is in combining strong engineering with sharp taste, strategic restraint, and a clear understanding of what people actually return for.

And if someone wants a custom system like this built for their own workflow, I now know exactly what it takes to get the first version running and what mistakes to avoid in version two.
