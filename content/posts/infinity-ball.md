---
title: 'INFINITY BALL: Physics, Loops and Collisions'
date: '2025-08-19T00:55:16-03:00'
summary: "Breakdown of INFINITY BALL, a game made in ~72 hours using custom physics."
draft: false
cover:
    image: img/03_infinityCover.png
    alt: '---.'
    hiddenInSingle: true
tags: ["infinity ball", "tech", "physics"]
categories: ["tech", "infinity ball"]

---

One of my biggest learning goals is getting better at Physics and Math (as my high school basis aren't that solid, I have a lot of ground to cover). Last year was pretty much focused on Vectors, Matrices and Trigonometry, but this year I've been dipping my toes into a different pool: **Kinematics and Dynamics**!

Studying projectiles, motion and forces made me realize how much these subjects relate to gamedev. It also gave me an idea for a project: **a small game built solely around vectors and their trajectories.** 

{{< figure src="/img/03_concept.png" alt="Scribbles of arrows and balls on a page, describing an idea for infinite loop" caption="official INFINITY BALL concept art! the first and only!" >}}

However, it was hard to develop this concept any further, as it lacked a focus point. Heck, you can even say that vectors and trajectories define every single game (yay math!). But then came GMTK Game Jam 2025 with a perfect theme to fit that idea: **[LOOP](https://itch.io/jam/gmtk-2025)**.

I joined the jam with my friend [Mayara](https://mayara.tech/), and we made **INFINITY BALL**: a game where you have to **find the path that bounces you in an infinite loop**! Tiny trailer:

{{< video src="/vid/infinity trailer.mp4" type="mp4" caption="my boyfriend was responsible for this awesome soundtrack!">}}

> **INFINITY BALL is available on PC and MOBILE, [click here to play!](https://parinamais.itch.io/infinity-ball)**

I was in charge of the game's physics, and **I didn't use any pre-built physics components**. This was made in Unity, but there are **no colliders or rigid bodies.** The physics were built from scratch using math and code!

This will be a high-level breakdown of how that's done. Here, **I'll focus on logic rather than implementation**, but if you are interested in checking out the screws and bolts, [the game's repository is public](https://github.com/parinaMais/Infinite-Loop)! (_this was made in ~72 hours, so it's NOT production-ready, and there's a lot to improve._)

With that said, let's move to **INFINITY BALL**'s core loop: **LOOPING!**

### LOOPS

> An important part of the loop logic is **being able to *detect when an infinite loop happens*, to let the player progress**. This detection system was crafted by my friend Mayara. She wrote an awesome breakdown on how it works, [click here to read it!](https://mayara.tech/gmtk-2025-the-loop-problem/)

Let's start by stating what defines an **INFINITE LOOP**: **it's when you keep moving constantly along the same path**. We can break this into two elements: **CONSTANT MOVEMENT** and a **REPEATED PATH**.

The ball's **MOVEMENT** is defined by its velocity, and **the velocity is ruled by the force you apply with your mouse**. To see this in action, I added some debug vector drawings: GREEN represents the mouse's force, and RED is the balls' velocity.

First, let's see what happens when the ball is standing still:

{{< figure src="/gifs/03_ballStill.gif" alt="Gif depicting a white ball getting propelled away with mouse input" caption="Don't worry about vector magnitudes, their visuals are capped to a fixed value. Focus on direction" >}}

In this case, **the ball's velocity will have the same direction as the mouse force**. So the trajectory will be solely determined by input. But, since floating in inertia isn't fun, you can change the direction mid-movement:

{{< figure src="/gifs/03_ballMoving.gif" alt="Gif depicting a white ball getting propelled away with mouse input" >}}

Now something different is going on! **The velocity and force vectors no longer match**. Could this be a bug? Is this post about to end?!?!

Let's stay calm! This happens because **the mouse impulse doesn't _overwrite_ the ball's velocity; instead, it is _added_ to it**. Here's how this works:

```c#
public void Integrate(float deltaTime) 
{
    velocity += forces * deltaTime;
	// here is where the mouse impulse force is ADDED to the velocity

    velocity = velocity.normalized * Mathf.Min(velocity.magnitude, maxSpeed); 
	// hacky way to cap max speed, large amounts would break collision detection

    position += velocity * deltaTime;
	// Euler's integration!

    transform.position = position.ToVector3(); //ToVector3() is an extension method
	// they are great! I learned how to implement them in Freya's Tool Dev intro

    ClearForces(); // this zeros the force vector
	// it serves to guarantee the impulse will only be applied once
}
```

This behaviour was meant to increase the difficulty of levels where you have to change your direction midway through. The downside is that the player loses control over the ball and, to be honest, this bothers me, so it might be something to reevaluate.

Design choices aside, **I actually know that overwriting the ball's velocity vector would also work**! In fact, there is a behaviour where that happens: bouncing!

{{< figure src="/img/03_shapess.png" caption="meet the shapes: Circley, Squares and Tricycle!" >}}

As kids say, *you can't loop if you don't bounce*, so **INFINITY BALL** has three different objects to bounce off: **circles**, **rectangles** and **triangles**. The catch here is that **each shape affects your trajectory in a different way**. 

**CIRCLES** will **flip your velocity**: you will keep following the same path, but in the opposite direction!

{{< figure src="/gifs/03_circlea.gif" alt="Gif depicting a white ball hitting a white circle, and being reflected away" caption="This is the simplest implementation, where ball.velocity = -ball.velocity" >}}

**RECTANGLES** will **flip one component of the velocity vector**, which means your trajectory will be inverted in one axis.

{{< figure src="/gifs/03_rectanglea.gif" alt="Gif depicting a white ball hitting a white rectangle, and being reflected away" caption="Rectangles use the reflection formula to change the ball's velocity: velocity - 2 * (velocity ∙ normal) * normal" >}}

Finally, **TRIANGLES** will **change your velocity to be in the direction of their normals**. To showcase this, I added another debug vector: BLUE for the triangle normals.

{{< figure src="/gifs/03_trianglea.gif" alt="Gif depicting a white ball hitting a white rectangle, and being reflected away" caption="To implement this, we keep the velocity's magnitude, and change its direction to be equal to -triangleNormal" >}}

It's worth noting that it doesn't matter *WHERE* you hit them, **each shape will *always* change your trajectory in the same way**. This is not how real-world physics behaves: it's actually a custom behavior designed to increase control over the ball's trajectory.

This has to do with the second part of an Infinite Loop's definition: **REPEATING THE SAME PATH.** Being able to predict what each shape will do to your trajectory, no matter where you hit it, was essential for the loops to work.

And, talking about physics, **this bouncing behaviour is how collisions are resolved:** when the ball collides with a shape, it bounces to keep it from going *INSIDE* that shape.

But, as I've said, this game doesn't use rigid bodies or colliders! So **how do we even know when collisions happen**?

{{< figure src="/gifs/03_triangleUpset.gif" caption="no shapes were harmed in the making of infinity ball" >}}

### DETECTING COLLISIONS

In this game, **the playable ball is the only object that collides with others**. And we know it can only collide with three types of shapes: a rectangle, a circle or a triangle.

So, to detect collisions, we have to **know every shape's location and boundaries** and **keep checking to see if they're overlapping with the ball**. Let's split this into two sections.

+ **LOCATION AND BOUNDARIES**

For starters, it's worth noting that **we are just using mesh _renderers_, not _colliders_**. So, even though we render a shape on the screen, **the physics logic has no idea of the shape's location or boundaries.**

To explain how we provide that information, let's start by looking at the **CIRCLE**. 

The **location** part is pretty simple: **the position vector of the transform component will output the circle's center**, and that's exactly what we want! 

For the **boundaries**, in the case of a circle they are uniform throughout the surface. So **we just have to set a radius!** And the transform component will be useful again, as we'll use the scale vector as a reference:

```c#
public class Circle : Bodies
// this is the circle shape class, but the ball's boundaries are defined in the same way
{
	private float radius;

	private void Awake()
	{
		radius = transform.localScale.x / 2f;
		// as the scale is uniform, I could have used any axis as a reference
		// passing the radius this way means that, when I change the transform's scale ...
		// ... I'm automatically changing the boundaries as well!
	}
}
```

**RECTANGLES** and **TRIANGLES** are a bit trickier. **Their boundaries are defined by vertices and edges**, so we need to consider that. Plus, this time we can't use transform position to output where they are, because **we need the position of each vertex**, and not the center.

To solve this challenge, I had an enormous source of help: [Pikuma's 2D Game Physics Programming course.](https://pikuma.com/courses/game-physics-engine-programming) I completed this course a while ago, and it was insanely helpful in making **INFINITY BALL** - you will see it mentioned multiple times in this section!

> _This isn't a promotion or anything, I just like to be upfront about everything that helps me out - and this course helped A LOT!_ 

{{< figure src="/img/03_exercises.png" caption="my course annotations, written in portuguese" >}}

I learned how to define polygons in Pikuma's Physics Course, using C++ and hardcoded values. So it was just a matter of translating that logic to Unity, to use C# and the transform component. 

To understand how that works, let's first think about **boundaries**. 

When loading polygon's vertices, it's useful to first define them in **[local space](https://learnopengl.com/Getting-started/Coordinate-Systems)**. In Unity, **we can use transform.scale to get the width and height**, which will essentially represent _how far each vertex travels in X and Y_. 

But, in order for collisions to work, we need to know **where those vertices are**, i.e., their location in **world space**. Here are the two coordinate systems:

{{< figure src="/gifs/03_localWorld.gif" >}}

So first, for local space, what we'll do is fill a vector array with the position values of each vertex relative to the polygon's center. Here's what that looks like in code:

```c#
public class Box : Bodies
{
    private float halfWidth, halfHeight;

	private Vector2[] localVertices = new Vector2[4];
	// for the triangle, we set 3 as the array size

	private void Awake()
	{
		// we want half the width and half the height because
		// the vertices are in local space, so the origin is at the center
        halfWidth = this.transform.localScale.x / 2.0f;
		// this time, scale axis matter: width is x
        halfHeight = this.transform.localScale.y / 2.0f;
		// and height is y
	}

	private void Start()
	{
		// vertex on inferior left corner
		localVertices[0] = new Vector2(-halfWidth, -halfHeight);
		// vertex on inferior right corner
        localVertices[1] = new Vector2(halfWidth, -halfHeight);
		// vertex on upper right corner
        localVertices[2] = new Vector2(halfWidth, halfHeight);
		// vertex on upper left corner
        localVertices[3] = new Vector2(-halfWidth, halfHeight);

		// for the triangle, we keep inferior left and inferior right,
		// and define the top vertex as (0f, halfHeight)
	}
}
```

Then, we have to translate them from local to world space. Luckily, this is a fairly simple and well-docummented operation! We'll typically use a model matrix for this, and here we have a decomposed version of that logic:

```c#
for (int i = 0; i < boxVertices.Length; i++)
{
	// transform operations are always done in this order:
	// first we scale, then we rotate, and then we translate

	// in this case, we accounted for the scale when we defined the vertices.
	// so we apply the rotation...
	boxVertices[i] = boxVertices[i].Rotate(transform.localEulerAngles.z);
	// and add the position offset
	boxVertices[i] += transform.position.ToVector2();
}

// .Rotate() is a vector extension method, here's the snippet:
public static Vector2 Rotate(this Vector2 v, float angle)
{
	float radians = angle * Mathf.Deg2Rad; // I'm converting from degrees to radians
	// because that's what Unity expects on Mathf.Cos() and Mathf.Sin()

	Vector2 result = new(v.x * Mathf.Cos(radians) - v.y * Mathf.Sin(radians),
						v.x * Mathf.Sin(radians) + v.y * Mathf.Cos(radians));
	// this is the rotation matrix!
	return result;
}
```

With this, **we finally know where are all of our shapes, and what are their boundaries**! This is also true for the playable ball, as we can just use the circle logic for it. Time to move on to part two:

+ **CHECKING FOR OVERLAPS**.

As we saw, circle's boundaries and location are easy to define. And their collision detection is also easy! When checking to see if the ball is colliding with a circle, we're essentially  **evaluating collisions between two circles**.

And we can solve that by: **calculating a vector that goes from one circle to the other** and **checking to see if that vector's magnitude is less than the sum of their radius**. Here's a gif showcasing this:

{{< figure src="/gifs/03_circlecircle.gif" alt="Gif depicting to white circles with a line connecting them" caption="when a collision is detected, the line between the circles turns red" >}}

However, **detecting collisions between the ball and rectangles/triangles is a bit trickier**. Here **we're evaluating collisions between a circle and a polygon** and, again, it's something I learned on Pikuma's course!

As I didn't have much time, my in-game implementation was almost a copy-paste from the one I learned on the course (I only translated it from C++ to C#, which was very straightforward). 

But, instead of just repeating that once more, I rewrote the logic to add gizmos and visually demonstrate how it works. I'll use a rectangle as the polygon reference, but it works the same for triangles.

So, to check if the ball and a rectangle are overlapping, the first thing we have to do is **find the edge that's closest to the ball's center**.

For that, we need three things: **vectors connecting the ball and the rectangle's vertices**, the **normal of the rect's edges** and **a dot product**. Here's how that works:

{{< figure src="/gifs/03_overlap_01.gif" caption="The dot product checks how aligned these vectors are, and we are looking for the best alignment (parallel, returns 1)" >}}

Now that we have the closest edge, we **check to see where the ball's center is**. Here are the possible scenarios:

{{< figure src="/gifs/03_regions.gif" caption="regions A B and C are all relative to the closest edge" >}}

**Collision will be evaluated differently depending on where the ball is, so we have to determine if it's in region A, B or C.** 

Again, vectors and dot products will help figure this out. We'll use vectors that go from both of the edge's vertices to the ball, as well as the edge itself:

{{< figure src="/gifs/03_regionsDetecting.gif" caption="remember: the return of the dot product depends on the direction of the vectors" >}}

Finally, now that we know where the ball is, **we just have to check if the magnitude of the vector that points to it is greater than its radius**. If it isn't, that means we're colliding! Here's how that looks:

{{< figure src="/gifs/03_regionsDetectingCol.gif" caption="finally, collision detection!" >}}

You can see that, for regions A and B, **we're just using the vectors coming from the top and bottom vertex, pointing towards the ball**. 

But, for region C, we're using a new vector. Think of its direction as the edge's normal, but what's important here is the magnitude: **it's equal to the dot product between the edge's normal and the vector that goes from the top vertex to the ball**.

This works because we can view a dot product as a "projection" value: [Akuli.github](https://akuli.github.io/math-derivations/vectors/dot-projection.html) is a good resource for visualizing this. 

With that in mind, **we can think of the dot product between the vertex-to-ball vector and the edge's normal as the magnitude of the vertex vector projected onto the normal**, which translates to the distance between the ball's center and the edge.

Wow! That was a lot, but we're finally done! We finished the physics of INFINITY BALL!

{{< figure src="/img/03_ending.png" caption="this is the end game screen! congratulations, you did it! time to try again and reach a lower score!" >}}

## Wrapping Up

As far as my initial goal went, **INFINITY BALL** made me pretty proud! It's built around vectors and trajectories, and even though the physics still need a lot of improvement, I'm happy with what I accomplished!

To touch on what the future holds, I truly believe this has potential as a fun & casual mobile game. We don't have a lot of time to work on this (my friend and I have other projects going on), but the [jam's feedbacks](https://itch.io/jam/gmtk-2025/rate/3774607) provided some cool directions for us!

So we have some thoughts on things to add. If that works out, who knows, maybe one day we'll finally get to see the shapes fighting back! Stay tuned for...

**INFINITY BALL 2 - REVENGE OF THE SHAPES!**

{{< figure src="/gifs/03_revenge.gif" caption="you really shouldn't have hit those tiny triangles!" >}}
