import 'package:lucide_icons_flutter/lucide_icons.dart';
import 'package:material_ui/material_ui.dart';

import '../theme/dosa_theme.dart';
import '../tokens/dosa_tokens.g.dart';

/// Order lifecycle states shared by every DOSA app (COMPONENT_GUIDELINES §5.5).
enum DosaOrderStatus {
  received('Received', LucideIcons.inbox),
  accepted('Accepted', LucideIcons.circleCheck),
  preparing('Preparing', LucideIcons.chefHat),
  ready('Ready', LucideIcons.bellRing),
  served('Served', LucideIcons.utensils),
  cancelled('Cancelled', LucideIcons.circleX),
  delayed('Delayed', LucideIcons.timer);

  const DosaOrderStatus(this.label, this.icon);

  /// Default English label. Apps pass a localised label to [DosaOrderStatusBadge] when needed.
  final String label;
  final IconData icon;

  /// The theme's colour for this state (`color.order.*`).
  Color color(DosaThemeTokens t) => switch (this) {
        received => t.orderReceived,
        accepted => t.orderAccepted,
        preparing => t.orderPreparing,
        ready => t.orderReady,
        served => t.orderServed,
        cancelled => t.orderCancelled,
        delayed => t.orderDelayed,
      };
}

/// Status badge for an order: icon + text + state colour, never colour alone.
/// Height 24 on mobile, radius full, `label.sm` (COMPONENT_GUIDELINES §5.4).
class DosaOrderStatusBadge extends StatelessWidget {
  const DosaOrderStatusBadge(this.status, {super.key, this.label});

  final DosaOrderStatus status;

  /// Overrides the default label, e.g. "Delayed 6 min" or a translation.
  final String? label;

  @override
  Widget build(BuildContext context) {
    final t = DosaTheme.of(context);
    final tone = status.color(t);
    return Semantics(
      container: true,
      label: 'Order status: ${label ?? status.label}',
      excludeSemantics: true,
      child: Container(
        height: DosaSpace.s6,
        padding: const EdgeInsets.symmetric(horizontal: DosaSpace.s2),
        decoration: BoxDecoration(
          color: tone.withValues(alpha: 0.12),
          borderRadius: BorderRadius.circular(DosaRadius.full),
          border: Border.all(color: tone.withValues(alpha: 0.32), width: DosaBorderWidth.hairline),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(status.icon, size: DosaSize.iconXs, color: tone),
            const SizedBox(width: DosaSpace.s1),
            Text(label ?? status.label, style: DosaTypeScale.labelSm.copyWith(color: tone)),
          ],
        ),
      ),
    );
  }
}
