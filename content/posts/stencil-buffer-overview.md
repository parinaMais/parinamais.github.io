---
title: 'Stencil Buffer Overview'
date: '2025-07-22T01:55:16-03:00'
summary: "A basic overview of the Stencil Buffer and an example implementation to create a flashlight effect."
description: "Last Updated: August 21, 2025"

draft: false
cover:
    image: gifs/02_StencilDark.gif
    alt: '---.'
    hiddenInSingle: true
tags: ["catching fishes", "devlog", "shaders"]
categories: ["devlog", "shaders"]

---
I want to start by sharing **two different visual effects that make use of the Stencil Buffer**. I made both of them for Catching Fishes, [my first game project](https://parinamais.com/posts/catching-fishes-devlog-01/).

**The first one is the bathroom's mirror**, which uses a combination of a stencil mask, a render texture, an additional camera, and a painted environment:

{{< figure src="/gifs/02_Mirror.gif" alt="Gif depicting a bathroom with a bald man walking on it towards a mirror. When he reaches the mirror, there's a speech bubble that says: I always look weird in mirrors" caption="The mirror will enable the secret existential crisis achievement!" >}}

As this shader uses other techniques unrelated to the stencil buffer, I won't be focusing on it. If you're interested in knowing more about it, I did a [small breakdown for Simon's website](https://simonschreibt.de/gat/sims-4-mirrors/#bonus) - *this was a huge honor and I love that website, please check it out!* 

**The second one is this flashlight**, which I'm currently prototyping to be used as a minigame mechanic:

{{< figure src="/gifs/02_StencilDark.gif" alt="Gif depicting a flashlight travelling through a dark screen, lighting what is on its path, until it finds a black cat" caption="Congratulations, you found Nelsinho! He was sleeping, and you disturbed it!" >}}

I implemented the mirror a few months ago and, honestly, stencils were a concept I struggled to understand. It was a trial-and-error approach, as I couldn't fully grasp what the values were doing. 

So, before adding the flashlight, I stopped to study them, and I ended up redoing the way I perform stencil operations. I then decided to write this post because, well, what's a better way to learn something than writing about it?

{{< figure src="/img/02_whatIsStencil.png" alt="Castlevania Symphony of the Night meme, saying What is a stencil? A miserable little pile of int values" caption="I know this should say stencil BUFFER, but I didn't want to kill the timing!">}}

I'll be breaking this into two parts: **what is the Stencil Buffer**, and **how I'm using it in Unity**. If you just want to read the implementation, you can skip to the second part!

### >> WHAT IS THE STENCIL BUFFER << 

Let's kick this off with [Unity's documentation](https://docs.unity3d.com/6000.1/Documentation/Manual/writing-shader-set-stencil.html) definition: 

> **The stencil buffer stores an 8-bit integer value for each pixel in the frame buffer.**

Basically, this means that **the stencil buffer will hold an int value, ranging from 0 to 255, for each pixel on the screen**, as it will be stored in 2D screen space. 

This might seem hard to understand, but it's actually quite simple, and it helps if we can visualize it. Unity doesn't offer a native way to do that, but UE5 does! So let's jump to that:

{{< figure src="/gifs/02_StencilViewUE.gif" alt="Gif in Unreal 5 changing the view mode from Unlit to Stencil Buffer" caption="Live footage of the famous Stencil Buffer!" >}}

With this, we can see that the definition was pretty straightforward. The buffer view shows the values that each object is writing: 01 for the stuff on the left, 255 for the wall on the right. 

Keep in mind that, even though UE5 adds spacing for readability, the values are actually stored *per pixel*. They are not, however, **set** per pixel: you can set them through a material or, in UE's case, through the static mesh, in which case they'll be the same for the whole object:

{{< figure src="/gifs/02_StencilChangeUE.gif" alt="Gif in Unreal 5 changing the view mode from Unlit to Stencil Buffer" >}}

It might not seem that impressive, but here's where it gets interesting: **for each pixel, you can use comparison operations between stencil values to decide what gets rendered!** 

Here's an example where I use this to establish what gets rendered in front, regardless of depth:

{{< figure src="/gifs/02_StencilCustomDepth.gif" caption="The object writing the value 3 always gets rendered in front, even when it's behind other objects" >}}

This ordering setup is essentially the logic behind my flashlight effect. So, let's get back to Unity for the breakdown!

### >> IMPLEMENTING STENCIL OPERATIONS IN UNITY << 

Previously, I was performing stencil operations through a combination of a mask shader and the use of renderer features (that setup came from [this video](https://youtu.be/EzM8LGzMjmc)).

Though it worked fine, I didn't want to have to change layers and features every time I performed a different comparison. I really wanted to be able to **solve it all through shaders**, and that's what I did!

The flashlight effect is a nice way to explain this, because it combines different stencil masks and operations, while still being quite simple. **It is basically comprised of these four parts**:

{{< figure src="/gifs/02_Flashlight_breakdown.gif" >}}

For the **Dark Background**, this is just a flat plane with a black texture on it, with one small addition to its shader: a **a Stencil Test Operation**. 

Here is that code snippet (the Stencil {...} goes before the CG/HLSL block):

```hlsl
Properties
{
    [IntRange] _StencilID ("Stencil ID", Range(0, 255)) = 1
}
SubShader
{
    Pass
    {
        Stencil
        {
            Ref [_StencilID]
            Comp Equal
            Pass Keep
        }
    }
}
```

The key lines here are: **Comp Equal** and **Pass Keep**. 

> *To learn more about keywords and test / write operations, check [Unity's Documentation](https://docs.unity3d.com/6000.1/Documentation/Manual/writing-shader-set-stencil.html#:~:text=Use%20the%20Ref%20%2C%20WriteMask%20%2C%20Pass,all%20Passes%20in%20that%20SubShader.)*.

**Comp Equal** defines what type of comparison will be made with the values stored in the stencil buffer. Equal means that **the object will ONLY render when the value stored in the stencil buffer is equal to the shader's reference value (in this case, the _StencilID property)**.

**Pass Keep** means that **the stencil buffer values will NOT be changed**. This means that **this shader DOESN'T write to the stencil buffer**, it only reads what is already stored there, and compares the values with its reference.

In fact, Keep is the default Pass value, so you can remove this line and the operation will still work!

Here's a visual example of how the dark plane works:

{{< figure src="/gifs/02_Flashlight_01.gif" caption="Here I am changing the plane's ID value from 0 to 1" >}}

You can see that, when my ID value is 0, the plane renders, but when I change it to 1 (or any other value, for that matter), it disappears. 

This is because **0 is the default value stored in the Stencil Buffer** and, as I'm only drawing this plane when its ref value is equal to the buffer value, the ref has to be 0 for it to match with the buffer and pass the comp test.

Now, **the object that actually writes new values in the stencil buffer is the Stencil Mask**. Both the flashlight and light texture masks use the same shader, and here's the complete code:

```hlsl
Shader "Helpers/SDR_StencilMask"
{
    Properties
    {
        [IntRange] _StencilValue ("Stencil Value", Range(0, 255)) = 0
    }
    SubShader
    {
        Tags 
        {
            "RenderType" = "Opaque" 
            "RenderPipeline" = "UniversalPipeline" 
            "Queue" = "Geometry-1" 
        }

        Pass
        {
            Blend Zero One
            ZWrite Off
            ZTest Always

            Stencil
            {
                Ref [_StencilValue]
                Comp Always
                Pass Replace
            }
        }
    }
}
```

Here, **we have the same Stencil Operations, Ref, Comp and Pass; but with different values**: we use **Comp Always** and **Pass Replace**.

**Comp Always** means that **the pixels will ALWAYS render**. Here, note that the previous lines (Blend Zero One, ZWrite Off and ZTest Always) are also important to get the effect we want, which is to render what's overlapping/behind the mask, and not the mask itself.

**Pass Replace** is the write operation. In this case, the shader will **write new values to the stencil buffer, replacing what was previously there**. Here's the visuals for the **flashlight stencil mask**:

{{< figure src="/gifs/02_Flashlight_02.gif" >}}

Remember that **the dark plane only renders when the stencil buffer value is equal to 0**, which is the default. 

Now, **I'm including a mask that CHANGES the buffer values to 1**, so the plane won't render on its location, and that is what creates the cut-out effect.

The **light texture** uses the same Stencil Operations as the dark plane, but with a **different ID value**. Here's how this looks:

{{< figure src="/gifs/02_Flashlight_03.gif" caption="Here I am changing the light texture's ID value from 1 to 0">}}

You can see the quad behaves the same way as the dark plane: it checks the values in the stencil buffer, and only renders when they are equal to its ID value. **The difference is that, while the dark plane has an ID value of 0, the light texture holds a value of 1**.

And **its value is set to 1 because I only want to render this texture in the region of the flashlight stencil mask**. This is why the texture fits inside the mask's area, even though the quad is actually larger than that (you could see that in action when I changed the ID value to 0).

*Remember that the dark plane and light texture values are not being written to the stencil buffer, they are just used to compare with what's already there.*

Now, there's a problem here: **I only want to render the light texture when it overlaps the dark plane**, because I don't want the light to be seen in an already lit environment.

To achieve this, I added a **SECOND mask**, which serves as the **light stencil mask**. 

**While the first mask writes the value of 1 (which is the ID value of the light texture), this one overwrites it with 2, which stops the light texture from rendering**:

{{< figure src="/gifs/02_Flashlight_04.gif" caption="Here you can see how the second mask values affect the light texture rendering">}}

It might look like all is well and done, but this creates another sneaky issue: **how do I make sure that my second mask is effectively overwriting the values of the first?** 

Well, here's where the **RENDERING QUEUE** comes to help.

{{< figure src="/gifs/02_Flashlight_05.gif" caption="Here I am showing the differenc in the Render Queue values: the first mask is set to 1999, and the second to 2001">}}

Here, you can see that the masks have **different render queue values**. **This is to make sure that the second mask will render AFTER the first one**, that is, that the 2's will overwrite the 1's in the stencil buffer (on the area of the second mask).

And Unity offers a neat way to see this in action: **the frame debugger**!

{{< figure src="/gifs/02_Flashlight_06.gif" caption="sorry for the poor resolution! this shows the sequence of values 1, 0 and 2 as the stencil refs">}}

Here, we can see that the drawing order works as intended: 
* First comes the **flashlight stencil mask**, writing 1 to the stencil buffer. 
* Then comes the **dark plane**, reading the stencil buffer values, and not rendering when they are different than 0. 
* Lastly, the **second stencil mask** writes 2 to the stencil buffer, which prevents the flashlight texture from rendering on the mask's area.

It's worth noting that the flashlight texture is transparent, so it is rendered on a later event (the DrawTransparentObjects).

**When working with stencils, rendering order is something that we have to pay attention to**: as this example shows, the values written on the buffer can change multiple times per frame, so it's important that we keep this in mind when reading/writing to it.

That was it for the flashlight! To wrap it up, let's see some...

{{< figure src="/gifs/02_stencilFinal.gif" caption="Where did he go??!? To Stencil Land!" >}}

### >> BONUS STENCIL EFFECTS << 

As I did my research to write this post, I found a bunch of other cool stencils implementations, and I really wanted to keep some registered! So here are some cool use cases:

1. **Creating outlines**, as explained by @ameye.dev [in this comment](https://www.reddit.com/r/Unity3D/comments/1iteg3s/comment/mdrlkgg/?context=3 ).

2. **Wind Waker uses it to create lights!** Here's an [awesome breakdown](https://youtu.be/mNndyHHNh78) by Minions Art.

3. And there's even a tool that uses it to **[visualize volume intersections](https://tech.metail.com/the-stencil-buffer-and-how-to-use-it-to-visualize-volume-intersections/)**! 

4. You can also use stencils to **mask out full screen post processing effects**! Here's an example:

{{< figure src="/gifs/02_maskOut.gif" caption="Where's Waldo for pixel art!" >}}

The way this works is quite simple: the Pixelation Filter comes from [a tutorial by Ben Cloward](https://youtu.be/x95xhWCxBb4), and the one thing you have to add is the **Enable Stencil** option on ShaderGraph (here I'm using **Ref 0** and **Comp Equal**).

You then apply this effect to the screen through a **Full Screen Renderer Feature**, and here comes the trick: 

> "In newer versions (maybe 2023.1 or Unity 6+) **the fullscreen feature has a "Bind Depth Stencil Buffer" option which would allow it to use stencil tests**.". 

This is an actual quote from [Cyan](https://www.cyanilux.com/), who helped me figure out how to enable this testing - check out his website and discord server! I had to update from 2022.3.8f1 to .62f1 for this to work.

Once you do that, it's just a matter of writing a different value to the buffer using masks, as we've already seen. As I'm applying this effect when the value is 0 (the default), all I did to mask it was **use a sphere that overwrites the buffer values to 1**. That's it!

Finally, **if you have anything you'd like to add or correct, please feel free to reach out!** I am still implementing this website's comments section, but in the meantime you can contact me through any of my socials. I'm always open to learning and evolving. 

Thank you for reading this, and hope to see you again soon!