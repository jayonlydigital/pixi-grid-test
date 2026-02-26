# pixi-grid-test

Task: 
Overlay a CSS grid  over a PIXI.JS grid, then apply a filter to the PIXI grid Sprite container.

Issue:
The CSS Grid and PIXI grid align as expected, until the filter is applied. When the texture is rendered offcanvas then applied to the Sprite container the texture appears to be scales to 120% and cropped on th right and bottom sides to still fit the render area.

Investigation: 
I have researched Shader Texture Coordinates in and out, Device Pixel Ratio, Renderer Resolution, and I've even used AI to debug the code to see if it can find the issue.

Visual Issue:
Image
