// Scene definitions for the DOSA illustration library. Each scene is a function of the kit.
// Composition rules (see docs/ILLUSTRATION_GUIDELINES.md): 240×180 artboard, 16px safe area,
// halo blob behind, ground shadow at y≈158, 2px ink outline, flat brand fills, exactly one
// violet spark as the signature accent, light from the top-left.

export const SCENES = [
  {
    file: 'restaurant', title: 'Restaurant', group: 'feature',
    desc: 'A DOSA restaurant storefront with a striped saffron awning, a lit window and an open door.',
    draw: (k) => {
      const { c } = k;
      const stripes = [0, 1, 2, 3, 4, 5].map((i) => k.path(`M${60 + i * 20} 56h20v14a10 10 0 0 1-20 0Z`, i % 2 ? c.paper : c.saffron)).join('');
      return [
        k.halo(), k.ground(120, 158, 84, 6),
        k.rect(64, 66, 112, 92, 4, c.paper),
        k.path('M56 56l8-16h112l8 16Z', c.coral),
        stripes,
        k.rect(76, 92, 40, 30, 4, c.skySoft), k.lineSeg(96, 92, 96, 122, { 'stroke-width': 1.5 }), k.lineSeg(76, 107, 116, 107, { 'stroke-width': 1.5 }),
        k.rect(130, 98, 32, 60, 4, c.violetSoft), k.dot(155, 130, 2.5, c.ink),
        k.rect(96, 26, 48, 16, 8, c.ink), k.spark(120, 34, 5.5, c.saffron),
        k.lineSeg(40, 158, 200, 158),
        k.path('M184 158v-22a8 8 0 0 1 16 0v22', c.mintSoft), k.lineSeg(192, 158, 192, 146),
        k.spark(200, 40, 7),
      ];
    },
  },
  {
    file: 'kitchen-workflow', title: 'Kitchen workflow', group: 'feature',
    desc: 'Three order tickets on a kitchen rail moving left to right, ending at a completed check.',
    draw: (k) => {
      const { c } = k;
      return [
        k.halo(), k.ground(120, 158, 92, 5),
        k.rect(24, 40, 192, 8, 4, c.cloud),
        k.ticket(32, 52, 44, 66, c.sky, 4),
        k.ticket(98, 52, 44, 66, c.saffron, 4),
        k.ticket(164, 52, 44, 66, c.mint, 4),
        k.arrow(80, 140, 94, 140), k.arrow(146, 140, 160, 140),
        k.check(186, 140, 12),
        k.dot(54, 44, 3, c.ink), k.dot(120, 44, 3, c.ink), k.dot(186, 44, 3, c.ink),
        k.spark(120, 24, 7),
      ];
    },
  },
  {
    file: 'food-preparation', title: 'Food preparation', group: 'feature',
    desc: 'A dosa being spread on a hot griddle with a ladle, steam rising.',
    draw: (k) => {
      const { c } = k;
      return [
        k.halo(), k.ground(116, 158, 86, 6),
        k.ellipse(116, 128, 86, 22, c.ink, { fill: c.cloud }),
        k.ellipse(116, 124, 76, 17, c.paper),
        k.ellipse(112, 124, 54, 12, c.saffron),
        k.path('M74 124c10-6 30-8 46-6s26 4 30 6', 'none', { stroke: '#A96B00', 'stroke-width': 1.5 }),
        k.path('M86 128c12 3 34 4 50 0', 'none', { stroke: '#A96B00', 'stroke-width': 1.5 }),
        k.path('M202 120h20', 'none', { 'stroke-width': 6, stroke: c.ink }),
        k.path('M150 112c14-24 32-44 48-60', 'none'),
        k.ellipse(146, 116, 12, 6, c.muted, { fill: c.paper }),
        k.steam(100, 104, 26, 12),
        k.spark(186, 40, 7),
      ];
    },
  },
  {
    file: 'dining-table', title: 'Dining table', group: 'feature',
    desc: 'A set dining table with a plated dosa, chutney bowls, a glass and two chairs.',
    draw: (k) => {
      const { c } = k;
      return [
        k.halo(), k.ground(120, 158, 92, 6),
        k.path('M40 158V96h14a6 6 0 0 1 6 6v56M200 158V96h-14a6 6 0 0 0-6 6v56', c.violetSoft),
        k.rect(52, 104, 136, 10, 4, c.paper),
        k.lineSeg(68, 114, 64, 158), k.lineSeg(172, 114, 176, 158),
        k.plate(110, 98, 40, 10),
        k.dosaRoll(80, 82, 62, 14),
        k.bowl(162, 100, 9, c.mint),
        k.path('M176 100V78h12v22a6 2 0 0 1-12 0Z', c.skySoft),
        k.lineSeg(178, 86, 186, 86, { stroke: c.muted, 'stroke-width': 1.5 }),
        k.spark(120, 40, 7),
      ];
    },
  },
  {
    file: 'order-processing', title: 'Order processing', group: 'feature',
    desc: 'An order ticket next to a three-step progress track: received, preparing, ready.',
    draw: (k) => {
      const { c } = k;
      return [
        k.halo(), k.ground(120, 158, 80, 5),
        k.ticket(36, 36, 70, 100, c.violet, 6),
        k.lineSeg(150, 52, 150, 128, { stroke: c.cloud, 'stroke-width': 6 }),
        k.lineSeg(150, 52, 150, 92, { stroke: c.mint, 'stroke-width': 6 }),
        k.circle(150, 52, 9, c.sky), k.circle(150, 92, 9, c.saffron), k.circle(150, 128, 9, c.paper),
        k.rect(168, 47, 40, 10, 5, c.skySoft, { stroke: 'none' }), k.rect(168, 87, 34, 10, 5, c.saffronSoft, { stroke: 'none' }), k.rect(168, 123, 28, 10, 5, c.cloud, { stroke: 'none' }),
        k.spark(196, 28, 7),
      ];
    },
  },
  {
    file: 'online-ordering', title: 'Online ordering', group: 'feature',
    desc: 'A phone showing menu cards with an add-to-cart badge.',
    draw: (k) => {
      const { c } = k;
      return [
        k.halo(), k.ground(120, 160, 60, 5),
        k.phone(86, 20, 68, 136, c.cloud),
        k.rect(98, 40, 44, 34, 6, c.paper, { 'stroke-width': 1.5 }), k.dosaRoll(104, 50, 32, 10),
        k.rect(98, 82, 44, 22, 6, c.paper, { 'stroke-width': 1.5 }), k.circle(110, 93, 6, c.coralSoft, { 'stroke-width': 1.5 }), k.lineSeg(120, 90, 136, 90, { stroke: c.muted, 'stroke-width': 1.5 }), k.lineSeg(120, 97, 130, 97, { stroke: c.muted, 'stroke-width': 1.5 }),
        k.rect(98, 112, 44, 22, 6, c.saffron, { 'stroke-width': 1.5 }), k.lineSeg(110, 123, 130, 123, { 'stroke-width': 2 }),
        k.circle(162, 46, 14, c.coral), k.path('M156 46h12M162 40v12', 'none', { stroke: c.paper, 'stroke-width': 2.5 }),
        k.bowl(52, 138, 14, c.saffronSoft),
        k.spark(186, 108, 7),
      ];
    },
  },
  {
    file: 'payment-checkout', title: 'Payment and checkout', group: 'feature',
    desc: 'A payment card tapped on a terminal that prints a receipt.',
    draw: (k) => {
      const { c } = k;
      return [
        k.halo(), k.ground(120, 158, 80, 6),
        k.rect(112, 56, 64, 100, 10, c.paper),
        k.rect(122, 68, 44, 26, 4, c.mintSoft, { 'stroke-width': 1.5 }),
        k.lineSeg(132, 81, 156, 81, { stroke: c.mint, 'stroke-width': 3 }),
        ...[0, 1, 2].flatMap((r) => [0, 1, 2].map((col) => k.dot(132 + col * 12, 108 + r * 12, 3, c.muted))),
        k.path('M124 56V36h40v20', c.paper), k.lineSeg(132, 44, 156, 44, { stroke: c.muted, 'stroke-width': 1.5 }),
        k.g([k.rect(40, 70, 72, 46, 8, c.violet), k.rect(50, 82, 14, 10, 2, c.saffron, { 'stroke-width': 1.5 }), k.lineSeg(50, 104, 92, 104, { stroke: c.paper, 'stroke-width': 2 })], { transform: 'rotate(-12 76 93)' }),
        k.path('M182 82a10 10 0 0 1 0 14M188 76a18 18 0 0 1 0 26', 'none', { stroke: c.muted, 'stroke-width': 1.75 }),
        k.spark(196, 40, 7),
      ];
    },
  },
  {
    file: 'delivery-pickup', title: 'Delivery and pickup', group: 'feature',
    desc: 'A takeaway bag travelling along a dotted route from the restaurant to a map pin.',
    draw: (k) => {
      const { c } = k;
      return [
        k.halo(), k.ground(120, 158, 92, 5),
        k.path('M40 150c30-50 70 10 100-30s40-40 60-56', 'none', { stroke: c.muted, 'stroke-width': 1.75, 'stroke-dasharray': '1 6' }),
        k.rect(26, 120, 36, 32, 4, c.paper), k.path('M22 120l6-10h32l6 10Z', c.saffron),
        k.pin(198, 50, 12, c.coral),
        k.path('M98 84h44l-4 62h-36Z', c.saffronSoft),
        k.path('M108 84v-6a12 12 0 0 1 24 0v6', 'none'),
        k.spark(120, 112, 7),
      ];
    },
  },
  {
    file: 'analytics-intelligence', title: 'Analytics and intelligence', group: 'feature',
    desc: 'A frosted panel with a rising revenue line, bars and the DOSA spark marking an insight.',
    draw: (k) => {
      const { c } = k;
      return [
        k.halo(), k.ground(120, 158, 88, 5),
        k.rect(32, 30, 176, 120, 14, c.paper),
        k.rect(44, 42, 50, 8, 4, c.cloud, { stroke: 'none' }),
        ...[[52, 30], [72, 46], [92, 38], [112, 58], [132, 52]].map(([x, hgt]) => k.rect(x, 136 - hgt, 12, hgt, 3, x === 112 ? c.saffron : c.violetSoft, { 'stroke-width': 1.5 })),
        k.path('M48 112c18-6 26-22 44-24s22 8 40-6 30-20 44-34s16-8 20-10', 'none', { stroke: c.violet, 'stroke-width': 3 }),
        k.circle(176, 50, 5, c.paper, { stroke: c.violet, 'stroke-width': 2.5 }),
        k.lineSeg(44, 136, 196, 136, { stroke: c.muted, 'stroke-width': 1.5 }),
        k.spark(214, 26, 8),
      ];
    },
  },
  {
    file: 'inventory', title: 'Inventory', group: 'feature',
    desc: 'Pantry shelves with jars, a sack and crates, and a checklist clipboard.',
    draw: (k) => {
      const { c } = k;
      return [
        k.halo(), k.ground(120, 158, 92, 5),
        k.rect(36, 36, 112, 122, 6, c.paper),
        k.lineSeg(36, 78, 148, 78), k.lineSeg(36, 118, 148, 118),
        k.rect(46, 50, 20, 28, 4, c.saffronSoft), k.rect(44, 46, 24, 6, 2, c.saffron),
        k.rect(74, 56, 20, 22, 4, c.mintSoft), k.rect(72, 52, 24, 6, 2, c.mint),
        k.rect(102, 48, 20, 30, 4, c.coralSoft), k.rect(100, 44, 24, 6, 2, c.coral),
        k.path('M46 118c-2-16 4-26 14-28h10c10 2 16 12 14 28Z', c.cloud), k.path('M56 90l4-6 6 6', 'none'),
        k.rect(96, 94, 40, 24, 3, c.saffron), k.lineSeg(96, 104, 136, 104, { 'stroke-width': 1.5 }),
        k.rect(150, 70, 52, 72, 6, c.paper, { transform: 'rotate(6 176 106)' }),
        k.g([k.rect(166, 64, 20, 10, 3, c.ink), ...[0, 1, 2].map((i) => k.path(`M160 ${88 + i * 16}l4 4 7-8`, 'none', { stroke: i < 2 ? c.mint : c.cloud, 'stroke-width': 2.5 })), ...[0, 1, 2].map((i) => k.lineSeg(176, 88 + i * 16, 192, 88 + i * 16, { stroke: c.muted, 'stroke-width': 1.5 }))], { transform: 'rotate(6 176 106)' }),
        k.spark(200, 40, 7),
      ];
    },
  },
  {
    file: 'reservations', title: 'Reservations', group: 'feature',
    desc: 'A calendar with an evening booking highlighted and a small clock.',
    draw: (k) => {
      const { c } = k;
      const cells = [];
      for (let r = 0; r < 3; r++) for (let col = 0; col < 5; col++) {
        const x = 58 + col * 22; const y = 82 + r * 20; const on = r === 1 && col === 3;
        cells.push(k.rect(x, y, 16, 14, 4, on ? c.violet : c.cloud, { stroke: on ? c.ink : 'none', 'stroke-width': 1.5 }));
      }
      return [
        k.halo(), k.ground(120, 158, 84, 6),
        k.rect(46, 44, 132, 112, 12, c.paper),
        k.path('M46 72V56a12 12 0 0 1 12-12h108a12 12 0 0 1 12 12v16Z', c.coral),
        k.lineSeg(76, 36, 76, 52, { 'stroke-width': 3 }), k.lineSeg(148, 36, 148, 52, { 'stroke-width': 3 }),
        ...cells,
        k.circle(184, 132, 20, c.saffronSoft), k.path('M184 120v12l8 6', 'none'),
        k.spark(206, 40, 7),
      ];
    },
  },
  // ---------- Empty states (smaller subject, calmer, larger halo) ----------
  {
    file: 'empty-orders', title: 'No orders yet', group: 'empty',
    desc: 'An empty plate with cutlery waiting for the first order.',
    draw: (k) => {
      const { c } = k;
      return [
        k.halo(120, 96, 96, 66), k.ground(120, 150, 70, 5),
        k.plate(120, 120, 62, 18),
        k.path('M40 92v44M34 92v12a6 6 0 0 0 12 0V92', 'none'),
        k.path('M200 92c8 0 8 22 0 22v22', 'none'),
        k.dot(120, 82, 3, c.muted), k.dot(132, 72, 2, c.muted),
        k.spark(108, 60, 8),
      ];
    },
  },
  {
    file: 'empty-reservations', title: 'No reservations', group: 'empty',
    desc: 'A calm, empty calendar page.',
    draw: (k) => {
      const { c } = k;
      return [
        k.halo(120, 96, 96, 66), k.ground(120, 156, 70, 5),
        k.rect(64, 46, 112, 104, 12, c.paper),
        k.path('M64 72V58a12 12 0 0 1 12-12h88a12 12 0 0 1 12 12v14Z', c.cloud),
        k.lineSeg(90, 38, 90, 54, { 'stroke-width': 3 }), k.lineSeg(150, 38, 150, 54, { 'stroke-width': 3 }),
        k.path('M96 112h48', 'none', { stroke: c.muted, 'stroke-dasharray': '1 6' }),
        k.spark(120, 96, 8),
      ];
    },
  },
  {
    file: 'empty-search', title: 'Nothing found', group: 'empty',
    desc: 'A magnifier over a blank menu card.',
    draw: (k) => {
      const { c } = k;
      return [
        k.halo(120, 96, 96, 66), k.ground(120, 156, 70, 5),
        k.rect(58, 40, 88, 112, 10, c.paper),
        ...[0, 1, 2, 3].map((i) => k.lineSeg(72, 62 + i * 18, 132 - (i % 2) * 20, 62 + i * 18, { stroke: c.cloud, 'stroke-width': 4 })),
        k.circle(150, 104, 26, c.violetSoft, { 'fill-opacity': 0.55 }),
        k.lineSeg(169, 123, 190, 144, { 'stroke-width': 6 }),
        k.spark(150, 104, 7),
      ];
    },
  },
  {
    file: 'empty-notifications', title: 'All caught up', group: 'empty',
    desc: 'A covered serving cloche with nothing waiting under it.',
    draw: (k) => {
      const { c } = k;
      return [
        k.halo(120, 96, 96, 66), k.ground(120, 150, 74, 5),
        k.path('M70 132a50 50 0 0 1 100 0Z', c.saffron),
        k.rect(60, 132, 120, 10, 5, c.paper),
        k.circle(120, 76, 6, c.paper),
        k.path('M96 104a28 28 0 0 1 20-18', 'none', { stroke: c.paper, 'stroke-width': 3 }),
        k.spark(170, 60, 8),
      ];
    },
  },
  {
    file: 'empty-menu', title: 'No menu items', group: 'empty',
    desc: 'An open, blank menu waiting for its first dish.',
    draw: (k) => {
      const { c } = k;
      return [
        k.halo(120, 96, 96, 66), k.ground(120, 154, 84, 5),
        k.path('M120 54c-16-10-40-12-60-8v96c20-4 44-2 60 8Z', c.paper),
        k.path('M120 54c16-10 40-12 60-8v96c-20-4-44-2-60 8Z', c.paper),
        k.lineSeg(120, 54, 120, 150),
        k.rect(136, 88, 28, 28, 14, c.saffronSoft, { 'stroke-dasharray': '3 5' }), k.path('M150 96v12M144 102h12', 'none'),
        k.spark(88, 92, 8),
      ];
    },
  },
  {
    file: 'offline', title: 'You are offline', group: 'empty',
    desc: 'A cloud with a broken connection line. Orders are queued until the connection returns.',
    draw: (k) => {
      const { c } = k;
      return [
        k.halo(120, 96, 96, 66), k.ground(120, 154, 64, 5),
        k.path('M82 120a22 22 0 0 1 4-43 30 30 0 0 1 57-8 24 24 0 0 1 15 51Z', c.paper),
        k.lineSeg(96, 140, 112, 128, { stroke: c.muted }), k.lineSeg(128, 116, 144, 104, { stroke: c.muted }),
        k.lineSeg(86, 66, 158, 140, { stroke: c.coral, 'stroke-width': 3 }),
        k.spark(176, 52, 7),
      ];
    },
  },
  // ---------- Success & confirmation ----------
  {
    file: 'success-confirmation', title: 'Success', group: 'success',
    desc: 'A mint check mark surrounded by celebratory sparks.',
    draw: (k) => {
      const { c } = k;
      return [
        k.halo(120, 92, 88, 66, c.mintSoft), k.ground(120, 150, 48, 5),
        k.check(120, 90, 36),
        k.spark(70, 50, 8), k.spark(172, 58, 6, c.saffron), k.spark(168, 132, 5, c.coral), k.dot(68, 124, 4, c.saffron), k.dot(184, 92, 3, c.mint),
      ];
    },
  },
  {
    file: 'payment-success', title: 'Payment successful', group: 'success',
    desc: 'A payment card with a mint confirmation check.',
    draw: (k) => {
      const { c } = k;
      return [
        k.halo(120, 92, 92, 66, c.mintSoft), k.ground(120, 152, 70, 5),
        k.rect(56, 58, 112, 72, 10, c.violet), k.rect(70, 74, 20, 14, 3, c.saffron, { 'stroke-width': 1.5 }),
        k.lineSeg(70, 112, 130, 112, { stroke: c.paper, 'stroke-width': 2.5 }),
        k.check(166, 124, 20),
        k.spark(70, 38, 7),
      ];
    },
  },
  {
    file: 'order-ready', title: 'Order ready', group: 'success',
    desc: 'A serving cloche lifted off a plated dosa, with a ready check.',
    draw: (k) => {
      const { c } = k;
      return [
        k.halo(120, 96, 96, 66, c.mintSoft), k.ground(120, 152, 80, 5),
        k.plate(116, 134, 66, 14),
        k.dosaRoll(78, 118, 76, 16),
        k.path('M60 92a58 46 0 0 1 116-14l6 4H54Z', c.cloud, { transform: 'rotate(-16 118 82)' }),
        k.circle(110, 46, 5, c.paper, { transform: 'rotate(-16 118 82)' }),
        k.check(188, 122, 16),
        k.steam(116, 112, 14, 10),
      ];
    },
  },
  // ---------- Errors & warnings ----------
  {
    file: 'error-generic', title: 'Something went wrong', group: 'error',
    desc: 'A coral alert disc beside a tipped-over chutney bowl.',
    draw: (k) => {
      const { c } = k;
      return [
        k.halo(120, 94, 92, 66, c.coralSoft), k.ground(120, 152, 76, 5),
        k.circle(102, 86, 34, c.coral), k.lineSeg(102, 68, 102, 90, { stroke: c.paper, 'stroke-width': 5 }), k.dot(102, 104, 3.5, c.paper),
        k.g([k.bowl(166, 134, 16, c.mint)], { transform: 'rotate(-28 166 134)' }),
        k.path('M178 146c6 2 14 2 20 0', 'none', { stroke: c.mint, 'stroke-width': 3 }),
        k.spark(160, 52, 7),
      ];
    },
  },
  {
    file: 'warning', title: 'Attention needed', group: 'error',
    desc: 'A saffron warning triangle with a timer.',
    draw: (k) => {
      const { c } = k;
      return [
        k.halo(120, 94, 92, 66, c.saffronSoft), k.ground(120, 152, 70, 5),
        k.path('M110 44a12 12 0 0 1 20 0l48 86a12 12 0 0 1-10 18H72a12 12 0 0 1-10-18Z', c.saffron),
        k.lineSeg(120, 78, 120, 110, { 'stroke-width': 5 }), k.dot(120, 126, 3.5, c.ink),
        k.circle(186, 70, 16, c.paper), k.path('M186 62v8l5 4', 'none'),
        k.spark(56, 56, 7),
      ];
    },
  },
  {
    file: 'not-found', title: 'Page not found', group: 'error',
    desc: 'A map pin with a question mark beside a dotted path that ends nowhere.',
    draw: (k) => {
      const { c } = k;
      return [
        k.halo(120, 94, 92, 66), k.ground(120, 152, 60, 5),
        k.path('M36 140c20-20 40 10 60-10', 'none', { stroke: c.muted, 'stroke-width': 1.75, 'stroke-dasharray': '1 6' }),
        k.path('M134 150c-14-18-34-36-34-60a34 34 0 0 1 68 0c0 24-20 42-34 60Z', c.violetSoft),
        k.path('M124 82a10 10 0 1 1 14 9c-3 1-4 3-4 6v3', 'none', { 'stroke-width': 3 }), k.dot(134, 110, 2.5, c.ink),
        k.spark(186, 46, 7),
      ];
    },
  },
];
