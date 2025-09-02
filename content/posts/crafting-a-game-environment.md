---
title: 'Crafting a Game Environment'
date: '2025-09-02T00:59:08-03:00'
summary: "An overview of 3D game environments, and a breakdown of the bathroom in Catching Fishes."
draft: false
cover:
    image: img/04_coverr.png
    hiddenInSingle: true
tags: ["catching fishes", "art", "environment"]
categories: ["art", "catching fishes"]
---

> Hi! This post starts with a **beginner-friendly** introduction to Game Environments.  
> _If you're not a beginner, you might want to [skip the introduction](#bathroom-section)._

Before delving into the world of Tech Art, I used to be a 3D Environment Artist. At the time, I didn't even create _game_ environments, I just... created environments! To show you what I mean, here's my first completed work:

{{< figure src="/img/04_cozinha.png" caption="this was my final project for a [3D modeling course](https://escolarevolution.com.br/curso/formacao-profissional-em-3d-com-blender-2/?gad_source=1&gad_campaignid=20288560258&gbraid=0AAAAADfBm-t2KE-0HphPBD1HGo0CP19e3&gclid=CjwKCAjwq9rFBhAIEiwAGVAZP3O975AEGX3pBjBnh4M2aaiCdQ-KM362yRXhGeLFpJynBlpgaAPCCBoCVpEQAvD_BwE), and it took me 4 very busy months." >}}

I finished this on December 21, and I remember being super proud of what I had achieved! To be fair, this still makes me proud, and I like this scene so much that one day I want to **remake it into a proper game environment.**

Now, you might be wondering: isn't this _already_ a 3D environment? Why would I have to remake it?

Well, learning how to answer that question was a big part of my career transition to games, and it's what I want to talk about today!

## WHAT MAKES A GAME ENVIRONMENT

> _quick tip: click on images to zoom in!_

There's probably no better way to showcase why my kitchen isn't game-ready than to just bring it to a game engine! So here's what it looks like in Blender versus Unity:

{{< figure src="/img/04_blenderUnity.png" caption="LEFT is BLENDER, RIGHT is UNITY. ~~this proves Blender is the superior software!~~" >}}

You can see that it looks very different in those two settings. Unity's look isn't great, and there are a number of things that need fixing. I'll try to sum them into three stepping stones: **navigation**, **independence**, and **performance**.

**Navigation means considering _player interaction_,** and it's not restricted to movement. It also means having *clear objectives*, *well-defined interaction zones*, and a *level design that doesn't get in the way*.

{{< figure src="/gifs/04_navigation.gif" alt="y" caption="don't worry, carequinha! I'll fix this for you, just wait for it!" >}}

**Independence is basically the reason why the visuals feel off**. At the time, I didn't know how to UV unwrap and texture assets, so my materials were all created inside Blender. This means the visuals won't translate to Unity, because these are two very different software.

Finally, **performance is the one that's more broad, and it honestly tends to be a bit more technical**. I don't want to get too deep here, so let's just say that my kitchen's geometry is VERY heavy: it has _more than 2 MILLION (!) triangles_.

When I moved from static to videogame environments, I had these 3 points in mind. And today, I'm going to talk about one particular environment. One I know for certain is game-ready, because, well, it already runs in a game!

The game is [**Catching Fishes**](https://parinamais.com/posts/catching-fishes-devlog-01/), and the environment is... a tiny bathroom!

## OUT OF THE KITCHEN, INTO THE BATHROOM {#bathroom-section}

{{< figure src="/img/04_bathroom_main.png" caption="welcome to the bathroom! The rubber duck says: QUACK!" >}}

This time, the snapshot you see here wasn't rendered in Blender, but in Unity! And this uses a bunch of techniques that were unknown to me during my kitchen phase, like painted textures and full-screen shaders.

However, similarly to the kitchen, this also started in Blender. And it started in the same exact way that the kitchen did: with a board and some building blocks!

### 01. REFERENCES AND BLOCKING

Every environment I make always starts in the same manner: **first gathering references, then blocking**. This is a very common and reliable way to start any project, and I use this approach for many, many things.

For the bathroom, **I knew I wanted it to be cozy, but also messy and chaotic**. After searching through Artstation and _the few things that aren't AI on_ Pinterest, this was my [PureRef](https://www.pureref.com/) board:

{{< figure src="/img/04_bathroomRefs.png" alt="TODO" >}}

With references in place, I tried to extract which elements compose a bathroom, and then it was just a matter of translating them to my style. Here's what my blocking looked like:

{{< figure src="/img/04_bathroomBlocking.png" caption="if you compare this to the final artwork, you'll see things have changed, but the main structure was already here!" >}}

After blocking, I wanted to make sure this environment could reach the mood I wanted. So I drew a simple concept on top of it, just to make sure the emotions were there.

{{< figure src="/gifs/04_blockToConcept.gif" alt="TODO" >}}

I was somewhat happy with this, but there was one thing bothering me: **the amount of empty space**. I knew this was a necessity for navigation, but it still felt off. 

As it so happens, I love _MESSY_ scenes. By that, I mean busy scenes full of secondary action and details you probably won't even realize are there. [Where's Waldo](https://en.wikipedia.org/wiki/Where%27s_Wally%3F) is always a good reference for this, but my biggest inspiration is actually [Don Rosa](https://en.wikipedia.org/wiki/Don_Rosa):

{{< figure src="/img/04_donrosa.png" caption="this is a panel from The Life & Times of Scrooge McDuck, captured [here](https://icanbreakaway.blogspot.com/2012/07/masterful-mashup-cartooning-of-don-rosa.html)" >}}

However, even though I love this style, translating it to videogames is a bit hard. I can't just cram loads of stuff into a game, because I have to consider navigation, performance, and _limitations that come from being an indie-dev in charge of environments but also implementing stuff and coding and shaders and thinking of the game's idea and design and_ WOW! Best not to think about it, or I'll never make another game 😶

Anyway, I don't think there will ever be a one-way solution to my translation problem. But there was one thing that helped me with the bathroom case. One word: _tileables_!

### 02. FLOORS, WALLS, TILES!

After blocking, I went straight into the pattern for the floor and walls. The industry standard says I should probably have used Substance Designer, but I must admit I'm not proficient at it.

So I went with the next best thing: Blender's Geometry Nodes! The floor and wall patterns are actually tileables modelled in Blender. [Default Cube](https://youtu.be/aRpq3p3cr7Q)'s tutorial helped me a lot, and this was what I ended up with:

{{< figure src="/gifs/04_tileable01.gif" alt="y" caption="both patterns use the same node tree, I just tweaked the parameters" >}}

After I was satisfied with the overall look, I added some manual tweaks to the geometry to make it seem more diverse, like cracks and rotations. I then exported each pattern as an FBX file, sent them to Substance Painter, and painted the textures!

{{< figure src="/gifs/04_tileable.gif" alt="y" caption="I used material ID masks to separate the large and small tiles" >}}

Applying the patterns to the environment proved this was a right step towards my *messy goal.* Here's what the scene looked like with only tileables and wall painting:

{{< figure src="/img/04_tileable.png" caption="an empty bathroom - but the tiles help it not to feel that empty!" >}}

Now that I had the base scenery, there was only one thing missing before my character moved in: the furniture! I mean, the models!! And textures!!!

### 03. MOVING IN: MODELS AND TEXTURES

To be fair, there is nothing too fancy about the bathroom's models. They are all fairly simple and low-poly: **the entire environment has ~8.000 tris.** Just as a comparison, this is less than the kitchen's _frying pan_ (which has 14.528 tris!).

And the geometry could in fact be even lower! Here's a wireframe view:

{{< figure src="/img/04_wireframe.png" caption="" >}}

If you look at the toothbrush, the duck and the shampoo bottle caps, you'll see that even though they are quite small, **they have a high wireframe density** (especially for the low screen space they occupy).

This was somewhat on purpose, because I intend to reuse some assets in future games (the duck is already a part of my [carrot car](https://bsky.app/profile/parinamais.bsky.social/post/3l7xrisvlvu2u) endeavours!). They are far from the camera here, but might be zoomed in on future entries, so it's good to have details.

Another thing worth mentioning is that **some of these models have extra geometry for shading purposes**. An example of this is the bathroom mat.

I wanted it to look like fur, so I used a shader that adds more triangles to it (using the same techniques as grass). In order to achieve a uniform look, I needed better vertex distribution throughout the surface, that's why I divided the model into 8 quads.

{{< figure src="/gifs/04_mat.gif" alt="y" caption="this is a usecase of shaders adding geometry!" >}}

Even though this shader-talk can go out of the environment area and into tech art realm, it's useful to understand how shaders contribute to sceneries. I'll get more into that by the end of this post, just know that you don't have to solve everything through modeling!

Moving to the texturing stage, this was also very simple. Each asset was individually unwrapped, and most of them use fairly low texture sizes (most are 64-128px, and the bigger ones use 512px).

As I knew I would use a fixed-camera, I exported the assembled environment into Substance Painter. So, while texturing each asset individually, I also checked if they were complementing each other.

{{< figure src="/gifs/04_texturing.gif" alt="y" caption="the porcelain is a material instance used on the bathtube, sink and toilet" >}}

The only asset that might be worth highlighting is the mirror: this uses a combination of techniques (I've talked about it [here](https://parinamais.com/posts/stencil-buffer-overview/)), and the reflected image is actually a print of a cubemap environment mapping!

We're technically not done with the textures, there's still one more thing I want to show you. But before I do that, let's take a little detour, and head to the...

### 04 - LIGHTS ON! ...OR OFF?

Materials and lights interact with each other, so I tend to work them together. While I was texturing, I also tested different lighting setups. Initially, I was going for a "miniature" style, and I even made a Blender lighting mockup to set as goal:

{{< figure src="/img/04_blenderLight.png" caption="TRIVIA: how many water glasses are in this scene?" >}}

I was using UE5 at the time, so I tried emulating that style there:

{{< figure src="/img/04_unrealBake.png" caption="this was done with baked lights" >}}

And I then realized this look didn't fit the game. Miniatures make us think of real-world objects, and I want **Catching Fishes** to feel detached from reality.

With that in mind, my first thought was to simply make the lights more cartoonish! So I built some custom light models using [Ben Cloward's tutorials](https://youtu.be/wI0YdkiduYY):

{{< figure src="/img/04_unrealCustom.png" caption="this is a very basic implementation of a fake light source" >}}

This time, the lighting was closer to what I wanted, but it still didn't feel right. I wanted more control over shadows and highlights, and it would be hard to get that from this custom model (without investing lots of hours).

So I went with the simpler option: painting! After all, I already had individual textures for everything, and a SubPainter file with the entire bathroom assembled. So it was very easy to just get there and paint the lights!

{{< figure src="/gifs/04_shadows.gif" alt="y" caption="shadows: on and off!" >}}

At that point I was pretty satisfied with this tiny bathroom! And, if we're just looking at the 3D Environment stage, this would probably be the end of it.

After all, I had an **easy-to-navigate low-poly environment**, and I could **export its geometry, as well as its UV coordinates and texture files**. This was ready to go into Unity, THE END! 

... Or is it?!

### 05 - WITH GAMES, IT'S NEVER OVER

I decided to write this post because it relates to my current task: I'm actually finishing the bathroom environment right now! Even though the modelling, texturing and lighting parts are done, there are still some things missing. 

I'm including this bit just to say that, in games, we can't expect to solve everything in one particular pipeline stage. There's A LOT that goes into composing a real-time environment, and even this tiny bathroom requires things like VFX, animations and shaders.

{{< figure src="/img/04_environmentFinal.png" caption="Here's a little teaser of what's to come: FINAL_environment_concept_52.png" >}}

That's why one of the best things I've ever done was losing the fear of putting my environments into a game engine. I learned A LOT by doing that, and it gave me the courage to experiment and learn new things!

So I want to wrap this up by saying: if you're a 3D environment artist, try to put your sceneries in a game engine - and don't be afraid of making a mess, that's part of the fun! After all, I do LOVE a messy scene, and maybe you will too! 😆