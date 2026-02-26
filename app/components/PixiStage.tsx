"use client";

import { useEffect, useRef, useMemo } from 'react';
import * as PIXI from 'pixi.js';
import { Application, ApplicationRef, extend, useTick } from '@pixi/react';
import { defaultFilterVert, Filter, GlProgram, Sprite, Texture } from 'pixi.js';

extend({ Sprite, Texture });

const SIZE = 800;
const gridSquarePixelSize = 91

const fogFragmentShader = `#version 300 es
  precision mediump float;

  // Receive the texture (sprite map) and a mask indicating sprite presence.
  uniform sampler2D uSpriteMask;       // 1 if a sprite exists, 0 otherwise
  in vec2 vTextureCoord;

  out vec4 outColor;

  void main() {
      // Sample the sprite presence mask at this fragment's coordinates:
      float hasSprite = texture(uSpriteMask, vTextureCoord).r;

      // Only render color if there is a sprite, otherwise output fully transparent
      if (hasSprite > 0.5) {
          outColor = vec4(1.0, 0.5, 0.0, 1.0); // visible color (orange)
      } else {
          outColor = vec4(0.0, 0.0, 0.0, 0.0); // transparent
      }
  }
`;


export function PixiStage() {

  const appRef = useRef<ApplicationRef>(null);
  const fogContainer = useMemo(() => new PIXI.Container(), []);
  const spritesRef = useRef<Map<number, PIXI.Sprite>>(new Map());
  const fogSpriteRef = useRef<PIXI.Sprite | null>(null);
  const fogDebugLoggedRef = useRef(false);

  useEffect(() => {
    const sprites = spritesRef.current;
    return () => {
      fogContainer.destroy({ children: true });
      sprites.clear();
    };
  }, [fogContainer]); 


  useEffect(() => {
    const app = appRef.current?.getApplication();
    if (!app) return;
    app.renderer.screen.width = SIZE;
    app.renderer.screen.height = SIZE;
  }, [SIZE]);


  function updateShaderUniforms(fogFilter: PIXI.Filter, deltaSeconds: number): void {
    const uniformsResource = fogFilter.resources.fogUniforms;
    const deltaTicker = deltaSeconds * 0.001;
    uniformsResource.uniforms.uTime += deltaTicker;
    uniformsResource._dirty = true;
  }

  function Ticker(): React.ReactNode {
    useTick((ticker) => {
      const deltaMS = ticker.deltaMS;
      const deltaSeconds = deltaMS * 0.001;
      const app = appRef.current?.getApplication();
      if (!app) return;

      if (!fogDebugLoggedRef.current && fogRT !== Texture.EMPTY) {
        const renderer: any = app.renderer;
        console.log(
          '[FogRT debug]',
          'screen', renderer.screen?.width, renderer.screen?.height, 
          'canvas', renderer.view?.canvas?.width, renderer.view?.canvas?.height,
          'fogRT logical', fogRT.width, fogRT.height,
          'fogRT pixels', fogRT.source.pixelWidth, fogRT.source.pixelHeight,
        );
        fogDebugLoggedRef.current = true;
      }

      app.renderer.render({
        container: fogContainer,
        target: fogRT,
        clear: true,
      });

      if (appRef.current) {
        // Animate here
      }
      if (fogFilter) {
        fogFilter.padding = 0;
        updateShaderUniforms(fogFilter, deltaSeconds);
      }
    });

    return null;
  }

  const fogRT = useMemo(() => {
    if (typeof window === 'undefined') return Texture.EMPTY;
    if (!SIZE) return Texture.EMPTY;

    const rt = PIXI.RenderTexture.create({
      width: 800,
      height: 800,
      resolution: 1,
    });

    return rt;
  }, [SIZE]);

  const fogFilter = useMemo(() => {
    if (typeof window === 'undefined') return;
    const filter = new Filter({
      glProgram: GlProgram.from({
        vertex: defaultFilterVert,
        fragment: fogFragmentShader,
      }),
      resources: {
        fogUniforms: {
          uTime: { value: 0, type: 'f32' },
          uAlpha: { value: 1, type: 'f32' },
          uSpeed: { value: [0.2, 0.2], type: 'vec2<f32>' },
          uShift: { value: 1, type: 'f32' },
          uResolution: { value: [
            gridSquarePixelSize, 
            gridSquarePixelSize,
          ], type: 'vec2<f32>' },
        },
      },
    });

    return filter;
  }, [gridSquarePixelSize]);

  useEffect(() => {
    fogContainer.sortableChildren = false;
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 10; j++) {
        if (i % 2 === 0 && j % 2 === 0) {
          const sprite = new PIXI.Sprite(PIXI.Texture.WHITE);
          sprite.alpha = 1;
          sprite.x = j * gridSquarePixelSize;
          sprite.y = i * gridSquarePixelSize;
          sprite.width = gridSquarePixelSize;
          sprite.height = gridSquarePixelSize;
          sprite.anchor.set(0, 0);
          fogContainer.addChild(sprite);
        }
      }
    }
  }, [fogContainer]);
  
  return (
    <Application
      ref={appRef}
      width={SIZE}
      height={SIZE}
      backgroundAlpha={0.5}
      antialias={true}
      // className="absolute z-[35] pointer-events-none"
      resolution={1}
      roundPixels={true}
    >
      <Ticker />
      <pixiSprite
        ref={fogSpriteRef}
        width={SIZE}
        height={SIZE}
        texture={fogRT}
        filters={fogFilter ? [fogFilter] : []}
      />
    </Application>
  );
}
