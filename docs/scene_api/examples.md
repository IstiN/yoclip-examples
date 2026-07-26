# Examples

## Hello world

```js
// scenes/hello.scene.js
scene = {
  id: 'hello',
  duration: 90,
  render: function (frame) {
    var opacity = easeInOut(frame, 0, 1, 30);
    return {
      type: 'stack',
      fit: 'expand',
      children: [
        {
          type: 'text',
          text: 'Hello, yoclip',
          alignment: 'center',
          opacity: opacity,
          style: {
            fontSize: 96,
            fontFamily: 'Geneva',
            color: '#ffffff',
          },
        },
      ],
    };
  },
};
```

## Card with gradient

```js
render: function (frame) {
  return {
    type: 'stack',
    fit: 'expand',
    children: [
      {
        type: 'container',
        width: 500,
        height: 280,
        alignment: 'center',
        borderRadius: 24,
        gradient: {
          begin: 'topLeft',
          end: 'bottomRight',
          colors: ['#8C5CF6', '#4D7EF2'],
        },
        child: {
          type: 'text',
          text: 'Pro tip',
          alignment: 'center',
          style: { fontSize: 48, color: '#ffffff' },
        },
      },
    ],
  };
}
```

## Row of images

```js
render: function (frame) {
  return {
    type: 'row',
    gap: 24,
    mainAxisAlignment: 'center',
    crossAxisAlignment: 'center',
    children: [
      { type: 'image', source: 'external:logo', width: 120, height: 120 },
      { type: 'image', source: 'external:photo', width: 120, height: 120 },
    ],
  };
}
```

## Typewriter text

Assuming `typewriter` is available from your `lib/animation.js`:

```js
render: function (frame) {
  return {
    type: 'text',
    text: typewriter('Your video, scene by scene.', frame, 15, 30),
    alignment: 'center',
    style: { fontSize: 64, color: '#ffffff' },
  };
}
```

## Branching for portrait variant

```js
render: function (frame) {
  var isPortrait = yoclipFormat.orientation === 'portrait';
  return {
    type: 'stack',
    fit: 'expand',
    children: [
      {
        type: 'text',
        text: 'Title',
        alignment: 'center',
        offsetY: isPortrait ? -200 : -100,
        style: { fontSize: isPortrait ? 72 : 96, color: '#ffffff' },
      },
    ],
  };
}
```
