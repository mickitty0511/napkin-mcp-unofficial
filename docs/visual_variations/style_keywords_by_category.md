# Style Keywords by Category

Use these English keywords to hint style selection. If you provide a style by name, use the exact English name and map it to the `style_id` below. If you omit `style_id`, the server auto-selects a style based on content/context.

```yaml
language: en
notes:
  - Prefer English keywords and style names.
  - When specifying a style explicitly, send style_id from the catalog.
  - If not specified, the server will auto-select a style.
categories:
  formal:
    english_keywords:
      - professional
      - business
      - report
      - meeting
      - minutes
      - plan
      - strategy
      - roadmap
      - project
      - status
      - okr
      - kpi
    preferred_style:
      name: Subtle Accent
      id: CSQQ4VB1DGPPRTB7D1T0
    styles:
      - name: Elegant Outline
        id: CSQQ4VB1DGPP4V31CDNJTVKFBXK6JV3C
        description: A refined black outline for professional clarity.
      - name: Subtle Accent
        id: CSQQ4VB1DGPPRTB7D1T0
        description: A light touch of color for professional documents.
      - name: Monochrome Pro
        id: CSQQ4VB1DGPQ6TBECXP6ABB3DXP6YWG
        description: A single-color approach for focused presentations.
      - name: Corporate Clean
        id: CSQQ4VB1DGPPTVVEDXHPGWKFDNJJTSKCC5T0
        description: A professional flat style for business diagrams.

  monochrome:
    english_keywords:
      - flowchart
      - architecture
      - diagram
      - uml
      - sequence
      - erd
      - network
      - monochrome
    preferred_style:
      name: Minimal Contrast
      id: DNQPWVV3D1S6YVB55NK6RRBM
    styles:
      - name: Minimal Contrast
        id: DNQPWVV3D1S6YVB55NK6RRBM
        description: A clean monochrome style for focused work.
      - name: Silver Beam
        id: CXS62Y9DCSQP6XBK
        description: A spotlight of gray scale ease with striking focus.

  hand_drawn:
    english_keywords:
      - brainstorm
      - sketch
      - idea
      - creative
      - prototype
      - wireframe
      - whiteboard
    preferred_style:
      name: Sketch Notes
      id: D1GPWS1DDHMPWSBK
    styles:
      - name: Artistic Flair
        id: D1GPWS1DCDQPRVVJCSTPR
        description: A splash of hand-drawn color for creative thinking.
      - name: Sketch Notes
        id: D1GPWS1DDHMPWSBK
        description: A hand-drawn style for free-flowing ideas.

  casual:
    english_keywords:
      - casual
      - playful
      - notes
      - todo
      - daily
      - journal
    preferred_style:
      name: Lively Layers
      id: CDGQ6XB1DGPPCTBCDHJP8
    styles:
      - name: Carefree Mist
        id: CDGQ6XB1DGPQ6VV6EG
        description: A wisp of calm tones for playful tasks.
      - name: Lively Layers
        id: CDGQ6XB1DGPPCTBCDHJP8
        description: A breeze of soft color for bright ideas.

  colorful:
    english_keywords:
      - colorful
      - vibrant
      - marketing
      - campaign
      - branding
      - promo
      - infographic
    preferred_style:
      name: Radiant Blocks
      id: CDQPRVVJCSTPRBB6D5P6RSB4
    styles:
      - name: Vibrant Strokes
        id: CDQPRVVJCSTPRBBCD5Q6AWR
        description: A flow of vivid lines for bold notes.
      - name: Glowful Breeze
        id: CDQPRVVJCSTPRBBKDXK78
        description: A swirl of cheerful color for laid-back planning.
      - name: Bold Canvas
        id: CDQPRVVJCSTPRBB6DHGQ8
        description: A vivid field of shapes for lively notes.
      - name: Radiant Blocks
        id: CDQPRVVJCSTPRBB6D5P6RSB4
        description: A bright spread of solid color for tasks.
      - name: Pragmatic Shades
        id: CDQPRVVJCSTPRBB7E9GP8TB5DST0
        description: A palette of blended hues for bold ideas.
```
