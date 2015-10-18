---
title: "How performance affects UX"
date: 2014-04-20
layout: post.hbt
---

Users tend to get very picky when it comes to how fast something loads or reacts.

I mean, let’s face it. Nobody wants to wait for something to load.

In the first part of this blog post I will try to help you guys understand why performance in a user interface is important. And in the second part I will go through some various tools and techniques we can use to keep our application lean, fast, and smooth.

## Page load

A good rule of thumb for delivering a pleasant user experience is that most pages should ideally load in under a second. That’s how long we have until our users’ state of flow might get interrupted and they potentially lose focus on the task they are performing.

We don’t want that.

## Animations

When doing animations, like moving stuff across the screen, we should try to get that work done in under 60ms. Anything longer than that and it might feel choppy or slow and it just makes it harder for our users to continue to do whatever they are trying to do.

Users usually have a much better experience when the web is fast, which is why speed is actually one of the major factors in SEO ranking right now.

## Response time

Another thing that’s important for UX is response time, which is the input latency when interacting with a UI. It shouldn’t take more than 100ms for something to respond when, for example, a user clicks on something or they try to drag something.

If it’s more than 100ms they might experience a slight delay which can be pretty annoying. This applies to any input, whether they are enabling a trigger, switching tabs, or starting an animation.

## So how are we doing so far?

Well, for example, the load speed of our reports page has some room for improvement, as you can see below.

![anpdm](https://gist.github.com/kvzivn/ce1cdb75a367eb7be044/raw/3c277315938c40f50ca171b343779b4a9c0039d4/anpdm_reports.png)

Looking at the numbers we can easily see that we definitely have some areas where we can, and should, improve. And luckily for us, there’s a large number of tools and techniques we can use to improve the overall performance of our application. In the second part of this blogpost I will go a little deeper into why we are slow and what we can do about it.

Stay tuned for next week!