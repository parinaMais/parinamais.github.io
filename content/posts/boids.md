---
title: 'BOIDS'
date: '2025-11-03T00:59:08-03:00'
summary: "Boids!"
draft: false
cover:
    image: img/05_coverr.png
    caption: b-o-i-d-s
    hiddenInSingle: true
tags: ["catching fishes", "devlog", "boids", "fishes"]
categories: ["catching fishes", "devlog"]
---

> Hey! Have any **feedback** or **corrections**? Please feel free to reach out!   
> _I'm always open to improve, and will gladly edit this page to include more information._

The first time I tried implementing Boids behaviour was about two years ago. At the time, I was starting out with gamedev, and... **I failed miserably**.

I remember having trouble grasping the logic (and math!) behind it. And tutorials would only get me so far, since I'd quickly run into performance issues.

Since then, I have studied lots of gamedev-related topics (including math!), so my skills have improved. Last month, I tried implementing boids again - and this time I could actually understand what I was doing! 

So now I have my very own Boids algorithm, built for **Catching Fishes**:

{{< figure src="/gifs/05_BoidsInContext.gif" alt="gif of several small blue fishes swimming in a bathroom with a bald man on the center" caption="He's thinking: BOIDS!" >}}

This is my first Boids implementation, so it's a **BB**: **Beginner Boids**. It has lots of limitations, some that I know of, and others that maybe you can tell me about.

But this post is about explaining how it works. I figured that, since this is a hard topic for beginners, it might be worth writing about it in a **beginner-friendly way!**

So I'll explain everything from the ground up: starting with [logic and math](#logic-section), then the [visuals](#visuals-section), and finally, I'll share my [Unity Implementation](#unity-section). 

If you want, feel free to skip ahead to any section! For now, let's start with the logic:

## ABOUT A BOID {#logic-section}

**The word BOID stands for "bird-oid object"**, and it describes [an algorithm developed by Craig Reynolds](https://www.red3d.com/cwr/boids/) to **simulate flocking behaviours**, such as birds and (as you'll see here) fish. 

Basically, **we set three steering rules that each boid must follow**, and the combination of these rules creates the flock-like movement.

This might sound complicated, but each rule can be explained through **vector math**! [Conrad Parker has an amazing breakdown](https://vergenet.net/~conrad/boids/pseudocode.html) that deals with the math through pseudocode, and it's what I'll be using as my main resource.

And, since I'm a visual learner, I'll showcase this in the best way I can: with gifs of paper fishes on a grid!

{{< figure src="/gifs/05_GridBoids_Presentation.gif" alt="4 scribbled paper fishes sitting on a orange grid" caption="Please don't interact with the boids!" >}}

Now, let's talk about **BOIDS RULES**! They are: **COHESION**, **SEPARATION**, and **ALIGNMENT**.
### COHESION

**COHESION** can be viewed as the essence of flocking, because it's the rule that drives boids to stick together. It states that **each boid will try to swim towards the _average center position_ of the other boids**. Here's what that average center looks like:

{{< figure src="/img/05_Cohesion_Average01.png" alt="scribbled fishes sitting at a square formation with arrows pointing to the center" caption="If we hit an imaginary play, all boids will swim towards the center point at (0,0)" >}}

Translating this to math, there are only two simple steps towards finding our center:
+ first, **we add up the position of every boid**. Using the above picture as our reference, this means adding (-2,0) + (0,2) + (2,0) + (0,-2), which outputs (0,0).
+ lastly, **we divide the result by the number of boids**, and this is what gives us the average. Here, this would mean dividing (0,0) / 4, which, you know it, still outputs (0,0)!

And remember this is a constant calculation, so if I change my boids' positions, their average center will also change:

{{< figure src="/gifs/05_GridBoids_ChangingCenter.gif" alt="paper fishes being dragged through a grid, with their arrows changing with the position" >}}

Now, even though our math is correct, I did simplify things just to get us started. 

Our definition of **COHESION** states that each boid will try to swim towards the center of the **OTHER** boids.

This means each boid must **NOT** consider itself when averaging positions. So, in reality, **we will end up having a different perceived center for every boid:**

{{< figure src="/gifs/05_GridBoidsHiCarl.gif" alt="the grid of paper fishes now has 4 centers, and the fish named Carl is saying hi!" caption="Why is Carl saying hi to us??" >}}

> The term _perceived center_ comes from Conrad Parker's [breakdown](https://vergenet.net/~conrad/boids/pseudocode.html).

This may seem a bit more complicated, but remember, we're still dealing with the same math operations! It's just that, instead of performing them once, we are now calculating things _per-boid_ (in this case, four times).

To showcase this, let's calculate Carl's perceived center:

+ first, **let's add up the position of every boid BUT CARL**. Excluding Carl, we're adding (-2,2) + (2,3) + (7,-3), which outputs (7,2).
+ second, **we divide the result by our number of boids - MINUS CARL**. So we divide (7,2) / 3, which outputs... (2.333,0.666).
+ lastly, I **rounded the result** so everything fits nicely in the grid. If we round 2.333 and 0.666 to the nearest integer, we will get... (2,1)! Carl is swimming in the right direction!

{{< figure src="/gifs/05_GridBoidsWalkingCarl.gif" alt="Gif of a fish named Carl swimming towards his center and saying joyful things" caption="Please refrain from being happy for Carl. He's actually very mean to the other boids." >}}

When Carl moves, his perceived center stays the same, but **the other boids' centers change**. This is due to the fact that, while Carl isn't considering his own position, the other boids are.

It might seem like a subtle difference, and here it actually is. But when we increase the model's complexity and the number of boids, this small change helps to keep the movement more fluid.

To close this up, let's finally hit that imaginary play and watch all boids group:

{{< figure src="/gifs/05_GridBoidsTogether.gif" alt="gif of 4 paper fishes grouping and shouting how they don't want to be together" >}}

As you can see here, if we let cohesion take the reins the boids will just stick together. That's not good, because these fish clearly don't want to be with each other! So let's give them what they want.

### SEPARATION

Maybe it's true that _birds of a feather stick together_, but when it comes to birds of a flock, they actually need some healthy distance!

**SEPARATION** is very simple: **boids should try to keep a small distance from each other**. Again, let's use Carl as our reference to visualize this:

{{< figure src="/img/05_Separation.png" alt="TODO" >}}

What I'm doing here is tracing 3 connecting vectors, each one going from Carl to a different boid. This is done by **subtracting the position of each boid by Carl's position.** Let's take the boid at (-1,1) as our reference (his name is Stevie, by the way!):

+ if **we subtract Stevie's (-1,1) position by Carl's (-3,-2), we will get (-1 - (-3), 1 - (-2)), which outputs (2,3)**. And (2,3) are the exact coordinates of the vector connecting Carl to Stevie!
+ this is because, when we subtract Stevie's position by Carl's, we're essentially getting a vector that goes **FROM** Carl **TO** Stevie (_end point minus start point_). 
+ a closer look at the grid makes us visualize what the connecting vector's coordinates mean: **if we are at Carl's position, and we move 2 tiles to the right and 3 tiles up, we will reach Stevie**!
+ and, once we have this connecting vector, we can figure out the **DISTANCE** between Carl and Stevie! This is done by taking the **MAGNITUDE of the connecting vector**, which is basically a float value that represents its **LENGTH**.
+ the **magnitude formula is √(x² + y²)**. For our (2,3) vector, we will have √(2² + 3²), resulting in a magnitude of √13, which is about ~3.60. And that's how far Stevie is from Carl!

With that, we have all the information we need to help them maintain a healthy distance! Let's say we want Carl to stay **ONE TILE away** from every other boid. 

All we have to do is constantly test our connecting vector's magnitude, i.e., our DISTANCE, against that one tile threshold. When the distance would be less < than one tile, we push the boid away!

{{< figure src="/gifs/05_GridBoidsSeparation.gif" alt="gif of paper fishes moving, they go away when Carl gets close" >}}

Again, let's use Stevie and Carl to understand the math behind pushing:

{{< figure src="/gifs/05_GridBoidsSeparation01.gif" >}}

+ notice **the connecting vector's coordinates change according to where Carl is in relation to Stevie**. When Carl is to the left of Stevie, the X values are positive; and they are negative when he's on the right. This is also true for top and bottom: Y values are positive when Carl is below Stevie, and negative when he's on top.
+ so we can use this to know **where Carl's coming from**, **and then we know what direction to push Stevie in!**
+ for my grid implementation, I'm actually pushing Stevie in the same direction as the connecting vector: **for instance, if the X values are positive, I add +1 to Stevie's X. If they're negative, I subtract 1 to Stevie's X**.

That's it for separation! And, now that the boids spent some time apart, they are finally ready to get back on the same track. It's time for...

### ALIGNMENT

You see, one crucial thing about these boids is: **they are aware of each other.** They all know Carl sucks, and they also know Suzie will just go back to him anyway!

Aside from knowing each other's personalities, they also know their positions and velocity. The positions were relevant for our **COHESION** bit, and velocities will serve our **ALIGNMENT**, because: **boids try to match the velocity of other boids.**

> Again, this rule definition comes from Conrad Parker's [breakdown](https://vergenet.net/~conrad/boids/pseudocode.html).

To start out, here's what their velocity vectors look like:

{{< figure src="/img/05_alignmentImg.png" alt="4 paper fishes sitting on a yellow and brown grid with arrows pointing to the right" caption="here the velocity arrows all have the same size, but in reality, they would vary with the vector length" >}}

This time, we don't have our usual written vector coordinates! But don't worry, we can deduce them anyway:

+ first, you can see **each boid has a different movement speed**, ranging from 1.0 to 1.6, measured in tiles per second. We can also see **they'll all move in the same direction**: to the right!

+ if we know **how much they will move** and the **direction they're going**, we can **reconstruct their velocity**. From Stevie to Suzie, the velocity vectors are: (1.0, 0.0), (1.4, 0.0), (1.2, 0.0) and (1.6, 0.0). 

+ and, to make them move, all we have to do is **add the velocity to their position**.

Since all of the boids have 0 in their Y value, they should all only move to the right, albeit at different paces, but each at a constant rate:

{{< figure src="/gifs/05_GridBoidsAlignment_01.gif" >}}

Even though they all start in the same X location, the difference in their speeds makes the distance between them increase at each movement step.

With that, well, they don't look very aligned. **The purpose of alignment is that their velocities should eventually match**. So let's make that work:

{{< figure src="/gifs/05_GridBoidsAlignment.gif" >}}

This time, their velocity isn't constant. It changes at every movement step, and it only stops changing when all boids are traveling at the same speed! Here's what's happening:

+ at every second, **we add all of the boids' velocities**. We know their vectors are (1.0, 0.0) + (1.4, 0.0) + (1.2, 0.0) + (1.6, 0.0), which outputs (5.2, 0).

+ we then **divide this result by our number of boids**, so (5.2, 0) / 4, outputting (1.3, 0). Now we know **our average velocity**. We could keep each boid from considering itself, in the same way we did with **COHESION**, but we won't do that here.

+ to make all of our boids align, **we need to know how far from average each boid is**. So we subtract the average velocity by each current velocity (ex: for Suzie, this would mean subtracting (1.3, 0) - (1.6, 0), ouputting (-0.3, 0)).

+ lastly, **we add that difference to each of our boid's current velocities**. Again, using Suzie as our reference, this would mean adding (1.6, 0) + (-0.3, 0), which would bring us exactly to our average of (1.3, 0).

+ one final note is, in order to do this in steps, **we can multiply our velocity difference by a decimal** (for that gif, I'm using 0.2), before adding it back to our current velocity.

Ok! We're almost done with **ALIGNMENT**, let's just check one more example:

{{< figure src="/gifs/05_GridBoidsAlignment_02.gif" >}}

While the boids start in different directions, they all end up going in the same way. This is because, when aligning **velocity**, we also have to **align our directions**. This speaks to the difference between velocity and speed:

**Speed is a scalar value**, meaning _how fast_ an object is traveling. **Velocity, however, is a vector**, so while it informs us of _how fast_ an object is (via its magnitude), it also outputs _its travel direction_.

That is why **aligning velocity is more than just aligning speed**: we need to make sure we also take directions into account (the math showed above already does that, I just wanted to make it explicit).

Now we're truly done with the logic and math! 

The paper fishes were cool, but I hope you're ready to say goodbye to them. Because, in the cover image, I had **BLUE 3D FISHES**! Where did they go, and how do they live?

## A FISH IS BORN {#visuals-section}

Each boid is a 3D fish model, and a _very_ simple one. In fact, the model that made it into the game was the same one I drafted as a quick test. Here's my boi(d): - _fin-tastic pun suggested by Carl S, thank you!_

{{< figure src="/img/05_fishCloseup.png" alt="3D image of a blue fish with its eye open and a red mouth, side by side with an image of the model's texture" >}}

As you can see, this truly was a 10-minute job! We could probably pinpoint a ton of things to improve, starting with the obvious UV bleeding on the left of the mouth. And a lot of these issues are simple to fix - just to prove it, let me stop that bleeding right now:

{{< figure src="/gifs/05_BleedingFix.gif" alt="close up of a 3D model of a fish and its texture" caption="I opened most UV islands using project-from-view, which caused this overlap. Now it's fixed!" >}}

This still isn't perfect, but hey, it's already a bit better! But before I swim into deep waters, let me just say **my final game model still has the bleeding UVs, and I won't change that**. 

To understand why, let's check out what my fish looks like in the real game screen size:

{{< figure src="/img/05_fishInGame.png" >}}

You can see **my in-game fish are very tiny and covered by a pixelation filter**. That makes it pretty much impossible to spot the UV problem. And, if we can't even notice it, is it really a problem?

This may seem like a detour, but striving for perfection has been detrimental to my development time. So I'm trying to highlight that things aren't always perfect, and it's often best to ask _how noticeable_ something is, instead of _how good can it get_.

However, this doesn't mean I haven't been thinking of invisible improvements, such as optimization! Speaking of that, let's look at the **fish texture**:

{{< figure src="/gifs/05_BoidsTexture.gif" alt="gif of a photoshop image file showing different information stored in each RGBA channel" caption="I swear this amounts to a fish!">}}

What I'm doing here is taking **a RGBA texture and storing a black and white mask on each of its channels**. This is a very common and well-documented technique, and helps in keeping our texture efficient.

Here, each mask serves a different purpose: 
+ **RED marks the eye**, 
+ **GREEN separates the mouth from the body**, 
+ **BLUE gives us shadows**, 
+ and **ALPHA stores the pupil**. 

Then, all I have to do is reassemble my fish in Unity:

{{< figure src="/img/05_textureReconstructing.png" alt="3D image of a blue fish with its eye open and a red mouth, side by side with an image of the model's texture" caption="fish reconstruction, a very delicate operation">}}

The reason why I did this was because I wanted to be able to change colors in real time, and these masks allow me to do just that! Since my GREEN channel separates mouth and body, I can use it to easily change the body color inside Unity.

{{< figure src="/gifs/05_RainbowFish.gif" alt="gif of a photoshop image file showing different information stored in each RGBA channel" caption="Here I'm just changing the FishColor property, as seen in the previous pic">}}

That also helped in keeping my shader fast, since I have multiple colors while only performing one Texture Sample operation (these can be costly). I wanted to have lots of these guys swimming around at once, so performance was always on my mind.

And another layer to that line of thought was the **swimming animation**. I wanted the fish to be animated, but I didn't want to rig them! So I took the quick road: a **vertex displacement shader.**

{{< figure src="/gifs/05_ShaderAnim.gif">}}

You can see that, again, this is far from perfect, and there's a lot to improve! 

[This Boids project by George Keppy](https://www.artstation.com/artwork/2BZq2x) is a good example of how far vertex animation can go: aside from the tail, he added a bobbing movement for the head, and even a rotation for the body!

However, this simple animation fitted my game & timetable, so that's what I have to showcase. I'll now explain the logic behind it. **BREAKDOWN TIME!**

The first thing I did was to:

+ **define the axis where I want this animation to happen**. Since it's a tail-swing, I want it to be from "left to right" of the fish, which in my case is the Blue Channel / Z-Axis of the Object's Position node:

{{< figure src="/gifs/05_ShaderBreakdown_1.gif" caption="Beware the channel you'll use from Object Position may change according to your model's orientation">}}

**I later replaced the 'AddToPosition' variable with a Sine**, outputting values between -1 to 1. This still follows the same logic of making the fish go left to right, only now I'm capped inside a looping interval that goes from negative to positive.

{{< figure src="/gifs/05_ShaderBreakdown_2.gif">}}

You can see I also added two more variables: 

+ **one that multiplies Time, to change my speed**, and 

+ **another that multiplies the Sine output**, to remap it from -1 to 1 to, in my case, -0.25 to 0.25, **making the displacement smaller.**

Finally, I'm using another axis from my Object's Position (Red / X) to **create a gradient in the fish body**. I've plugged this gradient into the color output, so we can have a better understanding of what's going on:

{{< figure src="/gifs/05_ShaderBreakdown_3.gif" caption="Once again, the Object Position channel may change with your model's orientation">}}

The gradient defines that:

+ **the head region will be black, and the tail will be white**. This means **the head vertices will output a value of zero, and the tail vertices will output 1**. 

When **I multiply this by my Sine Displacement, I'll keep the displacement values for the tail, but I'll turn them into zero for the head**, effectively making it stand still.

Finally, if you want to check out the whole thing, here's the final shader:

{{< figure src="/img/05_SwimmingShader.png" alt="A print of a part of a Unity Shader Graph, showcasing a vertex displacement shader" >}}

With that, we're done with the visuals! This means we're reaching the end of our journey, and it's time to check out how I implemented everything in Unity.

## BOIDS DON'T CRY {#unity-section}

What I'll share here is my **_real_ in-game boids code**. What this means is:

+ this is the code that made it into my game! It works and **it's fully functional**...
+ **for my purposes.** I'm currently using this to spawn only 200 boids, clocking in at ~80FPS:

{{< figure src="/img/05_BoidsPerformance.png" caption="My boids stats: ~80FPS, CPU 12.3 ms and GPU 8.7ms. I'm CPU-bound!" >}}

This isn't good. While it works for me, 200 boids isn't high at all, and if I increase this number to, let's say, 800 boids, I dip to ~7FPS. That's far from functional.

The reason I'm sharing this anyway is: maybe these **limited** boids can work for you, in the same way they worked for me! Plus, this will also be a chance to **open my code up for discussion and learn how to improve it further!**

With that out of the way, here's how my system works: I have my boids divided in two classes (my reference for this was this [video by GameDevChef](https://youtu.be/mBVarJm3Tgk)). 

The first is a **BOIDS CONTROLLER**.

```c#
public class BoidsController : MonoBehaviour
{
    [HideInInspector] public Boid[] boids;

	[Header("Spawn Setup")]
	[SerializeField] private Boid boidPrefab;
	[SerializeField] private int flockSize;
	[SerializeField] private Vector3 spawnBounds = new(3, 3, 3);
	[SerializeField] private Transform container;
	[Header("Speed Setup")]
	public Vector2 minMaxSpeed;
	[Header("Distance Setup")]
	public float radius = 7;
	
	private void OnEnable()
	{
		SpawnBoids();
	}

	private void SpawnBoids()
	{
		boids = new Boid[flockSize];
		for (int i = 0; i < flockSize; i++)
		{
			Vector3 randomVector = UnityEngine.Random.onUnitSphere;
			randomVector = new Vector3(randomVector.x * spawnBounds.x,
				randomVector.y * spawnBounds.y,
				randomVector.z * spawnBounds.z);
			Vector3 spawnPosition = transform.position + randomVector;
			var rotation = Quaternion.Euler(0, 
                                UnityEngine.Random.Range(0, 360), 
                                0);
			boids[i] = Instantiate(boidPrefab, 
                                spawnPosition, 
                                rotation, 
                                container);

			boids[i].InitializeBoid(this);
			boids[i].speed = UnityEngine.Random.Range(
                                minMaxSpeed.x, minMaxSpeed.y);
		}
	}
}
```

This could actually be called BoidsSpawner, because that's all it does! Basically, I'm using this class **as a container for my boids' configurations**, and **passing these configs to each boid when they are instantiated.**

The one problem I have with this is my **public** variables. I usually refrain from doing that, since it's not good practice and can lead to issues. But here, honestly, I just had spent so much time on the boids system that I simply left them in.

The real heavy lifting is done by my second class: the **BOID**. This is the script that effectively implements the boids logic, and it's also the main source of my problems.

I won't explain the logic again here, it's _almost_ the same thing we've seen in the first section! I will, however, comment on what I see as places to improve / worth highlighting.

**To do that, I added _numbered fish comments ><((º>_ to my code, and will discuss each one at the end.** Now, here's the code:
``` c#
					// ><((º> _1_
public class Boid : MonoBehaviour
{
	// ><((º> _2_
	private Vector3 moveDirection;
	public float speed;
	private Vector3 velocity;

	private Boid[] boids;

	private Vector3 cohesion;
	private Vector3 separation;
	private float alignSpeed;

	// ><((º> _3_
	BoidsController boidController;
	private Transform myTransform;

	public void InitializeBoid(BoidsController boidController)
	{
		boids = this.boidController.boids;

		// ><((º> _3_
		this.boidController = boidController;
		myTransform = this.transform;
	}

	private void Update()
	{
		MoveUnit();
	}

	private void MoveUnit()
	{
		EnforceBasicRules();

		moveDirection += cohesion + separation;

		// ><((º> _2_
		velocity = moveDirection.normalized * (speed + alignSpeed);

		// ><((º> _4_
		if (velocity == Vector3.zero)
			velocity = myTransform.forward;

		myTransform.forward = velocity;
		myTransform.position += velocity * Time.deltaTime;
	}

	private Vector3 directionVector;
	private void EnforceBasicRules() 
	{
		cohesion = Vector3.zero;
		separation = Vector3.zero;
		directionVector = Vector3.zero;
		// ><((º> _5_
		float averageSpeed = 0f;

		if (boids.Length == 0)
			return;

						// ><((º> _6_
		for (int i = 0; i < boids.Length; i++)
		{
			if (boids[i] != this)
			{
				// Cohesion Rule
				cohesion += boids[i].myTransform.position;

				// Separation Rule
				directionVector = boids[i].myTransform.position - myTransform.position;
				// ><((º> _5_
                float sqrRadius = boidController.radius * boidController.radius;
				if (directionVector.sqrMagnitude < sqrRadius)
					separation -= directionVector;

				// ><((º> _2_
				// Alignment rule
				averageSpeed += boids[i].speed;
			}
		}

		cohesion /= boids.Length;
												// ><((º> _5_
		cohesion = ((cohesion - myTransform.position) * 0.01f).normalized;

		averageSpeed /= boids.Length - 1;
		alignSpeed = (averageSpeed - speed) * 0.125f;
	}
}
```
// ><((º> // **1** - **I'm not sure if BOID as a Monobehaviour class is a good idea**. 
+ the way I structured this is that each boid is responsible for its own movement. To do this, each boid is accessing its own transform, and therefore inherits from Monobehaviour.
+ **since I have 200 boids, this means 200 Update functions are being called at every frame**. It's already a significant cost, even without considering the for() loop that goes into them (we'll talk about that!)
+ one possible solution is in this [amazing video by Tarodev](https://youtu.be/6mNj3M1il_c). He talks about the benefits of having **a separate controller moving all of our objects**, and his logic might be applicable here.

// ><((º> // **2** - **I only align speed, not velocity**
+ in my boids alignment, **I'm only averaging speed, not movement direction** (I explained this distinction in the logic section). This isn't a problem, it was a personal choice to get the look I wanted from the boids.
+ to do that, **I separated the velocity vector logic into the moveDirection vector and the speed float.**
+ I then use this line **velocity = moveDirection.normalized * (speed + alignSpeed)** to reconstruct my velocity vector, after tweaking each component separately.
+ moveDirection is normalized because I don't want its magnitude to add up to my velocity - it's actually the speed float that gives the velocity's magnitude.

// ><((º> // **3** - **Caching External calls**
+ this was, again, a technique I learned on [Tarodev's video](https://youtu.be/6mNj3M1il_c). **I save the Transform and the BoidsController as local variables**, instead of always accessing them externally. 
+ this improved my performance by _A LOT_. For the Transform, **it made me jump from 56 FPS (17.70 MS) to 90 FPS (11.10 MS)**.

// ><((º> // **4** - **Avoid Look Rotation Viewing Vector is Zero**
+ just a simple fix to an annoying warning. **I added a default value for when velocity is zero** to solve Unity's "Look Rotation Viewing Vector is Zero".

// ><((º> // **5** - **Avoiding an expensive math operation**
+ Unity has **two ways of outputting a vector's Magnitude: .magnitude or .sqrMagnitude**. In the logic section we saw that taking the magnitude requires a square root operation, which can be expensive. So sqrMagnitude outputs our magnitude **squared**.
+ this ends up being cheaper, because we don't have to take the expensive square root. **To compensate for it, I just square the radius as well**.
+ I also used the "avoid expensive operations" logic in my Cohesion multiplication factor. Instead of multiplying the cohesion by 0.01, I could divide it by 100.
+ but **multiplication is generally cheaper than division**. Since we're talking about a logic that will be executed several times, that might be worth paying attention to.

// ><((º> // **6** - **My Moby Dick: O(n²)**
+ this is the biggest problem I see in my script. **I have 200 boids in my boids[] array, and each boid is iterating through all other boids**. 
+ this gives my algorithm a complexity of O(n²), which, translated into numbers, means my **200 boids will perform 40.000 distance checks _per frame!_**.
+ I tried implementing [spatial grids](https://youtu.be/sx4IIQL0x7c) to solve it, but I ran into a problem because I want _all_ of my boids to be sincronized, and not just a few groups.
+ **one solution that might be viable is having a separate controller to move the boids**, like I mentioned in the first fish. I didn't test this enough though, so my Moby Dick remains free from my coding harpoon 😨

That's it! On a final note, you might be wondering why I didn't fix some of the problems I pointed out. 

Well, the truth is I tried!

I gave myself one day to try some improvements, and these notes were the result of that day. So, basically, this is what I could get done, in the time table that I had!

It has problems, it's far from perfect, but maybe that's ok. Making a game is hard enough as it is, and I fear that if I try to make everything perfect I just...

won't catch that fish.

{{< figure src="/gifs/05_CarlLaughing.gif" caption="shut up, Carl!!">}}

________________________________________

_Hi! Since we're living in times where people believe everything can be done in the press of a button, I decided to include how long it takes me to write these posts:_


{{< figure src="/img/05_howlong.png" caption="I write my posts in VSCode, and use ProcrastiTracker to track my time.">}}
_**It took me ~13 hours to write this post!**_