import 'package:dosa_ui/dosa_ui.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';
import 'package:material_ui/material_ui.dart';

/// Foundations check for the customer app: warm theme, full ambient mesh, premium glass,
/// Hospitality accents, a food-card layout and an order status badge. Not a product screen.
class FoundationsScreen extends StatelessWidget {
  const FoundationsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final t = DosaTheme.of(context);
    final highlight = FilledButton.styleFrom(backgroundColor: t.actionHighlightBg, foregroundColor: t.actionHighlightFg);
    return Scaffold(
      body: DosaMeshBackground(
        child: SafeArea(
          child: ListView(
            padding: const EdgeInsets.fromLTRB(DosaSpace.s4, DosaSpace.s4, DosaSpace.s4, DosaSpace.s10),
            children: [
              Row(
                children: [
                  const DosaLogo(height: DosaSpace.s10),
                  const Spacer(),
                  IconButton(tooltip: 'Cart', onPressed: () {}, icon: const Icon(LucideIcons.shoppingBag)),
                ],
              ),
              const SizedBox(height: DosaSpace.s6),
              DosaGlass(
                variant: DosaGlassVariant.premium,
                padding: const EdgeInsets.all(DosaSpace.s6),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('DESIGN SYSTEM CHECK', style: DosaTypeScale.metaOverline.copyWith(color: t.textSecondary)),
                    const SizedBox(height: DosaSpace.s2),
                    Text('Good evening', style: DosaTypeScale.displayMd.copyWith(color: t.textPrimary)),
                    const SizedBox(height: DosaSpace.s2),
                    Text(
                      'Customer theme, premium glass over the warm mesh. This is not a product screen.',
                      style: DosaTypeScale.bodyLg.copyWith(color: t.textSecondary),
                    ),
                    const SizedBox(height: DosaSpace.s4),
                    Container(
                      height: DosaSpace.s1,
                      width: DosaSpace.s16,
                      decoration: BoxDecoration(
                        gradient: t.gradientHospitality,
                        borderRadius: BorderRadius.circular(DosaRadius.full),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: DosaSpace.s8),
              Text('Food card layout', style: DosaTypeScale.headingH3.copyWith(color: t.textPrimary)),
              const SizedBox(height: DosaSpace.s3),
              Card(
                clipBehavior: Clip.antiAlias,
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(DosaRadius.lg)),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    ColoredBox(
                      color: t.surfaceSecondary,
                      child: const AspectRatio(
                        aspectRatio: 4 / 3,
                        // Stand-in for food photography, which is not part of this phase.
                        child: Center(child: DosaIllustration('dining-table', width: 240)),
                      ),
                    ),
                    Padding(
                      padding: const EdgeInsets.all(DosaSpace.s4),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text('Masala dosa', style: DosaTypeScale.headingH4.copyWith(color: t.textPrimary)),
                          const SizedBox(height: DosaSpace.s1),
                          Text(
                            'Crisp rice crepe, spiced potato, coconut chutney, sambar.',
                            maxLines: 2,
                            overflow: TextOverflow.ellipsis,
                            style: DosaTypeScale.bodySm.copyWith(color: t.textSecondary),
                          ),
                          const SizedBox(height: DosaSpace.s3),
                          Row(
                            children: [
                              Icon(LucideIcons.leaf, size: DosaSize.iconSm, color: t.statusSuccessFg),
                              const SizedBox(width: DosaSpace.s1),
                              Text('Veg', style: DosaTypeScale.labelSm.copyWith(color: t.statusSuccessFg)),
                              const Spacer(),
                              Text('₹ 180.00', style: DosaTypeScale.numericMd.copyWith(color: t.textPrimary)),
                              const SizedBox(width: DosaSpace.s3),
                              FilledButton(style: highlight, onPressed: () {}, child: const Text('Add')),
                            ],
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: DosaSpace.s8),
              Text('Your order', style: DosaTypeScale.headingH3.copyWith(color: t.textPrimary)),
              const SizedBox(height: DosaSpace.s3),
              Card(
                child: Padding(
                  padding: const EdgeInsets.all(DosaSpace.s4),
                  child: Column(
                    children: [
                      const DosaAnimatedIllustration(DosaAnimation.orderReady, width: 180, height: 135, semanticLabel: 'Order ready'),
                      const SizedBox(height: DosaSpace.s2),
                      const DosaOrderStatusBadge(DosaOrderStatus.ready),
                      const SizedBox(height: DosaSpace.s2),
                      Text('Order #1042 is ready at the counter.',
                          textAlign: TextAlign.center, style: DosaTypeScale.bodyLg.copyWith(color: t.textPrimary)),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: DosaSpace.s6),
              FilledButton(
                style: highlight.copyWith(minimumSize: const WidgetStatePropertyAll(Size.fromHeight(DosaSize.controlXl))),
                onPressed: () {},
                child: const Text('Add to order'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
