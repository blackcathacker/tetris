const PIECE_LOCATIONS = {
  I: [
    {
      row: 0,
      col: 0,
    },
    {
      row: 1,
      col: 0,
    },
    {
      row: 2,
      col: 0,
    },
    {
      row: 3,
      col: 0,
    },
  ],
  O: [
    {
      row: 0,
      col: 0,
    },
    {
      row: 1,
      col: 0,
    },
    {
      row: 0,
      col: 1,
    },
    {
      row: 1,
      col: 1,
    },
  ],
  T: [
    {
      row: 0,
      col: 0,
    },
    {
      row: 0,
      col: 1,
    },
    {
      row: 0,
      col: 2,
    },
    {
      row: 1,
      col: 1,
    },
  ],
  J: [
    {
      row: 0,
      col: 0,
    },
    {
      row: 0,
      col: 1,
    },
    {
      row: 1,
      col: 1,
    },
    {
      row: 2,
      col: 1,
    },
  ],
  L: [
    {
      row: 0,
      col: 0,
    },
    {
      row: 0,
      col: 1,
    },
    {
      row: 1,
      col: 0,
    },
    {
      row: 2,
      col: 0,
    },
  ],
  S: [
    {
      row: 0,
      col: 0,
    },
    {
      row: 1,
      col: 1,
    },
    {
      row: 0,
      col: 1,
    },
    {
      row: 1,
      col: 2,
    },
  ],
  Z: [
    {
      row: 1,
      col: 0,
    },
    {
      row: 0,
      col: 1,
    },
    {
      row: 1,
      col: 1,
    },
    {
      row: 0,
      col: 2,
    },
  ]
}
const PIECE_MASK = {  
  I: [
      [1, 1, 1, 1]
  ],
  O: [
      [1, 1],
      [1, 1]
  ],
  T: [
      [1, 1, 1],
      [0, 1, 0]
  ],
  J: [
      [1, 1, 1],
      [1, 0, 0]
  ],
  L: [
      [1, 1, 1],
      [0, 0, 1]
  ],
  S: [
      [1, 1, 0],
      [0, 1, 1]
  ],
  Z: [
      [0, 1, 1],
      [1, 1, 0]
  ]
}

const PIECE_MASK_90 = {  
    I: [
        [1], [1], [1], [1]
    ],
    O: [
        [1, 1],
        [1, 1]
    ],
    T: [
        [1, 0],
        [1, 1],
        [1, 0]
    ],
    J: [
        [1, 1],
        [0, 1],
        [0, 1]
    ],
    L: [
        [1, 1],
        [1, 0],
        [1, 0]
    ],
    S: [        [0, 1],
    [1, 1],
    [1, 0]

    ],
    Z: [
        [1, 0],
        [1, 1],
        [0, 1]

    ]
  }
  const PIECE_MASK_180 = {  
    I: [
        [1, 1, 1, 1]
    ],
    O: [
        [1, 1],
        [1, 1]
    ],
    T: [
        [0, 1, 0],
        [1, 1, 1]
    ],
    J: [
        [1, 0, 0]
        [1, 1, 1]
    ],
    L: [
        [0, 0, 1],
        [1, 1, 1]
    ],
    S: [
        [0, 1, 1],
        [1, 1, 0]
    ],
    Z: [
        [1, 1, 0],
        [0, 1, 1]
    ]
  }

  const PIECE_MASK_270 = {  
    I: [
        [1], [1], [1], [1]
    ],
    O: [
        [1, 1],
        [1, 1]
    ],
    T: [
        [0, 1],
        [1, 1],
        [0, 1]
    ],
    J: [
        [1, 1],
        [1, 0],
        [1, 0]
    ],
    L: [
        [1, 1],
        [0, 1],
        [0, 1]
    ],
    S: [
        [0, 1],
        [1, 1],
        [1, 0]
    ],
    Z: [
        [1, 0],
        [1, 1],
        [0, 1]
    ]
  }
  

const { flatMap } =  require('lodash')

function transformMask(mask) {
  return flatMap(mask, (r, row) => {
    return r.map((c, col) => {
        if (c) {
            return {
                row,
                col
            }
        }
    })
  }).filter(l => l)
}

module.exports = {
  PIECE_LOCATIONS,
  PIECE_MASK,
  PIECE_MASK_90,
  PIECE_MASK_180,
  PIECE_MASK_270,
  transformMask
}