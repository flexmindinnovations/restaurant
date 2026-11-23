import 'package:flutter_svg/flutter_svg.dart';
import 'package:material_ui/material_ui.dart';

import '../theme/dosa_theme.dart';

/// Which DOSA brand mark to show (packages/brand-assets/brand).
enum DosaLogoKind { symbol, wordmark, lockup }

/// DOSA logo from the shared brand assets. Picks the reversed artwork on dark themes.
/// Respect the minimums in BRAND_GUIDELINES §3: symbol ≥ 24px, lock-up ≥ 88px wide.
class DosaLogo extends StatelessWidget {
  const DosaLogo({super.key, this.kind = DosaLogoKind.lockup, this.height = 32, this.semanticLabel = 'DOSA'});

  final DosaLogoKind kind;
  final double height;

  /// Accessible name; pass null when the logo is decorative next to visible text.
  final String? semanticLabel;

  @override
  Widget build(BuildContext context) {
    final reversed = DosaTheme.of(context).isDark ? '-reversed' : '';
    return SvgPicture.asset(
      'assets/brand/dosa-${kind.name}$reversed.svg',
      package: 'dosa_ui',
      height: height,
      semanticsLabel: semanticLabel,
      excludeFromSemantics: semanticLabel == null,
    );
  }
}
