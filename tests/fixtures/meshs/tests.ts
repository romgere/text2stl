export default {
  // "Basic" text only
  a: {
    font: 'open_sans',
    text: '123',
    size: 50,
    height: 5,
    spacing: 1
  },

  b: {
    font: 'open_sans',
    text: 'No default'
  },

  c: {
    font: 'chango',
    text: 'this is a test',
    size: 72,
    height: 15,
    spacing: 10
  },

  // "Basic" text with support
  d: {
    font: 'open_sans',
    text: '123',
    size: 50,
    height: 5,
    spacing: 1,
    type: 2,
    supportHeight: 20,
    supportPadding: { top: 10, bottom: 10, left: 10, right: 10 }
  },

  e: {
    font: 'open_sans',
    text: 'No default',
    type: 2
  },

  f: {
    font: 'chango',
    text: 'this is a test',
    size: 72,
    height: 15,
    spacing: 10,
    type: 2,
    supportHeight: 10,
    supportPadding: { top: 0, bottom: 0, left: 0, right: 0 }
  },

  // "Basic" negative text
  g: {
    font: 'open_sans',
    text: '123',
    size: 50,
    height: 5,
    spacing: 1,
    type: 3,
    supportHeight: 20,
    supportPadding: { top: 10, bottom: 10, left: 10, right: 10 }
  },

  h: {
    font: 'open_sans',
    text: 'No default',
    type: 3
  },

  i: {
    font: 'chango',
    text: 'this is a test',
    size: 72,
    height: 15,
    spacing: 10,
    type: 3,
    supportHeight: 10,
    supportPadding: { top: 0, bottom: 0, left: 0, right: 0 }
  },

  // "Basic" vertical text with support
  j: {
    font: 'open_sans',
    text: '123',
    size: 50,
    height: 5,
    spacing: 1,
    type: 4,
    supportHeight: 20,
    supportPadding: { top: 10, bottom: 10, left: 10, right: 10 }
  },

  k: {
    font: 'open_sans',
    text: 'No default',
    type: 4
  },

  l: {
    font: 'chango',
    text: 'this is a test',
    size: 72,
    height: 15,
    spacing: 10,
    type: 4,
    supportHeight: 10,
    supportPadding: { top: 0, bottom: 0, left: 0, right: 0 }
  },

  // Multi-line
  m: {
    font: 'open_sans',
    text: 'multi\nline',
  },

  n: {
    font: 'open_sans',
    text: 'multi\nline',
    vSpacing: 25
  },

  // Alignment test
  o: {
    font: 'open_sans',
    text: 'multi\nline',
    align: 'left'
  },

  p: {
    font: 'open_sans',
    text: 'multi\nline',
    align: 'right'
  },

  // Various supportPadding
  q: {
    font: 'open_sans',
    text: '123',
    type: 2,
    supportPadding: { top: 50, bottom: 5, left: 100, right: 10 }
  },

  r: {
    font: 'open_sans',
    text: '123',
    type: 3,
    supportPadding: { top: 50, bottom: 5, left: 100, right: 10 }
  },

  s: {
    font: 'open_sans',
    text: '123',
    type: 4,
    supportPadding: { top: 50, bottom: 5, left: 100, right: 10 }
  },

  t: {
    font: 'open_sans',
    text: '123',
    type: 2,
    supportPadding: { top: 5, bottom: 50, left: 10, right: 100 }
  },

  u: {
    font: 'open_sans',
    text: '123',
    type: 3,
    supportPadding: { top: 5, bottom: 50, left: 10, right: 100 }
  },

  v: {
    font: 'open_sans',
    text: '123',
    type: 4,
    supportPadding: { top: 5, bottom: 50, left: 10, right: 100 }
  },

  // Without supportBorderRadius
  w: {
    font: 'open_sans',
    text: 'No default',
    type: 2,
    supportBorderRadius: 0
  },
  
  x: {
    font: 'open_sans',
    text: 'No default',
    type: 3,
    supportBorderRadius: 0
  },

  y: {
    font: 'open_sans',
    text: 'No default',
    type: 4,
    supportBorderRadius: 0
  },
  
  // With supportBorderRadius > max possible radius
  z: {
    font: 'open_sans',
    text: 'No default',
    type: 2,
    supportBorderRadius: 100
  },
  
  _a: {
    font: 'open_sans',
    text: 'No default',
    type: 3,
    supportBorderRadius: 100
  },

  _b: {
    font: 'open_sans',
    text: 'No default',
    type: 4,
    supportBorderRadius: 100
  },

  // With hole
  _c: {
    font: 'open_sans',
    text: 'No default',
    type: 1,
    handleSettings: {
      type: 'hole',
      position: 'top',
      size: 10,      
      size2: 0,
      offsetY: -20,
      offsetX: 0
    }
  },

  _d: {
    font: 'open_sans',
    text: 'No default',
    type: 1,
    handleSettings: {
      type: 'hole',
      position: 'left',
      size: 10,
      size2: 0,
      offsetY: -20,
      offsetX: 20
    }
  },

  _e: {
    font: 'open_sans',
    text: 'No default',
    type: 2,
    handleSettings: {
      type: 'hole',
      position: 'top',
      size: 10,  
      size2: 0,    
      offsetY: -20,
      offsetX: 0
    }
  },

  _f: {
    font: 'open_sans',
    text: 'No default',
    type: 2,
    handleSettings: {
      type: 'hole',
      position: 'left',
      size: 10,
      size2: 0,
      offsetY: -20,
      offsetX: 20
    }
  },

  _g: {
    font: 'open_sans',
    text: 'No default',
    type: 3,
    handleSettings: {
      type: 'hole',
      position: 'bottom',
      size: 10,
      size2: 0,
      offsetY: -10,
      offsetX: 15,
    }
  },

  _h: {
    font: 'open_sans',
    text: 'No default',
    type: 3,
    handleSettings: {
      type: 'hole',
      position: 'left',
      size: 10,
      size2: 0,
      offsetY: -20,
      offsetX: 20
    }
  },

  _i: {
    font: 'open_sans',
    text: 'No default',
    type: 4,
    handleSettings: {
      type: 'hole',
      position: 'top',
      size: 10,
      size2: 0,      
      offsetY: -20,
      offsetX: 0
    }
  },

  _j: {
    font: 'open_sans',
    text: 'No default',
    type: 4,
    handleSettings: {
      type: 'hole',
      position: 'left',
      size: 10,      
      size2: 0,
      offsetY: -20,
      offsetX: 20
    }
  },

  // With handle
  _k: {
    font: 'open_sans',
    text: 'No default',
    type: 1,
    handleSettings: {
      type: 'handle',
      position: 'top',
      size: 5,      
      size2: 2,
      offsetY: -20,
      offsetX: 0
    }
  },

  _l: {
    font: 'open_sans',
    text: 'No default',
    type: 1,
    handleSettings: {
      type: 'handle',
      position: 'left',
      size: 10,      
      size2: 5,
      offsetY: -20,
      offsetX: 20
    }
  },

  _m: {
    font: 'open_sans',
    text: 'No default',
    type: 2,
    handleSettings: {
      type: 'handle',
      position: 'top',
      size: 5,      
      size2: 2,
      offsetY: -20,
      offsetX: 0
    }
  },

  _n: {
    font: 'open_sans',
    text: 'No default',
    type: 2,
    handleSettings: {
      type: 'handle',
      position: 'left',
      size: 10,      
      size2: 5,
      offsetY: -20,
      offsetX: 20
    }
  },

  _o: {
    font: 'open_sans',
    text: 'No default',
    type: 3,
    handleSettings: {
      type: 'handle',
      position: 'bottom',
      size: 5,      
      size2: 2,
      offsetY: -10,
      offsetX: 15,
    }
  },

  _p: {
    font: 'open_sans',
    text: 'No default',
    type: 3,
    handleSettings: {
      type: 'handle',
      position: 'left',
      size: 10,      
      size2: 5,
      offsetY: -20,
      offsetX: 20
    }
  },

  _q: {
    font: 'open_sans',
    text: 'No default',
    type: 4,
    handleSettings: {
      type: 'handle',
      position: 'top',
      size: 5,      
      size2: 2,
      offsetY: -20,
      offsetX: 0
    }
  },

  _r: {
    font: 'open_sans',
    text: 'No default',
    type: 4,
    handleSettings: {
      type: 'handle',
      position: 'left',
      size: 10,      
      size2: 5,
      offsetY: -20,
      offsetX: 20
    }
  }
}
