---
title: 'Catching Fishes, Making Games and Failing Forward'
summary: 'CATCHING FISHES  - DEVLOG #01'
description: 'Catching Fishes - Devlog #01'
date: '2025-07-11T01:55:16-03:00'
draft: false
cover:
    image: img/01_cover.png
    alt: 'Static image of a bathroom, that has a bathtube, a sink and mirror, a cabinet, a toilet, a catlitter, a flower and a bathroom stool with a cat magazine on top. In the center of the bathroom,
            there is a bald character looking at the camera.'
    caption: '"Hey! Nice to meet you"'
tags: ["catching fishes", "devlog"]
categories: ["devlog"]

---
At the end of last year, I decided to use my holidays to build my first solo game. It was supposed to be a small, three-weeks project featuring a character you might recognize as my avatar on every social.

Seven months have passed and, since this isn't a post announcing the game's release, it's safe to say my scope was *fairly off*. During this time, the game changed shape, and it took a lot of missteps before things finally started working.

With all that, I feel like I finally have something to say about this project. So this is the first devlog of my first game: **it's called CATCHING FISHES, and it's about taking a bath when you are very tired.**

## Catching Fishes

The idea for the title came from [this David Lynch quote](https://youtu.be/TqZpi8zAqe0?t=384):

> **Ideas are so beautiful and they're so abstract. They exist in someplace, I don't know if there's a name for it, and I think they exist like fish. I believe if you sit quietly, like you're fishing, you will catch ideas.**

I really resonate with this. I also think of creativity as something calm and contemplative, like taking a bath -- this is where the whole game's idea comes from!

{{< figure src="/img/01_catchingFishes.png" alt="My image" caption="Concept for the game's final scene (did I just spoil it??)" >}}

But, to be fair, I also think ideas blossom out of contrast. At least for me, sitting still all the time won't do much. On the other hand, when I finally get to relax after a long, tiresome day... Maybe I'll catch a fish or two.

And I wanted to incorporate this way of thinking into **Catching Fishes**. After all, what's the fun of making a game without a little challenge?

{{< video src="/vid/01_currentFootage.mp4" type="mp4" caption="Game's current footage - captured on 07/07/2025">}}

## Making Games

Turns out, making a game comes with a complete set of challenges. As I said, this is my first solodev project, so a lot of what I'm doing is totally new to me (for instance, my bald friend was the first character I ever rigged and animated!).

{{< video src="/vid/01_animation.mp4" type="mp4" caption="My FINEST work in animation!!">}}

And, as you can imagine, there has been a lot of trial and error. The last seven months have been full of mistakes, backtracking and outright failing. 

Don't get me wrong, most of the mistakes I made were things I learned from, and they helped shape me (and my game) for the better. This is why I chose failures as the topic of my first devlog: they are an important part of my journey, and are worth sharing. 

So, here are some of the:

{{< video src="/vid/01_mistakes.mp4" type="mp4" caption="mistakes I made while developing my game!">}}

### 1. Starting the game in Unreal 5

I decided to launch with this because it's the only one I'm still kinda embarrassed about, so I just want to rip the band-aid off.

I have mostly used Unity for work, and I really wanted to up my skills in UE5. Naively, I thought: why not use this opportunity to build a game AND learn more about Unreal?

{{< figure src="/img/01_unreal.png" alt="Print of a bluesky tweet that talks about switching to Unreal, and compliments Unreal's buffer visualization" caption="I still really like the buffer overview!" >}}

Well, turns out there were a handful of good reasons not to do that. Mainly: I really want to publish this game on itch.io, and [UE5 doesn't support WEBGL or HTML5 builds](https://forums.unrealengine.com/t/ue5-html5-webgl-packaging/541561).

Instead of looking into that early, I only discovered this in the beginning of February, already a few months into development. I struggled with this information for a few days, but ultimately decided to rebuild it all in Unity. 

{{< video src="/vid/01_UeToUnity.mp4" type="mp4" caption="Porting to Unity!">}}

This actually wasn't the hassle I thought it would be: it took me one week to finish porting, and I only had my free time to do it. Though, at the time, I remember thinking to myself: wow, imagine where I'd be if I had just started in Unity...

Well, the fact is that I didn't, and I would like to share some pros and cons of my UE5 experience:

+ 👎 This might seem obvious, but I'll state it anyway: as this was/is my first experience with solodev, it wasn't a good idea to migrate to an engine where I don't have full proficiency. Implementing the visuals and shaders was a smooth transition, but scripting the mechanics was not. I'm very used to writing in C#, and transitioning to blueprints made me slower.

+ 👎 I also should have considered the project's fit when choosing the engine. This was supposed to be a tiny cute game, UE5 was overkill (I actually spent some considerable time disabling Unreal's defaults to get the look I wanted, this game uses no lighting, no color grading etc).

+ 👍 The shaders proved to be engine agnostic. UE5 and Unity have differences in their coordinate systems that would affect the shaders, like in their Y direction in UVMaps, but it was still really easy to translate all the visuals from one engine to the other. Even the animation and models, that were made for Unreal's metric system, exported pretty well.

+ 👍 It was awesome to experiment with a different engine. I had taken some brief courses on UE5, but getting a project done in it is very different. As soon as I'm done with Catching Fishes, my next project will be building an environment to showcase in UE5, and I'm looking forward to it!

After facing this challenge relatively early in my project, I thought: nothing could be worse than having to rebuild the game! Right? Right??? Please?!?

### 2. Taking too long to Playtest

This might have been the biggest mistake of all, so I'm going to try and break it into two parts, to make it clearer.

I come from a background of creating stories through a medium that will just unfold in front of your eyes (mainly [stop motion shorts](https://youtu.be/0icYXzEZlS8)). So, even though I have played videogames for all my life, I didn't understand how important player's agency is.

What I mean by this is that, in order for a game to progress, the player has to **1. understand what they need to do** and **2. be able to actually do it**.

**2.1 Understanding the Objective**

Honestly, this might be where I struggle the most. It's very hard to evaluate if the concepts I created are clear because, well, they are for me! They came out of my quirky head, so I understand them fully.

That way of thinking led to some problems, and here's one of them: for the first four months, I had a clear idea of how the chores would play out. The player would have to interact with twelve objects in a specific order, and only after completing all interactions would they be able to take a bath.

{{< figure src="/img/01_interactions.png" alt="My image" caption="Original Interactions Order" >}}

My intention with this was to add personality to the character, conveying the order in which he likes to do things. Also, I wanted to add a challenge to the game, which would be discovering what the interactions order was.

Suffice to say, that didn't work. My friends/playtesters felt the order was too arbitrary, and one of them even held a grudge against my little bald character for refusing to interact with the toilet (please forgive him! It was my fault, not his).

As I'm writing this, I am thinking that it should have been obvious that the restrictive ordering was a bad idea. I think what happened was that, as time passed, I grew accustomed to that idea, and simply stopped evaluating it properly.

Anyway, when that failed, I decided to remake the chores system from the ground up. Now you can interact with anything at any time, and the obligatory chores have minigames - also, you can go through them in any order. Problem solved, right?

**2.2 Being Able to Overcome the Challenge**

Well, kind of. The minigames came with their own set of challenges. For instance: I used to have a wall jump mechanic that looked a bit like this.

{{< video src="/vid/01_showercapMinigame.mp4" type="mp4" caption="This minigame was scrapped! Please don't get attached">}}

At playtesting, that mechanic proved to be inconsistent: most of the people weren't able to do it, and even if they were, sometimes it didn't work properly. To be fair, this was more fixable than the ordering problem, but I decided to discard that mechanic for two reasons.

First, I didn't want to spend too much time refining this to work properly (I was basically just applying an impulse to the player in the direction of the surface's normal, kind of [like this](https://catlikecoding.com/unity/tutorials/movement/surface-contact/)).

Second, it was hard to get people to realize that wall jumping was a possibility (especially when they didn't have a background in platformers). As I don't want to include any tutorials, I was afraid this would simply block someone.

So I discarded it, and am currently trying to figure out what minigames fit my restricted control scheme (basically arrow keys and an interaction button). To be completely honest, I have started to feel a bit burnt out this last month, so it has been hard. 

The way that I'm trying to fix this leads me to mistake number 3, which was...

### 3. Not sharing devlogs earlier

{{< figure src="/img/01_carequinhaNotebook.png" alt="Scanned image of my notebook, containing some annotations about my game" caption="I have most of my game's development registered on this notebook. This is the first page! It is written in portuguese." >}}

My initial ambition was to only share devlogs when the game was all done. I thought that publishing them with the game already available would improve the experience of reading the devlogs, because you would be able to check in real time how it all works.

Honestly, I still think this is a 👍 good idea, but: 👎 definitely not for your first game. Here's my thoughts on this experience:

+ 👍 Posting on social media tends to make me a bit anxious, and it distracts me from my work day. Not having that for several months helped me focus, which is especially important in this kind of project (where I only have my free time to do it).

+ 👍 Keeping this all to myself has helped me assert my own voice for this project. Not having external opinions was good for self-validation, and allowed me to express myself without fearing what others would think.

+ 👎 Not posting on social media can also be a downside, since I lose the engagement and community that comes with people seeing (and potentially being interested in) what I'm doing.

+ 👎 Ultimately, I don't have enough repertory (yet) to figure out what works and what doesn't on my own, especially without playtesting. Sharing devlogs will be a good way of hearing new ideas, and maybe getting more people interested in playtesting (I currently have a very limited pool of some generous friends).

Aside from that, there is one more reason why I now think keeping this game silent wasn't the best idea, but that deserves a section of its own.

## Failing Forward

As much as I tried to document stuff for posterity, I ended up losing a lot of material. There's a lot more stuff that went wrong in those seven months, I just didn't document it all properly. 

I focused on keeping what contributed to the final state of the game, because that is the interesting part, right? Why would I keep records of scrapped mechanics and failed ideas?

{{< figure src="/img/01_progress.png" alt="Picture of my bald character standing with his back towards us, looking at a wall of my 3D works" caption="I made this to celebrate my 1-year 3D progress!" >}}

Honestly, that way of thinking started bothering me. At the end of the day, this is my first solo project, so my desire to learn and experiment is waaaaay bigger than my desire to create a perfect game. 

This is why, from now on, I want to focus on showcasing my journey, and not just the finished product. I want to share what I learn, and hopefully, learn when I share!

So expect to see a bunch more posts here: of things that went right, things that went wrong, and things that I simply don't know where they're headed. All I know is that I'll be moving forward. And catching fishes! 🐟