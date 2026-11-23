// DOSA animation definitions. Each returns a Lottie composition for a colour mode.
// Timing follows docs/MOTION_GUIDELINES.md: status moments 0.8–1.6 s and then hold;
// loops only for genuinely ongoing states (preparing, loading) and calm idle (empty states).
import { anim, composition, layer, shape, sparkPath, ms, EASE } from './lottie-kit.mjs';
import { ROLES } from '../../brand-assets/scripts/svg-kit.mjs';

const { group, ellipse, rect, path, fill, stroke, trim } = shape;

/** Check-mark path (for a circle of radius r) that draws in with trim. */
const checkPath = (r) => path([[-r * 0.42, r * 0.02], [-r * 0.12, r * 0.32], [r * 0.43, -r * 0.28]]);
/** Halo + ground shared by most animations. */
const halo = (c, color = c.halo, rx = 92, ry = 66, y = 92) => layer('halo', [group([ellipse(rx * 2, ry * 2), fill(color, 100)])], { position: [120, y] });
const ground = (c, w = 120, y = 156) => layer('ground', [group([ellipse(w, 10), fill(c.shadow, 70)])], { position: [120, y] });
/** Twinkling spark (scale + rotate), optional delay. */
const spark = (c, x, y, r, startF, color = c.violet, loop = null) => {
  const keys = loop
    ? anim([0, [80, 80], EASE.inOut], [loop / 2, [112, 112], EASE.inOut], [loop, [80, 80]])
    : anim([startF, [0, 0], EASE.emphasized], [startF + ms(320), [118, 118], EASE.standard], [startF + ms(480), [100, 100]]);
  return layer('spark', [group([sparkPath(r), fill(color)])], { position: [x, y], scale: keys, rotation: loop ? anim([0, 0, EASE.inOut], [loop / 2, 12, EASE.inOut], [loop, 0]) : anim([startF, -30, EASE.emphasized], [startF + ms(480), 0]) });
};

export const ANIMATIONS = [
  {
    file: 'order-received', loop: false, poster: 'end',
    title: 'Order received', usage: 'New order arrives (admin toast, staff queue, customer confirmation).',
    build: (c) => composition({
      name: 'order-received', frames: ms(1400),
      layers: [
        spark(c, 168, 44, 8, ms(700)),
        layer('badge', [group([path([[0, -6], [0, 2]]), stroke(c.paper, 3)]), group([ellipse(3.5, 3.5, [0, 7]), fill(c.paper)]), group([ellipse(26, 26), fill(c.sky), stroke(c.ink, 2)])],
          { position: [150, 52], scale: anim([ms(520), [0, 0], EASE.emphasized], [ms(820), [115, 115], EASE.standard], [ms(980), [100, 100]]) }),
        layer('ticket', [
          group([rect(56, 6, 3, [0, -26]), fill(c.sky)]),
          group([path([[-20, -10], [20, -10]]), stroke(c.muted, 1.5)]),
          group([path([[-20, -1], [14, -1]]), stroke(c.muted, 1.5)]),
          group([path([[-20, 8], [20, 8]]), stroke(c.muted, 1.5)]),
          group([path([[-20, 17], [6, 17]]), stroke(c.muted, 1.5)]),
          group([rect(70, 84, 6), fill(c.paper), stroke(c.ink, 2)]),
        ], { position: anim([0, [120, -60], EASE.emphasized], [ms(620), [120, 92]]), rotation: anim([0, -8, EASE.emphasized], [ms(620), 0]) }),
        ground(c, 100), halo(c),
      ],
    }),
  },
  {
    file: 'order-accepted', loop: false, poster: 'end',
    title: 'Order accepted', usage: 'Staff accepts an order; customer sees confirmation.',
    build: (c) => composition({
      name: 'order-accepted', frames: ms(1200),
      layers: [
        spark(c, 160, 48, 7, ms(720)),
        layer('check', [group([checkPath(30), stroke(c.paper, 6), trim(0, anim([ms(380), 0, EASE.standard], [ms(720), 100]))])], { position: [120, 92] }),
        layer('disc', [group([ellipse(68, 68), fill(c.violet)])], { position: [120, 92], scale: anim([ms(200), [0, 0], EASE.emphasized], [ms(520), [100, 100]]) }),
        layer('ring', [group([ellipse(68, 68), stroke(c.ink, 2), trim(0, anim([0, 0, EASE.standard], [ms(420), 100]))])], { position: [120, 92], rotation: -90 }),
        layer('pulse', [group([ellipse(68, 68), stroke(c.violet, 2)])], { position: [120, 92], scale: anim([ms(520), [100, 100], EASE.decelerate], [ms(1100), [160, 160]]), opacity: anim([0, 0, 'hold'], [ms(520), 60, EASE.decelerate], [ms(1100), 0]) }),
        ground(c, 70, 146), halo(c, c.violetSoft),
      ],
    }),
  },
  {
    file: 'food-preparation', loop: true, poster: 'mid',
    title: 'Food preparation', usage: 'Order is being prepared (loops while status = preparing).',
    build: (c) => {
      const L = ms(2000);
      const steam = (x, delay, h = 26) => layer('steam', [group([
        path([[0, 0], [0, -h * 0.5], [0, -h]], { i: [[0, 0], [-4, 4], [4, 4]], o: [[4, -4], [4, -4], [0, 0]] }),
        stroke(c.muted, 1.75),
      ])], {
        position: anim([delay, [x, 112], EASE.linear], [delay + ms(1400), [x, 92]]),
        opacity: anim([delay, 0, EASE.standard], [delay + ms(400), 90, EASE.standard], [delay + ms(1400), 0]),
      });
      return composition({
        name: 'food-preparation', frames: L,
        layers: [
          spark(c, 186, 40, 7, 0, c.violet, L),
          steam(104, 0), steam(118, ms(500), 30), steam(132, ms(1000)),
          layer('ladle', [group([ellipse(24, 12), fill(c.paper), stroke(c.muted, 2)]), group([path([[4, -4], [52, -60]]), stroke(c.ink, 2)])],
            { position: anim([0, [146, 116], EASE.inOut], [L / 2, [138, 120], EASE.inOut], [L, [146, 116]]), rotation: anim([0, 0, EASE.inOut], [L / 2, -6, EASE.inOut], [L, 0]) }),
          layer('dosa', [group([ellipse(108, 24), fill(c.saffron), stroke(c.ink, 2)]), group([path([[-36, 0], [36, -2]], { o: [[20, -6], [0, 0]], i: [[0, 0], [-16, -6]] }), stroke(c.mode === 'dark' ? '#6E3A00' : '#A96B00', 1.5)])],
            { position: [112, 124], scale: anim([0, [92, 92], EASE.inOut], [L / 2, [100, 100], EASE.inOut], [L, [92, 92]]) }),
          layer('griddle', [group([ellipse(152, 34), fill(c.paper), stroke(c.ink, 2)]), group([ellipse(172, 44), fill(c.cloud), stroke(c.ink, 2)]), group([rect(22, 6, 3, [100, 0]), fill(c.ink)])], { position: [116, 126] }),
          ground(c, 172, 156), halo(c),
        ],
      });
    },
  },
  {
    file: 'order-ready', loop: false, poster: 'end',
    title: 'Order ready', usage: 'Order is ready to serve / collect.',
    build: (c) => {
      const burst = (angle, color, d = 58) => {
        const rad = (angle * Math.PI) / 180;
        return layer('burst', [group([sparkPath(5), fill(color)])], {
          position: anim([ms(520), [120, 92], EASE.decelerate], [ms(1000), [120 + Math.cos(rad) * d, 92 + Math.sin(rad) * d]]),
          scale: anim([ms(520), [0, 0], EASE.emphasized], [ms(760), [100, 100], EASE.standard], [ms(1150), [60, 60]]),
          opacity: anim([ms(900), 100, EASE.standard], [ms(1200), 0]),
        });
      };
      return composition({
        name: 'order-ready', frames: ms(1400),
        layers: [
          burst(-150, c.saffron), burst(-30, c.coral), burst(30, c.mint, 52), burst(160, c.violet, 50),
          layer('check', [group([checkPath(36), stroke(c.paper, 7), trim(0, anim([ms(360), 0, EASE.standard], [ms(700), 100]))])], { position: [120, 92] }),
          layer('disc', [group([ellipse(76, 76), fill(c.mint), stroke(c.ink, 2)])], { position: [120, 92], scale: anim([0, [0, 0], EASE.emphasized], [ms(360), [110, 110], EASE.standard], [ms(520), [100, 100]]) }),
          spark(c, 72, 48, 8, ms(820)),
          ground(c, 80, 150), halo(c, c.mintSoft),
        ],
      });
    },
  },
  {
    file: 'payment-success', loop: false, poster: 'end',
    title: 'Payment success', usage: 'Payment confirmed at checkout (customer) or POS (staff).',
    build: (c) => composition({
      name: 'payment-success', frames: ms(1600),
      layers: [
        spark(c, 74, 42, 7, ms(1000)),
        layer('check', [group([checkPath(18), stroke(c.paper, 4), trim(0, anim([ms(820), 0, EASE.standard], [ms(1080), 100]))])], { position: [166, 122] }),
        layer('badge', [group([ellipse(40, 40), fill(c.mint), stroke(c.ink, 2)])], { position: [166, 122], scale: anim([ms(640), [0, 0], EASE.emphasized], [ms(900), [112, 112], EASE.standard], [ms(1040), [100, 100]]) }),
        layer('ring', [group([ellipse(40, 40), stroke(c.mint, 2)])], { position: [166, 122], scale: anim([ms(900), [100, 100], EASE.decelerate], [ms(1500), [190, 190]]), opacity: anim([0, 0, 'hold'], [ms(900), 80, EASE.decelerate], [ms(1500), 0]) }),
        layer('card', [
          group([path([[-30, 20], [30, 20]]), stroke(c.paper, 2.5)]),
          group([rect(20, 14, 3, [-36, -16]), fill(c.saffron), stroke(c.ink, 1.5)]),
          group([rect(112, 72, 10), fill(c.violet), stroke(c.ink, 2)]),
        ], { position: anim([0, [40, 94], EASE.emphasized], [ms(600), [112, 94]]), rotation: anim([0, -14, EASE.emphasized], [ms(600), 0]), opacity: anim([0, 0, EASE.standard], [ms(200), 100]) }),
        ground(c, 120, 152), halo(c, c.mintSoft),
      ],
    }),
  },
  {
    file: 'empty-orders', loop: true, poster: 'start',
    title: 'Empty order list', usage: 'No orders yet. Calm idle loop; never draws attention.',
    build: (c) => {
      const L = ms(3600);
      return composition({
        name: 'empty-orders', frames: L,
        layers: [
          spark(c, 108, 60, 8, 0, c.violet, L),
          layer('cutlery', [
            group([path([[-80, -28], [-80, 16]]), stroke(c.ink, 2)]),
            group([path([[-86, -28], [-86, -16], [-80, -10], [-74, -16], [-74, -28]]), stroke(c.ink, 2)]),
            group([path([[80, -28], [80, 16]], {}), stroke(c.ink, 2)]),
            group([path([[80, -28], [80, -6]], { o: [[8, 0], [0, 0]], i: [[0, 0], [8, 0]] }), stroke(c.ink, 2)]),
          ], { position: [120, 120] }),
          layer('plate', [group([ellipse(90, 24, [0, -1]), fill(c.cloud), stroke(c.muted, 1.5)]), group([ellipse(124, 36), fill(c.paper), stroke(c.ink, 2)])],
            { position: anim([0, [120, 120], EASE.inOut], [L / 2, [120, 116], EASE.inOut], [L, [120, 120]]) }),
          layer('shadow', [group([ellipse(140, 10), fill(c.shadow, 70)])], { position: [120, 150], scale: anim([0, [100, 100], EASE.inOut], [L / 2, [92, 92], EASE.inOut], [L, [100, 100]]) }),
          halo(c, c.halo, 96, 66, 96),
        ],
      });
    },
  },
  {
    file: 'empty-reservations', loop: true, poster: 'start',
    title: 'Empty reservation list', usage: 'No bookings for the selected date. Calm idle loop.',
    build: (c) => {
      const L = ms(3600);
      const float = anim([0, [120, 98], EASE.inOut], [L / 2, [120, 94], EASE.inOut], [L, [120, 98]]);
      return composition({
        name: 'empty-reservations', frames: L,
        layers: [
          spark(c, 120, 104, 8, 0, c.violet, L),
          layer('calendar', [
            group([path([[-30, -60], [-30, -44]]), stroke(c.ink, 3)]),
            group([path([[30, -60], [30, -44]]), stroke(c.ink, 3)]),
            group([path([[-24, 20], [24, 20]]), stroke(c.muted, 2), trim(0, 100)]),
            group([path([[-56, -26], [56, -26]]), stroke(c.ink, 2)]),
            group([rect(112, 104, 12, [0, 0]), fill(c.paper), stroke(c.ink, 2)]),
          ], { position: float }),
          layer('shadow', [group([ellipse(140, 10), fill(c.shadow, 70)])], { position: [120, 156] }),
          halo(c, c.halo, 96, 66, 96),
        ],
      });
    },
  },
  {
    file: 'loading-processing', loop: true, poster: 'start',
    title: 'Loading / processing', usage: 'Indeterminate work longer than ~1 s (sync, report generation). Use skeletons for content loading.',
    build: (c) => {
      const L = ms(1200);
      return composition({
        name: 'loading-processing', frames: L,
        layers: [
          layer('spark', [group([sparkPath(12), fill(c.violet)])], { position: [120, 90], scale: anim([0, [88, 88], EASE.inOut], [L / 2, [104, 104], EASE.inOut], [L, [88, 88]]) }),
          layer('arc', [group([ellipse(64, 64), stroke(c.violet, 4), trim(0, 28, anim([0, 0, EASE.linear], [L, 360]))])], { position: [120, 90], rotation: -90 }),
          layer('track', [group([ellipse(64, 64), stroke(c.cloud, 4)])], { position: [120, 90] }),
        ],
      });
    },
  },
  {
    file: 'sync-success', loop: false, poster: 'end',
    title: 'Successful synchronization', usage: 'Offline queue flushed / data synced.',
    build: (c) => {
      const arrows = [
        group([path([[-22, -6], [6, -22]], { o: [[4, -14], [0, 0]], i: [[0, 0], [-14, -2]] }), stroke(c.sky, 4)]),
        group([path([[0, -28], [8, -22], [0, -15]]), stroke(c.sky, 4)]),
        group([path([[22, 6], [-6, 22]], { o: [[-4, 14], [0, 0]], i: [[0, 0], [14, 2]] }), stroke(c.sky, 4)]),
        group([path([[0, 28], [-8, 22], [0, 15]]), stroke(c.sky, 4)]),
      ];
      return composition({
        name: 'sync-success', frames: ms(1500),
        layers: [
          spark(c, 162, 50, 7, ms(1100)),
          layer('check', [group([checkPath(30), stroke(c.paper, 6), trim(0, anim([ms(860), 0, EASE.standard], [ms(1160), 100]))])], { position: [120, 92] }),
          layer('disc', [group([ellipse(68, 68), fill(c.mint), stroke(c.ink, 2)])], { position: [120, 92], scale: anim([ms(700), [0, 0], EASE.emphasized], [ms(980), [108, 108], EASE.standard], [ms(1100), [100, 100]]) }),
          layer('arrows', arrows, { position: [120, 92], rotation: anim([0, 0, EASE.inOut], [ms(800), 360]), opacity: anim([ms(640), 100, EASE.standard], [ms(800), 0]), scale: anim([ms(560), [100, 100], EASE.accelerate], [ms(800), [70, 70]]) }),
          ground(c, 70, 146), halo(c, c.skySoft),
        ],
      });
    },
  },
  {
    file: 'restaurant-onboarding', loop: false, poster: 'end',
    title: 'Restaurant onboarding', usage: 'Welcome / first-run setup hero. Plays once.',
    build: (c) => {
      const stripe = (i) => group([path([[0, 0], [20, 0], [20, 14], [0, 14]], { closed: true, i: [[0, 0], [0, 0], [0, 0], [0, 0]], o: [[0, 0], [0, 0], [0, 0], [0, 0]] }), fill(i % 2 ? c.paper : c.saffron), stroke(c.ink, 2)], { position: [-60 + i * 20, 0] });
      return composition({
        name: 'restaurant-onboarding', frames: ms(2200),
        layers: [
          spark(c, 196, 40, 8, ms(1500)),
          layer('sign', [group([sparkPath(5), fill(c.saffron)]), group([rect(48, 16, 8), fill(c.ink)])], { position: [120, 34], scale: anim([ms(1150), [0, 0], EASE.emphasized], [ms(1450), [100, 100]]) }),
          layer('awning', [...[0, 1, 2, 3, 4, 5].map(stripe), group([path([[-64, 0], [-56, -16], [56, -16], [64, 0]], { closed: true }), fill(c.coral), stroke(c.ink, 2)])],
            { position: anim([ms(700), [120, 20], EASE.emphasized], [ms(1150), [120, 56]]), opacity: anim([ms(700), 0, EASE.standard], [ms(800), 100]) }),
          layer('door', [group([ellipse(5, 5, [10, 2]), fill(c.ink)]), group([rect(32, 60, 4), fill(c.violetSoft), stroke(c.ink, 2)])], { position: [146, 158], scale: anim([ms(520), [100, 0], EASE.emphasized], [ms(820), [100, 100]]), anchor: [0, 30] }),
          layer('window', [group([path([[0, -15], [0, 15]]), stroke(c.ink, 1.5)]), group([path([[-20, 0], [20, 0]]), stroke(c.ink, 1.5)]), group([rect(40, 30, 4), fill(c.skySoft), stroke(c.ink, 2)])], { position: [96, 107], opacity: anim([ms(560), 0, EASE.standard], [ms(800), 100]) }),
          layer('building', [group([rect(112, 92, 4), fill(c.paper), stroke(c.ink, 2)])], { position: [120, 158], anchor: [0, 46], scale: anim([ms(100), [100, 0], EASE.emphasized], [ms(620), [100, 100]]) }),
          layer('street', [group([path([[-80, 0], [80, 0]]), stroke(c.ink, 2), trim(0, anim([0, 0, EASE.standard], [ms(400), 100]))])], { position: [120, 158] }),
          ground(c, 168, 158), halo(c),
        ],
      });
    },
  },
];

export const MODES = { light: { ...ROLES.light, mode: 'light' }, dark: { ...ROLES.dark, mode: 'dark' } };
