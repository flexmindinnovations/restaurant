import 'package:dosa_ui/dosa_ui.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';
import 'package:material_ui/material_ui.dart';

/// Foundations check for the staff app: DOSA theme, type, controls, order status, glass and
/// motion rendered with real widgets. It verifies the wiring and is not a product screen.
class FoundationsScreen extends StatelessWidget {
  const FoundationsScreen({super.key, required this.kitchenMode, required this.onKitchenModeChanged});

  final bool kitchenMode;
  final ValueChanged<bool> onKitchenModeChanged;

  @override
  Widget build(BuildContext context) {
    final t = DosaTheme.of(context);
    return Scaffold(
      extendBodyBehindAppBar: true,
      appBar: PreferredSize(
        preferredSize: const Size.fromHeight(DosaSize.layoutTopBar),
        child: DosaGlass(
          variant: DosaGlassVariant.subtle,
          borderRadius: BorderRadius.zero,
          padding: EdgeInsets.zero,
          child: AppBar(
            backgroundColor: Colors.transparent,
            title: const Text('DOSA Staff'),
            actions: [
              IconButton(
                tooltip: kitchenMode ? 'Switch to light mode' : 'Switch to kitchen mode',
                icon: Icon(kitchenMode ? LucideIcons.sun : LucideIcons.moon),
                onPressed: () => onKitchenModeChanged(!kitchenMode),
              ),
            ],
          ),
        ),
      ),
      body: DosaMeshBackground(
        quiet: true,
        child: SafeArea(
          child: ListView(
            padding: const EdgeInsets.fromLTRB(DosaSpace.s4, DosaSpace.s6, DosaSpace.s4, DosaSpace.s10),
            children: [
              Text('DESIGN SYSTEM CHECK', style: DosaTypeScale.metaOverline.copyWith(color: t.textSecondary)),
              const SizedBox(height: DosaSpace.s1),
              Text('Staff foundations', style: DosaTypeScale.headingH1.copyWith(color: t.textPrimary)),
              const SizedBox(height: DosaSpace.s2),
              Text(
                'DOSA tokens through ThemeData. Toggle kitchen mode in the top bar. This is not a product screen.',
                style: DosaTypeScale.bodyLg.copyWith(color: t.textSecondary),
              ),
              const SizedBox(height: DosaSpace.s8),
              const _Section(title: 'Order status', child: _OrderStates()),
              _Section(
                title: 'Kitchen ticket',
                child: Card(
                  clipBehavior: Clip.antiAlias,
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: [
                      Container(height: DosaSpace.s1 + DosaSpace.s0Half, color: t.orderPreparing),
                      Padding(
                        padding: const EdgeInsets.all(DosaSpace.s4),
                        child: Row(
                          children: [
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text('#1042 · Table 6', style: DosaTypeScale.headingH4.copyWith(color: t.textPrimary)),
                                  const SizedBox(height: DosaSpace.s1),
                                  Text('2 × Masala dosa · 1 × Filter coffee',
                                      style: DosaTypeScale.bodyMd.copyWith(color: t.textSecondary)),
                                  const SizedBox(height: DosaSpace.s2),
                                  const DosaOrderStatusBadge(DosaOrderStatus.preparing),
                                ],
                              ),
                            ),
                            Text('08:42', style: DosaTypeScale.numericTimer.copyWith(color: t.textPrimary)),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              _Section(
                title: 'Actions',
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    FilledButton(onPressed: () {}, child: const Text('Mark ready')),
                    const SizedBox(height: DosaSpace.s3),
                    Row(
                      children: [
                        Expanded(child: FilledButton.tonal(onPressed: () {}, child: const Text('Accept'))),
                        const SizedBox(width: DosaSpace.s3),
                        Expanded(child: OutlinedButton(onPressed: () {}, child: const Text('Reassign'))),
                      ],
                    ),
                    const SizedBox(height: DosaSpace.s3),
                    SwitchListTile(
                      contentPadding: EdgeInsets.zero,
                      title: const Text('Kitchen mode'),
                      subtitle: const Text('Dark theme for the pass and night service'),
                      value: kitchenMode,
                      onChanged: onKitchenModeChanged,
                    ),
                  ],
                ),
              ),
              _Section(
                title: 'Motion',
                child: DosaGlass(
                  variant: DosaGlassVariant.standard,
                  child: Column(
                    children: [
                      const DosaAnimatedIllustration(DosaAnimation.foodPreparation, width: 200, height: 150),
                      Text('Preparing 3 orders', style: DosaTypeScale.labelLg.copyWith(color: t.textPrimary)),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _OrderStates extends StatelessWidget {
  const _OrderStates();

  @override
  Widget build(BuildContext context) {
    return Wrap(
      spacing: DosaSpace.s2,
      runSpacing: DosaSpace.s2,
      children: [
        for (final s in DosaOrderStatus.values)
          DosaOrderStatusBadge(s, label: s == DosaOrderStatus.delayed ? 'Delayed 6 min' : null),
      ],
    );
  }
}

class _Section extends StatelessWidget {
  const _Section({required this.title, required this.child});

  final String title;
  final Widget child;

  @override
  Widget build(BuildContext context) {
    final t = DosaTheme.of(context);
    return Padding(
      padding: const EdgeInsets.only(bottom: DosaSpace.s8),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Text(title, style: DosaTypeScale.headingH3.copyWith(color: t.textPrimary)),
          const SizedBox(height: DosaSpace.s3),
          child,
        ],
      ),
    );
  }
}
