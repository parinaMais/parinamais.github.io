---
title: 'Catching Fishes, Making Games and Failing Forward'
summary: 'CATCHING FISHES  - DEVLOG #01'
description: 'Catching Fishes - Devlog #01'
date: '2025-06-29T15:55:16-03:00'
draft: true
cover:
    image: img/01_cover.png
    alt: 'Static image of a bathroom, that has a bathtube, a sink and mirror, a cabinet, a toilet, a catlitter, a flower and a bathroom stool with a cat magazine on top. In the center of the bathroom,
            there is a bald character looking at the camera.'
    caption: '"Hey! Nice to meet you"'
tags: ["catching fishes"]
categories: ["devlog"]

---
At the end of last year, I decided to use my holidays to build my first solo game. It was supposed to be a small, three-weeks project featuring a character you might recognize as my avatar, [who accompanies me since 2020](https://www.instagram.com/p/CDKBE6DB_nt/).

Seven months have passed and, since this isn't a post announcing the game's release, it's safe to say my scope was *fairly off*. During this time, the game changed shape, and a lot of things had to go wrong so that some of the things would go right.

With all that, I feel like I finally have something to say about this project. So this is the first devlog of my first game: **it's called CATCHING FISHES, and it's about taking a bath when you are very tired.**

## Catching Fishes

The idea for the title came from [a David Lynch quote](https://youtu.be/TqZpi8zAqe0?t=384), that I hereby reproduce:

> **Ideas are so beautiful and they're so abtract. They exist in someplace, I don't know if there's a name for it, and I think they exist like fish. I believe if you sit quietly, like you're fishing, you will catch ideas.**

I really ressonate with this. I also think of creativity as something calm and contemplative, like taking a bath -- this is where the whole game's idea comes from!

{{< figure src="/img/01_catchingFishes.png" alt="My image" caption="Concept for the game's final scene (did I just spoil it??)" >}}

But, to be fair, I also think of ideas as something that blossom out of contrast. At least for me, sitting still all the time won't do much. On the other hand, when I finally get to relax after a long, tiresome day... Maybe I'll catch a fish or two.

And I wanted to incorporate this way of thinking into **Catching Fishes**. After all, what's the fun of making a game without a little challenge?

{{< video src="/vid/01_currentFootage.mp4" type="mp4" caption="Game's current footage - captured in 07/07/2025">}}

## Making Games

As I said, taking a bath won't be that simple: **you can't get in the tub before completing some chores**. For you, the player, this means you'll have to complete six minigames (three are already implemented, yay!), and a few extra interactions.

But, I, the developer, also have to complete A LOT OF chores, which are basically building the game. As I said, this is my first solodev project, so a lot of what I'm doing is totally new to me (my bald friend was the first character I ever rigged and animated!).

{{< figure src="/img/01_placeholder.png" alt="My image" caption="My workflow overview." >}}

And, as you can imagine, there has been a lot of trial and error. Let me be clear about this: the biggest challenge in this game is definitely... making it! The last seven months have been full of mistakes, backtracking and outright failing.

To be fair, all of the mistakes I made were things I learned from, and they helped shape me (and my game!) for the better. This is why I chose mistakes as the topic of my first devlog: they were (and still are) an important part of my journey, worth sharing. With that out of the way, I finally present to you:

{{< video src="/vid/01_mistakes.mp4" type="mp4" caption="(some of the) Mistakes I made while developing my game!">}}


### 1. Starting the game in Unreal 5

I decided to launch with this because it's the only one I'm still kinda embarassed about, so I just want to rip off the band-aid.

At the time I started my game, I was going through all of [Ben Cloward's shader tutorials](https://www.youtube.com/@BenCloward). So I wanted to use this project as an opportunity to showcase some work.

I have mostly used Unity for work, and I really wanted (still do) to up my skills in UE5. Naively, I thought: why not use this opportunity?

{{< figure src="/img/01_unreal.png" alt="Print of a bluesky tweet that talks about switching to Unreal, and compliments Unreal's buffer visualization" caption="I still really like the buffer overview!" >}}

Well, turns out there were a handful of good reasons not to do that. Mainly: I really want to publish this game on itch.io, and [UE5 doesn't support WEBGL or HTML5 builds](https://forums.unrealengine.com/t/ue5-html5-webgl-packaging/541561).

I discovered this in the beggining of February, already a few months into development. I struggled with this information for a few days, but ultimately decided to rebuild it all in Unity. 

{{< video src="/vid/01_UeToUnity.mp4" type="mp4" caption="Porting to Unity! 13/02/2025">}}

This actually wasn't the hassle I thought it would be: it took me one week to finish porting, and I only had my free time to work on this. Though, at the time, I remember thinking to myself: wow, imagine where I'd be if I had just started with Unity...

Well, the fact is that I didn't, and I would like to share some pros and cons of my UE5 experience:

+ 👎 This might seem obvious, but I'll state it anyway: as this was/is my first experience with solodev, it wasn't a good idea migrating to an engine where I don't have full proficiency. Implementing the visuals and shaders was a smooth transition, but scripting the mechanics was not. I'm very used to writing in C#, transitioning to blueprints made me slower.

+ 👎 I also should have considered the project's fit when choosing the engine. This was supposed to be a tiny cute game, UE5 was an overkill (I actually spent some considerable time disabling Unreal's defaults to get the look I wanted, this game uses no lighting, no color grading etc).

+ 👍 The shaders proved to be engine agnostic. UE5 and Unity have differences in their coordinate systems, like in their Y direction in UVMaps, but it was still really easy to translate all the visuals from one engine to the other. Even the animations and models exported pretty well.

+ 👍 It was awesome to experiment with a different engine. I had taken some courses on UE5, but getting a project done in it is very different. As soon as I'm done with Catching Fishes, my next project will be building an environment to showcase in UE5, and I'm looking forward to it!

After facing this challenge rellatively early in my project, I thought: nothing can be worst than having to rebuild the game! Right? Right??? Please?!?

### 2. Taking too long to Playtest

I come from a background of creating stories through a medium that will just unfold in front of your eyes (mainly [stop motion shorts](https://youtu.be/0icYXzEZlS8)). So, even though I have played videogames for all my life, I didn't understand how important player's agency is.

What I mean by that is, in order for a game to progress, the player has to **1. understand what they need to do** and **2. be able to actually do it**.

{{< figure src="/img/01_placeholder.png" alt="My image" caption="My workflow overview." >}}

The "understanding the objective" part might be where I struggle the most. It's very hard to evaluate if the concepts I created are clear because, well, they are for me! They came out of my quirky head, I understand them fully.

An example of this failing is: for the first four months, I had a clear idea on how the chores would play out. The player would have to interact with twelve objects in a specific order, and only after completing all interactions would they be able to take a bath.

{{< figure src="/img/01_interactions.png" alt="My image" caption="Interactions Order - 16/03/2025" >}}

My intention with this was to add personality to the character, conveying the order in which he likes to do things; and to give the game a challenge, which would be discovering what the order was.

Suffice to say, that didn't work. All of the playtesters felt the order was too arbitrary, and one of them even held a grudge against my little bald character for refusing to interact with the toilet (please forgive him! It was my fault, not his).

So I decided to remake the chores system from the ground up. Now you can interact with anything at any time, and the obligatory chores have minigames - that you can complete on your own pace, mind you. Problem solved, right?

Well, kind of. The minigames came with their own set of challenges: now I have to be extra careful with the "be able to overcome the challenges" part. For instance: I used to have a wall jump mechanic, required to pass some minigames.

{{< video src="/vid/01_showercap.mp4" type="mp4" caption="This minigame was scrapped! Please don't get attached">}}

At playtesting, that mechanic proved to be inconsistent: most of the people weren't able to do it, and sometimes it didn't work properly. As this still remains with the scope of a tiny game, I didn't want to spend much time refining it, nor did I want to include a tutorial.

So I discarded it, and am currently trying to figure out creative minigames that fit my restricted, simple control scheme. And this leads me my mistake number 3, which was...

### 3. Not sharing devlogs earlier

My initial ambition with this project was to only share it when it was all done. I always knew I wanted to do a series of devlogs, but I imagined publishing them with the game already available to play, like a marketing tactic.

Honestly, I still think this is a 👍 good idea, but: 👎 definitely not for your first game. Here's my thoughts on this experience:

+ 👍 Posting on social media tends to make me a bit anxious, and it distracts me from my work day. Not having that for several months helped me focus, which is specially important in this kind of project (free time only).

+ 👎 Not posting on social media can also be a downside, since I lose the engangement and community that comes with people seeing (and potentially being interested at) what I'm doing.

+ 👍 Keeping this all to myself has helped me assert my own voice for this project. Building the basis all by myself, without external opinions, was good for self validation, and also to allow me to express myself more.

+ 👎 On the other hand, I don't have enough repertory (yet) to figure out what works and what doesn't on my own, specially without play testing. Sharing devlogs will be a good way of hearing new ideas, and maybe get more people interested in playtesting (I currently have a very limited pool of some generous friends).

There is one more reason why I now think keeping this game silent wasn't a great idea, that deserves a bit more thought than a paragraph.

I love gamedev. I love talking about it, I love reading about it, so I thought it was time I tried out writing as well! I've recently read [this awesome post](https://endler.dev/2025/best-programmers/), and one of the things it talks about is how writing about your skill will make you better at it, and I agree!

So I'm doing this to improve my gamedev skills, to share my thoughts and, ultimately, to share my ideas! And ideas are all that catching fishes is about, right?

## Failing Forward

>*First off, I want to be clear that the failures I'm talking about here were ones I could recoup from. This is a small, personal project where I have the liberty to create without the pressure to succeed, so please keep this context in mind.*
