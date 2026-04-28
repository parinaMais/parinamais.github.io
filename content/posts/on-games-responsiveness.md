---
title: 'What Makes a Game Responsive?'
summary: 'On perfecting a game by allowing for the imperfect.'
date: '2026-04-28T01:55:16-03:00'
draft: false
cover:
    image: img/07_cover.png
    hiddenInSingle: true

---

When we think of responsiveness in games, we usually think about **the seconds between a button press and the in-game result**. If everything plays out well, we won't think about this time in _full seconds_, but in _milli_ or even _nanoseconds_.

While that definition is perfectly valid, one thing that always comes to my mind is an article by Maddy Thorson. She's one of the creators of Celeste, and she wrote [an amazing blogpost called Celeste & Forgiveness](https://maddymakesgames.com/articles/celeste_and_forgiveness/index.html), which I highly recommend reading:

{{< figure src="/gifs/07_celesteExample.gif" alt="animated print of maddy makes games blog" caption="screen grab from https://maddymakesgames.com/articles/celeste_and_forgiveness/index.html" >}}

She talks about how Celeste's mechanics are built to **forgive certain mistakes or input delays.** It's as if the game is considering not only the _button press itself_, but also *what the player intended*, and giving them room to accomplish that intent.

Essentially, this is a way of thinking about responsiveness as being more than time-related: it's also about **managing players' expectations, and in consequence, tweaking the game's difficulty**. 

It might be easier to see this in a platforming context, but adjusting a game to give room for mistakes is important for every genre. Even for... **cooking games!**

{{< figure src="/gifs/07_cookingLoop.gif" alt="animated gif of my current game, where you make a popsicle and serve to a customer" caption="new game coming soon!" >}}

This is the game I'm currently making! It's inspired by Overcooked and some old flash games like Penguin Diner and the [Papa's series](https://papasfreezeria.io/).

And, as in any cooking game, **difficulty revolves around time-management**: you have a fixed amount of time to serve each customer; and you have to pair that with how long it takes to make a scoop, a popsicle, bake an ice cream cone...

So wasting time is never a good idea! And yet, **there was a waste-of-time problem that had nothing to do with player performance**. To understand it, let's take a closer look at that popsicle loop:

{{< figure src="/gifs/07_popsicleZoom.gif" alt="animated gif of my current game, where you make a popsicle and serve to a customer" caption="new game delayed, many problems to fix!" >}}

In the close-up view, you can see I tried to add a chocolate topping, **but couldn't interact with the counter**. In a time-management game, this _pause to reposition_ ends up **increasing difficulty** in a way that isn't fair.

At its core, **this is a responsiveness issue**: I pressed the button to add toppings, yet nothing came out. It was reasonable to expect I _should_ be able to output a topping, so not getting it leads to frustration, and unnecessary friction.

And, whenever I'm dealing with an issue like that, there's an _**EASY-2-STEP-INSTANTANEOUS-PRESS-A-BUTTON**_ way to solve it... 

Just kidding! 

There's no fixed guide, but here's what I did:

### UNDERSTANDING PLAYER EXPECTATIONS

To get a better understanding of what players want, **there's usually no better answer than playtesting**! And playtesting was actually what revealed this issue, so I can't say it wasn't useful.

The thing is **playtesting will often give you the problems, but not the answers**. However, there's one thing that works in many, many fields, and it's almost always an effective way to get solutions: **reference search!**

References are especially useful with issues like these, because **successful games often shape players' expectations for their genre.** So to solve my problem, I looked at the game that established a lot of what we expect from cooking mechanics: Overcooked!

{{< figure src="/gifs/07_overcookedRef.gif" caption="I love OVERCOOKED!" >}}

In Overcooked 2, we **can interact with a counter from all angles**, as long as we're not very far. This makes interactions feel fluid & easy - which is good, because that's not where difficulty should be! 

In comparison, here's the same situation applied to my game:

{{< figure src="/gifs/07_counterProblem.gif" caption="all I ever wanted was to drop that apple..." >}}

Here, **we CAN'T interact with a counter from all angles**. In fact, we can only interact if we had just moved towards that counter!

This means **my game has a very strict positioning window** (to quote a term from Maddy Thorson), which adds unnecessary friction to the interactions. It isn't a lag _per se_, it's a mistake in game design that makes the game feel unresponsive.

And in this case, identifying what has to be changed is actually the hardest part. Changing it will be quite straightforward, as you'll see in the next section:

### FROM FORGIVENESS, COMES RESPONSIVENESS

> _I'll show some code in this section, but I still want to keep this beginner-friendly! So I'll try to explain the logic in the best way I can_ : )

At the end, **my responsiveness issue was fixed with a simple function switch, and some small additional logic**. First, here's what my code looked like:

{{< figure src="/img/07_interactCode_01.png" caption="the Counters logic is based on [Code Monkey's Kitchen Chaos](https://youtu.be/AmGSEH7QcDg)!" >}}

Basically, the problem was in the Physics.Raycast bit, where I was shooting a ray from the player in the lastInteractDirection, that is, the **direction of the last button press**. To get a better understanding, here's the ray:

{{< figure src="/gifs/07_directionVector.gif" caption="the red line represents the lastInteractDirection vector, which is the direction of my raycast" >}}

This makes it very clear why even a small rotation prevents interactions: **a short tap on a directional button would just rotate the player by a tiny amount**, but it **would overwrite the lastDirectionVector to an entirely new direction!**

So, if I wanted to interact with a counter from multiple angles, all I had to do was **change this single ray approach to one that worked for multiple angles** - like a sphere's radius!

There were essentially two Unity Physics functions I could use: [Physics.SphereCast](https://docs.unity3d.com/ScriptReference/Physics.SphereCast.html) or [Physics.OverlapSphere](https://docs.unity3d.com/ScriptReference/Physics.OverlapSphere.html). I went with OverlapSphere, because SphereCast requires a _direction_, and I just wanted to check for counters _around the player_:

{{< figure src="/img/07_sphereCode.png" >}}

You can see I actually went with the NonAlloc version of Physics.OverlapSphere, and I'll explain this choice in [the bonus section](#third-section). For now, know that my counter detection worked like this:

{{< figure src="/gifs/07_overlapSphere.gif" caption="the red sphere is my new detection sphere!" >}}

It's already much better, and **sideways detection is working**! However, let's zoom in to find one last problem:

{{< figure src="/img/07_distanceProblem.png" >}}

Now, **even though I'm closer to the counter on the left, the one on the right is the current interactable**. That is because I'm still missing the **distance check** part of my newfound logic.

And, again, there's more than one way to do it: Unity's built-in function, [Vector3.Distance](https://docs.unity3d.com/2019.4/Documentation/ScriptReference/Vector3.Distance.html), or just calculate the distance manually.

Both of them would work, but I went with the manual approach (again, will explain why in [the bonus section](#third-section)), and here's my final code:

{{< figure src="/img/07_finalCode.png" >}}
> _If you want to know more about measuring vector distance, [read my BOIDS post!](https://parinamais.com/posts/boids/#separation)_

Here, I'm starting out by giving a really big value to minDistanceToCounter (infinity!), and every time I find a new counter, I check if my distance to it is smaller than minDistance.

For my first found counter, the currentDistance is guaranteed to be smaller than minDistance. So **I'll update minDistance to be equal to my currentDistance, and keep doing that untill I have the closest counter**. 

Here's that in action:

{{< figure src="/gifs/07_counterDetectionGood.gif" caption="finally, the apple dropped!" >}}

With those changes implemented, the **player can finally drop the apple where they want!** Or, to put it in other terms:

### ATTENDING TO EXPECTATIONS

The underlying principle of responsiveness is to _validate an input_. It serves to show the player that their interaction was received & performed, and it's essentialy **a measurement of how well we're communicating with a game**.

And, as you've seen in my counters example, **responsiveness issue don't always come of performance problems; it can also be a poorly justified design choice**. 

Like not being able to drop an apple from a certain angle, or add topping to a popsicle!

{{< figure src="/gifs/07_responsive.gif" caption="now the world is balanced!">}}

Paying attention to these situations will _make your game mechanics more forgiving_. 

Another way to put it is that _your game will have a wider input margin_. Or _attend to expectations more frequently_!

Or we can just say it will... **make your game more responsive**!

### BONUS SECTION: THE TIME PART! {#third-section}

>_This section will be more advanced than the rest of the post, so it might not be that interesting for beginners._

Throughout this post, I discussed responsiveness from an '_attending to player's expectations_' point of view. However, even though I didn't want to focus on input lag, I also don't want to leave it out entirely.

After all, **time is an important component of what makes a game responsive**, and it also has to do with expectations. One of the ways of minimizing input lag is through **performance improvements**.

In the previous section, I briefly mentioned two seemingly arbitrary choices, **using the NonAlloc version of Physics.OverlapSphere**, and **calculating distance manually instead of using Vector3.Distance**. Here's why I did that:

+ _using the NonAlloc version of Physics.OverlapSphere_

Basically, the difference is that **OverlapSphere _creates a new array_ every time we call it**, and for OverlapSPhereNonAlloc, we **_send in our fixed-size array_, and the method fills it with the overlapping colliders** (source: [Baste in Unity Discussions](https://discussions.unity.com/t/overlapsphere-and-overlapspherenonalloc/656660/5))

Not creating an array everytime is good, because it doesn't create any garbage. **However**, having to use a fixed-size array has its downsides, because if we exceed that size we simply won't store found colliders.

For my game, fixed-size really wasn't an issue. I'm checking for colliders in a specific layer, and there won't ever be many interactables surrounding the player simultaneously. **I just have to make sure my array size covers a worst-case scenario**.

But, as you'll see in the performance measurement further down, using simple OverlapSphere doesn't increase my garbage all that much, even though this code runs in Update. So this isn't a do-or-die situation, but the knowledge is always useful!

+ _manual distance calculation instead of Vector3.Distance()_

To understand this one, let's see what Unity says about Vector3.Distance: _Vector3.Distance(a,b) is the same as (a-b).magnitude._ (source: [Unity Docs](https://docs.unity3d.com/2019.4/Documentation/ScriptReference/Vector3.Distance.html)).

Using .magnitude means we output the _exact distance_ between a and b, but **with the cost of an expensive square root operation**. In my code, I don't need to know the exact distance, I just need to know **which object is closer**.

That can be calculated manually using [.sqrMagnitude of the Vector3 class](https://docs.unity3d.com/2022.3/Documentation/ScriptReference/Vector3-sqrMagnitude.html), which avoids that expensive square root operation.

+ _measuring results_

Finally, I wanted to measure how those changes affected my performance! I used [Profile Markers](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Unity.Profiling.ProfilerMarker.html) to do that, and these were the changes:

{{< figure src="/img/07_measurement.png" >}}

**Using OverlapSphere and Vector3.Distance would allocate 128 bytes to the Garbage Collector**, and **using OverlapSphereNonAlloc and the manual .sqrtMagnitude calculation would reduce that to 72 bytes**.

Honestly, considering I'll only ever have one instance of the PlayerInteract() class running, that's not a lot, and the code would definitely work fine either way. 

However, I always like to keep performance in mind, because there are times when this can make or break your game.

Or, to put it differently, they can be the difference between measuring your game's responsiveness in _seconds_... or _nanoseconds_!

________________________________________

_This post took me about ~03:30 hours to write! I use ProcrastiTracker to track my time._

{{< figure src="/img/07_writeTime.png" >}}

________________________________________

